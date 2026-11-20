# Referencia · Casos (`/es/casos`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/casos.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/05-CASOS.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1–2 · Tema: claro (white)
- Motion: Filtros que reacomodan las tarjetas con animación; cifras con contador.

## Notas para construirla
- Orden de los casos (Luis, 18 nov 2026): Trama, Fuerza Aérea (TIVIT), Clínica del Caribe, UTPN, Glasslake, Mandaos. Sin Ara y sin el caso de 30M.
- Solo UTPN, Glasslake y Mandaos tienen página de caso en el prototipo. Trama, Fuerza Aérea y Clínica del Caribe quedan como tarjeta sin enlace hasta que Luis entregue el material (T-218).
- UTPN y Glasslake autorizaron; sus logos están pendientes. Mientras tanto, nombre en texto.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Casos de éxito
- Eyebrow: CASOS
- **H1:** Casos de éxito
- Texto: Proyectos en los que estuve, con el problema que había, lo que decidimos y el resultado medido. Cada caso dice si fue una consultoría mía, un producto o un proyecto que lideré con mi equipo en EvolutecC.

### 2. Filtros
- span: TEMA
- Lista repetida `{{temas}}` (ver datos al final) con el patrón:
    - Botón: "{{t.name}}"
- span: TIPO
- Lista repetida `{{tipos}}` (ver datos al final) con el patrón:
    - Botón: "{{t.name}}"

### 3. Lista de casos
- Lista repetida `{{casos}}` (ver datos al final) con el patrón:
    - Enlace/botón: "IMAGEN · {{c.name}} {{c.tipo}} {{c.tema}} {{c.metric}} {{c.title}} {{c.who}} Ver caso →" → `{{c.href}}`

### 4. ¿Tienes un problema parecido?
_fondo `#090812`_
- **H2:** ¿Tienes un problema parecido?
- Enlace/botón: "Agendar sesión de arquitectura" → `Consultoria.dc.html#agenda`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    var on = { bg: '#0055c2', fg: '#ffffff' };
    var off = { bg: '#ffffff', fg: '#0055c2' };
    return {
      temas: [
        { name: 'Todos', bg: on.bg, fg: on.fg }, { name: 'Costos', bg: off.bg, fg: off.fg }, { name: 'Crecimiento', bg: off.bg, fg: off.fg }, { name: 'Programas', bg: off.bg, fg: off.fg },
        { name: 'Migración', bg: off.bg, fg: off.fg }, { name: 'Buenas prácticas', bg: off.bg, fg: off.fg }, { name: 'Seguridad', bg: off.bg, fg: off.fg }, { name: 'IA', bg: off.bg, fg: off.fg }
      ],
      tipos: [
        { name: 'Todos', bg: on.bg, fg: on.fg }, { name: 'Consultoría propia', bg: off.bg, fg: off.fg }, { name: 'Startup o producto', bg: off.bg, fg: off.fg }, { name: 'Liderado con mi equipo en EvolutecC', bg: off.bg, fg: off.fg }
      ],
      casos: [
        { name: 'Trama AI', tipo: 'STARTUP O PRODUCTO', tema: 'Migración · Programas', metric: '≈US$6.000', title: 'Trama AI migra de Google Cloud a AWS con el programa MAP', who: 'Trama AI', href: '#trama' },
        { name: 'Fuerza Aérea Colombiana', tipo: 'LIDERADO CON MI EQUIPO EN EVOLUTECC', tema: 'Migración', metric: '[Cifra pendiente]', title: 'Soluciones en la nube para la Fuerza Aérea Colombiana, como aliados de TIVIT', who: 'Fuerza Aérea Colombiana · TIVIT · 2023', href: '#fac' },
        { name: 'Clínica del Caribe', tipo: 'STARTUP O PRODUCTO', tema: 'Buenas prácticas', metric: '10+ años', title: 'El sistema de incidencias clínicas pasa a la web y sigue en uso', who: 'Clínica del Caribe · 2016', href: '#sigc' },
        { name: 'UTPN / KMA', tipo: 'CONSULTORÍA PROPIA', tema: 'Costos', metric: '−60%', title: 'Una red nacional de peajes baja su factura de Google Cloud', who: 'UTPN / KMA · 2025', href: 'CasoUTPN.dc.html' },
        { name: 'Glasslake', tipo: 'CONSULTORÍA PROPIA', tema: 'Crecimiento · Seguridad', metric: 'US$62.000', title: 'Una startup de SAP escala de forma segura en AWS', who: 'Glasslake · 2025–hoy', href: 'CasoGlasslake.dc.html' },
        { name: 'Mandaos', tipo: 'STARTUP O PRODUCTO', tema: 'Crecimiento', metric: '≈70.000', title: 'De unos 2.400 a unos 70.000 pedidos al mes con iFood', who: 'Mandaos / Netivery', href: 'CasoMandaos.dc.html' }
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
