import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Router } from "src/router/entities/router.entity";

export class CreateCajaNapDto {

    @IsNotEmpty()
    @IsUUID()
    router_id: Router;

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
