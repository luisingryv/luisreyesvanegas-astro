import type { APIRoute } from 'astro';
import { defaultLocale, publishedLocales } from '../i18n/config';
import { sitemapXml, slugsDePaginas } from '../lib/seo/sitemap';

export const prerender = true;

const paginas = slugsDePaginas(Object.keys(import.meta.glob('/src/pages/**/*.astro')));

export const GET: APIRoute = ({ site }) =>
  new Response(sitemapXml(site!, paginas, publishedLocales, defaultLocale), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
