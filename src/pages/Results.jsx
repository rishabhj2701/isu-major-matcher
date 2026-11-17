// Recommendation dashboard: top-3 majors (expandable to all), the don'ts
// explorer (live what-if on the real engine), an optional thinking snapshot,
// compare selection, and entry points to detail / comparison / summary.

import { useMemo, useState } from 'react';
import MajorCard from '../components/MajorCard.jsx';
import DislikeExplorer from '../components/DislikeExplorer.jsx';
import Constellation from '../components/Constellation.jsx';
import ThinkingSnapshot from '../components/ThinkingSnapshot.jsx';
import Icon from '../components/Icon.jsx';
import { matchMajors } from '../lib/matcher.js';
import { AI_AVAILABLE } from '../services/aiExplainer.js';
import { interestOptions } from '../data/majors.js';

export default function Results({ profile, onOpenDetail, onCompare, onSummary, onRestart, onPlayWorlds, onBrowse }) {
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
      <header className="pagehead">
        <span className="eyebrow-plain">Mission 3 · Reveal</span>
        <h1 id="results-heading">Your matches</h1>
        <p>Every score is explainable. Tap a card to see how it was built.{AI_AVAILABLE ? '' : ' Rule-based, not AI.'}</p>
      </header>

      <Constellation ranked={ranked} profile={profile} onOpen={onOpenDetail} />

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
        <button type="button" className="secondary-button" disabled={compareIds.length < 2} onClick={() => onCompare(compareIds)}>
          <Icon name="swap" size={14} /> Compare selected ({compareIds.length})
        </button>
        <button type="button" className="primary" onClick={() => onSummary(ranked.slice(0, 3))}>
          Build advising summary <Icon name="arrow" size={14} />
        </button>
        {onBrowse && (
          <button type="button" className="secondary-button" onClick={onBrowse}>
            <Icon name="layers" size={14} /> Browse all majors
          </button>
        )}
        <button type="button" className="link-button" onClick={onRestart}>Edit my answers</button>
      </div>

      <div className="results-cols">
        <DislikeExplorer profile={profile} onOpenDetail={onOpenDetail} />
        {profile.thinking ? (
          <ThinkingSnapshot thinking={profile.thinking} onReplay={onPlayWorlds} />
        ) : (
          <section className="panel think-panel cta" aria-labelledby="worlds-cta">
            <div className="panelhead"><h3 id="worlds-cta"><Icon name="bolt" size={18} /> Thinking Worlds</h3><span className="badge">Optional · 4 min</span></div>
            <p className="muted">Three short mini-games (Number Forge, Logic Lab, Idea Garden) give you a relative snapshot of how you like to think. For reflection only — it never changes these scores.</p>
            <button type="button" className="btn-pill" onClick={onPlayWorlds}>Enter the worlds <span className="go"><Icon name="arrow" size={14} /></span></button>
          </section>
        )}
      </div>
    </section>
  );
}
