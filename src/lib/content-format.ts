import type { Locale } from '../i18n/config';

export type Localized = { es: string } & Partial<Record<Exclude<Locale, 'es'>, string>>;

// Falla el build si se publica un idioma al que le falta un texto.
export function localize(value: Localized, locale: Locale, where: string): string {
  const text = value[locale];
  if (!text) throw new Error(`Falta el texto en "${locale}" en ${where}.`);
  return text;
}

function isLocalized(value: unknown): value is Localized {
  return (
    typeof value === 'object' &&
    value !== null &&
    'es' in value &&
    typeof (value as { es: unknown }).es === 'string'
  );
}

function isImage(value: unknown): boolean {
  return typeof value === 'object' && value !== null && 'src' in value && 'format' in value;
}

export type Resolved<T> = T extends Localized
  ? string
  : T extends Date
    ? T
    : T extends (infer U)[]
      ? Resolved<U>[]
      : T extends { src: string; format: string }
        ? T
        : T extends object
          ? { [K in keyof T]: Resolved<T[K]> }
          : T;

// Convierte cada texto { es, en, pt } de un objeto en el texto del idioma pedido.
export function resolveLocalized<T>(value: T, locale: Locale, where: string): Resolved<T> {
  if (isLocalized(value)) return localize(value, locale, where) as Resolved<T>;
  if (Array.isArray(value)) {
    return value.map((item, i) => resolveLocalized(item, locale, `${where}[${i}]`)) as Resolved<T>;
  }
  if (value instanceof Date || isImage(value) || typeof value !== 'object' || value === null) {
    return value as Resolved<T>;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      resolveLocalized(item, locale, `${where}.${key}`),
    ]),
  ) as Resolved<T>;
}

export function formatMonthYear(
  value: Date | { anio: number; mes?: number },
  locale: Locale,
): string {
  if (value instanceof Date) {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(value);
  }
  if (value.mes === undefined) return String(value.anio);
  return formatMonthYear(new Date(Date.UTC(value.anio, value.mes - 1, 1)), locale);
}

const DIA = 24 * 60 * 60 * 1000;

/** '29 nov 2025'; con fecha final, '11 y 12 nov 2025' o '3 al 5 dic 2025' (como el prototipo). */
export function formatEventDate(inicio: Date, fin: Date | undefined, locale: Locale): string {
  const intl = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  // En español, el prototipo abrevia septiembre "sep" (Intl escribe "sept").
  const mes = (texto: string) => (locale === 'es' ? texto.replace(/\bsept\b/g, 'sep') : texto);
  if (!fin || fin.getTime() === inicio.getTime()) return mes(intl.format(inicio));
  const mismoMes =
    inicio.getUTCFullYear() === fin.getUTCFullYear() && inicio.getUTCMonth() === fin.getUTCMonth();
  if (locale === 'es' && mismoMes) {
    const union = fin.getTime() - inicio.getTime() === DIA ? 'y' : 'al';
    return mes(`${inicio.getUTCDate()} ${union} ${intl.format(fin)}`);
  }
  return mes(intl.formatRange(inicio, fin));
}

export function summarizeYears(years: number[]) {
  if (years.length === 0) throw new Error('No hay hitos para resumir.');
  const desde = Math.min(...years);
  const hasta = Math.max(...years);
  return { hitos: years.length, desde, hasta, anios: hasta - desde };
}

/** Locale de Intl para cifras: los separadores de miles del prototipo (es-CO), en-US y pt-BR. */
export const LOCALE_NUMEROS: Record<Locale, string> = { es: 'es-CO', en: 'en-US', pt: 'pt-BR' };

/** Cifras con separador de miles siempre (también en 4 dígitos: "2.400"), por idioma. */
export function formatoNumeros(locale: Locale): Intl.NumberFormat {
  return new Intl.NumberFormat(LOCALE_NUMEROS[locale], { useGrouping: 'always' });
}
