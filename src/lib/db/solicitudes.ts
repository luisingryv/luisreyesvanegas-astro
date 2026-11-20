// Solicitudes de los formularios. Se guardan primero; el CRM (Notion) y el aviso (Resend)
// se marcan por separado para poder reintentarlos sin perder el mensaje.
import { and, asc, eq, isNull, lt, or, sql } from 'drizzle-orm';
import { solicitudes, type NuevaSolicitud, type Solicitud } from '../../../db/schema';
import type { Db } from './cliente';

export const MAX_INTENTOS = 5;

export async function guardarSolicitud(
  db: Db,
  datos: Omit<NuevaSolicitud, 'id' | 'creadoEn' | 'intentos'>,
): Promise<number> {
  const [fila] = await db
    .insert(solicitudes)
    .values({ ...datos, email: normalizarEmail(datos.email) })
    .$returningId();
  return fila!.id;
}

export async function obtenerSolicitud(db: Db, id: number): Promise<Solicitud | undefined> {
  return db.query.solicitudes.findFirst({ where: eq(solicitudes.id, id) });
}

/** Las que aún no llegan al CRM o no tienen aviso, sin pasar del máximo de intentos. */
export async function solicitudesPendientes(db: Db, limite = 20): Promise<Solicitud[]> {
  return db
    .select()
    .from(solicitudes)
    .where(
      and(
        or(isNull(solicitudes.crmSincronizadoEn), isNull(solicitudes.avisoEnviadoEn)),
        lt(solicitudes.intentos, MAX_INTENTOS),
      ),
    )
    .orderBy(asc(solicitudes.id))
    .limit(limite);
}

export async function marcarEnCrm(db: Db, id: number, crmPageId: string): Promise<void> {
  await db
    .update(solicitudes)
    .set({ crmPageId, crmSincronizadoEn: new Date() })
    .where(eq(solicitudes.id, id));
}

export async function marcarAvisoEnviado(db: Db, id: number): Promise<void> {
  await db.update(solicitudes).set({ avisoEnviadoEn: new Date() }).where(eq(solicitudes.id, id));
}

export async function registrarErrorDeIntegracion(db: Db, id: number, error: unknown) {
  const mensaje = error instanceof Error ? error.message : String(error);
  await db
    .update(solicitudes)
    .set({ intentos: sql`${solicitudes.intentos} + 1`, ultimoError: mensaje.slice(0, 2000) })
    .where(eq(solicitudes.id, id));
}

export const normalizarEmail = (email: string) => email.trim().toLowerCase();
