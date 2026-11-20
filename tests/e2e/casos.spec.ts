import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const PAGINAS = [
  [
    '/es/casos/utpn',
    'Cómo una red nacional de peajes bajó 60% su factura de Google Cloud',
    'Ver auditoría de costos',
    '/es/consultoria/optimizar-costos',
  ],
  [
    '/es/casos/glasslake',
    'Cómo Glasslake escala de forma segura en AWS',
    'Ver revisión de escalabilidad',
    '/es/consultoria/escalar-infraestructura',
  ],
  [
    '/es/casos/mandaos',
    'Cómo Mandaos pasó de unos 2.400 a unos 70.000 pedidos al mes con iFood',
    'Agendar sesión de arquitectura',
    '/es/consultoria#agenda',
  ],
] as const;

async function sinViolaciones(page: Page, ruta: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  expect(violations.map((v) => `${ruta} ${v.id} (${v.nodes.length}): ${v.help}`)).toEqual([]);
}

const visibles = (page: Page) => page.locator('[data-lista-casos] > li:not([hidden])');

test.describe('Casos · índice', () => {
  test('los 6 casos en orden; solo los que tienen página llevan enlace', async ({ page }) => {
    await page.goto('/es/casos');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Casos de éxito');
    await expect(page.locator('[data-lista-casos] > li')).toHaveCount(6);
    await expect(page.locator('[data-lista-casos] > li').first()).toContainText(
      'Trama AI migra de Google Cloud a AWS con el programa MAP',
    );
    const enlaces = page.locator('[data-lista-casos] a');
    expect(await enlaces.evaluateAll((as) => as.map((a) => a.getAttribute('href')))).toEqual([
      '/es/casos/utpn',
      '/es/casos/glasslake',
      '/es/casos/mandaos',
    ]);
    // Trama, Fuerza Aérea y Clínica del Caribe se muestran sin enlace ni "Ver caso".
    const sinPagina = page.locator('[data-lista-casos] article');
    await expect(sinPagina).toHaveCount(3);
    await expect(sinPagina).not.toContainText(['Ver caso']);
    await expect(page.locator('main')).not.toContainText('[');
    await expect(
      page.getByRole('link', { name: 'Agendar sesión de arquitectura' }),
    ).toHaveAttribute('href', '/es/consultoria#agenda');
    await expect(
      page.locator('header a[aria-current="page"]', { hasText: 'Casos' }),
    ).not.toHaveCount(0);
  });

  test('los filtros combinan tema y tipo y avisan cuando no hay casos', async ({ page }) => {
    await page.goto('/es/casos');
    const tema = page.getByRole('group', { name: 'Tema' });
    const tipo = page.getByRole('group', { name: 'Tipo' });
    await expect(tema).toBeVisible();
    // Solo aparecen los temas que tienen casos.
    await expect(tema.getByRole('button', { name: 'IA', exact: true })).toHaveCount(0);

    await tema.getByRole('button', { name: 'Crecimiento' }).click();
    await expect(tema.getByRole('button', { name: 'Crecimiento' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(visibles(page)).toHaveCount(2);

    await tipo.getByRole('button', { name: 'Liderado con mi equipo en EvolutecC' }).click();
    await expect(visibles(page)).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('No hay casos con esta combinación todavía.');

    await tipo.getByRole('button', { name: 'Todos' }).click();
    await expect(visibles(page)).toHaveCount(2);
    await expect(page.getByRole('status')).toBeHidden();
    await tema.getByRole('button', { name: 'Todos' }).click();
    await expect(visibles(page)).toHaveCount(6);
  });

  test('sin JavaScript se ven todos los casos y no hay filtros', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/es/casos');
    await expect(page.locator('[data-filtros]')).toBeHidden();
    await expect(visibles(page)).toHaveCount(6);
    await expect(page.locator('[data-metrica]').first()).toHaveText('≈US$6.000');
    await context.close();
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto('/es/casos');
    await sinViolaciones(page, '/es/casos');
    await page.getByRole('group', { name: 'Tema' }).getByRole('button', { name: 'Costos' }).click();
    await expect(visibles(page)).toHaveCount(1);
    // Mientras dura el Flip (0,5 s) las tarjetas se superponen; axe revisa el estado final.
    await page.waitForTimeout(800);
    await sinViolaciones(page, '/es/casos (filtrado)');
  });
});

test.describe('Casos · páginas', () => {
  for (const [ruta, titulo, cierre, destino] of PAGINAS) {
    test(`${ruta} usa la plantilla de caso`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo);
      // La flecha es decorativa: el enlace se llama "Todos los casos".
      await expect(
        page.locator('main').getByRole('link', { name: 'Todos los casos', exact: true }),
      ).toHaveAttribute('href', '/es/casos');
      await expect(page.locator('main aside dl')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Resultado' })).toBeVisible();
      await expect(page.getByRole('link', { name: cierre })).toHaveAttribute('href', destino);
      await expect(page.locator('main')).not.toContainText('[');
      await expect(
        page.locator('header a[aria-current="page"]', { hasText: 'Casos' }),
      ).not.toHaveCount(0);

      const datos = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) => scripts.map((s) => JSON.parse(s.textContent ?? '{}')));
      const articulo = datos.find((d) => d['@type'] === 'Article');
      expect(articulo).toMatchObject({
        headline: titulo,
        url: `https://luisreyesvanegas.com${ruta}`,
        author: { '@type': 'Person', name: 'Luis Carlos Reyes Vanegas' },
      });
    });
  }

  test('Glasslake va sin diagrama por ahora', async ({ page }) => {
    await page.goto('/es/casos/glasslake');
    await expect(page.locator('[data-flujo]')).toHaveCount(0);
    await expect(page.getByText('US$62.000', { exact: true })).toBeVisible();
  });

  test('los casos sin página no tienen ruta y las páginas están en el sitemap', async ({
    request,
    isMobile,
  }) => {
    test.skip(isMobile, 'solo escritorio');
    for (const sinPagina of ['trama', 'fuerza-aerea', 'clinica-del-caribe']) {
      expect((await request.get(`/es/casos/${sinPagina}`)).status()).toBe(404);
    }
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const ruta of ['/es/casos', ...PAGINAS.map(([r]) => r)]) {
      expect(xml).toContain(`<loc>https://luisreyesvanegas.com${ruta}</loc>`);
    }
    expect(xml).not.toContain('/es/casos/trama');
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    for (const [ruta] of PAGINAS) {
      await page.goto(ruta);
      await sinViolaciones(page, ruta);
    }
  });
});

