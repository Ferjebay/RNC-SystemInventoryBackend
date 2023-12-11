import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class PagosService {

  private readonly logger = new Logger('PagoService');

  constructor(
    @InjectRepository( Pago )
    private readonly pagoRepository: Repository<Pago>
  ){}

  create(createPagoDto: CreatePagoDto) {
    return 'This action adds a new pago';
  }

  findAll() {
    return `This action returns all pagos`;
  }

  async findOne(term: string) {
    let pagos: Pago[];

    if ( isUUID(term) ) 
      pagos = await this.pagoRepository.findBy({ servicio: { id: term } });

    if ( pagos.length === 0 ) 
      throw new NotFoundException(`pagos with ${ term } not found`);

    return pagos;
  }

  async update(id: string, updatePagoDto: UpdatePagoDto) {
    try {
      await this.pagoRepository.update( id, updatePagoDto );

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
