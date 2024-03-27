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
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFiles() files: { archivo_certificado?: Express.Multer.File[], logo?: Express.Multer.File[] }
  ) {
    return await this.companiesService.create(createCompanyDto, files);
  }

  @Get(':estado?')
  async findAll(
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean
  ) {
    return await this.companiesService.findAll( estado );
  }

  @Get('/get-iva/:empresa_id')
  async getIva(
    @Param('empresa_id') empresa_id: string
  ) {
    return await this.companiesService.getIva( empresa_id );
  }

  @Get('/find/:term')
  async findOne(
    @Param('term') term: string
  ) {
    return await this.companiesService.findOne( term );
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
  async updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFiles() files: { archivo_certificado?: Express.Multer.File[], logo?: Express.Multer.File[] }
  ) {
    if ( files.archivo_certificado ){
      if ( updateCompanyDto.archivo_certificado_old !== 'null' &&
          updateCompanyDto.archivo_certificado_old !== files.archivo_certificado[0].originalname) {
        const ruta = path.resolve(__dirname, `../../static/SRI/FIRMAS`);

        if(await fs.existsSync(`${ ruta }/${ updateCompanyDto.archivo_certificado_old }`))
            await fs.unlinkSync(`${ ruta }/${ updateCompanyDto.archivo_certificado_old }`)
      }
      return await this.companiesService.update(id, updateCompanyDto, files);
    }else if(files.logo){
      return await this.companiesService.update(id, updateCompanyDto, files);
    }

    return await this.companiesService.update(id, updateCompanyDto);
  }

  @Patch(':id/:estado')
  async setEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estado', ParseBoolPipe) estado: boolean,
    ) {
    return await this.companiesService.setEstado(id, estado);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companiesService.remove( id );
  }
}
