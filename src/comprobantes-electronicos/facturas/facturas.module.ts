import { Module,forwardRef } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { SucursalModule } from 'src/sucursal/sucursal.module';
import { CustomersModule } from 'src/customers/customers.module';
import { InvoicesModule } from 'src/invoices/invoices.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [FacturasController],
  providers: [FacturasService],
  imports: [ SucursalModule, CustomersModule, EmailModule, forwardRef(() => InvoicesModule) ],
  exports: [ FacturasService ]
})
export class FacturasModule {}
