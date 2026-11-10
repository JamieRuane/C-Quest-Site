(() => {
'use strict';
const VIDEO = 'xND0t1pr3KY', KEY = 'cquest.v1', PASS = 70;

/* ---------- tiny helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const ts = s => s.split(':').reduce((a, b) => a * 60 + +b, 0);
const dayKey = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const count = o => Object.keys(o).length;
const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();

/* inline formatting: ~code~ and **bold** */
const inl = s => esc(s).split('~').map((p, i) => i % 2 ? `<code>${p}</code>` : p.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')).join('');
const md = s => String(s || '').trim().split(/\n\s*\n/).map(p => `<p>${inl(p).replace(/\n/g, '<br>')}</p>`).join('');
const plain = s => String(s || '').replace(/[~*]/g, '').replace(/\s+/g, ' ').trim();

/* C syntax highlighting */
const HL = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(^[ \t]*#\s*\w+)|\b(int|float|double|char|void|bool|long|short|unsigned|signed|const|struct|enum|typedef|union|static|extern|sizeof|if|else|switch|case|default|for|while|do|break|continue|return|true|false|NULL|FILE|size_t)\b|\b(0x[\da-fA-F]+|\d+\.?\d*f?)\b|\b([A-Za-z_]\w*)(?=\s*\()/gm;
function hl(code) {
  let out = '', i = 0, m; HL.lastIndex = 0;
  while ((m = HL.exec(code))) {
    out += esc(code.slice(i, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'p' : m[4] ? 'k' : m[5] ? 'n' : 'f';
    out += `<span class="t-${cls}">${esc(m[0])}</span>`; i = HL.lastIndex;
  }
  return out + esc(code.slice(i));
}
const codeBlock = code => `<pre class="code">${hl(code.replace(/^\n+|\s+$/g, ''))}</pre>`;

/* ---------- course index ---------- */
const TOPICS = window.COURSE.topics, GLOSS = window.COURSE.glossary;
const IDX = {}, LESSONS = [], UNITS = [];
TOPICS.forEach(t => {
  t.lessons.forEach(l => {
    l.gid = t.id + '/' + l.id; l.topic = t; LESSONS.push(l); UNITS.push(l.gid);
    l.keys = l.steps.map((s, i) => { const k = l.gid + '/' + i; IDX[k] = { step: s, lesson: l, topic: t }; return k; });
  });
  t.quizKeys = (t.quiz || []).map((s, i) => { const k = t.id + '/quiz/' + i; IDX[k] = { step: s, topic: t }; return k; });
  UNITS.push('quiz:' + t.id);
});

/* ---------- state ---------- */
const DEF = { xp: 0, done: {}, quiz: {}, streak: 0, best: 0, last: null, days: {}, bookmarks: {}, mistakes: {}, ach: {}, solved: {}, perfect: 0, cleared: 0, goal: 30, sound: true, unlockAll: false, play: '', owner: null };
let S = load();
function load() { try { return Object.assign(structuredClone(DEF), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return structuredClone(DEF); } }
let cloudOK = false;   // true once this account's cloud copy has been read, so we never overwrite it blindly
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode */ } if (cloudOK && window.Cloud && Cloud.user) Cloud.save(S); hud(); }

const unitDone = u => u.startsWith('quiz:') ? (S.quiz[u.slice(5)] || 0) >= PASS : !!S.done[u];
const unlocked = u => { const i = UNITS.indexOf(u); return S.unlockAll || i <= 0 || unitDone(UNITS[i - 1]); };
const currentUnit = () => UNITS.find(u => !unitDone(u));
const liveStreak = () => (S.last === dayKey() || S.last === dayKey(daysAgo(1))) ? S.streak : 0;
const LEVELS = ['Hello World-er', 'Semicolon Survivor', 'Loop Wrangler', 'Function Caller', 'Array Tamer', 'Struct Builder', 'Pointer Apprentice', 'Memory Manager', 'Segfault Slayer', 'C Wizard'];
const level = () => Math.floor(S.xp / 120) + 1;
const levelName = () => LEVELS[Math.min(level() - 1, LEVELS.length - 1)];

const ACH = [
  ['first', '👶', 'Hello, World', 'Finish your first lesson', s => count(s.done) >= 1],
  ['five', '🖐️', 'High five', 'Finish 5 lessons', s => count(s.done) >= 5],
  ['half', '⛰️', 'Halfway up', 'Finish half of all lessons', s => count(s.done) >= LESSONS.length / 2],
  ['perfect', '💎', 'Flawless', 'Finish a lesson with zero mistakes', s => s.perfect >= 1],
  ['s3', '🔥', 'Warming up', 'Reach a 3-day streak', s => s.best >= 3],
  ['s7', '🌋', 'On fire', 'Reach a 7-day streak', s => s.best >= 7],
  ['s30', '☄️', 'Unstoppable', 'Reach a 30-day streak', s => s.best >= 30],
  ['xp100', '⚡', 'Charged', 'Earn 100 XP', s => s.xp >= 100],
  ['xp500', '🚀', 'Liftoff', 'Earn 500 XP', s => s.xp >= 500],
  ['code10', '🛠️', 'Bug squasher', 'Pass 10 coding challenges', s => count(s.solved) >= 10],
  ['code40', '⚙️', 'Compiler whisperer', 'Pass 40 coding challenges', s => count(s.solved) >= 40],
  ['bm', '🔖', 'Note to self', 'Bookmark something tricky', s => count(s.bookmarks) >= 1],
  ['clean', '🧽', 'Clean slate', 'Clear all your mistakes in Practice', s => s.cleared >= 1],
  ['ptr', '👈', 'Pointer whisperer', 'Pass the Pointers quiz', s => (s.quiz.pointers || 0) >= PASS],
  ['mem', '🧹', 'No leaks', 'Pass the Dynamic Memory quiz', s => (s.quiz.memory || 0) >= PASS],
  ['boss', '👑', 'C-nior developer', 'Finish every single lesson', s => LESSONS.every(l => s.done[l.gid])],
];

function award(xp) {
  const today = dayKey();
  if (S.last !== today) { S.streak = S.last === dayKey(daysAgo(1)) ? S.streak + 1 : 1; S.last = today; S.best = Math.max(S.best, S.streak); }
  S.xp += xp; S.days[today] = (S.days[today] || 0) + xp;
  return checkAch();
}
function checkAch() {
  const fresh = ACH.filter(a => !S.ach[a[0]] && a[4](S));
  fresh.forEach(a => { S.ach[a[0]] = Date.now(); });
  save(); return fresh;
}

/* ---------- ui bits ---------- */
const view = $('#view');
function hud() {
  $('#st-streak').textContent = '🔥 ' + liveStreak();
  $('#st-xp').textContent = '⚡ ' + S.xp + ' XP';
  $('#st-lvl').textContent = '🎖️ Lv ' + level();
  const C = window.Cloud, a = $('#acct');
  a.hidden = !(C && C.enabled);
  a.textContent = C && C.user ? '👤 ' + (C.user.displayName || C.user.email || 'Account').split(' ')[0] : 'Sign in';
}
const signIn = () => Cloud.signIn().catch(e => toast(e.code === 'auth/unauthorized-domain' ? 'This web address is not on the Firebase authorised-domains list yet (see SETUP.md).' : e.code === 'auth/popup-closed-by-user' ? 'Sign-in cancelled.' : 'Sign-in failed: ' + (e.code || e.message), 6000));
$('#acct').onclick = () => { if (Cloud.user) location.hash = '#/me'; else signIn(); };
function toast(msg, ms = 3200) { const t = el(`<div class="toast">${msg}</div>`); $('#toasts').append(t); setTimeout(() => t.remove(), ms); }
let actx;
function beep(freqs, dur = .11) {
  if (!S.sound) return;
  try {
    actx = actx || new AudioContext();
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * dur;
      o.type = 'triangle'; o.frequency.value = f; o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(.1, t); g.gain.exponentialRampToValueAtTime(.001, t + dur * 1.6); o.start(t); o.stop(t + dur * 1.6);
    });
  } catch { /* no audio */ }
}
function confetti() {
  const cols = ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b4b', '#ce82ff', '#ff9600'];
  for (let i = 0; i < 70; i++) {
    const c = el('<i class="confetti"></i>');
    c.style.cssText = `left:${Math.random() * 100}vw;background:${cols[i % 6]};animation-duration:${1.6 + Math.random() * 2}s;animation-delay:${Math.random() * .5}s;transform:rotate(${Math.random() * 360}deg)`;
    document.body.append(c); setTimeout(() => c.remove(), 4500);
  }
}
/* Code runner: local gcc when opened through start.bat, a free online compiler (Wandbox) when hosted. */
const LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && !/[?&]online\b/.test(location.search);
async function wandbox(code, stdin) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch('https://wandbox.org/api/compile.json', { method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin, compiler: 'gcc-head-c', 'compiler-option-raw': '-std=c17\n-Wall\n-lm' }) });
    if (!r.ok) throw new Error('http ' + r.status);
    return await r.json();
  } catch (e) { if (e.name === 'AbortError') return { timedOut: true }; throw e; }
  finally { clearTimeout(timer); }
}
async function runOnline(code, stdins) {
  const tidy = t => String(t || '').replace(/\bprog\.c\b/g, 'main.c').trim();
  const asRun = j => j.timedOut ? { stdout: '', code: 0, timedOut: true } : { stdout: j.program_output || '', code: +j.status || 0 };
  const first = await wandbox(code, stdins[0] || '');
  if (first.timedOut) return { compile: { ok: true, output: '' }, runs: stdins.map(() => asRun(first)) };
  const out = tidy(first.compiler_error);
  if (first.status !== '0' && /error:|ld returned|undefined reference/.test(out)) return { compile: { ok: false, output: out }, runs: [] };
  const rest = await Promise.all(stdins.slice(1).map(i => wandbox(code, i || '')));
  return { compile: { ok: true, output: out }, runs: [first, ...rest].map(asRun) };
}
async function runC(code, stdins) {
  try {
    if (!LOCAL) return await runOnline(code, stdins);
    const r = await fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, stdins }) });
    if (!r.ok) throw 0;
    return await r.json();
  } catch { return { offline: true }; }
}
const OFFLINE = LOCAL
  ? '<div class="hintbox">🔌 <b>The code runner is not reachable.</b> Start the site by double-clicking <code>start.bat</code> (it compiles your code with gcc on your own machine), then open <code>http://localhost:4321</code>.</div>'
  : '<div class="hintbox">🔌 <b>The online compiler did not answer.</b> It is a free shared service and is sometimes busy — check your connection, wait a few seconds and try again.</div>';
