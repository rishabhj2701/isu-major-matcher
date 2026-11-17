# ISU Major & Learning-Community Matcher

AWS Kiro Hackathon • Iowa State University • November 17, 2026 • Team 2

A small prototype to help ISU students explore majors based on their interests, with a future connection to relevant learning communities and advising resources.

## Quick start

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```bash
git clone https://github.com/rishabhj2701/isu-major-matcher.git
cd isu-major-matcher
npm install
npm run dev
```

Open the local URL shown by Vite (usually http://localhost:5173).

## Scope for the hackathon

- Student interest questionnaire and ranked major suggestions
- Transparent reasons for each suggested match
- ISU major and learning-community information from verified sources
- A short demonstration using synthetic student input

**Current state:** Starter UI and a small *illustrative* data set; not a verified catalog, degree audit, or official advising service. Check every published major, learning-community association, and degree requirement before presenting it as official. Do not collect real student records or credentials.

## Code ownership

- `src/App.jsx`, `src/styles.css` — questionnaire, interface and results
- `src/lib/matcher.js` — transparent matching logic; AI integration can be added later
- `src/data/majors.js` — sample data; replace with verified catalog data
- `docs/team-workflow.md` — branches, integration and demo checklist

## Development branches

- `main` — stable demo
- `feature/frontend` — UI/UX
- `feature/matching` — recommendation engine and explanations
- `feature/data` — official ISU source data and learning-community associations
- `feature/integration` — integration, testing and presentation readiness

Work on your branch, push changes, and open a pull request into `main`. Pull regularly and avoid committing passwords, API keys, student information or `.env` files.

## Demo plan

Enter a fictional student's interests, view top matches and explanations, and describe how verified ISU sources and an advising review would extend the proof of concept.

This is a student-built hackathon prototype, not an official Iowa State University recommendation service.
