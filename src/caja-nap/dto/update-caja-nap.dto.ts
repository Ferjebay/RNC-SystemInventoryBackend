import { PartialType } from '@nestjs/mapped-types';
import { CreateCajaNapDto } from './create-caja-nap.dto';

export class UpdateCajaNapDto extends PartialType(CreateCajaNapDto) {}
