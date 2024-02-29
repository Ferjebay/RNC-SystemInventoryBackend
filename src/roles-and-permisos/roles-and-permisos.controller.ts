import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesAndPermisosService } from './roles-and-permisos.service';
import { CreateRolesAndPermisoDto } from './dto/create-roles-and-permiso.dto';
import { UpdateRolesAndPermisoDto } from './dto/update-roles-and-permiso.dto';

@Controller('roles-and-permisos')
export class RolesAndPermisosController {
  constructor(private readonly rolesAndPermisosService: RolesAndPermisosService) {}

  @Post()
  create(@Body() createRolesAndPermisoDto: CreateRolesAndPermisoDto) {
    return this.rolesAndPermisosService.create(createRolesAndPermisoDto);
  }

  @Get()
  findAll() {
    return this.rolesAndPermisosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesAndPermisosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolesAndPermisoDto: UpdateRolesAndPermisoDto) {
    return this.rolesAndPermisosService.update(id, updateRolesAndPermisoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesAndPermisosService.remove(id);
  }
}
