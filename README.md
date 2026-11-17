# ISU Major & Learning-Community Matcher

AWS Kiro Hackathon · Iowa State University · November 17, 2026 · Team 2 · Use Case 3

A web prototype that helps **current ISU students who are undeclared or considering a change**
explore majors, learning communities, and academic pathways — with a transparent, inspectable
reason behind every recommendation.

## What it does

1. **Welcome** — a homepage that explains the tool and a single "Find My Major" action.
2. **Guided questionnaire** — a five-step, selectable form (status, interests, dislikes, strengths
   and working style, careers and priorities). No real IDs, transcripts, passwords, or records.
3. **Transparent matching** — a deterministic weighted engine ranks majors and shows exactly how
   each score was built, factor by factor.
4. **Results dashboard** — top-3 majors (expandable to all), each with a fit meter, plain-language
   reasons, good-fit / caution notes, and a compare checkbox.
5. **Major detail / pathway** — academic focus, related careers, learning communities, general
   pathway guidance, and a link to the official ISU catalog page.
6. **Compare** — a side-by-side table of 2–3 majors.
7. **Advising summary** — a printable summary with recommended majors, tradeoffs, questions to ask
   an advisor, and official resources.

## Quick start

Requirements: Node.js 20.19+ (or 22.12+) and npm. (Developed on Node 23.)

```bash
git clone https://github.com/rishabhj2701/isu-major-matcher.git
cd isu-major-matcher
npm install
npm run dev        # open the URL Vite prints, usually http://localhost:5173
```

Other scripts:

```bash
npm test           # run the matching-engine unit tests (plain Node, no framework)
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## How the matching engine works

See `src/lib/matcher.js`. The score is a **normalized weighted overlap**, not a trained model and
not a validated predictor of success. Weights are illustrative product assumptions, documented and
easy to change:

| Factor | Weight |
|---|---|
| Interests | 35% |
| Academic strengths | 20% |
| Career alignment | 20% |
| Working style | 15% |
| Stated priorities | 10% |

A **dislike penalty** then lowers majors that lean heavily on an activity the student disliked. It
is capped (currently 25%) so it never eliminates an option — only down-ranks it, and the UI shows
why. Output is deterministic and reproducible; every reason shown is derived from a real factor
contribution, so explanations always match the score.

## AI integration (optional, not enabled)

`src/services/aiExplainer.js` defines an optional AI explanation layer. In a real deployment a
**server-side** Amazon Bedrock call could rephrase the engine's factor breakdown into friendlier
language, grounded in the structured, verified major data. It must never invent courses, learning
communities, requirements, policies, salaries, or graduation timelines.

In this browser-only prototype there is no backend and no AWS credentials, so the AI path is
`AI_AVAILABLE = false` and explanations are generated deterministically and clearly labeled
"rule-based." We never present simulated text as real model output, and no credentials or API keys
are ever placed in the browser.

## Data and verification

- `src/data/majors.js` — eight majors across different colleges. Each record carries a
  `verification` object. **Verified** against the ISU catalog: name, college, overview, and the
  official `catalogUrl`. **Illustrative** (product assumptions): the interest/strength/career/style
  weights and dislike sensitivity.
- `src/data/learningCommunities.js` — ISU runs many learning communities, but the specific
  major→community associations here could not be individually verified at build time, so each is
  marked `unverified` and the UI points students to the official directory rather than implying a
  guaranteed match.
- Specific course numbers are deliberately omitted (ISU recently moved to 4-digit course numbers);
  the detail page links to the official four-year plan instead of inventing a sequence.

## Project structure

```
src/
  components/   ProgressBar, ChipGroup, FitMeter, FactorBreakdown, MajorCard, LearningCommunities
  pages/        Home, Questionnaire, Results, MajorDetail, Compare, AdvisingSummary
  lib/          matcher.js (engine) + matcher.test.mjs (tests)
  services/     aiExplainer.js (optional AI layer, grounded + off by default)
  data/         majors.js, learningCommunities.js
  App.jsx       shell + lightweight view-state navigation (no router dependency)
  styles.css    cardinal/gold design system, responsive, print, a11y helpers
docs/           architecture.md, demo-walkthrough.md, team-workflow.md
```

## Accessibility

Semantic landmarks and headings, a skip link, labelled fieldsets, real buttons with `aria-pressed`,
`progressbar`/`meter` roles, visible keyboard focus, focus moved to the main region on navigation,
and responsive typography. No interaction depends on color alone.

## Limitations and next steps

See the bottom of `docs/architecture.md`. In short: data is a small verified subset; learning-
community associations need directory verification; AI explanation needs a backend; a real pilot
needs the degree-audit, credit-carryover, and advisor-integration work described in the PRD.

**This is a student-built hackathon prototype — informational guidance, not official Iowa State
University advising, and not a degree audit.** Do not collect real student records or credentials.

## Development branches

`main` (stable demo) · `feature/frontend` · `feature/matching` · `feature/data` ·
`feature/integration` · plus personal branches. Work on a branch, push, open a PR into `main`.
Do not force-push or commit directly to `main`. This Kiro session's work lives on
`feature/kiro-prototype`.
