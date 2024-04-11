import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, DefaultValuePipe, ParseBoolPipe, ParseUUIDPipe } from '@nestjs/common';
import { RouterService } from './router.service';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';
import { Company } from 'src/companies/entities/company.entity';

@Controller('router')
export class RouterController {
  constructor(private readonly routerService: RouterService) {}

  @Post()
  create(
    @Headers('company-id') company_id: Company,
    @Body() createRouterDto: CreateRouterDto
  ){
    return this.routerService.create(createRouterDto, company_id);
  }

  @Get(':estado?')
  findAll(
    @Headers('company-id') company_id: Company,
    @Headers('rol-name') rol_name: string,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean
  ){
    return this.routerService.findAll( company_id, rol_name, estado );
  }

  @Get('/find/:id')
  findOne(@Param('id') id: string) {
    return this.routerService.findOne(id, 'busqueda');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouterDto: UpdateRouterDto) {
    return this.routerService.update(id, updateRouterDto);
  }

  @Patch(':id/:estado')
  setEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estado', ParseBoolPipe) estado: boolean,
    ) {
    return this.routerService.setEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.routerService.remove(id);
  }
}
