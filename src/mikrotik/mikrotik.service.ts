import { BadRequestException, Injectable } from '@nestjs/common';
import { ServicioCliente } from 'src/customers/entities/ServicioCliente.entity';
import { Router } from 'src/router/entities/router.entity';
import { DataSource } from 'typeorm';
const RouterOSAPI = require("node-routeros").RouterOSAPI;
const ExcelJS = require('exceljs');
const path = require('path');

@Injectable()
export class MikrotikService {

  private conn;

  constructor( private readonly dataSource: DataSource ){}

  async connect( host, user, password ) {
    this.conn = new RouterOSAPI({ host, user, password });
  }

  async createClient( router, internet, ipv4, cliente_name, multiples_clientes = [] ) {
    return new Promise(async (resolve, reject) => {

      try {
        let clientesExistentes = [];
        const { ip_host, user, password, puerto_api } = router;
        const { subida_Mbps, descarga_Mbps, limit_at, prioridad, address_list } = internet;

        const limit_at_subida   =  Math.ceil((( +subida_Mbps * +limit_at) / 100));
        const limit_at_descarga =  Math.ceil((( +descarga_Mbps * +limit_at) / 100));
  
        await this.connect( ip_host, user, password );
  
        await this.conn.connect();

        let arrayQueue = [];
        
        if (multiples_clientes.length == 0) {
          await this.conn.write("/queue/simple/add", [
            `=target=${ ipv4 }`,
            `=comment=${ cliente_name }`,
            `=max-limit=${ subida_Mbps }M/${ descarga_Mbps }M`,
            `=limit-at=${ limit_at_subida }M/${ limit_at_descarga }M`,
            `=name=${ cliente_name } | ${ ipv4 }`,
            `=priority=${ prioridad }/${ prioridad }`
          ]);

          if ( address_list.length > 0 ) {
            await this.conn.write("/ip/firewall/address-list/add", 
              [
                `=address=${ ipv4 }`, 
                `=comment=${ address_list }`, 
                `=list=${ address_list }`
              ]
            )
          }

          this.conn.close();    
          resolve("Mikrotik: Cliente agregado");       
        }else{
          multiples_clientes.forEach( (cl, index) => {
            const { ipv4, cliente, servicio: 
              { subida_Mbps, descarga_Mbps, limit_at, prioridad, address_list } } = cl;

            const limit_at_subida   =  Math.ceil((( +subida_Mbps * +limit_at) / 100));
            const limit_at_descarga =  Math.ceil((( +descarga_Mbps * +limit_at) / 100));

            arrayQueue.push({
              ipv4, 
              address_list,
              queue: [
                `=target=${ ipv4 }`,
                `=comment=${ cliente }`,
                `=max-limit=${ subida_Mbps }M/${ descarga_Mbps }M`,
                `=limit-at=${ limit_at_subida }M/${ limit_at_descarga }M`,
                `=name=${ cliente } | ${ ipv4 }`,
                `=priority=${ prioridad }/${ prioridad }`
              ]
            });
            
            if ( ( index + 1 ) == multiples_clientes.length ) {
              arrayQueue.forEach( async (x, index) => {
                try {
                  await this.conn.write("/queue/simple/add", x.queue);
            
                  if ( address_list.length > 0 ) {
                    await this.conn.write("/ip/firewall/address-list/add", 
                      [
                        `=address=${ x.ipv4 }`, 
                        `=comment=${ x.address_list }`, 
                        `=list=${ x.address_list }`
                      ]
                    )
                  }                  
                } catch (error) {
                  clientesExistentes.push( x.ipv4 );
                }

                if ( ( index + 1 ) == arrayQueue.length ){
                  this.conn.close();
                  if ( clientesExistentes.length > 0 ) reject( clientesExistentes );
                  else resolve("Mikrotik: Cliente agregado");
                } 
              })
            }
          })
        }
      }catch (error) {
        reject({
          type: 'mickrotik',
          error: error
        });
      }
    })
  }

