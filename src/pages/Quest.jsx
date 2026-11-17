// "Major Quest" — a game-style questionnaire. One question per screen, big
// tappable option cards, an XP bar with level-up feedback, and slide
// transitions. Produces the SAME profile shape the matching engine expects, so
// the deterministic engine is untouched.

import { useMemo, useState } from 'react';
import {
  interestOptions,
  strengthOptions,
  workStyleOptions,
  careerFieldOptions,
  priorityOptions,
} from '../data/majors.js';

const STATUS = [
  { id: 'undeclared', label: 'Undeclared / exploring', emoji: '🧭' },
  { id: 'changing', label: 'Thinking about changing majors', emoji: '🔄' },
];
const YEARS = [
  { id: 'First year', label: 'First year', emoji: '🌱' },
  { id: 'Second year', label: 'Second year', emoji: '🌿' },
  { id: 'Third year', label: 'Third year', emoji: '🌳' },
  { id: 'Fourth year or beyond', label: 'Fourth year+', emoji: '🎓' },
  { id: 'Prefer not to say', label: 'Prefer not to say', emoji: '🤫' },
];

// Each quest "stage" maps to one or more profile fields. `multi` = chips you
// can pick several of; otherwise single-select. `min` enforces a soft minimum.
const STAGES = [
  {
    key: 'status', field: 'status', type: 'single', optional: true,
    title: 'Where are you right now?', hint: 'This helps us frame your results.',
    options: STATUS, xp: 10,
  },
  {
    key: 'year', field: 'year', type: 'single', optional: true,
    title: 'Which year are you in?', hint: 'Optional — pick the closest.',
    options: YEARS, xp: 10,
  },
  {
    key: 'interests', field: 'interests', type: 'multi', min: 1,
    title: 'What do you enjoy?', hint: 'Pick everything that sparks your curiosity. This matters most (35%).',
    options: interestOptions, xp: 25,
  },
  {
    key: 'dislikes', field: 'dislikes', type: 'multi', optional: true,
    title: "What are your don'ts?", hint: "The most decisive question. Majors that lean on these drop by a capped amount — never hidden. Pick honestly.",
    options: interestOptions, xp: 15,
  },
  {
    key: 'strengths', field: 'strengths', type: 'multi', optional: true,
    title: 'What are you good at?', hint: 'Optional. Pick your real strengths.',
    options: strengthOptions, xp: 20,
  },
  {
    key: 'workStyles', field: 'workStyles', type: 'multi', optional: true,
    title: 'How do you like to work?', hint: 'Optional. Choose any that fit.',
    options: workStyleOptions, xp: 15,
  },
  {
    key: 'careerFields', field: 'careerFields', type: 'multi', optional: true,
    title: 'Which career worlds pull you in?', hint: 'Optional.',
    options: careerFieldOptions, xp: 20,
  },
  {
    key: 'priority', field: 'priority', type: 'single', optional: true,
    title: 'What matters most right now?', hint: 'Optional. Pick one.',
    options: priorityOptions, xp: 15,
  },
];

const TOTAL_XP = STAGES.reduce((s, x) => s + x.xp, 0);

const emptyProfile = {
  status: '', currentMajor: '', year: '',
  interests: [], dislikes: [], strengths: [], workStyles: [], careerFields: [], priority: '',
};

// A saved profile may carry extra keys (e.g. a thinking snapshot); fill any
// missing questionnaire fields so the stages always have arrays to read.
function withDefaults(p) {
  return p ? { ...emptyProfile, ...p } : emptyProfile;
}

