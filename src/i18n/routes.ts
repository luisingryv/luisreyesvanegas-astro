import type { Locale } from './config';

// Mismo slug en los tres idiomas (sitemap: /es, /en, /pt).
export const routes = {
  home: '',
  consultoria: 'consultoria',
  sesionArquitectura: 'consultoria/sesion-de-arquitectura',
  optimizarCostos: 'consultoria/optimizar-costos',
  escalarInfraestructura: 'consultoria/escalar-infraestructura',
  retainers: 'consultoria/retainers',
  adopcionIa: 'consultoria/adopcion-ia',
  productos: 'productos',
  programasAws: 'programas-aws',
  casos: 'casos',
  eventos: 'eventos',
  sobreMi: 'sobre-mi',
  speaker: 'speaker',
  prensa: 'prensa',
  contacto: 'contacto',
  cv: 'cv',
  // Dos páginas legales (Luis, 20 nov 2026).
  privacidad: 'legal/privacidad',
  terminos: 'legal/terminos',
} as const;

export type RouteKey = keyof typeof routes;

/** Sección del menú a la que pertenece cada subpágina (para marcarla como actual). */
export const seccionDe: Partial<Record<RouteKey, RouteKey>> = {
  sesionArquitectura: 'consultoria',
  optimizarCostos: 'consultoria',
  escalarInfraestructura: 'consultoria',
  retainers: 'consultoria',
  adopcionIa: 'consultoria',
};

export function localizedPath(locale: Locale, route: RouteKey, hash?: string): string {
  const slug = routes[route];
  const path = slug ? `/${locale}/${slug}` : `/${locale}`;
  return hash ? `${path}#${hash}` : path;
}
