import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Between, Not, Repository } from 'typeorm';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { FacturasService } from 'src/comprobantes-electronicos/facturas/facturas.service';
import { InvoiceToProduct } from './entities/invoiceToProduct.entity';
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
    try {
      let invoiceCreated: any = { id: null };
      const claveAcceso = await this.facturaService.getClaveAcceso( sucursal_id );
      const { numComprobante } = await this.facturaService.getNumComprobante( sucursal_id );

      if (createInvoiceDto.tipo !== 'EMISION'){
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
          createInvoiceDto,
          claveAcceso,
          sucursal_id,
          invoiceCreated.id
        )
      }else{
        this.facturaService.generarProforma(
          createInvoiceDto,
          sucursal_id,
          invoiceCreated.id
        );
      }

      return { ok: true };
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll( estado: boolean, tipo: string, sucursal_id: Sucursal, desde, hasta ) {
    return await this.getVentas(estado, tipo, sucursal_id, desde, hasta);
  }

  async getVentas(estado: boolean, tipo: string, sucursal_id: Sucursal, desde, hasta){
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

    let option: any = {
      relations: {
        user_id: true,
        sucursal_id: { company_id: { proforma: true } },
        customer_id: true,
        invoiceToProduct: { product_id: true }
      },
      select: {
        customer_id: { nombres: true, id: true, tipo_documento: true, numero_documento: true, email: true },
        sucursal_id: { id: true, nombre: true, ambiente: true, direccion: true },
        user_id:     { fullName: true, id: true },
        invoiceToProduct: { v_total: true, cantidad: true, product_id: true, descuento: true }
      },
      order: { created_at: "DESC" },
      where: {
        created_at: ( desde != "" || hasta != "" ) ? Between( inicio, fin ) : null
      }
    }

    if ( tipo == 'PROFORMA' ) option.where.estadoSRI = tipo;
    if ( tipo == 'ANULADO' ) option.where.estadoSRI = tipo;
    if ( tipo == 'AUTORIZADO' ) option.where.estadoSRI = tipo;
    if ( tipo == 'TODOS' ) option.where.estadoSRI = null;
    if ( tipo == 'FACTURAS' ) option.where.estadoSRI = Not("PROFORMA");

    if ( estado ) option.where.isActive = true ;

    return await this.invoiceRepository.find( option );
  }

  async downloadComprobantes( estado: boolean, sucursal_id: Sucursal, desde, hasta ) {

    const ventas = await this.getVentas(estado, 'FACTURAS', sucursal_id, desde, hasta);

    const comprobantes = ventas.map( venta => {
      let pathComprobante = path.resolve(__dirname, `../../static/SRI/PDF/${ venta.clave_acceso }.pdf`);
      return pathComprobante;
    })

    // Crea una nueva instancia de AdmZip
    const zip = new AdmZip();

    // Agregar cada archivo al archivo ZIP
    comprobantes.forEach(filePath => {
      if (fs.existsSync(filePath)) { // Verificar si el archivo existe
        zip.addLocalFile(filePath); // Agregar archivo al ZIP
      } else {
        console.warn(`El archivo "${filePath}" no existe.`);
      }
    });

    return zip.toBuffer();
  }

  async downloadRideXml( clave_acceso: string, tipo_documento: string, razon_social: string ) {

    const nombreComercial = razon_social.split(' ').join('-');

    try {

      let ruta;
      if ( tipo_documento == 'xml' )
        ruta = path.resolve(__dirname, `../../static/SRI/${ nombreComercial }/facturas/Autorizados/${ clave_acceso }.xml`);

      if ( tipo_documento == 'ride' )
        ruta = path.resolve(__dirname, `../../static/SRI/PDF/${ clave_acceso }.pdf`);

      const file = await fs.readFileSync(ruta);

      return file;

    } catch (error) {
      console.log(error);
      throw new BadRequestException('No se encontro el archivo');
    }
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
