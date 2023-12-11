import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';

@Controller('CE/facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get('getNumFactura')
  getNumComprobante(
    @Headers('sucursal_id') sucursal_id: string,
  ) {
    return this.facturasService.getNumComprobante( sucursal_id );
  }

  @Post('generarFacturaElectronica')
  generarFacturaElectronica(
    @Headers('sucursal_id') sucursal_id: Sucursal,
    @Body() datosFactura: any
  ){
    return this.facturasService.generarFacturaElectronica( 
      datosFactura, 
      '', 
      sucursal_id, 
      datosFactura.pago_id,
      datosFactura.entity 
    );
  }

  @Post('anularFactura')
  anularFactura(
    @Body('factura') factura: any
  ) {
    return this.facturasService.generarNotaCredito( factura );
  }


}
