const axios = require('axios');
const moment = require('moment');
const builder = require("xmlbuilder");
const fs = require("fs");
const path = require('path');
const { execSync } = require('node:child_process');
const XMLParser = require("fast-xml-parser").XMLParser;

import { Injectable, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CustomersService } from '../../customers/customers.service';
import { InvoicesService } from 'src/invoices/invoices.service';
import { EmailService } from 'src/email/email.service';
import { MessagesWsService } from 'src/messages-ws/messages-ws.service';
import { Proforma } from '../plantillas/proforma';
import { Factura } from '../plantillas/factura';
import { Pago } from 'src/pagos/entities/pago.entity';
import { RetencionesService } from '../retenciones/retenciones.service';

@Injectable()
export class FacturasService {

  constructor(
    @InjectRepository( Sucursal )
    private readonly sucursalRepository: Repository<Sucursal>,

    @Inject(forwardRef(() => InvoicesService))
    private invoiceService: InvoicesService,

    @Inject(forwardRef(() => RetencionesService))
    private retencionService: RetencionesService,

    private readonly customerService: CustomersService,
    private readonly emailService: EmailService,
    private readonly messageWsService: MessagesWsService,
    private readonly dataSource: DataSource
  ){}

  calcularDigitoVerificadorMod11( clave ){
    let factor = 7;
    let total = 0;

    for (let i = 0; i < clave.length; i++){
        total += parseInt(clave[i]) * factor;

        factor -= 1;
        if (factor === 1) factor = 7;
    }

    const module11 = 11 - (total % 11);

    if (module11 === 11) return 0;
    else if (module11 === 10) return 1;

    return module11;
  }

  async getRide( claveAcceso ){
    const pathPDF = path.resolve(__dirname, `../../../static/SRI/PDF/${ claveAcceso }.pdf`);

    return await fs.readFileSync(pathPDF);
  }

