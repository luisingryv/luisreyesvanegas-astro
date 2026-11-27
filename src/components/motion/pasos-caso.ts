// Casos de Consultoría: al verse la tarjeta, los pasos aparecen uno a uno (contexto, hallazgo,
// decisión, resultado) y luego la cifra anima su barra o su anillo. Si la tarjeta ya se ve al
// cargar, o con "reducir movimiento", queda como está.
import { isBelowFold, prefersReducedMotion } from './motion';
import { animarViz } from './viz';

const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function iniciarPasosCaso(caso: HTMLElement) {
  if (prefersReducedMotion() || !isBelowFold(caso)) return;
  const pasos = [...caso.querySelectorAll<HTMLElement>('[data-paso]')];
  const viz = caso.querySelector<HTMLElement>('[data-viz]');
  for (const p of pasos) p.style.opacity = '0';

  const vista = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      vista.disconnect();
      if (viz) void animarViz(viz);
      pasos.forEach((p, i) => {
        p.animate(
          [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 500, delay: 100 + i * 150, easing: MARCA, fill: 'backwards' },
        );
        p.style.opacity = '';
      });
    },
    { threshold: 0.25 },
  );
  vista.observe(caso);
}
