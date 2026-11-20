import { randomUUID } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function sinViolaciones(page: Page, ruta: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  expect(violations.map((v) => `${ruta} ${v.id} (${v.nodes.length}): ${v.help}`)).toEqual([]);
}

const ctaHeader = (page: Page, texto: string) =>
  // En celular el botón está dentro del menú cerrado: se revisa el HTML del header.
  page.locator('header a', { hasText: texto }).first();

test.describe('Eventos', () => {
  test('los 15 eventos pasados, del más reciente al más antiguo, sin noticias de ejemplo', async ({
    page,
  }) => {
    await page.goto('/es/eventos');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dónde he hablado');
    const tarjetas = page.locator('#panel-pasados li');
    await expect(tarjetas).toHaveCount(15);
    await expect(tarjetas.first()).toContainText('DevFest Ecuador 2025');
    await expect(tarjetas.first()).toContainText('29 nov 2025 · Quito, Ecuador');
    await expect(tarjetas.first()).toContainText('Charla');
    await expect(tarjetas.last()).toContainText('22 jul 2023 · Barranquilla');
    // El prototipo abrevia septiembre "sep".
    await expect(page.locator('#panel-pasados')).toContainText('20 sep 2025 · Barranquilla');
    await expect(page.locator('#panel-pasados')).toContainText('Podcast');
    await expect(page.locator('#noticias')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('[');
    await expect(ctaHeader(page, 'Invitarme a hablar')).toHaveAttribute(
      'href',
      '/es/speaker#invitar',
    );
    await expect(
      page.locator('header a[aria-current="page"]', { hasText: 'Eventos' }),
    ).not.toHaveCount(0);
  });

  test('las pestañas cambian entre próximos y pasados, también con el teclado', async ({
    page,
  }) => {
    await page.goto('/es/eventos');
    const proximos = page.getByRole('tab', { name: 'Próximos' });
    const pasados = page.getByRole('tab', { name: 'Pasados' });
    await expect(pasados).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-proximos')).toBeHidden();

    await proximos.click();
    await expect(page.locator('#panel-proximos')).toBeVisible();
    await expect(page.locator('#panel-pasados')).toBeHidden();
    await expect(page.locator('#panel-proximos')).toContainText(
      'Por ahora no tengo eventos anunciados.',
    );
    await expect(page.getByRole('link', { name: /Invítame/ })).toHaveAttribute(
      'href',
      '/es/speaker#invitar',
    );

    await proximos.press('ArrowRight');
    await expect(pasados).toBeFocused();
    await expect(page.locator('#panel-pasados')).toBeVisible();
  });

  test('sin JavaScript se ven los dos paneles y no hay pestañas', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/es/eventos');
    await expect(page.getByRole('tablist')).toBeHidden();
    await expect(page.locator('#panel-proximos')).toBeVisible();
    await expect(page.locator('#panel-pasados li')).toHaveCount(15);
    await context.close();
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto('/es/eventos');
    await sinViolaciones(page, '/es/eventos');
    await page.getByRole('tab', { name: 'Próximos' }).click();
    await sinViolaciones(page, '/es/eventos (próximos)');
  });
});

