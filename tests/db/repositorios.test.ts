import { fileURLToPath } from 'node:url';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { crearDb } from '../../src/lib/db/cliente';
import {
  MAX_INTENTOS,
  guardarSolicitud,
  marcarAvisoEnviado,
  marcarEnCrm,
  obtenerSolicitud,
  registrarErrorDeIntegracion,
  solicitudesPendientes,
} from '../../src/lib/db/solicitudes';
import {
  confirmarSuscripcion,
  darDeBaja,
  hashToken,
  registrarSuscriptor,
} from '../../src/lib/db/suscriptores';

const url = process.env.DATABASE_URL_TEST;
if (!url) throw new Error('Falta DATABASE_URL_TEST (ver .env.example).');
if (!/_test(\?|$)/.test(url)) throw new Error('DATABASE_URL_TEST debe apuntar a una base *_test.');

const { db, cerrar } = crearDb(url);
const autorizacion = { politicaVersion: '2026-11-13', autorizadoEn: new Date() };

beforeAll(async () => {
  await migrate(db, {
    migrationsFolder: fileURLToPath(new URL('../../db/migraciones', import.meta.url)),
  });
});

beforeEach(async () => {
  await db.execute(sql`TRUNCATE TABLE solicitudes`);
  await db.execute(sql`TRUNCATE TABLE suscriptores`);
});

afterAll(() => cerrar());

describe('solicitudes', () => {
  it('guarda la solicitud con la prueba de autorización y los datos propios del formulario', async () => {
    const id = await guardarSolicitud(db, {
      formulario: 'speaker',
      idioma: 'es',
      nombre: 'Organizadora de prueba',
      email: '  Eventos@Ejemplo.COM ',
      mensaje: 'Charla sobre adopción de IA',
      datos: { fecha: '2027-03-12', ciudad: 'Quito', audiencia: 300, presupuesto: null },
      pagina: '/es/speaker',
      utmSource: 'linkedin',
      ...autorizacion,
    });

    const fila = await obtenerSolicitud(db, id);
    expect(fila).toMatchObject({
      formulario: 'speaker',
      email: 'eventos@ejemplo.com',
      datos: { fecha: '2027-03-12', ciudad: 'Quito', audiencia: 300, presupuesto: null },
      politicaVersion: '2026-11-13',
      intentos: 0,
      crmSincronizadoEn: null,
    });
    // creado_en lo pone la base, en UTC, con milisegundos.
    expect(Math.abs(fila!.creadoEn.getTime() - Date.now())).toBeLessThan(60_000);
  });

  it('acepta tildes, eñes y emojis (utf8mb4)', async () => {
    const id = await guardarSolicitud(db, {
      formulario: 'general',
      idioma: 'es',
      nombre: 'Íñigo Peña 🚀',
      email: 'inigo@ejemplo.com',
      ...autorizacion,
    });
    expect((await obtenerSolicitud(db, id))!.nombre).toBe('Íñigo Peña 🚀');
  });

  it('lista pendientes hasta que llegan al CRM y tienen aviso, y respeta el máximo de intentos', async () => {
    const base = { formulario: 'general' as const, idioma: 'es' as const, ...autorizacion };
    const a = await guardarSolicitud(db, { ...base, nombre: 'A', email: 'a@ejemplo.com' });
    const b = await guardarSolicitud(db, { ...base, nombre: 'B', email: 'b@ejemplo.com' });
    expect((await solicitudesPendientes(db)).map((s) => s.id)).toEqual([a, b]);

    await marcarEnCrm(db, a, 'notion-page-1');
    expect((await solicitudesPendientes(db)).map((s) => s.id)).toEqual([a, b]);
    await marcarAvisoEnviado(db, a);
    expect((await solicitudesPendientes(db)).map((s) => s.id)).toEqual([b]);

    for (let i = 0; i < MAX_INTENTOS; i++)
      await registrarErrorDeIntegracion(db, b, new Error('Notion 502'));
    expect(await solicitudesPendientes(db)).toEqual([]);
    expect(await obtenerSolicitud(db, b)).toMatchObject({
      intentos: MAX_INTENTOS,
      ultimoError: 'Notion 502',
    });
  });
});

describe('suscriptores', () => {
  const datos = { email: 'Lectora@Ejemplo.com', idioma: 'es' as const, ...autorizacion };

  it('confirma con el enlace y guarda solo el hash del token', async () => {
    const registro = await registrarSuscriptor(db, datos);
    expect(registro.estado).toBe('por-confirmar');
    const token = registro.estado === 'por-confirmar' ? registro.token : '';

    const fila = await db.query.suscriptores.findFirst();
    expect(fila).toMatchObject({ email: 'lectora@ejemplo.com', estado: 'pendiente' });
    expect(fila!.tokenHash).toBe(hashToken(token));
    expect(fila!.tokenHash).not.toContain(token);

    expect(await confirmarSuscripcion(db, 'token-falso')).toBe(false);
    expect(await confirmarSuscripcion(db, token)).toBe(true);
    expect(await confirmarSuscripcion(db, token)).toBe(false);
    expect(await db.query.suscriptores.findFirst()).toMatchObject({ estado: 'confirmado' });
  });

  it('no duplica correos: si ya confirmó no cambia, si estaba pendiente renueva el enlace', async () => {
    const primero = await registrarSuscriptor(db, datos);
    const segundo = await registrarSuscriptor(db, { ...datos, email: 'lectora@ejemplo.com ' });
    expect(segundo.estado).toBe('por-confirmar');
    // El primer enlace deja de servir.
    if (primero.estado === 'por-confirmar') {
      expect(await confirmarSuscripcion(db, primero.token)).toBe(false);
    }
    if (segundo.estado === 'por-confirmar') await confirmarSuscripcion(db, segundo.token);

    expect(await registrarSuscriptor(db, datos)).toEqual({ estado: 'ya-confirmado' });
    const [{ total }] = (
      await db.execute(sql`SELECT COUNT(*) AS total FROM suscriptores`)
    )[0] as unknown as [{ total: number }];
    expect(Number(total)).toBe(1);
  });

  it('da de baja con el mismo enlace y permite volver a suscribirse', async () => {
    const registro = await registrarSuscriptor(db, datos);
    if (registro.estado !== 'por-confirmar') throw new Error('esperaba token');
    await confirmarSuscripcion(db, registro.token);

    expect(await darDeBaja(db, registro.token)).toBe(true);
    expect(await darDeBaja(db, registro.token)).toBe(true);
    expect(await darDeBaja(db, 'otro')).toBe(false);
    expect(await db.query.suscriptores.findFirst()).toMatchObject({ estado: 'baja' });

    expect((await registrarSuscriptor(db, datos)).estado).toBe('por-confirmar');
  });
});
