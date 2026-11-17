// Learning Communities tab: every community reference grouped by major, with
// its verification status, a college filter, and the official directory link.
// Honors the policy: unverified associations are labelled and never implied
// to be guaranteed or eligibility-checked.

import { useMemo, useState } from 'react';
import { majors } from '../data/majors.js';
import { learningCommunitiesByMajor, LEARNING_COMMUNITIES_DIRECTORY } from '../data/learningCommunities.js';
import Icon from '../components/Icon.jsx';
import CommentThread from '../components/CommentThread.jsx';

export default function Communities({ onOpenMajor, topIds = [] }) {
  const colleges = useMemo(() => {
    const set = new Set();
    majors.forEach((m) => m.college.split(' / ').forEach((c) => set.add(c)));
    return ['All colleges', ...Array.from(set).sort()];
  }, []);
  const [college, setCollege] = useState('All colleges');
  const [onlyListed, setOnlyListed] = useState(false);

  const rows = majors
    .filter((m) => college === 'All colleges' || m.college.includes(college))
    .map((m) => ({ major: m, lcs: learningCommunitiesByMajor[m.id] ?? [] }))
    .filter((r) => !onlyListed || r.lcs.length > 0)
    .sort((a, b) => (topIds.includes(b.major.id) ? 1 : 0) - (topIds.includes(a.major.id) ? 1 : 0));

  const listed = Object.values(learningCommunitiesByMajor).reduce((s, arr) => s + arr.length, 0);

  return (
    <section className="communities" aria-labelledby="lc-heading">
      <header className="pagehead">
        <span className="eyebrow-plain">Mission 5 · Belong</span>
        <h1 id="lc-heading">Find your people</h1>
        <p>{listed} community references · unverified ones are labelled · confirm eligibility on the official directory.</p>
        <a className="btn-pill" href={LEARNING_COMMUNITIES_DIRECTORY} target="_blank" rel="noopener noreferrer">
          Open the official directory <span className="go"><Icon name="arrow" size={14} /></span>
        </a>
      </header>

      <div className="filters">
        <div className="tabs" role="tablist" aria-label="Filter by college">
          {colleges.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={college === c} onClick={() => setCollege(c)}>{c.replace('College of ', '')}</button>
          ))}
        </div>
        <label className="gchip">
          <input type="checkbox" checked={onlyListed} onChange={(e) => setOnlyListed(e.target.checked)} /> Only majors with a listed community
        </label>
      </div>

      <div className="lc-grid">
        {rows.map(({ major, lcs }, i) => (
          <article key={major.id} className={`lc-tile reveal${topIds.includes(major.id) ? ' mine' : ''}`} style={{ '--delay': `${i * 50}ms` }}>
            <div className="lc-tile-head">
              <div>
                <h3>{major.name}</h3>
                <small>{major.college}</small>
              </div>
              {topIds.includes(major.id) && <span className="chip-mini tone-gold">In your matches</span>}
            </div>
            {lcs.length ? (
              <ul className="lc-list">
                {lcs.map((c) => (
                  <li key={c.name} className="lc-card">
                    <div className="lc-head">
                      <strong>{c.name}</strong>
                      <span className={`lc-badge ${c.status}`} title={c.note}>{c.status === 'verified' ? 'Verified' : 'Unverified — confirm on directory'}</span>
                    </div>
                    <p className="lc-for">For: {c.forStudents}</p>
                    <p className="lc-benefit">{c.benefit}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="lc-empty">No verified association yet for this major. Browse the official directory for what is currently offered.</p>
            )}
            <div className="lc-tile-actions">
              <button type="button" className="textbtn" onClick={() => onOpenMajor(major.id)}>Major details <Icon name="arrow" size={13} /></button>
              <a className="textbtn" href={major.catalogUrl} target="_blank" rel="noopener noreferrer">Catalog ↗</a>
            </div>
            <CommentThread threadId={`lc-${major.id}`} placeholder={`Ask about ${major.name} communities…`} />
          </article>
        ))}
        {!rows.length && <p className="empty">No majors match this filter.</p>}
      </div>
    </section>
  );
}
