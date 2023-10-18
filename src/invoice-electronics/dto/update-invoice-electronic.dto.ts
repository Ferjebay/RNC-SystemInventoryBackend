import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceElectronicDto } from './create-invoice-electronic.dto';

export class UpdateInvoiceElectronicDto extends PartialType(CreateInvoiceElectronicDto) {}
