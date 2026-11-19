import { defineConfig, devices } from '@playwright/test';

const PORT = 4399;

// Pruebas contra el build de producción, con el Chrome instalado (sin descargar navegadores).
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: 'chrome',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'celular', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: `pnpm build && HOST=127.0.0.1 PORT=${PORT} node dist/server/entry.mjs`,
    url: `http://127.0.0.1:${PORT}/es/sobre-mi`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
