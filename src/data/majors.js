// ISU Major & Learning-Community Matcher — structured major data
// =============================================================================
// VERIFICATION POLICY
// -----------------------------------------------------------------------------
// Each major record carries a `verification` object. Facts fall into two groups:
//
//   verified: name, college, catalogUrl, and the one-line overview were checked
//             against the official ISU catalog (catalog.iastate.edu) on the date
//             in `verification.checkedOn`.
//
//   illustrative: interestWeights, strengthWeights, careerFields, workStyles and
//             the dislikeSensitivity are PRODUCT ASSUMPTIONS used by the matching
//             engine. They are not research-validated academic data. They exist
//             so the demo can rank majors transparently and are easy to edit.
//
// Course codes (`sampleCourses`) and learning communities (`learningCommunities`,
// in ./learningCommunities.js) are only listed where we could point to an
// official source. Where a specific course list or community association could
// not be verified, we deliberately leave it empty and send students to the
// official page instead of inventing one. ISU has moved to 4-digit course
// numbers; always confirm current numbers on the catalog before presenting them.
// =============================================================================

// Interest categories the questionnaire collects. Keep ids stable; the engine
// and the major weights key off these ids.
export const interestOptions = [
  { id: 'coding', label: 'Programming & technology', emoji: '💻' },
  { id: 'math', label: 'Math & problem solving', emoji: '📐' },
  { id: 'science', label: 'Science & research', emoji: '🔬' },
  { id: 'building', label: 'Building & engineering', emoji: '⚙️' },
  { id: 'design', label: 'Design & creativity', emoji: '🎨' },
  { id: 'business', label: 'Business & entrepreneurship', emoji: '📈' },
  { id: 'people', label: 'Helping & working with people', emoji: '🤝' },
  { id: 'communication', label: 'Writing & communication', emoji: '✍️' },
  { id: 'environment', label: 'Environment & sustainability', emoji: '🌱' },
  { id: 'health', label: 'Health & the human body', emoji: '🩺' },
];

// Academic strengths (what the student feels they are good at).
export const strengthOptions = [
  { id: 'math', label: 'Mathematics' },
  { id: 'logic', label: 'Logic & analysis' },
  { id: 'writing', label: 'Writing' },
  { id: 'labScience', label: 'Lab science' },
  { id: 'spatial', label: 'Visualizing & building things' },
  { id: 'social', label: 'Communicating with people' },
  { id: 'creativity', label: 'Creative work' },
];

// Working/learning styles.
export const workStyleOptions = [
  { id: 'analytical', label: 'Analytical', hint: 'Dig into data and logic' },
  { id: 'creative', label: 'Creative', hint: 'Invent and design' },
  { id: 'technical', label: 'Technical', hint: 'Build and operate systems' },
  { id: 'practical', label: 'Hands-on', hint: 'Work with real things' },
  { id: 'people', label: 'People-focused', hint: 'Collaborate and help' },
];

// Broad career fields.
export const careerFieldOptions = [
  { id: 'technology', label: 'Technology & software' },
  { id: 'engineering', label: 'Engineering & manufacturing' },
  { id: 'healthcare', label: 'Healthcare & life science' },
  { id: 'businessFinance', label: 'Business & finance' },
  { id: 'creativeMedia', label: 'Design & media' },
  { id: 'environment', label: 'Environment & sustainability' },
  { id: 'research', label: 'Research & academia' },
  { id: 'socialImpact', label: 'Education & social impact' },
];

// What the student prioritizes most. Drives the "priorities" nudge in results.
export const priorityOptions = [
  { id: 'career', label: 'Career alignment' },
  { id: 'interests', label: 'Following my interests' },
  { id: 'affordability', label: 'Affordability' },
  { id: 'graduateSooner', label: 'Graduating sooner' },
];

