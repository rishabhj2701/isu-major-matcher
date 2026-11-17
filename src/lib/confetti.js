// Tiny dependency-free confetti burst. Spawns short-lived DOM particles.
// No-op when the user prefers reduced motion. Cleans up after itself.

export function burstConfetti({ count = 90, duration = 1400 } = {}) {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const colors = ['#9b1b30', '#c99a3c', '#e4b84a', '#f6eeda', '#6e1a2d'];
  const root = document.createElement('div');
  root.setAttribute('aria-hidden', 'true');
  root.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(root);

  for (let i = 0; i < count; i += 1) {
    const p = document.createElement('span');
    const size = 6 + Math.random() * 8;
    const left = Math.random() * 100;
    const delay = Math.random() * 160;
    const drift = (Math.random() - 0.5) * 220;
    const rot = Math.random() * 720;
    const dur = duration + Math.random() * 600;
    p.style.cssText = `
      position:absolute;top:-16px;left:${left}vw;width:${size}px;height:${size * 0.5}px;
      background:${colors[i % colors.length]};opacity:0.95;border-radius:2px;
      transform:rotate(${Math.random() * 360}deg);
      animation:confFall ${dur}ms cubic-bezier(.3,.6,.4,1) ${delay}ms forwards;
      --drift:${drift}px;--rot:${rot}deg;`;
    root.appendChild(p);
  }

  // Inject keyframes once.
  if (!document.getElementById('conf-kf')) {
    const style = document.createElement('style');
    style.id = 'conf-kf';
    style.textContent = `@keyframes confFall{
      to{ transform:translate(var(--drift),105vh) rotate(var(--rot)); opacity:0; } }`;
    document.head.appendChild(style);
  }

  setTimeout(() => root.remove(), duration + 900);
}