test.describe('Casos · pieza 11', () => {
  test('arranca en "antes" y pasa sola a "después" mientras viajan los paquetes', async ({
    page,
  }) => {
    await page.goto('/es/casos/utpn');
    const flujo = page.locator('[data-flujo]');
    const cifra = flujo.locator('[data-cifra]');
    await flujo.scrollIntoViewIfNeeded();
    await expect(cifra).toHaveText('US$10.000');
    await expect(flujo.getByRole('button', { name: 'Antes' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(flujo.locator('.flujo-nodo.es-alerta')).toHaveText(/Transmisión en vivo/);
    await expect(flujo.locator('[data-delta]')).toBeHidden();

    await expect(cifra).toHaveText('US$4.000', { timeout: 6000 });
    await expect(flujo.locator('[data-delta]')).toHaveText('−60%');
    await expect(flujo.locator('.flujo-nodo.es-clave')).toHaveText(/Escritorio remoto/);
    await expect(flujo.locator('figcaption')).toContainText('escritorio remoto');
    await expect.poll(() => flujo.locator('.paquete').count()).toBeGreaterThan(0);
  });

  test('los botones comparan "antes" y "después"', async ({ page }) => {
    await page.goto('/es/casos/mandaos');
    const flujo = page.locator('[data-flujo]');
    const cifra = flujo.locator('[data-cifra]');
    await flujo.scrollIntoViewIfNeeded();
    await expect(cifra).toHaveText('≈70.000', { timeout: 6000 });
    await flujo.getByRole('button', { name: 'Antes' }).click();
    await expect(cifra).toHaveText('≈2.400', { timeout: 3000 });
    await expect(flujo.locator('[data-delta]')).toBeHidden();
    await flujo.getByRole('button', { name: 'Después' }).click();
    await expect(cifra).toHaveText('≈70.000', { timeout: 3000 });
    await expect(flujo.locator('[data-delta]')).toHaveText('×29 frente a ≈2.400');
  });

  test('con reducir movimiento queda en "después", sin botones ni paquetes', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/es/casos/utpn');
    const flujo = page.locator('[data-flujo]');
    await flujo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    await expect(flujo.locator('[data-cifra]')).toHaveText('US$4.000');
    await expect(flujo.locator('[data-momentos]')).toBeHidden();
    await expect(flujo.locator('.paquete')).toHaveCount(0);
    await sinViolaciones(page, '/es/casos/utpn (reducir movimiento)');
    await context.close();
  });

  test('sin errores de accesibilidad en "antes" y en "después"', async ({ page }) => {
    await page.goto('/es/casos/utpn');
    const flujo = page.locator('[data-flujo]');
    await flujo.scrollIntoViewIfNeeded();
    await expect(flujo.locator('[data-cifra]')).toHaveText('US$4.000', { timeout: 6000 });
    await page.waitForTimeout(600);
    await sinViolaciones(page, '/es/casos/utpn (después)');
    await flujo.getByRole('button', { name: 'Antes' }).click();
    await expect(flujo.locator('[data-cifra]')).toHaveText('US$10.000', { timeout: 3000 });
    await page.waitForTimeout(600);
    await sinViolaciones(page, '/es/casos/utpn (antes)');
  });
});
