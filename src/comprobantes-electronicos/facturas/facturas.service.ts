import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from '../../customers/customers.service';
import { InvoicesService } from 'src/invoices/invoices.service';
import { EmailService } from 'src/email/email.service';
import { MessagesWsService } from 'src/messages-ws/messages-ws.service';
import { Proforma } from '../plantillas/proforma';
import { Factura } from '../plantillas/factura';
const axios = require('axios');
const moment = require('moment');
const builder = require("xmlbuilder");
const fs = require("fs");
const path = require('path');
const { execSync } = require('node:child_process');
const XMLParser = require("fast-xml-parser").XMLParser;

@Injectable()
export class FacturasService {

  constructor(
    @InjectRepository( Sucursal )
    private readonly sucursalRepository: Repository<Sucursal>,
    @Inject(forwardRef(() => InvoicesService))
    private invoiceService: InvoicesService,
    private readonly customerService: CustomersService,
    private readonly emailService: EmailService,
    private readonly messageWsService: MessagesWsService
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

  async getNumComprobante( sucursal_id: any, tipo: string = 'factura' ){
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
    
    const fechaEmision    = moment().format('DDMMYYYY');
    const tipoComprobante = tipo == 'factura' ? '01' : '04'; 
    const ruc             = infoCompany[0].company_id.ruc
    const ambiente        = infoCompany[0].ambiente === 'PRUEBA' ? '1' : '2' ;
    const serie           = codigoEstablecimiento + '' + puntoEmision;
    const codigoNumerico  = Date.now().toString(10).substring(5);
    const tipoEmision     = '1' //Emision Normal

    let claveAcceso = fechaEmision + tipoComprobante + ruc + ambiente + serie + secuencia + codigoNumerico + tipoEmision;

    const digitoVerificador = this.calcularDigitoVerificadorMod11( claveAcceso );

    return `${claveAcceso + digitoVerificador}`;
  }

  async generarNotaCredito( datosFactura ){   
    
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
            codigoPorcentaje: parseFloat(datosFactura.iva) > 0 ? 2 : 0,
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
              codigoPorcentaje: item.product_id.aplicaIva ? 2 : 0,
              tarifa: item.product_id.aplicaIva ? 12 : 0,
              baseImponible: precioTotalSinImpuesto,
              valor: item.product_id.aplicaIva ? ( parseFloat(precioTotalSinImpuesto) * 0.12).toFixed(2) : (0).toFixed(2) 
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

    const nombreComercial = infoCompany[0].company_id.nombre_comercial.split(' ').join('-');

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
      recibida = await this.recepcionComprobantesOffline( nombreComercial, claveAcceso, datosFactura.id, 'nota_credito', host, pathXML,   datosFactura.user_id.id, xml );
    } catch (error) {
      return { ok: false }
    }

    if( recibida ){
      setTimeout(async () => {
        let autorizado;
        try {
          autorizado = this.autorizacionComprobantesOffline( host, claveAcceso, datosFactura.id, datosFactura.user_id.id, nombreComercial, 'nota_credito', datosFactura.numero_comprobante);                    
        } catch (error) {
          return { ok: false }
        }

        if ( autorizado ) {
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
        }
        return { ok: true }
      }, 2500)
    } 
  }

