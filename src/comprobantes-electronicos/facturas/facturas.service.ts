const axios = require('axios');
const moment = require('moment');
const fs = require("fs");
const path = require('path');

import { Injectable, forwardRef, Inject, BadRequestException, Logger } from '@nestjs/common';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { Company } from 'src/companies/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CustomersService } from '../../customers/customers.service';
import { esConsumidorFinal } from '../../customers/consumidor-final';
import { InvoicesService } from 'src/invoices/invoices.service';
import { EmailService } from 'src/email/email.service';
import { MessagesWsService } from 'src/messages-ws/messages-ws.service';
import { Proforma } from '../plantillas/proforma';
import { FacturacionMsClient } from '../facturacion-ms/facturacion-ms.client';
import { CloudApiService } from 'src/cloud-api/cloud-api.service';

@Injectable()
export class FacturasService {

  private readonly logger = new Logger('FacturasService');

  constructor(
    @InjectRepository( Sucursal )
    private readonly sucursalRepository: Repository<Sucursal>,

    @Inject(forwardRef(() => InvoicesService))
    private invoiceService: InvoicesService,

    private readonly facturacionMs: FacturacionMsClient,
    private readonly customerService: CustomersService,
    private readonly emailService: EmailService,
    private readonly messageWsService: MessagesWsService,
    private readonly cloudApiService: CloudApiService,
    private readonly dataSource: DataSource
  ){}

  async descargarComprobante(
    formato: 'ride' | 'xml',
    claveAcceso: string,
    tipo: 'factura' | 'nota-credito' = 'factura',
    nameEmisor = ''
  ): Promise<Buffer> {
    // El logo solo pinta en el RIDE; el XML no lo necesita y ahorra la consulta.
    const image_url = formato === 'ride'
      ? await this.imagenEmisor( claveAcceso )
      : undefined;

    return this.facturacionMs.descargar( formato, claveAcceso, tipo, { nameEmisor, image_url });
  }

  /**
   * Logo de la empresa emisora, deducido del RUC que lleva la clave de acceso.
   *
   * Se resuelve aca y no en cada llamada porque el RIDE se descarga desde varios
   * lados (impresion, descarga masiva, adjuntos del correo) y ninguno tenia a
   * mano los datos de la empresa.
   */
  private async imagenEmisor( claveAcceso: string ): Promise<string | undefined> {

    const ruc = this.rucDeClaveAcceso( claveAcceso );

    if ( !ruc ) return undefined;

    const empresa = await this.dataSource.getRepository( Company ).findOne({
      where: { ruc },
      select: { id: true, logo: true }
    });

    return this.urlLogo( empresa?.logo );
  }

  /**
   * URL publica del logo para el RIDE.
   *
   * El PDF lo arma el microservicio con un navegador headless, asi que la imagen
   * tiene que ser una direccion que ese proceso pueda abrir: una ruta local no
   * le sirve. Sin logo o sin dominio configurado se devuelve undefined y el MS
   * usa su imagen por defecto.
   */
  private urlLogo( logo?: string ): string | undefined {

    const base = ( process.env.DOMINIO ?? process.env.HOST_API ?? '' ).replace(/\/+$/, '');

    if ( !logo ) return undefined;

    if ( !base ) {
      this.logger.warn('Sin DOMINIO ni HOST_API: el RIDE saldra sin el logo de la empresa.');
      return undefined;
    }

    return `${ base }/images/${ logo }`;
  }

  async getRide( claveAcceso ){
    return this.descargarComprobante( 'ride', claveAcceso );
  }

  async getNumComprobante( sucursal_id: any, tipo: string = 'factura' ) {
    let query;
    if ( tipo == 'factura' ) {
      query = `CASE
                  WHEN (ambiente = 'PRODUCCION') THEN sucursal.secuencia_factura_produccion
                  ELSE sucursal.secuencia_factura_pruebas
              END`
    }else{
      query = `CASE
                  WHEN (ambiente = 'PRODUCCION') THEN sucursal.secuencia_nota_credito_produccion
                  ELSE sucursal.secuencia_nota_credito_pruebas
                END`
    }

    const queryBuilder = this.sucursalRepository.createQueryBuilder('sucursal');
    const raw = await queryBuilder
      .select(["establecimiento", "punto_emision", "ambiente"])
      .addSelect(query, "secuencial")
      .where("id = :id", { id: sucursal_id })
      .getRawOne();

    if ( !raw )
      throw new BadRequestException(`No se encontró la sucursal ${ sucursal_id }.`);

    let { ambiente, establecimiento, punto_emision, secuencial } = raw;

    // Las columnas de secuencial son nullable: si la sucursal nunca configuró la
    // del tipo pedido (típico con nota de crédito en PRODUCCION, que no trae
    // default) el .toString() de abajo reventaba con un error ilegible.
    if ( secuencial === null || secuencial === undefined )
      throw new BadRequestException(
        `La sucursal no tiene configurado el secuencial de ${ tipo == 'factura' ? 'facturas' : 'notas de crédito' } ` +
        `para el ambiente de ${ ambiente }. Configúralo en Sucursales.`
      );

    establecimiento = establecimiento.toString().padStart(3, '0')
    punto_emision   = punto_emision.toString().padStart(3, '0')
    secuencial      = secuencial.toString().padStart(9, '0')

    const numComprobante = `${ establecimiento }-${ punto_emision }-${ secuencial }`

    return { numComprobante, ambiente };
  }

