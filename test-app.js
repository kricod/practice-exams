/* End-to-end test of the practice exam UI using jsdom. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const APP = __dirname;
let pass = 0, fail = 0;
function ok(cond, label) {
  if (cond) { pass++; console.log('  ✓ ' + label); }
  else { fail++; console.log('  ✗ FAIL: ' + label); }
}

const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/' });
const { window } = dom;
window.confirm = () => true;
window.scrollTo = () => {};

// load scripts manually in order — registry, then each bank, then the app
window.eval(fs.readFileSync(path.join(APP, 'exams.js'), 'utf8'));
window.eval(fs.readFileSync(path.join(APP, 'questions-ans-c01.js'), 'utf8'));
window.eval(fs.readFileSync(path.join(APP, 'questions-dop-c02.js'), 'utf8'));
window.eval(fs.readFileSync(path.join(APP, 'questions-dea-c01.js'), 'utf8'));
window.eval(fs.readFileSync(path.join(APP, 'app.js'), 'utf8'));

const doc = window.document;
const $ = (s) => doc.querySelector(s);
const $$ = (s) => Array.from(doc.querySelectorAll(s));

// jsdom fires DOMContentLoaded asynchronously; wait for the app to boot.
async function ready() {
  for (let i = 0; i < 50 && !$('#startBtn'); i++) {
    await new Promise((r) => setTimeout(r, 20));
  }
}

main().catch((e) => { console.error('TEST ERROR:', e); process.exit(1); });
async function main() {
await ready();

console.log('\n[1] Home screen');
const BANKS = window.QUESTION_BANKS;
ok(BANKS['ans-c01'].length > 100, `ANS-C01 bank loaded (${BANKS['ans-c01'].length})`);
ok(BANKS['dop-c02'].length > 100, `DOP-C02 bank loaded (${BANKS['dop-c02'].length})`);
ok(BANKS['dea-c01'].length > 100, `DEA-C01 bank loaded (${BANKS['dea-c01'].length})`);
ok(Object.keys(window.EXAMS).length === 3, 'exam registry holds all three exams');
ok($$('.exam-card').length === 3, 'exam switcher renders one card per exam');
ok($$('.exam-card')[0].classList.contains('selected'), 'first exam is selected on boot');
ok(!!$('#startBtn'), 'start button rendered');
ok($$('.mode-card').length === 2, 'two mode cards');
ok($$('#countSel option').length > 0, 'length selector populated');
const selOpt = $('#countSel option[selected]') || $('#countSel').options[$('#countSel').selectedIndex];
ok(!!selOpt && /questions/.test(selOpt.textContent), 'length option markup is well formed: ' + selOpt.textContent.trim());
ok($$('#domainSel option').length >= 5, `domain filter has ${$$('#domainSel option').length} options`);
ok(/\d+/.test($('.stat-value').textContent), 'stats render');

console.log('\n[2] Start a practice session');
$('#countSel').value = '10';
$('#startBtn').click();
ok(!!$('#choices'), 'question view rendered');
ok($('.question-text').textContent.length > 40, 'question text present');
ok($$('.choice').length >= 4, `${$$('.choice').length} choices rendered`);
ok($('#submitBtn').disabled === true, 'submit disabled before a selection');
ok(/Question 1 of 10/.test($('.quiz-meta').textContent.replace(/\s+/g, ' ')), 'progress counter reads 1 of 10');

console.log('\n[3] Select an answer');
const firstInput = $('.choice input');
firstInput.checked = true;
firstInput.dispatchEvent(new window.Event('change', { bubbles: true }));
ok($('#submitBtn').disabled === false, 'submit enabled after selecting');
ok($$('.choice.selected').length === 1, 'choice shows selected state');

console.log('\n[4] Submit -> grading + explanation');
$('#submitBtn').click();
ok($('#choices').classList.contains('graded'), 'choice list marked graded');
ok(!!$('.verdict'), 'verdict banner shown');
const verdictTxt = $('.verdict').textContent.trim();
ok(/Correct|Incorrect/.test(verdictTxt), 'verdict states correct/incorrect: ' + verdictTxt.slice(0, 60));
ok($$('.choice.correct').length >= 1, 'correct answer highlighted');
ok(!!$('.explanation'), 'explanation panel shown');
ok($('.explanation p').textContent.length > 80, `explanation has real content (${$('.explanation p').textContent.length} chars)`);
ok($$('.choice input:not([disabled])').length === 0, 'inputs locked after grading');
ok(/Next question/.test($('#submitBtn').textContent), 'button becomes Next question');

console.log('\n[5] Advance through the whole session');
let guard = 0;
while ($('#submitBtn') && guard++ < 60) {
  const btn = $('#submitBtn');
  if (/results/i.test(btn.textContent) ) { btn.click(); break; }
  if (/Next question/.test(btn.textContent)) { btn.click(); continue; }
  // fresh question: pick first choice then submit
  const inp = $('.choice input');
  if (!inp) break;
  inp.checked = true;
  inp.dispatchEvent(new window.Event('change', { bubbles: true }));
  btn.click();
}
ok(!!$('.score-hero'), 'results screen reached');
ok(/%/.test($('.score-pct').textContent), 'score percentage shown: ' + ($('.score-pct') || {}).textContent);
ok(!!$('.verdict-badge'), 'pass/fail badge shown: ' + $('.verdict-badge').textContent.trim());
ok($$('.bd-row').length >= 1, `domain breakdown rendered (${$$('.bd-row').length} rows)`);
ok($$('.review-item').length === 10, `review list has all 10 questions (${$$('.review-item').length})`);

console.log('\n[6] Review expansion');
const head = $('.review-head');
head.click();
ok($('.review-body').hidden === false, 'review item expands on click');
ok($('.review-body .choices').children.length >= 4, 'review shows choices');

console.log('\n[7] Retry-missed flow');
const retry = $('#retryWrongBtn');
ok(!!retry, 'retry button present');
if (!retry.disabled) {
  retry.click();
  ok(!!$('#choices'), 'retry starts a new question session');
} else {
  ok(true, 'retry disabled (perfect score) — expected branch');
}

console.log('\n[8] Exam mode');
$('#brandHome') && $('#brandHome').click();
$$('.mode-card')[1].click();
ok($('#practiceOpts').style.display === 'none', 'practice options hidden in exam mode');
$('#startBtn').click();
ok(!!$('#timer'), 'exam timer rendered');
ok(/Save answer/.test($('#submitBtn').textContent), 'exam mode uses Save answer (no instant feedback)');
const ei = $('.choice input');
ei.checked = true;
ei.dispatchEvent(new window.Event('change', { bubbles: true }));
$('#submitBtn').click();
ok(!$('.verdict'), 'no verdict shown mid-exam');
ok(/Question 2 of/.test($('.quiz-meta').textContent.replace(/\s+/g, ' ')), 'exam advances without feedback');

console.log('\n[9] Theme toggle');
$('#themeToggle').click();
const darkOn = doc.documentElement.classList.contains('dark');
$('#themeToggle').click();
const darkOff = doc.documentElement.classList.contains('dark');
ok(darkOn !== darkOff, 'theme toggle flips dark class');

console.log('\n[10] Finish early');
$('#brandHome').click();
ok($$('.mode-card')[1].classList.contains('selected'), 'home remembers exam mode was selected');
$$('.mode-card')[0].click();      // back to practice
ok($('#practiceOpts').style.display !== 'none', 'practice options reappear');
$('#countSel').value = '10';
$('#startBtn').click();
ok(!!$('#finishBtn'), 'finish button rendered during a question');
const fi = $('.choice input');
fi.checked = true;
fi.dispatchEvent(new window.Event('change', { bubbles: true }));
$('#submitBtn').click();          // grade question 1 of 10
$('#finishBtn').click();          // skip the other 9
ok(!!$('.score-hero'), 'finish jumps straight to results');
ok($$('.review-item').length === 1, `only the answered question is scored (${$$('.review-item').length})`);
ok(/^(0|100)%$/.test($('.score-pct').textContent.trim()), 'score is out of the answered question only: ' + $('.score-pct').textContent);

console.log('\n[11] Switching exams');
$('#brandHome').click();
$$('.exam-card')[1].click();                      // -> DOP-C02
ok(/DevOps Engineer/.test($('h1').textContent), 'home retitles for the new exam: ' + $('h1').textContent.trim());
ok($$('.exam-card')[1].classList.contains('selected'), 'DOP-C02 card is now selected');
ok($$('#domainSel option').length === 7, `DOP-C02 domain filter shows 6 domains plus All (${$$('#domainSel option').length})`);
ok(/^250$/.test($('.stat-value').textContent.trim()), 'stat row reflects the DOP-C02 bank size: ' + $('.stat-value').textContent.trim());
ok(/DOP-C02/.test(doc.title), 'page title follows the active exam: ' + doc.title);
ok(/DevOps Engineer/.test($('#footerNote').textContent), 'footer note follows the active exam');

console.log('\n[12] DOP-C02 exam constants');
$$('.mode-card')[1].click();                      // exam simulation
ok(/75 questions, 180 minutes/.test($$('.mode-card')[1].textContent.replace(/\s+/g, ' ')),
   'exam card states this exam\'s size and duration');
$('#startBtn').click();
ok(!!$('#timer'), 'DOP-C02 exam renders a timer');
ok(/Question 1 of 75/.test($('.quiz-meta').textContent.replace(/\s+/g, ' ')), 'exam pool is 75 questions');

console.log('\n[13] DOP-C02 practice grading');
$('#brandHome').click();
$$('.mode-card')[0].click();                      // back to practice
$('#countSel').value = '10';
$('#startBtn').click();
const dopInput = $('.choice input');
dopInput.checked = true;
dopInput.dispatchEvent(new window.Event('change', { bubbles: true }));
$('#submitBtn').click();
ok(!!$('.verdict'), 'DOP-C02 practice mode grades inline');
ok(!!$('.explanation'), 'DOP-C02 explanation panel shown');
ok($('.explanation p').textContent.length > 120,
   `DOP-C02 explanation has real content (${$('.explanation p').textContent.length} chars)`);

console.log('\n[14] Switching to DEA-C01');
$('#brandHome').click();
$$('.exam-card')[2].click();                      // -> DEA-C01
ok(/Data Engineer/.test($('h1').textContent), 'home retitles for DEA-C01: ' + $('h1').textContent.trim());
ok($$('.exam-card')[2].classList.contains('selected'), 'DEA-C01 card is now selected');
ok($$('#domainSel option').length === 5, `DEA-C01 domain filter shows 4 domains plus All (${$$('#domainSel option').length})`);
ok(/^220$/.test($('.stat-value').textContent.trim()), 'stat row reflects the DEA-C01 bank size: ' + $('.stat-value').textContent.trim());
ok(/DEA-C01/.test(doc.title), 'page title follows the active exam: ' + doc.title);
$$('.mode-card')[1].click();                      // exam simulation
ok(/65 questions, 130 minutes/.test($$('.mode-card')[1].textContent.replace(/\s+/g, ' ')),
   'DEA-C01 exam card states this exam\'s size and duration');
$('#startBtn').click();
ok(/Question 1 of 65/.test($('.quiz-meta').textContent.replace(/\s+/g, ' ')), 'DEA-C01 exam pool is 65 questions');
$('#brandHome').click();
$$('.mode-card')[0].click();                      // back to practice
$('#countSel').value = '10';
$('#startBtn').click();
const deaInput = $('.choice input');
deaInput.checked = true;
deaInput.dispatchEvent(new window.Event('change', { bubbles: true }));
$('#submitBtn').click();
ok(!!$('.verdict'), 'DEA-C01 practice mode grades inline');
ok($('.explanation p').textContent.length > 120,
   `DEA-C01 explanation has real content (${$('.explanation p').textContent.length} chars)`);

console.log('\n[15] Bank integrity (all exams)');
let bad = [];
Object.keys(BANKS).forEach((examId) => {
  const domains = window.EXAMS[examId].domains;
  const ids = new Set();
  BANKS[examId].forEach((q) => {
    const at = `${examId}/${q.id}`;
    if (ids.has(q.id)) bad.push(`${at}: duplicate id`);
    ids.add(q.id);
    if (!Array.isArray(q.answer) || !q.answer.length) bad.push(`${at}: answer is not a non-empty array`);
    else q.answer.forEach((L) => { if (!(L in (q.choices || {}))) bad.push(`${at}: answer ${L} missing from choices`); });
    if (!!q.multi !== (q.answer || []).length > 1) bad.push(`${at}: multi flag disagrees with answer count`);
    if (!domains[q.domain]) bad.push(`${at}: domain ${q.domain} is not in the exam registry`);
    if (!q.explanation) bad.push(`${at}: no explanation`);
  });
});
ok(bad.length === 0, `every question is well formed${bad.length ? ' — ' + bad.slice(0, 5).join('; ') : ''}`);
ok(BANKS['dop-c02'].filter((q) => q.multi).length > 0, 'DOP-C02 bank contains multi-answer questions');
ok(new Set(BANKS['dop-c02'].map((q) => q.domain)).size === 6, 'DOP-C02 bank covers all six domains');
ok(BANKS['dea-c01'].filter((q) => q.multi).length >= 30, `DEA-C01 bank contains multi-answer questions (${BANKS['dea-c01'].filter((q) => q.multi).length})`);
ok(new Set(BANKS['dea-c01'].map((q) => q.domain)).size === 4, 'DEA-C01 bank covers all four domains');
ok(BANKS['dea-c01'].every((q) => q.source === 'authored'), 'every DEA-C01 question is original work');

console.log(`\n${'='.repeat(46)}\n  PASS ${pass}   FAIL ${fail}\n${'='.repeat(46)}`);
process.exit(fail ? 1 : 0);
}
