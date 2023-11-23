const puppeteer = require('puppeteer')
const { writeFile, mkdirSync } = require('fs');
const path = require('path');
const moment = require('moment');

export class Proforma {

    plantilla( datosFactura, clientFound, infoCompany, pathImage ){
        const fechaEmision = moment().format('DD/MM/YYYY h:mm:ss a');
        const fechaVencimiento = moment().add(5, 'days').format('DD/MM/YYYY');

        let html = /*html*/ `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <title>Document</title>
            <style>
              .backColor{
                background-color: #d5d7d9;
              }
              .borderTrBottom{
                padding-top: 5px;
                padding-bottom: 5px;
                border-bottom: 1px #dadae3 solid;
              }
              
              .tableProduct {
                  border-collapse: collapse;
              }
              
              .tableProduct,
              .tableProduct th,
              .tableProduct td {
                  border: 1px solid #d3cbcb;
              }
              
              .tableProduct th,
              .tableProduct td {
                  padding: 5px;
              }
            </style>
        </head>
        <body style="font-size: 15px; color: black;">
          <div class="row">
        
            <div class="col-5 pt-4 pb-2" 
              style="font-size: 9px;line-height: 15px;">
              <div class="d-flex justify-content-center">
                <img src="${ pathImage }" width="60%">
              </div>
              <div class="d-flex justify-content-center mt-1 fw-bolder">
                ${ infoCompany.company_id.razon_social }
              </div>
              <div class="d-flex justify-content-center">
                RUC - ${ infoCompany.company_id.ruc }
              </div>
              <div class="d-flex justify-content-center">
                <div style="width: 65%;text-align: center;">
                  ${ infoCompany.company_id.direccion_matriz }
                </div>
              </div>
              <div class="d-flex justify-content-center">
                Tel - ${ infoCompany.company_id.telefono }
              </div>
              <div class="d-flex justify-content-center">
                Pueblo Viejo - Ecuador
              </div>
            </div>    
            <div class="col-7 pt-4 pb-2 d-flex align-items-center">
              <table style="text-align: end;border: 1px #dbdbdb solid;font-size: 11px;width: 100%">
                <tr>
                  <td class="fw-bolder"
                   style="width: 29%;background-color: #d3d9df;padding-right: 10px;">
                    Para
                  </td>
                  <td style="padding-right: 10px;">
                  ${ clientFound.nombres }
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder"
                    style="background-color: #d3d9df;padding-right: 10px;">
                    R.U.C
                  </td>
                  <td style="padding-right: 10px;">
                    ${ clientFound.numero_documento }
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder"
                   style="background-color: #d3d9df;padding-right: 10px;">
                    Fecha Emisión
                  </td>
                  <td style="padding-right: 10px;">
                    ${ fechaEmision }
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder"
                  style="background-color: #d3d9df;padding-right: 10px;">
                    Válido Hasta
                  </td>
                  <td style="padding-right: 10px;">
                    ${ fechaVencimiento }
                  </td>
                </tr>
              </table>
            </div>    
        
            <div class="col-12 pb-1 mt-2 text-center fw-semibold fs-5" style="font-size: 13px;">
              FACTURA PROFORMA
            </div>
        
            <div class="col-12 pt-1 pb-2 mt-1" 
              style="font-size: 11px;">
              <table class="tableProduct" style="width: 100%;">
                <thead style="background-color: #d3d9df;">
                  <tr>
                    <th class="text-center" style="width: 5.2%;">
                      Item
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Producto
                    </th>
                    <th class="text-center" style="width: 44.2%;">
                      Descripción
                    </th>
                    <th class="text-center" style="width: 8.2%;">
                      Cantidad
                    </th>
                    <th class="text-center" style="width: 10.2%;">
                      Impto. Cargo
                    </th>
                    <th class="text-center" style="width: 8.2%;">
                      Vr. Unitario 
                    </th>
                    <th class="text-center" style="width: 9.2%;">
                      Vr. total
                    </th>
                  </tr>
                </thead>
                <tbody>`
                
              datosFactura.products.forEach((product, index) => {
                html += `
                  <tr class="text-center">
                    <td>${ index + 1 }</td>
                    <td>${ product.codigoBarra }</td>
                    <td>${ product.nombre }</td>
                    <td>${ product.cantidad }</td>
                    <td>12%</td>
                    <td>${ product.pvp }</td>
                    <td>${ product.v_total }</td>
                  </tr>`                
              });
                
                html +=`
                </tbody>
              </table>
            </div>  
            
            <div class="col-7"></div>
        
            <div class="col-5" style="font-size: 12px;">
              <div class="row" style="text-align: right;">
                <div class="col-12 pb-2 d-flex justify-content-between">
                  <label class="fw-bolder"
                    style="padding-left: 50px;">
                    Total Bruto:
                  </label>
                  <label class="pe-3" style="width: 46%;">
                    $${ datosFactura.subtotal }
                  </label>
                </div>
                <div class="col-12 pb-2 d-flex justify-content-between">
                  <label class="fw-bolder"
                    style="padding-left: 50px;">
                    Descuentos:
                  </label>
                  <label class="pe-3" style="width: 46%;">
                    $${ datosFactura.descuento }
                  </label>
                </div>
                <div class="col-12 pb-2 d-flex justify-content-between">
                  <label class="fw-bolder"
                    style="padding-left: 50px;">
                    Subtotal: 
                  </label>
                  <label class="pe-3" style="width: 46%;">
                    $${ datosFactura.subtotal - datosFactura.descuento }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label class="fw-bolder"
                    style="padding-left: 50px;">
                    Total IVA: 
                  </label>
                  <label class="pe-3" style="width: 46%;">
                    $${ datosFactura.iva }
                  </label>
                </div>
                <div class="col-12 py-1 backColor pb-1 d-flex justify-content-between fw-bold">
                  <label style="padding-left: 50px;">
                    Total a pagar: 
                  </label>
                  <label class="backColor pe-3" style="width: 46%;">
                    $${ datosFactura.total } USD
                  </label>
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
  
      const browser = await puppeteer.launch({ headless: true })
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
      
      return {
        buffer: pdf,
        name: `proforma-${ Date.now().toString(10).substring(5) }.pdf`,
        tipo: 'proforma'
      };
    }
}
