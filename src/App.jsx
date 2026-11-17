// Application shell. Lightweight view-state navigation (no router dependency,
// to keep the prototype small). Holds the student profile and current view.

import { useEffect, useRef, useState } from 'react';
import Home from './pages/Home.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Results from './pages/Results.jsx';
import MajorDetail from './pages/MajorDetail.jsx';
import Compare from './pages/Compare.jsx';
import AdvisingSummary from './pages/AdvisingSummary.jsx';

const VIEWS = {
  HOME: 'home',
  QUESTIONNAIRE: 'questionnaire',
  RESULTS: 'results',
  DETAIL: 'detail',
  COMPARE: 'compare',
  SUMMARY: 'summary',
};

export default function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [profile, setProfile] = useState(null);
  const [activeMajorId, setActiveMajorId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [topScored, setTopScored] = useState([]);
  const mainRef = useRef(null);

  // Move focus to the top of the main region on view change (accessibility).
  useEffect(() => {
    mainRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [view]);

  function goResults(p) {
    setProfile(p);
    setView(VIEWS.RESULTS);
  }

  return (
    <div className="app-wrap">
      <a href="#main" className="skip-link">Skip to main content</a>
      <nav className="topbar" aria-label="Primary">
        <button type="button" className="brand" onClick={() => setView(VIEWS.HOME)}>
          <span className="brand-mark" aria-hidden="true">●</span> ISU Major &amp; Learning-Community Matcher
        </button>
        <span className="demo-banner" title="This prototype uses synthetic input and illustrative data.">
          Demo data
        </span>
      </nav>

      <main id="main" className="page" ref={mainRef} tabIndex={-1}>
        {view === VIEWS.HOME && <Home onStart={() => setView(VIEWS.QUESTIONNAIRE)} />}

        {view === VIEWS.QUESTIONNAIRE && (
          <Questionnaire
            initialProfile={profile}
            onComplete={goResults}
            onBack={() => setView(VIEWS.HOME)}
          />
        )}

        {view === VIEWS.RESULTS && profile && (
          <Results
            profile={profile}
            onOpenDetail={(id) => {
              setActiveMajorId(id);
              setView(VIEWS.DETAIL);
            }}
            onCompare={(ids) => {
              setCompareIds(ids);
              setView(VIEWS.COMPARE);
            }}
            onSummary={(top) => {
              setTopScored(top);
              setView(VIEWS.SUMMARY);
            }}
            onRestart={() => {
              setProfile(null);
              setView(VIEWS.QUESTIONNAIRE);
            }}
          />
        )}

        {view === VIEWS.DETAIL && profile && (
          <MajorDetail
            majorId={activeMajorId}
            profile={profile}
            onBack={() => setView(VIEWS.RESULTS)}
          />
        )}

        {view === VIEWS.COMPARE && profile && (
          <Compare majorIds={compareIds} profile={profile} onBack={() => setView(VIEWS.RESULTS)} />
        )}

        {view === VIEWS.SUMMARY && profile && (
          <AdvisingSummary
            topScored={topScored}
            profile={profile}
            onBack={() => setView(VIEWS.RESULTS)}
          />
        )}
      </main>

      <footer className="app-footer">
        Hackathon prototype. Informational guidance only — not official ISU advising, not a degree
        audit, and not a validated predictor of success. Verify all academic details with official
        ISU sources and an academic advisor.
      </footer>
    </div>
  );
}
