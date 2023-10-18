import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Presentation } from './entities/presentation.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class PresentationsService {

  constructor(
    @InjectRepository( Presentation )
    private readonly presentationRepository: Repository<Presentation>
  ){}

  async create(createPresentationDto: CreatePresentationDto) {

    const presentation = this.presentationRepository.create( createPresentationDto );

    await this.presentationRepository.save( presentation );

    return presentation;
  }

  async findAll( estado: boolean ) {
    let option:any = { order: { updated_at: "DESC" } }

    if ( estado ) option.where = { isActive: true }

    return await this.presentationRepository.find( option );
  }

  async findOne(term: string) {
    let presentation: Presentation[];

    if ( isUUID(term) ) {
      presentation = await this.presentationRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.presentationRepository.createQueryBuilder('prod'); 
      presentation = await queryBuilder
        .where('UPPER(nombre) =:nombre', {
          nombre: term.toUpperCase()
        })        
        .getMany();
    }

    if ( presentation.length === 0 ) 
      throw new NotFoundException(`presentation with ${ term } not found`);

    return presentation;
  }

  async update(id: string, updatePresentationDto: UpdatePresentationDto) {

    const presentation = await this.findOne( id );

    if ( updatePresentationDto.nombre ) 
      updatePresentationDto.nombre = updatePresentationDto.nombre.toLocaleLowerCase();
    
    try {
      await this.presentationRepository.update( id, updatePresentationDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };      

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    const presentation = await this.findOne( id );
    let msg: string; 

    if ( !presentation[0].isActive ) {
      await this.presentationRepository.remove( presentation );
      msg = 'Eliminado Exitosamente'
    }else{
      await this.presentationRepository.update( id, { isActive: false })
      msg = 'Actualizado Exitosamente'
    }

    return { ok: true, msg };
  }

  private handleExceptions( error: any ){
    if ( error.code === 11000 ) 
        throw new BadRequestException(`Pkemon exists in the BD ${ JSON.stringify(error.keyValue) }`)
      
    throw new InternalServerErrorException("Can't create pokemon - check logs")
  }
}
