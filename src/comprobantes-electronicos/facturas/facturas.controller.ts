import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { FacturasService } from './facturas.service';

@Controller('CE/facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get('getNumFactura')
  getNumComprobante(
    @Headers('sucursal_id') sucursal_id: string,
  ) {
    return this.facturasService.getNumComprobante( sucursal_id );
  }

  @Post('anularFactura')
  anularFactura(
    @Body('factura') factura: any
  ) {
    return this.facturasService.generarNotaCredito( factura );
  }


}
