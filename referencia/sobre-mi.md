# Referencia · Sobre mí (`/es/sobre-mi`)

Todas las rutas de esta nota son relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 19 nov 2026 (canvas "Prototipo luisreyesvanegas.com", página `SobreMi`, versión 1795117625-1f2a) y actualizada el 20 nov 2026 con el retrato y el cierre nuevo (versión 1795147005-07ae; HTML exacto en `referencia/prototipo/sobre-mi.html`). Luis aprobó Sobre mí el 13 nov 2026 y la ajustó el 18 nov. **Los textos van tal cual.** El diseño de abajo describe el prototipo; en el código se construye con tokens y componentes, no con estilos sueltos.

Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/09-SOBRE-MI.md` (del 10 nov; donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis). Historia: HU-4b.1.

## Estructura de la página (en orden)

| # | Sección | Fondo | Componentes de marca |
|---|---|---|---|
| — | Header global | night, borde inferior hairline | Header, logo blanco, nav, LanguageSwitcher, Button primario |
| 1 | Apertura (hero) | night, con las curvas del monograma en SVG decorativo | Eyebrow, h1, lead, Button primario + secundario, retrato |
| 2 | Mi historia | night, separador arriba | SectionHeader, 4 tarjetas de nivel, hitos por capítulo, tarjeta "Recorrido completo" |
| 3 | Cómo trabajo | blue-800 | SectionHeader, 4 tarjetas numeradas (fondo night) |
| 4 | EvolutecC | night | SectionHeader, 2 chips de cifra, Button secundario externo, PhotoCard 4:3 |
| 5 | Certificaciones y formación | white | SectionHeader, tarjetas (fondo blue-200) con estado |
| 6 | Testimonios | white | **Oculta** hasta que haya recomendaciones reales (regla del documento madre) |
| 7 | En el escenario | night | SectionHeader con Button a la derecha, 4 PhotoCard 4:3 |
| 8 | Cierre "¿Cómo puedo ayudarte?" | night con resplandor azul (radial #0a1a3f → #060b1c → night) | eyebrow, h2, 3 botones, enlace + logo LR en 3D (pieza 04) |
| — | Footer global | night, borde superior hairline | logo, enlaces, © |

Medidas del prototipo: contenedor de 1200 px; margen lateral `max(16px, 5vw)`; espacio de sección `clamp(56px, 8vw, 104px)` (hero `clamp(48px, 7vw, 104px)`); grillas `repeat(auto-fit, minmax(min(100%, Npx), 1fr))`; tarjetas con radio de 20 a 24 px.

**Colores que el prototipo usa y no están en los tokens:** `#c9c8ce` (texto secundario sobre night), `#a9a8ae` (texto terciario sobre night), `#24232c` (bordes en oscuro = hairline oscuro). Propón a Luis agregarlos como tokens (por ejemplo, `gray-200` y `gray-300`) antes de usarlos.

## Textos y datos

### Header (global)
- Logo blanco → inicio. Nav: Consultoría · Productos · Casos · Eventos · Sobre mí (actual). Idiomas: ES · EN · PT. Botón: "Agendar sesión".

