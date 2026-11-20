// Pieza 12 · Competencias con nivel (port del laboratorio). Filtros por grupo con reacomodo, una
// leyenda que resalta las competencias de un nivel y, si la pieza llega desde abajo, las barras
// que se llenan grupo por grupo. Con "reducir movimiento", filtros y resaltado sin animación.
import { isBelowFold, prefersReducedMotion } from './motion';

const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function iniciarCompetencias(pieza: HTMLElement) {
  const reducir = prefersReducedMotion();
  const contenedor = pieza.querySelector<HTMLElement>('[data-grupos-competencias]');
  const grupos = [...pieza.querySelectorAll<HTMLElement>('[data-grupo-competencias]')];
  const filas = [...pieza.querySelectorAll<HTMLElement>('.competencia')];
  const filtros = [...pieza.querySelectorAll<HTMLButtonElement>('[data-filtro-grupos] button')];
  const niveles = [...pieza.querySelectorAll<HTMLButtonElement>('[data-niveles] button')];
  if (!contenedor) return;

  // Resaltar por nivel (otro clic en el mismo nivel lo apaga).
  for (const boton of niveles) {
    boton.addEventListener('click', () => {
      const encender = boton.getAttribute('aria-pressed') !== 'true';
      for (const b of niveles) b.setAttribute('aria-pressed', String(encender && b === boton));
      contenedor.classList.toggle('resaltando', encender);
      const activas = filas.filter((f) => f.dataset.nivel === boton.dataset.nivel);
      for (const f of filas) f.classList.toggle('activa', encender && activas.includes(f));
      if (!encender || reducir) return;
      activas.forEach((f, i) =>
        f.querySelectorAll('.lleno').forEach((s) =>
          s.animate(
            [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.6)' }, { transform: 'scaleY(1)' }],
            {
              duration: 350,
              delay: i * 30,
            },
          ),
        ),
      );
    });
  }

  // Filtrar por grupo, con reacomodo: cada grupo viaja desde donde estaba.
  for (const boton of filtros) {
    boton.addEventListener('click', () => {
      for (const b of filtros) b.setAttribute('aria-pressed', String(b === boton));
      const valor = boton.dataset.grupo;
      const antes = grupos.map((g) => g.getBoundingClientRect());
      for (const g of grupos) g.hidden = valor !== 'todo' && g.dataset.grupoCompetencias !== valor;
      if (reducir) return;
      grupos.forEach((g, i) => {
        if (g.hidden) return;
        const ahora = g.getBoundingClientRect();
        const previo = antes[i]!;
        if (!previo.width) {
          g.animate(
            [
              { opacity: 0, transform: 'scale(0.96)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
            { duration: 350, easing: MARCA },
          );
          return;
        }
        g.animate(
          [
            { transform: `translate(${previo.left - ahora.left}px, ${previo.top - ahora.top}px)` },
            { transform: 'none' },
          ],
          { duration: 500, easing: MARCA },
        );
      });
    });
  }

  if (reducir || !isBelowFold(pieza)) return;

  // Entrada: los segmentos se llenan grupo por grupo, fila por fila; luego aparece el valor.
  const segmentos = (fila: HTMLElement) => [...fila.querySelectorAll<HTMLElement>('.lleno')];
  for (const fila of filas) {
    for (const s of segmentos(fila)) s.style.transform = 'scaleX(0)';
    fila.querySelector<HTMLElement>('.valor')!.style.opacity = '0';
  }
  const observador = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      observador.disconnect();
      let espera = 0;
      for (const grupo of grupos) {
        for (const fila of grupo.querySelectorAll<HTMLElement>('.competencia')) {
          segmentos(fila).forEach((s, i) => {
            s.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
              duration: 220,
              delay: espera + i * 70,
              easing: MARCA,
              fill: 'backwards',
            });
            s.style.transform = '';
          });
          const valor = fila.querySelector<HTMLElement>('.valor')!;
          valor.animate(
            [
              { opacity: 0, transform: 'translateX(-6px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 300, delay: espera + segmentos(fila).length * 70, fill: 'backwards' },
          );
          valor.style.opacity = '';
          espera += 60;
        }
        espera += 120;
      }
    },
    { threshold: 0.2 },
  );
  observador.observe(contenedor);
}
