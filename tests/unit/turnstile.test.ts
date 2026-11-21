import { describe, expect, it, vi } from 'vitest';
import { verificarTurnstile } from '../../src/lib/formularios/turnstile';

const responder = (cuerpo: unknown, ok = true) =>
  vi.fn(async () => ({ ok, json: async () => cuerpo }) as Response);

describe('verificación de Cloudflare Turnstile', () => {
  it('acepta el token cuando Siteverify responde success', async () => {
    const fetcher = responder({ success: true });
    expect(await verificarTurnstile('XXXX.DUMMY.TOKEN.XXXX', 'secreto', { fetcher })).toBe(
      'valido',
    );
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(JSON.parse(String(init.body))).toEqual({
      secret: 'secreto',
      response: 'XXXX.DUMMY.TOKEN.XXXX',
    });
  });

  it('rechaza un token inválido, vacío o demasiado largo sin llamar a Cloudflare', async () => {
    const fetcher = responder({ success: false, 'error-codes': ['invalid-input-response'] });
    expect(await verificarTurnstile('malo', 'secreto', { fetcher })).toBe('invalido');
    const nunca = responder({ success: true });
    expect(await verificarTurnstile('', 'secreto', { fetcher: nunca })).toBe('invalido');
    expect(await verificarTurnstile('x'.repeat(2049), 'secreto', { fetcher: nunca })).toBe(
      'invalido',
    );
    expect(await verificarTurnstile(undefined, 'secreto', { fetcher: nunca })).toBe('invalido');
    expect(nunca).not.toHaveBeenCalled();
  });

  it('si Cloudflare no responde, lo dice para dejar pasar la solicitud', async () => {
    const caido = vi.fn(async () => {
      throw new Error('red');
    });
    expect(await verificarTurnstile('token', 'secreto', { fetcher: caido })).toBe('sin-respuesta');
    expect(await verificarTurnstile('token', 'secreto', { fetcher: responder({}, false) })).toBe(
      'sin-respuesta',
    );
  });
});
