import { Module, forwardRef } from '@nestjs/common';
import { RetencionesService } from './retenciones.service';
import { RetencionesController } from './retenciones.controller';
import { SucursalModule } from 'src/sucursal/sucursal.module';
import { FacturasModule } from '../facturas/facturas.module';
import { CustomersModule } from 'src/customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Retencion } from './entities/retencione.entity';
import { PivotRetencion } from './entities/pivotRetencion';

@Module({
  controllers: [RetencionesController],
  imports: [
    SucursalModule,
    CustomersModule,
    TypeOrmModule.forFeature([ Retencion, PivotRetencion ]),
    forwardRef(() => FacturasModule),
  ],
  exports: [ RetencionesService ],
  providers: [RetencionesService],
})
export class RetencionesModule {}
