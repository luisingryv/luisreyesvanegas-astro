---
titulo: 'El hackeo a Binance: 6.300 millones de dólares en unos 20 minutos'
resumen: 'Es el robo de criptomonedas más grande registrado. Binance cubrió las pérdidas, pero la lección sirve para cualquier empresa con accesos privilegiados.'
fecha: 2026-11-22T11:50:00-05:00
idioma: es
estado: publicada
fuente:
  nombre: 'CNBC'
  url: 'https://www.cnbc.com/2026/10/30/billions-in-crypto-frozen-in-binance-hack-heres-what-happens-next-.html'
etiquetas: ['Seguridad', 'Hackeos', 'Binance', 'Cripto']
relacionada: sesionArquitectura
imagen: ../../assets/noticias/2026-11-22-hackeo-binance.jpg
imagenAlt: 'Ilustración: la puerta abierta de una bóveda de la que salen monedas por diez caminos; algunas quedan atrapadas en cubos de hielo y un cronómetro marca 20 minutos.'
---

La noche del 29 de octubre, alguien sacó cerca de 6.300 millones de dólares en criptomonedas de Binance, uno de los exchanges más grandes del mundo. Según la firma de análisis [TRM Labs](https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history), los fondos salieron por diez blockchains distintas y la mayor parte se movió en unos 20 minutos. Es cerca de cuatro veces el hackeo a Bybit de febrero de 2025, que con 1.500 millones era el récord.

TRM Labs y Chainalysis atribuyen el ataque a TraderTraitor, un grupo de hackers de Corea del Norte, y CNBC informó que el FBI llegó a la misma conclusión. Binance suspendió los retiros como precaución y dijo que cubriría las pérdidas con su fondo de protección y su propio dinero. "Binance will absorb the financial impact of these stolen funds, not our users", escribió la empresa: el impacto lo asume Binance, no sus usuarios.

El 31 de octubre, Binance [informó](https://www.binance.com/en/support/announcement/detail/1fdf1f61559c401da0435895ffcccb62) que ya había repuesto con sus reservas el 90 % de los activos robados, y los retiros volvieron por etapas. Según la empresa, emisores de monedas estables como Tether y Circle, entre otros, ayudaron a congelar cerca de 3.000 millones. En su primer informe, Binance dijo que el ataque podría haber empezado en el portátil comprometido de un ingeniero de DevOps y que no encontró filtración de llaves privadas. Hasta el 17 de noviembre no había publicado el análisis técnico completo.

## Qué significa para empresas que construyen en la nube

No hace falta manejar criptomonedas para que esto importe. El patrón es el de muchos incidentes graves: un equipo de trabajo con acceso privilegiado se vuelve la puerta de entrada a sistemas que mueven dinero o datos.

Lo que yo revisaría en cualquier empresa:

1. Quién puede ejecutar operaciones críticas desde su portátil, y si de verdad lo necesita.
2. Que las acciones de alto impacto pidan más de una aprobación y tengan límites de monto o de volumen.
3. Alertas que detecten movimientos anómalos en minutos, no en horas. Aquí casi todo pasó en 20.
4. Un plan de respuesta probado, con contactos de terceros que puedan ayudar a contener el daño, como los emisores que congelaron fondos.
5. Comunicación clara y rápida con los clientes. Binance publicó varias actualizaciones en los primeros días.

¿Te gustaría que ampliara cómo diseñar los accesos privilegiados en AWS para que un solo equipo comprometido no lo abra todo? Escríbeme por LinkedIn o desde la página de Contacto.
