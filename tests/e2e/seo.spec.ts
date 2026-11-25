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
