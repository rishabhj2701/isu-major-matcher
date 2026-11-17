// Thinking Worlds — three mini-games with a world map, soft timer and instant
// feedback. Produces a relative snapshot (see lib/thinking.js). Keyboard
// accessible: every answer is a real button; the timer never blocks input.

import { useEffect, useMemo, useState } from 'react';
import { WORLDS, countIdeas, summarizeThinking } from '../lib/thinking.js';
import Icon from '../components/Icon.jsx';

export default function Worlds({ onComplete, onExit, onSkip }) {
  const [worldIdx, setWorldIdx] = useState(-1); // -1 = map
  const [itemIdx, setItemIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState({});
  const [ideas, setIdeas] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [done, setDone] = useState(false);

  const world = worldIdx >= 0 ? WORLDS[worldIdx] : null;
  const item = world?.items?.[itemIdx];
  const completed = Object.keys(results);

  // Soft timer for Idea Garden: counts down but never blocks submission.
  useEffect(() => {
    if (world?.type !== 'alt-uses' || done) return undefined;
    setSecondsLeft(world.seconds);
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [world, done]);

  const snapshot = useMemo(() => (done ? summarizeThinking(results) : null), [done, results]);

  function enter(i) {
    setWorldIdx(i);
    setItemIdx(0);
    setPicked(null);
  }

  function answer(opt) {
    if (picked) return;
    setPicked(opt);
    const correct = opt === item.answer;
    setResults((r) => {
      const cur = r[world.id] ?? { correct: 0, total: 0 };
      return { ...r, [world.id]: { correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1 } };
    });
  }

  function nextItem() {
    setPicked(null);
    if (itemIdx < world.items.length - 1) setItemIdx((n) => n + 1);
    else setWorldIdx(-1);
  }

  function finishIdeas() {
    setResults((r) => ({ ...r, creative: { ideas: countIdeas(ideas) } }));
    setWorldIdx(-1);
  }

  function finishAll() {
    setDone(true);
  }

  if (done && snapshot) {
    return (
      <section className="worlds" aria-labelledby="worlds-heading">
        <div className="panel worlds-reveal reveal">
          <span className="eyebrow-plain">Snapshot ready</span>
          <h2 id="worlds-heading">Your strongest world: {snapshot.strongest.name}</h2>
          <p className="muted">{snapshot.note}</p>
          <ul className="world-results">
            {snapshot.dims.map((d) => (
              <li key={d.key}>
                <span>{WORLDS.find((w) => w.id === d.key)?.emoji}</span>
                <b>{d.name}</b>
                <span className="muted">{Math.round(d.raw * 100)}% in that world · {d.relative > 0.08 ? 'leans up' : d.relative < -0.08 ? 'leans down' : 'about even'} for you</span>
              </li>
            ))}
          </ul>
          <div className="quest-nav">
            <button type="button" className="secondary-button" onClick={onExit}>Back to hub</button>
            <button type="button" className="primary" onClick={() => onComplete(snapshot)}>Continue to Level 2 <Icon name="arrow" size={14} /></button>
          </div>
        </div>
      </section>
    );
  }

  if (!world) {
    return (
      <section className="worlds" aria-labelledby="worlds-heading">
        <header className="pagehead">
          <span className="eyebrow-plain">Level 1 · Aptitude · ~4 min</span>
          <h1 id="worlds-heading">Warm up your brain</h1>
          <p>Three quick games before the quest. A reflection snapshot — never changes your major score.</p>
        </header>
        <div className="world-map">
          {WORLDS.map((w, i) => {
            const isDone = completed.includes(w.id);
            return (
              <button key={w.id} type="button" className={`world-card reveal${isDone ? ' done' : ''}`} style={{ '--delay': `${i * 90}ms` }} onClick={() => enter(i)}>
                <span className="world-emoji" aria-hidden="true">{w.emoji}</span>
                <span className="world-name">{w.name}</span>
                <span className="world-tag">{w.tagline}</span>
                <span className="world-meta">{w.measures}</span>
                <span className={`chip-mini ${isDone ? 'tone-good' : 'tone-neutral'}`}>{isDone ? 'Power unlocked ✓' : w.type === 'alt-uses' ? '60 s soft timer' : '3 quick items'}</span>
              </button>
            );
          })}
        </div>
        <div className="quest-nav">
          <button type="button" className="secondary-button" onClick={onExit}><Icon name="back" size={14} /> Hub</button>
          <span className="quest-selected">{completed.length} / {WORLDS.length} worlds explored</span>
          {onSkip && completed.length === 0 && <button type="button" className="textbtn" onClick={onSkip}>Skip to Level 2</button>}
          <button type="button" className="primary" disabled={completed.length === 0} onClick={finishAll}>
            {completed.length === WORLDS.length ? 'Finish Level 1' : 'Finish with what I have'} <Icon name="arrow" size={14} />
          </button>
        </div>
      </section>
    );
  }

  if (world.type === 'alt-uses') {
    const n = countIdeas(ideas);
    return (
      <section className="worlds" aria-labelledby="world-title">
        <div className="quest-hud">
          <div className="hud-left"><span className="level-chip">{world.emoji} {world.name}</span><span className="xp-text">{world.measures}</span></div>
          <span className={`quest-count timer${secondsLeft === 0 ? ' over' : ''}`} aria-live="polite">{secondsLeft}s {secondsLeft === 0 ? '· soft timer ended, finish when ready' : ''}</span>
        </div>
        <div className="quest-card slide-fwd">
          <p className="quest-hint">{world.framing}</p>
          <h2 id="world-title">List as many different uses for {world.object} as you can</h2>
          <p className="muted">One idea per line. We count distinct ideas (fluency). Originality scoring needs a server and is not simulated here.</p>
          <label htmlFor="ideas" className="sr-only">Your ideas, one per line</label>
          <textarea id="ideas" className="ideas-box" rows={7} value={ideas} onChange={(e) => setIdeas(e.target.value)} placeholder={'a vase\na candle holder\n…'} autoFocus />
          <p className="quest-selected">{n} distinct idea{n === 1 ? '' : 's'}</p>
        </div>
        <div className="quest-nav">
          <button type="button" className="secondary-button" onClick={() => setWorldIdx(-1)}><Icon name="back" size={14} /> Map</button>
          <button type="button" className="primary" onClick={finishIdeas} disabled={n === 0}>Plant my ideas <Icon name="arrow" size={14} /></button>
        </div>
      </section>
    );
  }

  const correct = picked && picked === item.answer;
  return (
    <section className="worlds" aria-labelledby="world-title">
      <div className="quest-hud">
        <div className="hud-left"><span className="level-chip">{world.emoji} {world.name}</span><span className="xp-text">{world.measures}</span></div>
        <span className="quest-count">Item {itemIdx + 1} / {world.items.length}</span>
      </div>
      <div className="quest-card slide-fwd" key={item.id}>
        <p className="quest-hint">{world.framing}</p>
        <h2 id="world-title">{item.prompt}</h2>
        <div className="option-grid" role="group" aria-label="Answer options">
          {item.options.map((opt) => {
            const state = picked ? (opt === item.answer ? ' right' : opt === picked ? ' wrong' : ' dim') : '';
            return (
              <button key={opt} type="button" className={`option-card${state}`} onClick={() => answer(opt)} disabled={Boolean(picked)} aria-pressed={picked === opt}>
                <span className="option-label">{opt}</span>
              </button>
            );
          })}
        </div>
        {picked && (
          <p className={`world-feedback ${correct ? 'good' : 'miss'}`} role="status">
            {correct ? 'Nice — you spotted it. ' : 'Not this time. '}{item.explain}
          </p>
        )}
      </div>
      <div className="quest-nav">
        <button type="button" className="secondary-button" onClick={() => setWorldIdx(-1)}><Icon name="back" size={14} /> Map</button>
        <button type="button" className="primary" onClick={nextItem} disabled={!picked}>
          {itemIdx < world.items.length - 1 ? 'Next' : 'Unlock power'} <Icon name="arrow" size={14} />
        </button>
      </div>
    </section>
  );
}
