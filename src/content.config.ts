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
    /** Versión corta para la trayectoria del Home. */
    home: z.object({ titulo: localized, texto: localized }).optional(),
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
        /** Texto de la tarjeta cuando no basta el título de la charla. */
        resumen: localized.optional(),
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

// Logros con cifra (pieza 02): Home, subpáginas de puertas, Productos y casos.
// Cada cifra sale de la sección 6 del documento madre y lleva cliente y periodo.
const logros = defineCollection({
  loader: entries('logros'),
  schema: z
    .object({
      etiqueta: localized,
      metrica: localized,
      descripcion: localized,
      quien: localized,
      fuente: z.object({ texto: z.string().min(1), url: z.url() }).optional(),
      /** Antes y después en porcentaje del ancho de la barra. */
      barras: z
        .object({
          antes: z.number().min(0).max(100),
          despues: z.number().min(0).max(100),
          leyenda: localized,
        })
        .optional(),
      sellos: z.array(z.string().min(1)).optional(),
      home: z.object({ orden: z.number().int() }).optional(),
    })
    .refine((l) => !(l.barras && l.sellos), {
      message: 'Un logro lleva barras o sellos, no ambos.',
    }),
});

// Opciones del campo "tema" de un formulario: su valor se guarda como puerta.
const temas = z
  .array(z.object({ valor: z.string().regex(/^[a-z0-9-]+$/), texto: localized }))
  .min(1);

// Textos comunes del formulario general (Home y Contacto).
const formularios = defineCollection({
  loader: entries('formularios'),
  schema: z.object({
    whatsapp: localized,
    campos: z.object({ nombre: localized, correo: localized, mensaje: localized }),
    autorizacion: z.object({ antes: localized, enlace: localized, despues: localized }),
    enviar: localized,
    enviado: localized,
    error: localized,
  }),
});

// Textos propios de Contacto.
const contacto = defineCollection({
  loader: glob({ pattern: 'contacto.yaml', base: './src/content/paginas' }),
  schema: z.object({
    hero: z.object({ eyebrow: localized, titulo: localized, texto: localized }),
    opciones: z
      .array(
        z.object({
          etiqueta: localized,
          titulo: localized,
          texto: localized,
          boton: localized,
          /** Página del sitio, ancla de esta página o EvolutecC (con UTM). */
          destino: z.union([
            z.object({
              ruta: z.enum(['consultoria', 'programasAws', 'productos', 'speaker']),
              ancla: z.string().optional(),
            }),
            z.object({ ancla: z.string() }),
            z.object({ evolutecc: z.literal(true) }),
          ]),
        }),
      )
      .min(1),
    formulario: z.object({
      eyebrow: localized,
      titulo: localized,
      /** Se muestra solo si hay número de WhatsApp. */
      textoWhatsapp: localized,
      tema: localized,
      temas,
    }),
  }),
});

// Documentos legales: política de datos y términos de uso (dos páginas, Luis 20 nov 2026).
const legal = defineCollection({
  loader: entries('legal'),
  schema: z.object({
    orden: z.number().int(),
    eyebrow: localized,
    titulo: localized,
    navegacion: localized,
    secciones: z.array(z.object({ titulo: localized, texto: localized })).min(1),
  }),
});

// Textos propios del Home.
const home = defineCollection({
  loader: glob({ pattern: 'home.yaml', base: './src/content/paginas' }),
  schema: ({ image }) => {
    const encabezado = { eyebrow: localized, titulo: localized };
    return z.object({
      hero: z.object({
        ...encabezado,
        bajada: localized,
        premio: z.object({ texto: localized, url: z.url() }),
        agendar: localized,
        invitarme: localized,
        retrato: image(),
        retratoAlt: localized,
      }),
      router: z.object({
        titulo: localized,
        tarjetas: z.array(
          z.object({
            etiqueta: localized,
            titulo: localized,
            texto: localized,
            boton: localized,
            ruta: z.enum(['consultoria', 'productos']),
          }),
        ),
      }),
      logros: z.object(encabezado),
      xprize: z.object({
        ...encabezado,
        texto: localized,
        boton: localized,
        fuente: z.object({ texto: localized, url: z.url() }),
        cifras: z.array(z.object({ valor: localized, etiqueta: localized })).length(3),
        pieza: z.object({
          medalla: z.object({ rotulo: localized, categoria: localized, premio: localized }),
          fases: z.object({ equipos: localized, finalistas: localized, ganador: localized }),
          contador: z.object({
            equipos: localized,
            finalistas: localized,
            ganador: localized,
            top: localized,
            final: localized,
          }),
          nota: localized,
        }),
      }),
      trayectoria: z.object({ ...encabezado, boton: localized }),
      charlas: z.object({ ...encabezado, verTodos: localized }),
      casos: z.object({
        ...encabezado,
        verTodos: localized,
        grupos: z.array(
          z.object({
            titulo: localized,
            destacado: z.boolean(),
            casos: z.array(
              z.object({
                nombre: z.string().min(1),
                slug: z
                  .string()
                  .regex(/^[a-z0-9-]+$/)
                  .optional(),
              }),
            ),
          }),
        ),
      }),
      evolutecc: z.object({ titulo: localized, texto: localized, boton: localized }),
      contacto: z.object({
        ...encabezado,
        texto: localized,
        tema: localized,
        temas,
      }),
    });
  },
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
        eyebrow: localized,
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
  home,
  contacto,
  formularios,
  legal,
  logros,
  sobreMi,
  capitulos,
  hitos,
  principios,
  certificaciones,
  charlas,
  testimonios,
};
