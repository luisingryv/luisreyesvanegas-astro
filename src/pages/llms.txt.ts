import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? 'https://luisreyesvanegas.com';

  const content = `# Luis Carlos Reyes Vanegas

> Consultor de Arquitectura Cloud, Especialista en AWS e Inteligencia Artificial, Speaker Internacional y Fundador de EvolutecC.

## Resumen Ejecutivo
Luis Carlos Reyes Vanegas es arquitecto de soluciones de infraestructura y datos con más de una década de experiencia acompañando a empresas en América Latina y Estados Unidos a diseñar, escalar y optimizar sistemas en AWS, modernizar arquitecturas e integrar soluciones de Inteligencia Artificial generativa.

## Áreas de Consultoría
- **Optimización de Costos Cloud (FinOps):** Reducción de gasto en AWS sin comprometer rendimiento ni resiliencia.
- **Escalamiento y Resiliencia:** Arquitecturas de alta disponibilidad, contenedores (ECS/EKS) y migraciones a la nube.
- **Adopción de Inteligencia Artificial:** Estrategia e integración de modelos LLM (Claude en AWS Bedrock, OpenAI, Gemini) en procesos de negocio reales.
- **Acompañamiento Mensual (Retainers):** Asesoría continua y supervisión arquitectónica para CTOs y equipos de ingeniería.
- **Sesión de Arquitectura 1 a 1:** Diagnóstico técnico estratégico de alto impacto.

## Conferencias y Formación (Speaker)
Conferencista en eventos internacionales como DevFest, TechCaribe, Google Developer Groups (GDG), universidades y gremios empresariales. Charlas sobre computación en la nube, agentes de IA, ingeniería de software y cultura tecnológica.

## Productos Tecnológicos
- **Trama:** Plataforma para gestión de compliance y operaciones empresariales.
- **Ofilix:** Solución digital para espacios de trabajo y productividad.
- **NeoMKT:** Herramientas de automatización de marketing y analítica.

## Enlaces Principales
- [Página de inicio (Español)](${base}/es)
- [Home (English)](${base}/en)
- [Início (Português)](${base}/pt)
- [Consultoría Cloud e IA](${base}/es/consultoria)
- [Casos de Éxito](${base}/es/casos)
- [Sobre mí / Trayectoria](${base}/es/sobre-mi)
- [Conferencias y Charlas](${base}/es/speaker)
- [Eventos y Galerías](${base}/es/eventos)
- [Artículos y Noticias](${base}/es/noticias)
- [Contacto](${base}/es/contacto)
- [Sitemap XML](${base}/sitemap.xml)
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
