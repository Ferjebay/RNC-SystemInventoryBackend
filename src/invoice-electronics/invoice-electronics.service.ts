import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateInvoiceElectronicDto } from './dto/create-invoice-electronic.dto';
import { UpdateInvoiceElectronicDto } from './dto/update-invoice-electronic.dto';
import { Repository } from 'typeorm';
import { InvoiceElectronic } from './entities/invoice-electronic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class InvoiceElectronicsService {

  private readonly logger = new Logger('CustomerService');

  constructor(
    @InjectRepository(InvoiceElectronic)
    private readonly invoiceElectronicRepository: Repository<InvoiceElectronic>
  ){}

  async create(createInvoiceElectronicDto: CreateInvoiceElectronicDto) {
    try {
      const invoiceElectronic = this.invoiceElectronicRepository.create( createInvoiceElectronicDto );
      
      return await this.invoiceElectronicRepository.save( invoiceElectronic );  
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( estado: boolean ) {
    let option:any = { order: { created_at: "DESC" } }

    if ( estado ) option.where = { isActive: true };

    return await this.invoiceElectronicRepository.find( option );
  }

  async findOne(term: string) {
    let invoiceElectronic: InvoiceElectronic[];

    if ( isUUID(term) ) {
      invoiceElectronic = await this.invoiceElectronicRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.invoiceElectronicRepository.createQueryBuilder('invoiceElectronic'); 
      invoiceElectronic = await queryBuilder
        .where('UPPER(razon_social) =:nombres', {
          razon_social: term.toUpperCase()
        })        
        .getMany();
    }

    if ( invoiceElectronic.length === 0 ) 
      throw new NotFoundException(`invoiceElectronic with ${ term } not found`);

    return invoiceElectronic;
  }

  async update(id: string, updateInvoiceElectronicDto: UpdateInvoiceElectronicDto) {
    await this.findOne( id );

    try {
      await this.invoiceElectronicRepository.update( id, updateInvoiceElectronicDto );

      return {
        ok: true,
        msg: "Se actualizaron los datos exitosamente"
      };      

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} invoiceElectronic`;
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
