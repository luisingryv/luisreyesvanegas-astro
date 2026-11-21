// Esquema de la base de datos (MariaDB 10.11 en Hostinger, MySQL en Drizzle).
// Solo datos dinámicos: solicitudes de los formularios y suscriptores del boletín.
// El contenido del sitio vive en las colecciones de src/content.
import { sql } from 'drizzle-orm';
import {
  bigint,
  char,
  datetime,
  index,
  json,
  mysqlTable,
  text,
  tinyint,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

/** Formularios del sitio (fichas 03, 07 y 08). Se validan con Zod; en la base es texto. */
export const FORMULARIOS = [
  'general',
  'speaker',
  'prensa',
  'productos',
  'programas-aws',
  'consultoria',
  // Productos, #usar (21 nov 2026): demo de Trama, Ofilix u otro producto.
  'demo',
] as const;
export type Formulario = (typeof FORMULARIOS)[number];

export const IDIOMAS = ['es', 'en', 'pt'] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const ESTADOS_SUSCRIPTOR = ['pendiente', 'confirmado', 'baja'] as const;
export type EstadoSuscriptor = (typeof ESTADOS_SUSCRIPTOR)[number];

// MariaDB no acepta `serial AUTO_INCREMENT` (lo que genera serial() de Drizzle): clave explícita.
const clave = () => bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey();

const ahora = () =>
  datetime('creado_en', { fsp: 3 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`);

// UTM persistidas hasta el formulario (HU-0.4) y página de origen.
const origen = {
  pagina: varchar({ length: 255 }),
  utmSource: varchar('utm_source', { length: 120 }),
  utmMedium: varchar('utm_medium', { length: 120 }),
  utmCampaign: varchar('utm_campaign', { length: 120 }),
  utmTerm: varchar('utm_term', { length: 120 }),
  utmContent: varchar('utm_content', { length: 120 }),
};

// Prueba de la autorización de datos (Ley 1581): fecha, formulario y versión de la política.
const autorizacion = {
  politicaVersion: varchar('politica_version', { length: 20 }).notNull(),
  autorizadoEn: datetime('autorizado_en', { fsp: 3 }).notNull(),
};

export const solicitudes = mysqlTable(
  'solicitudes',
  {
    id: clave(),
    creadoEn: ahora(),
    formulario: varchar({ length: 30 }).$type<Formulario>().notNull(),
    /** Puerta de entrada de consultoría o etiqueta del router de contacto. */
    puerta: varchar({ length: 60 }),
    idioma: char({ length: 2 }).$type<Idioma>().notNull(),
    /** Opcional: el formulario de agenda de Consultoría no lo pide (Luis, 20 nov 2026). */
    nombre: varchar({ length: 120 }),
    email: varchar({ length: 254 }).notNull(),
    whatsapp: varchar({ length: 40 }),
    mensaje: text(),
    /** Campos propios de cada formulario (fecha, ciudad, audiencia, presupuesto…). */
    datos: json().$type<Record<string, string | number | boolean | null>>(),
    ...origen,
    ...autorizacion,
    // Integraciones: el formulario se guarda primero; el CRM y el aviso se reintentan aparte.
    crmPageId: varchar('crm_page_id', { length: 64 }),
    crmSincronizadoEn: datetime('crm_sincronizado_en', { fsp: 3 }),
    avisoEnviadoEn: datetime('aviso_enviado_en', { fsp: 3 }),
    intentos: tinyint({ unsigned: true }).notNull().default(0),
    ultimoError: text('ultimo_error'),
  },
  (t) => [
    index('solicitudes_email_idx').on(t.email),
    index('solicitudes_creado_en_idx').on(t.creadoEn),
  ],
);

export const suscriptores = mysqlTable(
  'suscriptores',
  {
    id: clave(),
    creadoEn: ahora(),
    email: varchar({ length: 254 }).notNull(),
    idioma: char({ length: 2 }).$type<Idioma>().notNull(),
    estado: varchar({ length: 12 }).$type<EstadoSuscriptor>().notNull().default('pendiente'),
    /** SHA-256 del enlace de confirmación o de baja; el token en claro solo viaja en el correo. */
    tokenHash: char('token_hash', { length: 64 }).notNull(),
    confirmadoEn: datetime('confirmado_en', { fsp: 3 }),
    bajaEn: datetime('baja_en', { fsp: 3 }),
    ...origen,
    ...autorizacion,
  },
  (t) => [
    uniqueIndex('suscriptores_email_uq').on(t.email),
    uniqueIndex('suscriptores_token_uq').on(t.tokenHash),
  ],
);

export type Solicitud = typeof solicitudes.$inferSelect;
export type NuevaSolicitud = typeof solicitudes.$inferInsert;
export type Suscriptor = typeof suscriptores.$inferSelect;
