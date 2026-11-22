// Genera la tarjeta de una noticia (1200 × 630) con su título, fecha y medio, y la agrega a la
// noticia (imagen e imagenAlt). Es una imagen propia: nunca la foto de otro medio.
// Uso: node scripts/noticias/tarjeta.mjs <id>   (id = nombre del archivo sin .md)
// Necesita Chrome instalado, como Playwright. La usa la tarea diaria de borradores de noticias.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const id = process.argv[2];
if (!id || !/^[a-z0-9-]+$/.test(id)) {
  console.error('Uso: node scripts/noticias/tarjeta.mjs <id-de-la-noticia>');
  process.exit(1);
}

const archivo = fileURLToPath(new URL(`../../src/content/noticias/${id}.md`, import.meta.url));
const texto = readFileSync(archivo, 'utf8');
const frontmatter = /^---\n([\s\S]*?)\n---/.exec(texto)?.[1];
if (!frontmatter) throw new Error(`La noticia ${id} no tiene frontmatter.`);

// Lee un valor de texto del frontmatter, entre comillas simples o dobles.
const valor = (patron) => {
  const m = patron.exec(frontmatter);
  if (!m) return undefined;
  const crudo = m[1].trim();
  if (crudo.startsWith("'")) return crudo.slice(1, -1).replace(/''/g, "'");
  if (crudo.startsWith('"')) return JSON.parse(crudo);
  return crudo;
};
const titulo = valor(/^titulo:\s*(.+)$/m);
const fecha = valor(/^fecha:\s*(\S+)/m);
const medio = valor(/^fuente:\s*\n\s+nombre:\s*(.+)$/m);
if (!titulo || !fecha || !medio) throw new Error('Faltan titulo, fecha o fuente.nombre.');

const cuando = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
  .format(new Date(`${fecha}T00:00:00Z`))
  .replace(/\bsept\b/, 'sep')
  .replace('.', '');

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(new URL('./tarjeta.html', import.meta.url).href);
  await page.evaluate(
    ([t, e, f]) => {
      document.getElementById('titulo').textContent = t;
      document.getElementById('eyebrow').textContent = e;
      document.getElementById('fuente').textContent = f;
      // Títulos largos: letra más pequeña para que quepan en tres líneas.
      const tamano = t.length > 90 ? 44 : t.length > 70 ? 50 : 58;
      document.body.style.setProperty('--tamano', `${tamano}px`);
    },
    [titulo, `Noticias · ${cuando}`, `Fuente: ${medio}`],
  );
  await page.evaluate(() => document.fonts.ready);
  const carpeta = fileURLToPath(new URL('../../src/assets/noticias/', import.meta.url));
  mkdirSync(carpeta, { recursive: true });
  await page.screenshot({ path: `${carpeta}${id}.png` });
} finally {
  await browser.close();
}

// Agrega imagen e imagenAlt a la noticia, si todavía no los tiene.
if (!/^imagen:/m.test(frontmatter)) {
  const alt = `Tarjeta de la noticia con su título: ${titulo}`.replace(/'/g, "''");
  const nuevo = `${frontmatter}\nimagen: ../../assets/noticias/${id}.png\nimagenAlt: '${alt}'`;
  writeFileSync(archivo, texto.replace(frontmatter, nuevo));
}
console.log(`Tarjeta lista: src/assets/noticias/${id}.png`);
