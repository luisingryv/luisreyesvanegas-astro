// Cuánto falta traducir: por cada archivo de src/content, los textos en español y cuántos tienen
// ya su versión en inglés y en portugués, con el total de palabras. Uso: pnpm i18n:faltantes
// EN y PT no se publican hasta que Luis apruebe sus textos (CLAUDE.md).
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../../', import.meta.url));
const contenido = join(raiz, 'src/content');

async function yamls(dir) {
  const salida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await yamls(ruta)));
    else if (e.name.endsWith('.yaml') && !e.name.startsWith('_')) salida.push(ruta);
  }
  return salida.sort();
}

// Los textos son cadenas de una línea: es: '...' o, si llevan apóstrofo, es: "..." (Prettier).
const textos = (yaml, idioma) =>
  [
    ...yaml.matchAll(new RegExp(`\\b${idioma}: (?:'((?:[^']|'')*)'|"((?:[^"\\\\]|\\\\.)*)")`, 'g')),
  ].map((m) => m[1] ?? m[2]);
const palabras = (lista) => lista.reduce((n, t) => n + t.split(/\s+/).filter(Boolean).length, 0);

const filas = [];
let total = { es: 0, en: 0, pt: 0, palabras: 0 };
for (const archivo of await yamls(contenido)) {
  const yaml = await readFile(archivo, 'utf8');
  const es = textos(yaml, 'es');
  if (es.length === 0) continue;
  const fila = {
    archivo: relative(contenido, archivo),
    es: es.length,
    en: textos(yaml, 'en').length,
    pt: textos(yaml, 'pt').length,
    palabras: palabras(es),
  };
  filas.push(fila);
  for (const k of ['es', 'en', 'pt', 'palabras']) total[k] += fila[k];
}

console.log('| Archivo | Textos ES | EN | PT | Palabras ES |');
console.log('|---|---:|---:|---:|---:|');
for (const f of filas)
  console.log(`| ${f.archivo} | ${f.es} | ${f.en} | ${f.pt} | ${f.palabras} |`);
console.log(
  `| **Total** | **${total.es}** | **${total.en}** | **${total.pt}** | **${total.palabras}** |`,
);
