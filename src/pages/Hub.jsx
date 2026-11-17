// The hub: first a role pick (Student / Advisor), then a dashboard of tiles,
// stats, a recent timeline and short notes. No login — the role only changes
// which tools are shown. Everything is local and synthetic.

import { majors } from '../data/majors.js';
import { alumniPosts } from '../data/alumniPosts.js';
import Tile from '../components/Tile.jsx';
import StatTile from '../components/StatTile.jsx';
import Icon from '../components/Icon.jsx';

const ROLE_CARDS = [
  {
    id: 'student',
    icon: 'grad',
    title: "I'm a student",
    blurb: 'Undeclared or thinking about a change. Play the quest, see explainable matches, prep for advising.',
  },
  {
    id: 'advisor',
    icon: 'users',
    title: "I'm an advisor",
    blurb: 'See grouped interest trends, common don\'ts and questions, and prep cards for upcoming sessions.',
  },
];

export function RolePicker({ onPick }) {
  return (
    <section className="rolepick" aria-labelledby="role-heading">
      <div className="rolepick-hero">
        <span className="eyebrow-plain">ISU FitFinder · one hub, every tool</span>
        <h1 id="role-heading">Who's exploring today?</h1>
        <p className="lead-plain">
          A major &amp; learning-community matcher for current Iowa State students, with a transparent
          reason behind every recommendation. Pick a view to start. You can switch any time.
        </p>
      </div>
      <div className="role-grid">
        {ROLE_CARDS.map((r, i) => (
          <button key={r.id} type="button" className="role-card reveal" style={{ '--delay': `${i * 110}ms` }} onClick={() => onPick(r.id)}>
            <span className="role-icon"><Icon name={r.icon} size={26} /></span>
            <span className="role-title">{r.title}</span>
            <span className="role-blurb">{r.blurb}</span>
            <span className="btn-pill">Continue <span className="go"><Icon name="arrow" size={14} /></span></span>
          </button>
        ))}
      </div>
      <p className="disclaimer-plain">
        Hackathon prototype. No sign-in, no real records: everything runs in your browser on
        synthetic data. Not an official Iowa State University service.
      </p>
    </section>
  );
}

