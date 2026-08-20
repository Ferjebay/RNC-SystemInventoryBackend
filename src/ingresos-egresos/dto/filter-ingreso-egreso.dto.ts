import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";

/** Filtros del listado. Todos opcionales: sin ninguno se lista todo el rango. */
export class FilterIngresoEgresoDto {

    @IsOptional()
    @IsIn(['ingreso', 'egreso'])
    tipo?: 'ingreso' | 'egreso';

    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsString()
    proveedor_id?: string;

    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsString()
    sucursal_id?: string;

    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsString()
    fechaDesde?: string;

    @IsOptional()
    @IsString()
    fechaHasta?: string;

    @IsOptional()
    @IsString()
    busqueda?: string;

}
