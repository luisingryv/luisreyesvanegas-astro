import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  INFRAESTRUCTURAS_AWS,
  NECESIDADES_PRENSA,
  PLAZOS_AWS,
  PRESUPUESTOS_SPEAKER,
  PRODUCTOS_DEMO,
  TIPOS_EMPRESA_AWS,
  TIPOS_INVERSIONISTA,
} from './lib/formularios/opciones';

// Un archivo YAML por entrada; los que empiezan por _ son plantillas y no se cargan.
const entries = (collection: string) =>
  glob({ pattern: '**/[!_]*.yaml', base: `./src/content/${collection}` });

// ES es obligatorio; EN y PT se exigen solo cuando ese idioma se publica (ver lib/content).
const localized = z.object({
  es: z.string().min(1),
  en: z.string().min(1).optional(),
  pt: z.string().min(1).optional(),
});

export const TIPOS_CHARLA = [
  'charla',
  'charla-y-panel',
  'comunidad',
  'podcast',
  'webinar',
] as const;
// Ciudades confirmadas para el mapa (Los Ángeles, pendiente de Luis).
export const CIUDADES_CHARLA = ['barranquilla', 'quito', 'lima'] as const;

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
        /** Texto de la tarjeta en Eventos (y en Charlas si no hay resumen), tal cual el prototipo. */
        detalle: localized.optional(),
        tipo: z.enum(TIPOS_CHARLA),
        lugar: localized,
        /** Ciudad en el mapa de Charlas (pieza 10). Sin ciudad: en línea. */
        ciudad: z.enum(CIUDADES_CHARLA).optional(),
        foto: image().optional(),
        alt: localized.optional(),
        sobreMi: z.object({ orden: z.number().int(), titulo: localized }).optional(),
        /** Selección de "Algunos de los eventos en los que he hablado" (Charlas). */
        speaker: z.object({ orden: z.number().int() }).optional(),
      })
      .superRefine((charla, ctx) => {
        if (charla.foto && !charla.alt) {
          ctx.addIssue({ code: 'custom', path: ['alt'], message: 'Una foto necesita su alt.' });
        }
        if ((charla.sobreMi || charla.speaker) && !charla.foto) {
          ctx.addIssue({
            code: 'custom',
            path: ['foto'],
            message: 'Las charlas de Sobre mí y de Charlas se muestran con foto.',
          });
        }
      }),
});

// Logos de clientes del Home (21 nov 2026). Ningún logo se publica sin permiso escrito (guía de
// Logos de la bóveda): el permiso es obligatorio. Logo en versión clara, para fondo oscuro.
export const GRUPOS_CLIENTE = ['consultoria', 'evolutecc', 'alianza'] as const;
const clientes = defineCollection({
  loader: entries('clientes'),
  schema: ({ image }) =>
    z.object({
      nombre: z.string().min(1),
      orden: z.number().int(),
      grupo: z.enum(GRUPOS_CLIENTE),
      logo: image(),
      url: z.url().optional(),
      permiso: z.object({ quien: z.string().min(1), fecha: z.coerce.date() }),
    }),
});

// Galerías del visor de fotos (decisión del 21 nov 2026): una por nivel de "Mi historia" en
// Sobre mí y una por evento. Solo las fotos que Luis aprobó en la hoja de revisión.
const galerias = defineCollection({
  loader: entries('galerias'),
  schema: ({ image }) =>
    z
      .object({
        capitulo: reference('capitulos').optional(),
        charla: reference('charlas').optional(),
        fotos: z
          .array(
            z.object({
              foto: image(),
              alt: localized,
              /** Pie con hechos (qué era · ciudad · fecha); solo en Sobre mí. */
              pie: localized.optional(),
            }),
          )
          .min(1),
      })
      .refine((g) => Boolean(g.capitulo) !== Boolean(g.charla), {
        message: 'Una galería va con un capítulo o con una charla, no con ambos.',
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

// ─── Consultoría ─────────────────────────────────────────────

// Mini visualización de una cifra (pieza 02 y pieza 07). Decorativa: la cifra va en el texto.
const viz = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('barras'),
    antes: z.number().min(0).max(100),
    despues: z.number().min(0).max(100),
    leyenda: z.array(localized).min(1).max(2),
  }),
  z.object({ tipo: z.literal('anillo'), leyenda: localized.optional() }),
  z.object({ tipo: z.literal('migrar'), origen: z.string(), destino: z.string() }),
  z.object({
    tipo: z.literal('ticks'),
    cantidad: z.number().int().min(2).max(20),
    leyenda: z.array(localized).length(2),
  }),
  z.object({ tipo: z.literal('sellos'), sellos: z.array(z.string()).min(1) }),
  z.object({ tipo: z.literal('cuatroD'), nombres: z.array(localized).length(4) }),
]);

