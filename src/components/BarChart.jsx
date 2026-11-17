// Horizontal bar list for nominal categories (one series → one hue, no
// legend; the title names the measure). Bars are ≤ 20px thick with rounded
// data-ends, grow from the baseline, and each row has a hover tooltip and a
// visible value label. A table view is available via the `table` toggle.

import { useState } from 'react';

export default function BarChart({ title, rows = [], unit = 'students', max, limit = 8, caption }) {
  const [table, setTable] = useState(false);
  const data = rows.slice(0, limit);
  const top = max ?? Math.max(1, ...data.map((r) => r.value));

  return (
    <figure className="viz">
      <figcaption className="viz-head">
        <span className="viz-title">{title}</span>
        <button type="button" className="textbtn" onClick={() => setTable((v) => !v)} aria-pressed={table}>
          {table ? 'Chart' : 'Table'}
        </button>
      </figcaption>

      {table ? (
        <table className="viz-table">
          <thead><tr><th scope="col">Category</th><th scope="col">{unit}</th></tr></thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id}><th scope="row">{r.label}</th><td>{r.value}</td></tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ol className="bars" aria-label={title}>
          {data.map((r, i) => (
            <li key={r.id} className="bar-row" style={{ '--delay': `${i * 50}ms` }}>
              <span className="bar-label" title={r.label}>{r.label}</span>
              <span className="bar-track" title={`${r.label}: ${r.value} ${unit}`}>
                <span className="bar-fill" style={{ width: `${(r.value / top) * 100}%` }} />
              </span>
              <span className="bar-value">{r.value}</span>
            </li>
          ))}
        </ol>
      )}
      {caption && <p className="viz-caption">{caption}</p>}
    </figure>
  );
}
