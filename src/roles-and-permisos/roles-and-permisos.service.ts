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
    const rol = await this.findOne( id );

    this.protegerSuperAdministrador( rol, 'modificar' );

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

    this.protegerSuperAdministrador( user, 'eliminar' );

    await this.roleAndPermisoRepository.remove( user );

    return { ok: true, msg: 'Registro eliminado exitosamente' };
  }

  /**
   * El SUPER-ADMINISTRADOR tiene todos los permisos por definición y es el único
   * rol capaz de administrar los demás: quitarle permisos o borrarlo deja el
   * sistema sin quién lo gobierne. El front lo bloquea, pero eso solo esconde el
   * botón; la garantía tiene que estar acá.
   */
  private protegerSuperAdministrador( rol: RolAndPermiso, accion: string ) {
    if ( rol?.nombre === 'SUPER-ADMINISTRADOR' )
      throw new BadRequestException(
        `El rol SUPER-ADMINISTRADOR no se puede ${ accion }: tiene todos los permisos de forma permanente.`
      );
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
