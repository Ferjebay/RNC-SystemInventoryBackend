import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe, Headers } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Company } from 'src/companies/entities/company.entity';

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

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customersService.update(id, updateCustomerDto);
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
