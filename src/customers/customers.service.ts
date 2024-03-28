import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';
import { FacturaCliente } from './entities/Facturacion.entity';
import { ServicioCliente } from './entities/ServicioCliente.entity';
import { MikrotikService } from '../mikrotik/mikrotik.service';
import { Pago } from 'src/pagos/entities/pago.entity';
const ExcelJS = require('exceljs');
const path = require('path');

@Injectable()
export class CustomersService {

  private readonly logger = new Logger('CustomerService');

  constructor(
    @InjectRepository( Customer )
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository( ServicioCliente )
    private readonly servicioRepository: Repository<ServicioCliente>,
    private readonly dataSource: DataSource,
    private readonly mikrotikService: MikrotikService
  ){}

  async create(CreateServicioDto: CreateServicioDto, company_id: Company) {
   const queryRunner = this.dataSource.createQueryRunner();
   await queryRunner.connect();
   await queryRunner.startTransaction();
    try {

      //Crear Cliente en el Mikrotik
      await this.mikrotikService.createClient(
        CreateServicioDto.route,
        CreateServicioDto.internet.detalles,
        CreateServicioDto.servicio.ipv4,
        CreateServicioDto.cliente.nombres
      );

      const customer = this.customerRepository.create( CreateServicioDto.cliente );
      customer.company_id = company_id;
      const customerCreated = await queryRunner.manager.save( Customer, customer );

      // //crear datos de facturacion
      let facturacion = new FacturaCliente();
      facturacion = { ...CreateServicioDto.facturacion, customer: customerCreated };
      const facturaCreated = await queryRunner.manager.save( FacturaCliente, facturacion );

      // //crear servicios del internet
      let servicioCliente: any = {}
      if( Object.entries( CreateServicioDto.servicio.caja_id ).length === 0
          || !isUUID(CreateServicioDto.servicio['puerto_id']) ){
        const { caja_id, puerto_id, ...rest } = CreateServicioDto.servicio
        servicioCliente = { ...rest }
      }else{
        servicioCliente = CreateServicioDto.servicio;
      }

      let servicio = new ServicioCliente();
      servicio = { ...servicioCliente, customer: customerCreated, factura_id: facturaCreated };
      await queryRunner.manager.save( ServicioCliente, servicio );

      await queryRunner.manager.save(Pago, {
        servicio,
        estadoSRI: 'NO PAGADO',
        dia_pago: CreateServicioDto.fechaPago
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return customerCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if ( error.type )
        throw new BadRequestException(['Error al agregar cliente a mikrotik', error.error.message]);
      else
        this.handleDBExceptions( error )
    }
  }

  async downloadClientsToExcel( company_id ){
    const customers = await this.customerRepository.find({
      where: { company_id: { id: company_id } }
    });

    const pathPlantilla = path.resolve(__dirname, `../../static/resource/clientes_plantilla.xlsx`);

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(pathPlantilla)

      const worksheet  = workbook.getWorksheet('Hoja1');

      for (const [index, customer] of customers.entries()) {

        let tipo_documento = '';
        if ( customer.tipo_documento == '04' ) tipo_documento = 'RUC'
        if ( customer.tipo_documento == '05' ) tipo_documento = 'Cedula'
        if ( customer.tipo_documento == '06' ) tipo_documento = 'Pasaporte'

        worksheet.getCell(`A${ index + 2 }`).value = customer.nombres.toUpperCase();
        worksheet.getCell(`B${ index + 2 }`).value = tipo_documento;
        worksheet.getCell(`C${ index + 2 }`).value = customer.numero_documento;
        worksheet.getCell(`D${ index + 2 }`).value = customer.email;
        worksheet.getCell(`E${ index + 2 }`).value = customer.celular;
        worksheet.getCell(`F${ index + 2 }`).value = customer.direccion;
      }

      return workbook.xlsx.writeBuffer();
    } catch (error) {
      console.error('Error al cargar o guardar la plantilla:', error);
    }
  }

  async findAll( estado: boolean, company_id: Company ) {
    try {
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
    } catch (error) {
      this.handleDBExceptions(error);
    }
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

  async update(id: string, updateServicioDto: UpdateCustomerDto, company_id) {
    await this.findOne( id );
    await this.existEmailAndCedula(
      updateServicioDto.email,
      updateServicioDto.numero_documento,
      company_id,
      true,
      id
    )

    try {
      await this.customerRepository.update( id, updateServicioDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async existEmailAndCedula( email, num_doc, company_id, edit = false, client_id = '' ){
    const existsEmail = await this.customerRepository.findOne({
      where: { email: email, company_id: { id: company_id } }
    });

    if (existsEmail && !edit)
      throw new BadRequestException(`Ya existe un cliente con este email: ${ email }`);
    if (existsEmail && edit && client_id != existsEmail.id){
      throw new BadRequestException(`Ya existe un cliente con este email: ${ email }`);
    }

    const existsNumDoc = await this.customerRepository.findOne({
      where: { numero_documento: num_doc, company_id: { id: company_id } }
    });

    if (existsNumDoc && !edit)
      throw new BadRequestException(`Ya existe un cliente con este numero de documento: ${ num_doc }`);
    if (existsNumDoc && edit && client_id != existsNumDoc.id)
      throw new BadRequestException(`Ya existe un cliente con este numero de documento: ${ num_doc }`);
  }

  async createCustomer( createCustomer: CreateCustomerDto, company_id ) {

    await this.existEmailAndCedula( createCustomer.email, createCustomer.numero_documento, company_id )

    try {
      const customer = await this.customerRepository.create({
        ...createCustomer,
        company_id
      });

      await this.customerRepository.save( customer );

      return customer;

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

  async actualizarDatosServicio( id, datosServicio ){
    try {

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      //Editar Cliente en el Mikrotik
      await this.mikrotikService.editClient( datosServicio );

      const objectServicio = {
        router_id:          datosServicio.perfil_internet.router_id,
        direccion:          datosServicio.direccion,
        coordenadas:        datosServicio.coordenadas,
        perfil_internet:    datosServicio.perfil_internet,
        precio:             datosServicio.precio,
        fecha_instalacion:  datosServicio.fecha_instalacion,
        mac:                datosServicio.mac,
        red_id:             datosServicio.red_id,
        ipv4:               datosServicio.ipv4,
        caja_id:            datosServicio.caja_id,
        puerto_id:          datosServicio.puerto_id,
        indice:             datosServicio.indice
      }

      let servicioCliente: any = {}
      if( Object.entries( objectServicio.caja_id ).length === 0
          || !isUUID(objectServicio['puerto_id']) ){
        const { caja_id, puerto_id, ...rest } = objectServicio
        servicioCliente = { ...rest }
      }else{
        servicioCliente = objectServicio;
      }

      await queryRunner.manager.update(ServicioCliente, id, servicioCliente);
      await queryRunner.release();

      return { msg: "Servicio actualizado correctamente" };
    } catch (error) {
      if ( error.type )
        throw new BadRequestException(['Error al editar el cliente en mikrotik', error.error.message]);
      else
        this.handleDBExceptions( error )
    }
  }

  async activeOrSuspendService( id, datosServicio ){
    try {

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      await this.mikrotikService.activeOrSuspendService( datosServicio );

      await queryRunner.manager.update(ServicioCliente, id, {
        isActive: datosServicio.estado == 'activar' ? true : false
      });
      await queryRunner.release();

      return { msg: "Servicio actualizado correctamente" };
    } catch (error) {
      if ( error.type )
        throw new BadRequestException(['Error al editar el cliente en mikrotik', error.error.message]);
      else
        this.handleDBExceptions( error )
    }
  }

  async remove(id: string) {
    try {
      const customer = await this.findOne( id );
      let msg: string;

      await this.customerRepository.remove( customer );
      msg = 'Eliminado Exitosamente'

      return { ok: true, msg };
    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    if ( error.code === '23503' )
      throw new BadRequestException({
        detail: error.detail,
        code: '23503'
      });

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
