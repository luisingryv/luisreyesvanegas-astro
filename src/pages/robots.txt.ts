import type { APIRoute } from 'astro';

export const prerender = true;

// Buscadores y asistentes de IA pueden leer todo el sitio público (SEO y GEO).
export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Disallow: /api/',
      'Disallow: /design-system',
      '',
      `Sitemap: ${new URL('/sitemap.xml', site).toString()}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
