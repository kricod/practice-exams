# AWS ANS-C01 Practice Exam

A self-contained practice-exam web app for the **AWS Certified Advanced Networking – Specialty (ANS-C01)** exam. Pick an answer, hit submit, and get an immediate verdict plus a written explanation.

## Run it

No build step, no server required:

```bash
xdg-open index.html      # or just double-click it
```

If you prefer a local server:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page shell |
| `styles.css` | Styling — light/dark theme |
| `app.js` | Quiz logic, grading, results |
| `questions.js` | Question bank (`window.QUESTIONS`), generated |
| `test-app.js` | End-to-end jsdom test suite |

## Modes

- **Practice** — submit one question at a time, see correct/incorrect and the explanation before moving on. Choose session length (10–171 questions) and filter by exam domain.
- **Exam simulation** — 65 questions, 170 minutes, no feedback until the end.

At the end you get a score ring, pass/fail against the 75% mark, a per-domain breakdown, an expandable review of every question, and a **Retry the ones I missed** button.

## Question bank

171 questions, each with an explanation, a domain tag, a topic, and a difficulty rating.

| Source | Count | Notes |
|--------|-------|-------|
| Ditectrev open practice repo | 91 | Community question set ([repo](https://github.com/Ditectrev/Amazon-Web-Services-Certified-AWS-Certified-Advanced-Networking-Specialty-ANS-C01-Practice-Test-Exam)). Explanations were written for this app — the source repo ships answer keys only. |
| Original | 80 | Written for this app to cover all four domains, including areas the community set is thin on. |

Domain coverage: 65 Design · 33 Implementation · 41 Management & Operation · 32 Security & Governance. 32 questions are multi-answer (Select TWO/THREE).

One question (`dt-84`) is flagged in-app as having a **contested answer key** — the source key names an "ALB with a TLS listener", which is not a thing ALB supports. The explanation notes this.

### A note on ExamTopics

The original request was to pull questions from ExamTopics. Only the first 10 questions of that exam are publicly readable — everything past page 1 sits behind their paid "Contributor Access" login, which this project does not attempt to circumvent. Those 10 free questions turned out to be duplicates of questions already in the Ditectrev set, so they added nothing beyond it.

## Regenerating the bank

`questions.js` is generated. Each entry has this shape:

```js
{
  id: "dt-1",
  source: "ditectrev",        // or "authored"
  domain: 1,                   // 1-4
  topic: "NLB/ALB",
  difficulty: "medium",        // easy | medium | hard
  multi: false,
  question: "...",
  choices: { A: "...", B: "...", C: "...", D: "..." },
  answer: ["A"],               // always an array
  explanation: "..."
}
```

To add questions, append objects in that shape and reload the page.

## Tests

```bash
npm install jsdom
node test-app.js
```

37 assertions covering the home screen, question rendering, selection, grading, explanations, session completion, results, review expansion, retry-missed, exam mode, and the theme toggle.

## Disclaimer

Study material only. Not affiliated with or endorsed by Amazon Web Services. Explanations were generated for study purposes — verify anything load-bearing against the current AWS documentation before relying on it.
