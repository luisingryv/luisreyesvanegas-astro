import type { Dictionary } from './es';

// Borrador en inglés (20 nov 2026), traducido del español a pedido de Luis. No se publica hasta
// que Luis apruebe los textos (CLAUDE.md); está completo para poder revisarlo entero.
export const en: Dictionary = {
  meta: {
    siteName: 'Luis Reyes Vanegas',
    ogImageAlt:
      'Luis Carlos Reyes Vanegas, cloud and AI solutions architect, next to the LR monogram',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNav: 'Main navigation',
    footerNav: 'Footer links',
    languageNav: 'Language',
    menu: 'Menu',
    languageUnavailable: 'coming soon',
  },
  nav: {
    consultoria: 'Consulting',
    productos: 'Products',
    casos: 'Case studies',
    eventos: 'Events',
    sobreMi: 'About me',
    noticias: 'News',
  },
  header: {
    cta: 'Book a session',
    charlas: 'Invite me to speak',
    prensa: 'Request an interview',
    programas: 'Evaluate my case',
  },
  footer: {
    linkedin: 'LinkedIn',
    charlas: 'Talks',
    prensa: 'Press',
    contacto: 'Contact',
    evolutecc: 'Custom development: EvolutecC',
    legal: 'Privacy and terms',
    copyright: '© 2026 Luis Reyes Vanegas',
  },
  noticias: {
    eyebrow: 'News',
    titulo: "What I'm reading about cloud and AI",
    bajada:
      'Tech news with my take: what changes and what it means for companies building in the cloud.',
    verTodas: 'See all news',
    leer: (titulo: string) => `Read: ${titulo}`,
    fuente: 'Source',
    leerFuente: (medio: string) => `Read the original story on ${medio}`,
    relacionada: 'If this hits close to home',
    volver: 'All news',
    borrador: 'Draft',
    vacio: "I'll soon publish here the news I'm following.",
    paginas: {
      optimizarCostos: 'Cut cloud costs',
      escalarInfraestructura: 'Scale your infrastructure',
      sesionArquitectura: 'Architecture session',
      adopcionIa: 'AI adoption with Claude',
      programasAws: 'AWS MAP program',
      productos: 'Trama AI',
    },
  },
  galeria: {
    ver: (n: number) => `See ${n} photos`,
    verDe: (n: number, titulo: string) => `See all ${n} photos from ${titulo}`,
    cerrar: 'Close',
    anterior: 'Previous photo',
    siguiente: 'Next photo',
    posicion: '{i} of {n}',
  },
  historia: {
    nivel: (n: number) => `Level ${n}`,
    completado: 'Completed',
    impacto: 'Impact',
    recorridoCompleto: 'Full journey',
    edad: (n: number) => `Age ${n}`,
    resumen: (r: { anios: number; hitos: number; desde: number; hasta: number }) =>
      `${r.anios} years · ${r.hitos} milestones · ${r.desde}–${r.hasta}`,
    enJuego: 'In play',
    bloqueado: 'Locked',
    deHitos: (total: number) => `of ${total} milestones`,
    nivelCompletado: (n: number) => `Level ${n} completed`,
    siguiente: (nombre: string) => `Next: ${nombre}`,
    desbloqueado: (nombre: string) => `Unlocked: ${nombre}`,
    capitulos: 'Story chapters',
  },
  certificaciones: {
    verificar: 'Verify',
    conteo: (total: number, enProceso: number) => `of ${total} earned · ${enProceso} in progress`,
    filtros: {
      etiqueta: 'Filter badges',
      todas: 'All',
      obtenidas: 'Earned',
      enProceso: 'In progress',
    },
    estado: {
      obtenida: 'Earned',
      'en-proceso': 'In progress',
      'en-curso': 'Ongoing',
      'en-tramite': 'Pending',
    },
  },
  formulario: {
    enviando: 'Sending…',
    revisa: 'Check the highlighted fields.',
    demasiadas: 'I already got several messages from this email. Try again in an hour.',
    verificacion: "We couldn't verify the submission. Try again in a few seconds.",
    errores: {
      requerido: 'Fill in this field.',
      invalido: 'Check this entry.',
      emailInvalido: 'Enter a valid email, like name@company.com.',
      muyCorto: 'Write at least {min} characters.',
      muyLargo: 'It is too long.',
      debeAceptar: 'To send the message, accept the privacy policy.',
    },
  },
  contacto: {
    opciones: 'Contact options',
  },
  legal: {
    bajada:
      'How I handle your personal data and the rules for using this site. Effective {vigencia}.',
    navegacion: 'Legal documents',
    pendiente: 'pending',
  },
  logros: {
    bloqueado: 'Locked',
  },
  testimonios: {
    verFuente: 'See on LinkedIn',
  },
  pages: {
    home: {
      title: 'Cloud and AI solutions architect',
    },
    contacto: {
      title: 'Contact',
    },
    consultoria: {
      title: 'Cloud and AI architecture consulting',
    },
    adopcionIa: {
      title: 'AI adoption with Claude',
    },
    casos: {
      title: 'Case studies',
    },
    eventos: {
      title: 'Events and talks',
    },
    speaker: {
      title: 'Talks',
    },
    prensa: {
      title: 'Press kit',
    },
    cv: {
      title: 'CV · Cloud and AI solutions architect',
    },
    programasAws: {
      title: 'AWS can invest in your migration',
    },
    productos: {
      title: 'Products · Trama AI',
    },
    sobreMi: {
      title: 'About me',
    },
    noticias: {
      title: 'Cloud and AI news',
    },
  },
};
