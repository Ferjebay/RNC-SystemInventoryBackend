import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngresosEgresosService } from './ingresos-egresos.service';
import { IngresosEgresosController } from './ingresos-egresos.controller';
import { IngresoEgreso } from './entities/ingreso-egreso.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ IngresoEgreso ]) ],
  controllers: [ IngresosEgresosController ],
  providers: [ IngresosEgresosService ],
  exports: [ IngresosEgresosService ]
})
export class IngresosEgresosModule {}
