// Punto de entrada para endpoints y páginas del servidor: una sola conexión por proceso.
import { DATABASE_URL } from 'astro:env/server';
import { crearDb, type Db } from './cliente';

let instancia: Db | undefined;

export function getDb(): Db {
  if (!DATABASE_URL) {
    throw new Error('Falta DATABASE_URL: revisa .env (local) o las variables de Hostinger.');
  }
  instancia ??= crearDb(DATABASE_URL).db;
  return instancia;
}

export type { Db } from './cliente';
export * from './solicitudes';
export * from './suscriptores';
