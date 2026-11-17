// Thin segmented bar: one whole split into parts. Parts use categorical slots
// in fixed order; a legend below names each part with its share. Parts at
// zero draw nothing. 2px surface gaps separate the segments.

export default function SegmentedBar({ title, parts = [] }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <figure className="viz">
      <figcaption className="viz-head"><span className="viz-title">{title}</span></figcaption>
      <div className="segbar" role="img" aria-label={parts.map((p) => `${p.label} ${Math.round((p.value / total) * 100)}%`).join(', ')}>
        {parts.map((p, i) =>
          p.value > 0 ? (
            <span
              key={p.id}
              className={`seg-part slot-${i + 1}`}
              style={{ width: `${(p.value / total) * 100}%` }}
              title={`${p.label}: ${p.value} (${Math.round((p.value / total) * 100)}%)`}
            />
          ) : null
        )}
      </div>
      <ul className="legend">
        {parts.map((p, i) => (
          <li key={p.id}>
            <span className={`swatch slot-${i + 1}`} aria-hidden="true" />
            {p.label} <b>{Math.round((p.value / total) * 100)}%</b>
          </li>
        ))}
      </ul>
    </figure>
  );
}
