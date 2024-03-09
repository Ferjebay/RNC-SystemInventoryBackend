import { IsArray, IsString } from "class-validator";

export class UpdateProformaDto {

    @IsArray()    
    clausulas: { nombre: string, descripcion: string}[];

    @IsString()
    aceptacion_proforma: string;
    
}
