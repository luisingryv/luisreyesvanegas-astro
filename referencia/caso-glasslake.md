# Referencia · Caso Glasslake (`/es/casos/glasslake`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/caso-glasslake.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/05-CASOS.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1–2 · Tema: claro (white)
- Motion: Protagonista: pieza 11 (diagrama del caso con datos que recorren el flujo).

## Notas para construirla
- Rol: Cloud Expert y administrador de la cuenta (Organizations e Identity Center, multitenant, Transit Gateway, VPN, endpoints, Inspector, costos y soporte). No ha sido 100 % Luis: el texto lo reconoce.
- El consumo mensual de Glasslake no se publica.
- Logo de Glasslake: autorizado, archivo pendiente.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Cómo Glasslake escala de forma segura en AWS
- Enlace/botón: "← Todos los casos" → `Casos.dc.html`
- span: CONSULTORÍA PROPIA
- span: Crecimiento · Programas · Seguridad
- **H1:** Cómo Glasslake escala de forma segura en AWS
- Texto: Glasslake es una startup de SAP de San Francisco con presencia global y una cuenta de AWS robusta, en pleno crecimiento. Como su Cloud Expert y administrador de la cuenta, me encargo de la arquitectura, las redes, la seguridad y los costos para que la infraestructura crezca con el negocio.
- **Espacio reservado:** Espacio para imagen o diagrama del caso — IMAGEN · Arquitectura de red en AWS

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
- Texto: Fuente: Luis Reyes Vanegas, con autorización de Glasslake. Montos de programas según elegibilidad.
- blockquote: [Testimonio real y verificable de Glasslake, con su permiso]

### 4. ¿Tu empresa está por crecer en la nube?
_fondo `#0055c2`_
- **H2:** ¿Tu empresa está por crecer en la nube?
- Texto: Revisemos si tu infraestructura aguanta y qué programas te corresponden.
- Enlace/botón: "Ver revisión de escalabilidad" → `EscalarInfraestructura.dc.html`

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
      "v": "Glasslake"
    },
    {
      "k": "SECTOR",
      "v": "Software para SAP"
    },
    {
      "k": "PAÍS",
      "v": "Estados Unidos (San Francisco), presencia global"
    },
    {
      "k": "MI ROL",
      "v": "Cloud Expert y administrador de la cuenta: arquitectura, redes, seguridad, costos y soporte"
    },
    {
      "k": "PERIODO",
      "v": "2025–hoy"
    },
    {
      "k": "NUBE",
      "v": "AWS"
    },
    {
      "k": "ALIADO",
      "v": "Nexa Connect, para el programa MAP"
    }
  ],
  "bloques": [
    {
      "k": "CONTEXTO",
      "v": "Glasslake ya tenía experiencia en AWS y una cuenta en pleno crecimiento. Necesitaba robustecerla con buenas prácticas: redes seguras hacia los entornos SAP de sus clientes, orden en los accesos y control de los costos."
    },
    {
      "k": "DECISIÓN",
      "v": "Centralicé las cuentas con AWS Organizations e IAM Identity Center: desde la cuenta principal se reparten los beneficios y programas y se manejan los pagos. Construí los entornos multitenant y las conexiones de red con Transit Gateway, VPN, endpoints y proxies hacia los clientes, y una infraestructura que crece en proporción a su costo de servicio."
    },
    {
      "k": "OPERACIÓN",
      "v": "Administro la cuenta: usuarios y accesos, cumplimiento de la seguridad con Amazon Inspector y monitoreo, revisión y proyección de costos, y soporte de los servicios."
    },
    {
      "k": "PROGRAMAS",
      "v": "Con nuestro aliado Nexa Connect, Glasslake accedió al programa MAP de AWS. Además, el equipo recibió 10 usuarios de Kiro con créditos."
    },
    {
      "k": "SEGURIDAD",
      "v": "Preparé la evidencia técnica en la nube para sus certificaciones. Glasslake obtuvo ISO 27001 y SOC 2: es un logro del cliente, con mi contribución técnica."
    }
  ],
  "cifras": [
    {
      "metric": "US$62.000",
      "desc": "En créditos de AWS por el programa MAP, con Nexa Connect."
    },
    {
      "metric": "−75 a −80%",
      "desc": "En el tráfico por NAT Gateway después de optimizar la red."
    },
    {
      "metric": "US$8.000",
      "desc": "En créditos para 10 usuarios de Kiro."
    },
    {
      "metric": "ISO 27001 · SOC 2",
      "desc": "Certificaciones logradas por Glasslake."
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
