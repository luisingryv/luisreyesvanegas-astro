---
titulo: 'GPT-6.2 Astra y Sol: OpenAI baja precios y su modelo barato se acerca al caro'
resumen: 'Astra cuesta 20 % menos que su antecesor y, según OpenAI, Sol queda cerca en código por una quinta parte del costo. Eso cambia cómo conviene elegir modelo.'
fecha: 2026-11-22T11:40:00-05:00
idioma: es
estado: publicada
fuente:
  nombre: 'OpenAI'
  url: 'https://openai.com/index/introducing-gpt-6-2-astra-sol/'
etiquetas: ['OpenAI', 'IA', 'Modelos', 'Costos']
relacionada: adopcionIa
imagen: ../../assets/noticias/2026-11-22-gpt-6-2-astra-sol.jpg
imagenAlt: 'Una balanza antigua de dos platos en dos tonos violeta, con el texto: OpenAI GPT-6.2. −20 % en el precio de GPT-6.2 Astra. Sol, a medio punto en código.'
imagenCredito: 'Foto editada de Nikodem Nijaki (CC BY-SA 3.0), vía Wikimedia Commons; esta portada se comparte con la misma licencia'
imagenCreditoUrl: 'https://commons.wikimedia.org/wiki/File:Balance_scale_IMGP9722.jpg'
---

El 17 de noviembre, OpenAI lanzó dos modelos. GPT-6.2 Astra es el de frontera, pensado para proyectos largos y difíciles. GPT-6.2 Sol es el eficiente, para el trabajo de todos los días. Los dos están en ChatGPT para los planes Plus, Pro, Enterprise y Edu, en Codex y en la API.

Los precios, por millón de tokens: Astra cuesta 8 dólares de entrada y 40 de salida, 20 % menos que GPT-6 Astra. Sol mantiene los precios de su antecesor: 2 dólares de entrada y 10 de salida. La entrada en caché cuesta mucho menos: 0,40 dólares en Astra y 0,10 en Sol.

El dato que más me llamó la atención está en las pruebas que publica OpenAI: en una evaluación de programación, Sol quedó a medio punto de Astra por cerca de una quinta parte del costo. Son resultados de la propia empresa, así que hay que verificarlos con tareas reales.

OpenAI también dice que los dos modelos alcanzan su nivel "crítico" de capacidad en ciberseguridad y que por eso salieron con controles más estrictos.

## Qué significa para empresas que construyen en la nube

Seguimos midiendo mal. Comparamos el precio por token, cuando lo que importa es el costo por tarea resuelta: cuántos tokens gasta el modelo, cuántas veces hay que reintentar y si la respuesta sirve.

Un modelo más barato que resuelve casi igual cambia la cuenta. Si nueve de cada diez tareas caben en Sol, mandarlo todo a Astra es pagar de más.

Lo que yo haría:

1. Arma un conjunto de 30 a 50 tareas reales de tu negocio, con la respuesta esperada.
2. Corre ahí los modelos que estés evaluando y mide calidad, tiempo y costo por tarea.
3. Enruta: el modelo eficiente por defecto y el de frontera solo cuando la tarea lo pide.
4. Usa la caché de prompts. Con estos descuentos, un prompt de sistema largo y repetido cuesta mucho menos.
5. Deja tu aplicación lista para cambiar de modelo o de proveedor sin reescribirla. Este mes hubo tres lanzamientos grandes y no será el último.

¿Te gustaría que publicara un ejemplo de ese conjunto de pruebas para comparar modelos? Escríbeme por LinkedIn o desde la página de Contacto.
