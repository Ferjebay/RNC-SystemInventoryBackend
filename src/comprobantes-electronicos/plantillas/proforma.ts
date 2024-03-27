const puppeteer = require('puppeteer')
const { writeFile, mkdirSync } = require('fs');
const path = require('path');
const moment = require('moment');

export class Proforma {

    plantilla( datosFactura, clientFound, infoCompany, pathImage ){
        moment.locale('es');
        const fechaEmision = moment().format('LLLL');

        let html = /*html*/ `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <title>Document</title>
            <style>
              .lista{
                font-size: 11px;
                list-style: none;
                text-align: right;
              }
              .img{
                max-width: 173px;
                min-width: 173px;
                height: auto;
              }
              .column2{
                font-size: 11px;
                list-style: none;
                text-align: center;
                padding-left: 0;
                margin-bottom: 0px;
              }
              .column2Titulo{
                font-size: 11px;
                list-style: none;
                text-align: left;
                padding-left: 0;
                margin-bottom: 0px;
              }
              .cabecera{
                color: white;
                padding-left: 4px;
              }
              .column2 > li {
                border: 1px solid #423b95;
              }
              .razon_social{
                background-color: #423b95;
                color: white;
                padding-left: 10px;
              }
              .value_razon_social{
                font-size: 11px;
                text-align: center;
                border: 1px solid #423b95;
              }
              .subtotal{
                border-left: 1px solid #423b95;
                border-bottom: 1px solid #423b95;
                text-align: right;
                padding-right: 10px;
              }
              .borderBottomClausulas{
                border-bottom: 1px solid #423b95;
              }
            </style>
        </head>
        <body>
          <div class="mx-4">
            <div class="row mt-5">
              <div class="col-6 d-flex align-items-center">
                <img src="${ pathImage }" style="max-width: 175px;max-width: 175px;height: auto;" class="rounded">
              </div>
              <div class="col-6">
                <ul class="lista">
                  <li class="fw-bolder" style="font-size: 13px;">
                    ${ infoCompany.company_id.razon_social }
                  </li>
                  <li>RUC: ${ infoCompany.company_id.ruc }</li>
                  <li>${ infoCompany.company_id.direccion_matriz }</li>
                  <li>Tel: ${ infoCompany.company_id.telefono }</li>
                  <li>${ infoCompany.company_id.email }</li>
                </ul>
              </div>

              <div class="col-7">
                <ul class="row" style="list-style: none;padding-left: 0px;">
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-5 column2Titulo razon_social">
                      NOMBRE/RAZON SOCIAL:
                    </div>
                    <div class="col-7 value_razon_social">
                    ${ clientFound.nombres }
                    </div>
                  </li>
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-3 column2Titulo razon_social">
                      CÉDULA/RUC:
                    </div>
                    <div class="col-3 value_razon_social" style="border-top: none;">
                    ${ clientFound.numero_documento }
                    </div>
                    <div class="col-3 column2Titulo razon_social">
                      TELEFONO:
                    </div>
                    <div class="col-3 value_razon_social" style="border-top: none;">
                    ${ clientFound.celular }
                    </div>
                  </li>
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-3 column2Titulo razon_social">
                      DIRECCIÓN:
                    </div>
                    <div class="col-9 value_razon_social" style="border-top: none;">
                    ${ clientFound.direccion }
                    </div>
                  </li>
                </ul>
              </div>

              <div class="col-5">
                <div class="row">
                  <div class="col-3" style="padding-right: 0px;background-color: #423b95;padding-left: 2px;">
                    <ul class="column2Titulo cabecera">
                      <li>PROFORMA:</li>
                      <li style="margin-top: 3px;margin-bottom: 3px;">FECHA:</li>
                      <li>CORREO:</li>
                    </ul>
                  </div>
                  <div class="col-9" style="padding-left: 0px;padding-right: 0px;">
                    <ul class="column2">
                      <li>2402011652</li>
                      <li style="border-top: none;border-bottom: none;">
                        ${ fechaEmision }
                      </li>
                      <li>
                        ${ clientFound.email }
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <ul class="row" style="list-style: none;padding-left: 0px;">
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-12 column2Titulo razon_social text-center">
                      SERVICIOS / PRODUCTOS
                    </div>
                  </li>
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-2 column2Titulo razon_social text-center" style="background-color: #a96820;">
                      CANTIDAD
                    </div>
                    <div class="col-6 column2Titulo razon_social text-center" style="background-color: #a96820;">
                      DESCRIPCIÓN
                    </div>
                    <div class="col-2 column2Titulo razon_social text-center" style="background-color: #a96820;">
                      PRECIO UNIT.
                    </div>
                    <div class="col-2 column2Titulo razon_social text-center" style="background-color: #a96820;">
                      TOTAL
                    </div>
                  </li>

                  <li style="display: none;padding-right: 0px;"></li>`

                  datosFactura.products.forEach((product, index) => {
                    html += /*html*/ `<li style="display: flex;padding-right: 0px;">
                    <div class="col-2 column2Titulo text-center"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;">
                      ${ product.cantidad }
                    </div>
                    <div class="col-6 column2Titulo text-center"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;">
                      ${ product.nombre }
                    </div>
                    <div class="col-2 column2Titulo subtotal">
                      $${ product.pvp }
                    </div>
                    <div class="col-2 column2Titulo text-end pe-2"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;border-right: 1px solid #423b95;text-align: right">
                      $${ product.v_total }
                    </div>
                  </li>`
                  })

                  html += /*html*/ `<li style="display: flex;padding-right: 0px;">
                    <div class="col-8 column2Titulo text-center"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;background-color: #423b95;color: white;">
                      OBSERVACIONES
                    </div>
                    <div class="col-2 column2Titulo subtotal" style="background-color: #423b95;color: white;">
                      TOTAL BRUTO
                    </div>
                    <div class="col-2 column2Titulo text-end pe-2"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;border-right: 1px solid #423b95;background-color: #423b95;color: white;">
                      $${ datosFactura.subtotal }
                    </div>
                  </li>
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-8 column2Titulo text-center"
                      style="border-left: 1px solid #423b95;">
                      ${ datosFactura.descripcion.length == 0 ? 'Sin observaciones' : datosFactura.descripcion }
                    </div>
                    <div class="col-2 column2Titulo subtotal" style="background-color: #423b95;color: white;">
                      DESCUENTOS
                    </div>
                    <div class="col-2 column2Titulo text-end pe-2"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;border-right: 1px solid #423b95;background-color: #423b95;color: white;">
                      $${ datosFactura.descuento }
                    </div>
                  </li>
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-8 column2Titulo text-center"
                      style="border-left: 1px solid #423b95;">
                    </div>
                    <div class="col-2 column2Titulo subtotal" style="background-color: #423b95;color: white;">
                      SUBTOTAL
                    </div>
                    <div class="col-2 column2Titulo text-end pe-2"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;border-right: 1px solid #423b95;background-color: #423b95;color: white;">
                      $${ datosFactura.subtotal - datosFactura.descuento }
                    </div>
                  </li>
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-8 column2Titulo text-center"
                      style="border-left: 1px solid #423b95;">
                    </div>
                    <div class="col-2 column2Titulo subtotal" style="background-color: #423b95;color: white;">
                      IVA(12%)
                    </div>
                    <div class="col-2 column2Titulo text-end pe-2"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;border-right: 1px solid #423b95;background-color: #423b95;color: white;">
                      $${ datosFactura.iva }
                    </div>
                  </li>
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-8 column2Titulo text-center"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;">
                    </div>
                    <div class="col-2 column2Titulo subtotal" style="background-color: #423b95;color: white;">
                      TOTAL
                    </div>
                    <div class="col-2 column2Titulo text-end pe-2"
                      style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;border-right: 1px solid #423b95;background-color: #423b95;color: white;">
                      $${ datosFactura.total }
                    </div>
                  </li>

                  <li style="display: flex;padding-right: 0px;margin-top: 15px;">
                    <div class="col-12 column2Titulo razon_social text-center">
                      CLAUSULAS DE LA PROPUESTA
                    </div>
                  </li> `


                  infoCompany.company_id.proforma[0].clausulas.forEach((clausula, index) => {
                    html += /*html*/ `
                    <li style="display: flex;padding-right: 0px;">
                      <div class="${ ( index + 1 ) == infoCompany.company_id.proforma[0].clausulas.length ? 'borderBottomClausulas' : '' } col-4 column2Titulo text-left fw-bolder"
                        style="padding-left: 10px;border-left: 1px solid #423b95;">
                        ${ clausula.nombre }:
                      </div>
                      <div class="${ ( index + 1 ) == infoCompany.company_id.proforma[0].clausulas.length ? 'borderBottomClausulas' : '' } col-8 column2Titulo text-left"
                      style="border-right: 1px solid #423b95;">
                        ${ clausula.descripcion }
                      </div>
                    </li>`
                  })

                  html += /*html*/ `

                  <li style="display: flex;padding-right: 0px;margin-top: 15px;">
                    <div class="col-12 column2Titulo razon_social text-center">
                      ACEPTACIÓN DE LA PROPUESTA
                    </div>
                  </li>
                  <li style="display: flex;padding-right: 0px;">
                    <div class="col-12 column2Titulo text-left pa-2"
                      style="padding: 8px;border: 1px solid #423b95;font-family: none;line-height: 16px;
                      font-size: 12px;">
                      ${ infoCompany.company_id.proforma[0].aceptacion_proforma }
                    </div>
                  </li>

                </ul>

                <div class="row mt-1">
                  <div class="col-6">
                    <label style="font-size: 12px;" class="fw-bolder">
                      ${ infoCompany.company_id.razon_social }:
                    </label>
                  </div>
                  <div class="col-6">
                    <label style="font-size: 12px;" class="fw-bolder">
                      CLIENTE :
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </body>
        </html>`
        return html;
    }

    async generarProformaPDF( ...data ){
      const [ datosFactura, clientFound, infoCompany ] = data;

      let imageName;
      if(infoCompany[0].company_id.logo == null || infoCompany[0].company_id.logo == 'null')
        imageName = 'default.jpg'
      else imageName =  infoCompany[0].company_id.logo

      const pathImage = `${process.env.HOST_API}/images/${ imageName }`;

      const content = this.plantilla( datosFactura, clientFound[0], infoCompany[0], pathImage );

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
          left: '50px',
          top: '0px',
          right: '50px',
          bottom: '0px'
        }
      })

      await browser.close();
      const name_proforma = `proforma-${ Date.now().toString(10).substring(5) }.pdf`

      const pathPDF = path.resolve(__dirname, `../../../static/SRI/PROFORMAS/${ name_proforma }`);

      writeFile(pathPDF, pdf, {}, (err) => {
          if(err) return console.error('error')
          console.log('pdf creado')
      });

      return {
        buffer: pathPDF,
        name: name_proforma,
        tipo: 'proforma'
      };
    }
}
