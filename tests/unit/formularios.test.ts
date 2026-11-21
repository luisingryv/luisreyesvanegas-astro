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

describe('invitación a una charla', () => {
  const invitacion = {
    formulario: 'speaker',
    evento: 'DevFest Barranquilla',
    fecha: '2026-11-28',
    ciudad: 'Barranquilla',
    email: 'organizacion@ejemplo.com',
    acepta: 'on',
  };

  it('pide evento, fecha, ciudad, correo y autorización; audiencia y presupuesto son opcionales', () => {
    expect(solicitud.safeParse({ ...invitacion, audiencia: '', presupuesto: '' }).success).toBe(
      true,
    );
    expect(errores({ formulario: 'speaker' })).toEqual({
      evento: 'requerido',
      fecha: 'requerido',
      ciudad: 'requerido',
      email: 'requerido',
      acepta: 'debe-aceptar',
    });
  });

  it('valida la fecha y el presupuesto', () => {
    expect(errores({ ...invitacion, fecha: '28/11/2026' })).toEqual({ fecha: 'invalido' });
    expect(errores({ ...invitacion, presupuesto: 'mucho' })).toEqual({ presupuesto: 'invalido' });
    expect(solicitud.safeParse({ ...invitacion, presupuesto: 'comunidad' }).success).toBe(true);
  });
});

describe('contacto de prensa', () => {
  const prensa = {
    formulario: 'prensa',
    nombre: 'Laura Gómez',
    medio: 'El Heraldo',
    necesidad: 'entrevista',
    email: 'laura@ejemplo.com',
    acepta: 'on',
  };

  it('pide nombre, medio, necesidad, correo y autorización; cierre y detalles son opcionales', () => {
    expect(solicitud.safeParse({ ...prensa, cierre: '', mensaje: '' }).success).toBe(true);
    expect(errores({ formulario: 'prensa' })).toEqual({
      nombre: 'requerido',
      medio: 'requerido',
      necesidad: 'requerido',
      email: 'requerido',
      acepta: 'debe-aceptar',
    });
  });

  it('valida la necesidad y la fecha de cierre', () => {
    expect(errores({ ...prensa, necesidad: 'todo' })).toEqual({ necesidad: 'invalido' });
    expect(errores({ ...prensa, cierre: 'mañana' })).toEqual({ cierre: 'invalido' });
  });
});

describe('evaluación de Programas AWS', () => {
  const evaluacion = {
    formulario: 'programas-aws',
    tipoEmpresa: 'startup',
    infraestructura: 'google-cloud',
    consumo: '10000',
    plazo: '3-6',
    empresa: 'Acme, Colombia',
    email: 'cto@ejemplo.com',
    acepta: 'on',
  };

  it('acepta el consumo como texto del <select> y lo deja como número', () => {
    const r = solicitud.parse({ ...evaluacion, mensaje: '', decide: '' });
    expect(r).toMatchObject({ formulario: 'programas-aws', consumo: 10000 });
  });

  it('solo acepta las opciones del formulario', () => {
    expect(errores({ ...evaluacion, consumo: '12345' })).toEqual({ consumo: 'invalido' });
    expect(errores({ ...evaluacion, tipoEmpresa: 'gobierno' })).toEqual({
      tipoEmpresa: 'invalido',
    });
    expect(errores({ formulario: 'programas-aws' })).toEqual({
      tipoEmpresa: 'requerido',
      infraestructura: 'requerido',
      consumo: 'requerido',
      plazo: 'requerido',
      empresa: 'requerido',
      email: 'requerido',
      acepta: 'debe-aceptar',
    });
  });
});

describe('inversionistas de Trama', () => {
  it('pide tipo de inversionista, nombre, país, correo, teléfono y autorización', () => {
    expect(
      solicitud.safeParse({
        formulario: 'productos',
        inversionista: 'angel',
        nombre: 'Ana Pérez',
        pais: 'Colombia',
        email: 'inversion@ejemplo.com',
        telefono: '+57 300 123 4567',
        acepta: 'on',
      }).success,
    ).toBe(true);
    expect(errores({ formulario: 'productos', inversionista: 'banco', telefono: 'abc' })).toEqual({
      inversionista: 'invalido',
      nombre: 'requerido',
      pais: 'requerido',
      email: 'requerido',
      telefono: 'invalido',
      acepta: 'debe-aceptar',
    });
  });
});

describe('demo de productos', () => {
  it('pide el producto, nombre, empresa, correo y autorización; teléfono y mensaje opcionales', () => {
    expect(
      solicitud.safeParse({
        formulario: 'demo',
        producto: 'ofilix',
        nombre: 'Carlos Gómez',
        empresa: 'Textiles del Caribe',
        email: 'carlos@ejemplo.com',
        acepta: 'on',
      }).success,
    ).toBe(true);
    expect(errores({ formulario: 'demo', producto: 'otra-cosa' })).toEqual({
      producto: 'invalido',
      nombre: 'requerido',
      empresa: 'requerido',
      email: 'requerido',
      acepta: 'debe-aceptar',
    });
  });
});
