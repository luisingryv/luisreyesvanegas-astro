// La conversación de Trama se escribe sola: al verse, los mensajes aparecen uno a uno y antes de
// cada respuesta de Trama se ve "escribiendo…". Al terminar, espera y vuelve a empezar mientras
// se ve. El HTML trae la conversación completa; con "reducir movimiento" queda así.
import { isBelowFold, prefersReducedMotion } from './motion';

const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';
const ESCRIBE = 1100; // ms de "escribiendo…" antes de una respuesta
const PAUSA = 900; // ms entre mensajes
const REINICIO = 5000; // ms con la conversación completa antes de repetirla

export function iniciarConversacion(caja: HTMLElement) {
  if (prefersReducedMotion()) return;
  const lista = caja.querySelector<HTMLElement>('[data-mensajes]');
  const escribiendo = caja.querySelector<HTMLElement>('[data-escribiendo]');
  const mensajes = [...caja.querySelectorAll<HTMLElement>('.mensaje')];
  if (!lista || !escribiendo || mensajes.length === 0) return;

  // El alto de la conversación completa queda reservado: lo de abajo no se mueve mientras se escribe.
  lista.style.minHeight = `${lista.offsetHeight}px`;

  // Si se ve al cargar, la conversación arranca completa y se repite desde la primera vuelta.
  const ocultar = () => {
    for (const m of mensajes) m.hidden = true;
  };
  if (isBelowFold(caja)) ocultar();

  let visible = false;
  let corriendo = false;
  const dormir = (ms: number) =>
    new Promise<void>((listo) => {
      window.setTimeout(listo, ms);
    });

  const mostrar = (el: HTMLElement) => {
    el.hidden = false;
    el.animate(
      [
        { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 320, easing: MARCA },
    );
  };

  const reproducir = async () => {
    if (corriendo) return;
    corriendo = true;
    while (visible) {
      ocultar();
      for (const m of mensajes) {
        if (!visible) break;
        if (m.classList.contains('mensaje-trama')) {
          lista.append(escribiendo);
          escribiendo.hidden = false;
          await dormir(ESCRIBE);
          escribiendo.hidden = true;
        } else {
          await dormir(PAUSA);
        }
        mostrar(m);
      }
      await dormir(REINICIO);
    }
    // Fuera de pantalla queda completa, como en el HTML.
    for (const m of mensajes) m.hidden = false;
    escribiendo.hidden = true;
    corriendo = false;
  };

  new IntersectionObserver(
    (entradas) => {
      // Al salir de pantalla, el ciclo termina en el siguiente paso y deja todo a la vista.
      visible = entradas.some((e) => e.isIntersecting);
      if (visible) void reproducir();
    },
    { threshold: 0.4 },
  ).observe(caja);
}
