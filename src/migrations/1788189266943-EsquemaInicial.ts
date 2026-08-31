import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Linea base del esquema.
 *
 * Hasta ahora la base la creaba y alteraba TypeORM con synchronize: true, asi
 * que las instalaciones existentes YA tienen estas tablas. Por eso todo va con
 * IF NOT EXISTS / EXCEPTION duplicate_object: sobre una base que ya existe la
 * migracion no hace nada y solo queda registrada, y sobre una base vacia crea
 * el esquema completo.
 */

export class EsquemaInicial1788189266943 implements MigrationInterface {
    name = 'EsquemaInicial1788189266943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Los id son uuid con DEFAULT uuid_generate_v4().
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."customers_tipo_documento_enum" AS ENUM('04', '05', '06', '07');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."customers_tipo_persona_enum" AS ENUM('NATURAL', 'JURIDICA');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombres" character varying(200) NOT NULL, "tipo_documento" "public"."customers_tipo_documento_enum" NOT NULL, "numero_documento" character varying NOT NULL, "celular" character varying, "email" character varying(75), "direccion" character varying(300), "observacion" text, "tipo_persona" "public"."customers_tipo_persona_enum" NOT NULL DEFAULT 'NATURAL', "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "BuyToProduct" ("buy_product_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cantidad" integer NOT NULL, "v_total" numeric(8,2) NOT NULL, "descuento" numeric(8,2), "iva" boolean, "buy_id" uuid, "product_id" uuid, CONSTRAINT "PK_4bb89cbb8206cf87c06689e658b" PRIMARY KEY ("buy_product_id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "InvoiceToProduct" ("invoice_product_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cantidad" integer NOT NULL, "v_total" numeric(8,2) NOT NULL, "descuento" numeric(8,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "invoice_id" uuid, "product_id" uuid, CONSTRAINT "PK_239580f56ed93bf1c7a6c300899" PRIMARY KEY ("invoice_product_id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigoBarra" character varying(20) NOT NULL, "aplicaIva" boolean NOT NULL, "impuesto" integer NOT NULL DEFAULT '0', "ice" text, "valor_ice" numeric, "tipo_ice" numeric, "nombre" text NOT NULL, "precio_compra" numeric(8,2) DEFAULT '0', "pvp" numeric(8,2) NOT NULL DEFAULT '0', "stock" integer NOT NULL DEFAULT '0', "descuento" integer NOT NULL DEFAULT '0', "tipo" character varying, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sucursal_id" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."sucursales_ambiente_enum" AS ENUM('PRODUCCION', 'PRUEBA');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "sucursales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(100) NOT NULL, "direccion" character varying(255) NOT NULL, "establecimiento" integer NOT NULL, "punto_emision" integer NOT NULL, "secuencia_factura_produccion" integer NOT NULL, "secuencia_factura_pruebas" integer DEFAULT '1', "secuencia_nota_credito_produccion" integer, "secuencia_nota_credito_pruebas" integer DEFAULT '1', "ambiente" "public"."sucursales_ambiente_enum" NOT NULL DEFAULT 'PRUEBA', "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "PK_c2232960c9e458db5b18d35eeba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clave_acceso" character varying(50), "clave_acceso_nota_credito" character varying(50), "numero_comprobante_nota_credito" character varying(50), "name_proforma" character varying(50), "numero_comprobante" character varying(50) NOT NULL, "descripcion" text, "porcentaje_iva" character varying(2), "forma_pago" character varying(100), "subtotal" numeric(8,2) NOT NULL, "descuento" numeric(8,2) NOT NULL, "iva" numeric(8,2) NOT NULL, "ice" numeric(8,2) NOT NULL DEFAULT '0', "total" numeric(8,2) NOT NULL, "estadoSRI" character varying, "respuestaSRI" character varying, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sucursal_id" uuid, "user_id" uuid, "customer_id" uuid, CONSTRAINT "UQ_e807461f6dd0a6a67410f6f4677" UNIQUE ("clave_acceso"), CONSTRAINT "UQ_8cf9ff12cdc6685e315d657f92d" UNIQUE ("clave_acceso_nota_credito"), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sucursales" uuid array, "email" text, "password" text NOT NULL, "usuario" text NOT NULL, "foto" text, "fullName" text NOT NULL, "celular" text NOT NULL, "roles" text array NOT NULL, "permisos" text array NOT NULL, "horarios_dias" text array, "horarios_time" text array, "receiveSupportEmail" boolean NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "Email" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "host" character varying(70) NOT NULL, "seguridad" character varying(70), "usuario" character varying(75) NOT NULL, "puerto" integer NOT NULL, "password" character varying(75) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "PK_62cb0b2ff4f8d5ee9e3e9cdf5de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "proforma" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clausulas" json DEFAULT '[]', "aceptacion_proforma" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "PK_248c7b6a4cbfe748fdefcbc0e06" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "razon_social" character varying(255) NOT NULL, "nombre_comercial" character varying(255) NOT NULL, "direccion_matriz" character varying(300) NOT NULL, "ruc" character varying(13) NOT NULL, "email" character varying(100) NOT NULL, "telefono" character varying DEFAULT '15', "iva" character, "logo" text, "obligado_contabilidad" boolean NOT NULL, "clave_certificado" character varying(300) NOT NULL, "provincia" character varying(75), "ciudad" character varying(75), "archivo_certificado" character varying, "fecha_caducidad_certificado" character varying, "numero_whatsApp" character varying(20), "whatsapp_activo" boolean NOT NULL DEFAULT true, "wa_provider" character varying(20) NOT NULL DEFAULT 'baileys', "wa_cloud_phone_number_id" character varying(50), "wa_cloud_waba_id" character varying(50), "wa_cloud_access_token" text, "wa_cloud_template_factura" character varying(100), "wa_cloud_template_proforma" character varying(100), "wa_cloud_template_idioma" character varying(10) NOT NULL DEFAULT 'es', "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1fe1a1fe5eaf15ada69b1b2e99f" UNIQUE ("ruc"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."providers_tipo_documento_enum" AS ENUM('Cedula', 'RUC', 'Pasaporte');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."providers_tipo_persona_enum" AS ENUM('NATURAL', 'JURIDICA');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "razon_social" character varying(200) NOT NULL, "tipo_documento" "public"."providers_tipo_documento_enum" NOT NULL, "numero_documento" character varying NOT NULL, "celular" character varying, "email" character varying(75), "direccion" character varying(300), "observacion" text, "tipo_persona" "public"."providers_tipo_persona_enum" NOT NULL DEFAULT 'NATURAL', "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, CONSTRAINT "UQ_f428baa58d6632d2a0847ab3bce" UNIQUE ("numero_documento"), CONSTRAINT "UQ_32fe6bfe82d8e4959ba9d9fad42" UNIQUE ("email"), CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "buys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "numero_comprobante" character varying(50) NOT NULL, "descripcion" character varying(50) NOT NULL, "subtotal" numeric(8,2) NOT NULL DEFAULT '0', "descuento" numeric(8,2) NOT NULL, "iva" numeric(8,2) NOT NULL DEFAULT '0', "total" numeric(8,2) NOT NULL DEFAULT '0', "fecha_compra" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sucursal_id" uuid, "proveedor_id" uuid, "user_id" uuid, CONSTRAINT "PK_34ecbce508fa8a98d0f23d9372a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(60) NOT NULL, "descripcion" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE "public"."ingresos_egresos_tipo_enum" AS ENUM('ingreso', 'egreso');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "ingresos_egresos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" "public"."ingresos_egresos_tipo_enum" NOT NULL DEFAULT 'egreso', "referencia" character varying(255) NOT NULL, "forma_pago" character varying(20), "monto" numeric(12,2) NOT NULL DEFAULT '0', "fecha" date NOT NULL DEFAULT ('now'::text)::date, "descripcion" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" uuid, "sucursal_id" uuid, "user_id" uuid, "proveedor_id" uuid, CONSTRAINT "PK_bbd960b9bc6a629a80dec4b5d90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "roles-and-permisos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" text NOT NULL, "permisos" text array NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1f03a50b9871df49f52260b3488" PRIMARY KEY ("id"))`);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "customers" ADD CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "BuyToProduct" ADD CONSTRAINT "FK_b1e1d930744a1b0b697a9684010" FOREIGN KEY ("buy_id") REFERENCES "buys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "BuyToProduct" ADD CONSTRAINT "FK_4c6b6e572f6d1231f17e3908484" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "InvoiceToProduct" ADD CONSTRAINT "FK_0130798002e9702024805fab5b0" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "InvoiceToProduct" ADD CONSTRAINT "FK_e9e20559151834966089352760f" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "products" ADD CONSTRAINT "FK_635a1caeb1841a683fc24aec920" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "sucursales" ADD CONSTRAINT "FK_f8d96c48ecd998e9f8150ed3d51" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "invoices" ADD CONSTRAINT "FK_01c3f4456deb3533fe444ed7651" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "invoices" ADD CONSTRAINT "FK_26daf5e433d6fb88ee32ce93637" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "invoices" ADD CONSTRAINT "FK_65e3145f317bd655481d3f96c74" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "users" ADD CONSTRAINT "FK_6f9395c9037632a31107c8a9e58" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "Email" ADD CONSTRAINT "FK_0f38dbc95d4e2fbb7974822e38c" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "proforma" ADD CONSTRAINT "FK_8bc1e6bc5a6dbec772bd5f40145" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "providers" ADD CONSTRAINT "FK_58ae4dcce720f7403e8c872d2c3" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "buys" ADD CONSTRAINT "FK_3e5007ac78c8103ce94cdf61f57" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "buys" ADD CONSTRAINT "FK_d5c49f8bd156e2ab252fd69479b" FOREIGN KEY ("proveedor_id") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "buys" ADD CONSTRAINT "FK_6d690a7123e83d1fecb948e9ee3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "ingresos_egresos" ADD CONSTRAINT "FK_db68861f252b06f82c89096c197" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "ingresos_egresos" ADD CONSTRAINT "FK_29acf38ffe4212d91b044934f64" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "ingresos_egresos" ADD CONSTRAINT "FK_bed55fb4b1ab54a1b071ae04a5e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
        await queryRunner.query(`
            DO $$ BEGIN
                ALTER TABLE "ingresos_egresos" ADD CONSTRAINT "FK_b879400a2dffacb8a70e7bdbc40" FOREIGN KEY ("proveedor_id") REFERENCES "providers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" DROP CONSTRAINT IF EXISTS "FK_b879400a2dffacb8a70e7bdbc40"`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" DROP CONSTRAINT IF EXISTS "FK_bed55fb4b1ab54a1b071ae04a5e"`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" DROP CONSTRAINT IF EXISTS "FK_29acf38ffe4212d91b044934f64"`);
        await queryRunner.query(`ALTER TABLE "ingresos_egresos" DROP CONSTRAINT IF EXISTS "FK_db68861f252b06f82c89096c197"`);
        await queryRunner.query(`ALTER TABLE "buys" DROP CONSTRAINT IF EXISTS "FK_6d690a7123e83d1fecb948e9ee3"`);
        await queryRunner.query(`ALTER TABLE "buys" DROP CONSTRAINT IF EXISTS "FK_d5c49f8bd156e2ab252fd69479b"`);
        await queryRunner.query(`ALTER TABLE "buys" DROP CONSTRAINT IF EXISTS "FK_3e5007ac78c8103ce94cdf61f57"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP CONSTRAINT IF EXISTS "FK_58ae4dcce720f7403e8c872d2c3"`);
        await queryRunner.query(`ALTER TABLE "proforma" DROP CONSTRAINT IF EXISTS "FK_8bc1e6bc5a6dbec772bd5f40145"`);
        await queryRunner.query(`ALTER TABLE "Email" DROP CONSTRAINT IF EXISTS "FK_0f38dbc95d4e2fbb7974822e38c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_6f9395c9037632a31107c8a9e58"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "FK_65e3145f317bd655481d3f96c74"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "FK_26daf5e433d6fb88ee32ce93637"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "FK_01c3f4456deb3533fe444ed7651"`);
        await queryRunner.query(`ALTER TABLE "sucursales" DROP CONSTRAINT IF EXISTS "FK_f8d96c48ecd998e9f8150ed3d51"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_635a1caeb1841a683fc24aec920"`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" DROP CONSTRAINT IF EXISTS "FK_e9e20559151834966089352760f"`);
        await queryRunner.query(`ALTER TABLE "InvoiceToProduct" DROP CONSTRAINT IF EXISTS "FK_0130798002e9702024805fab5b0"`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" DROP CONSTRAINT IF EXISTS "FK_4c6b6e572f6d1231f17e3908484"`);
        await queryRunner.query(`ALTER TABLE "BuyToProduct" DROP CONSTRAINT IF EXISTS "FK_b1e1d930744a1b0b697a9684010"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT IF EXISTS "FK_f0e29920aaf871f3eddbea69f0d"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "roles-and-permisos"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "ingresos_egresos"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."ingresos_egresos_tipo_enum"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "buys"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "providers"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."providers_tipo_persona_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."providers_tipo_documento_enum"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "companies"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "proforma"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Email"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "invoices"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "sucursales"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."sucursales_ambiente_enum"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "InvoiceToProduct"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "BuyToProduct"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "customers"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."customers_tipo_persona_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."customers_tipo_documento_enum"`);
    }

}
