import { Module } from '@nestjs/common';
import { RolesAndPermisosService } from './roles-and-permisos.service';
import { RolesAndPermisosController } from './roles-and-permisos.controller';
import { RolAndPermiso } from './entities/roles-and-permiso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RolesAndPermisosController],
  providers: [RolesAndPermisosService],
  imports: [ TypeOrmModule.forFeature([ RolAndPermiso ]) ]
})
export class RolesAndPermisosModule {}
