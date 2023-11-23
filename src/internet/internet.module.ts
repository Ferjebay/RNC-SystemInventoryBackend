import { Module } from '@nestjs/common';
import { InternetService } from './internet.service';
import { InternetController } from './internet.controller';
import { Internet } from './entities/internet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [InternetController],
  imports: [ TypeOrmModule.forFeature([ Internet ]) ],
  providers: [InternetService],
})
export class InternetModule {}
