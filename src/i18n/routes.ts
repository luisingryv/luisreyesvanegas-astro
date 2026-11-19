import type { Locale } from './config';

// Mismo slug en los tres idiomas (sitemap: /es, /en, /pt).
export const routes = {
  home: '',
  consultoria: 'consultoria',
  productos: 'productos',
  casos: 'casos',
  eventos: 'eventos',
  sobreMi: 'sobre-mi',
  speaker: 'speaker',
  prensa: 'prensa',
  contacto: 'contacto',
  legal: 'legal',
} as const;

export type RouteKey = keyof typeof routes;

export function localizedPath(locale: Locale, route: RouteKey, hash?: string): string {
  const slug = routes[route];
  const path = slug ? `/${locale}/${slug}` : `/${locale}`;
  return hash ? `${path}#${hash}` : path;
}
