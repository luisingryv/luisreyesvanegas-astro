import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => isMobile, 'solo escritorio');

const meta = (page: import('@playwright/test').Page, selector: string) =>
  page.locator(selector).getAttribute('content');

test.describe('SEO base', () => {
  test('Sobre mí trae Open Graph y Twitter completos', async ({ page, request }) => {
    await page.goto('/es/sobre-mi');
    expect(await meta(page, 'meta[property="og:type"]')).toBe('profile');
    expect(await meta(page, 'meta[property="og:title"]')).toBe(await page.title());
    expect(await meta(page, 'meta[property="og:description"]')).toBe(
      await meta(page, 'meta[name="description"]'),
    );
    expect(await meta(page, 'meta[property="og:url"]')).toBe(
      'https://luisreyesvanegas.com/es/sobre-mi',
    );
    expect(await meta(page, 'meta[property="og:locale"]')).toBe('es_LA');
    expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await meta(page, 'meta[property="og:image:alt"]')).toBeTruthy();

    // La imagen es absoluta al dominio; aquí se pide la misma ruta al servidor de pruebas.
    const imagen = new URL((await meta(page, 'meta[property="og:image"]'))!);
    expect(imagen.origin).toBe('https://luisreyesvanegas.com');
    const respuesta = await request.get(imagen.pathname);
    expect(respuesta.ok()).toBe(true);
    expect(respuesta.headers()['content-type']).toBe('image/jpeg');
    expect((await respuesta.body()).length).toBeLessThan(300_000);
  });

  test('sitemap.xml lista las páginas publicadas con hreflang', async ({ request }) => {
    const r = await request.get('/sitemap.xml');
    expect(r.ok()).toBe(true);
    expect(r.headers()['content-type']).toContain('application/xml');
    const xml = await r.text();
    expect(xml).toContain('<loc>https://luisreyesvanegas.com/es/sobre-mi</loc>');
    expect(xml).toContain('hreflang="x-default"');
    // EN y PT: publicados el 22 nov 2026. Las páginas internas no entran.
    expect(xml).toContain('<loc>https://luisreyesvanegas.com/en/sobre-mi</loc>');
    expect(xml).toContain('<loc>https://luisreyesvanegas.com/pt/sobre-mi</loc>');
    expect(xml).not.toContain('design-system');
    // Cada URL lleva su fecha de último cambio (26 nov 2026).
    expect(xml.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)?.length).toBe(
      xml.match(/<url>/g)?.length,
    );
  });

  test('robots.txt deja fuera la API y la página de muestra para todos los robots, apunta al sitemap y a llms.txt', async ({
    request,
  }) => {
    const texto = await (await request.get('/robots.txt')).text();
    expect(texto).toContain('Disallow: /api/');
    expect(texto).toContain('Disallow: /design-system');
    // Un solo grupo: un grupo propio de un robot de IA haría que ignore los Disallow generales.
    expect(texto.match(/User-agent:/g)).toHaveLength(1);
    expect(texto).toContain('User-agent: *');
    expect(texto).toContain('Sitemap: https://luisreyesvanegas.com/sitemap.xml');
    expect(texto).toContain('https://luisreyesvanegas.com/llms.txt');
  });

  test('llms.txt resume el sitio solo con textos aprobados', async ({ request }) => {
    const r = await request.get('/llms.txt');
    expect(r.ok()).toBe(true);
    expect(r.headers()['content-type']).toContain('text/plain');
    const texto = await r.text();
    expect(texto).toContain('# Luis Carlos Reyes Vanegas');
    expect(texto).toContain('Arquitecto de soluciones cloud e IA');
    // Trama es propio; Ofilix es de un aliado; NeoMKT es un cliente, no un producto.
    expect(texto).toContain('Trama AI (Propio');
    expect(texto).toContain('Ofilix (Aliado');
    expect(texto).not.toContain('NeoMKT');
    expect(texto).toContain('https://luisreyesvanegas.com/es/casos/glasslake');
  });
});

