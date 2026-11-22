---
titulo: 'Microsoft Ignite 2026: los agentes ya pueden crear y cambiar recursos en Azure'
resumen: 'Azure Catalyst promete migrar y modernizar con agentes, y el servidor MCP de Azure ya escribe. Bien gobernado acelera; sin reglas, es un riesgo.'
fecha: 2026-11-22T10:40:00-05:00
idioma: es
estado: borrador
fuente:
  nombre: 'Microsoft Azure Blog'
  url: 'https://azure.microsoft.com/en-us/blog/microsoft-ignite-2026-whats-new-in-azure-the-platform-purpose-built-for-ai/'
etiquetas: ['Azure', 'Microsoft', 'Agentes', 'Migración']
relacionada: sesionArquitectura
imagen: ../../assets/noticias/2026-11-22-ignite-agentes-azure.jpg
imagenAlt: 'Ilustración: robots que cargan bloques por un puente desde un edificio de servidores hasta una nube, con una barrera de control en la mitad.'
---

Microsoft hizo su conferencia Ignite del 17 al 20 de noviembre en San Francisco, y el mensaje fue uno: los agentes pasan de sugerir a actuar. "Agents are only as useful as the systems they can act on", escribió Arun Ulag, vicepresidente ejecutivo de Azure: los agentes solo son tan útiles como los sistemas sobre los que pueden actuar.

Para quien construye en la nube, dos anuncios me parecen los más importantes.

El primero es [Azure Catalyst](https://azure.microsoft.com/en-us/blog/introducing-azure-catalyst-agentic-modernization-and-new-ai-infrastructure-innovations/), una experiencia que reúne descubrimiento, planeación, migración y modernización con agentes, a través de Azure Copilot y GitHub Copilot. Cubre aplicaciones Java y .NET, servidores en VMware, Hyper-V y físicos, contenedores, almacenamiento, redes y bases de datos. Según el resumen oficial de anuncios de Microsoft, ya está disponible de forma general.

El segundo es menos vistoso y más profundo. El [servidor MCP de Azure Resource Manager](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/advancing-agentic-operations-on-azure-at-ignite-2026/4573831), que antes les daba a los agentes acceso de lectura a más de 3.500 tipos de recursos, ahora les permite crearlos, administrarlos y actualizarlos. Cada solicitud pasa por Azure Policy.

Microsoft también anunció las máquinas virtuales Cobalt 200, con hasta 50 % más rendimiento de CPU que Cobalt 100.

## Qué significa para empresas que construyen en la nube

Un agente que puede crear recursos también puede crear costos y riesgos. La diferencia entre acelerar y perder el control está en las reglas que pongas antes de darle permisos.

Lo que yo haría antes de dejar que un agente escriba en mi nube:

1. Darle una identidad propia, con el mínimo permiso necesario y en un entorno acotado.
2. Políticas que bloqueen lo que nunca debe pasar: regiones no permitidas, recursos públicos o tamaños fuera de presupuesto.
3. Aprobación humana para los cambios en producción.
4. Registro de cada acción, con alertas de costo.

Sobre las migraciones con agentes: aceleran el análisis y el trabajo repetitivo, pero no reemplazan el caso de negocio ni la decisión de qué migrar primero. AWS y Google tienen sus propias apuestas en la misma dirección, y la pregunta es la misma en las tres nubes.

¿Te gustaría que comparara cómo se gobiernan los agentes en Azure, AWS y Google Cloud? Escríbeme por LinkedIn o desde la página de Contacto.
