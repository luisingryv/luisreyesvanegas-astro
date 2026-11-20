# Referencia · Charlas (speaker kit) (`/es/speaker`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/speaker.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/07-SPEAKER-PRENSA-CONTACTO.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1–2 · Tema: oscuro (night)
- Motion: Protagonista: pieza 10 (mapa de ciudades: Barranquilla, Quito y Lima; Los Ángeles pendiente de confirmar), con la cifra de más de 700 asistentes en DevFest Ecuador. Cinta de temáticas en dos filas en sentidos contrarios, se detiene al pasar el cursor y queda quieta con 'reducir movimiento'. Confirmación visible al copiar la bio.

## Notas para construirla
- Las temáticas reemplazan las 3 charlas fijas: Luis prepara el tema según el evento.
- Los testimonios son de ejemplo: la sección se oculta hasta que haya testimonios reales (no se publican inventados).
- Formatos incluyen Conferencia.
- La foto del hero sigue pendiente.
- Pendiente: aclarar con Luis qué significa 'Instagram' en esta página.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Charlas de tecnología, IA y liderazgo, preparadas para tu audiencia.
- Eyebrow: CHARLAS, TALLERES Y PANELES
- **H1:** Charlas de tecnología, IA y liderazgo, preparadas para tu audiencia.
- Texto: Hablo de lo que hago todos los días: arquitectura en la nube, seguridad, migración, adopción de IA con Claude y cómo liderar equipos de tecnología. Preparo cada charla según el evento y quién lo escucha, a partir de proyectos reales, para que tu audiencia salga con pasos que pueda aplicar.
- Enlace/botón: "Invitarme a hablar" → `#invitar`
- Enlace/botón: "Copiar mi bio" → `#bio`
- **Espacio reservado:** Espacio para foto de Luis en escenario — FOTO · Luis en escenario · 02_Escenario-y-charlas

### 2. Algunos de los eventos en los que he hablado
- Eyebrow: EN ESCENARIO
- **H2:** Algunos de los eventos en los que he hablado
- Enlace/botón: "Ver todos los eventos →" → `Eventos.dc.html`
- Lista repetida `{{eventos}}` (ver datos al final) con el patrón:
    - Imagen: alt "{{e.alt}}" · fuente `{{e.foto}}`
    - span: {{e.when}}
    - span: {{e.title}}
    - Bloque condicional `{{e.desc}}`:
        - span: {{e.desc}}

### 3. Preparo cada charla para tu evento.
_fondo `#001531`_
- Eyebrow: TEMÁTICAS
- **H2:** Preparo cada charla para tu evento.
- Texto: No llevo una charla de catálogo. Con lo que me cuentes del evento y de tu audiencia elijo el tema y el enfoque. Estas son algunas de las temáticas sobre las que hablo:
- Lista repetida `{{temasA}}` (ver datos al final) con el patrón:
    - li: {{t}}
- Lista repetida `{{temasA}}` (ver datos al final) con el patrón:
    - li: {{t}}
- Lista repetida `{{temasB}}` (ver datos al final) con el patrón:
    - li: {{t}}
- Lista repetida `{{temasB}}` (ver datos al final) con el patrón:
    - li: {{t}}
- Lista repetida `{{pasos}}` (ver datos al final) con el patrón:
    - li: {{p.n}} {{p.title}} {{p.desc}}

### 4. Mi bio, en tres largos
_ancla `#bio`_
- Eyebrow: BIO PARA ORGANIZADORES
- **H2:** Mi bio, en tres largos
- Lista repetida `{{bios}}` (ver datos al final) con el patrón:
    - span: {{b.label}}
    - Botón: "Copiar"
    - Texto: {{b.text}}

### 5. Cómo puedo participar
- Eyebrow: FORMATOS
- **H2:** Cómo puedo participar
- Lista repetida `{{formatos}}` (ver datos al final) con el patrón:
    - b: {{f.name}}
    - span: {{f.desc}}
- Texto: Los honorarios dependen del formato, la fecha y la ciudad. Te los comparto cuando me cuentes del evento.
- Eyebrow: LO QUE NECESITO
- **H2:** Rider técnico
- Lista repetida `{{rider}}` (ver datos al final) con el patrón:
    - li: {{r}}
- Enlace/botón: "Descargar one-sheet (PDF)" → `#invitar`

### 6. Lo que dicen quienes me han invitado
_fondo `#ffffff`_
- Eyebrow: ORGANIZADORES
- **H2:** Lo que dicen quienes me han invitado
- Texto: Recomendaciones publicadas en LinkedIn, con enlace a la fuente.
- Lista repetida `{{testimonios}}` (ver datos al final) con el patrón:
    - Eyebrow: EJEMPLO
    - blockquote: “{{t.texto}}”
    - figcaption: {{t.nombre}} · {{t.evento}}

