import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://luisreyesvanegas.com',
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [react()],

  // Detrás del proxy de Hostinger: confía en X-Forwarded-Host/Proto solo para el dominio
  // del sitio, para que la verificación de origen de los formularios vea https://.
  security: {
    checkOrigin: true,
    allowedDomains: [
      { hostname: 'luisreyesvanegas.com', protocol: 'https' },
      { hostname: 'www.luisreyesvanegas.com', protocol: 'https' },
    ],
  },

  env: {
    schema: {
      CALENDAR_BOOKING_URL: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        url: true,
      }),
      // WhatsApp corporativo (se muestra en Home y Contacto cuando Luis lo entregue).
      WHATSAPP_NUMERO: envField.string({ context: 'server', access: 'public', optional: true }),
      // Integraciones del formulario (T-407). Mientras falten, quedan desactivadas y las
      // solicitudes se guardan pendientes en la base.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      AVISO_CORREO_DESTINO: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      AVISO_CORREO_REMITENTE: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      NOTION_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      NOTION_DATABASE_ID_CONTACTS: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      // Token del cron de Hostinger para /api/tareas/sincronizar.
      TAREAS_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Opcional: las páginas estáticas no la necesitan; getDb() avisa si falta.
      DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
