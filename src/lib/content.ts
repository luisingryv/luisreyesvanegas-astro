import type { ImageMetadata } from 'astro';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { PublishedLocale } from '../i18n/config';
import {
  formatEventDate,
  formatMonthYear,
  localize,
  resolveLocalized,
  summarizeYears,
} from './content-format';

export async function getPaginaSobreMi(locale: PublishedLocale) {
  const entry = await getEntry('sobreMi', 'sobre-mi');
  if (!entry) throw new Error('Falta src/content/paginas/sobre-mi.yaml.');
  return resolveLocalized(entry.data, locale, 'paginas/sobre-mi');
}

export type PaginaSobreMi = Awaited<ReturnType<typeof getPaginaSobreMi>>;
/** Textos del cierre de contacto; otras páginas pueden traer el mismo bloque. */
export type CierreContenido = PaginaSobreMi['cierre'];

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

// ─── Home ─────────────────────────────────────────────────────

export async function getPaginaHome(locale: PublishedLocale) {
  const entry = await getEntry('home', 'home');
  if (!entry) throw new Error('Falta src/content/paginas/home.yaml.');
  return resolveLocalized(entry.data, locale, 'paginas/home');
}

export type PaginaHome = Awaited<ReturnType<typeof getPaginaHome>>;

export interface Logro {
  id: string;
  etiqueta: string;
  metrica: string;
  descripcion: string;
  quien: string;
  fuente?: { texto: string; url: string };
  barras?: { antes: number; despues: number; leyenda: string };
  sellos?: string[];
}

export async function getLogrosHome(locale: PublishedLocale): Promise<Logro[]> {
  const logros = await getCollection('logros', (l) => l.data.home !== undefined);
  return logros
    .sort((a, b) => (a.data.home?.orden ?? 0) - (b.data.home?.orden ?? 0))
    .map(({ id, data }) => {
      const where = `logros/${id}`;
      return {
        id,
        etiqueta: localize(data.etiqueta, locale, where),
        metrica: localize(data.metrica, locale, where),
        descripcion: localize(data.descripcion, locale, where),
        quien: localize(data.quien, locale, where),
        fuente: data.fuente,
        barras: data.barras && {
          antes: data.barras.antes,
          despues: data.barras.despues,
          leyenda: localize(data.barras.leyenda, locale, where),
        },
        sellos: data.sellos,
      };
    });
}

export interface HitoCorto {
  id: string;
  anio: number;
  titulo: string;
  texto: string;
}

export async function getTrayectoriaHome(locale: PublishedLocale): Promise<HitoCorto[]> {
  const hitos = await getCollection('hitos', (h) => h.data.home !== undefined);
  return hitos
    .sort((a, b) => a.data.anio - b.data.anio || a.data.orden - b.data.orden)
    .flatMap(({ id, data }) =>
      data.home
        ? [
            {
              id,
              anio: data.anio,
              titulo: localize(data.home.titulo, locale, `hitos/${id}`),
              texto: localize(data.home.texto, locale, `hitos/${id}`),
            },
          ]
        : [],
    );
}

export interface CharlaReciente {
  id: string;
  evento: string;
  resumen: string;
  cuando: string;
  foto: ImageMetadata;
  alt: string;
}

/** Las charlas con foto más recientes, de la más nueva a la más antigua. */
export async function getCharlasRecientes(
  locale: PublishedLocale,
  cantidad = 3,
): Promise<CharlaReciente[]> {
  const charlas = await getCollection('charlas', (c) => c.data.foto !== undefined);
  return charlas
    .sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime())
    .slice(0, cantidad)
    .flatMap(({ id, data }) => {
      if (!data.foto || !data.alt) return [];
      const where = `charlas/${id}`;
      const lugar = localize(data.lugar, locale, where);
      return [
        {
          id,
          evento: data.evento,
          resumen: localize(data.resumen ?? data.titulo, locale, where),
          cuando: `${formatEventDate(data.fecha, data.fechaFin, locale)} · ${lugar}`,
          foto: data.foto,
          alt: localize(data.alt, locale, where),
        },
      ];
    });
}

// ─── Legal ────────────────────────────────────────────────────

export const DOCUMENTOS_LEGALES = ['privacidad', 'terminos'] as const;
export type DocumentoLegalId = (typeof DOCUMENTOS_LEGALES)[number];

export async function getDocumentosLegales(locale: PublishedLocale) {
  const documentos = await getCollection('legal');
  return documentos
    .sort((a, b) => a.data.orden - b.data.orden)
    .map(({ id, data }) => ({
      id: id as DocumentoLegalId,
      ...resolveLocalized(data, locale, `legal/${id}`),
    }));
}

