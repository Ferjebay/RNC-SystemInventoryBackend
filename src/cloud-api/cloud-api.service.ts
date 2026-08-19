import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { SaveCredentialsDto } from './dto/save-credentials.dto';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Canal oficial de WhatsApp (Cloud API de Meta).
 *
 * Habla directo con graph.facebook.com con las credenciales de cada empresa. La
 * diferencia grande con el canal no oficial es que acá no se puede escribir
 * libremente: un mensaje que el cliente no pidió tiene que ir con una plantilla
 * aprobada por Meta, y el PDF viaja como header de esa plantilla.
 */
@Injectable()
export class CloudApiService {

  private readonly logger = new Logger('CloudApiService');

  constructor(
    @InjectRepository( Company )
    private readonly companyRepository: Repository<Company>
  ){}

  private get graphVersion() {
    return process.env.META_GRAPH_VERSION || 'v22.0';
  }

  private async getCompany( companyId: string ): Promise<Company> {
    // Sin este control, un `id: undefined` se cae del where y TypeORM devuelve
    // la primera empresa de la tabla: las credenciales de otro.
    if ( !companyId )
      throw new BadRequestException('Falta la empresa: no se puede resolver el canal de WhatsApp.');

    // El token va con `select: false` en la entidad para que no se escape en las
    // consultas del resto de la app; acá sí se necesita, así que se pide aparte.
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .addSelect('company.wa_cloud_access_token')
      .where('company.id = :companyId', { companyId })
      .getOne();

    if ( !company ) throw new BadRequestException('Empresa no encontrada');

    return company;
  }

  /** Traduce el error de Meta a algo que se pueda leer en pantalla. */
  private metaErrorMessage( error: any ): string {
    const e = error?.response?.data?.error;

    if ( !e ) return error?.message ?? 'Error desconocido';

    const detalle =
      e.error_user_msg ||
      e.error_data?.details ||
      ( e.error_user_title && e.error_user_title !== e.message ? e.error_user_title : '' );

    if ( detalle ) return e.message ? `${ e.message } — ${ detalle }` : detalle;

    return e.message ?? 'Error de Meta';
  }

  private normalize( number: string ): string {
    return String( number ?? '' ).replace(/\D/g, '');
  }

  // ── Configuración ─────────────────────────────────────────────────────────

  /** Estado del canal para el panel. El access token nunca se devuelve. */
  async getConfig( companyId: string ) {
    const c = await this.getCompany( companyId );

    return {
      wa_provider:      c.wa_provider ?? 'baileys',
      phoneNumberId:    c.wa_cloud_phone_number_id ?? null,
      wabaId:           c.wa_cloud_waba_id ?? null,
      templateFactura:  c.wa_cloud_template_factura ?? null,
      templateProforma: c.wa_cloud_template_proforma ?? null,
      templateIdioma:   c.wa_cloud_template_idioma ?? 'es',
      conectado:        !!( c.wa_cloud_phone_number_id && c.wa_cloud_access_token ),
      // Las empresas anteriores a esta pantalla tienen la columna en null.
      whatsapp_activo:  c.whatsapp_activo !== false,
      numero_whatsApp:  c.numero_whatsApp ?? null
    };
  }

  async saveCredentials( companyId: string, dto: SaveCredentialsDto ) {
    const cambios: Partial<Company> = {};

    if ( dto.phoneNumberId    !== undefined ) cambios.wa_cloud_phone_number_id  = dto.phoneNumberId;
    if ( dto.wabaId           !== undefined ) cambios.wa_cloud_waba_id          = dto.wabaId;
    if ( dto.accessToken      !== undefined ) cambios.wa_cloud_access_token     = dto.accessToken;
    if ( dto.wa_provider      !== undefined ) cambios.wa_provider               = dto.wa_provider;
    if ( dto.templateFactura  !== undefined ) cambios.wa_cloud_template_factura = dto.templateFactura;
    if ( dto.templateProforma !== undefined ) cambios.wa_cloud_template_proforma = dto.templateProforma;
    if ( dto.templateIdioma   !== undefined ) cambios.wa_cloud_template_idioma  = dto.templateIdioma;

    if ( Object.keys( cambios ).length )
      await this.companyRepository.update( companyId, cambios );

    this.logger.log(`Credenciales Cloud API actualizadas (empresa ${ companyId })`);

    // Se valida contra Meta lo recién guardado para que el panel diga si el
    // número y el token responden de verdad, en vez de solo "guardado".
    return { ok: true, ...await this.verifyCredentials( companyId ) };
  }

  /** Borra las credenciales y devuelve el canal al no oficial. */
  async clearCredentials( companyId: string ) {
    await this.companyRepository.update( companyId, {
      wa_cloud_phone_number_id: null,
      wa_cloud_waba_id: null,
      wa_cloud_access_token: null,
      wa_provider: 'baileys'
    } as any );

    this.logger.log(`Credenciales Cloud API borradas (empresa ${ companyId })`);

    return { ok: true };
  }

