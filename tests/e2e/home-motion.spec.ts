import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator } from '@playwright/test';

const PAGE = '/es';
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// true si el canvas tiene algo dibujado.
const dibujado = (campo: Locator) =>
  campo.locator('canvas').evaluate((c: HTMLCanvasElement) => {
    const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    for (let i = 3; i < data.length; i += 4) if (data[i]! > 0) return true;
    return false;
  });

test.describe('pieza 01 · XPRIZE', () => {
  test('espera oculta, cuenta los equipos y termina con la medalla', async ({ page }) => {
    await page.goto(PAGE);
    const campo = page.locator('[data-xprize-field]');
    await expect(campo).toHaveAttribute('data-estado', 'previo');
    await expect(campo.locator('[data-contador]')).toHaveText('0');
    await expect(campo.locator('.xprize-medal')).toHaveCSS('opacity', '0');

    await campo.scrollIntoViewIfNeeded();
    await expect(campo.locator('[data-contador]')).toHaveText(/^Top /, { timeout: 5000 });
    await expect(campo.locator('[data-contador]')).toHaveText('1 de 26.449', { timeout: 8000 });
    await expect(campo).toHaveAttribute('data-estado', 'medalla');
    await expect(campo.locator('[data-fase][data-on]')).toHaveText('Ganador');
    await expect(campo.locator('.xprize-medal')).toHaveCSS('opacity', '1', { timeout: 2000 });
    expect(await dibujado(campo)).toBe(true);

    await page.waitForTimeout(2200); // termina el confeti
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
    expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  test('con reducir movimiento se ve terminada y quieta', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(PAGE);
    const campo = page.locator('[data-xprize-field]');
    await expect(campo).not.toHaveAttribute('data-estado');
    await expect(campo.locator('[data-contador]')).toHaveText('1 de 26.449');
    await expect(campo.locator('.xprize-medal')).toHaveCSS('opacity', '1');
    expect(await dibujado(campo)).toBe(true);
    await context.close();
  });

  test('sin JavaScript queda la medalla con su texto', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(PAGE);
    await expect(
      page.getByRole('img', {
        name: 'Ganador de categoría: Small Business Services, Build with Gemini XPRIZE 2026',
      }),
    ).toBeVisible();
    await context.close();
  });
});

test.describe('pieza 08 · burbujas de casos', () => {
  test('se inflan, flotan y al hacer clic revientan y abren el caso', async ({ page }) => {
    await page.goto(PAGE);
    const casos = page.locator('[data-casos]');
    const glasslake = casos.getByRole('link', { name: 'Glasslake' });
    await expect(glasslake.locator('span')).toHaveCSS('opacity', '0');

    await casos.scrollIntoViewIfNeeded();
    await expect(glasslake.locator('span')).toHaveCSS('opacity', '1', { timeout: 3000 });
    const antes = await glasslake.evaluate((el) => el.style.transform);
    await page.waitForTimeout(400);
    expect(await glasslake.evaluate((el) => el.style.transform)).not.toBe(antes);

    const navegacion = page.waitForRequest((r) => r.url().endsWith('/es/casos/glasslake'));
    // Flota sin parar: Playwright nunca la ve "quieta", así que el clic se fuerza.
    await glasslake.click({ force: true });
    await expect(casos.locator('[data-estallido] i')).toHaveCount(22);
    await navegacion;
  });

  test('con reducir movimiento son enlaces quietos', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(PAGE);
    const glasslake = page.locator('[data-casos]').getByRole('link', { name: 'Glasslake' });
    await glasslake.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    expect(await glasslake.evaluate((el) => el.style.transform)).toBe('');
    await expect(glasslake.locator('span')).toHaveCSS('opacity', '1');
    await expect(glasslake).toHaveAttribute('href', '/es/casos/glasslake');
    await context.close();
  });
});
