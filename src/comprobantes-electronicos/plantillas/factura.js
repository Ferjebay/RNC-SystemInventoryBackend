const pdf = require('html-pdf');
const path = require('path');

const formatInvoice = (cliente, detalle, claveAcceso, numFactura, valoresFactura) => {
    let plantilla = /*html*/`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Example 1</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js"></script>
        <style>
          .clearfix:after {
            content: "";
            display: table;
            clear: both;
          }  
          a {
            color: #5D6975;
            text-decoration: underline;
          }      
          body {
            position: relative;
            margin: 0 auto; 
            color: #001028;
            background: #FFFFFF; 
            font-family: Arial, sans-serif; 
            font-size: 10px; 
            font-family: Arial;
          }      
          .headerr {
            padding: 10px 0;
            margin-bottom: 30px;
          }      
          #logo {
            text-align: center;
            margin-bottom: 10px;
          }      
          #logo img {
            width: 140px;
          }      
          h1 {
            border-top: 1px solid  #5D6975;
            border-bottom: 1px solid  #5D6975;
            color: #5D6975;
            font-size: 1.2em;
            line-height: 1.4em;
            font-weight: normal;
            text-align: center;
            margin: 0 0 20px 0;
            background: url("https://res.cloudinary.com/ded0v5s09/image/upload/v1690329208/dimension_xandu4.png");
          }      
          #project {
            float: left;
          }      
          #project span {
            color: #5D6975;
            text-align: right;
            width: 52px;
            margin-right: 10px;
            display: inline-block;
            font-size: .7em;
          }      
          #company {
            float: right;
            text-align: right;
          }      
          #project div,
          #company div {
            white-space: nowrap;      
            font-size: .7em;
          }      
          table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 20px;
          }  
          table tr:nth-child(2n-1) td {
            background: #F5F5F5;
          }      
          table th,
          table td {
            text-align: center;
          }      
          table th {
            padding: 5px 20px;
            color: #5D6975;
            border-bottom: 1px solid #C1CED9;
            white-space: nowrap;        
            font-weight: normal;
          }      
          table .service,
          table .desc {
            text-align: left;
          }  
          table td {
            padding: 10px;
            text-align: right;
          }  
          table td.service,
          table td.desc {
            vertical-align: top;
          }      
          table td.unit,
          table td.qty,
          table td.total {
            font-size: .8em;
          }      
          table td.grand {
            border-top: 1px solid #5D6975;;
          }      
          #notices .notice {
            color: #5D6975;
            font-size: .8em;
          }   
        </style>
      </head>
      <body>
        <header class="clearfix">
          <div id="logo">
            <img 
              src="https://res.cloudinary.com/ded0v5s09/image/upload/v1694631595/logo_notuv3.png"
              style="width: 35%;">
          </div>
          <h1>FACTURA NUM.: ${ numFactura }</h1>
          <div id="company" class="clearfix">
            <div style="font-size: 1em;">
              RED NUEVA &nbsp; CONEXIÓN &nbsp; | &nbsp; R.U.C: 1206708644001
            </div>
            <div style="font-size: 1em;">
              Pueblo viejo, Frente del Cementerio, 24 de Mayo, 120201
            </div>
            <div style="font-size: 1em;">
              +593 99 936 3476
            </div>
            <div style="font-size: 1em;">
              info@rednuevaconexion.net
            </div>
          </div>
          <div id="project">
            <div style="font-size: 1.2em;">
                <span style="font-size: .9em;">CLIENTE: </span> ---------
            </div>
            <div style="font-size: 1.2em;">
                <span>DIRECCIÓN: </span>
                ----------
            </div>
            <div style="font-size: 1.2em;"><span>EMAIL: </span>------</div>
            <div style="font-size: 1.2em;">
                <span>
                    ------            
                </span>-------
            </div>
          </div>
        </header>
    
        <div style="text-align: center;">
          <h3 style="text-align: center;margin-bottom: 0px;">CLAVE DE ACCESO:</h3>  
          <svg id="barcode"></svg>
        </div>
    
        <br>
        <main>
          <table>
            <thead>
              <tr>
                <th class="service">Cod. Principal</th>
                <th class="desc">Descripción</th>
                <th style="text-align: center">Cant. Fracciones</th>
                <th>Precio Unit</th>
                <th>Dscto</th>
                <th style="text-align: center">
                    Precio Total
                </th>
              </tr>
            </thead>
            <tbody>
    
            <tr>
                <td class="service">---</td>
                <td class="desc" style="font-size: .9em;">-----</td>
                <td class="unit" style="text-align: center">
                  -----
                </td>
                <td class="qty" style="font-size: .9em;">----</td>
                <td class="qty" style="font-size: .9em;">-------</td>
                <td class="total" style="text-align: center; font-size: .9em;">
                    ---------
                </td>
            </tr>
   

  <tr>
                <td colspan="5">SUBTOTAL:</td>
                <td class="total">--------</td>
              </tr>
              <tr>
                <td colspan="5">IVA(12%):</td>
                <td class="total">------</td>
              </tr>
              <tr>
                <td colspan="5">TOTAL DESCUENTO:</td>
                <td class="total">-------</td>
              </tr>
              <tr>
                <td colspan="5" class="grand total">TOTAL</td>
                <td class="grand total">----------</td>
              </tr>
            </tbody>
          </table>
          <!-- <div id="notices">
            <div>NOTICE:</div>
            <div class="notice">A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
          </div> -->
        </main>
    
        <script>
          JsBarcode("#barcode", 
          '${ claveAcceso }', 
          {
            format: "CODE128",
            height: 60,
            width: 1,
            fontSize: 10,
            margin: 5
          });
        </script>
    
      </body>
    </html>`

    return plantilla;
}

const createInvoicePDF = ( cliente, detalle, claveAcceso, numFactura, valoresFactura ) => {

    const content = formatInvoice(cliente, detalle, claveAcceso, numFactura, valoresFactura);    

    const options = { 
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      },
      border: {
        "top": "12px",           
        "right": "50px",
        "bottom": "12px",
        "left": "50px"
      }, 
    };

    try {
      const pathPDF = path.resolve(__dirname, `../../../static/assets/SRI/PDF/${ claveAcceso }.pdf`);

      pdf.create(content, options).toFile(pathPDF, async function(err, res) {
          if (err){
              console.log(err);
          } else {
            console.log( "pdf creado" );
            // sendEmailHelper( cliente.email, claveAcceso, numFactura )
          }
      });      
    } catch (error) {
      console.log( error );
    }
}

module.exports = {
    createInvoicePDF
}
