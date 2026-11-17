# Team workflow — November 17, 2026

## Start locally

```bash
git clone https://github.com/rishabhj2701/isu-major-matcher.git
cd isu-major-matcher
npm install
npm run dev
```

## Suggested ownership (coordinate with the team)

- Frontend: make the questionnaire/results clear, accessible and mobile-friendly.
- Matching: improve scoring and explainability; keep demo claims accurate.
- Data: gather and cite **verified** ISU majors and learning communities; identify gaps.
- Integration: connect components, run a full demo, test and coordinate slides.

## Branches

`feature/frontend`, `feature/matching`, `feature/data`, `feature/integration`

Switch to an existing branch:

```bash
git fetch origin
git switch feature/frontend
npm install
npm run dev
```

Commit and push work:

```bash
git add .
git commit -m "Describe your change"
git push -u origin HEAD
```

Open a pull request to `main` for review. Do not force-push to `main`.

## Priorities for the sprint

1. Confirm the student problem and use-case requirements with the campus champion.
2. Agree on one sample student story and concrete demo outcome.
3. Replace illustrative matching data with cited ISU information.
4. Build a short, reliable end-to-end demo and test it on a fresh browser.
5. Present limitations and next steps candidly.

**Security:** never commit student records, secrets, or institutional credentials. Use fictional data for the demo.
