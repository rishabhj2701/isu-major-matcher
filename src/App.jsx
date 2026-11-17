import { useState } from 'react';
import { interestOptions } from './data/majors.js';
import { matchMajors } from './lib/matcher.js';

export default function App() {
  const [interests, setInterests] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const results = submitted ? matchMajors(interests) : [];
  const labels = Object.fromEntries(interestOptions.map(({ id, label }) => [id, label]));

  function toggle(id) {
    setSubmitted(false);
    setInterests((previous) => previous.includes(id)
      ? previous.filter((item) => item !== id)
      : [...previous, id]);
  }

  return (
    <main className="page">
      <header className="header">
        <span className="eyebrow">AWS Kiro Hackathon 2026 • Team 2</span>
        <h1>Explore your next major.</h1>
        <p className="lead">Select a few things you enjoy to explore possible fields of study at Iowa State University.</p>
      </header>

      <section className="panel" aria-labelledby="interests-heading">
        <h2 id="interests-heading">What interests you?</h2>
        <p>Choose as many as you like. Your results are generated locally in your browser.</p>
        <div className="choices">
          {interestOptions.map(({ id, label }) => (
            <button key={id} type="button"
              aria-pressed={interests.includes(id)}
              className={interests.includes(id) ? 'choice selected' : 'choice'}
              onClick={() => toggle(id)}>{label}</button>
          ))}
        </div>
        <button className="primary" disabled={!interests.length} onClick={() => setSubmitted(true)}>
          Find matching majors
        </button>
      </section>

      {submitted && (
        <section className="results" aria-live="polite" aria-labelledby="results-heading">
          <h2 id="results-heading">Your possible matches</h2>
          <p>Based on overlapping interests in our illustrative sample data—not official advising or a validated AI model.</p>
          {results.length ? (
            <div className="result-grid">
              {results.map((major, index) => (
                <article className="result" key={major.id}>
                  <div className="rank">Match {index + 1}</div>
                  <h3>{major.name}</h3>
                  <p>{major.summary}</p>
                  <div className="reason"><strong>Why it appeared:</strong> {major.matched.map((tag) => labels[tag]).join(', ')}</div>
                </article>
              ))}
            </div>
          ) : <p>No matches in the current sample. Try another interest.</p>}
        </section>
      )}

      <footer>
        Hackathon prototype only. Major descriptions are illustrative; verify academic details and learning-community availability using official ISU sources before making decisions.
      </footer>
    </main>
  );
}
