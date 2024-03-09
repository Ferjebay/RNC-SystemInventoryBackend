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
import { CompaniesService } from 'src/companies/companies.service';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { Company } from 'src/companies/entities/company.entity';
import { SucursalService } from 'src/sucursal/sucursal.service';
import { CreateSucursalDto } from 'src/sucursal/dto/create-sucursal.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthServices');

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly companyService: CompaniesService,
    private readonly sucursalService: SucursalService
  ){}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    let infoUser = {
      ...userData,
      roles: userData.roles,
      password: bcrypt.hashSync( password, 10 )
    }

    try {
      const user = this.userRepository.create( infoUser );

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

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne( id );
    
    if ( updateUserDto.password ) 
      updateUserDto.password = bcrypt.hashSync( updateUserDto.password, 10 )

    try {
      await this.userRepository.update( id, updateUserDto );

      return {
        ok: true,
        msg: "Registro actualizado exitosamente"
      };      

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async findAll( estado: boolean ) {
    try {
      let option:any = { order: { created_at: "DESC" } }

      if ( estado ) option.where = { isActive: true };

      return this.userRepository.find( option );
      
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
        email: true, 
        password: true, 
        id: true, 
        permisos: true,
        fullName: true,
        company: { id: true, sucursal: { id: true } },
        sucursales: true,
        roles: true
      }
    })

    if ( !user ) 
      throw new UnauthorizedException('Credentials not valid(email)')
    
    if ( !bcrypt.compareSync( password, user.password) ) 
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
