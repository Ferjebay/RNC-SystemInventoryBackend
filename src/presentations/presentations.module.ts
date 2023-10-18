import { Module } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { PresentationsController } from './presentations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presentation } from './entities/presentation.entity';

@Module({
  controllers: [PresentationsController],
  providers: [PresentationsService],
  imports: [ 
    TypeOrmModule.forFeature([ Presentation ]) 
  ]
})
export class PresentationsModule {}
