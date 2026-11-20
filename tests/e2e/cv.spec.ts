import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const PDF = '/cv/luis-carlos-reyes-vanegas-cv-es.pdf';

test.describe('CV', () => {
  test('header mínimo, hero, logros, experiencia y formación como el prototipo', async ({
    page,
  }) => {
    await page.goto('/es/cv');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Luis Carlos Reyes Vanegas');
    await expect(
      page.locator('header').getByRole('navigation', { name: 'Navegación principal' }),
    ).toHaveCount(0);
    await expect(page.locator('header a', { hasText: 'Descargar CV' })).toHaveAttribute(
      'href',
      PDF,
    );
    await expect(page.getByRole('link', { name: 'Descargar CV (ES)' })).toHaveAttribute(
      'href',
      PDF,
    );
    await expect(page.locator('#descargar dt')).toHaveText([
      'Modalidad',
      'Nubes',
      'Idiomas',
      'Destacado',
    ]);
    await expect(
      page.locator('section', { hasText: 'Logros con cifra y fuente' }).locator('li'),
    ).toHaveCount(6);
    await expect(page.locator('.experiencia')).toHaveCount(8);
    await expect(page.locator('h2:has-text("Formación y certificaciones") + ul > li')).toHaveCount(
      10,
    );
    // Lo que no está aprobado no se publica.
    await expect(page.locator('main')).not.toContainText('Download CV (EN)');
    await expect(page.locator('main')).not.toContainText('Recomendaciones');
    await expect(page.locator('main')).not.toContainText('[');
    await expect(
      page.locator('#entrevista').getByRole('link', { name: 'Agendar entrevista' }),
    ).toHaveAttribute('href', '/es/contacto#general');
  });

  test('el PDF del CV existe', async ({ request, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    const r = await request.get(PDF);
    expect(r.ok()).toBe(true);
    expect(r.headers()['content-type']).toContain('application/pdf');
    expect((await r.body()).subarray(0, 4).toString()).toBe('%PDF');
  });

  test('pieza 12: 29 competencias, filtro por grupo y resaltado por nivel', async ({ page }) => {
    await page.goto('/es/cv');
    const pieza = page.locator('[data-competencias]');
    await expect(pieza.locator('.competencia')).toHaveCount(29);
    await expect(pieza.locator('.competencia', { hasText: 'Gemini' })).toContainText(
      'nivel 5 de 5',
    );

    await pieza.getByRole('button', { name: 'IA', exact: true }).click();
    await expect(pieza.locator('[data-grupo-competencias]:visible')).toHaveCount(1);
    await expect(pieza.locator('.competencia:visible')).toHaveCount(4);
    await pieza.getByRole('button', { name: 'Todo', exact: true }).click();
    await expect(pieza.locator('[data-grupo-competencias]:visible')).toHaveCount(4);

    await pieza.getByRole('button', { name: 'Nivel 3' }).click();
    await expect(pieza.locator('.competencia.activa')).toHaveCount(2);
    await expect(pieza.locator('.competencia.activa').first()).toContainText('Angular');
    await pieza.getByRole('button', { name: 'Nivel 3' }).click();
    await expect(pieza.locator('.competencia.activa')).toHaveCount(0);
  });

  test('con reducir movimiento y sin JavaScript las barras están completas', async ({
    browser,
  }) => {
    const reducido = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await reducido.newPage();
    await page.goto('/es/cv');
    await page.locator('[data-competencias]').scrollIntoViewIfNeeded();
    await expect(page.locator('.lleno').first()).toHaveCSS('transform', 'none');
    await reducido.close();

    const sinJs = await browser.newContext({ javaScriptEnabled: false });
    const estatica = await sinJs.newPage();
    await estatica.goto('/es/cv');
    await expect(estatica.locator('[data-filtro-grupos]')).toBeHidden();
    await expect(estatica.locator('[data-grupo-competencias]')).toHaveCount(4);
    await expect(estatica.locator('.competencia').first()).toBeVisible();
    await sinJs.close();
  });

  test('se imprime sin header, pie ni botones', async ({ page }) => {
    await page.goto('/es/cv');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('header')).toBeHidden();
    await expect(page.locator('#entrevista')).toBeHidden();
    await expect(page.locator('[data-filtro-grupos]')).toBeHidden();
    await expect(page.locator('.competencia').last()).toBeVisible();
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto('/es/cv');
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
    expect(violations.map((v) => `${v.id} (${v.nodes.length}): ${v.help}`)).toEqual([]);
  });

  test('está en el sitemap', async ({ request, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain('<loc>https://luisreyesvanegas.com/es/cv</loc>');
  });
});