// Rutas internas a las que puede llevar un enlace de Consultoría.
const rutaConsultoria = z.enum([
  'consultoria',
  'sesionArquitectura',
  'optimizarCostos',
  'escalarInfraestructura',
  'retainers',
  'adopcionIa',
  'programasAws',
]);
const destino = z.union([
  z.object({ ruta: rutaConsultoria, ancla: z.string().optional() }),
  z.object({ caso: z.string().regex(/^[a-z0-9-]+$/) }),
  z.object({ evolutecc: z.string().regex(/^[a-z0-9-]+$/) }),
]);
const enlace = z.object({ texto: localized, destino });

// Las 7 puertas de entrada (pieza 07 en Consultoría).
const puertas = defineCollection({
  loader: entries('puertas'),
  schema: z.object({
    numero: z.number().int().min(1).max(7),
    etiqueta: localized,
    dolor: localized,
    oferta: localized,
    prueba: localized,
    destino,
    viz,
  }),
});

// Casos (índice /casos, página /casos/[slug] y casos con pasos de Consultoría). Solo se publican
// con permiso; un caso con página necesita su fuente (ficha 05, HU-0.3).
export const TIPOS_CASO = ['consultoria-propia', 'startup-producto', 'evolutecc'] as const;
export const TEMAS_CASO = [
  'costos',
  'crecimiento',
  'programas',
  'migracion',
  'buenas-practicas',
  'seguridad',
  'ia',
] as const;
const etapaDiagrama = z.object({
  valor: z.number(),
  delta: localized.optional(),
  texto: localized,
  nodos: z
    .array(
      z.object({
        titulo: localized,
        detalle: localized,
        chips: z.array(z.string()).optional(),
        /** Nodo clave (borde de acento) o con alerta (borde punteado). */
        clave: z.boolean().optional(),
        alerta: z.boolean().optional(),
      }),
    )
    .min(2),
  /** Por cada conexión: paquetes por segundo y tamaño (ilustrativos; la cifra real es el contador). */
  flujos: z.array(z.tuple([z.number().positive(), z.number().positive()])),
});
const casos = defineCollection({
  loader: entries('casos'),
  schema: z
    .object({
      orden: z.number().int(),
      cliente: z.string().min(1),
      tipo: z.enum(TIPOS_CASO),
      temas: z.array(z.enum(TEMAS_CASO)).min(1),
      /** Permiso de publicación del cliente (o caso propio). Sin permiso, no se publica. */
      permiso: z.boolean(),
      tarjeta: z.object({
        metrica: localized.optional(),
        titulo: localized,
        quien: localized,
      }),
      /** Versión con pasos para Consultoría. */
      consultoria: z
        .object({
          etiqueta: localized,
          titulo: localized,
          metrica: localized,
          quien: localized,
          pasos: z.array(z.object({ clave: localized, texto: localized })).length(4),
          viz: viz.optional(),
        })
        .optional(),
      /** Página propia del caso. */
      pagina: z
        .object({
          titulo: localized,
          resumen: localized,
          ficha: z.array(z.object({ clave: localized, valor: localized })).min(1),
          bloques: z.array(z.object({ clave: localized, texto: localized })).min(1),
          cifras: z.array(z.object({ metrica: localized, texto: localized })).min(1),
          fuente: localized,
          cierre: z.object({ titulo: localized, texto: localized, enlace }),
        })
        .optional(),
      /** Pieza 11: diagrama del caso, antes y después. */
      diagrama: z
        .object({
          etiqueta: localized,
          fuente: localized,
          /** Lo que va antes de la cifra: '≈' o 'US$'. */
          prefijo: z.string().default(''),
          antes: etapaDiagrama,
          despues: etapaDiagrama,
        })
        .optional(),
    })
    .refine((c) => !c.pagina || c.permiso, {
      message: 'Un caso con página necesita permiso de publicación.',
    })
    .refine((c) => !c.diagrama || c.pagina, { message: 'El diagrama va en la página del caso.' }),
});

