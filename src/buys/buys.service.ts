import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Buy } from './entities/buy.entity';
import { Between, ILike, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { BuyToProduct } from './entities/buyToProduct.entity';
import { Company } from 'src/companies/entities/company.entity';
import { paginar, OpcionesPaginacion, Paginado } from 'src/common/helpers/paginar.helper';

@Injectable()
export class BuysService {

  private readonly logger = new Logger('BuyService');

  constructor(
    @InjectRepository(Buy)
    private readonly buyRepository: Repository<Buy>,
    @InjectRepository(BuyToProduct)
    private readonly tablePivotRepository: Repository<BuyToProduct>,
  ){}

  async create(createBuyDto: CreateBuyDto, sucursal_id: Sucursal) {
    try {

      let buyEntity = new Buy();
      buyEntity = {
        ...createBuyDto,
        sucursal_id
      }

      const buyCreated = await this.buyRepository.save( buyEntity );

      const pivot: Array<BuyToProduct> = [];
      createBuyDto.products.forEach( p => {
        pivot.push(new BuyToProduct(
          p.cantidad,
          p.v_total,
          buyCreated,
          p.id,
          p.descuento,
          p.aplicaIva
        ));
      })
      this.tablePivotRepository.save( pivot );

      return buyCreated;
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  /**
   * Listado paginado de compras.
   *
   * Antes devolvía TODAS las compras de la sucursal y la tabla del front
   * paginaba en memoria: con el tiempo eso se vuelve una descarga enorme por
   * cada visita a la pantalla. Ahora pagina en la base, igual que ventas.
   *
   * El filtro de fecha acepta un solo día (basta con `desde`) o un rango.
   */
  async findAll(
    options: OpcionesPaginacion,
    estado: boolean,
    sucursal_id: Sucursal,
    desde: string,
    hasta: string,
    tipo: string | boolean,
    company_id: Company,
    busqueda: string = ''
  ): Promise<Paginado<Buy>> {

    const inicioTexto = desde || hasta || '';
    const finTexto    = hasta || desde || '';

    let inicio: Date, fin: Date;

    if ( inicioTexto !== '' ) {
      inicio = new Date( inicioTexto );
      fin    = new Date( finTexto );
      fin.setHours(23, 59, 59, 999);
    }

    const filtros: any = {
      sucursal_id: { id: sucursal_id, company_id: { id: company_id } },
      created_at: inicioTexto !== '' ? Between( inicio, fin ) : undefined
    };

    if ( tipo == 'Aceptados' ) filtros.isActive = true;
    if ( tipo == 'Anulados' )  filtros.isActive = false;

    const termino = ( busqueda ?? '' ).trim();

    // La búsqueda también viaja al servidor: con paginación real, filtrar solo
    // la página visible daría resultados incompletos.
    const where = termino === ''
      ? filtros
      : [
          { ...filtros, numero_comprobante: ILike(`%${ termino }%`) },
          { ...filtros, proveedor_id: { razon_social: ILike(`%${ termino }%`) } }
        ];

    const option: any = {
      relations: {
        buyToProduct: { product_id: true },
        sucursal_id: true,
        user_id: true
      },
      select: {
        user_id:     { fullName: true },
        sucursal_id: { nombre: true },
        buyToProduct: { v_total: true, cantidad: true, product_id: true, descuento: true, iva: true }
      },
      where,
      order: { created_at: "DESC" }
    }

    try {
      return await paginar<Buy>( this.buyRepository, options, option );
    } catch (error) {
      this.logger.error('No se pudo listar las compras', error?.stack);
      throw new InternalServerErrorException('No se pudo obtener el listado de compras.');
    }
  }

  async findOne(term: string) {
    let buy: Buy[];

    if ( isUUID(term) ) {
      buy = await this.buyRepository.findBy({ id: term });
    } else {
      const queryBuilder = this.buyRepository.createQueryBuilder('buy');
      buy = await queryBuilder
        .where('UPPER(descripcion) =:descripcion', {
          descripcion: term.toUpperCase()
        })
        .getMany();
    }

    if ( buy.length === 0 )
      throw new NotFoundException(`buy with ${ term } not found`);

    return buy;
  }

  async update(id: string, updateBuyDto: UpdateBuyDto) {
    await this.findOne( id );

    try {
      await this.buyRepository.update( id, updateBuyDto );

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
      await this.buyRepository.update( id, { isActive: true })
    else
      await this.buyRepository.update( id, { isActive: false })

    return { ok: true, msg: 'Actualizado Exitosamente' };
  }

  async remove( id: string ) {
    await this.buyRepository.update( id, { isActive: false })

    return { ok: true };
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