export type DocumentoLegal = Awaited<ReturnType<typeof getDocumentosLegales>>[number];

// ─── Formularios y Contacto ───────────────────────────────────

export async function getFormularioGeneral(locale: PublishedLocale) {
  const entry = await getEntry('formularios', 'general');
  if (!entry) throw new Error('Falta src/content/formularios/general.yaml.');
  return resolveLocalized(entry.data, locale, 'formularios/general');
}

export type FormularioGeneral = Awaited<ReturnType<typeof getFormularioGeneral>>;

export async function getPaginaContacto(locale: PublishedLocale) {
  const entry = await getEntry('contacto', 'contacto');
  if (!entry) throw new Error('Falta src/content/paginas/contacto.yaml.');
  return resolveLocalized(entry.data, locale, 'paginas/contacto');
}

export type PaginaContacto = Awaited<ReturnType<typeof getPaginaContacto>>;

// ─── Consultoría ──────────────────────────────────────────────

export async function getPuertas(locale: PublishedLocale) {
  const puertas = await getCollection('puertas');
  return puertas
    .sort((a, b) => a.data.numero - b.data.numero)
    .map(({ id, data }) => ({ id, ...resolveLocalized(data, locale, `puertas/${id}`) }));
}

export type Puerta = Awaited<ReturnType<typeof getPuertas>>[number];

export async function getCaso(id: string, locale: PublishedLocale) {
  const entry = await getEntry('casos', id);
  if (!entry) throw new Error(`Falta el caso src/content/casos/${id}.yaml.`);
  return { id, ...resolveLocalized(entry.data, locale, `casos/${id}`) };
}

export type Caso = Awaited<ReturnType<typeof getCaso>>;

/** Casos publicados (con permiso), en el orden que definió Luis. */
export async function getCasos(locale: PublishedLocale) {
  const casos = await getCollection('casos', (c) => c.data.permiso);
  return casos
    .sort((a, b) => a.data.orden - b.data.orden)
    .map(({ id, data }) => ({ id, ...resolveLocalized(data, locale, `casos/${id}`) }));
}

export async function getPaginaCasos(locale: PublishedLocale) {
  const entry = await getEntry('casosPagina', 'casos');
  if (!entry) throw new Error('Falta src/content/paginas/casos.yaml.');
  return resolveLocalized(entry.data, locale, 'paginas/casos');
}

export type PaginaCasos = Awaited<ReturnType<typeof getPaginaCasos>>;

export async function getPaginaConsultoria(locale: PublishedLocale) {
  const entry = await getEntry('consultoria', 'consultoria');
  if (!entry) throw new Error('Falta src/content/paginas/consultoria.yaml.');
  const pagina = resolveLocalized(entry.data, locale, 'paginas/consultoria');
  const casos = await Promise.all(
    entry.data.casos.lista.map(async (ref) => {
      const caso = await getCaso(ref.id, locale);
      if (!caso.consultoria) throw new Error(`El caso ${ref.id} necesita su versión con pasos.`);
      return { id: caso.id, ...caso.consultoria };
    }),
  );
  return { ...pagina, casos: { ...pagina.casos, lista: casos } };
}

export type PaginaConsultoria = Awaited<ReturnType<typeof getPaginaConsultoria>>;

export async function getServicio(id: string, locale: PublishedLocale) {
  const entry = await getEntry('servicios', id);
  if (!entry) throw new Error(`Falta src/content/servicios/${id}.yaml.`);
  return { id, ...resolveLocalized(entry.data, locale, `servicios/${id}`) };
}

export type Servicio = Awaited<ReturnType<typeof getServicio>>;

export async function getPaginaAdopcionIa(locale: PublishedLocale) {
  const entry = await getEntry('adopcionIa', 'adopcion-ia');
  if (!entry) throw new Error('Falta src/content/paginas/adopcion-ia.yaml.');
  const pagina = resolveLocalized(entry.data, locale, 'paginas/adopcion-ia');
  const todas = await getCertificaciones(locale);
  const certificaciones = entry.data.prueba.certificaciones.map((ref) => {
    const cert = todas.find((c) => c.id === ref.id);
    if (!cert?.verificacion) throw new Error(`La certificación ${ref.id} necesita su enlace.`);
    return {
      id: cert.id,
      nombre: cert.nombre,
      detalle: [cert.emisor, cert.fecha].filter(Boolean).join(' · '),
      url: cert.verificacion,
    };
  });
  return { ...pagina, prueba: { ...pagina.prueba, certificaciones } };
}

export type PaginaAdopcionIa = Awaited<ReturnType<typeof getPaginaAdopcionIa>>;
