# ISU FitFinder — Major & Learning-Community Hub

AWS Kiro Hackathon · Iowa State University · November 17, 2026 · Team 2 · Use Case 3

A web prototype that helps **current ISU students who are undeclared or considering a change**
explore majors, learning communities, alumni experiences and academic pathways — with a transparent,
inspectable reason behind every recommendation. It is organised as a **hub**: one place, a sidebar of
tools, a Student / Advisor view switch, light and dark themes, and no login (nothing in the use case
needs one; everything runs in the browser on synthetic data).

## What it does

**Hub (both roles)**
- Pick a view: *I'm a student* or *I'm an advisor*. The role only changes which tools show.
- Stats row, tool tiles, "recently viewed" timeline, "what's new" notes, theme switch, demo reset.

**Student tools**
1. **Major Quest** — game-style questionnaire: one question per screen, big cards, XP and levels.
   The *don'ts* question is framed as the most decisive one.
2. **Animated analysis + reveal** — an honest "finding your matches" sequence, then confetti.
3. **My results** — top-3 majors (expandable to all) with fit meter, factor breakdown, radar,
   good-fit / caution notes, compare checkboxes, **and**:
   - **Don'ts explorer** — toggle each dislike on or off and watch the real engine re-rank live,
     with per-major deltas and rank moves. Nothing is ever hidden; the penalty is capped.
   - **Thinking snapshot** — if the student played the worlds (below).
4. **Thinking Worlds** (optional) — three short, original mini-games from the team PRD §5:
   *Number Forge* (quantitative), *Logic Lab* (analytical reflection), *Idea Garden* (divergent
   fluency, 60-second soft timer). Produces a **relative, within-person** snapshot with a wide
   band. It is for reflection only and **never changes the fit score** (tested).
5. **Major detail / pathway**, **Compare** (2–3 majors), **Advising summary** (printable; questions
   are now generated from the profile).
6. **Browse all majors** — the full verified ISU undergraduate catalog (merged from
   `feature/kiro-prototype`): search, college filter, "Scored" badges for the majors the quest can
   score, official links for every one. Nothing is hidden.
7. **Learning communities** — every community reference grouped by major, filterable by college,
   labelled by verification status, with the official directory link.
8. **Alumni network** — "Why I chose", "A real week in", "I switched from", "What I wish I knew"
   stories with role badges (Current student / Alumni / Faculty / Advisor), a *people like you*
   ranking (interest + don'ts overlap with the student's profile), local upvotes, replies, and a
   compose form that stays in the browser. **All stories are synthetic and labelled as such.**
9. **Ask & prep** — *Bring to your advisor*: questions generated from the real answers and matches,
   each with the reason it appeared (a don'ts question, a near-tie question, a graduate-sooner
   question…), check / copy / print. *Ask the catalog*: a **rule-based, source-cited Q&A** over the
   local verified data that says "I'm not sure" below a confidence floor. Labelled *not AI*.

**Advisor tools**
- **Trends dashboard** — grouped, synthetic sessions run through the real engine: interest demand,
  most common don'ts, status split, top-recommended major, priorities; anonymous **session prep
  cards** (S-01, S-02 …) with a suggested opener; the questions students ask most.
- Student questions with prepared answers, learning communities, alumni network, and a preview of
  the student quest.

## Quick start

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```bash
git clone https://github.com/rishabhj2701/isu-major-matcher.git
cd isu-major-matcher
git switch feature/sanjita-hub
npm install
npm run dev        # open http://localhost:5173
```

Other scripts:

