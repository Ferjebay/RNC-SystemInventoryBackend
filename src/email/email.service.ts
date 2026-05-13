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
    const { host, usuario, puerto, password, email_client, seguridad } = createEmailDto;

    try {
      const config = {
        host,
        port: puerto,
        secure: seguridad === 'SSL',
        requireTLS: seguridad === 'TLS',
        greetingTimeout: 10000,
        connectionTimeout: 10000,
        dnsTimeout: 10000,
        tls: { ciphers: 'SSLv3', rejectUnauthorized: false },
        auth: { user: usuario, pass: password }
      }

      const message = {
        from: usuario,
        to: email_client,
        subject: "Prueba de correo exitosa - Sistema FactuCash",
        html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verificación de correo</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header con color de marca -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">FactuCash</h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">Sistema de Facturación Electrónica</p>
            </td>
          </tr>

          <!-- Contenido principal -->
          <tr>
            <td style="padding: 20px 30px;">
              <h2 style="margin: 0 0 10px; color: #1a202c; font-size: 19px; font-weight: 600;">
                ✅ Verificación de correo exitosa
              </h2>

              <p style="margin: 0 0 16px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                Hola,
              </p>

              <p style="margin: 0 0 16px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                Si estás leyendo este mensaje, significa que <strong style="color: #667eea;">la configuración de correo está funcionando correctamente</strong> en el sistema FactuCash.
              </p>

              <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; color: #2d3748; font-size: 14px; line-height: 1.6;">
                  <strong>📧 Este es un mensaje de prueba</strong><br>
                  Las credenciales de correo han sido validadas exitosamente. El sistema ahora puede enviar facturas electrónicas y comunicaciones a los clientes.
                </p>
              </div>

              <p style="margin: 0 0 16px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                Características verificadas:
              </p>

              <ul style="margin: 0 0 0px; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.8;">
                <li>✓ Conexión al servidor SMTP</li>
                <li>✓ Autenticación de credenciales</li>
                <li>✓ Envío de correos electrónicos</li>
              </ul>

              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0 20px 0px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                  🎉 Sistema listo para uso en producción
                </p>
              </div>

              <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                Si no esperabas este correo o necesitas soporte técnico, por favor contacta con el administrador del sistema.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; color: #718096; font-size: 13px;">
                Este correo fue enviado automáticamente desde
              </p>
              <p style="margin: 0 0 16px; color: #2d3748; font-size: 15px; font-weight: 600;">
                Sistema FactuCash
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                © ${new Date().getFullYear()} FactuCash. Todos los derechos reservados.
              </p>
              <p style="margin: 8px 0 0; color: #a0aec0; font-size: 11px;">
                📍 Ecuador
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `
      }

      const transport = nodemailer.createTransport(config);

      await transport.sendMail(message);
      return "Correo Enviado Exitosamente";
    } catch (error: any) {
      const msgTraducido = await this.traducirMensaje(error.message);
      throw new BadRequestException(msgTraducido);
    }
  }

  private async traducirMensaje(texto: string): Promise<string> {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|es`;
      const res = await fetch(url);
      const data = await res.json();
      return data?.responseData?.translatedText || texto;
    } catch {
      return texto;
    }
  }

  async sendComprobantes( clientFound, infoCompany, numComprobante = '', clave_acceso = '', comprobantes ) {

    const { host, usuario, puerto, password, seguridad } = await this.findOne( infoCompany.company_id.id );

    const config = {
      host,
      port: puerto,
      secure: seguridad === 'SSL',
      requireTLS: seguridad === 'TLS',
      greetingTimeout: 12000,
      connectionTimeout: 12000,
      dnsTimeout: 12000,
      tls: { ciphers: 'SSLv3', rejectUnauthorized: false },
      auth: { user: usuario, pass: password }
    }

    let message: any = {
      from: usuario,
      to: clientFound.email
    }

    if (comprobantes.tipo == 'proforma') {
      message.subject = `${infoCompany.company_id.nombre_comercial} - le envia su proforma`;
      message.html = `
      <p>
        <strong>Estimado(a):</strong> ${ clientFound.nombres } la empresa <strong>${infoCompany.company_id.nombre_comercial}</strong> le ha emitido la siguiente proforma a su nombre
      </p>`;
      message.attachments = [
        { filename: comprobantes.name, path: comprobantes.buffer }
      ]
    }else{
      message.subject = `${infoCompany.company_id.nombre_comercial} - Factura Nro. ${ numComprobante }`,
      message.html = `
      <p>
        <strong>Estimado(a):</strong> ${ clientFound.nombres } la empresa <strong>${infoCompany.company_id.nombre_comercial}</strong> le ha emitido la siguiente factura a su nombre:
      </p>
      <p>
       Factura Nro. ${ numComprobante }
      </p>
      <p>
        A continuación adjuntamos el comprobante electrónico en formato XML y PDF
      </p>`
      message.attachments = [
        { filename: numComprobante +'.xml', path: comprobantes.xml },
        { filename: numComprobante +'.pdf', path: comprobantes.pdf }
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
