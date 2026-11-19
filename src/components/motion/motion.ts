// Base común de las piezas de motion: el HTML ya trae el estado final; aquí solo se anima.

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isBelowFold = (el: Element, ratio = 1): boolean =>
  el.getBoundingClientRect().top > window.innerHeight * ratio;

// Ejecuta una vez cuando el elemento se acerca a la pantalla.
export function onceNearViewport(el: Element, callback: () => void, rootMargin = '300px 0px') {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        callback();
      }
    },
    { rootMargin },
  );
  observer.observe(el);
}

let gsapPromise: ReturnType<typeof importGsap> | undefined;

async function importGsap() {
  const [{ gsap }, { ScrollTrigger }, { CustomEase }, { Flip }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/CustomEase'),
    import('gsap/Flip'),
  ]);
  gsap.registerPlugin(ScrollTrigger, CustomEase, Flip);
  // Curva de marca: cubic-bezier(0.22, 1, 0.36, 1).
  CustomEase.create('brand', '0.22,1,0.36,1');
  return { gsap, ScrollTrigger, Flip };
}

export function loadGsap() {
  gsapPromise ??= importGsap();
  return gsapPromise;
}
