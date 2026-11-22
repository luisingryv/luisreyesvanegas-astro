---
titulo: 'Una llave filtrada en un proveedor terminó en una extensión falsa de Claude Code en Cursor'
resumen: 'Hasta 5.000 usuarios pudieron instalar la copia maliciosa. La lección para quien usa agentes de IA: sus registros también guardan secretos.'
fecha: 2026-11-22T11:10:00-05:00
idioma: es
estado: publicada
fuente:
  nombre: 'Cursor'
  url: 'https://cursor.com/blog/security-incident-update'
etiquetas: ['Seguridad', 'Cursor', 'Claude Code', 'Agentes']
relacionada: adopcionIa
imagen: ../../assets/noticias/2026-11-22-extension-maliciosa-cursor.jpg
imagenAlt: 'Código en la pantalla de un computador, en dos tonos rojos, con el texto: Extensión falsa en Cursor. 5.000 usuarios pudieron instalarla, disponible unas 11 horas.'
imagenCredito: 'Foto editada de Markus Spiske (CC0), vía Wikimedia Commons'
imagenCreditoUrl: 'https://commons.wikimedia.org/wiki/File:Code_on_computer_monitor_%28Unsplash%29.jpg'
---

El 13 de noviembre, Cursor publicó el informe completo de un incidente que empezó lejos de su producto. Alguien obtuvo una llave de acceso que Cursor le había dado a Fireworks AI, uno de sus proveedores de inferencia, para compartir datos. Con esa llave copió registros de sesiones de agentes de programación, en su mayoría de 2025 y de usuarios sin el modo de privacidad activado.

Algunos de esos registros tenían credenciales sin ocultar. Con ellas, el atacante llegó a herramientas internas de Cursor y, desde ahí, a una credencial que le permitió publicar copias falsas de la extensión de Claude Code en la caché de su marketplace. Las copias estuvieron disponibles unas 11 horas el 29 de octubre. Según Cursor, como máximo 5.000 usuarios pudieron descargarlas.

Cursor aclara que la extensión legítima de Anthropic no fue comprometida. Revocó la llave, sacó su tráfico de inferencia de Fireworks, reconstruyó el marketplace y rotó todas sus credenciales internas. También publicó una [guía](https://cursor.com/blog/claude-code-extension-security-notice) para quien instaló las versiones afectadas.

## Qué significa para empresas que construyen en la nube

Este incidente reúne tres riesgos que crecen con la adopción de agentes:

- Los registros de los agentes guardan lo que pasa por la sesión, incluidas llaves y contraseñas que alguien pegó para probar algo.
- Las llaves que les das a tus proveedores son parte de tu superficie de ataque, aunque no las uses tú.
- Las extensiones del editor tienen acceso al equipo del desarrollador, y desde ahí a todo lo demás.

Lo que yo haría:

1. Busca secretos con un escáner automático en los registros de agentes, en los logs y en los datos que compartes con proveedores.
2. Dale a cada proveedor una llave con el mínimo permiso posible, con vencimiento corto y rotación.
3. Define qué extensiones pueden instalar tus equipos y desde qué fuente.
4. Trata el portátil de cada desarrollador como un servidor de producción: con monitoreo y con la capacidad de reconstruirlo rápido.
5. Si alguien de tu equipo instaló las versiones afectadas, sigue la guía de Cursor y rota las credenciales a las que tenía acceso desde ese equipo.

¿Te gustaría que ampliara cómo manejar los secretos cuando tus equipos trabajan con agentes de IA? Escríbeme por LinkedIn o desde la página de Contacto.
