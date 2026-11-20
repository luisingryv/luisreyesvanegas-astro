import type { APIRoute } from 'astro';
import { defaultLocale, publishedLocales } from '../i18n/config';
import { legalPublicable } from '../config/legal';
import { sitemapXml, slugsDePaginas } from '../lib/seo/sitemap';

export const prerender = true;

const paginas = [
  ...slugsDePaginas(Object.keys(import.meta.glob('/src/pages/**/*.astro'))),
  // Las páginas legales son una ruta dinámica: entran cuando tienen todos sus datos.
  ...(legalPublicable ? ['legal/privacidad', 'legal/terminos'] : []),
];

export const GET: APIRoute = ({ site }) =>
  new Response(sitemapXml(site!, paginas, publishedLocales, defaultLocale), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
