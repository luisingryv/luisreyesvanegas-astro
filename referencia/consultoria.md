# Referencia · Consultoría (`/es/consultoria`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/consultoria.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/02-CONSULTORIA.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: claro (white)
- Motion: Protagonista: pieza 07 (Elige tu misión: las 7 puertas). Casos UTPN y Glasslake con pasos uno a uno y la cifra con la barra o el anillo de la pieza 02; los 4 pasos con una línea que avanza. Las piezas se diseñaron sobre night: en esta página clara usa la variante clara o deja oscura la sección de la pieza.

## Notas para construirla
- Las 7 puertas enlazan a sus subpáginas. Las que no tienen prototipo propio (Migración, Buenas prácticas, Seguridad y cumplimiento) usan la plantilla de subpágina de puerta (la misma de Optimizar costos y Escalar) con el contenido de la ficha 02; pregúntale a Luis antes de publicarlas.
- Programas y créditos lleva a `/programas-aws`.
- Solo se publica el precio de la sesión de arquitectura (US$450). Ningún otro precio.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. ¿Qué necesitas resolver en tu nube?
- Eyebrow: ARQUITECTURA CLOUD E IA
- **H1:** ¿Qué necesitas resolver en tu nube?
- Texto: Puede ser una factura que crece más rápido que tu negocio, una infraestructura que tiene que aguantar el doble de usuarios, una migración, una certificación de seguridad o un equipo que quiere trabajar con IA. Reviso tu caso, encuentro dónde está el problema y diseño la solución contigo.
- Enlace/botón: "Agendar sesión de arquitectura · US$450" → `#agenda`
- Enlace/botón: "Llamada de 20 min gratis" → `#agenda`

### 2. Siete formas de empezar
- Eyebrow: ELIGE TU MISIÓN
- **H2:** Siete formas de empezar
- Lista repetida `{{puertas}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{p.tag}} {{p.n}} / 07 {{p.dolor}} {{p.oferta}} {{p.prueba}} Hablemos de tu caso →" → `{{p.href}}`

### 3. Dos casos recientes
_fondo `#090812`_
- Eyebrow: CASOS
- **H2:** Dos casos recientes
- Lista repetida `{{casos}}` (ver datos al final) con el patrón:
    - span: {{c.tag}}
    - **H3:** {{c.title}}
    - span: {{c.metric}}
    - Lista repetida `{{c.pasos}}` (ver datos al final) con el patrón:
        - li: {{s.k}} {{s.v}}
    - span: {{c.who}}

### 4. Cuatro pasos
- Eyebrow: CÓMO TRABAJO
- **H2:** Cuatro pasos
- Lista repetida `{{pasos}}` (ver datos al final) con el patrón:
    - li: {{s.n}} {{s.title}} {{s.desc}}

### 5. Cómo podemos trabajar juntos
- Eyebrow: FORMAS DE TRABAJAR
- **H2:** Cómo podemos trabajar juntos
- Lista repetida `{{precios}}` (ver datos al final) con el patrón:
    - span: {{o.name}}
    - span: {{o.desc}}
- Texto: Todo empieza con la sesión de arquitectura: 90 minutos y un memo con recomendaciones en 48 horas, por US$450. Después definimos juntos la forma de trabajo que le sirve a tu caso. Cómo funciona la sesión · Acompañamiento mensual

### 6. Con qué respaldo llego
_fondo `#e5eef9`_
- Eyebrow: CREDENCIALES
- **H2:** Con qué respaldo llego
- Lista repetida `{{credenciales}}` (ver datos al final) con el patrón:
    - span: {{k}}
- Eyebrow: CON FRANQUEZA
- **H2:** No soy para ti si…
- li: Buscas el precio más bajo por hora.
- li: Quieres a alguien que solo cierre tickets.
- li: No puedes darme acceso de lectura a tu cuenta o a tu facturación.

### 7. Antes de agendar
- Eyebrow: PREGUNTAS FRECUENTES
- **H2:** Antes de agendar
- Lista repetida `{{faq}}` (ver datos al final) con el patrón:
    - span: {{f.q}}
    - span: {{f.a}}

### 8. Si tu consumo crece, AWS puede invertir en tu migración.
_fondo `#0055c2`_
- Eyebrow: PROGRAMA MAP DE AWS · CON NEXA CONNECT
- **H2:** Si tu consumo crece, AWS puede invertir en tu migración.
- Texto: Sujeto a la evaluación y aprobación previa de AWS, según los requisitos de cada programa.
- Enlace/botón: "Conoce el programa →" → `ProgramasAWS.dc.html`

