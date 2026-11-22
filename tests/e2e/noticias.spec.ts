import { expect, test } from '@playwright/test';

// Noticias (21 nov 2026): nada se publica sin aprobación de Luis. La primera noticia publicada
// es la del 22 nov (AWS y Accenture, gasto en tokens de IA en Bedrock). Los borradores no salen
// en producción.
test.describe('Noticias publicadas', () => {
  test('la página lista las noticias y se indexa', async ({ page }) => {
    await page.goto('/es/noticias');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Lo que estoy leyendo sobre nube e IA',
    );
    await expect(page.locator('article.tarjeta').first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText('Borrador');
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://luisreyesvanegas.com/es/noticias',
    );
  });

  test('está en el menú y en el Home', async ({ page }) => {
    await page.goto('/es');
    // En celular el menú está cerrado: se busca el enlace aunque no se vea.
    await expect(page.locator('header a[href="/es/noticias"]').first()).toBeAttached();
    await expect(page.locator('#noticias-home-titulo')).toBeVisible();
  });

  test('cada noticia cita su fuente y tiene sus datos para buscadores', async ({ page }) => {
    await page.goto('/es/noticias/2026-11-22-costos-ia-bedrock');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'AWS y Accenture muestran seis palancas para bajar el gasto en tokens de IA en Bedrock',
    );
    await expect(
      page.getByRole('link', { name: /Leer la noticia original en AWS Machine Learning Blog/ }),
    ).toHaveAttribute('href', /^https:\/\/aws\.amazon\.com\//);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://luisreyesvanegas.com/es/noticias/2026-11-22-costos-ia-bedrock',
    );
    // Portada (22 nov): una ilustración de la noticia, con su alt; sin crédito porque es propia.
    await expect(page.locator('article figure img')).toHaveAttribute('alt', /^Ilustración: /);
    await expect(page.locator('article figure figcaption')).toHaveCount(0);
    const jsonLd = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '{}',
    );
    expect(jsonLd['@type']).toBe('BlogPosting');
    expect(jsonLd.citation).toMatch(/^https:\/\/aws\.amazon\.com\//);
  });

  test('el sitemap y el RSS incluyen las publicadas', async ({ request, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('https://luisreyesvanegas.com/es/noticias</loc>');
    expect(sitemap).toContain('/es/noticias/2026-11-22-costos-ia-bedrock</loc>');
    const rss = await request.get('/es/noticias/rss.xml');
    // El servidor sirve el archivo estático como XML (application/xml o application/rss+xml).
    expect(rss.headers()['content-type']).toMatch(/xml/);
    const xml = await rss.text();
    expect(xml).toContain('<item>');
    expect(xml).toContain('/es/noticias/2026-11-22-costos-ia-bedrock');
  });
});

test.describe('noticias en otros idiomas', () => {
  // Las noticias están en español: inglés y portugués no las anuncian (22 nov 2026).
  test('una noticia en español solo se anuncia en español', async ({ page }) => {
    await page.goto('/es/noticias/2026-11-22-costos-ia-bedrock');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(0);
    const idiomas = page.locator('nav[aria-label="Idioma"]').first();
    await expect(idiomas.locator('a[hreflang="en"]')).toHaveAttribute('href', '/en');
    await expect(idiomas.locator('a[hreflang="pt"]')).toHaveAttribute('href', '/pt');
  });

  test('sin noticias en inglés, Noticias no está en su menú ni en su sitemap', async ({
    page,
    request,
  }) => {
    await page.goto('/en');
    await expect(page.locator('header a[href="/en/noticias"]')).toHaveCount(0);
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).not.toContain('/en/noticias');
    expect(sitemap).not.toContain('/pt/noticias');
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
