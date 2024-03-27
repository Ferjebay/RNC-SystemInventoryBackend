import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, DefaultValuePipe, ParseUUIDPipe, ParseBoolPipe, Headers, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Headers('sucursal_id') sucursal_id: Sucursal,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(createProductDto, sucursal_id);
  }

  @Get()
  async findAll(
    @Headers('sucursal_id') sucursal_id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe ) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    @Query('busqueda' ) busqueda: string
  ): Promise<Pagination<Product>> {

    return await this.productsService.findAll({
      page,
      limit,
      route: `${ process.env.HOST_API }/products`,
    }, sucursal_id);
  }

  @Post('/download-products-excel/')
  async downloadProductsToExcel(
    @Body('sucursal_id') sucursal_id: string,
    @Res() res: Response
  ){
    const file = await this.productsService.downloadProductsToExcel( sucursal_id );
    res.setHeader('Content-Disposition', 'attachment; filename=ejemplo.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send( file );
  }

  @Get(':term')
  async findOne(
    @Headers('company_id') company_id: string,
    @Param('term') term: string
  ) {
    return await this.productsService.findOne( term, company_id );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/:estado')
  async setEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estado', ParseBoolPipe) estado: boolean,
    ) {
    return await this.productsService.setEstado(id, estado);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.remove( id );
  }
}