const NOCC = '<div class="hintbox">⚠️ <b>No C compiler found.</b> Install gcc (Bro Code shows how in the very first clip), then restart <code>start.bat</code>.</div>';
function crashNote(r) {
  if (r.timedOut || r.code === 137) return '⏱️ Timed out — infinite loop, or waiting for input that never comes?';
  if (r.flooded) return '🌊 Way too much output — probably an infinite loop.';
  if (r.code === 3221225477 || r.code === 139) return '💥 Segmentation fault — your program touched memory it does not own.';
  if (r.code === 3221225725) return '💥 Stack overflow — runaway recursion or a gigantic local array.';
  if (r.code === 3221225620 || r.code === 136) return '💥 Crash: division by zero.';
  if (r.code > 255 || r.code < 0) return '💥 The program crashed (exit code ' + r.code + ').';
  return '';
}

/* code editor with live highlighting */
function editor(code) {
  const w = el('<div class="editor"><pre aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Code editor"></textarea></div>');
  const ta = $('textarea', w), pre = $('pre', w);
  const sync = () => { pre.innerHTML = hl(ta.value) + '\n'; w.style.height = Math.max(8, ta.value.split('\n').length + 1) * 22 + 28 + 'px'; pre.scrollLeft = ta.scrollLeft; pre.scrollTop = ta.scrollTop; };
  const ins = txt => { if (!document.execCommand || !document.execCommand('insertText', false, txt)) ta.setRangeText(txt, ta.selectionStart, ta.selectionEnd, 'end'); sync(); };
  ta.value = code;
  ta.addEventListener('input', sync);
  ta.addEventListener('scroll', () => { pre.scrollLeft = ta.scrollLeft; pre.scrollTop = ta.scrollTop; });
  ta.addEventListener('keydown', e => {
    if (e.key === 'Tab') { e.preventDefault(); ins('    '); }
    else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const before = ta.value.slice(0, ta.selectionStart), line = before.slice(before.lastIndexOf('\n') + 1);
      ins('\n' + line.match(/^\s*/)[0] + (/\{\s*$/.test(line) ? '    ' : ''));
    } else if (e.key === '}') {
      const before = ta.value.slice(0, ta.selectionStart), line = before.slice(before.lastIndexOf('\n') + 1);
      if (/^\s{4,}$/.test(line) && ta.selectionStart === ta.selectionEnd) { e.preventDefault(); ta.setSelectionRange(ta.selectionStart - 4, ta.selectionStart); ins('}'); }
    }
  });
  sync();
  return { node: w, ta, get value() { return ta.value; }, set(v) { ta.value = v; sync(); } };
}

