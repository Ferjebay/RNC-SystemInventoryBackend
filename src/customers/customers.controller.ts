import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe, Headers, Put, Res } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Company } from 'src/companies/entities/company.entity';
import { Router } from 'src/router/entities/router.entity';
import { Response } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Headers('company-id') company_id: Company,
    @Body() createCustomerDto: CreateServicioDto
  ) {
    return await this.customersService.create(createCustomerDto, company_id);
  }

  @Post('/download-clients-excel/')
  async downloadClientsToExcel(
    @Headers('company-id') company_id: Company,
    @Res() res: Response
  ){
    const file = await this.customersService.downloadClientsToExcel( company_id );
    res.setHeader('Content-Disposition', 'attachment; filename=ejemplo.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send( file );
  }

  @Post('/create')
  async createCustomer(
    @Headers('company-id') company_id: Company,
    @Body() createCustomerDto: CreateCustomerDto
  ) {
    return await this.customersService.createCustomer(createCustomerDto, company_id);
  }

  @Get(':estado?')
  async findAll(
    @Headers('company-id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean
  ) {
    return await this.customersService.findAll( estado, company_id );
  }

  @Get('/find/:term')
  async findOne(@Param('term') term: string) {
    return await this.customersService.findOne( term );
  }

  @Get('/get-ips/:router_id')
  async getIpsUtilizadas(@Param('router_id') router_id: Router) {
    return await this.customersService.getIpsUtilizadas( router_id );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('company-id') company_id: Company,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return await this.customersService.update(id, updateCustomerDto, company_id);
  }

  @Put('/actualizarDatosFactura/:id')
  async actualizarDatosFactura(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datosFacturacion: any
  ){
    return await this.customersService.actualizarDatosFactura(id, datosFacturacion);
  }

  @Put('/actualizarDatosPersonales/:id')
  async actualizarDatosPersonales(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datosFactura: any
  ){
    return await this.customersService.actualizarDatosPersonales(id, datosFactura);
  }

  @Put('/actualizarDatosServicio/:id')
  async actualizarDatosServicio(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datosServicio: any
  ){
    return await this.customersService.actualizarDatosServicio(id, datosServicio);
  }

  @Put('/activeOrSuspendService/:id')
  async activeOrSuspendService(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datosServicio: any
  ){
    return await this.customersService.activeOrSuspendService(id, datosServicio);
  }

  @Patch(':id/:estado')
  async setEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estado', ParseBoolPipe) estado: boolean,
    ) {
    return await this.customersService.setEstado(id, estado);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.customersService.remove( id );
  }
}