// Subpáginas de Consultoría con la misma plantilla (sesión, puertas con página y retainers).
const servicios = defineCollection({
  loader: entries('servicios'),
  schema: z.object({
    ruta: rutaConsultoria,
    titulo: localized,
    hero: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      agendar: localized,
      llamada: localized,
    }),
    senales: z.object({ titulo: localized, items: z.array(localized).min(1) }),
    entregables: z.object({
      eyebrow: localized,
      titulo: localized,
      items: z.array(z.object({ titulo: localized, texto: localized })).min(1),
    }),
    proceso: z.object({
      eyebrow: localized,
      titulo: localized,
      items: z.array(z.object({ numero: z.string(), titulo: localized, texto: localized })).min(1),
      nota: localized.optional(),
    }),
    caso: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      enlace,
      metrica: localized,
      leyenda: localized,
      barras: z
        .object({ antes: z.number().min(0).max(100), despues: z.number().min(0).max(100) })
        .optional(),
    }),
    empezar: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      aparte: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        enlace,
      }),
    }),
    faq: z.object({
      titulo: localized,
      items: z.array(z.object({ pregunta: localized, respuesta: localized })).min(1),
    }),
    cierre: z.object({ titulo: localized, boton: localized }),
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

// Textos propios de Consultoría.
const consultoria = defineCollection({
  loader: glob({ pattern: 'consultoria.yaml', base: './src/content/paginas' }),
  schema: z.object({
    hero: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      agendar: localized,
      llamada: localized,
    }),
    puertas: z.object({ eyebrow: localized, titulo: localized, boton: localized }),
    casos: z.object({
      eyebrow: localized,
      titulo: localized,
      lista: z.array(reference('casos')).min(1),
    }),
    pasos: z.object({
      eyebrow: localized,
      titulo: localized,
      items: z
        .array(z.object({ numero: z.string(), titulo: localized, texto: localized }))
        .length(4),
    }),
    formas: z.object({
      eyebrow: localized,
      titulo: localized,
      items: z.array(z.object({ nombre: localized, texto: localized })).min(1),
      nota: localized,
      enlaces: z.array(enlace).min(1),
    }),
    credenciales: z.object({ eyebrow: localized, titulo: localized, items: z.array(localized) }),
    noSoyParaTi: z.object({ eyebrow: localized, titulo: localized, items: z.array(localized) }),
    faq: z.object({
      eyebrow: localized,
      titulo: localized,
      items: z.array(z.object({ pregunta: localized, respuesta: localized })).min(1),
    }),
    map: z.object({ eyebrow: localized, titulo: localized, texto: localized, boton: localized }),
    agenda: z.object({
      eyebrow: localized,
      titulo: localized,
      opciones: z.array(z.object({ titulo: localized, texto: localized, destacada: z.boolean() })),
      campos: z.object({
        tema: localized,
        nubes: localized,
        nubesEjemplo: localized,
        gasto: localized,
        gastoEjemplo: localized,
        correo: localized,
      }),
      temas,
      enviar: localized,
      /** Aviso cuando todavía no hay URL de la agenda (Luis, 20 nov 2026). */
      recibido: localized,
    }),
  }),
});