/* ---------- step renderers ---------- */
const TYPE = { info: 'Concept', mcq: 'Quick check', predict: 'Predict the output', fill: 'Fill the blanks', order: 'Put it in order', code: 'Code challenge' };
const R = {
  info(s) {
    return { passive: true, node: el(`<div class="step info">${s.title ? `<h2>${inl(s.title)}</h2>` : ''}${md(s.text)}${s.code ? codeBlock(s.code) : ''}${s.after ? md(s.after) : ''}</div>`) };
  },
  mcq(s, ctx) {
    const order = shuffle(s.opts.map((_, i) => i)); let sel = -1, locked = false;
    const n = el(`<div class="step"><span class="tag">Quick check</span><div class="q">${md(s.q)}</div>${s.code ? codeBlock(s.code) : ''}<div class="opts">${order.map((oi, k) => `<button class="opt"><kbd>${k + 1}</kbd><span>${inl(s.opts[oi])}</span></button>`).join('')}</div></div>`);
    const btns = $$('.opt', n);
    const pick = k => { if (locked || !btns[k]) return; sel = k; btns.forEach((b, j) => b.classList.toggle('sel', j === k)); ctx.ready(true); };
    btns.forEach((b, k) => { b.onclick = () => pick(k); });
    return { node: n, pick, check() {
      locked = true; const ok = order[sel] === s.ans;
      btns.forEach((b, j) => { b.classList.remove('sel'); if (order[j] === s.ans) b.classList.add('right'); else if (j === sel) b.classList.add('wrong'); });
      return { ok, msg: ok ? '' : `<p>Correct answer: ${inl(s.opts[s.ans])}</p>` };
    } };
  },
  predict(s, ctx) {
    const multi = s.out.includes('\n');
    const n = el(`<div class="step"><span class="tag">Predict the output</span><div class="q">${md(s.q || 'What does this print? Be the compiler.')}</div>${codeBlock(s.code)}${multi ? `<textarea class="ans" rows="${s.out.split('\n').length + 1}" placeholder="Type the exact output (one line per line)" spellcheck="false"></textarea>` : '<input class="ans" placeholder="Type the exact output" spellcheck="false" autocomplete="off" autocapitalize="off">'}</div>`);
    const inp = $('.ans', n); inp.oninput = () => ctx.ready(inp.value.trim() !== '');
    return { node: n, focus: inp, check() {
      inp.disabled = true; const ok = norm(inp.value) === norm(s.out);
      return { ok, msg: ok ? '' : `<p>It prints:</p><pre>${esc(s.out)}</pre>` };
    } };
  },
  fill(s, ctx) {
    const blanks = []; let k = 0;
    const src = s.code.replace(/^\n+|\s+$/g, '').replace(/\[\[(.+?)\]\]/g, (m, a) => { blanks.push(a.split('~')); return String.fromCharCode(0xE000 + k++); });
    const html = hl(src).replace(/[-]/g, ch => { const i = ch.charCodeAt(0) - 0xE000, w = Math.max(...blanks[i].map(x => x.length)); return `<input class="blank" data-i="${i}" style="width:${w + 2.5}ch" autocomplete="off" autocapitalize="off" spellcheck="false">`; });
    const n = el(`<div class="step"><span class="tag">Fill the blanks</span><div class="q">${md(s.q)}</div><pre class="code">${html}</pre></div>`);
    const ins = $$('.blank', n), sq = v => v.replace(/\s+/g, '');
    ins.forEach(i => { i.oninput = () => ctx.ready(ins.every(x => x.value.trim() !== '')); });
    return { node: n, focus: ins[0], check() {
      let ok = true;
      ins.forEach((inp, i) => { const good = blanks[i].some(a => sq(a) === sq(inp.value)); inp.classList.add(good ? 'right' : 'wrong'); inp.disabled = true; if (!good) ok = false; });
      return { ok, msg: ok ? '' : `<p>Answer${blanks.length > 1 ? 's' : ''}: ${blanks.map(b => `<code>${esc(b[0])}</code>`).join(' , ')}</p>` };
    } };
  },
  order(s, ctx) {
    let pool = s.lines.map(t => ({ t })).concat((s.extra || []).map(t => ({ t })));
    do { pool = shuffle(pool); } while (pool.length > 2 && pool.every((p, i) => p.t === s.lines[i]));
    const ans = []; let locked = false;
    const n = el(`<div class="step"><span class="tag">Put it in order</span><div class="q">${md(s.q)}</div><div class="ord-ans"></div><div class="ord-pool"></div></div>`);
    const A = $('.ord-ans', n), Pn = $('.ord-pool', n);
    const draw = () => {
      A.innerHTML = ''; Pn.innerHTML = '';
      ans.forEach(it => { const b = el(`<button class="chip">${hl(it.t)}</button>`); b.onclick = () => { if (locked) return; ans.splice(ans.indexOf(it), 1); draw(); }; A.append(b); });
      pool.filter(it => !ans.includes(it)).forEach(it => { const b = el(`<button class="chip">${hl(it.t.trim())}</button>`); b.onclick = () => { if (locked) return; ans.push(it); draw(); }; Pn.append(b); });
      ctx.ready(ans.length >= s.lines.length);
    };
    draw();
    return { node: n, check() {
      locked = true; const ok = ans.length === s.lines.length && ans.every((a, i) => a.t.trim() === s.lines[i].trim());
      return { ok, msg: ok ? '' : `<p>Correct order:</p><pre>${esc(s.lines.join('\n'))}</pre>` };
    } };
  },
  code(s, ctx) {
    const ed = editor(s.start || window.COURSE.blank); let fails = 0;
    const n = el(`<div class="step"><span class="tag">Code challenge</span><div class="q">${md(s.q)}</div><div class="edw"></div><div class="ed-tools"><button class="btn sm blue run">▶ Run</button><button class="btn sm ghost reset">↺ Reset</button>${s.hint ? '<button class="btn sm ghost hint">💡 Hint</button>' : ''}<button class="btn sm ghost sol" hidden>👀 Show solution</button><button class="btn sm ghost skip" hidden>Skip for now →</button></div><div class="hintw"></div><div class="out"></div></div>`);
    $('.edw', n).append(ed.node);
    const out = $('.out', n), tests = s.tests || [{ in: '' }];
    const struggling = () => { $('.sol', n).hidden = !s.sol; $('.skip', n).hidden = false; };
    const compileBox = r => r.compile.output ? `<div class="lbl">${r.compile.ok ? '⚠️ Compiler warnings (worth reading!)' : '❌ Compiler says'}</div><pre>${esc(r.compile.output)}</pre>` : '';
    const guard = r => { if (r.offline) { out.innerHTML = OFFLINE; struggling(); return true; } if (r.noCompiler) { out.innerHTML = NOCC; struggling(); return true; } return false; };
    $('.run', n).onclick = async () => {
      out.innerHTML = '<span class="muted">Compiling…</span>';
      const r = await runC(ed.value, [tests[0].in || '']);
      if (guard(r)) return;
      let h = compileBox(r);
      if (r.compile.ok) { const x = r.runs[0]; h += `${tests[0].in ? `<div class="lbl">Input used</div><pre>${esc(tests[0].in)}</pre>` : ''}<div class="lbl">Output</div><pre>${esc(x.stdout) || '<span class="muted">(no output)</span>'}</pre>${crashNote(x) ? `<p>${crashNote(x)}</p>` : ''}`; }
      out.innerHTML = h;
    };
    $('.reset', n).onclick = () => ed.set(s.start || window.COURSE.blank);
    if (s.hint) $('.hint', n).onclick = () => { $('.hintw', n).innerHTML = `<div class="hintbox">💡 ${inl(s.hint)}</div>`; };
    $('.sol', n).onclick = () => { ctx.wrong(); ed.set(s.sol); toast('Solution loaded — read it line by line, then Check.'); };
    $('.skip', n).onclick = () => { ctx.wrong(); ctx.skip(); };
    ctx.ready(true);
    return { node: n, async check() {
      const fail = msg => { fails++; if (fails >= 2) struggling(); return { retry: true, msg }; };
      const bare = ed.value.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
      for (const [re, msg] of s.must || []) if (!new RegExp(re).test(bare)) return fail(`<p>${inl(msg)}</p>`);
      for (const [re, msg] of s.not || []) if (new RegExp(re).test(bare)) return fail(`<p>${inl(msg)}</p>`);
      out.innerHTML = '<span class="muted">Compiling and running tests…' + (LOCAL ? '' : ' (online compiler — this can take a few seconds)') + '</span>';
      const r = await runC(ed.value, tests.map(t => t.in || ''));
      if (guard(r)) return { retry: true, msg: '<p>Could not run your code.</p>' };
      if (!r.compile.ok) { out.innerHTML = compileBox(r); return fail('<p>It does not compile yet. Read the first error — the line number is right there.</p>'); }
      let all = true, h = compileBox(r);
      r.runs.forEach((x, i) => {
        const t = tests[i], o = norm(x.stdout);
        const ok = !crashNote(x) && (t.out == null || o === norm(t.out)) && (!t.has || t.has.every(v => o.includes(v))) && (!t.re || new RegExp(t.re).test(o));
        if (!ok) all = false;
        h += `<div class="test ${ok ? 'pass' : 'fail'}"><b>${ok ? '✓' : '✗'} Test ${i + 1}</b>${ok ? '' : `${t.in ? `<div class="lbl">Input</div><pre>${esc(t.in)}</pre>` : ''}${t.out != null ? `<div class="lbl">Expected output</div><pre>${esc(t.out)}</pre>` : t.has ? `<div class="lbl">Output must contain</div><pre>${esc(t.has.join('\n'))}</pre>` : ''}<div class="lbl">Your output</div><pre>${esc(x.stdout) || '(no output)'}</pre>${crashNote(x) ? `<p>${crashNote(x)}</p>` : ''}`}</div>`;
      });
      out.innerHTML = h;
      if (!all) return fail('<p>It runs, but the output is not right yet. Compare expected vs. yours below the editor.</p>');
      S.solved[ctx.key] = 1;
      return { ok: true, msg: '' };
    } };
  },
};

