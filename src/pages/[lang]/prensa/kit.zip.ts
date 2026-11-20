// Kit de prensa en un .zip: bio en tres largos, datos del XPRIZE, fotos oficiales en alta
// resolución y logos en PNG y SVG. Se arma al construir el sitio con lo mismo que muestra Prensa.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute, GetStaticPaths, InferGetStaticParamsType } from 'astro';
import { publishedLocales } from '../../../i18n/config';
import { getBio, getPaginaPrensa } from '../../../lib/content';
import { LOGOS_KIT, NOMBRE_KIT, rutaFotoPrensa, rutaLogo } from '../../../lib/kit-prensa';
import { crearZip, type EntradaZip } from '../../../lib/zip';

export const prerender = true;

export const getStaticPaths = (() =>
  publishedLocales.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

const leer = (ruta: string) => readFile(join(process.cwd(), ruta));
const texto = (lineas: string[]) => new TextEncoder().encode(`${lineas.join('\n')}\n`);

export const GET: APIRoute = async ({ params }) => {
  const { lang } = params as InferGetStaticParamsType<typeof getStaticPaths>;
  const [pagina, bio] = await Promise.all([getPaginaPrensa(lang), getBio(lang)]);
  const carpeta = NOMBRE_KIT;

  const bioTxt = texto(
    bio.largos.flatMap((largo) => [largo.etiqueta.toUpperCase(), largo.texto, '']),
  );
  const datosTxt = texto([
    pagina.hero.titulo.toUpperCase(),
    ...pagina.hero.datos.map((d) => `${d.clave}: ${d.valor}`),
    '',
    pagina.xprize.titulo.toUpperCase(),
    pagina.xprize.texto,
    ...pagina.xprize.datos.map((d) => `${d.clave}: ${d.valor}`),
    `${pagina.xprize.fuente.texto} (${pagina.xprize.fuente.url})`,
  ]);

  const entradas: EntradaZip[] = [
    { nombre: `${carpeta}/bio.txt`, datos: bioTxt },
    { nombre: `${carpeta}/datos.txt`, datos: datosTxt },
  ];
  for (const foto of pagina.fotos.lista) {
    entradas.push({
      nombre: `${carpeta}/fotos/${foto.archivo}`,
      datos: await leer(rutaFotoPrensa(foto.archivo)),
    });
  }
  for (const logo of LOGOS_KIT) {
    for (const formato of logo.formatos) {
      const nombre = 'nombre' in logo ? logo.nombre : logo.archivo;
      entradas.push({
        nombre: `${carpeta}/logos/${nombre}.${formato}`,
        datos: await leer(rutaLogo(logo.archivo, formato)),
      });
    }
  }

  return new Response(crearZip(entradas), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${NOMBRE_KIT}.zip"`,
    },
  });
};
