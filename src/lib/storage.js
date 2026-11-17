// Tiny localStorage wrapper. Everything the hub remembers between tabs and
// reloads (role, theme, the synthetic profile, recently viewed majors) lives
// under a `fitfinder.` prefix. No real student data is ever stored — the
// profile is the same self-selected interests the questionnaire collects.
// Every call is guarded: private windows and blocked storage must not crash
// the app.

const PREFIX = 'fitfinder.';

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — state still lives in React */
  }
}

export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) && k !== PREFIX + 'theme')
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
