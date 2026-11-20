# Referencia · Contacto (`/es/contacto`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/contacto.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/07-SPEAKER-PRENSA-CONTACTO.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 1 · Tema: oscuro (night)
- Motion: Solo microinteracciones de formulario.

## Notas para construirla
- El formulario envía con Resend y crea el registro en el CRM de Notion; no hay analítica.
- WhatsApp corporativo: Luis lo entrega al desarrollar (va en configuración).
- El correo personal de Luis nunca se muestra.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. ¿Qué necesitas?
- Eyebrow: CONTACTO
- **H1:** ¿Qué necesitas?
- Texto: Elige la opción que más se parece a tu caso y te llevo al lugar indicado. Si ninguna encaja, escríbeme abajo.

### 2. Opciones de contacto
- Lista repetida `{{opciones}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{o.tag}} {{o.title}} {{o.desc}} {{o.cta}}" → `{{o.href}}`

### 3. Cuéntame qué estás construyendo.
_ancla `#general` · fondo `#001531`_
- Eyebrow: ESCRÍBEME
- **H2:** Cuéntame qué estás construyendo.
- Texto: Si prefieres, también puedes escribirme por WhatsApp.
- span: WhatsApp: [TU NÚMERO]
- Etiqueta de campo: "Nombre"
- Campo input (text)
- Etiqueta de campo: "Correo"
- Campo input (email)
- Etiqueta de campo: "Tema"
- Campo de selección: Conversación general / Contratación / Prensa / Otro
- Etiqueta de campo: "Mensaje"
- Campo textarea (texto)
- Campo input (checkbox)
- Enlace/botón: "política de privacidad" → `#legal`
- Botón: "Enviar"

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      opciones: [
        { tag: 'CONSULTORÍA', title: 'Tengo un problema en mi nube o quiero llevar la IA a mi equipo', desc: 'Costos, crecimiento, migración, seguridad o adopción de IA. Empezamos con una sesión de arquitectura o una llamada de 20 minutos.', cta: 'Agendar →', href: 'Consultoria.dc.html#agenda' },
        { tag: 'PROGRAMA MAP DE AWS', title: 'Quiero saber si AWS puede invertir en mi migración', desc: 'Evaluamos tu caso con Nexa Connect, partner de AWS. La inversión está sujeta a la aprobación previa de AWS.', cta: 'Evaluar mi elegibilidad →', href: 'ProgramasAWS.dc.html' },
        { tag: 'DESARROLLO DE SOFTWARE', title: 'Necesito desarrollo a la medida', desc: 'El desarrollo de software a la medida lo hace mi equipo en EvolutecC.', cta: 'Ir a EvolutecC ↗', href: 'https://evolutecc.com/?utm_source=luisreyesvanegas&utm_medium=referral&utm_campaign=contacto' },
        { tag: 'PRODUCTOS', title: 'Quiero usar o invertir en Trama AI', desc: 'Te mostramos una demo o te comparto la información de la empresa en privado.', cta: 'Ver productos →', href: 'Productos.dc.html' },
        { tag: 'CHARLAS', title: 'Quiero invitarte a un evento', desc: 'Keynote, workshop o panel sobre nube e IA.', cta: 'Invitarme a hablar →', href: 'Speaker.dc.html#invitar' },
        { tag: 'OTRO TEMA', title: 'Contratación, prensa o una conversación general', desc: 'Escríbeme en el formulario y te respondo.', cta: 'Escribir →', href: '#general' }
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

- [TU NÚMERO]
