import { randomUUID } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const SUBPAGINAS = [
  ['/es/consultoria/sesion-de-arquitectura', '90 minutos para saber qué hacer con tu nube.'],
  ['/es/consultoria/optimizar-costos', '¿Tu factura de nube crece más rápido que tu negocio?'],
  [
    '/es/consultoria/escalar-infraestructura',
    '¿Vas a multiplicar usuarios y no sabes si tu infraestructura aguanta?',
  ],
  ['/es/consultoria/retainers', 'Un arquitecto de cabecera para tu equipo.'],
] as const;

test.describe('Consultoría', () => {
  test('las 7 puertas llevan a su subpágina, al programa MAP o a la agenda', async ({ page }) => {
    await page.goto('/es/consultoria');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      '¿Qué necesitas resolver en tu nube?',
    );
    const puertas = page.locator('[data-misiones] a');
    expect(await puertas.evaluateAll((as) => as.map((a) => a.getAttribute('href')))).toEqual([
      '/es/consultoria/optimizar-costos',
      '/es/consultoria/escalar-infraestructura',
      '/es/programas-aws',
      '/es/programas-aws',
      '/es/consultoria#agenda',
      '/es/consultoria#agenda',
      '/es/consultoria/adopcion-ia',
    ]);
    await expect(puertas.first()).toContainText('01 / 07');
    await expect(puertas.first()).toContainText('Hablemos de tu caso');
    // La prueba de cada puerta está en el texto, no solo en la visualización.
    await expect(puertas.nth(2)).toContainText('US$62.000 en créditos AWS (MAP)');
  });

  test('casos con sus cuatro pasos, formas de trabajar sin precios y credenciales', async ({
    page,
  }) => {
    await page.goto('/es/consultoria');
    const casos = page.locator('[data-caso]');
    await expect(casos).toHaveCount(2);
    await expect(casos.first().locator('[data-paso]')).toHaveCount(4);
    await expect(casos.nth(1)).toContainText('US$62.000');
    const formas = page.locator('section', {
      has: page.getByRole('heading', { name: 'Cómo podemos trabajar juntos' }),
    });
    await expect(formas.locator('li')).toHaveCount(9);
    // El único precio publicado es el de la sesión.
    await expect(formas.locator('li')).not.toContainText(['US$']);
    await expect(formas.getByRole('link', { name: 'Acompañamiento mensual' })).toHaveAttribute(
      'href',
      '/es/consultoria/retainers',
    );
    await expect(page.getByRole('link', { name: /Conoce el programa/ })).toHaveAttribute(
      'href',
      '/es/programas-aws',
    );
    await expect(
      page.locator('header a[aria-current="page"]', { hasText: 'Consultoría' }),
    ).not.toHaveCount(0);
  });

  test('la agenda guarda las preguntas previas y avisa mientras no hay URL de reservas', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'solo escritorio');
    await page.goto('/es/consultoria');
    const form = page.locator('#agenda form');
    await expect(form.locator('input[name="formulario"]')).toHaveValue('consultoria');
    await expect(form.getByLabel('Nombre')).toHaveCount(0);
    await form.getByLabel('¿Qué quieres resolver?').selectOption('escalar');
    await form.getByLabel('Nube o nubes que usas').fill('AWS y Google Cloud');
    await form.getByLabel('Gasto mensual aproximado en la nube').fill('US$12.000');
    await form.getByLabel('Correo').fill(`cto-${randomUUID()}@ejemplo.com`);
    await form.getByLabel(/Acepto la/).check();
    const peticion = page.waitForRequest((r) => r.url().endsWith('/api/solicitudes'));
    await form.getByRole('button', { name: 'Elegir fecha y hora' }).click();
    expect((await peticion).postDataJSON()).toMatchObject({
      formulario: 'consultoria',
      puerta: 'escalar',
      nubes: 'AWS y Google Cloud',
      gasto: 'US$12.000',
      acepta: true,
    });
    await expect(page.locator('#formulario-enviado')).toHaveText(
      'Recibí tus datos. Te escribo para agendar la fecha.',
    );
  });

  test('"Agendar sesión" lleva a la agenda de Consultoría en todo el sitio', async ({ page }) => {
    await page.goto('/es/sobre-mi');
    // En celular el botón está dentro del menú cerrado: se revisa el HTML del header.
    await expect(page.locator('header a', { hasText: 'Agendar sesión' }).first()).toHaveAttribute(
      'href',
      '/es/consultoria#agenda',
    );
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto('/es/consultoria');
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
    expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});

