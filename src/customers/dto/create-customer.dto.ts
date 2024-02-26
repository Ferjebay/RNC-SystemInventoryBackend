import { IsString } from "class-validator";

export class CreateCustomerDto {

  @IsString()
  nombres: string;

  @IsString()
  tipo_documento: string;

  @IsString()
  numero_documento: string;

  @IsString()
  email: string;

  @IsString()
  celular: string;

  @IsString()
  direccion: string;

}