// SYNTHETIC advising sessions for the Advisor view.
// =============================================================================
// Generated deterministically from a seed so the dashboard is stable between
// reloads and demos. Each "session" is a fictional student's questionnaire
// profile run through the real matching engine. There are no names, IDs or
// records — the advisor view only ever shows grouped counts plus anonymous
// session cards labelled S-01, S-02 … Nothing here is real ISU data.
// =============================================================================

import {
  interestOptions,
  strengthOptions,
  workStyleOptions,
  careerFieldOptions,
  priorityOptions,
} from './majors.js';
import { matchMajors } from '../lib/matcher.js';

// Small seeded PRNG (mulberry32) so output is reproducible.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickSome(rand, options, min, max) {
  const n = min + Math.floor(rand() * (max - min + 1));
  const pool = [...options];
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0].id);
  }
  return out;
}

const YEARS = ['First year', 'Second year', 'Third year', 'Fourth year or beyond'];
const STATUSES = ['undeclared', 'undeclared', 'changing']; // 2:1 mix

export function generateSessions(count = 42, seed = 20261117) {
  const rand = rng(seed);
  const sessions = [];
  for (let i = 0; i < count; i += 1) {
    const interests = pickSome(rand, interestOptions, 2, 4);
    const dislikePool = interestOptions.filter((o) => !interests.includes(o.id));
    const profile = {
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      year: YEARS[Math.floor(rand() * YEARS.length)],
      interests,
      dislikes: rand() < 0.75 ? pickSome(rand, dislikePool, 1, 2) : [],
      strengths: pickSome(rand, strengthOptions, 1, 3),
      workStyles: pickSome(rand, workStyleOptions, 1, 2),
      careerFields: pickSome(rand, careerFieldOptions, 1, 2),
      priority: priorityOptions[Math.floor(rand() * priorityOptions.length)].id,
    };
    const ranked = matchMajors(profile);
    const daysAgo = Math.floor(rand() * 14);
    sessions.push({
      id: `S-${String(i + 1).padStart(2, '0')}`,
      daysAgo,
      profile,
      top: ranked.slice(0, 3).map((m) => ({ id: m.id, name: m.name, fit: m.fit, penalty: m.penalty })),
      nearTie: ranked[1] && ranked[0].fit - ranked[1].fit <= 6,
    });
  }
  return sessions;
}

// Aggregations the dashboard reads. Grouped data only.
export function aggregate(sessions) {
  const count = (arr, key) =>
    arr.reduce((acc, s) => {
      for (const id of s.profile[key]) acc[id] = (acc[id] ?? 0) + 1;
      return acc;
    }, {});
  const label = (opts) => Object.fromEntries(opts.map((o) => [o.id, o.label]));
  const iLabel = label(interestOptions);

  const toRows = (map, labels) =>
    Object.entries(map)
      .map(([id, value]) => ({ id, label: labels[id] ?? id, value }))
      .sort((a, b) => b.value - a.value);

  const topMajors = sessions.reduce((acc, s) => {
    const t = s.top[0];
    acc[t.id] = acc[t.id] ? { ...acc[t.id], value: acc[t.id].value + 1 } : { id: t.id, label: t.name, value: 1 };
    return acc;
  }, {});

  return {
    total: sessions.length,
    undeclared: sessions.filter((s) => s.profile.status === 'undeclared').length,
    changing: sessions.filter((s) => s.profile.status === 'changing').length,
    withDislikes: sessions.filter((s) => s.profile.dislikes.length > 0).length,
    nearTies: sessions.filter((s) => s.nearTie).length,
    interests: toRows(count(sessions, 'interests'), iLabel),
    dislikes: toRows(count(sessions, 'dislikes'), iLabel),
    priorities: toRows(count(sessions.map((s) => ({ profile: { p: [s.profile.priority] } })), 'p'), label(priorityOptions)),
    topMajors: Object.values(topMajors).sort((a, b) => b.value - a.value),
    years: YEARS.map((y) => ({ id: y, label: y, value: sessions.filter((s) => s.profile.year === y).length })),
  };
}

// Questions students most often bring (synthetic counts for the demo).
export const COMMON_QUESTIONS = [
  { text: 'Will switching delay my graduation?', count: 23 },
  { text: 'Which of my credits carry over?', count: 19 },
  { text: 'How math-heavy is the first year?', count: 17 },
  { text: 'Can I try a course before I switch?', count: 14 },
  { text: 'Which learning communities can I join?', count: 12 },
  { text: 'Is a minor a better option than switching?', count: 9 },
];