test.describe('Charlas', () => {
  test('hero, seis eventos, temáticas, bio, formatos y rider; sin testimonios de ejemplo', async ({
    page,
  }) => {
    await page.goto('/es/speaker');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Charlas de tecnología, IA y liderazgo, preparadas para tu audiencia.',
    );
    const escenario = page.locator('section', {
      has: page.getByRole('heading', { name: 'Algunos de los eventos en los que he hablado' }),
    });
    await expect(escenario.locator('ul > li figure')).toHaveCount(6);
    await expect(escenario.getByRole('link', { name: /Ver todos los eventos/ })).toHaveAttribute(
      'href',
      '/es/eventos',
    );
    await expect(page.locator('.cinta').first()).toContainText('Adopción de IA con Claude');
    await expect(page.locator('#bio li')).toHaveCount(3);
    await expect(page.getByText('Rider técnico')).toBeVisible();
    await expect(page.locator('main')).not.toContainText('EJEMPLO');
    await expect(page.locator('main')).not.toContainText('one-sheet');
    await expect(page.locator('main')).not.toContainText('[');
    await expect(ctaHeader(page, 'Invitarme a hablar')).toHaveAttribute('href', '#invitar');
  });

  test('pieza 10: cada ciudad abre sus eventos', async ({ page }) => {
    await page.goto('/es/speaker');
    const mapa = page.locator('[data-mapa]');
    await mapa.scrollIntoViewIfNeeded();
    await expect(mapa).toContainText(
      '3 países · 3 ciudades · 14 eventos · 700+ asistentes en DevFest Ecuador',
    );
    const barranquilla = mapa.getByRole('button', { name: /Barranquilla/ });
    await expect(barranquilla).toHaveAttribute('aria-pressed', 'true');
    await expect(mapa.locator('[data-panel-ciudad="barranquilla"]')).toContainText('Y 7 más');

    await mapa.getByRole('button', { name: /Quito/ }).click({ force: true });
    await expect(barranquilla).toHaveAttribute('aria-pressed', 'false');
    const quito = mapa.locator('[data-panel-ciudad="quito"]');
    await expect(quito).toBeVisible();
    await expect(quito).toContainText('DevFest Ecuador 2025');
    await expect(quito).toContainText('Cursor meetup Quito');
    await expect(mapa.locator('[data-panel-ciudad="barranquilla"]')).toBeHidden();
  });

  test('copiar la bio deja el texto en el portapapeles y lo confirma', async ({
    page,
    context,
    isMobile,
  }) => {
    test.skip(isMobile, 'el permiso del portapapeles se prueba en escritorio');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/es/speaker');
    const boton = page.locator('#bio button').first();
    await boton.click();
    await expect(boton).toHaveText('Copiada ✓');
    const copiado = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiado).toMatch(/^Luis Reyes Vanegas es arquitecto de soluciones cloud e IA/);
    await expect(boton).toHaveText('Copiar', { timeout: 4000 });
  });

  test('la cinta de temáticas se pausa con su botón y queda quieta con reducir movimiento', async ({
    browser,
    page,
  }) => {
    await page.goto('/es/speaker');
    const pista = page.locator('.cinta-pista').first();
    await expect(pista).toHaveCSS('animation-play-state', 'running');
    await page.getByRole('button', { name: 'Pausar la cinta' }).click();
    await expect(pista).toHaveCSS('animation-play-state', 'paused');

    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const quieta = await context.newPage();
    await quieta.goto('/es/speaker');
    await expect(quieta.locator('.cinta-pista').first()).toHaveCSS('animation-name', 'none');
    await expect(quieta.getByRole('button', { name: 'Pausar la cinta' })).toBeHidden();
    await context.close();
  });

  test('la invitación se guarda como solicitud "speaker"', async ({ page, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    await page.goto('/es/speaker');
    const form = page.locator('#invitar form');
    await form.getByLabel('Nombre del evento').fill('DevFest Barranquilla 2026');
    await form.getByLabel('Fecha').fill('2026-11-28');
    await form.getByLabel('Ciudad o en línea').fill('Barranquilla');
    await form.getByLabel('Audiencia').fill('300 desarrolladores');
    await form.getByLabel('Presupuesto para la charla').selectOption('comunidad');
    await form.getByLabel('Correo').fill(`gdg-${randomUUID()}@ejemplo.com`);
    await form.getByLabel(/Acepto la/).check();
    const peticion = page.waitForRequest((r) => r.url().endsWith('/api/solicitudes'));
    await form.getByRole('button', { name: 'Enviar invitación' }).click();
    expect((await peticion).postDataJSON()).toMatchObject({
      formulario: 'speaker',
      evento: 'DevFest Barranquilla 2026',
      fecha: '2026-11-28',
      ciudad: 'Barranquilla',
      presupuesto: 'comunidad',
      acepta: true,
    });
    await expect(page.locator('#formulario-enviado')).toHaveText(
      'Gracias. Recibí tu invitación y te respondo pronto.',
    );
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto('/es/speaker');
    await sinViolaciones(page, '/es/speaker');
  });
});

