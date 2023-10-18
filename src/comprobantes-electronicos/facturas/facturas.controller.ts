import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Controller('CE/facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.create(createFacturaDto);
  }

  @Get()
  findAll() {
    return this.facturasService.findAll();
  }

  @Get('getNumFactura')
  getNumComprobante(
    @Headers('sucursal_id') sucursal_id: string,
  ) {
    return this.facturasService.getNumComprobante( sucursal_id );
  }

}
