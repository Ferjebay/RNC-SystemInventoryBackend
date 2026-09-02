import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Between, ILike, Not, Repository } from 'typeorm';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { FacturasService } from 'src/comprobantes-electronicos/facturas/facturas.service';
import { InvoiceToProduct } from './entities/invoiceToProduct.entity';
import { paginar, OpcionesPaginacion, Paginado } from 'src/common/helpers/paginar.helper';
import { Company } from 'src/companies/entities/company.entity';
import { CustomersService } from 'src/customers/customers.service';
import {
  CONSUMIDOR_FINAL_MONTO_MAXIMO,
  CONSUMIDOR_FINAL_NOMBRES,
  esConsumidorFinal
} from 'src/customers/consumidor-final';
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
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    private readonly facturaService: FacturasService,
    private readonly customerService: CustomersService
  ){}

  /**
   * Reglas del SRI que dependen del cliente.
   *
   * Se validan en el backend y no solo en el formulario porque la factura se
   * guarda antes de emitirse y el envio al SRI corre en segundo plano: un
   * comprobante invalido quedaria registrado igual.
   */
  private async validarCliente( createInvoiceDto: CreateInvoiceDto, tipo: string, sucursal_id: Sucursal ) {

    const customerId: any = ( createInvoiceDto.customer_id as any )?.id
      ?? createInvoiceDto.customer_id;

    const sucursal = await this.sucursalRepository.findOne({
      where: { id: ( sucursal_id as any )?.id ?? sucursal_id as any },
      relations: { company_id: true }
    });

    if ( !sucursal )
      throw new BadRequestException('La sucursal del comprobante no existe.');

    // El cliente tiene que existir y ser de la misma empresa. Sin esto la
    // insercion moria con un error de llave foranea (500 sin mensaje util)
    // cuando llegaba un customer_id que no estaba en la base.
    const cliente = await this.customerService.obtenerParaFacturar(
      customerId,
      sucursal.company_id?.id as any
    );

    // La proforma no es un comprobante autorizado por el SRI: ahi el tope no
    // aplica.
    const esComprobante = tipo === 'FACTURA' || tipo === 'EMISION';

    if ( !esComprobante || !esConsumidorFinal( cliente ) ) return;

    // Ficha tecnica, numeral 9.10: sobre 50 USD hay que identificar al
    // adquirente.
    if ( Number( createInvoiceDto.total ) > CONSUMIDOR_FINAL_MONTO_MAXIMO )
      throw new BadRequestException(
        `La factura supera los $${ CONSUMIDOR_FINAL_MONTO_MAXIMO.toFixed(2) }: ` +
        `debe emitirse a un cliente identificado y no a ${ CONSUMIDOR_FINAL_NOMBRES }`
      );
  }

  async create(createInvoiceDto: CreateInvoiceDto, sucursal_id: Sucursal) {

    const { products, tipo, send_messages, name_proforma, ...rest } = createInvoiceDto;

    await this.validarCliente( createInvoiceDto, tipo, sucursal_id );

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
          // Corre en segundo plano: la respuesta no espera al SRI. Sin el .catch
          // un fallo se perdia como unhandled rejection y la factura quedaba en
          // PENDIENTE sin ninguna pista de por que.
          this.facturaService.generarFacturaElectronica(
            createInvoiceDto,
            sucursal_id,
            invoiceCreated.id,
            'Invoice',
            createInvoiceDto.send_messages
          ).catch( async error => {
            const motivo = error?.response?.data?.message ?? error?.message ?? 'error desconocido';

            this.logger.error(`Fallo la emision de la factura ${ invoiceCreated.id }: ${ motivo }`);

            if ( invoiceCreated.id )
              await this.invoiceRepository
                .update( invoiceCreated.id, { respuestaSRI: `ERROR EMISION: ${ motivo }` } )
                .catch(() => undefined);
          });
        }else{
          // Corre en segundo plano: la respuesta no espera al PDF. El .catch es
          // obligatorio, sin él un fallo acá se vuelve unhandled rejection.
          this.facturaService.generarProforma(
            createInvoiceDto,
            sucursal_id,
            invoiceCreated.id,
            createInvoiceDto.send_messages
          ).catch( error => console.error('Error generando la proforma:', error?.message ?? error) );
        }
      } catch (error) {
        this.handleDBExceptions( error )
      }
    }
    return { ok: true };
  }

  async findAll(
      options: OpcionesPaginacion,
      tipo: string,
      sucursal_id: string,
      desde,
      hasta,
      busqueda,
      company_id: Company ): Promise<Paginado<Invoice>> {
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

  async getVentas(options: OpcionesPaginacion, tipo: string, sucursal_id: string, desde, hasta, busqueda, company_id?: Company){
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

      return await paginar<Invoice>(this.invoiceRepository, options, option);

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async downloadComprobantes( sucursal_id: string, desde, hasta ) {

    const ventas = await this.getVentas({
      page: 1,
      limit: 1000000
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
  async downloadRideXml(
    clave_acceso: string,
    tipo_documento: string,
    razon_social: string,
    tipo_comprobante: 'factura' | 'nota-credito' = 'factura',
    invoice_id?: string
  ) {

    if ( tipo_documento == 'proforma' ) {
      const carpeta = path.resolve(__dirname, `../../static/SRI/PROFORMAS`);

      if ( clave_acceso && fs.existsSync(`${ carpeta }/${ clave_acceso }`) )
        return fs.readFileSync(`${ carpeta }/${ clave_acceso }`);

      // El archivo no está: proforma anterior al arreglo de la carpeta, disco
      // limpiado o despliegue en otro servidor. El PDF de la proforma solo vive
      // acá (el SRI no la custodia, no es un comprobante), así que se rehace con
      // lo que hay en la base en vez de dejar al usuario sin descarga.
      if ( !invoice_id )
        throw new BadRequestException('Esta proforma no tiene PDF y no se puede regenerar. Edítala y guárdala.');

      const nombre = await this.regenerarProforma( invoice_id );

      return fs.readFileSync(`${ carpeta }/${ nombre }`);
    }

    if ( tipo_documento !== 'ride' && tipo_documento !== 'xml' )
      throw new BadRequestException(`Tipo de documento no soportado: ${ tipo_documento }`);

    if ( !clave_acceso )
      throw new BadRequestException(
        tipo_comprobante == 'nota-credito'
          ? 'La factura no tiene nota de crédito: no hay nada que descargar.'
          : 'La factura no tiene clave de acceso: no hay nada que descargar.'
      );

    return this.facturaService.descargarComprobante(
      tipo_documento, clave_acceso, tipo_comprobante, razon_social
    );
  }

  /**
   * Rehace el PDF de una proforma a partir de lo guardado y devuelve el nombre
   * del archivo (cambia al regenerarse, por eso se relee de la BD).
   */
  private async regenerarProforma( invoice_id: string ): Promise<string> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoice_id },
      relations: {
        customer_id: true,
        sucursal_id: true,
        invoiceToProduct: { product_id: true }
      }
    });

    if ( !invoice )
      throw new NotFoundException('No se encontró la proforma');

    // Postgres devuelve los numeric como texto y la plantilla llama .toFixed():
    // sin convertirlos revienta al armar el HTML.
    const numero = ( valor: any ) => Number( valor ?? 0 );

    const datosFactura = {
      ...invoice,
      customer_id: ( invoice.customer_id as any )?.id,
      subtotal:    numero( invoice.subtotal ),
      descuento:   numero( invoice.descuento ),
      iva:         numero( invoice.iva ),
      ice:         numero( invoice.ice ),
      total:       numero( invoice.total ),
      descripcion: invoice.descripcion ?? '',   // la plantilla hace .length
      products: ( invoice.invoiceToProduct ?? [] ).map( item => ({
        cantidad: numero( item.cantidad ),
        nombre:   item.product_id?.nombre ?? '',
        pvp:      numero( item.product_id?.pvp ),
        v_total:  numero( item.v_total )
      }))
    };

    // send_messages en false a propósito: esto es una descarga, no se le puede
    // reenviar el correo ni el WhatsApp al cliente por bajar un PDF.
    await this.facturaService.generarProforma(
      datosFactura,
      ( invoice.sucursal_id as any ).id,
      invoice.id,
      false
    );

    const actualizada = await this.invoiceRepository.findOne({ where: { id: invoice_id } });

    return actualizada.name_proforma;
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
