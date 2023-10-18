import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreatePresentationDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    nombre: string;

}
