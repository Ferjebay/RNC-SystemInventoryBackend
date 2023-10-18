import { IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateInvoiceElectronicDto {

    @IsNotEmpty()
    @IsNumberString()
    @MinLength(13)
    @MaxLength(13)
    ruc: string;

    @IsNotEmpty()
    @IsString()
    nombre_comercial: string;

    @IsNotEmpty()
    @IsString()
    razon_social: string;

    @IsNotEmpty()
    @IsString()
    clave_certificado: string;

    @IsNotEmpty()
    @IsString()
    direccion_matriz: string;

    @IsBoolean()
    obligado_contabilidad: boolean;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumberString()
    @MinLength(5)
    @MaxLength(10)
    celular: string;

}
