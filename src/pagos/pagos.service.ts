import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';

@Injectable()
export class PagosService {

  private readonly logger = new Logger('PagoService');

  constructor(
    @InjectRepository( Pago )
    private readonly pagoRepository: Repository<Pago>
  ){}

  async create(createPagoDto: CreatePagoDto) {
    try {
      const pago = this.pagoRepository.create( createPagoDto );

      const pagoCreated = await this.pagoRepository.save( pago );
  
      return pagoCreated;      
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  findAll() {
    return `This action returns all pagos`;
  }

  async findOne(term: string) {
    let pagos: Pago[];

    if ( isUUID(term) ) 
      pagos = await this.pagoRepository.find({ 
        where:{ servicio: { id: term } },
        order: { created_at: "DESC" } 
      });

    if ( pagos.length === 0 ) 
      throw new NotFoundException(`pagos with ${ term } not found`);

    return pagos;
  }

  async update(id: string, updatePagoDto: UpdatePagoDto, sucursal_id: any) {
    try {
      let object = { ...updatePagoDto, sucursal_id: null }

      if( sucursal_id !== '')
        object.sucursal_id = sucursal_id;

      await this.pagoRepository.update( id, object );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };      

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pago`;
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