// Textos del índice de casos y de la plantilla de caso.
const casosPagina = defineCollection({
  loader: glob({ pattern: 'casos.yaml', base: './src/content/paginas' }),
  schema: z.object({
    hero: z.object({ eyebrow: localized, titulo: localized, texto: localized }),
    filtros: z.object({
      etiqueta: localized,
      tema: localized,
      tipo: localized,
      todos: localized,
      temas: z.record(z.enum(TEMAS_CASO), localized),
      tipos: z.record(z.enum(TIPOS_CASO), localized),
      vacio: localized,
    }),
    lista: localized,
    verCaso: localized,
    cierre: z.object({ titulo: localized, boton: localized }),
    plantilla: z.object({
      volver: localized,
      ficha: localized,
      resultado: localized,
      diagrama: z.object({
        eyebrow: localized,
        titulo: localized,
        momento: localized,
        antes: localized,
        despues: localized,
      }),
    }),
  }),
});

// Textos de Adopción de IA (landing con header mínimo).
const adopcionIa = defineCollection({
  loader: glob({ pattern: 'adopcion-ia.yaml', base: './src/content/paginas' }),
  schema: z.object({
    hero: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      hablemos: localized,
      comoTrabajo: localized,
    }),
    cuatroD: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      items: z
        .array(z.object({ letra: z.string(), nombre: localized, texto: localized }))
        .length(4),
    }),
    temas: z.object({
      eyebrow: localized,
      titulo: localized,
      items: z.array(z.object({ nombre: localized, texto: localized })).min(1),
    }),
    etapas: z.object({
      eyebrow: localized,
      titulo: localized,
      items: z.array(z.object({ numero: z.string(), nombre: localized, texto: localized })).min(1),
    }),
    prueba: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      certificacionesEyebrow: localized,
      certificaciones: z.array(reference('certificaciones')).min(1),
      verificar: localized,
    }),
    empezar: z.object({
      titulo: localized,
      texto: localized,
      agendar: localized,
      llamada: localized,
    }),
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
      // Logos de clientes (pedido de Luis, 21 nov 2026); la sección sale cuando hay logos.
      clientes: z.object({ ...encabezado, nota: localized }),
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
      // 21 nov 2026: sin "Conversación general" ni el enlace "Otras opciones" (pedido de Luis).
      cierre: z.object({
        eyebrow: localized,
        titulo: localized,
        consultoria: localized,
        conferencia: localized,
      }),
    });
  },
});

// Bio en tres largos: la misma en Charlas y en Prensa (prototipo aprobado).
const bio = defineCollection({
  loader: glob({ pattern: 'bio.yaml', base: './src/content/paginas' }),
  schema: z.object({
    largos: z.array(z.object({ etiqueta: localized, texto: localized })).length(3),
    copiar: localized,
    /** Confirmación visible al copiar (no está en el prototipo). */
    copiada: localized,
  }),
});

// Opciones de los formularios de Charlas y Prensa: el valor lo valida también el servidor.
const opcion = <T extends readonly [string, ...string[]]>(valores: T) =>
  z.object({ valor: z.enum(valores), texto: localized });

const eventosPagina = defineCollection({
  loader: glob({ pattern: 'eventos.yaml', base: './src/content/paginas' }),
  schema: ({ image }) =>
    z.object({
      hero: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        foto: image(),
        fotoAlt: localized,
        pestanas: localized,
        proximos: localized,
        pasados: localized,
      }),
      proximos: z.object({ etiqueta: localized, vacio: localized, invitar: localized }),
      pasados: z.object({ etiqueta: localized }),
      tipos: z.record(z.enum(TIPOS_CHARLA), localized),
    }),
});

