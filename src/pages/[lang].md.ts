// /es.md, /en.md y /pt.md: el Home en Markdown para agentes de IA (26 nov 2026). La raíz /
// también lo entrega cuando se pide con Accept: text/markdown (ver src/middleware.ts).
import type { APIRoute, GetStaticPaths } from 'astro';
import { publishedLocales, type PublishedLocale } from '../i18n/config';
import { markdownDelInicio } from '../lib/seo/inicio-markdown';

export const prerender = true;

export const getStaticPaths = (() =>
  publishedLocales.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, site }) =>
  new Response(await markdownDelInicio(params.lang as PublishedLocale, site!), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
