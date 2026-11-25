// llms.txt (formato de llmstxt.org): resumen del sitio para asistentes y buscadores de IA.
// 25 nov 2026: se arma solo con textos aprobados del sitio (colecciones de contenido), para que
// no diga nada que el sitio no diga. La primera versión (escrita a mano el 22 nov) tenía datos
// inventados: NeoMKT y Ofilix como productos propios y una descripción de Trama que no es.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getDictionary } from '../i18n';
import { localizedPath, type RouteKey } from '../i18n/routes';
import {
  getCasos,
  getPaginaAdopcionIa,
  getPaginaHome,
  getPaginaProductos,
  getPaginaProgramasAws,
  getServicio,
} from '../lib/content';

export const prerender = true;

const IDIOMA = 'es';
// Subpáginas de Consultoría, en el orden del menú.
const SERVICIOS = [
  'optimizar-costos',
  'escalar-infraestructura',
  'sesion-de-arquitectura',
  'retainers',
] as const;

export const GET: APIRoute = async ({ site }) => {
  const url = (ruta: string) => new URL(ruta, site).toString();
  const pagina = (ruta: RouteKey) => url(localizedPath(IDIOMA, ruta));
  const t = getDictionary(IDIOMA);

  const [home, adopcion, productos, programas, casos, servicios] = await Promise.all([
    getPaginaHome(IDIOMA),
    getPaginaAdopcionIa(IDIOMA),
    getPaginaProductos(IDIOMA),
    getPaginaProgramasAws(IDIOMA),
    getCasos(IDIOMA),
    Promise.all(SERVICIOS.map((id) => getServicio(id, IDIOMA))),
  ]);
  const charlas = (await getCollection('charlas'))
    .map((c) => c.data)
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

  const lineas = [
    '# Luis Carlos Reyes Vanegas',
    '',
    `> ${t.pages.home.title}. ${home.hero.eyebrow}. ${home.hero.premio.texto}.`,
    '',
    home.hero.bajada,
    '',
    'El sitio está en español, inglés y portugués: ' +
      ['es', 'en', 'pt'].map((l) => url(`/${l}`)).join(', ') +
      '. Las noticias están solo en español.',
    '',
    '## Consultoría',
    '',
    ...servicios.map((s) => `- [${s.titulo}](${pagina(s.ruta)}): ${s.hero.texto}`),
    `- [${adopcion.hero.eyebrow}](${pagina('adopcionIa')}): ${adopcion.hero.texto}`,
    `- [${programas.hero.eyebrow}](${pagina('programasAws')}): ${programas.hero.texto}`,
    '',
    '## Productos',
    '',
    ...productos.portafolio.productos.map(
      (p) => `- ${p.nombre} (${p.dueno}, ${p.estado.toLowerCase()}): ${p.texto}`,
    ),
    `- Más información: ${pagina('productos')}`,
    '',
    '## Casos',
    '',
    ...casos.map((c) => {
      const titulo = c.pagina
        ? `[${c.tarjeta.titulo}](${pagina('casos')}/${c.id})`
        : c.tarjeta.titulo;
      return `- ${titulo} · ${c.tarjeta.quien}`;
    }),
    '',
    '## Charlas',
    '',
    ...charlas.map(
      (c) =>
        `- ${c.fecha.toISOString().slice(0, 10)} · ${c.evento} (${c.lugar[IDIOMA]}): ${c.titulo[IDIOMA]}`,
    ),
    `- Invitarlo a hablar: ${pagina('speaker')}`,
    '',
    '## Más páginas',
    '',
    `- [Sobre mí](${pagina('sobreMi')})`,
    `- [CV](${pagina('cv')})`,
    `- [Noticias](${pagina('noticias')})`,
    `- [Eventos](${pagina('eventos')})`,
    `- [Prensa](${pagina('prensa')})`,
    `- [Contacto](${pagina('contacto')})`,
    `- [Sitemap](${url('/sitemap.xml')})`,
    '',
  ];

  return new Response(lineas.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
