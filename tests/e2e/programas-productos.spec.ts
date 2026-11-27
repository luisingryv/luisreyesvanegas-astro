import { randomUUID } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function sinViolaciones(page: Page, ruta: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  expect(violations.map((v) => `${ruta} ${v.id} (${v.nodes.length}): ${v.help}`)).toEqual([]);
}

test.describe('Programas AWS', () => {
  test('textos clave, nunca "créditos gratis" como oferta y la nota de condiciones', async ({
    page,
  }) => {
    await page.goto('/es/programas-aws');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'AWS puede invertir en tu migración.',
    );
    await expect(page.locator('header a', { hasText: 'Evaluar mi caso' }).first()).toHaveAttribute(
      'href',
      '#evaluar',
    );
    await expect(page.getByRole('img', { name: /el consumo crece mes a mes/ })).toBeVisible();
    await expect(page.locator('main ol li[data-reveal]')).toHaveCount(6);
    // La única mención de "créditos gratis" es para decir que no se gestionan.
    const texto = (await page.locator('main').innerText()).toLowerCase();
    expect(texto.match(/créditos gratis/g)).toHaveLength(1);
    expect(texto).toContain('no gestionamos créditos gratis');
    await expect(page.getByRole('note')).toContainText('sujetos a su evaluación');
    await expect(
      page.getByRole('note').getByRole('link', { name: 'Ver condiciones' }),
    ).toHaveAttribute('href', '#condiciones');
    await expect(page.locator('#condiciones')).toContainText('no garantiza la aprobación');
    await expect(page.locator('main')).not.toContainText('[');
  });

  test('el consumo anual se calcula del mensual', async ({ page }) => {
    await page.goto('/es/programas-aws');
    const anual = page.locator('[data-anual]');
    await expect(anual).toHaveText('≈US$120.000 al año');
    await page.getByLabel('Consumo actual, promedio mensual').selectOption('50000');
    await expect(anual).toHaveText('≈US$600.000 al año', { timeout: 3000 });
    await page.getByLabel('Consumo actual, promedio mensual').selectOption('250000');
    await expect(anual).toHaveText('Más de US$3.000.000 al año', { timeout: 3000 });
  });

  test('la evaluación se guarda como solicitud "programas-aws"', async ({ page, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    await page.goto('/es/programas-aws');
    const form = page.locator('#evaluar form');
    await form.getByLabel('Tu empresa es').selectOption('en-aws');
    await form.getByLabel('Dónde está hoy tu infraestructura').selectOption('aws');
    await form.getByLabel('Consumo actual, promedio mensual').selectOption('20000');
    await form
      .getByLabel('¿Qué quieres migrar o hacer crecer?')
      .fill('Cargas nuevas de clientes en Europa.');
    await form.getByLabel('¿Quién toma la decisión?').fill('CTO');
    await form.getByLabel('¿Cuándo tienes que tomar la decisión?').selectOption('3-6');
    await form.getByLabel('Empresa y país').fill('Acme, Estados Unidos');
    await form.getByLabel('Nombre').fill('Ana Pérez');
    await form.getByLabel('Correo').fill(`cto-${randomUUID()}@ejemplo.com`);
    // "Empresa y país" también dice país: el selector del teléfono se busca exacto.
    await form.getByLabel('País', { exact: true }).selectOption('US');
    await form.getByLabel('Teléfono').fill('(305) 555-0100');
    await form.getByLabel(/Acepto la/).check();
    const peticion = page.waitForRequest((r) => r.url().endsWith('/api/solicitudes'));
    await form.getByRole('button', { name: 'Enviar' }).click();
    expect((await peticion).postDataJSON()).toMatchObject({
      formulario: 'programas-aws',
      tipoEmpresa: 'en-aws',
      consumo: '20000',
      plazo: '3-6',
    });
    await expect(page.locator('#formulario-enviado')).toHaveText(
      'Gracias. Recibí los datos de tu empresa y te escribo para preparar la sesión.',
    );
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto('/es/programas-aws');
    await sinViolaciones(page, '/es/programas-aws');
  });
});

