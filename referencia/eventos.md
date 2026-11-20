# Referencia · Eventos (`/es/eventos`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/eventos.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/06-EVENTOS-Y-BLOG.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1–2 · Tema: oscuro (night)
- Motion: Sin protagonista. Apariciones y hover en las tarjetas.

## Notas para construirla
- Hero: banner con transparencia que se funde con el fondo night. En móvil (≤720 px) el texto va abajo en un panel de vidrio (fondo night al 55 %, blur 16 px, borde blanco al 14 %, radio 24 px) y la foto se corre a `72% center`. Ver clases `.ev-hero*` en el HTML.
- Fuente única de eventos y charlas: `../Boveda/03_Contenido/Eventos-y-charlas/Charlas y eventos.md`. Eventos, Charlas, Home y Sobre mí leen la misma colección; no se duplican datos.
- Las fechas son las exactas de cada evento.
- El blog (`/blog`) no tiene prototipo: queda para después.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Dónde he hablado
- Imagen: alt "Luis Reyes hablando con micrófono en el escenario" · fuente `Archivos/Fotos/_proceso/web/banners/pieza_sin-fecha_banner-eventos_luis-reyes-vanegas_001.png (PNG con transparencia; versión web _web.webp al lado)`
- Eyebrow: EVENTOS Y CHARLAS
- **H1:** Dónde he hablado
- Texto: Charlas, talleres y paneles sobre nube, IA y comunidad. Si quieres que vaya a tu evento, cuéntamelo.
- Botón: "Próximos"
- Botón: "Pasados"

### 2. Próximos eventos
- span: Por ahora no tengo eventos anunciados.
- Enlace/botón: "¿Organizas uno? Invítame →" → `Speaker.dc.html#invitar`

### 3. Eventos pasados
- Lista repetida `{{eventos}}` (ver datos al final) con el patrón:
    - Bloque condicional `{{e.foto}}`:
        - Imagen: alt "{{e.alt}}" · fuente `{{e.foto}}`
    - Bloque condicional `{{e.sinFoto}}`:
        - **Espacio reservado:** Espacio para foto del evento — FOTO PENDIENTE · {{e.title}}
    - span: {{e.when}}
    - span: {{e.tipo}}
    - span: {{e.title}}
    - span: {{e.desc}}

### 4. Lo que estoy leyendo y pensando
_ancla `#noticias` · fondo `#ffffff`_
- Eyebrow: NOTICIAS
- **H2:** Lo que estoy leyendo y pensando
- Texto: Noticias de nube e IA con mi opinión sobre lo que significan para las empresas. Cada una enlaza a su fuente.
- Lista repetida `{{categorias}}` (ver datos al final) con el patrón:
    - Botón: "{{c.name}}"
