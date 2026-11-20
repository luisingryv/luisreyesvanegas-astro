// Pieza 05 · Medalla de ganador en 3D. Port del laboratorio (Three.js r128) a la versión actual:
// la gestión de color viene activada y las luces son físicas, así que los colores de luces se
// declaran lineales y las intensidades se multiplican por π (como en logo3d/scene.ts). Diseño
// propio con los colores de la marca, sin logos de terceros. Brilla al moverse y cada pocos
// segundos se voltea: por detrás lleva a Trama AI y al equipo.
import {
  ACESFilmicToneMapping,
  AmbientLight,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three';

export interface CarasMedalla {
  frente: { rotulo: string; linea1: string; linea2: string; evento: string };
  reverso: { rotulo: string; nombre: string; equipo: string[]; cierre: string };
}

const linear = (hex: number) => new Color().setHex(hex, LinearSRGBColorSpace);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const FUENTE = '"Human Sans", system-ui, sans-serif';

/** Monta la medalla dentro de host. Devuelve false si no hay WebGL (queda el respaldo). */
export function mountMedalla3D(host: HTMLElement, caras: CarasMedalla): boolean {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 1, 2000);

  // Entorno propio para los reflejos: paneles de luz blancos, celestes y azules.
  const envScene = new Scene();
  envScene.background = linear(0x02040c);
  const panel = (hex: number, x: number, y: number, z: number, w: number, h: number) => {
    const m = new Mesh(
      new PlaneGeometry(w, h),
      new MeshBasicMaterial({ color: linear(hex), side: DoubleSide }),
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    envScene.add(m);
  };
  panel(0xffffff, 0, 70, 30, 16, 60);
  panel(0xffffff, -70, 0, 40, 10, 90);
  panel(0x00a7ff, 70, 20, 30, 30, 60);
  panel(0x0055c2, 0, -60, 40, 90, 14);
  panel(0xffffff, 40, -30, -60, 20, 40);
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(envScene, 0.02).texture;
  pmrem.dispose();

  scene.add(new AmbientLight(linear(0x4466aa), 0.4 * Math.PI));
  const key = new DirectionalLight(linear(0xffffff), 0.9 * Math.PI);
  key.position.set(-100, 140, 260);
  scene.add(key);
  // El brillo que recorre la medalla (en r128, caída lineal hasta 700).
  const brillo = new PointLight(linear(0xffffff), 1.4 * Math.PI * 0.68, 700, 0);
  scene.add(brillo);

  // Caras dibujadas en canvas (el texto llega por idioma desde la página).
  const cara = (dibujar: (x: CanvasRenderingContext2D) => void) => {
    const c = document.createElement('canvas');
    c.width = c.height = 1024;
    const x = c.getContext('2d')!;
    const g = x.createRadialGradient(512, 470, 40, 512, 512, 520);
    g.addColorStop(0, '#0d0d1c');
    g.addColorStop(1, '#06060d');
    x.fillStyle = g;
    x.fillRect(0, 0, 1024, 1024);
    x.strokeStyle = '#4aa8ff';
    x.lineWidth = 12;
    x.beginPath();
    x.arc(512, 512, 492, 0, Math.PI * 2);
    x.stroke();
    x.strokeStyle = '#5b6b86';
    x.lineWidth = 3;
    x.setLineDash([14, 12]);
    x.beginPath();
    x.arc(512, 512, 440, 0, Math.PI * 2);
    x.stroke();
    x.setLineDash([]);
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    dibujar(x);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    t.center.set(0.5, 0.5);
    t.rotation = Math.PI / 2;
    return t;
  };
  const rotulo = (x: CanvasRenderingContext2D, texto: string, y: number, px: number) => {
    x.fillStyle = '#85d5ff';
    x.font = `700 ${px}px ${FUENTE}`;
    x.letterSpacing = `${Math.round(px * 0.22)}px`;
    x.fillText(texto.toUpperCase(), 512, y);
    x.letterSpacing = '0px';
  };
  const linea = (
    x: CanvasRenderingContext2D,
    texto: string,
    y: number,
    px: number,
    peso: number,
    color: string,
  ) => {
    x.fillStyle = color;
    x.font = `${peso} ${px}px ${FUENTE}`;
    x.fillText(texto, 512, y);
  };

  const frente = cara((x) => {
    rotulo(x, caras.frente.rotulo, 372, 36);
    linea(x, caras.frente.linea1, 468, 92, 700, '#ffffff');
    linea(x, caras.frente.linea2, 566, 92, 700, '#ffffff');
    linea(x, caras.frente.evento, 668, 40, 400, '#a9a8ae');
  });
  const reverso = cara((x) => {
    rotulo(x, caras.reverso.rotulo, 330, 34);
    linea(x, caras.reverso.nombre, 430, 110, 700, '#ffffff');
    caras.reverso.equipo.forEach((n, i) => linea(x, n, 532 + i * 50, 36, 400, '#c9c8ce'));
    rotulo(x, caras.reverso.cierre, 752, 28);
  });
  const material = (map: CanvasTexture) =>
    new MeshStandardMaterial({
      map,
      metalness: 0.6,
      roughness: 0.2,
      envMap: env,
      envMapIntensity: 1.1,
      emissive: linear(0xffffff),
      emissiveMap: map,
      emissiveIntensity: 0.4,
    });
  const canto = new MeshStandardMaterial({
    color: new Color(0x4aa8ff),
    metalness: 1,
    roughness: 0.16,
    envMap: env,
    envMapIntensity: 1.5,
  });
  const moneda = new Mesh(new CylinderGeometry(80, 80, 9, 128), [
    canto,
    material(frente),
    material(reverso),
  ]);
  moneda.rotation.x = Math.PI / 2;
  const aro = new Mesh(new TorusGeometry(80, 4.2, 24, 160), canto);
  const medalla = new Group();
  medalla.add(moneda, aro);
  scene.add(medalla);

  // Sigue el cursor (o el dedo) sobre el lienzo; un clic la voltea.
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  host.addEventListener('pointerleave', () => {
    ptr.tx = 0;
    ptr.ty = 0;
  });

  const size = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En el laboratorio el lienzo era 16:9; aquí es cuadrado y la medalla llena más el marco.
    camera.position.set(0, 0, w / h < 1.2 ? 440 : 450);
    camera.updateProjectionMatrix();
  };

  let giro = 0;
  let giroDesde = 0;
  let giroHasta = 0;
  let giroInicio = -1;
  let ultimoGiro = 0;
  let entrada = 0;
  const voltear = (ahora: number) => {
    giroDesde = giro;
    giroHasta = giro + Math.PI;
    giroInicio = ahora;
    ultimoGiro = ahora;
  };
  host.addEventListener('click', () => voltear(performance.now()));

  const draw = (ahora: number) => {
    const t = ahora / 1000;
    if (giroInicio >= 0) {
      const k = Math.min(1, (ahora - giroInicio) / 1400);
      giro = giroDesde + (giroHasta - giroDesde) * easeInOutCubic(k);
      if (k >= 1) giroInicio = -1;
    } else if (ahora - ultimoGiro > 6500) {
      voltear(ahora);
    }
    ptr.x += (ptr.tx - ptr.x) * 0.06;
    ptr.y += (ptr.ty - ptr.y) * 0.06;
    const intro = Math.min(1, (ahora - entrada) / 1600);
    const e = 1 - Math.pow(1 - intro, 3);
    medalla.rotation.y = giro + Math.sin(t * 0.9) * 0.5 + ptr.x * 0.6 + (1 - e) * 7;
    medalla.rotation.x = Math.sin(t * 0.6) * 0.08 + ptr.y * 0.35;
    medalla.rotation.z = Math.sin(t * 0.9) * 0.05;
    medalla.position.y = (1 - e) * -160;
    medalla.scale.setScalar(0.4 + 0.6 * e);
    brillo.position.set(Math.cos(t * 1.3) * 170, Math.sin(t * 1.7) * 110, 150);
    renderer.render(scene, camera);
  };

  let running = false;
  let visible = false;
  let empezada = false;
  let raf = 0;
  const loop = (now: number) => {
    draw(now);
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  size();
  // Primer cuadro ya entrando: el CSS oculta el respaldo cuando hay lienzo.
  entrada = performance.now();
  ultimoGiro = entrada;
  draw(entrada);
  host.dataset.live = '';

  new ResizeObserver(() => {
    size();
    if (!running) draw(performance.now());
  }).observe(host);
  new IntersectionObserver(
    (entradas) => {
      visible = entradas.some((en) => en.isIntersecting);
      if (visible && !empezada) {
        empezada = true;
        entrada = performance.now();
        ultimoGiro = entrada;
      }
      if (visible) start();
      else stop();
    },
    { threshold: 0.25 },
  ).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  return true;
}