const speakerPagina = defineCollection({
  loader: glob({ pattern: 'speaker.yaml', base: './src/content/paginas' }),
  schema: ({ image }) =>
    z.object({
      hero: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        invitar: localized,
        copiarBio: localized,
        foto: image(),
        fotoAlt: localized,
      }),
      escenario: z.object({
        eyebrow: localized,
        titulo: localized,
        verTodos: localized,
        mapa: z.object({
          eyebrow: localized,
          titulo: localized,
          /** {paises}, {ciudades} y {eventos} se cuentan de la colección de charlas. */
          resumen: localized,
          /** Rótulo de la línea ecuatorial (decorativo, dentro del mapa). */
          ecuador: localized,
          ciudades: z.record(
            z.enum(CIUDADES_CHARLA),
            z.object({ nombre: localized, pais: localized }),
          ),
          masEventos: localized,
        }),
      }),
      tematicas: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        filaA: z.array(localized).min(1),
        filaB: z.array(localized).min(1),
        pasos: z.array(z.object({ titulo: localized, texto: localized })).length(3),
        /** Botón para pausar la cinta (WCAG 2.2.2; no está en el prototipo). */
        pausar: localized,
      }),
      bio: z.object({ eyebrow: localized, titulo: localized }),
      formatos: z.object({
        eyebrow: localized,
        titulo: localized,
        lista: z.array(z.object({ nombre: localized, texto: localized })).min(1),
        honorarios: localized,
        riderEyebrow: localized,
        riderTitulo: localized,
        rider: z.array(localized).min(1),
      }),
      invitar: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        campos: z.object({
          evento: localized,
          fecha: localized,
          ciudad: localized,
          audiencia: localized,
          audienciaEjemplo: localized,
          presupuesto: localized,
          correo: localized,
        }),
        presupuestos: z.array(opcion(PRESUPUESTOS_SPEAKER)).min(1),
        enviar: localized,
        recibido: localized,
      }),
    }),
});

const prensaPagina = defineCollection({
  loader: glob({ pattern: 'prensa.yaml', base: './src/content/paginas' }),
  schema: () =>
    z.object({
      hero: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        descargar: localized,
        entrevista: localized,
        datos: z.array(z.object({ clave: localized, valor: localized })).min(1),
      }),
      bio: z.object({ eyebrow: localized, titulo: localized, texto: localized }),
      fotos: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        descargar: localized,
        lista: z
          .array(
            z.object({
              titulo: localized,
              /** Archivo de src/assets/prensa (la página lo muestra y el kit lo incluye). */
              archivo: z.string().regex(/^[a-z0-9_.-]+\.(jpg|jpeg|png)$/),
              alt: localized,
            }),
          )
          .min(1),
      }),
      logos: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        lista: z.array(z.object({ etiqueta: localized, alt: localized })).length(3),
      }),
      xprize: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        fuente: z.object({ texto: localized, url: z.url() }),
        datos: z.array(z.object({ clave: localized, valor: localized })).min(1),
      }),
      kit: z.object({ titulo: localized, texto: localized, boton: localized }),
      contacto: z.object({
        eyebrow: localized,
        titulo: localized,
        texto: localized,
        campos: z.object({
          nombre: localized,
          medio: localized,
          correo: localized,
          necesidad: localized,
          cierre: localized,
          detalles: localized,
        }),
        necesidades: z.array(opcion(NECESIDADES_PRENSA)).min(1),
        autorizacion: z.object({ antes: localized, enlace: localized, despues: localized }),
        enviar: localized,
        recibido: localized,
      }),
    }),
});

