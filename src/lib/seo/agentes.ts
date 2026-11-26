// Funciones puras para agentes de IA (26 nov 2026): negociación de Markdown y cabecera Link
// (RFC 8288) de la raíz /, que usa el middleware. /es, /en y /pt son estáticas y no pasan por el
// middleware: anuncian lo mismo con <link> en el head. En Hostinger tampoco sirve la opción
// staticHeaders de @astrojs/node, porque el sitio se construye en una carpeta y corre en otra.

/**
 * true cuando el cliente pide Markdown (Accept: text/markdown) y no prefiere HTML. Los
 * navegadores no mandan text/markdown, así que siempre reciben HTML.
 */
export function prefiereMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  const calidades = new Map<string, number>();
  for (const parte of accept.split(',')) {
    const [tipo = '', ...parametros] = parte.trim().toLowerCase().split(';');
    const q = parametros.map((p) => p.trim()).find((p) => p.startsWith('q='));
    const valor = q === undefined ? 1 : Number(q.slice(2));
    calidades.set(tipo.trim(), Number.isFinite(valor) ? valor : 0);
  }
  const markdown = calidades.get('text/markdown') ?? 0;
  if (markdown <= 0) return false;
  const html = Math.max(
    calidades.get('text/html') ?? 0,
    calidades.get('application/xhtml+xml') ?? 0,
  );
  return markdown >= html;
}

/**
 * Cabecera Link del Home de un idioma: su versión en Markdown, el resumen llms.txt y la página
 * del autor (Sobre mí).
 */
export function cabeceraLink(sitio: URL, idioma: string): string {
  const url = (ruta: string) => new URL(ruta, sitio).toString();
  return [
    `<${url(`/${idioma}.md`)}>; rel="alternate"; type="text/markdown"`,
    `<${url('/llms.txt')}>; rel="describedby"; type="text/plain"`,
    `<${url(`/${idioma}/sobre-mi`)}>; rel="author"`,
  ].join(', ');
}
