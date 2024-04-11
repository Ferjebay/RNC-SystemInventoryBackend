import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, ParseBoolPipe, DefaultValuePipe, ParseUUIDPipe } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { Company } from 'src/companies/entities/company.entity';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  async create(
    @Body() createSucursalDto: CreateSucursalDto
    ) {
    return await this.sucursalService.create(createSucursalDto);
  }

  @Get(':estado?')
  async findAll(
    @Headers('company-id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean
  ) {
    return await this.sucursalService.findAll( estado, company_id );
  }

  @Get('/find/:term/:modelo?')
  async findOne(
    @Param('term') term: string,
    @Param('modelo', new DefaultValuePipe('sucursal')) modelo: string
  ) {
    return await this.sucursalService.findOne( term, modelo );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSucursalDto: UpdateSucursalDto
  ) {
    return await this.sucursalService.update( id, updateSucursalDto);
  }

  @Patch(':id/:estado')
  async setEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estado', ParseBoolPipe) estado: boolean,
    ) {
    return await this.sucursalService.setEstado(id, estado);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.sucursalService.remove( id );
  }
}
