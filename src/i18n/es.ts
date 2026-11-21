export const es = {
  meta: {
    siteName: 'Luis Reyes Vanegas',
    ogImageAlt:
      'Luis Carlos Reyes Vanegas, arquitecto de soluciones cloud e IA, junto al monograma LR',
  },
  a11y: {
    skipToContent: 'Saltar al contenido',
    mainNav: 'Navegación principal',
    footerNav: 'Enlaces del pie de página',
    languageNav: 'Idioma',
    menu: 'Menú',
    languageUnavailable: 'próximamente',
  },
  nav: {
    consultoria: 'Consultoría',
    productos: 'Productos',
    casos: 'Casos',
    eventos: 'Eventos',
    sobreMi: 'Sobre mí',
  },
  header: {
    cta: 'Agendar sesión',
    // El botón cambia en algunas páginas (componentes globales del prototipo).
    charlas: 'Invitarme a hablar',
    prensa: 'Pedir una entrevista',
    programas: 'Evaluar mi caso',
  },
  footer: {
    linkedin: 'LinkedIn',
    charlas: 'Charlas',
    prensa: 'Prensa',
    contacto: 'Contacto',
    evolutecc: 'Desarrollo a la medida: EvolutecC',
    legal: 'Privacidad y términos',
    copyright: '© 2026 Luis Reyes Vanegas',
  },
  galeria: {
    ver: (n: number) => `Ver ${n} fotos`,
    verDe: (n: number, titulo: string) => `Ver las ${n} fotos de ${titulo}`,
    cerrar: 'Cerrar',
    anterior: 'Foto anterior',
    siguiente: 'Foto siguiente',
    /** {i} y {n} se reemplazan en el navegador. */
    posicion: '{i} de {n}',
  },
  historia: {
    nivel: (n: number) => `Nivel ${n}`,
    completado: 'Completado',
    impacto: 'Impacto',
    recorridoCompleto: 'Recorrido completo',
    edad: (n: number) => `${n} años`,
    resumen: (r: { anios: number; hitos: number; desde: number; hasta: number }) =>
      `${r.anios} años · ${r.hitos} hitos · ${r.desde}–${r.hasta}`,
    enJuego: 'En juego',
    bloqueado: 'Bloqueado',
    deHitos: (total: number) => `de ${total} hitos`,
    nivelCompletado: (n: number) => `Nivel ${n} completado`,
    siguiente: (nombre: string) => `Siguiente: ${nombre}`,
    desbloqueado: (nombre: string) => `Desbloqueado: ${nombre}`,
    capitulos: 'Capítulos de la historia',
  },
  certificaciones: {
    verificar: 'Verificar',
    conteo: (total: number, enProceso: number) => `de ${total} obtenidas · ${enProceso} en proceso`,
    filtros: {
      etiqueta: 'Filtrar insignias',
      todas: 'Todas',
      obtenidas: 'Obtenidas',
      enProceso: 'En proceso',
    },
    estado: {
      obtenida: 'Obtenida',
      'en-proceso': 'En proceso',
      'en-curso': 'En curso',
      'en-tramite': 'En trámite',
    },
  },
  // Formularios con JavaScript: errores por campo y estados. Aprobados por Luis el 20 nov 2026.
  formulario: {
    enviando: 'Enviando…',
    revisa: 'Revisa los campos marcados.',
    demasiadas: 'Ya recibí varios mensajes desde este correo. Vuelve a intentarlo en una hora.',
    verificacion: 'No pudimos verificar el envío. Vuelve a intentarlo en unos segundos.',
    errores: {
      requerido: 'Completa este campo.',
      invalido: 'Revisa este dato.',
      emailInvalido: 'Escribe un correo válido, como nombre@empresa.com.',
      muyCorto: 'Escribe al menos {min} caracteres.',
      muyLargo: 'Es demasiado largo.',
      debeAceptar: 'Para enviar el mensaje, acepta la política de privacidad.',
    },
  },
  contacto: {
    opciones: 'Opciones de contacto',
  },
  legal: {
    bajada:
      'Cómo trato tus datos personales y las reglas de uso de este sitio. Vigente desde {vigencia}.',
    navegacion: 'Documentos legales',
    // Solo en local, mientras falte el dato (nunca se publica).
    pendiente: 'pendiente',
  },
  logros: {
    // Pieza 02: rótulo de la tarjeta antes de desbloquearse.
    bloqueado: 'Bloqueado',
  },
  testimonios: {
    verFuente: 'Ver en LinkedIn',
  },
  pages: {
    // Posicionamiento del documento madre (sección 2).
    home: {
      title: 'Arquitecto de soluciones cloud e IA',
    },
    contacto: {
      title: 'Contacto',
    },
    consultoria: {
      title: 'Consultoría en arquitectura cloud e IA',
    },
    adopcionIa: {
      title: 'Adopción de IA con Claude',
    },
    casos: {
      title: 'Casos de éxito',
    },
    eventos: {
      title: 'Eventos y charlas',
    },
    speaker: {
      title: 'Charlas',
    },
    prensa: {
      title: 'Kit de prensa',
    },
    cv: {
      title: 'CV · Arquitecto de soluciones cloud e IA',
    },
    programasAws: {
      title: 'AWS puede invertir en tu migración',
    },
    productos: {
      title: 'Productos · Trama AI',
    },
    sobreMi: {
      title: 'Sobre mí',
    },
  },
};

export type Dictionary = typeof es;