test.describe('Subpáginas de Consultoría', () => {
  for (const [ruta, titulo] of SUBPAGINAS) {
    test(`${ruta} usa la plantilla común`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo);
      // La flecha es decorativa: el enlace se llama "Consultoría", como el del menú.
      await expect(
        page.locator('main').getByRole('link', { name: 'Consultoría', exact: true }),
      ).toHaveAttribute('href', '/es/consultoria');
      await expect(page.locator('[data-cifra-protagonista] [data-metrica]')).toBeVisible();
      await expect(page.getByRole('link', { name: /Ver el caso completo/ })).toHaveAttribute(
        'href',
        /^\/es\/casos\/(utpn|glasslake)$/,
      );
      await expect(page.locator('main')).not.toContainText('[');
      await expect(
        page.locator('header a[aria-current="page"]', { hasText: 'Consultoría' }),
      ).not.toHaveCount(0);
    });
  }

  test('textos decididos por Luis: duración y permanencia mínima', async ({ page }) => {
    await page.goto('/es/consultoria/optimizar-costos');
    await expect(page.getByText('Duración: según el tamaño de la cuenta.')).toBeVisible();
    await page.goto('/es/consultoria/retainers');
    await expect(page.getByText('Sí. El acompañamiento mínimo es de 3 meses.')).toBeVisible();
    await expect(page.getByRole('link', { name: /Conoce EvolutecC/ })).toHaveAttribute(
      'href',
      /utm_campaign=retainers/,
    );
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    for (const [ruta] of SUBPAGINAS) {
      await page.goto(ruta);
      const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
      expect(violations.map((v) => `${ruta} ${v.id}: ${v.help}`)).toEqual([]);
    }
  });
});

test.describe('Adopción de IA', () => {
  test('landing con header mínimo y certificaciones verificables', async ({ page }) => {
    await page.goto('/es/consultoria/adopcion-ia');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Que tu equipo trabaje con IA todos los días',
    );
    await expect(
      page.locator('header').getByRole('navigation', { name: 'Navegación principal' }),
    ).toHaveCount(0);
    await expect(
      page.locator('header').getByRole('link', { name: 'Hablemos de tu equipo' }),
    ).toHaveAttribute('href', '#empezar');
    const certificaciones = page.getByRole('link', { name: /Verificar/ });
    await expect(certificaciones).toHaveCount(3);
    await expect(certificaciones.first()).toHaveAttribute(
      'href',
      /^https:\/\/academy\.claude\.com\/verify\//,
    );
    await expect(page.getByText('Anthropic · Claude Academy · oct 2026').first()).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
    expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  test('las seis páginas están en el sitemap', async ({ request, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const ruta of [
      '/es/consultoria',
      '/es/consultoria/adopcion-ia',
      ...SUBPAGINAS.map(([r]) => r),
    ]) {
      expect(xml).toContain(`<loc>https://luisreyesvanegas.com${ruta}</loc>`);
    }
  });
});

test.describe('Consultoría · motion', () => {
  test('pieza 07: las puertas entran escalonadas y la prueba se anima al pasar el cursor', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'el cursor es de escritorio');
    await page.goto('/es/consultoria');
    const primera = page.locator('[data-mision]').first();
    await expect(primera).toHaveCSS('opacity', '0');
    await primera.scrollIntoViewIfNeeded();
    await expect(primera).toHaveCSS('opacity', '1', { timeout: 3000 });
    await page.waitForTimeout(900);
    await primera.hover();
    await expect
      .poll(() =>
        primera.evaluate(
          (el) => el.querySelector('[data-viz]')!.getAnimations({ subtree: true }).length,
        ),
      )
      .toBeGreaterThan(0);
    expect(await primera.evaluate((el) => el.style.transform)).toContain('rotate');
  });

  test('casos: los pasos aparecen uno a uno al verse', async ({ page }) => {
    await page.goto('/es/consultoria');
    const paso = page.locator('[data-caso]').first().locator('[data-paso]').first();
    await expect(paso).toHaveCSS('opacity', '0');
    await page.locator('[data-caso]').first().scrollIntoViewIfNeeded();
    await expect(paso).toHaveCSS('opacity', '1', { timeout: 3000 });
  });

  test('subpágina: la cifra protagonista cuenta hasta su valor final', async ({ page }) => {
    await page.goto('/es/consultoria/escalar-infraestructura');
    const cifra = page.locator('[data-cifra-protagonista] [data-metrica]');
    await cifra.scrollIntoViewIfNeeded();
    await expect(cifra).not.toHaveText('US$62.000', { timeout: 1500 });
    await expect(cifra).toHaveText('US$62.000', { timeout: 4000 });
  });

  test('con reducir movimiento todo queda en su estado final', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/es/consultoria');
    await expect(page.locator('[data-mision]').first()).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-paso]').first()).toHaveCSS('opacity', '1');
    await context.close();
  });
});
