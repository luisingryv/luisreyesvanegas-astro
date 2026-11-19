import { expect, test } from '@playwright/test';

const PAGE = '/es/sobre-mi';
const visibleBadges = '[data-badge]:not([hidden])';

test.describe('pieza 09 · insignias coleccionables', () => {
  test('estampa las obtenidas y el contador llega a 8', async ({ page }) => {
    await page.goto(PAGE);
    const count = page.locator('[data-badge-count]');
    await expect(count).toHaveText('0');
    await page.locator('[data-badge-grid]').scrollIntoViewIfNeeded();
    await expect(count).toHaveText('8', { timeout: 6000 });
    await expect(page.locator('[data-cell][data-on]')).toHaveCount(12, { timeout: 6000 });
  });

  test('los filtros reacomodan la colección', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('[data-badge-grid]').scrollIntoViewIfNeeded();
    const filters = page.getByRole('group', { name: 'Filtrar insignias' });
    await filters.getByRole('button', { name: 'Obtenidas' }).click();
    await expect(page.locator(visibleBadges)).toHaveCount(8);
    await filters.getByRole('button', { name: 'En proceso' }).click();
    await expect(page.locator(visibleBadges)).toHaveCount(4);
    await expect(filters.getByRole('button', { name: 'En proceso' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await filters.getByRole('button', { name: 'Todas' }).click();
    await expect(page.locator(visibleBadges)).toHaveCount(12);
  });

  test('con reducir movimiento todo está en su estado final', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(PAGE);
    await expect(page.locator('[data-badge-count]')).toHaveText('8');
    await expect(page.locator('[data-cell][data-on]')).toHaveCount(12);
    await expect(page.locator('[data-reveal-armed]')).toHaveCount(0);
    await context.close();
  });

  test('sin JavaScript se ve el estado final y no hay filtros', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(PAGE);
    await expect(page.locator('[data-badge-count]')).toHaveText('8');
    await expect(page.getByRole('group', { name: 'Filtrar insignias' })).toBeHidden();
    await expect(page.locator(visibleBadges)).toHaveCount(12);
    await context.close();
  });
});

test('las secciones aparecen una vez al entrar en pantalla', async ({ page }) => {
  await page.goto(PAGE);
  const principios = page.locator('section[aria-labelledby="principios-titulo"] [data-reveal]');
  await expect(principios).toHaveAttribute('data-reveal-armed', '');
  await principios.scrollIntoViewIfNeeded();
  await expect(principios).not.toHaveAttribute('data-reveal-armed', '');
});
