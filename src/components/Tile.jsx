// Hub tile: the "product card" of the hub. Icon, title, blurb, status chip and
// an arrow "go" button. The whole tile is one button for a big hit target.

import Icon from './Icon.jsx';

export default function Tile({ icon, title, blurb, chip, chipTone = 'neutral', onClick, delay = 0, featured = false, disabled = false }) {
  return (
    <button
      type="button"
      className={`tile reveal${featured ? ' featured' : ''}`}
      style={{ '--delay': `${delay}ms` }}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="tile-top">
        <span className="tile-icon"><Icon name={icon} size={20} /></span>
        {chip && <span className={`chip-mini tone-${chipTone}`}>{chip}</span>}
      </span>
      <span className="tile-title">{title}</span>
      <span className="tile-blurb">{blurb}</span>
      <span className="tile-go" aria-hidden="true"><Icon name="arrow" size={15} /></span>
    </button>
  );
}
