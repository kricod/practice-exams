# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page practice-exam app for the AWS Certified Advanced Networking – Specialty (ANS-C01) exam. Zero build step, zero dependencies at runtime: `index.html` loads `questions.js` then `app.js` as plain `<script>` tags. There is no `package.json`, no bundler, no framework.

## Commands

```bash
xdg-open index.html            # run it — no server needed
python3 -m http.server 8000    # or serve it

npm install jsdom              # test dependency (not vendored; no package.json)
node test-app.js               # full suite — all-or-nothing, exits 1 on any failure
```

There is no lint step and no way to run a single test: `test-app.js` is one linear script of 43 `ok()` assertions across ten numbered sections. To isolate a section while debugging, comment out the later ones — the sections drive one long-lived jsdom instance, share its mutable DOM state, and must run in order. A section that leaves the app in an unexpected view (e.g. exam mode) breaks every section after it.

## Architecture

`app.js` is a single IIFE holding one module-level `state` object and a set of `render*()` functions that each blow away `#app.innerHTML` and rebuild it from an HTML string. There is no diffing, no component model, and no router — `state.view` (`home` | `quiz` | `results`) is the only navigation concept, and re-rendering re-attaches every listener. Consequences worth knowing before editing:

- Any new markup must be interpolated through `esc()`. Question text comes from the bank verbatim and is not otherwise sanitized.
- Listeners are bound per render; adding one outside a `render*()` function will be lost on the next view change. `#themeToggle` and `#brandHome` are the exceptions — they live in the static shell and are bound once in `boot()`.
- `onSubmit` swaps itself off `#submitBtn` and swaps `advance` on after grading, so the same button is Submit → Next question → See results. Tests assert on that button's text.

Mode differences are branches on `state.mode`, not separate code paths: exam mode skips grading in `onSubmit`, starts a 170-minute `setInterval` timer, and forces 65 questions across all domains. Practice mode grades inline and shows the explanation. `finish()` computes the score ring, the per-domain breakdown, and the collapsible review list; "Retry the ones I missed" rebuilds `state.pool` from the wrong answers and re-enters practice mode without going home. `finishEarly()` (the Finish button) also branches on mode: exam keeps the full pool so skipped questions score as wrong, practice trims `state.pool` to the attempted questions so the score reflects what was answered.

`state.mode` persists across a return to the home screen, so `renderHome()` must render the mode cards and `#practiceOpts` from `state.mode` rather than hardcoding Practice as selected — otherwise Start silently launches the previous mode.

Only the theme is persisted (`localStorage` key `ansc01-theme`, via the swallow-errors `store()` helper). Session state is in memory only — a reload loses it. A `#resumeBtn` exists in the home markup but is permanently `hidden`; resume was never wired up.

Grading is set-equality (`sameSet`), so a multi-answer question is correct only if the picked letters match `answer` exactly.

## Question bank

`questions.js` is a 424 KB generated file assigning `window.QUESTIONS` — a flat array of 171 objects. It says "do not edit by hand" at the top; there is no generator checked in, so in practice edits mean appending objects in the existing shape:

```js
{ id, source, domain, topic, difficulty, multi, question, choices: {A,B,C,D,...}, answer: ["A"], explanation }
```

- `answer` is **always** an array, even for single-answer questions.
- `domain` is 1–4, mapped to names by `DOMAIN_NAMES` in `app.js`. A question with a domain outside that map still renders but lands in an "Uncategorised" breakdown row.
- `multi: true` switches the inputs to checkboxes and shows a "Select TWO/THREE" tag derived from `answer.length`.
- `choices` keys are sorted alphabetically at render; the letter shown is the key itself.
- Optional `answer_disputed: true` adds a contested-answer-key warning under the explanation. Exactly one question (`dt-84`) uses it. That entry also carries a `suggested_answer` field, which **nothing in `app.js` reads** — grading always uses `answer`, so `dt-84` is currently graded against a key its own explanation argues is wrong.
- 91 questions come from the Ditectrev community repo (`source: "ditectrev"`, ids `dt-*`), 80 were written for this app (`source: "authored"`). Explanations throughout were generated for this app, including for the Ditectrev questions, whose upstream ships answer keys only.

Question counts, domain counts, multi-answer count, and the length-selector options are all derived from the bank at render time, so adding questions updates the home screen stats automatically. The README quotes fixed numbers (171, the domain split) that will drift if the bank changes.

## Constants

`PASS_MARK` (75), `EXAM_MINUTES` (170), and `EXAM_SIZE` (65) sit at the top of `app.js`. Tests assert exam mode renders `#timer` and 65-question phrasing, so changing them means updating `test-app.js`.
