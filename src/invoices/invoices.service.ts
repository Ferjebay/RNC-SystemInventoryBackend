import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Not, Repository } from 'typeorm';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { FacturasService } from 'src/comprobantes-electronicos/facturas/facturas.service';
import { InvoiceToProduct } from './entities/invoiceToProduct.entity';
const fs = require('fs');
const path = require('path');

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
    // console.log( createInvoiceDto );
    // return "fds";

    //Borrar archivos generados antes del error al envio SRI
    // if( createInvoiceDto.estadoSRI == 'ERROR AL ENVIO SRI' ){
    //   const ruta = path.resolve(__dirname, `../../static/SRI/FIRMAS`);
    //   fs.unlinkSync(`${ ruta }/${ createInvoiceDto.clave_acceso }`)    
    // }

    try {
      let invoiceCreated: any = { id: null };
      const claveAcceso = await this.facturaService.getClaveAcceso( sucursal_id );
      const { numComprobante } = await this.facturaService.getNumComprobante( sucursal_id );

      if (createInvoiceDto.tipo !== 'EMISION') {
        let invoiceEntity = new Invoice();
        invoiceEntity = { 
          ...createInvoiceDto,
          sucursal_id,
          clave_acceso: claveAcceso,
          numero_comprobante: numComprobante,
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
          createInvoiceDto.customer_id, 
          claveAcceso,
          sucursal_id,
          createInvoiceDto.subtotal,
          createInvoiceDto.iva,
          createInvoiceDto.descuento,
          createInvoiceDto.total,
          createInvoiceDto.products,
          invoiceCreated.id,
          createInvoiceDto.tipo,
          createInvoiceDto.user_id
        )        
      }
  
      return { ok: true };      
    } catch (error) {
      // console.log( error );
      this.handleDBExceptions( error )
    }
    return 'This action adds a new invoice';
  }

  async findAll( estado: boolean, tipo: string, sucursal_id: Sucursal ) {
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
        invoiceToProduct: { v_total: true, cantidad: true, product_id: true, descuento: true }
      },
      order: { created_at: "DESC" },
      where: {
        sucursal_id: { id: sucursal_id },
        estadoSRI: null,
        isActive: null
      }
    }

    if ( tipo == 'PROFORMA' ) option.where.estadoSRI = tipo;
    if ( tipo == 'TODOS' ) option.where.estadoSRI = null;
    if ( tipo == 'FACTURAS' ) option.where.estadoSRI = Not("PROFORMA");

    if ( estado ) option.where.isActive = true ;

    return await this.invoiceRepository.find( option );
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
        sucursal_id: { company_id: { id: true } } 
      }
    });

    if ( !invoice ) 
      throw new NotFoundException(`No se encontro la factura/proforma`);

    return invoice;
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