  async editClient( servicio ) {
    return new Promise(async (resolve, reject) => {

      try {

        const { ip_host, user_api, password_api, puerto_api } = servicio.perfil_internet.router_id;
        const { 
          perfil_internet: { subida_Mbps, descarga_Mbps, limit_at, prioridad, address_list }, 
          cliente, 
          ipv4, 
          ipv4_old,
          estado 
        } = servicio;

        const limit_at_subida   =  Math.ceil((( +subida_Mbps * +limit_at) / 100));
        const limit_at_descarga =  Math.ceil((( +descarga_Mbps * +limit_at) / 100));
  
        await this.connect( ip_host, user_api, password_api );
  
        await this.conn.connect();

        const data = await this.conn.write('/queue/simple/print',[ `?target=${ ipv4_old }/32` ]);      
        
        await this.conn.write("/queue/simple/set", [
          `=.id=${ data[0][".id"] }`,
          `=target=${ ipv4 }`,
          `=comment=${ cliente }`,
          `=max-limit=${ subida_Mbps }M/${ descarga_Mbps }M`,
          `=limit-at=${ limit_at_subida }M/${ limit_at_descarga }M`,
          `=name=${ cliente } | ${ ipv4 }`,
          `=priority=${ prioridad }/${ prioridad }` 
        ]);

        //Editar cliente a lista
        if ( address_list.length > 0 && estado != 'Inactivo'){ //Chequear estoo

          const resp = await this.conn.write("/ip/firewall/address-list/print", [
            `?address=${ ipv4_old }`]);
  
          if ( resp.length !== 0 ) {
    
            await this.conn.write(`/ip/firewall/address-list/remove`, [
              `=.id=${ resp[0][".id"] }`])
  
            await this.conn.write("/ip/firewall/address-list/add", [
              `=address=${ ipv4 }`, 
              `=comment=${ address_list }`,
              `=list=${ address_list }`
            ]);            
          }           
        }

        this.conn.close();
        resolve("Mikrotik: Cliente editado");
        
      }catch (error) {
        reject({
          type: 'mickrotik',
          error: error
        });
      }
    })
  }

  async activeOrSuspendService( servicio ) {
    return new Promise(async (resolve, reject) => {

      try {
        const { address_list, estado, ipv4 } = servicio;
        const { ip_host, user_api, password_api, puerto_api } = servicio.router;
  
        await this.connect( ip_host, user_api, password_api );
  
        await this.conn.connect();

        if ( estado !== 'activar' ) {
          const resp = await this.conn.write("/ip/firewall/raw/print")
  
          if( resp.length > 0 ){
  
            const existe = resp.some( regla => regla["src-address-list"] == 'Impagos' )
            
            if ( !existe ) 
              await this.conn.write("/ip/firewall/raw/add", [
                '=action=drop', 
                `=comment=Lista creada por RNC`,
                '=chain=prerouting', 
                '=src-address-list=Impagos'
              ]);
  
          }else{
            await this.conn.write("/ip/firewall/raw/add", [
              '=action=drop', 
              `=comment=Lista creada por RNC`,
              '=chain=prerouting', 
              '=src-address-list=Impagos'
            ]);
          }
  
          if ( address_list.length > 0 ) {    
            const resp = await this.conn.write("/ip/firewall/address-list/print", [
              `?list=${ address_list }`,
              `?address=${ ipv4 }` 
            ])
  
            await this.conn.write('/ip/firewall/address-list/remove', [`=.id=${ resp[0][".id"] }`])

            await this.conn.write('/ip/firewall/address-list/add', ['=list=Impagos', `=address=${ ipv4 }`])

          }else{ //Cuando clientes no estan en una lista
            await this.conn.write('/ip/firewall/address-list/add', ['=list=Impagos', `=address=${ ipv4 }`])
          }
        }else{  
          const resp = await this.conn.write("/ip/firewall/address-list/print", [`?list=Impagos`, `?address=${ ipv4 }`])

          await this.conn.write('/ip/firewall/address-list/remove', [`=.id=${ resp[0][".id"] }`]);
          
          await this.conn.write('/ip/firewall/address-list/add', [`=list=${ address_list }`, `=address=${ ipv4 }`])
        }
        
        this.conn.close();
        resolve(`Mikrotik: operacion realizada exitosamente`);
        
      }catch (error) {
        reject({
          type: 'mickrotik',
          error: error
        });
      }
    })
  }