/* ---------- session engine ---------- */
let keyHandler = null;
document.addEventListener('keydown', e => keyHandler && keyHandler(e));
const PRAISE = ['Nice!', 'Correct!', 'Compiles in my heart.', 'Exactly right.', 'Zero warnings.', 'You are getting dangerous.', 'Clean.', 'Boom.'];

function session(o) {
  document.body.classList.add('in-session');
  const q = [...o.keys], total = q.length, wrong = new Set(), solved = new Set();
  const gradable = q.filter(k => IDX[k].step.t !== 'info').length, t0 = Date.now();
  let i = 0, r = null, state = 'answer', combo = 0;
  view.innerHTML = `<div class="sess"><header class="sess-top"><a class="x" href="${o.exit}" title="Quit">✕</a><div class="pbar"><i style="width:0"></i></div><span class="combo"></span><button class="bm" title="Bookmark this step for later">🔖</button></header><div class="sess-body"></div><footer class="sess-foot"><div class="foot-in"><div class="fb"></div><button class="btn primary big go">Check</button></div></footer></div>`;
  const body = $('.sess-body'), foot = $('.sess-foot'), fb = $('.fb'), go = $('.go'), bm = $('.bm');
  const markWrong = k => { wrong.add(k); S.mistakes[k] = (S.mistakes[k] || 0) + 1; combo = 0; save(); };
  const ctx = k => ({ key: k, ready: b => { if (state === 'answer') go.disabled = !b; }, wrong: () => markWrong(k), skip: () => { solved.add(k); next(); } });
  const feedback = (ok, title, html) => { foot.className = 'sess-foot ' + (ok ? 'ok' : 'bad'); fb.innerHTML = `<b class="h">${title}</b>${html || ''}`; };

  function show() {
    const k = q[i], step = IDX[k].step;
    state = 'answer'; foot.className = 'sess-foot'; fb.innerHTML = ''; body.innerHTML = '';
    go.disabled = true; go.textContent = step.t === 'info' ? 'Got it' : 'Check';
    r = R[step.t](step, ctx(k)); body.append(r.node);
    if (r.passive) go.disabled = false;
    bm.classList.toggle('on', !!S.bookmarks[k]);
    $('.pbar i').style.width = (solved.size / total * 100) + '%';
    $('.combo').textContent = combo >= 3 ? '🔥 x' + combo : '';
    body.scrollTop = 0;
    if (r.focus) r.focus.focus();
  }
  async function onGo() {
    if (go.disabled) return;
    const k = q[i], step = IDX[k].step;
    if (state === 'next') return next();
    if (r.passive) { solved.add(k); return next(); }
    go.disabled = true;
    const res = await r.check();
    if (res.retry) { markWrong(k); beep([200, 150]); feedback(false, 'Not yet', res.msg); go.disabled = false; return; }
    if (res.ok) {
      solved.add(k); combo++; beep([660, 880]);
      if (o.practice) delete S.mistakes[k];
      feedback(true, PRAISE[Math.floor(Math.random() * PRAISE.length)], step.why ? md(step.why) : '');
    } else {
      markWrong(k); beep([200, 150]);
      if (o.requeue) q.push(k); else solved.add(k);
      feedback(false, o.requeue ? 'Not quite — this one will come back' : 'Not quite', res.msg + (step.why ? md(step.why) : ''));
    }
    save();
    $('.pbar i').style.width = (solved.size / total * 100) + '%';
    state = 'next'; go.textContent = 'Continue'; go.disabled = false;
  }
  function next() { i++; if (i >= q.length) finish(); else show(); }
  function finish() {
    keyHandler = null;
    const secs = Math.round((Date.now() - t0) / 1000), acc = gradable ? Math.round((gradable - wrong.size) / gradable * 100) : 100;
    const out = o.done({ wrong: wrong.size, acc, gradable });
    const fresh = award(out.xp);
    beep([523, 659, 784, 1047], .13); if (out.party !== false) confetti();
    view.innerHTML = `<div class="finish"><div class="emo">${out.emoji}</div><h1>${out.title}</h1><p class="muted">${out.sub || ''}</p><div class="tiles"><div class="tile"><small>XP earned</small><b>⚡ +${out.xp}</b></div><div class="tile"><small>Accuracy</small><b>🎯 ${acc}%</b></div><div class="tile"><small>Time</small><b>⏱️ ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</b></div><div class="tile"><small>Streak</small><b>🔥 ${liveStreak()}</b></div></div>${fresh.map(a => `<p class="toast" style="display:inline-block">${a[1]} Achievement unlocked: <b>${a[2]}</b></p>`).join('<br>')}<p><a class="btn primary big" href="${out.next || o.exit}">Continue</a></p></div>`;
    keyHandler = e => { if (e.key === 'Enter') location.hash = out.next || o.exit; };
  }
  bm.onclick = () => { const k = q[i]; if (S.bookmarks[k]) delete S.bookmarks[k]; else { S.bookmarks[k] = { at: Date.now(), note: '' }; toast('🔖 Saved to Bookmarks'); } bm.classList.toggle('on', !!S.bookmarks[k]); checkAch(); };
  go.onclick = onGo;
  keyHandler = e => {
    const tag = e.target.tagName;
    if (e.key === 'Enter') { if (tag === 'TEXTAREA' && !e.ctrlKey && !e.metaKey) return; if (tag === 'BUTTON' && e.target !== go) return; e.preventDefault(); onGo(); }
    else if (/^[1-9]$/.test(e.key) && tag !== 'INPUT' && tag !== 'TEXTAREA' && r && r.pick && state === 'answer') r.pick(+e.key - 1);
  };
  show();
}

