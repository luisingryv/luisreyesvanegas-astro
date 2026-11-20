// Opciones cerradas de los formularios: las comparten el esquema del contenido (textos de cada
// opción en el YAML) y la validación del servidor.
export const PRESUPUESTOS_SPEAKER = [
  'con-presupuesto',
  'viaje-y-alojamiento',
  'comunidad',
] as const;
export const NECESIDADES_PRENSA = ['entrevista', 'declaracion', 'material', 'otro'] as const;

// Programas AWS (#evaluar). El consumo es el promedio mensual en dólares.
export const TIPOS_EMPRESA_AWS = ['startup', 'datacenter', 'en-aws'] as const;
export const INFRAESTRUCTURAS_AWS = ['servidores', 'aws', 'google-cloud', 'azure', 'otra'] as const;
export const PLAZOS_AWS = ['menos-3', '3-6', '6-12', 'mas-12'] as const;
export const CONSUMOS_AWS = [1000, 2500, 5000, 10000, 20000, 30000, 50000, 100000, 250000] as const;
/** Opción elegida por defecto (prototipo). */
export const CONSUMO_AWS_INICIAL = 10000;

// Productos (#invertir): tipo de inversionista.
export const TIPOS_INVERSIONISTA = [
  'angel',
  'fondo',
  'family-office',
  'socio-estrategico',
] as const;
