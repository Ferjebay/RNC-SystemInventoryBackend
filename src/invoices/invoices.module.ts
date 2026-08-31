import { Module, forwardRef } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacturasModule } from 'src/comprobantes-electronicos/facturas/facturas.module';
import { InvoiceToProduct } from './entities/invoiceToProduct.entity';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  controllers: [InvoicesController],
  imports: [
    TypeOrmModule.forFeature([ Invoice, InvoiceToProduct, Sucursal ]),
    forwardRef(() => FacturasModule),
    CustomersModule
  ],
  exports: [ InvoicesService ],
  providers: [InvoicesService]
})
export class InvoicesModule {}
