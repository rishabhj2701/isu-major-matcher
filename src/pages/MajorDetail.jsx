// Major detail / pathway page. Shows academic focus, careers, learning
// communities, and a general pathway note. Never invents required courses or a
// personalized graduation date; where course lists aren't verified we send the
// student to the official four-year plan.

import FitMeter from '../components/FitMeter.jsx';
import FactorBreakdown from '../components/FactorBreakdown.jsx';
import LearningCommunities from '../components/LearningCommunities.jsx';
import { scoreMajor, explainMatch } from '../lib/matcher.js';
import { majors, interestOptions } from '../data/majors.js';

export default function MajorDetail({ majorId, profile, onBack }) {
  const major = majors.find((m) => m.id === majorId);
  if (!major) {
    return (
      <section className="panel">
        <p>Major not found.</p>
        <button type="button" className="secondary-button" onClick={onBack}>
          ← Back to results
        </button>
      </section>
    );
  }

  const scored = scoreMajor(profile, major);
  const dislikeLabels = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));
  const reasons = explainMatch(scored, dislikeLabels);

  return (
    <section className="detail-page" aria-labelledby="detail-heading">
      <button type="button" className="link-button back" onClick={onBack}>
        ← Back to results
      </button>

      <header className="detail-head">
        <h2 id="detail-heading">{major.name}</h2>
        <p className="major-college">{major.college}</p>
        <FitMeter fit={scored.fit} />
      </header>

      <div className="detail-cols">
        <div className="detail-main">
          <h3>Academic focus</h3>
          <p>{major.summary}</p>

          <h3>Why this appeared for you</h3>
          <ul className="reason-list">
            {reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <FactorBreakdown scored={scored} dislikeLabels={dislikeLabels} />

          <h3>Typical introductory coursework</h3>
          {major.sampleCourses?.length ? (
            <ul className="course-list">
              {major.sampleCourses.map((c) => (
                <li key={c.code}>
                  <strong>{c.code}</strong> — {c.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">
              We don&apos;t list specific course numbers here because ISU&apos;s catalog recently
              moved to new course numbers. See the official four-year plan for the current,
              verified sequence.
            </p>
          )}

          <h3>Simplified pathway</h3>
          <p className="muted">
            A personalized degree audit — remaining credits, applicable transfer credit, and a
            graduation timeline — requires advisor review of your record. This tool shows general
            pathway information only and does not calculate a graduation date.
          </p>
        </div>

        <aside className="detail-side">
          <h3>Related career directions</h3>
          <ul className="career-list">
            {major.careers.map((c) => <li key={c}>{c}</li>)}
          </ul>

          <LearningCommunities majorId={major.id} />

          <h3>Official ISU information</h3>
          <a
            className="lc-link"
            href={major.catalogUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the official catalog page ↗
          </a>
          <p className="verify-note">
            Verified: {major.verification?.note} (checked {major.verification?.checkedOn})
          </p>
        </aside>
      </div>
    </section>
  );
}
