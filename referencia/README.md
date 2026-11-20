# Referencia de diseño para el desarrollo

Material exportado del prototipo y del laboratorio de motion para que Claude Code construya **todo el sitio**. Es referencia, no código para copiar: el sitio se construye con los tokens y los componentes que define `../CLAUDE.md`. Las rutas son relativas a la carpeta `Desarrollo/`.

Exportación completa del prototipo aprobado: **20 nov 2026, versión 1795147005-07ae** del canvas "Prototipo luisreyesvanegas.com".

## Cómo usar esta carpeta
1. Antes de construir cualquier página, lee `componentes-globales.md` (rutas, header, footer, componentes comunes, reglas).
2. Lee la referencia de la página (`<pagina>.md`): ficha, fase, motion, notas que el HTML no dice, estructura, textos, datos e imágenes con su archivo original.
3. Abre su HTML en `prototipo/` cuando necesites el detalle exacto: es la fuente de los textos, el orden y las medidas. Se abre en el navegador, aunque las imágenes no cargan fuera del canvas (sus originales están mapeados en cada `.md`).
4. Si la referencia, la ficha o el prototipo no coinciden, o falta algo, pregúntale a Luis antes de seguir.

## Archivos

| Archivo | Qué es |
|---|---|
| `componentes-globales.md` | Rutas del prototipo al sitio, header (con el botón que cambia por página), footer, componentes que se repiten, colores fuera de los tokens y reglas de contenido |
| `tokens-luis-reyes.json` | Tokens del sistema de diseño "Luis Reyes": colores, tipografía, radios y medidas de layout |
| `laboratorio-motion.html` | Laboratorio de motion: las 12 piezas. Se abre en el navegador |
| `prototipo/*.html` | Las 20 páginas del prototipo, exactas, exportadas el 20 nov 2026 |
| `sobre-mi.md` | Sobre mí (ya en desarrollo; referencia escrita a mano y actualizada el 19 nov) |
| `home.md` | Home `/` |
| `consultoria.md` | Consultoría `/consultoria` |
| `sesion-arquitectura.md` | Sesión de arquitectura (único precio publicado: US$450) |
| `optimizar-costos.md` | Puerta Optimizar costos; plantilla de las subpáginas de puerta |
| `escalar-infraestructura.md` | Puerta Escalar la infraestructura |
| `adopcion-ia.md` | Adopción de IA con Claude |
| `retainers.md` | Acompañamiento mensual |
| `programas-aws.md` | Programa MAP con Nexa Connect |
| `productos.md` | Productos |
| `casos.md`, `caso-glasslake.md`, `caso-mandaos.md`, `caso-utpn.md` | Índice de casos y los tres casos con página |
| `eventos.md` | Eventos |
| `speaker.md` | Charlas (speaker kit) |
| `prensa.md` | Prensa |
| `contacto.md` | Contacto |
| `cv.md` | CV |
| `legal.md` | Privacidad y términos |

## De dónde sale cada imagen
- Cada `.md` trae la tabla "Imágenes de esta página" con el archivo original en `../Archivos/`, y en los datos de las listas las rutas ya apuntan al original.
- Fotos: `../Archivos/Fotos/`. Las charlas tienen una carpeta por evento en `02_Escenario-y-charlas/AAAA-MM-DD_evento`; la portada es la foto `_001`. Retratos en `01_Retratos/`; equipo en `04_Equipo/`; banners y renders web en `_proceso/web/banners/`.
- Marca y logos: `../Archivos/Marca/Manual V-2025/` (SVG y PNG). Human Sans: `FONTS/Human Sans/` (OTF; se convierte a woff2).
- No se modifican ni se mueven los originales de `../Archivos`: se copian a `src/assets/` con su nombre.
- Faltan: logo de Nexa Connect, logos de UTPN y Glasslake (autorizados), foto del hero de Charlas y fotos de prensa por confirmar.

## Cómo se actualiza esta carpeta
Cuando Luis apruebe un cambio en el prototipo o en el laboratorio, Mei vuelve a exportar la página aquí (el `.html` de `prototipo/` y su `.md`) y lo anota en `../Boveda/06_Desarrollo/Prototipo/Historial del prototipo.md`. Si la página ya está construida, el cambio se hace en el código con Claude Code.
