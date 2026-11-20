import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';

const PAGE = '/es';

test.describe('Home · contenido', () => {
  test('hero con premio, botones y retrato', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Innovación y escalabilidad en la nube, con resultados medibles.',
    );
    await expect(
      page.getByRole('link', { name: /Ganador de categoría · Build with Gemini XPRIZE 2026/ }),
    ).toHaveAttribute('href', 'https://gxp.moonshots.com/');
    // Sin URL de la agenda, "Agendar" lleva al formulario del mismo Home.
    await expect(
      page.getByRole('link', { name: 'Agendar sesión de arquitectura' }),
    ).toHaveAttribute('href', '#agenda');
    await expect(page.getByRole('link', { name: 'Invitarme a hablar' })).toHaveAttribute(
      'href',
      '/es/speaker',
    );
    await expect(
      page.getByRole('img', { name: 'Luis Carlos Reyes Vanegas en su oficina' }),
    ).toBeVisible();
  });

  test('router con dos tarjetas y siete logros en orden con su fuente', async ({ page }) => {
    await page.goto(PAGE);
    await expect(
      page.getByRole('link', { name: /Necesito resolver algo en mi nube/ }),
    ).toHaveAttribute('href', '/es/consultoria');
    await expect(page.getByRole('link', { name: /Quiero ver o invertir/ })).toHaveAttribute(
      'href',
      '/es/productos',
    );
    await expect(page.locator('[data-logros] [data-metrica]')).toHaveText([
      '70.000',
      '400+',
      '−60%',
      'US$62.000',
      '2',
      '10+',
      '700+',
    ]);
    await expect(page.getByRole('link', { name: 'Fuente: quitodevfest.com' })).toHaveAttribute(
      'href',
      'https://quitodevfest.com/',
    );
  });

  test('XPRIZE, trayectoria de 5 hitos y las 3 charlas más recientes', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('[data-xprize] dd')).toHaveText(['26.449', 'Top 100', '1.º']);
    await expect(page.locator('[data-trayectoria] [data-anio]')).toHaveText([
      '2013',
      '2016',
      '2018',
      '2020',
      '2026',
    ]);
    const charlas = page.locator('#eventos li');
    await expect(charlas.locator('h3')).toHaveText([
      'DevFest Ecuador 2025',
      'Cursor meetup Quito',
      'SENA: I Encuentro de Tecnología e Innovación',
    ]);
    await expect(charlas.nth(2)).toContainText('11 y 12 nov 2025 · Barranquilla');
    // Las fotos cargan al acercarse.
    await page.locator('#eventos').scrollIntoViewIfNeeded();
    for (const img of await charlas.locator('img[alt]:not([alt=""])').all()) {
      await expect(img).toHaveJSProperty('complete', true);
      expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
    }
  });

  test('casos como enlaces y secciones sin contenido real ocultas', async ({ page }) => {
    await page.goto(PAGE);
    const casos = page.locator('[data-casos]');
    await expect(casos.getByRole('link', { name: 'Glasslake' })).toHaveAttribute(
      'href',
      '/es/casos/glasslake',
    );
    await expect(casos.getByRole('link', { name: 'Trama AI' })).toHaveAttribute(
      'href',
      '/es/casos',
    );
    await expect(page.getByRole('link', { name: /Conoce EvolutecC/ })).toHaveAttribute(
      'href',
      /utm_campaign=home/,
    );
    // Sin entradas de blog ni número de WhatsApp todavía; nada entre corchetes.
    await expect(page.locator('#blog')).toHaveCount(0);
    await expect(page.getByText('WhatsApp')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText('[');
  });
});

test.describe('Home · formulario', () => {
  test.skip(({ isMobile }) => isMobile, 'solo escritorio');

  test('exige los campos y la casilla de autorización', async ({ page }) => {
    await page.goto(PAGE);
    const form = page.locator('form[data-formulario="general"]');
    for (const nombre of ['nombre', 'email', 'mensaje', 'acepta']) {
      await expect(form.locator(`[name="${nombre}"]`)).toHaveAttribute('required', '');
    }
    await expect(form.getByRole('combobox', { name: '¿En qué te ayudo?' })).toHaveValue(
      'consultoria',
    );
    await expect(form.getByRole('link', { name: 'política de privacidad' })).toHaveAttribute(
      'href',
      '/es/legal/privacidad',
    );
    await expect(page.locator('#formulario-enviado')).toBeHidden();
  });

  test('sin JavaScript envía, guarda y muestra el aviso', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    // Astro arma la URL con localhost cuando el Host no está en allowedDomains.
    const origen = new URL(baseURL!);
    origen.hostname = 'localhost';
    await page.goto(new URL(PAGE, origen).toString());

    await page.getByLabel('Nombre').fill('Ana Pérez');
    await page.getByLabel('Correo').fill(`prueba-${randomUUID()}@ejemplo.com`);
    await page.getByLabel('¿En qué te ayudo?').selectOption('conferencia');
    await page
      .getByLabel('Mensaje', { exact: true })
      .fill('Quiero invitarte a dar una charla en marzo.');
    await page.getByLabel(/Acepto la/).check();
    await page.getByRole('button', { name: 'Enviar' }).click();

    await expect(page).toHaveURL(/\/es\?formulario=enviado#formulario-enviado$/);
    await expect(page.locator('#formulario-enviado')).toBeVisible();
    await expect(page.locator('#formulario-error')).toBeHidden();
    await context.close();
  });
});
