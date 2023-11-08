import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from '../../customers/customers.service';
import { InvoicesService } from 'src/invoices/invoices.service';
import { EmailService } from 'src/email/email.service';
import { MessagesWsService } from 'src/messages-ws/messages-ws.service';
const axios = require('axios');
const moment = require('moment');
const builder = require("xmlbuilder");
const fs = require("fs");
const path = require('path');
// const pdf = require('html-pdf');
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

//   formatInvoice = (cliente, detalle, claveAcceso, numFactura, valoresFactura) => {
//     let plantilla = /*html*/`<!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="utf-8">
//         <title>Example 1</title>
//         <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js"></script>
//         <style>
//         div {
//   border: 1px solid blue;
//   padding: 5px;
// }

// .clearfix {
//   overflow: auto;
// }

// nav {
//   float: left;
//   width: 30%;
//   border: 1px solid #73AD21;
//   padding-left: 5px;
//   margin: 5px;
// }

// section {
//   float: left;
//   width: 65%;
//   border: 1px solid red;
//   padding: 10px;
//   margin: 5px;
// }

// span {
//   font-size:18px;
//   font-weight: bold;
// }  
//         </style>
//       </head>
//       <body>       
      
// <div class="clearfix">

// <nav>
//   <span>nav</span>
//     <ul>
//       <li><a target="_blank" href="/default.asp">Home</a></li>
//       <li><a target="_blank" href="https://www.w3schools.com/css/default.asp">CSS</a></li>
//       <li><a target="_blank" href="https://www.w3schools.com/html/default.asp">HTML</a></li>
//       <li><a target="_blank" href="https://www.w3schools.com/js/default.asp">JavaScript</a></li>
//     </ul>
//   </nav>

//   <section>
//     <span>CSS Layout</span>
//     <p>La propiedad floar especifica si un elemento debe flotar.
      
//     La propiedad clear se utiliza para controlar el comportamiento de los elementos flotantes.</p>
//   </section>

//   <section>
//     <span>Section</span>
//     <p>En su uso más simple, la propiedad float se puede utilizar para realizar la composición de los elementos.

//     Como en este caso que determina la situación de Nav y Section.</p>
//   </section>

// </div>
            
//       </body>
//     </html>`

//     return plantilla;
//   }

//   createInvoicePDF = ( cliente, detalle, claveAcceso, numFactura, valoresFactura ) => {

//       const content = this.formatInvoice(cliente, detalle, claveAcceso, numFactura, valoresFactura);    

//       const options = { 
//         childProcessOptions: {
//           env: {
//             OPENSSL_CONF: '/dev/null',
//           },
//         },
//         border: {
//           "top": "12px",           
//           "right": "50px",
//           "bottom": "12px",
//           "left": "50px"
//         }, 
//       };

//       try {
//         const pathPDF = path.resolve(__dirname, `../../../static/SRI/RED-NUEVA-CONEXION/PDF/${ claveAcceso }.pdf`);

