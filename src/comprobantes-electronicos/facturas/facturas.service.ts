const axios = require('axios');
const moment = require('moment');
const fs = require("fs");
const path = require('path');

import { Injectable, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CustomersService } from '../../customers/customers.service';
import { InvoicesService } from 'src/invoices/invoices.service';
import { EmailService } from 'src/email/email.service';
import { MessagesWsService } from 'src/messages-ws/messages-ws.service';
import { Proforma } from '../plantillas/proforma';
import { FacturacionMsClient } from '../facturacion-ms/facturacion-ms.client';

@Injectable()
export class FacturasService {

  constructor(
    @InjectRepository( Sucursal )
    private readonly sucursalRepository: Repository<Sucursal>,

    @Inject(forwardRef(() => InvoicesService))
    private invoiceService: InvoicesService,

    private readonly facturacionMs: FacturacionMsClient,
    private readonly customerService: CustomersService,
    private readonly emailService: EmailService,
    private readonly messageWsService: MessagesWsService,
    private readonly dataSource: DataSource
  ){}

  async descargarComprobante(
    formato: 'ride' | 'xml',
    claveAcceso: string,
    tipo: 'factura' | 'nota-credito' = 'factura',
    nameEmisor = ''
  ): Promise<Buffer> {
    return this.facturacionMs.descargar( formato, claveAcceso, tipo, { nameEmisor });
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
    let { ambiente, establecimiento, punto_emision, secuencial } = await queryBuilder
      .select(["establecimiento", "punto_emision", "ambiente"])
      .addSelect(query, "secuencial")
      .where("id = :id", { id: sucursal_id })
      .getRawOne();

    establecimiento = establecimiento.toString().padStart(3, '0')
    punto_emision   = punto_emision.toString().padStart(3, '0')
    secuencial      = secuencial.toString().padStart(9, '0')

    const numComprobante = `${ establecimiento }-${ punto_emision }-${ secuencial }`

    return { numComprobante, ambiente };
  }

  async generarNotaCredito( datosFactura, entity: string = 'Invoice' ){

    const sucursal_id = datosFactura.sucursal_id?.id ?? datosFactura.sucursal_id;

    if ( !datosFactura.clave_acceso )
      throw new BadRequestException('La factura no tiene clave de acceso: no se puede anular.');

    const { numComprobante, ambiente } = await this.getNumComprobante( sucursal_id, 'nota_credito' );
    const secuencial = numComprobante.split('-')[2];

    const data = await this.facturacionMs.anularFactura({
      ambiente: ambiente == 'PRUEBA' ? 'test' : 'prod',
      emisor:   { secuencial },
      factura:  datosFactura.clave_acceso,
      motivo:   datosFactura.motivo ?? 'Anulación de factura'
    });

    if ( datosFactura.id ) {
      await this.invoiceService.update( datosFactura.id, {
        clave_acceso_nota_credito: data.claveAcceso,
        estadoSRI:                 data.estado
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
          logo: true
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

    if ( send_messages && cliente.nombres !== 'CONSUMIDOR FINAL' )
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

      return {
        codigoPrincipal: codigo,
        codigoAuxiliar:  codigo,
        descripcion:     item.nombre,
        cantidad,
        precioUnitario,
        descuento,
        tipo_iva:        item.aplicaIva ? Number( datosFactura.porcentaje_iva ) : 0
      };
    });
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
        { nameEmisor: empresa.nombre_comercial }
      );

      if ( !rutas ) return;

      await this.emailService.sendComprobantes(
        cliente, sucursal, data.numeroComprobante, data.claveAcceso,
        { xml: rutas.xml, pdf: rutas.pdf, tipo: 'factura' }
      );

      await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes`, {
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
      console.log('No se pudieron enviar los comprobantes:', error?.message);
    }
  }

  convertirFormatoTelefono(numero) {
    if (numero.startsWith('593')) {
      return numero;
    } else {
      numero = numero.replace(/\s/g, '').replace(/-/g, '');

      if (numero.startsWith('0'))
        return '593' + numero.substring(1);
      else
        return '593' + numero;
    }
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
          ciudad: true
        }
      },
      where: { id: sucursal_id }
    });

    const total_proforma = await this.invoiceService.contarTotalProforma( sucursal_id );

    const proforma = new Proforma()

    const data = await proforma.generarProformaPDF(
      datosFactura,
      clientFound,
      infoCompany,
      total_proforma
    );

    await this.invoiceService.update( invoice_id, { name_proforma: data.name });

    try {
      if (send_messages) {
        await this.emailService.sendComprobantes(clientFound[0], infoCompany[0], '', '', data);

        this.messageWsService.updateStateInvoice( datosFactura.user_id );

        await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes-proforma`, {
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
          { nameEmisor: sucursal_id.company_id.nombre_comercial }
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

            await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes-proforma`, {
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
            await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes`, {
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
            await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes-proforma`, {
              urlPDF: pathPDF,
              number: datosFactura.number,
              telefono: datosFactura.telefono,
              cliente: customer_id.nombres,
              empresa: sucursal_id.company_id.nombre_comercial,
              name_proforma: name_proforma
            });
          }else{
            await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes`, {
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
        // console.log(error);
        if(error.response.data == 'error ws'){
          throw new BadRequestException('Fallo al enviar mensaje por WhatsApp');
        }else{
          throw new BadRequestException('Fallo al enviar mensaje por correo');
        }
      }
  }
}
