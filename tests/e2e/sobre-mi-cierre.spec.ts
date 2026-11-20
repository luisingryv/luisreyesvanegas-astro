import { expect, test, type Page } from '@playwright/test';

const PAGE = '/es/sobre-mi';

// Registra si el navegador pidió el módulo de la escena 3D (lleva Three.js dentro).
function trackSceneRequests(page: Page) {
  const urls: string[] = [];
  page.on('request', (request) => {
    if (/scene|three/i.test(new URL(request.url()).pathname)) urls.push(request.url());
  });
  return urls;
}

test.describe('cierre · ¿Cómo puedo ayudarte?', () => {
  test('trae los textos, los botones y el logo decorativo en el HTML', async ({ page }) => {
    await page.goto(PAGE);
    const cierre = page.locator('#contacto');
    await expect(cierre).toHaveAttribute('data-theme', 'dark');
    await expect(cierre.getByText('Hablemos', { exact: true })).toBeVisible();
    await expect(cierre.getByRole('heading', { level: 2 })).toHaveText('¿Cómo puedo ayudarte?');
    await expect(cierre.getByRole('link', { name: 'Conferencia' })).toHaveAttribute(
      'href',
      '/es/speaker#invitar',
    );
    await expect(cierre.getByRole('link', { name: 'Consultoría' })).toBeVisible();
    await expect(cierre.getByRole('link', { name: 'Conversación general' })).toBeVisible();
    await expect(cierre.getByRole('link', { name: /^Otras opciones/ })).toHaveAttribute(
      'href',
      '/es/contacto',
    );

    const logo = cierre.locator('[data-logo3d]');
    await expect(logo).toHaveAttribute('aria-hidden', 'true');
    await expect(logo.locator('img')).toHaveAttribute('alt', '');
  });

  test('carga Three.js solo al acercarse y ensambla el logo en 3D', async ({ page }) => {
    const requests = trackSceneRequests(page);
    await page.goto(PAGE);
    await page.waitForLoadState('networkidle');
    expect(requests).toHaveLength(0);

    const logo = page.locator('[data-logo3d]');
    await logo.scrollIntoViewIfNeeded();
    await expect(logo).toHaveAttribute('data-live', '');
    await expect(logo.locator('canvas')).toHaveCount(1);
    await expect(logo.locator('img')).toHaveCSS('opacity', '0');
    expect(requests.length).toBeGreaterThan(0);
  });

  test('con "reducir movimiento" muestra el render quieto y no descarga Three.js', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const requests = trackSceneRequests(page);
    await page.goto(PAGE);

    const logo = page.locator('[data-logo3d]');
    await logo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(logo).not.toHaveAttribute('data-live');
    await expect(logo.locator('canvas')).toHaveCount(0);
    await expect(logo.locator('img')).toBeVisible();
    await expect(logo.locator('img')).toHaveCSS('animation-name', 'none');
    expect(requests).toHaveLength(0);
  });

  test('sin WebGL queda el render flotando y no descarga Three.js', async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        if (type.startsWith('webgl')) return null;
        return (original as (...a: unknown[]) => unknown).call(this, type, ...args);
      } as typeof original;
    });
    const requests = trackSceneRequests(page);
    await page.goto(PAGE);

    const logo = page.locator('[data-logo3d]');
    await logo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(logo).not.toHaveAttribute('data-live');
    await expect(logo.locator('img')).toBeVisible();
    await expect(logo.locator('img')).toHaveCSS('animation-name', /logo3d-float/);
    expect(requests).toHaveLength(0);
  });
});