const cvPagina = defineCollection({
  loader: glob({ pattern: 'cv.yaml', base: './src/content/paginas' }),
  schema: z.object({
    hero: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      descargar: localized,
      descargarCorto: localized,
      entrevista: localized,
      linkedin: localized,
      datos: z
        .array(
          z.object({
            clave: localized,
            valor: localized,
            fuente: z.object({ texto: localized, url: z.url() }).optional(),
          }),
        )
        .min(1),
      fotoAlt: localized,
    }),
    logros: z.object({
      titulo: localized,
      lista: z.array(z.object({ metrica: localized, texto: localized, quien: localized })).min(1),
    }),
    experiencia: z.object({
      titulo: localized,
      lista: z
        .array(z.object({ anios: localized, rol: localized, org: localized, texto: localized }))
        .min(1),
      historia: localized,
    }),
    // Pieza 12: niveles de 1 a 5 que dio Luis (la escala no se explica en el sitio).
    competencias: z.object({
      titulo: localized,
      subtitulo: localized,
      filtrar: localized,
      todo: localized,
      resaltar: localized,
      /** "Nivel {n}" (leyenda) y "nivel {n} de 5" (lectores de pantalla). */
      nivel: localized,
      nivelDe: localized,
      grupos: z
        .array(
          z.object({
            id: z.string().regex(/^[a-z-]+$/),
            nombre: localized,
            items: z
              .array(z.object({ nombre: localized, nivel: z.number().int().min(1).max(5) }))
              .min(1),
          }),
        )
        .min(1),
    }),
    // 21 nov 2026: la lista sale de la colección de certificaciones (insignias de Sobre mí).
    formacion: z.object({ titulo: localized }),
    comunidad: z.object({ titulo: localized, texto: localized, enlace: localized }),
    cierre: z.object({
      titulo: localized,
      texto: localized,
      agendar: localized,
      linkedin: localized,
    }),
  }),
});

const tituloTexto = z.object({ titulo: localized, texto: localized });

const programasAwsPagina = defineCollection({
  loader: glob({ pattern: 'programas-aws.yaml', base: './src/content/paginas' }),
  schema: z.object({
    hero: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      evaluar: localized,
      sesion: localized,
      grafica: z.object({
        alt: localized,
        hoy: localized,
        destino: localized,
        inversion: localized,
      }),
    }),
    idea: tituloTexto.extend({ tiposTitulo: localized, tipos: z.array(tituloTexto).min(1) }),
    rutas: z.object({
      titulo: localized,
      lista: z.array(tituloTexto.extend({ etiqueta: localized, umbral: localized })).min(1),
      nota: localized,
    }),
    inicio: tituloTexto.extend({
      assessment: tituloTexto.extend({ eyebrow: localized, sello: localized, aplica: localized }),
      prueba: tituloTexto.extend({ eyebrow: localized, aplica: localized }),
      nota: localized,
    }),
    fases: tituloTexto.extend({
      lista: z.array(tituloTexto).length(6),
      estrategiasTitulo: localized,
      estrategias: z.array(tituloTexto).min(1),
    }),
    inversion: tituloTexto.extend({
      nota: localized,
      ejemplo: z.object({
        eyebrow: localized,
        consumo: localized,
        consumoValor: localized,
        inversion: localized,
        inversionValor: localized,
        tramos: localized,
        primerTramo: localized,
        siguientes: localized,
        rondas: localized,
      }),
    }),
    caso: tituloTexto.extend({
      cifras: z
        .array(
          z.object({
            metrica: localized,
            texto: localized,
            /** Barra apilada (porcentajes o partes): tramos 25/75, hallazgos 12/25/57. */
            barra: z.array(z.number().positive()).optional(),
          }),
        )
        .min(1),
    }),
    costo: tituloTexto.extend({
      cubreTitulo: localized,
      cubre: z.array(localized).min(1),
      aparteTitulo: localized,
      aparte: z.array(localized).min(1),
      aviso: localized,
      entrada: localized,
    }),
    nexa: tituloTexto.extend({
      eyebrow: localized,
      servicios: z.array(localized).min(1),
      enlace: z.object({ texto: localized, url: z.url() }),
      nombre: z.string().min(1),
    }),
    faq: z.object({
      titulo: localized,
      lista: z.array(z.object({ pregunta: localized, respuesta: localized })).min(1),
    }),
    evaluar: tituloTexto.extend({
      condiciones: localized,
      sesion: localized,
      campos: z.object({
        tipoEmpresa: localized,
        infraestructura: localized,
        consumo: localized,
        anual: localized,
        anualAyuda: localized,
        migrar: localized,
        decide: localized,
        decideEjemplo: localized,
        plazo: localized,
        empresa: localized,
        correo: localized,
      }),
      tiposEmpresa: z.array(z.object({ valor: z.enum(TIPOS_EMPRESA_AWS), texto: localized })),
      infraestructuras: z.array(
        z.object({ valor: z.enum(INFRAESTRUCTURAS_AWS), texto: localized }),
      ),
      plazos: z.array(z.object({ valor: z.enum(PLAZOS_AWS), texto: localized })),
      consumoAprox: localized,
      consumoMas: localized,
      anualAprox: localized,
      anualMas: localized,
      enviar: localized,
      recibido: localized,
    }),
    nota: z.object({ texto: localized, enlace: localized }),
  }),
});

