// Alumni Network: synthetic experience stories with role badges, template and
// major filters, a "people like you" toggle (interest overlap with the
// student's profile), local upvotes, and a compose form that stays local.
// Clearly labelled synthetic: in a pilot these are moderated posts from
// verified ISU accounts (PRD F4).

import { useMemo, useState } from 'react';
import { alumniPosts, POST_TEMPLATES, ROLES } from '../data/alumniPosts.js';
import { majors, interestOptions } from '../data/majors.js';
import Icon from '../components/Icon.jsx';
import CommentThread from '../components/CommentThread.jsx';

const MAJOR_NAME = Object.fromEntries(majors.map((m) => [m.id, m.name]));
const INTEREST = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));

export default function Alumni({ profile, topIds = [] }) {
  const [template, setTemplate] = useState('all');
  const [majorId, setMajorId] = useState('all');
  const [likeMe, setLikeMe] = useState(Boolean(profile?.interests?.length));
  const [votes, setVotes] = useState({});
  const [helped, setHelped] = useState({});
  const [drafts, setDrafts] = useState([]);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState({ template: 'question', title: '', body: '', majorId: topIds[0] ?? 'com-s' });

  const myInterests = new Set(profile?.interests ?? []);
  const myDislikes = new Set(profile?.dislikes ?? []);

  const posts = useMemo(() => {
    const all = [...drafts, ...alumniPosts];
    return all
      .map((p) => {
        const overlap = p.tags.filter((t) => myInterests.has(t));
        const sharedDislike = (p.dislikes ?? []).filter((d) => myDislikes.has(d));
        return { ...p, overlap, sharedDislike, similarity: overlap.length + sharedDislike.length * 1.5 };
      })
      .filter((p) => template === 'all' || p.template === template)
      .filter((p) => majorId === 'all' || p.majorId === majorId)
      .filter((p) => !likeMe || p.similarity > 0 || p.local)
      .sort((a, b) => (likeMe ? b.similarity - a.similarity : 0) || (b.upvotes + (votes[b.id] ? 1 : 0)) - (a.upvotes + (votes[a.id] ? 1 : 0)));
  }, [template, majorId, likeMe, votes, drafts, myInterests, myDislikes]);

  function submit(e) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setDrafts((d) => [
      { id: `local-${Date.now()}`, role: 'student', author: 'You (this browser only)', gradYear: null, majorId: draft.majorId, template: draft.template, title: draft.title.trim(), body: draft.body.trim(), tags: [...myInterests], dislikes: [], upvotes: 0, helped: 0, local: true },
      ...d,
    ]);
    setDraft({ ...draft, title: '', body: '' });
    setComposing(false);
  }

  return (
    <section className="alumni" aria-labelledby="alumni-heading">
      <header className="pagehead">
        <span className="eyebrow-plain">Mission 6 · Connect</span>
        <h1 id="alumni-heading">Stories from people like you</h1>
        <p>Synthetic demo stories · in a pilot, verified ISU students, alumni, faculty and advisors.</p>
      </header>

      <div className="filters">
        <div className="tabs" role="tablist" aria-label="Story type">
          <button type="button" role="tab" aria-selected={template === 'all'} onClick={() => setTemplate('all')}>All</button>
          {POST_TEMPLATES.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={template === t.id} onClick={() => setTemplate(t.id)}>{t.label}</button>
          ))}
        </div>
        <label className="select-wrap">
          <span className="sr-only">Filter by major</span>
          <select value={majorId} onChange={(e) => setMajorId(e.target.value)}>
            <option value="all">All majors</option>
            {majors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <label className={`gchip${!profile ? ' disabled' : ''}`} title={profile ? 'Rank stories by overlap with your interests and don\'ts' : 'Complete the quest to enable'}>
          <input type="checkbox" checked={likeMe} disabled={!profile} onChange={(e) => setLikeMe(e.target.checked)} /> People like you
        </label>
        <button type="button" className="btn-pill small" onClick={() => setComposing((v) => !v)}>
          <Icon name="send" size={14} /> {composing ? 'Cancel' : 'Share a story'}
        </button>
      </div>

      {composing && (
        <form className="panel compose reveal" onSubmit={submit} aria-label="Share a story">
          <div className="compose-row">
            <label>Type
              <select value={draft.template} onChange={(e) => setDraft({ ...draft, template: e.target.value })}>
                {POST_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </label>
            <label>Major
              <select value={draft.majorId} onChange={(e) => setDraft({ ...draft, majorId: e.target.value })}>
                {majors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </label>
          </div>
          <label>Title<input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required maxLength={120} placeholder="What I wish I knew about…" /></label>
          <label>Story<textarea rows={4} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} maxLength={1200} placeholder="Keep it honest: the good week and the bad week." /></label>
          <p className="viz-caption">Stays in this browser only. A pilot would send it to a moderation queue (LLM flag, human decides) before anyone sees it.</p>
          <button type="submit" className="primary">Post locally</button>
        </form>
      )}

      <div className="post-grid">
        {posts.map((p, i) => {
          const role = ROLES[p.role];
          const voted = Boolean(votes[p.id]);
          const didHelp = Boolean(helped[p.id]);
          return (
            <article key={p.id} className={`post reveal${p.local ? ' local' : ''}`} style={{ '--delay': `${Math.min(i, 8) * 60}ms` }}>
              <div className="post-head">
                <span className={`avatar-sm tone-${role.tone}`} aria-hidden="true">{p.author.slice(0, 1)}</span>
                <div className="post-who">
                  <b>{p.author}</b>
                  <small>
                    <span className={`role-badge tone-${role.tone}`}>{role.label}{p.gradYear ? ` ’${String(p.gradYear).slice(2)}` : ''}</span>
                    {p.majorId && <> · {MAJOR_NAME[p.majorId]}</>}
                  </small>
                </div>
                <span className="chip-mini tone-neutral">{POST_TEMPLATES.find((t) => t.id === p.template)?.label}</span>
              </div>
              <h3>{p.title}</h3>
              <p className="post-body">{p.body}</p>
              {(p.overlap.length > 0 || p.sharedDislike.length > 0) && likeMe && (
                <p className="post-match">
                  <Icon name="sparkle" size={13} /> Like you: {[...p.overlap.map((t) => INTEREST[t]), ...p.sharedDislike.map((d) => `also avoids ${INTEREST[d]?.toLowerCase()}`)].join(' · ')}
                </p>
              )}
              <div className="post-actions">
                <button type="button" className={`vote${voted ? ' on' : ''}`} aria-pressed={voted} onClick={() => setVotes((v) => ({ ...v, [p.id]: !v[p.id] }))}>
                  <Icon name="thumb" size={14} /> {p.upvotes + (voted ? 1 : 0)}
                </button>
                <button type="button" className={`vote${didHelp ? ' on' : ''}`} aria-pressed={didHelp} onClick={() => setHelped((h) => ({ ...h, [p.id]: !h[p.id] }))}>
                  <Icon name="check" size={14} /> Helped me decide · {p.helped + (didHelp ? 1 : 0)}
                </button>
                <span className="muted small">Experience, not official advice</span>
              </div>
              <CommentThread threadId={`post-${p.id}`} seed={p.replies ?? []} startOpen={(p.replies?.length ?? 0) > 0} placeholder="Ask or share something…" />
            </article>
          );
        })}
        {!posts.length && <p className="empty">No stories match these filters yet.</p>}
      </div>
    </section>
  );
}
