import type { PublishedLocale } from './config';
import { es, type Dictionary } from './es';

// Al publicar un idioma, su diccionario debe estar completo para compilar.
const dictionaries: Record<PublishedLocale, Dictionary> = { es };

export function getDictionary(locale: PublishedLocale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
