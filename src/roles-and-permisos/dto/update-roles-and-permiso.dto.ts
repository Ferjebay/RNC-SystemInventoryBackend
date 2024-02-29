import { PartialType } from '@nestjs/mapped-types';
import { CreateRolesAndPermisoDto } from './create-roles-and-permiso.dto';

export class UpdateRolesAndPermisoDto extends PartialType(CreateRolesAndPermisoDto) {}
