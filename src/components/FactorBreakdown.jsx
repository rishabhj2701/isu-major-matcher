// Shows exactly how each factor contributed to a major's score, so the number
// is always explainable. Includes the dislike penalty when present.

import { FACTOR_WEIGHTS } from '../lib/matcher.js';

const FACTOR_LABELS = {
  interests: 'Interests',
  strengths: 'Academic strengths',
  careerFit: 'Career alignment',
  workStyle: 'Working style',
  priorities: 'Stated priorities',
};

export default function FactorBreakdown({ scored, dislikeLabels = {} }) {
  const entries = Object.keys(FACTOR_WEIGHTS);
  const maxContribution = Math.max(
    1,
    ...entries.map((k) => Math.round(FACTOR_WEIGHTS[k] * 100))
  );

  return (
    <div className="factors">
      <h4 className="factors-title">How this score was built</h4>
      <ul className="factor-list">
        {entries.map((key) => {
          const points = scored.contributions[key];
          const maxForFactor = Math.round(FACTOR_WEIGHTS[key] * 100);
          const widthPct = Math.round((maxForFactor / maxContribution) * 100);
          const fillPct = maxForFactor ? Math.round((points / maxForFactor) * 100) : 0;
          return (
            <li key={key} className="factor-row">
              <span className="factor-name">
                {FACTOR_LABELS[key]}
                <span className="factor-weight"> (weight {Math.round(FACTOR_WEIGHTS[key] * 100)}%)</span>
              </span>
              <span className="factor-track" style={{ maxWidth: `${widthPct}%` }}>
                <span className="factor-fill" style={{ width: `${fillPct}%` }} />
              </span>
              <span className="factor-points">+{points}</span>
            </li>
          );
        })}
        {scored.penalty > 0 && (
          <li className="factor-row penalty">
            <span className="factor-name">
              Dislike penalty
              {scored.dislikeDrivers.length > 0 && (
                <span className="factor-weight">
                  {' '}
                  ({scored.dislikeDrivers.map((d) => dislikeLabels[d.id] ?? d.id).join(', ')})
                </span>
              )}
            </span>
            <span className="factor-track" />
            <span className="factor-points penalty">−{scored.penalty}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
