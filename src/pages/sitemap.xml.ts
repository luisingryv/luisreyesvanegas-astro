import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { defaultLocale, publishedLocales } from '../i18n/config';
import { legalPublicable } from '../config/legal';
import { sitemapXml, slugsDePaginas } from '../lib/seo/sitemap';

export const prerender = true;

const servicios = await getCollection('servicios');
// Casos con página propia y permiso de publicación.
const casos = await getCollection('casos', (c) => c.data.permiso && c.data.pagina !== undefined);
const paginas = [
  ...slugsDePaginas(Object.keys(import.meta.glob('/src/pages/**/*.astro'))),
  // Subpáginas de Consultoría (ruta dinámica con la plantilla común).
  ...servicios.map(({ id }) => `consultoria/${id}`),
  ...casos.map(({ id }) => `casos/${id}`),
  // Las páginas legales son una ruta dinámica: entran cuando tienen todos sus datos.
  ...(legalPublicable ? ['legal/privacidad', 'legal/terminos'] : []),
];

export const GET: APIRoute = ({ site }) =>
  new Response(sitemapXml(site!, paginas, publishedLocales, defaultLocale), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
