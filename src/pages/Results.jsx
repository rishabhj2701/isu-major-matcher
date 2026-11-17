// Recommendation dashboard: top-3 majors (with an option to show more),
// compare selection, and entry points to detail / comparison / summary pages.

import { useMemo, useState } from 'react';
import MajorCard from '../components/MajorCard.jsx';
import { matchMajors } from '../lib/matcher.js';
import { AI_AVAILABLE } from '../services/aiExplainer.js';
import { interestOptions } from '../data/majors.js';

export default function Results({ profile, onOpenDetail, onCompare, onSummary, onRestart }) {
  const ranked = useMemo(() => matchMajors(profile), [profile]);
  const [showAll, setShowAll] = useState(false);
  const [compareIds, setCompareIds] = useState([]);

  const dislikeLabels = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));
  const visible = showAll ? ranked : ranked.slice(0, 3);

  function toggleCompare(id) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  return (
    <section className="results-page" aria-labelledby="results-heading">
      <div className="results-head">
        <h2 id="results-heading">Your top major matches</h2>
        <p className="muted">
          Based on your selections and our illustrative, transparent scoring model — not official
          advising and not a validated predictor of success. Explanations are{' '}
          {AI_AVAILABLE ? 'AI-assisted' : 'rule-based (AI explanation is optional and not enabled in this prototype)'}.
        </p>
      </div>

      <div className="results-grid">
        {visible.map((scored, i) => (
          <MajorCard
            key={scored.id}
            scored={scored}
            rank={i + 1}
            index={i}
            dislikeLabels={dislikeLabels}
            onOpenDetail={onOpenDetail}
            compareChecked={compareIds.includes(scored.id)}
            onToggleCompare={toggleCompare}
          />
        ))}
      </div>

      <div className="results-actions">
        {!showAll && ranked.length > 3 && (
          <button type="button" className="secondary-button" onClick={() => setShowAll(true)}>
            Show all {ranked.length} majors
          </button>
        )}
        <button
          type="button"
          className="secondary-button"
          disabled={compareIds.length < 2}
          onClick={() => onCompare(compareIds)}
        >
          Compare selected ({compareIds.length})
        </button>
        <button type="button" className="primary" onClick={() => onSummary(ranked.slice(0, 3))}>
          Build advising summary →
        </button>
        <button type="button" className="link-button" onClick={onRestart}>
          Start over
        </button>
      </div>
    </section>
  );
}
