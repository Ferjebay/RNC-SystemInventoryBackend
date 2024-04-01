import { Controller, Post, Body } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('/')
  async getIp(
    @Body('company_id') company_id: string,
    @Body('modo') modo: string,
    @Body('mes') mes: string,
    @Body('sucursal_id') sucursal_id: string
  ){
    return await this.dashboardService.dataDashboard(company_id, modo, mes, sucursal_id);
  }
}
