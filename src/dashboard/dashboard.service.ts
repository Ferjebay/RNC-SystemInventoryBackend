import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Buy } from 'src/buys/entities/buy.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { InvoiceToProduct } from 'src/invoices/entities/invoiceToProduct.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository( Customer )
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository( Invoice )
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository( Buy )
    private readonly buyRepository: Repository<Buy>,
    @InjectRepository( InvoiceToProduct )
    private readonly InvoiceToProductRepository: Repository<InvoiceToProduct>,
  ){}

  async dataDashboard( company_id: string, modo: string, mes: string ){
    try {
      let inicio, fin;
      if( modo == 'mes' ){
        inicio = new Date( mes.split(' - ')[0] );
        fin = new Date( mes.split(' - ')[1] );
        fin.setHours(23, 59, 59, 999);
      }

      // const pivot = await this.InvoiceToProductRepository.find({})
      // console.log( pivot );

      // const queryBuilder = await this.InvoiceToProductRepository
      //                       .createQueryBuilder('pivot')
      //                       .leftJoinAndSelect('pivot.product_id', 'product')
      //                       .getRawMany();

      // console.log( queryBuilder );

      const totalClientes = await this.customerRepository.count({
        where: { company_id: { id: company_id } }
      });

      const invoices = await this.invoiceRepository.find({
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

      const compras = await this.buyRepository.find({
        select: { total: true },
        where: {
          sucursal_id: { company_id: { id: company_id } },
          isActive: true,
          created_at: ( modo == 'mes' ) ? Between( inicio, fin ) : null
        }
      })

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
      }
    } catch (error) {
      console.log( error );
      throw new BadRequestException("fallo al cargar datos del Dashboard");
    }

  }

}
