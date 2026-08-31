import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Cada empresa necesita su propio cliente "CONSUMIDOR FINAL".
 *
 * Antes el front usaba un unico UUID fijo (variable VITE_CONSUMIDOR_FINAL_ID)
 * para todas las empresas: si ese id no existia, la factura fallaba por llave
 * foranea, y si existia era el consumidor final de OTRA empresa.
 *
 * Los datos son los que exige la ficha tecnica del SRI (Tabla 6): tipo de
 * identificacion 07 y trece digitos de nueve.
 */
export class SeedConsumidorFinalPorEmpresa1788189300000 implements MigrationInterface {
    name = 'SeedConsumidorFinalPorEmpresa1788189300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Solo a las empresas que todavia no lo tienen: se puede correr de nuevo
        // sin duplicar nada.
        await queryRunner.query(`
            INSERT INTO "customers" ("nombres", "tipo_documento", "numero_documento", "isActive", "company_id")
            SELECT 'CONSUMIDOR FINAL', '07', '9999999999999', true, empresa."id"
            FROM "companies" empresa
            WHERE NOT EXISTS (
                SELECT 1 FROM "customers" cliente
                WHERE cliente."company_id" = empresa."id"
                  AND cliente."numero_documento" = '9999999999999'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No se borran los que ya tengan facturas emitidas: eso rompería la
        // llave foranea y dejaria comprobantes sin cliente.
        await queryRunner.query(`
            DELETE FROM "customers" cliente
            WHERE cliente."numero_documento" = '9999999999999'
              AND NOT EXISTS (
                  SELECT 1 FROM "invoices" factura
                  WHERE factura."customer_id" = cliente."id"
              )
        `);
    }

}
