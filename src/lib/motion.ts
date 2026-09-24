import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// Dev-only handle so the timelines can be driven and measured from the console
// (and from an automated browser) without waiting on requestAnimationFrame.
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__lab = { gsap, ScrollTrigger };
}

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/**
 * Smooth scrolling for the concepts that want it. Concepts scroll the document,
 * so ScrollTrigger needs no custom scroller and pinning behaves normally.
 */
export function useLenis(enabled = true) {
  useLayoutEffect(() => {
    if (!enabled || reducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled]);
}

/**
 * Scopes every animation a concept creates so unmounting it removes all
 * triggers, pins and inline styles. Without this, switching concepts would
 * leave dead ScrollTriggers behind and the next concept would mis-measure.
 */
export function useConceptScope(setup: (ctx: gsap.Context) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context((self) => {
      if (!reducedMotion()) setupRef.current(self);
    }, ref);

    // Fonts change metrics; pinned measurements must be taken after they land.
    const refresh = () => ScrollTrigger.refresh();
    if ('fonts' in document) document.fonts.ready.then(refresh);
    const t = window.setTimeout(refresh, 350);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
  }, []);

  return ref;
}

/** Split an element's text into per-word spans wrapped in overflow masks. */
export function splitWords(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text.trim());
  el.textContent = '';
  const out: HTMLElement[] = [];

  text.split(/(\s+)/).forEach((chunk) => {
    if (/^\s+$/.test(chunk)) {
      el.appendChild(document.createTextNode(chunk));
      return;
    }
    const mask = document.createElement('span');
    mask.setAttribute('aria-hidden', 'true');
    mask.style.display = 'inline-block';
    mask.style.overflow = 'hidden';
    mask.style.verticalAlign = 'top';
    mask.style.paddingBottom = '0.14em';
    mask.style.marginBottom = '-0.14em';

    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.textContent = chunk;

    mask.appendChild(inner);
    el.appendChild(mask);
    out.push(inner);
  });

  return out;
}

/** Split into per-character spans, for headline choreography. */
export function splitChars(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text.trim());
  el.textContent = '';
  const out: HTMLElement[] = [];

  Array.from(text).forEach((ch) => {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'pre';
    span.textContent = ch;
    el.appendChild(span);
    out.push(span);
  });

  return out;
}
