import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID, MinLength } from "class-validator";
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

    @IsNumber()
    establecimiento: number

    @IsNumber()
    punto_emision: number;

    @IsNumber()
    secuencia_factura_produccion: number;

    @IsNumber()
    secuencia_factura_pruebas?: number;

    @IsNumber()
    secuencia_retencion_produccion: number;

    @IsNumber()
    secuencia_retencion_pruebas?: number;

    @IsNumber()
    secuencia_nota_credito_produccion: number;

    @IsNumber()
    secuencia_nota_credito_pruebas?: number;

    @IsOptional()
    ambiente?: EnviromentType;

}
