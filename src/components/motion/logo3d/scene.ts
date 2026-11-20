// Pieza 04 · Logo LR en 3D. Port del laboratorio (Three.js r128) a la versión actual de Three.
// Diferencias con r128: la gestión de color viene activada y las luces son físicas, así que
// los colores de luces y reflejos se declaran lineales y las intensidades se multiplican por π
// para conservar el mismo resultado.
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BufferAttribute,
  Color,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
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
  WebGLRenderer,
  type Shape,
} from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { LOGO_SHAPES } from './shapes';

export interface Logo3DOptions {
  /** Ensamblar las piezas la primera vez que el logo entra en pantalla. */
  assemble?: boolean;
}

const DEPTH = [7, 10, 13, 13, 13];
const FROM = [
  [90, -60, -260],
  [-40, 30, -420],
  [-220, 40, -200],
  [0, -160, -320],
  [200, 120, -240],
] as const;
// Tamaño del vector del monograma en unidades de la escena.
const LOGO_W = 121.5;
const LOGO_H = 100.5;
const FOV = 30;
// Fracción del lado limitante que ocupa el logo.
const FIT = 0.56;

const linear = (hex: number) => new Color().setHex(hex, LinearSRGBColorSpace);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Monta la escena dentro de host. Devuelve false si no hay WebGL (queda el respaldo). */
export function mountLogo3D(host: HTMLElement, options: Logo3DOptions = {}): boolean {
  const { assemble = true } = options;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  // 1.15 iguala el brillo del laboratorio con el sombreado físico de las versiones nuevas.
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 2000);

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
  panel(0xffffff, 0, 60, 40, 60, 20);
  panel(0x00a7ff, -60, 10, 30, 30, 50);
  panel(0x0055c2, 60, -10, 30, 30, 50);
  panel(0x33b9ff, 0, -50, 40, 80, 10);
  panel(0xffffff, 30, 30, -50, 30, 30);
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(envScene, 0.04).texture;
  pmrem.dispose();

  scene.add(new AmbientLight(linear(0x4466aa), 0.35 * Math.PI));
  const key = new DirectionalLight(linear(0xffffff), 0.85 * Math.PI);
  key.position.set(-120, 160, 260);
  scene.add(key);
  // En r128 la luz caía de forma lineal hasta 900; sin decaimiento físico y con la
  // intensidad ajustada queda igual a la distancia a la que orbita.
  const orbit = new PointLight(linear(0x33b9ff), 1.1 * Math.PI * 0.68, 900, 0);
  scene.add(orbit);
  const rim = new DirectionalLight(linear(0x3377ce), 0.9 * Math.PI);
  rim.position.set(200, -80, -200);
  scene.add(rim);

  // Degradado de marca por vértice: cyan-500 → blue-500 en las piezas, índigo en la base.
  const group = new Group();
  scene.add(group);
  const cA = new Color(0x00a7ff);
  const cB = new Color(0x0055c2);
  const rA = new Color(0x1a237e);
  const rB = new Color(0x000447);
  const loader = new SVGLoader();
  const parts = LOGO_SHAPES.map((d, i) => {
    const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
    const shapes: Shape[] = data.paths.flatMap((p) => p.toShapes());
    const depth = DEPTH[i] ?? 13;
    const geo = new ExtrudeGeometry(shapes, {
      depth,
      bevelEnabled: true,
      bevelThickness: 1.4,
      bevelSize: 0.9,
      bevelOffset: -0.9,
      bevelSegments: 5,
      curveSegments: 28,
    });
    geo.translate(-500, -251, -depth / 2);
    const pos = geo.attributes.position!;
    const col = new Float32Array(pos.count * 3);
    const c = new Color();
    for (let k = 0; k < pos.count; k++) {
      const t = clamp01(((pos.getX(k) + 61) / 122) * 0.55 + ((pos.getY(k) + 50) / 100) * 0.6);
      if (i === 0) c.copy(rA).lerp(rB, clamp01((pos.getX(k) - 6) / 50));
      else c.copy(cA).lerp(cB, Math.min(1, t * 1.25));
      col[k * 3] = c.r;
      col[k * 3 + 1] = c.g;
      col[k * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new BufferAttribute(col, 3));
    const mesh = new Mesh(
      geo,
      new MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.35,
        roughness: 0.3,
        envMap: env,
        envMapIntensity: 0.55,
        transparent: true,
        side: DoubleSide,
      }),
    );
    mesh.userData.z = i === 0 ? -2.5 : 0;
    group.add(mesh);
    return mesh;
  });
  group.scale.set(1, -1, 1);

  // Coloca las piezas en el punto del ensamble que corresponde a elapsed (ms); true si terminó.
  const assembleAt = (elapsed: number) => {
    let done = true;
    parts.forEach((m, i) => {
      const k = clamp01((elapsed - i * 170) / 1500);
      const e = easeOutQuart(k);
      const [fx, fy, fz] = FROM[i] ?? [0, 0, 0];
      m.position.set(fx * (1 - e), fy * (1 - e), (m.userData.z as number) + fz * (1 - e));
      m.rotation.set((1 - e) * 1.4 * (i % 2 ? 1 : -1), (1 - e) * 2.2, (1 - e) * 0.8);
      m.material.opacity = Math.min(1, k * 2.2);
      if (k < 1) done = false;
    });
    return done;
  };

  let t0 = 0;
  let playing = false;
  const play = () => {
    t0 = performance.now();
    playing = true;
  };

  // El logo sigue el cursor (o el dedo) sobre el lienzo.
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

  // La cámara se aleja lo justo para que el logo quepa con margen en cualquier proporción.
  const size = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const span = Math.max(LOGO_H, LOGO_W / camera.aspect) / FIT;
    camera.position.set(0, 0, span / (2 * Math.tan((FOV * Math.PI) / 360)));
    camera.updateProjectionMatrix();
  };

  const draw = (now: number) => {
    const t = now / 1000;
    if (playing && assembleAt(now - t0)) playing = false;
    ptr.x += (ptr.tx - ptr.x) * 0.06;
    ptr.y += (ptr.ty - ptr.y) * 0.06;
    group.rotation.y = Math.sin(t * 0.5) * 0.42 + ptr.x * 0.5;
    group.rotation.x = Math.sin(t * 0.37) * 0.07 + ptr.y * 0.3;
    group.position.y = Math.sin(t * 0.9) * 3;
    orbit.position.set(
      Math.cos(t * 0.8) * 220,
      Math.sin(t * 0.6) * 120,
      180 + Math.sin(t * 0.8) * 60,
    );
    renderer.render(scene, camera);
  };

  let running = false;
  let visible = false;
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

  // Con ensamble, las piezas esperan fuera de cuadro hasta que el logo entra en pantalla.
  let assembled = !assemble;
  assembleAt(assemble ? 0 : Infinity);
  size();
  draw(performance.now());
  // Ya hay un cuadro dibujado: el CSS oculta el respaldo estático.
  host.dataset.live = '';

  new ResizeObserver(() => {
    size();
    if (!running) draw(performance.now());
  }).observe(host);

  // Solo dibuja mientras se ve.
  new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible && !assembled) {
        assembled = true;
        play();
      }
      if (visible) start();
      else stop();
    },
    { threshold: 0.25 },
  ).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  return true;
}
