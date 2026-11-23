# Guía de desarrollo · luisreyesvanegas.com

## Stack

| Capa          | Tecnología                                                                           |
| ------------- | ------------------------------------------------------------------------------------ |
| Framework     | Astro 7 (output `server`, adaptador Node standalone)                                 |
| UI            | shadcn/ui (React, como islas) + Tailwind CSS v4                                      |
| Motion        | GSAP + ScrollTrigger, Three.js con carga diferida                                    |
| Tipografía    | Human Sans (300, 400 y 700), autoalojada                                             |
| Contenido     | Colecciones tipadas en YAML y Markdown (`src/content/`)                              |
| Base de datos | MariaDB 10.11 en Hostinger, Drizzle ORM, migraciones SQL versionadas                 |
| i18n          | Trilingüe: ES (principal), EN y PT con rutas `/es`, `/en`, `/pt`                     |
| Hosting       | Hostinger (apps web Node.js, deploy automático desde GitHub)                         |
| Calidad       | Vitest + Playwright + axe (WCAG 2.2 AA) + Lighthouse ≥ 95                            |
| CI            | GitHub Actions (`calidad.yml`) con servicio MariaDB 10.11 en cada push a `main` y PR |

## Requisitos

- Node 22 (`nvm use` lee `.nvmrc`).
- pnpm 10.
- Docker (para correr MariaDB 10.11 localmente con `pnpm db:up`).

## Comandos

| Comando                             | Qué hace                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm install`                      | Instala las dependencias del proyecto                                                |
| `pnpm dev`                          | Servidor de desarrollo en `http://localhost:4321`                                    |
| `pnpm build`                        | Construye el sitio en `dist/`                                                        |
| `pnpm start`                        | Corre el build de producción como lo hace Hostinger (`node ./dist/server/entry.mjs`) |
| `pnpm check`                        | Verificación estricta de tipos de Astro y TypeScript                                 |
| `pnpm lint` / `pnpm lint:fix`       | Análisis estático con ESLint                                                         |
| `pnpm format` / `pnpm format:check` | Formateo de código con Prettier                                                      |
| `pnpm test`                         | Pruebas unitarias rápidas con Vitest                                                 |
| `pnpm test:db`                      | Pruebas de integración con la base de datos local                                    |
| `pnpm test:e2e`                     | Pruebas de flujos completos y accesibilidad con Playwright + axe                     |
| `pnpm lighthouse`                   | Auditoría de rendimiento, SEO y accesibilidad (Lighthouse ≥ 95)                      |
| `pnpm verify`                       | Corre la suite completa de calidad (tipos + lint + tests + e2e + lighthouse)         |
| `pnpm db:up`                        | Levanta el contenedor de MariaDB local en Docker                                     |
| `pnpm db:migrate`                   | Ejecuta las migraciones pendientes en la base de datos                               |
| `pnpm db:studio`                    | Abre la interfaz web Drizzle Studio para explorar los datos                          |
| `pnpm og`                           | Genera las tarjetas Open Graph para redes sociales                                   |
| `pnpm cv:pdf`                       | Genera el PDF del currículum                                                         |
| `pnpm i18n:faltantes`               | Revisa claves de traducción pendientes entre idiomas                                 |

## Estructura del código

```
src/
  pages/                rutas del sitio (index, robots.txt, sitemap.xml, llms.txt, api/)
  pages/[lang]/         rutas por idioma (solo componen secciones y pasan datos)
  layouts/              layout base (SEO, OG, header, footer, hreflang, JSON-LD)
  components/ui/        primitivos de shadcn/ui tematizados
  components/brand/     componentes de marca reutilizables (Button, Card, Metric...)
  components/sections/  bloques de página armados con componentes de marca
  components/motion/    piezas de animación (Three.js, GSAP, Medalla3D, Logo3D...)
  content/              colecciones tipadas (YAML y Markdown)
  i18n/                 idiomas, rutas y diccionarios (es.ts, en.ts, pt.ts)
  lib/                  servicios (DB, formularios, UTM, SEO, estructuración de datos)
  styles/               variables CSS y tema de Tailwind
  assets/               imágenes y vectores optimizados por Astro
db/
  migraciones/          archivos SQL versionados de migraciones
  schema.ts             esquema Drizzle (solicitudes, suscriptores)
  migrar.ts             script de ejecución de migraciones
tests/
  unit/                 pruebas unitarias
  db/                   pruebas de integración con base de datos
  e2e/                  pruebas end-to-end y accesibilidad WCAG 2.2 AA
```

