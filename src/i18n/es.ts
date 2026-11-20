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
  testimonios: {
    verFuente: 'Ver en LinkedIn',
  },
  pages: {
    // Posicionamiento del documento madre (sección 2).
    home: {
      title: 'Arquitecto de soluciones cloud e IA',
    },
    sobreMi: {
      title: 'Sobre mí',
    },
  },
};

export type Dictionary = typeof es;
