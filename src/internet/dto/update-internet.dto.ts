import { PartialType } from '@nestjs/mapped-types';
import { CreateInternetDto } from './create-internet.dto';

export class UpdateInternetDto extends PartialType(CreateInternetDto) {}
