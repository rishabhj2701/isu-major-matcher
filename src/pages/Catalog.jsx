// Full ISU major catalog directory. Verified name/college/URL for every
// undergraduate major. Searchable and grouped by college. Majors that the quiz
// can score show a "Scored" badge and can be opened in the detail view; all
// others link to the official catalog so nothing is hidden ("explore anyway").

import { useMemo, useState } from 'react';
import { catalog, catalogByCollege, COLLEGES, CATALOG_SOURCE } from '../data/catalog.js';

export default function Catalog({ onOpenScored, onBack }) {
  const [query, setQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('all');

  const scoredCount = catalog.filter((c) => c.scoredId).length;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogByCollege()
      .filter((g) => collegeFilter === 'all' || g.key === collegeFilter)
      .map((g) => ({
        ...g,
        majors: g.majors.filter((mjr) => !q || mjr.name.toLowerCase().includes(q)),
      }))
      .filter((g) => g.majors.length > 0);
  }, [query, collegeFilter]);

  const totalShown = groups.reduce((n, g) => n + g.majors.length, 0);

  return (
    <section className="catalog-page" aria-labelledby="catalog-heading">
      {onBack && (
        <button type="button" className="link-button back" onClick={onBack}>
          ← Back
        </button>
      )}
      <h2 id="catalog-heading">Browse every ISU major</h2>
      <p className="muted">
        All {catalog.length} undergraduate majors from the {CATALOG_SOURCE.edition}, verified against
        the official catalog (checked {CATALOG_SOURCE.checkedOn}). {scoredCount} are scored by the
        quiz; the rest link straight to the official page — no major is ever hidden.
      </p>

      <div className="catalog-controls">
        <input
          type="search"
          className="catalog-search"
          placeholder="Search majors (e.g. biology, finance, design)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search majors"
        />
        <select
          className="catalog-filter"
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          aria-label="Filter by college"
        >
          <option value="all">All colleges</option>
          {Object.entries(COLLEGES).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      <p className="catalog-count">{totalShown} major{totalShown === 1 ? '' : 's'} shown</p>

      {groups.map((g) => (
        <div key={g.key} className="catalog-group">
          <div className="catalog-group-head">
            <h3>{g.college}</h3>
            <a href={g.url} target="_blank" rel="noopener noreferrer" className="catalog-college-link">
              College catalog ↗
            </a>
          </div>
          <ul className="catalog-list">
            {g.majors.map((mjr) => (
              <li key={mjr.name} className="catalog-item">
                <div className="catalog-item-main">
                  <span className="catalog-name">{mjr.name}</span>
                  <span className="catalog-degree">{mjr.degree}</span>
                  {mjr.scoredId && <span className="catalog-scored">Scored</span>}
                </div>
                <div className="catalog-item-actions">
                  {mjr.scoredId && (
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onOpenScored(mjr.scoredId)}
                    >
                      View fit
                    </button>
                  )}
                  <a href={mjr.url} target="_blank" rel="noopener noreferrer" className="catalog-official">
                    Official page ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {groups.length === 0 && (
        <p className="catalog-empty">No majors match “{query}”. Try a different search.</p>
      )}
    </section>
  );
}
