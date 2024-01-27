import { Module } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';
import { MikrotikController } from './mikrotik.controller';

@Module({
  controllers: [MikrotikController],
  providers: [ MikrotikService ],
  exports: [ MikrotikModule, MikrotikService ]
})
export class MikrotikModule {}
