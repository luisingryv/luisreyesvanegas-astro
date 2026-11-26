// El Home en Markdown (26 nov 2026), para los agentes de IA que lo piden con Accept:
// text/markdown: la misma página que el HTML, sección por sección y con los mismos textos
// aprobados en cada idioma. No agrega frases propias.
import { evoluteccUrl, site } from '../../config/site';
import type { PublishedLocale } from '../../i18n/config';
import { getDictionary } from '../../i18n';
import { localizedPath, type RouteKey } from '../../i18n/routes';
import {
  getCharlasRecientes,
  getClientes,
  getLogrosHome,
  getNoticias,
  getPaginaHome,
  getTrayectoriaHome,
} from '../content';

const sinFlecha = (texto: string) => texto.replace(/\s*→\s*$/, '');

export async function markdownDelInicio(idioma: PublishedLocale, sitio: URL): Promise<string> {
  const t = getDictionary(idioma);
  const url = (ruta: string) => new URL(ruta, sitio).toString();
  const pagina = (ruta: RouteKey) => url(localizedPath(idioma, ruta));

  const [home, logros, hitos, charlas, noticias, clientes] = await Promise.all([
    getPaginaHome(idioma),
    getLogrosHome(idioma),
    getTrayectoriaHome(idioma),
    getCharlasRecientes(idioma),
    getNoticias(idioma),
    getClientes(),
  ]);
  const { hero, router, xprize, trayectoria, casos, evolutecc, contacto } = home;

  const lineas: string[] = [
    `# ${hero.titulo}`,
    '',
    `${site.person.name} · ${hero.eyebrow}`,
    '',
    hero.bajada,
    '',
    `[${hero.premio.texto}](${hero.premio.url})`,
    '',
    `- [${hero.agendar}](${pagina('home')}#agenda)`,
    `- [${hero.invitarme}](${pagina('speaker')})`,
    '',
    `## ${router.titulo}`,
    '',
    ...router.tarjetas.map(
      (c) => `- **${c.etiqueta}: ${c.titulo}** ${c.texto} [${c.boton}](${pagina(c.ruta)})`,
    ),
    '',
    `## ${home.logros.eyebrow}`,
    '',
    home.logros.titulo,
    '',
    ...logros.map((l) =>
      [
        `- ${l.etiqueta ? `${l.etiqueta}: ` : ''}**${l.metrica}**`,
        l.barras ? ` (${l.barras.leyenda})` : '',
        `. ${l.descripcion}`,
        l.quien ? ` (${l.quien})` : '',
        l.fuente ? ` [${l.fuente.texto}](${l.fuente.url})` : '',
      ].join(''),
    ),
    '',
    `## ${xprize.eyebrow}`,
    '',
    `### ${xprize.titulo}`,
    '',
    xprize.texto,
    '',
    ...xprize.cifras.map((c) => `- **${c.valor}** ${c.etiqueta}`),
    '',
    `[${xprize.fuente.texto}](${xprize.fuente.url}) · [${xprize.boton}](${pagina('productos')})`,
    '',
    `## ${trayectoria.titulo}`,
    '',
    ...hitos.map((h) => `- ${h.anio} · **${h.titulo}**: ${h.texto}`),
    '',
    `[${trayectoria.boton}](${pagina('sobreMi')})`,
    '',
    `## ${home.charlas.titulo}`,
    '',
    ...charlas.map((c) => `- **${c.evento}** · ${c.cuando}: ${c.resumen}`),
    '',
    `[${sinFlecha(home.charlas.verTodos)}](${pagina('eventos')})`,
    '',
  ];

  // Las tres más recientes, como en la página.
  const recientes = noticias.slice(0, 3);
  if (recientes.length > 0) {
    lineas.push(
      `## ${t.noticias.titulo}`,
      '',
      ...recientes.map(
        (n) => `- [${n.titulo}](${pagina('noticias')}/${n.id}) · ${n.cuando}: ${n.resumen}`,
      ),
      '',
      `[${t.noticias.verTodas}](${pagina('noticias')})`,
      '',
    );
  }

  lineas.push(`## ${casos.titulo}`, '');
  for (const grupo of casos.grupos) {
    lineas.push(
      `### ${grupo.titulo}`,
      '',
      ...grupo.casos.map((c) =>
        c.slug ? `- [${c.nombre}](${pagina('casos')}/${c.slug})` : `- ${c.nombre}`,
      ),
      '',
    );
  }
  lineas.push(`[${sinFlecha(casos.verTodos)}](${pagina('casos')})`, '');

  // Solo clientes con permiso escrito (la sección no aparece sin ellos).
  if (clientes.length > 0) {
    lineas.push(
      `## ${home.clientes.titulo}`,
      '',
      ...clientes.map((c) => `- ${c.nombre}`),
      '',
      home.clientes.nota,
      '',
    );
  }

  lineas.push(
    `## ${evolutecc.titulo}`,
    '',
    evolutecc.texto,
    '',
    ...evolutecc.cifras.map((c) => `- ${c}`),
    '',
    `[${evolutecc.boton}](${evoluteccUrl('home')})`,
    '',
    `## ${contacto.titulo}`,
    '',
    contacto.texto,
    '',
    `- [${t.footer.contacto}](${pagina('contacto')})`,
    `- [${hero.agendar}](${pagina('home')}#agenda)`,
    '',
    '---',
    '',
    ...(['consultoria', 'productos', 'casos', 'eventos', 'sobreMi'] as const).map(
      (ruta) => `- [${t.nav[ruta]}](${pagina(ruta)})`,
    ),
    `- [${t.footer.prensa}](${pagina('prensa')})`,
    `- [${t.footer.legal}](${pagina('privacidad')})`,
    `- [${t.footer.linkedin}](${site.linkedin})`,
    '',
  );

  return lineas.join('\n');
}
