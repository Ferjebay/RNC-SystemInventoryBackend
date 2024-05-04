import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from "@nestjs/jwt";
import { isUUID } from 'class-validator';
import { UpdateUserDto } from './dto/edit-user.dto';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthServices');

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto, files: any = null) {
    const { password, foto_old, ...userData } = createUserDto;

    let infoUser = {
      ...userData,
      password: bcrypt.hashSync( password, 10 ),
      foto: files.foto ? files.foto[0].originalname : null,
      roles: JSON.parse( userData.roles ),
      sucursales: JSON.parse( userData.sucursales ),
      horarios_dias: JSON.parse( userData.horarios_dias ),
      horarios_time: JSON.parse( userData.horarios_time ),
      permisos: JSON.parse( userData.permisos ),
      isActive: JSON.parse( userData.isActive )
    }

    try {
      const user = this.userRepository.create({ ...infoUser });

      await this.userRepository.save( user );
      delete user.password

      return user;

    } catch (error) {
      this.handleDBErros( error )
    }
  }

  async findOne(term: string) {
    let user: User[];

    if ( isUUID(term) ) {
      user = await this.userRepository.find({
        relations: { company: true },
        where: { id: term }
      });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .where('UPPER(usuario) =:usuario', {
          usuario: term.toUpperCase()
        })
        .getMany();
    }

    if ( user.length === 0 )
      throw new NotFoundException(`user with ${ term } not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, files: any = null) {
    const { foto_old, ...rest } = updateUserDto;

    await this.findOne( id );

    if ( rest.password != 'undefined' )
      rest.password = bcrypt.hashSync( rest.password, 10 )
    else
      delete rest.password;

    try {
      await this.userRepository.update( id, {
        ...rest,
        roles: JSON.parse( rest.roles ),
        sucursales: JSON.parse( rest.sucursales ),
        horarios_dias: JSON.parse( rest.horarios_dias ),
        horarios_time: JSON.parse( rest.horarios_time ),
        permisos: JSON.parse( rest.permisos ),
        isActive: JSON.parse( rest.isActive ),
        foto: ( files && files.foto != null ) ? files.foto[0].originalname : foto_old
      });

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async findAll( estado: boolean, company_id: Company, rol_name: string ) {
    try {

      let option:any = { order: { created_at: "DESC" } }

      if ( estado ) option.where = { isActive: true };

      option.where = { company: { id: company_id } }

      return await this.userRepository.find(option);

    } catch (error) {
      this.handleDBErros( error )
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where:  { email },
      relations: { company: { sucursal: true } },
      select: {
        usuario: true,
        email: true,
        password: true,
        id: true,
        permisos: true,
        fullName: true,
        company: {
          id: true,
          nombre_comercial: true,
          razon_social: true,
          sucursal: { id: true },
          telefono: true
        },
        sucursales: true,
        roles: true,
        foto: true
      }
    })

    if ( !user )
      throw new UnauthorizedException('Credentials not valid(email)')

    if ( !bcrypt.compareSync( password.trim(), user.password) )
      throw new UnauthorizedException('Credentials not valid(password)')

    //Generar JWT
    const { password: ps, permisos, ...restUser } = user;

    return {
      permisos: user.permisos,
      token: this.getJwtToken({ ...restUser })
    };

  }

  private getJwtToken( payload: JwtPayload ){
    return this.jwtService.sign( payload );
  }

  async remove(id: string) {
    const user = await this.findOne( id );
    let msg: string;

    await this.userRepository.remove( user );
    msg = 'Eliminado Exitosamente'

    return { ok: true, msg };
  }

  private handleDBErros( error: any ){
    if ( error.code === '23505' )
       throw new BadRequestException( error.detail )

    console.log( error );

    throw new InternalServerErrorException('Please check logs error');
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
