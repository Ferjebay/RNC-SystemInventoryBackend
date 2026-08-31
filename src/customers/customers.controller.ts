import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe, Headers, Put, Res, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Company } from 'src/companies/entities/company.entity';
import { Response } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}


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

  /**
   * Va declarado ANTES de @Get(':estado?'): esa ruta tambien matchea un unico
   * segmento y se tragaria 'consumidor-final' (ParseBoolPipe lo rechazaria).
   */
  @Get('consumidor-final')
  async obtenerConsumidorFinal(
    @Headers('company-id') company_id: Company
  ) {
    return await this.customersService.obtenerConsumidorFinal( company_id );
  }

  @Get(':estado?')
  async findAll(
    @Headers('company-id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('busqueda') busqueda?: string
  ) {
    // Sin page/limit se devuelve el arreglo completo: los selectores de cliente
    // de facturación necesitan todos los registros para buscar dentro del combo.
    // El mantenedor sí los manda y recibe { items, meta }.
    if ( page === undefined && limit === undefined )
      return await this.customersService.findAll( estado, company_id, busqueda );

    return await this.customersService.findAllPaginado(
      { page, limit }, estado, company_id, busqueda
    );
  }

  @Get('/find/:term')
  async findOne(@Param('term') term: string) {
    return await this.customersService.findOne( term );
  }


  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('company-id') company_id: Company,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return await this.customersService.update(id, updateCustomerDto, company_id);
  }


  @Put('/actualizarDatosPersonales/:id')
  async actualizarDatosPersonales(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datosFactura: any
  ){
    return await this.customersService.actualizarDatosPersonales(id, datosFactura);
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
