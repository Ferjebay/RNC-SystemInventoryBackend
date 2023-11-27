import { Controller } from '@nestjs/common';
import { PuertosService } from './puertos.service';

@Controller('puertos')
export class PuertosController {
  constructor(private readonly puertosService: PuertosService) {}
}
