# Referencia · CV (`/es/cv`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/cv.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/04-CV.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: claro (white)
- Motion: Pieza 12 (competencias con nivel de 1 a 5): barras que se llenan por grupo, leyenda que resalta por nivel y filtros por grupo. Sobria: se lee e imprime igual sin animación. El resto, solo apariciones suaves.

## Notas para construirla
- Hero rediagramado el 19 nov 2026: retrato 4:5 a todo el ancho de la columna derecha; los 4 datos (Modalidad, Nubes, Idiomas, Destacado) bajo los botones, en dos columnas con línea fina superior, sin caja.
- Niveles de competencias: `../Boveda/03_Contenido/Textos/Competencias del CV.md` (29 competencias).
- Los PDF del CV (ES y EN) están pendientes; investigación de buenas prácticas en T-219.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Luis Carlos Reyes Vanegas
_ancla `#descargar`_
- Eyebrow: SOLUTIONS ARCHITECT · HEAD OF CLOUD & AI
- **H1:** Luis Carlos Reyes Vanegas
- Texto: Arquitecto de soluciones cloud e IA con 13 años llevando sistemas a producción. CEO de Trama AI y cofundador y CTO de EvolutecC. Abierto a roles remotos de arquitectura cloud e IA.
- Enlace/botón: "Descargar CV (ES)" → `#descargar`
- Enlace/botón: "Download CV (EN)" → `#descargar`
- Enlace/botón: "Agendar entrevista" → `#entrevista`
- Enlace/botón: "LinkedIn ↗" → `https://www.linkedin.com/in/luis-carlos-reyes-vanegas-803306170/`
- Eyebrow: MODALIDAD
- dd: Remoto · UTC-5 (Colombia)
- Eyebrow: NUBES
- dd: AWS · Google Cloud · Azure
- Eyebrow: IDIOMAS
- dd: Español nativo · Inglés C1 (certificación en trámite) · Portugués en aprendizaje
- Eyebrow: DESTACADO
- Enlace/botón: "fuente" → `https://gxp.moonshots.com/`
- Imagen: alt "Retrato de Luis Carlos Reyes Vanegas" · fuente `Archivos/Fotos/01_Retratos/retrato_sin-fecha_oficina-camisa-blanca-cv_luis-reyes-vanegas_001.jpg`

### 2. Logros con cifra y fuente
- **H2:** Logros con cifra y fuente
- Lista repetida `{{logros}}` (ver datos al final) con el patrón:
    - li: {{l.metric}} {{l.desc}} {{l.who}}

### 3. Experiencia
_fondo `#f5f8fd`_
- **H2:** Experiencia
- Lista repetida `{{experiencia}}` (ver datos al final) con el patrón:
    - span: {{e.yrs}}
    - b: {{e.role}}
    - span: {{e.org}}
    - span: {{e.desc}}
- Enlace/botón: "La historia completa está en Sobre mí →" → `SobreMi.dc.html`

### 4. Stack y competencias
- **H2:** Stack y competencias
- Lista repetida `{{stack}}` (ver datos al final) con el patrón:
    - span: {{s.grupo}}
    - span: {{s.items}}
- **H2:** Formación y certificaciones
- Lista repetida `{{certs}}` (ver datos al final) con el patrón:
    - li: {{c.name}} {{c.emisor}} {{c.fecha}}

### 5. Charlas y comunidad
_fondo `#f5f8fd`_
- **H2:** Charlas y comunidad
- Texto: Speaker en GDG Summit Latam (Lima), DevFest Ecuador (Quito), TechCaribe y la comunidad de Google Developer Groups en Barranquilla.
- Enlace/botón: "Ver eventos y charlas →" → `Eventos.dc.html`
- **H2:** Recomendaciones
- blockquote: [Recomendación publicada en LinkedIn, copiada tal cual y con permiso]
- figcaption: [Nombre] · [Cargo · Empresa]