  async getNumComprobante( sucursal_id: any, tipo: string = 'factura' ) {
    let query;
    if ( tipo == 'factura' ) {
      query = `CASE
                  WHEN (ambiente = 'PRODUCCION') THEN sucursal.secuencia_factura_produccion
                  ELSE sucursal.secuencia_factura_pruebas
              END`
    }else if(tipo == 'retencion'){
        query = `CASE
                  WHEN (ambiente = 'PRODUCCION') THEN sucursal.secuencia_retencion_produccion
                  ELSE sucursal.secuencia_retencion_pruebas
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

  async getClaveAcceso( sucursal_id: Sucursal, tipo = 'factura'){
    const sucursal: any = sucursal_id;

    const { numComprobante } = await this.getNumComprobante( sucursal, tipo );

    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: { ambiente: true , company_id: { ruc: true } },
      where: { id: sucursal }
    });

    const codigoEstablecimiento = numComprobante.split('-')[0];
    const puntoEmision          = numComprobante.split('-')[1];
    const secuencia             = numComprobante.split('-')[2];

    let codDoc;
    if (tipo == 'factura') codDoc = '01'
    else if (tipo == 'retencion') codDoc = '07'
    else codDoc = '07'

    const fechaEmision    = moment().format('DDMMYYYY');
    const ruc             = infoCompany[0].company_id.ruc
    const ambiente        = infoCompany[0].ambiente === 'PRUEBA' ? '1' : '2' ;
    const serie           = codigoEstablecimiento + '' + puntoEmision;
    const codigoNumerico  = Date.now().toString(10).substring(5);
    const tipoEmision     = '1' //Emision Normal

    let claveAcceso = fechaEmision + codDoc + ruc + ambiente + serie + secuencia + codigoNumerico + tipoEmision;

    const digitoVerificador = this.calcularDigitoVerificadorMod11( claveAcceso );

    return `${claveAcceso + digitoVerificador}`;
  }

  async generarNotaCredito( datosFactura, entity: string = 'Invoice' ){

    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: {
        company_id: {
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
      where: { id: datosFactura.sucursal_id.id }
    });
    const claveAcceso = await this.getClaveAcceso(datosFactura.sucursal_id.id, 'nota_credito')

    const infoTributaria = {
      ambiente:         datosFactura.sucursal_id.ambiente == 'PRUEBA' ? 1 : 2,
      tipoEmision:      1,
      razonSocial:      infoCompany[0].company_id.razon_social,
      nombreComercial:  infoCompany[0].company_id.nombre_comercial,
      ruc:              infoCompany[0].company_id.ruc,
      claveAcceso:      claveAcceso,
      codDoc:           '04', //Nota Credito
      estab:            claveAcceso.substring(24, 27),
      ptoEmi:           claveAcceso.substring(27, 30),
      secuencial:       claveAcceso.substring(30, 39),
      dirMatriz:        infoCompany[0].company_id.direccion_matriz
    };

    //------ OBTENER LA SUMA DE TODOS LOS ARTICULOS QUE APLICAN IVA Y DESCUENTOS ------------
    let sumaPrecioTotalSinImpuesto = 0;

    datosFactura.invoiceToProduct.forEach((item: any) => {
      if ( item.product_id.aplicaIva ) {
        let subtotalSinDescuento = parseFloat( (parseInt( item.cantidad ) * parseFloat( item.product_id.pvp )).toString() );
        let subtotalConDescuento = (subtotalSinDescuento * parseInt(item.product_id.descuento)) / 100;

        sumaPrecioTotalSinImpuesto += parseFloat((subtotalSinDescuento - subtotalConDescuento).toString());
      }
    });

    let codigo_tarifa = 0;
    if ( datosFactura.porcentaje_iva == 15 ) codigo_tarifa = 4
    if ( datosFactura.porcentaje_iva == 14 ) codigo_tarifa = 3
    if ( datosFactura.porcentaje_iva == 12 ) codigo_tarifa = 2

    const infoNotaCredito = {
      fechaEmision:                moment().format('DD/MM/YYYY'),
      dirEstablecimiento:          datosFactura.sucursal_id.direccion,
      tipoIdentificacionComprador: datosFactura.customer_id.tipo_documento,
      razonSocialComprador:        datosFactura.customer_id.nombres,
      identificacionComprador:     datosFactura.customer_id.numero_documento,
      codDocModificado:            '01', //Factura
      numDocModificado:            datosFactura.numero_comprobante,
      fechaEmisionDocSustento:     datosFactura.created_at.split(' ')[0],
      totalSinImpuestos:           ( parseFloat(datosFactura.subtotal) - parseFloat(datosFactura.descuento) ).toFixed(2),
      valorModificacion:           datosFactura.total,
      moneda:                      'DOLAR',
      totalConImpuestos: {
        totalImpuesto: {
          codigo: 2,  //IVA
          codigoPorcentaje: parseFloat(datosFactura.iva) > 0 ? codigo_tarifa : 0,
          baseImponible: parseFloat(datosFactura.iva) > 0 ? parseFloat(sumaPrecioTotalSinImpuesto.toString()).toFixed(2) : datosFactura.total,
          valor: datosFactura.iva ? datosFactura.iva : (0).toFixed(2)
        }
      },
      motivo: 'DEVOLUCION'
    };

    const detalle = []

    datosFactura.invoiceToProduct.forEach((item) => {   //Espera en descuento el procentaje o valor?
        let subtotalSinDescuento = parseInt(item.cantidad) * parseFloat( item.product_id.pvp );
        let subtotalConDescuento = (subtotalSinDescuento * item.product_id.descuento) / 100;
        let precioTotalSinImpuesto = (subtotalSinDescuento - subtotalConDescuento).toFixed(2);

        detalle.push({
          codigoInterno: item.product_id.codigoBarra,
          descripcion: item.product_id.nombre,
          cantidad: item.cantidad,
          precioUnitario: parseFloat(item.product_id.pvp).toFixed(2),
          descuento: parseFloat(subtotalConDescuento.toString()).toFixed(2),
          precioTotalSinImpuesto: precioTotalSinImpuesto,
          impuestos: {
            impuesto: {
              codigo: 2,
              codigoPorcentaje: item.product_id.aplicaIva ? codigo_tarifa : 0,
              tarifa: item.product_id.aplicaIva ? datosFactura.porcentaje_iva : 0,
              baseImponible: precioTotalSinImpuesto,
              valor: item.product_id.aplicaIva ? ((parseFloat(precioTotalSinImpuesto) * datosFactura.porcentaje_iva) / 100).toFixed(2) : (0).toFixed(2)
            }
          }
        })
    });

    const campoAdicional = [{
      '@nombre': 'Email',
      '#text': 'wekfkwpe'
    }];

    var obj = {
      notaCredito: {
        '@id': 'comprobante',
        '@version': "1.0.0",
        infoTributaria: infoTributaria,
        infoNotaCredito: infoNotaCredito,
        detalles: {
            detalle: detalle
        },
        infoAdicional: {
            campoAdicional
        }
      }
    };

    const nombreComercial = infoCompany[0].company_id.ruc;

    var xml = builder.create(obj, { encoding: 'UTF-8' }).end({ pretty: true});

    const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }`);

    const java = process.env.JAVA_PATH;
    const pathCertificado = path.resolve(__dirname, `../../../static/SRI/FIRMAS/${ infoCompany[0].company_id.archivo_certificado }`);

    try {
      await fs.mkdirSync(path.dirname(`${ pathXML }/notasCreditos/Generados/${ claveAcceso }.xml`), {recursive: true, })
      await fs.writeFileSync(`${ pathXML }/notasCreditos/Generados/${ claveAcceso }.xml`, xml, {flag: 'w+', encoding: 'utf-8'})

      await fs.mkdirSync(path.dirname(`${ pathXML }/notasCreditos/Firmados/${ claveAcceso }.xml`), {recursive: true})
      await fs.writeFileSync(`${ pathXML }/notasCreditos/Firmados/${ claveAcceso }.xml`, "", {flag: 'w+', encoding: 'utf-8'})
    } catch (err) {
      console.log(err)
    }

    //---------------- Firmar XML--------------------------
    const cmd = java + ' -jar "' + path.resolve('static/resource/jar/firmaxml1 (1).jar') + '" "' + `${ pathXML }/notasCreditos/Generados/${ claveAcceso }.xml` + '" "' + pathCertificado + '" "' + infoCompany[0].company_id.clave_certificado + '" "' + `${ pathXML }/notasCreditos/Firmados/${ claveAcceso }.xml` + '"';

    try {
      await execSync(cmd)
    } catch (err) {
      return console.log('error firma: ', err)
    }
    //--------------------------------------------------------------------------

    let host = (datosFactura.sucursal_id.ambiente === 'PRUEBA') ? 'https://celcer.sri.gob.ec' : 'https://cel.sri.gob.ec';

    let recibida;
    try {
      recibida = await this.recepcionComprobantesOffline( nombreComercial, claveAcceso, datosFactura.id, 'nota_credito', host, pathXML, datosFactura.user_id.id, xml, entity );
    } catch (error) {
      return { ok: false }
    }

    if( recibida ){
      // ---------------------- AUMENTAR EL SECUENCIAL NOTA CRED. -------------------
      const secuencial = claveAcceso.substring(30, 39);
      let option: any = {};

      if ( datosFactura.sucursal_id.ambiente == 'PRUEBA' )
        option.secuencia_nota_credito_pruebas = parseInt( secuencial ) + 1;
      else
        option.secuencia_nota_credito_produccion = parseInt( secuencial ) + 1;

      const sucursal: any = datosFactura.sucursal_id.id;
      this.sucursalRepository.update( sucursal, option );
      // --------------------------------------------------------------------------

      setTimeout(async () => {
        let autorizado;
        try {
          autorizado = await this.autorizacionComprobantesOffline( host, claveAcceso, datosFactura.id, datosFactura.user_id.id, nombreComercial, 'nota_credito', datosFactura.numero_comprobante, entity);
        } catch (error) {
          return { ok: false }
        }

        return { ok: true }
      }, 2500)
    }
  }

