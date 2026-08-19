import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { ILike, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';
import { paginar, OpcionesPaginacion, Paginado } from 'src/common/helpers/paginar.helper';
const ExcelJS = require('exceljs');
const path = require('path');

@Injectable()
export class ProvidersService {

  private readonly logger = new Logger('ProvidersService');

  constructor(
    @InjectRepository( Provider )
    private readonly providerRepository: Repository<Provider>
  ){}

  /** Vuelca los proveedores de la empresa sobre la plantilla de carga masiva. */
  async downloadProvidersToExcel( company_id ){

    // Sin empresa, TypeORM descarta la condición y el archivo saldría con los
    // proveedores de TODAS las empresas.
    if ( !company_id )
      throw new BadRequestException('Falta la empresa: no se puede exportar el listado.');

    const providers = await this.providerRepository.find({
      where: { company: { id: company_id } },
      order: { created_at: "DESC" }
    });

    const pathPlantilla = path.resolve(__dirname, `../../static/resource/proveedores_plantilla.xlsx`);

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile( pathPlantilla );

      const worksheet = workbook.getWorksheet('Hoja1');

      for (const [index, provider] of providers.entries()) {

        // Banda de título en la fila 1 y cabeceras en la 2: los datos van desde
        // la 3.
        const fila = index + 3;

        worksheet.getCell(`A${ fila }`).value = provider.razon_social?.toUpperCase();
        worksheet.getCell(`B${ fila }`).value = provider.tipo_documento;
        worksheet.getCell(`C${ fila }`).value = provider.numero_documento;
        worksheet.getCell(`D${ fila }`).value = provider.email;
        worksheet.getCell(`E${ fila }`).value = provider.celular;
        worksheet.getCell(`F${ fila }`).value = provider.direccion;
        worksheet.getCell(`G${ fila }`).value = provider.tipo_persona ?? 'NATURAL';
        worksheet.getCell(`H${ fila }`).value = provider.observacion;
      }

      return workbook.xlsx.writeBuffer();
    } catch (error) {
      this.logger.error('No se pudo generar el Excel de proveedores', error?.stack);
      throw new InternalServerErrorException('No se pudo generar el Excel de proveedores.');
    }
  }

  async create(createProviderDto: CreateProviderDto, company_id: Company) {
    try {

      const provider = this.providerRepository.create( createProviderDto );

      provider.company = company_id;

      await this.providerRepository.save( provider );

      return provider;
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  /** Criterios comunes del listado. */
  private criteriosListado( estado: boolean, company_id: Company, busqueda: string = '' ) {

    // Va fuera del try de los métodos que lo usan: handleDBExceptions
    // convertiría este 400 en un 500 sin mensaje. Sin empresa, TypeORM descarta
    // la condición y devuelve los proveedores de todas.
    if ( !company_id )
      throw new BadRequestException('Falta la empresa: no se puede listar proveedores.');

    // El `isActive: null` que colgaba de `company` no filtraba nada: el estado
    // que interesa es el del proveedor.
    const filtros: any = { company: { id: company_id } };

    if ( estado ) filtros.isActive = true;

    const termino = ( busqueda ?? '' ).trim();

    // La búsqueda va al servidor: con paginación real, filtrar solo la página
    // visible daría resultados incompletos.
    const where = termino === ''
      ? filtros
      : [
          { ...filtros, razon_social: ILike(`%${ termino }%`) },
          { ...filtros, numero_documento: ILike(`%${ termino }%`) },
          { ...filtros, email: ILike(`%${ termino }%`) }
        ];

    return { where, order: { created_at: "DESC" } };
  }

  /** Listado completo. Lo usa el selector de proveedor al registrar compras. */
  async findAll( estado: boolean, company_id: Company, busqueda: string = '' ) {
    const option = this.criteriosListado( estado, company_id, busqueda );

    try {
      return await this.providerRepository.find( option as any );
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  /** Listado paginado. Lo usa el mantenedor de proveedores. */
  async findAllPaginado(
    options: OpcionesPaginacion,
    estado: boolean,
    company_id: Company,
    busqueda: string = ''
  ): Promise<Paginado<Provider>> {
    const option = this.criteriosListado( estado, company_id, busqueda );

    try {
      return await paginar<Provider>( this.providerRepository, options, option as any );
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findOne(term: string) {
    let provider: Provider[];

    if ( isUUID(term) ) {
      provider = await this.providerRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.providerRepository.createQueryBuilder('provider');
      provider = await queryBuilder
        .where('UPPER(razon_social) =:razon_social', {
          razon_social: term.toUpperCase()
        })
        .getMany();
    }

    if ( provider.length === 0 )
      throw new NotFoundException(`provider with ${ term } not found`);

    return provider;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto, company_id: Company) {
    await this.findOne( id );

    try {

      await this.providerRepository.update( id, updateProviderDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async setEstado(id: string, estado: boolean) {

    if ( estado )
      await this.providerRepository.update( id, { isActive: true })
    else
      await this.providerRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove( id: string ) {
    const provider = await this.findOne( id );
    let msg: string;

    await this.providerRepository.remove( provider );
    msg = 'Eliminado Exitosamente'

    return { ok: true, msg };
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
