// Analysis + reveal. A short, honest sequence describing the deterministic
// steps the engine runs, then three face-down cards flip one by one (#3, #2,
// then #1 with a medal drop). Results are computed instantly; this is pacing.

import { useEffect, useMemo, useState } from 'react';
import { matchMajors } from '../lib/matcher.js';
import { useCountUp } from '../lib/useCountUp.js';
import { burstConfetti } from '../lib/confetti.js';
import Icon from '../components/Icon.jsx';

const STEPS = [
  'Reading your likes and don\'ts…',
  'Scoring every major on 5 factors…',
  'Ranking and writing reasons…',
];
const MEDALS = ['🥇', '🥈', '🥉'];

function Score({ value, run }) {
  const n = useCountUp(run ? value : 0, 900);
  return <span className="flip-score">{n}<small>/100</small></span>;
}

export default function Matching({ profile, onDone }) {
  const top = useMemo(() => matchMajors(profile).slice(0, 3), [profile]);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('scan'); // scan → cards
  const [flipped, setFlipped] = useState(0); // how many cards face up

  useEffect(() => {
    const per = reduce ? 80 : 520;
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i + 1), per * (i + 1)));
    timers.push(setTimeout(() => setPhase('cards'), per * (STEPS.length + 1)));
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  useEffect(() => {
    if (phase !== 'cards') return undefined;
    const per = reduce ? 60 : 750;
    const timers = [1, 2, 3].map((k) => setTimeout(() => {
      setFlipped(k);
      if (k === 3) burstConfetti();
    }, per * k));
    return () => timers.forEach(clearTimeout);
  }, [phase, reduce]);

  if (phase === 'scan') {
    return (
      <section className="matching" aria-labelledby="matching-heading" aria-live="polite">
        <div className="matching-orb orb-hero" aria-hidden="true"><span className="orb-ring" /><span className="orb-ring d2" /><span className="orb-core">🧭</span></div>
        <h2 id="matching-heading">Scanning your path…</h2>
        <div className="matching-bar"><div className="matching-fill" style={{ width: `${(step / STEPS.length) * 100}%` }} /></div>
        <ul className="matching-steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i < step ? 'done' : i === step ? 'current' : ''}>
              <span className="tick" aria-hidden="true">{i < step ? '✓' : '•'}</span>{s}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // Display order: #2, #1, #3 (podium). Flip order: #3, #2, #1.
  const podium = [1, 0, 2];
  const flipOrder = { 2: 1, 1: 2, 0: 3 };

  return (
    <section className="reveal-stage" aria-labelledby="reveal-heading" aria-live="polite">
      <span className="eyebrow-plain">Your top 3</span>
      <h2 id="reveal-heading">{flipped < 3 ? 'Revealing…' : 'Your matches are in!'}</h2>
      <div className="podium">
        {podium.map((idx) => {
          const m = top[idx];
          if (!m) return null;
          const up = flipped >= flipOrder[idx];
          return (
            <div key={m.id} className={`flip-card pos-${idx + 1}${up ? ' up' : ''}`}>
              <div className="flip-inner">
                <div className="flip-face back" aria-hidden={up}><span>?</span></div>
                <div className="flip-face front" aria-hidden={!up}>
                  <span className="flip-medal">{MEDALS[idx]}</span>
                  <b className="flip-name">{m.name}</b>
                  <Score value={m.fit} run={up} />
                  <small className="flip-college">{m.college.split(' / ')[0]}</small>
                </div>
              </div>
              <div className={`podium-step s${idx + 1}`}>#{idx + 1}</div>
            </div>
          );
        })}
      </div>
      <button type="button" className={`btn-glow reveal-cta${flipped >= 3 ? ' show' : ''}`} onClick={onDone} disabled={flipped < 3}>
        Open my dashboard <span className="go"><Icon name="arrow" size={15} /></span>
      </button>
      {flipped < 3 && <button type="button" className="textbtn skip" onClick={onDone}>Skip</button>}
    </section>
  );
}
