// Kit de prensa: las fotos oficiales (src/assets/prensa), los logos del manual de marca y los
// textos de la página (bio y datos del XPRIZE). La página muestra lo mismo que trae el .zip.
import type { ImageMetadata } from 'astro';

const fotos = import.meta.glob<ImageMetadata>('/src/assets/prensa/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default',
});

/** Foto oficial por nombre de archivo (el que dice paginas/prensa.yaml). */
export function fotoPrensa(archivo: string): ImageMetadata {
  const foto = fotos[`/src/assets/prensa/${archivo}`];
  if (!foto) throw new Error(`paginas/prensa: no existe src/assets/prensa/${archivo}.`);
  return foto;
}

/** Ruta en disco de una foto oficial (para armar el .zip al construir el sitio). */
export const rutaFotoPrensa = (archivo: string) => `src/assets/prensa/${archivo}`;

/** Logos del manual (Manual V-2025): horizontal blanco, horizontal a color y monograma. */
export const LOGOS_KIT = [
  { archivo: 'marca-h-color-blanco', formatos: ['svg', 'png'] },
  { archivo: 'marca-h-color', formatos: ['svg', 'png'] },
  { archivo: 'icon', nombre: 'monograma-lr-color', formatos: ['svg', 'png'] },
  { archivo: 'icon-b', nombre: 'monograma-lr-blanco', formatos: ['svg', 'png'] },
] as const;

export const rutaLogo = (archivo: string, formato: string) =>
  `src/assets/brand/${archivo}.${formato}`;

/** Nombre del archivo que se descarga. */
export const NOMBRE_KIT = 'kit-de-prensa-luis-reyes-vanegas';
