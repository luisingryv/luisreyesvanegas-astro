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

/**
 * Una página es su slug (existe en todos los idiomas) o su slug con los idiomas donde existe y,
 * si se sabe, la fecha de su último cambio (las noticias).
 */
export type PaginaSitemap = string | { slug: string; idiomas: readonly string[]; lastmod?: Date };

/** Fecha W3C (AAAA-MM-DD) para <lastmod>. */
const dia = (fecha: Date) => fecha.toISOString().slice(0, 10);

export function sitemapXml(
  site: URL,
  paginas: PaginaSitemap[],
  idiomas: readonly string[],
  idiomaPorDefecto: string,
  /**
   * <lastmod> de las páginas sin fecha propia: el día del build, porque el sitemap se genera en
   * cada despliegue (26 nov 2026, para que los agentes sepan qué cambió).
   */
  fechaDelBuild?: Date,
): string {
  const url = (idioma: string, slug: string) =>
    escapar(new URL(slug ? `/${idioma}/${slug}` : `/${idioma}`, site).toString());

  const entradas = paginas.flatMap((pagina) => {
    const slug = typeof pagina === 'string' ? pagina : pagina.slug;
    // Una noticia escrita solo en español no se anuncia en inglés ni en portugués (22 nov 2026).
    const suyos =
      typeof pagina === 'string' ? idiomas : idiomas.filter((i) => pagina.idiomas.includes(i));
    const porDefecto = suyos.includes(idiomaPorDefecto) ? idiomaPorDefecto : suyos[0];
    const fecha = (typeof pagina === 'string' ? undefined : pagina.lastmod) ?? fechaDelBuild;
    const lastmod = fecha ? `<lastmod>${dia(fecha)}</lastmod>` : '';
    return suyos.map((idioma) => {
      const alternativas = [
        ...suyos.map(
          (alt) => `<xhtml:link rel="alternate" hreflang="${alt}" href="${url(alt, slug)}"/>`,
        ),
        `<xhtml:link rel="alternate" hreflang="x-default" href="${url(porDefecto!, slug)}"/>`,
      ];
      return `<url><loc>${url(idioma, slug)}</loc>${lastmod}${alternativas.join('')}</url>`;
    });
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entradas,
    '</urlset>',
  ].join('\n');
}
