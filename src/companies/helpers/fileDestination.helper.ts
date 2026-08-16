import * as fs from 'fs';

/**
 * Carpeta destino de cada archivo subido en el módulo de empresas.
 *
 * Multer NO crea la carpeta destino: si no existe, falla al abrir el archivo con
 * ENOENT y la subida se pierde. Pasaba al reemplazar la firma electrónica
 * después de vaciar `static/SRI/FIRMAS`, o en una instalación nueva donde esas
 * carpetas todavía no existen (van vacías, así que git no las versiona).
 */
export const fileDestination = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const carpeta = file.fieldname === 'logo'
    ? './public/images'
    : './static/SRI/FIRMAS';

  try {
    fs.mkdirSync(carpeta, { recursive: true });
  } catch (error) {
    return callback(error, null);
  }

  callback(null, carpeta);
};
