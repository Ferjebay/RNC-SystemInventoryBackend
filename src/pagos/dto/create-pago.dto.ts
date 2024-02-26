import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumberString, IsObject, IsOptional, IsString, IsUUID, ValidateNested, isUUID } from "class-validator";
import { ServicioCliente } from "src/customers/entities/ServicioCliente.entity";

class Pago {

  @IsNotEmpty()
  @IsNumberString()  
  valor: string;

  @IsNotEmpty()
  @IsNumberString()  
  monto_pendiente: string;

  @IsNotEmpty()
  @IsNumberString()  
  totalAbonado: string;

  @IsNotEmpty()
  @IsString()
  fecha_abono: string;

  @IsNotEmpty()
  @IsString()
  hora_abono: string;

  @IsOptional()
  detalle?: string;

  @IsOptional()
  n_transaccion: string;

  @IsNotEmpty()
  @IsString()
  forma_pago: string;

}

export class CreatePagoDto {

  @IsOptional()
  @IsString()
  forma_pago: string;

  @IsOptional()
  @IsString()
  dia_pago: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Pago)
  pagos: Pago[];

  @IsOptional()
  estadoSRI: string;

  @IsUUID()
  servicio: ServicioCliente
}
