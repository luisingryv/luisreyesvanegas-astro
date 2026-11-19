import { defineConfig } from 'vitest/config';

// astro:content no carga en Vitest: aquí van funciones puras. El contenido real se prueba con Playwright.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
