import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const useSSL = process.env.STAGE === 'prod' && process.env.DB_SSL !== 'false';

/**
 * DataSource que usa el CLI de TypeORM (migration:generate / run / revert).
 * La aplicacion sigue configurandose en app.module; esto existe solo para las
 * migraciones, que necesitan una conexion fuera del contexto de Nest.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  extra: {
    ssl: useSSL ? { rejectUnauthorized: false } : null,
  },
  entities: [join(__dirname, '**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
});
