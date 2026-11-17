// Application shell — game HUD edition.
// Top HUD (brand, level/XP, archetype, role + theme), an icon rail on the left
// (bottom dock on phones), and a stage for the current view. No login; the
// role only changes which tools are shown. Only the role and theme persist;
// results, scores and history live in this session only and are never stored.

import { useEffect, useMemo, useRef, useState } from 'react';
import Hub, { RolePicker } from './pages/Hub.jsx';
import Quest from './pages/Quest.jsx';
import Worlds from './pages/Worlds.jsx';
import Matching from './pages/Matching.jsx';
import Results from './pages/Results.jsx';
import MajorDetail from './pages/MajorDetail.jsx';
import Compare from './pages/Compare.jsx';
import AdvisingSummary from './pages/AdvisingSummary.jsx';
import Communities from './pages/Communities.jsx';
import Alumni from './pages/Alumni.jsx';
import Ask from './pages/Ask.jsx';
import AdvisorDashboard from './pages/AdvisorDashboard.jsx';
import Catalog from './pages/Catalog.jsx';
import Icon from './components/Icon.jsx';
import { matchMajors } from './lib/matcher.js';
import { load, save, clearAll } from './lib/storage.js';
import { archetypeFor, missionState } from './lib/progress.js';
import { useCardFx } from './lib/useCardFx.js';
import { useCounts } from './lib/events.js';
import { unlockedIds } from './lib/achievements.js';
import AchievementToast from './components/AchievementToast.jsx';

const NAV = {
  student: [
    { id: 'hub', label: 'Map', icon: 'home' },
    { id: 'worlds', label: 'Level 1', icon: 'bolt' },
    { id: 'quest', label: 'Level 2', icon: 'compass' },
    { id: 'results', label: 'Matches', icon: 'sparkle', needsProfile: true },
    { id: 'catalog', label: 'Majors', icon: 'layers' },
    { id: 'communities', label: 'Belong', icon: 'book' },
    { id: 'alumni', label: 'Alumni', icon: 'users' },
    { id: 'ask', label: 'Prep', icon: 'flag' },
    { id: 'summary', label: 'Recap', icon: 'print', needsProfile: true },
  ],
  advisor: [
    { id: 'hub', label: 'Center', icon: 'home' },
    { id: 'advisor', label: 'Trends', icon: 'chart' },
    { id: 'ask', label: 'Questions', icon: 'message' },
    { id: 'catalog', label: 'Majors', icon: 'layers' },
    { id: 'communities', label: 'Belong', icon: 'book' },
    { id: 'alumni', label: 'Alumni', icon: 'users' },
    { id: 'quest', label: 'Preview', icon: 'compass' },
  ],
};
const NAV_PARENT = { matching: 'results', detail: 'results', compare: 'results' };

