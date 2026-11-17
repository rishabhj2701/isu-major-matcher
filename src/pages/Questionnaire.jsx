// Multi-step guided student questionnaire.
// Collects a profile for the matching engine. No real IDs, transcripts, or
// credentials are ever requested. All fields are optional except that the
// student should make at least one interest selection to get useful results.

import { useState } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import ChipGroup from '../components/ChipGroup.jsx';
import {
  interestOptions,
  strengthOptions,
  workStyleOptions,
  careerFieldOptions,
  priorityOptions,
} from '../data/majors.js';

const STEP_LABELS = ['About you', 'Interests', 'Dislikes', 'Strengths & style', 'Careers & priorities'];
const TOTAL_STEPS = STEP_LABELS.length;

const YEARS = ['First year', 'Second year', 'Third year', 'Fourth year or beyond', 'Prefer not to say'];
const STATUS = [
  { id: 'undeclared', label: 'I am undeclared / exploring' },
  { id: 'changing', label: 'I am considering changing my major' },
];

const emptyProfile = {
  status: '',
  currentMajor: '',
  year: '',
  interests: [],
  dislikes: [],
  strengths: [],
  workStyles: [],
  careerFields: [],
  priority: '',
};

export default function Questionnaire({ initialProfile, onComplete, onBack }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(initialProfile ?? emptyProfile);
  const [touchedSubmit, setTouchedSubmit] = useState(false);

  function toggleIn(field, id) {
    setProfile((p) => ({
      ...p,
      [field]: p[field].includes(id)
        ? p[field].filter((x) => x !== id)
        : [...p[field], id],
    }));
  }

  function setField(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  const noInterests = profile.interests.length === 0;

  function next() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  }
  function prev() {
    if (step > 1) setStep((s) => s - 1);
    else onBack?.();
  }
  function submit() {
    setTouchedSubmit(true);
    if (noInterests) {
      setStep(2);
      return;
    }
    onComplete(profile);
  }

  return (
    <section className="questionnaire panel" aria-labelledby="q-heading">
      <ProgressBar step={step} total={TOTAL_STEPS} labels={STEP_LABELS} />
      <h2 id="q-heading" className="sr-focus" tabIndex={-1}>
        {STEP_LABELS[step - 1]}
      </h2>

      {step === 1 && (
        <div className="q-step">
          <fieldset className="chip-fieldset">
            <legend className="chip-legend">Where are you right now?</legend>
            <div className="chips" role="group" aria-label="Current status">
              {STATUS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={profile.status === s.id ? 'chip selected' : 'chip'}
                  aria-pressed={profile.status === s.id}
                  onClick={() => setField('status', profile.status === s.id ? '' : s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="current-major">Current major (optional)</label>
            <input
              id="current-major"
              type="text"
              value={profile.currentMajor}
              placeholder="e.g. Undeclared, or a major you're reconsidering"
              onChange={(e) => setField('currentMajor', e.target.value)}
            />
          </div>

          <fieldset className="chip-fieldset">
            <legend className="chip-legend">Academic year (optional)</legend>
            <div className="chips" role="group" aria-label="Academic year">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={profile.year === y ? 'chip selected' : 'chip'}
                  aria-pressed={profile.year === y}
                  onClick={() => setField('year', profile.year === y ? '' : y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="q-step">
          <ChipGroup
            legend="Which subjects or activities do you enjoy?"
            hint="Pick as many as you like. This carries the most weight (35%) in your results."
            options={interestOptions}
            selected={profile.interests}
            onToggle={(id) => toggleIn('interests', id)}
            name="interests"
          />
          {touchedSubmit && noInterests && (
            <p className="form-error" role="alert">
              Choose at least one interest so we can generate meaningful matches.
            </p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="q-step">
          <ChipGroup
            legend="Which subjects or activities would you rather avoid?"
            hint="Optional. Majors that lean heavily on these will be gently lowered, never removed."
            options={interestOptions}
            selected={profile.dislikes}
            onToggle={(id) => toggleIn('dislikes', id)}
            name="dislikes"
          />
        </div>
      )}

      {step === 4 && (
        <div className="q-step">
          <ChipGroup
            legend="What are your academic strengths?"
            hint="Optional. Choose what feels true for you."
            options={strengthOptions}
            selected={profile.strengths}
            onToggle={(id) => toggleIn('strengths', id)}
            name="strengths"
          />
          <ChipGroup
            legend="How do you prefer to work?"
            options={workStyleOptions}
            selected={profile.workStyles}
            onToggle={(id) => toggleIn('workStyles', id)}
            name="workStyles"
          />
        </div>
      )}

      {step === 5 && (
        <div className="q-step">
          <ChipGroup
            legend="Which career fields interest you?"
            hint="Optional."
            options={careerFieldOptions}
            selected={profile.careerFields}
            onToggle={(id) => toggleIn('careerFields', id)}
            name="careerFields"
          />
          <fieldset className="chip-fieldset">
            <legend className="chip-legend">What matters most to you right now?</legend>
            <div className="chips" role="group" aria-label="Top priority">
              {priorityOptions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={profile.priority === o.id ? 'chip selected' : 'chip'}
                  aria-pressed={profile.priority === o.id}
                  onClick={() => setField('priority', profile.priority === o.id ? '' : o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <div className="q-nav">
        <button type="button" className="secondary-button" onClick={prev}>
          {step === 1 ? '← Home' : '← Back'}
        </button>
        {step < TOTAL_STEPS ? (
          <button type="button" className="primary" onClick={next}>
            Next →
          </button>
        ) : (
          <button type="button" className="primary" onClick={submit}>
            See my matches →
          </button>
        )}
      </div>
    </section>
  );
}
