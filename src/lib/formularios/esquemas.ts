// Validación en el servidor de lo que llega de los formularios. Los mensajes de error son
// códigos; la interfaz los traduce. Un campo vacío de un formulario HTML cuenta como ausente.
import { z } from 'astro/zod';
import { IDIOMAS } from '../../../db/schema';
import {
  CONSUMOS_AWS,
  INFRAESTRUCTURAS_AWS,
  NECESIDADES_PRENSA,
  PLAZOS_AWS,
  PRESUPUESTOS_SPEAKER,
  TIPOS_EMPRESA_AWS,
  TIPOS_INVERSIONISTA,
} from './opciones';

export type CodigoError = 'requerido' | 'invalido' | 'muy-corto' | 'muy-largo' | 'debe-aceptar';

const vacioAusente = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? undefined : v);

const opcional = (max: number) =>
  z.preprocess(vacioAusente, z.string().trim().max(max, { error: 'muy-largo' }).optional());

const requerido = (min: number, max: number) =>
  z.preprocess(
    vacioAusente,
    z
      .string({ error: 'requerido' })
      .trim()
      .min(min, { error: 'muy-corto' })
      .max(max, { error: 'muy-largo' }),
  );

// Casilla de autorización: en HTML llega "on"; en JSON, true.
const autorizacion = z.preprocess(
  (v) => v === true || v === 'on' || v === 'true',
  z.literal(true, { error: 'debe-aceptar' }),
);

const slug = z.string().regex(/^[a-z0-9-]{1,60}$/, { error: 'invalido' });

// Campos que comparten todos los formularios.
const comunes = {
  idioma: z.preprocess(vacioAusente, z.enum(IDIOMAS, { error: 'invalido' }).default('es')),
  email: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z
      .email({ error: (i) => (i.input === undefined || i.input === '' ? 'requerido' : 'invalido') })
      .max(254, { error: 'muy-largo' }),
  ),
  puerta: z.preprocess(vacioAusente, slug.optional()),
  // Solo rutas del propio sitio: se usa para volver a la página sin JavaScript.
  pagina: z.preprocess(
    vacioAusente,
    z
      .string()
      .max(255, { error: 'muy-largo' })
      .regex(/^\/(?![/\\])/, { error: 'invalido' })
      .optional(),
  ),
  utm_source: opcional(120),
  utm_medium: opcional(120),
  utm_campaign: opcional(120),
  utm_term: opcional(120),
  utm_content: opcional(120),
  acepta: autorizacion,
};

/** Formulario general (Home y Contacto): nombre, email, tema, mensaje y autorización. */
export const formularioGeneral = z.object({
  formulario: z.literal('general', { error: 'invalido' }),
  ...comunes,
  nombre: requerido(2, 120),
  // Números con indicativo, espacios, guiones o paréntesis (WhatsApp).
  whatsapp: z.preprocess(
    vacioAusente,
    z
      .string()
      .trim()
      .regex(/^\+?[0-9][0-9 ()-]{6,19}$/, { error: 'invalido' })
      .optional(),
  ),
  mensaje: requerido(10, 5000),
});

/** Agenda de Consultoría: preguntas previas a elegir fecha (sin nombre, como el prototipo). */
export const formularioConsultoria = z.object({
  formulario: z.literal('consultoria', { error: 'invalido' }),
  ...comunes,
  // Qué quiere resolver: obligatorio en la agenda.
  puerta: z.preprocess(
    vacioAusente,
    z.string({ error: 'requerido' }).regex(/^[a-z0-9-]{1,60}$/, { error: 'invalido' }),
  ),
  nubes: opcional(200),
  gasto: opcional(60),
});

// Fecha de un <input type="date">: AAAA-MM-DD.
const fecha = z.string({ error: 'requerido' }).regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'invalido' });

/** Invitación a una charla (Charlas, #invitar). */
export const formularioSpeaker = z.object({
  formulario: z.literal('speaker', { error: 'invalido' }),
  ...comunes,
  evento: requerido(2, 160),
  fecha: z.preprocess(vacioAusente, fecha),
  ciudad: requerido(2, 120),
  audiencia: opcional(300),
  presupuesto: z.preprocess(
    vacioAusente,
    z.enum(PRESUPUESTOS_SPEAKER, { error: 'invalido' }).optional(),
  ),
});

/** Contacto de prensa (Prensa, #contacto-prensa). Los detalles van en el mensaje. */
export const formularioPrensa = z.object({
  formulario: z.literal('prensa', { error: 'invalido' }),
  ...comunes,
  nombre: requerido(2, 120),
  medio: requerido(2, 160),
  necesidad: z.preprocess(
    vacioAusente,
    z.enum(NECESIDADES_PRENSA, {
      error: (i) => (i.input === undefined ? 'requerido' : 'invalido'),
    }),
  ),
  cierre: z.preprocess(vacioAusente, fecha.optional()),
  mensaje: opcional(5000),
});

const opcionDe = <T extends readonly [string, ...string[]]>(valores: T) =>
  z.preprocess(
    vacioAusente,
    z.enum(valores, { error: (i) => (i.input === undefined ? 'requerido' : 'invalido') }),
  );

/** Evaluación para el programa MAP (Programas AWS, #evaluar). Lo que quiere migrar va en el mensaje. */
export const formularioProgramasAws = z.object({
  formulario: z.literal('programas-aws', { error: 'invalido' }),
  ...comunes,
  tipoEmpresa: opcionDe(TIPOS_EMPRESA_AWS),
  infraestructura: opcionDe(INFRAESTRUCTURAS_AWS),
  consumo: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : vacioAusente(v)),
    z
      .number({ error: (i) => (i.input === undefined ? 'requerido' : 'invalido') })
      .refine((n) => (CONSUMOS_AWS as readonly number[]).includes(n), { error: 'invalido' }),
  ),
  mensaje: opcional(3000),
  decide: opcional(120),
  plazo: opcionDe(PLAZOS_AWS),
  empresa: requerido(2, 160),
});

/** Inversionistas de Trama (Productos, #invertir). */
export const formularioProductos = z.object({
  formulario: z.literal('productos', { error: 'invalido' }),
  ...comunes,
  inversionista: opcionDe(TIPOS_INVERSIONISTA),
  pais: requerido(2, 80),
});

export const solicitud = z.discriminatedUnion(
  'formulario',
  [
    formularioGeneral,
    formularioConsultoria,
    formularioSpeaker,
    formularioPrensa,
    formularioProgramasAws,
    formularioProductos,
  ],
  { error: 'invalido' },
);

export type EntradaSolicitud = z.infer<typeof solicitud>;

/** Errores por campo, como códigos: { email: 'invalido', acepta: 'debe-aceptar' }. */
export function erroresPorCampo(error: z.ZodError): Record<string, CodigoError> {
  const errores: Record<string, CodigoError> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? 'formulario');
    errores[campo] ??= (issue.message as CodigoError) ?? 'invalido';
  }
  return errores;
}

/** Campo trampa: invisible para personas; si llega con texto, es un bot. */
export const CAMPO_TRAMPA = 'sitio_web';
