import { WHATSAPP_NUMERO } from 'astro:env/server';
import type { Locale } from '../i18n/config';
import { localizedPath } from '../i18n/routes';

export const site = {
  linkedin: 'https://www.linkedin.com/in/luis-carlos-reyes-vanegas-803306170/',
  person: {
    name: 'Luis Carlos Reyes Vanegas',
    worksFor: [{ name: 'EvolutecC', url: 'https://evolutecc.com/' }, { name: 'Trama AI' }],
    alumniOf: [{ name: 'SENA' }],
  },
} as const;

export function evoluteccUrl(campaign: string): string {
  const url = new URL('https://evolutecc.com/');
  url.searchParams.set('utm_source', 'luisreyesvanegas');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}

// "Agendar" lleva al formulario de agenda de Consultoría: guarda las preguntas previas y abre
// la página de reservas de Google Calendar (CALENDAR_BOOKING_URL). El Home usa su propio
// formulario (#agenda), como en el prototipo.
export function bookingUrl(locale: Locale, local?: string): string {
  return local ?? localizedPath(locale, 'consultoria', 'agenda');
}

/** WhatsApp corporativo: número para mostrar y enlace de wa.me. undefined hasta que Luis lo entregue. */
export const whatsapp = WHATSAPP_NUMERO
  ? { numero: WHATSAPP_NUMERO, url: `https://wa.me/${WHATSAPP_NUMERO.replace(/\D/g, '')}` }
  : undefined;
