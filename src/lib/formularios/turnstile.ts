// Verificación de Cloudflare Turnstile en el servidor (Siteverify).
// Documentación: developers.cloudflare.com/turnstile/get-started/server-side-validation
// - El token dura 5 minutos, se usa una sola vez y mide hasta 2048 caracteres.
// - Si Cloudflare no responde (red o tiempo de espera), se deja pasar: siguen el campo trampa
//   y el límite por correo, y no se pierde una solicitud real por una caída ajena.

export const CAMPO_TURNSTILE = 'cf-turnstile-response';
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export type ResultadoTurnstile = 'valido' | 'invalido' | 'sin-respuesta';

export async function verificarTurnstile(
  token: unknown,
  secreto: string,
  { ip, fetcher = fetch }: { ip?: string; fetcher?: typeof fetch } = {},
): Promise<ResultadoTurnstile> {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) return 'invalido';
  try {
    const respuesta = await fetcher(SITEVERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secreto, response: token, ...(ip && { remoteip: ip }) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!respuesta.ok) return 'sin-respuesta';
    const cuerpo = (await respuesta.json()) as { success?: boolean };
    return cuerpo.success === true ? 'valido' : 'invalido';
  } catch {
    return 'sin-respuesta';
  }
}
