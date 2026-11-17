// Student-friendly advising summary: recommended majors, why, tradeoffs,
// questions generated from the real profile (incl. a don'ts question), and
// official next steps. Printable.

import { explainMatch } from '../lib/matcher.js';
import { buildAdvisorQuestions } from '../lib/advisorQuestions.js';
import { interestOptions, priorityOptions } from '../data/majors.js';
import { LEARNING_COMMUNITIES_DIRECTORY } from '../data/learningCommunities.js';
import Icon from '../components/Icon.jsx';

export default function AdvisingSummary({ topScored, profile, onBack }) {
  const dislikeLabels = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));
  const priorityLabel = priorityOptions.find((p) => p.id === profile.priority)?.label;
  const questions = buildAdvisorQuestions(profile, topScored);
  const dislikes = (profile.dislikes ?? []).map((d) => dislikeLabels[d]);

  return (
    <section className="summary-page" aria-labelledby="summary-heading">
      <div className="no-print">
        <button type="button" className="link-button back" onClick={onBack}><Icon name="back" size={14} /> Back to results</button>
      </div>

      <div className="summary-doc">
        <header className="summary-head">
          <span className="eyebrow-plain">ISU FitFinder · advising summary · {new Date().toLocaleDateString()}</span>
          <h2 id="summary-heading">Your advising summary</h2>
          <p className="muted">
            A starting point for a conversation with an ISU academic advisor. Informational guidance,
            not official advising, and not a degree audit.
          </p>
        </header>

        <h3>About you</h3>
        <p>
          {profile.status === 'changing' ? 'Considering a change of major' : 'Undeclared / exploring'}
          {profile.currentMajor ? ` (currently: ${profile.currentMajor})` : ''}
          {profile.year ? ` · ${profile.year}` : ''}
          {priorityLabel ? ` · cares most about ${priorityLabel.toLowerCase()}` : ''}.
          {' '}Likes: {(profile.interests ?? []).map((i) => dislikeLabels[i]).join(', ') || '—'}.
          {' '}Don'ts: {dislikes.join(', ') || 'none marked'}.
        </p>

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
          <li>Overlap scores reflect your stated interests and documented illustrative weights, not a measured chance of success.</li>
          <li>
            {priorityLabel ? `You said ${priorityLabel.toLowerCase()} matters most. ` : ''}
            Affordability and time-to-degree depend on your completed credits and need advisor review — this summary deliberately has no graduation date.
          </li>
          {dislikes.length > 0 && (
            <li>Your don'ts ({dislikes.join(', ')}) lowered some majors by a capped amount but removed none. Ask how heavy those activities are in the first two years.</li>
          )}
          <li>A major you ranked lower may still be a great fit; use "Explore pathway" before ruling anything out.</li>
        </ul>

        <h3>Questions to ask your advisor</h3>
        <ol className="summary-questions">
          {questions.map((q) => (
            <li key={q.id}><span className="chip-mini tone-neutral">{q.tag}</span> {q.text}</li>
          ))}
        </ol>

        <h3>Official resources to explore next</h3>
        <ul>
          {topScored.map((s) => (
            <li key={s.id}>{s.name}: <a href={s.catalogUrl} target="_blank" rel="noopener noreferrer">official catalog page ↗</a></li>
          ))}
          <li><a href={LEARNING_COMMUNITIES_DIRECTORY} target="_blank" rel="noopener noreferrer">ISU Learning Communities directory ↗</a></li>
          <li><a href="https://www.advising.iastate.edu/" target="_blank" rel="noopener noreferrer">ISU Academic Advising ↗</a></li>
        </ul>
      </div>

      <div className="no-print summary-actions">
        <button type="button" className="primary" onClick={() => window.print()}><Icon name="print" size={14} /> Print / save as PDF</button>
      </div>
    </section>
  );
}
