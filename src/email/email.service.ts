import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
var nodemailer = require('nodemailer');

@Injectable()
export class EmailService {

  private readonly logger = new Logger('EmailService');

  constructor(
    @InjectRepository( Email )
    private readonly emailRepository: Repository<Email>
  ){}

  async testing(createEmailDto: CreateEmailDto) {
    const { host, usuario, puerto, password, email_client } = createEmailDto;

    const config = {
      host,
      port: puerto,
      secure: puerto === 465 ? true : false,
      greetingTimeout: 12000,
      connectionTimeout: 12000,
      dnsTimeout: 12000,
      // tls: { rejectUnauthorized: false },
      auth: { user: usuario, pass: password }
    }

    const message = {
      from: usuario,
      to: email_client,
      subject: "Test Envio de correos",
      text: "Mensaje de prueba"
    }

    const transport = nodemailer.createTransport(config);

    try {
        await transport.sendMail(message);
        return "Correo Enviado Exitosamente";
    } catch (error) {
      console.log( error );
      throw new BadRequestException(error);
    }
  }

  async sendComprobantes( clientFound, infoCompany, numComprobante = '', clave_acceso = '', comprobantes ) {
    const { host, usuario, puerto, password } = await this.findOne( infoCompany.company_id.id );

    const config = {
      host,
      port: puerto,
      secure: puerto === 465 ? true : false,
      greetingTimeout: 12000,
      connectionTimeout: 12000,
      dnsTimeout: 12000,
      auth: { user: usuario, pass: password }
    }

    let message: any = {
      from: usuario,
      to: clientFound.email
    }

    if (comprobantes.tipo == 'proforma') {
      message.subject = `RED NUEVA CONEXIÓN - le envia su proforma`,
      message.text    = "RED NUEVA CONEXION agradece su consulta :)",
      message.attachments = [
        { filename: comprobantes.name, path: comprobantes.buffer }
      ]
    }else{
      message.subject = `RED NUEVA CONEXIÓN - Factura Nro. ${ numComprobante }`,
      message.text    = "RED NUEVA CONEXION agradece su compra, acontinuación se adjunta su comprobante electronico",
      message.attachments = [
        { filename: clave_acceso +'.xml', path: comprobantes.xml },
        { filename: clave_acceso +'.pdf', path: comprobantes.pdf }
      ]
    }

    const transport = nodemailer.createTransport(config);

    try {
        await transport.sendMail(message);
        return "Correo Enviado Exitosamente";
    } catch (error) {
      console.log( error );
      if ( error.code == 'EDNS' )
        throw new BadRequestException(`Error: getaddrinfo ENOTFOUND ${ host }`);
      else
        throw new BadRequestException('Fallo al enviar el correo');
    }
  }

  async findAll() {
    return await this.emailRepository.find();
  }

  async findOne(id: string) {
    let email: Email;

    email = await this.emailRepository.findOneBy({ company_id: { id } });

    if ( !email )
      throw new NotFoundException('No se encontro algun registro');

    return email;
  }

  async update(id: string, updateEmailDto: UpdateEmailDto){

    const { email_client, puerto, ...rest } = updateEmailDto

    try {
      await this.emailRepository.update( id, { ...rest, puerto: +puerto } );

      return {
        ok: true,
        msg: "Cambios guardado exitosamente"
      };

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
