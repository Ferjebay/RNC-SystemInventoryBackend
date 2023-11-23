import { Module } from '@nestjs/common';
import { RouterService } from './router.service';
import { RouterController } from './router.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Router } from './entities/router.entity';

@Module({
  controllers: [RouterController],
  imports: [ TypeOrmModule.forFeature([ Router ]) ],
  providers: [RouterService],
})
export class RouterModule {}
