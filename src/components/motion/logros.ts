// Pieza 02 · Logros desbloqueados. El HTML trae las cifras finales; aquí solo se animan.
// Las tarjetas que llegan desde abajo esperan con candado y se desbloquean al verse:
// el candado se desvanece, la insignia salta, la cifra cuenta, las barras crecen y los
// sellos se estampan. Las que ya se ven al cargar quedan como están.
import {
  isBelowFold,
  loadGsap,
  onceNearViewport,
  partirCifra,
  prefersReducedMotion,
  formatoDeLaPagina,
} from './motion';

export function iniciarLogros(lista: HTMLElement) {
  if (prefersReducedMotion()) return;
  const tarjetas = [...lista.querySelectorAll<HTMLElement>('[data-logro]')].filter((t) =>
    isBelowFold(t),
  );
  if (tarjetas.length === 0) return;
  for (const t of tarjetas) t.setAttribute('data-bloqueado', '');

  onceNearViewport(lista, async () => {
    let gsap: Awaited<ReturnType<typeof loadGsap>>['gsap'];
    try {
      ({ gsap } = await loadGsap());
    } catch {
      for (const t of tarjetas) t.removeAttribute('data-bloqueado');
      return;
    }
    const formato = formatoDeLaPagina();

    const desbloquear = (tarjeta: HTMLElement, orden: number) => {
      const retraso = orden * 0.12;
      const candado = tarjeta.querySelector('.logro-candado');
      gsap.to(candado, {
        opacity: 0,
        scale: 1.04,
        duration: 0.35,
        delay: retraso,
        onComplete: () => {
          tarjeta.removeAttribute('data-bloqueado');
          gsap.set(candado, { clearProps: 'all' });
        },
      });
      gsap.from(tarjeta.querySelector('.logro-insignia'), {
        scale: 0,
        rotate: -90,
        duration: 0.6,
        delay: retraso + 0.15,
        ease: 'back.out(3)',
      });

      const cifra = tarjeta.querySelector<HTMLElement>('[data-metrica]');
      const partes = cifra && partirCifra(cifra.textContent ?? '');
      if (cifra && partes && partes.n > 1) {
        const final = cifra.textContent!;
        const valor = { n: 0 };
        // Arranca en 0 mientras el candado aún la cubre.
        cifra.textContent = `${partes.antes}0${partes.despues}`;
        gsap.to(valor, {
          n: partes.n,
          duration: 1.2,
          delay: retraso + 0.1,
          ease: 'brand',
          onUpdate: () => {
            cifra.textContent = `${partes.antes}${formato.format(Math.round(valor.n))}${partes.despues}`;
          },
          onComplete: () => {
            cifra.textContent = final;
          },
        });
      }

      gsap.from(tarjeta.querySelectorAll('[data-barra]'), {
        scaleX: 0,
        duration: 1.1,
        delay: retraso + 0.15,
        ease: 'brand',
      });
      gsap.from(tarjeta.querySelectorAll('[data-sello]'), {
        opacity: 0,
        scale: 1.6,
        duration: 0.5,
        delay: retraso + 0.3,
        stagger: 0.2,
        ease: 'back.out(2.5)',
      });
    };

    tarjetas.forEach((tarjeta, i) => {
      const observador = new IntersectionObserver(
        (entradas) => {
          if (!entradas.some((e) => e.isIntersecting)) return;
          observador.disconnect();
          desbloquear(tarjeta, i % 3);
        },
        { threshold: 0.3 },
      );
      observador.observe(tarjeta);
    });
  });
}
