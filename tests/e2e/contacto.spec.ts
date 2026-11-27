import { randomUUID } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGE = '/es/contacto';
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('Contacto', () => {
  test('router con las seis opciones y sus destinos', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('¿Qué necesitas?');
    const opciones = page.getByRole('list').filter({ has: page.getByText('Programa MAP de AWS') });
    const destinos = await opciones
      .getByRole('link')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(destinos).toEqual([
      '/es/consultoria#agenda',
      '/es/programas-aws',
      'https://evolutecc.com/?utm_source=luisreyesvanegas&utm_medium=referral&utm_campaign=contacto',
      '/es/productos',
      '/es/speaker#invitar',
      '#general',
    ]);
    // La flecha ↗ es decorativa: se ve, pero no forma parte del nombre del enlace.
    await expect(page.getByRole('link', { name: /Ir a EvolutecC/ })).toContainText('↗');
  });

  test('formulario con su propia pregunta de tema y la política de privacidad', async ({
    page,
  }) => {
    await page.goto(PAGE);
    const form = page.locator('#general form');
    await expect(form.getByRole('combobox', { name: 'Tema' }).locator('option')).toHaveText([
      'Conversación general',
      'Contratación',
      'Prensa',
      'Otro',
    ]);
    await expect(form.locator('input[name="pagina"]')).toHaveValue('/es/contacto');
    await expect(form.getByRole('link', { name: 'política de privacidad' })).toHaveAttribute(
      'href',
      '/es/legal/privacidad',
    );
    await expect(form.getByLabel('Mensaje', { exact: true })).toHaveAttribute('rows', '5');
  });

  test('envía con JavaScript y guarda el tema como puerta', async ({ page, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    await page.goto(PAGE);
    const form = page.locator('#general form');
    await form.getByLabel('Nombre').fill('Ana Pérez');
    await form.getByLabel('Correo').fill(`prueba-${randomUUID()}@ejemplo.com`);
    await form.getByLabel('Teléfono').fill('300 123 4567');
    await form.getByLabel('Tema').selectOption('prensa');
    await form.getByLabel('Mensaje', { exact: true }).fill('Quiero una entrevista para un medio.');
    await form.getByLabel(/Acepto la/).check();
    const peticion = page.waitForRequest((r) => r.url().endsWith('/api/solicitudes'));
    await form.getByRole('button', { name: 'Enviar' }).click();
    expect((await peticion).postDataJSON()).toMatchObject({
      puerta: 'prensa',
      pagina: '/es/contacto',
      pais: 'CO',
      telefono: '300 123 4567',
    });
    await expect(page.locator('#formulario-enviado')).toBeVisible();
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto(PAGE);
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
    expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});

test.describe('Legal y tareas', () => {
  test.skip(({ isMobile }) => isMobile, 'solo escritorio');

  test('las dos páginas legales están publicadas, completas y en el sitemap', async ({
    page,
    request,
  }) => {
    await page.goto('/es/legal/privacidad');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Política de tratamiento de datos personales',
    );
    await expect(page.getByText('Vigente desde 20 de noviembre de 2026.')).toBeVisible();
    await expect(
      page.getByText(/persona natural, con domicilio en Barranquilla, Colombia/),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'legal@luisreyesvanegas.com' })).toHaveAttribute(
      'href',
      'mailto:legal@luisreyesvanegas.com',
    );
    await expect(page.getByText(/hasta 24 meses desde el último contacto/)).toBeVisible();
    // Sin datos pendientes, sin corchetes y sin menciones a analítica.
    await expect(page.locator('[data-dato-pendiente]')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('[');
    await expect(page.locator('main')).not.toContainText(/analítica|navegación/);
    await expect(page.getByRole('link', { name: 'Política de datos personales' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.getByRole('link', { name: 'Términos de uso' }).click();
    await expect(page).toHaveURL(/\/es\/legal\/terminos$/);
    await expect(page.getByText(/Contacto: legal@luisreyesvanegas\.com\./)).toBeVisible();

    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('<loc>https://luisreyesvanegas.com/es/legal/privacidad</loc>');
    expect(sitemap).toContain('<loc>https://luisreyesvanegas.com/es/legal/terminos</loc>');
  });

  test('las páginas legales no tienen errores de accesibilidad', async ({ page }) => {
    for (const ruta of ['/es/legal/privacidad', '/es/legal/terminos']) {
      await page.goto(ruta);
      const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
      expect(violations.map((v) => `${ruta} ${v.id}: ${v.help}`)).toEqual([]);
    }
  });

  test('la tarea de sincronización exige su token', async ({ request }) => {
    const sinToken = await request.post('/api/tareas/sincronizar');
    expect(sinToken.status()).toBe(401);
    const tokenFalso = await request.post('/api/tareas/sincronizar', {
      headers: { Authorization: 'Bearer falso' },
    });
    expect(tokenFalso.status()).toBe(401);
  });
});