/* ---------- views ---------- */
function videoCard(v) {
  const s = ts(v[0]), e = v[1] ? ts(v[1]) : 0, mins = Math.max(1, Math.round((e - s) / 60));
  return `<div class="vid" data-s="${s}" data-e="${e}"><button class="vid-thumb" style="background-image:url(https://i.ytimg.com/vi/${VIDEO}/hqdefault.jpg)" title="Play clip"><span class="play">▶</span></button><div class="vid-meta"><b>🎬 ${esc(v[2])}</b><span>Bro Code · ${v[0]} → ${e ? v[1] + ' · about ' + mins + ' min' : 'end of video'}</span><a href="https://www.youtube.com/watch?v=${VIDEO}&t=${s}s" target="_blank" rel="noopener">Open on YouTube ↗</a></div></div>`;
}
function wireVideos() {
  $$('.vid-thumb').forEach(b => { b.onclick = () => {
    const v = b.parentElement, meta = $('.vid-meta', v);
    b.remove(); v.classList.add('playing');
    v.prepend(el(`<iframe src="https://www.youtube.com/embed/${VIDEO}?start=${v.dataset.s}${+v.dataset.e ? '&end=' + v.dataset.e : ''}&autoplay=1&rel=0" title="Bro Code clip" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`));
    if (+v.dataset.e) meta.querySelector('span').textContent += ' · the clip stops by itself at the end of this section';
  }; });
}

function vHome() {
  const cur = currentUnit(), doneN = LESSONS.filter(l => S.done[l.gid]).length, today = S.days[dayKey()] || 0;
  const pct = Math.min(1, today / S.goal), C = 2 * Math.PI * 40, due = Object.keys(S.mistakes).filter(k => IDX[k]).length;
  let h = '<div class="home"><div>';
  TOPICS.forEach((t, ti) => {
    const d = t.lessons.filter(l => S.done[l.gid]).length;
    h += `<section class="topic" style="--tc:${t.color}"><header class="topic-head"><div><small>TOPIC ${ti + 1}</small><h2>${t.icon} ${esc(t.title)}</h2><p>${esc(t.blurb)}</p></div><div class="topic-prog">${d}/${t.lessons.length}</div></header><div class="nodes">`;
    const node = (u, href, icon, title, sub, k) => { const st = unitDone(u) ? 'done' : unlocked(u) ? 'open' : 'locked'; return `<a class="node ${st}${cur === u ? ' cur' : ''}" style="--o:${Math.round(Math.sin(k * 1.15) * 80)}px" href="${href}" data-u="${u}"><span class="bubble">${st === 'done' ? '✓' : st === 'locked' ? '🔒' : icon}</span><span class="nlabel">${esc(title)}<small>${sub}</small></span></a>`; };
    t.lessons.forEach((l, li) => { h += node(l.gid, '#/lesson/' + l.gid, l.icon || '★', l.title, l.steps.some(s => s.t === 'code') ? '⌨️ hands-on' : 'concepts', li); });
    h += node('quiz:' + t.id, '#/quiz/' + t.id, '🏆', t.title + ' quiz', S.quiz[t.id] != null ? 'best: ' + S.quiz[t.id] + '%' : 'revision', t.lessons.length);
    h += '</div></section>';
  });
  const nxt = cur && (cur.startsWith('quiz:') ? '#/quiz/' + cur.slice(5) : '#/lesson/' + cur);
  h += `</div><aside class="side">
    <div class="card"><div class="row"><div class="ring"><svg width="96" height="96"><circle cx="48" cy="48" r="40" fill="none" stroke="#e3e8f7" stroke-width="10"/><circle cx="48" cy="48" r="40" fill="none" stroke="${pct >= 1 ? '#ffc800' : '#58cc02'}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg><b>${pct >= 1 ? '✓' : today + '/' + S.goal}</b></div><div><h3>Daily goal</h3><span class="muted">${pct >= 1 ? 'Done for today. Anything more is a bonus.' : (S.goal - today) + ' XP to go today'}</span></div></div></div>
    <div class="card"><h3>🔥 ${liveStreak()} day streak</h3><span class="muted">${S.last === dayKey() ? 'Safe for today. See you tomorrow!' : liveStreak() ? 'Do one lesson today to keep it alive.' : 'Finish a lesson to start a streak.'}</span></div>
    <div class="card"><h3>Course progress</h3><div class="pbar"><i style="width:${doneN / LESSONS.length * 100}%"></i></div><p class="muted" style="margin:.5em 0 .8em">${doneN} of ${LESSONS.length} lessons · ${levelName()}</p>${nxt ? `<a class="btn primary" href="${nxt}">${doneN ? 'Continue' : 'Start learning'}</a>` : '<b>👑 Course complete!</b>'}</div>
    <div class="card"><h3>🎯 Practice</h3><p class="muted" style="margin:.2em 0 .8em">${due ? due + ' question' + (due > 1 ? 's' : '') + ' you got wrong ' + (due > 1 ? 'are' : 'is') + ' waiting for revenge.' : 'No mistakes waiting. Suspiciously good.'}</p><a class="btn" href="#/practice">Practice now</a></div>
  </aside></div>`;
  view.innerHTML = h;
  $$('.node.locked').forEach(n => { n.onclick = e => { e.preventDefault(); n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); toast('🔒 Finish the previous step first — or turn on “Unlock everything” in Profile.'); }; });
  const c = $('.node.cur'); if (c && doneN) c.scrollIntoView({ block: 'center' });
}