  /**
   * Comprueba contra Meta que lo guardado sirve. No lanza: devuelve el
   * diagnóstico para pintarlo en el panel.
   */
  async verifyCredentials( companyId: string ) {
    const c = await this.getCompany( companyId );
    const token = c.wa_cloud_access_token;

    const resultado = {
      valid:     false,
      phone:     null as string | null,
      name:      null as string | null,
      quality:   null as string | null,
      wabaValid: false,
      wabaName:  null as string | null,
      error:     null as string | null
    };

    if ( !c.wa_cloud_phone_number_id || !token ) {
      resultado.error = 'Faltan credenciales (Phone Number ID o Access Token).';
      return resultado;
    }

    // 1) El número valida token + phoneNumberId.
    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/${ this.graphVersion }/${ c.wa_cloud_phone_number_id }`,
        {
          params:  { fields: 'display_phone_number,verified_name,quality_rating' },
          headers: { Authorization: `Bearer ${ token }` },
          timeout: 15000
        }
      );

      resultado.valid   = true;
      resultado.phone   = data?.display_phone_number ?? null;
      resultado.name    = data?.verified_name ?? null;
      resultado.quality = data?.quality_rating ?? null;
    } catch (error) {
      resultado.error = this.metaErrorMessage( error );
      return resultado;
    }

    // 2) El WABA es opcional acá, pero sin él no se pueden listar plantillas.
    if ( c.wa_cloud_waba_id ) {
      try {
        const { data } = await axios.get(
          `https://graph.facebook.com/${ this.graphVersion }/${ c.wa_cloud_waba_id }`,
          {
            params:  { fields: 'name' },
            headers: { Authorization: `Bearer ${ token }` },
            timeout: 15000
          }
        );

