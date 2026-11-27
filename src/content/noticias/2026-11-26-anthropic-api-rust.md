---
titulo: 'Anthropic migró su API de Python a Rust con agentes de Claude: 70 % menos CPU por solicitud'
resumen: 'Claude escribió el código y el tráfico real hizo de juez. La lección para cualquier migración: lo difícil ya no es escribir, es verificar.'
fecha: 2026-11-26
idioma: es
estado: publicada
fuente:
  nombre: 'Anthropic'
  url: 'https://www.anthropic.com/research/migrating-api-to-rust'
etiquetas: ['Anthropic', 'Claude', 'Agentes', 'Migración', 'Costos']
relacionada: adopcionIa
imagen: ../../assets/noticias/2026-11-26-anthropic-api-rust.jpg
imagenAlt: 'Un engranaje oxidado semienterrado en la arena de una playa, en dos tonos verdes, con el texto: Anthropic pasa su API a Rust. −70 % de CPU por solicitud, con agentes de Claude y revisión humana.'
imagenCredito: 'Foto editada de Moximox (CC BY-SA 4.0), vía Wikimedia Commons; esta portada se comparte con la misma licencia'
imagenCreditoUrl: 'https://commons.wikimedia.org/wiki/File:Rusted_gears_at_Glass_Beach_-_2016.jpg'
---

El 25 de noviembre, Anthropic contó cómo pasó su Messages API de Python a Rust. Es la API que usan sus clientes y sus propias apps, como Claude Code. Desde 2024 su tráfico creció unas 1.800 veces, y el costo de Python en cada paso se volvió un problema. En abril, Claude escribió en cerca de una semana la primera versión del núcleo en Rust. Pasaba el 98 % de sus pruebas, pero solo una cuarta parte de las solicitudes reales daba el mismo resultado que en Python.

Lo interesante es cómo cerraron esa brecha. Usaron la API vieja como juez: cada solicitud se procesaba también en la nueva y se comparaban los resultados, sin leer el contenido de los clientes. Cada diferencia dejaba una huella, y un agente coordinador repartía cada tipo de huella a otro agente que buscaba la causa y proponía el arreglo. Ningún cambio llegaba a producción sin revisión de un ingeniero. En septiembre todo el tráfico público pasó a Rust. Según Anthropic, la CPU por solicitud bajó cerca de 70 %, la memoria más de 80 % y la mediana del tiempo hasta el primer token, 20 %.

## Qué significa para empresas que construyen en la nube

Muchas empresas tienen un sistema viejo que quieren modernizar y no se atreven, porque no saben si el nuevo va a hacer lo mismo. Este caso muestra que los agentes ya pueden escribir buena parte del código. El trabajo duro es otro. Anthropic lo dice así: "Verification is the new bottleneck", la verificación es el nuevo cuello de botella.

También deja claro el límite. En un caso, un agente logró que los resultados coincidieran con un atajo que no servía para producción, y un ingeniero lo rechazó. El verificador dice si algo coincide, no si está bien hecho.

Si yo fuera a hacer una migración con agentes, haría esto:

- Definir primero qué es "correcto". Si no hay pruebas completas, el sistema actual puede ser el juez.
- Comparar con tráfico real antes de cambiar, sin exponer datos de clientes.
- Medir CPU, memoria y latencia antes y después, para saber cuánto vale el cambio.
- Mantener la revisión humana como puerta obligatoria antes de producción.
- Guardar cada corrección como regla o prueba, para que el agente no repita el error.

¿Qué parte te gustaría que ampliara: cómo montar la comparación con tráfico real o cómo calcular si una migración así se paga sola? Escríbeme por LinkedIn o desde la página de Contacto.
