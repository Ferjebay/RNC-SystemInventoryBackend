import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

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

}