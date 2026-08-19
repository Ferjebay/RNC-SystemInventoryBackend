import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateEmailDto {

    @IsString()
    host: string;

    @IsString()
    usuario: string;
    
    @IsNotEmpty()
    puerto: number;
    
    @IsString()
    password: string;

    @IsString()
    seguridad: string;

    @IsString()
    empresa: string;

    @IsOptional()
    email_client: string;

    @IsOptional()
    id: string;

    // El front manda un booleano JSON. Se transforma por si algún cliente lo
    // envía como texto: sin esto un "false" string entraría como true.
    @IsOptional()
    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    activo?: boolean;

}