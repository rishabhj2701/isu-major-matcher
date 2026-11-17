// Full ISU undergraduate major catalog (reference tier).
// =============================================================================
// SOURCE & VERIFICATION
// Every entry's name, college, and degree were taken from the official Iowa
// State University catalog (catalog.iastate.edu), 2026-2027 edition, fetched
// 2025-11-17 from each college's "Degree Programs / Undergraduate Majors" list:
//   - College of Liberal Arts and Sciences
//   - College of Engineering
//   - College of Design
//   - Ivy College of Business
//   - College of Agriculture and Life Sciences
//   - College of Health and Human Sciences
//
// This is the VERIFIED REFERENCE directory: names, colleges, and the college
// catalog URL are real. It intentionally does NOT assign thinking-style weights
// to every major (those are product assumptions, not catalog facts). A curated
// "flagship" subset in ./majors.js carries hand-authored weights and provides
// the scored quiz matches; `scoredId` below links a catalog entry to its
// flagship record when one exists. Every other major is fully browsable and
// shown as "explore anyway", so no major is ever hidden.
//
// `url` points to the specific program page where we confirmed it resolves;
// otherwise it points to the owning college page (always a valid catalog URL).
// =============================================================================

export const COLLEGES = {
  LAS: 'College of Liberal Arts and Sciences',
  ENGR: 'College of Engineering',
  DSN: 'College of Design',
  BUS: 'Ivy College of Business',
  CALS: 'College of Agriculture and Life Sciences',
  CHHS: 'College of Health and Human Sciences',
};

const COLLEGE_URL = {
  LAS: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/',
  ENGR: 'https://catalog.iastate.edu/collegeofengineering/',
  DSN: 'https://catalog.iastate.edu/collegeofdesign/',
  BUS: 'https://catalog.iastate.edu/collegeofbusiness/',
  CALS: 'https://catalog.iastate.edu/collegeofagricultureandlifesciences/',
  CHHS: 'https://catalog.iastate.edu/collegeofhumansciences/',
};

// Helper to keep entries terse. `scoredId` links to a flagship major (majors.js).
const m = (name, college, { degree = 'B.S.', url, scoredId = null } = {}) => ({
  name,
  college: COLLEGES[college],
  collegeKey: college,
  degree,
  url: url ?? COLLEGE_URL[college],
  scoredId,
});