## Git y control de versiones

### Estrategia: GitHub Flow

`main` es la rama de producción. Hostinger está configurado para desplegar automáticamente cada push o merge en `main`. Todo cambio nuevo debe entrar mediante Pull Request con el flujo de CI en verde.

```
main (producción en Hostinger)
  ↑ (PR aprobado + CI verde)
  ├── feat/nueva-funcionalidad
  ├── fix/ajuste-diseno
  └── content/actualizacion-charlas
```

### Ramas

Cada cambio sale de `main` en su propia rama con un prefijo descriptivo:

| Prefijo    | Propósito                             | Ejemplo                       |
| ---------- | ------------------------------------- | ----------------------------- |
| `feat/`    | Nueva funcionalidad o página          | `feat/landing-adopcion-ia`    |
| `fix/`     | Corrección de error visual o lógico   | `fix/logo-casos-mobile`       |
| `chore/`   | Mantenimiento, dependencias o tooling | `chore/actualizar-astro`      |
| `content/` | Actualizaciones de textos o imágenes  | `content/nuevas-charlas-2026` |
| `design/`  | Ajustes de estilos, tokens o motion   | `design/animacion-medalla`    |

### Flujo de trabajo estándar

```bash
# 1. Asegurar tener la última versión de main
git checkout main && git pull origin main

# 2. Crear rama para la tarea
git checkout -b feat/nombre-de-la-tarea

# 3. Desarrollar con commits pequeños y atómicos
git add -A && git commit -m "Descripción clara del cambio"

# 4. Verificar calidad antes de subir
pnpm verify

# 5. Subir la rama y crear Pull Request en GitHub
git push -u origin feat/nombre-de-la-tarea
# → Crear PR en GitHub → Esperar que GitHub Actions pase en verde → Squash and merge

# 6. Limpiar la rama local tras el merge
git checkout main && git pull origin main
git branch -d feat/nombre-de-la-tarea
```

### Convención de commits

- Idioma: Español.
- Mensaje claro y en modo imperativo (máximo 72 caracteres en la primera línea).
- Cuerpo opcional explicando el porqué del cambio cuando aplique.

```
Logos en las páginas y tarjetas de casos

- Agrega los logotipos vectoriales de Glasslake, Mandaos y UTPN
- Ajusta el contraste de fondo en tema oscuro
- Corrige tamaño de tarjetas en vista móvil
```

### Tags e hitos semánticos

Se utiliza versionado semántico para marcar hitos de despliegue:

| Tag      | Hito                                                               |
| -------- | ------------------------------------------------------------------ |
| `v0.1.0` | Lanzamiento inicial en Hostinger con 20 páginas y 3 idiomas        |
| `v0.2.0` | Activación de integraciones de producción (CRM, correo, Turnstile) |
| `v1.0.0` | Lanzamiento definitivo público con dominio personalizado           |

```bash
git tag -a v0.1.0 -m "Lanzamiento inicial en Hostinger (20 páginas, ES/EN/PT)"
git push origin v0.1.0
```

### Protección de la rama `main` en GitHub

En el repositorio GitHub (**Settings → Branches → Add rule**):

- **Branch name pattern:** `main`
- Marcar **Require a pull request before merging**.
- Marcar **Require status checks to pass before merging** y seleccionar el job `calidad`.
- Marcar **Require branches to be up to date before merging**.

## Desplegar en Hostinger

Configuración de la aplicación en Hostinger:

| Parámetro        | Valor              |
| ---------------- | ------------------ |
| Framework preset | `astro`            |
| Node.js version  | `22`               |
| Package manager  | `pnpm`             |
| Build command    | `pnpm build`       |
| Output directory | `dist`             |
| Entry file       | `server/entry.mjs` |

Variables de entorno requeridas:

- `DATABASE_URL`: Cadena MySQL/MariaDB provista por Hostinger.
- `TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`: Llaves de Cloudflare Turnstile.
- `RESEND_API_KEY`, `AVISO_CORREO_DESTINO`, `AVISO_CORREO_REMITENTE`: Envío de correos.
- `NOTION_API_KEY`, `NOTION_DATABASE_ID_CONTACTS`: Integración con CRM.
- `TAREAS_TOKEN`: Token seguro para tareas programadas.
- `HOST=0.0.0.0`: En caso de que el proxy de Hostinger requiera enlazar a todas las interfaces.
