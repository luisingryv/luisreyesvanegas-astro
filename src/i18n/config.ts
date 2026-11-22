export const locales = ['es', 'en', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = 'es' satisfies Locale;

// Un idioma se publica solo cuando Luis aprueba todos sus textos. EN y PT: publicados el 22 nov 2026.
export const publishedLocales = ['es', 'en', 'pt'] as const satisfies readonly Locale[];
export type PublishedLocale = (typeof publishedLocales)[number];

export const localeLabels: Record<Locale, string> = { es: 'ES', en: 'EN', pt: 'PT' };

// Cada idioma se nombra en su propia lengua, igual en todos los diccionarios.
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
};

export function isPublishedLocale(locale: Locale): locale is PublishedLocale {
  return (publishedLocales as readonly Locale[]).includes(locale);
}
