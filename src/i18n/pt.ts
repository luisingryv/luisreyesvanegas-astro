import type { Dictionary } from './es';

// Borrador en portugués de Brasil (20 nov 2026), traducido del español a pedido de Luis. No se
// publica hasta que Luis apruebe los textos (CLAUDE.md); está completo para poder revisarlo entero.
export const pt: Dictionary = {
  meta: {
    siteName: 'Luis Reyes Vanegas',
    ogImageAlt:
      'Luis Carlos Reyes Vanegas, arquiteto de soluções cloud e IA, ao lado do monograma LR',
  },
  a11y: {
    skipToContent: 'Pular para o conteúdo',
    mainNav: 'Navegação principal',
    footerNav: 'Links do rodapé',
    languageNav: 'Idioma',
    menu: 'Menu',
    languageUnavailable: 'em breve',
  },
  nav: {
    consultoria: 'Consultoria',
    productos: 'Produtos',
    casos: 'Casos',
    eventos: 'Eventos',
    sobreMi: 'Sobre mim',
  },
  header: {
    cta: 'Agendar sessão',
    charlas: 'Convide-me para falar',
    prensa: 'Pedir uma entrevista',
    programas: 'Avaliar meu caso',
  },
  footer: {
    linkedin: 'LinkedIn',
    charlas: 'Palestras',
    prensa: 'Imprensa',
    contacto: 'Contato',
    evolutecc: 'Desenvolvimento sob medida: EvolutecC',
    legal: 'Privacidade e termos',
    copyright: '© 2026 Luis Reyes Vanegas',
  },
  galeria: {
    ver: (n: number) => `Ver ${n} fotos`,
    verDe: (n: number, titulo: string) => `Ver as ${n} fotos de ${titulo}`,
    cerrar: 'Fechar',
    anterior: 'Foto anterior',
    siguiente: 'Próxima foto',
    posicion: '{i} de {n}',
  },
  historia: {
    nivel: (n: number) => `Nível ${n}`,
    completado: 'Concluído',
    impacto: 'Impacto',
    recorridoCompleto: 'Trajetória completa',
    edad: (n: number) => `${n} anos`,
    resumen: (r: { anios: number; hitos: number; desde: number; hasta: number }) =>
      `${r.anios} anos · ${r.hitos} marcos · ${r.desde}–${r.hasta}`,
    enJuego: 'Em jogo',
    bloqueado: 'Bloqueado',
    deHitos: (total: number) => `de ${total} marcos`,
    nivelCompletado: (n: number) => `Nível ${n} concluído`,
    siguiente: (nombre: string) => `Próximo: ${nombre}`,
    desbloqueado: (nombre: string) => `Desbloqueado: ${nombre}`,
    capitulos: 'Capítulos da história',
  },
  certificaciones: {
    verificar: 'Verificar',
    conteo: (total: number, enProceso: number) => `de ${total} obtidas · ${enProceso} em andamento`,
    filtros: {
      etiqueta: 'Filtrar insígnias',
      todas: 'Todas',
      obtenidas: 'Obtidas',
      enProceso: 'Em andamento',
    },
    estado: {
      obtenida: 'Obtida',
      'en-proceso': 'Em andamento',
      'en-curso': 'Em curso',
      'en-tramite': 'Em trâmite',
    },
  },
  formulario: {
    enviando: 'Enviando…',
    revisa: 'Revise os campos marcados.',
    demasiadas: 'Já recebi várias mensagens deste e-mail. Tente novamente em uma hora.',
    verificacion: 'Não conseguimos verificar o envio. Tente novamente em alguns segundos.',
    errores: {
      requerido: 'Preencha este campo.',
      invalido: 'Revise este dado.',
      emailInvalido: 'Escreva um e-mail válido, como nome@empresa.com.',
      muyCorto: 'Escreva pelo menos {min} caracteres.',
      muyLargo: 'É longo demais.',
      debeAceptar: 'Para enviar a mensagem, aceite a política de privacidade.',
    },
  },
  contacto: {
    opciones: 'Opções de contato',
  },
  legal: {
    bajada:
      'Como trato seus dados pessoais e as regras de uso deste site. Em vigor desde {vigencia}.',
    navegacion: 'Documentos legais',
    pendiente: 'pendente',
  },
  logros: {
    bloqueado: 'Bloqueado',
  },
  testimonios: {
    verFuente: 'Ver no LinkedIn',
  },
  pages: {
    home: {
      title: 'Arquiteto de soluções cloud e IA',
    },
    contacto: {
      title: 'Contato',
    },
    consultoria: {
      title: 'Consultoria em arquitetura cloud e IA',
    },
    adopcionIa: {
      title: 'Adoção de IA com Claude',
    },
    casos: {
      title: 'Casos de sucesso',
    },
    eventos: {
      title: 'Eventos e palestras',
    },
    speaker: {
      title: 'Palestras',
    },
    prensa: {
      title: 'Kit de imprensa',
    },
    cv: {
      title: 'CV · Arquiteto de soluções cloud e IA',
    },
    programasAws: {
      title: 'A AWS pode investir na sua migração',
    },
    productos: {
      title: 'Produtos · Trama AI',
    },
    sobreMi: {
      title: 'Sobre mim',
    },
  },
};
