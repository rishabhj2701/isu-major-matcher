// Recommendation card for the results dashboard. Expandable to reveal the
// factor breakdown, a radar chart, good-fit / caution notes, and the detail
// entry point. Entrance animation is staggered via the `index` prop.

import { useState } from 'react';
import FitMeter from './FitMeter.jsx';
import FactorBreakdown from './FactorBreakdown.jsx';
import RadarChart from './RadarChart.jsx';
import { explainMatch } from '../lib/matcher.js';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function MajorCard({
  scored,
  rank,
  index = 0,
  dislikeLabels = {},
  onOpenDetail,
  compareChecked = false,
  onToggleCompare,
}) {
  const [expanded, setExpanded] = useState(rank === 1);
  const reasons = explainMatch(scored, dislikeLabels);
  const detailId = `major-detail-${scored.id}`;

  return (
    <article
      className={`major-card reveal${rank === 1 ? ' featured' : ''}`}
      style={{ '--delay': `${index * 90}ms` }}
    >
      {rank === 1 && <span className="top-ribbon">Top match</span>}
      <div className="major-card-head">
        <span className={`rank-badge rank-${rank}`}>
          <span className="rank-medal" aria-hidden="true">{MEDALS[rank - 1] ?? ''}</span>
          <span className="rank-num">#{rank}</span>
        </span>
        <div>
          <h3>{scored.name}</h3>
          <p className="major-college">{scored.college}</p>
        </div>
      </div>

      <FitMeter fit={scored.fit} />

      <p className="major-summary">{scored.summary}</p>

      <ul className="reason-list">
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <div className="major-card-actions">
        <button
          type="button"
          className="link-button"
          aria-expanded={expanded}
          aria-controls={detailId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Hide breakdown' : 'Show how this was scored'}
        </button>
        <button type="button" className="secondary-button" onClick={() => onOpenDetail(scored.id)}>
          Explore pathway →
        </button>
        {onToggleCompare && (
          <label className="compare-check">
            <input
              type="checkbox"
              checked={compareChecked}
              onChange={() => onToggleCompare(scored.id)}
            />
            Compare
          </label>
        )}
      </div>

      {expanded && (
        <div id={detailId} className="major-card-detail">
          <div className="detail-split">
            <FactorBreakdown scored={scored} dislikeLabels={dislikeLabels} />
            <RadarChart factors={scored.factors} title={`${scored.name} factor profile`} />
          </div>
          {scored.goodIf?.length > 0 && (
            <div className="fit-notes">
              <div className="fit-note good">
                <strong>Likely a good fit if</strong>
                <ul>{scored.goodIf.map((g) => <li key={g}>{g}</li>)}</ul>
              </div>
              <div className="fit-note caution">
                <strong>May not suit you if</strong>
                <ul>{scored.cautionIf.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
