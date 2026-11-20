// Pieza 11 · Port del laboratorio. Al verse: arranca en "antes", a los 2,2 s pasa sola a
// "después" (la cifra cuenta y los nodos que cambian se resaltan) y los paquetes viajan de
// tarjeta en tarjeta. Los botones Antes/Después permiten comparar. Con "reducir movimiento"
// se queda en el "después" del HTML, sin paquetes.
import { prefersReducedMotion, formatoDeLaPagina } from './motion';

const MARCA = 'cubic-bezier(0.22, 1, 0.36, 1)';
const VIAJE = 0.9; // segundos que tarda un paquete en recorrer una conexión
const PASA_SOLA = 2200; // ms en "antes" antes de pasar a "después"

interface Nodo {
  titulo: string;
  detalle: string;
  chips?: string[];
  clave?: boolean;
  alerta?: boolean;
}
interface Etapa {
  valor: number;
  delta?: string;
  texto: string;
  nodos: Nodo[];
  flujos: [number, number][];
}
interface Datos {
  prefijo: string;
  antes: Etapa;
  despues: Etapa;
}
type Momento = 'antes' | 'despues';

const salida = (t: number) => 1 - Math.pow(1 - t, 4);

export function iniciarFlujo(figura: HTMLElement) {
  if (prefersReducedMotion()) return;
  const datos = JSON.parse(figura.dataset.etapas ?? 'null') as Datos | null;
  const cifra = figura.querySelector<HTMLElement>('[data-cifra]');
  const delta = figura.querySelector<HTMLElement>('[data-delta]');
  const texto = figura.querySelector<HTMLElement>('[data-texto]');
  const momentos = figura.querySelector<HTMLElement>('[data-momentos]');
  const nodos = [...figura.querySelectorAll<HTMLElement>('[data-nodo]')];
  const cables = [...figura.querySelectorAll<HTMLElement>('[data-cable]')];
  if (!datos || !cifra || !delta || !texto || !momentos) return;

  const formato = formatoDeLaPagina();
  const escribir = (v: number) =>
    (cifra.textContent = `${datos.prefijo}${formato.format(Math.round(v))}`);
  const botones = [...momentos.querySelectorAll<HTMLButtonElement>('[data-momento]')];
  momentos.hidden = false;

  let mostrado = datos.despues.valor;
  let flujos = datos.despues.flujos;
  let conteo = 0;

  const pintarNodo = (el: HTMLElement, nodo: Nodo, animar: boolean) => {
    const contenido = JSON.stringify(nodo);
    if (el.dataset.contenido === contenido) return;
    const antes = el.dataset.contenido !== undefined;
    el.dataset.contenido = contenido;
    el.classList.toggle('es-clave', Boolean(nodo.clave));
    el.classList.toggle('es-alerta', Boolean(nodo.alerta));
    const [titulo, detalle] = el.children as unknown as HTMLElement[];
    if (titulo) titulo.textContent = nodo.titulo;
    if (detalle) detalle.textContent = nodo.detalle;
    el.querySelector('[data-chips]')?.remove();
    if (nodo.chips?.length) {
      const chips = document.createElement('span');
      chips.className = 'flex flex-wrap gap-1.5';
      chips.dataset.chips = '';
      for (const c of nodo.chips) {
        const chip = document.createElement('span');
        chip.className =
          'rounded-pill border border-primary px-2 py-1 text-[11px] font-bold text-link';
        chip.textContent = c;
        chips.append(chip);
      }
      el.append(chips);
    }
    if (animar && antes) {
      el.animate(
        [
          { opacity: 0.2, transform: 'scale(0.94)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: 450, easing: MARCA },
      );
    }
  };

  nodos.forEach((n, i) => (n.dataset.contenido = JSON.stringify(datos.despues.nodos[i])));

  const pintar = (nuevo: Momento, animar: boolean) => {
    const etapa = datos[nuevo];
    for (const b of botones) b.setAttribute('aria-pressed', String(b.dataset.momento === nuevo));
    texto.textContent = etapa.texto;
    delta.textContent = etapa.delta ?? '';
    delta.hidden = !etapa.delta;
    nodos.forEach((el, i) => {
      const nodo = etapa.nodos[i];
      if (nodo) pintarNodo(el, nodo, animar);
    });
    flujos = etapa.flujos;

    cancelAnimationFrame(conteo);
    const desde = mostrado;
    if (!animar || desde === etapa.valor) {
      mostrado = etapa.valor;
      escribir(etapa.valor);
      return;
    }
    const inicio = performance.now();
    const cuadro = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / 1300);
      mostrado = desde + (etapa.valor - desde) * salida(t);
      escribir(mostrado);
      if (t < 1) conteo = requestAnimationFrame(cuadro);
      else mostrado = etapa.valor;
    };
    conteo = requestAnimationFrame(cuadro);
    if (etapa.delta) {
      delta.animate(
        [
          { opacity: 0, transform: 'scale(0.7)' },
          { opacity: 1, transform: 'scale(1.08)', offset: 0.7 },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: 500, delay: 1100, fill: 'backwards' },
      );
    }
  };

  let automatico = 0;
  for (const b of botones) {
    b.addEventListener('click', () => {
      clearTimeout(automatico);
      pintar(b.dataset.momento as Momento, true);
    });
  }

  // Paquetes: nacen en la primera conexión y siguen de tarjeta en tarjeta.
  interface Paquete {
    el: HTMLElement;
    t: number;
    tam: number;
  }
  const enCable: Paquete[][] = cables.map(() => []);
  const ultimoPulso = new WeakMap<HTMLElement, number>();
  const nacer = (i: number, tam: number) => {
    const cable = cables[i];
    if (!cable) return;
    const el = document.createElement('span');
    el.className = 'paquete';
    el.style.width = el.style.height = `${tam}px`;
    el.style.opacity = '0';
    cable.append(el);
    enCable[i]!.push({ el, t: 0, tam });
  };
  const pulso = (nodo: HTMLElement | undefined, ahora: number) => {
    if (!nodo || ahora - (ultimoPulso.get(nodo) ?? 0) < 260) return;
    ultimoPulso.set(nodo, ahora);
    nodo.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.025)' }, { transform: 'scale(1)' }],
      {
        duration: 250,
      },
    );
  };

  let raf = 0;
  let ultimo = 0;
  let fuente = 0;
  const cuadro = (ahora: number) => {
    const dt = Math.min(0.05, (ahora - ultimo) / 1000);
    ultimo = ahora;
    const enColumna = getComputedStyle(nodos[0]!.parentElement!).flexDirection === 'column';
    const [tasa0, tam0] = flujos[0] ?? [1, 6];
    fuente += dt * tasa0;
    while (fuente >= 1) {
      fuente -= 1;
      nacer(0, tam0);
    }
    cables.forEach((cable, i) => {
      const largo = enColumna ? cable.clientHeight : cable.clientWidth;
      enCable[i] = enCable[i]!.filter((p) => {
        p.t += dt / VIAJE;
        if (p.t >= 1) {
          p.el.remove();
          pulso(nodos[i + 1], ahora);
          const siguiente = flujos[i + 1];
          const actual = flujos[i];
          if (siguiente && actual && Math.random() < Math.min(1, siguiente[0] / actual[0])) {
            nacer(i + 1, siguiente[1]);
          }
          return false;
        }
        const pos = p.t * Math.max(0, largo - p.tam);
        p.el.style.transform = enColumna
          ? `translate(-50%, ${pos.toFixed(1)}px)`
          : `translate(${pos.toFixed(1)}px, -50%)`;
        p.el.style.opacity = Math.min(1, Math.sin(Math.PI * p.t) * 3).toFixed(2);
        return true;
      });
    });
    raf = requestAnimationFrame(cuadro);
  };

  let iniciado = false;
  let corriendo = false;
  new IntersectionObserver(
    (entradas) => {
      const visible = entradas.some((e) => e.isIntersecting);
      if (visible && !iniciado) {
        iniciado = true;
        mostrado = datos.antes.valor;
        pintar('antes', false);
        automatico = window.setTimeout(() => pintar('despues', true), PASA_SOLA);
      }
      if (visible && !corriendo) {
        corriendo = true;
        ultimo = performance.now();
        raf = requestAnimationFrame(cuadro);
      }
      if (!visible && corriendo) {
        corriendo = false;
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0.3 },
  ).observe(figura);
}