//         pdf.create(content, options).toFile(pathPDF, async function(err, res) {
//             if (err){
//                 console.log(err);
//             } else {
//               console.log( "pdf creado" );
//               // sendEmailHelper( cliente.email, claveAcceso, numFactura )
//             }
//         });      
//       } catch (error) {
//         console.log( error );
//       }
//   }


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

  async getNumComprobante( sucursal_id: any ){
    const queryBuilder = this.sucursalRepository.createQueryBuilder('sucursal'); 
    let valores = await queryBuilder
      .select(["establecimiento", "punto_emision", "ambiente"])
      .addSelect(`CASE
                  WHEN (ambiente = 'PRODUCCION') THEN sucursal.secuencia_factura_produccion
                  ELSE sucursal.secuencia_factura_pruebas
              END`, "secuencial")
      .where("id = :id", { id: sucursal_id })
      .getRawOne();

    console.log( valores );
    
    valores.establecimiento = valores.establecimiento.toString().padStart(3, '0')
    valores.punto_emision   = valores.punto_emision.toString().padStart(3, '0')
    valores.secuencial      = valores.secuencial.toString().padStart(9, '0')

    const numComprobante = `${ valores.establecimiento }-${ valores.punto_emision }-${ valores.secuencial }`

    return { numComprobante, ambiente: 'PRUEBA' };
  }

  async getClaveAcceso( sucursal_id: Sucursal ){

    const sucursal: any = sucursal_id;

    const { numComprobante } = await this.getNumComprobante( sucursal );

    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: { ambiente: true , company_id: { ruc: true } },
      where: { id: sucursal }
    });

    const codigoEstablecimiento = numComprobante.split('-')[0];
    const puntoEmision = numComprobante.split('-')[1];
    const secuencia = numComprobante.split('-')[2];
    
    const fechaEmision = moment().format('DDMMYYYY');
    const tipoComprobante = '01' //Factura
    const ruc = infoCompany[0].company_id.ruc
    const ambiente = infoCompany[0].ambiente === 'PRUEBA' ? '1' : '2' ;
    const serie = codigoEstablecimiento + '' + puntoEmision;
    const codigoNumerico = Date.now().toString(10).substring(5);
    const tipoEmision = '1' //Emision Normal

    let claveAcceso = fechaEmision + tipoComprobante + ruc + ambiente + serie + secuencia + codigoNumerico + tipoEmision;

    const digitoVerificador = this.calcularDigitoVerificadorMod11( claveAcceso );

    return `${claveAcceso + digitoVerificador}`;

  }

  async generarFacturaElectronica( 
    cliente_id: any, claveAcceso: string, sucursal_id: any,
    subtotal, iva, descuento, total, items, invoice_id: string = null, tipo: string, user_id: any
    ){   

    if ( tipo == 'EMISION' ) 
      claveAcceso = await this.getClaveAcceso( sucursal_id );

    const clientFound = await this.customerService.findOne( cliente_id );
    const { numComprobante, ambiente } = await this.getNumComprobante( sucursal_id );
      
    const infoCompany = await this.sucursalRepository.find({
      relations: { company_id: true },
      select: { 
        direccion: true,
        ambiente: true, 
        company_id: { ruc: true, razon_social: true, direccion_matriz: true, 
            obligado_contabilidad: true, nombre_comercial: true, clave_certificado: true, archivo_certificado: true } 
      },
      where: { id: sucursal_id }
    });

    const nombreComercial = infoCompany[0].company_id.nombre_comercial.split(' ').join('-');

    const infoTributaria = {
      ambiente:     ( infoCompany[0].ambiente == 'PRUEBA') ? 1 : 2,
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

    //OBTENER LA SUMA DE TODOS LOS ARTICULOS QUE APLICAN IVA Y DESCUENTOS
    let sumaPrecioTotalSinImpuesto = 0;      

    items.forEach((item: any) => {   
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
        totalSinImpuestos:            subtotal,
        totalDescuento:               descuento,
        totalConImpuestos: { 
          totalImpuesto: {
            codigo: 2,
            codigoPorcentaje: iva > 0 ? 2 : 0,
            baseImponible: iva > 0 ? parseFloat(sumaPrecioTotalSinImpuesto.toString()).toFixed(2) : total,
            tarifa: iva > 0 ? 12 : 0,
            valor: iva ? iva : (0).toFixed(2)
          }
        },
        propina: 0.00,
        importeTotal: total,
        moneda: 'DOLAR',
        pagos: {
          pago: {
            formaPago: '01',
            total: total
          }
        }
    };

    const detalle = []
  
    items.forEach((item) => {   
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
    
    const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/Generados/${ claveAcceso }.xml`);
    const pathPDF = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/PDF`);
    const xmlOutPath = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/Firmados/${ claveAcceso }.xml`);

    const java = process.env.JAVA_PATH;
    const pathCertificado = path.resolve(__dirname, `../../../static/SRI/FIRMAS/${ infoCompany[0].company_id.archivo_certificado }`);

    try {
      await fs.mkdirSync(path.dirname(pathXML), {recursive: true, })
      await fs.writeFileSync(pathXML, xml, {flag: 'w+', encoding: 'utf-8'})
    } catch (err) {
      console.log(err)
    }

    try {
      await fs.mkdirSync(path.dirname(xmlOutPath), {recursive: true})
      await fs.writeFileSync(xmlOutPath, "", {flag: 'w+', encoding: 'utf-8'})
    } catch (err) {
      console.log(err)
    }

    try {
      await fs.mkdirSync(path.dirname(pathPDF), {recursive: true})
    } catch (err) {
      console.log(err)
    }

    //--------------- PROBAR GENERACION PDF---------
    // this.createInvoicePDF('1', '2', claveAcceso, '4', '5')
    //---------------------------------------------
    
    //---------------- Firmar XML--------------------------
    const cmd = java + ' -jar "' + path.resolve('static/resource/jar/firmaxml1 (1).jar') + '" "' + pathXML + '" "' + pathCertificado + '" "' + infoCompany[0].company_id.clave_certificado + '" "' + xmlOutPath + '"';

    try {
        await execSync(cmd)
    } catch (err) {
        console.log('error firma: ', err)
    }
    //------------------------------------------------------
    
    //ENVIAR AL SRI
    let signedXml = null;

    try {
        const xmlOut = await fs.readFileSync(xmlOutPath);
        signedXml = xmlOut.toString('base64');
    } catch (err) {
        console.log('error firma: ', err)
    }

    let host = (infoCompany[0].ambiente === 'PRUEBA') ? 'https://celcer.sri.gob.ec' : 'https://cel.sri.gob.ec';

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
      await this.invoiceService.update( invoice_id, { estadoSRI: "ERROR AL ENVIO SRI" } );
      return this.messageWsService.updateStateInvoice( user_id );
    }

    //----------------- Aumentar Secuencial de factura -----------------
    if ( tipo != 'PROFORMA' ) {
      const secuencial = numComprobante.split('-')[2];
      let option: any = {};
      
      if ( ambiente == 'PRUEBA' ) 
         option.secuencia_factura_pruebas = parseInt( secuencial ) + 1;
       else
       option.secuencia_factura_produccion = parseInt( secuencial ) + 1;
     
     const sucursal: any = sucursal_id;
     await this.sucursalRepository.update( sucursal, option );
    }
    // -----------------------------------------------------------------
    
    //Leer xml de respuesta del SRI
     if (resp !== null && resp.status === 200) {
      const parser = new XMLParser();
      const jObj = parser.parse( resp.data );

      const estado = jObj['soap:Envelope']['soap:Body']['ns2:validarComprobanteResponse']['RespuestaRecepcionComprobante']['estado'];

      await this.invoiceService.update( invoice_id, { estadoSRI: estado } )
      
      if ('DEVUELTA' === estado) {
          const comprobantes = jObj['soap:Envelope']['soap:Body']['ns2:validarComprobanteResponse']['RespuestaRecepcionComprobante']['comprobantes'];

          try {
              const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial }/Devueltos/${ claveAcceso }.xml`);

              const respuestaSRI = xml.substring(0, xml.length - 10) + '\n \t' + resp.data + '\n \n</factura>';

              await fs.mkdirSync(path.dirname(pathXML), {recursive: true, })
              await fs.writeFileSync(pathXML, respuestaSRI, {flag: 'w+', encoding: 'utf-8'});

          } catch (err) {
              console.log(err)
          }

          const mensaje = comprobantes.comprobante.mensajes.mensaje;
          const infoAdicional = mensaje?.informacionAdicional || 'NO HAY INFO ADICIONAL'

          const respuestaSRI = `MENSAJE: ${ mensaje.mensaje } - INFOADICIONAL: ${ infoAdicional }`
          
          await this.invoiceService.update( invoice_id, { respuestaSRI } )
          return this.messageWsService.updateStateInvoice( user_id );
      }else{
        setTimeout(async () =>{
            this.estadoXml( 
              nombreComercial, 
              claveAcceso, 
              infoCompany[0].ambiente, 
              invoice_id, 
              clientFound[0].email,
              numComprobante,
              user_id,
              infoCompany[0].company_id.id,  
            );
        }, 2700)
      }
    }
  }

  async estadoXml(nombreComercial, accessKey, ambiente, invoice_id, client_email, numComprobante, user_id, company_id) {
    
    let host = (ambiente === 'PRUEBA') ? 'https://celcer.sri.gob.ec' : 'https://cel.sri.gob.ec';

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
      await this.invoiceService.update( invoice_id, { estadoSRI: "ERROR COMPR ESTADO SRI" } );
    }

    if (resp !== null && resp.status === 200) {
      const parser = new XMLParser();
      const jObj = parser.parse(resp.data);

      const autorizacion = jObj['soap:Envelope']['soap:Body']['ns2:autorizacionComprobanteResponse']['RespuestaAutorizacionComprobante']['autorizaciones']['autorizacion'];

      let respuestaSRI = '';
      const estado = autorizacion['estado'];
      let directorio = ('AUTORIZADO' === estado) ? 'Autorizados' : 'NoAutorizados' ;

      if ( estado !== 'AUTORIZADO' ) {
        const mensaje = autorizacion.mensajes.mensaje;
        const infoAdicional = mensaje?.informacionAdicional || 'NO HAY INFO ADICIONAL'; 
        respuestaSRI = `MENSAJE: ${ mensaje.mensaje } - INFOADICIONAL: ${ infoAdicional }`
      }
      await this.invoiceService.update( invoice_id, { estadoSRI: estado, respuestaSRI } )
      this.messageWsService.updateStateInvoice( user_id );

      try {
        const pathXML = path.resolve(__dirname, `../../../static/SRI/${ nombreComercial.split(' ').join('-') }/${ directorio }/${ accessKey }.xml`);

        await fs.mkdirSync(path.dirname(pathXML), {recursive: true, })
        await fs.writeFileSync(pathXML, resp.data, {flag: 'w+', encoding: 'utf-8'});

        await this.invoiceService.update( invoice_id, { numero_comprobante: numComprobante, clave_acceso: accessKey } );

        //Enviar Correo
        this.emailService.sendComprobantes(client_email, accessKey, numComprobante, company_id);

      } catch (err) {
        console.log(err)
      }
    }
  }

}
