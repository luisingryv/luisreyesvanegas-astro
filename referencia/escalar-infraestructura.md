# Referencia · Escalar la infraestructura (`/es/consultoria/escalar-infraestructura`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/escalar-infraestructura.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/02-CONSULTORIA.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: claro (white)
- Motion: Protagonista: la tarjeta de la pieza 02 de esta puerta (×29 de Mandaos).

## Notas para construirla
- Glasslake se presenta como una cuenta robusta que escala, con Luis como Cloud Expert y administrador de la cuenta. Su consumo mensual no se publica.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. ¿Vas a multiplicar usuarios y no sabes si tu infraestructura aguanta?
- Enlace/botón: "← Consultoría" → `Consultoria.dc.html`
- Eyebrow: 02 / 07 · CRECER LA INFRAESTRUCTURA
- **H1:** ¿Vas a multiplicar usuarios y no sabes si tu infraestructura aguanta?
- Texto: Reviso tu arquitectura antes de que llegue el crecimiento: proyecto la capacidad que vas a necesitar, encuentro los cuellos de botella y diseño una infraestructura que crece en proporción a lo que facturas.
- Enlace/botón: "Agendar sesión de arquitectura · US$450" → `Consultoria.dc.html#agenda`
- Enlace/botón: "Llamada de 20 min gratis" → `Consultoria.dc.html#agenda`

### 2. Señales de que este es tu caso
_fondo `#e5eef9`_
- **H2:** Señales de que este es tu caso
- Lista repetida `{{senales}}` (ver datos al final) con el patrón:
    - li: {{x}}

### 3. Revisión de escalabilidad y capacidad
- Eyebrow: QUÉ RECIBES
- **H2:** Revisión de escalabilidad y capacidad
- Lista repetida `{{entregables}}` (ver datos al final) con el patrón:
    - b: {{e.t}}
    - span: {{e.d}}
- Eyebrow: CÓMO LO HAGO
- **H2:** Proceso
- Lista repetida `{{proceso}}` (ver datos al final) con el patrón:
    - li: {{p.n}} {{p.t}} {{p.d}}
- span: Duración: [por confirmar según el tamaño de la plataforma]

### 4. Una startup de SAP crece de forma segura en AWS
_fondo `#090812`_
- Eyebrow: CASO · GLASSLAKE · 2025–2026
- **H2:** Una startup de SAP crece de forma segura en AWS
- Texto: Glasslake, una startup de SAP de San Francisco con presencia global, estaba dando sus primeros pasos en AWS mientras crecía. Diseñé redes seguras hacia los entornos SAP de sus clientes, ordené los accesos con IAM y optimicé la red: el tráfico por NAT Gateway bajó entre 75 y 80%.
- Enlace/botón: "Ver el caso completo →" → `CasoGlasslake.dc.html`
- span: US$62.000
- span: En créditos de AWS por el programa MAP, con el aliado Nexa Connect.

### 5. Primero, una sesión de arquitectura
- Eyebrow: CÓMO EMPEZAR
- **H2:** Primero, una sesión de arquitectura
- Texto: 90 minutos y un memo con recomendaciones en 48 horas, por US$450. Si después seguimos con la revisión de escalabilidad, te descuento los US$450. El valor de la revisión depende del tamaño de tu plataforma y te lo propongo después de la sesión.
- Eyebrow: SI ESTÁS EN AWS
- b: Tu crecimiento puede abrir programas de AWS
- Texto: Si tu consumo crece, AWS puede invertir en tu migración o en cargas nuevas con el programa MAP, previa evaluación y aprobación de AWS.
- Enlace/botón: "Conoce el programa MAP →" → `ProgramasAWS.dc.html`

### 6. Preguntas frecuentes
- **H2:** Preguntas frecuentes
- Lista repetida `{{faq}}` (ver datos al final) con el patrón:
    - b: {{f.q}}
    - span: {{f.a}}

### 7. Prepara tu plataforma antes de que llegue el crecimiento.
_fondo `#0055c2`_
- **H2:** Prepara tu plataforma antes de que llegue el crecimiento.
- Enlace/botón: "Agendar sesión · Escalar" → `Consultoria.dc.html#agenda`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
  "senales": [
    "Vas a lanzar en un mercado nuevo o a sumar un cliente grande.",
    "Cada pico de tráfico es una noche sin dormir.",
    "Escalar significa comprar servidores más grandes.",
    "No sabes cuánto te cuesta servir a cada usuario.",
    "La base de datos es el primer sospechoso cuando algo falla."
  ],
  "entregables": [
    {
      "t": "Proyección de capacidad",
      "d": "Usuarios, carga y costo por usuario en los próximos escenarios de crecimiento."
    },
    {
      "t": "Mapa de cuellos de botella",
      "d": "Qué se rompe primero y por qué, con evidencia de pruebas de carga."
    },
    {
      "t": "Arquitectura objetivo",
      "d": "Autoescalado, servicios administrados y el orden en que conviene migrar cada pieza."
    },
    {
      "t": "Costo que crece con el negocio",
      "d": "Una infraestructura cuyo costo sube en proporción a tus ingresos, no antes."
    }
  ],
  "proceso": [
    {
      "n": "01",
      "t": "Acceso de solo lectura",
      "d": "A tu cuenta, a tus métricas y a tu facturación."
    },
    {
      "n": "02",
      "t": "Pruebas y diagnóstico",
      "d": "Pruebas de carga y revisión de la arquitectura actual."
    },
    {
      "n": "03",
      "t": "Plan de crecimiento",
      "d": "Arquitectura objetivo, proyección de costos y prioridades."
    },
    {
      "n": "04",
      "t": "Implementación",
      "d": "Con tu equipo, con mi acompañamiento o hecha por mí."
    }
  ],
  "faq": [
    {
      "q": "¿Trabajas solo con AWS?",
      "a": "No. También con Google Cloud y Azure."
    },
    {
      "q": "¿Hacen falta pruebas de carga?",
      "a": "Casi siempre. Son la forma de saber qué se rompe antes de que lo descubran tus usuarios."
    },
    {
      "q": "¿Y si ya estamos en producción con mucho tráfico?",
      "a": "Mejor. Los cambios se planean por etapas para no detener la operación."
    },
    {
      "q": "¿Qué pasa después de la revisión?",
      "a": "Puedes implementar con tu equipo o seguir conmigo con acompañamiento mensual."
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
