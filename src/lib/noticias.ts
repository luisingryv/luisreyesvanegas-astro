// Páginas del sitio que una noticia puede enlazar como relacionadas (enlace interno para SEO).
// Las usan la colección de noticias (content.config) y la página de cada noticia.
export const PAGINAS_RELACIONADAS = [
  'optimizarCostos',
  'escalarInfraestructura',
  'sesionArquitectura',
  'adopcionIa',
  'programasAws',
  'productos',
] as const;

export type PaginaRelacionada = (typeof PAGINAS_RELACIONADAS)[number];
