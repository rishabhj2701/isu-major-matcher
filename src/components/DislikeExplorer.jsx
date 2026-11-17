// "Your don'ts" explorer. The student's dislikes are the most decision-relevant
// input, so this panel makes their effect inspectable: toggle each dislike on
// or off and watch the real engine re-rank live, with per-major deltas. It
// never changes the saved profile — it is a what-if lens on the same engine.

import { useMemo, useState } from 'react';
import { matchMajors } from '../lib/matcher.js';
import { interestOptions } from '../data/majors.js';
import Icon from './Icon.jsx';

const LABEL = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));
const EMOJI = Object.fromEntries(interestOptions.map((o) => [o.id, o.emoji]));

export default function DislikeExplorer({ profile, onOpenDetail }) {
  const dislikes = profile.dislikes ?? [];
  const [active, setActive] = useState(() => new Set(dislikes));

  const base = useMemo(() => matchMajors(profile), [profile]);
  const what = useMemo(
    () => matchMajors({ ...profile, dislikes: dislikes.filter((d) => active.has(d)) }),
    [profile, dislikes, active]
  );
  const baseById = Object.fromEntries(base.map((m, i) => [m.id, { fit: m.fit, rank: i + 1 }]));

  if (!dislikes.length) {
    return (
      <section className="panel dont-panel" aria-labelledby="dont-heading">
        <div className="panelhead">
          <h3 id="dont-heading"><Icon name="ban" size={18} /> Your don'ts</h3>
          <span className="badge">None picked</span>
        </div>
        <p className="muted">
          You didn't mark anything to avoid, so no major was lowered. Dislikes are often more
          decisive than likes — you can add some by restarting the quest.
        </p>
      </section>
    );
  }

  function toggle(id) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <section className="panel dont-panel" aria-labelledby="dont-heading">
      <div className="panelhead">
        <h3 id="dont-heading"><Icon name="ban" size={18} /> Your don'ts, and what they changed</h3>
        <span className="badge">{active.size} of {dislikes.length} applied</span>
      </div>
      <p className="muted">
        Each don't lowers majors that lean on it by a capped amount — nothing is hidden. Switch one
        off to see how the ranking would move if it stopped bothering you.
      </p>

      <div className="dont-toggles" role="group" aria-label="Toggle dislikes">
        {dislikes.map((d) => (
          <button
            key={d}
            type="button"
            className={`dont-toggle${active.has(d) ? ' on' : ''}`}
            aria-pressed={active.has(d)}
            onClick={() => toggle(d)}
          >
            <span aria-hidden="true">{EMOJI[d]}</span> {LABEL[d]}
            <span className="dont-state">{active.has(d) ? 'avoiding' : 'ignored'}</span>
          </button>
        ))}
      </div>

      <ol className="dont-rank">
        {what.slice(0, 5).map((m, i) => {
          const b = baseById[m.id];
          const delta = m.fit - b.fit;
          const rankMove = b.rank - (i + 1);
          return (
            <li key={m.id} className="dont-row" style={{ '--delay': `${i * 40}ms` }}>
              <span className="dont-pos">#{i + 1}</span>
              <button type="button" className="dont-name" onClick={() => onOpenDetail?.(m.id)}>{m.name}</button>
              <span className="dont-track" title={`${m.name}: ${m.fit} / 100`}>
                <span className="dont-fill" style={{ width: `${m.fit}%` }} />
              </span>
              <span className="dont-fit">{m.fit}</span>
              <span className={`dont-delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}`}>
                {delta === 0 ? '—' : `${delta > 0 ? '+' : ''}${delta}`}
                {rankMove !== 0 && <small>{rankMove > 0 ? ` ↑${rankMove}` : ` ↓${-rankMove}`}</small>}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="viz-caption">Deltas compare against your saved answers. Penalty cap: 25 points.</p>
    </section>
  );
}
