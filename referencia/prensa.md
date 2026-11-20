# Referencia · Prensa (`/es/prensa`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/prensa.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/07-SPEAKER-PRENSA-CONTACTO.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: oscuro (night)
- Motion: Solo ambiente.

## Notas para construirla
- Las 3 fotos de prensa salen de las carpetas de sus eventos, pero no son la portada: elige la que coincide con el alt y confírmala con Luis.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Kit de prensa
- Eyebrow: PRENSA
- **H1:** Kit de prensa
- Texto: Aquí encuentras mi bio, fotos oficiales, logos y los datos del XPRIZE para tu nota. Si necesitas una entrevista o algo que no está aquí, escríbeme.
- Enlace/botón: "Descargar el kit completo" → `#descargar`
- Enlace/botón: "Pedir una entrevista" → `#contacto-prensa`
- Lista repetida `{{datos}}` (ver datos al final) con el patrón:
    - dt: {{d.k}}
    - dd: {{d.v}}

### 2. Mi bio, en tres largos
_ancla `#bio`_
- Eyebrow: BIO
- **H2:** Mi bio, en tres largos
- Texto: Escrita en tercera persona para que la uses tal cual. Es la misma que comparto con los organizadores de eventos.
- Lista repetida `{{bios}}` (ver datos al final) con el patrón:
    - span: {{b.label}}
    - Texto: {{b.text}}
    - Botón: "Copiar"

### 3. Fotos en alta resolución
_fondo `#001531`_
- Eyebrow: FOTOS OFICIALES
- **H2:** Fotos en alta resolución
- Texto: Puedes publicarlas en notas sobre mí o sobre mi trabajo, con el crédito que aparece en cada una.
- Lista repetida `{{fotos}}` (ver datos al final) con el patrón:
    - Bloque condicional `{{f.src}}`:
        - Imagen: alt "{{f.alt}}" · fuente `{{f.src}}`
    - Bloque condicional `{{f.pendiente}}`:
        - **Espacio reservado:** Espacio para foto pendiente — FOTO PENDIENTE · {{f.titulo}}
    - b: {{f.titulo}}
    - span: Crédito: {{f.credito}}
    - Enlace/botón: "Descargar ↓" → `#descargar`

### 4. Mi logo
- Eyebrow: LOGOS
- **H2:** Mi logo
- Texto: Usa la versión blanca sobre fondos oscuros y la versión a color sobre fondos claros. No cambies sus colores ni sus proporciones.
- Imagen: alt "Logo de Luis Reyes en blanco" · fuente `Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg (logo horizontal para fondo oscuro)`
- span: Horizontal · blanco
- Enlace/botón: "PNG · SVG ↓" → `#descargar`
- Imagen: alt "Logo de Luis Reyes a color" · fuente `Archivos/Marca/Manual V-2025/SVG/marca-h-color.svg (logo horizontal para fondo claro)`
- span: Horizontal · color
- Enlace/botón: "PNG · SVG ↓" → `#descargar`
- **Espacio reservado:** Espacio para el monograma LR — MONOGRAMA LR · Manual V-2025/ICON
- span: Monograma · color y blanco
- Enlace/botón: "PNG · SVG ↓" → `#descargar`

### 5. Trama AI, ganadora de categoría en el Build with Gemini XPRIZE 2026
- Eyebrow: DATOS DEL XPRIZE
- **H2:** Trama AI, ganadora de categoría en el Build with Gemini XPRIZE 2026
- Texto: Trama AI ganó la categoría Small Business Services. El equipo construyó en 90 días agentes de IA que operan el inventario de distribuidores textiles.
- Enlace/botón: "Fuente oficial: gxp.moonshots.com ↗" → `https://gxp.moonshots.com/`
- Lista repetida `{{xprize}}` (ver datos al final) con el patrón:
    - dt: {{x.k}}
    - dd: {{x.v}}

### 6. Todo en un solo archivo
_ancla `#descargar` · fondo `#0055c2`_
- **H2:** Todo en un solo archivo
- Texto: Bio en tres largos, fotos en alta resolución, logos en PNG y SVG y los datos del XPRIZE, en un .zip.
- Enlace/botón: "Descargar kit (.zip)" → `#descargar`

