import { expect, test, type Page } from '@playwright/test';

const PAGE = '/es/sobre-mi';

async function scrollThrough(page: Page, selector: string, step: number, pause: number) {
  await page.evaluate(
    async ({ selector, step, pause }) => {
      const el = document.querySelector(selector)!;
      const end = el.getBoundingClientRect().bottom + window.scrollY;
      for (let y = window.scrollY; y < end; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, pause));
      }
      window.scrollTo(0, end);
    },
    { selector, step, pause },
  );
}

async function expectFinalTimeline(page: Page) {
  await expect(page.locator('[data-hito][data-dim]')).toHaveCount(0);
  await expect(page.locator('[data-level-card][data-state="done"]')).toHaveCount(4);
  await expect(page.locator('[data-levelup][data-open]')).toHaveCount(4);
}

test.describe('pieza 03 · línea de tiempo por niveles', () => {
  test('arma los niveles y los desbloquea con el scroll, con estallido final', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('[data-hito][data-dim]')).toHaveCount(16);
    await expect(page.locator('[data-level-card]').first()).toHaveAttribute('data-state', 'on');

    await page.evaluate(() => {
      const burst = document.querySelector('[data-burst]')!;
      (window as unknown as { maxParticles: number }).maxParticles = 0;
      new MutationObserver(() => {
        const w = window as unknown as { maxParticles: number };
        w.maxParticles = Math.max(w.maxParticles, burst.children.length);
      }).observe(burst, { childList: true });
    });

    await scrollThrough(page, '[data-level-timeline]', 200, 120);
    await expectFinalTimeline(page);
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { maxParticles: number }).maxParticles))
      .toBeGreaterThan(0);
  });

  test('con scroll rápido igual termina completa', async ({ page }) => {
    await page.goto(PAGE);
    await scrollThrough(page, '[data-level-timeline]', 1200, 30);
    await expectFinalTimeline(page);
  });

  test('con reducir movimiento se ve el estado final y no descarga GSAP', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const gsapRequests: string[] = [];
    page.on('request', (r) => {
      if (/gsap|ScrollTrigger/.test(r.url())) gsapRequests.push(r.url());
    });
    await page.goto(PAGE);
    await expectFinalTimeline(page);
    await scrollThrough(page, '[data-level-timeline]', 400, 50);
    expect(gsapRequests).toEqual([]);
    await context.close();
  });

  test('sin JavaScript se ve el estado final', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(PAGE);
    await expectFinalTimeline(page);
    await expect(page.getByText('13 años · 16 hitos · 2013–2026')).toBeVisible();
    await context.close();
  });
});
