// Sitemap con alternativas hreflang. Funciones puras: las páginas salen de los archivos de
// src/pages/[lang]/ y los idiomas, de publishedLocales (EN y PT entran cuando se publiquen).

/** '/src/pages/[lang]/sobre-mi.astro' → 'sobre-mi'; index → ''. Ignora rutas dinámicas internas. */
export function slugsDePaginas(archivos: string[]): string[] {
  return archivos
    .map((archivo) => /^\/src\/pages\/\[lang\]\/(.+)\.astro$/.exec(archivo)?.[1])
    .filter((ruta): ruta is string => ruta !== undefined && !ruta.includes('['))
    .map((ruta) => (ruta === 'index' ? '' : ruta.replace(/\/index$/, '')))
    .sort();
}

const escapar = (texto: string) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Una página es su slug (existe en todos los idiomas) o su slug con los idiomas donde existe. */
export type PaginaSitemap = string | { slug: string; idiomas: readonly string[] };

export function sitemapXml(
  site: URL,
  paginas: PaginaSitemap[],
  idiomas: readonly string[],
  idiomaPorDefecto: string,
): string {
  const url = (idioma: string, slug: string) =>
    escapar(new URL(slug ? `/${idioma}/${slug}` : `/${idioma}`, site).toString());

  const entradas = paginas.flatMap((pagina) => {
    const slug = typeof pagina === 'string' ? pagina : pagina.slug;
    // Una noticia escrita solo en español no se anuncia en inglés ni en portugués (22 nov 2026).
    const suyos =
      typeof pagina === 'string' ? idiomas : idiomas.filter((i) => pagina.idiomas.includes(i));
    const porDefecto = suyos.includes(idiomaPorDefecto) ? idiomaPorDefecto : suyos[0];
    return suyos.map((idioma) => {
      const alternativas = [
        ...suyos.map(
          (alt) => `<xhtml:link rel="alternate" hreflang="${alt}" href="${url(alt, slug)}"/>`,
        ),
        `<xhtml:link rel="alternate" hreflang="x-default" href="${url(porDefecto!, slug)}"/>`,
      ];
      return `<url><loc>${url(idioma, slug)}</loc>${alternativas.join('')}</url>`;
    });
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entradas,
    '</urlset>',
  ].join('\n');
}
