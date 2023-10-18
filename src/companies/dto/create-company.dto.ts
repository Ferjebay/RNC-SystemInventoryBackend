import { IsBoolean, IsBooleanString, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCompanyDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    razon_social: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    nombre_comercial: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    direccion_matriz: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(13)
    @MaxLength(13)
    ruc: string;

    @IsOptional()
    @IsString()
    propietario?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    telefono: string;

    @IsOptional()
    logo?: any;

    @IsOptional()
    logo_old?: string;

    @IsNotEmpty()
    @IsString()
    clave_certificado: string;

    @IsOptional()
    archivo_certificado?: any;

    @IsString()
    archivo_certificado_old?: string;

    @IsBooleanString()
    obligado_contabilidad: boolean;

}
