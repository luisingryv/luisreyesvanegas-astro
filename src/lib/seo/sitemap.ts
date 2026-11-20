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

export function sitemapXml(
  site: URL,
  slugs: string[],
  idiomas: readonly string[],
  idiomaPorDefecto: string,
): string {
  const url = (idioma: string, slug: string) =>
    escapar(new URL(slug ? `/${idioma}/${slug}` : `/${idioma}`, site).toString());

  const entradas = slugs.flatMap((slug) =>
    idiomas.map((idioma) => {
      const alternativas = [
        ...idiomas.map(
          (alt) => `<xhtml:link rel="alternate" hreflang="${alt}" href="${url(alt, slug)}"/>`,
        ),
        `<xhtml:link rel="alternate" hreflang="x-default" href="${url(idiomaPorDefecto, slug)}"/>`,
      ];
      return `<url><loc>${url(idioma, slug)}</loc>${alternativas.join('')}</url>`;
    }),
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entradas,
    '</urlset>',
  ].join('\n');
}
