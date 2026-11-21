// RSS de Noticias por idioma (21 nov 2026): solo noticias publicadas. Sirve para lectores de
// feeds y para que los buscadores descubran cada noticia nueva.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getDictionary } from '../../../i18n';
import { publishedLocales, type PublishedLocale } from '../../../i18n/config';
import { localizedPath } from '../../../i18n/routes';
import { getNoticias } from '../../../lib/content';

export const prerender = true;

export const getStaticPaths = (() =>
  publishedLocales.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

const escapar = (texto: string) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as PublishedLocale;
  const t = getDictionary(lang);
  const base = new URL(localizedPath(lang, 'noticias'), site).toString();
  const noticias = (await getNoticias(lang)).filter((n) => !n.borrador);
  const items = noticias.map((n) => {
    const enlace = `${base}/${n.id}`;
    return [
      '<item>',
      `<title>${escapar(n.titulo)}</title>`,
      `<link>${enlace}</link>`,
      `<guid isPermaLink="true">${enlace}</guid>`,
      `<pubDate>${n.fecha.toUTCString()}</pubDate>`,
      `<description>${escapar(n.resumen)}</description>`,
      '</item>',
    ].join('');
  });
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"><channel>',
    `<title>${escapar(`${t.pages.noticias.title} · ${t.meta.siteName}`)}</title>`,
    `<link>${base}</link>`,
    `<description>${escapar(t.noticias.bajada)}</description>`,
    `<language>${lang}</language>`,
    ...items,
    '</channel></rss>',
  ].join('');
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
