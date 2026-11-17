// SYNTHETIC alumni / student / faculty experience posts for the Alumni Network
// tab. Every author and story here is fictional, written to demonstrate the
// "Real Experiences" feature from the team PRD (F4). In a pilot these would be
// moderated posts from verified ISU accounts. Never present these as real.

export const POST_TEMPLATES = [
  { id: 'why', label: 'Why I chose ___' },
  { id: 'week', label: 'A real week in ___' },
  { id: 'switched', label: 'I switched from ___ to ___' },
  { id: 'wish', label: 'What I wish I knew' },
  { id: 'question', label: 'Question' },
];

export const ROLES = {
  alumni: { label: 'Alumni', tone: 'gold' },
  student: { label: 'Current student', tone: 'cardinal' },
  faculty: { label: 'Faculty', tone: 'ink' },
  advisor: { label: 'Advisor', tone: 'good' },
};

// `tags` use the same interest ids as the questionnaire so "people like you"
// can match on real overlap. `majorId` keys into majors.js.
export const alumniPosts = [
  {
    id: 'p1', role: 'alumni', author: 'Priya R.', gradYear: 2021, majorId: 'com-s', template: 'switched',
    title: 'I switched from Biology to Computer Science in my second year',
    body: 'I loved the problem-solving in bio labs but hated the memorization. A friend showed me a debugging session and it clicked. The switch cost me one extra semester because of the math sequence, and my advisor helped me map which science credits counted as electives. If you like puzzles more than facts, try an intro programming course before you decide.',
    tags: ['coding', 'math', 'science'], dislikes: ['labScience'], upvotes: 42, helped: 18,
  },
  {
    id: 'p2', role: 'student', author: 'Marcus T.', gradYear: 2027, majorId: 'se', template: 'week',
    title: 'A real week in Software Engineering (third year)',
    body: 'Mon/Wed: a team project standup, then a design lecture. Tue/Thu: algorithms and a lab where we write tests before code. Friday is usually a sprint review. The surprise for me was how much writing there is: design docs, test plans, retros. If you only want to code alone, this is not that.',
    tags: ['coding', 'building', 'communication'], dislikes: [], upvotes: 31, helped: 12,
  },
  {
    id: 'p3', role: 'alumni', author: 'Dana K.', gradYear: 2019, majorId: 'me', template: 'wish',
    title: 'What I wish I knew before Mechanical Engineering',
    body: 'Physics and calculus are the whole first year, and the machine-shop training is the best part. I wish I had joined a learning community earlier. Nobody told me the group-project load spikes junior year. Today I design HVAC systems and still use statics every week.',
    tags: ['building', 'math', 'science', 'design'], dislikes: [], upvotes: 27, helped: 9,
  },
  {
    id: 'p4', role: 'alumni', author: 'Sofia M.', gradYear: 2022, majorId: 'marketing', template: 'why',
    title: 'Why I chose Marketing after two semesters undeclared',
    body: 'I knew I liked people and stories but assumed business meant spreadsheets all day. Marketing turned out to be half analytics, half communication. The part I did not expect to love: presenting. The part I still dislike: statistics homework, though it was worth it.',
    tags: ['business', 'communication', 'people', 'design'], dislikes: ['math'], upvotes: 22, helped: 11,
  },
  {
    id: 'p5', role: 'faculty', author: 'Dr. L. Okafor', gradYear: null, majorId: 'psychology', template: 'wish',
    title: 'From a Psychology instructor: what surprises first-years',
    body: 'Students expect counseling conversations and get research methods and statistics first. That is by design: psychology is a science. If you dislike writing or data, talk to an advisor about what the first two years look like before committing. Those who stick with it often say the methods courses became their favorite.',
    tags: ['people', 'science', 'communication'], dislikes: [], upvotes: 35, helped: 20,
  },
  {
    id: 'p6', role: 'student', author: 'Ethan W.', gradYear: 2026, majorId: 'environmental-science', template: 'week',
    title: 'A real week in Environmental Science (field season)',
    body: 'Spring means two mornings a week in the field collecting water samples, then lab afternoons processing them. Lots of GIS and a surprising amount of writing reports. If you want to be outdoors and still do science, this fits. If you hate early mornings in the cold, think twice.',
    tags: ['environment', 'science', 'math'], dislikes: [], upvotes: 19, helped: 7,
  },
  {
    id: 'p7', role: 'alumni', author: 'Noor A.', gradYear: 2020, majorId: 'graphic-design', template: 'why',
    title: 'Why I chose Graphic Design (and what critique is really like)',
    body: 'Studio culture is intense: you pin your work up and people tell you what is not working. It stung the first semester, then it became the thing I valued most. Today I lead UX at a health-tech company. If you dislike feedback on your work, design school will be hard; if you can learn to love it, it is transformative.',
    tags: ['design', 'communication', 'coding'], dislikes: ['math'], upvotes: 29, helped: 14,
  },
  {
    id: 'p8', role: 'advisor', author: 'J. Lindqvist, Advising', gradYear: null, majorId: null, template: 'wish',
    title: 'An advisor on the best question students ask',
    body: '"What does a bad week in this major look like?" Students who ask about the hard parts, not just the exciting parts, make more durable choices. Bring your list of don\'ts to an advising appointment; it is more useful than a list of likes.',
    tags: ['people'], dislikes: [], upvotes: 48, helped: 26,
  },
  {
    id: 'p9', role: 'student', author: 'Aiden C.', gradYear: 2028, majorId: 'biology', template: 'question',
    title: 'Question: Biology but I dislike memorization. Am I in the wrong place?',
    body: 'First-year here. I love the lab work and ecology but dread the vocabulary-heavy exams. Is this just the first year, or the whole major?',
    tags: ['science', 'environment', 'health'], dislikes: [], upvotes: 14, helped: 0,
    replies: [
      { role: 'alumni', author: 'Priya R.', body: 'It eases after the intro sequence, but if the puzzle side is what you love, look at CS or data-leaning tracks too. I made that switch (see my post).' },
      { role: 'faculty', author: 'Dr. L. Okafor', body: 'Ask an advisor about research-focused upper-level options. Memorization-heavy courses are front-loaded in most science majors.' },
    ],
  },
];
