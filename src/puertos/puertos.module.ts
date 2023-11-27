import { Module } from '@nestjs/common';
import { PuertosService } from './puertos.service';
import { PuertosController } from './puertos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puerto } from './entities/puerto.entity';

@Module({
  controllers: [PuertosController],
  imports: [ TypeOrmModule.forFeature([ Puerto ]) ],
  providers: [PuertosService],
})
export class PuertosModule {}
