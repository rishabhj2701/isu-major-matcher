// "Ask the catalog" — a small, honest, rule-based retriever.
// =============================================================================
// This is NOT an AI model. It tokenizes the question, scores a set of local
// knowledge cards (built from the structured, verified major data, the
// learning-community references and a short FAQ), and returns the best card
// with its official source link. If nothing scores well enough it says so and
// points to an advisor. A future Bedrock-backed RAG service would replace the
// scoring step but must keep the same contract: answer only from sources, cite
// them, and say "I don't know" otherwise.
// =============================================================================

import { majors } from '../data/majors.js';
import {
  learningCommunitiesByMajor,
  LEARNING_COMMUNITIES_DIRECTORY,
} from '../data/learningCommunities.js';
import { faq } from '../data/faq.js';

const STOP = new Set(
  'a an the is are was were be been of to in on for and or what which how do does can i my me about with from at as it this that these those there their into than then so if'.split(' ')
);

export function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

// Build the knowledge cards once.
function buildCards() {
  const cards = [];

  for (const m of majors) {
    cards.push({
      id: `major-${m.id}`,
      kind: 'major',
      title: m.name,
      answer: `${m.name} (${m.college}): ${m.summary} Related career directions include ${m.careers.join(', ').toLowerCase()}.`,
      source: { label: `ISU catalog — ${m.name}`, url: m.catalogUrl },
      keywords: [
        m.name,
        m.college,
        ...m.careers,
        ...Object.keys(m.interestWeights ?? {}),
        ...(m.goodIf ?? []),
        ...(m.cautionIf ?? []),
        'major', 'study', 'college', 'career', 'careers', 'about',
      ].join(' '),
      majorId: m.id,
    });

    cards.push({
      id: `caution-${m.id}`,
      kind: 'caution',
      title: `${m.name}: who it may not suit`,
      answer: `${m.name} may not suit you if: ${(m.cautionIf ?? []).join('; ').toLowerCase()}. It is likely a good fit if: ${(m.goodIf ?? []).join('; ').toLowerCase()}. These are product notes, not official admission criteria.`,
      source: { label: `ISU catalog — ${m.name}`, url: m.catalogUrl },
      keywords: `${m.name} dislike hate avoid dont don't not suit bad fit hard difficult struggle good fit ${(m.cautionIf ?? []).join(' ')}`,
      majorId: m.id,
    });

    const lcs = learningCommunitiesByMajor[m.id] ?? [];
    cards.push({
      id: `lc-${m.id}`,
      kind: 'community',
      title: `${m.name}: learning communities`,
      answer: lcs.length
        ? `For ${m.name} we list: ${lcs.map((c) => c.name).join('; ')}. These associations are marked unverified — confirm the current name, availability and eligibility on the official ISU Learning Communities directory.`
        : `We do not have a verified learning-community association for ${m.name}. Browse the official ISU Learning Communities directory to see what is currently offered.`,
      source: { label: 'ISU Learning Communities directory', url: LEARNING_COMMUNITIES_DIRECTORY },
      keywords: `${m.name} learning community communities cohort first-year join eligible`,
      majorId: m.id,
    });
  }

  for (const f of faq) {
    cards.push({
      id: `faq-${f.id}`,
      kind: 'faq',
      title: f.q,
      answer: f.a,
      source: f.source,
      keywords: `${f.q} ${f.keywords ?? ''}`,
    });
  }

  return cards.map((c) => ({ ...c, tokens: new Set(tokenize(c.keywords)) }));
}

let CARDS = null;
export function getCards() {
  if (!CARDS) CARDS = buildCards();
  return CARDS;
}

// Minimum overlap (fraction of question tokens that hit) to answer at all.
export const CONFIDENCE_FLOOR = 0.25;

/**
 * @returns {{ status:'answer'|'unsure', confidence:number, best?:object, alternatives:object[] }}
 */
export function ask(question, { profile } = {}) {
  const qTokens = tokenize(question);
  if (!qTokens.length) return { status: 'unsure', confidence: 0, alternatives: [] };

  const scored = getCards()
    .map((card) => {
      let hits = 0;
      for (const t of qTokens) {
        if (card.tokens.has(t)) hits += 1;
        // Light stemming: "communities" vs "community", "careers" vs "career".
        else if (t.endsWith('s') && card.tokens.has(t.slice(0, -1))) hits += 1;
        else if (t.endsWith('ies') && card.tokens.has(t.slice(0, -3) + 'y')) hits += 1;
      }
      // Intent boosts so "learning community" questions prefer community cards.
      const text = question.toLowerCase();
      let boost = 0;
      if (/communit/.test(text) && card.kind === 'community') boost += 0.4;
      if (/(dislike|avoid|hate|don't|dont|not suit|bad fit)/.test(text) && card.kind === 'caution') boost += 0.4;
      if (/(career|job|work as)/.test(text) && card.kind === 'major') boost += 0.15;
      // If the student has results, nudge cards about their top majors.
      if (profile?.topIds?.includes(card.majorId)) boost += 0.05;
      const confidence = Math.min(1, hits / qTokens.length + boost);
      return { card, hits, confidence };
    })
    .filter((s) => s.hits > 0)
    .sort((a, b) => b.confidence - a.confidence || b.hits - a.hits);

  if (!scored.length || scored[0].confidence < CONFIDENCE_FLOOR) {
    return { status: 'unsure', confidence: scored[0]?.confidence ?? 0, alternatives: scored.slice(0, 3).map((s) => s.card) };
  }
  return {
    status: 'answer',
    confidence: scored[0].confidence,
    best: scored[0].card,
    alternatives: scored.slice(1, 3).map((s) => s.card),
  };
}

export const SUGGESTED_QUESTIONS = [
  'What is Software Engineering about?',
  'Which learning communities are there for Computer Science?',
  'Who might Mechanical Engineering not suit?',
  'How do I change my major?',
  'What careers come from Psychology?',
  'Is this official advising?',
];
