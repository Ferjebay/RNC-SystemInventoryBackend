import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    //trsnformar
    @Type( () => Number )
    limit?: number;

    @IsOptional()
    @Min(0)
    //trsnformar
    @Type( () => Number )
    offset?: number;

}
