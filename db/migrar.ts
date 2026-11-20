// Aplica las migraciones pendientes de db/migraciones. Corre con Node 22 (tipos borrables):
//   pnpm db:migrate               → usa DATABASE_URL
//   pnpm db:migrate -- --pruebas  → usa DATABASE_URL_TEST
// En Hostinger se ejecuta al desplegar, después de pnpm build.
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const variable = process.argv.includes('--pruebas') ? 'DATABASE_URL_TEST' : 'DATABASE_URL';
const url = process.env[variable];
if (!url) {
  console.error(`Falta ${variable}. Revisa .env (local) o las variables de Hostinger.`);
  process.exit(1);
}

const conexion = await mysql.createConnection({ uri: url, multipleStatements: true });
try {
  await migrate(drizzle(conexion), {
    migrationsFolder: fileURLToPath(new URL('./migraciones', import.meta.url)),
  });
  console.log(`Migraciones al día (${variable}).`);
} finally {
  await conexion.end();
}
