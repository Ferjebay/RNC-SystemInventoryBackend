import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { FacturasService } from 'src/comprobantes-electronicos/facturas/facturas.service';
import { InvoiceToProduct } from './entities/invoiceToProduct.entity';

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
    try {
      const claveAcceso = await this.facturaService.getClaveAcceso( sucursal_id );
      const { numComprobante, ambiente } = await this.facturaService.getNumComprobante( sucursal_id );

      let invoiceEntity = new Invoice();
      invoiceEntity = { 
        ...createInvoiceDto,
        sucursal_id,
        clave_acceso: claveAcceso,
        numero_comprobante: numComprobante 
      }
      const invoiceCreated = await this.invoiceRepository.save( invoiceEntity );
      
      const pivot: Array<InvoiceToProduct> = [];      
      createInvoiceDto.products.forEach( product => {
        pivot.push(new InvoiceToProduct(
          product.cantidad,
          product.v_total,
          invoiceCreated,
          product.id
        ));        
      })
      this.tablePivotRepository.save( pivot );      
      
      this.facturaService.generarFacturaElectronica( 
        createInvoiceDto.customer_id, 
        claveAcceso,
        sucursal_id,
        createInvoiceDto.subtotal,
        createInvoiceDto.iva,
        createInvoiceDto.descuento,
        createInvoiceDto.total,
        createInvoiceDto.products,
        invoiceCreated.id
      )
  
      return invoiceCreated;      
    } catch (error) {
      // console.log( error );
      this.handleDBExceptions( error )
    }
    return 'This action adds a new invoice';
  }

  async findAll( estado: boolean ) {
    let option: any = { 
      relations: { 
        user_id: true,
        sucursal_id: true,
        customer_id: true,
        invoiceToProduct: { product_id: true }
      }, 
      select: { 
        customer_id: { nombres: true }, 
        sucursal_id: { nombre: true }, 
        user_id:     { fullName: true },
        invoiceToProduct: { v_total: true, cantidad: true, product_id: true }
      },
      order: { created_at: "DESC" } }

    if ( estado ) option.where = { isActive: true };

    return await this.invoiceRepository.find( option );
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    // await this.findOne( id );

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

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
