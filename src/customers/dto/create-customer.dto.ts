import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";
import { FacturaCliente } from "../entities/Facturacion.entity";
import { Router } from "src/router/entities/router.entity";
import { Internet } from "src/internet/entities/internet.entity";
import { RedIpv4 } from "src/red-ipv4/entities/red-ipv4.entity";
import { CajaNap } from "src/caja-nap/entities/caja-nap.entity";
import { Puerto } from "src/puertos/entities/puerto.entity";
import { ServicioCliente } from "../entities/ServicioCliente.entity";

class Cliente {
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
class Factura {
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @IsNotEmpty()
  @IsNumber()
  dia_pago: number;

  @IsNotEmpty()
  @IsString()
  crear_factura: string;

  @IsNotEmpty()
  @IsString()
  tipo_impuesto: string

  @IsNotEmpty()
  @IsString()
  dia_gracia: string

  @IsNotEmpty()
  @IsString()
  aplicar_corte: string;

  @IsNotEmpty()
  @IsArray()
  recordatorio_pago: string[];
}
class Servicio {

  @IsNotEmpty()
  @IsUUID()
  router_id: Router;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  coordenadas?: string;

  @IsNotEmpty()
  @IsUUID()
  perfil_internet: Internet;

  @IsNotEmpty()
  @IsNumberString()
  precio: string;

  @IsNotEmpty()
  @IsString()
  fecha_instalacion: string

  @IsOptional()
  @IsString()
  mac?: string;

  @IsNotEmpty()
  @IsUUID()
  red_id: RedIpv4

  @IsNotEmpty()
  @IsString()
  ipv4: string;

  @IsOptional()
  caja_id?: CajaNap;

  @IsOptional()
  puerto_id?:Puerto;
}

export class CreateCustomerDto {

    @IsObject()
    @ValidateNested()
    @Type(() => Cliente)
    cliente: object;

    @IsObject()
    @ValidateNested()
    @Type(() => Factura)
    facturacion: FacturaCliente;

    @IsObject()
    @ValidateNested()
    @Type(() => Servicio)
    servicio: ServicioCliente;
    
}
