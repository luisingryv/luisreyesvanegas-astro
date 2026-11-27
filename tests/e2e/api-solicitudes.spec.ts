import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

// Contra el build de producción y la base de pruebas (DATABASE_URL_TEST).
const URL_API = '/api/solicitudes';
const correo = () => `prueba-${randomUUID()}@ejemplo.com`;
const base = () => ({
  formulario: 'general',
  nombre: 'Ana Pérez',
  pais: 'CO',
  telefono: '300 123 4567',
  email: correo(),
  mensaje: 'Quiero conversar sobre la migración a AWS.',
  pagina: '/es/sobre-mi',
});

// La API es una sola: basta con probarla desde un proyecto.
test.skip(({ isMobile }) => isMobile, 'solo escritorio');

test.describe('POST /api/solicitudes', () => {
  test('con JSON guarda y responde 201 sin exponer el id', async ({ request }) => {
    const r = await request.post(URL_API, { data: { ...base(), acepta: true } });
    expect(r.status()).toBe(201);
    expect(await r.json()).toEqual({ ok: true });
  });

  test('con JSON inválido responde 400 con un código por campo', async ({ request }) => {
    const r = await request.post(URL_API, { data: { ...base(), email: 'ana@', acepta: false } });
    expect(r.status()).toBe(400);
    expect(await r.json()).toEqual({
      ok: false,
      motivo: 'validacion',
      errores: { email: 'invalido', acepta: 'debe-aceptar' },
    });
  });

  // Astro arma la URL con el Host solo si está en security.allowedDomains; si no, usa
  // localhost:<puerto>. Por eso aquí el origen de un formulario propio es localhost.
  test('sin JavaScript vuelve a la página con el resultado', async ({ request, baseURL }) => {
    const origen = new URL(baseURL!);
    origen.hostname = 'localhost';
    const enviar = (form: Record<string, string>) =>
      request.post(URL_API, { form, headers: { Origin: origen.origin }, maxRedirects: 0 });

    const ok = await enviar({ ...base(), acepta: 'on' });
    expect(ok.status()).toBe(303);
    expect(ok.headers().location).toBe('/es/sobre-mi?formulario=enviado#formulario-enviado');

    const error = await enviar({ ...base(), pagina: 'https://otro.com/' });
    expect(error.status()).toBe(303);
    // Nunca redirige fuera del sitio.
    expect(error.headers().location).toBe('/?formulario=error#formulario-error');
  });

  test('detrás del proxy de Hostinger acepta el formulario del dominio en https', async ({
    request,
  }) => {
    const r = await request.post(URL_API, {
      form: { ...base(), acepta: 'on' },
      headers: {
        Host: 'luisreyesvanegas.com',
        'X-Forwarded-Proto': 'https',
        Origin: 'https://luisreyesvanegas.com',
      },
      maxRedirects: 0,
    });
    expect(r.status()).toBe(303);
    expect(r.headers().location).toBe('/es/sobre-mi?formulario=enviado#formulario-enviado');
  });

  test('rechaza formularios enviados desde otro dominio', async ({ request }) => {
    const r = await request.post(URL_API, {
      form: { ...base(), acepta: 'on' },
      headers: { Origin: 'https://sitio-malicioso.example' },
      maxRedirects: 0,
    });
    expect(r.status()).toBe(403);
  });

  test('frena envíos repetidos del mismo correo', async ({ request }) => {
    const datos = { ...base(), acepta: true };
    for (let i = 0; i < 3; i++) {
      expect((await request.post(URL_API, { data: datos })).status()).toBe(201);
    }
    const r = await request.post(URL_API, { data: datos });
    expect(r.status()).toBe(429);
    expect(await r.json()).toEqual({ ok: false, motivo: 'demasiadas' });
  });

  test('rechaza cuerpos ilegibles o demasiado grandes', async ({ request }) => {
    const ilegible = await request.post(URL_API, {
      data: '{no es json',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(ilegible.status()).toBe(400);
    const grande = await request.post(URL_API, {
      data: { ...base(), acepta: true, mensaje: 'x'.repeat(40_000) },
    });
    expect(grande.status()).toBe(413);
  });
});
