// Short animated "analysis" transition between the quest and the results.
// Honest: it describes the deterministic steps the engine actually runs. It is
// a paced reveal, not a fake computation — results are computed instantly.

import { useEffect, useState } from 'react';

const STEPS = [
  'Reading your interests, strengths, and goals…',
  'Scoring each ISU major on five weighted factors…',
  'Applying your dislikes as gentle, capped adjustments…',
  'Ranking matches and writing plain-language reasons…',
];

export default function Matching({ onDone }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const perStep = reduce ? 120 : 620;
    const timers = STEPS.map((_, i) => setTimeout(() => setActive(i + 1), perStep * (i + 1)));
    const done = setTimeout(onDone, perStep * (STEPS.length + 1));
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onDone]);

  const pct = Math.round((active / STEPS.length) * 100);

  return (
    <section className="matching" aria-labelledby="matching-heading" aria-live="polite">
      <div className="matching-orb" aria-hidden="true">
        <span className="orb-ring" />
        <span className="orb-ring d2" />
        <span className="orb-core">🧭</span>
      </div>
      <h2 id="matching-heading">Finding your matches…</h2>
      <div className="matching-bar">
        <div className="matching-fill" style={{ width: `${pct}%` }} />
      </div>
      <ul className="matching-steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i < active ? 'done' : i === active ? 'current' : ''}>
            <span className="tick" aria-hidden="true">
              {i < active ? '✓' : '•'}
            </span>
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
