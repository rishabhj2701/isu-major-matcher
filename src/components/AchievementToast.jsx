// Pops a badge when a new achievement unlocks. Queues several, one at a time.

import { useEffect, useRef, useState } from 'react';
import { ACHIEVEMENTS } from '../lib/achievements.js';
import { burstConfetti } from '../lib/confetti.js';

export default function AchievementToast({ unlocked }) {
  const seen = useRef(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (seen.current === null) { seen.current = new Set(unlocked); return; } // don't toast on first render
    const fresh = unlocked.filter((id) => !seen.current.has(id));
    fresh.forEach((id) => seen.current.add(id));
    if (fresh.length) setQueue((q) => [...q, ...fresh]);
  }, [unlocked]);

  const current = queue[0];
  useEffect(() => {
    if (!current) return undefined;
    burstConfetti({ count: 40, duration: 1000 });
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 3200);
    return () => clearTimeout(t);
  }, [current]);

  if (!current) return null;
  const a = ACHIEVEMENTS.find((x) => x.id === current);
  return (
    <div className="ach-toast" role="status" key={current}>
      <span className="ach-medal" aria-hidden="true">{a.emoji}</span>
      <span><small>Achievement unlocked</small><b>{a.name}</b></span>
    </div>
  );
}
