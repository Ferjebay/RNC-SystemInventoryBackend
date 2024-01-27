import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { FacturaCliente } from './entities/Facturacion.entity';
import { ServicioCliente } from './entities/ServicioCliente.entity';
import { MikrotikService } from 'src/mikrotik/mikrotik.service';
import { MikrotikModule } from 'src/mikrotik/mikrotik.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [ MikrotikModule, TypeOrmModule.forFeature([ Customer, FacturaCliente, ServicioCliente ]) ],
  exports: [ CustomersService ]
})
export class CustomersModule {}
