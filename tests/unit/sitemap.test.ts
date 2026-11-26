import { describe, expect, it } from 'vitest';
import { sitemapXml, slugsDePaginas } from '../../src/lib/seo/sitemap';

describe('sitemap', () => {
  it('toma solo las páginas por idioma', () => {
    expect(
      slugsDePaginas([
        '/src/pages/[lang]/sobre-mi.astro',
        '/src/pages/[lang]/index.astro',
        '/src/pages/[lang]/casos/index.astro',
        '/src/pages/[lang]/casos/[slug].astro',
        '/src/pages/design-system.astro',
        '/src/pages/index.astro',
      ]),
    ).toEqual(['', 'casos', 'sobre-mi']);
  });

  it('lista cada página en cada idioma publicado con sus alternativas y x-default', () => {
    const xml = sitemapXml(
      new URL('https://luisreyesvanegas.com'),
      ['sobre-mi'],
      ['es', 'en'],
      'es',
    );
    expect(xml).toContain('<loc>https://luisreyesvanegas.com/es/sobre-mi</loc>');
    expect(xml).toContain('<loc>https://luisreyesvanegas.com/en/sobre-mi</loc>');
    expect(xml.match(/<url>/g)).toHaveLength(2);
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="x-default" href="https://luisreyesvanegas.com/es/sobre-mi"/>',
    );
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('una página que existe en un solo idioma solo aparece en ese idioma', () => {
    const xml = sitemapXml(
      new URL('https://luisreyesvanegas.com'),
      [{ slug: 'noticias/una', idiomas: ['es'] }],
      ['es', 'en', 'pt'],
      'es',
    );
    expect(xml.match(/<url>/g)).toHaveLength(1);
    expect(xml).toContain('<loc>https://luisreyesvanegas.com/es/noticias/una</loc>');
    expect(xml).not.toContain('/en/noticias');
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="x-default" href="https://luisreyesvanegas.com/es/noticias/una"/>',
    );
  });

  it('pone <lastmod>: la fecha propia de la página o, si no tiene, la del build', () => {
    const xml = sitemapXml(
      new URL('https://luisreyesvanegas.com'),
      [
        'sobre-mi',
        { slug: 'noticias/una', idiomas: ['es'], lastmod: new Date('2026-11-20T12:00:00Z') },
      ],
      ['es'],
      'es',
      new Date('2026-11-26T05:00:00Z'),
    );
    expect(xml).toContain(
      '<loc>https://luisreyesvanegas.com/es/sobre-mi</loc><lastmod>2026-11-26</lastmod>',
    );
    expect(xml).toContain(
      '<loc>https://luisreyesvanegas.com/es/noticias/una</loc><lastmod>2026-11-20</lastmod>',
    );
  });
});
