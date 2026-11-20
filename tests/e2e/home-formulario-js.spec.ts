import { randomUUID } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';

test.skip(({ isMobile }) => isMobile, 'solo escritorio');

const correo = () => `prueba-${randomUUID()}@ejemplo.com`;
const form = (page: Page) => page.locator('form[data-formulario="general"]');

async function llenar(page: Page, email = correo()) {
  const f = form(page);
  await f.getByLabel('Nombre').fill('Ana Pérez');
  await f.getByLabel('Correo').fill(email);
  await f.getByLabel('Mensaje', { exact: true }).fill('Quiero conversar sobre la migración a AWS.');
  await f.getByLabel(/Acepto la/).check();
}

test.describe('formulario con JavaScript', () => {
  test('sin datos marca cada campo, enfoca el primero y no envía nada', async ({ page }) => {
    let enviados = 0;
    page.on('request', (r) => r.url().includes('/api/solicitudes') && enviados++);
    await page.goto('/es');
    await form(page).getByRole('button', { name: 'Enviar' }).click();

    const f = form(page);
    await expect(f.getByLabel('Nombre')).toHaveAttribute('aria-invalid', 'true');
    await expect(f.getByLabel('Nombre')).toBeFocused();
    await expect(f.locator('#contacto-nombre-error')).toHaveText('Completa este campo.');
    await expect(f.locator('#contacto-correo-error')).toHaveText('Completa este campo.');
    await expect(f.locator('#contacto-mensaje-error')).toHaveText('Completa este campo.');
    await expect(f.locator('#contacto-acepta-error')).toHaveText(
      'Para enviar el mensaje, acepta la política de privacidad.',
    );
    await expect(f.getByLabel('Nombre')).toHaveAccessibleDescription('Completa este campo.');
    expect(enviados).toBe(0);
  });

  test('explica cada error y lo borra al corregirlo', async ({ page }) => {
    await page.goto('/es');
    const f = form(page);
    await f.getByLabel('Correo').fill('ana@');
    await f.getByLabel('Mensaje', { exact: true }).fill('Hola');
    await f.getByRole('button', { name: 'Enviar' }).click();
    await expect(f.locator('#contacto-correo-error')).toHaveText(
      'Escribe un correo válido, como nombre@empresa.com.',
    );
    await expect(f.locator('#contacto-mensaje-error')).toHaveText(
      'Escribe al menos 10 caracteres.',
    );
    await f.getByLabel('Correo').fill('ana@ejemplo.com');
    await expect(f.locator('#contacto-correo-error')).toBeHidden();
    await expect(f.getByLabel('Correo')).not.toHaveAttribute('aria-invalid');
  });

  test('envía sin recargar, con las UTM de la visita, y confirma', async ({ page }) => {
    // Llega por una campaña a Sobre mí y escribe desde el Home.
    await page.goto('/es/sobre-mi?utm_source=linkedin&utm_medium=social&utm_campaign=lanzamiento');
    await page.goto('/es');
    await llenar(page);

    const peticion = page.waitForRequest((r) => r.url().endsWith('/api/solicitudes'));
    await form(page).getByRole('button', { name: 'Enviar' }).click();
    const cuerpo = (await peticion).postDataJSON();
    expect(cuerpo).toMatchObject({
      formulario: 'general',
      puerta: 'consultoria',
      acepta: true,
      pagina: '/es',
      utm_source: 'linkedin',
      utm_medium: 'social',
      utm_campaign: 'lanzamiento',
    });

    await expect(page.locator('#formulario-enviado')).toBeVisible();
    await expect(page.locator('#formulario-enviado')).toBeFocused();
    await expect(page).toHaveURL(/\/es$/);
    await expect(form(page).getByLabel('Nombre')).toHaveValue('');
  });

  test('muestra "Enviando…" mientras espera y los avisos de límite y de falla', async ({
    page,
  }) => {
    await page.goto('/es');
    const boton = form(page).getByRole('button', { name: 'Enviar' });

    let soltar = () => {};
    await page.route('**/api/solicitudes', async (route) => {
      await new Promise<void>((r) => (soltar = r));
      await route.fulfill({ status: 429, json: { ok: false, motivo: 'demasiadas' } });
    });
    await llenar(page);
    await boton.click();
    await expect(form(page).getByRole('button', { name: 'Enviando…' })).toBeDisabled();
    soltar();
    await expect(page.locator('#formulario-error')).toHaveText(
      'Ya recibí varios mensajes desde este correo. Vuelve a intentarlo en una hora.',
    );
    await expect(boton).toBeEnabled();

    await page.unroute('**/api/solicitudes');
    await page.route('**/api/solicitudes', (route) => route.abort());
    await boton.click();
    await expect(page.locator('#formulario-error')).toHaveText(
      'No se pudo enviar. Revisa los campos e inténtalo de nuevo.',
    );
    await expect(page.locator('#formulario-error')).toBeFocused();
  });
});