export default function Hub({ role, profile, topScored, recent = [], go }) {
  const hasResults = Boolean(profile && topScored?.length);
  const first = topScored?.[0];

  if (role === 'advisor') {
    return (
      <section className="hub" aria-labelledby="hub-heading">
        <header className="pagehead">
          <span className="eyebrow-plain">Advisor view · grouped, synthetic data</span>
          <h1 id="hub-heading">Advising hub</h1>
          <p>What students are exploring, what they want to avoid, and what they ask — so sessions start further along.</p>
        </header>
        <div className="tiles">
          <Tile icon="chart" title="Trends dashboard" blurb="Interest demand, common don'ts, status mix and top-recommended majors across recent sessions." chip="Live demo data" chipTone="gold" featured onClick={() => go('advisor')} delay={0} />
          <Tile icon="message" title="Questions students ask" blurb="The most common questions brought to advising, with a prepared, source-linked answer for each." onClick={() => go('ask')} delay={70} />
          <Tile icon="book" title="Learning communities" blurb="Every community reference we hold, its verification status, and the official directory." onClick={() => go('communities')} delay={140} />
          <Tile icon="users" title="Alumni network" blurb="Experience stories students read before a session: why I chose, a real week, I switched." onClick={() => go('alumni')} delay={210} />
          <Tile icon="compass" title="Walk the student quest" blurb="See exactly what a student sees, from the quest to the advising summary." onClick={() => go('quest')} delay={280} />
        </div>
      </section>
    );
  }

  return (
    <section className="hub" aria-labelledby="hub-heading">
      <header className="pagehead">
        <span className="eyebrow-plain">Student view · AWS Kiro Hackathon 2026 · Team 2</span>
        <h1 id="hub-heading">{hasResults ? 'Welcome back. Your matches are ready.' : 'Find a major that fits how you think.'}</h1>
        <p>
          {hasResults
            ? `Top match right now: ${first.name} (${first.fit}/100 overlap). Explore pathways, test your don'ts, and prep questions for your advisor.`
            : 'Play a two-minute quest, get transparent major matches, and see learning communities and real stories. No sign-in, nothing stored outside this browser.'}
        </p>
        {!hasResults && (
          <button type="button" className="btn-pill big" onClick={() => go('quest')}>
            Find My Major <span className="go"><Icon name="arrow" size={14} /></span>
          </button>
        )}
      </header>

      <div className="stats">
        <StatTile label="Majors in the catalog subset" value={majors.length} delay={0} />
        <StatTile label="Weighted match factors" value={5} delay={60} />
        <StatTile label="Experience stories" value={alumniPosts.length} delay={120} />
        <StatTile label="Your top overlap" value={hasResults ? first.fit : 0} suffix={hasResults ? '/100' : ''} text={hasResults ? undefined : 'Not yet'} delay={180} />
      </div>

      <div className="tiles">
        <Tile icon="compass" title={hasResults ? 'Replay Major Quest' : 'Major Quest'} blurb="One question per screen, big cards, XP and levels. Your don'ts count as much as your likes." chip={hasResults ? 'Completed' : 'Start here'} chipTone={hasResults ? 'good' : 'gold'} featured={!hasResults} onClick={() => go('quest')} delay={0} />
        <Tile icon="chart" title="My results" blurb="Top matches with a factor-by-factor breakdown, radar, and a live don'ts explorer." chip={hasResults ? `${topScored.length} ranked` : 'Needs quest'} chipTone={hasResults ? 'good' : 'neutral'} disabled={!hasResults} onClick={() => go('results')} delay={70} />
        <Tile icon="bolt" title="Thinking Worlds" blurb="Three short mini-games: Number Forge, Logic Lab, Idea Garden. A reflection snapshot, never a score." chip={profile?.thinking ? 'Played' : 'Optional'} chipTone={profile?.thinking ? 'good' : 'neutral'} onClick={() => go('worlds')} delay={140} />
        <Tile icon="book" title="Learning communities" blurb="Community references for each major, labelled by verification status, plus the official directory." onClick={() => go('communities')} delay={210} />
        <Tile icon="users" title="Alumni network" blurb="Why I chose, a real week in, I switched from: stories from people with profiles like yours." chip="Synthetic" chipTone="neutral" onClick={() => go('alumni')} delay={280} />
        <Tile icon="message" title="Ask & prep" blurb="Questions to bring to your advisor, generated from your answers, plus a source-cited catalog Q&A." onClick={() => go('ask')} delay={350} />
      </div>

      <div className="hub-cols">
        <section className="panel" aria-labelledby="recent-heading">
          <div className="panelhead"><h2 id="recent-heading">Recently viewed</h2><span className="badge">This browser</span></div>
          {recent.length ? (
            <ul className="timeline">
              {recent.map((r) => {
                const m = majors.find((x) => x.id === r.id);
                if (!m) return null;
                return (
                  <li key={r.id}>
                    <span className="ldot" aria-hidden="true" />
                    <button type="button" className="tl-link" onClick={() => go('detail', r.id)}>{m.name}</button>
                    <small>{m.college.split(' / ')[0]}</small>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="empty">Majors you open appear here.</p>
          )}
        </section>

        <section className="panel" aria-labelledby="notes-heading">
          <div className="panelhead"><h2 id="notes-heading">What's new</h2></div>
          <ul className="notes">
            <li className="note"><span className="ldot new" aria-hidden="true" /><div><b>Don'ts explorer</b><p>Toggle a dislike on the results page and watch the ranking re-run live.</p><small>Today</small></div></li>
            <li className="note"><span className="ldot new" aria-hidden="true" /><div><b>Alumni network</b><p>Experience stories with role badges and a "people like you" filter.</p><small>Today</small></div></li>
            <li className="note"><span className="ldot" aria-hidden="true" /><div><b>Verified core data</b><p>Major names, colleges and catalog links checked against catalog.iastate.edu.</p><small>Nov 17</small></div></li>
          </ul>
        </section>
      </div>
    </section>
  );
}
