import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Email } from 'src/email/entities/email.entity';
import { Proforma } from 'src/proforma/entities/proforma.entity';
import { FacturacionMsClient } from 'src/comprobantes-electronicos/facturacion-ms/facturacion-ms.client';
const fs = require('fs');
const path = require('path');

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository( Company )
    private readonly companyRepository: Repository<Company>,
    @InjectRepository( Email )
    private readonly emailRepository: Repository<Email>,
    @InjectRepository( Proforma )
    private readonly proformaRepository: Repository<Proforma>,
    private readonly facturacionMs: FacturacionMsClient
  ){}

  /**
   * Deja el certificado listo en el microservicio, que es quien firma.
   *
   * El .p12 se sigue guardando aquí (multer ya lo escribió) pero además se
   * empuja al MS y se le pide la caducidad. Si el MS no responde, el guardado
   * de la empresa continúa: el archivo quedó local y basta reintentar.
   */
  private async sincronizarCertificado( nombreArchivo: string, password: string ) {
    const ruta = path.resolve(__dirname, `../../static/SRI/FIRMAS/${ nombreArchivo }`);

    if ( !fs.existsSync( ruta ) ) return null;

    await this.facturacionMs.subirCertificado( ruta, nombreArchivo );

    if ( !password ) return null;

    return await this.facturacionMs.caducidadCertificado( nombreArchivo, password );
  }

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

      const caducidad = await this.sincronizarCertificado( cert_name, createCompanyDto.clave_certificado );
      if ( caducidad ) company.fecha_caducidad_certificado = caducidad.toISOString();

      const companyCreated = await this.companyRepository.save( company );

      const email = new Email();
      email.company_id = companyCreated;
      email.host = '';
      email.usuario = '';
      email.puerto = 12345;
      email.password = '';
      email.seguridad = 'SSL';
      this.emailRepository.save( email );

      const proforma = new Proforma();
      proforma.clausulas = [];
      proforma.aceptacion_proforma = ""
      proforma.company_id = companyCreated;
      this.proformaRepository.save( proforma );

      return { ok: true, msg: "Empresa creada exitosamente" };

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async findAll( estado: boolean, company_id, rol_name ) {

    let option:any = { order: { created_at: "DESC" }, where: { isActive: null } }

    if ( rol_name != 'SUPER-ADMINISTRADOR' ) option.where.id = company_id

    if ( estado ) option.where.isActive = true

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

  async getIva(empresa_id: string) {

    const iva = await this.companyRepository.findOne({
      select: { iva: true },
      where: { id: empresa_id }
    });

    return iva;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, files: any = null) {
    await this.findOne( id );

    try {
      let { archivo_certificado_old, logo_old, ...rest } = updateCompanyDto;

      const cert_name = ( files && files.archivo_certificado )
                          ? files.archivo_certificado[0].originalname
                          : archivo_certificado_old;

      const datos: any = {
        ...rest,
        logo: ( files && files.logo ) ? files.logo[0].originalname : logo_old,
        archivo_certificado: cert_name
      };

      // Solo se resincroniza cuando llega un certificado nuevo: subirlo en cada
      // guardado sería mandar el mismo archivo por gusto.
      if ( files && files.archivo_certificado ) {
        const caducidad = await this.sincronizarCertificado( cert_name, updateCompanyDto.clave_certificado );
        if ( caducidad ) datos.fecha_caducidad_certificado = caducidad.toISOString();
      }

      await this.companyRepository.update( id, datos );

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
    if ( error.code === '23505' )
      throw new BadRequestException(`error duplucidad ${ JSON.stringify(error.detail) }`)
    if ( error.response.statusCode === 400 )
      throw new BadRequestException(`La clave del certificado es incorrecta`)

    throw new InternalServerErrorException("error server - comunicarse con el admin")
  }
}