  obtenerListaSubred = (ipSubred) => {
    // Parsear la dirección IP y la máscara de subred
    const [ip, mascara] = ipSubred.split('/');
    const ipNumerica = ip.split('.').map(Number);
    const mascaraNumerica = parseInt(mascara, 10);

    // Obtener la máscara en formato binario
    const mascaraBinaria = '1'.repeat(mascaraNumerica) + '0'.repeat(32 - mascaraNumerica);

    // Convertir la máscara binaria a una serie de cuatro octetos
    const octetosMascara = [];
    for (let i = 0; i < 4; i++) {
      octetosMascara.push(parseInt(mascaraBinaria.substr(i * 8, 8), 2));
    }

    // Obtener la dirección de red aplicando la máscara a cada octeto de la IP
    const red = ipNumerica.map((octeto, index) => octeto & octetosMascara[index]).join('.');

    // Obtener la lista de subredes
    const subredes = [];
    for (let i = 0; i < Math.pow(2, 32 - mascaraNumerica); i++) {
      const ipSubredActual = red.split('.').map((octeto, index) => parseInt(octeto, 10) + Math.floor(i / Math.pow(2, (3 - index) * 8)) % 256).join('.');
      
      if (ipSubredActual.split('.').every(octeto => parseInt(octeto, 10) <= 255)) {
        subredes.push(ipSubredActual);
      }
    }

    return subredes;
  }

  groupedIpsByRed = ( ips ) => {
    const groupedIps = {};

    ips.forEach(ip => {
      // Extraer la parte de la red de la IP
      const network = ip.substring(0, ip.lastIndexOf('.'));

      // Verificar si ya existe una entrada para esa red en el objeto groupedIps
      if (!groupedIps.hasOwnProperty(network)) {
        groupedIps[network] = [];
      }

      // Agregar la IP a la red correspondiente
      groupedIps[network].push(ip);
    });

    return groupedIps;
  }

  getIpsUsadasPorRed = ( objeto, ip ) => {
    const partesIp = ip.split('.');
  
    for (const clave in objeto) {
      if (objeto.hasOwnProperty(clave)) {
        const partesClave = clave.split('.');

        // Verificar si la parte de red de la clave coincide con la parte de red de la IP
        if (partesClave.every((valor, indice) => valor === partesIp[indice])) {
          return objeto[`${ clave }`].length // Coincidencia encontrada
        }
      }
    }
    return 0; // No se encontraron coincidencias
  }

