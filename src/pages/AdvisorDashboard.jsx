// Advisor dashboard: grouped trends over synthetic sessions, plus anonymous
// session prep cards. Charts follow the data-viz method: one hue for nominal
// bars (no legend), a thin segmented bar for the status split (fixed slot
// order + legend), visible value labels, hover tooltips, and a table toggle.

import { useMemo, useState } from 'react';
import { generateSessions, aggregate, COMMON_QUESTIONS } from '../data/syntheticSessions.js';
import { interestOptions, priorityOptions } from '../data/majors.js';
import StatTile from '../components/StatTile.jsx';
import BarChart from '../components/BarChart.jsx';
import SegmentedBar from '../components/SegmentedBar.jsx';
import Icon from '../components/Icon.jsx';

const INTEREST = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));
const PRIORITY = Object.fromEntries(priorityOptions.map((o) => [o.id, o.label]));

export default function AdvisorDashboard({ go }) {
  const [range, setRange] = useState(14);
  const sessions = useMemo(() => generateSessions(42), []);
  const inRange = useMemo(() => sessions.filter((s) => s.daysAgo < range), [sessions, range]);
  const agg = useMemo(() => aggregate(inRange), [inRange]);
  const [open, setOpen] = useState(null);

  const openSession = inRange.find((s) => s.id === open);

  return (
    <section className="advisor" aria-labelledby="adv-heading">
      <header className="pagehead">
        <span className="eyebrow-plain">Advisor view · grouped data · synthetic sessions</span>
        <h1 id="adv-heading">What students are exploring</h1>
        <p>Demand by interest, the don'ts that most often lower a top match, and where sessions are close calls. No names or records: every card is an anonymous synthetic profile run through the real engine.</p>
      </header>

      <div className="filters">
        <div className="tabs" role="tablist" aria-label="Date range">
          {[7, 14].map((d) => (
            <button key={d} type="button" role="tab" aria-selected={range === d} onClick={() => setRange(d)}>Last {d} days</button>
          ))}
        </div>
        <span className="badge">{inRange.length} sessions</span>
      </div>

      <div className="stats">
        <StatTile label="Sessions" value={agg.total} delay={0} />
        <StatTile label="Undeclared" value={agg.total ? Math.round((agg.undeclared / agg.total) * 100) : 0} suffix="%" sub={`${agg.undeclared} students`} delay={60} />
        <StatTile label="Marked a don't" value={agg.total ? Math.round((agg.withDislikes / agg.total) * 100) : 0} suffix="%" sub="dislikes shape most sessions" delay={120} />
        <StatTile label="Near ties (≤ 6 pts)" value={agg.nearTies} sub="good 'try a course' candidates" delay={180} />
      </div>

      <div className="dash-grid">
        <div className="panel"><BarChart title="Interest demand" rows={agg.interests} unit="students" caption="How many students selected each interest." /></div>
        <div className="panel"><BarChart title="Most common don'ts" rows={agg.dislikes} unit="students" caption="Activities students asked to avoid. These lower, never hide, majors." /></div>
        <div className="panel"><BarChart title="Top recommended major (rank 1)" rows={agg.topMajors} unit="sessions" caption="Which major came out first per session." /></div>
        <div className="panel">
          <SegmentedBar title="Session status" parts={[{ id: 'und', label: 'Undeclared', value: agg.undeclared }, { id: 'chg', label: 'Considering a change', value: agg.changing }]} />
          <BarChart title="What matters most" rows={agg.priorities} unit="students" />
        </div>
      </div>

      <div className="hub-cols">
        <section className="panel" aria-labelledby="sess-heading">
          <div className="panelhead"><h2 id="sess-heading"><Icon name="users" size={18} /> Session prep cards</h2><span className="badge">Anonymous</span></div>
          <ul className="sessions">
            {inRange.slice(0, 12).map((s) => (
              <li key={s.id}>
                <button type="button" className={`sess${open === s.id ? ' on' : ''}`} aria-expanded={open === s.id} onClick={() => setOpen(open === s.id ? null : s.id)}>
                  <span className="sess-id">{s.id}</span>
                  <span className="sess-main">
                    <b>{s.top[0].name}</b> <small>{s.top[0].fit}/100</small>
                    {s.nearTie && <span className="chip-mini tone-gold">near tie</span>}
                    {s.profile.dislikes.length > 0 && <span className="chip-mini tone-cardinal">{s.profile.dislikes.length} don't{s.profile.dislikes.length > 1 ? 's' : ''}</span>}
                  </span>
                  <small className="muted">{s.profile.status === 'undeclared' ? 'Undeclared' : 'Changing'} · {s.profile.year} · {s.daysAgo === 0 ? 'today' : `${s.daysAgo}d ago`}</small>
                </button>
                {open === s.id && openSession && (
                  <div className="prep reveal">
                    <div className="prep-grid">
                      <div><h4>Likes</h4><p>{s.profile.interests.map((i) => INTEREST[i]).join(', ')}</p></div>
                      <div><h4>Don'ts</h4><p>{s.profile.dislikes.length ? s.profile.dislikes.map((i) => INTEREST[i]).join(', ') : 'None marked'}</p></div>
                      <div><h4>Priority</h4><p>{PRIORITY[s.profile.priority]}</p></div>
                      <div><h4>Top 3</h4><p>{s.top.map((t) => `${t.name} (${t.fit}${t.penalty ? `, −${t.penalty}` : ''})`).join(' · ')}</p></div>
                    </div>
                    <p className="viz-caption">Suggested opener: {s.nearTie ? `"${s.top[0].name} and ${s.top[1].name} are close for you — what would a bad week in each look like?"` : s.profile.dislikes.length ? `"You asked to avoid ${INTEREST[s.profile.dislikes[0]].toLowerCase()} — let's look at how heavy that is in ${s.top[0].name}'s first year."` : `"What drew you to ${s.top[0].name}?"`}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="cq-heading">
          <div className="panelhead"><h2 id="cq-heading"><Icon name="message" size={18} /> Questions students ask</h2></div>
          <ol className="common-q">
            {COMMON_QUESTIONS.map((c) => (
              <li key={c.text}><span>{c.text}</span><span className="badge">{c.count}</span></li>
            ))}
          </ol>
          <button type="button" className="textbtn" onClick={() => go('ask')}>See the prepared answers <Icon name="arrow" size={13} /></button>
          <p className="viz-caption">Counts are synthetic. A pilot would log questions without personal fields for quality review (Tech Spec §7).</p>
        </section>
      </div>
    </section>
  );
}