export default function App() {
  // ?role=student|advisor deep-links straight into a view (handy for demos).
  const [role, setRole] = useState(() => new URLSearchParams(location.search).get('role') || load('role', null));
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const [aptitude, setAptitude] = useState(null); // Level 1 snapshot, session only
  const [aptSkipped, setAptSkipped] = useState(false);
  const [view, setView] = useState(() => new URLSearchParams(location.search).get('view') || 'hub');
  // Session only — never stored. `?demo` loads the fictional demo student "Jordan".
  const [profile, setProfile] = useState(() => (new URLSearchParams(location.search).has('demo') ? DEMO_PROFILE : null));
  const [activeMajorId, setActiveMajorId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [recent, setRecent] = useState([]); // session only
  const [visited, setVisited] = useState([]); // session only
  const mainRef = useRef(null);
  useCardFx();
  const counts = useCounts();

  const topScored = useMemo(() => (profile ? matchMajors(profile) : []), [profile]);
  const topIds = topScored.slice(0, 3).map((m) => m.id);
  const state = missionState(profile ? profile : aptitude ? { thinking: aptitude } : null, visited);
  const arch = archetypeFor(profile);

  // Purge results/history saved by earlier versions; nothing score-related is kept.
  useEffect(() => { ['profile', 'recent', 'visited'].forEach((k) => save(k, null)); }, []);
  useEffect(() => { save('role', role); }, [role]);
  useEffect(() => { document.documentElement.dataset.theme = theme; save('theme-v2', theme); }, [theme]);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    if (view !== 'hub' && !visited.includes(view)) setVisited((v) => [...v, view]);
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps


  function go(next, payload) {
    if (next === 'detail' && payload) {
      setActiveMajorId(payload);
      setRecent((r) => [{ id: payload, at: Date.now() }, ...r.filter((x) => x.id !== payload)].slice(0, 5));
    }
    if (next === 'compare' && payload) setCompareIds(payload);
    if ((next === 'results' || next === 'summary') && !profile) next = 'quest';
    setView(next);
  }

  function resetDemo() {
    clearAll();
    setProfile(null); setAptitude(null); setAptSkipped(false); setRecent([]); setVisited([]); setCompareIds([]); setRole(null); setView('hub');
  }

  const nav = NAV[role] ?? NAV.student;
  const inAptitude = view === 'quest' && role === 'student' && !profile?.interests?.length && !aptitude && !aptSkipped;
  const activeNav = inAptitude ? 'worlds' : NAV_PARENT[view] ?? view;
  const hasProfile = Boolean(profile?.interests?.length);
  const unlocked = unlockedIds({ profile: profile ?? (aptitude ? { thinking: aptitude } : null), visited, counts, recentCount: recent.length });

  const railButtons = nav.map((n) => {
    const disabled = n.needsProfile && !hasProfile;
    return (
      <button key={n.id} type="button" className={activeNav === n.id ? 'on' : ''} aria-current={activeNav === n.id ? 'page' : undefined} onClick={() => go(n.id)} disabled={disabled} aria-label={n.label} title={disabled ? `${n.label} · finish the quest first` : n.label}>
        <Icon name={n.icon} size={20} />
        <span className="rail-label">{n.label}</span>
      </button>
    );
  });

  return (
    <div className={`shell${role ? '' : ' no-rail'}`}>
      <div className="bg-fx" aria-hidden="true"><span className="blob b1" /><span className="blob b2" /><span className="blob b3" />{Array.from({ length: 22 }, (_, i) => <i key={i} className="spark" style={{ '--x': `${(i * 47) % 100}%`, '--d': `${8 + (i % 7) * 2}s`, '--delay': `${-(i * 1.3)}s`, '--s': `${2 + (i % 3)}px` }} />)}</div>
      <a href="#main" className="skip-link">Skip to main content</a>

      {role && (
        <header className="hud">
          <button type="button" className="brand" onClick={() => setView('hub')}>
            <span className="brand-mark" aria-hidden="true">◆</span><b>HelloMajor</b>
          </button>

          {role === 'student' && (
            <div className="hud-stats">
              <span className="lvl" title={state.levelName}>LV {state.level}</span>
              <span className="xp-track hud" aria-label={`${state.xp} of ${state.total} XP`}><span className="xp-fill" style={{ width: `${(state.xp / state.total) * 100}%` }} /></span>
              <span className="arch" title="Your archetype — for fun, never used in scoring"><span aria-hidden="true">{arch.emoji}</span> {arch.name}</span>
            </div>
          )}

          <div className="hud-right">
            <div className="role-seg" role="group" aria-label="View as">
              <button type="button" className={role === 'student' ? 'on' : ''} aria-pressed={role === 'student'} onClick={() => { setRole('student'); setView('hub'); }} title="Student view"><Icon name="grad" size={15} /><span>Student</span></button>
              <button type="button" className={role === 'advisor' ? 'on' : ''} aria-pressed={role === 'advisor'} onClick={() => { setRole('advisor'); setView('hub'); }} title="Advisor view"><Icon name="users" size={15} /><span>Advisor</span></button>
            </div>
            <button type="button" className="iconbtn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title="Theme"><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} /></button>
            <button type="button" className="iconbtn" onClick={resetDemo} aria-label="Reset demo" title="Reset demo"><Icon name="refresh" size={17} /></button>
          </div>
        </header>
      )}

      {role && <nav className="rail" aria-label="Sections">{railButtons}</nav>}

      <main id="main" className="stage" ref={mainRef} tabIndex={-1}>
        {!role && <RolePicker onPick={(r) => { setRole(r); setView('hub'); }} />}
        {role && view === 'hub' && <Hub role={role} profile={profile} topScored={topScored} recent={recent} visited={visited} unlocked={unlocked} go={go} />}
        {role && view === 'quest' && role === 'student' && !hasProfile && !aptitude && !aptSkipped && (
          <Worlds onComplete={(snap) => setAptitude(snap)} onSkip={() => setAptSkipped(true)} onExit={() => setView('hub')} />
        )}
        {role && view === 'quest' && (role !== 'student' || hasProfile || aptitude || aptSkipped) && (
          <Quest initialProfile={profile} onComplete={(p) => { setProfile({ ...p, thinking: aptitude ?? profile?.thinking ?? null }); setView('matching'); }} onExit={() => setView('hub')} />
        )}
        {role && view === 'worlds' && (
          <Worlds
            onComplete={(snap) => {
              setAptitude(snap);
              if (hasProfile) { setProfile((p) => ({ ...p, thinking: snap })); setView('results'); } else setView('quest');
            }}
            onSkip={hasProfile ? undefined : () => { setAptSkipped(true); setView('quest'); }}
            onExit={() => setView('hub')}
          />
        )}
        {role && view === 'matching' && profile && <Matching profile={profile} onDone={() => setView('results')} />}
        {role && view === 'results' && profile && (
          <Results profile={profile} onOpenDetail={(id) => go('detail', id)} onCompare={(ids) => go('compare', ids)} onSummary={() => setView('summary')} onRestart={() => setView('quest')} onPlayWorlds={() => setView('worlds')} onBrowse={() => setView('catalog')} />
        )}
        {role && view === 'catalog' && <Catalog onOpenScored={(id) => go('detail', id)} />}
        {role && view === 'detail' && (
          <MajorDetail majorId={activeMajorId} profile={profile ?? emptyProfile()} hasProfile={hasProfile} onBack={() => setView(hasProfile ? 'results' : 'catalog')} />
        )}
        {role && view === 'compare' && profile && <Compare majorIds={compareIds} profile={profile} onBack={() => setView('results')} />}
        {role && view === 'summary' && profile && <AdvisingSummary topScored={topScored.slice(0, 3)} profile={profile} onBack={() => setView('results')} />}
        {role && view === 'communities' && <Communities topIds={topIds} onOpenMajor={(id) => go('detail', id)} />}
        {role && view === 'alumni' && <Alumni profile={profile} topIds={topIds} />}
        {role && view === 'ask' && <Ask profile={profile} topScored={topScored.slice(0, 3)} role={role} onStartQuest={() => setView('quest')} />}
        {role && view === 'advisor' && <AdvisorDashboard go={go} />}

        <footer className="app-footer">Prototype · informational guidance, not official ISU advising · synthetic stories and advisor data · verify with official ISU sources.</footer>
      </main>

      {role === 'student' && <AchievementToast unlocked={unlocked} />}
      {role && <nav className="dock" aria-label="Sections">{railButtons}</nav>}
    </div>
  );
}

const DEMO_PROFILE = {
  status: 'undeclared', currentMajor: '', year: 'Second year',
  interests: ['coding', 'math', 'building'], dislikes: ['health'],
  strengths: ['math', 'logic'], workStyles: ['analytical', 'technical'],
  careerFields: ['technology'], priority: 'career', thinking: null,
};

function emptyProfile() {
  return { status: '', currentMajor: '', year: '', interests: [], dislikes: [], strengths: [], workStyles: [], careerFields: [], priority: '', thinking: null };
}
