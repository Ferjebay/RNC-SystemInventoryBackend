import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class ProvidersService {

  private readonly logger = new Logger('ProvidersService');

  constructor(
    @InjectRepository( Provider )
    private readonly providerRepository: Repository<Provider>
  ){}

  async create(createProviderDto: CreateProviderDto, company_id: Company) {
    try {

      const provider = this.providerRepository.create( createProviderDto );

      provider.company = company_id;

      await this.providerRepository.save( provider );

      return provider;
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( estado: boolean, company_id: Company ) {
    try {
      let option:any = {
        where: {
          company: {
            id: company_id,
            isActive: null
          }
        },
        order: {
          created_at: "DESC"
        }
      }

      if ( estado ) option.where.isActive = true;

      return await this.providerRepository.find( option );
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findOne(term: string) {
    let provider: Provider[];

    if ( isUUID(term) ) {
      provider = await this.providerRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.providerRepository.createQueryBuilder('provider');
      provider = await queryBuilder
        .where('UPPER(razon_social) =:razon_social', {
          razon_social: term.toUpperCase()
        })
        .getMany();
    }

    if ( provider.length === 0 )
      throw new NotFoundException(`provider with ${ term } not found`);

    return provider;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto, company_id: Company) {
    await this.findOne( id );

    try {

      await this.providerRepository.update( id, updateProviderDto );

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
      await this.providerRepository.update( id, { isActive: true })
    else
      await this.providerRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove( id: string ) {
    const provider = await this.findOne( id );
    let msg: string;

    await this.providerRepository.remove( provider );
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
