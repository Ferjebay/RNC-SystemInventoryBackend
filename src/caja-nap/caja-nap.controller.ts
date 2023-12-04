import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe } from '@nestjs/common';
import { CajaNapService } from './caja-nap.service';
import { CreateCajaNapDto } from './dto/create-caja-nap.dto';
import { UpdateCajaNapDto } from './dto/update-caja-nap.dto';
import { Router } from 'src/router/entities/router.entity';

@Controller('caja-nap')
export class CajaNapController {
  constructor(private readonly cajaNapService: CajaNapService) {}

  @Post()
  create(
    @Body() createCajaNapDto: CreateCajaNapDto
  ) {
    return this.cajaNapService.create( createCajaNapDto );
  }

  @Get()
  findAll(
    @Headers('router_id') router_id: Router,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ){
    return this.cajaNapService.findAll( router_id, estado  );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cajaNapService.findOne( id );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCajaNapDto: UpdateCajaNapDto) {
    return this.cajaNapService.update(id, updateCajaNapDto);
  }

  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('estado', ParseBoolPipe) estado: boolean, 
    ) {
    return this.cajaNapService.setEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cajaNapService.remove(id);
  }
}
