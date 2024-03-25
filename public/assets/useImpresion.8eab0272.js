const c=()=>({imprimirAbono:(t,r,o,d)=>`
    <html>
    <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial" />
      <style>
        th, td {
          text-align: center;
          white-space: nowrap; /* Omitir espacios en blanco */
        }
      </style>
    </head>
      <body>
        <table border="0" align="center" style="font-size: 8px; width: 230px;">
          <tbody>
            <tr>
              <td>
                <pre>    ${t.company_name}         -</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>       R.U.C.: ${t.ruc}         </pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Direccion: ${t.direccion}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Fecha: ${t.fecha_abono}          Hora: ${t.hora_abono}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Cliente: ${r.cliente}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>${r.tipo_documento=="05"?"Cedula:":"R.U.C:"}: ${r.num_doc}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Correo: ${r.email}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>----------------------------------------</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Cant.         Servicio             Total</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>----------------------------------------</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>1     Servicio de Internet        $${(parseFloat(t.monto_pendiente)+parseFloat(t.totalAbonado)).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                        IVA(12%): $00.00</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                       Descuento: $00.00</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                   Valor Abonado: $${parseFloat(t.valor).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                   Total Abonado: $${parseFloat(t.totalAbonado).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                 Valor pendiente: $${parseFloat(t.monto_pendiente).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>      Forma de Pago:</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>  ${t.forma_pago}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Atentido Por: ${o}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Gracias por su Compra</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>-</pre>
              </td>
            </tr>
        </table>
      </body>
    </html>
    `,imprimirFactura:(t,r,o,d)=>{let e="";return e=`
    <html>
    <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial" />
      <style>
        th, td {
          text-align: center;
          white-space: nowrap; /* Omitir espacios en blanco */
        }
        .container {
          width: 100%x; /* Ancho total para las etiquetas */
        }

        .content-articulo {
          display: inline-block;
          max-width: 100%; /* Ancho m\xE1ximo para cada etiqueta */
          margin-bottom: 5px; /* Espacio entre etiquetas */
          word-wrap: break-word;
        }
      </style>
    </head>
      <body>
        <table border="0" align="center" style="font-size: 8px; width: 230px;">
          <tbody>
            <tr>
              <td>
                <pre>    ${t.company_name}         -</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>       R.U.C.: ${t.ruc}         </pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Direccion: ${t.direccion}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Ambiente: PRUEBA         Emision: NORMAL</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Fecha: ${t.created_at}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Num. Comprobante: ${t.numero_comprobante}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Clave Acceso:</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>${t.clave_acceso}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Cliente: ${r.cliente}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>${r.tipo_documento=="05"?"Cedula:":"R.U.C:"}: ${r.num_doc}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Correo: ${r.email}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>----------------------------------------</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Cant.         Servicio             Total</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>----------------------------------------</pre>
              </td>
            </tr>`,t.invoiceToProduct.forEach(p=>{e+=`
              <tr>
                <td style="white-space: unset;">
                  <div class="container">
                    <div class="content-articulo" style="width: 30px;">
                      ${p.cantidad}
                    </div>
                    <div class="content-articulo" style="width: 110px;">
                      ${p.product_id.nombre}
                    </div>
                    <div class="content-articulo" style="width: 40px;">
                      $${p.v_total}
                    </div>
                  </div>
                </td>
              </tr>
              `}),e+=`
            <tr>
              <td>
              <pre>                        Subtotal: $${t.subtotal}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                         IVA(${t.porcentaje_iva}%): $${t.iva}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                        Descuento: $${t.descuento}</pre>
              </td>
            </tr>
            <tr>
              <td>
              <pre>                           Total: $${t.total}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Forma de Pago: ${t.forma_pago}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Atentido Por: ${o}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Gracias por su Compra</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>-</pre>
              </td>
            </tr>
        </table>
      </body>
    </html>
    `,e}});export{c as u};
