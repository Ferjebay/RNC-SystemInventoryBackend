import { Transform, Type } from "class-transformer";
import {
    IsDateString,
    IsEnum,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min
} from "class-validator";
import { FormaPago } from "../enums/forma-pago.enum";

export class CreateIngresoEgresoDto {

    @IsIn(['ingreso', 'egreso'], { message: 'El tipo debe ser ingreso o egreso' })
    tipo: 'ingreso' | 'egreso';

    @IsString()
    @MaxLength(255)
    referencia: string;

    // El front puede mandar el monto como texto desde un input: se convierte
    // antes de validar en vez de exigirle el tipo al cliente.
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto debe ser un número' })
    @Min(0, { message: 'El monto no puede ser negativo' })
    monto: number;

    // @IsOptional() deja pasar undefined y null, pero NO la cadena vacía: un
    // campo que el usuario dejó en blanco llegaba como '' y se rechazaba. Se
    // normaliza antes de validar y el servicio le pone la fecha de hoy.
    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD' })
    fecha?: string;

    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsEnum(FormaPago, { message: 'Forma de pago no válida' })
    forma_pago?: FormaPago;

    @IsOptional()
    @IsString()
    descripcion?: string;

    // Los selects vacíos llegan como '' o null: se normalizan a undefined para
    // que TypeORM guarde NULL en la relación en vez de reventar con un uuid ''.
    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsUUID('4', { message: 'Proveedor no válido' })
    proveedor_id?: string;

    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsUUID('4', { message: 'Sucursal no válida' })
    sucursal_id?: string;

    @IsOptional()
    @Transform(({ value }) => value || undefined)
    @IsUUID('4', { message: 'Usuario no válido' })
    user_id?: string;

}
