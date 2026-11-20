// Filtros del índice de casos: un tema y un tipo a la vez. Las tarjetas se reacomodan con GSAP
// Flip (se carga al primer clic). Con "reducir movimiento", el cambio es inmediato.
import { loadGsap, prefersReducedMotion } from './motion';

export function iniciarFiltrosCasos(indice: HTMLElement) {
  const lista = indice.querySelector<HTMLElement>('[data-lista-casos]');
  const items = [...indice.querySelectorAll<HTMLElement>('[data-lista-casos] > li')];
  const vacio = indice.querySelector<HTMLElement>('[data-vacio]');
  const botones = [...indice.querySelectorAll<HTMLButtonElement>('[data-grupo]')];
  if (!lista || !vacio || items.length === 0) return;

  const elegido: Record<string, string> = { tema: 'todos', tipo: 'todos' };

  const coincide = (item: HTMLElement) =>
    (elegido.tema === 'todos' || (item.dataset.temas ?? '').split(' ').includes(elegido.tema!)) &&
    (elegido.tipo === 'todos' || item.dataset.tipo === elegido.tipo);

  const aplicar = async () => {
    const mostrar = () => {
      let visibles = 0;
      for (const item of items) {
        item.hidden = !coincide(item);
        if (!item.hidden) visibles++;
      }
      vacio.hidden = visibles > 0;
    };
    if (prefersReducedMotion()) return mostrar();
    try {
      const { gsap, Flip } = await loadGsap();
      // getState también termina un Flip a medias, si alguien hace clic durante la animación.
      const estado = Flip.getState(items);
      gsap.killTweensOf(lista);
      const altoAntes = lista.offsetHeight;
      mostrar();
      lista.style.height = '';
      const altoDespues = lista.offsetHeight;
      // Durante el Flip las tarjetas salen del flujo: la lista anima su alto para que lo que
      // sigue debajo no salte.
      gsap.fromTo(
        lista,
        { height: altoAntes },
        { height: altoDespues, duration: 0.5, ease: 'brand', clearProps: 'height' },
      );
      Flip.from(estado, {
        duration: 0.5,
        ease: 'brand',
        absolute: true,
        onEnter: (entran) =>
          gsap.fromTo(entran, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4 }),
        onLeave: (salen) => gsap.to(salen, { opacity: 0, scale: 0.96, duration: 0.25 }),
      });
    } catch {
      mostrar();
    }
  };

  for (const boton of botones) {
    boton.addEventListener('click', () => {
      const grupo = boton.dataset.grupo!;
      elegido[grupo] = boton.dataset.valor!;
      for (const b of botones) {
        if (b.dataset.grupo === grupo) b.setAttribute('aria-pressed', String(b === boton));
      }
      void aplicar();
    });
  }
}
