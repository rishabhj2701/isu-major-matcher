# Architecture — HelloMajor hub

Hackathon prototype · Team 2 · Use Case 3

## Overview

A client-only React + Vite single-page app organised as a hub with a sidebar of tools and a
Student / Advisor view switch. All logic and data run in the browser; there is no backend, database,
login or external service, which keeps the demo reliable and avoids handling any real student data.
The synthetic profile, chosen role, theme and recently viewed majors persist in `localStorage` under
a `fitfinder.` prefix so every tab survives a reload. An optional server-side AI layer is designed
for but not enabled.

```mermaid
flowchart TD
    U[Student / Advisor] --> RP[Role picker]
    RP --> HUB[Hub: tiles, stats, recent, notes]

    subgraph student [Student tools]
      HUB --> Q[Major Quest\ngame questionnaire]
      Q --> M[Matching\nanimated analysis]
      M --> R[Results\ncards + don'ts explorer + thinking snapshot]
      R --> D[Major detail / pathway]
      R --> C[Compare]
      R --> S[Advising summary\nprintable, generated questions]
      HUB --> W[Thinking Worlds\n3 mini-games → relative snapshot]
      HUB --> LC[Learning communities]
      HUB --> AL[Alumni network\nsynthetic stories]
      HUB --> ASK[Ask & prep\nquestions + rule-based Q&A]
    end

    subgraph advisor [Advisor tools]
      HUB --> AD[Trends dashboard\ngrouped synthetic sessions]
      HUB --> ASK
      HUB --> LC
      HUB --> AL
    end

    subgraph engine [src/lib — deterministic]
      SC[matcher.js\nweights 35/20/20/15/10 + capped dislike penalty]
      AQ[advisorQuestions.js]
      AE[askEngine.js\nkeyword retrieval, confidence floor]
      TH[thinking.js\nwithin-person tilt, never in score]
    end

    Q -.profile.-> SC
    SC --> R & D & C & S & AD
    SC --> AQ --> S & ASK
    AE --> ASK
    W --> TH --> R

    subgraph data [src/data — local]
      MJ[majors.js\nverified core + illustrative weights]
      L[learningCommunities.js\nunverified → directory link]
      F[faq.js]
      AP[alumniPosts.js\nSYNTHETIC]
      SS[syntheticSessions.js\nSYNTHETIC, seeded]
    end
    MJ --> SC & AE
    L --> LC & AE
    F --> AE
    AP --> AL
    SS --> AD

    subgraph ai [services/aiExplainer.js — OPTIONAL, OFF]
      AIF{AI_AVAILABLE?}
      AIF -->|no| RB[rule-based explanation]
      AIF -->|yes, future| BR[server-side Bedrock\ngrounded, cited]
    end
```

## Shell and navigation

`App.jsx` holds `role`, `theme`, `view`, `profile`, `recent` and a `go(view, payload)` helper. The
sidebar (`.side`) lists tools per role; on narrow screens it becomes a sticky top bar with a
horizontally scrolling tab row. There is no router: the journey is small and a view-state enum keeps
the bundle light. Swapping in React Router later is a contained change.

