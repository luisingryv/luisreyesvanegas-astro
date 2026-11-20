# Referencia · Acompañamiento mensual (`/es/consultoria/retainers`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/retainers.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/02-CONSULTORIA.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: claro (white)
- Motion: Solo ambiente.

## Notas para construirla
- Los precios de los planes son internos: no se publican cifras.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Un arquitecto de cabecera para tu equipo.
- Enlace/botón: "← Consultoría" → `Consultoria.dc.html`
- Eyebrow: ACOMPAÑAMIENTO MENSUAL
- **H1:** Un arquitecto de cabecera para tu equipo.
- Texto: Después del diagnóstico o de la implementación, sigo con tu equipo cada mes: reviso la arquitectura, los costos y la seguridad, acompaño las decisiones técnicas y estoy disponible cuando algo se complica.
- Enlace/botón: "Agendar sesión de arquitectura · US$450" → `Consultoria.dc.html#agenda`
- Enlace/botón: "Llamada de 20 min gratis" → `Consultoria.dc.html#agenda`

### 2. Cuándo tiene sentido
_fondo `#e5eef9`_
- **H2:** Cuándo tiene sentido
- Lista repetida `{{senales}}` (ver datos al final) con el patrón:
    - li: {{x}}

### 3. Qué incluye
- Eyebrow: QUÉ RECIBES
- **H2:** Qué incluye
- Lista repetida `{{entregables}}` (ver datos al final) con el patrón:
    - b: {{e.t}}
    - span: {{e.d}}
- Eyebrow: CÓMO LO HAGO
- **H2:** Proceso
- Lista repetida `{{proceso}}` (ver datos al final) con el patrón:
    - li: {{p.n}} {{p.t}} {{p.d}}
- span: Tres niveles de dedicación, según el tamaño de tu equipo y tu operación.

### 4. De una auditoría a un soporte de largo plazo
_fondo `#090812`_
- Eyebrow: CASO · UTPN / KMA · 2025
- **H2:** De una auditoría a un soporte de largo plazo
- Texto: Después de bajar la factura de Google Cloud de una red nacional de peajes, el cliente decidió seguir con un contrato de soporte para sostener y mejorar lo construido.
- Enlace/botón: "Ver el caso completo →" → `CasoUTPN.dc.html`
- span: −60%
- span: En la factura mensual de Google Cloud, sostenido con soporte continuo.

### 5. Primero, una sesión de arquitectura
- Eyebrow: CÓMO EMPEZAR
- **H2:** Primero, una sesión de arquitectura
- Texto: El acompañamiento mensual se define después de la sesión de arquitectura o de un diagnóstico. El valor depende de la dedicación que necesites y te lo propongo con el plan.
- Eyebrow: DESARROLLO A LA MEDIDA
- b: ¿Necesitas un equipo que construya?
- Texto: Yo acompaño la arquitectura. Si necesitas desarrollo de software a la medida, lo hace mi equipo en EvolutecC.
- Enlace/botón: "Conoce EvolutecC ↗" → `https://evolutecc.com/?utm_source=luisreyesvanegas&utm_medium=referral&utm_campaign=retainers`

### 6. Preguntas frecuentes
- **H2:** Preguntas frecuentes
- Lista repetida `{{faq}}` (ver datos al final) con el patrón:
    - b: {{f.q}}
    - span: {{f.a}}

### 7. Hablemos de cómo trabaja tu equipo hoy.
_fondo `#0055c2`_
- **H2:** Hablemos de cómo trabaja tu equipo hoy.
- Enlace/botón: "Agendar sesión de arquitectura" → `Consultoria.dc.html#agenda`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
  "senales": [
    "Tu equipo no tiene un arquitecto cloud de tiempo completo.",
    "Ya hiciste una auditoría y quieres que los ahorros se sostengan.",
    "Estás en plena migración o en un periodo de crecimiento.",
    "Necesitas a alguien que revise las decisiones antes de que lleguen a producción.",
    "Te estás preparando para una certificación de seguridad."
  ],
  "entregables": [
    {
      "t": "Revisión mensual",
      "d": "Costos, arquitectura y seguridad, con un informe corto y acciones."
    },
    {
      "t": "Acompañamiento a las decisiones",
      "d": "Reviso diseños, cambios y proveedores antes de que tu equipo se comprometa."
    },
    {
      "t": "Disponibilidad acordada",
      "d": "Un canal directo y tiempos de respuesta definidos en el acuerdo."
    },
    {
      "t": "Programas de la nube",
      "d": "Seguimiento de créditos y programas como MAP cuando aplican."
    }
  ],
  "proceso": [
    {
      "n": "01",
      "t": "Sesión o diagnóstico",
      "d": "El acompañamiento parte de entender tu caso."
    },
    {
      "n": "02",
      "t": "Acuerdo",
      "d": "Definimos dedicación, canal y prioridades del trimestre."
    },
    {
      "n": "03",
      "t": "Ritmo mensual",
      "d": "Revisión, informe y seguimiento de acciones."
    },
    {
      "n": "04",
      "t": "Ajuste trimestral",
      "d": "Revisamos qué funcionó y ajustamos la dedicación."
    }
  ],
  "faq": [
    {
      "q": "¿Hay permanencia mínima?",
      "a": "[Respuesta de Luis]"
    },
    {
      "q": "¿Reemplazas a mi equipo?",
      "a": "No. Lo acompaño para que tome mejores decisiones y aprenda en el camino."
    },
    {
      "q": "¿Atiendes emergencias?",
      "a": "Sí, según lo que acordemos. Fuera del acuerdo se cobran aparte."
    },
    {
      "q": "¿Con qué nubes?",
      "a": "AWS, Google Cloud y Azure."
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
