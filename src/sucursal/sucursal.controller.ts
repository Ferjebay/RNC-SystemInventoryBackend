import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, ParseBoolPipe, DefaultValuePipe, ParseUUIDPipe } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { Company } from 'src/companies/entities/company.entity';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  create(
    @Headers('company_id') company_id: Company,
    @Body() createSucursalDto: CreateSucursalDto
    ) {
    return this.sucursalService.create(createSucursalDto, company_id);
  }

  @Get(':estado?')
  findAll(
    @Headers('company_id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.sucursalService.findAll( estado, company_id );
  }

  @Get('/find/:term/:modelo?')
  findOne(
    @Param('term') term: string,
    @Param('modelo', new DefaultValuePipe('sucursal')) modelo: string
  ) {
    return this.sucursalService.findOne( term, modelo );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateSucursalDto: UpdateSucursalDto
  ) {
    return this.sucursalService.update( id, updateSucursalDto);
  }

  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('estado', ParseBoolPipe) estado: boolean, 
    ) {
    return this.sucursalService.setEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sucursalService.remove( id );
  }
}
