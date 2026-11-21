import { expect, test } from '@playwright/test';

// Noticias (21 nov 2026): nada se publica sin aprobación de Luis. Mientras no haya noticias
// publicadas, la página existe sin indexarse, no está en el menú, ni en el Home, ni en el sitemap.
test.describe('Noticias sin publicaciones', () => {
  test('la página muestra el estado vacío y no se indexa', async ({ page }) => {
    await page.goto('/es/noticias');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Lo que estoy leyendo sobre nube e IA',
    );
    await expect(page.locator('main')).toContainText(
      'Pronto publicaré aquí las noticias que estoy siguiendo.',
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test('no aparece en el menú ni en el Home', async ({ page }) => {
    await page.goto('/es');
    await expect(page.locator('header nav').getByRole('link', { name: 'Noticias' })).toHaveCount(0);
    await expect(page.locator('#noticias-home-titulo')).toHaveCount(0);
  });

  test('el sitemap no la incluye y el RSS sale vacío', async ({ request, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).not.toContain('/es/noticias');
    const rss = await request.get('/es/noticias/rss.xml');
    // El servidor sirve el archivo estático como XML (application/xml o application/rss+xml).
    expect(rss.headers()['content-type']).toMatch(/xml/);
    const xml = await rss.text();
    expect(xml).toContain('<channel>');
    expect(xml).not.toContain('<item>');
  });
});

test.describe('canonical de las páginas dinámicas', () => {
  test('cada caso apunta a su propia URL', async ({ page }) => {
    await page.goto('/es/casos/mandaos');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://luisreyesvanegas.com/es/casos/mandaos',
    );
  });
});
