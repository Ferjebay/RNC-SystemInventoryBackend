import { Body, Controller, Get, Headers, Post, Param, Res } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { Response } from 'express';

@Controller('CE/facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get('getNumFactura')
  getNumComprobante(
    @Headers('sucursal-id') sucursal_id: string,
  ) {
    return this.facturasService.getNumComprobante( sucursal_id );
  }

  @Post('/getRide/:clave_acceso')
  async getRide(
    @Param('clave_acceso') clave_acceso: string,
    @Res() res: Response
  ){
    const file = await this.facturasService.getRide( clave_acceso );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${ clave_acceso }.pdf`);

    res.send(file);
  }

  @Post('generarFacturaElectronica')
  generarFacturaElectronica(
    @Headers('sucursal-id') sucursal_id: Sucursal,
    @Body() datosFactura: any
  ){
    return this.facturasService.generarFacturaElectronica(
      datosFactura,
      sucursal_id,
      datosFactura.pago_id,
      datosFactura.entity
    );
  }

  @Post('recepcionComprobantesOffline')
  async recepcionComprobantesOffline( @Body() datosFactura: any ){
    return this.facturasService.reintentarEnvioSRI( datosFactura );
  }

  /**
   * Vuelve a preguntarle al microservicio por una factura que quedo PENDIENTE o
   * RECIBIDA y sincroniza clave de acceso y estado.
   */
  @Post('verificarEstado')
  async verificarEstado( @Body() datosFactura: any ){
    return this.facturasService.verificarEstadoSRI( datosFactura );
  }

  /**
   * Se mantiene el nombre por compatibilidad con el front anterior. Antes
   * devolvia { ok: true } sin hacer nada, asi que el boton de reenvio de las
   * facturas en RECIBIDA nunca sincronizaba el estado.
   */
  @Post('autorizacionComprobantesOffline')
  async autorizacionComprobantesOffline( @Body() datosFactura: any ){
    return this.facturasService.verificarEstadoSRI( datosFactura );
  }

  @Post('anularFactura')
  anularFactura(
    @Body('factura') factura: any
  ) {
    return this.facturasService.generarNotaCredito( factura );
  }

  @Post('/reenviar-comprobantes')
  reenviarComprobantes(
    @Body() factura: any
  ) {
    return this.facturasService.reenviarComprobantes( factura );
  }

}
