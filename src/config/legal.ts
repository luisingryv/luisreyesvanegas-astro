// Datos del responsable para las páginas legales (aprobadas por abogado; datos entregados por
// Luis el 20 nov 2026). Sin documento de identidad, por decisión de Luis. Si alguno faltara,
// las páginas legales solo se verían en local (marcado como pendiente) y no se generarían en
// producción ni irían al sitemap: nunca se publica un dato entre corchetes.
export const datosLegales: Record<
  'ciudad' | 'correoPrivacidad' | 'correoContacto' | 'vigencia' | 'conservacion',
  string | undefined
> = {
  /** Ciudad del domicilio (Colombia). */
  ciudad: 'Barranquilla',
  /** Correo para asuntos de privacidad: el mismo para todo lo legal. */
  correoPrivacidad: 'legal@luisreyesvanegas.com',
  /** Correo de contacto de los términos de uso. */
  correoContacto: 'legal@luisreyesvanegas.com',
  /** Fecha desde la que rigen, como se lee en la página. */
  vigencia: '20 de noviembre de 2026',
  /** Plazo de conservación sin relación activa. */
  conservacion: '24 meses',
};

export type DatoLegal = keyof typeof datosLegales;

export const datosLegalesPendientes = (Object.keys(datosLegales) as DatoLegal[]).filter(
  (clave) => !datosLegales[clave],
);

/** true cuando las páginas legales se pueden publicar. */
export const legalPublicable = datosLegalesPendientes.length === 0;

// Versión de la política que acepta quien envía un formulario; se guarda con cada solicitud
// como prueba de la autorización (Ley 1581 de 2012): la fecha de vigencia de la versión aprobada.
export const POLITICA_DATOS_VERSION = '2026-11-20';
