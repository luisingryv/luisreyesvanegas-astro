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

  test('robots.txt deja fuera la API y la página de muestra y apunta al sitemap', async ({
    request,
  }) => {
    const texto = await (await request.get('/robots.txt')).text();
    expect(texto).toContain('Disallow: /api/');
    expect(texto).toContain('Disallow: /design-system');
    expect(texto).toContain('Sitemap: https://luisreyesvanegas.com/sitemap.xml');
  });
});
