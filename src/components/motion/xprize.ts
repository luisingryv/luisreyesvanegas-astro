// Pieza 01 · Port del laboratorio (canvas). Cada punto representa unos 10 equipos: los
// 26.449 inscritos se dibujan en espiral, 10 se separan como el Top 100 y uno llega al centro,
// donde aparece la medalla con una onda y confeti.
import { isBelowFold, onceNearViewport, prefersReducedMotion, formatoDeLaPagina } from './motion';

const N = 2645;
const GA = Math.PI * (3 - Math.sqrt(5));
const TOP = [143, 412, 690, 911, 1203, 1490, 1777, 2032, 2290, 2580];
const WIN = 1203;
const ES_TOP = new Set(TOP);
const FIN = 6400; // ms
const MEDALLA = 4400;

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

type Rgb = [number, number, number];
const rgb = (hex: string): Rgb => {
  const h = hex.trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
};
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r},${g},${b},${a})`;

export function iniciarXprize(campo: HTMLElement) {
  const canvas = campo.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  const contador = campo.querySelector<HTMLElement>('[data-contador]');
  const contadorTexto = campo.querySelector<HTMLElement>('[data-contador-texto]');
  const fases = [...campo.querySelectorAll<HTMLElement>('[data-fase]')];
  if (!canvas || !ctx || !contador || !contadorTexto) return;

  const d = campo.dataset;
  const total = Number(d.total);
  const finalistas = Number(d.finalistas);
  const formato = formatoDeLaPagina();

  // Colores de los tokens (el canvas no lee variables CSS).
  const estilo = getComputedStyle(campo);
  const color = (nombre: string) => rgb(estilo.getPropertyValue(nombre));
  const acento = color('--color-accent');
  const punto = color('--color-blue-300');
  const confetiColores = [
    '--color-accent',
    '--color-cyan-300',
    '--color-white',
    '--color-blue-400',
  ].map((c) => estilo.getPropertyValue(c).trim());

  // Confeti determinista: siempre igual.
  let semilla = 7;
  const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
  const confeti = Array.from({ length: 70 }, () => {
    const a = azar() * Math.PI * 2;
    const v = 0.35 + azar() * 0.75;
    return {
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 0.35,
      rot: azar() * 6,
      vr: (azar() - 0.5) * 0.02,
      color: confetiColores[Math.floor(azar() * 4)]!,
      w: 4 + azar() * 5,
    };
  });

  let W = 0;
  let H = 0;
  let R = 0;
  const medir = () => {
    const r = campo.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    R = Math.min(W, H) * 0.42;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const dibujar = (t: number) => {
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H / 2;
    // Anillos guía, eco de las curvas del monograma.
    ctx.lineWidth = 1;
    for (let k = 1; k <= 4; k++) {
      ctx.strokeStyle = rgba(punto, 0.06 + (k === 3 ? 0.05 : 0));
      ctx.beginPath();
      ctx.arc(cx, cy, (R * k) / 3.4, 0, Math.PI * 2);
      ctx.stroke();
    }
    const p2 = ease(seg(t, 1700, 3100));
    const p3 = ease(seg(t, 3400, MEDALLA));
    const abre = 1 + 0.08 * p2;
    for (let i = 0; i < N; i++) {
      const ang = i * GA;
      const rr = R * Math.sqrt((i + 0.5) / N);
      let x = cx + Math.cos(ang) * rr * abre;
      let y = cy + Math.sin(ang) * rr * abre;
      const aparece = clamp((t - 1200 * Math.sqrt(i / N)) / 250);
      if (aparece <= 0) continue;
      if (ES_TOP.has(i)) {
        const k = TOP.indexOf(i);
        const ra = -Math.PI / 2 + k * ((Math.PI * 2) / TOP.length);
        const rx = cx + Math.cos(ra) * R * 0.7;
        const ry = cy + Math.sin(ra) * R * 0.7;
        x += (rx - x) * p2;
        y += (ry - y) * p2;
        let a = 0.55 + 0.45 * p2;
        let s = 1.4 + 3 * p2;
        if (i === WIN) {
          x += (cx - x) * p3;
          y += (cy - y) * p3;
          s += 4 * p3;
          if (t > MEDALLA) continue; // queda detrás de la medalla
          ctx.shadowColor = rgba(acento, 0.9);
          ctx.shadowBlur = 18 * p2;
        } else {
          a *= 1 - 0.65 * p3;
          ctx.shadowBlur = 8 * p2;
          ctx.shadowColor = rgba(acento, 0.6);
        }
        ctx.fillStyle = rgba(acento, a * aparece);
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (p2 > 0 && i !== WIN) {
          ctx.strokeStyle = rgba(acento, 0.18 * p2 * (1 - 0.7 * p3));
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = rgba(punto, (0.5 - 0.43 * p2) * aparece);
        ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
    }
    // Onda y confeti al llegar al centro.
    const dt = t - MEDALLA;
    if (dt > 0 && dt < 1800) {
      const w = dt / 1800;
      ctx.strokeStyle = rgba(acento, 0.5 * (1 - w));
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, R * (0.3 + 1.1 * ease(w)), 0, Math.PI * 2);
      ctx.stroke();
      for (const c of confeti) {
        const s = dt * 0.55;
        const px = cx + c.vx * s * (R / 260);
        const py = cy + (c.vy * s + 0.00018 * s * s) * (R / 260);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(c.rot + c.vr * dt);
        ctx.globalAlpha = 1 - w;
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.w / 4, c.w, c.w / 2);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
  };

  const fase = (activa: number) =>
    fases.forEach((el, i) => el.toggleAttribute('data-on', i === activa));

  const hud = (t: number) => {
    if (t < 1700) {
      fase(0);
      contadorTexto.textContent = d.textoEquipos ?? '';
      contador.textContent = formato.format(Math.round(total * ease(seg(t, 0, 1400))));
    } else if (t < MEDALLA) {
      fase(1);
      contadorTexto.textContent = d.textoFinalistas ?? '';
      const n = Math.round(total - (total - finalistas) * ease(seg(t, 1700, 3100)));
      contador.textContent = (d.textoTop ?? '').replace('{n}', formato.format(n));
    } else {
      fase(2);
      contadorTexto.textContent = d.textoGanador ?? '';
      contador.textContent = d.textoFinal ?? '';
    }
  };

  let reproduciendo = false;
  let tActual = FIN;

  const reproducir = () => {
    reproduciendo = true;
    const inicio = performance.now();
    let medalla = false;
    const cuadro = (ahora: number) => {
      tActual = ahora - inicio;
      dibujar(tActual);
      hud(tActual);
      if (!medalla && tActual >= MEDALLA) {
        medalla = true;
        campo.dataset.estado = 'medalla';
      }
      if (tActual < FIN) requestAnimationFrame(cuadro);
      else {
        reproduciendo = false;
        tActual = FIN;
        dibujar(FIN);
      }
    };
    requestAnimationFrame(cuadro);
  };

  medir();
  new ResizeObserver(() => {
    medir();
    if (!reproduciendo) dibujar(tActual);
  }).observe(campo);

  // Con "reducir movimiento" o si ya se ve al cargar: el estado final, sin secuencia.
  if (prefersReducedMotion() || !isBelowFold(campo, 0.6)) {
    dibujar(FIN);
    return;
  }

  // Llega desde abajo: espera oculta y se reproduce una vez al verse a la mitad.
  tActual = 0;
  campo.dataset.estado = 'previo';
  dibujar(0);
  hud(0);
  onceNearViewport(campo, () => {
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          observador.disconnect();
          setTimeout(reproducir, 150);
        }
      },
      { threshold: 0.35 },
    );
    observador.observe(campo);
  });
}
