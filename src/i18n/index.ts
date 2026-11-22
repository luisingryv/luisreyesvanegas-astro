import type { PublishedLocale } from './config';
import { en } from './en';
import { es, type Dictionary } from './es';
import { pt } from './pt';

// Al publicar un idioma, su diccionario debe estar completo para compilar. EN y PT: 22 nov 2026.
const dictionaries: Record<PublishedLocale, Dictionary> = { es, en, pt };

export function getDictionary(locale: PublishedLocale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
