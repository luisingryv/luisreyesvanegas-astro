# Referencia · Programas de AWS (MAP con Nexa Connect) (`/es/programas-aws`)

Rutas relativas a la carpeta `Desarrollo/`.

Exportada del prototipo aprobado el 20 nov 2026 (canvas "Prototipo luisreyesvanegas.com", versión 1795147005-07ae). **El archivo `referencia/prototipo/programas-aws.html` es la fuente exacta de textos, orden y estilos de esta página**; esta nota lo resume, mapea las imágenes a sus originales y agrega lo que el HTML no dice. En el código se construye con tokens y componentes (ver `../CLAUDE.md`), no copiando estilos sueltos.

- Ficha: `../Boveda/02_Sitio-web/Requerimientos-por-pagina/08-PROGRAMAS-AWS.md` (donde difiera del prototipo, manda el prototipo; anota la diferencia y pregúntale a Luis).
- Fase: 2 · Tema: oscuro (night)
- Motion: Protagonista: gráfica del hero (el consumo crece, la proyección se dibuja y se llenan las barras de la inversión de AWS). Narrativa: tramos 25/75, las 6 fases como pasos, barra apilada 12/25/57 del caso, consumo anual del formulario con animación.

## Notas para construirla
- Nunca 'créditos gratis'. AWS invierte en la migración; 'la implementación de este programa es de costo cero' y se explica qué cubre.
- La inversión se entrega por tramos para revisar el consumo real: si no se llega a lo proyectado, AWS no carga los tramos siguientes (decisión del 17 nov 2026).
- Nexa Connect es aliado con acuerdo firmado: su logo sí se usa. Los términos del acuerdo y los nombres de contactos de AWS nunca se publican.
- El logo de Nexa Connect no está en `Archivos/`: pídeselo a Luis.

## Estructura y textos (en orden)

### Header (global)
Componente global; ver `componentes-globales.md` (el botón de la derecha cambia por página).

### 1. AWS puede invertir en tu migración.
_fondo `radial-gradient(120% 90% at 80% 10%, #0a1a3f 0%, #090812 60%)`_
- Eyebrow: MIGRACIÓN A AWS · CON NEXA CONNECT
- **H1:** AWS puede invertir en tu migración.
- Texto: Con Nexa Connect, partner de AWS, reviso tu entorno, diseño la arquitectura a la que vas a llegar y armamos el caso para que AWS evalúe cofinanciar la migración con su programa MAP. Lo hicimos con una startup de SAP de San Francisco y hoy lo llevamos a empresas de Latinoamérica y Estados Unidos.
- Enlace/botón: "Evaluar mi caso" → `#evaluar`
- Enlace/botón: "Agendar sesión de arquitectura" → `Consultoria.dc.html#agenda`

### 2. El crecimiento de tu factura no es solo un problema de costos.
- **H2:** El crecimiento de tu factura no es solo un problema de costos.
- Texto: AWS puede cofinanciar la migración de empresas que muestran uso real y en expansión, siempre con su aprobación previa y si cumplen las condiciones del programa. Por eso empezamos revisando tu cuenta, no pidiendo créditos: con el caso técnico en la mano, AWS evalúa si aplica y cuánto invierte.
- **H3:** Qué podemos migrar
- Lista repetida `{{tipos}}` (ver datos al final) con el patrón:
    - span: {{t.title}}
    - span: {{t.desc}}

### 3. ¿Es para tu empresa?
_fondo `#001531`_
- **H2:** ¿Es para tu empresa?
- Lista repetida `{{rutas}}` (ver datos al final) con el patrón:
    - Enlace/botón: "{{r.tag}} {{r.title}} {{r.desc}} {{r.umbral}}" → `#evaluar`
- Texto: Los montos son orientativos y hablan de consumo anual. Quien define si tu empresa califica es AWS.

### 4. Dos formas de empezar antes de migrar
- **H2:** Dos formas de empezar antes de migrar
- Texto: Son programas de AWS que ejecutamos con Nexa Connect. Sirven para tomar la decisión con datos y no con suposiciones.
- Eyebrow: EMPRESAS CON SERVIDORES PROPIOS O EN OTRA NUBE
- **H3:** Assessment de infraestructura
- Texto: Instalamos un agente que mide durante 7 a 15 días el uso real de CPU y memoria de tus servidores. Con esos datos armamos el caso técnico y de negocio de la migración. Todo el proceso toma de 4 a 5 semanas.
- span: Sin costo para tu empresa
- span: Aplica si tienes que decidir sobre tu infraestructura en los próximos 12 meses: renovar servidores o pasar a la nube.
- Eyebrow: STARTUPS Y EMPRESAS
- **H3:** Prueba de concepto
- Texto: En unas dos semanas probamos en AWS un caso de uso concreto, de migración o de inteligencia artificial, para validar la solución antes de decidir.
- span: Aplica cuando hay una necesidad real de tu empresa detrás de la prueba.
- Texto: Ambos programas están sujetos a la evaluación y aprobación previa de AWS.