  async generarNotaCredito( datosFactura, entity: string = 'Invoice' ){

    const sucursal_id = datosFactura.sucursal_id?.id ?? datosFactura.sucursal_id;

    if ( !sucursal_id )
      throw new BadRequestException('La factura no tiene sucursal: no se puede anular.');

    if ( !datosFactura.clave_acceso )
      throw new BadRequestException('La factura no tiene clave de acceso: no se puede anular.');

    // Ficha tecnica, Tabla 6: en las notas de credito se debe identificar
    // obligatoriamente al receptor con RUC, cedula, pasaporte o identificacion
    // del exterior. El tipo 07 (venta a consumidor final) no esta habilitado,
    // asi que una factura emitida a consumidor final no se puede anular.
    // El cliente se lee de la base y no del cuerpo de la peticion: el front ya
    // oculta el boton, pero el endpoint es alcanzable igual.
    const customerId = datosFactura.customer_id?.id ?? datosFactura.customer_id;

    if ( customerId ) {
      const [ cliente ] = await this.customerService.findOne( customerId );

      if ( esConsumidorFinal( cliente ) )
        throw new BadRequestException(
          'Una factura emitida a CONSUMIDOR FINAL no se puede anular: ' +
          'el SRI exige identificar al receptor en la nota de credito.'
        );
    }

    const { numComprobante, ambiente } = await this.getNumComprobante( sucursal_id, 'nota_credito' );
    const secuencial = numComprobante.split('-')[2];

    // La anulación pasa por el MS y puede fallar por varios lados (la factura no
    // existe allá, el SRI la rechaza…). Se deja rastro del intento para poder
    // identificar cuál de los dos casos fue.
    this.logger.log(
      `Anulando ${ datosFactura.numero_comprobante ?? datosFactura.clave_acceso } ` +
      `con nota de crédito ${ numComprobante } (${ ambiente })`
    );

    const data = await this.facturacionMs.anularFactura({
      ambiente: ambiente == 'PRUEBA' ? 'test' : 'prod',
      emisor:   { secuencial },
      factura:  datosFactura.clave_acceso,
      motivo:   datosFactura.motivo ?? 'Anulación de factura'
    });

    this.logger.log(`Nota de crédito ${ data?.numeroComprobante }: ${ data?.estado }`);

    // El estado que devuelve el MS es el de la NOTA DE CRÉDITO. Guardarlo tal
    // cual dejaba la factura en "AUTORIZADO" — el mismo estado que antes de
    // anularla. Cuando la nota queda autorizada, la factura pasa a ANULADO; los
    // estados intermedios/de error sí se guardan para que reEmitirFactura pueda
    // reintentar el envío de la nota.
    const estadoFactura = data.estado == 'AUTORIZADO' ? 'ANULADO' : data.estado;

    if ( datosFactura.id ) {
      await this.invoiceService.update( datosFactura.id, {
        clave_acceso_nota_credito: data.claveAcceso,
        numero_comprobante_nota_credito: data.numeroComprobante,
        estadoSRI:                 estadoFactura
      } as any );
    }

    await this.aumentarSecuencialNotaCredito( sucursal_id, secuencial, ambiente );

    this.messageWsService.updateStateInvoice( datosFactura.user_id?.id ?? datosFactura.user_id );

    return { ok: true, ...data };
  }

  /** Avanza el secuencial de notas de crédito de la sucursal. */
  private async aumentarSecuencialNotaCredito( sucursal_id: any, secuencial: string, ambiente: string ) {
    const siguiente = parseInt( secuencial, 10 ) + 1;

    await this.sucursalRepository.update( sucursal_id, ambiente == 'PRUEBA'
      ? { secuencia_nota_credito_pruebas: siguiente }
      : { secuencia_nota_credito_produccion: siguiente }
    );
  }

