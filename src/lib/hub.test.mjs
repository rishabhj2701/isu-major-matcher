// Tests for the hub additions: the rule-based catalog Q&A, the advisor
// question generator, the thinking snapshot, and synthetic-session determinism.
//   node src/lib/hub.test.mjs

import assert from 'node:assert/strict';
import { ask, tokenize, CONFIDENCE_FLOOR } from './askEngine.js';
import { buildAdvisorQuestions } from './advisorQuestions.js';
import { summarizeThinking, countIdeas } from './thinking.js';
import { generateSessions, aggregate } from '../data/syntheticSessions.js';
import { topMatches } from './matcher.js';

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

test('tokenize drops stop words and punctuation', () => {
  assert.deepEqual(tokenize('What is the Software Engineering major?'), ['software', 'engineering', 'major']);
});

test('ask answers a direct major question with a source', () => {
  const r = ask('What is Software Engineering about?');
  assert.equal(r.status, 'answer');
  assert.equal(r.best.kind, 'major');
  assert.match(r.best.title, /Software Engineering/);
  assert.match(r.best.source.url, /^https:\/\/catalog\.iastate\.edu\//);
});

test('ask prefers the community card for learning-community questions', () => {
  const r = ask('Which learning communities are there for Computer Science?');
  assert.equal(r.status, 'answer');
  assert.equal(r.best.kind, 'community');
  assert.match(r.best.title, /Computer Science/);
});

test('ask prefers the caution card for dislike questions', () => {
  const r = ask('Who might Mechanical Engineering not suit?');
  assert.equal(r.status, 'answer');
  assert.equal(r.best.kind, 'caution');
});

test('ask says it is unsure for unrelated questions', () => {
  const r = ask('zebra volcano trombone');
  assert.equal(r.status, 'unsure');
  assert.ok(r.confidence < CONFIDENCE_FLOOR);
});

test('ask never answers with an empty question', () => {
  assert.equal(ask('   ').status, 'unsure');
});

const student = {
  status: 'undeclared', year: 'Second year',
  interests: ['coding', 'math', 'building'], dislikes: ['math'],
  strengths: ['logic'], careerFields: ['technology'], workStyles: ['technical'], priority: 'graduateSooner',
};

test("advisor questions include a don'ts question when the top match was penalized", () => {
  const top = topMatches(student, 3);
  assert.ok(top[0].penalty > 0, 'expected a penalized top match for this fixture');
  const qs = buildAdvisorQuestions(student, top);
  assert.ok(qs.some((q) => q.id === 'dislike'), 'missing dislike question');
  assert.ok(qs.some((q) => q.id === 'time'), 'missing graduate-sooner question');
  assert.ok(qs.every((q) => q.text && q.why && q.tag));
});

test('advisor questions work for an empty profile', () => {
  const qs = buildAdvisorQuestions({}, []);
  assert.ok(qs.length >= 3);
  assert.ok(!qs.some((q) => q.id === 'dislike'));
});

test('thinking snapshot is relative and never changes a fit score', () => {
  const snap = summarizeThinking({ quant: { correct: 3, total: 3 }, analytical: { correct: 1, total: 3 }, creative: { ideas: 5 } });
  assert.equal(snap.strongest.key, 'quant');
  const sum = snap.dims.reduce((s, d) => s + d.relative, 0);
  assert.ok(Math.abs(sum) < 1e-9, 'relative tilts should sum to zero');
  const a = JSON.stringify(topMatches(student, 3));
  const b = JSON.stringify(topMatches({ ...student, thinking: snap }, 3));
  assert.equal(a, b);
});

test('thinking snapshot returns null when nothing was played', () => {
  assert.equal(summarizeThinking({}), null);
});

test('countIdeas counts distinct non-trivial lines', () => {
  assert.equal(countIdeas('a vase\nA VASE\ncandle holder, pen cup\n\nab'), 3);
});

test('synthetic sessions are deterministic and anonymous', () => {
  const a = generateSessions(20, 7);
  const b = generateSessions(20, 7);
  assert.equal(JSON.stringify(a), JSON.stringify(b));
  assert.ok(a.every((s) => /^S-\d{2}$/.test(s.id) && !('name' in s)));
  const agg = aggregate(a);
  assert.equal(agg.total, 20);
  assert.equal(agg.undeclared + agg.changing, 20);
});

console.log(`\n${passed} checks passed.`);
