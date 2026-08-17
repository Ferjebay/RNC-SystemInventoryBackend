import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';

/**
 * Cliente del microservicio de comprobantes electrónicos (electronic-invoice-ms).
 *
 * FactuCash ya no arma ni firma el XML: delega la emisión al MS y solo guarda el
 * resultado (clave de acceso, número de comprobante y estado del SRI). Los
 * secuenciales se siguen manejando aquí — al MS se le envía el `emisor` ya
 * calculado, por eso se usa el endpoint "sin referencia".
 */

export interface EmisionResponse {
  claveAcceso: string;
  numeroComprobante: string;
  estado: string;
}

export interface AnulacionResponse extends EmisionResponse {
  notaCreditoId: string;
}

@Injectable()
export class FacturacionMsClient {

  private readonly logger = new Logger('FacturacionMS');

  /** Timeout amplio: el MS firma y habla con el SRI dentro de la misma llamada. */
  private readonly TIMEOUT = 30000;

  private get host(): string {
    const host = process.env.HOST_API_FACTURACION;
    if (!host)
      throw new InternalServerErrorException(
        'Falta la variable HOST_API_FACTURACION: no se puede emitir el comprobante.'
      );
    return host.replace(/\/+$/, '');
  }

  /**
   * Sube el .p12 al microservicio, que es quien firma.
   *
   * Se guarda con el mismo nombre que usa FactuCash (`archivo_certificado`),
   * porque ese nombre viaja en el payload de cada emisión.
   */
  async subirCertificado(rutaLocal: string, nombreArchivo: string): Promise<boolean> {
    const url = `${this.host}/files/upload-signature`;
    try {
      const form = new FormData();
      form.append('file', fs.readFileSync(rutaLocal), {
        filename: nombreArchivo,
        contentType: 'application/x-pkcs12',
      });

      await axios.post(url, form, {
        headers: form.getHeaders(),
        timeout: this.TIMEOUT,
        maxBodyLength: Infinity,
      });

      this.logger.log(`Certificado "${nombreArchivo}" subido al MS.`);
      return true;
    } catch (error) {
      // No se corta el guardado de la empresa: el archivo ya quedó local y se
      // puede reintentar volviendo a guardar.
      const motivo = error?.response?.data?.message ?? error?.message;
      this.logger.error(`No se pudo subir el certificado "${nombreArchivo}": ${motivo}`);
      return false;
    }
  }

  /**
   * Caducidad del certificado según el MS.
   * Devuelve null si no la puede determinar, para no bloquear el guardado.
   */
  async caducidadCertificado(nombreArchivo: string, password: string): Promise<Date | null> {
    const url = `${this.host}/certificado/info`;
    try {
      const { data } = await axios.post(
        url,
        { nombre_certificado: nombreArchivo, password },
        { timeout: this.TIMEOUT },
      );

      const fecha = data?.fechaCaducidad ? new Date(data.fechaCaducidad) : null;

      if (!fecha || isNaN(fecha.getTime())) {
        this.logger.warn(`El MS no devolvió una caducidad válida para "${nombreArchivo}".`);
        return null;
      }

      return fecha;
    } catch (error) {
      const motivo = error?.response?.data?.message ?? error?.message;
      this.logger.warn(`No se pudo consultar la caducidad de "${nombreArchivo}": ${motivo}`);
      return null;
    }
  }

  /** Emite una factura. Devuelve lo que responde el SRI a través del MS. */
  async emitirFactura(payload: any): Promise<EmisionResponse> {
    const url = `${this.host}/v1/factura/emision`;
    try {
      const { data } = await axios.post(url, payload, { timeout: this.TIMEOUT });
      return data;
    } catch (error) {
      throw this.traducirError(error, 'emitir la factura');
    }
  }

  /**
   * Anula una factura emitiendo su nota de crédito.
   *
   * El MS ya tiene los datos de la factura original, así que solo necesita la
   * clave de acceso y el secuencial de la nota — que se sigue llevando aquí.
   */
  async anularFactura(payload: {
    ambiente: 'test' | 'prod';
    emisor: { secuencial: string };
    factura: string;
    motivo?: string;
  }): Promise<AnulacionResponse> {
    const url = `${this.host}/v1/nota-credito/anular-factura-sin-referencia`;
    try {
      const { data } = await axios.post(url, payload, { timeout: this.TIMEOUT });
      return data;
    } catch (error) {
      throw this.traducirError(error, 'anular la factura');
    }
  }

