import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Pone al dia una base creada por synchronize en una version anterior.
 *
 * La linea base solo crea las tablas que faltan, asi que una instalacion vieja
 * se queda sin las columnas agregadas despues. Produccion, por ejemplo, no
 * tenia "observacion" ni "tipo_persona" en customers, y "email" seguia siendo
 * NOT NULL cuando la entidad ya lo declara opcional: por eso reventaba el seed
 * del consumidor final.
 *
 * Todo es idempotente: sobre una base al dia no hace nada.
 */
export class SincronizarColumnasFaltantes1788189280000 implements MigrationInterface {
    name = 'SincronizarColumnasFaltantes1788189280000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Columnas que las entidades tienen y una base vieja puede no tener.
        // ADD COLUMN IF NOT EXISTS no toca las que ya estan.
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "nombres" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "tipo_documento" "public"."customers_tipo_documento_enum"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "numero_documento" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "celular" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "email" character varying(75)`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "direccion" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "observacion" text`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "tipo_persona" "public"."customers_tipo_persona_enum" NOT NULL DEFAULT 'NATURAL'`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "company_id" uuid`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" ADD COLUMN IF NOT EXISTS "buy_product_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" ADD COLUMN IF NOT EXISTS "cantidad" integer`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" ADD COLUMN IF NOT EXISTS "v_total" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" ADD COLUMN IF NOT EXISTS "descuento" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" ADD COLUMN IF NOT EXISTS "iva" boolean`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" ADD COLUMN IF NOT EXISTS "buy_id" uuid`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" ADD COLUMN IF NOT EXISTS "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" ADD COLUMN IF NOT EXISTS "invoice_product_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" ADD COLUMN IF NOT EXISTS "cantidad" integer`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" ADD COLUMN IF NOT EXISTS "v_total" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" ADD COLUMN IF NOT EXISTS "descuento" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" ADD COLUMN IF NOT EXISTS "invoice_id" uuid`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" ADD COLUMN IF NOT EXISTS "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "codigoBarra" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "aplicaIva" boolean`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "impuesto" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "ice" text`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "valor_ice" numeric`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "tipo_ice" numeric`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "nombre" text`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "precio_compra" numeric(8,2) DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "pvp" numeric(8,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "stock" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "descuento" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "tipo" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sucursal_id" uuid`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "nombre" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "direccion" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "establecimiento" integer`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "punto_emision" integer`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "secuencia_factura_produccion" integer`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "secuencia_factura_pruebas" integer DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "secuencia_nota_credito_produccion" integer`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "secuencia_nota_credito_pruebas" integer DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "ambiente" "public"."sucursales_ambiente_enum" NOT NULL DEFAULT 'PRUEBA'`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sucursales" ADD COLUMN IF NOT EXISTS "company_id" uuid`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "clave_acceso" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "clave_acceso_nota_credito" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "numero_comprobante_nota_credito" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "name_proforma" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "numero_comprobante" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "descripcion" text`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "porcentaje_iva" character varying(2)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "forma_pago" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "subtotal" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "descuento" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "iva" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "ice" numeric(8,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "total" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "estadoSRI" character varying`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "respuestaSRI" character varying`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "sucursal_id" uuid`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "customer_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "sucursales" uuid array`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "usuario" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "foto" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "fullName" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "celular" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "roles" text array`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "permisos" text array`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "horarios_dias" text array`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "horarios_time" text array`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "receiveSupportEmail" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "host" character varying(70)`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "seguridad" character varying(70)`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "usuario" character varying(75)`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "puerto" integer`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "password" character varying(75)`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "activo" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Email" ADD COLUMN IF NOT EXISTS "company_id" uuid`);
        await queryRunner.query(`ALTER TABLE "proforma" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "proforma" ADD COLUMN IF NOT EXISTS "clausulas" json DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "proforma" ADD COLUMN IF NOT EXISTS "aceptacion_proforma" text`);
        await queryRunner.query(`ALTER TABLE "proforma" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "proforma" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "proforma" ADD COLUMN IF NOT EXISTS "company_id" uuid`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "razon_social" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "nombre_comercial" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "direccion_matriz" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "ruc" character varying(13)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "email" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "telefono" character varying DEFAULT '15'`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "iva" character`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "logo" text`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "obligado_contabilidad" boolean`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "clave_certificado" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "provincia" character varying(75)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "ciudad" character varying(75)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "archivo_certificado" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "fecha_caducidad_certificado" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "numero_whatsApp" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "whatsapp_activo" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "wa_provider" character varying(20) NOT NULL DEFAULT 'baileys'`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "wa_cloud_phone_number_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "wa_cloud_waba_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "wa_cloud_access_token" text`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "wa_cloud_template_factura" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "wa_cloud_template_proforma" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "wa_cloud_template_idioma" character varying(10) NOT NULL DEFAULT 'es'`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "razon_social" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "tipo_documento" "public"."providers_tipo_documento_enum"`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "numero_documento" character varying`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "celular" character varying`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "email" character varying(75)`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "direccion" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "observacion" text`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "tipo_persona" "public"."providers_tipo_persona_enum" NOT NULL DEFAULT 'NATURAL'`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "providers" ADD COLUMN IF NOT EXISTS "companyId" uuid`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "numero_comprobante" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "descripcion" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "subtotal" numeric(8,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "descuento" numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "iva" numeric(8,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "total" numeric(8,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "fecha_compra" character varying`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "sucursal_id" uuid`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "proveedor_id" uuid`);
        await queryRunner.query(`ALTER TABLE "buys" ADD COLUMN IF NOT EXISTS "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "nombre" character varying(60)`);
        await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "descripcion" text`);
        await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "tipo" "public"."ingresos_egresos_tipo_enum" NOT NULL DEFAULT 'egreso'`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "referencia" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "forma_pago" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "monto" numeric(12,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "fecha" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "descripcion" text`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "company_id" uuid`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "sucursal_id" uuid`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" ADD COLUMN IF NOT EXISTS "proveedor_id" uuid`);
        await queryRunner.query(`ALTER TABLE "roles-and-permisos" ADD COLUMN IF NOT EXISTS "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "roles-and-permisos" ADD COLUMN IF NOT EXISTS "nombre" text`);
        await queryRunner.query(`ALTER TABLE "roles-and-permisos" ADD COLUMN IF NOT EXISTS "permisos" text array`);
        await queryRunner.query(`ALTER TABLE "roles-and-permisos" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles-and-permisos" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);

        // Columnas que las entidades declaran opcionales pero que en una base
        // vieja quedaron NOT NULL (el caso de customers.email).
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'customers'
                      AND column_name = 'celular' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "customers" ALTER COLUMN "celular" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'customers'
                      AND column_name = 'email' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "customers" ALTER COLUMN "email" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'customers'
                      AND column_name = 'direccion' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "customers" ALTER COLUMN "direccion" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'customers'
                      AND column_name = 'observacion' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "customers" ALTER COLUMN "observacion" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'customers'
                      AND column_name = 'company_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "customers" ALTER COLUMN "company_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'BuyToProduct'
                      AND column_name = 'descuento' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "BuyToProduct" ALTER COLUMN "descuento" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'BuyToProduct'
                      AND column_name = 'iva' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "BuyToProduct" ALTER COLUMN "iva" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'BuyToProduct'
                      AND column_name = 'buy_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "BuyToProduct" ALTER COLUMN "buy_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'BuyToProduct'
                      AND column_name = 'product_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "BuyToProduct" ALTER COLUMN "product_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'InvoiceToProduct'
                      AND column_name = 'invoice_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "InvoiceToProduct" ALTER COLUMN "invoice_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'InvoiceToProduct'
                      AND column_name = 'product_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "InvoiceToProduct" ALTER COLUMN "product_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'products'
                      AND column_name = 'ice' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "products" ALTER COLUMN "ice" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'products'
                      AND column_name = 'valor_ice' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "products" ALTER COLUMN "valor_ice" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'products'
                      AND column_name = 'tipo_ice' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "products" ALTER COLUMN "tipo_ice" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'products'
                      AND column_name = 'precio_compra' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "products" ALTER COLUMN "precio_compra" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'products'
                      AND column_name = 'tipo' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "products" ALTER COLUMN "tipo" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'products'
                      AND column_name = 'sucursal_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "products" ALTER COLUMN "sucursal_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'sucursales'
                      AND column_name = 'secuencia_factura_pruebas' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "sucursales" ALTER COLUMN "secuencia_factura_pruebas" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'sucursales'
                      AND column_name = 'secuencia_nota_credito_produccion' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "sucursales" ALTER COLUMN "secuencia_nota_credito_produccion" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'sucursales'
                      AND column_name = 'secuencia_nota_credito_pruebas' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "sucursales" ALTER COLUMN "secuencia_nota_credito_pruebas" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'sucursales'
                      AND column_name = 'company_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "sucursales" ALTER COLUMN "company_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'clave_acceso' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "clave_acceso" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'clave_acceso_nota_credito' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "clave_acceso_nota_credito" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'numero_comprobante_nota_credito' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "numero_comprobante_nota_credito" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'name_proforma' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "name_proforma" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'descripcion' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "descripcion" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'porcentaje_iva' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "porcentaje_iva" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'forma_pago' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "forma_pago" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'estadoSRI' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "estadoSRI" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'respuestaSRI' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "respuestaSRI" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'sucursal_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "sucursal_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'user_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "user_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'invoices'
                      AND column_name = 'customer_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "invoices" ALTER COLUMN "customer_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'users'
                      AND column_name = 'sucursales' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "users" ALTER COLUMN "sucursales" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'users'
                      AND column_name = 'email' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'users'
                      AND column_name = 'foto' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "users" ALTER COLUMN "foto" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'users'
                      AND column_name = 'horarios_dias' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "users" ALTER COLUMN "horarios_dias" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'users'
                      AND column_name = 'horarios_time' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "users" ALTER COLUMN "horarios_time" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'users'
                      AND column_name = 'companyId' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "users" ALTER COLUMN "companyId" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'Email'
                      AND column_name = 'seguridad' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "Email" ALTER COLUMN "seguridad" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'Email'
                      AND column_name = 'company_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "Email" ALTER COLUMN "company_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'proforma'
                      AND column_name = 'clausulas' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "proforma" ALTER COLUMN "clausulas" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'proforma'
                      AND column_name = 'aceptacion_proforma' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "proforma" ALTER COLUMN "aceptacion_proforma" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'proforma'
                      AND column_name = 'company_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "proforma" ALTER COLUMN "company_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'telefono' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "telefono" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'iva' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "iva" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'logo' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "logo" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'provincia' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "provincia" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'ciudad' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "ciudad" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'archivo_certificado' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "archivo_certificado" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'fecha_caducidad_certificado' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "fecha_caducidad_certificado" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'numero_whatsApp' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "numero_whatsApp" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'wa_cloud_phone_number_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "wa_cloud_phone_number_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'wa_cloud_waba_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "wa_cloud_waba_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'wa_cloud_access_token' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "wa_cloud_access_token" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'wa_cloud_template_factura' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "wa_cloud_template_factura" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'companies'
                      AND column_name = 'wa_cloud_template_proforma' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "companies" ALTER COLUMN "wa_cloud_template_proforma" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'providers'
                      AND column_name = 'celular' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "providers" ALTER COLUMN "celular" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'providers'
                      AND column_name = 'email' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "providers" ALTER COLUMN "email" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'providers'
                      AND column_name = 'direccion' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "providers" ALTER COLUMN "direccion" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'providers'
                      AND column_name = 'observacion' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "providers" ALTER COLUMN "observacion" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'providers'
                      AND column_name = 'companyId' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "providers" ALTER COLUMN "companyId" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'buys'
                      AND column_name = 'sucursal_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "buys" ALTER COLUMN "sucursal_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'buys'
                      AND column_name = 'proveedor_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "buys" ALTER COLUMN "proveedor_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'buys'
                      AND column_name = 'user_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "buys" ALTER COLUMN "user_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'ingresos_egresos'
                      AND column_name = 'forma_pago' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "ingresos_egresos" ALTER COLUMN "forma_pago" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'ingresos_egresos'
                      AND column_name = 'descripcion' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "ingresos_egresos" ALTER COLUMN "descripcion" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'ingresos_egresos'
                      AND column_name = 'deleted_at' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "ingresos_egresos" ALTER COLUMN "deleted_at" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'ingresos_egresos'
                      AND column_name = 'company_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "ingresos_egresos" ALTER COLUMN "company_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'ingresos_egresos'
                      AND column_name = 'sucursal_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "ingresos_egresos" ALTER COLUMN "sucursal_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'ingresos_egresos'
                      AND column_name = 'user_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "ingresos_egresos" ALTER COLUMN "user_id" DROP NOT NULL;
                END IF;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'ingresos_egresos'
                      AND column_name = 'proveedor_id' AND is_nullable = 'NO'
                ) THEN
                    ALTER TABLE "ingresos_egresos" ALTER COLUMN "proveedor_id" DROP NOT NULL;
                END IF;
            END $$
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No se revierte: quitar columnas o volver a poner NOT NULL borraria
        // datos o fallaria con las filas que ya existen.
    }

}
