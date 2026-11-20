import { fileURLToPath } from 'node:url';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { crearDb } from '../../src/lib/db/cliente';
import {
  guardarSolicitud,
  obtenerSolicitud,
  solicitudesPendientes,
} from '../../src/lib/db/solicitudes';
import { integracionesDesactivadas } from '../../src/lib/servicios/integraciones';
import { sincronizarPendientes } from '../../src/lib/servicios/sincronizar';

const url = process.env.DATABASE_URL_TEST;
if (!url || !/_test(\?|$)/.test(url)) throw new Error('DATABASE_URL_TEST debe apuntar a *_test.');
const { db, cerrar } = crearDb(url);
const base = {
  formulario: 'general' as const,
  idioma: 'es' as const,
  nombre: 'Ana',
  politicaVersion: '2026-11-13',
  autorizadoEn: new Date(),
};

beforeAll(async () => {
  await migrate(db, {
    migrationsFolder: fileURLToPath(new URL('../../db/migraciones', import.meta.url)),
  });
});
beforeEach(async () => {
  await db.execute(sql`TRUNCATE TABLE solicitudes`);
});
afterAll(() => cerrar());

describe('sincronizarPendientes', () => {
  it('con las integraciones desactivadas no cambia nada', async () => {
    await guardarSolicitud(db, { ...base, email: 'a@ejemplo.com' });
    expect(await sincronizarPendientes(db, integracionesDesactivadas)).toEqual({
      revisadas: 1,
      enCrm: 0,
      avisadas: 0,
      errores: 0,
    });
    expect(await solicitudesPendientes(db)).toHaveLength(1);
  });

  it('lleva al CRM y avisa lo pendiente, y registra las fallas para reintentar', async () => {
    const a = await guardarSolicitud(db, { ...base, email: 'a@ejemplo.com' });
    const b = await guardarSolicitud(db, { ...base, email: 'falla@ejemplo.com' });
    const resumen = await sincronizarPendientes(db, {
      crm: {
        crearFicha: async (s) => {
          if (s.email.startsWith('falla')) throw new Error('Notion 500');
          return `ficha-${s.id}`;
        },
      },
      aviso: { avisar: async () => true },
    });
    expect(resumen).toEqual({ revisadas: 2, enCrm: 1, avisadas: 1, errores: 1 });
    expect(await obtenerSolicitud(db, a)).toMatchObject({ crmPageId: `ficha-${a}` });
    expect(await obtenerSolicitud(db, b)).toMatchObject({ intentos: 1, ultimoError: 'Notion 500' });
    expect((await solicitudesPendientes(db)).map((s) => s.id)).toEqual([b]);
  });
});
