// Transparent, deterministic major-matching engine.
// =============================================================================
// This is NOT a trained AI model and NOT a validated predictor of student
// success. It is a reproducible weighted-overlap score designed so every number
// can be explained from its inputs. All weights below are illustrative product
// assumptions, documented and easy to change.
//
// Scoring overview, per major:
//   factorScore = weighted overlap between the student's selections and the
//                 major's illustrative weights, normalized to 0..1.
//   Five factors are combined with FACTOR_WEIGHTS (sum = 1):
//     interests, strengths, careerFit, workStyle, priorities.
//   A negative-preference penalty then reduces the score for majors that lean
//   heavily on an activity the student disliked. The penalty is capped so it
//   never eliminates an option outright (see DISLIKE_PENALTY_CAP).
//   Final fit = round((combined - penalty) * 100), clamped to 0..100.
// =============================================================================

import { majors as defaultMajors } from '../data/majors.js';

// Illustrative weighting model. Edit freely; the UI reads these back for
// transparency. Must sum to 1.0.
export const FACTOR_WEIGHTS = {
  interests: 0.35,
  strengths: 0.2,
  careerFit: 0.2,
  workStyle: 0.15,
  priorities: 0.1,
};

// A disliked activity can remove at most this fraction of the combined score.
export const DISLIKE_PENALTY_CAP = 0.25;

// Map a student's "most important priority" onto majors it tends to favor.
// Illustrative only. Keys are priority ids; values add a small priority signal.
const PRIORITY_AFFINITY = {
  // Career alignment rewards majors with strong, concentrated career fields.
  career: (major) => maxWeight(major.careerFields),
  // Following interests rewards majors with strong interest overlap (handled by
  // the interests factor already); give a neutral baseline here.
  interests: () => 0.5,
  // Affordability / graduating sooner are advising conversations, not data we
  // can compute from incomplete records, so we keep these neutral and surface
  // them as notes in the results instead of fabricating a number.
  affordability: () => 0.5,
  graduateSooner: () => 0.5,
};

function maxWeight(weightMap) {
  const values = Object.values(weightMap ?? {});
  return values.length ? Math.max(...values) : 0;
}

// Overlap of a set of selected ids against a weight map, normalized by the
// total available weight so a major with few weighted keys isn't penalized.
// Returns 0..1.
function weightedOverlap(selectedIds, weightMap) {
  const total = Object.values(weightMap ?? {}).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  const hit = selectedIds.reduce((sum, id) => sum + (weightMap[id] ?? 0), 0);
  return clamp01(hit / total);
}

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

// Normalize the student's profile so missing arrays don't throw.
function normalizeProfile(profile = {}) {
  return {
    interests: profile.interests ?? [],
    dislikes: profile.dislikes ?? [], // subject/activity ids the student dislikes
    strengths: profile.strengths ?? [],
    careerFields: profile.careerFields ?? [],
    workStyles: profile.workStyles ?? [],
    priority: profile.priority ?? null, // single priority id
  };
}

// Compute the dislike penalty (0..DISLIKE_PENALTY_CAP). A major is penalized in
// proportion to how strongly it depends on the activities the student disliked.
function dislikePenalty(dislikes, major) {
  if (!dislikes.length) return { penalty: 0, drivers: [] };
  const sens = major.dislikeSensitivity ?? {};
  const drivers = [];
  let worst = 0;
  for (const d of dislikes) {
    const s = sens[d] ?? 0;
    if (s > 0) {
      drivers.push({ id: d, strength: s });
      worst = Math.max(worst, s);
    }
  }
  // Use the single strongest dependency so multiple mild dislikes don't stack
  // into an unfair wipeout. Scale by the cap.
  return { penalty: worst * DISLIKE_PENALTY_CAP, drivers };
}

/**
 * Score a single major against a student profile.
 * Returns the major plus a detailed, explainable breakdown.
 */
export function scoreMajor(profile, major) {
  const p = normalizeProfile(profile);

  const factors = {
    interests: weightedOverlap(p.interests, major.interestWeights),
    strengths: weightedOverlap(p.strengths, major.strengthWeights),
    careerFit: weightedOverlap(p.careerFields, major.careerFields),
    workStyle: weightedOverlap(p.workStyles, major.workStyles),
    priorities: p.priority ? (PRIORITY_AFFINITY[p.priority]?.(major) ?? 0.5) : 0.5,
  };

  const combined = Object.entries(FACTOR_WEIGHTS).reduce(
    (sum, [key, w]) => sum + w * factors[key],
    0
  );

  const { penalty, drivers } = dislikePenalty(p.dislikes, major);
  const fit = Math.round(clamp01(combined - penalty) * 100);

  // Per-factor contribution to the final (pre-penalty) score, for the UI.
  const contributions = Object.fromEntries(
    Object.entries(FACTOR_WEIGHTS).map(([key, w]) => [
      key,
      Math.round(w * factors[key] * 100),
    ])
  );

  return {
    ...major,
    fit,
    factors, // 0..1 per factor
    contributions, // points each factor added (pre-penalty)
    penalty: Math.round(penalty * 100),
    dislikeDrivers: drivers, // which disliked activities caused the penalty
  };
}

// Qualitative band for a fit score, so we never imply a precise probability.
export function fitBand(fit) {
  if (fit >= 70) return { label: 'Strong match', tone: 'strong' };
  if (fit >= 45) return { label: 'Good match', tone: 'good' };
  if (fit >= 25) return { label: 'Worth exploring', tone: 'explore' };
  return { label: 'Lower overlap', tone: 'low' };
}

// Human-readable reasons derived from the actual factor contributions, so the
// explanation always matches the score. Returns an array of short strings.
export function explainMatch(scored, labels = {}) {
  const reasons = [];
  const byContribution = Object.entries(scored.contributions)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const factorPhrase = {
    interests: 'your selected interests',
    strengths: 'your academic strengths',
    careerFit: 'the career fields you chose',
    workStyle: 'your preferred working style',
    priorities: 'what you said matters most',
  };

  for (const [key, points] of byContribution.slice(0, 3)) {
    if (key === 'priorities') continue; // neutral baseline; not a real driver
    reasons.push(`Aligns with ${factorPhrase[key]} (+${points} pts)`);
  }

  if (scored.penalty > 0 && scored.dislikeDrivers.length) {
    const disliked = scored.dislikeDrivers
      .map((d) => labels[d.id] ?? d.id)
      .join(', ');
    reasons.push(
      `Lowered by −${scored.penalty} pts because this major leans on: ${disliked}`
    );
  }

  if (!reasons.length) {
    reasons.push('Limited overlap with your current selections — explore to learn more.');
  }
  return reasons;
}

/**
 * Rank majors for a student profile.
 * @returns array of scored majors sorted by fit (desc), stable by name.
 */
export function matchMajors(profile, majors = defaultMajors) {
  return majors
    .map((major) => scoreMajor(profile, major))
    .sort((a, b) => b.fit - a.fit || a.name.localeCompare(b.name));
}

/** Convenience: top N (default 3) matches. */
export function topMatches(profile, n = 3, majors = defaultMajors) {
  return matchMajors(profile, majors).slice(0, n);
}
