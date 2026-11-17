// Application shell: a hub with a persistent sidebar (tabs), a Student /
// Advisor role switch (no login — the role only changes which tools show), a
// light/dark theme, and lightweight view-state navigation (no router).
//
// Student flow: Hub → Quest → Matching → Results → Detail / Compare / Summary,
// plus tabs for Thinking Worlds, Learning Communities, Alumni Network, Ask & prep.
// Advisor flow: Hub → Trends dashboard, Ask (common questions), Communities, Alumni.
//
// The synthetic profile, role, theme and recently viewed majors persist in
// localStorage so every tab works after a reload. Nothing leaves the browser.

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
import { burstConfetti } from './lib/confetti.js';
import { load, save, clearAll } from './lib/storage.js';

const NAV = {
  student: [
    { id: 'hub', label: 'Hub', icon: 'home' },
    { id: 'quest', label: 'Major Quest', icon: 'compass' },
    { id: 'results', label: 'My results', icon: 'chart', needsProfile: true },
    { id: 'worlds', label: 'Thinking Worlds', icon: 'bolt' },
    { id: 'catalog', label: 'Browse all majors', icon: 'layers' },
    { id: 'communities', label: 'Learning communities', icon: 'book' },
    { id: 'alumni', label: 'Alumni network', icon: 'users' },
    { id: 'ask', label: 'Ask & prep', icon: 'message' },
    { id: 'summary', label: 'Advising summary', icon: 'print', needsProfile: true },
  ],
  advisor: [
    { id: 'hub', label: 'Hub', icon: 'home' },
    { id: 'advisor', label: 'Trends dashboard', icon: 'chart' },
    { id: 'ask', label: 'Student questions', icon: 'message' },
    { id: 'catalog', label: 'Browse all majors', icon: 'layers' },
    { id: 'communities', label: 'Learning communities', icon: 'book' },
    { id: 'alumni', label: 'Alumni network', icon: 'users' },
    { id: 'quest', label: 'Student quest (preview)', icon: 'compass' },
  ],
};

// Which nav item a view belongs to (for highlighting sub-views).
const NAV_PARENT = { matching: 'results', detail: 'results', compare: 'results' };

