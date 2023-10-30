import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { isUUID, validate } from 'class-validator';
import { readFileSync } from 'fs';
import { Email } from 'src/email/entities/email.entity';
const fs = require('fs');
const path = require('path');

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository( Company )
    private readonly companyRepository: Repository<Company>,
    @InjectRepository( Email )
    private readonly emailRepository: Repository<Email>
  ){}

  async create(createCompanyDto: CreateCompanyDto, files: any = null) {
    try {      
      let company: Company;
      let logo_name = null;
      const cert_name = files.archivo_certificado[0].originalname;

      if ( files.logo )
        logo_name = files.logo[0].originalname;

      company = this.companyRepository.create({
        ...createCompanyDto, 
        archivo_certificado: cert_name,
        logo: logo_name
      }); 

      const companyCreated = await this.companyRepository.save( company );

      const email = new Email();
      email.company_id = companyCreated;
      email.host = '';
      email.usuario = '';
      email.puerto = 12345;
      email.password = '';
      email.seguridad = 'SSL';
      this.emailRepository.save( email );

      return { ok: true, msg: "Empresa creada exitosamente" };      

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async findAll( estado: boolean ) {
    let option:any = { order: { created_at: "DESC" } }

    if ( estado ) option.where = { isActive: true }

    return await this.companyRepository.find( option );
  }

  async findOne(term: string) {
    let company: Company[];

    if ( isUUID(term) ) {
      company = await this.companyRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.companyRepository.createQueryBuilder('prod'); 
      company = await queryBuilder
        .where('UPPER(nombre_comercial) =:nombre_comercial', {
          nombre_comercial: term.toUpperCase()
        })        
        .getMany();
    }

    if ( company.length === 0 ) 
      throw new NotFoundException(`company with ${ term } not found`);

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, files: any = null) {
    await this.findOne( id );
    let logo_name = '';

    try {      
      let { archivo_certificado_old, logo_old, ...rest } = updateCompanyDto;

      if ( files && files.logo != null )
        logo_name = files.logo[0].originalname;
      else
        logo_name = logo_old;

      if ( files && files.archivo_certificado !== undefined)       
        rest.archivo_certificado = files.archivo_certificado[0].originalname
      else
        delete rest.archivo_certificado;

      await this.companyRepository.update( id, {
        ...rest,
        logo: logo_name
      });

      return { ok: true, msg: "Se actualizaron los datos exitosamente" };      

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    const company = await this.findOne( id );

    try {
      await this.companyRepository.remove( company );      

      if (company[0].archivo_certificado != null || company[0].logo != null) {
        const ruta = path.resolve(__dirname, `../../static/SRI/`);
      
        if(fs.existsSync(`${ ruta }/FIRMAS/${ company[0].archivo_certificado }`))
          fs.unlinkSync(`${ ruta }/FIRMAS/${ company[0].archivo_certificado }`);    

        if(fs.existsSync(`${ ruta }/images/${ company[0].logo }`))
          fs.unlinkSync(`${ ruta }/images/${ company[0].logo }`);    
      }

      return { ok: true, msg: 'Eliminado Exitosamente' };
    } catch (error) {
      this.handleExceptions( error );
    }
    
  }

  async setEstado(id: string, estado: boolean) {
    if ( estado ) 
      await this.companyRepository.update( id, { isActive: true })
    else
      await this.companyRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  private handleExceptions( error: any ){
    console.log(error);
    if ( error.code === 11000 ) 
      throw new BadRequestException(`Category exists in the BD ${ JSON.stringify(error.keyValue) }`)
    if ( error.code === '23503' ) 
      throw new BadRequestException(`No es posbile borrar, este registro se encuentra en uso`)
    if ( error.response.statusCode === 400 ) 
      throw new BadRequestException(`La clave del certificado es incorrecta`)

    throw new InternalServerErrorException("Can't create pokemon - check logs")
  }
}
