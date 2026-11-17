// Step progress indicator for the multi-step questionnaire.

export default function ProgressBar({ step, total, labels = [] }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="progress" aria-hidden={false}>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={`Step ${step} of ${total}`}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="progress-label">
        Step {step} of {total}
        {labels[step - 1] ? ` — ${labels[step - 1]}` : ''}
      </p>
    </div>
  );
}
