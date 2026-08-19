import { FindManyOptions, Repository } from 'typeorm';

/**
 * Paginación de listados sin dependencias externas.
 *
 * Reemplaza a `nestjs-typeorm-paginate` conservando exactamente la misma forma
 * de respuesta (`items` + `meta`), que es la que ya consumen los listados del
 * front. Es el mismo esquema que usa ISPMAX.
 */

export interface OpcionesPaginacion {
  page: number | string;
  limit: number | string;
}

export interface MetaPaginacion {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Paginado<T> {
  items: T[];
  meta: MetaPaginacion;
}

/**
 * `findAndCount` aplica el `take` sobre entidades raíz distintas, así que las
 * relaciones uno-a-muchos (los ítems de una factura o de una compra) no inflan
 * el conteo ni recortan la página.
 */
export const paginar = async <T>(
  repositorio: Repository<T>,
  opciones: OpcionesPaginacion,
  criterios: FindManyOptions<T> = {}
): Promise<Paginado<T>> => {

  const page  = Math.max( Number( opciones?.page )  || 1,  1 );
  const limit = Math.max( Number( opciones?.limit ) || 10, 1 );

  const [ items, totalItems ] = await repositorio.findAndCount({
    ...criterios,
    skip: ( page - 1 ) * limit,
    take: limit
  });

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
