import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Router } from "src/router/entities/router.entity";

export class CreateRedIpv4Dto {

    @IsNotEmpty()
    @IsUUID()
    router_id: Router;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    red: string;

    @IsNotEmpty()
    @IsString()
    cidr: string;

    @IsNotEmpty()
    @IsString()
    tipo_uso: string;

}
