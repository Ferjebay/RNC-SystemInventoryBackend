import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository( Category )
    private readonly categoryRepository: Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto) {    
    const category = await this.categoryRepository.create( createCategoryDto );

    await this.categoryRepository.save( category );

    return category;
  }

  async findAll( estado: boolean ) {
    let option:any = { order: { updated_at: "DESC" } }

    if ( estado ) option.where = { isActive: true }

    return await this.categoryRepository.find( option );
  }

  async findOne(term: string) {
    let category: Category[];

    if ( isUUID(term) ) {
      category = await this.categoryRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.categoryRepository.createQueryBuilder('prod'); 
      category = await queryBuilder
        .where('UPPER(nombre) =:nombre', {
          nombre: term.toUpperCase()
        })        
        .getMany();
    }

    if ( category.length === 0 ) 
      throw new NotFoundException(`category with ${ term } not found`);

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    await this.findOne( id );

    if ( updateCategoryDto.nombre ) 
      updateCategoryDto.nombre = updateCategoryDto.nombre.toLocaleLowerCase();
    
    try {
      await this.categoryRepository.update( id, updateCategoryDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };      

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    const category = await this.findOne( id );
    let msg: string; 

    if ( !category[0].isActive ) {
      await this.categoryRepository.remove( category );
      msg = 'Eliminado Exitosamente'
    }else{
      await this.categoryRepository.update( id, { isActive: false })
      msg = 'Actualizado Exitosamente'
    }

    return { ok: true, msg };
  }

  private handleExceptions( error: any ){
    if ( error.code === 11000 ) 
        throw new BadRequestException(`Category exists in the BD ${ JSON.stringify(error.keyValue) }`)
      
    throw new InternalServerErrorException("Can't create pokemon - check logs")
  }
}
