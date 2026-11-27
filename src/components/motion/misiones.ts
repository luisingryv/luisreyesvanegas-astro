// Pieza 07 · Elige tu misión (aprobada por Luis el 20 nov 2026). Las 7 tarjetas entran
// escalonadas; en escritorio se inclinan con el cursor, una luz lo sigue y la prueba se anima;
// en pantallas táctiles, la prueba se anima al entrar. Todo el texto está siempre en el HTML.
import { isBelowFold, prefersReducedMotion } from './motion';
import { animarViz } from './viz';

const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function iniciarMisiones(lista: HTMLElement) {
  if (prefersReducedMotion()) return;
  const tarjetas = [...lista.querySelectorAll<HTMLElement>('[data-mision]')];
  if (tarjetas.length === 0) return;

  const ocupadas = new WeakSet<HTMLElement>();
  const probar = (tarjeta: HTMLElement) => {
    const viz = tarjeta.querySelector<HTMLElement>('[data-viz]');
    if (!viz || ocupadas.has(tarjeta)) return;
    ocupadas.add(tarjeta);
    animarViz(viz).finally(() => setTimeout(() => ocupadas.delete(tarjeta), 200));
  };

  // Entrada escalonada, una sola vez, si llegan desde abajo.
  if (isBelowFold(lista)) {
    for (const t of tarjetas) t.style.opacity = '0';
    const entrada = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        entrada.disconnect();
        tarjetas.forEach((t, i) => {
          t.animate(
            [
              { opacity: 0, transform: 'translateY(24px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { duration: 500, delay: i * 80, easing: MARCA, fill: 'backwards' },
          );
          t.style.opacity = '';
        });
      },
      { threshold: 0.25 },
    );
    entrada.observe(lista);
  }

  const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!punteroFino) {
    // Táctil: la prueba se anima cuando la tarjeta se ve.
    for (const t of tarjetas) {
      const vista = new IntersectionObserver(
        (entradas) => {
          if (!entradas.some((e) => e.isIntersecting)) return;
          vista.disconnect();
          probar(t);
        },
        { threshold: 0.35 },
      );
      vista.observe(t);
    }
    return;
  }

  // Escritorio: inclinación, luz que sigue al cursor y prueba al pasar o con el teclado.
  for (const t of tarjetas) {
    let raf = 0;
    t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      t.style.setProperty('--mx', `${px * 100}%`);
      t.style.setProperty('--my', `${py * 100}%`);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        t.style.transform = `translateY(-4px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 9).toFixed(2)}deg)`;
      });
    });
    t.addEventListener('pointerenter', () => {
      t.style.transition = 'transform .15s ease-out, border-color .25s ease, box-shadow .25s ease';
      probar(t);
    });
    t.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      t.style.transition = `transform .45s ${MARCA}, border-color .25s ease, box-shadow .25s ease`;
      t.style.transform = '';
    });
    t.addEventListener('focus', () => probar(t));
  }
}
