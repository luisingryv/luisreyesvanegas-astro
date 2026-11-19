import type { Locale } from '../i18n/config';

export type Localized = { es: string } & Partial<Record<Exclude<Locale, 'es'>, string>>;

// Falla el build si se publica un idioma al que le falta un texto.
export function localize(value: Localized, locale: Locale, where: string): string {
  const text = value[locale];
  if (!text) throw new Error(`Falta el texto en "${locale}" en ${where}.`);
  return text;
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
