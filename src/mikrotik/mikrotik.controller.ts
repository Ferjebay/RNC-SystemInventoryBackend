import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';

@Controller('mikrotik')
export class MikrotikController {
  constructor(private readonly mikrotikService: MikrotikService) {}


  @Post()
  async getIp( @Body() formMikrotik: any) {

    const RouterOSAPI = require("node-routeros").RouterOSAPI;
    const conn = new RouterOSAPI({
      host: formMikrotik.ip,
      user: formMikrotik.login,
      password: formMikrotik.password,
      keepalive: true
    });

    try {

      await conn.connect();
      const data = await conn.write('/ip/address/print');      
      return data;      

    } catch (error) {
      throw new BadRequestException(error);
    }  
  }
}
