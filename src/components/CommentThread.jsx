// Collapsible comment thread with a composer. Students can post (optionally
// with a display name), like comments and delete their own. Session only.

import { useState } from 'react';
import { useThread, addComment, toggleLike, removeComment } from '../lib/comments.js';
import { ROLES } from '../data/alumniPosts.js';
import Icon from './Icon.jsx';
import { track } from '../lib/events.js';

let lastName = '';

export default function CommentThread({ threadId, seed = [], startOpen = false, placeholder = 'Add a comment…' }) {
  const comments = useThread(threadId, seed);
  const [open, setOpen] = useState(startOpen);
  const [text, setText] = useState('');
  const [name, setName] = useState(lastName);

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    lastName = name;
    addComment(threadId, { author: name, body: text });
    track('comment');
    setText('');
  }

  return (
    <div className="cthread">
      <button type="button" className={`cthread-toggle${open ? ' on' : ''}`} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Icon name="message" size={14} />
        {comments.length ? `${comments.length} comment${comments.length > 1 ? 's' : ''}` : 'Comment'}
        <span className="cthread-chev" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="cthread-body">
          {comments.length > 0 && (
            <ul className="comments">
              {comments.map((c) => {
                const role = ROLES[c.role] ?? ROLES.student;
                return (
                  <li key={c.id} className={`comment${c.mine ? ' mine' : ''}`}>
                    <span className={`avatar-xs tone-${role.tone}`} aria-hidden="true">{c.author.slice(0, 1).toUpperCase()}</span>
                    <div className="comment-main">
                      <div className="comment-head">
                        <b>{c.author}</b>
                        <span className={`role-badge tone-${role.tone}`}>{c.mine ? 'You' : role.label}</span>
                        {c.at && <small>just now</small>}
                      </div>
                      <p>{c.body}</p>
                      <div className="comment-actions">
                        <button type="button" className={`clike${c.liked ? ' on' : ''}`} aria-pressed={c.liked} onClick={() => toggleLike(threadId, c.id)}>
                          <Icon name="thumb" size={12} /> {c.likes || ''}
                        </button>
                        {c.mine && <button type="button" className="cdel" onClick={() => removeComment(threadId, c.id)}>Delete</button>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <form className="composer" onSubmit={submit}>
            <input className="composer-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" maxLength={40} aria-label="Display name (optional)" />
            <div className="composer-row">
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} maxLength={600} aria-label="Write a comment" />
              <button type="submit" className="btn-round sm" disabled={!text.trim()} aria-label="Post comment"><Icon name="send" size={14} /></button>
            </div>
          </form>
          <small className="cthread-note">Visible this session only · be kind · not official advice</small>
        </div>
      )}
    </div>
  );
}