test.describe('Prensa', () => {
  test('datos rápidos, bio, fotos, logos y datos del XPRIZE con su fuente', async ({ page }) => {
    await page.goto('/es/prensa');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kit de prensa');
    await expect(page.locator('main dl').first().locator('dt')).toHaveCount(5);
    await expect(page.locator('#bio li')).toHaveCount(3);
    const fotos = page.locator('section', {
      has: page.getByRole('heading', { name: 'Fotos en alta resolución' }),
    });
    await expect(fotos.locator('li')).toHaveCount(4);
    await expect(fotos.locator('a[download]')).toHaveCount(4);
    // Sin crédito (Luis, 20 nov 2026): la sección tampoco lo promete.
    await expect(fotos).not.toContainText('rédito');
    const logos = page.locator('section', { has: page.getByRole('heading', { name: 'Mi logo' }) });
    await expect(logos.locator('a[download]')).toHaveCount(8);
    await expect(page.getByRole('link', { name: /gxp\.moonshots\.com/ })).toHaveAttribute(
      'href',
      'https://gxp.moonshots.com/',
    );
    await expect(page.locator('main')).not.toContainText('[');
    await expect(ctaHeader(page, 'Pedir una entrevista')).toHaveAttribute(
      'href',
      '#contacto-prensa',
    );
  });

  test('el kit completo se descarga como .zip', async ({ page, request, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    await page.goto('/es/prensa');
    await expect(page.getByRole('link', { name: 'Descargar kit (.zip)' })).toHaveAttribute(
      'href',
      '/es/prensa/kit.zip',
    );
    const r = await request.get('/es/prensa/kit.zip');
    expect(r.ok()).toBe(true);
    const zip = await r.body();
    expect(zip.subarray(0, 2).toString()).toBe('PK');
    const contenido = zip.toString('latin1');
    for (const archivo of ['bio.txt', 'datos.txt', 'fotos/', 'logos/monograma-lr-color.svg']) {
      expect(contenido).toContain(`kit-de-prensa-luis-reyes-vanegas/${archivo}`);
    }
  });

  test('el contacto de prensa se guarda como solicitud "prensa"', async ({ page, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    await page.goto('/es/prensa');
    const form = page.locator('#contacto-prensa form');
    await expect(form).toContainText('Acepto la política de tratamiento de datos.');
    await form.getByLabel('Nombre').fill('Laura Gómez');
    await form.getByLabel('Medio').fill('El Heraldo');
    await form.getByLabel('Correo').fill(`laura-${randomUUID()}@ejemplo.com`);
    await form.getByLabel('¿Qué necesitas?').selectOption('declaracion');
    await form.getByLabel('Fecha de cierre').fill('2026-12-01');
    await form.getByLabel('Detalles').fill('Nota sobre el XPRIZE.');
    await form.getByLabel(/Acepto la/).check();
    const peticion = page.waitForRequest((r) => r.url().endsWith('/api/solicitudes'));
    await form.getByRole('button', { name: 'Enviar' }).click();
    expect((await peticion).postDataJSON()).toMatchObject({
      formulario: 'prensa',
      nombre: 'Laura Gómez',
      medio: 'El Heraldo',
      necesidad: 'declaracion',
      cierre: '2026-12-01',
    });
    await expect(page.locator('#formulario-enviado')).toHaveText(
      'Gracias. Recibí tu solicitud y te respondo pronto.',
    );
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto('/es/prensa');
    await sinViolaciones(page, '/es/prensa');
  });

  test('las tres páginas están en el sitemap y en el pie', async ({ page, request, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const ruta of ['/es/eventos', '/es/speaker', '/es/prensa']) {
      expect(xml).toContain(`<loc>https://luisreyesvanegas.com${ruta}</loc>`);
    }
    await page.goto('/es');
    const pie = page.locator('footer');
    await expect(pie.getByRole('link', { name: 'Charlas' })).toHaveAttribute('href', '/es/speaker');
    await expect(pie.getByRole('link', { name: 'Prensa' })).toHaveAttribute('href', '/es/prensa');
  });
});

test('Charlas sin JavaScript: los tres paneles del mapa y sin botones que no funcionan', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/es/speaker');
  for (const ciudad of ['barranquilla', 'quito', 'lima']) {
    await expect(page.locator(`[data-panel-ciudad="${ciudad}"]`)).toBeVisible();
  }
  await expect(page.locator('[data-copiar]').first()).toBeHidden();
  await expect(page.getByRole('button', { name: 'Pausar la cinta' })).toBeHidden();
  await context.close();
});
