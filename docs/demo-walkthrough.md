# Demo walkthrough — for the judges

Duration: ~5 minutes. Fictional student. Everything runs locally; no login, no real data.

## Setup

```bash
npm install && npm run dev
```
Open http://localhost:5173. Use the sidebar's **Light / Dark** toggle to match the room.
**Reset demo** (bottom of the sidebar) clears the browser state between runs.

## The student (fictional)

> **Jordan** is a current ISU student, **undeclared**, who enjoys **technology, math and building
> things**, would rather **avoid lab science**, is strong in **math and logic**, leans
> **analytical / technical**, wants a **technology career**, and cares most about **graduating sooner**.

## Script

1. **Role picker** — "Who's exploring today?" Click **I'm a student**. Point out: no login; the
   role just changes the tools.
2. **Hub** — stats, tool tiles, recent, what's new. Click **Major Quest** (featured tile).
3. **Quest** (8 screens, XP bar):
   - Status: *Undeclared / exploring*. Year: *Second year*.
   - Likes: **Programming & technology**, **Math & problem solving**, **Building & engineering**.
   - **Don'ts** (call out the framing: "the most decisive question"): **Science & research**.
   - Strengths: **Mathematics**, **Logic & analysis**. Style: **Analytical**, **Technical**.
   - Career: **Technology & software**. Priority: **Graduating sooner**. **Reveal my matches**.
4. **Analysis → Results** — confetti; top-3 cards; expand #1 to show **How this score was built**
   and the radar. Scroll to the **Don'ts explorer**: toggle *Science & research* off → watch
   Biology / Environmental Science climb with a green delta and a rank arrow; toggle it back.
   Nothing was ever hidden; the penalty is capped.
5. **Thinking Worlds** (optional, 1 min) — click **Enter the worlds**, play **Number Forge**
   (3 items, instant feedback), **Reveal with what I have**, **Save to my profile**. Back on
   results the **Thinking snapshot** appears, labelled *Not used in score*.
6. **Explore pathway** on Computer Science — academic focus, careers, learning communities
   (labelled unverified → directory), official catalog link, no invented courses or dates.
7. **Learning communities** tab — filter by college; the student's matches are highlighted.
8. **Alumni network** tab — *People like you* is on; Priya's "I switched from Biology to CS" ranks
   first because she shares Jordan's interests. Show role badges and the "Experience, not official
   advice" label. (All synthetic.)
9. **Ask & prep** tab — the generated questions include a **Your don'ts** question and a
   **Graduating sooner** question, each with *Why*. Copy or print. Then ask the catalog:
   *"Which learning communities are there for Computer Science?"* → sourced answer; *"zebra
   volcano"* → "I'm not sure", advisor link. Point at the **Rule-based · not AI** badge.
10. **Advising summary** — printable; About you, majors, tradeoffs, generated questions, resources.
11. **Switch to Advisor** (sidebar) — hub tiles change. Open **Trends dashboard**: interest demand,
    most common don'ts, status split, top recommended major, session prep cards (click **S-01**
    for likes / don'ts / top-3 / suggested opener). Grouped, synthetic, anonymous.

## Talking points

- **Transparent, not a black box.** Every score decomposes; the don'ts explorer lets a student
  audit the recommendation live.
- **Don'ts first.** Research in the team's notes says dislikes are decisive; the product treats them
  as a first-class input, question and advising prompt.
- **Responsible about facts and AI.** Verified core data, labelled illustrative weights, unverified
  community links, synthetic stories and sessions, and a Q&A that cites or declines. The Bedrock
  RAG upgrade is designed, server-side, and not faked.
- **Institutional fit.** Students arrive at advising with a prepared, honest summary; advisors see
  demand and common don'ts. No claims of measured retention or cost outcomes.

## If something goes wrong

Client-only and deterministic. `npm run build && npm run preview` serves the production build;
`npm test` runs 22 checks. **Reset demo** in the sidebar clears local state.