  /** Reintenta el envío al SRI de una nota de crédito. */
  async reenviarNotaCredito(claveAcceso: string) {
    const url = `${this.host}/v1/nota-credito/reenviar/${claveAcceso}`;
    try {
      const { data } = await axios.put(url, {}, { timeout: this.TIMEOUT });
      return data;
    } catch (error) {
      throw this.traducirError(error, 'reenviar la nota de crédito');
    }
  }

  /** Estado actual de un comprobante ya emitido. */
  async consultarFactura(claveAcceso: string) {
    const url = `${this.host}/v1/factura/${claveAcceso}`;
    try {
      const { data } = await axios.get(url, { timeout: this.TIMEOUT });
      return data;
    } catch (error) {
      throw this.traducirError(error, 'consultar la factura');
    }
  }

  /** Reintenta el envío al SRI de un comprobante que quedó a medias. */
  async reenviarFactura(claveAcceso: string) {
    const url = `${this.host}/v1/factura/reenviar/${claveAcceso}`;
    try {
      const { data } = await axios.put(url, {}, { timeout: this.TIMEOUT });
      return data;
    } catch (error) {
      throw this.traducirError(error, 'reenviar la factura');
    }
  }

  /**
   * Descarga el RIDE (PDF) o el XML de un comprobante.
   * `tipo` distingue entre la factura y su nota de crédito.
   */
  async descargar(
    formato: 'ride' | 'xml',
    claveAcceso: string,
    tipo: 'factura' | 'nota-credito' = 'factura',
    extra: { image_url?: string; nameEmisor?: string } = {},
  ): Promise<Buffer> {
    const url = `${this.host}/v1/${tipo}/descarga/${formato}/${claveAcceso}`;
    try {
      const { data } = await axios.post(url, extra, {
        responseType: 'arraybuffer',
        timeout: this.TIMEOUT,
      });
      return Buffer.from(data);
    } catch (error) {
      throw this.traducirError(error, `descargar el ${formato.toUpperCase()}`);
    }
  }

  /**
   * Deja el RIDE y el XML en disco y devuelve sus rutas.
   *
   * El envío por correo y WhatsApp adjunta archivos por ruta, así que se
   * conservan las mismas ubicaciones que usaba la generación local.
   */
  async guardarComprobantes(
    claveAcceso: string,
    rucEmisor: string,
    extra: { image_url?: string; nameEmisor?: string } = {},
  ): Promise<{ pdf: string; xml: string } | null> {
    try {
      const [pdf, xml] = await Promise.all([
        this.descargar('ride', claveAcceso, 'factura', extra),
        this.descargar('xml', claveAcceso, 'factura'),
      ]);

      const pathPDF = path.resolve(__dirname, `../../../static/SRI/PDF/${claveAcceso}.pdf`);
      const pathXML = path.resolve(
        __dirname,
        `../../../static/SRI/${rucEmisor}/facturas/Autorizados/${claveAcceso}.xml`,
      );

      fs.mkdirSync(path.dirname(pathPDF), { recursive: true });
      fs.mkdirSync(path.dirname(pathXML), { recursive: true });
      fs.writeFileSync(pathPDF, pdf);
      fs.writeFileSync(pathXML, xml);

      return { pdf: pathPDF, xml: pathXML };
    } catch (error) {
      // No se corta la emisión: el comprobante ya está en el SRI, solo falló la
      // copia local que sirve para adjuntarlo.
      this.logger.warn(`No se pudieron guardar los comprobantes de ${claveAcceso}: ${error?.message}`);
      return null;
    }
  }

  /** Convierte el error de axios en algo que el operador pueda entender. */
  private traducirError(error: any, accion: string) {
    const detalle =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'error desconocido';

    const mensaje = Array.isArray(detalle) ? detalle.join(' | ') : detalle;

    this.logger.error(`Falló al ${accion}: ${mensaje}`);

    return new InternalServerErrorException(`No se pudo ${accion}: ${mensaje}`);
  }
}
