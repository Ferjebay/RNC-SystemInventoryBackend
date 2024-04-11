import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ProformaService } from './proforma.service';
import { CreateProformaDto } from './dto/create-proforma.dto';
import { UpdateProformaDto } from './dto/update-proforma.dto';
import { Company } from 'src/companies/entities/company.entity';

@Controller('proforma')
export class ProformaController {
  constructor(private readonly proformaService: ProformaService) {}

  @Post('/clausula')
  create(
    @Headers('company-id') company_id: Company,
    @Body() createProformaDto: CreateProformaDto
  ) {
    return this.proformaService.create(createProformaDto, company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proformaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProformaDto: UpdateProformaDto) {
    return this.proformaService.update(id, updateProformaDto);
  }

}
