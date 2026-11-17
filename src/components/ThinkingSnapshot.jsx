// Shows the relative thinking snapshot from the Thinking Worlds mini-games as
// a centered tilt bar per dimension with a wide uncertainty band. Clearly
// states it is for reflection and not part of the fit score.

import Icon from './Icon.jsx';

export default function ThinkingSnapshot({ thinking, onReplay }) {
  if (!thinking) return null;
  return (
    <section className="panel think-panel" aria-labelledby="think-heading">
      <div className="panelhead">
        <h3 id="think-heading"><Icon name="bolt" size={18} /> Thinking snapshot</h3>
        <span className="badge">Not used in score</span>
      </div>
      <p className="muted">
        Your strongest world was <strong>{thinking.strongest.name}</strong>. Bars show how each
        dimension compares with <em>your own</em> average, with a wide band because three items are noisy.
      </p>
      <ul className="tilt-list">
        {thinking.dims.map((d) => {
          const pct = 50 + d.relative * 50; // -1..1 → 0..100
          const band = d.band * 50;
          return (
            <li key={d.key} className="tilt-row">
              <span className="tilt-name">{d.name}</span>
              <span className="tilt-track" title={`${d.name}: ${Math.round(d.raw * 100)}% in that world`}>
                <span className="tilt-mid" />
                <span className="tilt-band" style={{ left: `${Math.max(0, pct - band)}%`, width: `${Math.min(100, pct + band) - Math.max(0, pct - band)}%` }} />
                <span className="tilt-dot" style={{ left: `${pct}%` }} />
              </span>
              <span className="tilt-word">{d.relative > 0.08 ? 'leans up' : d.relative < -0.08 ? 'leans down' : 'about even'}</span>
            </li>
          );
        })}
      </ul>
      <p className="viz-caption">{thinking.note}</p>
      {onReplay && (
        <button type="button" className="textbtn" onClick={onReplay}>Replay the worlds</button>
      )}
    </section>
  );
}
