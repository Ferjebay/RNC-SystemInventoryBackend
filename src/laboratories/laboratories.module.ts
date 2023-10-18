import { Module } from '@nestjs/common';
import { LaboratoriesService } from './laboratories.service';
import { LaboratoriesController } from './laboratories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from './entities/laboratory.entity';

@Module({
  controllers: [LaboratoriesController],
  providers: [LaboratoriesService],
  imports: [ 
    TypeOrmModule.forFeature([ Laboratory ]) 
  ]
})
export class LaboratoriesModule {}
