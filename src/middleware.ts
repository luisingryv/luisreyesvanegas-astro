// La raíz / (26 nov 2026, para agentes de IA): con Accept: text/markdown entrega el Home en
// Markdown en vez de redirigir a /es; siempre lleva la cabecera Link. Las demás páginas pasan sin
// cambios. Las páginas estáticas de cada idioma reciben su Link desde astro.config.
import { defineMiddleware } from 'astro:middleware';
import { defaultLocale } from './i18n/config';
import { cabeceraLink, prefiereMarkdown } from './lib/seo/agentes';
import { markdownDelInicio } from './lib/seo/inicio-markdown';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered || context.url.pathname !== '/') return next();

  const link = cabeceraLink(context.site!, defaultLocale);
  if (prefiereMarkdown(context.request.headers.get('accept'))) {
    return new Response(await markdownDelInicio(defaultLocale, context.site!), {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', Link: link, Vary: 'Accept' },
    });
  }

  const respuesta = await next();
  const conLink = new Response(respuesta.body, respuesta);
  conLink.headers.set('Link', link);
  conLink.headers.append('Vary', 'Accept');
  return conLink;
});
