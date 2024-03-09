import { Module } from '@nestjs/common';
import { ProformaService } from './proforma.service';
import { ProformaController } from './proforma.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proforma } from './entities/proforma.entity';

@Module({
  controllers: [ProformaController],
  providers: [ProformaService],
  imports: [
    TypeOrmModule.forFeature([ Proforma ])
  ]
})
export class ProformaModule {}
