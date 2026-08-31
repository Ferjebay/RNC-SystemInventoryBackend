/**
 * Datos y reglas del cliente "CONSUMIDOR FINAL" segun la ficha tecnica del SRI.
 *
 * Tabla 6: la venta a consumidor final usa el tipo de identificacion 07 y se
 * consignan trece digitos de nueve en la identificacion del cliente.
 */
export const CONSUMIDOR_FINAL_NOMBRES        = 'CONSUMIDOR FINAL';
export const CONSUMIDOR_FINAL_TIPO_DOCUMENTO = '07';
export const CONSUMIDOR_FINAL_NUM_DOCUMENTO  = '9999999999999';

/**
 * Numeral 9.10: "Si el valor de la factura es mayor a 50 USD se debera
 * especificar obligatoriamente los datos del adquirente". Sobre ese monto la
 * factura ya no puede ir a consumidor final.
 */
export const CONSUMIDOR_FINAL_MONTO_MAXIMO = 50;

/**
 * Bancarizacion: los pagos superiores a 500 USD deben canalizarse por el
 * sistema financiero, asi que la forma de pago 01 (SIN UTILIZACION DEL SISTEMA
 * FINANCIERO) deja de ser valida a partir de ese monto.
 */
export const MONTO_MAXIMO_SIN_SISTEMA_FINANCIERO = 500;
export const FORMA_PAGO_SIN_SISTEMA_FINANCIERO   = '01';

/**
 * Se reconoce por la identificacion, no por el nombre: el nombre es un texto
 * editable y el numero lo fija el SRI.
 */
export const esConsumidorFinal = ( cliente: any ): boolean => {
  if ( !cliente ) return false;

  const identificacion = ( cliente.numero_documento ?? '' ).toString().trim();

  if ( identificacion === CONSUMIDOR_FINAL_NUM_DOCUMENTO ) return true;

  return ( cliente.nombres ?? '' ).toString().trim().toUpperCase() === CONSUMIDOR_FINAL_NOMBRES;
};
