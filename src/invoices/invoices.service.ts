import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Between, ILike, Not, Repository } from 'typeorm';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { FacturasService } from 'src/comprobantes-electronicos/facturas/facturas.service';
import { InvoiceToProduct } from './entities/invoiceToProduct.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions
} from 'nestjs-typeorm-paginate';
import { Company } from 'src/companies/entities/company.entity';
const path = require('path');
const AdmZip = require('adm-zip');
const fs = require('fs');

@Injectable()
export class InvoicesService {

  private readonly logger = new Logger('InvoiceService');

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceToProduct)
    private readonly tablePivotRepository: Repository<InvoiceToProduct>,
    private readonly facturaService: FacturasService
  ){}

  async create(createInvoiceDto: CreateInvoiceDto, sucursal_id: Sucursal) {

    const { products, tipo, send_messages, name_proforma, ...rest } = createInvoiceDto;

    if ( createInvoiceDto.estadoSRI == 'PROFORMA' && tipo == 'PROFORMA' ) { // Editar proforma
      try {

        await this.invoiceRepository.update(createInvoiceDto.id, {
          ...rest,
          numero_comprobante: '--- --- ---------'
        });

        await this.tablePivotRepository
                  .createQueryBuilder('pivot')
                  .delete()
                  .where("invoice_id = :id", { id: createInvoiceDto.id })
                  .execute();

        const pivot: Array<InvoiceToProduct> = [];
        products.forEach( product => {
          pivot.unshift(new InvoiceToProduct(
            product.cantidad,
            product.v_total,
            product.descuento,
            createInvoiceDto.id,
            product.id
          ));
        })
        this.tablePivotRepository.save( pivot );

        const ruta = path.resolve(__dirname, `../../static/SRI/PROFORMAS`);

        if(await fs.existsSync(`${ ruta }/${ name_proforma }`))
          await fs.unlinkSync(`${ ruta }/${ name_proforma }`)

        await this.facturaService.generarProforma(
          createInvoiceDto,
          sucursal_id,
          createInvoiceDto.id,
          send_messages
        );
      } catch (error) {
        console.log( error );
        throw new BadRequestException("Ocurrio un error al editar la proforma");
      }
    }else{ //Crear Factura o Proforma
      try {
        let invoiceCreated: any = { id: null };
        const { numComprobante } = await this.facturaService.getNumComprobante( sucursal_id );

        if (createInvoiceDto.tipo !== 'EMISION'){
          let invoiceEntity = new Invoice();
          invoiceEntity = {
            ...createInvoiceDto,
            sucursal_id,
            numero_comprobante: createInvoiceDto.tipo == 'PROFORMA' ? '--- --- ---------' : numComprobante,
            estadoSRI: createInvoiceDto.tipo == 'PROFORMA' ? 'PROFORMA' : 'PENDIENTE'
          }

          invoiceCreated = await this.invoiceRepository.save( invoiceEntity );

          const pivot: Array<InvoiceToProduct> = [];
          createInvoiceDto.products.forEach( product => {
            pivot.push(new InvoiceToProduct(
              product.cantidad,
              product.v_total,
              product.descuento,
              invoiceCreated,
              product.id
            ));
          })
          this.tablePivotRepository.save( pivot );
        }else{
          await this.invoiceRepository.update( createInvoiceDto.id, { estadoSRI: "PENDIENTE" } );
          invoiceCreated.id = createInvoiceDto.id
        }

        if (createInvoiceDto.tipo == 'FACTURA' || createInvoiceDto.tipo == 'EMISION') {
          this.facturaService.generarFacturaElectronica(
            createInvoiceDto,
            sucursal_id,
            invoiceCreated.id,
            'Invoice',
            createInvoiceDto.send_messages
          )
        }else{
          this.facturaService.generarProforma(
            createInvoiceDto,
            sucursal_id,
            invoiceCreated.id,
            createInvoiceDto.send_messages
          );
        }
      } catch (error) {
        this.handleDBExceptions( error )
      }
    }
    return { ok: true };
  }

  async findAll(
      options: IPaginationOptions,
      tipo: string,
      sucursal_id: string,
      desde,
      hasta,
      busqueda,
      company_id: Company ): Promise<Pagination<Invoice>> {
    try {
      return await this.getVentas(options, tipo, sucursal_id, desde, hasta, busqueda, company_id)
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async contarTotalProforma( sucursal_id ){
    const proformas = await this.invoiceRepository.find({
      where: {
        sucursal_id: { id: sucursal_id },
        estadoSRI: 'PROFORMA'
      }
    })

    return proformas.length + 1;
  }

  async getVentas(options: IPaginationOptions, tipo: string, sucursal_id: string, desde, hasta, busqueda, company_id?: Company){
    try {

      let inicio, fin;
      if ( desde != "" && hasta == "" ) {
        inicio = new Date( desde );
        fin = new Date( desde );
        fin.setHours(23, 59, 59, 999);
      }
      if ( desde == "" && hasta != "" ) {
        inicio = new Date( hasta );
        fin = new Date( hasta );
        fin.setHours(23, 59, 59, 999);
      }
      if ( desde != "" && hasta != "" ) {
        inicio = new Date( desde );
        fin = new Date( hasta );
        fin.setHours(23, 59, 59, 999);
      }

      let estadoSRI: any = null
      if ( tipo == 'FACTURAS' ) estadoSRI   = Not("PROFORMA");
      else estadoSRI = tipo;

      let option: any = {
        relations: {
          user_id: true,
          sucursal_id: { company_id: { proforma: true } },
          customer_id: true,
          invoiceToProduct: { product_id: true }
        },
        where: [
          {
            numero_comprobante: ILike(`%${ busqueda }%`),
            created_at: ( desde != "" || hasta != "" ) ? Between( inicio, fin ) : null,
            sucursal_id: { id: sucursal_id, company_id: { id: company_id } },
            estadoSRI
          },
          {
            clave_acceso: ILike(`%${ busqueda }%`),
            created_at: ( desde != "" || hasta != "" ) ? Between( inicio, fin ) : null,
            sucursal_id: { id: sucursal_id, company_id: { id: company_id } },
            estadoSRI
          },
          {
            customer_id: { nombres: ILike(`%${ busqueda }%`) },
            created_at: ( desde != "" || hasta != "" ) ? Between( inicio, fin ) : null,
            sucursal_id: { id: sucursal_id, company_id: { id: company_id } },
            estadoSRI
          },
          {
            customer_id: { numero_documento: ILike(`%${ busqueda }%`) },
            created_at: ( desde != "" || hasta != "" ) ? Between( inicio, fin ) : null,
            sucursal_id: { id: sucursal_id, company_id: { id: company_id } },
            estadoSRI
          }
        ],
        order: { created_at: "DESC" }
      }

      return await paginate<Invoice>(this.invoiceRepository, options, option);

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async downloadComprobantes( sucursal_id: string, desde, hasta ) {

    const ventas = await this.getVentas({
      page: 1,
      limit: 1000000,
      route: `${ process.env.HOST_API }/invoices`,
    }, 'FACTURAS', sucursal_id, desde, hasta, '');

    const zip = new AdmZip();

    // Los RIDE ya no están en disco: se piden al microservicio uno a uno. Va en
    // serie a propósito, para no dispararle decenas de peticiones simultáneas.
    let fallidos = 0;

    for ( const venta of ventas.items ) {
      if ( !venta.clave_acceso ) continue;

      try {
        const pdf = await this.facturaService.descargarComprobante( 'ride', venta.clave_acceso );
        zip.addFile(`${ venta.numero_comprobante ?? venta.clave_acceso }.pdf`, pdf);
      } catch (error) {
        fallidos++;
        this.logger.warn(`No se pudo obtener el RIDE de ${ venta.clave_acceso }`);
      }
    }

    if ( fallidos > 0 )
      this.logger.warn(`Descarga masiva: ${ fallidos } de ${ ventas.items.length } comprobantes no se pudieron incluir.`);

    return zip.toBuffer();
  }

  /**
   * Entrega el archivo de un comprobante.
   *
   * El RIDE y el XML vienen del microservicio, que es quien los emitió y los
   * conserva. La proforma sí sigue siendo local: no es un comprobante del SRI,
   * se genera aquí con puppeteer.
   */
  async downloadRideXml( clave_acceso: string, tipo_documento: string, razon_social: string ) {

    if ( tipo_documento == 'proforma' ) {
      try {
        return fs.readFileSync(
          path.resolve(__dirname, `../../static/SRI/PROFORMAS/${ clave_acceso }`)
        );
      } catch (error) {
        throw new BadRequestException('No se encontró la proforma');
      }
    }

    if ( tipo_documento !== 'ride' && tipo_documento !== 'xml' )
      throw new BadRequestException(`Tipo de documento no soportado: ${ tipo_documento }`);

    return this.facturaService.descargarComprobante(
      tipo_documento, clave_acceso, 'factura', razon_social
    );
  }

  async findOne(id: string) {
    const invoice = await this.invoiceRepository.findOne({
      where:  { id },
      relations: {
        customer_id: true,
        invoiceToProduct: { product_id: true },
        sucursal_id: { company_id: true }
      },
      select: {
        customer_id: { id: true },
        sucursal_id: { id: true, company_id: { id: true } }
      }
    });

    if ( !invoice )
      throw new NotFoundException(`No se encontro la factura/proforma`);

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      await this.invoiceRepository.update( id, updateInvoiceDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async remove(id: string) {
    const pivot = await this.tablePivotRepository.find({ where: { invoice_id: { id } } });
    await this.tablePivotRepository.remove( pivot );

    return await this.invoiceRepository.delete( id );
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
