// Reintenta llevar al CRM y avisar las solicitudes pendientes (las que quedaron sin enviar
// porque una integración estaba desactivada o falló). La llama el cron de Hostinger.
import type { Db } from '../db/cliente';
import {
  marcarAvisoEnviado,
  marcarEnCrm,
  registrarErrorDeIntegracion,
  solicitudesPendientes,
} from '../db/solicitudes';
import type { Integraciones } from './integraciones';

export interface ResumenSincronizacion {
  revisadas: number;
  enCrm: number;
  avisadas: number;
  errores: number;
}

export async function sincronizarPendientes(
  db: Db,
  { crm, aviso }: Integraciones,
  limite = 20,
): Promise<ResumenSincronizacion> {
  const pendientes = await solicitudesPendientes(db, limite);
  const resumen: ResumenSincronizacion = {
    revisadas: pendientes.length,
    enCrm: 0,
    avisadas: 0,
    errores: 0,
  };
  for (const solicitud of pendientes) {
    try {
      if (!solicitud.crmSincronizadoEn) {
        const fichaId = await crm.crearFicha(solicitud);
        if (fichaId) {
          await marcarEnCrm(db, solicitud.id, fichaId);
          resumen.enCrm++;
        }
      }
      if (!solicitud.avisoEnviadoEn && (await aviso.avisar(solicitud))) {
        await marcarAvisoEnviado(db, solicitud.id);
        resumen.avisadas++;
      }
    } catch (error) {
      resumen.errores++;
      await registrarErrorDeIntegracion(db, solicitud.id, error);
    }
  }
  return resumen;
}
