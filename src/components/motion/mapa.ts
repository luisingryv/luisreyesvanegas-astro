// Pieza 10 · Mapa de ciudades (port del laboratorio). Cada ciudad abre su panel. Si el mapa llega
// desde abajo, las ciudades aparecen en orden cronológico y las rutas se dibujan; después, un
// pulso recorre las rutas mientras el mapa está en pantalla. Con "reducir movimiento" solo queda
// la elección de ciudad, sin entrada ni pulso.
import { isBelowFold, prefersReducedMotion } from './motion';

const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';
const CICLO = 4200; // ms que tarda el pulso en recorrer las dos rutas

export function iniciarMapa(mapa: HTMLElement) {
  const ciudades = [...mapa.querySelectorAll<HTMLButtonElement>('[data-ciudad]')];
  const paneles = [...mapa.querySelectorAll<HTMLElement>('[data-panel-ciudad]')];
  const reducir = prefersReducedMotion();

  const elegir = (codigo: string) => {
    for (const c of ciudades) c.setAttribute('aria-pressed', String(c.dataset.ciudad === codigo));
    for (const p of paneles) p.hidden = p.dataset.panelCiudad !== codigo;
    const panel = paneles.find((p) => p.dataset.panelCiudad === codigo);
    if (!panel || reducir) return;
    panel.querySelectorAll('li').forEach((li, i) =>
      li.animate(
        [
          { opacity: 0, transform: 'translateX(16px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 400, delay: 100 + i * 80, easing: MARCA, fill: 'backwards' },
      ),
    );
  };
  for (const c of ciudades) c.addEventListener('click', () => elegir(c.dataset.ciudad ?? ''));

  if (reducir) return;

  const rutas = [...mapa.querySelectorAll<SVGPathElement>('[data-ruta]')];
  const pulso = mapa.querySelector<SVGCircleElement>('[data-pulso]');
  if (rutas.length < 2 || !pulso) return;

  // Entrada: solo si el mapa llega desde abajo (arriba ya se ve completo).
  const entrar = isBelowFold(mapa);
  if (entrar) {
    for (const c of ciudades) c.style.opacity = '0';
    for (const r of rutas) r.style.strokeDashoffset = '1';
  }
  const animarEntrada = () => {
    ciudades.forEach((c, i) => {
      c.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        delay: i * 900,
        fill: 'backwards',
      });
      c.style.opacity = '';
      c.querySelector('.ciudad-pin')?.animate(
        [{ transform: 'scale(0)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }],
        { duration: 550, delay: i * 900, easing: MARCA, fill: 'backwards' },
      );
    });
    rutas.forEach((r, i) => {
      r.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: i === 0 ? 800 : 700,
        delay: i === 0 ? 350 : 1250,
        easing: 'ease-in-out',
        fill: 'backwards',
      });
      r.style.strokeDashoffset = '';
    });
  };

  // Pulso por las rutas: 55 % del ciclo en la primera, 45 % en la segunda.
  const [ruta1, ruta2] = rutas as [SVGPathElement, SVGPathElement];
  const largo1 = ruta1.getTotalLength();
  const largo2 = ruta2.getTotalLength();
  let raf = 0;
  let inicio = 0;
  const cuadro = (ahora: number) => {
    if (ahora < inicio) {
      pulso.style.opacity = '0';
      raf = requestAnimationFrame(cuadro);
      return;
    }
    const u = ((ahora - inicio) / CICLO) % 1;
    const enPrimera = u < 0.55;
    const k = enPrimera ? u / 0.55 : (u - 0.55) / 0.45;
    const punto = enPrimera
      ? ruta1.getPointAtLength(k * largo1)
      : ruta2.getPointAtLength(k * largo2);
    pulso.setAttribute('cx', punto.x.toFixed(1));
    pulso.setAttribute('cy', punto.y.toFixed(1));
    pulso.style.opacity = (0.25 + 0.75 * Math.sin(Math.PI * k)).toFixed(2);
    raf = requestAnimationFrame(cuadro);
  };

  let empezado = false;
  let corriendo = false;
  new IntersectionObserver(
    (entradas) => {
      const visible = entradas.some((e) => e.isIntersecting);
      if (visible && !empezado) {
        empezado = true;
        if (entrar) animarEntrada();
        inicio = performance.now() + (entrar ? 2000 : 0);
      }
      if (visible && !corriendo) {
        corriendo = true;
        raf = requestAnimationFrame(cuadro);
      }
      if (!visible && corriendo) {
        corriendo = false;
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0.3 },
  ).observe(mapa);
}
