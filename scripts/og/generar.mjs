// Genera las tarjetas de Open Graph por idioma publicado: src/assets/og/og-<idioma>.png.
// Uso: node scripts/og/generar.mjs   (necesita Chrome instalado, como Playwright)
// Textos aprobados: nombre y posicionamiento del documento madre (sección 2).
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const textos = {
  es: { nombre: 'Luis Carlos Reyes Vanegas', rol: 'Arquitecto de soluciones cloud e IA' },
  // EN y PT (22 nov 2026): el mismo rol que el título del Home en cada diccionario.
  en: { nombre: 'Luis Carlos Reyes Vanegas', rol: 'Cloud and AI solutions architect' },
  pt: { nombre: 'Luis Carlos Reyes Vanegas', rol: 'Arquiteto de soluções cloud e IA' },
};

const plantilla = new URL('./tarjeta.html', import.meta.url).href;
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [idioma, { nombre, rol }] of Object.entries(textos)) {
  await page.goto(plantilla);
  await page.evaluate(
    ([n, r]) => {
      document.getElementById('nombre').textContent = n;
      document.getElementById('rol').textContent = r;
    },
    [nombre, rol],
  );
  await page.evaluate(() => document.fonts.ready);
  const destino = fileURLToPath(new URL(`../../src/assets/og/og-${idioma}.png`, import.meta.url));
  await page.screenshot({ path: destino });
  console.log(`Tarjeta lista: ${destino}`);
}
await browser.close();
