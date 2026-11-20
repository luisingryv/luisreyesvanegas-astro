# Referencia · Home (`/es`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/home.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/01-HOME.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: oscuro (night)
- Motion: Protagonista: pieza 01 (XPRIZE) en lugar del bloque de 3 cajas. Narrativa: pieza 02 en Logros, riel corto de la pieza 03 en Trayectoria, pieza 08 (burbujas de casos), transición de partículas al pasar a la sección clara de Casos, curvas del hero con parallax. Ver `../Boveda/02_Sitio-web/Sitemap/MOTION-DEL-SITIO.md`.

## Notas para construirla
- El retrato del hero llegó el 19 nov 2026 (ver imágenes). Encuadre `center 30%`, proporción 4:5.
- El cierre de contacto del Home lleva el formulario; la pieza 04 (logo 3D) quedó en el cierre de Sobre mí por decisión de Luis del 19 nov 2026. Antes de ponerla también en el Home, pregúntale.
- WhatsApp: `[TU NÚMERO]` es el WhatsApp corporativo, que Luis entrega al desarrollar. Va en configuración, no en el texto.
- Las burbujas de casos llevan el nombre del cliente, no logos, hasta que haya permisos de logo.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Innovación y escalabilidad en la nube, con resultados medibles.
- Eyebrow: ARQUITECTO CLOUD · IA · CEO DE TRAMA AI
- **H1:** Innovación y escalabilidad en la nube, con resultados medibles.
- Texto: Soy arquitecto de soluciones cloud e IA. Trabajo con empresas de Estados Unidos y Latinoamérica: entiendo qué necesita tu negocio y diseño la solución en AWS, Google Cloud o Azure.
- Enlace/botón: "Ganador de categoría · Build with Gemini XPRIZE 2026" → `https://gxp.moonshots.com/`
- Enlace/botón: "Agendar sesión de arquitectura" → `#agenda`
- Enlace/botón: "Invitarme a hablar" → `Speaker.dc.html`
- Imagen: alt "Luis Carlos Reyes Vanegas en su oficina" · fuente `Archivos/Fotos/01_Retratos/retrato_sin-fecha_oficina-chaqueta-verde-home_luis-reyes-vanegas_001.jpg`

### 2. Consultoría y productos
- **H2:** Consultoría y productos
- Lista repetida `{{router}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{r.tag}} {{r.title}} {{r.desc}} {{r.cta}} →" → `{{r.href}}`

### 3. Algunos resultados de los últimos años.
- Eyebrow: LOGROS DESBLOQUEADOS
- **H2:** Algunos resultados de los últimos años.
- Lista repetida `{{logros}}` (ver datos al final) con el patrón:
    - span: {{l.tag}}
    - span: {{l.metric}}
    - Texto: {{l.desc}}
    - Bloque condicional `{{l.bars}}`:
        - span: {{l.legend}}
    - Bloque condicional `{{l.chips}}`:
        - Lista repetida `{{l.chipList}}` (ver datos al final) con el patrón:
            - span: {{c}}
    - span: {{l.who}}

### 4. Ganador de categoría en el Build with Gemini XPRIZE.
- Eyebrow: LOGRO DESBLOQUEADO · TRAMA AI · 2026
- **H2:** Ganador de categoría en el Build with Gemini XPRIZE.
- Texto: Con Gianfranco Castro, Johan Burgos y Najem Nabhan construimos Trama AI en 90 días: agentes de IA que operan el inventario de distribuidores textiles. Ganamos la categoría Small Business Services.
- Enlace/botón: "Conoce Trama AI" → `Productos.dc.html`
- Enlace/botón: "Fuente: gxp.moonshots.com" → `https://gxp.moonshots.com/`
- span: 26.449
- span: equipos en competencia
- span: Top 100
- span: finalistas
- span: 1.º
- span: de su categoría

### 5. Mi trayectoria desde 2013
_fondo `#001531`_
- Eyebrow: TRAYECTORIA
- **H2:** Mi trayectoria desde 2013
- Enlace/botón: "Conoce mi historia" → `SobreMi.dc.html`
- Lista repetida `{{hitos}}` (ver datos al final) con el patrón:
    - li: {{h.yr}} {{h.title}} {{h.desc}}

### 6. Charlas recientes
_ancla `#eventos`_
- Eyebrow: EVENTOS Y CHARLAS
- **H2:** Charlas recientes
- Enlace/botón: "Ver todos los eventos →" → `Eventos.dc.html`
- Lista repetida `{{eventos}}` (ver datos al final) con el patrón:
    - Imagen: alt "{{e.alt}}" · fuente `{{e.foto}}`
    - span: {{e.when}}
    - span: {{e.title}}
    - span: {{e.desc}}

