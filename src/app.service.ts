import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { ServicioCliente } from './customers/entities/ServicioCliente.entity';
import { Pago } from './pagos/entities/pago.entity';
import * as moment from 'moment';

@Injectable()
export class AppService {

  constructor(    
    private readonly dataSource: DataSource
  ){}

  //'*/1 * * * *'
  // Este cron job se ejecutará a las 12:00 AM el primer día de cada mes.
  @Cron('0 0 1 * *')
  async handleCron( evitarPrimeraEjecucion ){
    let parametro = evitarPrimeraEjecucion
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      if (!parametro) { 
        var date = new Date();

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        
        const servicios = await queryRunner.manager.find(ServicioCliente)
        
        servicios.forEach( async (servicio, index) => {
          
          if( servicio.isActive ){
            const proximo_pago = moment(date).add((servicio.factura_id.dia_pago - 1), 'days');        
  
            const pago = await queryRunner.manager.findOne(Pago, { 
              where: { servicio: { id: servicio.id } },
              order: { created_at: "DESC" }              
            });
  
            if ( pago ) {
              let ultimaFechaPago = new Date( pago.dia_pago );
    
              if ( date > ultimaFechaPago) {
                await queryRunner.manager.save(Pago, { 
                  servicio, 
                  estadoSRI: 'NO PAGADO', 
                  dia_pago: proximo_pago 
                });
              }            
            }else{
              await queryRunner.manager.save(Pago, { 
                servicio, 
                estadoSRI: 'NO PAGADO', 
                dia_pago: proximo_pago 
              });
            }
          }
  
          if ( ( index + 1 ) == servicios.length ) await queryRunner.release()          
        })        
      }else
        parametro = false;
    } catch (error) {
      console.log( "cron-job", error );
      await queryRunner.release()
    }
  }

}
