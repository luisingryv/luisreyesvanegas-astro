import { site } from '../config/site';
import type { Certificacion } from './content';
import { precioUsd } from './seo/precio';

/**
 * @id fijos de las entidades del sitio. Sobre mí y el grafo de todas las páginas describen a la
 * misma persona: con el mismo @id, buscadores y agentes los juntan en un solo nodo.
 */
export const idsDelGrafo = (sitio: URL) => ({
  luis: new URL('/#luis', sitio).toString(),
  sitio: new URL('/#sitio', sitio).toString(),
  evolutecc: new URL('/#evolutecc', sitio).toString(),
});

export function personSchema(url: string, certificaciones: Certificacion[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': idsDelGrafo(new URL(url)).luis,
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

export interface DatosDelGrafo {
  sitio: URL;
  idioma: string;
  idiomas: readonly string[];
  nombreDelSitio: string;
  /** Cargo, tal como lo dice el Home (t.pages.home.title). */
  cargo: string;
  /** URL absoluta de cada página que se nombra en el grafo. */
  urls: { inicio: string; sobreMi: string; contacto: string; sesion: string };
  nombres: { sobreMi: string; contacto: string };
  /** Sesión de arquitectura: nombre, descripción y texto con el precio, del contenido aprobado. */
  sesion: { nombre: string; descripcion: string; textoConPrecio: string };
  /** WhatsApp corporativo, cuando Luis lo entregue (+57…). */
  telefono?: string;
  /** Correo legal publicado en Privacidad y Términos. */
  correoLegal?: string;
}

/**
 * Grafo schema.org de todas las páginas (26 nov 2026, para buscadores y agentes de IA): el
 * sitio, Luis con su perfil de LinkedIn, EvolutecC (la empresa que cofundó), sus formas de
 * contacto y la sesión de arquitectura con su precio. Todo sale de textos aprobados del sitio.
 */
export function grafoDelSitio(d: DatosDelGrafo) {
  const ids = idsDelGrafo(d.sitio);
  const evolutecc = site.person.worksFor[0];
  const precio = precioUsd(d.sesion.textoConPrecio);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': ids.sitio,
        url: new URL('/', d.sitio).toString(),
        name: d.nombreDelSitio,
        inLanguage: d.idiomas,
        about: { '@id': ids.luis },
        publisher: { '@id': ids.luis },
      },
      {
        '@type': 'Person',
        '@id': ids.luis,
        name: site.person.name,
        url: d.urls.sobreMi,
        jobTitle: d.cargo,
        sameAs: [site.linkedin],
        worksFor: [
          { '@id': ids.evolutecc },
          ...site.person.worksFor.slice(1).map((org) => ({ '@type': 'Organization', ...org })),
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            url: d.urls.contacto,
            availableLanguage: d.idiomas,
            ...(d.telefono && { telephone: d.telefono }),
          },
          ...(d.correoLegal
            ? [{ '@type': 'ContactPoint', contactType: 'legal', email: d.correoLegal }]
            : []),
        ],
        ...(precio !== undefined && {
          makesOffer: {
            '@type': 'Offer',
            url: d.urls.sesion,
            price: precio,
            priceCurrency: 'USD',
            itemOffered: {
              '@type': 'Service',
              name: d.sesion.nombre,
              description: d.sesion.descripcion,
              url: d.urls.sesion,
              provider: { '@id': ids.luis },
            },
          },
        }),
      },
      {
        '@type': 'Organization',
        '@id': ids.evolutecc,
        name: evolutecc.name,
        url: evolutecc.url,
        // Fecha de src/content/hitos/2020-fundacion-evolutecc.yaml.
        foundingDate: '2020-08-28',
        founder: { '@id': ids.luis },
      },
      {
        '@type': 'AboutPage',
        '@id': d.urls.sobreMi,
        url: d.urls.sobreMi,
        name: d.nombres.sobreMi,
        inLanguage: d.idioma,
        about: { '@id': ids.luis },
        isPartOf: { '@id': ids.sitio },
      },
      {
        '@type': 'ContactPage',
        '@id': d.urls.contacto,
        url: d.urls.contacto,
        name: d.nombres.contacto,
        inLanguage: d.idioma,
        isPartOf: { '@id': ids.sitio },
      },
    ],
  };
}

// Evita que un "</script>" dentro de los datos cierre la etiqueta.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** schema.org BlogPosting para cada noticia: la lectura de Luis sobre una noticia citada. */
export function blogPostingSchema(
  url: string,
  noticia: { titulo: string; resumen: string; fecha: Date; etiquetas: string[] },
  fuenteUrl: string,
  idioma: string,
  imagen?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: noticia.titulo,
    description: noticia.resumen,
    url,
    mainEntityOfPage: url,
    inLanguage: idioma,
    datePublished: noticia.fecha.toISOString(),
    dateModified: noticia.fecha.toISOString(),
    ...(noticia.etiquetas.length > 0 && { keywords: noticia.etiquetas.join(', ') }),
    ...(imagen && { image: imagen }),
    citation: fuenteUrl,
    author: {
      '@type': 'Person',
      name: site.person.name,
      url: new URL('/es/sobre-mi', url).toString(),
    },
    publisher: { '@type': 'Person', name: site.person.name },
  };
}

/** schema.org Article para la página de un caso (ficha 05). */
export function caseArticleSchema(
  url: string,
  titulo: string,
  resumen: string,
  cliente: string,
  idioma: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: titulo,
    description: resumen,
    url,
    inLanguage: idioma,
    about: { '@type': 'Organization', name: cliente },
    author: {
      '@type': 'Person',
      name: site.person.name,
      url: new URL('/es/sobre-mi', url).toString(),
    },
  };
}
