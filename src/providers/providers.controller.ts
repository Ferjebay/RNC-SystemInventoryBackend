import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe, Headers } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Company } from 'src/companies/entities/company.entity';

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

  @Get(':estado?')
  async findAll(
    @Headers('company-id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean
  ) {
    return await this.providersService.findAll( estado, company_id );
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
