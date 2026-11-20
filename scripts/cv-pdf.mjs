// Genera el CV en PDF desde la página /cv (estilos de impresión): public/cv/luis-carlos-reyes-vanegas-cv-<idioma>.pdf.
// Uso: pnpm build && pnpm cv:pdf   (levanta el build en un puerto propio; necesita Chrome, como Playwright)
// Volver a generarlo cada vez que cambien los textos del CV (src/content/paginas/cv.yaml).
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

// Solo los idiomas con CV aprobado (EN espera textos de Luis).
const IDIOMAS = ['es'];
const PUERTO = 4398;

const servidor = spawn('node', ['dist/server/entry.mjs'], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(PUERTO) },
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise((listo, falla) => {
  servidor.stdout.on('data', (d) => String(d).includes('Server listening') && listo());
  servidor.on('exit', () =>
    falla(new Error('El servidor del build no arrancó (¿falta pnpm build?).')),
  );
});

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  for (const idioma of IDIOMAS) {
    await page.goto(`http://127.0.0.1:${PUERTO}/${idioma}/cv`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const destino = fileURLToPath(
      new URL(`../public/cv/luis-carlos-reyes-vanegas-cv-${idioma}.pdf`, import.meta.url),
    );
    await mkdir(fileURLToPath(new URL('../public/cv/', import.meta.url)), { recursive: true });
    await page.pdf({
      path: destino,
      format: 'Letter',
      printBackground: true,
      // A escala, la página carta tiene el ancho de una ventana de escritorio: hero en dos columnas.
      scale: 0.7,
      margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
    });
    console.log(`CV ${idioma}: ${destino}`);
  }
} finally {
  await browser.close();
  servidor.kill();
}
