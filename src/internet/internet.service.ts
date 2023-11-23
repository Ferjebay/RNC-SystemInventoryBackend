import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateInternetDto } from './dto/create-internet.dto';
import { UpdateInternetDto } from './dto/update-internet.dto';
import { Company } from 'src/companies/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Internet } from './entities/internet.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class InternetService {

  private readonly logger = new Logger('RouterService');

  constructor(
    @InjectRepository( Internet )
    private readonly internetRepository: Repository<Internet>
  ){}

  async create(createInternetDto: CreateInternetDto, company_id: Company) {
    try {
      const internet = this.internetRepository.create( createInternetDto );

      internet.company_id = company_id;
      
      await this.internetRepository.save( internet );
  
      return internet;      
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( company_id, estado: boolean ) {
    let option:any = { 
      order: { created_at: "DESC" }, 
      where: { 
        isActive: null,
        company_id: { id: company_id } 
      }}

    if ( estado ) option.where.isActive = true; 

    return await this.internetRepository.find( option );
  }

  async findOne(id: string) {
    let internet: Internet;

    if ( isUUID(id) ) 
      internet = await this.internetRepository.findOneBy({ id });

    if ( !internet )
      throw new BadRequestException(`No se encontro el registro con el id ${ id }`);

    return internet;
  }

  async update(id: string, updateInternetDto: UpdateInternetDto) {
    await this.findOne( id );

    try {
      await this.internetRepository.update( id, updateInternetDto );

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
      await this.internetRepository.update( id, { isActive: true })
    else
      await this.internetRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove(id: string) {
    const internet = await this.findOne( id );
    let msg: string; 

    await this.internetRepository.remove( internet );
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
