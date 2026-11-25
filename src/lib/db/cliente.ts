// Conexión a MariaDB con Drizzle. Sin dependencias de Astro, para poder probarla con Vitest.
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../../db/schema';

export function crearDb(url: string) {
  const pool = mysql.createPool({
    uri: url,
    connectionLimit: 5,
    // Las fechas se guardan y leen en UTC, sin importar la zona del servidor de Hostinger. Las de
    // creación las pone la app (db/schema.ts), así que no hace falta cambiar la zona de la sesión.
    timezone: 'Z',
  });
  const db = drizzle(pool, { schema, mode: 'default', casing: 'snake_case' });
  return { db, cerrar: () => pool.end() };
}

export type Db = ReturnType<typeof crearDb>['db'];
