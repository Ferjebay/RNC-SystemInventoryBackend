import { Controller, Post, Param, Res } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';
import { Response } from 'express';

@Controller('mikrotik')
export class MikrotikController {
  constructor(private readonly mikrotikService: MikrotikService) {}

  @Post('/reparar-router/:router_id')
  async getIp( @Param('router_id') router_id: string ){
    return await this.mikrotikService.repararRouter( router_id );
  }
  
  @Post('/download-clients-excel/:router_id')
  async downloadClientsToExcel(
    @Param('router_id') router_id: string,
    @Res() res: Response  
  ){
    const file = await this.mikrotikService.downloadClientsToExcel( router_id );
    res.setHeader('Content-Disposition', 'attachment; filename=ejemplo.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
    res.send( file );
  }
}
