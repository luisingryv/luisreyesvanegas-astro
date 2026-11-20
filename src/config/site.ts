import { CALENDAR_BOOKING_URL } from 'astro:env/server';
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

// Mientras Luis no entregue la URL de la agenda, se va a Contacto (o al formulario de la
// misma página, si lo tiene).
export function bookingUrl(locale: Locale, sinAgenda?: string): string {
  return CALENDAR_BOOKING_URL ?? sinAgenda ?? localizedPath(locale, 'contacto');
}
