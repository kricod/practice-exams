/* End-to-end test of the practice exam UI using jsdom. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const APP = '/home/tkrimi/projects/practice-exam';
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

// load scripts manually in order
window.eval(fs.readFileSync(path.join(APP, 'questions.js'), 'utf8'));
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
ok(window.QUESTIONS.length > 100, `question bank loaded (${window.QUESTIONS.length})`);
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

console.log(`\n${'='.repeat(46)}\n  PASS ${pass}   FAIL ${fail}\n${'='.repeat(46)}`);
process.exit(fail ? 1 : 0);
}
