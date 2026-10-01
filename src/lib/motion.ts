import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
// Mobile URL-bar show/hide fires resize; refreshing on it makes pinned/scrubbed layouts jump.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Small viewport or touch-first device: use the lighter 3D scene. */
export const isCompact = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 720px), (pointer: coarse)').matches;

let lenis: Lenis | null = null;

/**
 * Smooth wheel scrolling. Lenis is driven by the GSAP ticker so scroll and
 * ScrollTrigger share one clock. Touch scrolling stays native (Lenis does not
 * sync touch by default), and nothing is installed under reduced motion.
 */
export function useLenis() {
  useLayoutEffect(() => {
    if (reducedMotion()) return;

    const instance = new Lenis({
      duration: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis = instance;

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP's default
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);
}

/** Freeze / release smooth scrolling while a modal overlay (the mobile menu) is open. */
export const pauseScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();

/**
 * Scroll to a section by id and move focus there, so keyboard and screen-reader
 * users land where sighted users do. Works with or without Lenis.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenis) lenis.scrollTo(el, { offset: -56 });
  else el.scrollIntoView({ block: 'start' }); // scroll-margin-top in CSS handles the offset

  el.focus({ preventScroll: true });
  history.replaceState(null, '', `#${id}`);
}

/**
 * Scopes every animation the page creates to one gsap.context, so unmounting
 * (or React StrictMode's double-mount in dev) reverts triggers and inline styles.
 * Skipped entirely under reduced motion: content simply renders in its final state.
 */
export function usePageScope(setup: (ctx: gsap.Context) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      if (!reducedMotion()) setupRef.current(self);
    }, ref);

    // Web fonts change text metrics; trigger positions must be measured after they land.
    const refresh = () => ScrollTrigger.refresh();
    if ('fonts' in document) document.fonts.ready.then(refresh);

    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * Magnetic hover: the element drifts a fraction of the way toward the cursor
 * and springs back on leave. Fine-pointer only, skipped under reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return ref;
}

/**
 * Marks the page root with data-scene="focus" while the hero or the universe
 * section is on screen, so CSS can dim the 3D backdrop behind text-heavy
 * sections and bring it forward where it is the subject. Pure IntersectionObserver:
 * no scroll listeners, and it works under reduced motion.
 */
export function useSceneFocus(root: RefObject<HTMLElement | null>, ids: string[]) {
  const key = ids.join('|');
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const active = new Set<string>();
    const sync = () => host.setAttribute('data-scene', active.size ? 'focus' : 'ambient');
    sync();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) active.add(e.target.id);
          else active.delete(e.target.id);
        });
        sync();
      },
      { threshold: 0.35 },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, key]);
}
