// Suscriptores del boletín con doble confirmación. El token en claro solo va en el correo;
// en la base queda su SHA-256. El mismo enlace sirve después para darse de baja.
import { createHash, randomBytes } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { suscriptores, type Idioma, type Suscriptor } from '../../../db/schema';
import type { Db } from './cliente';
import { normalizarEmail } from './solicitudes';

type Origen = Pick<
  Suscriptor,
  'pagina' | 'utmSource' | 'utmMedium' | 'utmCampaign' | 'utmTerm' | 'utmContent'
>;

export interface DatosSuscripcion extends Partial<Origen> {
  email: string;
  idioma: Idioma;
  politicaVersion: string;
  autorizadoEn: Date;
}

export type ResultadoSuscripcion =
  { estado: 'por-confirmar'; token: string } | { estado: 'ya-confirmado' };

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
const nuevoToken = () => randomBytes(32).toString('base64url');

/** Registra o renueva la suscripción. Si ya estaba confirmada, no cambia nada. */
export async function registrarSuscriptor(
  db: Db,
  datos: DatosSuscripcion,
): Promise<ResultadoSuscripcion> {
  const email = normalizarEmail(datos.email);
  const actual = await db.query.suscriptores.findFirst({ where: eq(suscriptores.email, email) });
  if (actual?.estado === 'confirmado') return { estado: 'ya-confirmado' };

  const token = nuevoToken();
  const fila = {
    ...datos,
    email,
    estado: 'pendiente' as const,
    tokenHash: hashToken(token),
    confirmadoEn: null,
    bajaEn: null,
  };
  if (actual) await db.update(suscriptores).set(fila).where(eq(suscriptores.id, actual.id));
  else await db.insert(suscriptores).values(fila);
  return { estado: 'por-confirmar', token };
}

/** true si el enlace era de una suscripción pendiente y quedó confirmada. */
export async function confirmarSuscripcion(db: Db, token: string): Promise<boolean> {
  const [resultado] = await db
    .update(suscriptores)
    .set({ estado: 'confirmado', confirmadoEn: new Date() })
    .where(and(eq(suscriptores.tokenHash, hashToken(token)), eq(suscriptores.estado, 'pendiente')));
  return resultado.affectedRows === 1;
}

/** true si el enlace era válido; darse de baja dos veces no es un error. */
export async function darDeBaja(db: Db, token: string): Promise<boolean> {
  const suscriptor = await db.query.suscriptores.findFirst({
    where: eq(suscriptores.tokenHash, hashToken(token)),
  });
  if (!suscriptor) return false;
  if (suscriptor.estado !== 'baja') {
    await db
      .update(suscriptores)
      .set({ estado: 'baja', bajaEn: new Date() })
      .where(eq(suscriptores.id, suscriptor.id));
  }
  return true;
}