### 5. Cómo lo hacemos
- **H2:** Cómo lo hacemos
- Texto: Seis pasos, desde la primera revisión de tu cuenta hasta que queda acompañada por el equipo de AWS de tu región. Si tu empresa tiene servidores propios, la revisión técnica se hace con el assessment. Si eres una startup, partimos de tu proyección de crecimiento.
- Lista repetida `{{fases}}` (ver datos al final) con el patrón:
    - li: {{f.n}} {{f.title}} {{f.desc}}
- **H3:** Y para cada aplicación, la estrategia que le conviene
- Lista repetida `{{estrategias}}` (ver datos al final) con el patrón:
    - b: {{e.title}}
    - span: {{e.desc}}

### 6. La inversión se calcula sobre la plataforma a la que vas.
_fondo `#001531`_
- **H2:** La inversión se calcula sobre la plataforma a la que vas.
- Texto: Quien solo muestra su factura actual deja dinero sobre la mesa. Por eso modelamos tu arquitectura objetivo en la calculadora de AWS y, con esa proyección anual, AWS evalúa si aprueba la inversión y qué porcentaje cubre. Si la aprueba, la entrega por tramos según el programa y el avance de los hitos del plan, y cada carga nueva puede abrir otra ronda.
- Texto: Los valores son estimados. Las cifras finales las define AWS en su evaluación y pueden ser diferentes.
- Eyebrow: UN EJEMPLO ESTIMADO
- span: Consumo anual proyectado
- span: US$250.000
- span: Inversión estimada de AWS
- span: ≈US$60.000
- span: Entregada por tramos
- span: Primer tramo Tramos siguientes, según los hitos
- span: Puede haber hasta tres rondas, para que acomodes tu flujo de caja mientras pasas tus cargas a la nube.

### 7. Así funcionó con una startup de SAP de San Francisco
- **H2:** Así funcionó con una startup de SAP de San Francisco
- Texto: Ya estaban en AWS y crecían con las cargas que les traían sus clientes, incluidas nuevas cuentas en Europa. Un mes nos dimos cuenta de que, en los primeros nueve días, la factura casi igualaba la del mes anterior. Ahí empezamos a armar el caso con Nexa Connect, y AWS aprobó el programa Incremental Workloads Migrate.
- Lista repetida `{{caso}}` (ver datos al final) con el patrón:
    - span: {{c.metric}}
    - span: {{c.desc}}

### 8. La implementación de este programa es de costo cero.
_fondo `#ffffff`_
- **H2:** La implementación de este programa es de costo cero.
- Texto: Esto es lo que cubre y lo que va por aparte.
- **H3:** Cubre
- Lista repetida `{{incluye}}` (ver datos al final) con el patrón:
    - li: {{i}}
- **H3:** Va por aparte
- Lista repetida `{{noIncluye}}` (ver datos al final) con el patrón:
    - li: {{i}}
- Texto: No gestionamos créditos gratis de Amazon. AWS decide si invierte en tu migración después de validar el caso técnico y comercial.
- Texto: La puerta de entrada es la sesión de arquitectura, donde identificamos si tu empresa aplica.

### 9. Quién ejecuta la migración
_fondo `#183154`_
- Eyebrow: PARTNER DE AWS
- **H2:** Quién ejecuta la migración
- Texto: Nexa Connect es partner de AWS especialista en migración y modernización, con sede en Santiago de Chile y operación en Chile, Perú, Colombia, Ecuador, México, Guatemala y Argentina. Acompaña cada proyecto desde el assessment hasta la operación productiva, incluidas las migraciones SAP más críticas. En Chile, además, factura AWS de forma local.
- Lista repetida `{{nexa}}` (ver datos al final) con el patrón:
    - span: {{n}}
- Enlace/botón: "Conoce Nexa Connect ↗" → `https://xnexaconnect.cl/migracion-a-aws/`
- Imagen: alt "Nexa Connect" · fuente `Logo de Nexa Connect (aliado con acuerdo firmado). PENDIENTE: Luis entrega el archivo; no está en Archivos/`

### 10. Preguntas frecuentes
- **H2:** Preguntas frecuentes
- Lista repetida `{{faq}}` (ver datos al final) con el patrón:
    - span: {{f.q}}
    - span: {{f.a}}

