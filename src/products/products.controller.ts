import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, DefaultValuePipe, ParseUUIDPipe, ParseBoolPipe, Headers } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';

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
    
    return this.productsService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/products',
    }, sucursal_id);
    
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOne( term );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  
  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('estado', ParseBoolPipe) estado: boolean, 
    ) {
    return this.productsService.setEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove( id );
  }
}
