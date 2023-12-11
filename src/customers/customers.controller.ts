import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe, Headers, Put } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Company } from 'src/companies/entities/company.entity';
import { Router } from 'src/router/entities/router.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @Headers('company_id') company_id: Company,
    @Body() createCustomerDto: CreateCustomerDto
  ) {
    return this.customersService.create(createCustomerDto, company_id);
  }

  @Get(':estado?')
  findAll(
    @Headers('company_id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.customersService.findAll( estado, company_id );
  }

  @Get('/find/:term')
  findOne(@Param('term') term: string) {
    return this.customersService.findOne( term );
  }

  @Get('/get-ips/:router_id')
  getIpsUtilizadas(@Param('router_id') router_id: Router) {
    return this.customersService.getIpsUtilizadas( router_id );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Put('/actualizarDatosFactura/:id')
  actualizarDatosFactura(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() datosFacturacion: any
  ){
    return this.customersService.actualizarDatosFactura(id, datosFacturacion);
  }

  @Put('/actualizarDatosPersonales/:id')
  actualizarDatosPersonales(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() datosFactura: any
  ){
    return this.customersService.actualizarDatosPersonales(datosFactura, '');
  }

  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('estado', ParseBoolPipe) estado: boolean, 
    ) {
    return this.customersService.setEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove( id );
  }
}
