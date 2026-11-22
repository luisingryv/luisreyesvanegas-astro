import { expect, test } from '@playwright/test';

const PAGE = '/es/sobre-mi';

test.describe('Sobre mí · contenido', () => {
  test.use({ javaScriptEnabled: false });

  test('tiene un solo h1 y las secciones en orden', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('Llevo 13 años construyendo tecnología.');
    await expect(page.locator('h2')).toHaveText([
      'Cómo llegué hasta aquí',
      'Cuatro principios',
      'La empresa de desarrollo de software que cofundé en 2020.',
      'Lo que sigo aprendiendo',
      'En el escenario',
      '¿Cómo puedo ayudarte?',
    ]);
  });

  test('muestra todo el contenido de las colecciones', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('[data-chapter]')).toHaveCount(4);
    await expect(page.locator('[data-hito]')).toHaveCount(16);
    await expect(page.getByText('13 años · 16 hitos · 2013–2026')).toBeVisible();
    await expect(page.locator('section[aria-labelledby="principios-titulo"] li')).toHaveCount(4);
    await expect(page.locator('[data-badge]')).toHaveCount(12);
    await expect(page.locator('[data-badge="ok"]')).toHaveCount(8);
    await expect(page.locator('section[aria-labelledby="escenario-titulo"] figure')).toHaveCount(4);
    await expect(page.getByText('Quito, Ecuador · nov 2025').first()).toBeVisible();
  });

  test('no muestra datos pendientes ni testimonios sin contenido real', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('body')).not.toContainText('[');
    await expect(page.locator('#testimonios-titulo')).toHaveCount(0);
    const sena = page.locator('[data-badge]', { hasText: 'Tecnólogo en Análisis' });
    await expect(sena.locator('p')).toHaveText('SENA');
  });

  test('la apertura muestra el retrato en 4:5, optimizado y con alt', async ({ page }) => {
    await page.goto(PAGE);
    const retrato = page.getByRole('img', { name: 'Luis Carlos Reyes Vanegas en su oficina' });
    await expect(retrato).toBeVisible();
    await expect(retrato).toHaveAttribute('fetchpriority', 'high');
    const picture = page.locator('picture', { has: retrato });
    await expect(picture.locator('source[type="image/avif"]')).toHaveCount(1);
    await expect(picture.locator('source[type="image/webp"]')).toHaveCount(1);
    const { width, height } = (await retrato.boundingBox())!;
    expect(width / height).toBeCloseTo(4 / 5, 2);
  });

  test('los enlaces llevan a donde deben', async ({ page }) => {
    await page.goto(PAGE);
    const evolutecc = page.getByRole('link', { name: /Conoce EvolutecC/ });
    await expect(evolutecc).toHaveAttribute(
      'href',
      'https://evolutecc.com/?utm_source=luisreyesvanegas&utm_medium=referral&utm_campaign=sobre-mi',
    );
    await expect(page.getByRole('link', { name: 'Hablemos' })).toHaveAttribute('href', '#contacto');
    await expect(page.locator('#contacto')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Invitarme a una conferencia' })).toHaveAttribute(
      'href',
      '/es/speaker#invitar',
    );
    await expect(page.getByRole('link', { name: /Fuente: gxp\.moonshots\.com/ })).toHaveAttribute(
      'href',
      'https://gxp.moonshots.com/',
    );
    await expect(page.getByRole('link', { name: /Verificar/ })).toHaveCount(3);
  });

  test('todas las imágenes tienen alt', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
  });

  test('SEO: canonical, hreflang y schema.org Person', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page).toHaveTitle('Sobre mí · Luis Reyes Vanegas');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://luisreyesvanegas.com/es/sobre-mi',
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const person = JSON.parse(jsonLd ?? '{}');
    expect(person['@type']).toBe('Person');
    expect(person.worksFor.map((o: { name: string }) => o.name)).toEqual(['EvolutecC', 'Trama AI']);
    expect(person.hasCredential).toHaveLength(8);
  });
});

test.describe('rutas e idiomas', () => {
  test('la raíz lleva al Home en español', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/es$/);
  });

  // EN y PT: publicados el 22 nov 2026.
  test('EN y PT están publicados, cada uno con su idioma', async ({ page }) => {
    for (const idioma of ['en', 'pt']) {
      const respuesta = await page.goto(`/${idioma}/sobre-mi`);
      expect(respuesta?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', idioma);
    }
  });

  test('la página de muestra no existe en producción', async ({ request }) => {
    expect((await request.get('/design-system')).status()).toBe(404);
  });

  test('el selector de idioma lleva a la misma página en cada idioma', async ({ page }) => {
    await page.goto(PAGE);
    // En celular el selector vive dentro del menú cerrado: se revisa en el DOM.
    const idiomas = page.locator('nav[aria-label="Idioma"]').first();
    await expect(idiomas.locator('a[hreflang="en"]')).toHaveAttribute('href', '/en/sobre-mi');
    await expect(idiomas.locator('a[hreflang="pt"]')).toHaveAttribute('href', '/pt/sobre-mi');
    await expect(idiomas.locator('a[aria-current="true"]')).toHaveAttribute('hreflang', 'es');
    await expect(idiomas).toContainText('English');
    await expect(idiomas).toContainText('Português');
  });

  test('en escritorio el selector se abre con un clic y se cierra con Escape', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'en celular los idiomas van a la vista dentro del menú');
    await page.goto(PAGE);
    const selector = page.locator('header details[data-selector-idioma]:visible');
    const ingles = selector.locator('a[hreflang="en"]');
    await expect(ingles).toBeHidden();
    await selector.locator('summary').click();
    await expect(ingles).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(ingles).toBeHidden();
    await selector.locator('summary').click();
    await ingles.click();
    await expect(page).toHaveURL(/\/en\/sobre-mi$/);
  });
});
