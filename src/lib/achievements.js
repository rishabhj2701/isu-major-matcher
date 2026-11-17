// Achievement badges. Each unlocks from real actions in this session; none
// affect a match score. Pure function so it is easy to test.

export const ACHIEVEMENTS = [
  { id: 'quest', emoji: '🧭', name: 'Quest Complete', how: 'Finish the Major Quest', test: (c) => c.hasProfile },
  { id: 'honest', emoji: '🛡️', name: 'Honest Explorer', how: "Mark at least one don't", test: (c) => (c.profile?.dislikes?.length ?? 0) > 0 },
  { id: 'whatif', emoji: '🔮', name: 'What-If Wizard', how: "Toggle a don't on your matches", test: (c) => (c.counts.dontToggle ?? 0) > 0 },
  { id: 'stargazer', emoji: '✨', name: 'Stargazer', how: 'Open a major from the constellation', test: (c) => (c.counts.starClick ?? 0) > 0 },
  { id: 'scout', emoji: '🔭', name: 'Scout', how: 'Open 3 different majors', test: (c) => (c.recentCount ?? 0) >= 3 },
  { id: 'comparer', emoji: '⚖️', name: 'Comparer', how: 'Compare two majors', test: (c) => c.visited.includes('compare') },
  { id: 'mind', emoji: '🧠', name: 'Mind Mapper', how: 'Finish Level 1 aptitude', test: (c) => Boolean(c.profile?.thinking) },
  { id: 'voice', emoji: '💬', name: 'Community Voice', how: 'Post a comment', test: (c) => (c.counts.comment ?? 0) > 0 },
  { id: 'curious', emoji: '❓', name: 'Curious Mind', how: 'Ask the catalog 3 questions', test: (c) => (c.counts.ask ?? 0) >= 3 },
  { id: 'ready', emoji: '🎓', name: 'Advisor Ready', how: 'Open your advising summary', test: (c) => c.visited.includes('summary') },
];

export function unlockedIds(ctx) {
  const c = { profile: null, visited: [], counts: {}, recentCount: 0, ...ctx };
  c.hasProfile = Boolean(c.profile?.interests?.length);
  return ACHIEVEMENTS.filter((a) => a.test(c)).map((a) => a.id);
}
