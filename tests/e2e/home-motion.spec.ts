import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator } from '@playwright/test';

const PAGE = '/es';
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// true si el canvas (o el canvas dentro del elemento) tiene algo dibujado.
const dibujado = async (elemento: Locator) => {
  const esCanvas = await elemento.evaluate((el) => el.tagName === 'CANVAS');
  return (esCanvas ? elemento : elemento.locator('canvas')).evaluate((c: HTMLCanvasElement) => {
    const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    for (let i = 3; i < data.length; i += 4) if (data[i]! > 0) return true;
    return false;
  });
};

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

const scrollHasta = (page: import('@playwright/test').Page, selector: string, margen: number) =>
  page.evaluate(
    ([sel, m]) =>
      window.scrollTo(
        0,
        document.querySelector(sel as string)!.getBoundingClientRect().top +
          scrollY -
          (m as number),
      ),
    [selector, margen],
  );

test.describe('Home · resto del motion', () => {
  test('pieza 02: los logros esperan con candado y se desbloquean con su cifra final', async ({
    page,
  }) => {
    await page.goto(PAGE);
    const tarjetas = page.locator('[data-logros] [data-logro]');
    await expect(tarjetas.first()).toHaveAttribute('data-bloqueado', '');
    // La cifra real sigue en el HTML mientras espera.
    await expect(tarjetas.first().locator('[data-metrica]')).toHaveText('70.000');

    for (const tarjeta of await tarjetas.all()) {
      await tarjeta.scrollIntoViewIfNeeded();
      await expect(tarjeta).not.toHaveAttribute('data-bloqueado', { timeout: 3000 });
    }
    await expect(page.locator('[data-logros] [data-metrica]')).toHaveText(
      ['70.000', '400+', '−60%', 'US$62.000', '2', '10+', '700+'],
      { timeout: 4000 },
    );
  });

  test('riel corto: los tramos se dibujan con el scroll', async ({ page }) => {
    await page.goto(PAGE);
    const tramos = page.locator('[data-trayectoria] [data-tramo]');
    await scrollHasta(page, '[data-trayectoria]', 900);
    await page.waitForTimeout(600);
    const escala = (i: number) =>
      tramos.nth(i).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
    expect(await escala(4)).toBeLessThan(0.05);
    // Hasta que el final de la lista pase la mitad de la pantalla (en celular va en columna).
    await page.evaluate(() => {
      const lista = document.querySelector('[data-trayectoria]')!;
      window.scrollTo(0, lista.getBoundingClientRect().bottom + scrollY - 150);
    });
    await expect.poll(() => escala(4), { timeout: 3000 }).toBeGreaterThan(0.99);
  });

  test('las curvas del hero se dibujan y se mueven con el scroll', async ({ page }) => {
    await page.goto(PAGE);
    const curvas = page.locator('[data-parallax]');
    await expect(curvas.locator('path').first()).toHaveCSS('animation-name', /curva-trazo/);
    await page.waitForTimeout(2500); // GSAP llega cuando el navegador está libre
    await page.mouse.wheel(0, 400);
    await expect
      .poll(() => curvas.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).f), {
        timeout: 3000,
      })
      .toBeGreaterThan(10);
  });

  test('partículas: la franja night se deshace al pasar a Casos', async ({ page }) => {
    await page.goto(PAGE);
    const canvas = page.locator('[data-particulas]');
    await scrollHasta(page, '#casos', 950);
    await page.waitForTimeout(500);
    expect(await dibujado(canvas)).toBe(true);
    await scrollHasta(page, '#casos', 100);
    await expect.poll(() => dibujado(canvas), { timeout: 3000 }).toBe(false);
  });

  test('con reducir movimiento todo queda en su estado final', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(PAGE);
    await expect(page.locator('[data-bloqueado]')).toHaveCount(0);
    await expect(page.locator('[data-parallax] path').first()).toHaveCSS('animation-name', 'none');
    await scrollHasta(page, '#casos', 950);
    await page.waitForTimeout(500);
    expect(await dibujado(page.locator('[data-particulas]'))).toBe(false);
    const tramo = page.locator('[data-trayectoria] [data-tramo]').last();
    expect(await tramo.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    await context.close();
  });
});
