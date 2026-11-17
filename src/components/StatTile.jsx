// Stat tile: label, value (count-up animated), optional sub text. The value is
// a plain figure in the UI sans; identity comes from the label, not color.

import { useCountUp } from '../lib/useCountUp.js';

export default function StatTile({ label, value, suffix = '', text, sub, delay = 0 }) {
  const numeric = typeof value === 'number';
  const shown = useCountUp(numeric ? value : 0, 900);
  return (
    <div className="stat reveal" style={{ '--delay': `${delay}ms` }}>
      <span className="stat-label">{label}</span>
      <b className={`stat-value${text ? ' txt' : ''}`}>
        {numeric ? `${shown}${suffix}` : text ?? value}
      </b>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}
