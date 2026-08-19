import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe, Headers, Res, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Company } from 'src/companies/entities/company.entity';
import { Response } from 'express';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  async create(
    @Headers('company-id') company_id: Company,
    @Body() createProviderDto: CreateProviderDto
  ) {
    return await this.providersService.create(createProviderDto, company_id );
  }

  @Post('/download-providers-excel')
  async downloadProvidersToExcel(
    @Headers('company-id') company_id: Company,
    @Res() res: Response
  ){
    const file = await this.providersService.downloadProvidersToExcel( company_id );

    res.setHeader('Content-Disposition', 'attachment; filename=proveedores.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send( file );
  }

  @Get(':estado?')
  async findAll(
    @Headers('company-id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('busqueda') busqueda?: string
  ) {
    // Sin page/limit se devuelve el arreglo completo: el selector de proveedor
    // al registrar una compra necesita todos los registros para buscar dentro
    // del combo. El mantenedor sí los manda y recibe { items, meta }.
    if ( page === undefined && limit === undefined )
      return await this.providersService.findAll( estado, company_id, busqueda );

    return await this.providersService.findAllPaginado(
      { page, limit }, estado, company_id, busqueda
    );
  }

  @Get('/find/:term')
  async findOne(@Param('term') term: string) {
    return await this.providersService.findOne( term );
  }

  @Patch(':id')
  async update(
    @Headers('company-id') company_id: Company,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProviderDto: UpdateProviderDto
    ) {
    return await this.providersService.update(id, updateProviderDto, company_id);
  }

  @Patch(':id/:estado')
  async setEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estado', ParseBoolPipe) estado: boolean,
    ) {
    return await this.providersService.setEstado(id, estado);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.providersService.remove( id );
  }
}
