import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Un archivo YAML por entrada; los que empiezan por _ son plantillas y no se cargan.
const entries = (collection: string) =>
  glob({ pattern: '**/[!_]*.yaml', base: `./src/content/${collection}` });

// ES es obligatorio; EN y PT se exigen solo cuando ese idioma se publica (ver lib/content).
const localized = z.object({
  es: z.string().min(1),
  en: z.string().min(1).optional(),
  pt: z.string().min(1).optional(),
});

const capitulos = defineCollection({
  loader: entries('capitulos'),
  schema: z.object({
    nivel: z.number().int().positive(),
    nombre: localized,
    periodo: localized,
    rotulo: localized.optional(),
  }),
});

const hitos = defineCollection({
  loader: entries('hitos'),
  schema: z.object({
    capitulo: reference('capitulos'),
    anio: z.number().int().min(2000).max(2100),
    orden: z.number().int().default(0),
    edad: z.number().int().positive(),
    titulo: localized,
    texto: localized,
    cifra: localized,
    impacto: localized,
    enlace: z.object({ texto: localized, url: z.url() }).optional(),
  }),
});

const principios = defineCollection({
  loader: entries('principios'),
  schema: z.object({
    orden: z.number().int(),
    texto: localized,
  }),
});

const certificaciones = defineCollection({
  loader: entries('certificaciones'),
  schema: z.object({
    orden: z.number().int(),
    nombre: localized,
    emisor: localized,
    fecha: z
      .object({
        anio: z.number().int().min(2000).max(2100),
        mes: z.number().int().min(1).max(12).optional(),
      })
      .optional(),
    // Ícono de la insignia (pieza 09); no son logos de terceros.
    insignia: z.enum(['ia', 'liderazgo', 'oratoria', 'formacion', 'cloud', 'idioma']),
    estado: z.enum(['obtenida', 'en-proceso', 'en-curso', 'en-tramite']),
    verificacion: z.url().optional(),
  }),
});

const charlas = defineCollection({
  loader: entries('charlas'),
  schema: ({ image }) =>
    z
      .object({
        fecha: z.coerce.date(),
        fechaFin: z.coerce.date().optional(),
        evento: z.string().min(1),
        titulo: localized,
        tipo: z.enum(['charla', 'charla-y-panel', 'comunidad', 'podcast', 'webinar']),
        lugar: localized,
        foto: image().optional(),
        alt: localized.optional(),
        sobreMi: z.object({ orden: z.number().int(), titulo: localized }).optional(),
      })
      .superRefine((charla, ctx) => {
        if (charla.foto && !charla.alt) {
          ctx.addIssue({ code: 'custom', path: ['alt'], message: 'Una foto necesita su alt.' });
        }
        if (charla.sobreMi && !charla.foto) {
          ctx.addIssue({
            code: 'custom',
            path: ['foto'],
            message: 'Las charlas de Sobre mí se muestran con foto.',
          });
        }
      }),
});

const testimonios = defineCollection({
  loader: entries('testimonios'),
  schema: ({ image }) =>
    z.object({
      texto: localized,
      autor: z.string().min(1),
      cargo: localized,
      empresa: z.string().min(1),
      fuente: z.url(),
      foto: image().optional(),
      permiso: z.boolean(),
      publicado: z.boolean().default(false),
    }),
});

// Textos propios de la página Sobre mí (títulos, bajadas, botones).
const sobreMi = defineCollection({
  loader: glob({ pattern: 'sobre-mi.yaml', base: './src/content/paginas' }),
  schema: ({ image }) => {
    const encabezado = z.object({ eyebrow: localized, titulo: localized });
    return z.object({
      apertura: z
        .object({
          eyebrow: localized,
          titulo: localized,
          bajada: localized,
          hablemos: localized,
          invitarme: localized,
          retrato: image().optional(),
          retratoAlt: localized.optional(),
        })
        .refine((a) => !a.retrato || a.retratoAlt, {
          message: 'El retrato necesita su alt.',
          path: ['retratoAlt'],
        }),
      historia: encabezado.extend({ siguienteNivel: localized }),
      principios: encabezado,
      evolutecc: encabezado.extend({
        texto: localized,
        cifras: z.array(localized),
        boton: localized,
        foto: image(),
        fotoAlt: localized,
      }),
      certificaciones: encabezado,
      testimonios: encabezado,
      escenario: encabezado.extend({ boton: localized }),
      cierre: z.object({
        titulo: localized,
        consultoria: localized,
        conferencia: localized,
        conversacion: localized,
        otrasOpciones: localized,
      }),
    });
  },
});

export const collections = {
  sobreMi,
  capitulos,
  hitos,
  principios,
  certificaciones,
  charlas,
  testimonios,
};