### 11. Cuéntanos de tu empresa.
_ancla `#evaluar` · fondo `#001531`_
- **H2:** Cuéntanos de tu empresa.
- Texto: Con estos datos preparo la sesión y te digo desde el principio si vemos una oportunidad para el programa.
- Texto: Los incentivos, fondos y beneficios de apoyo de Amazon Web Services están sujetos a evaluación, validación y aprobación previa por parte de Amazon Web Services. Su disponibilidad dependerá del cumplimiento de los requisitos y criterios de elegibilidad establecidos por AWS para cada programa y proyecto. La presentación de una solicitud no garantiza la aprobación y asignación.
- Enlace/botón: "Prefiero agendar la sesión (US$450)" → `Consultoria.dc.html#agenda`
- Etiqueta de campo: "Tu empresa es"
- Campo de selección: Una startup / Una empresa con datacenter propio / Una plataforma que ya está en AWS
- Etiqueta de campo: "Dónde está hoy tu infraestructura"
- Campo de selección: En mis servidores / AWS / Google Cloud / Azure / Otra nube
- Etiqueta de campo: "Consumo actual, promedio mensual"
- Campo de selección: {{c.label}}
- span: Consumo anual estimado
- span: Se calcula solo: tu promedio mensual por 12.
- Etiqueta de campo: "¿Qué quieres migrar o hacer crecer?"
- Campo textarea (texto)
- Etiqueta de campo: "¿Quién toma la decisión?"
- Campo input (text) · placeholder: Cargo
- Etiqueta de campo: "¿Cuándo tienes que tomar la decisión?"
- Campo de selección: En menos de 3 meses / Entre 3 y 6 meses / Entre 6 y 12 meses / En más de 12 meses
- Etiqueta de campo: "Empresa y país"
- Campo input (text)
- Etiqueta de campo: "Correo"
- Campo input (email)
- Botón: "Enviar"

### 12. Sección 12
_fondo `#001531`_
- span: Los incentivos y fondos de AWS están sujetos a su evaluación y aprobación previa. Presentar una solicitud no garantiza su asignación.
- Enlace/botón: "Ver condiciones" → `#condiciones`

### Footer (global)
Componente global; ver `componentes-globales.md`.

## Datos de las listas (tal cual el prototipo; las rutas de imagen ya apuntan al original)

