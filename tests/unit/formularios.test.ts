import { describe, expect, it } from 'vitest';
import { erroresPorCampo, formularioGeneral, solicitud } from '../../src/lib/formularios/esquemas';
import {
  bandera,
  numeroValido,
  opcionesDePais,
  telefonoCompleto,
} from '../../src/lib/formularios/paises';

// Nombre, país y teléfono: los piden todos los formularios desde el 27 nov 2026.
const contacto = { nombre: 'Ana Pérez', pais: 'CO', telefono: '300 123 4567' };
const faltaContacto = { nombre: 'requerido', pais: 'requerido', telefono: 'requerido' };

const valida = {
  formulario: 'general',
  ...contacto,
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
      utm_source: '',
      pagina: '/es/contacto',
    });
    expect(r).toMatchObject({ idioma: 'es', acepta: true, pagina: '/es/contacto', pais: 'CO' });
    expect(r.utm_source).toBeUndefined();
  });

  it('acepta JSON con la autorización como booleano', () => {
    expect(solicitud.safeParse({ ...valida, acepta: true, idioma: 'en' }).success).toBe(true);
  });

  it('devuelve un código por campo', () => {
    expect(errores({ formulario: 'general' })).toEqual({
      ...faltaContacto,
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

  it('valida teléfono, país, puerta, idioma y formulario', () => {
    expect(formularioGeneral.parse({ ...valida, telefono: '+57 300 123 4567' }).telefono).toBe(
      '+57 300 123 4567',
    );
    expect(errores({ ...valida, telefono: 'llámame' })).toEqual({ telefono: 'invalido' });
    expect(errores({ ...valida, telefono: '12' })).toEqual({ telefono: 'invalido' });
    expect(errores({ ...valida, pais: 'XX' })).toEqual({ pais: 'invalido' });
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
    ...contacto,
    email: 'cto@ejemplo.com',
    puerta: 'optimizar-costos',
    nubes: 'AWS, Google Cloud',
    gasto: 'US$8.000',
    acepta: 'on',
  };

  it('no pide mensaje; nubes y gasto son opcionales', () => {
    expect(solicitud.safeParse(agenda).success).toBe(true);
    expect(solicitud.safeParse({ ...agenda, nubes: '', gasto: '' }).success).toBe(true);
  });

  it('exige el tema, nombre, correo, teléfono y la autorización', () => {
    expect(errores({ formulario: 'consultoria' })).toEqual({
      ...faltaContacto,
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
    ...contacto,
    evento: 'DevFest Barranquilla',
    fecha: '2026-11-28',
    ciudad: 'Barranquilla',
    email: 'organizacion@ejemplo.com',
    acepta: 'on',
  };

  it('pide evento, fecha, ciudad, contacto y autorización; audiencia y presupuesto opcionales', () => {
    expect(solicitud.safeParse({ ...invitacion, audiencia: '', presupuesto: '' }).success).toBe(
      true,
    );
    expect(errores({ formulario: 'speaker' })).toEqual({
      ...faltaContacto,
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
    ...contacto,
    nombre: 'Laura Gómez',
    medio: 'El Heraldo',
    necesidad: 'entrevista',
    email: 'laura@ejemplo.com',
    acepta: 'on',
  };

  it('pide nombre, medio, necesidad, correo y autorización; cierre y detalles son opcionales', () => {
    expect(solicitud.safeParse({ ...prensa, cierre: '', mensaje: '' }).success).toBe(true);
    expect(errores({ formulario: 'prensa' })).toEqual({
      ...faltaContacto,
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
    ...contacto,
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
      ...faltaContacto,
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
  it('pide tipo de inversionista, nombre, correo, teléfono con su país y autorización', () => {
    expect(
      solicitud.safeParse({
        formulario: 'productos',
        inversionista: 'angel',
        ...contacto,
        email: 'inversion@ejemplo.com',
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
  it('pide el producto, nombre, empresa, correo, teléfono y autorización; mensaje opcional', () => {
    expect(
      solicitud.safeParse({
        formulario: 'demo',
        producto: 'ofilix',
        ...contacto,
        nombre: 'Carlos Gómez',
        empresa: 'Textiles del Caribe',
        email: 'carlos@ejemplo.com',
        acepta: 'on',
      }).success,
    ).toBe(true);
    expect(errores({ formulario: 'demo', producto: 'otra-cosa' })).toEqual({
      producto: 'invalido',
      ...faltaContacto,
      empresa: 'requerido',
      email: 'requerido',
      acepta: 'debe-aceptar',
    });
  });
});

describe('teléfono con indicativo', () => {
  it('acepta el número como lo escribe la persona, con o sin su propio +indicativo', () => {
    expect(numeroValido('300 123 4567')).toBe(true);
    expect(numeroValido('(601) 555-0100')).toBe(true);
    expect(numeroValido('+57 300 123 4567')).toBe(true);
    expect(numeroValido('123')).toBe(false);
    expect(numeroValido('+57 3')).toBe(false);
    expect(numeroValido('llámame')).toBe(false);
    expect(numeroValido('1'.repeat(15))).toBe(false);
  });

  it('guarda el número con el indicativo del país, salvo que ya traiga el suyo', () => {
    expect(telefonoCompleto('CO', ' 300  123 4567 ')).toBe('+57 300 123 4567');
    expect(telefonoCompleto('US', '(415) 555-0100')).toBe('+1 (415) 555-0100');
    expect(telefonoCompleto('CO', '+34 600 000 000')).toBe('+34 600 000 000');
  });

  it('nombra los países en el idioma de la página, en orden alfabético', () => {
    const es = opcionesDePais('es');
    expect(es.find((o) => o.valor === 'CO')).toMatchObject({
      nombre: 'Colombia',
      indicativo: '57',
      bandera: bandera('CO'),
    });
    expect(opcionesDePais('en').find((o) => o.valor === 'DE')?.nombre).toBe('Germany');
    expect(opcionesDePais('pt').find((o) => o.valor === 'DE')?.nombre).toBe('Alemanha');
    const nombres = es.map((o) => o.nombre);
    expect(nombres).toEqual([...nombres].sort((a, b) => a.localeCompare(b, 'es')));
  });
});
