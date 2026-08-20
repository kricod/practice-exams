# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page practice-exam app covering two AWS certifications: Advanced Networking – Specialty (ANS-C01) and DevOps Engineer – Professional (DOP-C02). Zero build step, zero dependencies at runtime: `index.html` loads `exams.js`, then each `questions-<id>.js` bank, then `app.js` as plain `<script>` tags. There is no `package.json`, no bundler, no framework.

## Commands

```bash
xdg-open index.html            # run it — no server needed
python3 -m http.server 8000    # or serve it

npm install jsdom              # test dependency (not vendored; no package.json)
node test-app.js               # full suite — all-or-nothing, exits 1 on any failure
```

There is no lint step and no way to run a single test: `test-app.js` is one linear script of 62 `ok()` assertions across fourteen numbered sections. To isolate a section while debugging, comment out the later ones — the sections drive one long-lived jsdom instance, share its mutable DOM state, and must run in order. A section that leaves the app in an unexpected view (e.g. exam mode) breaks every section after it. Sections 1–10 run against ANS-C01; section 11 switches to DOP-C02 and 12–13 stay there, so anything appended runs against the DOP bank unless it switches back. Section 14 is pure data validation over both banks and touches no DOM.

## Architecture

### Multi-exam wiring

`exams.js` defines `window.EXAMS`, keyed by exam ID (`ans-c01`, `dop-c02`). Each entry carries the display strings plus the four things that used to be hardcoded constants: `domains` (the domain-number → name map), `passMark`, `examMinutes` and `examSize`. Each `questions-<id>.js` registers its array into `window.QUESTION_BANKS` under the same key.

`app.js` reads both through the `exam()` and `bank()` helpers rather than closure variables, because `state.exam` moves at runtime when the user clicks an exam card. `EXAM_IDS` is computed once at load and lists only exams that actually have a non-empty bank, so a registry entry without a bank is skipped rather than rendering an empty home screen. The exam switcher is only rendered when more than one bank is loaded.

Adding an exam is three edits and no `app.js` change: an `EXAMS` entry, a `questions-<id>.js` that registers itself, and two `<script>` tags in `index.html`.

The exam switcher lives on the home screen rather than being a separate view, deliberately: `#brandHome` still lands on the mode cards, which is what the pre-existing test sections assume.

Page `<title>` and the footer text are per-exam but live in the static shell, so `applyExamChrome()` updates them imperatively — it must be called on boot and again whenever `state.exam` changes.

### Rendering

`app.js` is a single IIFE holding one module-level `state` object and a set of `render*()` functions that each blow away `#app.innerHTML` and rebuild it from an HTML string. There is no diffing, no component model, and no router — `state.view` (`home` | `quiz` | `results`) is the only navigation concept, and re-rendering re-attaches every listener. Consequences worth knowing before editing:

- Any new markup must be interpolated through `esc()`. Question text comes from the bank verbatim and is not otherwise sanitized.
- Listeners are bound per render; adding one outside a `render*()` function will be lost on the next view change. `#themeToggle` and `#brandHome` are the exceptions — they live in the static shell and are bound once in `boot()`.
- `onSubmit` swaps itself off `#submitBtn` and swaps `advance` on after grading, so the same button is Submit → Next question → See results. Tests assert on that button's text.

Mode differences are branches on `state.mode`, not separate code paths: exam mode skips grading in `onSubmit`, starts an `examMinutes`-long `setInterval` timer, and forces `examSize` questions across all domains. Practice mode grades inline and shows the explanation. `finish()` computes the score ring, the per-domain breakdown, and the collapsible review list; "Retry the ones I missed" rebuilds `state.pool` from the wrong answers and re-enters practice mode without going home. `finishEarly()` (the Finish button) also branches on mode: exam keeps the full pool so skipped questions score as wrong, practice trims `state.pool` to the attempted questions so the score reflects what was answered.

`state.mode` persists across a return to the home screen, so `renderHome()` must render the mode cards and `#practiceOpts` from `state.mode` rather than hardcoding Practice as selected — otherwise Start silently launches the previous mode. `state.exam` persists the same way, and additionally survives a reload.

Two things are persisted, both via the swallow-errors `store()` helper: the theme (`localStorage` key `ansc01-theme`) and the selected exam (`practice-exam-id`). Session state is in memory only — a reload loses it. A `#resumeBtn` exists in the home markup carrying the `hidden` attribute, but it is **visible on screen**: `.btn` sets `display: inline-flex`, which overrides the user-agent `[hidden] { display: none }` rule, and unlike `.review-body[hidden]` there is no `.btn[hidden]` rule in `styles.css`. So the home screen shows a dead "Resume last session" button — resume was never wired up. Fixing it is one line (`.btn[hidden] { display: none; }`); it is left as-is because nothing in the suite covers it.

Grading is set-equality (`sameSet`), so a multi-answer question is correct only if the picked letters match `answer` exactly.

## Question banks

Both banks are generated files that say "do not edit by hand" at the top. There is no generator checked in for either, so in practice edits mean appending objects in the existing shape:

```js
{ id, source, domain, topic, difficulty, multi, question, choices: {A,B,C,D,...}, answer: ["A"], explanation }
```

- `answer` is **always** an array, even for single-answer questions.
- `domain` is a key into that exam's `domains` map in `exams.js` — 1–4 for ANS-C01, 1–6 for DOP-C02. A question with a domain outside its exam's map still renders but lands in an "Uncategorised" breakdown row.
- `multi: true` switches the inputs to checkboxes and shows a "Select TWO/THREE" tag derived from `answer.length`.
- `choices` keys are sorted alphabetically at render; the letter shown is the key itself.
- Optional `answer_disputed: true` adds a contested-answer-key warning under the explanation. Exactly one question (`dt-84`) uses it. That entry also carries a `source_answer` field holding the upstream key (`["D"]`), which **nothing in `app.js` reads** — grading always uses `answer`, so `dt-84` is graded as `C`, the key its explanation argues for.
### `questions-ans-c01.js` — 424 KB, 171 questions

91 come from the Ditectrev community repo (`source: "ditectrev"`, ids `dt-*`), 80 were written for this app (`source: "authored"`). Explanations throughout were generated for this app, including for the Ditectrev questions, whose upstream ships answer keys only.

### `questions-dop-c02.js` — 402 KB, 250 questions

All `source: "authored"`, ids `dop-*`. There is no Ditectrev repo for DOP-C02 and ExamTopics is both paywalled past page 1 and copyrighted, so nothing was imported — the whole bank is original, written against the published exam guide.

Counts are weighted to the official guide: 55 SDLC Automation, 43 Configuration Management and IaC, 37 Resilient Cloud Solutions, 38 Monitoring and Logging, 35 Incident and Event Response, 42 Security and Compliance. Only 21 of 250 are multi-answer, a noticeably lower share than the ANS bank's 32 of 171; if you extend this bank, multi-answer questions are the gap.

Question counts, domain counts, multi-answer count, and the length-selector options are all derived from the active bank at render time, so adding questions updates the home screen stats automatically. The README quotes fixed numbers that will drift if either bank changes.

## Constants

The per-exam constants live in `exams.js`, not `app.js`. `test-app.js` asserts on ANS-C01's 65-question exam phrasing (section 8) and on DOP-C02's "75 questions, 180 minutes" card text and 75-question pool (section 12), so changing either exam's `examSize` or `examMinutes` means updating the suite.
