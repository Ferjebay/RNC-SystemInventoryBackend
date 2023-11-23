import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe } from '@nestjs/common';
import { InternetService } from './internet.service';
import { CreateInternetDto } from './dto/create-internet.dto';
import { UpdateInternetDto } from './dto/update-internet.dto';
import { Company } from 'src/companies/entities/company.entity';

@Controller('internet')
export class InternetController {
  constructor(private readonly internetService: InternetService) {}

  @Post()
  create(
    @Headers('company_id') company_id: Company,
    @Body() createInternetDto: CreateInternetDto
  ){
    return this.internetService.create(createInternetDto, company_id);
  }

  @Get()
  findAll(
    @Headers('company_id') company_id: Company,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ){
    return this.internetService.findAll( company_id, estado );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internetService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInternetDto: UpdateInternetDto) {
    return this.internetService.update(id, updateInternetDto);
  }

  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('estado', ParseBoolPipe) estado: boolean, 
    ) {
    return this.internetService.setEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.internetService.remove(id);
  }
}
