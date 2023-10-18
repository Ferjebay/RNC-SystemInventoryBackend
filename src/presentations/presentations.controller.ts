import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';

@Controller('presentations')
export class PresentationsController {
  constructor(private readonly presentationsService: PresentationsService) {}

  @Post()
  create(@Body() createPresentationDto: CreatePresentationDto) {
    return this.presentationsService.create(createPresentationDto);
  }

  @Get(':estado?')
  findAll( 
    @Param('estado', new DefaultValuePipe( false ), ParseBoolPipe) estado: boolean 
    ) {
    return this.presentationsService.findAll( estado );
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.presentationsService.findOne( term );
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updatePresentationDto: UpdatePresentationDto ) {
    return this.presentationsService.update(id, updatePresentationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.presentationsService.remove( id );
  }
}
