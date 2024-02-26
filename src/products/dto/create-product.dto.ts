import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @IsBoolean()
    aplicaIva: boolean;

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

    @IsNumber()
    stock: number;

    @IsInt()
    @Min(0)
    descuento: number;
}
