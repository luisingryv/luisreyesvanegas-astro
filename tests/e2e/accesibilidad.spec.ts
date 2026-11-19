import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const PAGE = '/es/sobre-mi';
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  const summary = violations.map((v) => `${v.id} (${v.nodes.length}): ${v.help}`);
  expect(summary).toEqual([]);
}

test.describe('accesibilidad WCAG 2.2 AA (axe)', () => {
  test('al cargar, con los estados pendientes de la animación', async ({ page }) => {
    await page.goto(PAGE);
    await expectNoViolations(page);
  });

  test('con todo el motion terminado', async ({ page }) => {
    await page.goto(PAGE);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await expect(page.locator('[data-hito][data-dim]')).toHaveCount(0);
    await expect(page.locator('[data-badge-count]')).toHaveText('8', { timeout: 6000 });
    await page.waitForTimeout(1500);
    await expectNoViolations(page);
  });

  test('con reducir movimiento', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(PAGE);
    await expectNoViolations(page);
    await context.close();
  });
});
