import { useEffect } from 'react';
import { reducedMotion } from '../lib/motion';

/**
 * A soft cyan glow that trails the cursor. Desktop fine-pointer only, never
 * under reduced motion, and purely decorative (aria-hidden, no pointer events).
 */
export default function CursorGlow() {
  useEffect(() => {
    if (reducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const el = document.createElement('div');
    el.className = 'cursor-glow';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);

    let raf = 0;
    let x = -600;
    let y = -600;
    let tx = x;
    let ty = y;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      el.remove();
    };
  }, []);

  return null;
}