```bash
npm test           # 22 engine + hub checks (plain Node, no framework)
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
is capped (25 points) so it never eliminates an option — only down-ranks it, and the UI shows why.
The **don'ts explorer** on the results page re-runs this exact engine with a subset of dislikes so
students can see the effect of each one. Output is deterministic; every reason shown is derived
from a real factor contribution.

## AI integration (optional, not enabled)

`src/services/aiExplainer.js` defines an optional AI explanation layer; `src/lib/askEngine.js` is the
Q&A retriever. In a real deployment a **server-side** Amazon Bedrock call could rephrase the factor
breakdown and answer questions from catalog-grounded retrieval (RAG), as in the team Tech Spec. It
must never invent courses, learning communities, requirements, policies, salaries or timelines, and
must cite sources and say "I don't know" otherwise.

In this browser-only prototype there is no backend and no AWS credentials, so `AI_AVAILABLE = false`,
explanations are rule-based, and the Q&A is keyword retrieval over local verified data — both are
labelled as such in the UI. Nothing simulated is presented as model output. No credentials or API
keys are ever placed in the browser.

## Data and verification

- `src/data/catalog.js` — all verified ISU undergraduate majors (name, college, degree, URL).
- `src/data/majors.js` — 29 scored majors across every college. **Verified** against the ISU catalog: name,
  college, overview, `catalogUrl`. **Illustrative**: interest/strength/career/style weights and
  dislike sensitivity.
- `src/data/learningCommunities.js` — associations are marked `unverified`; the UI labels them and
  points to the official directory rather than implying a guaranteed match.
- `src/data/faq.js` — conservative general-guidance answers that link to official ISU pages.
- `src/data/alumniPosts.js` — **synthetic** stories; every author is fictional.
- `src/data/syntheticSessions.js` — **synthetic** advisor sessions, seeded so the dashboard is
  stable; grouped counts only, no names or records.
- Specific course numbers are deliberately omitted; detail pages link to the official plan.

## Project structure

```
src/
  App.jsx            hub shell: sidebar tabs, Student/Advisor switch, theme, view-state nav
  pages/             Hub (+RolePicker), Quest, Worlds, Matching, Results, MajorDetail, Compare,
                     AdvisingSummary, Catalog, Communities, Alumni, Ask, AdvisorDashboard
  components/        Tile, StatTile, BarChart, SegmentedBar, DislikeExplorer, ThinkingSnapshot,
                     Icon, MajorCard, FitMeter, FactorBreakdown, RadarChart, LearningCommunities,
                     ChipGroup, ProgressBar
  lib/               matcher.js (engine) · askEngine.js (rule-based Q&A) · advisorQuestions.js ·
                     thinking.js (worlds items + relative snapshot) · storage.js · useCountUp.js ·
                     confetti.js · matcher.test.mjs · hub.test.mjs
  services/          aiExplainer.js (optional AI layer, grounded, off by default)
  data/              majors, learningCommunities, faq, alumniPosts (synthetic), syntheticSessions
  styles.css         neutral + cardinal/gold design system, light/dark, motion, print, a11y
  tailwind.css       Tailwind v4 theme + utilities (no preflight)
docs/                architecture.md, demo-walkthrough.md, team-workflow.md
```

Design direction: a clean "login-hub" layout (sticky sidebar, product tiles, stats, pill buttons,
light/dark theme) with cardinal/gold accents. Not official Iowa State branding.

## Accessibility

Semantic landmarks and headings, a skip link, real buttons with `aria-pressed` / `aria-current`,
`progressbar` / `meter` roles, visible keyboard focus, focus moved to the main region on
navigation, charts with visible value labels and a table view, soft timers only in the worlds,
`prefers-reduced-motion` honoured, and no interaction that depends on colour alone.

## Limitations and next steps

- Data is a small verified subset; learning-community associations still need a directory pass.
- Alumni posts and advisor sessions are synthetic. A pilot needs verified accounts and moderation.
- Q&A is keyword retrieval; the Bedrock RAG service in the Tech Spec is the upgrade path.
- Thinking Worlds have three items per world: a noisy reflection aid, not an assessment.
- No degree audit, credit carry-over or graduation date, by design.

**This is a student-built hackathon prototype — informational guidance, not official Iowa State
University advising, and not a degree audit.** Do not collect real student records or credentials.

## Development branches

`main` (stable demo) · `feature/kiro-prototype` (end-to-end matcher + Major Quest) ·
`feature/sanjita-hub` (this hub: roles, tabs, don'ts explorer, worlds, alumni, ask, advisor view) ·
`feature/frontend` · `feature/matching` · `feature/data` · `feature/integration` · personal branches.
Work on a branch, push, open a PR into `main`. Do not force-push or commit directly to `main`.
