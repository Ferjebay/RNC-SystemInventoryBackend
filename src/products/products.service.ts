import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { isNumberString, isUUID } from 'class-validator';
import { paginar, OpcionesPaginacion, Paginado } from 'src/common/helpers/paginar.helper';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
const ExcelJS = require('exceljs');
const path = require('path');

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  /**
   * Mantiene coherentes el sí/no histórico y la tarifa nueva, y limpia el ICE
   * cuando queda en "No aplica" para no dejar un valor huérfano que después se
   * mande al SRI.
   */
  private normalizarImpuestos( dto: any ) {
    const datos = { ...dto };

    if ( datos.impuesto !== undefined && datos.impuesto !== null )
      datos.aplicaIva = Number( datos.impuesto ) > 0;

    if ( !datos.ice ) {
      datos.ice       = null;
      datos.valor_ice = null;
      datos.tipo_ice  = null;
    }

    return datos;
  }

  async create(createProductDto: CreateProductDto, sucursal_id: Sucursal){
    try {
      const product = this.productRepository.create(
        this.normalizarImpuestos( createProductDto ) as CreateProductDto
      );

      product.sucursal_id = sucursal_id;

      await this.productRepository.save( product );

      return product;
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async downloadProductsToExcel( sucursal_id ){
    const productos = await this.productRepository.find({
      where: { sucursal_id: { id: sucursal_id } }
    });

    const pathPlantilla = path.resolve(__dirname, `../../static/resource/productos_plantilla.xlsx`);

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(pathPlantilla)

      const worksheet  = workbook.getWorksheet('Hoja1');

      for (const [index, producto] of productos.entries()) {

        worksheet.getCell(`A${ index + 2 }`).value = producto.codigoBarra;
        worksheet.getCell(`B${ index + 2 }`).value = producto.nombre;
        worksheet.getCell(`C${ index + 2 }`).value = producto.precio_compra;
        worksheet.getCell(`D${ index + 2 }`).value = producto.pvp;
        worksheet.getCell(`E${ index + 2 }`).value = producto.aplicaIva ? 'SI' : 'NO';
        worksheet.getCell(`F${ index + 2 }`).value = producto.descuento;
        worksheet.getCell(`G${ index + 2 }`).value = producto.tipo;
        worksheet.getCell(`H${ index + 2 }`).value = producto.stock;

      }

      return workbook.xlsx.writeBuffer();
    } catch (error) {
      console.error('Error al cargar o guardar la plantilla:', error);
    }
  }

  /**
   * `soloActivos` lo piden los selectores de facturación y compras: un producto
   * inactivo no debe poder agregarse a un comprobante. El mantenedor de
   * productos NO lo manda, porque necesita ver los inactivos para reactivarlos.
   */
  async findAll(
    options: OpcionesPaginacion,
    sucursal_id: string,
    busqueda: string,
    soloActivos: boolean = false
  ): Promise<Paginado<Product>> {
    try {
      const filtros: any = { sucursal_id: { id: sucursal_id } };

      if ( soloActivos ) filtros.isActive = true;

      return await paginar<Product>(this.productRepository, options, {
          relations: { sucursal_id: true },
          where: [
            { ...filtros, nombre: ILike(`%${ busqueda }%`) },
            { ...filtros, codigoBarra: ILike(`%${ busqueda }%`) }
          ],
          order: { created_at: "DESC" }
        }
      );
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string, company_id: string = null) {
    let product: Product[];

    if ( isUUID(term) ) {
      product = await this.productRepository.find({
        where: {
          id: term,
          sucursal_id: { company_id: { id: company_id } }
        }
      });
    } else if( isNumberString( term ) ){
      product = await this.productRepository.find({
        where: {
          codigoBarra: term,
          sucursal_id: { company_id: { id: company_id } }
        }
      })
    }else{
      product = await this.productRepository.find({
        relations: { sucursal_id: true },
        where: {
          nombre: ILike(`%${ term }%`),
          sucursal_id: { company_id: { id: company_id } }
        }
      })
    }

    if ( !product )
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, sucursal_id) {
    await this.findOne( id );

    try {
      await this.productRepository.update( id, { ...this.normalizarImpuestos( updateProductDto ), sucursal_id });

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async setEstado(id: string, estado: boolean) {
    if ( estado )
      await this.productRepository.update( id, { isActive: true })
    else
      await this.productRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove(id: string) {
    try {
      const user = await this.findOne( id );
      let msg: string;

      await this.productRepository.remove( user );
      msg = 'Eliminado Exitosamente'

      return { ok: true, msg };
    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    if ( error.code === '23503' )
      throw new BadRequestException({
        detail: error.detail,
        code: '23503'
      });

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
