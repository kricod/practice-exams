# AWS Practice Exams

A self-contained practice-exam web app covering three AWS certifications. Pick an exam, pick an answer, hit submit, and get an immediate verdict plus a written explanation.

| Exam | Questions | Exam sim | Pass mark |
|------|-----------|----------|-----------|
| **AWS Certified Advanced Networking – Specialty** (ANS-C01) | 171 | 65 questions / 170 min | 75% |
| **AWS Certified DevOps Engineer – Professional** (DOP-C02) | 250 | 75 questions / 180 min | 75% |
| **AWS Certified Data Engineer – Associate** (DEA-C01) | 220 | 65 questions / 130 min | 72% |

The exam switcher is on the home screen; your choice is remembered across reloads.

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
| `exams.js` | Exam registry (`window.EXAMS`) — domains, pass mark, exam size and duration per exam |
| `app.js` | Quiz logic, grading, results — exam-agnostic |
| `questions-ans-c01.js` | ANS-C01 bank, generated |
| `questions-dop-c02.js` | DOP-C02 bank, generated |
| `questions-dea-c01.js` | DEA-C01 bank, generated |
| `test-app.js` | End-to-end jsdom test suite |
| `CLAUDE.md` | Architecture notes for Claude Code |

Each bank registers itself into `window.QUESTION_BANKS` under its exam ID. Adding another exam means adding an entry to `exams.js`, shipping a `questions-<id>.js` bank, and adding both `<script>` tags — `app.js` needs no changes.

## Modes

- **Practice** — submit one question at a time, see correct/incorrect and the explanation before moving on. Choose session length and filter by exam domain.
- **Exam simulation** — the real exam's question count and time limit, no feedback until the end.

**Finish** ends a session early and jumps straight to the results. In practice mode you are scored only on the questions you answered; in exam mode the skipped questions count as incorrect, the way the real exam marks them.

At the end you get a score ring, pass/fail against that exam's pass mark (75% for ANS-C01 and DOP-C02, 72% for DEA-C01), a per-domain breakdown, an expandable review of every question, and a **Retry the ones I missed** button.

## Question banks

Every question in all three banks carries an explanation, a domain tag, a topic and a difficulty rating.

### ANS-C01 — 171 questions

| Source | Count | Notes |
|--------|-------|-------|
| Ditectrev open practice repo | 91 | Community question set ([repo](https://github.com/Ditectrev/Amazon-Web-Services-Certified-AWS-Certified-Advanced-Networking-Specialty-ANS-C01-Practice-Test-Exam)). Explanations were written for this app — the source repo ships answer keys only. |
| Original | 80 | Written for this app to cover all four domains, including areas the community set is thin on. |

Domain coverage: 65 Design · 33 Implementation · 41 Management & Operation · 32 Security & Governance. 32 questions are multi-answer (Select TWO/THREE).

One question (`dt-84`) has a **contested answer key**. The source key is D, an "ALB with a TLS listener" — but ALB supports only HTTP and HTTPS listener protocols, and TLS is not a valid ALB target group protocol, so that option cannot be built. This app grades the question as **C** (NLB with a TCP listener, passing the handshake through to the instances). The original key is kept in the entry as `source_answer`, and the question carries an in-app banner noting the dispute.

### DOP-C02 — 250 questions

Entirely original. Unlike ANS-C01 there is **no open community bank for this exam** — the Ditectrev organisation publishes practice sets for SAA-C03, DVA-C02, CLF-C02, MLS-C01, SOA-C03, SCS-C02, ANS-C01, DAS-C01 and DBS-C01, but nothing for DOP-C02. Every question here was written for this app.

Questions are weighted to the official DOP-C02 exam guide domain percentages:

| # | Domain | Guide weight | Questions |
|---|--------|--------------|-----------|
| 1 | SDLC Automation | 22% | 55 |
| 2 | Configuration Management and IaC | 17% | 43 |
| 3 | Resilient Cloud Solutions | 15% | 37 |
| 4 | Monitoring and Logging | 15% | 38 |
| 5 | Incident and Event Response | 14% | 35 |
| 6 | Security and Compliance | 17% | 42 |

Difficulty splits 169 medium · 61 hard · 20 easy. 21 questions are multi-answer (Select TWO/THREE) — a lower share than the ANS-C01 bank's 32 of 171, so multi-answer practice is thinner here than on the real exam.

### DEA-C01 — 220 questions

Entirely original, written against the published DEA-C01 exam guide. Question counts are weighted to the official domain percentages:

| # | Domain | Guide weight | Questions |
|---|--------|--------------|-----------|
| 1 | Data Ingestion and Transformation | 34% | 75 |
| 2 | Data Store Management | 26% | 57 |
| 3 | Data Operations and Support | 22% | 48 |
| 4 | Data Security and Governance | 18% | 40 |

Difficulty splits 140 medium · 58 hard · 22 easy. 34 questions are multi-answer (Select TWO/THREE), spread across all four domains — a deliberately higher share than the DOP-C02 bank's 21 of 250.

The exam simulation uses the real exam's shape: 65 questions in 130 minutes. Note that on the real exam only 50 of those 65 are scored — the other 15 are unscored evaluation questions — so the app's percentage is computed over all 65 and is a proxy, not the scaled 720/1000 score AWS reports.

### A note on ExamTopics

All three banks were asked to draw on ExamTopics, and none does.

For ANS-C01, only the first 10 questions of that exam are publicly readable — everything past page 1 sits behind their paid "Contributor Access" login, which this project does not attempt to circumvent. Those 10 free questions turned out to be duplicates of questions already in the Ditectrev set.

For DOP-C02, `www.examtopics.com` is additionally unreachable from the environment this bank was written in (blocked by an egress policy), and their question text is copyrighted material scraped from the exam, so reproducing it here would be a licensing problem independent of access. The bank is original work informed by the published AWS exam guide instead.

For DEA-C01 the same two obstacles apply: requests to `www.examtopics.com` are refused by the environment's egress proxy (HTTP 403), and the site's question text is paywalled past page 1 and copyrighted, so importing it would be a licensing problem even with access. That bank is original too.

## Regenerating the banks

All three `questions-*.js` files are generated. Each entry has this shape:

```js
{
  id: "dt-1",
  source: "ditectrev",        // or "authored"
  domain: 1,                   // key into the exam's domains map in exams.js
  topic: "NLB/ALB",
  difficulty: "medium",        // easy | medium | hard
  multi: false,
  question: "...",
  choices: { A: "...", B: "...", C: "...", D: "..." },
  answer: ["A"],               // always an array
  explanation: "..."
}
```

Two optional fields exist for questions whose published key is wrong: `answer_disputed: true` renders a warning banner under the explanation, and `source_answer` records what the original key said. Only `dt-84` uses them.

To add questions, append objects in that shape and reload the page. A `domain` value that is not in the exam's `domains` map still renders, but lands in an "Uncategorised" row on the results breakdown.

## Tests

```bash
npm install jsdom
node test-app.js
```

75 assertions covering the home screen, question rendering, selection, grading, explanations, session completion, results, review expansion, retry-missed, exam mode, the theme toggle, mode persistence when returning home, the finish-early flow, the exam switcher, DOP-C02's and DEA-C01's own exam constants, and a structural integrity check over every question in all three banks.

The suite drives one long-lived jsdom instance and its sections share DOM state, so they must run in order — it is all-or-nothing, and `node test-app.js` exits non-zero if any assertion fails.

## Disclaimer

Study material only. Not affiliated with or endorsed by Amazon Web Services. Explanations were generated for study purposes — verify anything load-bearing against the current AWS documentation before relying on it.
