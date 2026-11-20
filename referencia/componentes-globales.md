# Referencia · Componentes globales y reglas comunes

Rutas relativas a la carpeta `Desarrollo/`. Exportado del prototipo aprobado el 20 nov 2026 (versión 1795147005-07ae). Aplica a todas las páginas.

## Rutas: del prototipo al sitio
En los HTML de `referencia/prototipo/` los enlaces apuntan a archivos del canvas. En el sitio van así (todas con prefijo de idioma `/es`, `/en`, `/pt`):

| Archivo del prototipo | Referencia | Ruta |
|---|---|---|
| `Main.dc.html` | `home.md` | `/` |
| `Consultoria.dc.html` | `consultoria.md` | `/consultoria` |
| `SesionArquitectura.dc.html` | `sesion-arquitectura.md` | `/consultoria/sesion-de-arquitectura` |
| `OptimizarCostos.dc.html` | `optimizar-costos.md` | `/consultoria/optimizar-costos` |
| `EscalarInfraestructura.dc.html` | `escalar-infraestructura.md` | `/consultoria/escalar-infraestructura` |
| (sin prototipo) | plantilla de `optimizar-costos.md` + ficha 02 | `/consultoria/migracion`, `/consultoria/buenas-practicas`, `/consultoria/seguridad-cumplimiento` |
| `AdopcionIA.dc.html` | `adopcion-ia.md` | `/consultoria/adopcion-ia` |
| `Retainers.dc.html` | `retainers.md` | `/consultoria/retainers` |
| `ProgramasAWS.dc.html` | `programas-aws.md` | `/programas-aws` |
| `Productos.dc.html` | `productos.md` | `/productos` |
| `Casos.dc.html` | `casos.md` | `/casos` |
| `CasoGlasslake.dc.html` · `CasoMandaos.dc.html` · `CasoUTPN.dc.html` | `caso-*.md` | `/casos/glasslake` · `/casos/mandaos` · `/casos/utpn` |
| `Eventos.dc.html` | `eventos.md` | `/eventos` |
| `Speaker.dc.html` | `speaker.md` | `/speaker` |
| `Prensa.dc.html` | `prensa.md` | `/prensa` |
| `Contacto.dc.html` | `contacto.md` | `/contacto` |
| `CV.dc.html` | `cv.md` | `/cv` |
| `SobreMi.dc.html` | `sobre-mi.md` | `/sobre-mi` |
| `Legal.dc.html` | `legal.md` | `/legal/privacidad` (ver nota en `legal.md`) |
| `#agenda` | — | Página de reservas de Google Calendar (URL en configuración; Luis la entrega) |

Sin prototipo todavía (no construir sin preguntar): `/productos/trama` (Luis la actualiza después), `/blog`, `/eventos/[slug]`, `/sobre-este-sitio`, y los casos de Trama, Fuerza Aérea (TIVIT) y Clínica del Caribe.

## Header
- Fondo según el tema de la página: night con logo blanco (`marca-h-color-blanco.svg`) o white con logo azul (`marca-h-color.svg`). Borde inferior hairline (`#24232c` en oscuro, `#e5eef9` en claro).
- Navegación: Consultoría · Productos · Casos · Eventos · Sobre mí. La página actual va en cyan-400 (oscuro) o blue-500 (claro), con subrayado de 2 px y `aria-current="page"`.
- Selector de idioma ES · EN · PT.
- **El botón de la derecha cambia según la página** (prop del Header):

| Página | Botón |
|---|---|
| Por defecto | Agendar sesión |
| Eventos, Charlas | Invitarme a hablar |
| Prensa | Pedir una entrevista |
| Programas AWS | Evaluar mi caso |

- **Header mínimo de landing** (CV y Adopción de IA): solo logo, idiomas y un botón ("Descargar CV" / "Hablemos de tu equipo"), sin navegación.
- En móvil: menú desplegable accesible (el prototipo no lo dibuja; propón el diseño a Luis).

## Footer
Logo blanco. Enlaces: LinkedIn (`https://www.linkedin.com/in/luis-carlos-reyes-vanegas-803306170/`) · Charlas · Prensa · Contacto · "Desarrollo a la medida: EvolutecC ↗" (`https://evolutecc.com/?utm_source=luisreyesvanegas&utm_medium=referral&utm_campaign=footer`) · Privacidad y términos. "© 2026 Luis Reyes Vanegas". Borde superior hairline.

## Componentes que se repiten
| Componente | Dónde | Nota |
|---|---|---|
| PhotoCard 4:3 sin recorte | Eventos, Charlas, Home, Sobre mí, Prensa | La foto completa (`object-fit: contain`) sobre la misma foto desenfocada y oscurecida de fondo. Nunca se corta una cabeza. |
| Cierre "¿Cómo puedo ayudarte?" | Sobre mí (y donde Luis lo pida) | Night con resplandor azul y la pieza 04 (logo 3D). Ver `sobre-mi.md`, sección 8. |
| Bloque de contacto con formulario | Home, Contacto | Envía con Resend y crea el registro en el CRM de Notion. |
| Tarjeta de logro (pieza 02) | Home, subpáginas de puertas, Productos, casos | La cifra final va escrita en el HTML; el contador solo la anima. Cada cifra lleva cliente, periodo y fuente. |
| Etiqueta de propiedad | Casos, Home | "Consultoría propia" · "Liderado con mi equipo en EvolutecC" · "Startup / Producto". |
| Hero con vidrio en móvil | Eventos | Variante `glass` del hero para pantallas ≤ 720 px. |

## Colores que el prototipo usa y no están en los tokens
`#c9c8ce` (texto secundario sobre night), `#a9a8ae` (texto terciario sobre night), `#24232c` (bordes en oscuro), `#001531` (tarjetas sobre night), `#cce6ff` (líneas finas sobre blanco), `#0a1a3f` y `#060b1c` (resplandor del cierre). Propón a Luis agregarlos como tokens antes de usarlos; no los escribas sueltos en componentes.

## Reglas de contenido que aplican a todas las páginas
- Los textos van tal cual el prototipo. Cifras solo las de la sección 6 del documento madre, con su fuente.
- Nunca "créditos gratis". Solo se publica el precio de la sesión de US$450.
- Sin logos de terceros (XPRIZE, AWS, Google, Gemini), salvo aliados con acuerdo firmado (Nexa Connect). Logos de clientes solo con permiso; mientras no estén los archivos, el nombre va en texto.
- Testimonios: solo reales. Las secciones con testimonios de ejemplo se ocultan hasta tenerlos.
- EvolutecC se presenta de forma formal. Andrés Martínez solo se nombra en Productos.
- El correo y los datos personales de Luis no aparecen en el sitio. WhatsApp: el corporativo, que Luis entrega.
- Lo que falte queda marcado como pendiente y se le pregunta a Luis; no se inventa.
- Todo texto entre corchetes en el prototipo (`[Nombre del organizador]`, `[Título de la noticia]`, `[TU NÚMERO]`) es de ejemplo: no se publica. La sección se oculta o queda vacía hasta tener el contenido real.