### 7. Cuéntame de tu evento.
_ancla `#invitar`_
- Eyebrow: INVITACIÓN
- **H2:** Cuéntame de tu evento.
- Texto: Con la fecha, la ciudad y el público te digo si puedo ir y qué tema le sirve más a tu audiencia.
- Etiqueta de campo: "Nombre del evento"
- Campo input (text)
- Etiqueta de campo: "Fecha"
- Campo input (date)
- Etiqueta de campo: "Ciudad o en línea"
- Campo input (text)
- Etiqueta de campo: "Audiencia"
- Campo input (text) · placeholder: Quiénes asisten y cuántas personas
- Etiqueta de campo: "Presupuesto para la charla"
- Campo de selección: Tenemos presupuesto / Cubrimos viaje y alojamiento / Evento de comunidad sin presupuesto
- Etiqueta de campo: "Correo"
- Campo input (email)
- Botón: "Enviar invitación"

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      eventos: [
        { title: 'DevFest Ecuador 2025', desc: 'Infraestructura estable con Terraform, GCP, Cloud Run y Cloudflare asistida por IA. Más de 700 asistentes.', when: '29 nov 2025 · Quito, Ecuador', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2025-11-29_devfest-ecuador-2025/charla_2025-11-29_devfest-ecuador-2025_luis-reyes-vanegas_001.jpg', alt: 'Luis Reyes con el equipo de DevFest Ecuador 2025 en la Universidad San Francisco de Quito', pos: 'center 60%' },
        { title: 'Cursor meetup Quito', desc: 'Infraestructura en la nube: IA + Terraform + AWS.', when: '28 nov 2025 · Quito, Ecuador', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2025-11-28_cursor-meetup-quito/evento_2025-11-28_cursor-meetup-quito_luis-reyes-vanegas_001.jpg', alt: 'Asistentes al Cursor meetup en Quito', pos: 'center 45%' },
        { title: 'SENA: I Encuentro de Tecnología e Innovación', desc: 'Conferencista en el evento nacional del Centro Industrial y de Aviación.', when: '11 y 12 nov 2025 · Barranquilla', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2025-11-11_sena-encuentro-tecnologia-innovacion/charla_2025-11-11_sena-encuentro-tecnologia-innovacion_luis-reyes-vanegas_001.jpg', alt: 'Auditorio lleno en el Encuentro de Tecnología e Innovación del SENA, visto desde el escenario', pos: 'center 50%' },
        { title: 'TechCaribe Fest 2025', desc: 'Sácale provecho a la nube en la era de la IA.', when: '20 sep 2025 · Barranquilla', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2025-09-20_techcaribe-fest-2025/charla_2025-09-20_techcaribe-fest-2025_luis-reyes-vanegas_001.jpg', alt: 'Luis Reyes conversando con asistentes en TechCaribe Fest 2025', pos: 'center 40%' },
        { title: 'Cámara de Comercio de Barranquilla', desc: 'IA en movimiento: revolucionando tu día con Microsoft 365 y Copilot.', when: '19 jun 2025 · Barranquilla', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2025-06-19_camara-de-comercio-ia-copilot/charla_2025-06-19_camara-de-comercio-ia-copilot_luis-reyes-vanegas_001.jpg', alt: 'Luis Reyes hablando ante el público en la Cámara de Comercio de Barranquilla', pos: 'center' },
        { title: 'TechCaribe Expo 2024 · Google I/O Extended', desc: 'Charla: Crea aplicaciones con Vertex AI y Cloud Run. Panel: retos y oportunidades al crecer en una empresa de base tecnológica.', when: '27 jul 2024 · Barranquilla', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2024-07-27_techcaribe-expo-2024-google-io-extended/charla_2024-07-27_techcaribe-expo-2024-google-io-extended-vertex-ai-cloud-run_luis-reyes-vanegas_001.jpg', alt: 'Luis Reyes junto a la pantalla de su charla Crea aplicaciones con Vertex AI y Cloud Run en TechCaribe Expo 2024', pos: 'center 40%' }
      ],
      temasA: ['Adopción de IA con Claude', 'Seguridad y cumplimiento en la nube', 'Migración a la nube', 'Modernización de aplicaciones', 'Arquitectura en AWS', 'Optimización de costos cloud', 'Agentes de IA'],
      temasB: ['Liderazgo de equipos de tecnología', 'Escalar la infraestructura', 'Infraestructura como código', 'Desarrollo de software con IA', 'Producto y emprendimiento', 'Google Cloud y multinube', 'Comunidad tecnológica'],
      pasos: [
        { n: '01', title: 'Me cuentas del evento', desc: 'Quiénes asisten, qué esperan llevarse y cuánto tiempo tenemos.' },
        { n: '02', title: 'Te propongo el tema', desc: 'Un título y un enfoque pensados para esa audiencia, que ajustamos juntos.' },
        { n: '03', title: 'La preparo con casos reales', desc: 'Proyectos en los que he trabajado y pasos concretos para aplicar al salir.' }
      ],
      bios: [
        { label: 'CORTA · 50 PALABRAS', text: 'Luis Reyes Vanegas es arquitecto de soluciones cloud e IA con 13 años de experiencia. Es CEO de Trama AI, ganadora de la categoría Small Business Services del Build with Gemini XPRIZE 2026, y cofundador y CTO de EvolutecC. Ayuda a empresas de Estados Unidos y Latinoamérica a crecer en la nube y a adoptar la IA.' },
        { label: 'MEDIA · 100 PALABRAS', text: 'Luis Reyes Vanegas es arquitecto de soluciones cloud e IA con 13 años de experiencia. Es CEO de Trama AI, ganadora de la categoría Small Business Services del Build with Gemini XPRIZE 2026, y cofundador y CTO de EvolutecC, donde con su equipo ha entregado más de 400 proyectos de software. Como consultor diseña arquitecturas en AWS, Google Cloud y Azure para optimizar costos, escalar, migrar y cumplir con seguridad, y acompaña a equipos que quieren trabajar con IA. Ha dado charlas en GDG Summit Latam (Lima), DevFest Ecuador (Quito) y la comunidad de Google Developer Groups.' },
        { label: 'LARGA · 200 PALABRAS', text: 'Luis Reyes Vanegas es arquitecto de soluciones cloud e IA con 13 años de experiencia. Empezó a los 16 con su primer negocio de tecnología y desde entonces ha llevado sistemas a producción para clínicas, startups y grandes organizaciones. Fue Head of Product de Mandaos, una startup de última milla, donde la integración con iFood llevó la operación de unos 2.400 a unos 70.000 pedidos al mes. Es cofundador y CTO de EvolutecC, donde con su equipo ha entregado más de 400 proyectos de software. Como CEO de Trama AI construyó con su equipo, en 90 días, agentes de IA que operan el inventario de distribuidores textiles, y ganaron la categoría Small Business Services del Build with Gemini XPRIZE 2026, entre 26.449 equipos. Como consultor diseña arquitecturas en AWS, Google Cloud y Azure para empresas de Estados Unidos y Latinoamérica, y acompaña a equipos que quieren adoptar la IA con Claude. Tiene certificaciones internacionales en liderazgo transformacional y en comunicación y oratoria. Ha dado charlas en GDG Summit Latam (Lima), DevFest Ecuador (Quito), TechCaribe y la comunidad de Google Developer Groups.' }
      ],
      formatos: [
        { name: 'Keynote', desc: 'La charla principal del evento, de 30 a 45 minutos, para todo el público.' },
        { name: 'Conferencia', desc: 'Una charla de 30 a 60 minutos dentro de la agenda, sobre un tema técnico o de negocio.' },
        { name: 'Workshop', desc: 'Sesión práctica de 2 a 4 horas en la que los asistentes construyen algo.' },
        { name: 'Panel', desc: 'Conversación con otros invitados sobre nube, IA o emprendimiento.' }
      ],
      rider: ['Proyector o pantalla con entrada HDMI', 'Micrófono inalámbrico o de solapa', 'Conexión a internet estable para demos', 'Agua en el escenario'],
      testimonios: [
        { texto: 'Luis preparó la charla pensando en nuestra comunidad. La gente salió con ideas claras para aplicar en sus proyectos.', nombre: '[Nombre del organizador]', evento: '[Comunidad o evento]' },
        { texto: 'Explicó temas complejos de nube con ejemplos reales, y al final el público no paró de hacer preguntas.', nombre: '[Nombre del organizador]', evento: '[Comunidad o evento]' }
      ]
    };
  }
}
```

## Imágenes de esta página

| En el prototipo | Original |
|---|---|
| `/_blob/1773f5d4…` | `Archivos/Fotos/02_Escenario-y-charlas/2024-07-27_techcaribe-expo-2024-google-io-extended/charla_2024-07-27_techcaribe-expo-2024-google-io-extended-vertex-ai-cloud-run_luis-reyes-vanegas_001.jpg` |
| `/_blob/3154fa77…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-09-20_techcaribe-fest-2025/charla_2025-09-20_techcaribe-fest-2025_luis-reyes-vanegas_001.jpg` |
| `/_blob/6834ceda…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-28_cursor-meetup-quito/evento_2025-11-28_cursor-meetup-quito_luis-reyes-vanegas_001.jpg` |
| `/_blob/78dd3f62…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-29_devfest-ecuador-2025/charla_2025-11-29_devfest-ecuador-2025_luis-reyes-vanegas_001.jpg` |
| `/_blob/82743575…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-06-19_camara-de-comercio-ia-copilot/charla_2025-06-19_camara-de-comercio-ia-copilot_luis-reyes-vanegas_001.jpg` |
| `/_blob/a986ff5b…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-11_sena-encuentro-tecnologia-innovacion/charla_2025-11-11_sena-encuentro-tecnologia-innovacion_luis-reyes-vanegas_001.jpg` |
| `/_blob/ac63bc5e…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg (logo horizontal para fondo oscuro)` |

Cópialas a `src/assets/` con su nombre y optimízalas con `astro:assets` (AVIF/WebP, `srcset`). Las fotos de eventos van en PhotoCard 4:3 sin recorte (fondo desenfocado detrás, ver `CLAUDE.md`). El encuadre (`object-position`) de cada foto está en los datos.

## Pendientes detectados en el prototipo

- Ninguno en el HTML.
