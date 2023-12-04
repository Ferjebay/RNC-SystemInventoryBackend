import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateCajaNapDto } from './dto/create-caja-nap.dto';
import { UpdateCajaNapDto } from './dto/update-caja-nap.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CajaNap } from './entities/caja-nap.entity';
import { Repository } from 'typeorm';
import { Puerto } from 'src/puertos/entities/puerto.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class CajaNapService {

  private readonly logger = new Logger('CajaNapService');

  constructor(
    @InjectRepository( CajaNap )
    private readonly cajaNapRepository: Repository<CajaNap>,
    @InjectRepository( Puerto )
    private readonly puertoRepository: Repository<Puerto>,
  ){}

  async create( createCajaNapDto: CreateCajaNapDto ) {
    try {
      const { puertos, ...rest } = createCajaNapDto
      const cajaNap = this.cajaNapRepository.create( rest );

      const cajaNapCreated = await this.cajaNapRepository.save( cajaNap );

      const puertosArray: Array<Puerto> = []; 
      const totalPuertos: number = parseInt( puertos )

      for (let index = 1; index <= totalPuertos; index++) 
      puertosArray.push(new Puerto( cajaNapCreated, index ));                
      
      await this.puertoRepository.save( puertosArray ); 

      return cajaNapCreated;      
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( router_id, estado: boolean ) {
    let option:any = { 
      order: { created_at: "DESC" }, 
      where: { 
        router_id: { id: router_id },
        isActive: null
      }}

    if ( estado ) option.where.isActive = true; 

    return await this.cajaNapRepository.find( option );
  }

  async findOne(id: string) {
    let cajaNap: CajaNap;

    if ( isUUID(id) ) 
      cajaNap = await this.cajaNapRepository.findOneBy({ id });

    if ( !cajaNap )
      throw new BadRequestException(`No se encontro el registro con el id ${ id }`);

    return cajaNap;
  }

  async update(id: any, updateCajaNapDto: UpdateCajaNapDto) {
    const cajaNapFound = await this.findOne( id );

    try {
      const { puertos, ...rest } = updateCajaNapDto
      
      await this.cajaNapRepository.update( id, rest );
      
      if ( parseInt( puertos ) < cajaNapFound.puertos.length ){
        cajaNapFound.puertos.forEach( async(caja) => {
          if ( caja.puerto > parseInt( puertos ) ) 
            await this.puertoRepository.remove( caja );
        })
      } 

      if ( parseInt( puertos ) > cajaNapFound.puertos.length ){
        const puertosArray: Array<Puerto> = []; 
        const totalPuertos: number = parseInt( puertos )

        for (let index = (cajaNapFound.puertos.length + 1); index <= totalPuertos; index++) 
          puertosArray.push(new Puerto( id, index ));                
        
        await this.puertoRepository.save( puertosArray ); 
      }

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };      

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async setEstado(id: string, estado: boolean) {

    if ( estado ) 
      await this.cajaNapRepository.update( id, { isActive: true })
    else
      await this.cajaNapRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove(id: string) {
    const cajaNap = await this.findOne( id );
    let msg: string; 

    await this.cajaNapRepository.remove( cajaNap );
    msg = 'Eliminado Exitosamente'
    
    return { ok: true, msg };
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
