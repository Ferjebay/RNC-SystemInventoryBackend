import { Module, forwardRef } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacturasModule } from 'src/comprobantes-electronicos/facturas/facturas.module';
import { InvoiceToProduct } from './entities/invoiceToProduct.entity';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { MessagesWsModule } from 'src/messages-ws/messages-ws.module';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [ TypeOrmModule.forFeature([ Invoice, InvoiceToProduct, Sucursal ]), forwardRef(() => FacturasModule) ],
  exports: [ InvoicesService ]
})
export class InvoicesModule {}
