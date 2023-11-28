import { Module } from '@nestjs/common';
import { RedIpv4Service } from './red-ipv4.service';
import { RedIpv4Controller } from './red-ipv4.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedIpv4 } from './entities/red-ipv4.entity';

@Module({
  controllers: [RedIpv4Controller],
  imports: [ TypeOrmModule.forFeature([ RedIpv4 ]) ],
  providers: [RedIpv4Service],
})
export class RedIpv4Module {}