function vLesson(tid, lid) {
  const l = LESSONS.find(x => x.gid === tid + '/' + lid);
  if (!l || !unlocked(l.gid)) { location.hash = '#/'; return; }
  const nCode = l.steps.filter(s => s.t === 'code').length;
  view.innerHTML = `<div class="intro"><a class="back" href="#/">← Back to path</a><br><small style="background:${l.topic.color}">${esc(l.topic.title)}</small><h1>${l.icon || ''} ${esc(l.title)}</h1><p class="lead">${esc(l.desc || '')}</p><div class="chips"><span>${l.steps.length} steps</span>${nCode ? `<span>⌨️ ${nCode} coding challenge${nCode > 1 ? 's' : ''}</span>` : ''}<span>~${Math.max(3, Math.round(l.steps.length * .8 + nCode * 2.5))} min</span>${S.done[l.gid] ? '<span class="okc">✓ Completed</span>' : ''}</div>${(l.v || []).map(videoCard).join('')}<div class="intro-go"><button class="btn primary big start">${S.done[l.gid] ? 'Practice again' : 'Start lesson'}</button><p class="muted">${l.v ? 'Watch the clip first, or dive straight in and come back if you get stuck — your call.' : 'No clip for this one — you learn it by doing.'}</p></div></div>`;
  wireVideos();
  $('.start').onclick = () => session({ keys: l.keys, requeue: true, exit: '#/', done: r => {
    const first = !S.done[l.gid], perfect = r.wrong === 0;
    S.done[l.gid] = { at: Date.now() }; if (perfect) S.perfect++;
    return { emoji: perfect ? '💎' : '🎉', title: perfect ? 'Flawless!' : 'Lesson complete!', sub: perfect ? 'Not a single mistake. Show-off.' : 'Mistakes are saved in Practice so you can get revenge later.', xp: (first ? 15 : 5) + (perfect ? 5 : 0) };
  } });
}

function vQuiz(tid) {
  const t = TOPICS.find(x => x.id === tid);
  if (!t || !unlocked('quiz:' + tid)) { location.hash = '#/'; return; }
  const extra = shuffle(t.lessons.flatMap(l => l.keys).filter(k => ['mcq', 'predict', 'fill'].includes(IDX[k].step.t))).slice(0, 4);
  const keys = shuffle([...t.quizKeys, ...extra]);
  view.innerHTML = `<div class="intro"><a class="back" href="#/">← Back to path</a><br><small style="background:${t.color}">Revision quiz</small><h1>🏆 ${esc(t.title)}</h1><p class="lead">${keys.length} questions covering every lesson in this topic. Score ${PASS}% or more to unlock the next topic. No second chances inside the quiz — but you can retake it as often as you like.</p><div class="chips">${S.quiz[tid] != null ? `<span class="${S.quiz[tid] >= PASS ? 'okc' : ''}">Best score: ${S.quiz[tid]}%</span>` : ''}</div><div class="intro-go"><button class="btn primary big start">Start quiz</button></div></div>`;
  $('.start').onclick = () => session({ keys, requeue: false, exit: '#/', done: r => {
    const first = (S.quiz[tid] || 0) < PASS, pass = r.acc >= PASS;
    S.quiz[tid] = Math.max(S.quiz[tid] || 0, r.acc);
    return pass ? { emoji: '🏆', title: `Passed with ${r.acc}%`, sub: `${t.title} — done. Next topic unlocked.`, xp: first ? 30 : 10 }
      : { emoji: '🧗', title: `${r.acc}% — so close`, sub: `You need ${PASS}%. Your misses are now in Practice; hit those, then retake.`, xp: 3, party: false };
  } });
}

function vPractice() {
  let keys = Object.keys(S.mistakes).filter(k => IDX[k]).sort((a, b) => S.mistakes[b] - S.mistakes[a]).slice(0, 8);
  const had = keys.length;
  const pool = shuffle(LESSONS.filter(l => S.done[l.gid]).flatMap(l => l.keys).filter(k => IDX[k].step.t !== 'info' && !keys.includes(k)));
  keys = keys.concat(pool.slice(0, Math.max(0, 6 - keys.length)));
  if (!keys.length) { view.innerHTML = '<div class="page intro"><h1>🎯 Practice</h1><div class="card"><p>Nothing to practise yet. Finish your first lesson and this page becomes your personal revision deck — built from the exact questions <b>you</b> got wrong.</p><a class="btn primary" href="#/">Go to lessons</a></div></div>'; return; }
  view.innerHTML = `<div class="page intro"><h1>🎯 Practice</h1><p class="lead">${had ? `${had} question${had > 1 ? 's' : ''} from your mistake pile${keys.length > had ? ', topped up with random review' : ''}. Get one right and it leaves the pile.` : 'Your mistake pile is empty, so here is a random mix from lessons you have finished.'}</p><div class="intro-go"><button class="btn primary big start">Start (${keys.length} questions)</button></div></div>`;
  $('.start').onclick = () => session({ keys, requeue: false, practice: true, exit: '#/', done: () => {
    const clear = had && !Object.keys(S.mistakes).filter(k => IDX[k]).length; if (clear) S.cleared = 1;
    return { emoji: clear ? '🧽' : '💪', title: clear ? 'Mistake pile cleared!' : 'Practice complete', sub: 'Repetition is how this sticks.', xp: 10 };
  } });
}

