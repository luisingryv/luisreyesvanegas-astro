# Referencia · Caso Mandaos (`/es/casos/mandaos`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/caso-mandaos.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/05-CASOS.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1–2 · Tema: claro (white)
- Motion: Protagonista: pieza 11 (diagrama del caso; la API de Mandaos con datos que recorren el flujo).

## Notas para construirla
- Luis fue Head of Product: dirigió producto, equipo e integración con iFood. No reducir su rol a 'lideré la API'.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Cómo Mandaos pasó de unos 2.400 a unos 70.000 pedidos al mes con iFood
- Enlace/botón: "← Todos los casos" → `Casos.dc.html`
- span: STARTUP O PRODUCTO
- span: Crecimiento
- **H1:** Cómo Mandaos pasó de unos 2.400 a unos 70.000 pedidos al mes con iFood
- Texto: Mandaos era una startup de logística de última milla. Como Head of Product, convertí el producto en una plataforma con una API pública. Esa API fue la base de la integración con iFood y de un salto de casi 30 veces en pedidos.
- **Espacio reservado:** Espacio para imagen o mockup de la app de Mandaos — IMAGEN · App de Mandaos / Netivery

### 2. Sección 2
- Lista repetida `{{ficha}}` (ver datos al final) con el patrón:
    - span: {{f.k}}
    - span: {{f.v}}
- Lista repetida `{{bloques}}` (ver datos al final) con el patrón:
    - span: {{b.k}}
    - Texto: {{b.v}}
- span: iFood y otros comercios
- span: →
- span: API pública de Mandaos
- span: →
- span: Plataforma de despachos
- span: →
- span: App de mensajeros (Ionic)
- figcaption: Diagrama simplificado de la integración. [Diagrama de arquitectura completo por elaborar con Luis]

### 3. Resultado
_fondo `#090812`_
- **H2:** Resultado
- Lista repetida `{{cifras}}` (ver datos al final) con el patrón:
    - span: {{c.metric}}
    - span: {{c.desc}}
- Texto: Fuente: documentación de la API v2 de Mandaos.
- blockquote: [Testimonio real y verificable de alguien del equipo o de un cliente de Mandaos, con su permiso]

### 4. ¿Tu plataforma tiene que aguantar un salto así?
_fondo `#0055c2`_
- **H2:** ¿Tu plataforma tiene que aguantar un salto así?
- Texto: Revisemos tu arquitectura antes de que llegue el crecimiento.
- Enlace/botón: "Agendar sesión de arquitectura" → `Consultoria.dc.html#agenda`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      ficha: [
        { k: 'EMPRESA', v: 'Mandaos (luego Netivery)' },
        { k: 'SECTOR', v: 'Logística de última milla' },
        { k: 'PAÍS', v: 'Colombia' },
        { k: 'MI ROL', v: 'Desarrollador web y luego Head of Product, a cargo del producto y de las decisiones técnicas' },
        { k: 'EQUIPO', v: 'Equipo de producto de 6 personas' },
        { k: 'PERIODO', v: '2018–2020 (año del salto con iFood por confirmar)' },
        { k: 'TECNOLOGÍA', v: 'API pública de integraciones · app móvil migrada de Cordova a Ionic · AWS' }
      ],
      bloques: [
        { k: 'CONTEXTO', v: 'Mandaos era una startup de logística de última milla. Entré como desarrollador web y llegué a Head of Product, a cargo del producto y de las decisiones técnicas. El reto era pasar de un servicio de domicilios a una plataforma a la que otros negocios pudieran conectarse.' },
        { k: 'DECISIÓN', v: 'Diseñamos una API pública para que terceros se integraran por su cuenta y migramos la app móvil a Ionic. Farmacias y otros comercios empezaron a enviar sus pedidos directamente. Un piloto con iFood validó la API y, para soportar su demanda, aceleramos la nueva app, que pasó a llamarse Netivery.' },
        { k: 'LO QUE APRENDÍ', v: 'Fue un resultado de todo el equipo: tecnología, operación y estrategia. Con la pandemia, la salida de iFood nos mostró el riesgo de depender de un solo cliente.' }
      ],
      cifras: [
        { metric: '≈2.400', desc: 'Pedidos al mes antes de la integración.' },
        { metric: '≈70.000', desc: 'Pedidos al mes con la integración con iFood.' },
        { metric: '×29', desc: 'Crecimiento en pedidos mensuales.' }
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
