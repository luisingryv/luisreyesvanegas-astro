import type { ImageMetadata } from 'astro';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { PublishedLocale } from '../i18n/config';
import { formatMonthYear, localize, resolveLocalized, summarizeYears } from './content-format';

export async function getPaginaSobreMi(locale: PublishedLocale) {
  const entry = await getEntry('sobreMi', 'sobre-mi');
  if (!entry) throw new Error('Falta src/content/paginas/sobre-mi.yaml.');
  return resolveLocalized(entry.data, locale, 'paginas/sobre-mi');
}

export type PaginaSobreMi = Awaited<ReturnType<typeof getPaginaSobreMi>>;

export type EstadoCertificacion = CollectionEntry<'certificaciones'>['data']['estado'];

export interface Hito {
  id: string;
  anio: number;
  edad: number;
  titulo: string;
  texto: string;
  cifra: string;
  impacto: string;
  enlace?: { texto: string; url: string };
}

export interface Nivel {
  id: string;
  nivel: number;
  nombre: string;
  periodo: string;
  rotulo?: string;
  hitos: Hito[];
}

export async function getHistoria(locale: PublishedLocale) {
  const [capitulos, hitos] = await Promise.all([
    getCollection('capitulos'),
    getCollection('hitos'),
  ]);

  const niveles: Nivel[] = capitulos
    .sort((a, b) => a.data.nivel - b.data.nivel)
    .map((c) => ({
      id: c.id,
      nivel: c.data.nivel,
      nombre: localize(c.data.nombre, locale, `capitulos/${c.id}`),
      periodo: localize(c.data.periodo, locale, `capitulos/${c.id}`),
      rotulo: c.data.rotulo && localize(c.data.rotulo, locale, `capitulos/${c.id}`),
      hitos: hitos
        .filter((h) => h.data.capitulo.id === c.id)
        .sort((a, b) => a.data.anio - b.data.anio || a.data.orden - b.data.orden)
        .map((h) => {
          const where = `hitos/${h.id}`;
          return {
            id: h.id,
            anio: h.data.anio,
            edad: h.data.edad,
            titulo: localize(h.data.titulo, locale, where),
            texto: localize(h.data.texto, locale, where),
            cifra: localize(h.data.cifra, locale, where),
            impacto: localize(h.data.impacto, locale, where),
            enlace: h.data.enlace && {
              texto: localize(h.data.enlace.texto, locale, where),
              url: h.data.enlace.url,
            },
          };
        }),
    }));

  return { niveles, resumen: summarizeYears(hitos.map((h) => h.data.anio)) };
}

export type Historia = Awaited<ReturnType<typeof getHistoria>>;

export async function getPrincipios(locale: PublishedLocale): Promise<string[]> {
  const principios = await getCollection('principios');
  return principios
    .sort((a, b) => a.data.orden - b.data.orden)
    .map((p) => localize(p.data.texto, locale, `principios/${p.id}`));
}

export interface Certificacion {
  id: string;
  nombre: string;
  emisor: string;
  fecha?: string;
  estado: EstadoCertificacion;
  insignia: CollectionEntry<'certificaciones'>['data']['insignia'];
  verificacion?: string;
}

export async function getCertificaciones(locale: PublishedLocale): Promise<Certificacion[]> {
  const certificaciones = await getCollection('certificaciones');
  return certificaciones
    .sort((a, b) => a.data.orden - b.data.orden)
    .map(({ id, data }) => {
      const where = `certificaciones/${id}`;
      return {
        id,
        nombre: localize(data.nombre, locale, where),
        emisor: localize(data.emisor, locale, where),
        fecha: data.fecha && formatMonthYear(data.fecha, locale),
        estado: data.estado,
        insignia: data.insignia,
        verificacion: data.verificacion,
      };
    });
}

export interface CharlaDestacada {
  id: string;
  titulo: string;
  lugar: string;
  fecha: string;
  foto: ImageMetadata;
  alt: string;
}

export async function getCharlasSobreMi(locale: PublishedLocale): Promise<CharlaDestacada[]> {
  const charlas = await getCollection('charlas', (c) => c.data.sobreMi !== undefined);
  return charlas
    .sort((a, b) => (a.data.sobreMi?.orden ?? 0) - (b.data.sobreMi?.orden ?? 0))
    .flatMap(({ id, data }) => {
      // El esquema ya exige foto y alt a las charlas de Sobre mí; esto solo afina el tipo.
      if (!data.sobreMi || !data.foto || !data.alt) return [];
      const where = `charlas/${id}`;
      return [
        {
          id,
          titulo: localize(data.sobreMi.titulo, locale, where),
          lugar: localize(data.lugar, locale, where),
          fecha: formatMonthYear(data.fecha, locale),
          foto: data.foto,
          alt: localize(data.alt, locale, where),
        },
      ];
    });
}

export interface Testimonio {
  id: string;
  texto: string;
  autor: string;
  cargo: string;
  empresa: string;
  fuente: string;
  foto?: ImageMetadata;
}

export async function getTestimonios(locale: PublishedLocale): Promise<Testimonio[]> {
  const testimonios = await getCollection('testimonios', (t) => t.data.permiso && t.data.publicado);
  return testimonios.map(({ id, data }) => {
    const where = `testimonios/${id}`;
    return {
      id,
      texto: localize(data.texto, locale, where),
      autor: data.autor,
      cargo: localize(data.cargo, locale, where),
      empresa: data.empresa,
      fuente: data.fuente,
      foto: data.foto,
    };
  });
}
