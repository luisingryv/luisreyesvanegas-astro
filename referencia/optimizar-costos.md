# Referencia · Optimizar costos de nube (`/es/consultoria/optimizar-costos`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/optimizar-costos.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/02-CONSULTORIA.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: claro (white)
- Motion: Protagonista: la tarjeta de la pieza 02 de esta puerta (−60% con barra que baja). Sin calculadora de ahorro y sin la pieza 'factura que baja' (descartadas el 18 nov 2026).

## Notas para construirla
- El ahorro no se garantiza: respeta el texto del FAQ tal cual.
- Esta página es la plantilla de las subpáginas de puerta (Migración, Buenas prácticas y Seguridad la reutilizan).
- Caso Dappsco: pendiente de los informes de Luis; no se publica nada de Dappsco hasta tenerlos.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. ¿Tu factura de nube crece más rápido que tu negocio?
- Enlace/botón: "← Consultoría" → `Consultoria.dc.html`
- Eyebrow: 01 / 07 · OPTIMIZAR COSTOS
- **H1:** ¿Tu factura de nube crece más rápido que tu negocio?
- Texto: Reviso a fondo tu cuenta de AWS, Google Cloud o Azure, encuentro dónde se va el dinero y te entrego un plan para gastar menos sin poner en riesgo la operación.
- Enlace/botón: "Agendar sesión de arquitectura · US$450" → `Consultoria.dc.html#agenda`
- Enlace/botón: "Llamada de 20 min gratis" → `Consultoria.dc.html#agenda`

### 2. Señales de que este es tu caso
_fondo `#e5eef9`_
- **H2:** Señales de que este es tu caso
- Lista repetida `{{senales}}` (ver datos al final) con el patrón:
    - li: {{s}}

### 3. Auditoría de costos cloud
- Eyebrow: QUÉ RECIBES
- **H2:** Auditoría de costos cloud
- Lista repetida `{{entregables}}` (ver datos al final) con el patrón:
    - b: {{e.t}}
    - span: {{e.d}}
- Eyebrow: CÓMO LO HAGO
- **H2:** Proceso
- Lista repetida `{{proceso}}` (ver datos al final) con el patrón:
    - li: {{p.n}} {{p.t}} {{p.d}}
- span: Duración: [por confirmar según el tamaño de la cuenta]

### 4. Una red nacional de peajes baja su factura de Google Cloud
_fondo `#090812`_
- Eyebrow: CASO · UTPN / KMA · 2025
- **H2:** Una red nacional de peajes baja su factura de Google Cloud
- Texto: La videovigilancia 24/7, unos 15 TB diarios, salía a internet como transmisión en vivo. Cambiamos el acceso a las cámaras por escritorio remoto, sin tráfico de salida. La factura pasó de US$10.000 a US$4.000 al mes y el cliente firmó un contrato de soporte de largo plazo.
- Enlace/botón: "Ver el caso completo →" → `CasoUTPN.dc.html`
- span: −60%
- span: US$10.000 → US$4.000 al mes

### 5. Primero, una sesión de arquitectura
- Eyebrow: CÓMO EMPEZAR
- **H2:** Primero, una sesión de arquitectura
- Texto: 90 minutos y un memo con recomendaciones en 48 horas, por US$450. Si después seguimos con la auditoría, te descuento los US$450. El valor de la auditoría depende del tamaño de tu gasto mensual y te lo propongo después de la sesión.
- Eyebrow: SI VAS A MIGRAR
- b: AWS puede invertir en tu migración
- Texto: Si parte del ahorro pasa por cambiar de nube o reorganizar cargas en AWS, el programa MAP puede cofinanciar la migración, previa evaluación y aprobación de AWS.
- Enlace/botón: "Conoce el programa MAP →" → `ProgramasAWS.dc.html`

### 6. Preguntas frecuentes
- **H2:** Preguntas frecuentes
- Lista repetida `{{faq}}` (ver datos al final) con el patrón:
    - b: {{f.q}}
    - span: {{f.a}}

### 7. Revisemos tu factura juntos.
_fondo `#0055c2`_
- **H2:** Revisemos tu factura juntos.
- Enlace/botón: "Agendar sesión · Optimizar costos" → `Consultoria.dc.html#agenda`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      senales: [
        'La factura sube cada mes y nadie sabe explicar por qué.',
        'Pagas por servidores o bases de datos que casi no se usan.',
        'El tráfico de salida o las transferencias pesan mucho en la factura.',
        'No tienes alertas de presupuesto ni etiquetas por proyecto.',
        'Compraste capacidad para un pico que ya pasó.'
      ],
      entregables: [
        { t: 'Mapa del gasto', d: 'Dónde se va cada dólar, por servicio, proyecto y ambiente.' },
        { t: 'Lista de ahorros priorizada', d: 'Cada recomendación con su ahorro estimado, su riesgo y su esfuerzo.' },
        { t: 'Cambios de arquitectura', d: 'Cuando el ahorro grande está en el diseño y no en apagar recursos.' },
        { t: 'Control para que no vuelva a pasar', d: 'Alertas, presupuestos y etiquetas para seguir el gasto mes a mes.' }
      ],
      proceso: [
        { n: '01', t: 'Acceso de solo lectura', d: 'A tu cuenta y a tu facturación.' },
        { n: '02', t: 'Diagnóstico', d: 'Reviso el gasto, la arquitectura y el uso real.' },
        { n: '03', t: 'Informe y plan', d: 'Te presento los hallazgos y el orden en que conviene actuar.' },
        { n: '04', t: 'Implementación', d: 'La hace tu equipo con mi acompañamiento, o la hago yo.' }
      ],
      faq: [
        { q: '¿Necesitas acceso de escritura a mi cuenta?', a: 'No. Para la auditoría basta con acceso de solo lectura a la cuenta y a la facturación.' },
        { q: '¿Con qué nubes trabajas?', a: 'AWS, Google Cloud y Azure.' },
        { q: '¿El ahorro está garantizado?', a: 'No. Antes de revisar tu cuenta no puedo prometer un ahorro. En la evaluación, con acceso de solo lectura, identifico las oportunidades de optimización y te digo cuánto podrías ahorrar con cada una.' },
        { q: '¿Qué pasa después de la auditoría?', a: 'Puedes implementar con tu equipo o seguir conmigo con acompañamiento mensual.' }
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
