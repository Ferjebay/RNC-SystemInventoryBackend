import { Controller, Get, Post, Body, Param, Delete, ParseBoolPipe, DefaultValuePipe, ParseUUIDPipe, UseInterceptors, Patch, UploadedFiles } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
const fs = require('fs');
const path = require('path');

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService    
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'archivo_certificado' },
    { name: 'logo' }], 
    { 
      fileFilter: fileFilter,
      storage: diskStorage({ 
        destination: function (_, file, cb) {
          if(file.fieldname == 'logo')
            cb(null, './public/images')
          else
            cb(null, `./static/SRI/FIRMAS`)
        }, 
          filename: fileNamer 
      }) 
    }
  ))
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFiles() files: { archivo_certificado?: Express.Multer.File[], logo?: Express.Multer.File[] }
  ) {
    return this.companiesService.create(createCompanyDto, files);
  }

  @Get(':estado?')
  findAll(
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.companiesService.findAll( estado );
  }

  @Get('/find/:term')
  findOne(
    @Param('term') term: string
  ) {
    return this.companiesService.findOne( term );
  }

  @Post(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'archivo_certificado' },
    { name: 'logo' }], 
    { 
      fileFilter: fileFilter,
      storage: diskStorage({ 
        destination: function (_, file, cb) {
          if(file.fieldname == 'logo')
            cb(null, './public/images')
          else
            cb(null, './static/SRI/FIRMAS')
        }, 
        filename: fileNamer 
      }) 
    }
  ))
  updateCompany(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFiles() files: { archivo_certificado?: Express.Multer.File[], logo?: Express.Multer.File[] }   
  ) {
    if ( files.archivo_certificado ){
      if ( updateCompanyDto.archivo_certificado_old !== 'null' &&
          updateCompanyDto.archivo_certificado_old !== files.archivo_certificado[0].originalname) {
        const ruta = path.resolve(__dirname, `../../static/SRI/FIRMAS`);
  
        if(fs.existsSync(`${ ruta }/${ updateCompanyDto.archivo_certificado_old }`))
            fs.unlinkSync(`${ ruta }/${ updateCompanyDto.archivo_certificado_old }`)        
      }
      return this.companiesService.update(id, updateCompanyDto, files);
    }else if(files.logo){
      return this.companiesService.update(id, updateCompanyDto, files);
    } 

    return this.companiesService.update(id, updateCompanyDto);
  }
  
  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('estado', ParseBoolPipe) estado: boolean, 
    ) {
    return this.companiesService.setEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.remove( id );
  }
}
