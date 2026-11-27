---
titulo: '1Password: una cuenta de GitHub de un empleado bastó para meter código malicioso en su backend'
resumen: 'Las bóvedas no se tocaron, pero sí datos de cuentas y el código fuente. La lección para quien construye en la nube: el CI/CD también es producción.'
fecha: 2026-11-27
idioma: es
estado: publicada
fuente:
  nombre: '1Password'
  url: 'https://1password.com/blog/update-on-nov-2026-security-incident'
etiquetas: ['Seguridad', 'Hackeos', '1Password', 'GitHub', 'CI/CD']
relacionada: sesionArquitectura
imagen: ../../assets/noticias/2026-11-27-incidente-1password.jpg
imagenAlt: 'Dos argollas de llavero vacías, en dos tonos rojos, con el texto: Incidente en 1Password. 1 cuenta de GitHub de un empleado llevó código malicioso a su backend. Bóvedas intactas.'
imagenCredito: 'Foto editada de Tomasz Sienicki (CC BY 3.0), vía Wikimedia Commons'
imagenCreditoUrl: 'https://commons.wikimedia.org/wiki/File:Keyrings_(ubt).JPG'
---

El 25 de noviembre, 1Password contó que alguien entró a la cuenta corporativa de GitHub de uno de sus empleados. La empresa empezó a investigar el 19 de noviembre. Con esa cuenta, el atacante leyó código fuente privado y subió código malicioso a servicios del backend. Ese código descargó datos administrativos de una parte de sus usuarios: nombres, correos, identificadores de cuenta, fechas de creación y de último ingreso, llaves públicas, parámetros del protocolo SRP y tokens de los enlaces de invitación y recuperación que se envían por correo. 1Password no dijo cuántas personas fueron afectadas ni quién está detrás.

Lo importante para sus usuarios: "Customer vaults were not affected and all vault contents remain secure", escribió 1Password: las bóvedas no se vieron afectadas. La empresa no guarda la contraseña ni la Secret Key, y dice que los datos copiados no sirven para entrar a una cuenta. Aun así, desactivó la cuenta del empleado, revocó el token robado, rotó las credenciales internas que pudieron quedar expuestas y alargó los códigos de invitación y recuperación de seis dígitos a diez caracteres. Promete un análisis de causa raíz en las próximas semanas.

## Qué significa para empresas que construyen en la nube

Para mí, la lección no es sobre gestores de contraseñas. Es sobre la cadena que lleva el código a producción. Aquí no hizo falta romper el cifrado ni la nube. Bastó una cuenta de desarrollador con permiso para que su código llegara a servicios en producción. Y 1Password tuvo que rotar secretos porque su CI/CD guardaba credenciales de infraestructura.

Muchas empresas cuidan mucho su cuenta de AWS o de Azure y muy poco su GitHub. Pero hoy quien controla el repositorio y el pipeline controla lo que corre en la nube.

Lo que yo revisaría esta semana:

- Que nada llegue a producción sin revisión de otra persona, ni siquiera desde una cuenta interna.
- Que el pipeline use credenciales temporales (por ejemplo, OIDC hacia la nube) y no llaves fijas guardadas en el CI/CD.
- Tokens de GitHub con el menor alcance posible y vencimiento corto, y alertas cuando alguien empuja a ramas protegidas.
- Un inventario de qué secretos viven en el CI/CD, para saber qué rotar el día que pase algo.
- Si usas 1Password: estar atento al phishing que use esta noticia. La empresa dice que nunca te pedirá tu contraseña ni tu Secret Key.

¿Qué parte te gustaría que ampliara: cómo asegurar el pipeline o cómo quitar las llaves fijas del CI/CD? Escríbeme por LinkedIn o desde la página de Contacto.
