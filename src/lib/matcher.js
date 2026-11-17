import { sampleMajors } from '../data/majors.js';

/**
 * Deterministic scoring for demo transparency.
 * This is NOT a trained AI model or an official academic recommendation.
 */
export function matchMajors(selectedInterests, majors = sampleMajors) {
  if (!Array.isArray(selectedInterests) || selectedInterests.length === 0) return [];
  const selected = new Set(selectedInterests);
  return majors
    .map((major) => {
      const matched = major.tags.filter((tag) => selected.has(tag));
      return { ...major, score: matched.length, matched };
    })
    .filter((major) => major.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 3);
}