  async downloadClientsToExcel( router_id ){
    try {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();

      // const customers = await queryRunner.manager.find( Customer, {});

      const router = await queryRunner.manager.findOne( Router, { 
        relations: { 
          internet: { plan_internet: { customer: true } }, 
          redes: true,
          cajaNap: { puertos: { plan_internet: true } } 
        },
        where: { id: router_id } } 
      );

      const cajasNap = router.cajaNap.map( caja => {
        return {
          caja: this.convertirAValidoEnExcel(caja.nombre),
          puertos: caja.puertos.map( puerto => puerto.plan_internet.length == 0 ? puerto.puerto : null)
        }
      });

      const ips = await queryRunner.manager.find(ServicioCliente, { 
        where:  { router_id: { id: router_id } },
        select: { ipv4: true } 
      });

      const ipsUsadas = ips.map(ip => ip.ipv4);
      
      const planes = router.internet.map(internet => internet.nombre_plan);
      const redes = router.redes.map(red => { 
        return { nombre: red.nombre, red: red.red, cidr: red.cidr }
      });

      let listRedes = []
      let ipsPorRed = [];
      const groupedIps = this.groupedIpsByRed( ipsUsadas );

      for (let index = 0; index < redes.length; index++) {
        const x = redes[index];
        const red  = x.red;
        const cidr = parseInt(x.cidr.split(' ')[0])
  
        const listIps = this.obtenerListaSubred(`${ red }/${ cidr }`)
        listIps.shift();
        listIps.pop();
        const groupedRedes = this.groupedIpsByRed( listIps );

        let totalIps;
        if ( cidr >= 25 && cidr <= 32 ) 
          totalIps = (2 ** (32 - cidr));
        else
          totalIps = 256;
  
        let claves = Object.keys(groupedRedes); 
        for(let i = 0; i < claves.length; i++){
          const ipUsadas = this.getIpsUsadasPorRed( groupedIps, claves[i] );
          
          let restarGatewayAndBroadcast; //comprobar
          if (claves.length == 1) restarGatewayAndBroadcast = 2;
          else if (claves.length > 1 && i == 0) restarGatewayAndBroadcast = 1;
          else if (claves.length > 1 && (i + 1) == claves.length) restarGatewayAndBroadcast = 1;
          else restarGatewayAndBroadcast = 0;
          
          let nameRed = this.convertirAValidoEnExcel(`${ claves[i] }.0 (${ totalIps - ( restarGatewayAndBroadcast + ipUsadas ) } Ips disponibles) ${ x.nombre }`)

          listRedes.push(nameRed);  

          // Borrar las ips usadas
          groupedRedes[claves[i]] = groupedRedes[claves[i]].filter(value => !ipsUsadas.includes(value));
          ipsPorRed.push({
            red: nameRed,
            ips: groupedRedes[claves[i]]
          })
        }
      }

      let clientes = [];

      for (let index = 0; index < router.internet.length; index++) {
        const x = router.internet[index];
        
        const { nombre_plan, plan_internet } = x;

        plan_internet.forEach( (y: any) => {          
          clientes.push({ 
            ipv4: y.ipv4, 
            cliente: {
              nombres:        y.customer.nombres,
              tipo_documento: y.customer.tipo_documento,
              num_documento:  y.customer.numero_documento,
              celular:        y.customer.celular,
              email:          y.customer.email,
              direccion:      y.customer.direccion
            },
            facturacion: {
              tipo:             y.factura_id.tipo,
              dia_pago:         y.factura_id.dia_pago,
              tipo_impuesto:    y.factura_id.tipo_impuesto,
              tipo_comprobante: y.factura_id.tipo_comprobante,
              dia_gracia:       y.factura_id.dia_gracia,
              aplicar_corte:    y.factura_id.aplicar_corte,
              recordatorio:     y.factura_id.recordatorio_pago
            },
            router: { //chequear el tema de indice
              direccion:         y.direccion,
              coordenadas:       y.coordenadas,
              precio:            y.precio,
              fecha_instalacion: y.fecha_instalacion,
              mac:               y.mac,
              ipv4:              y.ipv4,
              servicio:          nombre_plan,
              router:            y.router_id.nombre,
              caja:              y.caja_id?.nombre,
              puerto:            y.puerto_id?.puerto
            }
          });
        })
        
        if ( ( index + 1 ) == router.internet.length ){
          return await this.generateExcelClients({ 
            router_name: router.nombre, 
            clientes,
            planes,
            listRedes,
            ipsPorRed,
            cajasNap 
          });          
        } 
      }
    } catch (error) {
      console.log( error );
    }
  }

  convertirAValidoEnExcel(nombre) {
    // Reemplazar caracteres no permitidos con guiones bajos
    const nombreValido = nombre.replace(/[^a-zA-Z0-9._]/g, '_');
  
    // Asegurarse de que no comience con un número
    if (/^\d/.test(nombreValido)) 
      return `_${nombreValido}`;
  
    return nombreValido;
  }

  getColumsName() {
    const nombresColumnas = [];
    const inicio = 'A'.charCodeAt(0);
    const fin = 'Z'.charCodeAt(0);

    for (let i = inicio; i <= fin; i++) 
      nombresColumnas.push(String.fromCharCode(i));

    for (let i = inicio; i <= fin; i++) {
      for (let j = inicio; j <= fin; j++) {
        const combinacion = String.fromCharCode(i) + String.fromCharCode(j);
        nombresColumnas.push(combinacion);
      }
    }

    return nombresColumnas.slice(0, 150);
  }

