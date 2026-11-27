// Flujo de una solicitud: validar → frenar abusos → guardar (la base es la fuente) →
// intentar CRM y aviso. Si una integración falla, la solicitud ya está guardada y queda
// pendiente para reintentar; quien envió el formulario recibe igual la confirmación.
import { POLITICA_DATOS_VERSION } from '../../config/legal';
import type { Db } from '../db/cliente';
import {
  contarRecientesPorEmail,
  guardarSolicitud,
  marcarAvisoEnviado,
  marcarEnCrm,
  obtenerSolicitud,
  registrarErrorDeIntegracion,
} from '../db/solicitudes';
import type { Integraciones } from '../servicios/integraciones';
import { CAMPO_TRAMPA, erroresPorCampo, solicitud, type CodigoError } from './esquemas';
import { telefonoCompleto, type Pais } from './paises';

/** Nombre del país en español, para el aviso y el CRM (Colombia en lugar de CO). */
const nombrePais = (pais: Pais) => {
  try {
    return new Intl.DisplayNames(['es'], { type: 'region' }).of(pais) ?? pais;
  } catch {
    return pais;
  }
};

const quitarVacios = (objeto: Record<string, string | undefined>) => {
  const lleno = Object.fromEntries(Object.entries(objeto).filter(([, v]) => v !== undefined));
  return Object.keys(lleno).length > 0 ? (lleno as Record<string, string>) : null;
};

/** Máximo de solicitudes por correo en una hora. */
export const LIMITE_POR_HORA = 3;

export type ResultadoSolicitud =
  | { ok: true; id: number | null }
  | { ok: false; motivo: 'validacion'; errores: Record<string, CodigoError> }
  | { ok: false; motivo: 'demasiadas' };

export async function procesarSolicitud(
  entrada: unknown,
  { db, crm, aviso, ahora = () => new Date() }: { db: Db; ahora?: () => Date } & Integraciones,
): Promise<ResultadoSolicitud> {
  // Bot: se le responde como si todo hubiera salido bien y no se guarda nada.
  const trampa = (entrada as Record<string, unknown> | null)?.[CAMPO_TRAMPA];
  if (typeof trampa === 'string' && trampa.trim() !== '') return { ok: true, id: null };

  const validada = solicitud.safeParse(entrada);
  if (!validada.success) {
    return { ok: false, motivo: 'validacion', errores: erroresPorCampo(validada.error) };
  }
  const datos = validada.data;
  const momento = ahora();

  const haceUnaHora = new Date(momento.getTime() - 60 * 60 * 1000);
  if ((await contarRecientesPorEmail(db, datos.email, haceUnaHora)) >= LIMITE_POR_HORA) {
    return { ok: false, motivo: 'demasiadas' };
  }

  // Lo propio de cada formulario: mensaje en su columna; lo demás, en datos. El nombre y el
  // teléfono (con indicativo, en la columna whatsapp) los tienen todos desde el 27 nov 2026.
  const propios = (() => {
    switch (datos.formulario) {
      case 'general':
        return { mensaje: datos.mensaje };
      case 'consultoria':
        return { datos: quitarVacios({ nubes: datos.nubes, gasto: datos.gasto }) };
      case 'speaker':
        return {
          datos: quitarVacios({
            evento: datos.evento,
            fecha: datos.fecha,
            ciudad: datos.ciudad,
            audiencia: datos.audiencia,
            presupuesto: datos.presupuesto,
          }),
        };
      case 'prensa':
        return {
          mensaje: datos.mensaje,
          datos: quitarVacios({
            medio: datos.medio,
            necesidad: datos.necesidad,
            cierre: datos.cierre,
          }),
        };
      case 'programas-aws':
        return {
          mensaje: datos.mensaje,
          datos: quitarVacios({
            tipoEmpresa: datos.tipoEmpresa,
            infraestructura: datos.infraestructura,
            consumoMensual: String(datos.consumo),
            consumoAnual: String(datos.consumo * 12),
            decide: datos.decide,
            plazo: datos.plazo,
            empresa: datos.empresa,
          }),
        };
      case 'productos':
        return {
          datos: quitarVacios({
            inversionista: datos.inversionista,
            pais: nombrePais(datos.pais),
          }),
        };
      case 'demo':
        return {
          mensaje: datos.mensaje,
          datos: quitarVacios({ producto: datos.producto, empresa: datos.empresa }),
        };
    }
  })();

  const id = await guardarSolicitud(db, {
    formulario: datos.formulario,
    idioma: datos.idioma,
    email: datos.email,
    nombre: datos.nombre,
    whatsapp: telefonoCompleto(datos.pais, datos.telefono),
    ...propios,
    puerta: datos.puerta,
    pagina: datos.pagina,
    utmSource: datos.utm_source,
    utmMedium: datos.utm_medium,
    utmCampaign: datos.utm_campaign,
    utmTerm: datos.utm_term,
    utmContent: datos.utm_content,
    politicaVersion: POLITICA_DATOS_VERSION,
    autorizadoEn: momento,
  });

  const guardada = (await obtenerSolicitud(db, id))!;
  try {
    const fichaId = await crm.crearFicha(guardada);
    if (fichaId) await marcarEnCrm(db, id, fichaId);
  } catch (error) {
    await registrarErrorDeIntegracion(db, id, error);
  }
  try {
    if (await aviso.avisar(guardada)) await marcarAvisoEnviado(db, id);
  } catch (error) {
    await registrarErrorDeIntegracion(db, id, error);
  }

  return { ok: true, id };
}
