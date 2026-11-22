---
titulo: 'Nvidia vende 115.800 millones en su primer trimestre sin Jensen Huang al frente'
resumen: 'Ingresos récord, una directora ejecutiva interina y una investigación interna abierta. Lo que deja para las empresas que dependen de GPU en la nube.'
fecha: 2026-11-22T12:00:00-05:00
idioma: es
estado: publicada
fuente:
  nombre: 'NVIDIA Newsroom'
  url: 'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027'
etiquetas: ['Nvidia', 'IA', 'GPU', 'Infraestructura']
relacionada: escalarInfraestructura
imagen: ../../assets/noticias/2026-11-22-nvidia-resultados-sin-huang.jpg
imagenAlt: 'Ilustración: un chip de computador enorme que brilla en verde sobre una placa de circuitos y, a su lado, una silla de oficina vacía bajo un foco.'
---

El 12 de noviembre, Nvidia [anunció](https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvidiaannouncesceotransiti.htm) que Jensen Huang renunciaba como presidente, director ejecutivo y miembro de la junta, con efecto inmediato. Colette Kress, la directora financiera, quedó como directora ejecutiva interina sin dejar su cargo financiero. La junta busca un reemplazo permanente, dentro o fuera de la empresa, y nombró por primera vez a un presidente de la junta: Harvey C. Jones. La compañía menciona una investigación de un comité independiente de su junta, pero no ha dicho de qué se trata.

Cinco días después llegaron los resultados del trimestre que cerró el 25 de octubre: 115.800 millones de dólares en ingresos, 103 % más que hace un año. De eso, 107.600 millones vinieron de centros de datos. Para el próximo trimestre, que tendrá 14 semanas, Nvidia espera unos 130.000 millones, sin contar ventas de cómputo para centros de datos en China. Kress lo resumió así: "Our momentum is real" (nuestro impulso es real).

## Qué significa para empresas que construyen en la nube

El cambio de mando es lo que todos comentan. Pero el dato que más me importa es otro: 93 de cada 100 dólares que vende Nvidia vienen de centros de datos. El mundo está comprando cómputo para IA a un ritmo que no se frena por un cambio de director.

Para una empresa que construye en la nube, eso significa que la GPU va a seguir siendo un recurso caro y disputado. No conviene diseñar como si fuera abundante.

Esto es lo que yo haría:

1. Mide cuánto usas de verdad las GPU que pagas. Una instancia encendida y ociosa cuesta lo mismo que una ocupada.
2. Mientras el volumen sea incierto, usa inferencia administrada, como Amazon Bedrock o los modelos de Google Cloud. El proveedor se encarga del hardware.
3. Si tienes cargas grandes y estables, evalúa chips alternativos, como Trainium e Inferentia en AWS o las TPU en Google Cloud.
4. Evita atar tu código a un solo tipo de acelerador. Cambiar después cuesta más.
5. Revisa el riesgo de concentración: cuántos de tus sistemas dependen de un solo proveedor y qué harías si cambian sus precios o su disponibilidad.

¿Te gustaría que escribiera sobre cómo estimar cuánta GPU necesita de verdad un proyecto de IA? Escríbeme por LinkedIn o desde la página de Contacto.
