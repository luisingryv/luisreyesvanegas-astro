import type { APIRoute } from 'astro';

export const prerender = true;

// Buscadores y asistentes de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) pueden leer
// todo el sitio público (SEO y GEO). Un solo grupo para todos: si un robot tiene su propio grupo,
// ignora el general y con él los Disallow (25 nov 2026).
export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Disallow: /api/',
      'Disallow: /design-system',
      '',
      `Sitemap: ${new URL('/sitemap.xml', site).toString()}`,
      `# Resumen para asistentes de IA: ${new URL('/llms.txt', site).toString()}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
