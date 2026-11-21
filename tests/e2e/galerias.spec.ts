import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Galerías aprobadas por Luis el 21 nov 2026: niveles de "Mi historia" y tarjetas de Eventos.
const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('galerías de fotos', () => {
  test('cada nivel de Sobre mí con fotos abre su visor', async ({ page }) => {
    await page.goto('/es/sobre-mi');
    const abrir = page.getByRole('link', { name: 'Ver 9 fotos' });
    await abrir.click();

    const visor = page.locator('dialog#galeria-nivel-startup');
    await expect(visor).toHaveAttribute('open', '');
    await expect(visor.getByText('Nivel 2 · La escuela de la startup')).toBeVisible();
    await expect(visor.locator('[data-contador]')).toHaveText('1 de 9');
    await expect(visor.getByText('Oficina de Mandaos · Barranquilla · oct 2018')).toBeVisible();

    await page.keyboard.press('ArrowRight');
    await expect(visor.locator('[data-contador]')).toHaveText('2 de 9');
    await expect(visor.getByRole('button', { name: 'Foto anterior' })).toBeEnabled();

    const { violations } = await new AxeBuilder({ page })
      .include('dialog#galeria-nivel-startup')
      .withTags(WCAG_AA)
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(visor).not.toHaveAttribute('open');
    await expect(abrir).toBeFocused();
  });

  test('la tarjeta de un evento abre sus fotos, con la portada primero', async ({ page }) => {
    await page.goto('/es/eventos');
    await page
      .getByRole('link', { name: 'Ver las 21 fotos de TechCaribe Expo 2024 · Google I/O Extended' })
      .click();

    const visor = page.locator('dialog#galeria-evento-2024-07-27-techcaribe-expo');
    await expect(visor).toHaveAttribute('open', '');
    await expect(visor.locator('[data-contador]')).toHaveText('1 de 21');
    await expect(visor.locator('[data-foto="0"] img')).toHaveAttribute(
      'alt',
      'Luis Reyes junto a la pantalla de su charla Crea aplicaciones con Vertex AI y Cloud Run en TechCaribe Expo 2024',
    );

    await visor.getByRole('button', { name: 'Foto siguiente' }).click();
    await expect(visor.locator('[data-contador]')).toHaveText('2 de 21');
    await visor.getByRole('link', { name: 'Cerrar' }).click();
    await expect(visor).not.toHaveAttribute('open');
  });

  test('el evento que solo tiene la portada no muestra visor', async ({ page }) => {
    await page.goto('/es/eventos');
    await expect(page.locator('dialog#galeria-evento-2025-09-02-devlokos')).toHaveCount(0);
    await expect(page.locator('a[data-abrir-galeria]')).toHaveCount(14);
  });
});

test.describe('galerías sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('el enlace abre el visor con todas las fotos para deslizar', async ({ page }) => {
    await page.goto('/es/sobre-mi#galeria-nivel-fundador');
    const visor = page.locator('#galeria-nivel-fundador');
    await expect(visor).toBeVisible();
    await expect(visor.locator('[data-foto]')).toHaveCount(8);
    await expect(visor.getByRole('button', { name: 'Foto siguiente' })).toBeHidden();
  });
});
