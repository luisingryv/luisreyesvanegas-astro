// POST /api/tareas/sincronizar: la llama el cron de Hostinger cada 10 minutos con
// "Authorization: Bearer <TAREAS_TOKEN>". Sin token configurado, no hace nada.
import type { APIRoute } from 'astro';
import { TAREAS_TOKEN } from 'astro:env/server';
import { timingSafeEqual } from 'node:crypto';
import { getDb } from '../../../lib/db';
import { getIntegraciones } from '../../../lib/servicios';
import { sincronizarPendientes } from '../../../lib/servicios/sincronizar';

export const prerender = false;

const autorizado = (cabecera: string | null) => {
  if (!TAREAS_TOKEN || !cabecera?.startsWith('Bearer ')) return false;
  const recibido = Buffer.from(cabecera.slice(7));
  const esperado = Buffer.from(TAREAS_TOKEN);
  return recibido.length === esperado.length && timingSafeEqual(recibido, esperado);
};

export const POST: APIRoute = async ({ request }) => {
  if (!autorizado(request.headers.get('authorization'))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  try {
    const resumen = await sincronizarPendientes(getDb(), getIntegraciones());
    return Response.json({ ok: true, ...resumen });
  } catch (error) {
    console.error('[tareas] no se pudo sincronizar:', (error as Error).message);
    return Response.json({ ok: false }, { status: 503 });
  }
};