| Layer | File | Responsibility |
|---|---|---|
| Shell | `App.jsx` | Sidebar tabs, role switch, theme, persistence, view-state nav, focus on nav |
| Page | `pages/Hub.jsx` | Role picker, stats, tool tiles, recent timeline, notes (student + advisor) |
| Page | `pages/Quest.jsx` | Game questionnaire (unchanged engine contract; don'ts stage emphasised) |
| Page | `pages/Worlds.jsx` | Number Forge, Logic Lab, Idea Garden; world map; soft timer |
| Page | `pages/Results.jsx` | Cards + `DislikeExplorer` + `ThinkingSnapshot` / worlds CTA |
| Page | `pages/Communities.jsx` | All community references, college filter, verification badges |
| Page | `pages/Alumni.jsx` | Stories, role badges, people-like-you, votes, local compose |
| Page | `pages/Ask.jsx` | Generated advisor questions; rule-based catalog Q&A thread |
| Page | `pages/AdvisorDashboard.jsx` | Stat tiles, bar charts, segmented bar, session prep cards |
| Component | `components/DislikeExplorer.jsx` | What-if toggles re-running `matchMajors` live |
| Component | `components/BarChart.jsx`, `SegmentedBar.jsx`, `StatTile.jsx` | Data-viz primitives |
| Engine | `lib/matcher.js` | Weighted scoring, penalty, explanations (unchanged) |
| Lib | `lib/askEngine.js` | Tokenise → score knowledge cards → answer with source or "unsure" |
| Lib | `lib/advisorQuestions.js` | Profile-driven question templates with a "why" per question |
| Lib | `lib/thinking.js` | Original mini-game items; relative snapshot; fluency count |
| Tests | `lib/matcher.test.mjs`, `lib/hub.test.mjs` | 22 checks, `npm test` |

## Design system

Neutral surfaces with cardinal/gold accents, inspired by a clean dashboard "login hub" layout:
sticky sidebar, product tiles with a round "go" button, a stats row, pill buttons, tabs, and a
light/dark theme set before first paint (`index.html`) and toggled from the sidebar. Headings use
Inter Tight, body Inter. Tailwind v4 is loaded **without preflight** (theme + utilities only) so the
existing component CSS keeps its list bullets and button defaults; utilities are for one-off layout.

Charts follow the data-viz method used in the team: nominal bars take one hue (no legend; the title
names the measure), the status split is a thin segmented bar with fixed slot order and a legend, all
values are labelled, every chart has a hover tooltip and a table toggle, and the two chart hues were
run through the palette validator in both themes (dark gold stepped to `#a0782a` to pass the
lightness band; its CVD warn is covered by the legend, labels and 2px gaps).

## Scoring model (why it is defensible)

- **Normalized, weighted overlap** across five factors with documented weights that sum to 1.
- **Reproducible**: same input → same output (tested).
- **Explainable**: reasons are generated from the actual factor contributions.
- **Fair to negative preferences**: a disliked activity applies a *capped* penalty (down-rank, not
  eliminate); the don'ts explorer lets students see exactly what each one changed.
- **Thinking snapshot is separate**: a test asserts it never changes a fit score.
- **Honest framing**: scores are "overlap / 100" with a qualitative band, never a probability.

## Data verification policy

- `majors.js`: `verification.status = 'verified-core'` = name, college, overview and catalog URL
  confirmed on catalog.iastate.edu. Weights are labelled illustrative.
- `learningCommunities.js`: every association is `unverified`; UI labels it and links the directory.
- `faq.js`: general guidance only; each answer links an official ISU page.
- `alumniPosts.js`, `syntheticSessions.js`: synthetic, labelled in the UI and in code.
- Course numbers omitted pending verification of ISU's 4-digit numbering.

## Security / privacy / accessibility

- No login, no real student data; "Demo data" badge always visible; one-click demo reset.
- No backend, no credentials in the browser; AI path is designed to be server-side only.
- Advisor view shows grouped counts and anonymous session ids only.
- Semantic HTML, skip link, labelled controls, `aria-pressed` / `aria-current`, visible focus,
  focus management, soft timers, reduced-motion support, chart table views, print stylesheet.

## Limitations

1. Small data subset (8 majors); schema supports expansion.
2. Learning-community associations unverified.
3. Alumni stories and advisor sessions are synthetic.
4. Q&A is keyword retrieval, not RAG; AI explanation not live.
5. Thinking Worlds: three items per world — a reflection aid with a wide band, not an assessment.
6. No degree audit / credit carry-over / graduation date, by design.
7. Browser smoke test: run `npm run dev` locally and walk the demo (docs/demo-walkthrough.md).

## Next steps toward an ISU pilot

1. Expand and verify majors; add verified intro courses and four-year plan links.
2. Verify learning-community associations; flip entries to `verified`.
3. Stand up the FastAPI/Lambda backend from the Tech Spec: Bedrock explanation + catalog RAG.
4. Verified accounts (Cognito) and a moderation queue for the alumni network.
5. Advisor dashboard on real, consented, grouped data (groups ≥ 10).
