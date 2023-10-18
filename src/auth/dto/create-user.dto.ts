import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";
import { Company } from "src/companies/entities/company.entity";


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    company: Company;

    @IsArray()
    @IsString({ each: true })
    sucursales: string[];

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
    @IsString()
    twitter?: string;

    // @IsArray()
    @IsString({ each: true })
    roles: string[];

    @IsArray()
    @IsString({ each: true })
    permisos: string[];
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    horarios_dias?: string[];
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    horarios_time?: string[];

    @IsBoolean()
    receiveSupportEmail: boolean;

    @IsBoolean()
    isActive: boolean;
}