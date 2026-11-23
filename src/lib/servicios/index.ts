// Elige las integraciones según las variables de entorno.
import {
  AVISO_CORREO_DESTINO,
  AVISO_CORREO_REMITENTE,
  NOTION_API_KEY,
  NOTION_DATABASE_ID_CONTACTS,
  RESEND_API_KEY,
} from 'astro:env/server';
import { avisoDesactivado, crmDesactivado, type Integraciones } from './integraciones';
import { crearAvisoResend } from './resend';

export function getIntegraciones(): Integraciones {
  const notionLista = Boolean(NOTION_API_KEY && NOTION_DATABASE_ID_CONTACTS);
  const resendLista = Boolean(RESEND_API_KEY && AVISO_CORREO_DESTINO && AVISO_CORREO_REMITENTE);

  const crm = crmDesactivado;
  const aviso = resendLista
    ? crearAvisoResend(RESEND_API_KEY!, AVISO_CORREO_REMITENTE!, AVISO_CORREO_DESTINO!)
    : avisoDesactivado;

  void notionLista;

  return { crm, aviso };
}

export * from './integraciones';
export * from './resend';
