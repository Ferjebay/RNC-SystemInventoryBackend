import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { RetencionesService } from './retenciones.service';
import { CreateRetencioneDto } from './dto/create-retencione.dto';
import { UpdateRetencioneDto } from './dto/update-retencione.dto';

@Controller('retenciones')
export class RetencionesController {
  constructor(private readonly retencionesService: RetencionesService) {}

  @Get('getNumRetencion')
  getNumComprobante(
    @Headers('sucursal-id') sucursal_id: string,
  ) {
    return this.retencionesService.getNumComprobante( sucursal_id );
  }

  @Post('generar-retencion')
  anularFactura(
    @Body() retencion: any
  ) {
    return this.retencionesService.generarRetencion( retencion );
  }

  @Post()
  create(@Body() createRetencioneDto: CreateRetencioneDto) {
    return this.retencionesService.create(createRetencioneDto);
  }

  @Get()
  findAll() {
    return this.retencionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retencionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRetencioneDto: UpdateRetencioneDto) {
    return this.retencionesService.update(+id, updateRetencioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.retencionesService.remove(+id);
  }
}
