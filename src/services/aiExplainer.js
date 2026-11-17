// Optional AI explanation layer.
// =============================================================================
// WHAT THIS IS
// The product can optionally use a server-side AI model (e.g. Amazon Bedrock)
// to rephrase the deterministic engine's factor breakdown into friendlier
// natural language. Because this is a browser-only hackathon prototype with no
// backend and no AWS credentials, that path is UNAVAILABLE here and we never
// fake a model response. Instead we generate explanations deterministically
// from the real scoring factors (template-based), and clearly label them as
// rule-based, not AI.
//
// WHY IT IS STRUCTURED THIS WAY
//  - No AWS credentials or API keys ever touch the browser.
//  - Any future AI call MUST be grounded in the structured, verified major data
//    and the engine's factor breakdown. The model rephrases; it must not invent
//    ISU courses, learning communities, requirements, policies, salaries, or
//    graduation timelines.
//  - If the AI path fails or is disabled, we always fall back to the
//    deterministic explanation so the demo never breaks.
// =============================================================================

import { explainMatch } from '../lib/matcher.js';

// Feature flag. A real deployment would set this true only when a backend
// endpoint is configured; we keep it false so nothing claims to be AI output.
export const AI_AVAILABLE = false;

/**
 * Produce an explanation object for a scored major.
 * @returns { source: 'rule-based' | 'ai', reasons: string[], summary: string }
 */
export async function explain(scored, labels = {}) {
  if (AI_AVAILABLE) {
    try {
      return await explainWithAI(scored, labels);
    } catch {
      // Fall through to deterministic explanation on any error.
    }
  }
  const reasons = explainMatch(scored, labels);
  return {
    source: 'rule-based',
    reasons,
    summary: buildSummary(scored, reasons),
  };
}

function buildSummary(scored, reasons) {
  const lead =
    scored.fit >= 70
      ? `${scored.name} stands out for you.`
      : scored.fit >= 45
        ? `${scored.name} is a good fit to explore.`
        : `${scored.name} is worth a look.`;
  return `${lead} ${reasons[0] ?? ''}`.trim();
}

// Placeholder for the real server call. Intentionally not implemented in the
// browser prototype. A backend would:
//   1. Receive the scored major + verified data (never free-form user text alone)
//   2. Call Bedrock with a grounded prompt that forbids inventing facts
//   3. Return rephrased text alongside the same source citations
async function explainWithAI() {
  throw new Error('AI explanation endpoint is not configured in this prototype.');
}
