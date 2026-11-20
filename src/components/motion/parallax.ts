// Parallax suave para elementos decorativos con data-parallax (fracción del alto de su
// sección). GSAP se carga cuando el navegador está libre, para no tocar la carga inicial.
import { loadGsap, prefersReducedMotion } from './motion';

let iniciado = false;

export function iniciarParallax() {
  if (iniciado) return;
  iniciado = true;
  const elementos = [...document.querySelectorAll<SVGElement | HTMLElement>('[data-parallax]')];
  if (elementos.length === 0 || prefersReducedMotion()) return;

  const cuandoLibre = (fn: () => void) =>
    'requestIdleCallback' in window
      ? requestIdleCallback(fn, { timeout: 2000 })
      : setTimeout(fn, 1200);

  cuandoLibre(async () => {
    try {
      const { gsap } = await loadGsap();
      for (const el of elementos) {
        const factor = Number(el.dataset.parallax) || 0;
        const seccion = el.closest('section') ?? el.parentElement;
        if (!factor || !seccion) continue;
        gsap.to(el, {
          y: () => seccion.offsetHeight * factor,
          ease: 'none',
          scrollTrigger: {
            trigger: seccion,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    } catch {
      // Sin GSAP, las curvas quedan quietas.
    }
  });
}
