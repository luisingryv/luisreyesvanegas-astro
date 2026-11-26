// Herramientas WebMCP (26 nov 2026): los agentes de IA que trabajan dentro del navegador
// (navigator.modelContext) pueden leer el Home en Markdown y abrir una página del sitio. Ninguna
// envía datos ni formularios. Sin la API (casi todos los navegadores hoy), no hace nada.

interface ResultadoHerramienta {
  content: { type: 'text'; text: string }[];
}

interface Herramienta {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (entrada: Record<string, unknown>) => Promise<ResultadoHerramienta>;
}

interface ModelContext {
  registerTool?: (herramienta: Herramienta) => unknown;
  provideContext?: (contexto: { tools: Herramienta[] }) => unknown;
}

interface DatosAgentes {
  idioma: string;
  idiomas: string[];
  paginas: Record<string, string>;
}

const texto = (t: string): ResultadoHerramienta => ({ content: [{ type: 'text', text: t }] });

export function herramientas(datos: DatosAgentes): Herramienta[] {
  return [
    {
      name: 'leer_inicio',
      description:
        'Devuelve en Markdown el Home de Luis Carlos Reyes Vanegas, arquitecto de soluciones ' +
        'cloud e IA: consultoría, productos, logros, trayectoria, charlas, casos y contacto.',
      inputSchema: {
        type: 'object',
        properties: {
          idioma: {
            type: 'string',
            enum: datos.idiomas,
            description: 'Idioma del texto. Por defecto, el de la página abierta.',
          },
        },
      },
      annotations: { readOnlyHint: true },
      async execute({ idioma }) {
        const elegido = datos.idiomas.includes(String(idioma)) ? String(idioma) : datos.idioma;
        const respuesta = await fetch(`/${elegido}.md`, { headers: { Accept: 'text/markdown' } });
        return texto(await respuesta.text());
      },
    },
    {
      name: 'abrir_pagina',
      description:
        'Abre una página del sitio en esta pestaña. "sesionArquitectura" es la sesión de ' +
        'arquitectura que se agenda; "contacto", el formulario para escribirle a Luis.',
      inputSchema: {
        type: 'object',
        properties: {
          pagina: { type: 'string', enum: Object.keys(datos.paginas) },
        },
        required: ['pagina'],
      },
      async execute({ pagina }) {
        const ruta = datos.paginas[String(pagina)];
        if (!ruta) return texto(`No existe la página "${String(pagina)}".`);
        const destino = new URL(ruta, location.origin).toString();
        // Responde antes de salir de la página.
        setTimeout(() => location.assign(destino), 50);
        return texto(`Abriendo ${destino}`);
      },
    },
  ];
}

export function registrarHerramientas(): void {
  const contexto = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
  const fuente = document.getElementById('datos-agentes')?.textContent;
  if (!contexto || !fuente) return;
  const lista = herramientas(JSON.parse(fuente) as DatosAgentes);
  try {
    if (contexto.registerTool) {
      for (const herramienta of lista) contexto.registerTool(herramienta);
    } else {
      contexto.provideContext?.({ tools: lista });
    }
  } catch (error) {
    // La API es experimental: si cambia, el sitio sigue funcionando igual.
    console.warn('WebMCP: no se pudieron registrar las herramientas.', error);
  }
}