function stepLabel(k) {
  const { step, lesson, topic } = IDX[k];
  return { type: TYPE[step.t], where: topic.title + (lesson ? ' › ' + lesson.title : ' › Quiz'), text: plain(step.title || step.q || step.text).slice(0, 140) || 'What does this code print?', code: step.t !== 'code' && step.code ? step.code : '' };
}
function vBookmarks() {
  const keys = Object.keys(S.bookmarks).filter(k => k.startsWith('g:') || IDX[k]).sort((a, b) => S.bookmarks[b].at - S.bookmarks[a].at);
  let h = '<div class="page"><h1>🔖 Bookmarks</h1><p class="lead">Everything you flagged as tricky. Tap 🔖 during any lesson, or next to any glossary term.</p>';
  if (!keys.length) h += '<div class="card">Nothing saved yet. When a question makes you go “wait, what?”, hit the 🔖 in the top-right corner of the lesson.</div>';
  keys.forEach(k => {
    if (k.startsWith('g:')) { const g = GLOSS.find(x => x.term === k.slice(2)); if (!g) return; h += `<div class="item" data-k="${esc(k)}"><div class="meta">Definition</div><b>${esc(g.term)}</b><div>${inl(g.def)}</div>`; }
    else { const L = stepLabel(k); h += `<div class="item" data-k="${esc(k)}"><div class="meta">${L.type} · ${esc(L.where)}</div><b>${esc(L.text)}</b>${L.code ? codeBlock(L.code.replace(/\[\[(.+?)\]\]/g, '____')) : ''}`; }
    h += `<textarea rows="1" maxlength="500" placeholder="Note to self: why was this hard?">${esc(S.bookmarks[k].note || '')}</textarea><div class="acts">${k.startsWith('g:') ? '' : `<a class="btn sm blue" href="#/review/${k}">Try it again</a>`}<button class="btn sm ghost rm">Remove</button></div></div>`;
  });
  view.innerHTML = h + '</div>';
  $$('.item').forEach(it => {
    const k = it.dataset.k;
    $('textarea', it).oninput = e => { S.bookmarks[k].note = e.target.value; save(); };
    $('.rm', it).onclick = () => { delete S.bookmarks[k]; save(); vBookmarks(); };
  });
}
function vReview(key) {
  if (!IDX[key]) { location.hash = '#/bookmarks'; return; }
  session({ keys: [key], requeue: false, practice: true, exit: '#/bookmarks', done: r => ({ emoji: r.wrong ? '🔁' : '✅', title: r.wrong ? 'Keep it bookmarked' : 'Nailed it', sub: r.wrong ? 'Come back to this one tomorrow.' : 'If it feels easy now, remove the bookmark.', xp: 2, party: !r.wrong }) });
}

function vPlay() {
  view.innerHTML = '<div class="page"><h1>🧪 Playground</h1><p class="lead">A blank canvas. Try things, break things — ' + (LOCAL ? 'it runs real C on your machine.' : 'it runs real C on a free online compiler, so give it a few seconds.') + ' Your code is saved automatically.</p><div class="edw"></div><div class="ed-tools"><button class="btn primary run">▶ Run</button><button class="btn ghost reset">↺ Reset</button></div><div class="lbl muted">Program input (stdin) — what the program would read from the keyboard</div><textarea class="field" rows="2" id="stdin" spellcheck="false"></textarea><div class="out" style="margin-top:14px"></div></div>';
  const ed = editor(S.play || window.COURSE.blank); $('.edw').append(ed.node);
  ed.ta.addEventListener('input', () => { S.play = ed.value; save(); });
  $('.reset').onclick = () => { ed.set(window.COURSE.blank); S.play = ''; save(); };
  $('.run').onclick = async () => {
    const out = $('.out'); out.innerHTML = '<span class="muted">Compiling…</span>';
    const r = await runC(ed.value, [$('#stdin').value]);
    if (r.offline) { out.innerHTML = OFFLINE; return; } if (r.noCompiler) { out.innerHTML = NOCC; return; }
    let h = r.compile.output ? `<div class="lbl">${r.compile.ok ? '⚠️ Warnings' : '❌ Compiler says'}</div><pre>${esc(r.compile.output)}</pre>` : '';
    if (r.compile.ok) { const x = r.runs[0]; h += `<div class="lbl">Output</div><pre>${esc(x.stdout) || '(no output)'}</pre>${crashNote(x) ? `<p>${crashNote(x)}</p>` : `<span class="muted">exit code ${x.code}</span>`}`; }
    out.innerHTML = h;
  };
}

function vGlossary() {
  view.innerHTML = '<div class="page"><h1>📖 Glossary</h1><p class="lead">Every term in the course in one plain-English sentence. 🔖 the ones that will not stick.</p><input class="search" placeholder="Search… (try “pointer”)" autofocus><div id="gl"></div></div>';
  const draw = f => {
    $('#gl').innerHTML = GLOSS.filter(g => (g.term + ' ' + g.def).toLowerCase().includes(f)).sort((a, b) => a.term.localeCompare(b.term))
      .map(g => `<div class="item gl"><button class="bm${S.bookmarks['g:' + g.term] ? ' on' : ''}" data-t="${esc(g.term)}">🔖</button><div><b>${esc(g.term)}</b><div>${inl(g.def)}</div></div></div>`).join('') || '<p class="muted">No match.</p>';
    $$('#gl .bm').forEach(b => { b.onclick = () => { const k = 'g:' + b.dataset.t; if (S.bookmarks[k]) delete S.bookmarks[k]; else S.bookmarks[k] = { at: Date.now(), note: '' }; b.classList.toggle('on'); checkAch(); }; });
  };
  $('.search').oninput = e => draw(e.target.value.toLowerCase()); draw('');
}