        resultado.wabaValid = true;
        resultado.wabaName  = data?.name ?? null;
      } catch (error) {
        resultado.error = `Cuenta de WhatsApp Business: ${ this.metaErrorMessage( error ) }`;
      }
    }

    return resultado;
  }

  /** Plantillas aprobadas del WABA, para elegirlas en el panel sin escribir el nombre. */
  async listTemplates( companyId: string ) {
    const c = await this.getCompany( companyId );

    if ( !c.wa_cloud_waba_id || !c.wa_cloud_access_token )
      throw new BadRequestException('Falta la cuenta de WhatsApp Business (WABA ID) o el token.');

    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/${ this.graphVersion }/${ c.wa_cloud_waba_id }/message_templates`,
        {
          params:  { fields: 'name,status,language,components', limit: 200 },
          headers: { Authorization: `Bearer ${ c.wa_cloud_access_token }` },
          timeout: 20000
        }
      );

      return ( data?.data ?? [] ).map( ( t: any ) => ({
        name:     t.name,
        status:   t.status,
        language: t.language,
        // Para avisar en el panel si la plantilla admite el PDF adjunto.
        conDocumento: ( t.components ?? [] ).some(
          ( comp: any ) => comp.type === 'HEADER' && comp.format === 'DOCUMENT'
        ),
        variables: this.contarVariables( t.components )
      }));
    } catch (error) {
      throw new BadRequestException( this.metaErrorMessage( error ) );
    }
  }

  /** Cuántos {{n}} tiene el cuerpo de la plantilla. */
  private contarVariables( components: any[] ): number {
    const body = ( components ?? [] ).find( ( c: any ) => c.type === 'BODY' );
    const encontrados = String( body?.text ?? '' ).match(/\{\{\s*\d+\s*\}\}/g);

    return encontrados ? new Set( encontrados ).size : 0;
  }

  // ── Envío ─────────────────────────────────────────────────────────────────

  private async send( company: Company, message: any ) {
    const phoneNumberId = company.wa_cloud_phone_number_id;
    const accessToken   = company.wa_cloud_access_token;

    if ( !phoneNumberId || !accessToken )
      throw new BadRequestException('La empresa no tiene WhatsApp Cloud API configurado');

    try {
      const { data } = await axios.post(
        `https://graph.facebook.com/${ this.graphVersion }/${ phoneNumberId }/messages`,
        message,
        {
          headers: { Authorization: `Bearer ${ accessToken }`, 'Content-Type': 'application/json' },
          timeout: 15000
        }
      );

      this.logger.log(`Enviado a ${ message.to } (id: ${ data?.messages?.[0]?.id })`);

      return data;
    } catch (error) {
      const metaError = error?.response?.data?.error;

      this.logger.error(
        `Error al enviar a ${ message.to }: ${ JSON.stringify( metaError ?? error?.message ) }`
      );

      let msg = this.metaErrorMessage( error );

      // El (#100) genérico suele ser un destinatario inválido, o el propio número
      // del emisor: Meta no permite que te envíes a ti mismo.
      if ( metaError?.code === 100 && /invalid parameter/i.test( msg ) )
        msg += ' — verifica que el número del cliente sea válido y distinto al de la empresa.';

      throw new BadRequestException( msg );
    }
  }

  async sendTemplate(
    company: Company,
    to: string,
    templateName: string,
    languageCode = 'es',
    components?: any[]
  ) {
    return this.send( company, {
      messaging_product: 'whatsapp',
      to: this.normalize( to ),
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        ...( components && { components } )
      }
    });
  }

  /**
   * Sube un archivo a Meta y devuelve su media id, que es lo que se manda como
   * header de la plantilla. Es la única forma de adjuntar un PDF distinto por
   * cliente en un envío que el cliente no pidió.
   */
  async uploadMedia(
    company: Company,
    buffer: Buffer,
    filename = 'documento.pdf',
    mime = 'application/pdf'
  ): Promise<string> {
    if ( !company.wa_cloud_phone_number_id || !company.wa_cloud_access_token )
      throw new BadRequestException('Falta el Phone Number ID o el Access Token');

    // FormData/Blob nativos de Node 18: axios v1 los serializa como multipart
    // sin necesidad de sumar la dependencia form-data al proyecto.
    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('file', new Blob([ buffer ], { type: mime }), filename);

    try {
      const { data } = await axios.post(
        `https://graph.facebook.com/${ this.graphVersion }/${ company.wa_cloud_phone_number_id }/media`,
        form,
        {
          headers: { Authorization: `Bearer ${ company.wa_cloud_access_token }` },
          timeout: 30000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      if ( !data?.id ) throw new BadRequestException('Meta no devolvió el id del archivo');

      return data.id;
    } catch (error) {
      throw new BadRequestException( this.metaErrorMessage( error ) );
    }
  }

  /**
   * Envía un comprobante por el canal oficial: sube el PDF, lo cuelga del header
   * de la plantilla y manda las variables del cuerpo.
   *
   * El XML no viaja por acá a propósito: Meta no acepta ese tipo de documento en
   * los mensajes, así que el XML sigue yendo por correo.
   */
  async enviarComprobante(
    companyId: string,
    datos: {
      to: string,
      pdfPath: string,
      filename?: string,
      tipo: 'factura' | 'proforma',
      variables?: string[]
    }
  ) {
    const company = await this.getCompany( companyId );

    const plantilla = datos.tipo === 'proforma'
      ? company.wa_cloud_template_proforma
      : company.wa_cloud_template_factura;

    // Los nombres de plantilla se guardan en la empresa pero todavía no hay
    // pantalla para elegirlos: eso llega con el módulo de plantillas.
    if ( !plantilla )
      throw new BadRequestException(
        `El canal oficial no tiene configurada la plantilla de ${ datos.tipo }: ` +
        `falta el módulo de plantillas. Mientras tanto usa el canal no oficial.`
      );

    if ( !datos.pdfPath || !fs.existsSync( datos.pdfPath ) )
      throw new BadRequestException(`No se encontró el PDF a enviar (${ datos.pdfPath }).`);

    const filename = datos.filename || path.basename( datos.pdfPath );
    const mediaId  = await this.uploadMedia( company, fs.readFileSync( datos.pdfPath ), filename );

    const components: any[] = [
      { type: 'header', parameters: [{ type: 'document', document: { id: mediaId, filename } }] }
    ];

    // Meta rechaza parámetros vacíos o con saltos de línea.
    const valores = ( datos.variables ?? [] )
      .map( v => String( v ?? '' ).replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim() )
      .filter( v => v !== '' );

    if ( valores.length )
      components.push({ type: 'body', parameters: valores.map( text => ({ type: 'text', text }) ) });

    return this.sendTemplate(
      company,
      datos.to,
      plantilla,
      company.wa_cloud_template_idioma || 'es',
      components
    );
  }

  /**
   * Por dónde salen los WhatsApp de esta empresa. Se consulta por id y no sobre
   * el objeto que ya venía en memoria a propósito: así el access token no tiene
   * que viajar en los `select` de media docena de consultas, y el dato no
   * depende de qué campos trajo cada consulta.
   *
   * Ante la duda devuelve el canal no oficial: es preferible salir por ahí que
   * quedarse sin enviar.
   */
  async resolverCanal( companyId: string ): Promise<{ oficial: boolean, sessionId: string | null }> {
    if ( !companyId ) return { oficial: false, sessionId: null };

    try {
      const c = await this.getCompany( companyId );

      const oficial = c?.wa_provider === 'cloud_api'
        && !!c?.wa_cloud_phone_number_id
        && !!c?.wa_cloud_access_token;

      return { oficial, sessionId: c?.numero_whatsApp ?? null };
    } catch (error) {
      this.logger.error(`No se pudo resolver el canal de la empresa ${ companyId }: ${ error?.message }`);
      return { oficial: false, sessionId: null };
    }
  }
}
