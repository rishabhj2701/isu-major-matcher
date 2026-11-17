// Accessible multi-select chip group used across the questionnaire.
// Renders a labelled group of toggle buttons. Keyboard + screen-reader friendly:
// each chip is a real button with aria-pressed; the group is labelled.

export default function ChipGroup({ legend, hint, options, selected, onToggle, name }) {
  return (
    <fieldset className="chip-fieldset">
      <legend className="chip-legend">{legend}</legend>
      {hint && <p className="chip-hint">{hint}</p>}
      <div className="chips" role="group" aria-label={legend}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              name={name}
              className={isSelected ? 'chip selected' : 'chip'}
              aria-pressed={isSelected}
              onClick={() => onToggle(opt.id)}
            >
              {opt.emoji && <span aria-hidden="true">{opt.emoji} </span>}
              {opt.label}
              {opt.hint && <span className="chip-sub"> · {opt.hint}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
