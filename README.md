# luisreyesvanegas.com

Sitio web oficial de **Luis Carlos Reyes Vanegas** — Arquitecto Cloud, Especialista en AWS e IA, Speaker y Fundador de EvolutecC.

Sitio trilingüe (Español, Inglés y Portugués) con 20 páginas, sistema de diseño en base a tokens de marca, piezas de animación con GSAP y Three.js, y gestión de solicitudes con MariaDB y Drizzle ORM.

## Requisitos

- Node.js 22 (`nvm use` lee automáticamente `.nvmrc`).
- pnpm 10 (`corepack enable pnpm`).
- Docker (para el entorno local de MariaDB 10.11 con `pnpm db:up`).

## Comandos

| Comando                           | Qué hace                                                                   |
| :-------------------------------- | :------------------------------------------------------------------------- |
| `pnpm install`                    | Instala dependencias del proyecto                                          |
| `pnpm dev`                        | Inicia servidor de desarrollo local en `http://localhost:4321`             |
| `pnpm build`                      | Compila el sitio para producción en `dist/`                                |
| `pnpm start`                      | Ejecuta el servidor Node en modo producción (`node dist/server/entry.mjs`) |
| `pnpm check`                      | Verificación de tipos TypeScript y esquemas Astro                          |
| `pnpm lint` / `pnpm format:check` | Verificación de lint y formato de código                                   |
| `pnpm test`                       | Ejecuta pruebas unitarias (Vitest)                                         |
| `pnpm test:db`                    | Ejecuta pruebas de base de datos contra MariaDB local                      |
| `pnpm test:e2e`                   | Ejecuta pruebas end-to-end y accesibilidad WCAG 2.2 AA (Playwright + axe)  |
| `pnpm lighthouse`                 | Ejecuta auditoría Lighthouse móvil y escritorio (umbral ≥ 95)              |
| `pnpm verify`                     | Ejecuta la suite completa de calidad antes de subir cambios                |
| `pnpm db:up`                      | Levanta MariaDB en Docker para desarrollo local                            |
| `pnpm db:migrate`                 | Aplica migraciones SQL en la base de datos                                 |

Para conocer en detalle el flujo de trabajo en Git, ramas y convenciones de commit, consulta la [Guía de desarrollo](DEVELOPMENT.md).

## Estructura del proyecto

```
src/
  pages/                rutas del sitio, endpoints de API, robots.txt, sitemap.xml, llms.txt
  pages/[lang]/         páginas por idioma (es, en, pt)
  layouts/              layout base con metadatos, Open Graph, hreflang y Schema.org
  components/brand/     componentes de marca (botones, tarjetas, métricas, visores)
  components/sections/  bloques de contenido que arman cada página
  components/motion/    piezas interactivas (Three.js, Canvas, GSAP)
  content/              colecciones tipadas en YAML y Markdown (noticias, casos, charlas...)
  i18n/                 diccionarios y enrutamiento en 3 idiomas
  lib/                  servicios de backend (BD, formularios, sincronización, SEO)
db/
  migraciones/          migraciones SQL versionadas
  schema.ts             esquema Drizzle ORM
```

## Desplegar en Hostinger (Node.js Apps)

El despliegue está preparado para correr en el plan Cloud Startup o Business de Hostinger usando la integración de Git.

### 1. Conexión en hPanel

1. Ve a **Websites → Add website → Node.js Apps**.
2. Selecciona **Import Git repository**, conecta tu cuenta de GitHub y elige este repositorio:
   `https://github.com/luisingryv/luisreyesvanegas-astro.git`
3. Selecciona la rama `main`.

### 2. Parámetros de compilación y ejecución

Confirma que la configuración detectada coincida con:

| Campo            | Valor                                  |
| :--------------- | :------------------------------------- |
| Framework preset | `astro`                                |
| Node.js version  | `22`                                   |
| Root directory   | `/`                                    |
| Package manager  | `pnpm`                                 |
| Build command    | `pnpm build`                           |
| Output directory | `dist`                                 |
| Entry file       | `server/entry.mjs` (relativo a `dist`) |

### 3. Variables de entorno (en Hostinger)

En la sección de **Environment variables** de la app en hPanel, agrega:

- `DATABASE_URL`: Cadena de conexión MySQL/MariaDB (creada en la sección Databases de Hostinger).
- `TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`: Llaves de Cloudflare Turnstile para protección antispam.
- `RESEND_API_KEY`: Llave de la API de Resend para notificaciones por correo.
- `AVISO_CORREO_DESTINO`: Correo donde se reciben las alertas de nuevos formularios.
- `AVISO_CORREO_REMITENTE`: Correo remitente configurado en Resend.
- `NOTION_API_KEY` y `NOTION_DATABASE_ID_CONTACTS`: Integración con Notion CRM.
- `TAREAS_TOKEN`: Token secreto para autorizar el endpoint `/api/tareas/sincronizar`.
- `CALENDAR_BOOKING_URL` _(opcional)_: URL para agendar sesiones.
- `WHATSAPP_NUMERO` _(opcional)_: Número oficial para WhatsApp.
- `HOST`: Si el proxy inverso no conecta con la app, define `HOST=0.0.0.0`.

### 4. Migración de la base de datos

Tras crear la base de datos en Hostinger y configurar `DATABASE_URL`:

- Puedes ejecutar `pnpm db:migrate` desde la consola SSH de Hostinger, o
- Importar en phpMyAdmin los archivos SQL presentes en `db/migraciones/`.

### 5. Verificaciones post-despliegue

- La raíz `/` redirige al idioma predeterminado (`/es`).
- Las 20 rutas principales responden con código HTTP 200.
- El sitemap dinámico responde en `/sitemap.xml`.
- El archivo de robots e IA responde en `/robots.txt`.
- La ficha para modelos de lenguaje responde en `/llms.txt`.
- El selector de idiomas conmuta correctamente entre `/es`, `/en` y `/pt`.
