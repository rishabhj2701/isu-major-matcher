// Lightweight tests for the matching engine, runnable with plain Node:
//   node src/lib/matcher.test.mjs
// No test framework needed for the hackathon sprint. Exits non-zero on failure.

import assert from 'node:assert/strict';
import {
  matchMajors,
  topMatches,
  scoreMajor,
  explainMatch,
  fitBand,
  FACTOR_WEIGHTS,
} from './matcher.js';
import { majors } from '../data/majors.js';

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`  ok   ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}\n       ${err.message}`);
    process.exitCode = 1;
  }
}

// Factor weights must sum to 1 so scores are normalized.
test('factor weights sum to 1', () => {
  const sum = Object.values(FACTOR_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9, `sum was ${sum}`);
});

// Demo student: tech + math, analytical/technical, technology career.
const techStudent = {
  interests: ['coding', 'math', 'science'],
  strengths: ['math', 'logic'],
  careerFields: ['technology'],
  workStyles: ['analytical', 'technical'],
  priority: 'career',
  dislikes: [],
};

test('tech-leaning student surfaces CS or SE in top 3', () => {
  const top = topMatches(techStudent, 3);
  const ids = top.map((m) => m.id);
  assert.ok(ids.includes('com-s') || ids.includes('se'), `top ids: ${ids}`);
});

test('fit scores are in 0..100 and sorted descending', () => {
  const ranked = matchMajors(techStudent);
  for (const m of ranked) {
    assert.ok(m.fit >= 0 && m.fit <= 100, `${m.id} fit ${m.fit} out of range`);
  }
  for (let i = 1; i < ranked.length; i += 1) {
    assert.ok(ranked[i - 1].fit >= ranked[i].fit, 'not sorted descending');
  }
});

test('output is reproducible for identical input', () => {
  const a = JSON.stringify(matchMajors(techStudent));
  const b = JSON.stringify(matchMajors(techStudent));
  assert.equal(a, b);
});

test('empty profile does not throw and returns all majors', () => {
  const ranked = matchMajors({});
  assert.equal(ranked.length, majors.length);
});

test('disliking math lowers a math-heavy major', () => {
  const base = scoreMajor({ ...techStudent, dislikes: [] }, majors.find((m) => m.id === 'com-s'));
  const disliked = scoreMajor({ ...techStudent, dislikes: ['math'] }, majors.find((m) => m.id === 'com-s'));
  assert.ok(disliked.fit < base.fit, `base ${base.fit} vs disliked ${disliked.fit}`);
  assert.ok(disliked.penalty > 0, 'expected a penalty');
});

test('dislike penalty never eliminates a major (stays >= 0)', () => {
  const scored = scoreMajor(
    { interests: ['coding'], dislikes: ['math', 'logic'], strengths: [], careerFields: [], workStyles: [] },
    majors.find((m) => m.id === 'com-s')
  );
  assert.ok(scored.fit >= 0, `fit was ${scored.fit}`);
});

test('explanations reference only factors that contributed', () => {
  const scored = scoreMajor(techStudent, majors.find((m) => m.id === 'com-s'));
  const reasons = explainMatch(scored, {});
  assert.ok(reasons.length >= 1);
  // Every "+N pts" reason must match a real positive contribution.
  for (const r of reasons) {
    const m = r.match(/\+(\d+) pts/);
    if (m) {
      const pts = Number(m[1]);
      assert.ok(
        Object.values(scored.contributions).includes(pts),
        `reason points ${pts} not found in contributions`
      );
    }
  }
});

test('conflicting profile (likes and dislikes math) is handled', () => {
  const scored = matchMajors({
    interests: ['math', 'coding'],
    dislikes: ['math'],
    strengths: ['math'],
    careerFields: [],
    workStyles: [],
    priority: 'interests',
  });
  assert.equal(scored.length, majors.length);
  assert.ok(scored.every((m) => m.fit >= 0 && m.fit <= 100));
});

test('fitBand returns a label for boundary values', () => {
  assert.equal(fitBand(80).tone, 'strong');
  assert.equal(fitBand(50).tone, 'good');
  assert.equal(fitBand(30).tone, 'explore');
  assert.equal(fitBand(10).tone, 'low');
});

console.log(`\n${passed} checks passed.`);
