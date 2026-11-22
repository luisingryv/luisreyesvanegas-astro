---
titulo: 'Gemini 4 Carbon duplica su precio el 1 de diciembre: lo que conviene revisar antes'
resumen: 'Google lanzó cuatro modelos Gemini 4 en cinco semanas. El precio de lanzamiento de Carbon y Argon en la API termina el 30 de noviembre.'
fecha: 2026-11-22T11:20:00-05:00
idioma: es
estado: publicada
fuente:
  nombre: 'Google'
  url: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/'
etiquetas: ['Google', 'Gemini', 'IA', 'Costos', 'FinOps']
relacionada: optimizarCostos
imagen: ../../assets/noticias/2026-11-22-gemini-4-precios.jpg
imagenAlt: 'Ilustración: cuatro fichas como de tabla periódica, Ar, C, H y Ne, con una etiqueta de precio ×2 colgada de la C y un calendario en el 1 de diciembre.'
---

Google completó la familia Gemini 4 en cinco semanas. Argon llegó el 13 de octubre. Carbon, que Google llama su modelo más fuerte, el 10 de noviembre. Hydrogen, pensado para agentes que necesitan rapidez, el 12. Y Neon, un punto medio entre profundidad y eficiencia, el 18. "Neon balances depth and efficiency", escribió Koray Kavukcuoglu, de Google DeepMind: Neon equilibra profundidad y eficiencia.

Lo que más le importa a quien ya los usa está en la [página de precios](https://aistudio.google.com/docs/pricing) de la API de Gemini. Carbon y Argon salieron con un precio de lanzamiento de 2 dólares por millón de tokens de entrada y 10 por millón de salida. Desde el 1 de diciembre pasan a 4 y 20: el doble. Neon cuesta 3 y 15, e Hydrogen 1,50 y 7,50. Google dice que Neon cuesta 32 % menos por tarea que Carbon en su configuración por defecto.

## Qué significa para empresas que construyen en la nube

Un precio de lanzamiento es un descuento con fecha de vencimiento. Si tu presupuesto de IA se armó con los precios de noviembre, en diciembre ya no cuadra.

Es común que el modelo se elija en una prueba y que nadie lo vuelva a revisar. Este es un buen momento para hacerlo.

Lo que yo haría esta semana:

1. Busca qué aplicaciones llaman a Carbon o a Argon y cuántos tokens consumen al mes.
2. Calcula cuánto costaría ese mismo consumo con los precios de diciembre.
3. Prueba esas tareas con Neon y con Hydrogen. Si la calidad se sostiene, cambia.
4. Manda a procesamiento por lotes lo que no necesite respuesta inmediata: en la API de Gemini cuesta la mitad.
5. Configura alertas de presupuesto antes del 1 de diciembre, no después de la primera factura.

La regla sirve para cualquier proveedor: cada vez que un modelo cambia de precio, la decisión de cuál usar se vuelve a abrir.

¿Te gustaría que ampliara cómo armar un tablero de costos de IA por aplicación y por modelo? Escríbeme por LinkedIn o desde la página de Contacto.