  recepcionComprobantesOffline( nombreComercial, claveAcceso, invoice_id, tipo, host, pathXML, user_id, xml ){
    return new Promise(async (resolve, reject) => {
      let signedXml = null;

      try {
          const xmlOut = await fs.readFileSync(`${ pathXML }/${ tipo == 'nota_credito' ? 'notasCreditos' : 'facturas' }/Firmados/${ claveAcceso }.xml`);
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
      } catch (err) {
        console.log('error axio:', err)
        await this.invoiceService.update( invoice_id, { estadoSRI: `ERROR ENVIO RECEPCION ${ tipo == 'nota_credito' ? '- ANULACION' : ''}` } );
        this.messageWsService.updateStateInvoice( user_id );
        return reject( false );
      }

      //-------------------------- Leer xml de respuesta del SRI ------------------------------
      if (resp !== null && resp.status === 200) {
        const parser = new XMLParser();
        const jObj = parser.parse( resp.data );

        const estado = jObj['soap:Envelope']['soap:Body']['ns2:validarComprobanteResponse']['RespuestaRecepcionComprobante']['estado'];

        await this.invoiceService.update( invoice_id, { estadoSRI: `${ tipo == 'nota_credito' ? 'ANULACION -' : '' } ${ estado }` } )
        
        if ('DEVUELTA' === estado) {
            const comprobantes = jObj['soap:Envelope']['soap:Body']['ns2:validarComprobanteResponse']['RespuestaRecepcionComprobante']['comprobantes'];

            try {
              const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/${ tipo == 'nota_credito' ? 'notasCreditos' : 'facturas' }/Devueltos/${ claveAcceso }.xml`);

              const respuestaSRI = xml.substring(0, xml.length - 10) + '\n \t' + resp.data + `\n \n</${ tipo == 'nota_credito' ? 'notasCredito' : 'factura' }>`;

              await fs.mkdirSync(path.dirname(pathXML), {recursive: true, })
              await fs.writeFileSync(pathXML, respuestaSRI, {flag: 'w+', encoding: 'utf-8'});
            } catch (err) {
                console.log(err)
            }

            const mensaje = comprobantes.comprobante.mensajes.mensaje;
            const infoAdicional = mensaje?.informacionAdicional || 'NO HAY INFO ADICIONAL'

            const respuestaSRI = `MENSAJE: ${ mensaje.mensaje } - INFOADICIONAL: ${ infoAdicional }`
            
            await this.invoiceService.update( invoice_id, { respuestaSRI } )
            this.messageWsService.updateStateInvoice( user_id );
            reject( false );
        }
        resolve( true )
      }
    });
  }

  autorizacionComprobantesOffline( host, accessKey, invoice_id, user_id, nombreComercial, tipo, numComprobante ){
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
  
      try {
        resp = await axios(config);
      } catch (err) {
        console.log('error axio:', err);
        reject( false );
        await this.invoiceService.update( invoice_id, { 
          estadoSRI: `ERROR ENVIO AUTORIZACION ${ tipo == 'nota_credito' ? '- ANULACION' : '' } :` 
        });
      }
  
      if (resp !== null && resp.status === 200) {
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
        
        this.messageWsService.updateStateInvoice( user_id );

        if (tipo == 'nota_credito' && estado == 'AUTORIZADO') estado = 'ANULADO';
  
        try {
          const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/${ tipo == 'nota_credito' ? 'notasCreditos' : 'facturas' }/${ directorio }/${ accessKey }.xml`);
  
          await fs.mkdirSync(path.dirname(pathXML), {recursive: true, })
          await fs.writeFileSync(pathXML, resp.data, {flag: 'w+', encoding: 'utf-8'});
  
          await this.invoiceService.update( invoice_id, { 
            numero_comprobante: numComprobante, 
            clave_acceso: accessKey, 
            estadoSRI: estado.trim(), 
            respuestaSRI  
          });
  
          if ( estado == 'AUTORIZADO' || estado == 'ANULADO') resolve( true );
          else reject( false );
          
        } catch (err) {
          console.log(err)
        }
      }else{
        reject( false )
      }
    })    
  }

  async generarFacturaElectronica( datosFactura, claveAcceso, sucursal_id: any, invoice_id: string = null){   

    if ( datosFactura.tipo == 'EMISION' ) 
      claveAcceso = await this.getClaveAcceso( sucursal_id );

    const clientFound = await this.customerService.findOne( datosFactura.customer_id );
    const { numComprobante, ambiente } = await this.getNumComprobante( sucursal_id );
      
    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: { 
        direccion: true,
        ambiente: true,
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
      where: { id: sucursal_id }
    });

    const nombreComercial = infoCompany[0].company_id.nombre_comercial.split(' ').join('-');

    const infoTributaria = {
      ambiente:     ( ambiente == 'PRUEBA') ? 1 : 2,
      tipoEmision:  1,
      razonSocial:  infoCompany[0].company_id.razon_social,
      ruc:          infoCompany[0].company_id.ruc,
      claveAcceso:  claveAcceso,
      codDoc:       '01', //Factura
      estab:        numComprobante.split('-')[0],
      ptoEmi:       numComprobante.split('-')[1],
      secuencial:   numComprobante.split('-')[2],
      dirMatriz:    infoCompany[0].company_id.direccion_matriz
    };

