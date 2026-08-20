import { PartialType } from '@nestjs/mapped-types';
import { CreateIngresoEgresoDto } from './create-ingreso-egreso.dto';

export class UpdateIngresoEgresoDto extends PartialType(CreateIngresoEgresoDto) {}
