/* =============================================================================
   AWS Practice Exams — application logic
   Renders into #app. State is kept in memory; theme + exam choice in storage.

   Everything exam-specific (domain names, pass mark, timer, exam length) comes
   from window.EXAMS in exams.js, keyed by state.exam. Question banks register
   themselves into window.QUESTION_BANKS under the same key. Read those through
   exam() and bank() rather than capturing them in a closure variable — the
   active exam changes at runtime when the user picks a different card.
   ============================================================================= */
(function () {
  'use strict';

  var EXAMS = window.EXAMS || {};
  var BANKS = window.QUESTION_BANKS || {};

  // Exams that actually have a bank loaded, in registry order.
  var EXAM_IDS = Object.keys(EXAMS).filter(function (id) {
    return (BANKS[id] || []).length > 0;
  });

  var app = document.getElementById('app');

  var state = {
    exam: EXAM_IDS[0] || window.DEFAULT_EXAM,
    mode: 'practice',
    view: 'home',
    pool: [],
    index: 0,
    selected: [],
    graded: false,
    answers: {},          // id -> { picked: [], correct: bool }
    startedAt: 0,
    deadline: 0,
    timerId: null
  };

  /* ---------- active exam ---------- */

  // Config for the exam currently selected. Never cached — state.exam moves.
  function exam() {
    return EXAMS[state.exam] || { domains: {}, passMark: 75, examMinutes: 170,
      examSize: 65, name: '', code: '', blurb: '', credits: '', icon: '' };
  }

  function bank() { return BANKS[state.exam] || []; }

  /* ---------- helpers ---------- */

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var x = a.slice().sort().join(''), y = b.slice().sort().join('');
    return x === y;
  }

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { /* private mode */ }
    return null;
  }

  /* ---------- theme ---------- */

  function initTheme() {
    var saved = store('ansc01-theme');
    var prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
    document.getElementById('themeToggle').addEventListener('click', function () {
      var dark = document.documentElement.classList.toggle('dark');
      store('ansc01-theme', dark ? 'dark' : 'light');
    });
  }

  /* ---------- home ---------- */

  function renderHome() {
    state.view = 'home';
    var ex = exam();
    var questions = bank();
    var domains = {};
    questions.forEach(function (q) {
      var d = q.domain || 0;
      domains[d] = (domains[d] || 0) + 1;
    });
    var multi = questions.filter(function (q) { return q.multi; }).length;

    var domainOpts = ['<option value="all">All domains</option>'];
    Object.keys(ex.domains).forEach(function (d) {
      if (domains[d]) {
        domainOpts.push('<option value="' + d + '">Domain ' + d + ' — ' +
          esc(ex.domains[d]) + ' (' + domains[d] + ')</option>');
      }
    });

    var counts = [10, 20, 30, 50, ex.examSize, questions.length]
      .filter(function (n, i, arr) {
        return n <= questions.length && arr.indexOf(n) === i;
      }).sort(function (a, b) { return a - b; });
    var defaultCount = counts.indexOf(20) !== -1 ? 20 : counts[0];
    var countOpts = counts.map(function (n) {
      return '<option value="' + n + '"' + (n === defaultCount ? ' selected' : '') + '>' +
        n + ' questions</option>';
    }).join('');

    // Exam switcher. Only rendered when more than one bank is loaded, so a
    // single-exam deployment looks exactly as it did before.
    var examHtml = EXAM_IDS.length > 1
      ? '<h2>Choose an exam</h2><div class="exam-grid">' +
          EXAM_IDS.map(function (id) {
            var e = EXAMS[id];
            return '<button class="exam-card' + (id === state.exam ? ' selected' : '') +
              '" data-exam="' + esc(id) + '">' +
              '<div class="exam-icon">' + esc(e.icon || '') + '</div>' +
              '<div class="exam-code">' + esc(e.code) + '</div>' +
              '<div class="exam-name">' + esc(e.short || e.name) + '</div>' +
              '<div class="exam-count">' + (BANKS[id] || []).length + ' questions</div>' +
              '</button>';
          }).join('') +
        '</div>'
      : '';

    app.innerHTML = '';
    app.appendChild(el(
      '<div>' +
      '<h1>' + esc(ex.name) + '</h1>' +
      '<p class="lead">' + esc(ex.code) + ' practice exam. Answer, submit, and get an ' +
      'immediate verdict with a full explanation.</p>' +

      examHtml +

      '<div class="stat-row">' +
        '<div class="stat"><div class="stat-value">' + questions.length + '</div>' +
          '<div class="stat-label">Questions</div></div>' +
        '<div class="stat"><div class="stat-value">' + multi + '</div>' +
          '<div class="stat-label">Multi-answer</div></div>' +
        '<div class="stat"><div class="stat-value">' + Object.keys(domains).filter(function(d){return d!=='0';}).length + '</div>' +
          '<div class="stat-label">Domains covered</div></div>' +
        '<div class="stat"><div class="stat-value">' + ex.passMark + '%</div>' +
          '<div class="stat-label">Pass mark</div></div>' +
      '</div>' +

      '<h2>Choose a mode</h2>' +
      '<div class="mode-grid">' +
        '<button class="mode-card' + (state.mode === 'exam' ? '' : ' selected') +
          '" data-mode="practice">' +
          '<div class="mode-title">📚 Practice</div>' +
          '<div class="mode-desc">Submit one question at a time. See instantly whether ' +
          'you were right, with the explanation before you move on.</div>' +
        '</button>' +
        '<button class="mode-card' + (state.mode === 'exam' ? ' selected' : '') +
          '" data-mode="exam">' +
          '<div class="mode-title">⏱️ Exam simulation</div>' +
          '<div class="mode-desc">' + ex.examSize + ' questions, ' + ex.examMinutes +
          ' minutes, no feedback until the end — like the real thing.</div>' +
        '</button>' +
      '</div>' +

      '<div class="field-row" id="practiceOpts"' +
        (state.mode === 'exam' ? ' style="display:none"' : '') + '>' +
        '<div class="field"><label for="countSel">Length</label>' +
          '<select id="countSel">' + countOpts + '</select></div>' +
        '<div class="field"><label for="domainSel">Domain filter</label>' +
          '<select id="domainSel">' + domainOpts.join('') + '</select></div>' +
      '</div>' +

      '<div class="btn-row">' +
        '<button class="btn btn-primary" id="startBtn">Start</button>' +
        '<button class="btn btn-ghost" id="resumeBtn" hidden>Resume last session</button>' +
      '</div>' +
      '</div>'
    ));

    var examCards = app.querySelectorAll('.exam-card');
    Array.prototype.forEach.call(examCards, function (c) {
      c.addEventListener('click', function () {
        var id = c.getAttribute('data-exam');
        if (id === state.exam) return;
        state.exam = id;
        store('practice-exam-id', id);
        applyExamChrome();
        renderHome();          // stats, domain filter and lengths are per-exam
      });
    });

    var modeCards = app.querySelectorAll('.mode-card');
    Array.prototype.forEach.call(modeCards, function (c) {
      c.addEventListener('click', function () {
        Array.prototype.forEach.call(modeCards, function (o) { o.classList.remove('selected'); });
        c.classList.add('selected');
        state.mode = c.getAttribute('data-mode');
        app.querySelector('#practiceOpts').style.display =
          state.mode === 'exam' ? 'none' : '';
      });
    });

    app.querySelector('#startBtn').addEventListener('click', function () {
      var n, dom;
      if (state.mode === 'exam') {
        n = Math.min(ex.examSize, questions.length);
        dom = 'all';
      } else {
        n = parseInt(app.querySelector('#countSel').value, 10);
        dom = app.querySelector('#domainSel').value;
      }
      startQuiz(n, dom);
    });
  }

  /* ---------- quiz ---------- */

  function startQuiz(count, domain) {
    var pool = bank().filter(function (q) {
      return domain === 'all' || String(q.domain) === String(domain);
    });
    pool = shuffle(pool.slice()).slice(0, count);
    if (!pool.length) { renderHome(); return; }

    state.pool = pool;
    state.index = 0;
    state.selected = [];
    state.graded = false;
    state.answers = {};
    state.startedAt = Date.now();

    if (state.mode === 'exam') {
      state.deadline = Date.now() + exam().examMinutes * 60000;
      startTimer();
    }
    renderQuestion();
  }

  function startTimer() {
    stopTimer();
    state.timerId = setInterval(function () {
      if (state.view !== 'quiz') return;
      var left = state.deadline - Date.now();
      var node = document.getElementById('timer');
      if (left <= 0) { stopTimer(); finish(); return; }
      if (node) node.textContent = fmtTime(left);
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
  }

  function fmtTime(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
  }

  function currentQ() { return state.pool[state.index]; }

  function renderQuestion() {
    state.view = 'quiz';
    var q = currentQ();
    var letters = Object.keys(q.choices).sort();
    var pct = Math.round((state.index / state.pool.length) * 100);
    var answered = Object.keys(state.answers).length;

    var tags = ['<span class="tag tag-primary">Domain ' + (q.domain || '—') + '</span>'];
    if (q.topic) tags.push('<span class="tag">' + esc(q.topic) + '</span>');
    if (q.difficulty) tags.push('<span class="tag">' + esc(q.difficulty) + '</span>');
    if (q.multi) {
      tags.push('<span class="tag tag-multi">Select ' +
        (q.answer.length === 2 ? 'TWO' : q.answer.length === 3 ? 'THREE' : q.answer.length) +
        '</span>');
    }

    var choiceHtml = letters.map(function (L) {
      return '<li><label class="choice" data-letter="' + L + '">' +
        '<input type="' + (q.multi ? 'checkbox' : 'radio') + '" name="choice" value="' + L + '">' +
        '<span class="choice-letter">' + L + '</span>' +
        '<span class="choice-text">' + esc(q.choices[L]) + '</span>' +
        '<span class="choice-mark"></span>' +
        '</label></li>';
    }).join('');

    app.innerHTML = '';
    app.appendChild(el(
      '<div>' +
      '<div class="quiz-top">' +
        '<div class="quiz-meta">' +
          '<span>Question <strong>' + (state.index + 1) + '</strong> of <strong>' +
            state.pool.length + '</strong></span>' +
          '<span>' + (state.mode === 'exam'
            ? 'Time left <strong id="timer">' + fmtTime(state.deadline - Date.now()) + '</strong>'
            : 'Score <strong>' + scoreSoFar() + '/' + answered + '</strong>') + '</span>' +
        '</div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '</div>' +

      '<div class="card">' +
        '<div class="tag-row">' + tags.join('') + '</div>' +
        '<p class="question-text">' + esc(q.question) + '</p>' +
        '<ul class="choices" id="choices">' + choiceHtml + '</ul>' +
        '<div id="feedback"></div>' +
        '<div class="nav-row">' +
          '<button class="btn btn-ghost" id="quitBtn">Quit</button>' +
          '<div class="btn-row">' +
            '<button class="btn btn-secondary" id="finishBtn">Finish</button>' +
            '<button class="btn btn-primary" id="submitBtn" disabled>' +
              (state.mode === 'exam' ? 'Save answer' : 'Submit') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '</div>'
    ));

    var list = app.querySelector('#choices');
    list.addEventListener('change', function (e) {
      if (state.graded) return;
      var input = e.target;
      if (!input || input.name !== 'choice') return;
      if (q.multi) {
        state.selected = Array.prototype.slice
          .call(list.querySelectorAll('input:checked'))
          .map(function (i) { return i.value; });
      } else {
        state.selected = [input.value];
      }
      Array.prototype.forEach.call(list.querySelectorAll('.choice'), function (c) {
        c.classList.toggle('selected',
          state.selected.indexOf(c.getAttribute('data-letter')) !== -1);
      });
      app.querySelector('#submitBtn').disabled = state.selected.length === 0;
    });

    app.querySelector('#submitBtn').addEventListener('click', onSubmit);
    app.querySelector('#quitBtn').addEventListener('click', function () {
      if (confirm('End this session and go back to the start?')) {
        stopTimer();
        renderHome();
      }
    });

    app.querySelector('#finishBtn').addEventListener('click', finishEarly);
  }

  // Skip the remaining questions and jump straight to the results screen.
  // Exam mode keeps the full pool, so unanswered questions score as wrong —
  // that is how the real exam is marked. Practice mode instead scores only
  // what was actually attempted.
  function finishEarly() {
    var answered = Object.keys(state.answers).length;
    var left = state.pool.length - answered;
    if (left <= 0) { finish(); return; }

    if (state.mode === 'exam') {
      if (!confirm('Finish the exam now? The ' + left + ' unanswered question' +
        (left === 1 ? '' : 's') + ' will be marked incorrect.')) return;
      finish();
      return;
    }

    if (!answered) {
      if (!confirm('You have not answered anything yet. End this session?')) return;
      stopTimer();
      renderHome();
      return;
    }
    if (!confirm('Finish now? You will be scored on the ' + answered +
      ' question' + (answered === 1 ? '' : 's') + ' you have answered.')) return;

    state.pool = state.pool.filter(function (q) { return state.answers[q.id]; });
    finish();
  }

  function scoreSoFar() {
    return Object.keys(state.answers).filter(function (k) {
      return state.answers[k].correct;
    }).length;
  }

  function onSubmit() {
    var q = currentQ();
    var correct = sameSet(state.selected, q.answer);
    state.answers[q.id] = { picked: state.selected.slice(), correct: correct };

    if (state.mode === 'exam') { advance(); return; }

    state.graded = true;
    var list = app.querySelector('#choices');
    list.classList.add('graded');

    Array.prototype.forEach.call(list.querySelectorAll('.choice'), function (c) {
      var L = c.getAttribute('data-letter');
      var isAns = q.answer.indexOf(L) !== -1;
      var picked = state.selected.indexOf(L) !== -1;
      c.classList.remove('selected');
      var mark = c.querySelector('.choice-mark');
      if (isAns) { c.classList.add('correct'); mark.textContent = '✓'; }
      else if (picked) { c.classList.add('wrong'); mark.textContent = '✕'; }
      var input = c.querySelector('input');
      if (input) input.disabled = true;
    });

    var expl = q.explanation
      ? '<div class="explanation"><h3>Explanation</h3><p>' + esc(q.explanation) + '</p>' +
        (q.answer_disputed
          ? '<div class="dispute">⚠️ The source answer key for this question is contested. ' +
            'The explanation reflects documented AWS behaviour.</div>'
          : '') +
        '</div>'
      : '';

    var fb = app.querySelector('#feedback');
    fb.innerHTML =
      '<div class="verdict ' + (correct ? 'ok' : 'no') + '">' +
        (correct ? '✓ Correct' : '✕ Incorrect — the answer is ' + q.answer.join(', ')) +
      '</div>' + expl;

    var btn = app.querySelector('#submitBtn');
    btn.textContent = state.index + 1 >= state.pool.length ? 'See results' : 'Next question';
    btn.disabled = false;
    btn.removeEventListener('click', onSubmit);
    btn.addEventListener('click', advance);
    btn.focus();
  }

  function advance() {
    state.selected = [];
    state.graded = false;
    if (state.index + 1 >= state.pool.length) { finish(); return; }
    state.index++;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- results ---------- */

  function finish() {
    stopTimer();
    state.view = 'results';

    var total = state.pool.length;
    var right = scoreSoFar();
    var pct = total ? Math.round((right / total) * 100) : 0;
    var passMark = exam().passMark;
    var passed = pct >= passMark;
    var elapsed = Date.now() - state.startedAt;

    // per-domain tally
    var byDom = {};
    state.pool.forEach(function (q) {
      var d = q.domain || 0;
      byDom[d] = byDom[d] || { right: 0, total: 0 };
      byDom[d].total++;
      if (state.answers[q.id] && state.answers[q.id].correct) byDom[d].right++;
    });

    var R = 66, C = 2 * Math.PI * R;
    var offset = C * (1 - pct / 100);
    var ringColor = passed ? 'var(--color-success)' : 'var(--color-danger)';

    var domainNames = exam().domains;
    var bdHtml = Object.keys(byDom).sort().map(function (d) {
      var b = byDom[d];
      var p = Math.round((b.right / b.total) * 100);
      return '<div class="bd-row">' +
        '<div class="bd-name">' + (domainNames[d] ? esc(domainNames[d]) : 'Uncategorised') + '</div>' +
        '<div class="bd-track"><div class="bd-fill" style="width:' + p + '%"></div></div>' +
        '<div class="bd-score">' + b.right + '/' + b.total + '</div>' +
      '</div>';
    }).join('');

    var reviewHtml = state.pool.map(function (q, i) {
      var a = state.answers[q.id];
      var ok = a && a.correct;
      var picked = a && a.picked.length ? a.picked.join(', ') : '—';
      var letters = Object.keys(q.choices).sort();
      var choiceList = letters.map(function (L) {
        var isAns = q.answer.indexOf(L) !== -1;
        var wasPicked = a && a.picked.indexOf(L) !== -1;
        var cls = isAns ? 'correct' : (wasPicked ? 'wrong' : '');
        return '<li><span class="choice ' + cls + '">' +
          '<span class="choice-letter">' + L + '</span>' +
          '<span class="choice-text">' + esc(q.choices[L]) + '</span>' +
          '<span class="choice-mark">' + (isAns ? '✓' : wasPicked ? '✕' : '') + '</span>' +
          '</span></li>';
      }).join('');

      return '<div class="review-item">' +
        '<button class="review-head" data-idx="' + i + '">' +
          '<span class="review-num ' + (ok ? 'ok' : 'no') + '">' + (i + 1) + '</span>' +
          '<span class="review-q">' + esc(q.question.slice(0, 120)) + '</span>' +
          '<span class="tag">' + (ok ? 'Correct' : 'Wrong') + '</span>' +
        '</button>' +
        '<div class="review-body" hidden>' +
          '<p class="question-text">' + esc(q.question) + '</p>' +
          '<ul class="choices graded">' + choiceList + '</ul>' +
          '<p style="font-size:14px;color:var(--color-text-secondary);margin:0 0 12px">' +
            'You answered <strong>' + esc(picked) + '</strong> · Correct answer <strong>' +
            esc(q.answer.join(', ')) + '</strong></p>' +
          (q.explanation
            ? '<div class="explanation"><h3>Explanation</h3><p>' + esc(q.explanation) + '</p></div>'
            : '') +
        '</div>' +
      '</div>';
    }).join('');

    app.innerHTML = '';
    app.appendChild(el(
      '<div>' +
      '<div class="card score-hero">' +
        '<div class="score-ring">' +
          '<svg width="148" height="148">' +
            '<circle class="score-ring-track" cx="74" cy="74" r="' + R + '" fill="none" stroke-width="11"/>' +
            '<circle class="score-ring-fill" cx="74" cy="74" r="' + R + '" fill="none" stroke-width="11" ' +
              'stroke="' + ringColor + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + offset + '"/>' +
          '</svg>' +
          '<div class="score-ring-label"><div>' +
            '<div class="score-pct">' + pct + '%</div>' +
            '<div class="score-sub">' + right + ' / ' + total + '</div>' +
          '</div></div>' +
        '</div>' +
        '<div class="verdict-badge ' + (passed ? 'pass' : 'fail') + '">' +
          (passed ? 'PASS' : 'BELOW PASS MARK') + '</div>' +
        '<p class="lead" style="margin:6px 0 0">Finished in ' + fmtTime(elapsed) +
          ' · pass mark ' + passMark + '%</p>' +
      '</div>' +

      '<div class="breakdown"><h2>By domain</h2>' + bdHtml + '</div>' +

      '<div class="btn-row" style="margin-bottom:26px">' +
        '<button class="btn btn-primary" id="againBtn">New session</button>' +
        '<button class="btn btn-secondary" id="retryWrongBtn">Retry the ones I missed</button>' +
      '</div>' +

      '<h2>Review</h2>' +
      '<div id="review">' + reviewHtml + '</div>' +
      '</div>'
    ));

    app.querySelector('#review').addEventListener('click', function (e) {
      var head = e.target.closest ? e.target.closest('.review-head') : null;
      if (!head) return;
      var body = head.nextElementSibling;
      body.hidden = !body.hidden;
    });

    app.querySelector('#againBtn').addEventListener('click', renderHome);

    var wrong = state.pool.filter(function (q) {
      return !(state.answers[q.id] && state.answers[q.id].correct);
    });
    var retry = app.querySelector('#retryWrongBtn');
    if (!wrong.length) { retry.disabled = true; retry.textContent = 'Nothing missed 🎉'; }
    retry.addEventListener('click', function () {
      if (!wrong.length) return;
      state.mode = 'practice';
      state.pool = shuffle(wrong.slice());
      state.index = 0;
      state.selected = [];
      state.graded = false;
      state.answers = {};
      state.startedAt = Date.now();
      renderQuestion();
      window.scrollTo({ top: 0 });
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- boot ---------- */

  // Page title and footer follow the active exam; both live in the static
  // shell, so they are updated imperatively rather than by a render function.
  function applyExamChrome() {
    var ex = exam();
    document.title = 'AWS ' + ex.code + ' — Practice Tests Exams Platform';

    var note = document.getElementById('footerNote');
    if (note) {
      note.textContent = 'Study material for the ' + ex.name + ' (' + ex.code +
        ') exam. Not affiliated with or endorsed by Amazon Web Services.';
    }

    var credits = document.getElementById('footerCredits');
    if (credits) {
      credits.textContent = 'Question bank: ' + bank().length + ' questions — ' +
        ex.credits + ' Explanations generated for study use; verify against AWS docs.';
    }
  }

  function boot() {
    initTheme();
    document.getElementById('brandHome').addEventListener('click', function (e) {
      e.preventDefault();
      if (state.view === 'quiz' && !confirm('Leave this session?')) return;
      stopTimer();
      renderHome();
    });

    var savedExam = store('practice-exam-id');
    if (savedExam && EXAM_IDS.indexOf(savedExam) !== -1) state.exam = savedExam;

    if (!EXAM_IDS.length) {
      document.title = 'Practice Tests Exams Platform';
      app.innerHTML = '<div class="empty"><h2>No questions loaded</h2>' +
        '<p>No questions-*.js bank registered into window.QUESTION_BANKS.</p></div>';
      return;
    }

    applyExamChrome();
    renderHome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
