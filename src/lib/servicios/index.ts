// Elige las integraciones según las variables de entorno. Mientras Luis no conecte Notion y
// Resend (T-407), quedan desactivadas: cada solicitud se guarda en la base como pendiente y
// la tarea /api/tareas/sincronizar la enviará cuando estén activas.
import {
  AVISO_CORREO_DESTINO,
  AVISO_CORREO_REMITENTE,
  NOTION_API_KEY,
  NOTION_DATABASE_ID_CONTACTS,
  RESEND_API_KEY,
} from 'astro:env/server';
import { integracionesDesactivadas, type Integraciones } from './integraciones';

export function getIntegraciones(): Integraciones {
  const notionLista = Boolean(NOTION_API_KEY && NOTION_DATABASE_ID_CONTACTS);
  const resendLista = Boolean(RESEND_API_KEY && AVISO_CORREO_DESTINO && AVISO_CORREO_REMITENTE);
  // Aquí se conectarán crearCrmNotion(...) y crearAvisoResend(...) cuando se integren.
  void notionLista;
  void resendLista;
  return integracionesDesactivadas;
}

export * from './integraciones';
