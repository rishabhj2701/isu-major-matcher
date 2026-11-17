// Generates the "questions to bring to your advisor" list from the student's
// actual profile and top matches. Deterministic and template-based: every
// question is traceable to a specific input (a dislike, a priority, a year,
// a near-tie between two majors). No AI involved.

import { interestOptions, priorityOptions } from '../data/majors.js';

const INTEREST_LABEL = Object.fromEntries(interestOptions.map((o) => [o.id, o.label]));
const PRIORITY_LABEL = Object.fromEntries(priorityOptions.map((o) => [o.id, o.label]));

/**
 * @param {object} profile  the questionnaire profile
 * @param {Array}  top      scored majors (from matchMajors), best first
 * @returns {Array<{id:string, text:string, why:string, tag:string}>}
 */
export function buildAdvisorQuestions(profile = {}, top = []) {
  const q = [];
  const dislikes = profile.dislikes ?? [];
  const first = top[0];
  const second = top[1];

  // Always-useful core questions.
  q.push({
    id: 'credits',
    tag: 'Credits',
    text: 'Which of these majors fits my completed credits best, and what would carry over?',
    why: 'A degree audit needs your record; this tool never estimates it.',
  });

  if (profile.status === 'changing' || profile.currentMajor) {
    q.push({
      id: 'switch',
      tag: 'Switching',
      text: `If I move from ${profile.currentMajor || 'my current major'}, what is the change-of-major process and are there GPA or course requirements?`,
      why: 'You said you are considering a change.',
    });
  }

  if (profile.priority === 'graduateSooner' || profile.priority === 'affordability') {
    q.push({
      id: 'time',
      tag: PRIORITY_LABEL[profile.priority],
      text: `Could switching add semesters? Which prerequisite sequences would I need to start first?`,
      why: `You said ${PRIORITY_LABEL[profile.priority].toLowerCase()} matters most.`,
    });
  }

  // Don'ts: one question per disliked activity that still shows up in the top match.
  if (first && dislikes.length) {
    const drivers = (first.dislikeDrivers ?? []).map((d) => INTEREST_LABEL[d.id] ?? d.id);
    if (drivers.length) {
      q.push({
        id: 'dislike',
        tag: "Your don'ts",
        text: `${first.name} leans on ${drivers.join(' and ')}, which I'd rather avoid. How heavy is that in the first two years, and are there tracks that lighten it?`,
        why: 'Your dislikes lowered this major but did not remove it.',
      });
    }
  }

  // Near tie between the top two majors.
  if (first && second && Math.abs(first.fit - second.fit) <= 6) {
    q.push({
      id: 'tie',
      tag: 'Near tie',
      text: `${first.name} and ${second.name} scored almost the same for me. What is the day-to-day difference, and is there a shared first-year course I could take to test both?`,
      why: `Scores were ${first.fit} and ${second.fit}, within six points.`,
    });
  }

  if (first) {
    q.push({
      id: 'try',
      tag: 'Try it',
      text: `What introductory course in ${first.name} could I take next semester to test the fit without delaying graduation?`,
      why: 'Low-risk way to validate the top match.',
    });
  }

  q.push({
    id: 'lc',
    tag: 'Community',
    text: 'Which learning communities am I eligible for, and how do I join?',
    why: 'Eligibility is not verified by this tool.',
  });

  if (profile.year === 'Third year' || profile.year === 'Fourth year or beyond') {
    q.push({
      id: 'late',
      tag: 'Timing',
      text: 'Given where I am, would a minor or certificate get me most of what I want faster than a full switch?',
      why: 'You are past the second year.',
    });
  }

  q.push({
    id: 'minor',
    tag: 'Combine',
    text: 'Are there minors or second majors that combine well with my interests?',
    why: 'Keeps options open beyond a single major.',
  });

  return q;
}

export function questionsToText(questions) {
  return questions.map((x, i) => `${i + 1}. ${x.text}`).join('\n');
}
