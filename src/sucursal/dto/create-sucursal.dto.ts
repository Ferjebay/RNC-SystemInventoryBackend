import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID, MinLength } from "class-validator";
import { Company } from "src/companies/entities/company.entity";
import { EnviromentType } from "../entities/sucursal.entity";

export class CreateSucursalDto {
    
    @IsOptional()
    @IsUUID()
    company_id?: Company;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    direccion: string;

    @IsNumberString()
    establecimiento: number

    @IsNumberString()
    punto_emision: number;

    @IsNumberString()
    secuencia_factura_produccion: number;

    @IsOptional()
    secuencia_factura_pruebas?: number;

    @IsNumberString()
    secuencia_nota_credito_produccion: number;

    @IsOptional()
    secuencia_nota_credito_pruebas?: number;

    @IsOptional()
    ambiente?: EnviromentType;

}