export default function App() {
  const [role, setRole] = useState(() => load('role', null));
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const [view, setView] = useState('hub');
  const [profile, setProfile] = useState(() => load('profile', null));
  const [activeMajorId, setActiveMajorId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [recent, setRecent] = useState(() => load('recent', []));
  const mainRef = useRef(null);

  const topScored = useMemo(() => (profile ? matchMajors(profile) : []), [profile]);
  const topIds = topScored.slice(0, 3).map((m) => m.id);

  useEffect(() => { save('role', role); }, [role]);
  useEffect(() => { save('profile', profile); }, [profile]);
  useEffect(() => { save('recent', recent); }, [recent]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save('theme', theme);
  }, [theme]);

  // Move focus to the main region and scroll up on view change (a11y).
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [view]);

  useEffect(() => {
    if (view === 'results' && profile) burstConfetti();
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
    setProfile(null);
    setRecent([]);
    setCompareIds([]);
    setRole(null);
    setView('hub');
  }

  const nav = NAV[role] ?? NAV.student;
  const activeNav = NAV_PARENT[view] ?? view;

  return (
    <div className={`hub-shell${role ? '' : ' no-side'}`}>
      <a href="#main" className="skip-link">Skip to main content</a>

      {role && (
        <aside className="side" aria-label="Hub navigation">
          <button type="button" className="brand" onClick={() => setView('hub')}>
            <span className="brand-mark" aria-hidden="true">◆</span>
            <span><b>ISU FitFinder</b><small>Major &amp; community hub</small></span>
          </button>

          <div className="role-seg" role="group" aria-label="View as">
            <button type="button" className={role === 'student' ? 'on' : ''} aria-pressed={role === 'student'} onClick={() => { setRole('student'); setView('hub'); }}>
              <Icon name="grad" size={15} /> Student
            </button>
            <button type="button" className={role === 'advisor' ? 'on' : ''} aria-pressed={role === 'advisor'} onClick={() => { setRole('advisor'); setView('hub'); }}>
              <Icon name="users" size={15} /> Advisor
            </button>
          </div>

          <nav className="sidenav">
            {nav.map((n) => {
              const disabled = n.needsProfile && !profile;
              return (
                <button
                  key={n.id}
                  type="button"
                  className={activeNav === n.id ? 'on' : ''}
                  aria-current={activeNav === n.id ? 'page' : undefined}
                  onClick={() => go(n.id)}
                  title={disabled ? 'Complete the quest first' : undefined}
                >
                  <Icon name={n.icon} size={17} />
                  <span>{n.label}</span>
                  {disabled && <span className="chip-mini tone-neutral">quest</span>}
                </button>
              );
            })}
          </nav>

          <div className="sidefoot">
            <div className="themepick" aria-label="Appearance">
              <button type="button" className={theme === 'light' ? 'on' : ''} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}><Icon name="sun" size={14} /> Light</button>
              <button type="button" className={theme === 'dark' ? 'on' : ''} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}><Icon name="moon" size={14} /> Dark</button>
            </div>
            <span className="demo-banner" title="Synthetic input and illustrative data only.">Demo data</span>
            <button type="button" className="textbtn danger" onClick={resetDemo}><Icon name="refresh" size={13} /> Reset demo</button>
          </div>
        </aside>
      )}

      <main id="main" className={`page${role ? '' : ' wide'}`} ref={mainRef} tabIndex={-1}>
        {!role && <RolePicker onPick={(r) => { setRole(r); setView('hub'); }} />}

        {role && view === 'hub' && (
          <Hub role={role} profile={profile} topScored={topScored} recent={recent} go={go} />
        )}

        {role && view === 'quest' && (
          <Quest
            initialProfile={profile}
            onComplete={(p) => { setProfile({ ...p, thinking: profile?.thinking ?? null }); setView('matching'); }}
            onExit={() => setView('hub')}
          />
        )}

        {role && view === 'worlds' && (
          <Worlds
            onComplete={(snapshot) => { setProfile((p) => ({ ...(p ?? emptyProfile()), thinking: snapshot })); setView(profile?.interests?.length ? 'results' : 'hub'); }}
            onExit={() => setView('hub')}
          />
        )}

        {role && view === 'matching' && profile && <Matching onDone={() => setView('results')} />}

        {role && view === 'results' && profile && (
          <Results
            profile={profile}
            onOpenDetail={(id) => go('detail', id)}
            onCompare={(ids) => go('compare', ids)}
            onSummary={() => setView('summary')}
            onRestart={() => setView('quest')}
            onPlayWorlds={() => setView('worlds')}
            onBrowse={() => setView('catalog')}
          />
        )}

        {role && view === 'catalog' && (
          <Catalog onOpenScored={(id) => go('detail', id)} />
        )}

        {role && view === 'detail' && (
          <MajorDetail
            majorId={activeMajorId}
            profile={profile ?? emptyProfile()}
            hasProfile={Boolean(profile?.interests?.length)}
            onBack={() => setView(profile?.interests?.length ? 'results' : 'catalog')}
          />
        )}

        {role && view === 'compare' && profile && (
          <Compare majorIds={compareIds} profile={profile} onBack={() => setView('results')} />
        )}

        {role && view === 'summary' && profile && (
          <AdvisingSummary topScored={topScored.slice(0, 3)} profile={profile} onBack={() => setView('results')} />
        )}

        {role && view === 'communities' && <Communities topIds={topIds} onOpenMajor={(id) => go('detail', id)} />}
        {role && view === 'alumni' && <Alumni profile={profile} topIds={topIds} />}
        {role && view === 'ask' && <Ask profile={profile} topScored={topScored.slice(0, 3)} role={role} onStartQuest={() => setView('quest')} />}
        {role && view === 'advisor' && <AdvisorDashboard go={go} />}

        <footer className="app-footer">
          Hackathon prototype. Informational guidance only — not official ISU advising, not a degree audit,
          and not a validated predictor of success. Alumni stories and advisor data are synthetic. Verify all
          academic details with official ISU sources and an academic advisor.
        </footer>
      </main>
    </div>
  );
}

function emptyProfile() {
  return { status: '', currentMajor: '', year: '', interests: [], dislikes: [], strengths: [], workStyles: [], careerFields: [], priority: '', thinking: null };
}
