import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Not, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class CustomersService {

  private readonly logger = new Logger('CustomerService');

  constructor(
    @InjectRepository( Customer )
    private readonly customerRepository: Repository<Customer>
  ){}

  async create(createCustomerDto: CreateCustomerDto, company_id: Company) {
    try {
      const customer = this.customerRepository.create( createCustomerDto );

      customer.company_id = company_id;
      
      await this.customerRepository.save( customer );
  
      return customer;      
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( estado: boolean, company_id: Company ) {
    let option:any = { 
      where: { 
        company_id: { id: company_id }, 
        nombres: Not("CONSUMIDOR FINAL"),
        isActive: null 
      }, 
      order: { 
        created_at: "DESC"
      } 
    }

    if ( estado ) option.where.isActive = true;

    return await this.customerRepository.find( option );
  }

  async findOne(term: string) {
    let customer: Customer[];

    if ( isUUID(term) ) {
      customer = await this.customerRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.customerRepository.createQueryBuilder('customer'); 
      customer = await queryBuilder
        .where('UPPER(nombres) =:nombres', {
          nombres: term.toUpperCase()
        })        
        .getMany();
    }

    if ( customer.length === 0 ) 
      throw new NotFoundException(`customer with ${ term } not found`);

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne( id );

    try {
      await this.customerRepository.update( id, updateCustomerDto );

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
      await this.customerRepository.update( id, { isActive: true })
    else
      await this.customerRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove(id: string) {
    const customer = await this.findOne( id );
    let msg: string; 

    await this.customerRepository.remove( customer );
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