export const catalog = [
  // ---- College of Liberal Arts and Sciences ----
  m('Advertising', 'LAS', { degree: 'B.A.' }),
  m('Anthropology', 'LAS', { degree: 'B.A./B.S.' }),
  m('Biochemistry', 'LAS'),
  m('Bioinformatics and Computational Biology', 'LAS'),
  m('Biology', 'LAS', { url: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/biology/', scoredId: 'biology' }),
  m('Chemistry', 'LAS', { degree: 'B.A./B.S.' }),
  m('Climate Science', 'LAS'),
  m('Communication Studies', 'LAS', { degree: 'B.A.' }),
  m('Computer Science', 'LAS', { degree: 'B.A./B.S.', url: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/computerscience/', scoredId: 'com-s' }),
  m('Criminal Justice', 'LAS', { degree: 'B.A.' }),
  m('Data Science', 'LAS', { scoredId: 'data-science' }),
  m('Digital Storytelling', 'LAS', { degree: 'B.A.' }),
  m('Earth Science', 'LAS', { degree: 'B.A./B.S.' }),
  m('Economics', 'LAS', { url: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/economics/', scoredId: 'economics' }),
  m('English', 'LAS', { degree: 'B.A./B.S.', url: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/english/', scoredId: 'english' }),
  m('Environmental Science', 'LAS', { url: 'https://catalog.iastate.edu/collegeofagricultureandlifesciences/environmentalscience/', scoredId: 'environmental-science' }),
  m('Genetics', 'LAS'),
  m('Geology', 'LAS'),
  m('History', 'LAS', { degree: 'B.A./B.S.' }),
  m('Integrated Health Sciences', 'LAS'),
  m('Interdisciplinary Studies', 'LAS', { degree: 'B.A./B.S.' }),
  m('Journalism and Mass Communication', 'LAS', { scoredId: 'journalism' }),
  m('Linguistics', 'LAS', { degree: 'B.A.' }),
  m('Mathematics', 'LAS', { scoredId: 'math-major' }),
  m('Meteorology', 'LAS'),
  m('Music', 'LAS', { degree: 'B.A./B.Mus.' }),
  m('Philosophy', 'LAS', { degree: 'B.A.', scoredId: 'philosophy' }),
  m('Physics', 'LAS'),
  m('Political Science', 'LAS', { degree: 'B.A.' }),
  m('Psychology', 'LAS', { degree: 'B.A./B.S.', url: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/psychology/', scoredId: 'psychology' }),
  m('Public Relations', 'LAS'),
  m('Religious Studies', 'LAS', { degree: 'B.A.' }),
  m('Scientific Illustration and Visualization', 'LAS', { degree: 'B.A.' }),
  m('Sociology', 'LAS', { degree: 'B.A./B.S.' }),
  m('Sports Media and Communication', 'LAS', { degree: 'B.A.' }),
  m('Statistics', 'LAS', { url: 'https://catalog.iastate.edu/collegeofliberalartsandsciences/statistics/', scoredId: 'statistics' }),
  m('Technical Communication', 'LAS'),
  m('Theatre', 'LAS', { degree: 'B.A.' }),
  m("Women's and Gender Studies", 'LAS', { degree: 'B.A./B.S.' }),
  m('World Languages and Cultures', 'LAS', { degree: 'B.A.' }),

  // ---- College of Engineering ----
  m('Aerospace Engineering', 'ENGR'),
  m('Agricultural Engineering', 'ENGR'),
  m('Biological Systems Engineering', 'ENGR'),
  m('Biomedical Engineering', 'ENGR', { scoredId: 'biomedical-eng' }),
  m('Chemical Engineering', 'ENGR'),
  m('Civil Engineering', 'ENGR', { scoredId: 'civil-eng' }),
  m('Computer Engineering', 'ENGR'),
  m('Construction Engineering', 'ENGR'),
  m('Cyber Security Engineering', 'ENGR'),
  m('Electrical Engineering', 'ENGR'),
  m('Engineering Mechanics', 'ENGR'),
  m('Environmental Engineering', 'ENGR'),
  m('Industrial Engineering', 'ENGR', { scoredId: 'industrial-eng' }),
  m('Materials Engineering', 'ENGR'),
  m('Mechanical Engineering', 'ENGR', { url: 'https://catalog.iastate.edu/collegeofengineering/mechanicalengineering/', scoredId: 'me' }),
  m('Software Engineering', 'ENGR', { url: 'https://catalog.iastate.edu/collegeofengineering/softwareengineering/', scoredId: 'se' }),
  m('Systems Engineering', 'ENGR'),

  // ---- College of Design ----
  m('Architecture', 'DSN', { degree: 'B.Arch.', url: 'https://catalog.iastate.edu/collegeofdesign/architecture/', scoredId: 'architecture' }),
  m('Art', 'DSN', { degree: 'B.A./B.F.A.' }),
  m('Art History', 'DSN', { degree: 'B.A.' }),
  m('Game Design', 'DSN', { url: 'https://catalog.iastate.edu/collegeofdesign/gamedesign/', scoredId: 'game-design' }),
  m('Graphic Design', 'DSN', { degree: 'B.F.A.', url: 'https://catalog.iastate.edu/collegeofdesign/graphicdesign/', scoredId: 'graphic-design' }),
  m('Illustration', 'DSN', { degree: 'B.F.A.' }),
  m('Industrial Design', 'DSN', { degree: 'B.I.D.', scoredId: 'industrial-design' }),
  m('Interior Design', 'DSN', { degree: 'B.F.A.' }),
  m('Landscape Architecture', 'DSN', { degree: 'B.L.A.' }),
  m('Urban and Regional Planning', 'DSN', { degree: 'B.S.' }),

  // ---- Ivy College of Business ----
  m('Accounting', 'BUS', { url: 'https://catalog.iastate.edu/collegeofbusiness/accounting/', scoredId: 'accounting' }),
  m('Actuarial Science', 'BUS', { scoredId: 'actuarial' }),
  m('Business Analytics', 'BUS', { scoredId: 'business-analytics' }),
  m('Business Economics', 'BUS'),
  m('Entrepreneurship', 'BUS', { scoredId: 'entrepreneurship' }),
  m('Finance', 'BUS', { url: 'https://catalog.iastate.edu/collegeofbusiness/finance/', scoredId: 'finance' }),
  m('Healthcare Management', 'BUS'),
  m('Human Resource Management', 'BUS'),
  m('Management', 'BUS'),
  m('Management Information Systems', 'BUS', { scoredId: 'mis' }),
  m('Marketing', 'BUS', { url: 'https://catalog.iastate.edu/ivycollegeofbusiness/marketing/', scoredId: 'marketing' }),
  m('Supply Chain Management', 'BUS'),

  // ---- College of Agriculture and Life Sciences ----
  m('Agricultural Business', 'CALS'),
  m('Agricultural Communication', 'CALS'),
  m('Agricultural and Life Sciences Education', 'CALS'),
  m('Agricultural and Rural Policy Studies', 'CALS'),
  m('Agricultural Studies', 'CALS'),
  m('Agricultural Systems Technology', 'CALS'),
  m('Agronomy', 'CALS'),
  m('Animal Science', 'CALS'),
  m('Culinary Food Science', 'CALS'),
  m('Dairy Science', 'CALS'),
  m('Diet and Exercise', 'CALS'),
  m('Dietetics', 'CALS'),
  m('Digital and Precision Agriculture', 'CALS'),
  m('Food Science', 'CALS'),
  m('Forestry', 'CALS'),
  m('Global Resource Systems', 'CALS'),
  m('Horticulture', 'CALS'),
  m('Industrial Technology', 'CALS'),
  m('Microbiology', 'CALS'),
  m('Nursing', 'CALS'),
  m('Nutritional Science', 'CALS'),
  m('Wildlife and Fisheries Conservation and Ecology', 'CALS'),

  // ---- College of Health and Human Sciences ----
  m('Fashion Design and Merchandising', 'CHHS'),
  m('Event Management', 'CHHS'),
  m('Hospitality Management', 'CHHS'),
  m('Athletic Training', 'CHHS'),
  m('Kinesiology and Health', 'CHHS', { scoredId: 'kinesiology' }),
  m('Human Development and Family Studies', 'CHHS'),
  m('Early Childhood Education', 'CHHS'),
  m('Education Studies', 'CHHS'),
  m('Elementary Education', 'CHHS', { scoredId: 'elementary-ed' }),
  m('Family and Consumer Sciences Education and Studies', 'CHHS'),
  m('Financial Counseling and Planning', 'CHHS'),
];

export const CATALOG_SOURCE = {
  edition: '2026-2027 ISU Catalog',
  checkedOn: '2025-11-17',
  base: 'https://catalog.iastate.edu/',
};

// Group the catalog by college for the directory UI.
export function catalogByCollege() {
  const groups = {};
  for (const entry of catalog) {
    (groups[entry.collegeKey] ??= []).push(entry);
  }
  return Object.entries(groups).map(([key, majors]) => ({
    key,
    college: COLLEGES[key],
    url: COLLEGE_URL[key],
    majors: majors.slice().sort((a, b) => a.name.localeCompare(b.name)),
  }));
}
