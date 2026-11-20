// Riel corto de la Trayectoria del Home (versión corta de la pieza 03): cada hito tiene un
// tramo que se dibuja con el scroll, uno tras otro. El HTML trae los tramos completos.
import { isBelowFold, loadGsap, onceNearViewport, prefersReducedMotion } from './motion';

export function iniciarRielCorto(lista: HTMLElement) {
  if (prefersReducedMotion() || !isBelowFold(lista, 0.8)) return;
  const tramos = [...lista.querySelectorAll<HTMLElement>('[data-tramo]')];
  if (tramos.length === 0) return;

  onceNearViewport(lista, async () => {
    try {
      const { gsap } = await loadGsap();
      gsap
        .timeline({
          scrollTrigger: { trigger: lista, start: 'top 85%', end: 'bottom 55%', scrub: 0.6 },
        })
        .fromTo(tramos, { scaleX: 0 }, { scaleX: 1, ease: 'none', stagger: 0.8, duration: 1 });
    } catch {
      // Sin GSAP, los tramos quedan completos.
    }
  });
}
