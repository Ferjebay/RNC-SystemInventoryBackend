import { Injectable } from '@nestjs/common';
const RouterOSAPI = require("node-routeros").RouterOSAPI;

@Injectable()
export class MikrotikService {

  private conn;

  async connect( host, user, password ) {
    this.conn = new RouterOSAPI({ host, user, password });
  }

  async createClient( router, internet, ipv4, cliente_name ) {
    return new Promise(async (resolve, reject) => {

      try {
  
        const { ip_host, user, password, puerto_api } = router;
        const { subida_Mbps, descarga_Mbps, limit_at, prioridad, address_list } = internet;

        const limit_at_subida   =  Math.ceil((( +subida_Mbps * +limit_at) / 100));
        const limit_at_descarga =  Math.ceil((( +descarga_Mbps * +limit_at) / 100));
  
        await this.connect( ip_host, user, password );
  
        await this.conn.connect();
        
        //Aregar Queue
        await this.conn.write('/queue/simple/add', [
          `=target=${ ipv4 }`,
          `=comment=${ cliente_name }`,
          `=max-limit=${ subida_Mbps }M/${ descarga_Mbps }M`,
          `=limit-at=${ limit_at_subida }M/${ limit_at_descarga }M`,
          `=name=${ cliente_name } | ${ ipv4 }`,
          `=priority=${ prioridad }/${ prioridad }`,
        ]);      
  
        //Agregar cliente a lista
        if ( address_list.length > 0 ) {
          await this.conn.write("/ip/firewall/address-list/add", [
            `=address=${ ipv4 }`, 
            `=comment=${ address_list }`,
            `=list=${ address_list }`
          ])
        }

        this.conn.close();
        resolve("Mikrotik: Cliente agregado");
        
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

}
