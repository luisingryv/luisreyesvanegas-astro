---
titulo: 'Claude Fable 5.2: más rápido y más barato, y con 30 días de retención por seguridad'
resumen: 'Anthropic lanzó Fable 5.2 y Mythos 5.2, el mismo modelo con distintos controles. Antes de adoptarlo, conviene revisar qué pasa con tus datos.'
fecha: 2026-11-22T11:30:00-05:00
idioma: es
estado: publicada
fuente:
  nombre: 'Anthropic'
  url: 'https://www.anthropic.com/claude-fable-and-mythos-5-2'
etiquetas: ['Anthropic', 'Claude', 'IA', 'Seguridad']
relacionada: adopcionIa
imagen: ../../assets/noticias/2026-11-22-claude-fable-5-2.jpg
imagenAlt: 'Estantes de una biblioteca en dos tonos naranja, con el texto: Claude Fable 5.2. 30 días de retención por seguridad, hasta 30 % más rápido.'
imagenCredito: 'Foto editada de Micheal Kaluba (CC BY-SA 4.0), vía Wikimedia Commons; esta portada se comparte con la misma licencia'
imagenCreditoUrl: 'https://commons.wikimedia.org/wiki/File:Books_and_Bookshelves_in_Mansueto_Library.jpg'
---

El 9 de noviembre, Anthropic presentó Claude Fable 5.2 y Claude Mythos 5.2. Son el mismo modelo. Fable trae protecciones fuertes contra el mal uso en ciberseguridad y biología, y por eso está disponible para todos. Mythos tiene menos restricciones y solo lo usan organizaciones verificadas que trabajan en ciberseguridad o en investigación biomédica.

Según Anthropic, la versión 5.2 genera respuestas hasta 30 % más rápido que la 5.1 y mejora en programación, razonamiento y visión. Cuesta 8 dólares por millón de tokens de entrada y 40 por millón de salida, menos que la versión anterior. Está en los planes de Claude, en la API como `claude-fable-5-2` y en las tres grandes nubes: AWS, Google Cloud y Microsoft Azure.

Hay un detalle que no conviene pasar por alto. Para la mayoría de los clientes, Anthropic retiene los datos 30 días para monitoreo de seguridad. Los clientes elegibles pueden seguir con retención cero mientras implementan un monitoreo que corre en su propia infraestructura, hoy en beta privada.

## Qué significa para empresas que construyen en la nube

Me gusta que la propia Anthropic recomiende empezar con Claude Opus 5.5 para la mayoría de las tareas y subir a Fable solo cuando haga falta. El modelo más potente no tiene que ser el modelo por defecto.

Pero la decisión no es solo técnica. En banca, salud o sector público, 30 días de retención pueden chocar con lo que le prometiste a tus clientes o con lo que exige el regulador.

Antes de adoptarlo, yo revisaría esto:

1. Qué datos van a pasar por el modelo y si alguno es sensible.
2. Qué dicen tus contratos y tus políticas sobre la retención de datos en terceros.
3. Si tienes retención cero aprobada y qué pasa con ella en este modelo.
4. Las condiciones de la plataforma por la que lo uses: la API directa, Bedrock, Google Cloud o Azure pueden tener términos distintos. Léelos uno por uno.
5. Una prueba con tareas reales: si Opus 5.5 resuelve igual, te ahorras el costo y la discusión.

¿Te gustaría que ampliara cómo armar una política de datos para usar IA generativa en una empresa regulada? Escríbeme por LinkedIn o desde la página de Contacto.
