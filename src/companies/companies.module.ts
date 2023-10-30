import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Email } from 'src/email/entities/email.entity';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    TypeOrmModule.forFeature([ Company, Email ])
  ],
  exports: [ CompaniesService ]
})
export class CompaniesModule {}
