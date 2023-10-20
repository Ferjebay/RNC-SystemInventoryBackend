import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('testing')
  test(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.testing(createEmailDto);
  }

  @Get()
  findAll() {
    return this.emailService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(id, updateEmailDto);
  }

}
