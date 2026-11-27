---
titulo: 'Jensen Huang vuelve a dirigir Nvidia 11 días después de renunciar: qué cambia para quien depende de sus GPU'
resumen: 'La junta de Nvidia reinstaló por unanimidad a Jensen Huang como CEO. Qué deja este vaivén a las empresas que dependen de un solo proveedor de cómputo.'
fecha: 2026-11-25
idioma: es
estado: publicada
fuente:
  nombre: 'NVIDIA Newsroom'
  url: 'https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director'
etiquetas: ['Nvidia', 'GPU', 'IA', 'Riesgo de proveedor']
relacionada: escalarInfraestructura
imagen: ../../assets/noticias/2026-11-25-nvidia-regreso-huang.jpg
imagenAlt: 'La sede de Nvidia en Santa Clara, en dos tonos violeta, con el texto: Nvidia. 11 días entre la renuncia de Jensen Huang y su regreso como CEO, voto unánime de la junta.'
imagenCredito: 'Foto editada de Coolcaesar (CC BY-SA 4.0), vía Wikimedia Commons; esta portada se comparte con la misma licencia'
imagenCreditoUrl: 'https://commons.wikimedia.org/wiki/File:NVIDIA_Headquarters.jpg'
---

El 23 de noviembre, la junta directiva de Nvidia [reinstaló a Jensen Huang](https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director) como presidente, CEO y miembro de la junta, con efecto inmediato y por voto unánime. Huang había [renunciado el 12 de noviembre](https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvidiaannouncesceotransiti.htm), y la CFO Colette Kress quedó como CEO interina. La junta dice que quedó satisfecha con su franqueza y su capacidad de liderar. También dice que recibió información de altos niveles del gobierno de Estados Unidos y que su regreso no representa un riesgo de seguridad nacional. Harvey C. Jones sigue como presidente de la junta, y el comité independiente que investiga los reportes de un esfuerzo de inteligencia extranjera dirigido a Huang seguirá hasta terminar. Según [CNBC](https://www.cnbc.com/2026/11/23/nvidia-jensen-huang-ceo.html), la acción cerró ese día con un alza del 31 %, y Huang tiene citas en el Congreso a comienzos de diciembre.

## Qué significa para empresas que construyen en la nube

Para quien entrena o sirve modelos, el día a día no cambió en estas dos semanas: las GPU se siguen alquilando igual en AWS, Google Cloud y Azure. Lo que sí deja este episodio es un recordatorio. Buena parte de la IA de las empresas depende de un solo fabricante, y ese fabricante puede vivir semanas de mucha incertidumbre por razones que nadie en tu equipo controla.

A la vez, la regulación también se mueve. El 16 de noviembre, el Departamento de Comercio de Estados Unidos sacó una regla que exige licencias para enviar chips avanzados a varios países, Brasil entre ellos, según el [análisis de Ashurst](https://www.ashurstperkinscoie.com/en/insights/bis-issues-interim-final-rule-restricting-remote-access-to-advanced-us-ai-chips/). Si tu plan de IA en Latinoamérica cuenta con capacidad de GPU en la región, eso también es riesgo de proveedor.

Mi recomendación no es salir corriendo de Nvidia. Es saber cuánto dependes de ella y tener un plan B que funcione.

- Haz el inventario: qué cargas usan GPU, de qué tipo, en qué región y con qué compromisos de capacidad.
- Separa entrenamiento de inferencia. La inferencia suele poder moverse a otros chips o a modelos administrados con menos esfuerzo.
- Prueba en serio una alternativa para una carga pequeña: Trainium o Inferentia en AWS, TPU en Google Cloud o un modelo administrado.
- Revisa si tus compromisos de uso te amarran a un solo tipo de instancia por años.
- No tomes decisiones de arquitectura por un titular. Toma la decisión con tus números de uso y de costo.

¿Qué parte te gustaría que amplíe: cómo medir la dependencia de GPU o cómo probar una alternativa sin rehacer todo? Escríbeme por LinkedIn o desde la página de Contacto.
