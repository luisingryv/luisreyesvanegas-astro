import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { defaultLocale, publishedLocales } from '../i18n/config';
import { legalPublicable } from '../config/legal';
import { sitemapXml, slugsDePaginas, type PaginaSitemap } from '../lib/seo/sitemap';

export const prerender = true;

const servicios = await getCollection('servicios');
// Casos con página propia y permiso de publicación.
const casos = await getCollection('casos', (c) => c.data.permiso && c.data.pagina !== undefined);
// Noticias publicadas (21 nov 2026): cada una solo en su idioma, y el índice de Noticias solo en
// los idiomas que tienen alguna.
const noticias = await getCollection('noticias', (n) => n.data.estado === 'publicada');
const idiomasConNoticias = publishedLocales.filter((l) =>
  noticias.some((n) => n.data.idioma === l),
);
const ultimaNoticia = noticias.reduce<Date | undefined>(
  (ultima, n) => (!ultima || n.data.fecha > ultima ? n.data.fecha : ultima),
  undefined,
);
const paginas: PaginaSitemap[] = [
  ...slugsDePaginas(Object.keys(import.meta.glob('/src/pages/**/*.astro'))).filter(
    (slug) => slug !== 'noticias',
  ),
  ...(idiomasConNoticias.length > 0
    ? [{ slug: 'noticias', idiomas: idiomasConNoticias, lastmod: ultimaNoticia }]
    : []),
  ...noticias.map(({ id, data }) => ({
    slug: `noticias/${id}`,
    idiomas: [data.idioma],
    lastmod: data.fecha,
  })),
  // Subpáginas de Consultoría (ruta dinámica con la plantilla común).
  ...servicios.map(({ id }) => `consultoria/${id}`),
  ...casos.map(({ id }) => `casos/${id}`),
  // Las páginas legales son una ruta dinámica: entran cuando tienen todos sus datos.
  ...(legalPublicable ? ['legal/privacidad', 'legal/terminos'] : []),
];

export const GET: APIRoute = ({ site }) =>
  new Response(sitemapXml(site!, paginas, publishedLocales, defaultLocale, new Date()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
