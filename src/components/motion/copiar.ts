// Botones "Copiar": copian el texto del elemento que nombran (data-copiar) y confirman a la vista
// ("Copiada ✓" por 2 s) y a los lectores de pantalla (región data-copiar-anuncio).
const DURACION = 2000;

async function copiarTexto(fuente: HTMLElement) {
  try {
    await navigator.clipboard.writeText(fuente.textContent?.trim() ?? '');
    return true;
  } catch {
    // Sin permiso para el portapapeles: deja el texto seleccionado para copiarlo a mano.
    const rango = document.createRange();
    rango.selectNodeContents(fuente);
    const seleccion = window.getSelection();
    seleccion?.removeAllRanges();
    seleccion?.addRange(rango);
    return false;
  }
}

export function iniciarCopiar(raiz: ParentNode) {
  const anuncio = raiz.querySelector<HTMLElement>('[data-copiar-anuncio]');
  for (const boton of raiz.querySelectorAll<HTMLButtonElement>('[data-copiar]')) {
    const original = boton.textContent ?? '';
    let espera = 0;
    boton.addEventListener('click', async () => {
      const fuente = document.getElementById(boton.dataset.copiar ?? '');
      if (!fuente) return;
      if (!(await copiarTexto(fuente))) return;
      const hecho = boton.dataset.copiada ?? original;
      boton.textContent = `${hecho} ✓`;
      boton.dataset.hecho = '';
      if (anuncio) anuncio.textContent = hecho;
      clearTimeout(espera);
      espera = window.setTimeout(() => {
        boton.textContent = original;
        delete boton.dataset.hecho;
        if (anuncio) anuncio.textContent = '';
      }, DURACION);
    });
  }
}
