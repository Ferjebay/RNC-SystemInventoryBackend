import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { IngresosEgresosService } from './ingresos-egresos.service';
import { CreateIngresoEgresoDto } from './dto/create-ingreso-egreso.dto';
import { UpdateIngresoEgresoDto } from './dto/update-ingreso-egreso.dto';
import { FilterIngresoEgresoDto } from './dto/filter-ingreso-egreso.dto';

@Controller('ingresos-egresos')
export class IngresosEgresosController {
  constructor(
    private readonly ingresosEgresosService: IngresosEgresosService
  ) {}

  @Post()
  create(
    @Headers('company-id') company_id: string,
    @Body() createDto: CreateIngresoEgresoDto
  ) {
    return this.ingresosEgresosService.create( createDto, company_id );
  }

  // Las rutas fijas van antes que `:id`, o `resumen` se tomaría como un id.
  @Get('resumen')
  getResumen(
    @Headers('company-id') company_id: string,
    @Query() filterDto: FilterIngresoEgresoDto
  ) {
    return this.ingresosEgresosService.getResumen( filterDto, company_id );
  }

  @Get('estadisticas-anuales')
  getEstadisticas(
    @Headers('company-id') company_id: string,
    @Query('anio', new DefaultValuePipe( new Date().getFullYear() ), ParseIntPipe) anio: number
  ) {
    return this.ingresosEgresosService.getEstadisticasAnuales( anio, company_id );
  }

  @Get('formas-pago')
  getFormasPago() {
    return this.ingresosEgresosService.getFormasPago();
  }

  @Get('download/excel')
  async downloadExcel(
    @Headers('company-id') company_id: string,
    @Query() filterDto: FilterIngresoEgresoDto,
    @Res() res: Response
  ) {
    const buffer = await this.ingresosEgresosService.downloadExcel( filterDto, company_id );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="ingresos-egresos.xlsx"');

    res.send( buffer );
  }

  @Get()
  findAll(
    @Headers('company-id') company_id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query() filterDto: FilterIngresoEgresoDto
  ) {
    return this.ingresosEgresosService.findAll( { page, limit }, filterDto, company_id );
  }

  @Get(':id')
  findOne(
    @Headers('company-id') company_id: string,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.ingresosEgresosService.findOne( id, company_id );
  }

  @Patch(':id')
  update(
    @Headers('company-id') company_id: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateIngresoEgresoDto
  ) {
    return this.ingresosEgresosService.update( id, updateDto, company_id );
  }

  @Delete(':id')
  remove(
    @Headers('company-id') company_id: string,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.ingresosEgresosService.remove( id, company_id );
  }

}