### 7. Casos de éxito
_ancla `#casos` · fondo `#ffffff`_
- Eyebrow: CASOS
- **H2:** Casos de éxito
- Enlace/botón: "Ver todos los casos →" → `Casos.dc.html`
- **H3:** Mis productos y mi consultoría
- Lista repetida `{{casosPropios}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{c}}" → `#casos`
- **H3:** Trayectoria
- Lista repetida `{{casosEvolutecc}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{c}}" → `#casos`

### 8. Lo que estoy leyendo y pensando
_ancla `#blog` · fondo `#ffffff`_
- Eyebrow: BLOG
- **H2:** Lo que estoy leyendo y pensando
- Enlace/botón: "Ver noticias →" → `Eventos.dc.html#noticias`
- Lista repetida `{{blog}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{b}} [Título de la entrada] [Resumen en una o dos líneas]" → `#blog`

### 9. ¿Necesitas desarrollo a la medida?
- **H2:** ¿Necesitas desarrollo a la medida?
- Texto: En EvolutecC, donde soy CTO, desarrollamos software a la medida para empresas. Llevamos más de 400 proyectos entregados.
- Enlace/botón: "Conoce EvolutecC ↗" → `https://evolutecc.com/?utm_source=luisreyesvanegas&utm_medium=referral&utm_campaign=home`