```js
class Component extends DCLogic {
  renderVals() {
    var m = (this.state && this.state.m) || 10000;
    var fmt = function (n) { return 'US$' + n.toLocaleString('es-CO'); };
    var opts = [1000, 2500, 5000, 10000, 20000, 30000, 50000, 100000, 250000];
    return {
      consumos: opts.map(function (v, i) { return { v: v, sel: v === m, label: (i === opts.length - 1 ? 'Más de ' : '≈') + fmt(v) + ' al mes' }; }),
      anual: (m === 250000 ? 'Más de ' : '≈') + fmt(m * 12) + ' al año',
      pickConsumo: (e) => this.setState({ m: Number(e.target.value) }),
      tipos: [
        { title: 'Lo que corre en tus servidores', desc: 'VMware, Windows Server, Linux, bases de datos SQL, ERP y aplicaciones que hoy viven en tu datacenter.' },
        { title: 'Lo que tienes en otra nube', desc: 'Si estás en Google Cloud o en Azure. Trama, la empresa que dirijo, hizo este camino hacia AWS.' },
        { title: 'Las cargas nuevas de tus clientes', desc: 'Si ya estás en AWS y tus clientes llevan sus procesos a tu plataforma, esas cargas también cuentan como migración.' },
        { title: 'Tus sistemas SAP', desc: 'SAP HANA, S/4HANA y ECC, en producción, pruebas y recuperación ante desastres.' }
      ],
      rutas: [
        { tag: 'STARTUPS', title: 'Tu startup crece mes a mes', desc: 'Es donde mejor funciona el programa. Si tu consumo en AWS o en otra nube sube cada mes, vale la pena revisarlo.', umbral: 'Desde unos US$50.000 al año' },
        { tag: 'EMPRESAS', title: 'Vas a mover tu datacenter', desc: 'Para AWS, una migración empresarial empieza a ser atractiva cuando el consumo anual supera el medio millón de dólares.', umbral: 'Más de US$500.000 al año' },
        { tag: 'YA ESTÁS EN AWS', title: 'Tus clientes te traen sus cargas', desc: 'Cada cliente que lleva sus procesos a tu plataforma suma consumo nuevo en AWS, y eso también abre la puerta al programa.', umbral: 'Crecimiento sostenido' }
      ],
      fases: [
        { n: '01', title: 'Diagnóstico de elegibilidad', desc: 'Vemos cómo ha crecido tu consumo, qué cargas vienen en camino y a qué se dedica tu negocio. Si no hay caso, te lo decimos aquí.' },
        { n: '02', title: 'Revisión técnica de solo lectura', desc: 'Con un acceso de solo lectura revisamos la cuenta servicio por servicio, con el marco Well-Architected de AWS: inventario, dependencias, seguridad y costos.' },
        { n: '03', title: 'Arquitectura objetivo y business case', desc: 'Diseñamos la plataforma a la que vas a llegar, la costeamos en la calculadora de AWS y la comparamos con lo que pagas hoy.' },
        { n: '04', title: 'Registro de la oportunidad', desc: 'Con el caso listo, Nexa Connect registra la oportunidad ante AWS y se asigna tu Account Manager.' },
        { n: '05', title: 'Plan con hitos medibles', desc: 'Un plan por etapas con criterios que se pueden verificar. AWS usa esos hitos para liberar cada tramo de la inversión.' },
        { n: '06', title: 'El equipo de AWS de tu región', desc: 'La cuenta queda acompañada por el equipo regional de AWS, para nuevos programas, beneficios y soporte técnico.' }
      ],
      estrategias: [
        { title: 'Rehost', desc: 'Llevas la aplicación tal como está, rápido y con poco riesgo, y la modernizas después.' },
        { title: 'Replatform', desc: 'Haces ajustes puntuales para aprovechar servicios administrados, como bases de datos RDS o autoescalado.' },
        { title: 'Refactor', desc: 'Rediseñas la aplicación para la nube: contenedores, serverless, microservicios o IA generativa.' }
      ],
      caso: [
        { metric: 'US$62.000', desc: 'Aprobados por AWS en dos tramos: 25% al aprobar y 75% al cumplir los hitos.' },
        { metric: '94', desc: 'Hallazgos en la revisión técnica: 12 críticos, 25 medios y 57 bajos, ninguno bloqueante.' },
        { metric: '84%', desc: 'Del consumo era transferencia de datos y no cómputo. El problema estaba en la arquitectura.' },
        { metric: 'AWS LATAM', desc: 'La cuenta pasó al equipo regional de AWS, con acompañamiento comercial y técnico local.' }
      ],
      incluye: ['La implementación del programa de migración, con Nexa Connect', 'Servicios nativos de AWS: cómputo, contenedores, bases de datos, redes y almacenamiento', 'Servicios de IA de AWS, como Bedrock y Kiro, según el caso', 'Hasta tres posibles rondas de inversión, a medida que crecen tus cargas'],
      noIncluye: ['Productos de AWS Marketplace, porque son de otros fabricantes', 'La administración de tu cuenta', 'El acompañamiento mensual', 'Mi trabajo como arquitecto de soluciones, que acordamos aparte'],
      nexa: ['Migración y modernización', 'Migraciones SAP', 'Recuperación ante desastres', 'FinOps', 'Servicios administrados 24/7'],
      faq: [
        { q: '¿Mi empresa califica?', a: 'Depende de cuánto consumes, cómo viene creciendo y qué vas a migrar. Lo revisamos en la sesión de arquitectura y te damos una respuesta clara.' },
        { q: '¿Cuánto cuesta?', a: 'La implementación del programa es de costo cero. La sesión de arquitectura cuesta US$450 y es por donde empezamos.' },
        { q: '¿Y si ya estoy en AWS?', a: 'También aplica. Las cargas nuevas que te traen tus clientes pueden entrar como migración incremental.' },
        { q: '¿Qué pasa si no consumo lo que proyectamos?', a: 'AWS entrega la inversión por tramos justamente para revisar el consumo real. Si no llegas a lo proyectado, no carga los tramos siguientes.' },
        { q: '¿Qué servicios cubre?', a: 'Solo servicios nativos de AWS. Los productos de AWS Marketplace no entran, porque son de otros fabricantes.' },
        { q: '¿Pueden migrar SAP?', a: 'Sí. Nexa Connect se especializa en migraciones SAP a AWS, incluidos SAP HANA, S/4HANA y ECC.' },
        { q: '¿Funciona desde Latinoamérica?', a: 'Sí. Nexa Connect opera en siete países de la región y también atendemos empresas de Estados Unidos.' }
      ]
    };
  }
}
```

## Imágenes de esta página

| En el prototipo | Original |
|---|---|
| `/_blob/a600147f…` | `Logo de Nexa Connect (aliado con acuerdo firmado). PENDIENTE: Luis entrega el archivo; no está en Archivos/` |
| `/_blob/ac63bc5e…` | `Archivos/Marca/Manual V-2025/SVG/marca-h-color-blanco.svg (logo horizontal para fondo oscuro)` |

Cópialas a `src/assets/` con su nombre y optimízalas con `astro:assets` (AVIF/WebP, `srcset`). Las fotos de eventos van en PhotoCard 4:3 sin recorte (fondo desenfocado detrás, ver `CLAUDE.md`). El encuadre (`object-position`) de cada foto está en los datos.

## Pendientes detectados en el prototipo

- Ninguno en el HTML.
