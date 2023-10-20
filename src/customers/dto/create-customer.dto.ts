import { IsEmail, IsNotEmpty, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCustomerDto {

    @IsString()
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    tipo_documento: string;

    @IsNotEmpty()
    @IsNumberString()
    @MinLength(5)
    @MaxLength(13)
    numero_documento: string;

    @IsNotEmpty()
    @IsNumberString()
    @MinLength(5)
    @MaxLength(10)
    celular: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    direccion: string
}
