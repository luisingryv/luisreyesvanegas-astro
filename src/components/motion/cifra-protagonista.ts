// Pieza 02 como protagonista de una subpágina: la cifra cuenta desde 0 al verse y sus barras
// crecen. El número final está en el HTML; si la tarjeta ya se ve al cargar, o con "reducir
// movimiento", queda como está.
import { isBelowFold, partirCifra, prefersReducedMotion, formatoDeLaPagina } from './motion';

const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';
const salida = (t: number) => 1 - Math.pow(1 - t, 4);

export function iniciarCifraProtagonista(tarjeta: HTMLElement) {
  if (prefersReducedMotion() || !isBelowFold(tarjeta)) return;
  const cifra = tarjeta.querySelector<HTMLElement>('[data-metrica]');
  const barras = [...tarjeta.querySelectorAll<HTMLElement>('[data-barra]')];
  const final = cifra?.textContent?.trim() ?? '';
  const partes = partirCifra(final);
  const formato = formatoDeLaPagina();

  const vista = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      vista.disconnect();
      barras.forEach((b, i) =>
        b.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
          duration: 1100,
          delay: 150 + i * 180,
          easing: MARCA,
          fill: 'backwards',
        }),
      );
      if (!cifra || !partes || partes.n <= 1) return;
      const inicio = performance.now();
      const duracion = 1200;
      const cuadro = (ahora: number) => {
        const t = Math.min(1, (ahora - inicio) / duracion);
        cifra.textContent = `${partes.antes}${formato.format(Math.round(partes.n * salida(t)))}${partes.despues}`;
        if (t < 1) requestAnimationFrame(cuadro);
        else cifra.textContent = final;
      };
      requestAnimationFrame(cuadro);
    },
    { threshold: 0.5 },
  );
  vista.observe(tarjeta);
}
