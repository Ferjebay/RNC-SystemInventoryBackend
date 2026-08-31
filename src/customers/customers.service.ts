import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { And, DataSource, ILike, Not, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Company } from 'src/companies/entities/company.entity';
import { paginar, OpcionesPaginacion, Paginado } from 'src/common/helpers/paginar.helper';
import {
  CONSUMIDOR_FINAL_NOMBRES,
  CONSUMIDOR_FINAL_NUM_DOCUMENTO,
  CONSUMIDOR_FINAL_TIPO_DOCUMENTO
} from './consumidor-final';
const ExcelJS = require('exceljs');
const path = require('path');

@Injectable()
export class CustomersService {

  private readonly logger = new Logger('CustomerService');

  constructor(
    @InjectRepository( Customer )
    private readonly customerRepository: Repository<Customer>,
    private readonly dataSource: DataSource
  ){}


  async downloadClientsToExcel( company_id ){

    // Sin empresa, TypeORM descarta la condición y el archivo salía con los
    // clientes de TODAS las empresas. Mejor fallar que filtrar datos ajenos.
    if ( !company_id )
      throw new BadRequestException('Falta la empresa: no se puede exportar el listado.');

    const customers = await this.customerRepository.find({
      where: {
        company_id: { id: company_id },
        numero_documento: Not( CONSUMIDOR_FINAL_NUM_DOCUMENTO )
      },
      order: { created_at: "DESC" }
    });

    const pathPlantilla = path.resolve(__dirname, `../../static/resource/clientes_plantilla.xlsx`);

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(pathPlantilla)

      const worksheet  = workbook.getWorksheet('Hoja1');

      for (const [index, customer] of customers.entries()) {

        let tipo_documento = '';
        if ( customer.tipo_documento == '04' ) tipo_documento = 'RUC'
        if ( customer.tipo_documento == '05' ) tipo_documento = 'Cedula'
        if ( customer.tipo_documento == '06' ) tipo_documento = 'Pasaporte'

        // La plantilla lleva banda de título en la fila 1 y cabeceras en la 2:
        // los datos arrancan en la 3.
        const fila = index + 3;

        worksheet.getCell(`A${ fila }`).value = customer.nombres.toUpperCase();
        worksheet.getCell(`B${ fila }`).value = tipo_documento;
        worksheet.getCell(`C${ fila }`).value = customer.numero_documento;
        worksheet.getCell(`D${ fila }`).value = customer.email;
        worksheet.getCell(`E${ fila }`).value = customer.celular;
        worksheet.getCell(`F${ fila }`).value = customer.direccion;
        worksheet.getCell(`G${ fila }`).value = customer.tipo_persona ?? 'NATURAL';
        worksheet.getCell(`H${ fila }`).value = customer.observacion;
      }

      return workbook.xlsx.writeBuffer();
    } catch (error) {
      console.error('Error al cargar o guardar la plantilla:', error);
    }
  }

  /**
   * Criterios comunes del listado.
   *
   * `estado` en true = solo clientes activos (lo que necesitan los selectores
   * de facturación). Sin él se devuelve todo, que es lo que quiere el
   * mantenedor de clientes para poder reactivarlos.
   */
  private criteriosListado( estado: boolean, company_id: Company, busqueda: string = '' ) {

    // Va fuera del try de los métodos que lo usan: handleDBExceptions
    // convertiría este 400 en un 500 sin mensaje. Sin empresa, TypeORM descarta
    // la condición y devolvería los clientes de todas.
    if ( !company_id )
      throw new BadRequestException('Falta la empresa: no se puede listar clientes.');

    // El consumidor final se excluye por su identificacion y no por el nombre:
    // el nombre se pisaba con el ILike de la busqueda y volvia a aparecer en el
    // listado. La identificacion es un campo aparte, asi que nunca colisiona.
    const filtros: any = {
      company_id: { id: company_id },
      numero_documento: Not( CONSUMIDOR_FINAL_NUM_DOCUMENTO )
    };

    if ( estado ) filtros.isActive = true;

    const termino = ( busqueda ?? '' ).trim();

    // La búsqueda va al servidor: con paginación real, filtrar solo la página
    // visible daría resultados incompletos.
    const where = termino === ''
      ? filtros
      : [
          { ...filtros, nombres: ILike(`%${ termino }%`) },
          {
            ...filtros,
            numero_documento: And(
              Not( CONSUMIDOR_FINAL_NUM_DOCUMENTO ),
              ILike(`%${ termino }%`)
            )
          },
          { ...filtros, email: ILike(`%${ termino }%`) }
        ];

    return { where, order: { created_at: "DESC" } };
  }

  /** Listado completo. Lo usan los selectores de cliente al facturar. */
  async findAll( estado: boolean, company_id: Company, busqueda: string = '' ) {
    const option = this.criteriosListado( estado, company_id, busqueda );

    try {
      return await this.customerRepository.find( option as any );
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /** Listado paginado. Lo usa el mantenedor de clientes. */
  async findAllPaginado(
    options: OpcionesPaginacion,
    estado: boolean,
    company_id: Company,
    busqueda: string = ''
  ): Promise<Paginado<Customer>> {
    const option = this.criteriosListado( estado, company_id, busqueda );

    try {
      return await paginar<Customer>( this.customerRepository, options, option as any );
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  /**
   * Devuelve el "CONSUMIDOR FINAL" de la empresa y lo crea si todavia no
   * existe.
   *
   * Antes el front lo tomaba de la variable VITE_CONSUMIDOR_FINAL_ID: un unico
   * UUID fijo para todas las empresas. Si ese id no existia en la base, la
   * factura reventaba con un error de llave foranea, y si existia pero era de
   * otra empresa se facturaba contra un cliente ajeno. El id tiene que salir de
   * la empresa con la que se esta facturando.
   */
  async obtenerConsumidorFinal( company_id: Company ) {

    if ( !company_id )
      throw new BadRequestException('Falta la empresa: no se puede resolver el consumidor final.');

    const buscar = () => this.customerRepository.findOne({
      where: {
        company_id: { id: company_id as any },
        numero_documento: CONSUMIDOR_FINAL_NUM_DOCUMENTO
      }
    });

    const existente = await buscar();
    if ( existente ) return existente;

    try {
      return await this.customerRepository.save(
        this.customerRepository.create({
          nombres:          CONSUMIDOR_FINAL_NOMBRES,
          tipo_documento:   CONSUMIDOR_FINAL_TIPO_DOCUMENTO,
          numero_documento: CONSUMIDOR_FINAL_NUM_DOCUMENTO,
          isActive:         true,
          company_id
        })
      );
    } catch (error) {
      // Dos ventas abiertas a la vez pueden intentar crearlo al mismo tiempo:
      // si otro lo gano, se devuelve ese en lugar de fallar.
      const creadoPorOtro = await buscar();
      if ( creadoPorOtro ) return creadoPorOtro;

      this.handleDBExceptions( error );
    }
  }

  /**
   * Cliente valido para emitir un comprobante: tiene que existir y pertenecer a
   * la empresa que factura. La validacion por empresa importa porque el id del
   * cliente llega desde el navegador.
   */
  async obtenerParaFacturar( id: string, company_id: Company ) {

    const cliente = await this.customerRepository.findOne({
      where: { id, company_id: { id: company_id as any } }
    });

    if ( !cliente )
      throw new BadRequestException(
        'El cliente de la factura no existe o no pertenece a esta empresa: vuelve a elegirlo en el listado.'
      );

    return cliente;
  }

  async findOne(term: string) {
    let customer: Customer[];

    if ( isUUID(term) ) {
      customer = await this.customerRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.customerRepository.createQueryBuilder('customer');
      customer = await queryBuilder
        .where('UPPER(nombres) =:nombres', {
          nombres: term.toUpperCase()
        })
        .getMany();
    }

    if ( customer.length === 0 )
      throw new NotFoundException(`customer with ${ term } not found`);

    return customer;
  }

  async update(id: string, updateServicioDto: UpdateCustomerDto, company_id) {
    await this.findOne( id );
    await this.existEmailAndCedula(
      updateServicioDto.email,
      updateServicioDto.numero_documento,
      company_id,
      true,
      id
    )

    try {
      await this.customerRepository.update( id, updateServicioDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async existEmailAndCedula( email, num_doc, company_id, edit = false, client_id = '' ){
    const existsEmail = await this.customerRepository.findOne({
      where: { email: email, company_id: { id: company_id } }
    });

    // if (existsEmail && !edit)
    //   throw new BadRequestException(`Ya existe un cliente con este email: ${ email }`);
    // if (existsEmail && edit && client_id != existsEmail.id){
    //   throw new BadRequestException(`Ya existe un cliente con este email: ${ email }`);
    // }

    const existsNumDoc = await this.customerRepository.findOne({
      where: { numero_documento: num_doc, company_id: { id: company_id } }
    });

    if (existsNumDoc && !edit)
      throw new BadRequestException(`Ya existe un cliente con este numero de documento: ${ num_doc }`);
    if (existsNumDoc && edit && client_id != existsNumDoc.id)
      throw new BadRequestException(`Ya existe un cliente con este numero de documento: ${ num_doc }`);
  }

  async createCustomer( createCustomer: CreateCustomerDto, company_id ) {

    await this.existEmailAndCedula( createCustomer.email, createCustomer.numero_documento, company_id )

    try {
      const customer = await this.customerRepository.create({
        ...createCustomer,
        company_id
      });

      await this.customerRepository.save( customer );

      return customer;

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async setEstado(id: string, estado: boolean) {

    if ( estado )
      await this.customerRepository.update( id, { isActive: true })
    else
      await this.customerRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }


  async actualizarDatosPersonales( id, datosClientes ){
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect()
      await queryRunner.manager.update(Customer, id, datosClientes)
      const cliente = await queryRunner.manager.findBy(Customer, { id })
      await queryRunner.release()
      return { cliente, msg: "Datos del cliente actualizados" };
    } catch (error) {
      this.handleDBExceptions( error );
    }
  }



  async remove(id: string) {
    try {
      const customer = await this.findOne( id );
      let msg: string;

      await this.customerRepository.remove( customer );
      msg = 'Eliminado Exitosamente'

      return { ok: true, msg };
    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    if ( error.code === '23503' )
      throw new BadRequestException({
        detail: error.detail,
        code: '23503'
      });

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
