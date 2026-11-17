# Demo walkthrough — for the judges

Duration: ~4 minutes. Use the fictional student below. Everything runs locally; no real data.

## Setup

```bash
npm install && npm run dev
```
Open the printed URL. The "Demo data" banner confirms synthetic input.

## The student (fictional)

> **Jordan** is a current ISU student, **undeclared**, who enjoys **technology, math, and building
> practical projects**, is strong in **math and logic**, leans **analytical / technical / hands-on**,
> is interested in a **technology career**, and cares most about **career alignment**. Jordan is torn
> between Computer Science and Software Engineering.

## Script

1. **Homepage** — Read the one-line purpose. Click **Find My Major**.
2. **Questionnaire** (5 short steps):
   - Step 1: pick *"I am undeclared / exploring."*
   - Step 2 (Interests): **Programming & technology**, **Math & problem solving**, **Building & engineering**.
   - Step 3 (Dislikes): leave empty for now.
   - Step 4: strengths **Mathematics**, **Logic & analysis**; styles **Analytical**, **Technical**, **Hands-on**.
   - Step 5: career **Technology & software**; priority **Career alignment**.
   - Click **See my matches**.
3. **Results** — Point out the top three and the **transparent fit meter**:
   - #1 Computer Science ≈ **71/100**, #2 Software Engineering ≈ **71/100**, #3 Mechanical Engineering ≈ **56/100**.
   - Expand a card → **"How this score was built"** shows each factor's contribution. The reasons on
     the card are generated from those exact numbers.
4. **Reality / honesty beat** — Go **Back**, add **Math & problem solving** to **Dislikes** (step 3),
   resubmit. All three scores drop a band (e.g. CS 71 → 48) with a visible **−pts dislike penalty**,
   but nothing is removed. This shows the engine down-ranks, never eliminates, and explains why.
5. **Explore pathway** — Open **Computer Science**. Show academic focus, related careers, the
   **learning communities** card (clearly labeled *unverified → official directory*), the pathway
   note that a real degree audit needs an advisor, and the **official catalog link**.
6. **Compare** — Back to results, check **Compare** on CS and SE, click **Compare selected**. Show
   the side-by-side table.
7. **Advising summary** — Click **Build advising summary**. Show recommended majors, tradeoffs,
   **questions to ask an advisor**, and official resources. Click **Print / save as PDF**.

## Talking points

- **Transparent, not a black box.** Every score decomposes into factors; every reason ties to a
  real contribution. Judges can audit the recommendation live.
- **Responsible about facts.** Major names, colleges, and catalog links are verified; weights and
  learning-community matches are clearly labeled illustrative/unverified. We never invent courses,
  salaries, or graduation dates.
- **AI, done responsibly.** The optional Bedrock layer would only *rephrase* grounded, verified
  data, server-side, with no credentials in the browser. It is off here and never faked.
- **Institutional impact.** This front-loads the research a student would otherwise do across many
  ISU sites and gives advisors a prepared, honest starting point — without claiming measured
  retention or cost outcomes we haven't evaluated.

## If something goes wrong

The app is client-only and deterministic. If the dev server misbehaves, run `npm run build &&
npm run preview`. The engine has unit tests: `npm test`.
