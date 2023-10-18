import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
import { InvoiceElectronicsService } from './invoice-electronics.service';
import { CreateInvoiceElectronicDto } from './dto/create-invoice-electronic.dto';
import { UpdateInvoiceElectronicDto } from './dto/update-invoice-electronic.dto';

@Controller('invoice-electronics')
export class InvoiceElectronicsController {
  constructor(private readonly invoiceElectronicsService: InvoiceElectronicsService) {}

  @Post()
  create(@Body() createInvoiceElectronicDto: CreateInvoiceElectronicDto) {
    return this.invoiceElectronicsService.create(createInvoiceElectronicDto);
  }

  @Get(':estado?')
  findAll(
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.invoiceElectronicsService.findAll( estado );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceElectronicsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceElectronicDto: UpdateInvoiceElectronicDto) {
    return this.invoiceElectronicsService.update(id, updateInvoiceElectronicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceElectronicsService.remove(+id);
  }
}
