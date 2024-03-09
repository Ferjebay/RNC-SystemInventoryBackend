import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CompaniesModule } from './companies/companies.module';
import { ProvidersModule } from './providers/providers.module';
import { CustomersModule } from './customers/customers.module';
import { BuysModule } from './buys/buys.module';
import { InvoicesModule } from './invoices/invoices.module';
import { FacturasModule } from './comprobantes-electronicos/facturas/facturas.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { EmailModule } from './email/email.module';
import { MikrotikModule } from './mikrotik/mikrotik.module';
import { RouterModule } from './router/router.module';
import { InternetModule } from './internet/internet.module';
import { CajaNapModule } from './caja-nap/caja-nap.module';
import { PuertosModule } from './puertos/puertos.module';
import { RedIpv4Module } from './red-ipv4/red-ipv4.module';
import { PagosModule } from './pagos/pagos.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesAndPermisosModule } from './roles-and-permisos/roles-and-permisos.module';
import { ProformaModule } from './proforma/proforma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      ssl: process.env.STAGE == 'prod',
      extra: {
        ssl: process.env.STAGE == 'prod' 
        ? { rejectUnauthorized: false }
        : null
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),

    ScheduleModule.forRoot(),
    
    CommonModule,
    AuthModule,
    MessagesWsModule,
    ProductsModule,
    CategoriesModule,
    CompaniesModule,
    ProvidersModule,
    CustomersModule,
    BuysModule,
    InvoicesModule,
    FacturasModule,
    SucursalModule,
    EmailModule,
    MikrotikModule,
    RouterModule,
    InternetModule,
    CajaNapModule,
    PuertosModule,
    RedIpv4Module,
    PagosModule,
    RolesAndPermisosModule,
    ProformaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
