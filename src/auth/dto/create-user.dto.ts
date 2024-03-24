import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsBooleanString, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";
import { Company } from "src/companies/entities/company.entity";


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    company: Company;

    @IsString()
    sucursales: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    // @Matches(
    //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'The password must have a Uppercase, lowercase letter and a number'
    // })
    password: string;

    @IsString()
    @MinLength(1)
    usuario: string;

    @IsString()
    @MinLength(1)
    fullName: string;

    // @IsNumberString()
    // @MinLength(10)
    // cedula: string;

    @IsString()
    @MinLength(10)
    celular: string;

    @IsOptional()
    @IsString()
    facebook?: string;

    @IsOptional()
    foto?: any;

    @IsOptional()
    foto_old?: string;

    @IsOptional()
    @IsString()
    twitter?: string;

    // @IsArray()
    @IsString()
    roles: string;

    @IsString()
    permisos: string;

    @IsOptional()
    @IsString()
    horarios_dias?: string;

    @IsOptional()
    @IsString()
    horarios_time?: string;

    @IsBooleanString()
    receiveSupportEmail: boolean;

    @IsBooleanString()
    isActive: string;
}