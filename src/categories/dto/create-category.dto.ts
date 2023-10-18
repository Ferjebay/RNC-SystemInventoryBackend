import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {    

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    descripcion: string;

}
