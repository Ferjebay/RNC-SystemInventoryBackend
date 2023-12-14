import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumberString, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

class Pago {

  @IsNotEmpty()
  @IsNumberString()  
  valor: string;

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

  @IsNotEmpty()
  @IsString()
  forma_pago: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Pago)
  pagos: Pago[];

  @IsOptional()
  estadoSRI: string;

}