test.describe('Productos', () => {
  test('Trama, sus logros, las dos formas de acercarse y el portafolio', async ({ page }) => {
    await page.goto('/es/productos');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Agentes de IA que operan el inventario de tu empresa.',
    );
    await expect(page.getByRole('img', { name: 'Trama', exact: true })).toBeVisible();
    await expect(
      page.getByRole('img', { name: /ganador de categoría, Small Business Services/ }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /gxp\.moonshots\.com/ })).toHaveAttribute(
      'href',
      'https://gxp.moonshots.com/',
    );
    await expect(page.locator('[data-conversacion]')).toContainText('Demostración');
    await expect(page.locator('[data-logros] > li')).toHaveCount(4);
    // 27 nov 2026: dos tarjetas; cada una abre su formulario y cierra el otro.
    const usar = page.locator('#usar');
    const invertir = page.locator('#invertir');
    await expect(page.locator('#panel-usar')).toBeHidden();
    await expect(page.locator('#panel-invertir')).toBeHidden();
    await usar.click();
    await expect(usar).toHaveAttribute('aria-expanded', 'true');
    // 21 nov 2026: la demo es un formulario con el producto (Trama, Ofilix u otro).
    await expect(
      page.locator('#panel-usar').getByLabel('¿Qué producto quieres conocer?').locator('option'),
    ).toHaveText(['Trama AI', 'Ofilix', 'Otro producto o no estoy seguro']);
    await expect(
      page.locator('#panel-usar').getByRole('button', { name: 'Solicitar demo' }),
    ).toBeVisible();
    await invertir.click();
    await expect(page.locator('#panel-usar')).toBeHidden();
    await expect(page.locator('#panel-invertir')).toContainText(
      'no constituye una oferta de valores',
    );
    // Los enlaces del portafolio abren su formulario.
    await page.getByRole('link', { name: /Usar el producto.*Trama AI/ }).click();
    await expect(page.locator('#panel-usar')).toBeVisible();
    await expect(page.locator('main')).toContainText('Ofilix');
    await expect(page.locator('main')).not.toContainText('[');
    await expect(
      page.locator('header a[aria-current="page"]', { hasText: 'Productos' }),
    ).not.toHaveCount(0);
  });

  test('la conversación se escribe sola y con reducir movimiento queda completa', async ({
    browser,
    page,
  }) => {
    await page.goto('/es/productos');
    const mensajes = page.locator('[data-conversacion] .mensaje');
    await page.locator('[data-conversacion]').scrollIntoViewIfNeeded();
    await expect(mensajes.filter({ visible: true })).not.toHaveCount(6, { timeout: 1500 });
    await expect(mensajes.filter({ visible: true })).toHaveCount(6, { timeout: 15000 });

    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const quieta = await context.newPage();
    await quieta.goto('/es/productos');
    await quieta.locator('[data-conversacion]').scrollIntoViewIfNeeded();
    await expect(
      quieta.locator('[data-conversacion] .mensaje').filter({ visible: true }),
    ).toHaveCount(6);
    await context.close();
  });

  test('la solicitud de inversionistas se guarda como "productos"', async ({ page, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    await page.goto('/es/productos#invertir');
    const form = page.locator('#panel-invertir form');
    await form.getByLabel('Tipo de inversionista').selectOption('fondo');
    await form.getByLabel('Nombre').fill('Ana Pérez');
    await form.getByLabel('Correo').fill(`fondo-${randomUUID()}@ejemplo.com`);
    await form.getByLabel('País').selectOption('US');
    await form.getByLabel('Teléfono').fill('+1 305 555 0100');
    await form.getByLabel(/Acepto la/).check();
    const peticion = page.waitForRequest((r) => r.url().endsWith('/api/solicitudes'));
    await form.getByRole('button', { name: 'Solicitar información' }).click();
    expect((await peticion).postDataJSON()).toMatchObject({
      formulario: 'productos',
      inversionista: 'fondo',
      nombre: 'Ana Pérez',
      pais: 'US',
      telefono: '+1 305 555 0100',
    });
    await expect(page.locator('#formulario-enviado')).toHaveText(
      'Gracias. Recibí tu solicitud y te escribo para agendar la conversación.',
    );
  });

  test('la demo se guarda como "demo" con el producto elegido', async ({ page, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    await page.goto('/es/productos');
    await page.locator('#usar').click();
    const form = page.locator('#panel-usar form');
    await form.getByLabel('¿Qué producto quieres conocer?').selectOption('ofilix');
    await form.getByLabel('Nombre').fill('Carlos Gómez');
    await form.getByLabel('Empresa').fill('Textiles del Caribe');
    await form.getByLabel('Correo').fill(`demo-${randomUUID()}@ejemplo.com`);
    await form.getByLabel('Teléfono').fill('300 123 4567');
    await form.getByLabel(/Acepto la/).check();
    const peticion = page.waitForRequest((r) => r.url().endsWith('/api/solicitudes'));
    await form.getByRole('button', { name: 'Solicitar demo' }).click();
    expect((await peticion).postDataJSON()).toMatchObject({
      formulario: 'demo',
      producto: 'ofilix',
      nombre: 'Carlos Gómez',
      empresa: 'Textiles del Caribe',
    });
    // Dos formularios en la página: cada uno con su propio aviso.
    await expect(page.locator('#formulario-demo-enviado')).toHaveText(
      'Gracias. Recibí tu solicitud y te escribo para agendar la demo.',
    );
    await expect(page.locator('#formulario-enviado')).toBeHidden();
  });

  test('sin errores de accesibilidad', async ({ page }) => {
    await page.goto('/es/productos');
    await sinViolaciones(page, '/es/productos');
  });

  test('las dos páginas están en el sitemap', async ({ request, isMobile }) => {
    test.skip(isMobile, 'solo escritorio');
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const ruta of ['/es/programas-aws', '/es/productos']) {
      expect(xml).toContain(`<loc>https://luisreyesvanegas.com${ruta}</loc>`);
    }
  });
});
