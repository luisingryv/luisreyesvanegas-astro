// Transición de partículas hacia la sección clara de Casos (Home): el night de la sección
// anterior continúa en una franja de celdas que se deshacen con el scroll hasta dejar el
// blanco. Al volver a subir se rearma. Sin JavaScript o con "reducir movimiento", el corte
// queda recto, como en el prototipo.
import { isBelowFold, loadGsap, onceNearViewport, prefersReducedMotion } from './motion';

const CELDA = 8; // px
const SUBE = 14; // px que sube una celda al deshacerse

export function iniciarParticulas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  const seccion = canvas.closest('section');
  if (!ctx || !seccion || prefersReducedMotion() || !isBelowFold(seccion)) return;

  const color = getComputedStyle(seccion).getPropertyValue('--color-night').trim() || '#090812';
  let W = 0;
  let H = 0;
  let umbrales: number[] = [];
  let columnas = 0;
  let filas = 0;
  let progreso = 0;

  // Cada celda se deshace en su umbral: primero las de abajo (más cerca del blanco).
  const medir = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    columnas = Math.ceil(W / CELDA);
    filas = Math.ceil(H / CELDA);
    let semilla = 11;
    const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
    umbrales = Array.from({ length: columnas * filas }, (_, i) => {
      const fila = Math.floor(i / columnas);
      return 0.2 + 0.8 * ((1 - fila / filas) * 0.6 + azar() * 0.4);
    });
  };

  const dibujar = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color;
    for (let i = 0; i < umbrales.length; i++) {
      const umbral = umbrales[i]!;
      const avance = Math.max(0, Math.min(1, (progreso - (umbral - 0.2)) / 0.2));
      if (avance >= 1) continue;
      const x = (i % columnas) * CELDA;
      const y = Math.floor(i / columnas) * CELDA - avance * SUBE;
      const lado = CELDA * (1 - avance);
      ctx.globalAlpha = 1 - avance;
      ctx.fillRect(x + (CELDA - lado) / 2, y + (CELDA - lado) / 2, lado + 0.5, lado + 0.5);
    }
    ctx.globalAlpha = 1;
  };

  medir();
  dibujar();
  new ResizeObserver(() => {
    medir();
    dibujar();
  }).observe(canvas);

  onceNearViewport(seccion, async () => {
    try {
      const { ScrollTrigger } = await loadGsap();
      ScrollTrigger.create({
        trigger: seccion,
        start: 'top bottom',
        end: 'top 35%',
        scrub: true,
        onUpdate: (st) => {
          progreso = st.progress;
          dibujar();
        },
      });
    } catch {
      // Sin GSAP: se quita la franja y queda el corte recto.
      ctx.clearRect(0, 0, W, H);
    }
  });
}
