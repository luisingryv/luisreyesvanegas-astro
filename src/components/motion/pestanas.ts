// Pestañas accesibles (patrón ARIA): clic, flechas izquierda y derecha, Inicio y Fin. Cada
// pestaña muestra su panel (aria-controls). El HTML ya trae el estado inicial; sin JavaScript,
// la página oculta las pestañas y muestra todos los paneles (<noscript> en el <head>).
export function iniciarPestanas(lista: HTMLElement) {
  const pestanas = [...lista.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  if (pestanas.length === 0) return;

  const activar = (elegida: HTMLButtonElement, enfocar = false) => {
    for (const pestana of pestanas) {
      const activa = pestana === elegida;
      pestana.setAttribute('aria-selected', String(activa));
      pestana.tabIndex = activa ? 0 : -1;
      const panel = document.getElementById(pestana.getAttribute('aria-controls') ?? '');
      if (panel) panel.hidden = !activa;
    }
    if (enfocar) elegida.focus();
  };

  pestanas.forEach((pestana, i) => {
    pestana.addEventListener('click', () => activar(pestana));
    pestana.addEventListener('keydown', (evento) => {
      const total = pestanas.length;
      const destino = {
        ArrowRight: pestanas[(i + 1) % total],
        ArrowLeft: pestanas[(i - 1 + total) % total],
        Home: pestanas[0],
        End: pestanas[total - 1],
      }[evento.key];
      if (!destino) return;
      evento.preventDefault();
      activar(destino, true);
    });
  });
}
