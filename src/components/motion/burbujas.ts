// Pieza 08 · Burbujas de casos (port del laboratorio con Web Animations, sin librerías).
// Cada burbuja es un enlace real: al hacer clic revienta en partículas y luego abre el caso.
// Flotan, se apartan un poco del cursor y se inflan al entrar en pantalla.
// Con "reducir movimiento" quedan como enlaces quietos.
import { isBelowFold, prefersReducedMotion } from './motion';

const ESPERA_ANTES_DE_ABRIR = 420; // ms: lo que tarda en reventar
const RADIO_CURSOR = 190;
const REBOTE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

interface Burbuja {
  el: HTMLAnchorElement;
  interior: HTMLElement;
  fase: number;
  frecuencia: number;
  x: number;
  y: number;
  s: number;
  encima: boolean;
}

export function iniciarBurbujas(campo: HTMLElement) {
  if (prefersReducedMotion()) return;
  const estallido = campo.querySelector<HTMLElement>('[data-estallido]');
  const burbujas: Burbuja[] = [
    ...campo.querySelectorAll<HTMLAnchorElement>('[data-burbuja]'),
  ].flatMap((el, i) => {
    const interior = el.firstElementChild as HTMLElement | null;
    return interior
      ? [
          {
            el,
            interior,
            fase: i * 1.7,
            frecuencia: 0.55 + (i % 3) * 0.14,
            x: 0,
            y: 0,
            s: 1,
            encima: false,
          },
        ]
      : [];
  });
  if (!estallido || burbujas.length === 0) return;

  let abriendo = false;
  const animaciones: Animation[] = [];

  const reventar = (b: Burbuja) => {
    const r = b.interior.getBoundingClientRect();
    const c = campo.getBoundingClientRect();
    const cx = r.left - c.left + r.width / 2;
    const cy = r.top - c.top + r.height / 2;
    const radio = r.width / 2;
    animaciones.push(
      b.interior.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(1.16)', opacity: 1, offset: 0.5 },
          { transform: 'scale(1.32)', opacity: 0 },
        ],
        { duration: 280, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
      ),
    );
    estallido.replaceChildren(...Array.from({ length: 22 }, () => document.createElement('i')));
    [...estallido.children].forEach((gota, i) => {
      const a = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
      const d0 = radio * 0.8;
      const d1 = radio + 40 + Math.random() * 60;
      const p = gota as HTMLElement;
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.animate(
        [
          {
            transform: `translate(${Math.cos(a) * d0}px, ${Math.sin(a) * d0}px) scale(1)`,
            opacity: 1,
          },
          { opacity: 1, offset: 0.5 },
          {
            transform: `translate(${Math.cos(a) * d1}px, ${Math.sin(a) * d1 + 18}px) scale(0.5)`,
            opacity: 0,
          },
        ],
        { duration: 800, delay: 160, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' },
      );
    });
  };

  for (const b of burbujas) {
    b.el.addEventListener('click', (e) => {
      // Abrir en otra pestaña o con modificadores: comportamiento normal del enlace.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      e.preventDefault();
      if (abriendo) return;
      abriendo = true;
      reventar(b);
      setTimeout(() => window.location.assign(b.el.href), ESPERA_ANTES_DE_ABRIR);
    });
    b.el.addEventListener('pointerenter', () => (b.encima = true));
    b.el.addEventListener('pointerleave', () => (b.encima = false));
    b.el.addEventListener('focus', () => (b.encima = true));
    b.el.addEventListener('blur', () => (b.encima = false));
  }

  // Al volver con el botón Atrás (caché del navegador), la burbuja reventada reaparece.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    abriendo = false;
    animaciones.splice(0).forEach((a) => a.cancel());
    estallido.replaceChildren();
  });

  // Flotar y apartarse del cursor, solo mientras se ven.
  const cursor = { x: 0, y: 0, dentro: false };
  campo.addEventListener('pointermove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    cursor.dentro = true;
  });
  campo.addEventListener('pointerleave', () => (cursor.dentro = false));

  let raf = 0;
  const cuadro = (ahora: number) => {
    const t = ahora / 1000;
    for (const b of burbujas) {
      let tx = Math.sin(t * b.frecuencia + b.fase) * 6;
      let ty = Math.cos(t * b.frecuencia * 0.8 + b.fase) * 9;
      if (cursor.dentro && !abriendo && !b.encima) {
        const r = b.el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - b.x - cursor.x;
        const dy = r.top + r.height / 2 - b.y - cursor.y;
        const d = Math.hypot(dx, dy);
        if (d > 1 && d < RADIO_CURSOR) {
          const k = (1 - d / RADIO_CURSOR) * 16;
          tx += (dx / d) * k;
          ty += (dy / d) * k;
        }
      }
      const escala = b.encima && !abriendo ? 1.08 : 1;
      b.x += (tx - b.x) * 0.1;
      b.y += (ty - b.y) * 0.1;
      b.s += (escala - b.s) * 0.18;
      b.el.style.transform = `translate(${b.x.toFixed(2)}px, ${b.y.toFixed(2)}px) scale(${b.s.toFixed(3)})`;
    }
    raf = requestAnimationFrame(cuadro);
  };
  new IntersectionObserver(
    (entradas) => {
      cancelAnimationFrame(raf);
      if (entradas.some((e) => e.isIntersecting)) raf = requestAnimationFrame(cuadro);
    },
    { threshold: 0.1 },
  ).observe(campo);

  // Entrada: si llegan desde abajo, se inflan una tras otra al verse.
  if (!isBelowFold(campo)) return;
  for (const b of burbujas) b.interior.style.opacity = '0';
  const entrada = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      entrada.disconnect();
      burbujas.forEach((b, i) => {
        b.interior.animate(
          [
            { transform: 'scale(0.3)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 },
          ],
          { duration: 650, delay: i * 70, easing: REBOTE, fill: 'backwards' },
        );
        b.interior.style.opacity = '';
      });
    },
    { threshold: 0.3 },
  );
  entrada.observe(campo);
}
