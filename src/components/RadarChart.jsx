// Lightweight SVG radar chart (no chart library). Plots a student's factor
// profile for a scored major so judges get an instant visual of the fit shape.
// Values are 0..1 per axis.

const AXES = [
  { key: 'interests', label: 'Interests' },
  { key: 'strengths', label: 'Strengths' },
  { key: 'careerFit', label: 'Career' },
  { key: 'workStyle', label: 'Style' },
  { key: 'priorities', label: 'Priorities' },
];

export default function RadarChart({ factors, size = 220, title }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;
  const n = AXES.length;

  const point = (i, radius) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPoints = AXES.map((a, i) => point(i, r * Math.max(0, Math.min(1, factors[a.key] ?? 0))));
  const dataPath = dataPoints.map((p) => p.join(',')).join(' ');

  return (
    <figure className="radar" aria-label={title ?? 'Factor profile radar chart'}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img">
        {/* grid rings */}
        {rings.map((ring) => (
          <polygon
            key={ring}
            className="radar-grid"
            points={AXES.map((_, i) => point(i, r * ring).join(',')).join(' ')}
          />
        ))}
        {/* spokes */}
        {AXES.map((a, i) => {
          const [x, y] = point(i, r);
          return <line key={a.key} className="radar-spoke" x1={cx} y1={cy} x2={x} y2={y} />;
        })}
        {/* data polygon */}
        <polygon className="radar-area" points={dataPath} />
        {dataPoints.map((p, i) => (
          <circle key={i} className="radar-dot" cx={p[0]} cy={p[1]} r="3.5" />
        ))}
        {/* axis labels */}
        {AXES.map((a, i) => {
          const [x, y] = point(i, r + 16);
          return (
            <text
              key={a.key}
              className="radar-label"
              x={x}
              y={y}
              textAnchor={x > cx + 4 ? 'start' : x < cx - 4 ? 'end' : 'middle'}
              dominantBaseline="middle"
            >
              {a.label}
            </text>
          );
        })}
      </svg>
    </figure>
  );
}
