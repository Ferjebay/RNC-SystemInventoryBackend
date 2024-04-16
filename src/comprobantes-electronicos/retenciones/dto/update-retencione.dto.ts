import { PartialType } from '@nestjs/mapped-types';
import { CreateRetencioneDto } from './create-retencione.dto';

export class UpdateRetencioneDto extends PartialType(CreateRetencioneDto) {}
