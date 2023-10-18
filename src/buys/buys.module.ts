import { Module } from '@nestjs/common';
import { BuysService } from './buys.service';
import { BuysController } from './buys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buy } from './entities/buy.entity';
import { BuyToProduct } from './entities/buyToProduct.entity';

@Module({
  controllers: [BuysController],
  providers: [BuysService],
  imports: [ TypeOrmModule.forFeature([ Buy, BuyToProduct ]) ]
})
export class BuysModule {}
