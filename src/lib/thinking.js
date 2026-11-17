// "Thinking Worlds" — three short, original mini-games (Number Forge, Logic
// Lab, Idea Garden) adapted from the team's PRD §5. They produce a RELATIVE
// thinking snapshot for self-reflection. Design rules honored:
//   - Items are original (not copied from well-known tests).
//   - Soft timers only; no task depends on reaction speed.
//   - Results are shown as relative strengths with a range, never a raw score
//     compared to other people, and NEVER feed the major fit score.
//   - Creative fluency is counted locally (number of distinct ideas). The PRD's
//     LLM originality scoring needs a backend and is not simulated here.

export const WORLDS = [
  {
    id: 'quant',
    name: 'Number Forge',
    emoji: '🔢',
    tagline: 'Patterns, quantities and estimates.',
    measures: 'Quantitative thinking',
    framing: 'The Ames bridge-sensor team needs quick numbers.',
    items: [
      {
        id: 'q1',
        prompt: 'Sensor readings arrive every cycle: 3, 7, 15, 31, … What comes next?',
        options: ['47', '63', '59', '62'],
        answer: '63',
        explain: 'Each value doubles and adds one (31 × 2 + 1 = 63).',
      },
      {
        id: 'q2',
        prompt: 'A 240 m bridge gets a sensor every 15 m, with one at each end. About how many sensors?',
        options: ['15', '16', '17', '24'],
        answer: '17',
        explain: '240 ÷ 15 = 16 gaps, which needs 17 sensors including both ends.',
      },
      {
        id: 'q3',
        prompt: 'Battery drain: 100%, 94%, 82%, 64%, … Which reading comes next?',
        options: ['46%', '40%', '52%', '58%'],
        answer: '40%',
        explain: 'The drops grow by 6 each time: 6, 12, 18, then 24 (64 − 24 = 40).',
      },
    ],
  },
  {
    id: 'analytical',
    name: 'Logic Lab',
    emoji: '🧩',
    tagline: 'Spot the trap, check the rule.',
    measures: 'Analytical reflection',
    framing: 'A lab schedule has conflicts. Which assignment is forced?',
    items: [
      {
        id: 'a1',
        prompt: 'A lab kit and a notebook cost $22 together. The kit costs $20 more than the notebook. How much is the notebook?',
        options: ['$2', '$1', '$1.50', '$3'],
        answer: '$1',
        explain: 'If the notebook is $1, the kit is $21, and $1 + $21 = $22. The tempting “$2” fails the check.',
      },
      {
        id: 'a2',
        prompt: 'Rule: every student who is in the Tuesday lab is also in the Thursday lecture. Jordan is in the Thursday lecture. What follows for sure?',
        options: ['Jordan is in the Tuesday lab', 'Jordan is not in the Tuesday lab', 'Nothing about the Tuesday lab', 'Jordan skips both'],
        answer: 'Nothing about the Tuesday lab',
        explain: 'The rule only runs one way. Being in the lecture does not tell us about the lab.',
      },
      {
        id: 'a3',
        prompt: 'Three bench slots. Ana cannot sit next to Ben. Ben must be in the middle. Where is Ana?',
        options: ['Left', 'Right', 'Either end', 'Impossible'],
        answer: 'Impossible',
        explain: 'If Ben is in the middle, both ends are next to him, so Ana has no legal seat.',
      },
    ],
  },
  {
    id: 'creative',
    name: 'Idea Garden',
    emoji: '🎨',
    tagline: 'How many different uses can you think of?',
    measures: 'Divergent thinking (fluency only)',
    framing: 'A design studio asks: what else could a lab beaker be used for?',
    type: 'alt-uses',
    object: 'a lab beaker',
    seconds: 60,
  },
];

// Split free text into distinct ideas (one per line or comma).
export function countIdeas(text = '') {
  const ideas = text
    .split(/[\n,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 2);
  return new Set(ideas).size;
}

/**
 * Produce the relative snapshot.
 * @param {object} results  { quant: {correct, total}, analytical: {correct,total}, creative: {ideas} }
 */
export function summarizeThinking(results = {}) {
  const raw = {
    quant: ratio(results.quant),
    analytical: ratio(results.analytical),
    // Fluency: cap at 10 ideas → 1.0, as in the team's Tech Spec.
    creative: results.creative ? Math.min(1, (results.creative.ideas ?? 0) / 10) : null,
  };
  const played = Object.entries(raw).filter(([, v]) => v !== null);
  if (!played.length) return null;
  const mean = played.reduce((s, [, v]) => s + v, 0) / played.length;
  const dims = played
    .map(([key, v]) => ({
      key,
      name: WORLDS.find((w) => w.id === key)?.measures ?? key,
      raw: v,
      relative: v - mean, // within-person tilt
      // Three items are noisy: show a wide band, as the PRD requires.
      band: 0.3,
    }))
    .sort((a, b) => b.relative - a.relative);
  return { dims, strongest: dims[0], note: 'Three short tasks per world: a rough, within-person snapshot for reflection. It never changes your major score.' };
}

function ratio(r) {
  if (!r || !r.total) return null;
  return r.correct / r.total;
}
