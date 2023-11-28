import { PartialType } from '@nestjs/mapped-types';
import { CreateRedIpv4Dto } from './create-red-ipv4.dto';

export class UpdateRedIpv4Dto extends PartialType(CreateRedIpv4Dto) {}