### 6. ¿Hablamos del rol?
_ancla `#entrevista` · fondo `#0055c2`_
- **H2:** ¿Hablamos del rol?
- Texto: Elige un espacio en mi agenda o escríbeme por LinkedIn.
- Enlace/botón: "Agendar entrevista" → `#entrevista`
- Enlace/botón: "LinkedIn ↗" → `https://www.linkedin.com/in/luis-carlos-reyes-vanegas-803306170/`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      logros: [
        { metric: '−60%', desc: 'En la factura de Google Cloud de una red nacional de peajes: de US$10.000 a US$4.000 al mes.', who: 'UTPN / KMA · 2025' },
        { metric: 'US$62.000', desc: 'En créditos de AWS por el programa MAP, con el aliado Nexa Connect, y 10 usuarios de Kiro con US$8.000 en créditos. El cliente logró ISO 27001 y SOC 2 con mi acompañamiento como Cloud Expert.', who: 'Glasslake · 2025–2026' },
        { metric: '≈70.000', desc: 'Pedidos al mes tras la integración con iFood, frente a unos 2.400 antes, como Head of Product.', who: 'Mandaos / Netivery' },
        { metric: '10+ años', desc: 'En producción del SIGC, el sistema que migré de escritorio a web. Más de 300 usuarios.', who: 'Clínica del Caribe' },
        { metric: '4 días', desc: 'Para poner en línea un e-commerce conectado a SAP Business One.', who: 'Ara · 2020' },
        { metric: '400+', desc: 'Proyectos de software entregados con mi equipo como cofundador y CTO.', who: 'EvolutecC · 2020–hoy' }
      ],
      experiencia: [
        { yrs: 'Actual', role: 'CEO', org: 'Trama AI', desc: 'Agentes de IA que operan el inventario de empresas con inventario físico. Ganador de categoría en el Build with Gemini XPRIZE 2026.' },
        { yrs: '2025–hoy', role: 'Cloud Expert y administrador de la cuenta de AWS (consultor)', org: 'Glasslake', desc: 'Startup de SAP de San Francisco en pleno crecimiento: Organizations e IAM Identity Center, entornos multitenant, Transit Gateway, VPN y endpoints hacia sus clientes, seguridad con Amazon Inspector y monitoreo, costos y soporte, y evidencia técnica para SOC 2 e ISO 27001.' },
        { yrs: '2025–hoy', role: 'Consultor de arquitectura cloud', org: 'UTPN / KMA', desc: 'Auditoría y rediseño de Google Cloud para una red nacional de peajes; hoy, soporte de largo plazo.' },
        { yrs: '2020–hoy', role: 'Cofundador y CTO', org: 'EvolutecC', desc: 'Producto, tecnología y arquitectura de una empresa de desarrollo de software. Como aliado de TIVIT (2023) diseñé soluciones en la nube para la Fuerza Aérea Colombiana, el DNP y el SISBÉN y Bancolombia.' },
        { yrs: '2018–2020', role: 'Desarrollador web → Head of Product', org: 'Mandaos / Netivery', desc: 'Startup de última milla. Equipo de producto de 6 personas, API pública de integraciones e integración con iFood.' },
        { yrs: '2016', role: 'Desarrollador', org: 'Clínica del Caribe', desc: 'Lideré la migración del SIGC de escritorio (VB.NET) a web (ASP.NET).' },
        { yrs: '2015', role: 'Desarrollador independiente', org: 'Sector hotelero', desc: 'Sitios web para hoteles con suscripción mensual: hosting, dominios, DNS y soporte.' },
        { yrs: '2013', role: 'Fundador', org: 'R&V Technology', desc: 'Reparación de computadores y desarrollo web.' }
      ],
      stack: [
        { grupo: 'NUBE', items: 'AWS, Google Cloud, Azure · FinOps · Terraform · programas de AWS (MAP y créditos)' },
        { grupo: 'IA', items: 'Adopción de IA con Claude (framework 4D) · arquitectura de agentes' },
        { grupo: 'DESARROLLO', items: '.NET, PHP, Node.js, Angular, React, Next.js, Ionic · Drupal, WordPress' },
        { grupo: 'MÉTODO Y LIDERAZGO', items: 'Scrum, Kanban · liderazgo de equipos de producto y desarrollo' }
      ],
      certs: [
        { name: 'AI Fluency for small businesses', emisor: 'Anthropic · Claude Academy', fecha: 'oct 2026' },
        { name: 'Claude 101', emisor: 'Anthropic · Claude Academy', fecha: 'oct 2026' },
        { name: 'Introduction to Claude Cowork', emisor: 'Anthropic · Claude Academy', fecha: 'oct 2026' },
        { name: 'Certificación Internacional en Liderazgo Transformacional', emisor: 'Naranjo Consulting & Coaching', fecha: 'jul 2025' },
        { name: 'Escuela Avanzada de Liderazgo', emisor: 'Naranjo Consulting & Coaching', fecha: 'jul 2025' },
        { name: 'Escuela Básica de Liderazgo', emisor: 'Naranjo Consulting & Coaching', fecha: 'feb 2025' },
        { name: 'Certificación Internacional en Comunicación y Oratoria', emisor: 'Naranjo Consulting & Coaching', fecha: 'nov 2025' },
        { name: 'Coaching Ejecutivo y de Equipos · Coaching Personal', emisor: 'Naranjo Consulting & Coaching', fecha: 'En proceso' },
        { name: 'Certificaciones de arquitectura cloud', emisor: 'AWS · Google Cloud', fecha: 'En curso' },
        { name: 'Tecnólogo en Análisis y Desarrollo de Sistemas de Información', emisor: 'SENA', fecha: '[año]' }
      ]
    };
  }
}
```

## Imágenes de esta página

| En el prototipo | Original |
|---|---|
| `/_blob/67b71cd0…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color.svg (logo horizontal para fondo claro)` |
| `/_blob/ac63bc5e…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg (logo horizontal para fondo oscuro)` |
| `/_blob/b06b9617…` | `Archivos/Fotos/01_Retratos/retrato_sin-fecha_oficina-camisa-blanca-cv_luis-reyes-vanegas_001.jpg` |

Cópialas a `src/assets/` con su nombre y optimízalas con `astro:assets` (AVIF/WebP, `srcset`). Las fotos de eventos van en PhotoCard 4:3 sin recorte (fondo desenfocado detrás, ver `CLAUDE.md`). El encuadre (`object-position`) de cada foto está en los datos.

## Pendientes detectados en el prototipo

- [Nombre]
- [Cargo · Empresa]
