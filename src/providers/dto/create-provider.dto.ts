import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProviderDto {

    @IsString()
    @IsNotEmpty()
    razon_social: string;

    @IsString()
    @IsNotEmpty()
    tipo_documento: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(13)
    numero_documento: string

    // Celular, email y dirección son opcionales, igual que en clientes: de
    // muchos proveedores solo se tiene la razón social y el RUC.
    @IsOptional()
    @IsString()
    celular?: string

    @IsOptional()
    @IsString()
    email?: string

    @IsOptional()
    @IsString()
    direccion?: string

    @IsOptional()
    @IsString()
    observacion?: string

    @IsOptional()
    @IsIn(['NATURAL', 'JURIDICA'], { message: 'El tipo de persona debe ser NATURAL o JURIDICA' })
    tipo_persona?: string

}
