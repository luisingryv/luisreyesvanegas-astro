# Referencia · Adopción de IA con Claude (`/es/consultoria/adopcion-ia`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/adopcion-ia.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/02-CONSULTORIA.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: proyección · Tema: oscuro (night)
- Motion: Solo apariciones suaves.

## Notas para construirla
- Luis la aprobó tal cual el 18 nov 2026.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. Que tu equipo trabaje con IA todos los días, no solo cuando se acuerda.
- Eyebrow: ADOPCIÓN DE IA CON CLAUDE
- **H1:** Que tu equipo trabaje con IA todos los días, no solo cuando se acuerda.
- Texto: Acompaño a empresas a llevar su trabajo diario a Claude de forma segura: decidir qué delegar, montar proyectos con las instrucciones y los datos correctos, y que las personas se concentren en lo que necesita criterio humano.
- Enlace/botón: "Hablemos de tu equipo" → `#empezar`
- Enlace/botón: "Cómo trabajo" → `#4d`

### 2. El framework 4D de Anthropic
_ancla `#4d` · fondo `#001531`_
- Eyebrow: EL MÉTODO
- **H2:** El framework 4D de Anthropic
- Texto: Es la base de mi certificación en AI Fluency. Lo uso para que la adopción no dependa de una herramienta de moda sino de cómo trabaja tu gente.
- Lista repetida `{{cuatroD}}` (ver datos al final) con el patrón:
    - span: {{d.l}}
    - b: {{d.name}}
    - span: {{d.desc}}

### 3. De la primera conversación al trabajo delegado
- Eyebrow: LO QUE TU EQUIPO APRENDE
- **H2:** De la primera conversación al trabajo delegado
- Lista repetida `{{temas}}` (ver datos al final) con el patrón:
    - b: {{t.name}}
    - span: {{t.desc}}

### 4. Tres etapas
_fondo `#ffffff`_
- Eyebrow: CÓMO AVANZAMOS
- **H2:** Tres etapas
- Lista repetida `{{etapas}}` (ver datos al final) con el patrón:
    - li: {{e.n}} {{e.name}} {{e.desc}}

### 5. Este sitio se construyó así
- Eyebrow: LO APLICO CONMIGO
- **H2:** Este sitio se construyó así
- Texto: La estrategia de mi marca, el contenido y este prototipo los trabajé con Claude como compañero de pensamiento: un proyecto con instrucciones, un documento madre como fuente de verdad, skills para registrar cada decisión y conectores a mis herramientas. Es el mismo método que llevo a tu equipo.
- Eyebrow: CERTIFICACIONES
- Lista repetida `{{certs}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{c.name}} Anthropic · Claude Academy · oct 2026 Verificar ↗" → `{{c.url}}`

### 6. Empecemos por cómo trabaja tu equipo hoy.
_ancla `#empezar` · fondo `#0055c2`_
- **H2:** Empecemos por cómo trabaja tu equipo hoy.
- Texto: En la sesión de arquitectura revisamos tus procesos y te digo por dónde conviene empezar.
- Enlace/botón: "Agendar sesión · US$450" → `Consultoria.dc.html#agenda`
- Enlace/botón: "Llamada de 20 min gratis" → `Consultoria.dc.html#agenda`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    return {
      cuatroD: [
        { l: 'D', name: 'Delegación', desc: 'Decidir qué tareas le das a la IA, cuáles haces con ella y cuáles siguen siendo tuyas.' },
        { l: 'D', name: 'Descripción', desc: 'Explicarle a Claude el contexto, el objetivo y el formato, como a un buen colega.' },
        { l: 'D', name: 'Discernimiento', desc: 'Revisar con criterio lo que entrega: qué está bien, qué falta y qué no es cierto.' },
        { l: 'D', name: 'Diligencia', desc: 'Usarla con responsabilidad: datos sensibles, transparencia y quién responde por el resultado.' }
      ],
      temas: [
        { name: 'La conversación', desc: 'Usar a Claude como compañero de pensamiento para decidir, no solo para preguntar.' },
        { name: 'Proyectos', desc: 'Un espacio por tema con sus instrucciones y documentos, para no repetir el contexto cada vez.' },
        { name: 'Conectores', desc: 'Claude trabaja con tu correo, tu calendario, tu Drive o tu CRM, con los permisos que tú defines.' },
        { name: 'Skills', desc: 'Los procesos de tu empresa escritos una vez para que Claude los siga siempre igual.' },
        { name: 'Artefactos', desc: 'Documentos, tableros, presentaciones y prototipos que se crean y se comparten desde la conversación.' },
        { name: 'Trabajo delegado', desc: 'Tareas de varios pasos que Claude completa por su cuenta mientras tú haces otra cosa.' },
        { name: 'Plugins', desc: 'Paquetes de skills, conectores y comandos para un área de la empresa.' },
        { name: 'Claude Code', desc: 'Para equipos técnicos: desarrollo de software con un agente que trabaja en el código.' }
      ],
      etapas: [
        { n: '01', name: 'Workshop 4D', desc: 'Una jornada con tu equipo para entender el método y probarlo con sus propias tareas.' },
        { n: '02', name: 'Programa de adopción', desc: 'Por equipos: mapeamos el día a día, decidimos qué delegar y montamos los proyectos, skills y conectores.' },
        { n: '03', name: 'Acompañamiento', desc: 'Seguimiento mensual para medir el uso, ajustar y sumar nuevos procesos.' }
      ],
      certs: [
        { name: 'AI Fluency for small businesses', url: 'https://academy.claude.com/verify/25a6c43b56569653dbd1107817d19cd8' },
        { name: 'Claude 101', url: 'https://academy.claude.com/verify/2ef58f9fd0d519c601075445741c464b' },
        { name: 'Introduction to Claude Cowork', url: 'https://academy.claude.com/verify/b56b13366f0e51dfdfe4bb5a66848762' }
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
