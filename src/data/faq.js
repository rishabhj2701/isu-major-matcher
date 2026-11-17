// Short FAQ cards for the rule-based "Ask the catalog" panel. Each answer is
// general guidance pointing at an official ISU resource; none states a policy
// detail we have not verified. Keep answers conservative.

export const faq = [
  {
    id: 'change-major',
    q: 'How do I change my major?',
    a: 'Changing majors at Iowa State goes through academic advising. Start by talking with your current advisor and the advising office of the college you want to move into; some majors have entry requirements. This tool does not verify those requirements — confirm them with an advisor.',
    source: { label: 'ISU Academic Advising', url: 'https://www.advising.iastate.edu/' },
    keywords: 'change switch switching major process declare undeclared transfer requirements gpa',
  },
  {
    id: 'official',
    q: 'Is this official advising?',
    a: 'No. ISU FitFinder is a student-built hackathon prototype. It gives informational guidance based on your self-selected interests and a transparent scoring model. It is not a degree audit, not a predictor of success, and not an official Iowa State University service.',
    source: { label: 'ISU Academic Advising', url: 'https://www.advising.iastate.edu/' },
    keywords: 'official advising advisor real accurate trust prototype disclaimer',
  },
  {
    id: 'score',
    q: 'How is the fit score calculated?',
    a: 'Each major is scored on five weighted factors: interests (35%), academic strengths (20%), career alignment (20%), working style (15%) and stated priorities (10%). Majors that lean on an activity you dislike get a capped penalty (at most 25 points) so nothing is ever hidden. The weights are documented product assumptions, not research-validated.',
    source: { label: 'Matching engine (src/lib/matcher.js)', url: 'https://github.com/rishabhj2701/isu-major-matcher' },
    keywords: 'score fit calculated weights percent overlap penalty how works algorithm engine',
  },
  {
    id: 'graduation',
    q: 'Will switching delay my graduation?',
    a: 'That depends on your completed credits and the prerequisite sequences in the new major, which this tool cannot see. We deliberately do not estimate a graduation date. An advisor can run a degree audit and show which credits carry over.',
    source: { label: 'ISU Academic Advising', url: 'https://www.advising.iastate.edu/' },
    keywords: 'graduation graduate delay time degree semesters credits audit sooner longer',
  },
  {
    id: 'cost',
    q: 'What does a major cost?',
    a: 'We do not publish tuition or financial-aid figures here because we have not verified them. Use the official ISU Office of Student Financial Aid and the tuition pages, and ask an advisor how extra semesters or prerequisite sequences could affect cost.',
    source: { label: 'ISU Student Financial Aid', url: 'https://www.financialaid.iastate.edu/' },
    keywords: 'cost tuition money afford affordability financial aid scholarship price',
  },
  {
    id: 'lc-what',
    q: 'What is a learning community?',
    a: 'ISU learning communities group students (often first-years in the same major) into shared courses and activities with peer mentors and faculty connections. Availability and eligibility vary by community; browse the official directory and ask your advisor how to join.',
    source: { label: 'ISU Learning Communities', url: 'https://www.learningcommunities.iastate.edu/' },
    keywords: 'learning community communities what is join benefits peer mentor cohort',
  },
  {
    id: 'careers',
    q: 'Where can I get career information?',
    a: 'ISU Career Services offers advising, career fairs and outcome information. The major cards here list broad career directions only; we do not publish salary figures because we have not verified them.',
    source: { label: 'ISU Career Services', url: 'https://www.career.iastate.edu/' },
    keywords: 'career careers job jobs salary outcomes services fair employment',
  },
];
