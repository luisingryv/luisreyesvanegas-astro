// Validación en el servidor de lo que llega de los formularios. Los mensajes de error son
// códigos; la interfaz los traduce. Un campo vacío de un formulario HTML cuenta como ausente.
import { z } from 'astro/zod';
import { IDIOMAS } from '../../../db/schema';

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

// Los demás formularios (speaker, prensa, productos, programas AWS) se agregan aquí
// con sus campos propios cuando se construyan sus páginas.
export const solicitud = z.discriminatedUnion(
  'formulario',
  [formularioGeneral, formularioConsultoria],
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
