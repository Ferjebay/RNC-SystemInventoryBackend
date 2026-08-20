import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IngresoEgreso } from './entities/ingreso-egreso.entity';
import { CreateIngresoEgresoDto } from './dto/create-ingreso-egreso.dto';
import { UpdateIngresoEgresoDto } from './dto/update-ingreso-egreso.dto';
import { FilterIngresoEgresoDto } from './dto/filter-ingreso-egreso.dto';
import { FormaPago } from './enums/forma-pago.enum';
import { OpcionesPaginacion, Paginado } from 'src/common/helpers/paginar.helper';

const moment = require('moment');
const ExcelJS = require('exceljs');

@Injectable()
export class IngresosEgresosService {

  private readonly logger = new Logger('IngresosEgresos');

  constructor(
    @InjectRepository( IngresoEgreso )
    private readonly ieRepository: Repository<IngresoEgreso>
  ){}

  async create( createDto: CreateIngresoEgresoDto, company_id: string ) {
    this.exigirEmpresa( company_id );

    try {
      const movimiento = this.ieRepository.create({
        ...createDto,
        fecha:        createDto.fecha || moment().format('YYYY-MM-DD'),
        company_id:   { id: company_id } as any,
        proveedor_id: createDto.proveedor_id ? { id: createDto.proveedor_id } as any : null,
        sucursal_id:  createDto.sucursal_id  ? { id: createDto.sucursal_id }  as any : null,
        user_id:      createDto.user_id      ? { id: createDto.user_id }      as any : null
      });

      await this.ieRepository.save( movimiento );

      return { ok: true, msg: 'Registro creado exitosamente', movimiento };
    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  /**
   * Base común del listado, los totales y el reporte: si cada uno armara su
   * propio WHERE acabarían mostrando cifras distintas para el mismo filtro.
   */
  private construirQuery(
    filterDto: FilterIngresoEgresoDto,
    company_id: string
  ): SelectQueryBuilder<IngresoEgreso> {

    const query = this.ieRepository
      .createQueryBuilder('ie')
      .leftJoinAndSelect('ie.proveedor_id', 'proveedor')
      .leftJoinAndSelect('ie.sucursal_id', 'sucursal')
      .leftJoinAndSelect('ie.user_id', 'usuario')
      .where('ie.company_id = :company_id', { company_id });

    if ( filterDto.tipo )
      query.andWhere('ie.tipo = :tipo', { tipo: filterDto.tipo });

    if ( filterDto.proveedor_id === 'NINGUNO' )
      query.andWhere('ie.proveedor_id IS NULL');
    else if ( filterDto.proveedor_id )
      query.andWhere('proveedor.id = :proveedor_id', { proveedor_id: filterDto.proveedor_id });

    if ( filterDto.sucursal_id )
      query.andWhere('sucursal.id = :sucursal_id', { sucursal_id: filterDto.sucursal_id });

    if ( filterDto.user_id )
      query.andWhere('usuario.id = :user_id', { user_id: filterDto.user_id });

    if ( filterDto.fechaDesde )
      query.andWhere('ie.fecha >= :desde', { desde: filterDto.fechaDesde });

    if ( filterDto.fechaHasta )
      query.andWhere('ie.fecha <= :hasta', { hasta: filterDto.fechaHasta });

    if ( filterDto.busqueda )
      query.andWhere(
        '(ie.referencia ILIKE :busqueda OR ie.descripcion ILIKE :busqueda)',
        { busqueda: `%${ filterDto.busqueda }%` }
      );

    return query;
  }

  async findAll(
    opciones: OpcionesPaginacion,
    filterDto: FilterIngresoEgresoDto,
    company_id: string
  ): Promise<Paginado<IngresoEgreso>> {
    this.exigirEmpresa( company_id );

    const page  = Math.max( Number( opciones?.page )  || 1,  1 );
    const limit = Math.max( Number( opciones?.limit ) || 10, 1 );

    const [ items, totalItems ] = await this.construirQuery( filterDto, company_id )
      .orderBy('ie.fecha', 'DESC')
      .addOrderBy('ie.created_at', 'DESC')
      .skip( ( page - 1 ) * limit )
      .take( limit )
      .getManyAndCount();

    return {
      items,
      meta: {
        itemCount:    items.length,
        totalItems,
        itemsPerPage: limit,
        totalPages:   Math.ceil( totalItems / limit ) || 1,
        currentPage:  page
      }
    };
  }

  /**
   * Totales de las tarjetas. Los del día se calculan aparte del rango: son dos
   * preguntas distintas ("cuánto entró hoy" y "cuánto en el período filtrado").
   */
  async getResumen( filterDto: FilterIngresoEgresoDto, company_id: string ) {
    this.exigirEmpresa( company_id );

    const sumar = async ( tipo: string, desde?: string, hasta?: string ) => {
      const query = this.construirQuery(
        { ...filterDto, tipo: tipo as any, fechaDesde: desde, fechaHasta: hasta },
        company_id
      );

      const { total } = await query
        .select('COALESCE(SUM(ie.monto), 0)', 'total')
        .getRawOne();

      return Number( total ) || 0;
    }

    const hoy = moment().format('YYYY-MM-DD');

    const [ totalIngresos, totalEgresos, totalIngresosHoy, totalEgresosHoy ] = await Promise.all([
      sumar('ingreso', filterDto.fechaDesde, filterDto.fechaHasta),
      sumar('egreso',  filterDto.fechaDesde, filterDto.fechaHasta),
      sumar('ingreso', hoy, hoy),
      sumar('egreso',  hoy, hoy)
    ]);

    return {
      totalIngresos,
      totalEgresos,
      totalIngresosHoy,
      totalEgresosHoy,
      balance:    Math.round( ( totalIngresos - totalEgresos ) * 100 ) / 100,
      balanceHoy: Math.round( ( totalIngresosHoy - totalEgresosHoy ) * 100 ) / 100
    };
  }

  /**
   * Un renglón por mes del año pedido. Se agrupa en la base de datos: traer los
   * movimientos y sumarlos en memoria se cae en cuanto hay volumen.
   */
  async getEstadisticasAnuales( anio: number, company_id: string ) {
    this.exigirEmpresa( company_id );

    const filas = await this.ieRepository
      .createQueryBuilder('ie')
      .select('EXTRACT(MONTH FROM ie.fecha)', 'mes')
      .addSelect(`COALESCE(SUM(CASE WHEN ie.tipo = 'ingreso' THEN ie.monto ELSE 0 END), 0)`, 'ingresos')
      .addSelect(`COALESCE(SUM(CASE WHEN ie.tipo = 'egreso'  THEN ie.monto ELSE 0 END), 0)`, 'egresos')
      .where('ie.company_id = :company_id', { company_id })
      .andWhere('EXTRACT(YEAR FROM ie.fecha) = :anio', { anio })
      .groupBy('EXTRACT(MONTH FROM ie.fecha)')
      .getRawMany();

    const porMes = new Map(
      filas.map( f => [ Number( f.mes ), { ingresos: Number( f.ingresos ), egresos: Number( f.egresos ) } ] )
    );

    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Se devuelven los doce meses aunque no tengan movimientos: una tabla con
    // huecos obliga a adivinar si falta el dato o no hubo actividad.
    return meses.map( ( nombre, indice ) => {
      const { ingresos, egresos } = porMes.get( indice + 1 ) ?? { ingresos: 0, egresos: 0 };

      return {
        mes: nombre,
        ingresos,
        egresos,
        total: Math.round( ( ingresos - egresos ) * 100 ) / 100
      };
    });
  }

  getFormasPago() {
    return Object.values( FormaPago ).map( valor => ({
      label: valor.charAt(0).toUpperCase() + valor.slice(1),
      value: valor
    }));
  }

  async findOne( id: string, company_id: string ) {
    this.exigirEmpresa( company_id );

    const movimiento = await this.ieRepository.findOne({
      where: { id, company_id: { id: company_id } },
      relations: { proveedor_id: true, sucursal_id: true, user_id: true }
    });

    if ( !movimiento )
      throw new NotFoundException(`No se encontró el movimiento ${ id }`);

    return movimiento;
  }

  async update( id: string, updateDto: UpdateIngresoEgresoDto, company_id: string ) {
    // findOne valida además que el movimiento sea de esta empresa: sin eso se
    // podría editar el de otra pasando su id.
    await this.findOne( id, company_id );

    try {
      const { proveedor_id, sucursal_id, user_id, ...resto } = updateDto;

      const cambios: any = { ...resto };

      // `undefined` = no vino en la petición, se deja como está.
      if ( proveedor_id !== undefined ) cambios.proveedor_id = proveedor_id ? { id: proveedor_id } : null;
      if ( sucursal_id  !== undefined ) cambios.sucursal_id  = sucursal_id  ? { id: sucursal_id }  : null;
      if ( user_id      !== undefined ) cambios.user_id      = user_id      ? { id: user_id }      : null;

      await this.ieRepository.save({ id, ...cambios });

      return { ok: true, msg: 'Registro actualizado exitosamente' };
    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async remove( id: string, company_id: string ) {
    await this.findOne( id, company_id );

    await this.ieRepository.softDelete( id );

    return { ok: true, msg: 'Registro eliminado exitosamente' };
  }

  /** Reporte del listado con los filtros aplicados, más una fila de totales. */
  async downloadExcel( filterDto: FilterIngresoEgresoDto, company_id: string ): Promise<Buffer> {
    this.exigirEmpresa( company_id );

    const movimientos = await this.construirQuery( filterDto, company_id )
      .orderBy('ie.fecha', 'ASC')
      .getMany();

    const libro = new ExcelJS.Workbook();
    const hoja  = libro.addWorksheet('Ingresos y Egresos');

    const periodo = filterDto.fechaDesde || filterDto.fechaHasta
      ? `${ filterDto.fechaDesde ?? '...' } hasta ${ filterDto.fechaHasta ?? '...' }`
      : 'Todos los movimientos';

    hoja.mergeCells('A1:H1');
    hoja.getCell('A1').value = 'INGRESOS Y EGRESOS';
    hoja.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    hoja.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    hoja.getCell('A1').fill = {
      type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34495E' }
    };
    hoja.getRow(1).height = 26;

    hoja.mergeCells('A2:H2');
    hoja.getCell('A2').value = `Período: ${ periodo }`;
    hoja.getCell('A2').alignment = { horizontal: 'center' };

    const encabezados = [
      'Fecha', 'Tipo', 'Referencia', 'Proveedor',
      'Sucursal', 'Forma de pago', 'Descripción', 'Monto'
    ];

    const filaEncabezado = hoja.getRow(4);
    filaEncabezado.values = encabezados;
    filaEncabezado.eachCell( celda => {
      celda.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0C88F4' } };
      celda.alignment = { horizontal: 'center' };
    });

    let ingresos = 0;
    let egresos  = 0;

    movimientos.forEach( m => {
      const monto = Number( m.monto ) || 0;

      if ( m.tipo === 'ingreso' ) ingresos += monto;
      else                        egresos  += monto;

      hoja.addRow([
        m.fecha,
        m.tipo === 'ingreso' ? 'Ingreso' : 'Egreso',
        m.referencia,
        ( m.proveedor_id as any )?.razon_social ?? '',
        ( m.sucursal_id as any )?.nombre ?? '',
        m.forma_pago ?? '',
        m.descripcion ?? '',
        monto
      ]);
    });

    hoja.addRow([]);
    hoja.addRow([ '', '', '', '', '', '', 'TOTAL INGRESOS', Math.round( ingresos * 100 ) / 100 ]);
    hoja.addRow([ '', '', '', '', '', '', 'TOTAL EGRESOS',  Math.round( egresos  * 100 ) / 100 ]);
    hoja.addRow([ '', '', '', '', '', '', 'BALANCE',        Math.round( ( ingresos - egresos ) * 100 ) / 100 ]);

    for ( let i = hoja.rowCount - 2; i <= hoja.rowCount; i++ )
      hoja.getRow(i).eachCell( celda => celda.font = { bold: true } );

    hoja.getColumn(8).numFmt = '#,##0.00';
    hoja.columns.forEach( ( columna, indice ) => {
      columna.width = indice === 6 ? 40 : 18;
    });

    hoja.views = [{ state: 'frozen', ySplit: 4 }];

    return await libro.xlsx.writeBuffer();
  }

  /**
   * El listado se filtra por empresa. Sin la cabecera, TypeORM descartaría la
   * condición y devolvería los movimientos de todas: mismo fallo que ya apareció
   * en clientes y en proveedores.
   */
  private exigirEmpresa( company_id: string ) {
    if ( !company_id )
      throw new BadRequestException('Falta la empresa: no se pueden listar los movimientos.');
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException( error.detail );

    this.logger.error( error );
    throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
  }
}
