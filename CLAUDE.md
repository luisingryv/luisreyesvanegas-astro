# Instrucciones para Claude Code · luisreyesvanegas.com

El código del sitio vive en esta carpeta (`Desarrollo/`). La documentación vive al lado, en `../Boveda`, y los archivos pesados (fotos, marca) en `../Archivos`. Trabajas para Luis Carlos Reyes Vanegas. Respóndele en español, directo y corto.

## 1. Antes de cualquier tarea, lee en este orden
1. `../Boveda/00-DOCUMENTO-MADRE.md`: fuente única de verdad. Si algo lo contradice, gana el documento madre.
2. `../Boveda/CLAUDE.md`: reglas de contenido y de la bóveda.
3. `../Boveda/06_Desarrollo/Arquitectura técnica.md`: stack y principios. Es obligatoria.
4. `../Boveda/02_Sitio-web/Sitemap/MOTION-DEL-SITIO.md`: piezas de motion y reglas técnicas.
5. La ficha de la página en `../Boveda/02_Sitio-web/Requerimientos-por-pagina/`, su historia en `../Boveda/02_Sitio-web/Historias-de-usuario/HISTORIAS-DE-USUARIO.md` y su referencia en `referencia/`.
6. La tarea en curso en `../Boveda/09_Plan-de-trabajo/Tareas/`.

**Qué manda cuando hay diferencias:** documento madre > decisiones en `../Boveda/07_Decisiones` > prototipo aprobado (`referencia/`) > ficha de la página. Las fichas son del 10 de noviembre y varias cosas cambiaron después en el prototipo, que Luis aprobó. Si encuentras una diferencia, no la resuelvas por tu cuenta: anótala y pregúntale a Luis.

## 2. Stack (decidido el 18 nov 2026)
- **Astro** con salida en servidor (adaptador Node) y prerender donde no haya datos dinámicos. **TypeScript estricto.**
- **shadcn/ui** (React, como islas) + **Tailwind CSS v4**.
- **Motion:** GSAP + ScrollTrigger, Motion para microinteracciones, Three.js solo en piezas 3D con carga diferida.
- **Datos:** contenido estable en Content Collections tipadas con Zod; datos dinámicos (formularios, suscriptores) en **MySQL** de Hostinger, con ORM tipado y migraciones.
- **Servicios:** Resend (correo), API de Notion (CRM), página de reservas de Google Calendar (agenda). Sin pagos y sin analítica.
- **Hosting:** Hostinger, apps web, plan Cloud Startup, con despliegue desde GitHub.
- **Idiomas:** ES, EN y PT con rutas `/es`, `/en`, `/pt` y hreflang.
- Gestor de paquetes: **pnpm**. Node LTS.
- **Docker** está instalado en el Mac de Luis. Úsalo para los servicios locales (MySQL con la misma versión que Hostinger, con `docker compose`), no para correr el sitio: Hostinger despliega la app de Node directamente, así que en local el sitio corre con `pnpm dev`.

No cambies el stack ni agregues dependencias grandes sin preguntarle a Luis. Antes de instalar algo, verifica la versión estable vigente en la documentación oficial.

## 3. Reglas de frontend (no negociables)
Luis pidió un frontend profesional, por componentes y sin código repetido: lo que cambia se cambia en un solo lugar.

1. **Tokens primero.** Colores, tipografía, radios, espacios y sombras salen de `referencia/tokens-luis-reyes.json` y viven como variables CSS en el tema de Tailwind (`src/styles/`). Ningún componente escribe un color hexadecimal, una fuente o un tamaño suelto.
2. **Cuatro capas de componentes:**
   - `src/components/ui/`: primitivos de shadcn/ui, tematizados con los tokens. No se editan para casos puntuales: se componen.
   - `src/components/brand/`: componentes de marca reutilizables (Button, Card, PhotoCard 4:3, Metric con fuente, SectionHeader, Eyebrow, Badge, Header, Footer, LanguageSwitcher…).
   - `src/components/sections/`: bloques de página armados con componentes de marca.
   - `src/pages/[lang]/`: solo componen secciones y pasan datos. Sin estilos propios.
