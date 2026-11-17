// Side-by-side comparison of 2–3 majors: fit, factor contributions, careers,
// and where advisor review is needed. Verified source links included.

import { scoreMajor, fitBand } from '../lib/matcher.js';
import { majors } from '../data/majors.js';

const ROWS = [
  { key: 'college', label: 'College' },
  { key: 'fit', label: 'Overlap score' },
  { key: 'band', label: 'Fit band' },
  { key: 'topFactor', label: 'Strongest factor' },
  { key: 'careers', label: 'Careers' },
  { key: 'caution', label: 'May not suit you if' },
  { key: 'source', label: 'Official source' },
];

const FACTOR_LABELS = {
  interests: 'Interests',
  strengths: 'Strengths',
  careerFit: 'Career alignment',
  workStyle: 'Working style',
  priorities: 'Priorities',
};

export default function Compare({ majorIds, profile, onBack }) {
  const scored = majorIds
    .map((id) => majors.find((m) => m.id === id))
    .filter(Boolean)
    .map((m) => scoreMajor(profile, m));

  function cell(s, key) {
    switch (key) {
      case 'college':
        return s.college;
      case 'fit':
        return `${s.fit} / 100`;
      case 'band':
        return fitBand(s.fit).label;
      case 'topFactor': {
        const top = Object.entries(s.contributions).sort((a, b) => b[1] - a[1])[0];
        return `${FACTOR_LABELS[top[0]]} (+${top[1]})`;
      }
      case 'careers':
        return s.careers.join(', ');
      case 'caution':
        return (s.cautionIf ?? []).join('; ');
      case 'source':
        return (
          <a href={s.catalogUrl} target="_blank" rel="noopener noreferrer">
            Catalog ↗
          </a>
        );
      default:
        return '';
    }
  }

  return (
    <section className="compare-page" aria-labelledby="compare-heading">
      <button type="button" className="link-button back" onClick={onBack}>
        ← Back to results
      </button>
      <h2 id="compare-heading">Compare majors</h2>
      <p className="muted">
        Shared and differing factors at a glance. Course requirements and time-to-degree depend on
        your record and need advisor review.
      </p>

      <div className="compare-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">Factor</th>
              {scored.map((s) => (
                <th scope="col" key={s.id}>{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {scored.map((s) => (
                  <td key={s.id + row.key}>{cell(s, row.key)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
