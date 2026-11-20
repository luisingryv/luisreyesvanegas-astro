import { defineConfig } from 'drizzle-kit';

// Migraciones versionadas en db/migraciones: SQL legible que se sube al repositorio.
// generate solo lee el esquema; DATABASE_URL hace falta para studio o push (no se usa push).
export default defineConfig({
  dialect: 'mysql',
  schema: './db/schema.ts',
  out: './db/migraciones',
  casing: 'snake_case',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
  strict: true,
  verbose: true,
});
