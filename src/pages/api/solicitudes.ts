// POST /api/solicitudes: recibe los formularios del sitio.
// - Con JavaScript (fetch y JSON): responde JSON con el resultado y los errores por campo.
// - Sin JavaScript (formulario HTML): guarda y vuelve a la página con ?formulario=enviado|error.
// Astro rechaza los formularios enviados desde otros dominios (security.checkOrigin).
import type { APIRoute } from 'astro';
import { getDb } from '../../lib/db';
import { procesarSolicitud, type ResultadoSolicitud } from '../../lib/formularios/procesar';
import { getIntegraciones } from '../../lib/servicios/integraciones';

export const prerender = false;

const TAMANO_MAXIMO = 32 * 1024;

const estadoHttp = (r: ResultadoSolicitud) => (r.ok ? 201 : r.motivo === 'demasiadas' ? 429 : 400);

function volverALaPagina(pagina: unknown, resultado: 'enviado' | 'error', base: string) {
  const ruta = typeof pagina === 'string' && /^\/(?![/\\])/.test(pagina) ? pagina : '/';
  const destino = new URL(ruta, base);
  destino.searchParams.set('formulario', resultado);
  destino.hash = 'formulario';
  return new Response(null, {
    status: 303,
    headers: { Location: destino.pathname + destino.search + destino.hash },
  });
}

export const POST: APIRoute = async ({ request }) => {
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

  if (!esJson)
    return volverALaPagina(entrada.pagina, resultado.ok ? 'enviado' : 'error', request.url);
  // El id interno no sale del servidor.
  const cuerpo = resultado.ok ? { ok: true } : resultado;
  return Response.json(cuerpo, { status: estadoHttp(resultado) });
};
