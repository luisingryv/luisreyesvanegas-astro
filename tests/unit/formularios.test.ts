import { describe, expect, it } from 'vitest';
import { erroresPorCampo, formularioGeneral, solicitud } from '../../src/lib/formularios/esquemas';

const valida = {
  formulario: 'general',
  nombre: 'Ana Pérez',
  email: 'ana@ejemplo.com',
  mensaje: 'Quiero conversar sobre la migración a AWS.',
  acepta: 'on',
};

const errores = (entrada: unknown) => {
  const r = solicitud.safeParse(entrada);
  return r.success ? {} : erroresPorCampo(r.error);
};

describe('formulario general', () => {
  it('acepta lo que manda un formulario HTML y deja los vacíos como ausentes', () => {
    const r = formularioGeneral.parse({
      ...valida,
      whatsapp: '',
      utm_source: '',
      pagina: '/es/contacto',
    });
    expect(r).toMatchObject({ idioma: 'es', acepta: true, pagina: '/es/contacto' });
    expect(r.whatsapp).toBeUndefined();
    expect(r.utm_source).toBeUndefined();
  });

  it('acepta JSON con la autorización como booleano', () => {
    expect(solicitud.safeParse({ ...valida, acepta: true, idioma: 'en' }).success).toBe(true);
  });

  it('devuelve un código por campo', () => {
    expect(errores({ formulario: 'general' })).toEqual({
      nombre: 'requerido',
      email: 'requerido',
      mensaje: 'requerido',
      acepta: 'debe-aceptar',
    });
    expect(errores({ ...valida, email: 'ana@', nombre: 'A', mensaje: 'Hola' })).toEqual({
      email: 'invalido',
      nombre: 'muy-corto',
      mensaje: 'muy-corto',
    });
    expect(errores({ ...valida, acepta: undefined })).toEqual({ acepta: 'debe-aceptar' });
    expect(errores({ ...valida, mensaje: 'x'.repeat(5001) })).toEqual({ mensaje: 'muy-largo' });
  });

  it('valida WhatsApp, puerta, idioma y formulario', () => {
    expect(formularioGeneral.parse({ ...valida, whatsapp: '+57 300 123 4567' }).whatsapp).toBe(
      '+57 300 123 4567',
    );
    expect(errores({ ...valida, whatsapp: 'llámame' })).toEqual({ whatsapp: 'invalido' });
    expect(errores({ ...valida, puerta: 'Costos <script>' })).toEqual({ puerta: 'invalido' });
    expect(errores({ ...valida, idioma: 'fr' })).toEqual({ idioma: 'invalido' });
    expect(errores({ ...valida, formulario: 'otro' })).toEqual({ formulario: 'invalido' });
  });

  it('solo acepta rutas del propio sitio como página de origen', () => {
    expect(errores({ ...valida, pagina: 'https://otro.com' })).toEqual({ pagina: 'invalido' });
    expect(errores({ ...valida, pagina: '//otro.com/x' })).toEqual({ pagina: 'invalido' });
    expect(errores({ ...valida, pagina: '/\\otro.com' })).toEqual({ pagina: 'invalido' });
  });
});

describe('agenda de Consultoría', () => {
  const agenda = {
    formulario: 'consultoria',
    email: 'cto@ejemplo.com',
    puerta: 'optimizar-costos',
    nubes: 'AWS, Google Cloud',
    gasto: 'US$8.000',
    acepta: 'on',
  };

  it('no pide nombre ni mensaje; nubes y gasto son opcionales', () => {
    expect(solicitud.safeParse(agenda).success).toBe(true);
    expect(solicitud.safeParse({ ...agenda, nubes: '', gasto: '' }).success).toBe(true);
  });

  it('exige el tema, el correo y la autorización', () => {
    expect(errores({ formulario: 'consultoria' })).toEqual({
      email: 'requerido',
      puerta: 'requerido',
      acepta: 'debe-aceptar',
    });
    expect(errores({ ...agenda, gasto: 'x'.repeat(61) })).toEqual({ gasto: 'muy-largo' });
  });
});