    //------ OBTENER LA SUMA DE TODOS LOS ARTICULOS QUE APLICAN IVA Y DESCUENTOS ------------
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
        dirEstablecimiento:           infoCompany[0].direccion,
        obligadoContabilidad:         infoCompany[0].company_id.obligado_contabilidad ? 'SI' : 'NO',
        tipoIdentificacionComprador:  clientFound[0].tipo_documento,
        razonSocialComprador:         clientFound[0].nombres,
        identificacionComprador:      clientFound[0].numero_documento,
        direccionComprador:           clientFound[0].direccion,
        totalSinImpuestos:            ( datosFactura.subtotal - datosFactura.descuento ).toFixed(2),
        totalDescuento:               datosFactura.descuento,
        totalConImpuestos: { 
          totalImpuesto: {
            codigo: 2,
            codigoPorcentaje: datosFactura.iva > 0 ? 2 : 0,
            baseImponible: datosFactura.iva > 0 ? parseFloat(sumaPrecioTotalSinImpuesto.toString()).toFixed(2) : datosFactura.total,
            tarifa: datosFactura.iva > 0 ? 12 : 0,
            valor: datosFactura.iva ? datosFactura.iva : (0).toFixed(2)
          }
        },
        propina: 0.00,
        importeTotal: datosFactura.total,
        moneda: 'DOLAR',
        pagos: {
          pago: {
            formaPago: '01',
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
          codigoPrincipal: item.codigoBarra,
          descripcion: item.nombre,
          cantidad: item.cantidad, 
          precioUnitario: parseFloat(item.pvp).toFixed(2),
          descuento: parseFloat(subtotalConDescuento.toString()).toFixed(2),
          precioTotalSinImpuesto: precioTotalSinImpuesto,
          impuestos: {
            impuesto: {
              codigo: 2,
              codigoPorcentaje: item.aplicaIva ? 2 : 0,
              tarifa: item.aplicaIva ? 12 : 0,
              baseImponible: precioTotalSinImpuesto,
              valor: item.aplicaIva ? ( parseFloat(precioTotalSinImpuesto) * 0.12).toFixed(2) : (0).toFixed(2) 
            }
          }
        })       
    });

    const campoAdicional = [{
      '@nombre': 'Email',
      '#text': clientFound[0].nombres == 'CONSUMIDOR FINAL' ? 'abc@gmail.com' : clientFound[0].email
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

    const java = process.env.JAVA_PATH;
    const pathCertificado = path.resolve(__dirname, `../../../static/SRI/FIRMAS/${ infoCompany[0].company_id.archivo_certificado }`);

    try {
      await fs.mkdirSync(path.dirname(`${ pathXML }/facturas/Generados/${ claveAcceso }.xml`), {recursive: true, })
      await fs.writeFileSync(`${ pathXML }/facturas/Generados/${ claveAcceso }.xml`, xml, {flag: 'w+', encoding: 'utf-8'})

      await fs.mkdirSync(path.dirname(`${ pathXML }/facturas/Firmados/${ claveAcceso }.xml`), {recursive: true})
      await fs.writeFileSync(`${ pathXML }/facturas/Firmados/${ claveAcceso }.xml`, "", {flag: 'w+', encoding: 'utf-8'})
    } catch (err) {
      return console.log(err)
    }
    
    //------------------------------------- Firmar XML------------------------------------
    const cmd = java + ' -jar "' + path.resolve('static/resource/jar/firmaxml1 (1).jar') + '" "' + `${ pathXML }/facturas/Generados/${ claveAcceso }.xml` + '" "' + pathCertificado + '" "' + infoCompany[0].company_id.clave_certificado + '" "' + `${ pathXML }/facturas/Firmados/${ claveAcceso }.xml` + '"';

    try {
      await execSync(cmd)
    } catch (err) {
      return console.log('error firma: ', err)
    }
    //------------------------------------------------------------------------------------

    let host = ( ambiente === 'PRUEBA') ? 'https://celcer.sri.gob.ec' : 'https://cel.sri.gob.ec';
    
    let recibida;
    try {
      recibida = await this.recepcionComprobantesOffline(nombreComercial, claveAcceso, invoice_id, 'factura', host, pathXML, datosFactura.user_id, xml )      
    } catch (error) {
      return { ok: false }
    }

    let autorizado;
    if( recibida ){
      setTimeout(async () => {
        try {
          autorizado = await this.autorizacionComprobantesOffline( host, claveAcceso, invoice_id, datosFactura.user_id, nombreComercial, 'factura', numComprobante)    
        } catch (error) {
          return { ok: false }
        }

        if( autorizado ) {
          // ---------------------- AUMENTAR EL SECUENCIAL FACTURA -------------------
          const secuencial = numComprobante.split('-')[2];
          let option: any = {};
          
          if ( ambiente == 'PRUEBA' ) 
            option.secuencia_factura_pruebas = parseInt( secuencial ) + 1;
          else
            option.secuencia_factura_produccion = parseInt( secuencial ) + 1;
          
          const sucursal: any = sucursal_id;
          await this.sucursalRepository.update( sucursal, option );
          // --------------------------------------------------------------------------

          if (clientFound[0].nombres !== 'CONSUMIDOR FINAL') {
            const factura = new Factura();    
            const pdfBuffer = await factura.generarFacturaPDF( claveAcceso, infoCompany[0], numComprobante, clientFound[0], datosFactura);
            const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/facturas/Autorizados/${ claveAcceso }.xml`);
  
            const comprobantes = { xml: pathXML, pdf: pdfBuffer, tipo: 'factura' } 
  
            this.emailService.sendComprobantes(clientFound[0], infoCompany[0], numComprobante, claveAcceso, comprobantes);            
          }
        }
      }, 2900)
    } 
  }

  async generarProforma(datosFactura, sucursal_id: any){   
    const clientFound = await this.customerService.findOne( datosFactura.customer_id );
    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: { 
        company_id: { 
          ruc: true, 
          razon_social: true, 
          direccion_matriz: true, 
          nombre_comercial: true, 
          telefono: true,
          logo: true 
        } 
      },
      where: { id: sucursal_id }
    });

    const proforma = new Proforma()
    const data = await proforma.generarProformaPDF(datosFactura, clientFound, infoCompany);

    this.emailService.sendComprobantes(clientFound[0], infoCompany[0], '', '', data);
  }
}