### 9. Empecemos por tu caso.
_ancla `#agenda` · fondo `#090812`_
- Eyebrow: AGENDA
- **H2:** Empecemos por tu caso.
- b: Sesión de arquitectura · US$450
- Texto: 90 minutos y un memo con recomendaciones en 48 horas. Si después seguimos trabajando juntos, te descuento los US$450 del siguiente servicio.
- b: Llamada de 20 minutos · Gratis
- Texto: Para saber si puedo ayudarte y por dónde conviene empezar.
- Etiqueta de campo: "¿Qué quieres resolver?"
- Campo de selección: Optimizar costos / Crecer la infraestructura / Programas y créditos / Migrar / Buenas prácticas / Seguridad y cumplimiento / Adopción de IA en la empresa
- Etiqueta de campo: "Nube o nubes que usas"
- Campo input (text) · placeholder: AWS, Google Cloud, Azure…
- Etiqueta de campo: "Gasto mensual aproximado en la nube"
- Campo input (text) · placeholder: US$
- Etiqueta de campo: "Correo"
- Campo input (email)
- Botón: "Elegir fecha y hora"

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      puertas: [
        { n: '01', tag: 'OPTIMIZAR COSTOS', dolor: '¿Quieres optimizar tus costos y no sabes cómo?', oferta: 'Auditoría de costos cloud.', prueba: '−60% en Google Cloud', href: 'OptimizarCostos.dc.html' },
        { n: '02', tag: 'CRECER', dolor: '¿Vas a multiplicar usuarios y no sabes si tu infraestructura aguanta?', oferta: 'Revisión de escalabilidad y proyección de capacidad.', prueba: '≈2.400 → ≈70.000 pedidos al mes', href: 'EscalarInfraestructura.dc.html' },
        { n: '03', tag: 'PROGRAMAS DE AWS', dolor: '¿Tu consumo en la nube crece y no sabes que AWS puede invertir en tu migración?', oferta: 'Evaluación para el programa MAP, con Nexa Connect. Sujeta a la aprobación previa de AWS.', prueba: 'US$62.000 en créditos AWS (MAP)', href: 'ProgramasAWS.dc.html' },
        { n: '04', tag: 'MIGRAR', dolor: '¿Quieres llevar tus sistemas a la nube o cambiar de nube?', oferta: 'Plan de migración con el programa MAP y Nexa Connect.', prueba: 'Trama: Google Cloud → AWS', href: 'ProgramasAWS.dc.html' },
        { n: '05', tag: 'BUENAS PRÁCTICAS', dolor: '¿Funciona, pero no sabes si está bien hecho?', oferta: 'Revisión de arquitectura con los pilares de Well-Architected.', prueba: '13 años de sistemas en producción', href: '#agenda' },
        { n: '06', tag: 'SEGURIDAD Y CUMPLIMIENTO', dolor: '¿Quieres certificarte en ISO 27001 o SOC 2 y no sabes por dónde empezar?', oferta: 'Acompañamiento técnico en la nube hacia la certificación.', prueba: 'ISO 27001 y SOC 2 de un cliente', href: '#agenda' },
        { n: '07', tag: 'ADOPCIÓN DE IA', dolor: '¿Quieres que tu equipo trabaje con IA de verdad y no sabes por dónde empezar?', oferta: 'Programa de adopción de IA con Claude.', prueba: 'AI Fluency · Trama AI · XPRIZE 2026', href: 'AdopcionIA.dc.html' }
      ],
      casos: [
        { tag: 'REDUCIR', title: 'Una red nacional de peajes baja su factura de Google Cloud', metric: '−60%', who: 'UTPN / KMA · 2025', pasos: [
          { k: 'CONTEXTO', v: 'La factura crecía y no estaba identificado de dónde venía el sobrecosto, aunque el uso de la plataforma estaba justificado.' },
          { k: 'HALLAZGO', v: 'La videovigilancia 24/7 (≈15 TB diarios) salía a internet como transmisión en vivo.' },
          { k: 'DECISIÓN', v: 'Acceso remoto a las cámaras, sin tráfico de salida.' },
          { k: 'RESULTADO', v: 'La factura bajó de US$10.000 a unos US$4.000 al mes, y el cliente firmó un contrato de soporte de largo plazo.' }
        ]},
        { tag: 'ESCALAR', title: 'Una startup de SAP escala de forma segura en AWS', metric: 'US$62.000', who: 'Glasslake · 2025–hoy · Cloud Expert y administrador de la cuenta', pasos: [
          { k: 'CONTEXTO', v: 'Startup de SAP de San Francisco con presencia global, en pleno crecimiento y con experiencia en AWS: una cuenta robusta que tiene que escalar sin perder seguridad.' },
          { k: 'HALLAZGO', v: 'Había que robustecer la cuenta con buenas prácticas: redes seguras hacia los entornos de sus clientes, orden en los accesos y control de costos.' },
          { k: 'DECISIÓN', v: 'Organizations e IAM Identity Center para centralizar cuentas, beneficios y pagos; entornos multitenant; Transit Gateway, VPN y endpoints; seguridad con Amazon Inspector y monitoreo; revisión y proyección de costos.' },
          { k: 'RESULTADO', v: 'La cuenta crece con orden: créditos del programa MAP, tráfico por NAT Gateway 75–80% menor e ISO 27001 y SOC 2 logradas por el cliente, con mi contribución técnica.' }
        ]}
      ],
      pasos: [
        { n: '01', title: 'Diagnóstico', desc: 'Reviso tu cuenta y tu facturación con acceso de solo lectura y encuentro dónde está el problema o la oportunidad.' },
        { n: '02', title: 'Plan', desc: 'Te entrego la arquitectura propuesta, la proyección de capacidad y costos, y el orden en que conviene hacer cada cosa.' },
        { n: '03', title: 'Implementación', desc: 'Ejecuto con tu equipo o lo acompaño mientras ejecuta.' },
        { n: '04', title: 'Operación', desc: 'Si lo necesitas, te acompaño cada mes para sostener y mejorar lo que construimos.' }
      ],
      precios: [
        { name: 'Auditoría de costos cloud', desc: 'Dónde se va el gasto y qué hacer para reducirlo.' },
        { name: 'Revisión de escalabilidad y capacidad', desc: 'Si tu infraestructura soporta el crecimiento que esperas.' },
        { name: 'Revisión de arquitectura', desc: 'Un informe priorizado con los pilares de Well-Architected.' },
        { name: 'Evaluación de programas y créditos', desc: 'Qué programas de la nube te corresponden, incluido MAP.' },
        { name: 'Acompañamiento técnico ISO 27001 y SOC 2', desc: 'Los controles técnicos en la nube que pide la certificación.' },
        { name: 'Workshop de adopción de IA', desc: 'Tu equipo aprende a trabajar con Claude en su día a día.' },
        { name: 'Programa de adopción de IA con Claude', desc: 'Adopción por equipos, con acompañamiento.' },
        { name: 'Agentes para trabajos específicos', desc: 'Agentes a la medida cuando un proceso lo justifica.' },
        { name: 'Acompañamiento mensual', desc: 'Un arquitecto de cabecera para tu equipo, con dedicación acordada.' }
      ],
      credenciales: ['Ganador de categoría · XPRIZE 2026', 'Alianza con Nexa Connect · AWS MAP', 'CTO de EvolutecC · 400+ proyectos', '13 años de experiencia', 'Google Developer Groups', 'AI Fluency · Anthropic', 'Certificaciones cloud en curso', 'Speaker en Colombia, Ecuador y Perú'],
      faq: [
        { q: '¿Con qué nubes trabajas?', a: 'AWS, Google Cloud y Azure.' },
        { q: '¿En qué idiomas?', a: 'Español e inglés.' },
        { q: '¿Qué es el programa MAP y mi empresa califica?', a: 'Es el programa con el que AWS puede invertir en migraciones, previa evaluación y aprobación de tu caso: de on-premise, de otra nube o de cargas nuevas si ya estás en AWS. Lo evaluamos con Nexa Connect, partner de AWS. Todo el detalle está en la página del programa MAP.' },
        { q: '¿Cuál es la diferencia con EvolutecC?', a: 'Yo diseño la arquitectura y acompaño a tu equipo. El desarrollo de software a la medida lo hace EvolutecC.' },
        { q: '¿Cómo se factura?', a: 'Resido en Colombia y emito factura colombiana en la moneda de tu empresa. El pago se hace por transferencia bancaria en esa misma moneda.' },
        { q: '¿Firmas contrato y acuerdo de confidencialidad?', a: 'Sí. El acuerdo de confidencialidad protege la información confidencial de tu empresa y no limita mi trabajo con otros clientes. Si necesitas exclusividad, la acordamos entre las partes en el contrato.' }
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
