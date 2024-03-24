import { Injectable } from '@nestjs/common';
import { Buy } from 'src/buys/entities/buy.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Between, DataSource } from 'typeorm';


@Injectable()
export class DashboardService {
  constructor(
    private readonly dataSource: DataSource,
  ){}

  async dataDashboard( company_id: string, modo: string, mes: string ){

    let inicio, fin;
    if( modo == 'mes' ){
      inicio = new Date( mes.split(' - ')[0] );
      fin = new Date( mes.split(' - ')[1] );
      fin.setHours(23, 59, 59, 999);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const invoices = await queryRunner.manager.find( Invoice, {
      select: { total: true, estadoSRI: true },
      where: [
        {
          estadoSRI: 'AUTORIZADO',
          sucursal_id: { company_id: { id: company_id } },
          created_at: ( modo == 'mes' ) ? Between( inicio, fin ) : null
        },
        {
          estadoSRI: 'ANULADO',
          sucursal_id: { company_id: { id: company_id } },
          created_at: ( modo == 'mes' ) ? Between( inicio, fin ) : null
        }
      ]
    });

    const totalClientes = await queryRunner.manager.count( Customer, {
      where: { company_id: { id: company_id } }
    });

    const compras = await queryRunner.manager.find( Buy, {
      select: { total: true },
      where: {
        sucursal_id: { company_id: { id: company_id } },
        isActive: true,
        created_at: ( modo == 'mes' ) ? Between( inicio, fin ) : null
      }
    });

    const totalFacturado = invoices.reduce((acumulador, invoice) =>
                            acumulador + (invoice.estadoSRI == 'AUTORIZADO' ? parseFloat(invoice.total.toString()) : 0), 0);

    const facturasAnuladas = invoices.reduce((acumulador, invoice) =>
                            acumulador + (invoice.estadoSRI == 'ANULADO' ? parseFloat(invoice.total.toString()) : 0), 0);

    const totalCompras = compras.reduce((acumulador, buy) => acumulador + parseFloat(buy.total.toString()), 0);

    return {
      totalClientes,
      totalFacturado,
      facturasAnuladas,
      totalCompras
    };
  }

}
