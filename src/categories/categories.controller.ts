import { 
  Controller, Get, Post, Body, Patch, Param, 
  Delete, ParseBoolPipe, DefaultValuePipe, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get(':estado?')
  findAll(
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.categoriesService.findAll( estado );
  }

  @Get('/find/:term')
  findOne(@Param('term') term: string) {
    return this.categoriesService.findOne( term );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove( id) ;
  }
}
