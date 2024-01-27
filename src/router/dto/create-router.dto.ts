import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateRouterDto {
    
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    user_api: string;

    @IsNotEmpty()
    @IsString()
    tipo_router: string;

    @IsString()
    password_api: string;

    @IsNotEmpty()
    @IsString()
    ubicacion: string;

    @IsNotEmpty()
    puerto_api: number;

    @IsNotEmpty()
    @IsString()
    registro_trafico: string;

    @IsNotEmpty()
    @IsString()
    ip_host: string;

    @IsNotEmpty()
    @IsString()
    control_velocidad: string;

    @IsNotEmpty()
    @IsString()
    seguridad: string;

    @IsNotEmpty()
    @IsString()
    seguridad_alterna: string;
}
