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
          
          const dia_pago = moment(date).add((servicio.factura_id.dia_pago - 1), 'days');        

          await queryRunner.manager.save(Pago, { servicio: servicio, estadoSRI: 'NO PAGADO', dia_pago });
  
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
