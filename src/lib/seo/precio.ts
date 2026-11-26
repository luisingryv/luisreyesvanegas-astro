// Función pura (se prueba con Vitest): structured-data.ts depende de astro:env.

/**
 * Precio en dólares de un texto aprobado como "Sesión de arquitectura · US$450" (o "US$1.500",
 * "US$1,500"). undefined si el texto no trae un precio con ese formato.
 */
export function precioUsd(texto: string): number | undefined {
  const cifra = /US\$\s?(\d{1,3}(?:[.,]\d{3})*|\d+)(?![.,]?\d)/.exec(texto)?.[1];
  return cifra ? Number(cifra.replace(/[.,]/g, '')) : undefined;
}
