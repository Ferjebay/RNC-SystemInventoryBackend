import { Body, Controller, Get, Headers, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CloudApiService } from './cloud-api.service';
import { SaveCredentialsDto } from './dto/save-credentials.dto';

@Controller('cloud-api')
export class CloudApiController {
  constructor(
    private readonly cloudApiService: CloudApiService
  ) {}

  @Get('config')
  getConfig(@Headers('company-id') company_id: string) {
    return this.cloudApiService.getConfig( company_id );
  }

  @Get('verify')
  verify(@Headers('company-id') company_id: string) {
    return this.cloudApiService.verifyCredentials( company_id );
  }

  @Get('templates')
  templates(@Headers('company-id') company_id: string) {
    return this.cloudApiService.listTemplates( company_id );
  }

  @Post('credentials/:id')
  saveCredentials(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() saveCredentialsDto: SaveCredentialsDto
  ) {
    return this.cloudApiService.saveCredentials( id, saveCredentialsDto );
  }

  @Post('clear/:id')
  clear(@Param('id', ParseUUIDPipe) id: string) {
    return this.cloudApiService.clearCredentials( id );
  }

}
