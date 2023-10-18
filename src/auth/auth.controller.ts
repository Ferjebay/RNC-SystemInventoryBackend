import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata, Param, Patch, ParseUUIDPipe, ParseBoolPipe, Delete, DefaultValuePipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { UpdateUserDto } from './dto/edit-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('/find/:term')
  findOne(@Param('term') term: string) {
    return this.authService.findOne( term );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @Patch('/edit/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.authService.update(id, updateUserDto);
  }

  @Get('/users')
  findAll(
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.authService.findAll( estado );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove( id );
  }

}
