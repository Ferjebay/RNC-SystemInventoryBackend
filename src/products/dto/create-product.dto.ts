import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @IsOptional()
    @IsBoolean()
    aplicaIva: boolean;

    /** Tarifa de IVA del producto. Reemplaza al sí/no de `aplicaIva`. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    impuesto?: number;

    @IsString()
    @IsNotEmpty()
    codigoBarra: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    nombre: string;

    @IsString()
    tipo: string;

    @IsOptional()
    precio_compra: number;

    @IsOptional()
    pvp: number;

    @IsOptional()
    @IsNumber()
    stock: number;

    @IsInt()
    @Min(0)
    descuento: number;

    // ── ICE ────────────────────────────────────────────────────────────────
    // 'tarifa' = porcentaje · 'valor' = monto fijo · null = no aplica.
    @IsOptional()
    @IsIn(['tarifa', 'valor'], { message: 'El ICE debe ser tarifa o valor' })
    ice?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    valor_ice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    tipo_ice?: number;

}
