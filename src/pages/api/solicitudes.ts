// POST /api/solicitudes: recibe los formularios del sitio.
// - Con JavaScript (fetch y JSON): responde JSON con el resultado y los errores por campo.
// - Sin JavaScript (formulario HTML): guarda y vuelve a la página con ?formulario=enviado|error.
// - Agenda de Consultoría: después de guardar abre la página de reservas, si está configurada.
// Astro rechaza los formularios enviados desde otros dominios (security.checkOrigin).
// - Con las llaves de Cloudflare Turnstile configuradas, cada envío trae su token y se verifica
//   antes de guardar (21 nov 2026).
import type { APIRoute } from 'astro';
import { CALENDAR_BOOKING_URL, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { getDb } from '../../lib/db';
import { procesarSolicitud, type ResultadoSolicitud } from '../../lib/formularios/procesar';
import { CAMPO_TURNSTILE, verificarTurnstile } from '../../lib/formularios/turnstile';
import { getIntegraciones } from '../../lib/servicios';

export const prerender = false;

const TAMANO_MAXIMO = 32 * 1024;

const estadoHttp = (r: ResultadoSolicitud) => (r.ok ? 201 : r.motivo === 'demasiadas' ? 429 : 400);

function volverALaPagina(pagina: unknown, resultado: 'enviado' | 'error', base: string) {
  const ruta = typeof pagina === 'string' && /^\/(?![/\\])/.test(pagina) ? pagina : '/';
  const destino = new URL(ruta, base);
  destino.searchParams.set('formulario', resultado);
  // El formulario muestra el mensaje con :target, sin JavaScript.
  destino.hash = `formulario-${resultado}`;
  return new Response(null, {
    status: 303,
    headers: { Location: destino.pathname + destino.search + destino.hash },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (Number(request.headers.get('content-length') ?? 0) > TAMANO_MAXIMO) {
    return Response.json({ ok: false, motivo: 'muy-grande' }, { status: 413 });
  }

  const esJson = (request.headers.get('content-type') ?? '').includes('application/json');
  let entrada: Record<string, unknown>;
  try {
    entrada = esJson
      ? ((await request.json()) as Record<string, unknown>)
      : Object.fromEntries(await request.formData());
  } catch {
    return Response.json({ ok: false, motivo: 'formato' }, { status: 400 });
  }

  if (TURNSTILE_SECRET_KEY) {
    const verificacion = await verificarTurnstile(entrada[CAMPO_TURNSTILE], TURNSTILE_SECRET_KEY, {
      ip: clientAddress,
    });
    if (verificacion === 'sin-respuesta') {
      console.warn('[solicitudes] Turnstile no respondió; se deja pasar la solicitud.');
    } else if (verificacion === 'invalido') {
      return esJson
        ? Response.json({ ok: false, motivo: 'verificacion' }, { status: 400 })
        : volverALaPagina(entrada.pagina, 'error', request.url);
    }
  }
  delete entrada[CAMPO_TURNSTILE];

  let resultado: ResultadoSolicitud;
  try {
    resultado = await procesarSolicitud(entrada, { db: getDb(), ...getIntegraciones() });
  } catch (error) {
    // Sin datos personales en el registro: solo el tipo de falla.
    console.error('[solicitudes] no se pudo guardar:', (error as Error).message);
    return esJson
      ? Response.json({ ok: false, motivo: 'no-disponible' }, { status: 503 })
      : volverALaPagina(entrada.pagina, 'error', request.url);
  }

  // Agenda de Consultoría: después de guardar las preguntas previas se abre la página de
  // reservas de Google Calendar (si Luis ya configuró su URL).
  const agenda =
    resultado.ok && entrada.formulario === 'consultoria' ? CALENDAR_BOOKING_URL : undefined;

  if (!esJson) {
    if (agenda) return new Response(null, { status: 303, headers: { Location: agenda } });
    return volverALaPagina(entrada.pagina, resultado.ok ? 'enviado' : 'error', request.url);
  }
  // El id interno no sale del servidor.
  const cuerpo = resultado.ok ? { ok: true, ...(agenda && { agenda }) } : resultado;
  return Response.json(cuerpo, { status: estadoHttp(resultado) });
};
