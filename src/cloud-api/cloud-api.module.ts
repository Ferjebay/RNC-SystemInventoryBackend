import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudApiService } from './cloud-api.service';
import { CloudApiController } from './cloud-api.controller';
import { Company } from 'src/companies/entities/company.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ Company ]) ],
  controllers: [ CloudApiController ],
  providers: [ CloudApiService ],
  exports: [ CloudApiService ]
})
export class CloudApiModule {}
