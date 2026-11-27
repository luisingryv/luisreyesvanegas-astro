// Barras apiladas de Programas AWS (tramos 25/75, hallazgos 12/25/57): si llegan desde abajo, cada
// parte crece en orden cuando la barra se ve. El HTML trae las barras completas.
import { isBelowFold, prefersReducedMotion } from './motion';

const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function iniciarBarrasApiladas(barra: HTMLElement) {
  if (prefersReducedMotion() || !isBelowFold(barra)) return;
  const partes = [...barra.children] as HTMLElement[];
  for (const parte of partes) parte.style.transform = 'scaleX(0)';
  const observador = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      observador.disconnect();
      partes.forEach((parte, i) => {
        parte.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
          duration: 600,
          delay: i * 140,
          easing: MARCA,
          fill: 'backwards',
        });
        parte.style.transform = '';
      });
    },
    { threshold: 0.3 },
  );
  observador.observe(barra);
}
