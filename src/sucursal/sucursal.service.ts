import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class SucursalService {
  private readonly logger = new Logger('SucursalService');

  constructor(
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>
  ){}

  async create(
    createSucursalDto: CreateSucursalDto
  ) {
    try {

      const product = this.sucursalRepository.create( createSucursalDto );

      await this.sucursalRepository.save( product );

      return product;
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( estado: boolean, company_id: Company ) {
    let option:any = {
      relations: { company_id: true },
      select: { company_id: { id: true } },
      where: { company_id: { id: company_id } },
      order: { created_at: "DESC" }
    }

    if ( estado ) option.where = { isActive: true }

    return await this.sucursalRepository.find( option );
  }

  async findOne(term: string, modelo: string = 'sucursal') {
    let sucursal: Sucursal[];

    if ( isUUID(term) ) {
      if ( modelo == 'sucursal' ) {
        sucursal = await this.sucursalRepository.find({
          where: { id: term },
          relations: ['company_id']
        });
      }else{
        sucursal = await this.sucursalRepository.find({
          where: { company_id: { id: term } },
          relations: ['company_id']
        });
      }
    } else {
      const queryBuilder = this.sucursalRepository.createQueryBuilder('est');
      sucursal = await queryBuilder
        .leftJoinAndSelect('est.company_id', 'company')
        .where('UPPER(nombre) =:nombre', { nombre: term.toUpperCase() })
        .getMany();
    }

    return sucursal;
  }

  async update(id: string, updateSucursalDto: UpdateSucursalDto) {
    await this.findOne( id );

    try {
      await this.sucursalRepository.update( id, updateSucursalDto );

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
      await this.sucursalRepository.update( id, { isActive: true })
    else
      await this.sucursalRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove(id: string) {
    const sucursal = await this.findOne( id );
    let msg: string;

    await this.sucursalRepository.remove( sucursal );
    msg = 'Eliminado Exitosamente'

    return { ok: true, msg };;
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
