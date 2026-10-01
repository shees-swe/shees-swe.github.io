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
    // Parked off-screen until the first pointer move (the rAF loop below only
    // runs while the pointer is moving).
    el.style.transform = 'translate3d(-860px, -860px, 0)';
    document.body.appendChild(el);

    let raf = 0;
    let x = -600;
    let y = -600;
    let tx = x;
    let ty = y;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      // Restart the loop only while the pointer is actually moving; a
      // never-ending rAF loop kept the main thread busy and made scrolling
      // feel stuck on weaker devices.
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
      if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0; // settled — stay parked until the pointer moves again
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      el.remove();
    };
  }, []);

  return null;
}
