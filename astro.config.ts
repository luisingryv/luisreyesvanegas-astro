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

  env: {
    schema: {
      CALENDAR_BOOKING_URL: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        url: true,
      }),
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
