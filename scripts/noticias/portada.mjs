// Portada de una noticia. Estilo elegido por Luis (22 nov 2026): una foto de la noticia en dos
// tonos, a todo el ancho, con la cifra de la noticia en grande ("duotono", estilo C).
//
// La foto debe tener permiso de reutilización: kit de prensa con permiso escrito, dominio
// público o licencia abierta (Creative Commons, por ejemplo en Wikimedia Commons). Lleva crédito.
//
//   node scripts/noticias/portada.mjs <id> --url <foto> --credito "Foto editada de X (CC BY 4.0), vía Wikimedia Commons" \
//     --credito-url <página de la foto> --duotono --tono rojo --antetitulo "HACKEO A BINANCE" \
//     --cifra "6.300" --linea "millones de dólares" [--etiqueta "en unos 20 minutos"] \
//     [--encuadre izquierda|centro|derecha] --alt "Qué se ve, con el texto de la portada"
//
// Otras fuentes: --archivo <foto local> en vez de --url, o --svg para usar la ilustración
// scripts/noticias/ilustraciones/<id>.svg cuando no hay ninguna foto con permiso. Sin --duotono,
// la foto o la ilustración se usan tal cual.
//
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

// Paletas del duotono: sombra y luz de la foto. La luz es también el color de acento. Ninguna
// usa los azules ni el cian de la marca de Luis.
const TONOS = {
  ambar: { sombra: '#14100a', luz: '#f2b233' },
  rojo: { sombra: '#170807', luz: '#ff6a5c' },
  verde: { sombra: '#07140b', luz: '#9ef08a' },
  violeta: { sombra: '#130b22', luz: '#c4a1ff' },
  naranja: { sombra: '#1a0d06', luz: '#ff9f5a' },
  rosa: { sombra: '#1c0a14', luz: '#ff8fc4' },
};

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    url: { type: 'string' },
    archivo: { type: 'string' },
    svg: { type: 'boolean', default: false },
    credito: { type: 'string' },
    'credito-url': { type: 'string' },
    alt: { type: 'string' },
    duotono: { type: 'boolean', default: false },
    tono: { type: 'string', default: 'ambar' },
    antetitulo: { type: 'string' },
    cifra: { type: 'string' },
    linea: { type: 'string' },
    etiqueta: { type: 'string' },
    encuadre: { type: 'string', default: 'centro' },
  },
});
const id = positionals[0];
const fallar = (mensaje) => {
  console.error(mensaje);
  process.exit(1);
};
const fuentes = [values.url, values.archivo, values.svg || undefined].filter(Boolean);
if (!id || !/^[a-z0-9-]+$/.test(id)) fallar('Uso: node scripts/noticias/portada.mjs <id> ...');
if (fuentes.length !== 1) fallar('Usa una sola fuente: --url, --archivo o --svg.');
if (!values.alt || values.alt.trim().length < 10) fallar('Falta --alt: describe qué se ve.');
if (!values.svg && !values.credito) fallar('Una foto ajena necesita --credito.');
if (values.duotono && !(values.antetitulo && values.cifra && values.linea)) {
  fallar('El duotono necesita --antetitulo, --cifra y --linea.');
}
const tono = TONOS[values.tono];
if (!tono) fallar(`Tono desconocido. Usa uno de: ${Object.keys(TONOS).join(', ')}.`);
const posicion = { izquierda: 'left', centro: 'centre', derecha: 'right' }[values.encuadre];
if (!posicion) fallar('El encuadre es izquierda, centro o derecha.');

const raiz = new URL('../../', import.meta.url);
const archivoNoticia = fileURLToPath(new URL(`src/content/noticias/${id}.md`, raiz));
if (!existsSync(archivoNoticia)) fallar(`No existe la noticia ${id}.`);

// 1. La imagen de base, como PNG o JPG en memoria.
let base;
if (values.svg) {
  const svg = fileURLToPath(new URL(`scripts/noticias/ilustraciones/${id}.svg`, raiz));
  if (!existsSync(svg)) fallar(`Falta la ilustración: scripts/noticias/ilustraciones/${id}.svg`);
  base = await sharp(readFileSync(svg), { density: 144 }).png().toBuffer();
} else if (values.archivo) {
  base = readFileSync(values.archivo);
} else {
  const respuesta = await fetch(values.url, { signal: AbortSignal.timeout(30_000) });
  if (!respuesta.ok) fallar(`La imagen respondió ${respuesta.status}.`);
  base = Buffer.from(await respuesta.arrayBuffer());
}
if (base.length > MAXIMO_BYTES) fallar('La imagen pesa más de 20 MB.');
// Solo imágenes rasterizadas: un SVG ajeno puede traer código.
const { format } = await sharp(base).metadata();
if (!['jpeg', 'png', 'webp', 'avif', 'gif', 'tiff'].includes(format)) {
  fallar(`No es una imagen válida: ${format}`);
}
// Sin withMetadata(): sharp no copia EXIF, GPS ni perfiles de la imagen original.
const foto = await sharp(base)
  .rotate()
  .resize(ANCHO, ALTO, { fit: 'cover', position: values.svg ? 'centre' : posicion })
  .flatten({ background: '#ffffff' })
  .jpeg({ quality: 86 })
  .toBuffer();

