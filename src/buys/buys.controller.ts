import {
  Controller, Get,
  Post, Body,
  Patch, Param,
  Delete, DefaultValuePipe,
  ParseBoolPipe, ParseUUIDPipe, Headers
} from '@nestjs/common';
import { BuysService } from './buys.service';
import { CreateBuyDto } from './dto/create-buy.dto';
import { UpdateBuyDto } from './dto/update-buy.dto';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';

@Controller('buys')
export class BuysController {
  constructor(private readonly buysService: BuysService) {}

  @Post()
  async create(
    @Headers('sucursal_id') sucursal_id: Sucursal,
    @Body() createBuyDto: CreateBuyDto
  ) {
    return await this.buysService.create(createBuyDto, sucursal_id);
  }

  @Get(':estado?')
  async findAll(
    @Headers('tipo') tipo: string | boolean,
    @Headers('sucursal_id') sucursal_id: Sucursal,
    @Headers('desde') desde: string,
    @Headers('hasta') hasta: string,
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean
  ) {
    return await this.buysService.findAll( estado, sucursal_id, desde, hasta, tipo );
  }

  @Get('/find/:term')
  async findOne(@Param('term') term: string) {
    return await this.buysService.findOne( term );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBuyDto: UpdateBuyDto
  ) {
    return await this.buysService.update(id, updateBuyDto);
  }

  @Patch(':id/:estado')
  async setEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('estado', ParseBoolPipe) estado: boolean,
  ){
    return await this.buysService.setEstado(id, estado);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.buysService.remove( id );
  }
}
