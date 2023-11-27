import { Module } from '@nestjs/common';
import { CajaNapService } from './caja-nap.service';
import { CajaNapController } from './caja-nap.controller';
import { CajaNap } from './entities/caja-nap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puerto } from 'src/puertos/entities/puerto.entity';

@Module({
  controllers: [CajaNapController],
  imports: [ TypeOrmModule.forFeature([ CajaNap, Puerto ]) ],
  providers: [CajaNapService],
})
export class CajaNapModule {}
