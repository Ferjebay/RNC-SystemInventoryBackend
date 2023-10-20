import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEmailDto {

    @IsString()
    host: string;

    @IsString()
    usuario: string;
    
    @IsNumber()
    puerto: number;
    
    @IsString()
    password: string;

    @IsOptional()
    email_client: string;

}
