// Visual fit meter + qualitative band. Never labels the score as a probability.

import { fitBand } from '../lib/matcher.js';

export default function FitMeter({ fit }) {
  const band = fitBand(fit);
  return (
    <div className={`fit-meter tone-${band.tone}`}>
      <div className="fit-head">
        <span className="fit-value">{fit}</span>
        <span className="fit-unit">/ 100 overlap</span>
        <span className={`fit-band tone-${band.tone}`}>{band.label}</span>
      </div>
      <div
        className="fit-bar"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fit}
        aria-label={`Fit overlap ${fit} out of 100, ${band.label}`}
      >
        <div className={`fit-bar-fill tone-${band.tone}`} style={{ width: `${fit}%` }} />
      </div>
    </div>
  );
}