  async generateExcelClients ( router: any ) {
    const pathPlantilla = path.resolve(__dirname, `../../static/resource/clientes.xlsx`);

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(pathPlantilla)

      const worksheet      = workbook.getWorksheet('clientes');
      const listaWorksheet = workbook.getWorksheet('lista');
      
      const columnas = this.getColumsName();

      for (let index = 0; index < router.ipsPorRed.length; index++) {
        const red = router.ipsPorRed[index];     
        
        for (let y = 0; y < red.ips.length; y++) {          
          Object.assign(listaWorksheet.getCell(`${columnas[index]}${ y + 1 }`), {
            value: red.ips[y],
            name: router.ipsPorRed[index].red
          });
        }
      }

      for (let x = 0; x < router.cajasNap.length; x++) {
        const caja = router.cajasNap[x];
        caja.puertos = caja.puertos.filter(elemento => elemento !== null);

        for (let y = 300; y < (caja.puertos.length + 300); y++) {
          const puerto = caja.puertos[y - 300];
          Object.assign(listaWorksheet.getCell(`${columnas[x]}${ y }`), {
            value: puerto,
            name: caja.caja
          });            
        }
      }

      for (let index = 3; index < 1000; index++) {
        worksheet.getCell(`B${ index }`).dataValidation = {
          type: 'list',
          formulae: ['"Cedula,RUC,Pasaporte"'],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        
        worksheet.getCell(`C${ index }`).dataValidation = {
          type: 'whole',
          operator: 'between',
          formula1: 0,
          formula2: Number.MAX_SAFE_INTEGER,
          showErrorMessage: true,
          errorTitle: 'Error de validación',
          error: 'Por favor, ingresa solo numeros'
        };
      }
  
      let dias = new Array(28).fill(0).map( (_, idx) => idx + 1 );
      let diaGracia = new Array(25).fill(0).map( (_, idx) => `${ idx + 1 }  ${ idx == 0 ? 'Día' : 'Días' }` );
      let diaAplicarCorte = new Array(12).fill(0).map( (_, idx) => 
          `${ idx + 1 }  ${ idx == 0 ? 'Mes' : 'Meses' } ${ idx == 0 ? 'Vencido' : 'Vencidos' }` );
  
      for (let index = 3; index < 1000; index++) {
        worksheet.getCell(`G${ index }`).dataValidation = {
          type: 'list',
          formulae: ['"Prepago (Adelantado),Postpago (Vencido)"'],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        worksheet.getCell(`H${ index }`).dataValidation = {
          type: 'list',
          formulae: [`"${ dias.join(',') }"`],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        worksheet.getCell(`I${ index }`).dataValidation = {
          type: 'list',
          formulae: ['"Impuestos incluido, Mas impuestos, Ninguno"'],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        worksheet.getCell(`J${ index }`).dataValidation = {
          type: 'list',
          formulae: [`"${ diaGracia.join(',') }"`],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        worksheet.getCell(`K${ index }`).dataValidation = {
          type: 'list',
          formulae: [`"${ diaAplicarCorte.join(',') }"`],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        worksheet.getCell(`L${ index }`).dataValidation = {
          type: 'list',
          formulae: ['"Factura, Recibo"'],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        worksheet.getCell(`M${ index }`).dataValidation = {
          type: 'list',
          formulae: ['"Correo, Telegram"'],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.',
          allowBlank: true, // Permite dejar la celda en blanco
          promptTitle: 'Selecciona opciones',
          prompt: 'Puedes seleccionar múltiples opciones manteniendo presionada la tecla Ctrl.'
        };
      }

      for (let index = 3; index < 1000; index++) {
        worksheet.getCell(`N${ index }`).dataValidation = {
          type: 'list',
          formulae: [`"${ router.router_name }"`],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        worksheet.getCell(`O${ index }`).dataValidation = {
          type: 'list',
          formulae: [`"${ router.planes.join(',') }"`],
          showErrorMessage: true,
          errorTitle: 'Seleccionar opción',
          error: 'Elige una opción de la lista.'
        };
        worksheet.getCell(`P${ index }`).dataValidation = {
          type: 'list',
          formulae: [`"${ router.ipsPorRed.map( red => red.red).join(',') }"`],
          showErrorMessage: true,
          errorTitle: 'Invalido',
          error: 'Por favor, elija una opción de la lista.',
        };
        worksheet.getCell(`R${ index }`).dataValidation = {
          type: 'list',
          formulae: [`"${ router.cajasNap.map( caja => caja.caja ).join(',') }"`],
          showErrorMessage: true,
          errorTitle: 'Invalido',
          error: 'Por favor, elija una opción de la lista.',
        };
      }

      const redes = router.ipsPorRed.map( ({ red }) => red)

      // Agregar clientes
      for (let index = 0; index < router.clientes.length; index++) {
        const { cliente, facturacion, router: servicio } = router.clientes[index];

        let tipoDocumento;
        if ( cliente.tipo_documento == '05' ) tipoDocumento = 'Cedula'
        if ( cliente.tipo_documento == '04' ) tipoDocumento = 'RUC'
        if ( cliente.tipo_documento == '06' ) tipoDocumento = 'Pasaporte'
        
        worksheet.getCell(`A${ index + 10 }`).value = cliente.nombres;
        worksheet.getCell(`B${ index + 10 }`).value = tipoDocumento;
        worksheet.getCell(`C${ index + 10 }`).value = cliente.num_documento;
        worksheet.getCell(`D${ index + 10 }`).value = cliente.celular;
        worksheet.getCell(`E${ index + 10 }`).value = cliente.email;
        worksheet.getCell(`F${ index + 10 }`).value = cliente.direccion;

        worksheet.getCell(`G${ index + 10 }`).value = facturacion.tipo == 'postpago' 
                ? 'Prepago (Adelantado)' 
                : 'Postpago (Vencido)';
        worksheet.getCell(`H${ index + 10 }`).value = facturacion.dia_pago;
        worksheet.getCell(`I${ index + 10 }`).value = facturacion.tipo_impuesto;
        worksheet.getCell(`J${ index + 10 }`).value = facturacion.dia_gracia;
        worksheet.getCell(`K${ index + 10 }`).value = facturacion.aplicar_corte;
        worksheet.getCell(`L${ index + 10 }`).value = facturacion.tipo_comprobante;
        worksheet.getCell(`M${ index + 10 }`).value = facturacion.recordatorio[0];
        
        const indiceRed = redes.findIndex(red => this.perteneceARed(servicio.ipv4, red.split('_')[1]));

        worksheet.getCell(`P${ index + 10 }`).value = redes[indiceRed];
        worksheet.getCell(`Q${ index + 10 }`).value = servicio.ipv4;
        worksheet.getCell(`R${ index + 10 }`).value = servicio.caja;
        worksheet.getCell(`S${ index + 10 }`).value = servicio.puerto;
        worksheet.getCell(`N${ index + 10 }`).value = servicio.router;
        worksheet.getCell(`O${ index + 10 }`).value = servicio.servicio;
        worksheet.getCell(`T${ index + 10 }`).value = servicio.mac;
        worksheet.getCell(`U${ index + 10 }`).value = servicio.precio;
        worksheet.getCell(`V${ index + 10 }`).value = servicio.direccion;
        worksheet.getCell(`W${ index + 10 }`).value = servicio.coordenadas;
      }
      
      return workbook.xlsx.writeBuffer();
      
    } catch (error) {
      console.error('Error al cargar o guardar la plantilla:', error);
    }
  }

  perteneceARed(ip, red) {
    const ipRed = red.split('.').slice(0, 3).join('.');
    return ip.startsWith(ipRed);
  }

  async repararRouter( router_id ){
    try {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();

      const router = await queryRunner.manager.findOne( Router, { 
        relations: { internet: { plan_internet: { customer: true } } },
        where: { id: router_id } } 
      );

      await this.agregarClientesAlMikrotik( router.internet, router ); 
      
      return { msg: "Clientes agregados exitosamente" };

    } catch (error) {
      if( typeof(error) == 'object' ){
        throw new BadRequestException(error);
      }else{
        throw new BadRequestException(['Error al agregar cliente a mikrotik']);
      }

    }
  }

  async agregarClientesAlMikrotik( internet, router ){
    return new Promise(async (resolve, reject) => {

      const { ip_host, user_api: user , password_api: password, puerto_api } = router;
      const clientes = [];

      internet.forEach( async (x, index) => {
        const { subida_Mbps, descarga_Mbps, limit_at, prioridad, address_list, plan_internet } = x;

        plan_internet.forEach( (y: any) => {
          clientes.push({ 
            ipv4: y.ipv4, 
            cliente: y.customer.nombres, 
            servicio: { subida_Mbps, descarga_Mbps, limit_at, prioridad, address_list } 
          });
        })
        
        if ( ( index + 1 ) == internet.length ){
          try {
            await this.createClient( 
              { ip_host, user, password, puerto_api }, 
              '', '', '', clientes );    

            resolve('clientes agregados al mikrotik');

          } catch (error) {
            reject(error)
          }
        } 
      });
    });
  }

}
