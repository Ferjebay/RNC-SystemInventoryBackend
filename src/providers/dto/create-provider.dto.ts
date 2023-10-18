import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

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

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(10)
    celular: string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    email: string

    @IsString()
    @IsNotEmpty()
    provincia: string

    @IsString()
    @IsNotEmpty()
    ciudad: string

    @IsString()
    @IsNotEmpty()
    direccion: string

}
