// Portada de una noticia (22 nov 2026): una imagen de la noticia, no una tarjeta con la marca.
// Dos caminos, en este orden:
//   1. La imagen de la propia noticia, solo si su dueño permite reutilizarla: kit de prensa con
//      permiso escrito, dominio público o licencia abierta (Creative Commons). Lleva crédito.
//      node scripts/noticias/portada.mjs <id> --url <imagen> --credito "Quién (licencia)" \
//        [--credito-url <página de la licencia>] --alt "Qué se ve"
//   2. Si no hay una con permiso, una ilustración hecha para la noticia, en SVG, sin los colores
//      ni el logo de Luis. El SVG queda en scripts/noticias/ilustraciones/<id>.svg.
//      node scripts/noticias/portada.mjs <id> --svg --alt "Qué se ve"
// Guarda src/assets/noticias/<id>.jpg (1600 × 900, sin metadatos) y escribe en la noticia imagen,
// imagenAlt y, si es ajena, imagenCredito e imagenCreditoUrl.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// sharp ya viene con Astro: se usa el suyo para no sumar una dependencia.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('astro/package.json'))('sharp');

const ANCHO = 1600;
const ALTO = 900;
const MAXIMO_BYTES = 20 * 1024 * 1024;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    url: { type: 'string' },
    svg: { type: 'boolean', default: false },
    credito: { type: 'string' },
    'credito-url': { type: 'string' },
    alt: { type: 'string' },
  },
});
const id = positionals[0];
const fallar = (mensaje) => {
  console.error(mensaje);
  process.exit(1);
};
if (!id || !/^[a-z0-9-]+$/.test(id)) fallar('Uso: node scripts/noticias/portada.mjs <id> ...');
if (Boolean(values.url) === values.svg) fallar('Usa --url <imagen> o --svg, uno de los dos.');
if (!values.alt || values.alt.trim().length < 10) fallar('Falta --alt: describe qué se ve.');
if (values.url && !values.credito) fallar('Una imagen ajena necesita --credito.');

const raiz = new URL('../../', import.meta.url);
const archivo = fileURLToPath(new URL(`src/content/noticias/${id}.md`, raiz));
if (!existsSync(archivo)) fallar(`No existe la noticia ${id}.`);

let entrada;
if (values.svg) {
  const svg = fileURLToPath(new URL(`scripts/noticias/ilustraciones/${id}.svg`, raiz));
  if (!existsSync(svg)) fallar(`Falta la ilustración: scripts/noticias/ilustraciones/${id}.svg`);
  entrada = sharp(readFileSync(svg), { density: 144 });
} else {
  const respuesta = await fetch(values.url, { signal: AbortSignal.timeout(30_000) });
  if (!respuesta.ok) fallar(`La imagen respondió ${respuesta.status}.`);
  const tipo = respuesta.headers.get('content-type') ?? '';
  // Solo imágenes rasterizadas: un SVG ajeno puede traer código.
  if (!/^image\/(jpeg|png|webp|avif|gif)/.test(tipo)) fallar(`No es una imagen válida: ${tipo}`);
  const datos = Buffer.from(await respuesta.arrayBuffer());
  if (datos.length > MAXIMO_BYTES) fallar('La imagen pesa más de 20 MB.');
  entrada = sharp(datos).rotate();
}

const carpeta = fileURLToPath(new URL('src/assets/noticias/', raiz));
mkdirSync(carpeta, { recursive: true });
// Sin withMetadata(): sharp no copia EXIF, GPS ni perfiles de la imagen original.
await entrada
  .resize(ANCHO, ALTO, { fit: 'cover', position: values.svg ? 'centre' : 'attention' })
  .flatten({ background: '#ffffff' })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(`${carpeta}${id}.jpg`);

// Escribe los campos de la portada en el frontmatter, reemplazando los que ya estén.
const texto = readFileSync(archivo, 'utf8');
const frontmatter = /^---\n([\s\S]*?)\n---/.exec(texto)?.[1];
if (!frontmatter) fallar(`La noticia ${id} no tiene frontmatter.`);
const comillas = (s) => `'${s.trim().replace(/'/g, "''")}'`;
const campos = {
  imagen: `../../assets/noticias/${id}.jpg`,
  imagenAlt: comillas(values.alt),
  imagenCredito: values.credito ? comillas(values.credito) : undefined,
  imagenCreditoUrl: values['credito-url'] ? comillas(values['credito-url']) : undefined,
};
let nuevo = frontmatter
  .split('\n')
  .filter((linea) => !/^(imagen|imagenAlt|imagenCredito|imagenCreditoUrl):/.test(linea))
  .join('\n');
for (const [campo, valor] of Object.entries(campos)) {
  if (valor) nuevo += `\n${campo}: ${valor}`;
}
writeFileSync(archivo, texto.replace(frontmatter, nuevo));
console.log(`Portada lista: src/assets/noticias/${id}.jpg`);
