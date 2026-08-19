import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Credenciales del canal oficial (WhatsApp Cloud API). Todos los campos son
 * opcionales para poder guardar por partes: el panel envía solo lo que cambió.
 */
export class SaveCredentialsDto {

    @IsOptional()
    @IsString()
    @MaxLength(50)
    phoneNumberId?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    wabaId?: string;

    @IsOptional()
    @IsString()
    accessToken?: string;

    @IsOptional()
    @IsIn(['baileys', 'cloud_api'])
    wa_provider?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    templateFactura?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    templateProforma?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    templateIdioma?: string;

}