// Agentes de IA (26 nov 2026): datos estructurados, Markdown, cabecera Link y WebMCP.
test.describe('Listo para agentes de IA', () => {
  test('el Home describe a Luis, EvolutecC, el contacto y el precio de la sesión en JSON-LD', async ({
    page,
  }) => {
    await page.goto('/es');
    const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
    const grafo = bloques
      .map((b) => JSON.parse(b) as { '@graph'?: Record<string, unknown>[] })
      .flatMap((b) => b['@graph'] ?? []);
    const tipo = (t: string) => grafo.find((n) => n['@type'] === t)!;
    expect(tipo('WebSite').url).toBe('https://luisreyesvanegas.com/');
    const luis = tipo('Person');
    expect(luis.sameAs).toContain(
      'https://www.linkedin.com/in/luis-carlos-reyes-vanegas-803306170/',
    );
    expect(JSON.stringify(luis.contactPoint)).toContain('legal@luisreyesvanegas.com');
    expect(luis.makesOffer).toMatchObject({ price: 450, priceCurrency: 'USD' });
    expect(tipo('Organization')).toMatchObject({ name: 'EvolutecC', foundingDate: '2020-08-28' });
    expect(tipo('AboutPage').url).toBe('https://luisreyesvanegas.com/es/sobre-mi');
    await expect(page.locator('link[rel="author"]')).toHaveAttribute(
      'href',
      'https://luisreyesvanegas.com/es/sobre-mi',
    );
    await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute(
      'href',
      'https://luisreyesvanegas.com/es.md',
    );
  });

  test('el Home existe en Markdown en cada idioma, con sus textos', async ({ request }) => {
    for (const [idioma, frase] of [
      ['es', 'Innovación y escalabilidad en la nube'],
      ['en', '## '],
      ['pt', '## '],
    ] as const) {
      const r = await request.get(`/${idioma}.md`);
      expect(r.ok()).toBe(true);
      expect(r.headers()['content-type']).toContain('text/markdown');
      const texto = await r.text();
      expect(texto).toContain(frase);
      expect(texto).toContain(`https://luisreyesvanegas.com/${idioma}/sobre-mi`);
      expect(texto).not.toContain('undefined');
    }
  });

  test('la raíz entrega Markdown a quien lo pide y siempre anuncia sus recursos con Link', async ({
    request,
  }) => {
    const md = await request.get('/', { headers: { Accept: 'text/markdown' }, maxRedirects: 0 });
    expect(md.status()).toBe(200);
    expect(md.headers()['content-type']).toContain('text/markdown');
    expect(await md.text()).toContain('# Innovación y escalabilidad en la nube');

    const html = await request.get('/', { headers: { Accept: 'text/html' }, maxRedirects: 0 });
    expect(html.status()).toBe(302);
    expect(html.headers()['location']).toBe('/es');
    expect(html.headers()['link']).toContain('<https://luisreyesvanegas.com/llms.txt>');
  });

  test('registra herramientas WebMCP que leen el Home y abren páginas', async ({ page }) => {
    await page.addInitScript(() => {
      const registradas: { name: string; execute: (e: object) => Promise<unknown> }[] = [];
      Object.defineProperty(navigator, 'modelContext', {
        value: { registerTool: (h: (typeof registradas)[number]) => registradas.push(h) },
      });
      (window as unknown as { registradas: typeof registradas }).registradas = registradas;
    });
    await page.goto('/en');
    const nombres = await page.evaluate(() =>
      (window as unknown as { registradas: { name: string }[] }).registradas.map((h) => h.name),
    );
    expect(nombres).toEqual(['leer_inicio', 'abrir_pagina']);
    const resultado = await page.evaluate(() =>
      (
        window as unknown as {
          registradas: { execute: (e: object) => Promise<{ content: { text: string }[] }> }[];
        }
      ).registradas[0]!.execute({}),
    );
    expect(resultado.content[0]!.text).toContain('https://luisreyesvanegas.com/en/sobre-mi');
  });
});
