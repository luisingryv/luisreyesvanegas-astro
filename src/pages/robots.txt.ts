import type { APIRoute } from 'astro';

export const prerender = true;

// Buscadores y asistentes de IA pueden leer todo el sitio público (SEO y GEO).
export const GET: APIRoute = ({ site }) => {
  const base = site ? site.toString().replace(/\/$/, '') : 'https://luisreyesvanegas.com';
  const sitemapUrl = `${base}/sitemap.xml`;
  const llmsUrl = `${base}/llms.txt`;

  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /design-system',
    '',
    '# AI Crawlers y Motores de Búsqueda de IA',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: Applebot-Extended',
    'Allow: /',
    '',
    'User-agent: CCBot',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    `# AI Documentation: ${llmsUrl}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