  async generarFacturaElectronica(
    datosFactura,
    sucursal_id: any,
    entity_id: string = null,
    entity: string = 'Invoice',
    send_messages: boolean = true
  ){

    const clientFound = await this.customerService.findOne( datosFactura.customer_id );
    const { numComprobante, ambiente } = await this.getNumComprobante( sucursal_id );

    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: {
        direccion: true,
        ambiente: true,
        company_id: {
          id: true,
          ruc: true,
          razon_social: true,
          direccion_matriz: true,
          obligado_contabilidad: true,
          nombre_comercial: true,
          clave_certificado: true,
          archivo_certificado: true,
          email: true,
          telefono: true,
          logo: true,
          whatsapp_activo: true
        }
      },
      where: { id: sucursal_id }
    });

    const empresa = infoCompany[0].company_id;
    const cliente = clientFound[0];

    const payload = {
      ambiente: ambiente == 'PRUEBA' ? 'test' : 'prod',
      company: {
        archivo_certificado:   empresa.archivo_certificado,
        clave_certificado:     empresa.clave_certificado,
        ruc:                   empresa.ruc,
        direccion_matriz:      empresa.direccion_matriz,
        obligado_contabilidad: empresa.obligado_contabilidad ? 'SI' : 'NO',
        nombre_comercial:      empresa.nombre_comercial,
        razon_social:          empresa.razon_social,
        email:                 empresa.email,
        movil:                 empresa.telefono
      },
      emisor: {
        estab:              numComprobante.split('-')[0],
        ptoEmi:             numComprobante.split('-')[1],
        secuencial:         numComprobante.split('-')[2],
        dirEstablecimiento: infoCompany[0].direccion
      },
      comprador: {
        tipo_identificacion: cliente.tipo_documento,
        identificacion:      cliente.numero_documento,
        razon_social:        cliente.nombres,
        direccion:           cliente.direccion || 's/n',
        celular:             cliente.celular || '',
        // El MS valida el correo con @IsEmail y @IsOptional solo salta null o
        // undefined: mandar '' rompería la emisión de los clientes sin correo.
        correo:              cliente.email || undefined
      },
      items: this.construirItems( datosFactura ),
      pagos: [
        {
          formaPago:    datosFactura.forma_pago,
          total:        Number( datosFactura.total ),
          plazo:        datosFactura.plazo ?? 0,
          unidadTiempo: datosFactura.unidad_tiempo ?? 'DIA'
        }
      ]
    };

    // El MS exige mínimo 3 caracteres en la información adicional.
    const descripcion = ( datosFactura.descripcion ?? '' ).trim();
    if ( descripcion.length >= 3 )
      payload['informacion_adicional'] = [{ nombre: 'Descripcion', value: descripcion }];

    const data = await this.facturacionMs.emitirFactura( payload );

    if ( entity_id ) {
      await this.invoiceService.update( entity_id, {
        clave_acceso:       data.claveAcceso,
        numero_comprobante: data.numeroComprobante,
        estadoSRI:          data.estado
      } as any );
    }

    await this.aumentarSecuencial( sucursal_id, numComprobante, ambiente );

    this.messageWsService.updateStateInvoice( datosFactura.user_id );

    // Al consumidor final no se le envia nada: no hay correo ni celular reales.
    if ( send_messages && !esConsumidorFinal( cliente ) )
      await this.enviarComprobantes( data, infoCompany[0], cliente );

    return { ok: true, ...data };
  }

  private construirItems( datosFactura ) {
    return ( datosFactura.products ?? [] ).map(( item: any ) => {
      const cantidad       = Number( item.cantidad );
      const precioUnitario = Number( item.pvp );
      const totalLinea     = cantidad * precioUnitario;
      const descuento      = +Math.min(
        Math.max( Number( item.descuento ?? 0 ), 0 ),
        totalLinea
      ).toFixed(2);

      const codigo = String( item.codigoBarra ?? '' ).trim() || String( item.id ?? '' ).trim();

      // El producto guarda su propia tarifa (`impuesto`). Los registros
      // anteriores a esa columna quedan en 0 por el default, así que si el
      // producto sigue marcado con IVA se usa el porcentaje global del
      // comprobante: así no bajan a 0% mientras no se migren.
      const tipo_iva = Number( item.impuesto ) > 0
        ? Number( item.impuesto )
        : ( item.aplicaIva ? Number( datosFactura.porcentaje_iva ) : 0 );

      return {
        codigoPrincipal: codigo,
        codigoAuxiliar:  codigo,
        descripcion:     item.nombre,
        cantidad,
        precioUnitario,
        descuento,
        tipo_iva,
        ...this.construirIce( item )
      };
    });
  }

  /**
   * Campos de ICE del ítem, si el producto lo tiene configurado.
   *
   * El microservicio hace el cálculo: con `tarifa_ice` lo toma como porcentaje
   * y con `valor_ice` como monto fijo por unidad. Solo se envían cuando hay
   * valor, porque el MS valida `valor_ice` como positivo.
   */
  private construirIce( item: any ) {
    const valor = Number( item.valor_ice ?? 0 );

    if ( !item.ice || !item.tipo_ice || valor <= 0 ) return {};

    return item.ice === 'tarifa'
      ? { tipo_ice: Number( item.tipo_ice ), tarifa_ice: valor }
      : { tipo_ice: Number( item.tipo_ice ), valor_ice: valor };
  }

  /** Avanza el secuencial de la sucursal según el ambiente. */
  private async aumentarSecuencial( sucursal_id: any, numComprobante: string, ambiente: string ) {
    const secuencial = parseInt( numComprobante.split('-')[2], 10 ) + 1;

    await this.sucursalRepository.update( sucursal_id, ambiente == 'PRUEBA'
      ? { secuencia_factura_pruebas: secuencial }
      : { secuencia_factura_produccion: secuencial }
    );
  }

  private async enviarComprobantes( data: any, sucursal: any, cliente: any ) {
    try {
      const empresa = sucursal.company_id;

      const rutas = await this.facturacionMs.guardarComprobantes(
        data.claveAcceso,
        empresa.ruc,
        { nameEmisor: empresa.nombre_comercial, image_url: this.urlLogo( empresa.logo ) }
      );

      if ( !rutas ) return;

      // El correo y el celular del cliente son opcionales: se envía por el canal
      // que exista y el comprobante queda igual de emitido si no hay ninguno.
      if ( cliente.email )
        await this.emailService.sendComprobantes(
          cliente, sucursal, data.numeroComprobante, data.claveAcceso,
          { xml: rutas.xml, pdf: rutas.pdf, tipo: 'factura' }
        );

      if ( cliente.celular )
        await this.enviarWhatsapp( '/send-comprobantes', empresa, {
          cliente:         cliente.nombres,
          number:          cliente.celular,
          urlPDF:          rutas.pdf,
          urlXML:          rutas.xml,
          clave_acceso:    data.claveAcceso,
          num_comprobante: data.numeroComprobante,
          empresa:         empresa.nombre_comercial,
          telefono:        this.convertirFormatoTelefono( empresa.telefono )
        });
    } catch (error) {
      // El mensaje salía vacío cuando el error no era un Error estándar (por
      // ejemplo la respuesta de axios), y no había forma de saber si falló el
      // correo o el WhatsApp.
      const detalle =
        error?.response?.data?.message ??
        error?.message ??
        JSON.stringify( error );

      this.logger.error(
        `No se pudieron enviar los comprobantes de ${ data?.claveAcceso }: ${ detalle }`,
        error?.stack
      );
    }
  }

  /**
   * Único punto de salida hacia el micro de WhatsApp. Se centralizó para que el
   * interruptor de Mensajería se respete en las seis vías de envío: con la
   * comprobación repetida en cada una, cualquier ruta nueva se la saltaría.
   */
  private async enviarWhatsapp( ruta: string, empresa: any, payload: any ) {
    if ( empresa?.whatsapp_activo === false ) {
      this.logger.log('WhatsApp desactivado en Mensajería: no se envía el comprobante.');
      return;
    }

    const esProforma = ruta.includes('proforma');
    const { oficial, sessionId } = await this.cloudApiService.resolverCanal( empresa?.id );

    if ( oficial ) {
      // Canal oficial: no se puede escribir libre. Va con plantilla aprobada y el
      // PDF colgado del header. El XML se queda fuera porque Meta no admite ese
      // tipo de documento; sigue viajando por correo.
      await this.cloudApiService.enviarComprobante( empresa.id, {
        to:       payload.number,
        pdfPath:  payload.urlPDF,
        filename: esProforma
          ? payload.name_proforma
          : `${ payload.num_comprobante ?? 'comprobante' }.pdf`,
        tipo:      esProforma ? 'proforma' : 'factura',
        variables: esProforma
          ? [ payload.cliente, payload.empresa ]
          : [ payload.cliente, payload.empresa, payload.num_comprobante ]
      });

      return;
    }

    await this.enviarPorGateway( sessionId, payload, esProforma );
  }

  /**
   * Canal no oficial: el gateway (api-whats-app) recibe los archivos por
   * multipart y los encola. Se le suben el PDF y el XML desde el disco en vez de
   * mandarle rutas, así no hace falta que comparta sistema de archivos con este
   * backend.
   */
  private async enviarPorGateway( sessionId: string, payload: any, esProforma: boolean ) {
    // Se lanza en vez de registrar y seguir: cuando alguien pulsa "Reenviar",
    // un salto silencioso se ve igual que un envío correcto.
    if ( !sessionId )
      throw new BadRequestException(
        'La empresa no tiene una sesión de WhatsApp vinculada. Vincúlala en Ajustes › Mensajería.'
      );

    // El XML primero y el PDF después, que es el orden en que se leen.
    const archivos = [ payload.urlXML, payload.urlPDF ]
      .filter( Boolean )
      .filter( ( ruta: string ) => fs.existsSync( ruta ) );

    if ( !archivos.length )
      throw new BadRequestException('El comprobante no está en el disco del servidor: no hay nada que enviar.');

    const numero = this.convertirFormatoTelefono( payload.number );

    // 1) El texto va solo y primero. Antes se mandaba como `caption` de cada
    // archivo, así que el mismo párrafo se repetía debajo del XML y del PDF.
    //
    // fastMode=true es obligatorio para que llegue ANTES que los adjuntos: sin
    // él el gateway simula el tecleo (~50 s para este mensaje) mientras los
    // archivos salen en menos de un segundo, y el texto aparecía al final.
    await axios.post(`${ process.env.HOST_API_WHATSAPP }/api/whatsapp/send?fastMode=true`, {
      sessionId,
      number:  numero,
      message: this.mensajeComprobante( payload, esProforma, archivos )
    }, { timeout: 15000 });

    // 2) Los adjuntos, sin caption. FormData y Blob nativos de Node: axios los
    // serializa como multipart.
    const form = new FormData();
    form.append('sessionId', sessionId);
    form.append('number', numero);

    for ( const ruta of archivos )
      form.append(
        'files',
        new Blob([ fs.readFileSync( ruta ) ], { type: this.mimePorExtension( ruta ) }),
        this.nombreAdjunto( ruta, payload, esProforma )
      );

    await axios.post(`${ process.env.HOST_API_WHATSAPP }/api/whatsapp/send-media/file`, form, {
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
  }

  /**
   * Sin este tipo el Blob viaja como application/octet-stream, multer lo registra
   * así y WhatsApp muestra el adjunto como «BIN» en el móvil en vez de PDF o XML.
   */
  private mimePorExtension( ruta: string ): string {
    const extension = path.extname( ruta ).toLowerCase();

    if ( extension === '.pdf' ) return 'application/pdf';
    if ( extension === '.xml' ) return 'application/xml';

    return 'application/octet-stream';
  }

  /** Texto que acompaña al comprobante. Los *asteriscos* son negrita en WhatsApp. */
  private mensajeComprobante( payload: any, esProforma: boolean, archivos: string[] ): string {
    const encabezado = `*Estimado(a):* ${ payload.cliente } la empresa *${ payload.empresa }* ` +
      `le ha emitido la siguiente ${ esProforma ? 'proforma' : 'factura' } a su nombre:`;

    // Se enumeran los formatos que de verdad se adjuntan: la proforma va sin XML
    // y anunciar uno que no llega deja al cliente esperándolo.
    const formatos = archivos
      .map( ruta => path.extname( ruta ).replace('.', '').toUpperCase() )
      .join(' y ');

    const cuerpo = esProforma
      ? ''
      : `\n\nFactura: ${ payload.num_comprobante }`;

    // Una proforma no es un comprobante electrónico: no la autoriza el SRI.
    const adjunto = esProforma ? 'la proforma' : 'el comprobante electrónico';

    return `${ encabezado }${ cuerpo }\n\n` +
      `A continuación adjuntamos ${ adjunto } en formato ${ formatos }.`;
  }

  /**
   * El cliente ve este nombre en WhatsApp. El archivo en disco se llama con la
   * clave de acceso (49 dígitos), que no le dice nada a nadie: se renombra al
   * número de comprobante.
   */
  private nombreAdjunto( ruta: string, payload: any, esProforma: boolean ): string {
    const extension = path.extname( ruta ).toLowerCase();

    if ( esProforma )
      // Se quita el sufijo interno que evita choques entre sucursales.
      return String( payload.name_proforma ?? path.basename( ruta ) )
        .replace(/^(proforma-\d+)-[0-9a-f]{8}\.pdf$/i, '$1.pdf');

    return payload.num_comprobante
      ? `${ payload.num_comprobante }${ extension }`
      : path.basename( ruta );
  }

  convertirFormatoTelefono(numero) {
    // El teléfono de la empresa ahora se escribe a mano y llega como
    // "+593 93 977 6717". Antes solo se limpiaban espacios y guiones: el "+"
    // sobrevivía, no calzaba con ninguna rama y salía "593+593939776717".
    // Quedarse solo con los dígitos cubre los tres formatos que se usan.
    const digitos = String( numero ?? '' ).replace(/\D/g, '');

    if ( !digitos ) return '';

    if ( digitos.startsWith('593') ) return digitos;

    return digitos.startsWith('0')
      ? '593' + digitos.substring(1)
      : '593' + digitos;
  }

  async generarProforma(datosFactura, sucursal_id: any, invoice_id, send_messages: boolean = true){
    const clientFound = await this.customerService.findOne( datosFactura.customer_id );
    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: { proforma: true } },
      select: {
        company_id: {
          id: true,
          ruc: true,
          razon_social: true,
          direccion_matriz: true,
          nombre_comercial: true,
          telefono: true,
          email: true,
          logo: true,
          ciudad: true,
          whatsapp_activo: true
        }
      },
      where: { id: sucursal_id }
    });

    const total_proforma = await this.invoiceService.contarTotalProforma( sucursal_id );

    const proforma = new Proforma()

    let data;
    try {
      data = await proforma.generarProformaPDF(
        datosFactura,
        clientFound,
        infoCompany,
        total_proforma,
        invoice_id
      );
    } catch (error) {
      // Se registra el fallo real (permisos, disco, puppeteer). Antes se perdía
      // en silencio y la proforma quedaba sin PDF descargable.
      this.logger.error(`No se pudo generar el PDF de la proforma ${ invoice_id }: ${ error?.message }`, error?.stack);
      throw new BadRequestException('No se pudo generar el PDF de la proforma.');
    }

    // Solo después de que el archivo existe: si se guarda antes, la proforma
    // queda apuntando a un PDF que no está y la descarga falla.
    await this.invoiceService.update( invoice_id, { name_proforma: data.name });

    try {
      if (send_messages) {
        await this.emailService.sendComprobantes(clientFound[0], infoCompany[0], '', '', data);

        this.messageWsService.updateStateInvoice( datosFactura.user_id );

        await this.enviarWhatsapp( '/send-comprobantes-proforma', infoCompany[0].company_id, {
          urlPDF: data.buffer,
          number: clientFound[0].celular,
          telefono: this.convertirFormatoTelefono(infoCompany[0].company_id.telefono),
          cliente: clientFound[0].nombres,
          empresa: infoCompany[0].company_id.nombre_comercial,
          name_proforma: data.name
        });
      }
    } catch (error) {
      console.log("error envio de ws proforma");
    }
  }

  /**
   * Reconcilia contra el microservicio una factura que quedo a medias.
   *
   * La emision corre en segundo plano: si la respuesta del MS se pierde (un
   * timeout, un reinicio, la red), la factura se queda en PENDIENTE y sin clave
   * de acceso aunque el SRI ya la haya autorizado. Esto vuelve a preguntar por
   * ella y sincroniza lo que diga el MS.
   *
   * Sirve para PENDIENTE (nunca se guardo la respuesta) y para RECIBIDA (el SRI
   * la recibio pero todavia no se consulto la autorizacion).
   */
  async verificarEstadoSRI( datosFactura ) {

    const claveGuardada = ( datosFactura.clave_acceso ?? '' ).toString().trim();
    const numero = ( datosFactura.numero_comprobante ?? datosFactura.num_comprobante ?? '' )
      .toString().trim();

    // El MS busca indistintamente por clave de acceso o por numero de
    // comprobante, que es lo unico que queda cuando la emision no respondio.
    const termino = claveGuardada || numero;

    if ( !termino )
      throw new BadRequestException(
        'La factura no tiene clave de acceso ni numero de comprobante: no se puede verificar.'
      );

    let comprobante;

    try {
      comprobante = await this.facturacionMs.consultarFactura( termino );
    } catch (error) {
      throw new BadRequestException(
        `El servicio de facturacion no tiene registrado el comprobante ${ termino }: ` +
        'la emision nunca llego a enviarse. Vuelve a emitir la factura.'
      );
    }

    // Al buscar por numero de comprobante puede aparecer el de otra empresa: ese
    // numero se repite entre emisores. Se compara el RUC antes de adoptar nada.
    if ( !claveGuardada )
      await this.validarEmisorDelComprobante( comprobante, datosFactura );

    let estado  = ( comprobante.estado ?? '' ).toString().trim();
    let mensaje = comprobante.mensaje ?? '';

    // Si el SRI todavia no la dio por autorizada, el MS vuelve a consultarla (o
    // la reenvia si habia sido devuelta).
    if ( estado !== 'AUTORIZADO' ) {
      const reenvio = await this.facturacionMs.reenviarFactura(
        comprobante.claveAcceso ?? termino
      );

      if ( reenvio?.estado ) estado = reenvio.estado.toString().trim();
      if ( reenvio?.mensaje ) mensaje = reenvio.mensaje;
    }

    this.logger.log(
      `Verificacion de ${ comprobante.numeroComprobante ?? termino }: ${ estado }`
    );

    const entity_id = datosFactura.id ?? datosFactura.pago_id;

    if ( entity_id ) {
      await this.invoiceService.update( entity_id, {
        // La clave de acceso es lo que faltaba: sin ella no se puede descargar
        // el RIDE ni el XML, ni anular la factura.
        clave_acceso:       comprobante.claveAcceso,
        numero_comprobante: comprobante.numeroComprobante ?? numero,
        estadoSRI:          estado,
        respuestaSRI:       mensaje || null
      } as any );
    }

    this.messageWsService.updateStateInvoice( datosFactura.user_id?.id ?? datosFactura.user_id );

    return {
      ok: true,
      estado,
      clave_acceso: comprobante.claveAcceso,
      numero_comprobante: comprobante.numeroComprobante ?? numero,
      mensaje
    };
  }

  /** Que el comprobante hallado sea de la misma empresa que emitio la factura. */
  private async validarEmisorDelComprobante( comprobante, datosFactura ) {

    const sucursalId = datosFactura.sucursal_id?.id ?? datosFactura.sucursal_id;

    if ( !sucursalId ) return;

    const [ sucursal ] = await this.sucursalRepository.find({
      relations: { company_id: true },
      where: { id: sucursalId }
    });

    const rucEmpresa = sucursal?.company_id?.ruc?.toString().trim();
    const rucComprobante = (
      comprobante?.factura?.infoTributaria?.ruc ??
      this.rucDeClaveAcceso( comprobante?.claveAcceso )
    )?.toString().trim();

    if ( rucEmpresa && rucComprobante && rucEmpresa !== rucComprobante )
      throw new BadRequestException(
        `El comprobante ${ comprobante?.numeroComprobante } encontrado es del RUC ${ rucComprobante }, ` +
        'no del emisor de esta factura.'
      );
  }

  /** En la clave de acceso el RUC ocupa los digitos 11 al 23 de los 49. */
  private rucDeClaveAcceso( clave?: string ): string | undefined {
    return clave?.length === 49 ? clave.substring( 10, 23 ) : undefined;
  }

  async reintentarEnvioSRI( datosFactura ) {
    const esNotaCredito = datosFactura.tipo_comprobante == 'nota_credito';

    const clave = esNotaCredito
      ? datosFactura.clave_acceso_nota_credito ?? datosFactura.clave_acceso
      : datosFactura.clave_acceso;

    if ( !clave )
      throw new BadRequestException('El comprobante no tiene clave de acceso: no se puede reenviar.');

    const data = esNotaCredito
      ? await this.facturacionMs.reenviarNotaCredito( clave )
      : await this.facturacionMs.reenviarFactura( clave );

    const entity_id = datosFactura.id ?? datosFactura.pago_id;

    if ( entity_id && data?.estado ) {
      await this.invoiceService.update( entity_id, { estadoSRI: data.estado } as any );
    }

    this.messageWsService.updateStateInvoice( datosFactura.user_id?.id ?? datosFactura.user_id );

    return { ok: true, ...data };
  }


  async reenviarComprobantes( datosFactura ){
    const {
      clave_acceso,
      numero_comprobante,
      customer_id,
      estadoSRI,
      name_proforma,
      sucursal_id } = datosFactura.factura;

      let comprobantes;
      let pathPDF;
      let pathXML;
      if (estadoSRI == 'PROFORMA') {
        pathPDF = path.resolve(__dirname, `../../../static/SRI/PROFORMAS/${ name_proforma }`);

        comprobantes = {  name: name_proforma, buffer: pathPDF, tipo: 'proforma' }
      }else{
        // El correo y WhatsApp adjuntan por ruta, así que se bajan del MS y se
        // dejan en disco antes de enviarlos.
        const rutas = await this.facturacionMs.guardarComprobantes(
          clave_acceso,
          sucursal_id.company_id.ruc,
          {
            nameEmisor: sucursal_id.company_id.nombre_comercial,
            image_url: await this.imagenEmisor( clave_acceso )
          }
        );

        if ( !rutas )
          throw new BadRequestException('No se pudieron obtener los comprobantes del servicio de facturación.');

        pathPDF = rutas.pdf;
        pathXML = rutas.xml;

        comprobantes = { xml: pathXML, pdf: pathPDF, tipo: 'factura' };
      }

      try {
        if (datosFactura.tipo_envio == 'ambas') {
          if (estadoSRI == 'PROFORMA') {
            await this.emailService.sendComprobantes({
              email: datosFactura.email,
              nombres: customer_id.nombres
            },
            sucursal_id,
            '',
            '',
            comprobantes);

            await this.enviarWhatsapp( '/send-comprobantes-proforma', sucursal_id.company_id, {
              urlPDF: pathPDF,
              number: datosFactura.number,
              telefono: datosFactura.telefono,
              cliente: customer_id.nombres,
              empresa: sucursal_id.company_id.nombre_comercial,
              name_proforma: name_proforma
            });
          }else{
            await this.emailService.sendComprobantes(
              { email: datosFactura.email, nombres: customer_id.nombres },
              sucursal_id,
              numero_comprobante,
              clave_acceso,
              comprobantes
            );
            await this.enviarWhatsapp( '/send-comprobantes', sucursal_id.company_id, {
              cliente: customer_id.nombres,
              number: datosFactura.number,
              telefono: datosFactura.telefono,
              urlPDF: pathPDF,
              urlXML: pathXML,
              clave_acceso: clave_acceso,
              num_comprobante: numero_comprobante,
              empresa: sucursal_id.company_id.nombre_comercial
            });
          }
          return true;
        }
        if (datosFactura.tipo_envio == 'whatsapp') {
          if (estadoSRI == 'PROFORMA') {
            await this.enviarWhatsapp( '/send-comprobantes-proforma', sucursal_id.company_id, {
              urlPDF: pathPDF,
              number: datosFactura.number,
              telefono: datosFactura.telefono,
              cliente: customer_id.nombres,
              empresa: sucursal_id.company_id.nombre_comercial,
              name_proforma: name_proforma
            });
          }else{
            await this.enviarWhatsapp( '/send-comprobantes', sucursal_id.company_id, {
              cliente: customer_id.nombres,
              number: datosFactura.number,
              telefono: datosFactura.telefono,
              urlPDF: pathPDF,
              urlXML: pathXML,
              clave_acceso: clave_acceso,
              num_comprobante: numero_comprobante,
              empresa: sucursal_id.company_id.nombre_comercial
            });
          }
        }
        if (datosFactura.tipo_envio == 'email') {
          if (estadoSRI == 'PROFORMA') {
            await this.emailService.sendComprobantes({
              email: datosFactura.email,
              nombres: customer_id.nombres
            },
            sucursal_id,
            '',
            '',
            comprobantes
          );
          }else{
            await this.emailService.sendComprobantes(
              {
                email: datosFactura.email,
                nombres: customer_id.nombres
              },
              sucursal_id,
              numero_comprobante,
              clave_acceso,
              comprobantes
            );
          }
        }
      } catch (error) {
        // Antes esto hacía `error.response.data` a secas: cualquier error que no
        // fuera una respuesta de axios (el gateway caído, un fallo propio) hacía
        // reventar el catch y el motivo real se perdía. Ese era el
        // "Cannot read properties of undefined (reading 'data')" del log.
        const respuesta = error?.response?.data;

        const detalle =
          respuesta?.message ??
          ( typeof respuesta === 'string' ? respuesta : null ) ??
          error?.message ??
          JSON.stringify( error );

        const canal = datosFactura.tipo_envio == 'email'
          ? 'correo'
          : datosFactura.tipo_envio == 'whatsapp' ? 'WhatsApp' : 'correo/WhatsApp';

        this.logger.error(`Fallo al reenviar los comprobantes por ${ canal }: ${ detalle }`, error?.stack);

        throw new BadRequestException(`No se pudo enviar por ${ canal }: ${ detalle }`);
      }
  }
}
