import { site } from '../config/site';
import type { Certificacion } from './content';

export function personSchema(url: string, certificaciones: Certificacion[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.person.name,
    url,
    sameAs: [site.linkedin],
    worksFor: site.person.worksFor.map((org) => ({ '@type': 'Organization', ...org })),
    alumniOf: site.person.alumniOf.map((org) => ({ '@type': 'EducationalOrganization', ...org })),
    hasCredential: certificaciones
      .filter((c) => c.estado === 'obtenida')
      .map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        name: c.nombre,
        recognizedBy: { '@type': 'Organization', name: c.emisor },
        ...(c.verificacion && { url: c.verificacion }),
      })),
  };
}

// Evita que un "</script>" dentro de los datos cierre la etiqueta.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** schema.org Article para la página de un caso (ficha 05). */
export function caseArticleSchema(url: string, titulo: string, resumen: string, cliente: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: titulo,
    description: resumen,
    url,
    inLanguage: 'es',
    about: { '@type': 'Organization', name: cliente },
    author: {
      '@type': 'Person',
      name: site.person.name,
      url: new URL('/es/sobre-mi', url).toString(),
    },
  };
}
