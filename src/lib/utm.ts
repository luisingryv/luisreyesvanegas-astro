// UTM persistidas hasta el formulario (HU-0.4): se guardan las de la primera página de la
// visita que las trae y viajan con cualquier formulario de la misma sesión.
// sessionStorage puede fallar (modo privado, bloqueos): entonces no se guarda nada.
const CLAVE = 'utm';
export const NOMBRES_UTM = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
export type Utm = Partial<Record<(typeof NOMBRES_UTM)[number], string>>;

export function leerUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE) ?? '{}') as Utm;
  } catch {
    return {};
  }
}

/** Guarda las UTM de la URL actual, si las trae (las de la última campaña mandan). */
export function guardarUtmDeLaUrl(url: URL = new URL(window.location.href)): Utm {
  const utm: Utm = {};
  for (const nombre of NOMBRES_UTM) {
    const valor = url.searchParams.get(nombre)?.trim().slice(0, 120);
    if (valor) utm[nombre] = valor;
  }
  if (Object.keys(utm).length === 0) return leerUtm();
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(utm));
  } catch {
    // Sin almacenamiento: se usan solo para esta página.
  }
  return utm;
}