### 10. Cuéntame qué estás construyendo.
_ancla `#agenda`_
- Eyebrow: CONTACTO
- **H2:** Cuéntame qué estás construyendo.
- Texto: Si tu factura de nube crece más rápido que tu negocio, si vas a migrar o si quieres que tu equipo trabaje con IA, escríbeme y lo revisamos juntos. También acepto invitaciones para dar charlas.
- span: WhatsApp: [TU NÚMERO]
- Etiqueta de campo: "Nombre"
- Campo input (text)
- Etiqueta de campo: "Correo"
- Campo input (email)
- Etiqueta de campo: "¿En qué te ayudo?"
- Campo de selección: Consultoría cloud o IA / Conferencia o charla / Contratación / Conversación general
- Etiqueta de campo: "Mensaje"
- Campo textarea (texto)
- Botón: "Enviar"

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      router: [
        { tag: 'CONSULTORÍA', title: 'Necesito resolver algo en mi nube o con IA', desc: 'Costos, crecimiento, programas de la nube, migración, buenas prácticas, seguridad o adopción de IA.', cta: 'Ver consultoría', href: 'Consultoria.dc.html' },
        { tag: 'PRODUCTOS', title: 'Quiero ver o invertir en productos', desc: 'Trama AI, la plataforma que dirijo, y los productos que construyo con mis socios.', cta: 'Ver productos', href: 'Productos.dc.html' }      ],
      logros: [
        { tag: 'ESCALAR', metric: '70.000', desc: 'Pedidos al mes después de la integración con iFood, que dirigí como Head of Product de Mandaos: producto, equipo y API. Antes eran unos 2.400.', who: 'Mandaos / Netivery con iFood', bars: true, beforeW: '3.4%', afterW: '100%', legend: '≈2.400 → ≈70.000 · ×29', chips: false, chipList: [] },
        { tag: 'LIDERAZGO TÉCNICO', metric: '400+', desc: 'Proyectos de software entregados con mi equipo en EvolutecC, donde soy CTO desde 2020.', who: 'EvolutecC · 2020–hoy · Liderado con mi equipo', bars: false, chips: false, chipList: [] },
        { tag: 'OPTIMIZAR COSTOS', metric: '−60%', desc: 'Reduje la factura mensual de Google Cloud de una plataforma con streaming 24/7 de unos 15 TB diarios.', who: 'UTPN / KMA · 2025', bars: true, beforeW: '100%', afterW: '40%', legend: 'US$10.000 → US$4.000 al mes', chips: false, chipList: [] },
        { tag: 'PROGRAMAS Y CRÉDITOS', metric: 'US$62.000', desc: 'En créditos de AWS a través del programa MAP, que gestionamos con nuestro aliado Nexa Connect. Además, 10 usuarios de Kiro con US$8.000 en créditos.', who: 'Glasslake · 2025–2026', bars: false, chips: false, chipList: [] },
        { tag: 'SEGURIDAD Y CUMPLIMIENTO', metric: '2', desc: 'Glasslake obtuvo ISO 27001 y SOC 2. Acompañé la parte técnica en la nube como Cloud Expert.', who: 'Glasslake · 2026', bars: false, chips: true, chipList: ['ISO 27001', 'SOC 2'] },
        { tag: 'BUENAS PRÁCTICAS', metric: '10+', desc: 'Años lleva en producción el SIGC, el sistema de la Clínica del Caribe que pasé de escritorio a web.', who: 'SIGC · Clínica del Caribe · 300+ usuarios', bars: false, chips: false, chipList: [] }
      ],
      hitos: [
        { yr: '2013', title: 'R&V Technology', desc: 'Fundé mi primer negocio: reparaba computadores y hacía sitios web.' },
        { yr: '2016', title: 'SIGC, Clínica del Caribe', desc: 'Pasé el sistema de la clínica de escritorio a web. Sigue en uso.' },
        { yr: '2018', title: 'Mandaos', desc: 'Entré como desarrollador y llegué a Head of Product en esta startup de última milla.' },
        { yr: '2020', title: 'EvolutecC', desc: 'Cofundé la empresa y soy su CTO. Con el equipo hemos entregado más de 400 proyectos.' },
        { yr: '2026', title: 'Trama AI y el XPRIZE', desc: 'Como CEO de Trama AI, ganamos la categoría Small Business Services del Build with Gemini XPRIZE.' }
      ],
      eventos: [
        { when: '29 nov 2025 · Quito, Ecuador', title: 'DevFest Ecuador 2025', desc: 'Infraestructura estable con Terraform, GCP, Cloud Run y Cloudflare asistida por IA. Más de 700 asistentes.', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2025-11-29_devfest-ecuador-2025/charla_2025-11-29_devfest-ecuador-2025_luis-reyes-vanegas_001.jpg', alt: 'Luis Reyes con el equipo de DevFest Ecuador 2025 en la Universidad San Francisco de Quito' },
        { when: '28 nov 2025 · Quito, Ecuador', title: 'Cursor meetup Quito', desc: 'Infraestructura en la nube: IA + Terraform + AWS.', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2025-11-28_cursor-meetup-quito/evento_2025-11-28_cursor-meetup-quito_luis-reyes-vanegas_001.jpg', alt: 'Asistentes al Cursor meetup en Quito' },
        { when: '11 y 12 nov 2025 · Barranquilla', title: 'SENA: I Encuentro de Tecnología e Innovación', desc: 'Conferencista en el evento nacional del Centro Industrial y de Aviación.', foto: 'Archivos/Fotos/02_Escenario-y-charlas/2025-11-11_sena-encuentro-tecnologia-innovacion/charla_2025-11-11_sena-encuentro-tecnologia-innovacion_luis-reyes-vanegas_001.jpg', alt: 'Auditorio lleno en el Encuentro de Tecnología e Innovación del SENA, visto desde el escenario' }
      ],
      casosPropios: ['Trama AI', 'UTPN / KMA', 'Glasslake'],
      casosEvolutecc: ['Fuerza Aérea · TIVIT', 'Clínica del Caribe', 'Mandaos'],
      blog: ['Costos cloud', 'Adopción de IA', 'Noticia comentada']
    };
  }
}
```

## Imágenes de esta página

| En el prototipo | Original |
|---|---|
| `/_blob/6834ceda…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-28_cursor-meetup-quito/evento_2025-11-28_cursor-meetup-quito_luis-reyes-vanegas_001.jpg` |
| `/_blob/78dd3f62…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-29_devfest-ecuador-2025/charla_2025-11-29_devfest-ecuador-2025_luis-reyes-vanegas_001.jpg` |
| `/_blob/a986ff5b…` | `Archivos/Fotos/02_Escenario-y-charlas/2025-11-11_sena-encuentro-tecnologia-innovacion/charla_2025-11-11_sena-encuentro-tecnologia-innovacion_luis-reyes-vanegas_001.jpg` |
| `/_blob/ac63bc5e…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg (logo horizontal para fondo oscuro)` |
| `/_blob/e348d068…` | `Archivos/Fotos/01_Retratos/retrato_sin-fecha_oficina-chaqueta-verde-home_luis-reyes-vanegas_001.jpg` |

Cópialas a `src/assets/` con su nombre y optimízalas con `astro:assets` (AVIF/WebP, `srcset`). Las fotos de eventos van en PhotoCard 4:3 sin recorte (fondo desenfocado detrás, ver `CLAUDE.md`). El encuadre (`object-position`) de cada foto está en los datos.

## Pendientes detectados en el prototipo

- [Título de la entrada]
- [Resumen en una o dos líneas]
- [TU NÚMERO]
