import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';
import { Company } from '../companies/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Router } from './entities/router.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class RouterService {

  private readonly logger = new Logger('RouterService');

  constructor(
    @InjectRepository( Router )
    private readonly routerRepository: Repository<Router>
  ){}

  async create(createRouterDto: CreateRouterDto, company_id: Company) {
    await this.findOne( company_id, 'crear' );

    try {

      const router = this.routerRepository.create( createRouterDto );

      router.company_id = company_id;
      
      await this.routerRepository.save( router );
  
      return router;      
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( company_id, rol_name, estado: boolean ) {
    let option:any = { 
      order: { created_at: "DESC" }, 
      where: { 
        isActive: null,
        company_id: { id: null } 
      }}

    if ( estado ) option.where.isActive = true 
    if ( rol_name != 'Super-Administrador' ) option.where.company_id.id = company_id; 

    return await this.routerRepository.find( option );
  }

  async findOne(id: any, tipo: string) {
    let router: Router[];
    
    if ( isUUID(id) ) {
      router = await this.routerRepository.find({
        where: [
          { company_id: { id } },
          { id }
        ]
      });
    }

    // if ( router.length > 0 && tipo == 'crear' ){
    //   throw new BadRequestException(`Ya existe configuración de router en la empresa ${ router[0].company_id.nombre_comercial }`);
    // }

    return router;
  }

  async update(id: string, updateRouterDto: UpdateRouterDto) {
    await this.findOne( id, 'busqueda' );

    try {
      await this.routerRepository.update( id, updateRouterDto );

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
      await this.routerRepository.update( id, { isActive: true })
    else
      await this.routerRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove(id: string) {
    const router = await this.findOne( id, 'busqueda' );
    let msg: string; 

    await this.routerRepository.remove( router );
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
