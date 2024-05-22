const puppeteer = require('puppeteer')
const { writeFile, mkdirSync } = require('fs');
const path = require('path');
const moment = require('moment');

export class Proforma {

  plantilla( datosFactura, clientFound, infoCompany, pathImage, name ){
      moment.locale('es');
      const fechaEmision = moment().format('LLLL');

      let html = /*html*/ `<!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <title>Document</title>
        <style>
          .lista {
            font-size: 11px;
            list-style: none;
            text-align: right;
          }

          .img {
            width: auto;
            max-height: 110px;
          }

          .column2 {
            font-size: 11px;
            list-style: none;
            text-align: center;
            padding-left: 0;
            margin-bottom: 0px;
          }

          .column2Titulo {
            font-size: 11px;
            list-style: none;
            text-align: left;
            padding-left: 0;
            margin-bottom: 0px;
          }

          .cabecera {
            color: white;
            padding-left: 4px;
          }

          .column2>li {
            border: 1px solid #34495E;
          }

          .razon_social {
            background-color: #34495E;
            color: white;
            padding-left: 10px;
          }

          .value_razon_social {
            font-size: 11px;
            text-align: center;
            border: 1px solid #34495E;
          }

          .subtotal {
            border-left: 1px solid #34495E;
            border-bottom: 1px solid #34495E;
            text-align: right;
            padding-right: 10px;
          }
        </style>
      </head>

      <body>
        <div class="mx-4">
          <div class="row mt-1">
            <div class="col-6 d-flex align-items-center">
              <img src="${ pathImage }" class="img rounded">
            </div>
            <div class="col-6">
              <ul class="lista">
                <li class="fw-bolder" style="font-size: 13px;">
                  ${ infoCompany.company_id.nombre_comercial }
                </li>
                <li>RUC: ${ infoCompany.company_id.ruc }</li>
                <li>${ infoCompany.company_id.direccion_matriz }</li>
                <li>Tel: ${ infoCompany.company_id.telefono }</li>
                <li>${ infoCompany.company_id.email }</li>
                <li>${ infoCompany.company_id.ciudad } - ECUADOR</li>
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
              <ul class="row" style="list-style: none;padding-left: 0px;">
                <li style="display: flex;padding-left: 0px;">
                  <div class="col-4 column2Titulo razon_social">
                    PROFORMA:
                  </div>
                  <div class="col-8 value_razon_social">
                    ${ name }
                  </div>
                </li>
                <li style="display: flex;padding-left: 0px;">
                  <div class="col-4 column2Titulo razon_social">
                    FECHA:
                  </div>
                  <div class="col-8 value_razon_social" style="border-top: none;">
                    ${ fechaEmision }
                  </div>
                </li>
                <li style="display: flex;padding-left: 0px;">
                  <div class="col-4 column2Titulo razon_social">
                    CORREO:
                  </div>
                  <div class="col-8 value_razon_social" style="border-top: none;">
                    ${ clientFound.email }
                  </div>
                </li>
              </ul>
            </div>
            <div class="col-12">
              <ul class="row" style="list-style: none;padding-left: 0px;">
                <li style="display: flex;padding-right: 0px;">
                  <div class="col-12 column2Titulo razon_social text-center">
                    SERVICIOS / PRODUCTOS
                  </div>
                </li>
                <li style="display: flex;padding-right: 0px;">
                  <div class="col-2 column2Titulo razon_social text-center" style="background-color: #0C88F4;">
                    CANTIDAD
                  </div>
                  <div class="col-6 column2Titulo razon_social text-center" style="background-color: #0C88F4;">
                    DESCRIPCIÓN
                  </div>
                  <div class="col-2 column2Titulo razon_social text-center" style="background-color: #0C88F4;">
                    PRECIO UNIT.
                  </div>
                  <div class="col-2 column2Titulo razon_social text-center" style="background-color: #0C88F4;">
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
                  <div class="col-6 column2Titulo text-left"
                    style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;padding-left: 10px">
                    ${ product.nombre }
                  </div>
                  <div class="col-2 column2Titulo subtotal">
                    ${ product.pvp.toFixed(2) }
                  </div>
                  <div class="col-2 column2Titulo text-end pe-2"
                    style="border-left: 1px solid #423b95;border-bottom: 1px solid #423b95;border-right: 1px solid #423b95;text-align: right">
                    ${ product.v_total.toFixed(2) }
                  </div>
                </li>`
                })

                html += /*html*/`
                <li style="display: flex;padding-right: 0px;">
                  <div class="col-8 column2Titulo text-center"
                    style="border-left: 1px solid #34495E;border-bottom: 1px solid #34495E;background-color: #34495E;color: white;">
                    OBSERVACIONES
                  </div>
                  <div class="col-2 column2Titulo subtotal" style="background-color: #34495E;color: white;">
                    TOTAL BRUTO
                  </div>
                  <div class="col-2 column2Titulo text-end pe-2"
                    style="border-left: 1px solid #34495E;border-bottom: 1px solid #34495E;border-right: 1px solid #34495E;background-color: #34495E;color: white;">
                    ${ datosFactura.subtotal.toFixed(2) }
                  </div>
                </li>
                <li style="display: flex;padding-right: 0px;">
                  <div class="col-8 column2Titulo text-center" style="border-left: 1px solid #34495E;">
                    ${ datosFactura.descripcion.length == 0 ? 'Sin observaciones' : datosFactura.descripcion }
                  </div>
                  <div class="col-2 column2Titulo subtotal" style="background-color: #34495E;color: white;">
                    DESCUENTOS
                  </div>
                  <div class="col-2 column2Titulo text-end pe-2"
                    style="border-left: 1px solid #34495E;border-bottom: 1px solid #34495E;border-right: 1px solid #34495E;background-color: #34495E;color: white;">
                    ${ datosFactura.descuento.toFixed(2) }
                  </div>
                </li>
                <li style="display: flex;padding-right: 0px;">
                  <div class="col-8 column2Titulo text-center" style="border-left: 1px solid #34495E;">
                  </div>
                  <div class="col-2 column2Titulo subtotal" style="background-color: #34495E;color: white;">
                    SUBTOTAL
                  </div>
                  <div class="col-2 column2Titulo text-end pe-2"
                    style="border-left: 1px solid #34495E;border-bottom: 1px solid #34495E;border-right: 1px solid #34495E;background-color: #34495E;color: white;">
                    ${ (datosFactura.subtotal - datosFactura.descuento).toFixed(2) }
                  </div>
                </li>
                <li style="display: flex;padding-right: 0px;">
                  <div class="col-8 column2Titulo text-center" style="border-left: 1px solid #34495E;">
                  </div>
                  <div class="col-2 column2Titulo subtotal" style="background-color: #34495E;color: white;">
                    IVA(${datosFactura.porcentaje_iva}%)
                  </div>
                  <div class="col-2 column2Titulo text-end pe-2"
                    style="border-left: 1px solid #34495E;border-bottom: 1px solid #34495E;border-right: 1px solid #34495E;background-color: #34495E;color: white;">
                    ${ datosFactura.iva.toFixed(2) }
                  </div>
                </li>
                <li style="display: flex;padding-right: 0px;">
                  <div class="col-8 column2Titulo text-center"
                    style="border-left: 1px solid #34495E;border-bottom: 1px solid #34495E;">
                  </div>
                  <div class="col-2 column2Titulo subtotal" style="background-color: #34495E;color: white;">
                    TOTAL
                  </div>
                  <div class="col-2 column2Titulo text-end pe-2"
                    style="border-left: 1px solid #34495E;border-bottom: 1px solid #34495E;border-right: 1px solid #34495E;background-color: #34495E;color: white;">
                    ${ datosFactura.total.toFixed(2) }
                  </div>
                </li>

                <li style="display: flex;padding-right: 0px;margin-top: 15px;">
                  <div class="col-12 column2Titulo razon_social text-center">
                    CLAUSULAS DE LA PROPUESTA
                  </div>
                </li>`

                infoCompany.company_id.proforma[0].clausulas.forEach((clausula, index) => {
                  html += /*html*/ `
                  <li style="display: flex;padding-right: 0px;">
                  <div
                    class="col-4 column2Titulo text-left fw-bolder ${ (index + 1) == infoCompany.company_id.proforma[0].clausulas.length
                      ? 'ultima-clausulas-1' : 'primeras-clausulas-1' }">
                    ${ clausula.nombre }:
                  </div>
                  <div
                    class="col-8 column2Titulo text-left ${ (index + 1) == infoCompany.company_id.proforma[0].clausulas.length
                      ? 'ultima-clausulas-2' : 'primeras-clausulas-2' }">
                    ${ clausula.descripcion }
                  </div>
                </li>`
                })

                html += `
                <li style="display: flex;padding-right: 0px;margin-top: 15px;">
                  <div class="col-12 column2Titulo razon_social text-center">
                    ACEPTACIÓN DE LA PROPUESTA
                  </div>
                </li>
                <li style="display: flex;padding-right: 0px;">
                  <div class="col-12 column2Titulo text-left pa-2" style="padding: 8px;border: 1px solid #34495E;font-family: none;line-height: 16px;
                    font-size: 12px;">
                    ${ infoCompany.company_id.proforma[0].aceptacion_proforma }
                  </div>
                </li>
              </ul>

              <div class="row mt-1">
                <div class="col-6">
                  <label style="font-size: 12px;" class="fw-bolder">
                  ${ infoCompany.company_id.nombre_comercial }:
                  </label>
                </div>
                <div class="col-6">
                  <label style="font-size: 12px;" class="fw-bolder">
                    Cliente:
                  </label>
                </div>
              </div>

              <!-- ESTILOS -->
              <style>
                /* Estilo personalizado para las líneas de puntos */
                .dotted-line {
                  border-bottom: 2px dotted #999;
                  margin-bottom: 10px;
                  width: 90%;
                  /* ajustar según tus necesidades */
                  display: inline-block;
                }

                .signature-container {
                  display: flex;
                  justify-content: space-between;
                }

                .primeras-clausulas-1 {
                  padding-left: 10px;
                  border-left: 1px solid #34495E;
                }

                .primeras-clausulas-2 {
                  border-right: 1px solid #34495E;
                }

                .ultima-clausulas-1 {
                  padding-left: 10px;
                  border-left: 1px solid #34495E;
                  border-bottom: 1px solid #34495E;
                }

                .ultima-clausulas-2 {
                  border-right: 1px solid #34495E;
                  border-bottom: 1px solid #34495E;
                }

                .signature-column {
                  width: 45%;
                  /* ajustar según tus necesidades */
                  text-align: center;
                }
              </style>
              <!-- FIN -->

              <!-- FIRMAS -->
              <div class="container">
                <div class="row mt-4 signature-container">
                  <!-- Firma a la izquierda -->
                  <div class="col-md-6 signature-column">
                  <br>
                  <br>
                    <div class="dotted-line"></div>
                    <p>Firma del Prestador</p>
                    <p style="font-size:14px">
                      ${ infoCompany.company_id.razon_social }
                    </p>
                  </div>
                  <!-- Firma a la derecha -->
                  <div class="col-md-6 signature-column">
                  <br>
                  <br>
                    <div class="dotted-line"></div>
                    <p>ABONADO/SUSCRIPTOR</p>
                  </div>
                </div>
              </div>
              <!-- FINAL DE FIRMAS -->
            </div>
          </div>
        </div>
        <footer class="footer">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="footer-line"></div>

              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>`

    return html;
  }

  async generarProformaPDF( ...data ) {
    const [ datosFactura, clientFound, infoCompany, total_proforma ] = data;

    const name_proforma = `proforma-${ total_proforma }.pdf`

    let imageName;
    if(infoCompany[0].company_id.logo == null || infoCompany[0].company_id.logo == 'null')
      imageName = 'default.jpg'
    else imageName =  infoCompany[0].company_id.logo

    const pathImage = `${process.env.HOST_API}/images/${ imageName }`;

    const content = this.plantilla( datosFactura, clientFound[0], infoCompany[0], pathImage, total_proforma );

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
        top: '40px',
        right: '50px',
        bottom: '0px'
      }
    })

    await browser.close();
    const pathPDF = path.resolve(__dirname, `../../../static/SRI/PROFORMAS/${ name_proforma }`);

    writeFile(pathPDF, pdf, {}, (err) => {
      if(err) return console.error('error')
    });

    return {
      buffer: pathPDF,
      name: name_proforma,
      tipo: 'proforma'
    };
  }
}