export default function Quest({ initialProfile, onComplete, onExit }) {
  const [i, setI] = useState(0);
  const [profile, setProfile] = useState(() => withDefaults(initialProfile));
  const [dir, setDir] = useState('fwd');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [awarded, setAwarded] = useState(() => new Set());

  const stage = STAGES[i];
  const value = profile[stage.field];
  const isMulti = stage.type === 'multi';

  // XP earned so far = sum of xp for stages that are satisfied.
  const earnedXp = useMemo(() => {
    return STAGES.reduce((sum, st) => {
      const v = profile[st.field];
      const answered = Array.isArray(v) ? v.length > 0 : Boolean(v);
      return sum + (answered ? st.xp : 0);
    }, 0);
  }, [profile]);

  const xpPct = Math.round((earnedXp / TOTAL_XP) * 100);
  const level = 1 + Math.floor(earnedXp / 40);

  function pick(id) {
    setError('');
    setProfile((p) => {
      if (isMulti) {
        const arr = p[stage.field];
        const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
        return { ...p, [stage.field]: next };
      }
      return { ...p, [stage.field]: p[stage.field] === id ? '' : id };
    });
  }

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1100);
  }

  function next() {
    const answered = isMulti ? value.length > 0 : Boolean(value);
    if (stage.min && isMulti && value.length < stage.min) {
      setError(`Pick at least ${stage.min} to continue.`);
      return;
    }
    if (answered && !awarded.has(stage.key)) {
      flash(`+${stage.xp} XP`);
      setAwarded((prev) => new Set(prev).add(stage.key));
    }
    if (i < STAGES.length - 1) {
      setDir('fwd');
      setI((n) => n + 1);
    } else {
      onComplete(profile);
    }
  }

  function back() {
    setError('');
    if (i === 0) {
      onExit?.();
      return;
    }
    setDir('back');
    setI((n) => n - 1);
  }

  const selectedCount = isMulti ? value.length : value ? 1 : 0;

  return (
    <section className="quest" aria-labelledby="quest-title">
      {/* HUD */}
      <div className="quest-hud">
        <div className="hud-left">
          <span className="level-chip">LV {level}</span>
          <div className="xp-wrap" aria-label={`Experience ${xpPct} percent`}>
            <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpPct}%` }} /></div>
            <span className="xp-text">{earnedXp} / {TOTAL_XP} XP</span>
          </div>
        </div>
        <span className="quest-count">Quest {i + 1} / {STAGES.length}</span>
      </div>

      {toast && <div className="xp-toast" role="status">{toast}</div>}

      <div className={`quest-card ${dir === 'fwd' ? 'slide-fwd' : 'slide-back'}`} key={stage.key}>
        <h2 id="quest-title">{stage.title}</h2>
        <p className="quest-hint">{stage.hint}</p>

        <div className="option-grid" role="group" aria-label={stage.title}>
          {stage.options.map((opt) => {
            const selected = isMulti ? value.includes(opt.id) : value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`option-card${selected ? ' selected' : ''}`}
                aria-pressed={selected}
                onClick={() => pick(opt.id)}
              >
                {opt.emoji && <span className="option-emoji" aria-hidden="true">{opt.emoji}</span>}
                <span className="option-label">{opt.label}</span>
                {opt.hint && <span className="option-sub">{opt.hint}</span>}
                <span className="option-check" aria-hidden="true">{selected ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>

        {/* Optional free text only on the first stage, kept minimal. */}
        {stage.key === 'status' && (
          <div className="field quest-field">
            <label htmlFor="cur-major">Current major (optional)</label>
            <input
              id="cur-major"
              type="text"
              value={profile.currentMajor}
              placeholder="e.g. Undeclared, or a major you're reconsidering"
              onChange={(e) => setProfile((p) => ({ ...p, currentMajor: e.target.value }))}
            />
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}
      </div>

      <div className="quest-nav">
        <button type="button" className="secondary-button" onClick={back}>
          {i === 0 ? '← Hub' : '← Back'}
        </button>
        <span className="quest-selected">
          {selectedCount > 0 ? `${selectedCount} selected` : stage.optional ? 'Optional — skip if you like' : 'Make a pick'}
        </span>
        <button type="button" className="primary" onClick={next}>
          {i === STAGES.length - 1 ? 'Reveal my matches →' : 'Next →'}
        </button>
      </div>
    </section>
  );
}