- Lista repetida `{{noticias}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{n}} [Título de la noticia] [Mi opinión en una o dos líneas] Fuente: [medio]" → `#noticias`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    var on = { bg: '#0055c2', fg: '#ffffff' };
    var off = { bg: '#ffffff', fg: '#0055c2' };
    var fotos = {
      devfest: ['Archivos/Fotos/02_Escenario-y-charlas/2025-11-29_devfest-ecuador-2025/charla_2025-11-29_devfest-ecuador-2025_luis-reyes-vanegas_001.jpg', 'Luis Reyes con el equipo de DevFest Ecuador 2025 en la Universidad San Francisco de Quito', 'center 60%'],
      cursor: ['Archivos/Fotos/02_Escenario-y-charlas/2025-11-28_cursor-meetup-quito/evento_2025-11-28_cursor-meetup-quito_luis-reyes-vanegas_001.jpg', 'Asistentes al Cursor meetup en Quito', 'center 45%'],
      sena: ['Archivos/Fotos/02_Escenario-y-charlas/2025-11-11_sena-encuentro-tecnologia-innovacion/charla_2025-11-11_sena-encuentro-tecnologia-innovacion_luis-reyes-vanegas_001.jpg', 'Auditorio lleno en el Encuentro de Tecnología e Innovación del SENA, visto desde el escenario', 'center 50%'],
      techcaribeFest: ['Archivos/Fotos/02_Escenario-y-charlas/2025-09-20_techcaribe-fest-2025/charla_2025-09-20_techcaribe-fest-2025_luis-reyes-vanegas_001.jpg', 'Luis Reyes conversando con asistentes en TechCaribe Fest 2025', 'center 40%'],
      devlokos: ['Archivos/Fotos/02_Escenario-y-charlas/2025-09-02_devlokos-podcast/charla_2025-09-02_devlokos-podcast_luis-reyes-vanegas_001.jpg', 'Portada del episodio 62 del podcast DevLokos con Luis Reyes', 'center 30%'],
      gdgSummit: ['Archivos/Fotos/02_Escenario-y-charlas/2025-08-29_gdg-summit-latam-2025-lima/evento_2025-08-29_gdg-summit-latam-2025-lima_luis-reyes-vanegas_001.jpg', 'Luis Reyes con integrantes de GDG en el GDG Summit Latam 2025, Lima', 'center 35%'],
      fiveOne: ['Archivos/Fotos/02_Escenario-y-charlas/2025-06-20_five-one-labs-de-la-idea-al-producto/charla_2025-06-20_five-one-labs-de-la-idea-al-producto_luis-reyes-vanegas_001.jpg', 'Luis Reyes presentando en Five One Labs', 'center 55%'],
      camara: ['Archivos/Fotos/02_Escenario-y-charlas/2025-06-19_camara-de-comercio-ia-copilot/charla_2025-06-19_camara-de-comercio-ia-copilot_luis-reyes-vanegas_001.jpg', 'Luis Reyes hablando ante el público en la Cámara de Comercio de Barranquilla', 'center'],
      buildAI: ['Archivos/Fotos/02_Escenario-y-charlas/2025-05-05_gdg-build-with-ai-2025-barranqui-ia/evento_2025-05-05_gdg-build-with-ai-2025-barranqui-ia-entrevista-construyendo-con-ia_luis-reyes-vanegas_001.jpg', 'Cámara grabando una entrevista a Luis Reyes en GDG Build with AI 2025', 'center 50%'],
      baqjs2025: ['Archivos/Fotos/02_Escenario-y-charlas/2025-02-25_baqjs-infraestructura-fintech/charla_2025-02-25_baqjs-infraestructura-fintech_luis-reyes-vanegas_001.jpg', 'Luis Reyes en BAQ.JS con la presentación Infraestructura FinTech', 'center 35%'],
      techcaribeExpo: ['Archivos/Fotos/02_Escenario-y-charlas/2024-07-27_techcaribe-expo-2024-google-io-extended/charla_2024-07-27_techcaribe-expo-2024-google-io-extended-vertex-ai-cloud-run_luis-reyes-vanegas_001.jpg', 'Luis Reyes junto a la pantalla de su charla Crea aplicaciones con Vertex AI y Cloud Run en TechCaribe Expo 2024', 'center 40%'],
      baqjs2024: ['Archivos/Fotos/02_Escenario-y-charlas/2024-07-22_baqjs-chatbot-gemini/evento_2024-07-22_baqjs-chatbot-gemini-detras-de-camaras_luis-reyes-vanegas_001.heic', 'Cámara grabando a Luis Reyes durante su charla en BAQ.JS', 'center 45%'],
      aneiap: ['Archivos/Fotos/02_Escenario-y-charlas/2024-07-14_aneiap-cultura-digital/charla_2024-07-14_aneiap-cultura-digital_luis-reyes-vanegas_001.jpg', 'Luis Reyes con los asistentes del evento de ANEIAP', 'center 40%'],
      gdg2024: ['Archivos/Fotos/02_Escenario-y-charlas/2024-07-13_gdg-barranquilla-chatbot-gemini/charla_2024-07-13_gdg-barranquilla-chatbot-gemini_luis-reyes-vanegas_001.jpg', 'Pieza de la charla Aprende a crear un chatbot con Gemini, Next.js y Firebase, con Luis Reyes', 'center'],
      gdg2023: ['Archivos/Fotos/02_Escenario-y-charlas/2023-07-22_gdg-barranquilla-como-iniciar-en-la-nube/charla_2023-07-22_gdg-barranquilla-como-iniciar-en-la-nube_luis-reyes-vanegas_001.jpg', 'Luis Reyes presentando recursos de Google Cloud en GDG Barranquilla', 'center 30%']
    };
    var conFoto = function (e) {
      var f = fotos[e.f];
      return Object.assign({}, e, { foto: f ? f[0] : '', alt: f ? f[1] : '', pos: f ? f[2] : 'center', sinFoto: !f });
    };
    return {
      eventos: [
        { when: '29 nov 2025 · Quito, Ecuador', tipo: 'Charla', title: 'DevFest Ecuador 2025', desc: 'Infraestructura estable con Terraform, GCP, Cloud Run y Cloudflare asistida por IA. Universidad San Francisco de Quito, más de 700 asistentes.', f: 'devfest' },
        { when: '28 nov 2025 · Quito, Ecuador', tipo: 'Charla', title: 'Cursor meetup Quito', desc: 'Infraestructura en la nube: IA + Terraform + AWS.', f: 'cursor' },
        { when: '11 y 12 nov 2025 · Barranquilla', tipo: 'Charla', title: 'SENA: I Encuentro de Tecnología e Innovación', desc: 'Conferencista en el evento nacional del Centro Industrial y de Aviación.', f: 'sena' },
        { when: '20 sep 2025 · Barranquilla', tipo: 'Charla', title: 'TechCaribe Fest 2025', desc: 'Sácale provecho a la nube en la era de la IA.', f: 'techcaribeFest' },
        { when: '2 sep 2025 · En línea', tipo: 'Podcast', title: 'DevLokos', desc: 'En los zapatos de un arquitecto de soluciones en la nube.', f: 'devlokos' },
        { when: '29 ago 2025 · Lima, Perú', tipo: 'Comunidad', title: 'GDG Summit Latam 2025', desc: 'Con el equipo de GDG Barranquilla: cómo organizar y hacer crecer una comunidad GDG.', f: 'gdgSummit' },
        { when: '20 jun 2025 · Barranquilla', tipo: 'Charla', title: 'Five One Labs', desc: 'De la idea al producto.', f: 'fiveOne' },
        { when: '19 jun 2025 · Barranquilla', tipo: 'Charla', title: 'Cámara de Comercio de Barranquilla', desc: 'IA en movimiento: revolucionando tu día con Microsoft 365 y Copilot.', f: 'camara' },
        { when: '5 may 2025 · Barranquilla', tipo: 'Charla', title: 'GDG Build with AI 2025 · Barranqui-IA', desc: 'Fullstack IA development multicloud con Gemini.', f: 'buildAI' },
        { when: '25 feb 2025 · Barranquilla', tipo: 'Charla', title: 'BAQ.JS', desc: 'Infraestructura fintech: el futuro de las integraciones digitales.', f: 'baqjs2025' },
        { when: '27 jul 2024 · Barranquilla', tipo: 'Charla y panel', title: 'TechCaribe Expo 2024 · Google I/O Extended', desc: 'Charla: Crea aplicaciones con Vertex AI y Cloud Run. Panel: retos y oportunidades al crecer en una empresa de base tecnológica.', f: 'techcaribeExpo' },
        { when: '22 jul 2024 · Barranquilla', tipo: 'Charla', title: 'BAQ.JS', desc: 'Aprende a crear un chatbot con Gemini, Next.js y Firebase.', f: 'baqjs2024' },
        { when: '14 jul 2024 · Barranquilla', tipo: 'Charla', title: 'Evento de ANEIAP', desc: 'Cultura digital. Más de 200 asistentes.', f: 'aneiap' },
        { when: '13 jul 2024 · Barranquilla', tipo: 'Charla', title: 'GDG Barranquilla', desc: 'Aprende a crear un chatbot con Gemini, Next.js y Firebase.', f: 'gdg2024' },
        { when: '22 jul 2023 · Barranquilla', tipo: 'Charla', title: 'GDG Barranquilla', desc: 'Cómo iniciar en la nube.', f: 'gdg2023' }
      ].map(conFoto),
      categorias: [
        { name: 'Todas', bg: on.bg, fg: on.fg }, { name: 'AWS', bg: off.bg, fg: off.fg }, { name: 'Google Cloud', bg: off.bg, fg: off.fg }, { name: 'IA', bg: off.bg, fg: off.fg },
        { name: 'Seguridad', bg: off.bg, fg: off.fg }, { name: 'Comunidades', bg: off.bg, fg: off.fg }, { name: 'Noticias', bg: off.bg, fg: off.fg }
      ],
      noticias: ['AWS', 'IA', 'Google Cloud']
    };
  }
}
```

## Imágenes de esta página

| En el prototipo | Original |
|---|---|
| `/_blob/0c55c449…` | `Archivos/Fotos/_proceso/web/banners/pieza_sin-fecha_banner-eventos_luis-reyes-vanegas_001.png (PNG con transparencia; versión web _web.webp al lado)` |
| `/_blob/1773f5d4…` | `Archivos/Fotos/02_Escenario-y-charlas/2024-07-27_techcaribe-expo-2024-google-io-extended/charla_2024-07-27_techcaribe-expo-2024-google-io-extended-vertex-ai-cloud-run_luis-reyes-vanegas_001.jpg` |
| `/_blob/1e2753b9…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-05-05_gdg-build-with-ai-2025-barranqui-ia/evento_2025-05-05_gdg-build-with-ai-2025-barranqui-ia-entrevista-construyendo-con-ia_luis-reyes-vanegas_001.jpg` |
| `/_blob/2b5e9839…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-06-20_five-one-labs-de-la-idea-al-producto/charla_2025-06-20_five-one-labs-de-la-idea-al-producto_luis-reyes-vanegas_001.jpg` |
| `/_blob/3154fa77…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-09-20_techcaribe-fest-2025/charla_2025-09-20_techcaribe-fest-2025_luis-reyes-vanegas_001.jpg` |
| `/_blob/3a8775cd…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-08-29_gdg-summit-latam-2025-lima/evento_2025-08-29_gdg-summit-latam-2025-lima_luis-reyes-vanegas_001.jpg` |
| `/_blob/58dcfb78…` | `Archivos/Fotos/02_Escenario-y-charlas/2024-07-22_baqjs-chatbot-gemini/evento_2024-07-22_baqjs-chatbot-gemini-detras-de-camaras_luis-reyes-vanegas_001.heic (HEIC: convertir)` |
| `/_blob/5e9188b9…` | `Archivos/Fotos/02_Escenario-y-charlas/2023-07-22_gdg-barranquilla-como-iniciar-en-la-nube/charla_2023-07-22_gdg-barranquilla-como-iniciar-en-la-nube_luis-reyes-vanegas_001.jpg` |
| `/_blob/6834ceda…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-28_cursor-meetup-quito/evento_2025-11-28_cursor-meetup-quito_luis-reyes-vanegas_001.jpg` |
| `/_blob/733b6abd…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-02-25_baqjs-infraestructura-fintech/charla_2025-02-25_baqjs-infraestructura-fintech_luis-reyes-vanegas_001.jpg` |
| `/_blob/78dd3f62…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-29_devfest-ecuador-2025/charla_2025-11-29_devfest-ecuador-2025_luis-reyes-vanegas_001.jpg` |
| `/_blob/82743575…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-06-19_camara-de-comercio-ia-copilot/charla_2025-06-19_camara-de-comercio-ia-copilot_luis-reyes-vanegas_001.jpg` |
| `/_blob/90f22802…` | `Archivos/Fotos/02_Escenario-y-charlas/2024-07-14_aneiap-cultura-digital/charla_2024-07-14_aneiap-cultura-digital_luis-reyes-vanegas_001.jpg` |
| `/_blob/a3f22b25…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-09-02_devlokos-podcast/charla_2025-09-02_devlokos-podcast_luis-reyes-vanegas_001.jpg` |
| `/_blob/a986ff5b…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-11_sena-encuentro-tecnologia-innovacion/charla_2025-11-11_sena-encuentro-tecnologia-innovacion_luis-reyes-vanegas_001.jpg` |
| `/_blob/ac63bc5e…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg (logo horizontal para fondo oscuro)` |
| `/_blob/d8fb6dc0…` | `Archivos/Fotos/02_Escenario-y-charlas/2024-07-13_gdg-barranquilla-chatbot-gemini/charla_2024-07-13_gdg-barranquilla-chatbot-gemini_luis-reyes-vanegas_001.jpg` |

Cópialas a `src/assets/` con su nombre y optimízalas con `astro:assets` (AVIF/WebP, `srcset`). Las fotos de eventos van en PhotoCard 4:3 sin recorte (fondo desenfocado detrás, ver `CLAUDE.md`). El encuadre (`object-position`) de cada foto está en los datos.

## Pendientes detectados en el prototipo

- [Título de la noticia]
- [Mi opinión en una o dos líneas]
- FOTO PENDIENTE ·
