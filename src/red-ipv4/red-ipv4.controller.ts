import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe } from '@nestjs/common';
import { RedIpv4Service } from './red-ipv4.service';
import { CreateRedIpv4Dto } from './dto/create-red-ipv4.dto';
import { UpdateRedIpv4Dto } from './dto/update-red-ipv4.dto';
import { Router } from 'src/router/entities/router.entity';

@Controller('red-ipv4')
export class RedIpv4Controller {
  constructor(private readonly redIpv4Service: RedIpv4Service) {}

  @Post()
  create(@Body() createRedIpv4Dto: CreateRedIpv4Dto) {
    return this.redIpv4Service.create(createRedIpv4Dto);
  }

  @Get(':estado?')
  findAll(
    @Headers('router_id') router_id: Router,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.redIpv4Service.findAll( router_id, estado );
  }

  @Get('/find/:id')
  findOne(@Param('id') id: string) {
    return this.redIpv4Service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRedIpv4Dto: UpdateRedIpv4Dto) {
    return this.redIpv4Service.update(id, updateRedIpv4Dto);
  }

  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string, 
    @Param('estado', ParseBoolPipe) estado: boolean, 
    ) {
    return this.redIpv4Service.setEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.redIpv4Service.remove(id);
  }
}
