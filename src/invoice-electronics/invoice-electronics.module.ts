import { Module } from '@nestjs/common';
import { InvoiceElectronicsService } from './invoice-electronics.service';
import { InvoiceElectronicsController } from './invoice-electronics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceElectronic } from './entities/invoice-electronic.entity';

@Module({
  controllers: [InvoiceElectronicsController],
  providers: [InvoiceElectronicsService],
  imports: [ TypeOrmModule.forFeature([ InvoiceElectronic ]) ]
})
export class InvoiceElectronicsModule {}
