(function () {
  'use strict';

  var KEY = 'cargas-inroom-exercises-v1';
  var EX = window.EXERCISES;
  var INTERVIEWER = location.hash === '#interviewer'; // steps become clickable
  window.addEventListener('hashchange', function () {
    INTERVIEWER = location.hash === '#interviewer';
    if (state && !$('#screen-work').classList.contains('hidden')) { flush(); renderSteps(); loadExercise(state.current); }
  });
  var $ = function (s) { return document.querySelector(s); };

  var state = null;
  var awaySince = null;
  var prevLen = 0;
  var saveTimer = null;

  /* ---------- storage ---------- */
  function loadSaved() {
    var a = null, b = null;
    try { a = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    try { b = JSON.parse(localStorage.getItem(KEY + '-backup')); } catch (e) {}
    // Prefer whichever copy has more written, in case one was cut short.
    var len = function (s) { return s ? s.responses.join('').length + s.log.length : -1; };
    return len(b) > len(a) ? b : a;
  }
  var fileHandle = null, fileTimer = null;
  function persist() {
    var ok = true, json = JSON.stringify(state);
    try {
      localStorage.setItem(KEY, json);
      localStorage.setItem(KEY + '-backup', json); // second copy in case the first write is interrupted
    } catch (e) { ok = false; }
    var el = $('#saved');
    if (el) {
      el.textContent = (ok ? 'Saved ' : 'NOT SAVED ') + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + (fileHandle ? ' + file' : '');
    }
    if (fileHandle) { clearTimeout(fileTimer); fileTimer = setTimeout(writeFile, 1500); }
  }
  function writeFile() {
    if (!fileHandle || !state) return;
    fileHandle.createWritable().then(function (w) {
      return w.write(buildTxt()).then(function () { return w.close(); });
    }).catch(function () { var el = $('#saved'); if (el) el.textContent = 'File save failed'; });
  }
  function pickFile() {
    if (!window.showSaveFilePicker) { alert('Saving straight to a file needs Chrome or Edge.'); return; }
    var safe = (state && state.name || 'candidate').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
    window.showSaveFilePicker({ suggestedName: safe + '_written_exercises_autosave.txt', types: [{ description: 'Text', accept: { 'text/plain': ['.txt'] } }] })
      .then(function (h) { fileHandle = h; $('#btn-autofile').textContent = 'File autosave on'; persist(); writeFile(); })
      .catch(function () {});
  }
  function newState(name) {
    return {
      name: name, startedAt: Date.now(), current: 0, furthest: 0,
      submitted: [false, false, false],
      responses: ['', '', ''],
      seconds: [0, 0, 0],
      log: []
    };
  }
  function addLog(type, detail) {
    if (!state || !$('#screen-work') || $('#screen-work').classList.contains('hidden')) return;
    state.log.push({ t: Date.now(), ex: state.current + 1, type: type, detail: detail || '' });
    persist();
  }

  /* ---------- screens ---------- */
  function show(id) {
    ['#screen-start', '#screen-work', '#screen-done'].forEach(function (s) {
      $(s).classList.toggle('hidden', s !== id);
    });
  }
  function goFullscreen() {
    var el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      el.requestFullscreen().catch(function () {});
    }
  }

  /* ---------- start ---------- */
  function initStart() {
    var saved = loadSaved();
    if (saved && saved.name) {
      $('#resume-box').classList.remove('hidden');
      $('#resume-name').textContent = saved.name;
      $('#btn-resume').onclick = function () {
        state = saved;
        if (typeof state.furthest !== 'number') state.furthest = Math.min(EX.length - 1, Math.max(state.current, state.submitted.lastIndexOf(true) + 1));
        goFullscreen();
        if (state.submitted.every(Boolean)) { show('#screen-done'); } else { enterWork(); }
      };
      $('#btn-fresh').onclick = function () {
        if (confirm('Discard the saved session and start over?')) {
          try { localStorage.removeItem(KEY); } catch (e) {}
          $('#resume-box').classList.add('hidden');
        }
      };
    }
    $('#start-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#name').value.trim();
      if (!name) return;
      state = newState(name);
      persist();
      goFullscreen();
      enterWork();
    });
  }

  /* ---------- work ---------- */
  function enterWork() {
    show('#screen-work');
    renderSteps();
    loadExercise(state.current);
    startClock();
  }

  function renderSteps() {
    var box = $('#steps');
    box.innerHTML = '';
    EX.forEach(function (ex, i) {
      var b = document.createElement('button');
      b.type = 'button';
      var reachable = INTERVIEWER || i <= state.furthest;
      b.className = 'step' + (i === state.current ? ' current' : '') + (state.submitted[i] ? ' done' : '') + (reachable ? ' clickable' : '');
      b.textContent = (state.submitted[i] ? '✓ ' : '') + 'Exercise ' + ex.id;
      if (reachable) b.onclick = function () { flush(); state.current = i; persist(); renderSteps(); loadExercise(i); };
      else b.disabled = true;
      box.appendChild(b);
    });
  }

  function loadExercise(i) {
    var ex = EX[i];
    $('#brief-inner').innerHTML = ex.brief;
    var ed = $('#editor');
    ed.innerHTML = state.responses[i] || '';
    ed.contentEditable = 'true';
    var revisiting = i < state.furthest;
    $('#btn-submit').textContent = revisiting ? 'Continue to Exercise ' + (state.furthest + 1) : (i === EX.length - 1 ? 'Submit & finish' : 'Submit & continue');
    prevLen = ed.innerText.length;
    updateCount();
    $('#brief').scrollTop = 0;
    ed.focus();
  }

  function flush() {
    if (!state) return;
    state.responses[state.current] = $('#editor').innerHTML;
    persist();
  }

  function words(text) {
    var t = text.replace(/\s+/g, ' ').trim();
    return t ? t.split(' ').length : 0;
  }
  function updateCount() {
    var n = words($('#editor').innerText);
    $('#count').textContent = n + (n === 1 ? ' word' : ' words');
  }

  /* ---------- elapsed time (recorded for the report only, never shown) ---------- */
  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }
  function startClock() {
    setInterval(function () {
      if ($('#screen-work').classList.contains('hidden')) return;
      state.seconds[state.current]++;
      if (state.seconds[state.current] % 3 === 0) { flush(); }
    }, 1000);
    // Last-chance saves when the page is hidden, closed, or the browser is backgrounded.
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', function () { if (document.hidden) flush(); });
  }

  /* ---------- editor: toolbar ---------- */
  function initToolbar() {
    var tb = $('#toolbar');
    tb.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep selection
    tb.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || $('#editor').contentEditable === 'false') return;
      $('#editor').focus();
      if (b.dataset.cmd) document.execCommand(b.dataset.cmd, false, null);
      if (b.dataset.block) document.execCommand('formatBlock', false, b.dataset.block);
      onEdited();
      refreshToolbar();
    });
    document.addEventListener('selectionchange', refreshToolbar);
  }
  function refreshToolbar() {
    document.querySelectorAll('#toolbar [data-cmd]').forEach(function (b) {
      var c = b.dataset.cmd;
      if (c === 'undo' || c === 'redo') return;
      var on = false;
      try { on = document.queryCommandState(c); } catch (e) {}
      b.classList.toggle('on', on);
    });
  }

  /* ---------- editor: lockdown ---------- */
  function block(e, type) {
    e.preventDefault();
    addLog(type);
    flash('Blocked: ' + type.replace('-', ' '));
  }
  var flashTimer = null;
  function flash(msg) {
    var h = document.querySelector('.hint');
    if (!h) return;
    h.textContent = msg + '. Write it in your own words.';
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { h.textContent = 'Pasting is disabled. Write it out in your own words.'; }, 2500);
  }

  function initLockdown() {
    var ed = $('#editor');
    var brief = $('#brief');

    ed.addEventListener('paste', function (e) { block(e, 'paste-blocked'); });
    ed.addEventListener('cut', function (e) { block(e, 'cut-blocked'); });
    ed.addEventListener('copy', function (e) { block(e, 'copy-blocked'); });
    ed.addEventListener('drop', function (e) { block(e, 'drop-blocked'); });
    ed.addEventListener('dragover', function (e) { e.preventDefault(); });
    ed.addEventListener('dragstart', function (e) { e.preventDefault(); });
    ed.addEventListener('contextmenu', function (e) { block(e, 'context-menu-blocked'); });

    // Catches paste-like edits that bypass the paste event (some input methods, extensions).
    ed.addEventListener('beforeinput', function (e) {
      var t = e.inputType || '';
      if (t === 'insertFromPaste' || t === 'insertFromDrop' || t === 'insertFromYank' ||
          t === 'insertFromPasteAsQuotation' || t === 'deleteByCut') {
        block(e, 'paste-blocked');
      }
    });

    ed.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      var mod = e.ctrlKey || e.metaKey;
      if ((mod && (k === 'v' || k === 'x' || k === 'c')) || (e.shiftKey && k === 'insert')) {
        e.preventDefault();
        addLog(k === 'c' ? 'copy-blocked' : k === 'x' ? 'cut-blocked' : 'paste-blocked');
        flash('Blocked');
      }
    });

    // The brief: no selecting, copying, dragging, or right-click.
    ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'].forEach(function (ev) {
      brief.addEventListener(ev, function (e) { e.preventDefault(); if (ev === 'copy') addLog('brief-copy-blocked'); });
    });

    // Large one-shot insertions that slipped through (autofill, dictation, injected text).
    ed.addEventListener('input', function () {
      var len = ed.innerText.length;
      if (len - prevLen > 40) addLog('large-insert', (len - prevLen) + ' chars at once');
      prevLen = len;
      onEdited();
    });

    // Window focus / fullscreen
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', function () { if (document.hidden) leave(); });
    window.addEventListener('focus', back);
    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement) addLog('left-fullscreen');
    });
    window.addEventListener('beforeunload', function (e) {
      if (state && !$('#screen-work').classList.contains('hidden')) { flush(); e.preventDefault(); e.returnValue = ''; }
    });
  }
  function leave() {
    if (awaySince || !state || $('#screen-work').classList.contains('hidden') || !$('#modal').classList.contains('hidden')) return;
    awaySince = Date.now();
  }
  function back() {
    if (!awaySince) return;
    var secs = Math.round((Date.now() - awaySince) / 1000);
    awaySince = null;
    if (secs >= 1) addLog('left-window', secs + 's');
  }

  function onEdited() {
    updateCount();
    flush(); // save on every change, not on a delay
  }

  /* ---------- submit ---------- */
  function openModal(title, body, ok) {
    $('#modal-title').textContent = title;
    $('#modal-body').textContent = body;
    $('#modal').classList.remove('hidden');
    $('#modal-cancel').onclick = function () { $('#modal').classList.add('hidden'); $('#editor').focus(); };
    $('#modal-ok').onclick = function () { $('#modal').classList.add('hidden'); ok(); };
  }
  function initSubmit() {
    $('#btn-submit').onclick = function () {
      var i = state.current;
      if (i < state.furthest) { flush(); state.current = state.furthest; persist(); renderSteps(); loadExercise(state.current); return; }
      var empty = words($('#editor').innerText) === 0;
      openModal(
        empty ? 'Submit an empty response?' : 'Submit Exercise ' + EX[i].id + '?',
        EX[i].confirm,
        function () {
          flush();
          state.submitted[i] = true;
          persist();
          if (i < EX.length - 1) { state.current = i + 1; state.furthest = Math.max(state.furthest, i + 1); persist(); renderSteps(); loadExercise(state.current); }
          else { show('#screen-done'); }
        });
    };
    $('#btn-brief').onclick = function () {
      var c = $('#brief').classList.toggle('collapsed');
      $('#btn-brief').textContent = c ? 'Show brief' : 'Hide brief';
    };
    $('#btn-fs').onclick = function () {
      if (document.fullscreenElement) document.exitFullscreen(); else goFullscreen();
    };
    $('#btn-copy-out').onclick = function () { flush(); downloadHtml(); };
    if (window.showSaveFilePicker) $('#btn-autofile').onclick = pickFile; else $('#btn-autofile').classList.add('hidden');
    $('#btn-back').onclick = function () { state.current = EX.length - 1; persist(); show('#screen-work'); renderSteps(); loadExercise(state.current); };
    $('#btn-dl-html').onclick = downloadHtml;
    $('#btn-dl-txt').onclick = downloadTxt;
  }

  /* ---------- export ---------- */
  var ALLOWED = { B: 1, STRONG: 1, I: 1, EM: 1, U: 1, UL: 1, OL: 1, LI: 1, P: 1, DIV: 1, BR: 1, H2: 1, H3: 1 };
  function clean(src, dest) {
    src.childNodes.forEach(function (n) {
      if (n.nodeType === 3) { dest.appendChild(document.createTextNode(n.nodeValue)); }
      else if (n.nodeType === 1) {
        if (n.tagName === 'SCRIPT' || n.tagName === 'STYLE') return;
        if (ALLOWED[n.tagName]) { var el = document.createElement(n.tagName); clean(n, el); dest.appendChild(el); }
        else clean(n, dest);
      }
    });
  }
  function sanitize(html) {
    var doc = new DOMParser().parseFromString(html || '', 'text/html');
    var out = document.createElement('div');
    clean(doc.body, out);
    return out;
  }
  function toText(node, listCtx) {
    var s = '';
    node.childNodes.forEach(function (n) {
      if (n.nodeType === 3) { s += n.nodeValue; return; }
      var t = n.tagName;
      if (t === 'BR') { s += '\n'; }
      else if (t === 'UL' || t === 'OL') { s += toText(n, { ordered: t === 'OL', i: 0 }) + '\n'; }
      else if (t === 'LI') {
        var pre = listCtx && listCtx.ordered ? (++listCtx.i) + '. ' : '- ';
        s += pre + toText(n, null).trim() + '\n';
      }
      else if (t === 'P' || t === 'DIV' || t === 'H2' || t === 'H3') { s += toText(n, null).replace(/\n*$/, '') + '\n\n'; }
      else { s += toText(n, null); }
    });
    return s;
  }
  function responseText(i) { return toText(sanitize(state.responses[i]), null).replace(/\n{3,}/g, '\n\n').trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function summary() {
    var counts = {}, away = 0;
    state.log.forEach(function (l) {
      counts[l.type] = (counts[l.type] || 0) + 1;
      if (l.type === 'left-window') away += parseInt(l.detail, 10) || 0;
    });
    return { counts: counts, away: away };
  }
  var LABELS = {
    'paste-blocked': 'Paste attempts blocked',
    'copy-blocked': 'Copy attempts blocked',
    'cut-blocked': 'Cut attempts blocked',
    'drop-blocked': 'Drag-and-drop attempts blocked',
    'context-menu-blocked': 'Right-click attempts blocked',
    'brief-copy-blocked': 'Copy attempts on the brief',
    'large-insert': 'Large single insertions (40+ characters at once)',
    'left-window': 'Times left the window / switched tabs',
    'left-fullscreen': 'Times left full screen'
  };

  function downloadHtml() {
    flush();
    var s = summary();
    var h = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(state.name) + ' - Written Exercises</title>' +
      '<style>body{font:16px/1.6 -apple-system,Segoe UI,Arial,sans-serif;max-width:820px;margin:32px auto;padding:0 20px;color:#1b1f24}' +
      'h1{margin-bottom:0}h2{margin-top:36px;border-bottom:1px solid #d9dde3;padding-bottom:6px}.m{color:#5b6573}' +
      'table{border-collapse:collapse}td,th{border:1px solid #d9dde3;padding:6px 12px;text-align:left}' +
      '.resp{background:#fafbfc;border:1px solid #d9dde3;border-radius:8px;padding:8px 20px}.log{font:13px ui-monospace,Menlo,monospace}</style></head><body>';
    h += '<h1>' + esc(state.name) + '</h1><p class="m">Written exercises &middot; started ' + esc(new Date(state.startedAt).toLocaleString()) +
      ' &middot; exported ' + esc(new Date().toLocaleString()) + '</p>';

    h += '<h2>Overview</h2><table><tr><th>Exercise</th><th>Time spent</th><th>Words</th><th>Submitted</th></tr>';
    EX.forEach(function (ex, i) {
      var w = words(responseText(i));
      h += '<tr><td>' + ex.id + '. ' + esc(ex.title) + '</td><td>' + fmt(state.seconds[i]) + '</td><td>' + w + '</td><td>' + (state.submitted[i] ? 'Yes' : 'No') + '</td></tr>';
    });
    h += '</table>';

    h += '<h2>Integrity log (deterrent, not proof)</h2><table>';
    Object.keys(LABELS).forEach(function (k) { h += '<tr><td>' + LABELS[k] + '</td><td>' + (s.counts[k] || 0) + '</td></tr>'; });
    h += '<tr><td>Total time away from the window</td><td>' + fmt(s.away) + '</td></tr></table>';
    h += '<p class="m">This page can block paste and record window switches. It cannot see a second device or a second screen.</p>';

    EX.forEach(function (ex, i) {
      h += '<h2>Exercise ' + ex.id + ': ' + esc(ex.title) + '</h2><div class="resp">' + (sanitize(state.responses[i]).innerHTML || '<p class="m">(no response)</p>') + '</div>';
    });

    if (state.log.length) {
      h += '<h2>Event detail</h2><div class="log">';
      state.log.forEach(function (l) {
        h += esc(new Date(l.t).toLocaleTimeString()) + ' &middot; Ex ' + l.ex + ' &middot; ' + esc(l.type) + (l.detail ? ' (' + esc(l.detail) + ')' : '') + '<br>';
      });
      h += '</div>';
    }
    h += '</body></html>';
    save(h, 'text/html', 'html');
  }

  function downloadTxt() {
    flush();
    save(buildTxt(), 'text/plain', 'txt');
  }
  function buildTxt() {
    var s = summary();
    var t = state.name + '\nWritten exercises, exported ' + new Date().toLocaleString() + '\n\n';
    EX.forEach(function (ex, i) {
      t += '=== Exercise ' + ex.id + ': ' + ex.title + ' (' + fmt(state.seconds[i]) + ', ' + words(responseText(i)) + ' words) ===\n\n' + (responseText(i) || '(no response)') + '\n\n';
    });
    t += '=== Integrity log ===\n';
    Object.keys(LABELS).forEach(function (k) { t += LABELS[k] + ': ' + (s.counts[k] || 0) + '\n'; });
    t += 'Total time away: ' + fmt(s.away) + '\n';
    return t;
  }

  function save(content, mime, ext) {
    var safe = state.name.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'candidate';
    var d = new Date(), pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var stamp = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '_' + pad(d.getHours()) + pad(d.getMinutes());
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: mime + ';charset=utf-8' }));
    a.download = safe + '_written_exercises_' + stamp + '.' + ext;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- boot ---------- */
  initToolbar();
  initLockdown();
  initSubmit();
  initStart();
})();
