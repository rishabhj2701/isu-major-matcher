// Major constellation: "You" at the center, your top majors as stars. Closer
// and brighter = higher overlap. Lines between stars mean both majors lean on
// an interest you picked. Hover a star for details; click to open it.

import { useMemo, useState } from 'react';
import { interestOptions } from '../data/majors.js';
import { track } from '../lib/events.js';

const W = 820;
const H = 440;
const CX = W / 2;
const CY = H / 2;
const LABEL = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));

export default function Constellation({ ranked, profile, onOpen, count = 10 }) {
  const [hover, setHover] = useState(null);
  const picked = profile.interests ?? [];

  const nodes = useMemo(() => {
    const top = ranked.slice(0, count);
    const hi = top[0]?.fit ?? 100;
    const lo = top[top.length - 1]?.fit ?? 0;
    const span = Math.max(1, hi - lo);
    return top.map((m, i) => {
      // Golden-angle spacing keeps neighbouring ranks apart; distance is
      // stretched over the shown score range so differences are visible.
      const angle = -Math.PI / 2 + i * 2.39996;
      const dist = 0.36 + ((hi - m.fit) / span) * 0.6;
      const y = CY + Math.sin(angle) * dist * (H / 2 - 52);
      return {
        ...m,
        rank: i + 1,
        x: CX + Math.cos(angle) * dist * (W / 2 - 110),
        y,
        r: 7 + (m.fit / 100) * 13,
        above: y < CY - 4,
        shared: picked.filter((id) => (m.interestWeights?.[id] ?? 0) >= 0.6),
      };
    });
  }, [ranked, count, picked]);

  const links = useMemo(() => {
    const out = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const common = nodes[i].shared.filter((s) => nodes[j].shared.includes(s));
        if (common.length) out.push({ a: nodes[i], b: nodes[j], common });
      }
    }
    return out;
  }, [nodes]);

  const active = nodes.find((n) => n.id === hover);

  return (
    <section className="panel constellation" aria-labelledby="const-heading">
      <div className="panelhead">
        <h3 id="const-heading">✨ Your major constellation</h3>
        <span className="badge">Closer &amp; bigger = stronger fit</span>
      </div>
      <div className="const-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Your top majors arranged around you by fit">
          <defs>
            <radialGradient id="youGlow"><stop offset="0%" stopColor="#ffd97a" /><stop offset="100%" stopColor="#ff5a7a" stopOpacity="0" /></radialGradient>
            <radialGradient id="starA"><stop offset="0%" stopColor="#fff" /><stop offset="45%" stopColor="#ffd97a" /><stop offset="100%" stopColor="#ff5a7a" /></radialGradient>
            <radialGradient id="starB"><stop offset="0%" stopColor="#fff" /><stop offset="50%" stopColor="#b7adff" /><stop offset="100%" stopColor="#5b4fd0" /></radialGradient>
          </defs>

          {[0.38, 0.62, 0.9].map((k, i) => (
            <ellipse key={k} className="orbit" cx={CX} cy={CY} rx={k * (W / 2 - 70)} ry={k * (H / 2 - 40)} style={{ animationDelay: `${i * 0.4}s` }} />
          ))}

          {nodes.map((n, i) => (
            <line key={`you-${n.id}`} className={`spoke${hover && hover !== n.id ? ' dim' : ''}`} x1={CX} y1={CY} x2={n.x} y2={n.y} style={{ opacity: 0.15 + n.fit / 180, animationDelay: `${0.2 + i * 0.07}s` }} />
          ))}
          {hover && links.filter((l) => l.a.id === hover || l.b.id === hover).map((l) => (
            <line key={`${l.a.id}-${l.b.id}`} className="link hot" x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} />
          ))}

          <circle cx={CX} cy={CY} r="46" fill="url(#youGlow)" className="you-glow" />
          <circle cx={CX} cy={CY} r="20" className="you-core" />
          <text x={CX} y={CY + 4} className="you-label" textAnchor="middle">You</text>

          {nodes.map((n, i) => (
            <g
              key={n.id}
              className={`star${n.rank <= 3 ? ' top' : ''}${hover === n.id ? ' on' : ''}`}
              style={{ animationDelay: `${0.35 + i * 0.08}s`, transformOrigin: `${n.x}px ${n.y}px` }}
              tabIndex={0}
              role="button"
              aria-label={`${n.name}, overlap ${n.fit} of 100, rank ${n.rank}`}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              onClick={() => { track('starClick'); onOpen(n.id); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); track('starClick'); onOpen(n.id); } }}
            >
              <circle cx={n.x} cy={n.y} r={n.r + 10} className="star-halo" />
              <circle cx={n.x} cy={n.y} r={n.r} fill={n.rank <= 3 ? 'url(#starA)' : 'url(#starB)'} className="star-core" />
              <text x={n.x} y={n.above ? n.y - n.r - 9 : n.y + n.r + 16} textAnchor="middle" className="star-label">{n.rank <= 3 ? `#${n.rank} ` : ''}{n.name}</text>
            </g>
          ))}
        </svg>

        <div className={`const-tip${active ? ' show' : ''}`} aria-live="polite">
          {active ? (
            <>
              <b>#{active.rank} {active.name}</b>
              <span className="tip-fit">{active.fit}<small>/100</small></span>
              <small>{active.shared.length ? `Shares your: ${active.shared.map((s) => LABEL[s]).join(', ')}` : 'Few shared interests — explore anyway'}</small>
              <small className="tip-cta">Click to open →</small>
            </>
          ) : (
            <small>Hover or tab to a star to see which majors share your interests.</small>
          )}
        </div>
      </div>
    </section>
  );
}
