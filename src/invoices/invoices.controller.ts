import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  DefaultValuePipe,
  Res,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Sucursal } from 'src/sucursal/entities/sucursal.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Response } from 'express';
import { Invoice } from './entities/invoice.entity';
import { Company } from 'src/companies/entities/company.entity';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(
    @Headers('sucursal-id') sucursal_id: Sucursal,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return await this.invoicesService.create(createInvoiceDto, sucursal_id);
  }

  @Get()
  async findAll(
    @Headers('tipo') tipo: string,
    @Headers('desde') desde: string,
    @Headers('hasta') hasta: string,
    @Headers('sucursal-id') sucursal_id: string,
    @Headers('company-id') company_id: Company,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe ) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    @Query('busqueda' ) busqueda: string
  ): Promise<Pagination<Invoice>> {
    return await this.invoicesService.findAll({
      page,
      limit,
      route: `${ process.env.HOST_API }/invoices`,
    }, tipo, sucursal_id, desde, hasta, busqueda, company_id);
  }

  @Post('/download-comprobantes')
  async downloadComprobantes(
    @Body('desde') desde: string,
    @Body('hasta') hasta: string,
    @Body('sucursal_id') sucursal_id: string,
    @Res() res: Response
  ) {
    const file = await this.invoicesService.downloadComprobantes( sucursal_id, desde, hasta );

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="archivos.zip"');

    res.send( file );
  }

  @Post('/download-ride-xml')
  async downloadRideXml(
    @Body('clave_acceso') clave_acceso: string,
    @Body('tipo_documento') tipo_documento: string,
    @Body('razon_social') razon_social: string,
    @Res() res: Response
  ) {
    const file = await this.invoicesService.downloadRideXml( clave_acceso, tipo_documento, razon_social );

    if ( tipo_documento == 'ride' )
      res.setHeader('Content-Type', 'application/pdf');
    else
      res.setHeader('Content-Type', 'application/xml');

    res.setHeader('Content-Disposition', `attachment; filename="comprobante.${ tipo_documento == 'ride' ? 'pdf' : 'xml' }"`);

    res.send( file );
  }

  @Get('/filterInvoice/:id')
  async findOne(@Param('id') id: string) {
    return await this.invoicesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return await this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.invoicesService.remove(id);
  }
}