### 1. Apertura
- Eyebrow: `SOBRE MÍ`
- H1: **Llevo 13 años construyendo tecnología.**
- Bajada: "Fundé mi primer negocio a los 16, reparando computadores y haciendo sitios web. Hoy diseño arquitecturas cloud e IA para empresas de Estados Unidos y Latinoamérica, soy CTO de EvolutecC y CEO de Trama AI."
- Botones: "Hablemos" (→ #contacto, primario) · "Invitarme a hablar" (→ /speaker, secundario).
- Imagen: **retrato editorial** (llegó el 19 nov 2026): `Archivos/Fotos/01_Retratos/retrato_sin-fecha_oficina-camiseta-blanca-sobre-mi_luis-reyes-vanegas_001.jpg` (1024 × 1039). Proporción 4:5, `object-fit: cover`, encuadre centrado con el rostro en el tercio superior (`object-position: center 30%`). Optimízalo con `astro:assets` (AVIF/WebP, `srcset`). Alt: "Luis Carlos Reyes Vanegas en su oficina". Reemplaza el espacio reservado.

### 2. Mi historia
- Eyebrow: `MI HISTORIA` · H2: **Cómo llegué hasta aquí**
- Cuatro tarjetas de nivel (rótulo "NIVEL n" y "COMPLETADO", nombre, años, barra llena).
- Cada capítulo: "NIVEL n", nombre (h3), años, rótulo opcional, y sus hitos. Cada hito: año, edad, título (h4), texto, chip con la cifra, línea "IMPACTO" y enlace opcional.
- Cierre: "RECORRIDO COMPLETO" · **13 años · 16 hitos · 2013–2026** · enlace "Siguiente nivel: tu proyecto →" (→ #contacto).

**Nivel 1 · Los cimientos · 2013–2018**
| Año | Edad | Título | Texto | Cifra | Impacto |
|---|---|---|---|---|---|
| 2013 | 16 años | R&V Technology, mi primer emprendimiento | Fundé R&V Technology: reparación de computadores y desarrollo de páginas web con Dreamweaver, con clientes formales. | Primera empresa a los 16 | Primeros clientes y primer contacto con el negocio de la tecnología. |
| 2014 | 17 años | SENA: desarrollo de software | Estudié el tecnólogo en Análisis y Desarrollo de Sistemas de Información y construí mis primeros sitios con código y frameworks como Bootstrap. | Del diseño visual al código | La base técnica de todo lo que vino después. |
| 2015 | 18 años | Sitios web para el sector hotelero | Desarrollé y administré sitios web para hoteles de Barranquilla con un modelo de suscripción mensual: hosting, dominios, DNS y soporte. | Primer modelo de ingreso recurrente | Primeros sistemas en producción para clientes reales. |
| 2016 | 19 años | Clínica del Caribe: el SIGC pasa a la web | Lideré la migración del sistema de incidencias clínicas de escritorio (VB.NET) a web (ASP.NET). Un MVP validó la propuesta y abrió paso a la migración completa. | ≈300 equipos → 1 despliegue | En uso más de 10 años después, con más de 300 usuarios. |

**Nivel 2 · La escuela de la startup · 2018–2020**
| Año | Edad | Título | Texto | Cifra | Impacto |
|---|---|---|---|---|---|
| 2018 | 21 años | Mandaos: startup de última milla | Ingresé como desarrollador web a una startup barranquillera de logística de última milla y llegué a Head of Product, a cargo del producto y de las decisiones técnicas. | Desarrollador → Head of Product | Equipo de producto de 6 personas y primer contacto con AWS. |
| 2018 | 21 años | API de integraciones y app en Ionic | Diseñé y construí una API pública para integrar a terceros y migré la app móvil de Cordova a Ionic. Farmacias como Droguería Juliao se integraron para su distribución de última milla. | De producto a plataforma | Abrió la puerta a integraciones con grandes clientes. |
| 2019 | 22 años | Integración con iFood | Integramos Mandaos con iFood tras un piloto que validó la API. Para soportar su demanda aceleramos la nueva app, que pasó a llamarse Netivery. | ≈2.400 → ≈70.000 pedidos al mes | Un resultado de todo el equipo: tecnología, operación y estrategia. |
| 2020 | 23 años | Pandemia: e-commerce en 4 días | Pusimos en línea la tienda de Ara (Jerónimo Martins) en WooCommerce, integrada con SAP Business One. La salida de iFood mostró el riesgo de depender de un solo cliente. | Tienda integrada con SAP en 4 días | La experiencia que sirvió de base para fundar EvolutecC. |

**Nivel 3 · El fundador · 2020–2023** · rótulo: "Liderado con mi equipo en EvolutecC"
| Año | Edad | Título | Texto | Cifra | Impacto |
|---|---|---|---|---|---|
| 2020 | 23 años | Fundación de EvolutecC | Cofundé EvolutecC, empresa de desarrollo de software, como CTO: producto, tecnología y arquitectura. Empezamos con sitios web y e-commerce, sin capital externo. | Fundada el 28 de agosto de 2020 | Crecimiento con recursos propios y 90% de recompra de clientes. |
| 2021 | 24 años | De agencia a fábrica de software | Primer desarrollo a la medida: una plataforma de renta de maquinaria pesada en Angular. Con ella formalizamos Scrum, historias de usuario y entregas validadas con el cliente. | Primer desarrollo a la medida | Primeras oficinas y primeros desarrolladores contratados. |
| 2022 | 25 años | ProColombia con Asesoftware | Asesoftware nos eligió por nuestra experiencia en Drupal para la plataforma de exportaciones de ProColombia. Entregamos el módulo de registro y el cliente nos asignó los módulos restantes. | De 1 módulo a toda la plataforma | Un proyecto con un año de retraso que volvió a avanzar. |
| 2023 | 26 años | Arquitecto de soluciones con TIVIT | Como aliado de TIVIT en la capa de aplicaciones, diseñé soluciones en la nube para la Fuerza Aérea Colombiana, el DNP y el SISBÉN y otras grandes organizaciones. (21 nov 2026: sin Bancolombia, corrección de Luis.) | Migraciones de hasta 30 M de usuarios | Más de 400 proyectos entregados con el equipo de EvolutecC. |

**Nivel 4 · El arquitecto y CEO · 2024–hoy**
| Año | Edad | Título | Texto | Cifra | Impacto | Enlace |
|---|---|---|---|---|---|---|
| 2024 | 27 años | Speaker en la comunidad tech | Empecé en 2023 con GDG Barranquilla y desde 2024 doy charlas, talleres y paneles sobre nube, IA y producto: BAQ.JS, TechCaribe Expo, la Cámara de Comercio de Barranquilla, GDG Summit Latam (Lima) y DevFest Ecuador (Quito), entre otros. | Colombia · Ecuador · Perú | Ahí empezó mi marca personal. | — |
| 2025 | 28 años | Cloud Expert de Glasslake | Administro la cuenta de AWS de una startup de SAP de San Francisco con presencia global, en pleno crecimiento: centralicé las cuentas con Organizations e IAM Identity Center, construí los entornos multitenant y las redes hacia los entornos de sus clientes con Transit Gateway, VPN y endpoints, y me encargo de la seguridad, los costos, el soporte y la evidencia técnica de sus certificaciones SOC 2 e ISO 27001. | US$62.000 en créditos AWS (MAP) | Créditos otorgados a través del programa MAP, con el aliado Nexa Connect. Además, el tráfico por NAT Gateway bajó entre 75 y 80% al optimizar la red. | — |
| 2025 | 28 años | Optimización de Google Cloud en UTPN | Audité la infraestructura de una red nacional de peajes, rediseñé el acceso a la videovigilancia y eliminé el tráfico de salida que disparaba la factura. | US$10.000 → US$4.000 al mes | El presupuesto liberado se convirtió en un contrato de soporte de largo plazo. | — |
| 2026 | 29 años | Trama AI gana el XPRIZE | Como CEO de Trama AI, con Gianfranco Castro, Johan Burgos y Najem Nabhan, construimos en 90 días agentes de IA para la industria textil y ganamos la categoría Small Business Services del Build with Gemini XPRIZE. | Top 100 entre 26.449 equipos | Competencia global de Google y XPRIZE. | "Fuente: gxp.moonshots.com ↗" → https://gxp.moonshots.com/ |

### 3. Cómo trabajo
- Eyebrow: `CÓMO TRABAJO` · H2: **Cuatro principios**
1. Primero entiendo tu caso de uso; después elijo la tecnología.
2. Cada número que te muestro tiene una fuente.
3. Construyo con equipo: lo que logré en EvolutecC fue con personas brillantes.
4. Uso la IA como compañero de pensamiento, no como atajo.

### 4. EvolutecC
- Eyebrow: `EVOLUTECC` · H2: **La empresa de desarrollo de software que cofundé en 2020.**
- Texto: "Como cofundador y CTO lidero un equipo que ha entregado más de 400 proyectos de software, con un 90% de recompra."
- Chips: "400+ proyectos" · "90% de recompra"
- Botón: "¿Necesitas desarrollo de software? Conoce EvolutecC ↗" → `https://evolutecc.com/?utm_source=luisreyesvanegas&utm_medium=referral&utm_campaign=sobre-mi`
- Foto (PhotoCard 4:3): `../Archivos/Fotos/04_Equipo/equipo_2025-09-01_evolutecc-aniversario-5_027.jpg` · alt: "Equipo de EvolutecC con camisetas de la marca en el quinto aniversario de la empresa"

### 5. Certificaciones y formación (sección clara)
- Eyebrow: `CERTIFICACIONES Y FORMACIÓN` · H2: **Lo que sigo aprendiendo**
- Estado "Obtenida": fondo blue-500 y texto blanco. "En proceso", "En curso" o "En trámite": fondo blanco y texto blue-600. Enlace "Verificar ↗" solo si hay URL.

| Nombre | Emisor | Fecha | Estado | Verificación |
|---|---|---|---|---|
| Introduction to Claude Cowork | Anthropic · Claude Academy | oct 2026 | Obtenida | https://academy.claude.com/verify/b56b13366f0e51dfdfe4bb5a66848762 |
| Claude 101 | Anthropic · Claude Academy | oct 2026 | Obtenida | https://academy.claude.com/verify/2ef58f9fd0d519c601075445741c464b |
| AI Fluency for small businesses | Anthropic · Claude Academy | oct 2026 | Obtenida | https://academy.claude.com/verify/25a6c43b56569653dbd1107817d19cd8 |
| Certificación Internacional en Liderazgo Transformacional (96 h) | Naranjo Consulting & Coaching | jul 2025 | Obtenida | — |
| Escuela Avanzada de Liderazgo (48 h) | Naranjo Consulting & Coaching | jul 2025 | Obtenida | — |
| Escuela Básica de Liderazgo (48 h) | Naranjo Consulting & Coaching | feb 2025 | Obtenida | — |
| Certificación Internacional en Comunicación y Oratoria (24 h) | Naranjo Consulting & Coaching | nov 2025 | Obtenida | — |
| Certificación Internacional en Coaching Ejecutivo y de Equipos | Naranjo Consulting & Coaching | 2026 | En proceso | — |
| Coaching Personal | Naranjo Consulting & Coaching | **[fecha pendiente]** | En proceso | — |
| Certificaciones de arquitectura cloud | AWS · Google Cloud | 2026 | En curso | — |
| Inglés C1 | Examen de certificación | **[fecha pendiente]** | En trámite | — |
| Tecnólogo en Análisis y Desarrollo de Sistemas de Información | SENA | **[año pendiente]** | Obtenida | — |

Los datos pendientes se muestran sin el campo, nunca con corchetes en producción. Confirma con Luis cómo prefiere mostrarlos.

### 6. Testimonios
- Eyebrow: `TESTIMONIOS` · H2: **Lo que dicen quienes han trabajado conmigo**
- **No se publica** hasta tener recomendaciones reales de LinkedIn (texto tal cual, nombre, cargo, empresa, enlace a la fuente). Deja la sección y su colección listas, ocultas con una bandera.

### 7. En el escenario
- Eyebrow: `CONFERENCIAS Y COMUNIDAD` · H2: **En el escenario** · botón a la derecha: "Invitarme a una conferencia" → /speaker#invitar

| Lugar · fecha | Título | Foto | Alt |
|---|---|---|---|
| Quito, Ecuador · nov 2025 | Cursor meetup: infraestructura en la nube con IA, Terraform y AWS | `../Archivos/Fotos/02_Escenario-y-charlas/2025-11-28_cursor-meetup-quito/evento_2025-11-28_cursor-meetup-quito_luis-reyes-vanegas_001.jpg` | Asistentes al Cursor meetup en Quito |
| Lima, Perú · ago 2025 | GDG Summit Latam 2025, con el equipo de GDG Barranquilla | `../Archivos/Fotos/02_Escenario-y-charlas/2025-08-29_gdg-summit-latam-2025-lima/evento_2025-08-29_gdg-summit-latam-2025-lima_luis-reyes-vanegas_001.jpg` | Luis Reyes con integrantes de GDG en el GDG Summit Latam 2025, Lima |
| Quito, Ecuador · nov 2025 | DevFest Ecuador 2025: infraestructura estable con Terraform y Cloud Run asistida por IA | `../Archivos/Fotos/02_Escenario-y-charlas/2025-11-29_devfest-ecuador-2025/charla_2025-11-29_devfest-ecuador-2025_luis-reyes-vanegas_001.jpg` | Luis Reyes con el equipo de DevFest Ecuador 2025 en la Universidad San Francisco de Quito |
| Barranquilla · jul 2024 | TechCaribe Expo 2024 y Google I/O Extended: Vertex AI y Cloud Run | `../Archivos/Fotos/02_Escenario-y-charlas/2024-07-27_techcaribe-expo-2024-google-io-extended/charla_2024-07-27_techcaribe-expo-2024-google-io-extended-vertex-ai-cloud-run_luis-reyes-vanegas_001.jpg` | Luis Reyes junto a la pantalla de su charla Crea aplicaciones con Vertex AI y Cloud Run en TechCaribe Expo 2024 |

Las charlas salen de la misma colección que usarán Eventos y Charlas (fuente: `../Boveda/03_Contenido/Eventos-y-charlas/Charlas y eventos.md`). Sobre mí muestra una selección marcada en la colección; no duplica datos.

### 8. Cierre (actualizado el 19 nov 2026, pedido de Luis)
- Fondo: ya no es azul. Es night con resplandor azul detrás del logo: `radial-gradient(90% 120% at 78% 50%, #0a1a3f 0%, #060b1c 55%, night 100%)`, línea superior hairline.
- Dos columnas (se apilan en móvil). Izquierda: eyebrow **HABLEMOS** (cyan-300), H2 **¿Cómo puedo ayudarte?**, botones "Consultoría" (primario blue-500, → agenda) · "Conferencia" (secundario con borde, → /speaker#invitar) · "Conversación general" (secundario, → agenda), y el enlace "Otras opciones: desarrollo de software, producto o prensa →" (cyan-300, → /contacto).
- Derecha: **pieza 04 del laboratorio, logo LR en 3D** (Three.js, el mismo código de `laboratorio-motion.html`), sin el botón "Repetir ensamble" ni el texto de ayuda. Ensambla al entrar en pantalla y sigue el cursor. Carga diferida (solo al acercarse al viewport). Respaldo sin WebGL o con "reducir movimiento": el render estático `Archivos/Fotos/_proceso/web/banners/pieza_sin-fecha_logo-lr-3d-render_luis-reyes-vanegas_001.png` con una flotación suave en CSS. Es decorativo: `aria-hidden`.
- Este cierre es un componente reutilizable (sección de cierre); la versión 3D puede usarse en otras páginas.
- La URL de la agenda de Google Calendar va en configuración (variable de entorno); Luis la entrega.

### Footer (global)
- Logo blanco. Enlaces: LinkedIn (https://www.linkedin.com/in/luis-carlos-reyes-vanegas-803306170/) · Charlas · Prensa · Contacto · "Desarrollo a la medida: EvolutecC ↗" (`https://evolutecc.com/?utm_source=luisreyesvanegas&utm_medium=referral&utm_campaign=footer`) · Privacidad y términos. "© 2026 Luis Reyes Vanegas".

## Motion de esta página (de `MOTION-DEL-SITIO.md`)
- **Protagonista: pieza 03, línea de tiempo por niveles** (laboratorio, "Pieza 3"): riel vertical que se llena con el scroll; cada nivel se desbloquea y cierra con una medalla. Reemplaza la grilla estática de capítulos sin cambiar los textos.
- **Pieza 09, insignias coleccionables** en Certificaciones: las obtenidas se estampan; las que están en proceso quedan a medio llenar (convención visual, no porcentaje).
- Cierre "Recorrido completo" con explosión de partículas.
- Sin la pieza 01 (XPRIZE): el hito de 2026 ya lo cuenta.
- Apariciones suaves en el resto.
- Todo con estado final visible con "reducir movimiento" y cifras escritas en el HTML.

## Imágenes de marca
- Logo blanco horizontal: `../Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg` (verifica cuál es la versión blanca correcta con Luis si hay duda).
- Logo a color horizontal: `../Archivos/Marca/Manual V-2025/SVG/marca-h-color.svg`.
- Ícono: `../Archivos/Marca/Manual V-2025/ICON/SVG/icon.svg`.
- Human Sans (OTF): `../Archivos/Marca/Manual V-2025/FONTS/Human Sans/` → convertir a woff2 (Light, Regular, Bold) y servir desde el sitio.