### 7. ¿Preparas una nota?
_ancla `#contacto-prensa`_
- Eyebrow: CONTACTO DE PRENSA
- **H2:** ¿Preparas una nota?
- Texto: Cuéntame para qué medio escribes y cuál es tu fecha de cierre. Puedo dar entrevistas sobre nube, adopción de IA en las empresas, el XPRIZE y el ecosistema tech de Latinoamérica.
- Etiqueta de campo: "Nombre"
- Campo input (text)
- Etiqueta de campo: "Medio"
- Campo input (text)
- Etiqueta de campo: "Correo"
- Campo input (email)
- Etiqueta de campo: "¿Qué necesitas?"
- Campo de selección: Entrevista / Declaración o cita / Fotos o material / Otro
- Etiqueta de campo: "Fecha de cierre"
- Campo input (date)
- Etiqueta de campo: "Detalles"
- Campo textarea (texto)
- Campo input (checkbox)
- Enlace/botón: "política de tratamiento de datos" → `Legal.dc.html`
- Botón: "Enviar"

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    var foto = function (titulo, src, alt, pos) { return { titulo: titulo, src: src, alt: alt, pos: pos, pendiente: !src, credito: '[por confirmar]' }; };
    return {
      datos: [
        { k: 'NOMBRE', v: 'Luis Reyes Vanegas' },
        { k: 'QUÉ HACE', v: 'Arquitecto de soluciones cloud e IA' },
        { k: 'CARGOS', v: 'CEO de Trama AI · Cofundador y CTO de EvolutecC' },
        { k: 'TRAYECTORIA', v: '13 años construyendo tecnología, desde 2013' },
        { k: 'RECONOCIMIENTO', v: 'Ganador de categoría en el Build with Gemini XPRIZE 2026 con Trama AI' }
      ],
      bios: [
        { label: 'CORTA · 50 PALABRAS', text: 'Luis Reyes Vanegas es arquitecto de soluciones cloud e IA con 13 años de experiencia. Es CEO de Trama AI, ganadora de la categoría Small Business Services del Build with Gemini XPRIZE 2026, y cofundador y CTO de EvolutecC. Ayuda a empresas de Estados Unidos y Latinoamérica a crecer en la nube y a adoptar la IA.' },
        { label: 'MEDIA · 100 PALABRAS', text: 'Luis Reyes Vanegas es arquitecto de soluciones cloud e IA con 13 años de experiencia. Es CEO de Trama AI, ganadora de la categoría Small Business Services del Build with Gemini XPRIZE 2026, y cofundador y CTO de EvolutecC, donde con su equipo ha entregado más de 400 proyectos de software. Como consultor diseña arquitecturas en AWS, Google Cloud y Azure para optimizar costos, escalar, migrar y cumplir con seguridad, y acompaña a equipos que quieren trabajar con IA. Ha dado charlas en GDG Summit Latam (Lima), DevFest Ecuador (Quito) y la comunidad de Google Developer Groups.' },
        { label: 'LARGA · 200 PALABRAS', text: 'Luis Reyes Vanegas es arquitecto de soluciones cloud e IA con 13 años de experiencia. Empezó a los 16 con su primer negocio de tecnología y desde entonces ha llevado sistemas a producción para clínicas, startups y grandes organizaciones. Fue Head of Product de Mandaos, una startup de última milla, donde la integración con iFood llevó la operación de unos 2.400 a unos 70.000 pedidos al mes. Es cofundador y CTO de EvolutecC, donde con su equipo ha entregado más de 400 proyectos de software. Como CEO de Trama AI construyó con su equipo, en 90 días, agentes de IA que operan el inventario de distribuidores textiles, y ganaron la categoría Small Business Services del Build with Gemini XPRIZE 2026, entre 26.449 equipos. Como consultor diseña arquitecturas en AWS, Google Cloud y Azure para empresas de Estados Unidos y Latinoamérica, y acompaña a equipos que quieren adoptar la IA con Claude. Tiene certificaciones internacionales en liderazgo transformacional y en comunicación y oratoria. Ha dado charlas en GDG Summit Latam (Lima), DevFest Ecuador (Quito), TechCaribe y la comunidad de Google Developer Groups.' }
      ],
      fotos: [
        foto('Retrato editorial', '', '', 'center'),
        foto('En escenario · TechCaribe Fest 2025', 'Archivos/Fotos/02_Escenario-y-charlas/2025-09-20_techcaribe-fest-2025/', 'Luis Reyes en el escenario de TechCaribe Fest 2025', 'center 30%'),
        foto('En escenario · TechCaribe Expo 2024', 'Archivos/Fotos/02_Escenario-y-charlas/2024-07-27_techcaribe-expo-2024-google-io-extended/', 'Luis Reyes en TechCaribe Expo 2024 con su presentación en la pantalla', 'center 35%'),
        foto('Presentando · GDG Build with AI 2025', 'Archivos/Fotos/02_Escenario-y-charlas/2025-05-05_gdg-build-with-ai-2025-barranqui-ia/', 'Luis Reyes presentando en GDG Build with AI 2025, Barranquilla', 'center')
      ],
      xprize: [
        { k: 'CATEGORÍA', v: 'Small Business Services' },
        { k: 'COMPETENCIA', v: 'Top 100 entre 26.449 equipos' },
        { k: 'EQUIPO', v: 'Luis Reyes Vanegas (CEO), Gianfranco Castro (CTO), Johan Burgos (DevOps) y Najem Nabhan (PM)' },
        { k: 'TIEMPO DE CONSTRUCCIÓN', v: '90 días' }
      ]
    };
  }
}
```

## Imágenes de esta página

| En el prototipo | Original |
|---|---|
| `/_blob/67b71cd0…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color.svg (logo horizontal para fondo claro)` |
| `/_blob/6d2109f4…` | `Archivos/Fotos/02_Escenario-y-charlas/2024-07-27_techcaribe-expo-2024-google-io-extended/ (foto de la carpeta que coincide con el alt; no es la portada)` |
| `/_blob/ac63bc5e…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg (logo horizontal para fondo oscuro)` |
| `/_blob/b6dd015c…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-09-20_techcaribe-fest-2025/ (foto de la carpeta que coincide con el alt; no es la portada)` |
| `/_blob/cd4b62b0…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-05-05_gdg-build-with-ai-2025-barranqui-ia/ (foto de la carpeta que coincide con el alt; no es la portada)` |

Cópialas a `src/assets/` con su nombre y optimízalas con `astro:assets` (AVIF/WebP, `srcset`). Las fotos de eventos van en PhotoCard 4:3 sin recorte (fondo desenfocado detrás, ver `CLAUDE.md`). El encuadre (`object-position`) de cada foto está en los datos.

## Pendientes detectados en el prototipo

- FOTO PENDIENTE ·
