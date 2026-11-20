# Referencia · Sesión de arquitectura (`/es/consultoria/sesion-de-arquitectura`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/sesion-arquitectura.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/02-CONSULTORIA.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: claro (white)
- Motion: Solo ambiente (apariciones suaves, hover).

## Notas para construirla
- Es el único precio que se publica: US$450.
- La agenda es la página de reservas de Google Calendar; la URL va en configuración y Luis la entrega.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. 90 minutos para saber qué hacer con tu nube.
- Enlace/botón: "← Consultoría" → `Consultoria.dc.html`
- Eyebrow: LA PUERTA DE ENTRADA
- **H1:** 90 minutos para saber qué hacer con tu nube.
- Texto: Revisamos juntos tu caso, sea cual sea la puerta por la que llegas: costos, crecimiento, programas de AWS, migración, buenas prácticas, seguridad o adopción de IA. En 48 horas recibes un memo con mis recomendaciones.
- Enlace/botón: "Agendar sesión de arquitectura · US$450" → `Consultoria.dc.html#agenda`
- Enlace/botón: "Llamada de 20 min gratis" → `Consultoria.dc.html#agenda`

### 2. Para quién es
_fondo `#e5eef9`_
- **H2:** Para quién es
- Lista repetida `{{senales}}` (ver datos al final) con el patrón:
    - li: {{x}}

### 3. Sesión de arquitectura · US$450
- Eyebrow: QUÉ RECIBES
- **H2:** Sesión de arquitectura · US$450
- Lista repetida `{{entregables}}` (ver datos al final) con el patrón:
    - b: {{e.t}}
    - span: {{e.d}}
- Eyebrow: CÓMO LO HAGO
- **H2:** Proceso
- Lista repetida `{{proceso}}` (ver datos al final) con el patrón:
    - li: {{p.n}} {{p.t}} {{p.d}}
- span: El memo llega en las 48 horas siguientes a la sesión.

### 4. Una red nacional de peajes baja su factura de Google Cloud
_fondo `#090812`_
- Eyebrow: CASO · UTPN / KMA · 2025
- **H2:** Una red nacional de peajes baja su factura de Google Cloud
- Texto: Empezó con una revisión de la infraestructura. El hallazgo, la videovigilancia saliendo a internet, cambió la factura y terminó en un contrato de soporte de largo plazo.
- Enlace/botón: "Ver el caso completo →" → `CasoUTPN.dc.html`
- span: −60%
- span: De US$10.000 a US$4.000 al mes en Google Cloud.

### 5. Cómo prepararte
- Eyebrow: CÓMO EMPEZAR
- **H2:** Cómo prepararte
- Texto: Ten a mano tu última factura de nube, un diagrama o una descripción de tu arquitectura y la pregunta que más te importa responder. Si no tienes nada de eso, también sirve: lo armamos en la sesión.
- Eyebrow: ¿NO ESTÁS SEGURO?
- b: Empieza con una llamada de 20 minutos
- Texto: Gratis, para saber si puedo ayudarte y si la sesión tiene sentido para tu caso.
- Enlace/botón: "Agendar llamada →" → `Consultoria.dc.html#agenda`

### 6. Preguntas frecuentes
- **H2:** Preguntas frecuentes
- Lista repetida `{{faq}}` (ver datos al final) con el patrón:
    - b: {{f.q}}
    - span: {{f.a}}

### 7. Elige fecha y empecemos por tu caso.
_fondo `#0055c2`_
- **H2:** Elige fecha y empecemos por tu caso.
- Enlace/botón: "Agendar sesión · US$450" → `Consultoria.dc.html#agenda`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
  "senales": [
    "CTOs y founders que necesitan una segunda opinión antes de decidir.",
    "Gerentes de TI con una factura que no cuadra.",
    "Equipos a punto de migrar o de crecer.",
    "Empresas que quieren empezar con IA y no saben por dónde.",
    "Quien no está listo para un proyecto, pero sí para una conversación seria."
  ],
  "entregables": [
    {
      "t": "90 minutos conmigo",
      "d": "Por videollamada, con tu equipo técnico si quieres."
    },
    {
      "t": "Memo en 48 horas",
      "d": "Hallazgos, recomendaciones priorizadas y siguientes pasos."
    },
    {
      "t": "Sin compromiso",
      "d": "Con el memo puedes seguir solo, con tu equipo o conmigo."
    },
    {
      "t": "Acreditable",
      "d": "Si después seguimos trabajando juntos, te descuento los US$450 del siguiente servicio."
    }
  ],
  "proceso": [
    {
      "n": "01",
      "t": "Agenda",
      "d": "Eliges fecha y hora y respondes unas preguntas sobre tu caso."
    },
    {
      "n": "02",
      "t": "Preparación",
      "d": "Reviso lo que me compartes antes de la sesión."
    },
    {
      "n": "03",
      "t": "Sesión",
      "d": "90 minutos para entender el problema y discutir opciones."
    },
    {
      "n": "04",
      "t": "Memo",
      "d": "En 48 horas, con lo que haría en tu lugar."
    }
  ],
  "faq": [
    {
      "q": "¿Qué pasa si después no seguimos trabajando?",
      "a": "Te quedas con el memo. Es tuyo."
    },
    {
      "q": "¿Puedo invitar a mi equipo?",
      "a": "Sí, y lo recomiendo."
    },
    {
      "q": "¿Firmas acuerdo de confidencialidad?",
      "a": "Sí. Protege la información confidencial de tu empresa y no limita mi trabajo con otros clientes. Si necesitas exclusividad, la acordamos entre las partes en el contrato."
    },
    {
      "q": "¿Cómo se paga?",
      "a": "Por transferencia bancaria, en la moneda de tu empresa. Resido en Colombia y emito factura colombiana."
    }
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

Cópialas a `src/assets/` con su nombre y optimízalas con `astro:assets` (AVIF/WebP, `srcset`). Las fotos de eventos van en PhotoCard 4:3 sin recorte (fondo desenfocado detrás, ver `CLAUDE.md`). El encuadre (`object-position`) de cada foto está en los datos.

## Pendientes detectados en el prototipo

- Ninguno en el HTML.
