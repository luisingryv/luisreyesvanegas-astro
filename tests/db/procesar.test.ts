import { fileURLToPath } from 'node:url';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { POLITICA_DATOS_VERSION } from '../../src/config/legal';
import { crearDb } from '../../src/lib/db/cliente';
import { obtenerSolicitud, solicitudesPendientes } from '../../src/lib/db/solicitudes';
import { LIMITE_POR_HORA, procesarSolicitud } from '../../src/lib/formularios/procesar';
import {
  avisoDesactivado,
  crmDesactivado,
  type Integraciones,
} from '../../src/lib/servicios/integraciones';

const url = process.env.DATABASE_URL_TEST;
if (!url || !/_test(\?|$)/.test(url)) throw new Error('DATABASE_URL_TEST debe apuntar a *_test.');
const { db, cerrar } = crearDb(url);

const desactivadas: Integraciones = { crm: crmDesactivado, aviso: avisoDesactivado };
const entrada = {
  formulario: 'general',
  nombre: 'Ana Pérez',
  email: 'Ana@Ejemplo.com',
  mensaje: 'Quiero conversar sobre la migración a AWS.',
  acepta: 'on',
  pagina: '/es/contacto',
  utm_source: 'linkedin',
  utm_campaign: 'lanzamiento',
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

describe('procesarSolicitud', () => {
  it('guarda la solicitud con UTM y la prueba de autorización; queda pendiente sin integraciones', async () => {
    const momento = new Date('2026-11-20T15:00:00.000Z');
    const r = await procesarSolicitud(entrada, { db, ...desactivadas, ahora: () => momento });
    expect(r.ok).toBe(true);
    const id = r.ok ? r.id! : 0;
    expect(await obtenerSolicitud(db, id)).toMatchObject({
      formulario: 'general',
      email: 'ana@ejemplo.com',
      pagina: '/es/contacto',
      utmSource: 'linkedin',
      utmCampaign: 'lanzamiento',
      politicaVersion: POLITICA_DATOS_VERSION,
      autorizadoEn: momento,
      crmSincronizadoEn: null,
      avisoEnviadoEn: null,
    });
    expect((await solicitudesPendientes(db)).map((s) => s.id)).toEqual([id]);
  });

  it('marca el CRM y el aviso cuando funcionan', async () => {
    const r = await procesarSolicitud(entrada, {
      db,
      crm: { crearFicha: async () => 'notion-123' },
      aviso: { avisar: async () => true },
    });
    const fila = await obtenerSolicitud(db, r.ok ? r.id! : 0);
    expect(fila).toMatchObject({ crmPageId: 'notion-123', intentos: 0 });
    expect(fila!.avisoEnviadoEn).toBeInstanceOf(Date);
  });

  it('si una integración falla, la solicitud queda guardada con el error para reintentar', async () => {
    const r = await procesarSolicitud(entrada, {
      db,
      crm: {
        crearFicha: async () => {
          throw new Error('Notion 502');
        },
      },
      aviso: { avisar: async () => true },
    });
    expect(r.ok).toBe(true);
    expect(await obtenerSolicitud(db, r.ok ? r.id! : 0)).toMatchObject({
      intentos: 1,
      ultimoError: 'Notion 502',
      crmPageId: null,
    });
  });

  it('no guarda nada si el campo trampa trae texto, pero responde como si saliera bien', async () => {
    const r = await procesarSolicitud(
      { ...entrada, sitio_web: 'http://spam.example' },
      { db, ...desactivadas },
    );
    expect(r).toEqual({ ok: true, id: null });
    expect(await solicitudesPendientes(db)).toEqual([]);
  });

  it('devuelve los errores por campo y no guarda', async () => {
    const r = await procesarSolicitud(
      { formulario: 'general', email: 'x' },
      { db, ...desactivadas },
    );
    expect(r).toMatchObject({ ok: false, motivo: 'validacion', errores: { email: 'invalido' } });
    expect(await solicitudesPendientes(db)).toEqual([]);
  });

  it(`frena más de ${LIMITE_POR_HORA} solicitudes por correo en una hora`, async () => {
    for (let i = 0; i < LIMITE_POR_HORA; i++) {
      expect((await procesarSolicitud(entrada, { db, ...desactivadas })).ok).toBe(true);
    }
    expect(
      await procesarSolicitud({ ...entrada, email: 'ANA@ejemplo.com ' }, { db, ...desactivadas }),
    ).toEqual({ ok: false, motivo: 'demasiadas' });
    // Otro correo sigue pudiendo escribir.
    expect(
      (await procesarSolicitud({ ...entrada, email: 'otra@ejemplo.com' }, { db, ...desactivadas }))
        .ok,
    ).toBe(true);
  });
});
