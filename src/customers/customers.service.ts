import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';
import { FacturaCliente } from './entities/Facturacion.entity';
import { ServicioCliente } from './entities/ServicioCliente.entity';

@Injectable()
export class CustomersService {

  private readonly logger = new Logger('CustomerService');

  constructor(
    @InjectRepository( Customer )
    private readonly customerRepository: Repository<Customer>,    
    @InjectRepository( ServicioCliente )
    private readonly servicioRepository: Repository<ServicioCliente>,    
    private readonly dataSource: DataSource
  ){}

  async create(createCustomerDto: CreateCustomerDto, company_id: Company) {
   const queryRunner = this.dataSource.createQueryRunner();
   await queryRunner.connect();
   await queryRunner.startTransaction();
    try {
      const customer = this.customerRepository.create( createCustomerDto.cliente );
      customer.company_id = company_id;      
      const customerCreated = await queryRunner.manager.save( Customer, customer );
      
      //crear datos de facturacion
      let facturacion = new FacturaCliente();
      facturacion = { ...createCustomerDto.facturacion, customer: customerCreated };
      const facturaCreated = await queryRunner.manager.save( FacturaCliente, facturacion );
      
      //crear servicios del internet
      let servicioCliente: any = {}
      if( Object.entries( createCustomerDto.servicio.caja_id ).length === 0 || !isUUID(createCustomerDto.servicio['puerto_id']) ){
        const { caja_id, puerto_id, ...rest } = createCustomerDto.servicio
        servicioCliente = { ...rest }
      }else{
        servicioCliente = createCustomerDto.servicio;
      }
      
      let servicio = new ServicioCliente();
      servicio = { ...servicioCliente, customer: customerCreated, factura_id: facturaCreated };
      await queryRunner.manager.save( ServicioCliente, servicio );

      await queryRunner.commitTransaction();
      await queryRunner.release();
  
      return customerCreated;      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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

  async getIpsUtilizadas( id: any ) {
    return await this.servicioRepository.find({ 
      where: { router_id: { id } },
      select: { ipv4: true } 
    });
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
      // await this.customerRepository.update( id, updateCustomerDto );

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

  async actualizarDatosFactura( id, datosFacturacion ){
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect()
      await queryRunner.manager.update(FacturaCliente, id, datosFacturacion)
      const factura = await queryRunner.manager.findBy(FacturaCliente, { id })
      await queryRunner.release()
      return { factura, msg: "Datos de Facturación actualizados" };        
    } catch (error) {
      this.handleDBExceptions( error );
      await queryRunner.release()
    }
  }

  async actualizarDatosPersonales( id, datosClientes ){
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect()
      await queryRunner.manager.update(Customer, id, datosClientes)
      const cliente = await queryRunner.manager.findBy(Customer, { id })
      await queryRunner.release()
      return { cliente, msg: "Datos del cliente actualizados" };        
    } catch (error) {
      this.handleDBExceptions( error );
    }
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
