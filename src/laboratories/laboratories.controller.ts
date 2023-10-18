import { Controller, Get, Post, Body, Patch, Param, Delete, ParseBoolPipe, DefaultValuePipe, ParseUUIDPipe } from '@nestjs/common';
import { LaboratoriesService } from './laboratories.service';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';

@Controller('laboratories')
export class LaboratoriesController {
  constructor(private readonly laboratoriesService: LaboratoriesService) {}

  @Post()
  create(@Body() createLaboratoryDto: CreateLaboratoryDto) {
    return this.laboratoriesService.create(createLaboratoryDto);
  }

  @Get(':estado?')
  findAll(
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
  ) {
    return this.laboratoriesService.findAll( estado );
  }

  @Get('/find/:term')
  findOne(@Param('term') term: string) {
    return this.laboratoriesService.findOne( term );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateLaboratoryDto: UpdateLaboratoryDto
  ) {
    return this.laboratoriesService.update(id, updateLaboratoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratoriesService.remove(id);
  }
}
