// Resuelve los destinos de los enlaces del contenido: una página del sitio (con ancla), la
// página de un caso o EvolutecC con su UTM.
import { evoluteccUrl } from '../config/site';
import type { Locale } from '../i18n/config';
import { localizedPath, type RouteKey } from '../i18n/routes';

export type Destino = { ruta: RouteKey; ancla?: string } | { caso: string } | { evolutecc: string };

export function resolverEnlace(
  locale: Locale,
  destino: Destino,
): { href: string; external: boolean } {
  if ('evolutecc' in destino) return { href: evoluteccUrl(destino.evolutecc), external: true };
  if ('caso' in destino) {
    return { href: `${localizedPath(locale, 'casos')}/${destino.caso}`, external: false };
  }
  return { href: localizedPath(locale, destino.ruta, destino.ancla), external: false };
}
