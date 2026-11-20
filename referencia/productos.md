# Referencia · Productos (`/es/productos`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/productos.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/03-PRODUCTOS.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 2 · Tema: oscuro (night)
- Motion: Protagonista: pieza 05 (medalla 3D). Pieza 02 en los logros de Trama; 'Así funciona Trama' como conversación de WhatsApp que se escribe sola (mensajes rotulados como demostración). La pieza 01 y la 05 nunca van en la misma página.

## Notas para construirla
- Andrés Martínez solo se nombra en esta página.
- Sin logos de XPRIZE, Google ni Gemini: la medalla es diseño propio.
- La landing de Trama (`/productos/trama`) se actualiza después; no hay prototipo nuevo todavía.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Agentes de IA que operan el inventario de tu empresa.
- Eyebrow: PRODUCTO DESTACADO · TRAMA AI
- **H1:** Agentes de IA que operan el inventario de tu empresa.
- Texto: Trama es un agente en WhatsApp que lleva el inventario y la operación de empresas textiles medianas: entradas, salidas, contabilidad y nómina en un solo flujo.
- span: Hecho por Trama AI, Corp. · Luis Reyes Vanegas (CEO), Gianfranco Castro (CTO), Johan Burgos (DevOps) y Najem Nabhan (PM)
- Enlace/botón: "Ver demo" → `#usar`
- Enlace/botón: "Soy inversionista" → `#invertir`
- Enlace/botón: "GANADOR DE CATEGORÍA Small Business Services Build with Gemini XPRIZE 2026" → `https://gxp.moonshots.com/`
- span: Fuente: gxp.moonshots.com

### 2. Así funciona Trama
- Eyebrow: QUÉ HACE Y CÓMO FUNCIONA
- **H2:** Así funciona Trama
- Lista repetida `{{pasos}}` (ver datos al final) con el patrón:
    - li: {{s.n}} {{s.title}} {{s.desc}}
- Lista repetida `{{modulos}}` (ver datos al final) con el patrón:
    - span: {{m}}
- **Espacio reservado:** Espacio para el video demo de Trama — VIDEO · Demo de 90 segundos con subtítulos

### 3. Lo que Trama ya logró
_fondo `#001531`_
- Eyebrow: LOGROS DEL PRODUCTO
- **H2:** Lo que Trama ya logró
- Lista repetida `{{logros}}` (ver datos al final) con el patrón:
    - span: {{l.metric}}
    - span: {{l.desc}}

### 4. Dos formas de acercarte a Trama
- **H2:** Dos formas de acercarte a Trama
- Eyebrow: PARA EMPRESAS
- **H3:** Quiero usar Trama en mi empresa
- Texto: Te mostramos el producto con un caso parecido al tuyo y vemos si resuelve tu operación.
- Enlace/botón: "Solicitar demo" → `#usar`
- Eyebrow: PARA INVERSIONISTAS
- **H3:** Quiero conocer la empresa
- Texto: Trama AI es una C corp de Delaware con su tabla de capitalización definida. La estructura societaria, el pool de acciones, el runway y los ingresos recurrentes los comparto en una conversación privada.
- Etiqueta de campo: "Tipo de inversionista"
- Campo de selección: Ángel / Fondo / Family office / Socio estratégico
- Etiqueta de campo: "País"
- Campo input (text)
- Etiqueta de campo: "Correo"
- Campo input (email)
- Botón: "Solicitar información"
- span: Esta página es informativa y no constituye una oferta de valores.

### 5. Productos propios y de aliados
_fondo `#ffffff`_
- Eyebrow: PORTAFOLIO
- **H2:** Productos propios y de aliados
- Lista repetida `{{productos}}` (ver datos al final) con el patrón:
    - span: {{p.owner}}
    - span: {{p.estado}}
    - **H3:** {{p.name}}
    - Texto: {{p.desc}}
    - Enlace/botón: "Usar el producto →" → `#usar`
    - Enlace/botón: "Invertir →" → `#invertir`
- b: Próximos productos
- span: Se suman a medida que firmamos con aliados estratégicos.

### 6. Ya escalamos un producto antes.
- Eyebrow: CONSTRUIMOS JUNTOS
- **H2:** Ya escalamos un producto antes.
- Texto: Andrés Martínez y yo trabajamos juntos en Mandaos, donde yo era Head of Product. Con la integración con iFood, la operación pasó de unos 2.400 a unos 70.000 pedidos al mes. Hoy seguimos creando productos juntos.
- **Espacio reservado:** Espacio para foto de Luis y Andrés — FOTO · Luis y Andrés · 04_Equipo

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      pasos: [
        { n: '01', title: 'Tu equipo escribe por WhatsApp', desc: 'Registra entradas, salidas y novedades sin aprender un sistema nuevo.' },
        { n: '02', title: 'El agente organiza la operación', desc: 'Actualiza el inventario y deja listo lo que necesitan contabilidad y nómina.' },
        { n: '03', title: 'La gerencia consulta en el momento', desc: 'Pregunta por existencias, movimientos y pendientes, y recibe la respuesta en la misma conversación.' }
      ],
      modulos: ['Inventario', 'Entradas y salidas', 'Contabilidad', 'Nómina'],
      logros: [
        { metric: '1.º de categoría', desc: 'Small Business Services en el Build with Gemini XPRIZE 2026.' },
        { metric: 'Top 100', desc: 'Entre 26.449 equipos de todo el mundo.' },
        { metric: '90 días', desc: 'El tiempo en que el equipo construyó el producto.' },
        { metric: '≈US$6.000', desc: 'En créditos de AWS para migrar de Google Cloud a AWS con el programa MAP.' }
      ],
      productos: [
        { name: 'Trama AI', owner: 'PROPIO · TRAMA AI, CORP.', estado: 'En producción', desc: 'Agentes de IA que operan el inventario y la operación de empresas con inventario físico. Empezó en la industria textil.' },
        { name: 'Ofilix', owner: 'ALIADO · ANDRÉS MARTÍNEZ · SOLUTEK', estado: 'En producción', desc: 'Plataforma de conversación empresarial: una bandeja para 9 canales con IA conversacional, CRM, gestión de servicios de TI y telefonía en la nube. ofilix.com' }
      ]
    };
  }
}
```

## Imágenes de esta página

| En el prototipo | Original |
|---|---|
| `/_blob/ac63bc5e…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg (logo horizontal para fondo oscuro)` |

Cópialas a `src/assets/` con su nombre y optimízalas con `astro:assets` (AVIF/WebP, `srcset`). Las fotos de eventos van en PhotoCard 4:3 sin recorte (fondo desenfocado detrás, ver `CLAUDE.md`). El encuadre (`object-position`) de cada foto está en los datos.

## Pendientes detectados en el prototipo

- Ninguno en el HTML.
