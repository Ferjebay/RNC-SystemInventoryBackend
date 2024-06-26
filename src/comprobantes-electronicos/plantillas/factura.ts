const puppeteer = require('puppeteer')
const moment = require('moment');
const { writeFile } = require('fs');
const path = require('path');

export class Factura {

    plantilla( infoCompany, claveAcceso, numComprobante, cliente, datosFactura, pathImage, iva ){
        const fechaEmision = moment().format('DD/MM/YYYY h:mm:ss a');
        let forma_pago = '';

        if ( datosFactura.forma_pago == '01' ) forma_pago = 'SIN UTILIZACION DEL SISTEMA FINANCIERO'
        if ( datosFactura.forma_pago == '15' ) forma_pago = 'COMPENSACIÓN DE DEUDAS'
        if ( datosFactura.forma_pago == '16' ) forma_pago = 'TARJETA DE DÉBITO'
        if ( datosFactura.forma_pago == '17' ) forma_pago = 'DINERO ELECTRÓNICO'
        if ( datosFactura.forma_pago == '18' ) forma_pago = 'TARJETA PREPAGO'
        if ( datosFactura.forma_pago == '19' ) forma_pago = 'TARJETA DE CRÉDITO'
        if ( datosFactura.forma_pago == '20' ) forma_pago = 'OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO'
        if ( datosFactura.forma_pago == '21' ) forma_pago = 'ENDOSO DE TÍTULOS'

        let html = /*html*/ `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <title>Document</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js"></script>
            <style>
              .backColor{
                background-color: #d5d7d9;
              }
              .borderTrBottom{
                padding-top: 5px;
                padding-bottom: 5px;
                border-bottom: 1px #dadae3 solid;
              }
            </style>
        </head>
        <body style="font-size: 15px; color: black;">
          <div class="row">

            <div class="col-6">
              <div class="mt-3 d-flex justify-content-center">
                <img src="${ pathImage }" style="width: auto;max-height: 117px;" class="rounded">
              </div>
              <div class="mt-1 backColor pt-1" style="padding-bottom: 40px;">
                <div style="padding-left: 13px">
                  <label class="d-block pt-3">
                    <span class="fw-bolder">Emisor:</span>
                    ${ infoCompany.company_id.nombre_comercial }
                  </label>
                  <label class="d-block pt-2">
                    <span class="fw-bolder">RUC:</span>
                    ${ infoCompany.company_id.ruc }
                  </label>
                  <label class="d-block pt-2">
                    <span class="fw-bolder">Matriz:</span>
                    ${ infoCompany.company_id.direccion_matriz }
                  </label>
                  <label class="d-block pt-2">
                    <span class="fw-bolder">Correo:</span>
                    ${ infoCompany.company_id.email }
                  </label>
                  <label class="d-block pt-2">
                    <span class="fw-bolder">Teléfono:</span>
                    ${ infoCompany.company_id.telefono }
                  </label>
                  <label class="d-block pt-2">
                    <span class="fw-bolder">Obligado a llevar contabilidad:</span>
                    ${ infoCompany.company_id.obligado_contabilidad ? 'SI' : 'NO' }
                  </label>
                </div>
              </div>
            </div>

            <div class="col-6">
              <div class="row">

                <div class="col-12 backColor" style="height: 30px;">
                </div>

                <div class="col-12 d-flex align-items-center
                  justify-content-between fw-bold"
                  style="height: 30px;">
                  <label>FACTURA</label>
                  <label>No. ${ numComprobante }</label>
                </div>

                <div class="mt-1 backColor py-3">
                  <div>
                    <label class="fw-bolder">
                      Número de Autorización:
                    </label>
                    <label style="font-size: 13px;width: 100%;word-wrap: break-word;">
                      ${ claveAcceso }
                    </label>
                  </div>
                  <div class="mt-3">
                    <label class="fw-bolder d-block">
                      Fecha y hora de Autorización:
                    </label>
                    <label>${ fechaEmision }</label>
                  </div>
                  <div class="mt-3">
                    <label class="d-block">
                      <span class="fw-bolder">Ambiente:</span> ${ infoCompany.ambiente == 'PRODUCCION' ? 'PRODUCCIÓN' : 'PRUEBA' }
                    </label>
                    <label class="d-block">
                      <span class="fw-bolder">Emisión:</span> NORMAL
                    </label>
                    <label class="d-block">
                      <span class="fw-bolder">
                        Clave de Acceso:
                      </span>
                      <div class="d-flex justify-content-center">
                        <svg id="barcode"></svg>
                      </div>
                    </label>
                  </div>
                </div>

              </div>
            </div>

            <div class="col-12 pb-3 backColor">
              <div class="row" style="padding-left: 13px;padding-right: 13px;">
                <div class="col-12 d-flex justify-content-between">
                  <label>
                    <span class="fw-bolder">Razón Social:</span>
                    ${ cliente.nombres }
                  </label>
                  <label style="width: 42%;">
                    <span class="fw-bolder">RUC/CI:</span>
                    ${ cliente.numero_documento }
                  </label>
                </div>
                <div class="col-12 d-flex justify-content-between py-2">
                  <label>
                    <span class="fw-bolder">Dirección:</span>
                    ${ cliente.direccion }
                  </label>
                  <label style="width: 42%;">
                    <span class="fw-bolder">Teléfono:</span>
                    ${ cliente.celular }
                  </label>
                </div>
                <div class="col-12 d-flex justify-content-between">
                  <label>
                    <span class="fw-bolder">Fecha Emisión:</span>
                     ${ moment().format('DD/MM/YYYY') }
                  </label>
                  <label style="width: 42%;">
                    <span class="fw-bolder">Correo:</span>
                    ${ cliente.email }
                  </label>
                </div>
              </div>
            </div>

            <div class="col-12 pt-5 pb-4" style="padding-top: 15px !important;">
              <table style="width: 100%;font-size: 13px;">
                <thead class="backColor">
                  <tr>
                    <th class="text-center" style="width: 10.2%;">
                      Código Principal
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Cantidad
                    </th>
                    <th class="text-center" style="width: 22.2%;">
                      Descripción
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Detalles Adicionales
                    </th>
                    <th class="text-center" style="width: 10.2%;">
                      Precio Unitario
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Descuento
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>`

              datosFactura.products.forEach(item => {
                html += `
                  <tr class="text-center borderTrBottom">
                      <td>${ item.codigoBarra }</td>
                      <td>${ item.cantidad }</td>
                      <td>${ item.nombre }</td>
                      <td></td>
                      <td>${ item.pvp }</td>
                      <td>${ item.descuento }%</td>
                      <td style="text-align: right">
                      ${ (Math.trunc((parseFloat(item.pvp) * parseInt(item.cantidad)) * 100) / 100).toFixed(2) }
                      </td>
                  </tr>`
              })

              html += `
                </tbody>
              </table>
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-12 backColor fs-6 fw-medium"
                  style="height: 30px;padding-left: 25px;">
                  Información Adicional
                </div>
                <div class="col-12" style="height: auto;padding-left: 25px;">
                  <label style="padding-left: 14px;text-align: justify">
                    ${
                      datosFactura.descripcion.trim().length == 0
                      ? 'No hay información adicional'
                      : datosFactura.descripcion.trim()
                    }
                  </label>
                </div>

                <div class="col-12 backColor fs-6 fw-medium mt-4"
                  style="height: 30px;padding-left: 25px;">
                  Formas de pago
                </div>

                <div class="col-12"
                  style="height: 30px;padding-left: 25px;">

                  <label class="fw-semibold pt-3"
                    style="width: 58%;font-size:12px">
                    ${ forma_pago }
                  </label>
                  <label style="width: 15%;text-align: center;">
                    ${ datosFactura.total.toFixed(2) }
                  </label>
                  <label style="width: 24%;text-align: right;">
                    0 días
                  </label>
                </div>
              </div>
            </div>

            <div class="col-6">
              <div class="row" style="text-align: right;font-size: 14px;">
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Subtotal Sin Impuestos:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    ${ datosFactura.subtotal.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Subtotal ${ iva }%:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    ${ datosFactura.subtotal.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Subtotal 0%:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    0.00
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Subtotal No Objeto IVA:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    0.00
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Descuentos:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                  ${ datosFactura.descuento.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    ICE:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    0.00
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    IVA ${ iva }%:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    ${ datosFactura.iva.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Servicio %:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    0.00
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Valor Total:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    ${ datosFactura.total.toFixed(2) }
                  </label>
                </div>
              </div>
            </div>
          </div>
          <script>
            JsBarcode("#barcode",
              '${ claveAcceso }',
              {
                format: "CODE128",
                height: 70,
                width: 1,
                fontSize: 11,
                margin: 5,
                background: '#d5d7d9'
              });
          </script>
        </body>
        </html>`
        return html;
    }

    async generarFacturaPDF( ...data ){

      const [ claveAcceso, infoCompany, numComprobante, client, datosFactura, iva ] = data;

      let imageName;
      if(infoCompany.company_id.logo == null || infoCompany.company_id.logo == 'null')
        imageName = 'default.jpg'
      else imageName =  infoCompany.company_id.logo

      const pathImage = `${process.env.HOST_API}/images/${ imageName }`;

      const content = this.plantilla( infoCompany, claveAcceso, numComprobante, client, datosFactura, pathImage, iva );

      let browser;
      if (process.env.SISTEMA == 'linux') {
        browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ] });
      }else{
        browser = await puppeteer.launch({ headless: true })
      }

      const page = await browser.newPage()

      await page.setContent(content);

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          left: '20px',
          top: '0px',
          right: '20px',
          bottom: '0px'
        }
      })

      await browser.close();

      const pathPDF = path.resolve(__dirname, `../../../static/SRI/PDF/${ claveAcceso }.pdf`);

      writeFile(pathPDF, pdf, {}, (err) => {
        if(err) return console.error('error')
      });

      return pathPDF;
    }
}