// -----------------------------------------------------------------------------
// Majors. Weights are on a 0..1 scale and are illustrative (see policy above).
// Only interest/strength/career/style keys that matter are listed; missing keys
// are treated as 0 by the engine.
// -----------------------------------------------------------------------------
export const majors = [
  {
    id: 'com-s',
    name: 'Computer Science',
    college: 'College of Liberal Arts and Sciences',
    summary:
      'Study software, algorithms, and computing systems, with a strong grounding in mathematics and problem-solving.',
    interestWeights: { coding: 1, math: 0.8, science: 0.5, design: 0.3, business: 0.2 },
    strengthWeights: { math: 0.9, logic: 1, spatial: 0.3, creativity: 0.3 },
    careerFields: { technology: 1, research: 0.6, businessFinance: 0.3 },
    workStyles: { analytical: 1, technical: 0.9, creative: 0.4, practical: 0.3 },
    // Activities this major leans on heavily; disliking these should lower fit.
    dislikeSensitivity: { math: 0.9, logic: 0.8, labScience: 0.1 },
    goodIf: ['You enjoy logic and mathematics', 'You like designing and debugging software'],
    cautionIf: ['You dislike math-heavy coursework', 'You prefer little screen or coding time'],
    sampleCourses: [], // Course numbers recently changed to 4-digit; see official four-year plan.
    careers: ['Software developer', 'Data scientist', 'Systems analyst'],
    catalogUrl: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/computerscience/',
    verification: { status: 'verified-core', checkedOn: '2025-11-17', note: 'Name, college, overview and catalog URL confirmed via ISU catalog.' },
  },
  {
    id: 'se',
    name: 'Software Engineering',
    college: 'College of Engineering / College of Liberal Arts and Sciences',
    summary:
      'Design, build, and evaluate large software systems across their lifecycle, working in engineering teams. ABET-accredited.',
    interestWeights: { coding: 1, math: 0.7, building: 0.5, design: 0.4, business: 0.3 },
    strengthWeights: { math: 0.8, logic: 1, spatial: 0.4, social: 0.4 },
    careerFields: { technology: 1, engineering: 0.6, businessFinance: 0.3 },
    workStyles: { technical: 1, analytical: 0.9, creative: 0.4, people: 0.4 },
    dislikeSensitivity: { math: 0.8, logic: 0.8 },
    goodIf: ['You like building software as part of a team', 'You enjoy engineering and problem-solving'],
    cautionIf: ['You dislike structured engineering process', 'You prefer solo creative work over teams'],
    sampleCourses: [],
    careers: ['Software engineer', 'QA / test engineer', 'DevOps engineer'],
    catalogUrl: 'https://catalog.iastate.edu/collegeofengineering/softwareengineering/',
    verification: { status: 'verified-core', checkedOn: '2025-11-17', note: 'Name, joint college administration, ABET accreditation, overview and catalog URL confirmed via ISU catalog.' },
  },
  {
    id: 'me',
    name: 'Mechanical Engineering',
    college: 'College of Engineering',
    summary:
      'Apply motion, energy, and force to design mechanical systems, from engines to medical devices. ABET-accredited.',
    interestWeights: { building: 1, math: 0.8, science: 0.7, design: 0.5, environment: 0.3 },
    strengthWeights: { math: 0.9, spatial: 1, logic: 0.7, labScience: 0.5 },
    careerFields: { engineering: 1, technology: 0.4, research: 0.4, environment: 0.3 },
    workStyles: { technical: 1, practical: 0.9, analytical: 0.8, creative: 0.5 },
    dislikeSensitivity: { math: 0.9, labScience: 0.5, spatial: 0.4 },
    goodIf: ['You like designing and building physical systems', 'You are strong in math and physics'],
    cautionIf: ['You dislike heavy math and physics', 'You prefer purely desk-based work'],
    sampleCourses: [],
    careers: ['Mechanical engineer', 'Design engineer', 'Manufacturing engineer'],
    catalogUrl: 'https://catalog.iastate.edu/collegeofengineering/mechanicalengineering/',
    verification: { status: 'verified-core', checkedOn: '2025-11-17', note: 'Name, college, ABET accreditation, overview and catalog URL confirmed via ISU catalog.' },
  },
  {
    id: 'biology',
    name: 'Biology',
    college: 'College of Liberal Arts and Sciences / College of Agriculture and Life Sciences',
    summary:
      'Study living organisms and systems, with laboratory and research experience that supports health, science, and graduate paths.',
    interestWeights: { science: 1, health: 0.7, environment: 0.6, math: 0.4 },
    strengthWeights: { labScience: 1, logic: 0.6, math: 0.5, writing: 0.4 },
    careerFields: { healthcare: 0.8, research: 0.9, environment: 0.5 },
    workStyles: { analytical: 0.8, practical: 0.7, creative: 0.3, people: 0.4 },
    dislikeSensitivity: { labScience: 0.9, math: 0.3 },
    goodIf: ['You enjoy lab science and living systems', 'You are considering health or research paths'],
    cautionIf: ['You dislike laboratory work', 'You want minimal science coursework'],
    sampleCourses: [],
    careers: ['Research technician', 'Lab scientist', 'Healthcare / graduate school track'],
    catalogUrl: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/biology/',
    verification: { status: 'verified-core', checkedOn: '2025-11-17', note: 'Name and catalog URL confirmed via ISU catalog. Confirm current college administration on the catalog page.' },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    college: 'Ivy College of Business',
    summary:
      'Study how products and services reach audiences, blending business strategy, communication, and analytics.',
    interestWeights: { business: 1, communication: 0.8, people: 0.7, design: 0.5, coding: 0.2 },
    strengthWeights: { social: 0.9, writing: 0.8, creativity: 0.7, logic: 0.5 },
    careerFields: { businessFinance: 1, creativeMedia: 0.6, technology: 0.3 },
    workStyles: { people: 1, creative: 0.8, analytical: 0.6, practical: 0.3 },
    dislikeSensitivity: { math: 0.2, social: 0.6, writing: 0.5 },
    goodIf: ['You like business strategy and communication', 'You enjoy understanding people and audiences'],
    cautionIf: ['You prefer little interaction with people', 'You dislike writing and presenting'],
    sampleCourses: [],
    careers: ['Marketing analyst', 'Brand / product marketing', 'Sales and strategy'],
    catalogUrl: 'https://catalog.iastate.edu/ivycollegeofbusiness/marketing/',
    verification: { status: 'verified-core', checkedOn: '2025-11-17', note: 'Name, Ivy College of Business and catalog URL confirmed via ISU catalog.' },
  },
  {
    id: 'psychology',
    name: 'Psychology',
    college: 'College of Liberal Arts and Sciences',
    summary:
      'Study behavior and the mind using scientific methods, with applications across health, business, and social impact.',
    interestWeights: { people: 1, science: 0.6, health: 0.5, communication: 0.6, math: 0.3 },
    strengthWeights: { social: 1, writing: 0.7, logic: 0.6, math: 0.4 },
    careerFields: { socialImpact: 0.9, healthcare: 0.6, research: 0.6, businessFinance: 0.3 },
    workStyles: { people: 1, analytical: 0.7, creative: 0.4 },
    dislikeSensitivity: { social: 0.7, writing: 0.5, math: 0.3 },
    goodIf: ['You are curious about behavior and the mind', 'You like helping and working with people'],
    cautionIf: ['You dislike writing and research methods', 'You prefer to avoid statistics'],
    sampleCourses: [],
    careers: ['Human resources', 'Counseling / graduate school track', 'User research'],
    catalogUrl: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/psychology/',
    verification: { status: 'verified-core', checkedOn: '2025-11-17', note: 'Name, college and catalog URL confirmed via ISU catalog.' },
  },
  {
    id: 'environmental-science',
    name: 'Environmental Science',
    college: 'College of Agriculture and Life Sciences / College of Liberal Arts and Sciences',
    summary:
      'Study environmental systems and apply science to challenges such as water, soil, climate, and sustainability.',
    interestWeights: { environment: 1, science: 0.9, math: 0.5, building: 0.3, health: 0.3 },
    strengthWeights: { labScience: 0.9, logic: 0.7, math: 0.6, writing: 0.5 },
    careerFields: { environment: 1, research: 0.7, engineering: 0.3, socialImpact: 0.4 },
    workStyles: { analytical: 0.8, practical: 0.8, people: 0.3 },
    dislikeSensitivity: { labScience: 0.7, math: 0.4 },
    goodIf: ['You care about the environment and sustainability', 'You enjoy field and lab science'],
    cautionIf: ['You dislike science coursework', 'You want to avoid fieldwork'],
    sampleCourses: [],
    careers: ['Environmental scientist', 'Sustainability analyst', 'Conservation / policy roles'],
    catalogUrl: 'https://catalog.iastate.edu/collegeofagricultureandlifesciences/environmentalscience/',
    verification: { status: 'verified-core', checkedOn: '2025-11-17', note: 'Name and catalog URL confirmed via ISU catalog. Confirm current college administration on the catalog page.' },
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    college: 'College of Design',
    summary:
      'Shape visual communication across print, digital, and brand experiences in a studio-based design program.',
    interestWeights: { design: 1, communication: 0.7, coding: 0.4, business: 0.4, people: 0.4 },
    strengthWeights: { creativity: 1, spatial: 0.7, social: 0.5, writing: 0.5 },
    careerFields: { creativeMedia: 1, technology: 0.4, businessFinance: 0.3 },
    workStyles: { creative: 1, practical: 0.6, people: 0.5, technical: 0.4 },
    dislikeSensitivity: { creativity: 0.8, spatial: 0.4 },
    goodIf: ['You love visual and creative work', 'You want a studio, portfolio-based path'],
    cautionIf: ['You prefer highly quantitative work', 'You dislike critique and iteration'],
    sampleCourses: [],
    careers: ['Graphic designer', 'UX / UI designer', 'Brand / creative roles'],
    catalogUrl: 'https://catalog.iastate.edu/collegeofdesign/graphicdesign/',
    verification: { status: 'verified-core', checkedOn: '2025-11-17', note: 'Name, College of Design and catalog URL confirmed via ISU catalog.' },
  },
];

// Backwards-compatible aliases for any code still importing the old names.
export const sampleMajors = majors;
