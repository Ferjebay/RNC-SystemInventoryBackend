import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(
    @Headers('sucursal_id') sucursal_id: Sucursal,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(createInvoiceDto, sucursal_id);
  }

  @Get(':estado?')
  findAll(
    @Headers('tipo') tipo: string,
    @Headers('sucursal_id') sucursal_id: Sucursal,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.invoicesService.findAll( estado, tipo, sucursal_id );
  }

  @Get('/filterInvoice/:id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }
}
