// Student-friendly advising summary: recommended majors, why, tradeoffs,
// questions to ask an advisor, and official next steps. Printable.

import { explainMatch } from '../lib/matcher.js';
import { interestOptions, priorityOptions } from '../data/majors.js';
import { LEARNING_COMMUNITIES_DIRECTORY } from '../data/learningCommunities.js';

const ADVISOR_QUESTIONS = [
  'Which of these majors fits my completed credits best, and what would carry over?',
  'How would switching affect my expected time to degree?',
  'What introductory course could I try next semester to test the fit?',
  'Which learning communities am I eligible for, and how do I join?',
  'Are there minors or second majors that combine well with my interests?',
];

export default function AdvisingSummary({ topScored, profile, onBack }) {
  const dislikeLabels = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));
  const priorityLabel = priorityOptions.find((p) => p.id === profile.priority)?.label;

  return (
    <section className="summary-page" aria-labelledby="summary-heading">
      <div className="no-print">
        <button type="button" className="link-button back" onClick={onBack}>
          ← Back to results
        </button>
      </div>

      <div className="summary-doc">
        <header className="summary-head">
          <h2 id="summary-heading">Your advising summary</h2>
          <p className="muted">
            A starting point for a conversation with an ISU academic advisor. This is informational
            guidance, not official advising, and not a degree audit.
          </p>
        </header>

        <h3>Recommended majors</h3>
        <ol className="summary-majors">
          {topScored.map((s) => (
            <li key={s.id}>
              <strong>{s.name}</strong> — {s.college} · overlap {s.fit}/100
              <ul className="reason-list">
                {explainMatch(s, dislikeLabels).map((r) => <li key={r}>{r}</li>)}
              </ul>
            </li>
          ))}
        </ol>

        <h3>Important tradeoffs to weigh</h3>
        <ul>
          <li>
            Overlap scores reflect your stated interests and our illustrative weights, not a
            measured chance of success.
          </li>
          <li>
            {priorityLabel
              ? `You said ${priorityLabel.toLowerCase()} matters most. `
              : ''}
            Affordability and time-to-degree depend on your completed credits and need advisor
            review — we deliberately don&apos;t estimate a graduation date here.
          </li>
          <li>
            A major you ranked lower may still be a great fit; use &quot;Explore pathway&quot; before
            ruling anything out.
          </li>
        </ul>

        <h3>Questions to ask your advisor</h3>
        <ul>
          {ADVISOR_QUESTIONS.map((q) => <li key={q}>{q}</li>)}
        </ul>

        <h3>Official resources to explore next</h3>
        <ul>
          {topScored.map((s) => (
            <li key={s.id}>
              {s.name}:{' '}
              <a href={s.catalogUrl} target="_blank" rel="noopener noreferrer">
                official catalog page ↗
              </a>
            </li>
          ))}
          <li>
            <a href={LEARNING_COMMUNITIES_DIRECTORY} target="_blank" rel="noopener noreferrer">
              ISU Learning Communities directory ↗
            </a>
          </li>
        </ul>
      </div>

      <div className="no-print summary-actions">
        <button type="button" className="primary" onClick={() => window.print()}>
          Print / save as PDF
        </button>
      </div>
    </section>
  );
}
