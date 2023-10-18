import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    TypeOrmModule.forFeature([ Company ])
  ],
  exports: [ CompaniesService ]
})
export class CompaniesModule {}
