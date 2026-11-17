// Gamified progress layer: missions, XP, level and a fun archetype name.
// Pure presentation — none of this touches the matching score. The archetype
// is derived from the student's own top interest + working style (PRD §5.4:
// "only for fun and sharing, never used in scoring").

export const MISSIONS = [
  { id: 'aptitude', view: 'worlds', icon: 'bolt', title: 'Aptitude', sub: 'Level 1 · brain games', xp: 75 },
  { id: 'discover', view: 'quest', icon: 'compass', title: 'Discover', sub: 'Level 2 · the quest', xp: 100 },
  { id: 'reveal', view: 'results', icon: 'sparkle', title: 'Reveal', sub: 'See your matches', xp: 50, needsProfile: true },
  { id: 'explore', view: 'catalog', icon: 'layers', title: 'Explore', sub: 'Pathways & majors', xp: 50 },
  { id: 'community', view: 'communities', icon: 'book', title: 'Belong', sub: 'Learning communities', xp: 25 },
  { id: 'connect', view: 'alumni', icon: 'users', title: 'Connect', sub: 'Alumni stories', xp: 50 },
  { id: 'prepare', view: 'ask', icon: 'flag', title: 'Prepare', sub: 'Advisor questions', xp: 75 },
];


export const LEVELS = ['Rookie', 'Explorer', 'Navigator', 'Pathfinder', 'Trailblazer'];

const INTEREST_NOUN = {
  coding: 'Coder', math: 'Solver', science: 'Investigator', building: 'Builder', design: 'Designer',
  business: 'Strategist', people: 'Connector', communication: 'Storyteller', environment: 'Steward', health: 'Healer',
};
const STYLE_ADJ = { analytical: 'Analytical', creative: 'Creative', technical: 'Technical', practical: 'Hands-on', people: 'Collaborative' };

export function archetypeFor(profile) {
  if (!profile?.interests?.length) return { name: 'The Explorer', emoji: '🧭' };
  const noun = INTEREST_NOUN[profile.interests[0]] ?? 'Explorer';
  const adj = STYLE_ADJ[profile.workStyles?.[0]];
  const emoji = { Coder: '💻', Solver: '📐', Investigator: '🔬', Builder: '⚙️', Designer: '🎨', Strategist: '📈', Connector: '🤝', Storyteller: '✍️', Steward: '🌱', Healer: '🩺' }[noun] ?? '🧭';
  return { name: adj ? `The ${adj} ${noun}` : `The ${noun}`, emoji };
}

/**
 * @param {object|null} profile
 * @param {string[]} visited  views the student has opened
 */
export function missionState(profile, visited = []) {
  const has = (v) => visited.includes(v);
  const hasProfile = Boolean(profile?.interests?.length);
  const done = {
    discover: hasProfile,
    reveal: hasProfile && has('results'),
    explore: has('catalog') || has('detail') || has('compare'),
    community: has('communities'),
    connect: has('alumni'),
    prepare: has('ask') || has('summary'),
    aptitude: Boolean(profile?.thinking),
  };
  const all = MISSIONS;
  const xp = all.reduce((s, m) => s + (done[m.id] ? m.xp : 0), 0);
  const total = all.reduce((s, m) => s + m.xp, 0);
  const level = Math.min(LEVELS.length, 1 + Math.floor(xp / 100));
  const next = MISSIONS.find((m) => !done[m.id] && (!m.needsProfile || hasProfile)) ?? null;
  return { done, xp, total, level, levelName: LEVELS[level - 1], next, hasProfile };
}
