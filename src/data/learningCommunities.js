// Learning-community references.
// =============================================================================
// Iowa State runs many first-year and major-based learning communities through
// its Learning Communities program (learningcommunities.iastate.edu). The
// SPECIFIC community-to-major associations below could NOT be individually
// verified against the official directory at build time, so every entry is
// marked `status: 'unverified'` and the UI treats it as such: it points
// students to the official directory rather than presenting a guaranteed match.
//
// To make an association official, confirm it on the ISU Learning Communities
// directory, then set `status: 'verified'` and add a `sourceUrl`. Do NOT invent
// communities or imply guaranteed eligibility.
// =============================================================================

export const LEARNING_COMMUNITIES_DIRECTORY =
  'https://www.learningcommunities.iastate.edu/';

// Keyed by major id. Empty array = no entry; the UI shows the directory link.
export const learningCommunitiesByMajor = {
  'com-s': [
    {
      name: 'Computer Science first-year learning community',
      forStudents: 'Incoming Computer Science students',
      benefit:
        'Learning communities typically connect first-year students with peers, faculty, and support in their major.',
      status: 'unverified',
      note: 'Confirm the current community name and availability on the official directory.',
    },
  ],
  se: [
    {
      name: 'Software Engineering first-year learning community',
      forStudents: 'Incoming Software Engineering students',
      benefit: 'Peer cohort, shared courses, and faculty connection during the first year.',
      status: 'unverified',
      note: 'Confirm on the official directory.',
    },
  ],
  me: [
    {
      name: 'Mechanical Engineering learning community',
      forStudents: 'Incoming Mechanical Engineering students',
      benefit: 'Engineering peer cohort and early connection to the department.',
      status: 'unverified',
      note: 'Confirm on the official directory.',
    },
  ],
  // Majors without a listed entry fall back to the directory link in the UI.
};

export function getLearningCommunities(majorId) {
  return learningCommunitiesByMajor[majorId] ?? [];
}
