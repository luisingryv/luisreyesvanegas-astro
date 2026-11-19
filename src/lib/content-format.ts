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

export function summarizeYears(years: number[]) {
  if (years.length === 0) throw new Error('No hay hitos para resumir.');
  const desde = Math.min(...years);
  const hasta = Math.max(...years);
  return { hitos: years.length, desde, hasta, anios: hasta - desde };
}
