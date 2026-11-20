# Referencia · Privacidad y términos (`/es/legal/privacidad`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/legal.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Legal/Política de datos y términos de uso.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: claro (white)
- Motion: Ninguno.

## Notas para construirla
- El sitemap prevé `/legal/privacidad` y `/legal/terminos`; el prototipo los une en una página. Pregúntale a Luis cuál prefiere antes de construir.
- Los textos legales completos están en los .docx de `../Boveda/02_Sitio-web/Legal/`.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Privacidad y términos
- Eyebrow: LEGAL
- **H1:** Privacidad y términos
- Texto: Cómo trato tus datos personales y las reglas de uso de este sitio. Vigente desde [fecha de publicación].
- Enlace/botón: "Política de datos personales" → `#privacidad`
- Enlace/botón: "Términos de uso" → `#terminos`

### 2. Política de tratamiento de datos personales
_ancla `#privacidad`_
- **H2:** Política de tratamiento de datos personales
- Lista repetida `{{privacidad}}` (ver datos al final) con el patrón:
    - **H3:** {{s.t}}
    - Texto: {{s.d}}
- Enlace/botón: "Descargar la política completa (PDF)" → `#privacidad`

### 3. Términos de uso
_ancla `#terminos` · fondo `#f5f8fd`_
- **H2:** Términos de uso
- Lista repetida `{{terminos}}` (ver datos al final) con el patrón:
    - **H3:** {{s.t}}
    - Texto: {{s.d}}

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
  "privacidad": [
    {
      "t": "Responsable",
      "d": "Luis Carlos Reyes Vanegas, persona natural, [documento], con domicilio en [ciudad], Colombia. Correo para asuntos de privacidad: [correo de privacidad]."
    },
    {
      "t": "Qué datos recogemos y para qué",
      "d": "Los que nos das en los formularios de contacto, agenda, charlas e información de productos, y por WhatsApp, para responderte, agendar sesiones, evaluar invitaciones y enviarte la información que pediste. También datos de navegación para mejorar el sitio."
    },
    {
      "t": "Autorización",
      "d": "Cada formulario te pide aceptar esta política antes de enviarlo. Guardamos prueba de esa autorización."
    },
    {
      "t": "Quién más accede",
      "d": "Proveedores que operan el sitio por cuenta nuestra (alojamiento, agenda, CRM, mensajería y analítica), solo con lo necesario. No vendemos tus datos."
    },
    {
      "t": "Datos fuera de Colombia",
      "d": "Algunos proveedores guardan datos en Estados Unidos o la Unión Europea, países que la SIC reconoce con un nivel adecuado de protección."
    },
    {
      "t": "Tus derechos",
      "d": "Conocer, actualizar, rectificar y suprimir tus datos, pedir prueba de la autorización, revocarla y presentar quejas ante la Superintendencia de Industria y Comercio."
    },
    {
      "t": "Cómo ejercerlos",
      "d": "Escribe al correo de privacidad. Respondemos consultas en hasta 10 días hábiles y reclamos en hasta 15, como dice la Ley 1581 de 2012."
    },
    {
      "t": "Cuánto tiempo los guardamos",
      "d": "Mientras sean necesarios para la finalidad y, sin relación activa, hasta [24 meses] desde el último contacto, salvo obligación legal."
    },
    {
      "t": "Seguridad",
      "d": "Conexión cifrada, acceso restringido, autenticación de dos factores y proveedores con certificaciones de seguridad."
    },
    {
      "t": "Visitantes de otros países",
      "d": "Si vives en la Unión Europea o en California, también reconocemos los derechos que te dan sus leyes. Escríbenos al mismo correo."
    }
  ],
  "terminos": [
    {
      "t": "Para qué sirve el sitio",
      "d": "Presenta mi trayectoria, mis servicios, mis charlas y los productos en los que participo. Es informativo y no reemplaza una propuesta firmada."
    },
    {
      "t": "Servicios y precios",
      "d": "Solo la sesión de arquitectura tiene precio publicado (US$450). Lo demás se cotiza después de conocer tu caso. El desarrollo a la medida lo presta EvolutecC."
    },
    {
      "t": "Resultados y cifras",
      "d": "Los casos son reales y se publican con permiso. No garantizan el mismo resultado en tu caso. Los incentivos, fondos y beneficios de apoyo de Amazon Web Services están sujetos a evaluación, validación y aprobación previa por parte de Amazon Web Services. Su disponibilidad dependerá del cumplimiento de los requisitos y criterios de elegibilidad establecidos por AWS para cada programa y proyecto. La presentación de una solicitud no garantiza la aprobación y asignación."
    },
    {
      "t": "Productos e inversión",
      "d": "Nada en el sitio es una oferta pública de valores ni una invitación a invertir."
    },
    {
      "t": "Propiedad intelectual",
      "d": "El contenido es mío o se usa con autorización. Las marcas de terceros pertenecen a sus dueños y mencionarlas no implica patrocinio."
    },
    {
      "t": "Uso adecuado",
      "d": "No envíes información falsa, no intentes acceder sin permiso a los sistemas y no uses los formularios para publicidad no solicitada."
    },
    {
      "t": "Enlaces y responsabilidad",
      "d": "No controlo los sitios de terceros enlazados. El sitio se ofrece tal como está."
    },
    {
      "t": "Ley aplicable",
      "d": "Estos términos se rigen por las leyes de Colombia. Contacto: [correo de contacto]."
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