3. **Si un patrón aparece dos veces, es un componente.** Ejemplos ya conocidos: la tarjeta de foto 4:3 sin recorte (Eventos, Charlas, Home, Sobre mí), el encabezado de sección (rótulo + título + bajada), la cifra con fuente, el botón principal y el secundario, la sección con fondo oscuro o claro.
4. **Ningún texto de contenido dentro de un componente.** El contenido sale de colecciones (`src/content/`) y los textos de interfaz de diccionarios (`src/i18n/`), con claves tipadas.
5. **HTML estático por defecto.** Componentes `.astro` sin JavaScript para todo lo que no es interactivo. React solo donde hay interacción, con `client:visible` o `client:idle`.
6. **Accesibilidad WCAG 2.2 AA:** semántica correcta (un solo h1, jerarquía de títulos), foco visible, contraste según los tokens, `alt` en cada imagen, todo lo clicable es enlace o botón real.
7. **Imágenes** con el componente de imagen de Astro (formatos modernos, tamaños responsivos, carga diferida). Las fotos se copian desde `../Archivos/Fotos/` a `src/assets/` con su nombre original. Nunca modifiques ni muevas los originales de `../Archivos`.
8. **Fotos de tarjetas sin recorte:** proporción 4:3, foto completa (`object-fit: contain`) y el espacio sobrante relleno con la misma foto desenfocada y oscurecida. Es un solo componente.
9. **Marca:** todo en Human Sans (300, 400 y 700, incrustada desde `../Archivos/Marca/Manual V-2025/FONTS/Human Sans/`), sin otras familias ni monoespaciadas. Degradados solo en el logo. Esquinas de 24 px en tarjetas grandes. Sin líneas bajo los títulos de sección; los separadores entre secciones sí van. Cada sección tiene el mismo espacio arriba y abajo.

## 4. Reglas de motion
- Cada pieza del laboratorio (`referencia/laboratorio-motion.html`) es un componente aislado en `src/components/motion/`. El laboratorio define el **comportamiento**, no el texto ni el código final: reescríbelo limpio, tipado y con los tokens.
- La cifra final siempre va escrita en el HTML; la animación solo la anima.
- Con `prefers-reduced-motion`, todo se ve en su estado final, sin movimiento.
- Ninguna animación retrasa el contenido principal (LCP). Las piezas se cargan al entrar en pantalla y se pausan fuera de ella.
- Valores de movimiento, duraciones y reglas de rendimiento: sección 6 de `MOTION-DEL-SITIO.md`.

## 5. Reglas de backend
- Endpoints en `src/pages/api/` con validación Zod en el servidor, campo trampa y límite de envíos.
- Integraciones (Notion, Resend, base de datos) detrás de servicios en `src/lib/`. Las páginas nunca llaman a un proveedor directamente.
- Secretos solo en variables de entorno (`.env` local, Hostinger en producción). `.env.example` documenta cada variable sin valores. Nunca subas un secreto al repositorio.

## 6. Reglas de contenido
- Solo las cifras de la sección 6 del documento madre, con cliente, periodo y fuente.
- No inventes testimonios, logos, clientes ni métricas. Lo que falte queda como pendiente. Una sección sin contenido real (por ejemplo, testimonios) **no se publica**: se oculta con una bandera en su colección.
- Copia los textos tal como están en la referencia. No los reescribas ni los "mejores".
- EN y PT: no se publican textos que Luis no haya aprobado. Si te pide un borrador de traducción, va marcado como borrador.
- Las cuentas, los inicios de sesión y los datos personales son de Luis: pídele lo que necesites y no lo inventes.

## 7. Calidad
- Antes de dar algo por terminado: `pnpm check` (tipos), lint y formato, pruebas, y revisión en el navegador en escritorio y móvil.
- GitHub Actions corre lo mismo más axe y Lighthouse (≥ 95) antes de cada despliegue. Si algo falla, no se despliega.
- Commits pequeños, en español y con mensaje claro. Una rama por tarea.

## 8. Cómo trabajamos
- Una tarea a la vez. Al terminar cada paso: qué salió, dónde quedó y cuál es el siguiente paso, y espera la revisión de Luis.
- Cuando termines una tarea, actualiza su nota en `../Boveda/09_Plan-de-trabajo/Tareas/` (estado, `hecha_el` y una línea en "Avance").
- Si una decisión cambia algo de la estrategia o del diseño, no la tomes tú: pregúntale a Luis. Mei (en Claude) la registra en la bóveda.
- No se borra nada en la carpeta del proyecto: lo que sobra va a `../_to_delete/`.

## 9. Referencia
Ver `referencia/README.md`: prototipo aprobado, tokens, laboratorio de motion y de dónde sale cada imagen.