const productosPagina = defineCollection({
  loader: glob({ pattern: 'productos.yaml', base: './src/content/paginas' }),
  schema: z.object({
    hero: z.object({
      eyebrow: localized,
      titulo: localized,
      texto: localized,
      equipo: localized,
      verDemo: localized,
      inversionista: localized,
      // Pieza 05: el texto de las caras se dibuja en canvas, por idioma.
      medalla: z.object({
        etiqueta: localized,
        frente: z.object({
          rotulo: localized,
          linea1: localized,
          linea2: localized,
          evento: localized,
        }),
        reverso: z.object({
          rotulo: localized,
          nombre: localized,
          equipo: z.array(z.string().min(1)).min(1),
          cierre: localized,
        }),
      }),
      fuente: z.object({ texto: localized, url: z.url() }),
    }),
    funciona: z.object({
      eyebrow: localized,
      titulo: localized,
      pasos: z.array(tituloTexto).length(3),
      modulos: z.array(localized).min(1),
      conversacion: z.object({
        titulo: localized,
        demostracion: localized,
        mensajes: z
          .array(
            z.object({ quien: z.enum(['equipo', 'trama']), autor: localized, texto: localized }),
          )
          .min(2),
      }),
    }),
    logros: z.object({
      eyebrow: localized,
      titulo: localized,
      lista: z.array(z.object({ metrica: localized, texto: localized })).min(1),
    }),
    caminos: z.object({
      titulo: localized,
      // 21 nov 2026: la demo es un formulario con el producto (Trama, Ofilix u otro); `boton`
      // es el texto del botón de enviar.
      empresas: tituloTexto.extend({
        eyebrow: localized,
        boton: localized,
        campos: z.object({
          producto: localized,
          nombre: localized,
          empresa: localized,
          correo: localized,
          telefono: localized,
          mensaje: localized,
        }),
        productos: z.array(z.object({ valor: z.enum(PRODUCTOS_DEMO), texto: localized })),
        recibido: localized,
      }),
      inversionistas: tituloTexto.extend({
        eyebrow: localized,
        campos: z.object({
          tipo: localized,
          nombre: localized,
          pais: localized,
          correo: localized,
          telefono: localized,
        }),
        tipos: z.array(z.object({ valor: z.enum(TIPOS_INVERSIONISTA), texto: localized })),
        enviar: localized,
        aviso: localized,
        recibido: localized,
      }),
    }),
    portafolio: z.object({
      eyebrow: localized,
      titulo: localized,
      productos: z
        .array(
          z.object({
            nombre: z.string().min(1),
            dueno: localized,
            estado: localized,
            texto: localized,
          }),
        )
        .min(1),
      usar: localized,
      invertir: localized,
      proximos: tituloTexto,
    }),
    juntos: tituloTexto.extend({ eyebrow: localized }),
  }),
});

export const collections = {
  productosPagina,
  programasAwsPagina,
  cvPagina,
  bio,
  eventosPagina,
  speakerPagina,
  prensaPagina,
  home,
  casosPagina,
  puertas,
  casos,
  servicios,
  consultoria,
  adopcionIa,
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
  clientes,
  galerias,
  testimonios,
};
