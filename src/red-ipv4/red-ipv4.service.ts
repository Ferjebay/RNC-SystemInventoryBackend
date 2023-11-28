import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateRedIpv4Dto } from './dto/create-red-ipv4.dto';
import { UpdateRedIpv4Dto } from './dto/update-red-ipv4.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RedIpv4 } from './entities/red-ipv4.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class RedIpv4Service {

  private readonly logger = new Logger('RouterService');

  constructor(
    @InjectRepository( RedIpv4 )
    private readonly redIpv4Repository: Repository<RedIpv4>
  ){}

  async create(createRedIpv4Dto: CreateRedIpv4Dto) {
    try {
      const redIpv4 = this.redIpv4Repository.create( createRedIpv4Dto );

      await this.redIpv4Repository.save( redIpv4 );
  
      return redIpv4;      
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
      }
    }

    if ( estado ) option.where.isActive = true; 

    return await this.redIpv4Repository.find( option );
  }

  async findOne(id: string) {
    let redIPv4: RedIpv4;

    if ( isUUID(id) ) 
    redIPv4 = await this.redIpv4Repository.findOneBy({ id });

    if ( !redIPv4 )
      throw new BadRequestException(`No se encontro el registro con el id ${ id }`);

    return redIPv4;
  }

  async setEstado(id: string, estado: boolean) {

    if ( estado ) 
      await this.redIpv4Repository.update( id, { isActive: true })
    else
      await this.redIpv4Repository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async update(id: string, updateRedIpv4Dto: UpdateRedIpv4Dto) {
    await this.findOne( id );

    try {
      await this.redIpv4Repository.update( id, updateRedIpv4Dto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };      

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async remove(id: string) {
    const redIPv4 = await this.findOne( id );
    let msg: string; 

    await this.redIpv4Repository.remove( redIPv4 );
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
