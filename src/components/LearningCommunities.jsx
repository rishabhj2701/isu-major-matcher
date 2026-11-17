// Learning-community cards. Honors the verification policy: unverified
// associations are clearly labelled and always point to the official directory;
// we never imply a guaranteed match or verified eligibility.

import {
  getLearningCommunities,
  LEARNING_COMMUNITIES_DIRECTORY,
} from '../data/learningCommunities.js';

export default function LearningCommunities({ majorId }) {
  const communities = getLearningCommunities(majorId);

  return (
    <div className="lc">
      <h4 className="lc-title">Learning communities</h4>
      {communities.length === 0 ? (
        <p className="lc-empty">
          We don&apos;t have a verified learning-community association for this major yet.
          Explore the official directory to see what&apos;s currently offered.
        </p>
      ) : (
        <ul className="lc-list">
          {communities.map((c) => (
            <li key={c.name} className="lc-card">
              <div className="lc-head">
                <strong>{c.name}</strong>
                {c.status !== 'verified' && (
                  <span className="lc-badge unverified" title={c.note}>
                    Unverified — confirm on directory
                  </span>
                )}
              </div>
              <p className="lc-for">For: {c.forStudents}</p>
              <p className="lc-benefit">{c.benefit}</p>
            </li>
          ))}
        </ul>
      )}
      <a
        className="lc-link"
        href={LEARNING_COMMUNITIES_DIRECTORY}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open the official ISU Learning Communities directory ↗
      </a>
    </div>
  );
}
