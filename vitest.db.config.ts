import { defineConfig } from 'vitest/config';

// Pruebas de integración contra MariaDB (local: Docker; CI: servicio de GitHub Actions).
// Usan DATABASE_URL_TEST, nunca la base de desarrollo; el script carga .env con Node.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/db/**/*.test.ts'],
    // Una sola base compartida: los archivos corren uno tras otro.
    fileParallelism: false,
  },
});
