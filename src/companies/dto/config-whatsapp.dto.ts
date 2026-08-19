import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

/** Canal de WhatsApp de la empresa: interruptor y número de la sesión vinculada. */
export class ConfigWhatsappDto {

    @IsOptional()
    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    whatsapp_activo?: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    numero_whatsApp?: string;

}
