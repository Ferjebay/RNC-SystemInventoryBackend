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
import {
  paginate,
  Pagination,
  IPaginationOptions
} from 'nestjs-typeorm-paginate';
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

  async create(createProductDto: CreateProductDto, sucursal_id: Sucursal){
    try {
      const product = this.productRepository.create( createProductDto );

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

  async findAll( options: IPaginationOptions, sucursal_id: string ): Promise<Pagination<Product>> {
    return await paginate<Product>(this.productRepository, options, { 
        where: { sucursal_id: { id: sucursal_id } },
        order: { created_at: "DESC" }
      }
    );          
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne( id );

    try {
      await this.productRepository.update( id, updateProductDto );

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
