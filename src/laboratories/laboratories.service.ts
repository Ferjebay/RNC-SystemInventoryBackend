import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Laboratory } from './entities/laboratory.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class LaboratoriesService {

  constructor(
    @InjectRepository( Laboratory )
    private readonly laboratoryRepository: Repository<Laboratory>
  ){}

  async create(createLaboratoryDto: CreateLaboratoryDto) {
    const laboratory = this.laboratoryRepository.create( createLaboratoryDto );

    await this.laboratoryRepository.save( laboratory );

    return laboratory;
  }

  async findAll( estado: boolean ) {
    let option:any = { order: { updated_at: "DESC" } }

    if ( estado ) option.where = { isActive: true };

    return await this.laboratoryRepository.find( option );
  }

  async findOne(term: string) {
    let laboratory: Laboratory[];

    if ( isUUID(term) ) {
      laboratory = await this.laboratoryRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.laboratoryRepository.createQueryBuilder('lab'); 
      laboratory = await queryBuilder
        .where('UPPER(nombre) =:nombre', {
          nombre: term.toUpperCase()
        })        
        .getMany();
    }

    if ( laboratory.length === 0 ) 
      throw new NotFoundException(`laboratory with ${ term } not found`);

    return laboratory;
  }

  async update(id: string, updateLaboratoryDto: UpdateLaboratoryDto) {
    await this.findOne( id );

    if ( updateLaboratoryDto.nombre ) 
      updateLaboratoryDto.nombre = updateLaboratoryDto.nombre.toLocaleLowerCase();
    
    try {
      await this.laboratoryRepository.update( id, updateLaboratoryDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };      

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    const laboratory = await this.findOne( id );
    let msg: string; 

    if ( !laboratory[0].isActive ) {
      await this.laboratoryRepository.remove( laboratory );
      msg = 'Eliminado Exitosamente'
    }else{
      await this.laboratoryRepository.update( id, { isActive: false })
      msg = 'Actualizado Exitosamente'
    }

    return { ok: true, msg };
  }

  private handleExceptions( error: any ){
    if ( error.code === 11000 ) 
        throw new BadRequestException(`Laboratory exists in the BD ${ JSON.stringify(error.keyValue) }`)
      
    throw new InternalServerErrorException("Can't create laboratory - check logs")
  }

}