// 2. La portada: la foto tal cual o en duotono con los textos.
const carpeta = fileURLToPath(new URL('src/assets/noticias/', raiz));
mkdirSync(carpeta, { recursive: true });
const salida = sharp(values.duotono ? Buffer.from(duotono(foto)) : foto, { density: 72 })
  .resize(ANCHO, ALTO)
  .jpeg({ quality: 84, mozjpeg: true });
await salida.toFile(`${carpeta}${id}.jpg`);

// 3. Los campos de la portada en el frontmatter, reemplazando los que ya estén.
const texto = readFileSync(archivoNoticia, 'utf8');
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
writeFileSync(archivoNoticia, texto.replace(frontmatter, nuevo));
console.log(`Portada lista: src/assets/noticias/${id}.jpg`);

// ─── Duotono ─────────────────────────────────────────────────────────────────

/** Ancho aproximado de un texto en Helvetica Neue Bold, en múltiplos del tamaño de letra. */
function medir(texto) {
  let ancho = 0;
  for (const c of texto) {
    if (/[0-9]/.test(c)) ancho += 0.58;
    else if (/[.,:;' ]/.test(c)) ancho += 0.3;
    else if (/[%]/.test(c)) ancho += 0.92;
    else if (/[A-ZÁÉÍÓÚÑ×+−–-]/.test(c)) ancho += 0.68;
    else ancho += 0.56;
  }
  return ancho;
}

function escapar(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Componente de un color #rrggbb entre 0 y 1. */
function canal(hex, i) {
  return (parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255).toFixed(3);
}

function duotono(fotoJpg) {
  const { sombra, luz } = tono;
  const fuente = 'font-family="Helvetica Neue, Helvetica, Arial, sans-serif"';
  const antetitulo = values.antetitulo.toUpperCase();
  const { cifra, linea, etiqueta } = values;

  // Tamaños que caben en la mitad izquierda.
  const tamanoAntetitulo = Math.min(30, 860 / (medir(antetitulo) + antetitulo.length * 0.27));
  const tamanoCifra = Math.min(250, 820 / (medir(cifra) - cifra.length * 0.03));
  const tamanoLinea = Math.max(38, Math.min(60, 900 / medir(linea)));
  const tamanoEtiqueta = 36;
  const anchoEtiqueta = etiqueta ? medir(etiqueta) * tamanoEtiqueta + 76 : 0;

  // Bloque de texto centrado en la altura.
  const alto =
    tamanoAntetitulo + 36 + tamanoCifra * 0.74 + 22 + tamanoLinea + (etiqueta ? 36 + 78 : 0);
  const y = (ALTO - alto) / 2;
  const yAntetitulo = y + tamanoAntetitulo;
  const yRaya = yAntetitulo + 18;
  const yCifra = yRaya + 18 + tamanoCifra * 0.74;
  const yLinea = yCifra + 22 + tamanoLinea;
  const yEtiqueta = yLinea + 36;

  const tabla = (i) => `tableValues="${canal(sombra, i)} ${canal(luz, i)}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${ANCHO}" height="${ALTO}" viewBox="0 0 ${ANCHO} ${ALTO}">
<defs>
  <filter id="duo" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"/>
    <feComponentTransfer>
      <feFuncR type="table" ${tabla(0)}/><feFuncG type="table" ${tabla(1)}/><feFuncB type="table" ${tabla(2)}/>
    </feComponentTransfer>
  </filter>
  <linearGradient id="velo" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${sombra}" stop-opacity="0.96"/>
    <stop offset="0.5" stop-color="${sombra}" stop-opacity="0.74"/>
    <stop offset="0.86" stop-color="${sombra}" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect width="${ANCHO}" height="${ALTO}" fill="${sombra}"/>
<image width="${ANCHO}" height="${ALTO}" xlink:href="data:image/jpeg;base64,${fotoJpg.toString('base64')}" filter="url(#duo)"/>
<rect width="${ANCHO}" height="${ALTO}" fill="url(#velo)"/>
<text x="96" y="${yAntetitulo.toFixed(0)}" font-size="${tamanoAntetitulo.toFixed(0)}" font-weight="700" letter-spacing="8" fill="${luz}" ${fuente}>${escapar(antetitulo)}</text>
<rect x="96" y="${yRaya.toFixed(0)}" width="80" height="6" fill="${luz}"/>
<text x="86" y="${yCifra.toFixed(0)}" font-size="${tamanoCifra.toFixed(0)}" font-weight="800" letter-spacing="${(-tamanoCifra * 0.03).toFixed(1)}" fill="#ffffff" ${fuente}>${escapar(cifra)}</text>
<text x="96" y="${yLinea.toFixed(0)}" font-size="${tamanoLinea.toFixed(0)}" font-weight="700" fill="#ffffff" ${fuente}>${escapar(linea)}</text>
${
  etiqueta
    ? `<rect x="96" y="${yEtiqueta.toFixed(0)}" width="${anchoEtiqueta.toFixed(0)}" height="78" rx="39" fill="${luz}"/>
<text x="${(96 + anchoEtiqueta / 2).toFixed(0)}" y="${(yEtiqueta + 52).toFixed(0)}" text-anchor="middle" font-size="${tamanoEtiqueta}" font-weight="700" fill="${sombra}" ${fuente}>${escapar(etiqueta)}</text>`
    : ''
}
</svg>`;
}
