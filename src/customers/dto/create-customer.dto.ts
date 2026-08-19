import { IsIn, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {

  @IsString()
  nombres: string;

  @IsString()
  tipo_documento: string;

  @IsString()
  numero_documento: string;

  // Email, celular y dirección son opcionales: el SRI no los exige y hay
  // clientes de mostrador de los que solo se tiene la identificación. La
  // emisión ya sustituye la dirección vacía por 's/n' y omite el correo.
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsIn(['NATURAL', 'JURIDICA'], { message: 'El tipo de persona debe ser NATURAL o JURIDICA' })
  tipo_persona?: string;

}
