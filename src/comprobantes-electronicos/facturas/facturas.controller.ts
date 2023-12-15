import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { Factura } from '../plantillas/factura';

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

  @Post('recepcionComprobantesOffline')
  async recepcionComprobantesOffline( @Body() datosFactura: any ){
    this.facturasService.reeenviarRecepcionComprobantesOffline(datosFactura);
    return "ok"
  }

  @Post('autorizacionComprobantesOffline')
  async autorizacionComprobantesOffline( @Body() datosFactura: any ){
    this.facturasService.reeenviarAutorizacionComprobantesOffline(datosFactura);
    return "ok"
  }

  @Post('anularFactura')
  anularFactura(
    @Body('factura') factura: any
  ) {
    return this.facturasService.generarNotaCredito( factura );
  }
}
