// Welcome / landing page with a hero, process overview, and stat badges.

import { majors } from '../data/majors.js';

export default function Home({ onStart }) {
  return (
    <section className="home" aria-labelledby="home-heading">
      <div className="hero">
        <span className="eyebrow">★ AWS Kiro Hackathon 2026 · Team 2 · Use Case 3</span>
        <h1 id="home-heading">
          Find an ISU major that fits{' '}
          <span className="accent">how you think and what you enjoy.</span>
        </h1>
        <p className="lead">
          The Major &amp; Learning-Community Matcher helps current Iowa State students who are
          undeclared or considering a change explore majors, learning communities, and academic
          pathways — with a transparent reason behind every recommendation.
        </p>

        <button type="button" className="primary big" onClick={onStart}>
          Find My Major →
        </button>

        <div className="hero-stats">
          <div className="hero-stat">
            <b>{majors.length}</b>
            <span>verified-core majors</span>
          </div>
          <div className="hero-stat">
            <b>5</b>
            <span>weighted match factors</span>
          </div>
          <div className="hero-stat">
            <b>100%</b>
            <span>explainable scores</span>
          </div>
          <div className="hero-stat">
            <b>~2 min</b>
            <span>to your matches</span>
          </div>
        </div>
      </div>

      <ol className="how-it-works">
        <li>
          <span className="step-num">1</span>
          <div>
            <strong>Tell us about you</strong>
            <p>A short, selectable questionnaire — interests, strengths, and goals. No IDs or records.</p>
          </div>
        </li>
        <li>
          <span className="step-num">2</span>
          <div>
            <strong>See transparent matches</strong>
            <p>Top majors with an explained overlap score you can inspect factor by factor.</p>
          </div>
        </li>
        <li>
          <span className="step-num">3</span>
          <div>
            <strong>Explore &amp; plan</strong>
            <p>Open pathways, compare options, and take an advising summary to your advisor.</p>
          </div>
        </li>
      </ol>

      <p className="disclaimer">
        A student-built hackathon prototype. Not an official Iowa State University service and not a
        substitute for academic advising. Major names, colleges, and catalog links are verified
        against the ISU catalog; interest weights and learning-community matches are illustrative
        and clearly labeled.
      </p>
    </section>
  );
}
