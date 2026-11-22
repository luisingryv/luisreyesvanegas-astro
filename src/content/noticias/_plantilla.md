---
# Plantilla: los archivos que empiezan por _ no se cargan. Copia este archivo sin el _ inicial,
# con el nombre AAAA-MM-DD-tema-corto.md (ese nombre es la URL: /es/noticias/AAAA-MM-DD-tema-corto).
# Reglas (decisiones del 12 y 21 nov 2026):
# - Solo se publica lo que Luis aprueba: nace como borrador y Luis lo pasa a publicada.
# - Es una lectura propia de la noticia, con redacción humana: no se copia el texto del medio
#   y la fuente va citada y enlazada.
# - Portada (estilo C, elegido por Luis el 22 nov 2026): una foto de la noticia en dos tonos con la
#   cifra principal en grande, sin los colores ni el logo de Luis. La foto necesita permiso de
#   reutilización (kit de prensa con permiso, dominio público o licencia abierta) y lleva crédito.
#   Sin foto con permiso, el fondo es una ilustración propia. Se genera con
#   scripts/noticias/portada.mjs --duotono, que agrega imagen, imagenAlt y el crédito.
titulo: 'Título claro, de hasta 110 caracteres'
resumen: 'Qué pasó y por qué importa, en una frase de 50 a 170 caracteres para la bajada y buscadores.'
fecha: 2026-11-21
idioma: es
estado: borrador
fuente:
  nombre: 'Medio original'
  url: 'https://medio.com/noticia'
etiquetas: ['AWS', 'Costos']
# Página relacionada del sitio (opcional): optimizarCostos, escalarInfraestructura,
# sesionArquitectura, adopcionIa, programasAws o productos.
relacionada: optimizarCostos
---

Primer párrafo: qué pasó, con los datos de la fuente.

## Qué significa para empresas que construyen en la nube

La lectura de Luis: qué cambia, a quién le sirve y qué haría él.
