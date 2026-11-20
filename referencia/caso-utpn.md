# Referencia · Caso UTPN / KMA (`/es/casos/utpn`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/caso-utpn.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/05-CASOS.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1–2 · Tema: claro (white)
- Motion: Protagonista: pieza 11 (diagrama del caso).

## Notas para construirla
- El problema eran 'costos no identificados', no 'sin control'.
- Logo de UTPN: autorizado, archivo pendiente.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Cómo una red nacional de peajes bajó 60% su factura de Google Cloud
- Enlace/botón: "← Todos los casos" → `Casos.dc.html`
- span: CONSULTORÍA PROPIA
- span: Costos
- **H1:** Cómo una red nacional de peajes bajó 60% su factura de Google Cloud
- Texto: La factura de Google Cloud de UTPN crecía y no estaba identificado de dónde venía el sobrecosto. Encontré que la videovigilancia 24/7 salía a internet como transmisión en vivo y cambié la forma de acceder a las cámaras. La factura pasó de US$10.000 a unos US$4.000 al mes.
- **Espacio reservado:** Espacio para imagen o diagrama del caso — IMAGEN · Diagrama antes y después del acceso a las cámaras

### 2. Sección 2
- Lista repetida `{{ficha}}` (ver datos al final) con el patrón:
    - span: {{f.k}}
    - span: {{f.v}}
- Lista repetida `{{bloques}}` (ver datos al final) con el patrón:
    - span: {{b.k}}
    - Texto: {{b.v}}

### 3. Resultado
_fondo `#090812`_
- **H2:** Resultado
- Lista repetida `{{cifras}}` (ver datos al final) con el patrón:
    - span: {{x.metric}}
    - span: {{x.desc}}
- Texto: Fuente: Luis Reyes Vanegas, con autorización de UTPN / KMA.
- blockquote: [Testimonio real y verificable de UTPN / KMA, con su permiso]

### 4. ¿Tu factura de nube crece más rápido que tu negocio?
_fondo `#0055c2`_
- **H2:** ¿Tu factura de nube crece más rápido que tu negocio?
- Texto: Revisemos dónde se va el gasto.
- Enlace/botón: "Ver auditoría de costos" → `OptimizarCostos.dc.html`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
  "ficha": [
    {
      "k": "CLIENTE",
      "v": "UTPN / KMA"
    },
    {
      "k": "SECTOR",
      "v": "Red nacional de peajes"
    },
    {
      "k": "PAÍS",
      "v": "Colombia"
    },
    {
      "k": "MI ROL",
      "v": "Consultor de arquitectura cloud"
    },
    {
      "k": "PERIODO",
      "v": "2025"
    },
    {
      "k": "NUBE",
      "v": "Google Cloud"
    },
    {
      "k": "VOLUMEN",
      "v": "Videovigilancia 24/7, unos 15 TB diarios"
    }
  ],
  "bloques": [
    {
      "k": "CONTEXTO",
      "v": "El uso de la plataforma estaba justificado, pero no estaba identificado de dónde venía el sobrecosto de la factura. Además, cerca de la mitad de la capacidad contratada estaba en uso."
    },
    {
      "k": "HALLAZGO",
      "v": "La videovigilancia 24/7, unos 15 TB diarios, salía a internet como transmisión en vivo. Ese tráfico de salida disparaba la factura."
    },
    {
      "k": "DECISIÓN",
      "v": "Rediseñé el acceso a las cámaras para que se hiciera de forma remota, sin tráfico de salida, y ajusté la capacidad al uso real."
    },
    {
      "k": "DESPUÉS",
      "v": "El presupuesto liberado se convirtió en un contrato de soporte de largo plazo para sostener y mejorar la infraestructura."
    }
  ],
  "cifras": [
    {
      "metric": "−60%",
      "desc": "En la factura mensual de Google Cloud."
    },
    {
      "metric": "US$10.000",
      "desc": "Al mes antes de la auditoría."
    },
    {
      "metric": "US$4.000",
      "desc": "Al mes después de los cambios."
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
