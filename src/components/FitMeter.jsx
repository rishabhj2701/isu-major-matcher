// Visual fit meter + qualitative band. Never labels the score as a probability.
// Animates the number and bar on mount for a polished reveal.

import { fitBand } from '../lib/matcher.js';
import { useCountUp } from '../lib/useCountUp.js';

export default function FitMeter({ fit, animate = true }) {
  const band = fitBand(fit);
  const shown = useCountUp(fit, animate ? 1000 : 0);

  return (
    <div className={`fit-meter tone-${band.tone}`}>
      <div className="fit-head">
        <span className="fit-value">{shown}</span>
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
        <div className={`fit-bar-fill tone-${band.tone}`} style={{ width: `${shown}%` }} />
      </div>
    </div>
  );
}