function accountCard() {
  const C = window.Cloud;
  if (!C || !C.enabled) return LOCAL ? '<h2 class="sec">Account</h2><div class="card"><span class="muted">Accounts are not switched on yet. Follow <code>SETUP.md</code> to connect Firebase — until then progress stays in this browser.</span></div>' : '';
  if (C.user) return `<h2 class="sec">Account</h2><div class="card row" style="justify-content:space-between;flex-wrap:wrap"><div><b>${esc(C.user.displayName || 'Signed in')}</b><br><span class="muted">${esc(C.user.email || '')} · progress syncs to this account</span></div><button class="btn sm" id="signout">Sign out</button></div>`;
  return '<h2 class="sec">Account</h2><div class="card"><p style="margin-top:0"><b>Sign in to keep your progress.</b> Your XP, streak, bookmarks and mistake pile are saved to your account and follow you to any device.</p><button class="btn primary" id="signin">Sign in with Google</button><p class="muted" style="margin-bottom:0;font-size:13px">What is stored: your Google name and email address (for signing in) and your course progress. Nothing else.</p></div>';
}
function vMe() {
  const doneN = LESSONS.filter(l => S.done[l.gid]).length;
  let cal = '';
  for (let i = 34; i >= 0; i--) { const d = daysAgo(i), xp = S.days[dayKey(d)] || 0; cal += `<span class="${xp >= S.goal ? 'a2' : xp ? 'a1' : ''}${i === 0 ? ' today' : ''}" title="${dayKey(d)}: ${xp} XP">${d.getDate()}</span>`; }
  view.innerHTML = `<div class="page"><h1>🏅 ${levelName()}</h1><p class="lead">Level ${level()} · ${120 - S.xp % 120} XP to the next level</p>
  <div class="tiles" style="justify-content:flex-start"><div class="tile"><small>Total XP</small><b>⚡ ${S.xp}</b></div><div class="tile"><small>Streak</small><b>🔥 ${liveStreak()}</b></div><div class="tile"><small>Best streak</small><b>🏔️ ${S.best}</b></div><div class="tile"><small>Lessons</small><b>📚 ${doneN}/${LESSONS.length}</b></div><div class="tile"><small>Code challenges</small><b>⌨️ ${count(S.solved)}</b></div></div>
  <h2 class="sec">Last 5 weeks</h2><div class="cal">${cal}</div><p class="muted">Light green = you practised. Bright green = you hit your daily goal.</p>
  <h2 class="sec">Achievements (${count(S.ach)}/${ACH.length})</h2><div class="grid">${ACH.map(a => `<div class="ach${S.ach[a[0]] ? '' : ' off'}"><i>${a[1]}</i><b>${a[2]}</b><small>${a[3]}</small></div>`).join('')}</div>
  ${accountCard()}<h2 class="sec">Settings</h2><div class="card settings">
    <label>Daily XP goal <select id="goal">${[[15, 'Casual — 15'], [30, 'Regular — 30'], [50, 'Serious — 50'], [80, 'Insane — 80']].map(g => `<option value="${g[0]}"${S.goal === g[0] ? ' selected' : ''}>${g[1]}</option>`).join('')}</select></label>
    <label>Sound effects <input type="checkbox" id="snd"${S.sound ? ' checked' : ''}></label>
    <label>Unlock everything (skip the lesson order) <input type="checkbox" id="unl"${S.unlockAll ? ' checked' : ''}></label>
    <label>Back up or move your progress <span><button class="btn sm" id="exp">Export</button> <button class="btn sm" id="imp">Import</button></span></label>
    <label>Start over <button class="btn sm danger" id="rst">Reset all progress</button></label>
  </div><p class="muted">${window.Cloud && Cloud.user ? 'Progress is saved to your account.' : 'Progress is stored in this browser only.'}</p></div>`;
  if ($('#signin')) $('#signin').onclick = signIn;
  if ($('#signout')) $('#signout').onclick = () => Cloud.signOut();
  $('#goal').onchange = e => { S.goal = +e.target.value; save(); };
  $('#snd').onchange = e => { S.sound = e.target.checked; save(); };
  $('#unl').onchange = e => { S.unlockAll = e.target.checked; save(); };
  $('#exp').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = 'c-quest-progress.json'; a.click(); };
  $('#imp').onclick = () => { const f = document.createElement('input'); f.type = 'file'; f.accept = '.json'; f.onchange = async () => { try { S = Object.assign(structuredClone(DEF), JSON.parse(await f.files[0].text()), { owner: S.owner }); save(); toast('Progress imported'); vMe(); } catch { toast('That file is not a C Quest backup'); } }; f.click(); };
  $('#rst').onclick = () => { if (confirm('Delete ALL progress, bookmarks and streaks? This cannot be undone.')) { S = Object.assign(structuredClone(DEF), { owner: S.owner }); save(); vMe(); } };
}

/* ---------- router ---------- */
function route() {
  keyHandler = null; document.body.classList.remove('in-session'); window.scrollTo(0, 0);
  const p = location.hash.replace(/^#\/?/, '').split('/'), r = p[0] || 'home';
  $$('#nav a[data-r]').forEach(a => a.classList.toggle('on', a.dataset.r === (['lesson', 'quiz'].includes(r) ? 'home' : r === 'review' ? 'bookmarks' : r)));
  hud();
  if (r === 'lesson') vLesson(p[1], p[2]);
  else if (r === 'quiz') vQuiz(p[1]);
  else if (r === 'practice') vPractice();
  else if (r === 'bookmarks') vBookmarks();
  else if (r === 'review') vReview(p.slice(1).join('/'));
  else if (r === 'play') vPlay();
  else if (r === 'glossary') vGlossary();
  else if (r === 'me') vMe();
  else vHome();
}
window.addEventListener('hashchange', route);
const refresh = () => { if (document.body.classList.contains('in-session')) hud(); else route(); };
window.addEventListener('cloud-ready', refresh);
window.addEventListener('cloud-auth', async e => {
  const u = e.detail;
  cloudOK = false;
  if (!u) {                                   // signed out: the next person on this browser starts clean
    if (S.owner) { S = structuredClone(DEF); save(); }
    return refresh();
  }
  try {
    const remote = await Cloud.load();
    if (S.owner && S.owner !== u.uid) S = structuredClone(DEF);          // someone else's leftovers
    if (remote && (remote.xp || 0) >= S.xp) S = Object.assign(structuredClone(DEF), remote);   // else keep (and upload) what was earned as a guest
    S.owner = u.uid; cloudOK = true; save();
    toast('👋 Signed in as ' + esc(u.displayName || u.email || 'you'));
  } catch (err) {
    console.warn('cloud load failed', err);
    toast('Could not load your saved progress (' + esc(err.code || 'network') + '). Changes are kept on this device for now.', 6000);
  }
  refresh();
});
route();
})();
