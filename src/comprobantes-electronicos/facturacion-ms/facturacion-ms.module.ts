import { Module } from '@nestjs/common';
import { FacturacionMsClient } from './facturacion-ms.client';

@Module({
  providers: [FacturacionMsClient],
  exports: [FacturacionMsClient],
})
export class FacturacionMsModule {}