  recepcionComprobantesOffline(
    nombreComercial,
    claveAcceso,
    entity_id,
    tipo,
    host,
    pathXML,
    user_id,
    xml,
    entity,
    num_comprobante = '',
    reenviado = true
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let signedXml = null;
      let name_folder;

      try {
        if (tipo == 'factura') name_folder = 'facturas';
        else if (tipo == 'retencion') name_folder = 'retenciones';
        else name_folder = 'notasCreditos'

        const xmlOut = await fs.readFileSync(`${ pathXML }/${ name_folder }/Firmados/${ claveAcceso }.xml`);
        signedXml = xmlOut.toString('base64');
      } catch (err) {
        console.log('error firma: ', err)
      }

      var config = {
        method: 'post',
        url: host + '/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
        headers: {
            'Content-Type': 'text/xml',
            'Accept': 'text/xml',
            'SOAPAction': ''
        },
        data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.recepcion">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<ec:validarComprobante>' +
            '<xml>' + signedXml + '</xml>' +
            '</ec:validarComprobante>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>'
      };

      let resp = null;

      try {
        resp = await axios(config);
        // throw new Error('Algo salió mal');
      } catch (err) {

        console.log('error axio:', err)

        if (reenviado){
          if ( entity == 'Pagos' ){
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect()
            await queryRunner.manager.update(Pago, entity_id, {
              estadoSRI: `ERROR ENVIO RECEPCION ${ tipo == 'nota_credito' ? '- ANULACION' : ''}`
            })
            await queryRunner.release()
          }else{
            if ( tipo == 'factura' || tipo == 'nota_credito' ) {
              let options: any = { estadoSRI: `ERROR ENVIO RECEPCION ${ tipo == 'nota_credito' ? '- ANULACION' : ''}` }

              if ( tipo == 'factura' ) options.clave_acceso = claveAcceso
              if ( tipo == 'nota_credito' ) options.clave_acceso_nota_credito = claveAcceso

              await this.invoiceService.update( entity_id, options);
            }

            if ( tipo == 'retencion' )
              await this.retencionService.update( entity_id, { estadoSRI: 'ERROR ENVIO RECEPCION RETENCION' } );
          }

          this.messageWsService.updateStateInvoice( user_id );
        }

        return reject( false );
      }

      //-------------------------- Leer xml de respuesta del SRI ------------------------------
      if (resp !== null && resp.status === 200) {

        const parser = new XMLParser();
        const jObj = parser.parse( resp.data );

        const estado = jObj['soap:Envelope']['soap:Body']['ns2:validarComprobanteResponse']['RespuestaRecepcionComprobante']['estado'];

        if ( entity == 'Pagos' ){
          const queryRunner = this.dataSource.createQueryRunner();
          await queryRunner.connect()
          await queryRunner.manager.update(Pago, entity_id, {
            clave_acceso: claveAcceso,
            estadoSRI: `${ tipo == 'nota_credito' ? 'ANULACION -' : '' } ${ estado }`
          })
          await queryRunner.release()
        }else{
          let options: any = {
            estadoSRI: `${ tipo == 'nota_credito' ? 'ANULACION -' : '' } ${ estado }`
          };

          if ( tipo == 'factura' || tipo == 'nota_credito' ) {
            if ( tipo == 'factura' ) options.clave_acceso = claveAcceso
            if ( tipo == 'nota_credito' ) options.clave_acceso_nota_credito = claveAcceso

            await this.invoiceService.update( entity_id, options)
          }

          if ( tipo == 'retencion' )
            await this.retencionService.update( entity_id, { estadoSRI: `RETENCION ${ estado }` } )
        }

        if ('DEVUELTA' === estado) {
            const comprobantes = jObj['soap:Envelope']['soap:Body']['ns2:validarComprobanteResponse']['RespuestaRecepcionComprobante']['comprobantes'];

            try {
              const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/${ name_folder }/Devueltos/${ claveAcceso }.xml`);

              const respuestaSRI = xml.substring(0, xml.length - 10) + '\n \t' + JSON.stringify(resp.data) + `\n \n</${ name_folder }>`;

              await fs.mkdirSync(path.dirname(pathXML), {recursive: true, })
              await fs.writeFileSync(pathXML, respuestaSRI, {flag: 'w+', encoding: 'utf-8'});
            } catch (err) {
              console.log(err);
            }

            const mensaje = comprobantes.comprobante.mensajes.mensaje;
            const infoAdicional = mensaje?.informacionAdicional || 'NO HAY INFO ADICIONAL'

            const respuestaSRI = `MENSAJE: ${ mensaje.mensaje } - INFOADICIONAL: ${ infoAdicional }`

            if ( entity == 'Pagos' ){
              const queryRunner = this.dataSource.createQueryRunner();
              await queryRunner.connect()
              await queryRunner.manager.update(Pago, entity_id, { respuestaSRI })
              await queryRunner.release()
            }else{
              let option: any = { respuestaSRI }

              if ( tipo == 'factura' || tipo == 'nota_credito' ) {
                if (num_comprobante.length !== 0)
                  option.numero_comprobante = num_comprobante

                if ( tipo == 'factura' )
                  option.clave_acceso = claveAcceso
                if ( tipo == 'nota_credito' )
                  option.clave_acceso_nota_credito = claveAcceso

                await this.invoiceService.update( entity_id, option)
              }

              if ( tipo == 'retencion' )
                await this.retencionService.update( entity_id, option )
            }

            this.messageWsService.updateStateInvoice( user_id );
            reject( false );
        }

        if ( tipo == 'factura' || tipo == 'nota_credito' )
          await this.invoiceService.update( entity_id, { numero_comprobante: num_comprobante })

        resolve( true )
      }
    });
  }

  autorizacionComprobantesOffline(
    host, accessKey,
    invoice_id, user_id,
    nombreComercial, tipo,
    numComprobante, entity,
    reenviadoAutorizacion = true
  ): Promise<boolean>{
    return new Promise(async (resolve, reject) => {
      var config = {
          method: 'post',
          url: host + '/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
          headers: {
              'Content-Type': 'text/xml',
              'Accept': 'text/xml',
              'SOAPAction': ''
          },
          data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.autorizacion">' +
              '<soapenv:Header/>' +
              '<soapenv:Body>' +
              '<ec:autorizacionComprobante>' +
              '<claveAccesoComprobante>' + accessKey + '</claveAccesoComprobante>' +
              '</ec:autorizacionComprobante>' +
              '</soapenv:Body>' +
              '</soapenv:Envelope>'
      };

      let resp = null;
      let name_folder;

      if (tipo == 'factura') name_folder = 'facturas';
      else if (tipo == 'retencion') name_folder = 'retenciones';
      else name_folder = 'notasCreditos'

      try {
        resp = await axios(config);

        // throw new Error('fwjfjw')
      } catch (err) {
        console.log('error axio:', err);

        if (reenviadoAutorizacion) {
          if ( entity == 'Pagos' ){
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect()
            await queryRunner.manager.update(Pago, invoice_id, {
              estadoSRI: `ERROR ENVIO AUTORIZACION ${ tipo == 'nota_credito' ? '- ANULACION' : '' }`
            })
            await queryRunner.release()
          }else{
            if ( tipo == 'factura' || tipo == 'nota_credito' )
              await this.invoiceService.update( invoice_id, {
                estadoSRI: `ERROR ENVIO AUTORIZACION ${ tipo == 'nota_credito' ? '- ANULACION' : '' }`
              });

            if( tipo == 'retencion' )
              await this.retencionService.update( invoice_id, { estadoSRI: 'ERROR ENVIO AUTORIZACION RETENCION' } );
          }
          this.messageWsService.updateStateInvoice( user_id );
        }

        reject( false );
      }

      if (resp !== null && resp.status === 200) {
        try {
          const parser = new XMLParser();
          const jObj = parser.parse(resp.data);

          const autorizacion = jObj['soap:Envelope']['soap:Body']['ns2:autorizacionComprobanteResponse']['RespuestaAutorizacionComprobante']['autorizaciones']['autorizacion'];

          let respuestaSRI = '';
          let estado = autorizacion['estado'];
          let directorio = ('AUTORIZADO' === estado) ? 'Autorizados' : 'NoAutorizados' ;

          if ( estado !== 'AUTORIZADO' ) {
            const mensaje = autorizacion.mensajes.mensaje;
            const infoAdicional = mensaje?.informacionAdicional || 'NO HAY INFO ADICIONAL';
            respuestaSRI = `MENSAJE: ${ mensaje.mensaje } - INFOADICIONAL: ${ infoAdicional }`
          }

          if (tipo == 'nota_credito' && estado == 'AUTORIZADO') estado = 'ANULADO';

          const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/${ name_folder }/${ directorio }/${ accessKey }.xml`);

          await fs.mkdirSync(path.dirname(pathXML), { recursive: true })
          await fs.writeFileSync(pathXML, resp.data, { flag: 'w+', encoding: 'utf-8' });

          if ( entity == 'Pagos' ){
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect()
            await queryRunner.manager.update(Pago, invoice_id, {
              num_comprobante: numComprobante,
              clave_acceso: accessKey,
              estadoSRI: estado.trim(),
              respuestaSRI
            })
            await queryRunner.release()
          }else{
            if ( tipo == 'factura' || tipo == 'nota_credito' )
              await this.invoiceService.update( invoice_id, {
                estadoSRI: estado.trim(),
                respuestaSRI
              });

            if ( tipo == 'retencion' )
              await this.retencionService.update( invoice_id, {
                estadoSRI: estado.trim(),
                respuestaSRI
              });
          }

          if ( estado == 'AUTORIZADO' || estado == 'ANULADO'){
            this.messageWsService.updateStateInvoice( user_id );
            resolve( true );
          }
          else reject( false );

        } catch (err) {
          console.log(err)
        }
      }else{
        reject( false )
      }
    })
  }

  escapeHtml(str) {
    return str.replace(/[\u00A0-\u9999<>&]/gim, function(i) {
        return '&#' + i.charCodeAt(0)
    });
  }

  async generarFacturaElectronica(
    datosFactura,
    claveAcceso = '',
    sucursal_id: any,
    entity_id: string = null,
    entity: string = 'Invoice',
    send_messages: boolean = true
  ){

    if ( datosFactura.tipo == 'EMISION')
      claveAcceso = await this.getClaveAcceso( sucursal_id );

    const clientFound = await this.customerService.findOne( datosFactura.customer_id );
    const { numComprobante, ambiente } = await this.getNumComprobante( sucursal_id );

    if ( entity == 'Pagos' ){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect()
      await queryRunner.manager.update(Pago, entity_id, {
        sucursal_id, clave_acceso: claveAcceso, num_comprobante: numComprobante
      })
      await queryRunner.release()
    }

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

    let codigo_tarifa = 0;
    if ( datosFactura.porcentaje_iva == 15 ) codigo_tarifa = 4
    if ( datosFactura.porcentaje_iva == 14 ) codigo_tarifa = 3
    if ( datosFactura.porcentaje_iva == 12 ) codigo_tarifa = 2

    const nombreComercial = infoCompany[0].company_id.ruc;

    const infoTributaria = {
      ambiente:     ( ambiente == 'PRUEBA') ? 1 : 2,
      tipoEmision:  1,
      razonSocial:  this.escapeHtml(infoCompany[0].company_id.razon_social),
      ruc:          infoCompany[0].company_id.ruc,
      claveAcceso:  claveAcceso,
      codDoc:       '01', //Factura
      estab:        numComprobante.split('-')[0],
      ptoEmi:       numComprobante.split('-')[1],
      secuencial:   numComprobante.split('-')[2],
      dirMatriz:    this.escapeHtml(infoCompany[0].company_id.direccion_matriz)
    };

    //------ OBTIENE LA SUMA DE TODOS LOS ARTICULOS QUE APLICAN IVA Y DESCUENTOS ------------
    let sumaPrecioTotalSinImpuesto = 0;

    datosFactura.products.forEach((item: any) => {
      if ( item.aplicaIva ) {
        let subtotalSinDescuento = parseFloat( (parseInt( item.cantidad ) * parseFloat( item.pvp )).toString() );
        let subtotalConDescuento = (subtotalSinDescuento * parseInt(item.descuento)) / 100;

        sumaPrecioTotalSinImpuesto += parseFloat((subtotalSinDescuento - subtotalConDescuento).toString());
      }
    });

    const infoFactura = {
      fechaEmision:                 moment().format('DD/MM/YYYY'),
      dirEstablecimiento:           this.escapeHtml(infoCompany[0].direccion),
      obligadoContabilidad:         infoCompany[0].company_id.obligado_contabilidad ? 'SI' : 'NO',
      tipoIdentificacionComprador:  clientFound[0].tipo_documento,
      razonSocialComprador:         this.escapeHtml(clientFound[0].nombres),
      identificacionComprador:      clientFound[0].numero_documento,
      direccionComprador:           this.escapeHtml(clientFound[0].direccion),
      totalSinImpuestos:            ( datosFactura.subtotal - datosFactura.descuento ).toFixed(2),
      totalDescuento:               datosFactura.descuento,
      totalConImpuestos: {
        totalImpuesto: {
          codigo: 2,
          codigoPorcentaje: datosFactura.iva > 0 ? codigo_tarifa : 0,
          baseImponible: datosFactura.iva > 0 ? parseFloat(sumaPrecioTotalSinImpuesto.toString()).toFixed(2) : datosFactura.total,
          valor: datosFactura.iva ? datosFactura.iva : (0).toFixed(2)
        }
      },
      propina: 0.00,
      importeTotal: datosFactura.total,
      moneda: 'DOLAR',
      pagos: {
        pago: {
          formaPago: this.escapeHtml(datosFactura.forma_pago),
          total: datosFactura.total
        }
      }
    };

    const detalle = []

    datosFactura.products.forEach((item) => {
      let subtotalSinDescuento = parseInt(item.cantidad) * parseFloat( item.pvp );
      let subtotalConDescuento = (subtotalSinDescuento * item.descuento) / 100;
      let precioTotalSinImpuesto = (subtotalSinDescuento - subtotalConDescuento).toFixed(2);

      detalle.push({
        codigoPrincipal: this.escapeHtml(item.codigoBarra),
        descripcion: this.escapeHtml(item.nombre),
        cantidad: item.cantidad,
        precioUnitario: parseFloat(item.pvp).toFixed(2),
        descuento: parseFloat(subtotalConDescuento.toString()).toFixed(2),
        precioTotalSinImpuesto: precioTotalSinImpuesto,
        impuestos: {
          impuesto: {
            codigo: 2,
            codigoPorcentaje: item.aplicaIva ? codigo_tarifa : 0,
            tarifa: item.aplicaIva ? datosFactura.porcentaje_iva : 0,
            baseImponible: precioTotalSinImpuesto,
            valor: item.aplicaIva ? ( (parseFloat(precioTotalSinImpuesto) * datosFactura.porcentaje_iva) / 100).toFixed(2) : (0).toFixed(2)
          }
        }
      })
    });

    const campoAdicional = [{
      '@nombre': 'Descripcion',
      '#text': datosFactura.descripcion.trim().length == 0
                ? 'Sin descripcion'
                : this.escapeHtml(datosFactura.descripcion.trim())
    }];

    var obj = {
      factura: {
        '@id': 'comprobante',
        '@version': "1.0.0",
        infoTributaria: infoTributaria,
        infoFactura: infoFactura,
        detalles: {
          detalle: detalle
        },
        infoAdicional: {
          campoAdicional
        }
      }
    };

    var xml = builder.create(obj, { encoding: 'UTF-8' }).end({ pretty: true});
    const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }`);

    const firmado = await this.crearAndFirmarXML(xml, nombreComercial, claveAcceso, infoCompany[0].company_id, 'factura', entity_id);

    if (firmado) {
      let host = ( ambiente === 'PRUEBA') ? 'https://celcer.sri.gob.ec' : 'https://cel.sri.gob.ec';

      let recibida;
      let reenviado = true
      try {
        recibida = await this.recepcionComprobantesOffline(nombreComercial, claveAcceso, entity_id, 'factura', host, pathXML, datosFactura.user_id, xml, entity, numComprobante, reenviado )
      } catch (error) {
        // try {
        //   reenviado = true;

        //   setTimeout(async () => {
        //     recibida = await this.recepcionComprobantesOffline(nombreComercial, claveAcceso, entity_id, 'factura', host, pathXML, datosFactura.user_id, xml, entity, numComprobante, reenviado )
        //   }, 500)
        // } catch (error) {
        //   return { ok: false }
        // }
        return { ok: false }
      }

      let autorizado;
      if( recibida ){
        // ---------------------- AUMENTA EL SECUENCIAL FACTURA -------------------
        const secuencial = numComprobante.split('-')[2];
        let option: any = {};

        if ( ambiente == 'PRUEBA' )
          option.secuencia_factura_pruebas = parseInt( secuencial ) + 1;
        else
          option.secuencia_factura_produccion = parseInt( secuencial ) + 1;

        const sucursal: any = sucursal_id;
        await this.sucursalRepository.update( sucursal, option );
        // --------------------------------------------------------------------------

        let reenviadoAutorizacion = true
        setTimeout(async () => {
          try {
            autorizado = await this.autorizacionComprobantesOffline( host, claveAcceso, entity_id, datosFactura.user_id, nombreComercial, 'factura', numComprobante, entity, reenviadoAutorizacion)
          } catch (error) {

            // try {
            //   reenviadoAutorizacion = true;

            //   setTimeout(async () => {
            //     autorizado = await this.autorizacionComprobantesOffline( host, claveAcceso, entity_id, datosFactura.user_id, nombreComercial, 'factura', numComprobante, entity, reenviadoAutorizacion)
            //   }, 500)
            // } catch (error) {
            //   return { ok: false }
            // }
            return { ok: false }
          }

          if( autorizado ) {
            if (clientFound[0].nombres !== 'CONSUMIDOR FINAL') {

              const factura = new Factura();
              const pathPDF = await factura.generarFacturaPDF( claveAcceso, infoCompany[0], numComprobante, clientFound[0], datosFactura, datosFactura.porcentaje_iva);

              const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/facturas/Autorizados/${ claveAcceso }.xml`);

              const comprobantes = { xml: pathXML, pdf: pathPDF, tipo: 'factura' }

              if ( send_messages ) {
                try {
                  await this.emailService.sendComprobantes(clientFound[0], infoCompany[0], numComprobante, claveAcceso, comprobantes);

                  //Enviar mensaje or whatsApp
                  await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes`, {
                    cliente: clientFound[0].nombres,
                    number: clientFound[0].celular,
                    urlPDF: pathPDF,
                    urlXML: pathXML,
                    clave_acceso: claveAcceso,
                    num_comprobante: numComprobante,
                    empresa: infoCompany[0].company_id.nombre_comercial,
                    telefono: this.convertirFormatoTelefono(infoCompany[0].company_id.telefono)
                  });

                } catch (error) {
                  console.log( error );
                }
              }

            }
          }
        }, 2900)
      }
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

  async crearAndFirmarXML(xml, nombreComercial, claveAcceso, company_id, tipo_comprobante, entity_id = ''){

    const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }`);

    const java = process.env.JAVA_PATH;
    const pathCertificado = path.resolve(__dirname, `../../../static/SRI/FIRMAS/${ company_id.archivo_certificado }`);
    const carpeta_comprobante = tipo_comprobante == 'factura' ? 'facturas' : 'notasCreditos'
    try {
      await fs.mkdirSync(path.dirname(`${ pathXML }/${ carpeta_comprobante }/Generados/${ claveAcceso }.xml`), {recursive: true, })
      await fs.writeFileSync(`${ pathXML }/${ carpeta_comprobante }/Generados/${ claveAcceso }.xml`, xml, {flag: 'w+', encoding: 'utf-8'})

      await fs.mkdirSync(path.dirname(`${ pathXML }/${ carpeta_comprobante }/Firmados/${ claveAcceso }.xml`), {recursive: true})
      await fs.writeFileSync(`${ pathXML }/${ carpeta_comprobante }/Firmados/${ claveAcceso }.xml`, '', {flag: 'w+', encoding: 'utf-8'})
    } catch (err) {
      return console.log(err)
    }

    //------------------------------------- Firmar XML------------------------------------
    const cmd = java + ' -jar "' + path.resolve('static/resource/jar/firmaxml1 (1).jar') + '" "' + `${ pathXML }/${ carpeta_comprobante }/Generados/${ claveAcceso }.xml` + '" "' + pathCertificado + '" "' + company_id.clave_certificado + '" "' + `${ pathXML }/${ carpeta_comprobante }/Firmados/${ claveAcceso }.xml` + '"';

    try {
      await execSync(cmd)
      return true;
    } catch (err) {
      if (entity_id != '')
        await this.invoiceService.update( entity_id, { estadoSRI: 'NO SE ENCONTRO LA FIRMA' });

      console.log('error firma: ', err)

      return false;
    }
    //------------------------------------------------------------------------------------
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

  async reeenviarRecepcionComprobantesOffline( datosFactura ){

    const nombreComercial = datosFactura.clave_acceso.slice(10, 23);

    let host = ( datosFactura.ambiente === 'PRUEBA')
              ? 'https://celcer.sri.gob.ec'
              : 'https://cel.sri.gob.ec';

    const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }`);
    const clientFound = await this.customerService.findOne( datosFactura.customer_id );
    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: { direccion: true, ambiente: true,
        company_id: {
          ruc: true, razon_social: true, direccion_matriz: true,
          obligado_contabilidad: true, nombre_comercial: true, clave_certificado: true,
          archivo_certificado: true, email: true, telefono: true, logo: true
        }
      },
      where: { id: datosFactura.sucursal_id }
    });

    let xmlFile = await fs.readFileSync(`${pathXML}/${ datosFactura.tipo_comprobante == 'factura' ? 'facturas' : 'notasCreditos' }/Generados/${datosFactura.clave_acceso}.xml`, 'utf-8');

    const parser = new XMLParser();
    const jObj = parser.parse( xmlFile );

    const claveAcceso = await this.getClaveAcceso( datosFactura.sucursal_id, datosFactura.tipo_comprobante );
    const { numComprobante } = await this.getNumComprobante( datosFactura.sucursal_id, datosFactura.tipo_comprobante );

    const tipo_comprobante = datosFactura.tipo_comprobante == 'factura' ? 'factura' : 'notaCredito'
    const type_info = tipo_comprobante == 'factura' ? 'infoFactura' : 'infoNotaCredito'

    jObj[tipo_comprobante].infoTributaria.claveAcceso = claveAcceso
    jObj[tipo_comprobante].infoTributaria.codDoc      = datosFactura.tipo_comprobante == 'factura' ? '01' : '04'
    jObj[tipo_comprobante].infoTributaria.estab       = numComprobante.split('-')[0].padStart(3, '0')
    jObj[tipo_comprobante].infoTributaria.ptoEmi      = numComprobante.split('-')[1].padStart(3, '0')
    jObj[tipo_comprobante].infoTributaria.secuencial  = numComprobante.split('-')[2].padStart(9, '0')
    jObj[tipo_comprobante].infoTributaria.ruc         = jObj[tipo_comprobante].infoTributaria.ruc.toString().padStart(13, '0')

    let totalCaracteres;
    if (jObj[tipo_comprobante][type_info].tipoIdentificacionComprador == 4) totalCaracteres = 13
    if (jObj[tipo_comprobante][type_info].tipoIdentificacionComprador == 5) totalCaracteres = 10

    jObj[tipo_comprobante][type_info].identificacionComprador = jObj[tipo_comprobante][type_info].identificacionComprador.toString().padStart(totalCaracteres, '0')

    if (tipo_comprobante == 'factura')
      jObj[tipo_comprobante][type_info].pagos.pago.formaPago = jObj[tipo_comprobante][type_info].pagos.pago.formaPago.toString().padStart(2, '0')

    if (tipo_comprobante == 'notaCredito')
      jObj[tipo_comprobante][type_info].codDocModificado = jObj[tipo_comprobante][type_info].codDocModificado.toString().padStart(2, '0')

    jObj[tipo_comprobante][type_info].tipoIdentificacionComprador = jObj[tipo_comprobante][type_info].tipoIdentificacionComprador.toString().padStart(2, '0')

    const campoAdicional = [{
      '@nombre': 'Descripcion',
      '#text': jObj[tipo_comprobante].infoAdicional.campoAdicional.trim().length == 0
                ? 'Sin descripcion'
                : this.escapeHtml(jObj[tipo_comprobante].infoAdicional.campoAdicional)
    }];

    let obj: any = {}
    if (tipo_comprobante == 'factura') {
      obj = {
        factura: {
          '@id': 'comprobante',
          '@version': "1.0.0",
          infoTributaria: jObj[tipo_comprobante].infoTributaria,
          infoFactura: jObj[tipo_comprobante][type_info],
          detalles: { detalle: jObj[tipo_comprobante].detalles.detalle },
          infoAdicional: { campoAdicional }
        }
      }
    }
    else {
      obj = {
        notaCredito: {
          '@id': 'comprobante',
          '@version': "1.0.0",
          infoTributaria: jObj[tipo_comprobante].infoTributaria,
          infoNotaCredito: jObj[tipo_comprobante][type_info],
          detalles: { detalle: jObj[tipo_comprobante].detalles.detalle },
          infoAdicional: { campoAdicional }
        }
      }
    }

    var xml = builder.create(obj, { encoding: 'UTF-8' }).end({ pretty: true});

    const firmado = await this.crearAndFirmarXML(xml, nombreComercial, claveAcceso, infoCompany[0].company_id, datosFactura.tipo_comprobante)

    if ( firmado ) {
      let recibida = false;
      try {
        recibida = await this.recepcionComprobantesOffline(
          nombreComercial, claveAcceso,
          datosFactura.pago_id, datosFactura.tipo_comprobante,
          host, pathXML, datosFactura.user_id,
          xml, datosFactura.entity, numComprobante
        );
      } catch (error) {
        return new BadRequestException("ERROR ENVIO RECEPCION");
      }

      let autorizado = false;
      if( recibida ){

        // ---------------------- AUMENTAR EL SECUENCIAL FACTURA -------------------
        const secuencial = numComprobante.split('-')[2];
        let option: any = {};

        if ( datosFactura.ambiente == 'PRUEBA' && datosFactura.tipo_comprobante == 'factura')
          option.secuencia_factura_pruebas = parseInt( secuencial ) + 1;
        if ( datosFactura.ambiente == 'PRUEBA' && datosFactura.tipo_comprobante == 'nota_credito')
          option.secuencia_nota_credito_pruebas = parseInt( secuencial ) + 1;
        if ( datosFactura.ambiente == 'PRODUCCION' && datosFactura.tipo_comprobante == 'factura')
          option.secuencia_factura_produccion = parseInt( secuencial ) + 1;
        if ( datosFactura.ambiente == 'PRODUCCION' && datosFactura.tipo_comprobante == 'nota_credito')
          option.secuencia_nota_credito_produccion = parseInt( secuencial ) + 1;

        const sucursal: any = datosFactura.sucursal_id;
        await this.sucursalRepository.update( sucursal, option );
        // --------------------------------------------------------------------------

        setTimeout(async () => {
          try {
            autorizado = await this.autorizacionComprobantesOffline( host, claveAcceso, datosFactura.pago_id, datosFactura.user_id, nombreComercial, datosFactura.tipo_comprobante, numComprobante, datosFactura.entity)
          } catch (error) {
            return { ok: false }
          }

          if( autorizado ) {

            try {
              const factura = new Factura();
              const pathPDF = await factura.generarFacturaPDF( claveAcceso, infoCompany[0], numComprobante, clientFound[0], datosFactura, datosFactura.porcentaje_iva);
              const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/facturas/Autorizados/${ claveAcceso }.xml`);

              const comprobantes = { xml: pathXML, pdf: pathPDF, tipo: 'factura' }

              await this.emailService.sendComprobantes(clientFound[0], infoCompany[0], numComprobante, claveAcceso, comprobantes);

              await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes`, {
                cliente: clientFound[0].nombres,
                number: clientFound[0].celular,
                urlPDF: pathPDF,
                urlXML: pathXML,
                clave_acceso: claveAcceso,
                num_comprobante: numComprobante,
                empresa: infoCompany[0].company_id.nombre_comercial,
                telefono: this.convertirFormatoTelefono(infoCompany[0].company_id.telefono)
              });
            } catch (error) {
              console.log(error);
            }
          }
        }, 3000)
      }
    }
  }

  async reeenviarAutorizacionComprobantesOffline( datosFactura ){

    const nombreComercial = datosFactura.clave_acceso.slice(10, 23);
    let host = ( datosFactura.ambiente === 'PRUEBA') ? 'https://celcer.sri.gob.ec' : 'https://cel.sri.gob.ec';
    const clientFound = await this.customerService.findOne( datosFactura.customer_id );
    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: { direccion: true, ambiente: true,
        company_id: {
          ruc: true, razon_social: true, direccion_matriz: true,
          obligado_contabilidad: true, nombre_comercial: true, clave_certificado: true,
          archivo_certificado: true, email: true, telefono: true, logo: true
        }
      },
      where: { id: datosFactura.sucursal_id }
    });

    try {
      await this.autorizacionComprobantesOffline( host, datosFactura.clave_acceso, datosFactura.pago_id, datosFactura.user_id, nombreComercial, datosFactura.tipo_comprobante, datosFactura.num_comprobante, datosFactura.entity)
    } catch (error) {
      return { ok: false }
    }

    if ( datosFactura.tipo_comprobante == 'factura' ) {
      const factura = new Factura();
      const pathPDF = await factura.generarFacturaPDF( datosFactura.clave_acceso, infoCompany[0], datosFactura.num_comprobante, clientFound[0], datosFactura, datosFactura.porcentaje_iva);
      const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/facturas/Autorizados/${ datosFactura.clave_acceso }.xml`);

      const comprobantes = { xml: pathXML, pdf: pathPDF, tipo: 'factura' }

      await this.emailService.sendComprobantes(clientFound[0], infoCompany[0], datosFactura.num_comprobante, datosFactura.clave_acceso, comprobantes);

      //Enviar mensaje or whatsApp
      try {
        await axios.post(`${ process.env.HOST_API_WHATSAPP }/send-comprobantes`, {
          cliente: clientFound[0].nombres,
          number: clientFound[0].celular,
          urlPDF: pathPDF,
          urlXML: pathXML,
          clave_acceso: datosFactura.clave_acceso,
          num_comprobante: datosFactura.num_comprobante,
          empresa: infoCompany[0].company_id.nombre_comercial,
          telefono: this.convertirFormatoTelefono(infoCompany[0].company_id.telefono)
        });
      } catch (error) {
        console.log( "error" );
      }
    }

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
        const nombreComercial = sucursal_id.company_id.ruc;
        pathPDF = path.resolve(__dirname, `../../../static/SRI/PDF/${ clave_acceso }.pdf`);
        pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/facturas/Autorizados/${ clave_acceso }.xml`);

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
