// Global pointer effects for cards: a soft spotlight that follows the cursor
// and a subtle 3D tilt. One document-level listener, no per-card wiring.
// Disabled for touch input and prefers-reduced-motion.

import { useEffect } from 'react';

const SELECTOR = '.mission, .role-card, .post, .lc-tile, .world-card, .major-card, .stat, .option-card, .side-quest, .catalog-group, .hero-card';
const TILT = '.mission, .role-card, .world-card, .stat, .option-card';

export function useCardFx() {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    let current = null;

    function reset(el) {
      if (!el) return;
      el.style.removeProperty('--tilt');
      el.classList.remove('fx-on');
    }

    function onMove(e) {
      if (e.pointerType === 'touch') return;
      const el = e.target.closest?.(SELECTOR);
      if (el !== current) { reset(current); current = el; }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      el.classList.add('fx-on');
      if (el.matches(TILT) && !el.disabled) {
        el.style.setProperty('--tilt', `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg)`);
      }
    }

    function onLeave() { reset(current); current = null; }

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);
}
