import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID, isNumber } from "class-validator";
import { Router } from "src/router/entities/router.entity";

export class CreateInternetDto {

    @IsNotEmpty()
    @IsUUID()
    router_id: Router;

    @IsNotEmpty()
    @IsString()
    nombre_plan: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsNumberString()
    precio_plan: number;

    @IsNotEmpty()
    impuesto: number

    @IsNotEmpty()
    descarga_Mbps: number;

    @IsNotEmpty()
    subida_Mbps: number;

    @IsOptional()
    limit_at: number

    @IsOptional()
    burst_limit: number;

    @IsNotEmpty()
    @IsNumber()
    prioridad: number

    @IsNotEmpty()
    @IsString()
    address_list: string;

}
