// Datos del responsable para las páginas legales (aprobadas por abogado, 20 nov 2026).
// En los borradores iban entre corchetes. Mientras falte alguno, las páginas legales solo se
// ven en local (marcado como pendiente) y no se generan en producción ni van al sitemap:
// nunca se publica un dato entre corchetes. Luis los entrega.
export const datosLegales: Record<
  'documento' | 'ciudad' | 'correoPrivacidad' | 'correoContacto' | 'vigencia' | 'conservacion',
  string | undefined
> = {
  /** Tipo y número de documento o NIT, como debe aparecer: p. ej. "C.C. 0.000.000". */
  documento: undefined,
  /** Ciudad del domicilio (Colombia). */
  ciudad: undefined,
  /** Correo para asuntos de privacidad (no el personal). */
  correoPrivacidad: undefined,
  /** Correo de contacto de los términos de uso. */
  correoContacto: undefined,
  /** Fecha desde la que rige, como se lee en la página: p. ej. "1 de febrero de 2027". */
  vigencia: undefined,
  /** Plazo de conservación sin relación activa; el borrador proponía "24 meses". */
  conservacion: undefined,
};

export type DatoLegal = keyof typeof datosLegales;

export const datosLegalesPendientes = (Object.keys(datosLegales) as DatoLegal[]).filter(
  (clave) => !datosLegales[clave],
);

/** true cuando las páginas legales se pueden publicar. */
export const legalPublicable = datosLegalesPendientes.length === 0;

// Versión de la política que acepta quien envía un formulario; se guarda con cada solicitud
// como prueba de la autorización (Ley 1581 de 2012). Cuando se publique, pasa a ser la fecha
// de vigencia de la versión aprobada.
export const POLITICA_DATOS_VERSION = '2026-11-13';
