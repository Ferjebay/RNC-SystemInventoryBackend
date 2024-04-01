import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolesAndPermisoDto } from './dto/create-roles-and-permiso.dto';
import { UpdateRolesAndPermisoDto } from './dto/update-roles-and-permiso.dto';
import { RolAndPermiso } from './entities/roles-and-permiso.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class RolesAndPermisosService {

  private readonly logger = new Logger('RolesAndPermisos');

  constructor(
    @InjectRepository(RolAndPermiso)
    private readonly roleAndPermisoRepository: Repository<RolAndPermiso>
  ){}

  async create(createRolesAndPermisoDto: CreateRolesAndPermisoDto) {
    try {
      const rol = this.roleAndPermisoRepository.create( createRolesAndPermisoDto );

      await this.roleAndPermisoRepository.save( rol );

      return rol;
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findAll() {
    return await this.roleAndPermisoRepository.find({});
  }

  async findOne(id: string) {
    let rol: RolAndPermiso;

    if ( isUUID( id ) )
      rol = await this.roleAndPermisoRepository.findOneBy({ id });

    if ( !rol )
      throw new NotFoundException(`rol with ${ id } not found`);

    return rol;
  }

  async update(id: string, updateRolesAndPermisoDto: UpdateRolesAndPermisoDto) {
    await this.findOne( id );

    try {
      await this.roleAndPermisoRepository.update( id, updateRolesAndPermisoDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async remove(id: string) {
    const user = await this.findOne( id );

    await this.roleAndPermisoRepository.remove( user );

    return { ok: true, msg: 'Registro eliminado exitosamente' };
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
