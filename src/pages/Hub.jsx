// The hub as a game: a role pick ("choose your path"), then a mission map.
// Minimal text. Big nodes. Progress, XP and an archetype carry the story.

import { majors } from '../data/majors.js';
import { catalog } from '../data/catalog.js';
import Icon from '../components/Icon.jsx';
import { MISSIONS, archetypeFor, missionState } from '../lib/progress.js';
import { useCountUp } from '../lib/useCountUp.js';
import { ACHIEVEMENTS } from '../lib/achievements.js';

function HeroStat({ value, label }) {
  const n = useCountUp(value, 1200);
  return <div className="hero-stat"><b>{n}</b><span>{label}</span></div>;
}

export function RolePicker({ onPick }) {
  return (
    <section className="rolepick" aria-labelledby="role-heading">
      <div className="orb-hero" aria-hidden="true"><span className="orb-ring" /><span className="orb-ring d2" /><span className="orb-core">◆</span></div>
      <span className="eyebrow-plain">ISU FitFinder</span>
      <h1 id="role-heading">Choose your path</h1>
      <div className="role-grid">
        <button type="button" className="role-card reveal" onClick={() => onPick('student')}>
          <span className="role-icon"><Icon name="grad" size={28} /></span>
          <span className="role-title">Student</span>
          <span className="role-blurb">Find your major</span>
        </button>
        <button type="button" className="role-card alt reveal" style={{ '--delay': '100ms' }} onClick={() => onPick('advisor')}>
          <span className="role-icon"><Icon name="users" size={28} /></span>
          <span className="role-title">Advisor</span>
          <span className="role-blurb">See the trends</span>
        </button>
      </div>
      <p className="disclaimer-plain">Prototype · synthetic data · no sign-in · not official ISU advising</p>
    </section>
  );
}

export default function Hub({ role, profile, topScored, recent = [], visited = [], unlocked = [], go }) {
  const state = missionState(profile, visited);
  const arch = archetypeFor(profile);
  const first = topScored?.[0];

  if (role === 'advisor') {
    return (
      <section className="hub" aria-labelledby="hub-heading">
        <header className="pagehead">
          <span className="eyebrow-plain">Command center</span>
          <h1 id="hub-heading">What students are exploring</h1>
        </header>
        <div className="mission-grid adv">
          {[
            { view: 'advisor', icon: 'chart', title: 'Trends', sub: 'Demand & don\'ts' },
            { view: 'ask', icon: 'message', title: 'Questions', sub: 'What students ask' },
            { view: 'catalog', icon: 'layers', title: 'Catalog', sub: `${catalog.length} majors` },
            { view: 'communities', icon: 'book', title: 'Communities', sub: 'Verified refs' },
            { view: 'alumni', icon: 'users', title: 'Stories', sub: 'Alumni network' },
            { view: 'quest', icon: 'compass', title: 'Preview', sub: 'The student quest' },
          ].map((m, i) => (
            <button key={m.view} type="button" className="mission reveal" style={{ '--delay': `${i * 70}ms` }} onClick={() => go(m.view)}>
              <span className="mission-node"><Icon name={m.icon} size={26} /></span>
              <span className="mission-title">{m.title}</span>
              <span className="mission-sub">{m.sub}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="hub" aria-labelledby="hub-heading">
      <div className="hero-card reveal">
        <div className="hero-left">
          <span className="eyebrow-plain">{state.hasProfile ? `Level ${state.level} · ${state.levelName}` : 'New quest'}</span>
          <h1 id="hub-heading">{state.hasProfile ? <><span className="arch-emoji" aria-hidden="true">{arch.emoji}</span> {arch.name}</> : 'Find your major'}</h1>
          <p className="hero-sub">
            {state.hasProfile && first
              ? <>Top match: <b>{first.name}</b></>
              : <>Two minutes. Your likes, your don'ts, your matches.</>}
          </p>
          <div className="hero-actions">
            {state.next ? (
              <button type="button" className="btn-glow" onClick={() => go(state.next.view)}>
                {state.hasProfile ? `Next: ${state.next.title}` : 'Begin'} <span className="go"><Icon name="arrow" size={15} /></span>
              </button>
            ) : (
              <button type="button" className="btn-glow" onClick={() => go('summary')}>Advising summary <span className="go"><Icon name="arrow" size={15} /></span></button>
            )}
            {state.hasProfile && <button type="button" className="btn-ghost" onClick={() => go('results')}>My matches</button>}
          </div>
          <div className="hero-stats">
            <HeroStat value={catalog.length} label="ISU majors" />
            <HeroStat value={majors.length} label="Scored" />
            <HeroStat value={MISSIONS.filter((m) => state.done[m.id]).length} label={`of ${MISSIONS.length} missions`} />
          </div>
        </div>
        <div className="hero-right" aria-hidden="true">
          <div className="orb-hero small"><span className="orb-ring" /><span className="orb-ring d2" /><span className="orb-core">{state.hasProfile ? arch.emoji : '🧭'}</span></div>
        </div>
      </div>

      <div className="xp-strip" aria-label={`${state.xp} of ${state.total} XP`}>
        <span className="xp-label">XP</span>
        <span className="xp-track"><span className="xp-fill" style={{ width: `${(state.xp / state.total) * 100}%` }} /></span>
        <span className="xp-num">{state.xp} / {state.total}</span>
      </div>

      <ol className="mission-grid" aria-label="Missions">
        {MISSIONS.map((m, i) => {
          const done = state.done[m.id];
          const locked = m.needsProfile && !state.hasProfile;
          const isNext = state.next?.id === m.id;
          return (
            <li key={m.id}>
              <button
                type="button"
                className={`mission reveal${done ? ' done' : ''}${isNext ? ' next' : ''}${locked ? ' locked' : ''}`}
                style={{ '--delay': `${i * 70}ms` }}
                onClick={() => !locked && go(m.view)}
                disabled={locked}
                aria-label={`${m.title}: ${m.sub}${done ? ', complete' : locked ? ', locked' : ''}`}
              >
                <span className="mission-step">{i + 1}</span>
                <span className="mission-node"><Icon name={done ? 'check' : locked ? 'shield' : m.icon} size={26} /></span>
                <span className="mission-title">{m.title}</span>
                <span className="mission-sub">{m.sub}</span>
                <span className="mission-xp">{done ? '✓' : `+${m.xp} XP`}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="badges" aria-label="Achievements">
        <div className="badges-head"><b>Achievements</b><span className="badge">{unlocked.length} / {ACHIEVEMENTS.length}</span></div>
        <ul>
          {ACHIEVEMENTS.map((a, i) => {
            const on = unlocked.includes(a.id);
            return (
              <li key={a.id} className={`ach${on ? ' on' : ''} reveal`} style={{ '--delay': `${i * 40}ms` }} title={`${a.name} — ${on ? 'unlocked' : a.how}`}>
                <span className="ach-icon" aria-hidden="true">{on ? a.emoji : '🔒'}</span>
                <span className="ach-name">{a.name}</span>
                <span className="sr-only">{on ? 'unlocked' : `locked: ${a.how}`}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="hub-row solo">
        <div className="recent-strip reveal">
          <small>Recent</small>
          {recent.length ? recent.slice(0, 4).map((r) => {
            const m = majors.find((x) => x.id === r.id);
            return m ? <button key={r.id} type="button" className="gchip" onClick={() => go('detail', r.id)}>{m.name}</button> : null;
          }) : <span className="muted small">Majors you open appear here</span>}
        </div>
      </div>
    </section>
  );
}
