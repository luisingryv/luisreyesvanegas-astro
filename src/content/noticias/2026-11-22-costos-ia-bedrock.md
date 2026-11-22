---
titulo: 'AWS y Accenture muestran seis palancas para bajar el gasto en tokens de IA en Bedrock'
resumen: 'En cuatro proyectos reales, el gasto en tokens bajó entre 40 % y 85 %. Lo que más me interesa es el orden: primero medir, después optimizar.'
fecha: 2026-11-22
idioma: es
estado: publicada
fuente:
  nombre: 'AWS Machine Learning Blog'
  url: 'https://aws.amazon.com/blogs/machine-learning/optimize-ai-economics-on-amazon-bedrock-with-accentures-sequenced-approach/'
etiquetas: ['AWS', 'IA', 'Costos', 'FinOps', 'Bedrock']
relacionada: optimizarCostos
imagen: ../../assets/noticias/2026-11-22-costos-ia-bedrock.png
imagenAlt: 'Tarjeta de la noticia con su título: AWS y Accenture muestran seis palancas para bajar el gasto en tokens de IA en Bedrock'
---

El 19 de noviembre, AWS publicó con Accenture una guía para controlar el gasto en tokens en Amazon Bedrock. Proponen seis palancas en tres fases. Primero, solo configuración: caché de prompts y procesamiento por lotes. Después, cambios de arquitectura: enrutar cada tarea al modelo adecuado y afinar la recuperación en RAG. Al final, inversión: caché semántica y destilación de modelos. Accenture las aplicó en cuatro clientes. Una operadora de telecomunicaciones pasó de 12 millones de dólares al año en tokens a 3,8 millones. En otra empresa grande, el costo mensual bajó 85 %. Una aseguradora y una minera, con una sola capa de caché cada una, bajaron cerca de 40 %. Los autores aclaran que los resultados dependen de cada carga de trabajo.

## Qué significa para empresas que construyen en la nube

Lo más útil del artículo no son los porcentajes. Es el orden.

Veo un patrón seguido. Una empresa lanza un asistente o un agente, funciona y empieza a crecer. Al mes llega la factura y la IA aparece como una sola línea. Nadie sabe qué equipo, qué agente ni qué modelo la generó. Así no se puede optimizar nada.

Por eso la guía empieza por la atribución. En Bedrock eso significa un perfil de inferencia por aplicación, con etiquetas de costo por equipo y por carga de trabajo. Accenture suma una idea que me gusta: medir el costo por transacción de negocio. Es decir, cuánto cuesta un resultado útil, incluidos los reintentos y las llamadas fallidas.

Otro dato que vale la pena: en el caso del 85 %, cerca de 15 % de las tareas siguió necesitando el modelo más potente. No todo tiene que ir al modelo más caro, pero tampoco todo cabe en el más barato.

Esto le sirve sobre todo a quien ya tiene IA en producción y ve que el gasto crece más rápido que el uso. Si estás en esa situación, yo haría esto:

1. Etiqueta cada aplicación y cada agente antes de tocar un solo prompt.
2. Mide una línea base de costo y de calidad.
3. Activa la caché de prompts en el tráfico interactivo y manda a lotes lo que no es urgente.
4. Cambia una palanca a la vez y mide otra vez.
5. Deja el enrutamiento, la caché semántica y la destilación para cuando tengas datos que las justifiquen.

No hay una cifra de ahorro que aplique a todos. Lo que sí se puede tener siempre es visibilidad, y con eso se toman mejores decisiones.
