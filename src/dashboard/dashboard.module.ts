import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Buy } from 'src/buys/entities/buy.entity';

@Module({
  controllers: [DashboardController],
  imports: [ TypeOrmModule.forFeature([ Customer, Invoice, Buy ]) ],
  providers: [DashboardService],
})
export class DashboardModule {}
