import { describe, expect, it } from 'vitest';
import { cabeceraLink, prefiereMarkdown } from '../../src/lib/seo/agentes';
import { precioUsd } from '../../src/lib/seo/precio';

describe('agentes de IA', () => {
  it('entrega Markdown solo a quien lo pide y no prefiere HTML', () => {
    expect(prefiereMarkdown('text/markdown')).toBe(true);
    expect(prefiereMarkdown('text/markdown, text/html;q=0.9')).toBe(true);
    expect(prefiereMarkdown('text/html, text/markdown;q=0.5')).toBe(false);
    expect(prefiereMarkdown('text/markdown;q=0')).toBe(false);
    // Lo que manda Chrome.
    expect(
      prefiereMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'),
    ).toBe(false);
    expect(prefiereMarkdown('*/*')).toBe(false);
    expect(prefiereMarkdown(null)).toBe(false);
  });

  it('la cabecera Link apunta al Markdown del idioma, a llms.txt y a Sobre mí', () => {
    expect(cabeceraLink(new URL('https://luisreyesvanegas.com'), 'en')).toBe(
      '<https://luisreyesvanegas.com/en.md>; rel="alternate"; type="text/markdown", ' +
        '<https://luisreyesvanegas.com/llms.txt>; rel="describedby"; type="text/plain", ' +
        '<https://luisreyesvanegas.com/en/sobre-mi>; rel="author"',
    );
  });

  it('lee el precio en dólares de un texto aprobado', () => {
    expect(precioUsd('Sesión de arquitectura · US$450')).toBe(450);
    expect(precioUsd('US$1.500 al mes')).toBe(1500);
    expect(precioUsd('US$1,500')).toBe(1500);
    expect(precioUsd('US$4500')).toBe(4500);
    expect(precioUsd('Sesión de arquitectura')).toBeUndefined();
  });
});
