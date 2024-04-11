import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('/create')
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.create(createPagoDto);
  }

  @Get()
  findAll() {
    return this.pagosService.findAll();
  }

  @Get('/find/:term')
  findOne(@Param('term') term: string) {
    return this.pagosService.findOne( term );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers('sucursal-id') sucursal_id: Sucursal,
    @Body() updatePagoDto: UpdatePagoDto
    ) {
    return this.pagosService.update(id, updatePagoDto, sucursal_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagosService.remove(+id);
  }
}
