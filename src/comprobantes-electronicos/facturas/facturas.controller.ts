import { Controller, Get, Headers, Request } from '@nestjs/common';
import { FacturasService } from './facturas.service';

@Controller('CE/facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get('getNumFactura')
  getNumComprobante(
    @Headers('Sucursal_id') sucursal_id: string,
    @Headers() headers
  ) {
    console.log(headers);
    return this.facturasService.getNumComprobante( sucursal_id );
  }

}
