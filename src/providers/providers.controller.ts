import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe, Headers } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Company } from 'src/companies/entities/company.entity';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(
    @Headers('company_id') company_id: Company,
    @Body() createProviderDto: CreateProviderDto
  ) {
    return this.providersService.create(createProviderDto, company_id );
  }

  @Get(':estado?')
  findAll(
    @Headers('company_id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.providersService.findAll( estado, company_id );
  }

  @Get('/find/:term')
  findOne(@Param('term') term: string) {
    return this.providersService.findOne( term );
  }

  @Patch(':id')
  update(
    @Headers('company_id') company_id: Company,
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProviderDto: UpdateProviderDto
    ) {
    return this.providersService.update(id, updateProviderDto, company_id);
  }

  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('estado', ParseBoolPipe) estado: boolean, 
    ) {
    return this.providersService.setEstado(id, estado);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.providersService.remove( id );
  }
}
