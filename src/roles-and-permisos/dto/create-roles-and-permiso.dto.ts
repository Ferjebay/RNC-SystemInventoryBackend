import { IsArray, IsString, MinLength } from "class-validator";

export class CreateRolesAndPermisoDto {

  @IsString()
  @MinLength(3)
  nombre: string;

  @IsArray()
  @IsString({ each: true })
  permisos: string[];

}
