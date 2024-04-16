import { Module } from '@nestjs/common';
import { RetencionesService } from './retenciones.service';
import { RetencionesController } from './retenciones.controller';
import { SucursalModule } from 'src/sucursal/sucursal.module';

@Module({
  controllers: [RetencionesController],
  imports: [ SucursalModule ],
  providers: [RetencionesService],
})
export class RetencionesModule {}
