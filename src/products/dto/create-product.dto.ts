import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsPositive, IsString, Min, MinLength } from "class-validator";

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

    @IsNumberString()
    precio_compra: number;

    @IsNumberString()
    pvp: number;

    @IsNumber()
    stock: number;

    @IsInt()
    @Min(0)
    descuento: number;
}
