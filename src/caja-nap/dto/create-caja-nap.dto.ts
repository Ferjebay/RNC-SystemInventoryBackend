import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCajaNapDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    coordenadas: string;

    @IsNotEmpty()
    ubicacion: string;

    @IsOptional()
    puertos?: string;

    @IsOptional()
    detalles?: string;
    
}
