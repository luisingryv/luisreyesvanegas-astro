# Referencia de diseño para el desarrollo

Material exportado del prototipo y del laboratorio de motion para que Claude Code construya el sitio. Es referencia, no código para copiar: el sitio se construye con los tokens y los componentes que define `../CLAUDE.md`. Las rutas son relativas a la carpeta `Desarrollo/`.

| Archivo | Qué es | Origen |
|---|---|---|
| `tokens-luis-reyes.json` | Tokens del sistema de diseño "Luis Reyes": colores, tipografía, radios y medidas de layout | Sistema de diseño del prototipo (Manual V-2025), exportado el 19 nov 2026 |
| `sobre-mi.md` | Estructura, textos, datos e imágenes de la página Sobre mí, tal como Luis la aprobó | Prototipo, página `SobreMi`, versión 1795117625-1f2a |
| `laboratorio-motion.html` | Laboratorio de motion completo: las 12 piezas (XPRIZE, logros, línea de tiempo por niveles, logo y medalla 3D, Elige tu misión, burbujas de casos, insignias, mapa de ciudades, diagrama de caso, competencias del CV). Se abre en el navegador | Artefacto "Laboratorio de motion", versión 1795056610-eb9b |

## De dónde sale cada imagen
- Fotos: `../Archivos/Fotos/` (ver `../Boveda/03_Contenido/Fotos/Banco de fotos.md` y `../Boveda/03_Contenido/Eventos-y-charlas/Charlas y eventos.md`). Las charlas tienen una carpeta por evento en `02_Escenario-y-charlas/AAAA-MM-DD_evento`; la portada de cada evento es la foto `_001`.
- Marca, logos e ícono: `../Archivos/Marca/Manual V-2025/` (SVG y PNG).
- Human Sans: `../Archivos/Marca/Manual V-2025/FONTS/Human Sans/` (OTF; se convierte a woff2).
- No se modifican ni se mueven los originales de `../Archivos`: se copian a `src/assets/` con su nombre.

## Cómo se actualiza esta carpeta
Cuando Luis apruebe un cambio en el prototipo o en el laboratorio, Mei vuelve a exportar la página o la pieza aquí y lo anota en `../Boveda/06_Desarrollo/Prototipo/Historial del prototipo.md`. Para cada página nueva que se desarrolle, Mei agrega su referencia (`<pagina>.md`) antes de que Claude Code empiece.
