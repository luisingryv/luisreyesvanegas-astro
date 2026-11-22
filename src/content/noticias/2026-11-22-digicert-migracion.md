---
titulo: 'DigiCert: una migración de 2025 dejó un sistema interno abierto a internet por más de 16 meses'
resumen: 'Un sistema que solo se veía por VPN quedó en una red alcanzable desde internet. La lección: toda migración también es un cambio de seguridad.'
fecha: 2026-11-22T11:00:00-05:00
idioma: es
estado: borrador
fuente:
  nombre: 'BleepingComputer'
  url: 'https://www.bleepingcomputer.com/news/security/digicert-data-breach-exposes-customer-information-identity-documents/'
etiquetas: ['Seguridad', 'Migración', 'DigiCert']
relacionada: sesionArquitectura
imagen: ../../assets/noticias/2026-11-22-digicert-migracion.jpg
imagenAlt: 'Ilustración: un rack de servidores en una carretilla sale de un cuarto cerrado por una puerta con el candado abierto, hacia un espacio con señal de internet.'
---

DigiCert, una de las autoridades de certificados más grandes del mundo, empezó a notificar a sus clientes a comienzos de noviembre por un incidente que nació en una migración. En febrero de 2025 movió un sistema interno de archivo, que antes solo era accesible por VPN, a una red alcanzable desde internet. En el cambio quedó expuesta una función de autorregistro pensada para otras aplicaciones: cualquiera podía crearse una cuenta sin el segundo factor que se les exige a los empleados.

Esas cuentas no tenían roles asignados, pero un error de permisos les daba acceso de lectura a archivos de clientes. Entre el 27 de junio y el 2 de julio de 2026, una cuenta no autorizada consultó esos archivos. Según BleepingComputer, los datos incluyen nombres, correos y teléfonos de trabajo y direcciones de empresas. En una minoría de casos, también documentos como licencias de conducción o pasaportes. DigiCert dice que la emisión de certificados no se vio afectada.

Un detalle del informe de DigiCert, citado por la prensa: al principio trataron el caso como un problema de creación de cuentas y no como un posible acceso a datos. La confirmación del acceso llegó el 19 de octubre.

## Qué significa para empresas que construyen en la nube

En los proyectos de migración se habla de servidores, redes y bases de datos. Pocas veces se pregunta qué queda expuesto que antes no lo estaba.

Mover un sistema de una red privada a una alcanzable desde internet no es solo un cambio de infraestructura. Es un cambio de seguridad, y debe revisarse como tal.

Lo que yo incluiría en cualquier plan de migración:

1. Un inventario de qué era accesible antes y qué lo es después, sistema por sistema.
2. Revisar las funciones que vienen activadas por defecto, como el autorregistro y los roles iniciales.
3. Segundo factor para toda cuenta que pueda ver datos, sin excepciones.
4. Alertas para cuentas nuevas o extrañas en sistemas internos.
5. Una regla simple: una cuenta que no debería existir se investiga como un posible acceso a datos hasta que se demuestre lo contrario.

¿Te gustaría que ampliara cómo armar la revisión de seguridad de una migración a AWS? Escríbeme por LinkedIn o desde la página de Contacto.
