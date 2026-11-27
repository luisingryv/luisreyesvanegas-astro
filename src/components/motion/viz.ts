// Anima una mini visualización (brand/Viz.astro) desde cero hasta su estado final, que ya
// está en el HTML. Web Animations, sin librerías. Devuelve una promesa al terminar.
const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';
const REBOTE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const CIRCUNFERENCIA = 163.4;

const fin = (animaciones: Animation[]) =>
  Promise.all(animaciones.map((a) => a.finished.catch(() => undefined))).then(() => undefined);

export function animarViz(viz: HTMLElement): Promise<void> {
  const tipo = viz.dataset.viz;
  const todos = <T extends Element>(sel: string) => [...viz.querySelectorAll<T & HTMLElement>(sel)];

  switch (tipo) {
    case 'barras':
      return fin(
        todos('[data-barra]').map((b, i) =>
          b.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
            duration: 900,
            delay: i * 130,
            easing: MARCA,
            fill: 'backwards',
          }),
        ),
      );
    case 'anillo':
      return fin(
        todos<SVGCircleElement>('[data-anillo]').map((c) =>
          c.animate([{ strokeDashoffset: CIRCUNFERENCIA }, { strokeDashoffset: 0 }], {
            duration: 1100,
            easing: MARCA,
            fill: 'backwards',
          }),
        ),
      );
    case 'migrar': {
      const carril = viz.querySelector<HTMLElement>('[data-carril]');
      if (!carril) return Promise.resolve();
      const ancho = carril.clientWidth - 8;
      const puntos = [...carril.querySelectorAll<HTMLElement>('b')].map((p, i) => {
        const inicio = p.offsetLeft;
        return p.animate(
          [
            { transform: `translateX(${-inicio}px)`, opacity: 0 },
            { opacity: 1, offset: 0.2 },
            { opacity: 1, offset: 0.8 },
            { transform: `translateX(${ancho - inicio}px)`, opacity: 0 },
          ],
          { duration: 1100, delay: i * 220, easing: 'ease-in-out' },
        );
      });
      const destino = viz.querySelector<HTMLElement>('[data-destino]');
      const salto = destino?.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }],
        { duration: 400, delay: 1100 },
      );
      return fin(salto ? [...puntos, salto] : puntos);
    }
    case 'ticks':
      return fin(
        todos('[data-tick]').map((t, i) =>
          t.animate(
            [
              { opacity: 0.15, transform: 'scaleY(0.3)' },
              { opacity: 1, transform: 'scaleY(1)' },
            ],
            { duration: 250, delay: i * 50, easing: MARCA, fill: 'backwards' },
          ),
        ),
      );
    case 'sellos':
      return fin(
        todos('[data-sello]').map((s, i) =>
          s.animate(
            [
              { opacity: 0, transform: 'scale(1.6)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
            { duration: 500, delay: i * 220, easing: REBOTE, fill: 'backwards' },
          ),
        ),
      );
    case 'cuatroD':
      return fin(
        todos('[data-d]').map((d, i) =>
          d.animate(
            [
              { opacity: 0.2, transform: 'scale(0.4)' },
              { opacity: 1, transform: 'scale(1.15)', offset: 0.7 },
              { opacity: 1, transform: 'scale(1)' },
            ],
            { duration: 450, delay: i * 140, fill: 'backwards' },
          ),
        ),
      );
    default:
      return Promise.resolve();
  }
}
