import { IsArray, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateProformaDto {

    // @IsString()
    // @IsNotEmpty()
    // @MinLength(5)
    // nombre: string;

    // @IsString()
    // @IsNotEmpty()
    // @MinLength(5)
    // descripcion: string;

    @IsArray()
    clausulas: { nombre: string, descripcion: string }[];

    @IsString()
    aceptacion_proforma?: string;
    
}
