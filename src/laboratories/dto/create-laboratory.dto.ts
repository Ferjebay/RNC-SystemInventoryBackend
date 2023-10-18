import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateLaboratoryDto {
    
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    nombre: string;
    
}
