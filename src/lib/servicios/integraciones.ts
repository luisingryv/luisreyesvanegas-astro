// Integraciones de los formularios detrás de interfaces propias: las páginas y la lógica
// no conocen a Notion ni a Resend. Mientras Luis no cree las cuentas, quedan desactivadas
// y la solicitud queda pendiente en la base para sincronizarla después (T-407).
import type { Solicitud } from '../../../db/schema';

export interface Crm {
  /** Crea la ficha del lead y devuelve su id, o null si el CRM está desactivado. */
  crearFicha(solicitud: Solicitud): Promise<string | null>;
}

export interface Aviso {
  /** Avisa a Luis de la solicitud. false si el correo está desactivado. */
  avisar(solicitud: Solicitud): Promise<boolean>;
}

export const crmDesactivado: Crm = { crearFicha: async () => null };
export const avisoDesactivado: Aviso = { avisar: async () => false };

export interface Integraciones {
  crm: Crm;
  aviso: Aviso;
}

export const integracionesDesactivadas: Integraciones = {
  crm: crmDesactivado,
  aviso: avisoDesactivado,
};
