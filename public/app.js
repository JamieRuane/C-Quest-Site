(() => {
'use strict';
const KEY = 'cquest.v1', PASS = 70;   // the key C Quest always used: existing learners keep their progress

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
const inl = s => esc(s).replace(/\\~/g, '\u0002').split('~').map((p, i) => i % 2 ? `<code>${p}</code>` : p.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')).join('').replace(/\u0002/g, '~');
const md = s => String(s || '').trim().split(/\n\s*\n/).map(p => `<p>${inl(p).replace(/\n/g, '<br>')}</p>`).join('');
const plain = s => String(s || '').replace(/[~*]/g, '').replace(/\s+/g, ' ').trim();

/* syntax highlighting (one pattern per language) */
const HL_TAIL = String.raw`\b(0x[\da-fA-F]+|\d+\.?\d*[fFdDmMuUlL]*)\b|\b([A-Za-z_]\w*)(?=\s*\()`;
const HL_HEAD = String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|([$@]{0,2}"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(^[ \t]*#\s*\w+)|`;
const BT = '\x60';   // a backtick, for JavaScript template strings
const HLS = {
  sql: new RegExp(String.raw`(--[^\n]*|\/\*[\s\S]*?\*\/)|('(?:''|[^'])*'|"[^"\n]*")|(\b\B)|\b(SELECT|FROM|WHERE|AND|OR|NOT|IN|IS|NULL|AS|ORDER|BY|ASC|DESC|LIMIT|OFFSET|DISTINCT|GROUP|HAVING|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|ON|USING|UNION|INTERSECT|EXCEPT|ALL|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|ADD|COLUMN|RENAME|TO|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|DEFAULT|CHECK|CONSTRAINT|INDEX|VIEW|BETWEEN|LIKE|CASE|WHEN|THEN|ELSE|END|EXISTS|BEGIN|COMMIT|ROLLBACK|TRANSACTION|INTEGER|TEXT|REAL|NUMERIC|IF|CASCADE|WITH|AUTOINCREMENT|TRUE|FALSE)\b|\b(\d+\.?\d*)\b|\b([A-Za-z_]\w*)(?=\s*\()`, 'gim'),
  java: new RegExp(HL_HEAD + String.raw`\b(int|long|short|byte|float|double|char|boolean|void|var|String|final|static|public|private|protected|abstract|class|interface|enum|record|extends|implements|new|this|super|import|package|if|else|switch|case|default|for|while|do|break|continue|return|true|false|null|try|catch|finally|throw|throws|instanceof)\b|` + HL_TAIL, 'gm'),
  js: new RegExp(String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|` + BT + String.raw`(?:\\.|[^\\` + BT + String.raw`])*` + BT + String.raw`)|(^#![^\n]*)|\b(let|const|var|function|return|if|else|switch|case|default|for|while|do|break|continue|of|in|new|this|class|extends|super|typeof|instanceof|true|false|null|undefined|NaN|Infinity|try|catch|finally|throw|async|await|import|export|from|delete|void|yield)\b|` + HL_TAIL, 'gm'),
  c: new RegExp(HL_HEAD + String.raw`\b(int|float|double|char|void|bool|long|short|unsigned|signed|const|struct|enum|typedef|union|static|extern|sizeof|if|else|switch|case|default|for|while|do|break|continue|return|true|false|NULL|FILE|size_t)\b|` + HL_TAIL, 'gm'),
  py: /(#[^\n]*)|((?:\b[rRbBfFuU]{1,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(^[ \t]*@[\w.]+)|\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|match|case|nonlocal|not|or|pass|raise|return|try|while|with|yield|self)\b|\b(0x[\da-fA-F]+|\d[\d_]*\.?\d*(?:e[+-]?\d+)?j?)\b|\b([A-Za-z_]\w*)(?=\s*\()/gm,
  cpp: new RegExp(HL_HEAD + String.raw`\b(int|float|double|char|void|bool|long|short|unsigned|signed|const|constexpr|struct|enum|typedef|union|static|extern|sizeof|if|else|switch|case|default|for|while|do|break|continue|return|true|false|nullptr|NULL|auto|class|public|private|protected|virtual|override|final|namespace|using|template|typename|new|delete|this|try|catch|throw|operator|friend|inline|size_t)\b|` + HL_TAIL, 'gm'),
  cs: new RegExp(HL_HEAD + String.raw`\b(int|float|double|decimal|char|void|bool|long|short|uint|byte|string|object|var|const|static|readonly|class|struct|enum|interface|namespace|using|public|private|protected|internal|abstract|virtual|override|sealed|new|this|base|if|else|switch|case|default|for|foreach|in|while|do|break|continue|return|true|false|null|try|catch|finally|throw|out|ref|params|get|set|is|as|typeof|where)\b|` + HL_TAIL, 'gm'),
};
function hl(code) {
  const HL = HLS[S.course] || HLS.c;
  let out = '', i = 0, m; HL.lastIndex = 0;
  while ((m = HL.exec(code))) {
    out += esc(code.slice(i, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'p' : m[4] ? 'k' : m[5] ? 'n' : 'f';
    out += `<span class="t-${cls}">${esc(m[0])}</span>`; i = HL.lastIndex;
  }
  return out + esc(code.slice(i));
}
const codeBlock = code => `<pre class="code">${hl(code.replace(/^\n+|\s+$/g, ''))}</pre>`;

/* ---------- course index (every course on the site) ---------- */
const COURSES = window.COURSES, CIDS = Object.keys(COURSES);
const IDX = {}, ALL = [], ALLTOPICS = [];
CIDS.forEach(cid => {
  const course = COURSES[cid]; course.all = course.topics;
  course.topics.forEach(t => {
    t.gid = cid + '/' + t.id; t.course = course; ALLTOPICS.push(t);
    t.lessons.forEach(l => {
      l.gid = t.gid + '/' + l.id; l.topic = t; ALL.push(l);
      l.keys = l.steps.map((s, i) => { const k = l.gid + '/' + i; IDX[k] = { step: s, lesson: l, topic: t, course }; return k; });
    });
    t.quizKeys = (t.quiz || []).map((s, i) => { const k = t.gid + '/quiz/' + i; IDX[k] = { step: s, topic: t, course }; return k; });
  });
});
/* C++ and C# have two starting points. A topic marked track: 'new' is only on the beginner path, track: 'c' only on the
   "I already know C" path; unmarked topics are on both. C and Python have one path and mark nothing.
   course.topics / lessons / units always describe the chosen path. */
const TRACKS = { new: ['🌱', 'Beginner path'], c: ['⚡', 'C programmer path'] };
const hasTracks = cid => COURSES[cid].all.some(t => t.track);
const trackOf = cid => (hasTracks(cid) && S.start && S.start[cid]) || (hasTracks(cid) ? 'c' : 'new');
const onTrack = (cid, tr) => COURSES[cid].all.filter(t => !t.track || t.track === tr);
function applyTracks() {
  CIDS.forEach(cid => {
    const course = COURSES[cid];
    course.topics = onTrack(cid, trackOf(cid));
    course.lessons = course.topics.flatMap(t => t.lessons);
    course.units = course.topics.flatMap(t => [...t.lessons.map(l => l.gid), 'quiz:' + t.gid]);
  });
}

/* ---------- state ---------- */
const DEF = { xp: 0, done: {}, quiz: {}, streak: 0, best: 0, last: null, days: {}, bookmarks: {}, mistakes: {}, ach: {}, solved: {}, perfect: 0, cleared: 0, goal: 30, sound: true, unlockAll: false, play: {}, owner: null, course: null, cxp: {}, start: {}, later: false, connect: {}, v: 2 };
/* every saved copy (this browser, the account, an imported backup) goes through migrateState first: see migrate.js */
const upgrade = saved => Object.assign(structuredClone(DEF), window.migrateState(saved, CIDS));
let S = load();
function load() { try { return upgrade(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return structuredClone(DEF); } }
let cloudOK = false;   // true once this account's cloud copy has been read, so we never overwrite it blindly
function save() { applyTracks(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode */ } if (cloudOK && window.Cloud && Cloud.user) Cloud.save(S); hud(); }

applyTracks();
/* the course being learned right now; everything on screen belongs to it */
const co = () => COURSES[S.course] || COURSES[CIDS[0]];
const mine = k => !!IDX[k] && IDX[k].course.id === S.course;
const doneIn = (s, cid) => COURSES[cid].lessons.filter(l => s.done[l.gid]).length;
const allDone = (s, cid) => !!COURSES[cid] && COURSES[cid].lessons.every(l => s.done[l.gid]);
function setCourse(cid, quiet) {
  if (!COURSES[cid] || S.course === cid) return;
  S.course = cid; save();
  if (!quiet) toast(`Now learning <b>${esc(COURSES[cid].name)}</b>`);
}
const unitDone = u => u.startsWith('quiz:') ? (S.quiz[u.slice(5)] || 0) >= PASS : !!S.done[u];
const unlocked = u => { const i = co().units.indexOf(u); return S.unlockAll || i <= 0 || unitDone(co().units[i - 1]); };
const currentUnit = () => co().units.find(u => !unitDone(u));
const liveStreak = () => (S.last === dayKey() || S.last === dayKey(daysAgo(1))) ? S.streak : 0;
const LEVELS = ['Hello World-er', 'Syntax Survivor', 'Loop Wrangler', 'Function Caller', 'Collection Tamer', 'Bug Hunter', 'Class Builder', 'Error Handler', 'Code Crafter', 'Polyglot Wizard'];
const level = () => Math.floor(S.xp / 120) + 1;
const levelName = () => LEVELS[Math.min(level() - 1, LEVELS.length - 1)];

const ACH = [
  ['first', '👶', 'Hello, World', 'Finish your first lesson', s => count(s.done) >= 1],
  ['five', '🖐️', 'High five', 'Finish 5 lessons', s => count(s.done) >= 5],
  ['half', '⛰️', 'Halfway up', 'Finish half of a course', s => CIDS.some(c => doneIn(s, c) >= COURSES[c].lessons.length / 2)],
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
  ['both', '🌍', 'Bilingual', 'Finish a lesson in two languages', s => CIDS.filter(c => doneIn(s, c) >= 1).length >= 2],
  ['ptr', '👈', 'Pointer whisperer', 'Pass the C Pointers quiz', s => (s.quiz['c/pointers'] || 0) >= PASS],
  ['mem', '🧹', 'No leaks', 'Pass the C Dynamic Memory quiz', s => (s.quiz['c/memory'] || 0) >= PASS],
  ['oop', '🧱', 'Class act', 'Pass the Python Classes & Objects quiz', s => (s.quiz['py/oop'] || 0) >= PASS],
  ['err', '🛡️', 'Bulletproof', 'Pass the Python Errors & Files quiz', s => (s.quiz['py/files'] || 0) >= PASS],
  ['cdone', '🎓', 'C-nior developer', 'Finish every C lesson', s => allDone(s, 'c')],
  ['pydone', '🐍', 'Pythonista', 'Finish every Python lesson', s => allDone(s, 'py')],
  ['cpp', '➕', 'Plus plus', 'Finish every C++ lesson', s => allDone(s, 'cpp')],
  ['cs', '🎼', 'Looking sharp', 'Finish every C# lesson', s => allDone(s, 'cs')],
  ['conn', '🧩', 'Connected', 'Solve a Connections puzzle', s => Object.values(s.connect || {}).some(r => r.won)],
  ['connperf', '🎯', 'No mistakes', 'Solve a Connections puzzle without a mistake', s => Object.values(s.connect || {}).some(r => r.won && !r.mistakes)],
  ['boss', '👑', 'Polyglot', 'Finish every course', s => CIDS.every(c => allDone(s, c))],
];

function award(xp) {
  const today = dayKey();
  if (S.last !== today) { S.streak = S.last === dayKey(daysAgo(1)) ? S.streak + 1 : 1; S.last = today; S.best = Math.max(S.best, S.streak); }
  S.xp += xp; S.cxp[S.course] = (S.cxp[S.course] || 0) + xp; S.days[today] = (S.days[today] || 0) + xp;
  return checkAch();
}
function checkAch() {
  const fresh = ACH.filter(a => !S.ach[a[0]] && a[4](S));
  fresh.forEach(a => { S.ach[a[0]] = Date.now(); });
  save(); return fresh;
}

/* ---------- ui bits ---------- */
const view = $('#view');
/* theme: 'light', 'dark' or 'system' (follow the device). Kept on this device, not in the synced progress. */
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
const themeChoice = () => { try { const t = localStorage.getItem('cquest.theme'); return t === 'light' || t === 'dark' ? t : 'system'; } catch { return 'system'; } };
const themeNow = () => (themeChoice() === 'system' ? (darkQuery.matches ? 'dark' : 'light') : themeChoice());
function applyTheme() {
  const dark = themeNow() === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  $$('#theme, .wl-theme').forEach(b => { b.textContent = dark ? '☀️' : '🌙'; b.title = dark ? 'Switch to light mode' : 'Switch to dark mode'; });
}
function setTheme(choice) {
  try { if (choice === 'system') localStorage.removeItem('cquest.theme'); else localStorage.setItem('cquest.theme', choice); } catch { /* private mode: lasts until the tab closes */ }
  applyTheme();
}
const flipTheme = () => setTheme(themeNow() === 'dark' ? 'light' : 'dark');
darkQuery.addEventListener('change', applyTheme);
$('#theme').onclick = flipTheme;

/* a language's badge: its logo on a light tile, or its short name on its colour if there is no logo */
const badge = (c, big) => c.logo
  ? `<span class="cbadge logo${big ? ' big' : ''}" title="${esc(c.name)}"><img src="${esc(c.logo)}" alt="${esc(c.name)} logo"></span>`
  : `<span class="cbadge${big ? ' big' : ''}" style="background:${c.color}">${esc(c.badge)}</span>`;

function hud() {
  applyTheme();
  const into = S.xp % 120;
  $('#nav-level').innerHTML = `<div><b>⚡ Lv ${level()}</b><small>${into} / 120 XP</small></div><div class="pbar"><i style="width:${into / 120 * 100}%"></i></div>`;
  $('#st-streak').textContent = '🔥 ' + liveStreak();
  $('#st-xp').textContent = '⚡ ' + S.xp + ' XP';
  $('#st-lvl').textContent = '🎖️ Lv ' + level();
  const cc = co(), cb = $('#st-course');
  cb.hidden = !S.course;
  cb.innerHTML = `${badge(cc)}<span class="cname">${esc(cc.name)}</span><span class="caret">▾</span>`;
  document.title = S.course ? `Code Quest — learn ${cc.name} by doing` : 'Code Quest — learn to code by doing';
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
/* Code runner. C, C++ and Python: the compiler / interpreter on this machine when opened through start.bat, a free
   online one (Wandbox) when hosted. C#: always online (courses marked online: true have nothing to run them locally).
   Python programs are wrapped by pywrap.js first, so input() echoes and syntax errors are reported separately. */
const isPy = () => !!co().py;
const wrapOf = () => (co().script ? window[co().script] : null);   // pyWrap or jsWrap for languages that are run, not compiled
const LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && !/[?&]online\b/.test(location.search);
const isOnline = () => !co().sql && (!LOCAL || !!co().online);   // SQL runs in the browser, never online
const BUSY = /OCI runtime error|Resource temporarily unavailable/;   // the free service ran out of room for a moment
const isBusy = j => !j.timedOut && (j.status === '126' || BUSY.test(j.program_error || ''));   // 126 = the sandbox could not start
async function wandbox(code, stdin) {
  for (let attempt = 0; ; attempt++) {
    let j;
    try { j = await wandboxOnce(code, stdin); }
    catch (e) { if (attempt >= 2) throw e; j = { status: '126' }; }      // rate-limited or a network blip: try again
    if (attempt >= 2 || !isBusy(j)) return j;
    await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
  }
}
async function wandboxOnce(code, stdin) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 40000);
  try {
    const r = await fetch('https://wandbox.org/api/compile.json', { method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: wrapOf() ? wrapOf()(code) : co().prep ? co().prep(code) : code, stdin, ...co().wandbox }) });
    if (!r.ok) throw new Error('http ' + r.status);
    return await r.json();
  } catch (e) { if (e.name === 'AbortError') return { timedOut: true }; throw e; }
  finally { clearTimeout(timer); }
}
/* turn the online compiler's raw messages into what a local compiler would have printed */
const TIDY = {
  java: t => String(t || '').replace(/\bprog\.java\b/g, 'Main.java').trim(),
  c: t => String(t || '').replace(/\bprog\.c\b/g, 'main.c').trim(),
  cpp: t => String(t || '').replace(/\bprog\.cc\b/g, 'main.cpp').trim(),
  cs: t => [...new Set(String(t || '').split('\n').filter(l => /\b(error|warning) (CS|MSB)\d+/.test(l) && !/warning CS8[67]\d\d/.test(l))
    .map(l => l.replace(/^.*?(?=\(\d+,\d+\))/, 'Program.cs').replace(/\s*\[[^\]]*proj\]\s*$/, '').trim()))].join('\n'),
};
const FAILED = { java: /\berror:/, c: /error:|ld returned|undefined reference/, cpp: /error:|ld returned|undefined reference/, cs: /\berror (CS|MSB)\d+/ };
async function runOnline(code, stdins) {
  const lang = S.course;
  const asRun = j => j.timedOut ? { stdout: '', stderr: '', code: 0, timedOut: true }
    : { stdout: (j.program_output || '').replace(/\r/g, ''), stderr: (j.program_error || '').replace(/\r/g, '').replace(/\bprog\.java\b/g, 'Main.java'), code: j.signal ? (/Segm/.test(j.signal) ? 139 : /Kill/.test(j.signal) ? 137 : 134) : +j.status || 0 };
  const first = await wandbox(code, stdins[0] || '');
  if (first.timedOut) return { compile: { ok: true, output: '' }, runs: stdins.map(() => asRun(first)) };
  let out = '';
  if (wrapOf()) {                                                  // nothing to compile: a syntax error is reported by the wrapper
    if (isBusy(first)) throw new Error('busy');
    const err = String(first.program_error || '').replace(/\r/g, '');
    if (err.startsWith(wrapOf().SYNTAX)) return { compile: { ok: false, output: err.slice(wrapOf().SYNTAX.length).trim() }, runs: [] };
  } else {
    out = TIDY[lang](first.compiler_message || ((first.compiler_output || '') + '\n' + (first.compiler_error || '')));
    if (first.status !== '0' && FAILED[lang].test(out)) return { compile: { ok: false, output: out }, runs: [] };
    if (isBusy(first)) throw new Error('busy');
  }
  const check = j => { if (isBusy(j)) throw new Error('busy'); return j; };
  let rest = [];
  if (co().oneAtATime) for (const i of stdins.slice(1)) rest.push(await wandbox(code, i || ''));   // this compiler refuses parallel runs
  else rest = await Promise.all(stdins.slice(1).map(i => wandbox(code, i || '')));
  return { compile: { ok: true, output: out }, runs: [first, ...rest].map(check).map(asRun) };
}
async function runCode(code, stdins) {
  try {
    if (isOnline()) return await runOnline(code, stdins);
    const r = await fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: S.course, code, stdins }) });
    if (!r.ok) throw 0;
    return await r.json();
  } catch { return { offline: true }; }
}
/* wording that depends on the language: Python is run, the others are compiled */
const W = () => co().sql
  ? { service: 'SQL engine', busy: 'Running…', busyTests: 'Checking your SQL…', says: 'SQLite says', warn: 'SQLite says', be: 'database',
      broken: '<p>SQLite could not run that. The message usually names the word it tripped over — look just before it.</p>' }
  : wrapOf()
  ? { service: 'online ' + co().name, busy: 'Running…', busyTests: 'Running tests…', says: esc(co().name) + ' says', warn: esc(co().name) + ' says', be: 'interpreter',
      broken: `<p>${esc(co().name)} cannot read it yet — that is a syntax error. The message points at the line (and often the exact spot with a <code>^</code>).</p>` }
  : { service: 'online compiler', busy: 'Compiling…', busyTests: 'Compiling and running tests…', says: 'Compiler says', warn: 'Compiler warnings (worth reading!)', be: 'compiler',
      broken: '<p>It does not compile yet. Read the first error — the line number is right there.</p>' };
const INSTALL = {
  java: 'Install a JDK (for example Temurin from <code>adoptium.net</code>) so that <code>javac</code> works in a terminal',
  js: 'JavaScript runs on the same Node.js that runs this site, so reinstalling Node.js should fix it',
  c: 'Install gcc (Bro Code shows how in the very first clip of the C course)',
  cpp: 'Install g++ (it comes with the same MSYS2 / MinGW package as gcc)',
  py: 'Install Python 3 from <code>python.org</code> (tick “Add python.exe to PATH” in the installer)',
};
const offMsg = () => isOnline()
  ? `<div class="hintbox">🔌 <b>The ${W().service} did not answer.</b> It is a free shared service and is sometimes busy — check your connection, wait a few seconds and try again.${LOCAL && co().online ? ` (${esc(co().name)} always runs online, even from <code>start.bat</code>.)` : ''}</div>`
  : `<div class="hintbox">🔌 <b>The code runner is not reachable.</b> Start the site by double-clicking <code>start.bat</code> (it runs your code with ${esc(co().tool)} on your own machine), then open <code>http://localhost:4321</code>.</div>`;
const noccMsg = () => `<div class="hintbox">⚠️ <b>${esc(co().tool)} was not found on this computer.</b> ${INSTALL[S.course] || ''}, then restart <code>start.bat</code>.</div>`;
const waitNote = () => isOnline() ? ` (${W().service} — this can take a few seconds)` : '';
const JSERR = {
  ReferenceError: '🔤 <b>ReferenceError</b> — JavaScript does not know that name. A typo, or used before it was declared with <code>let</code> or <code>const</code>?',
  TypeError: '🧩 <b>TypeError</b> — you used a value in a way its type does not allow: calling something that is not a function, reading a property of <code>null</code> or <code>undefined</code>, or changing a <code>const</code>.',
  RangeError: '🌀 <b>RangeError</b> — a number is outside what is allowed. Often runaway recursion (“Maximum call stack size exceeded”).',
  SyntaxError: '✏️ <b>SyntaxError</b> — some text handed to JavaScript while running (for example <code>JSON.parse</code>) was not valid.',
};
const JAVAERR = {
  ArithmeticException: '➗ <b>ArithmeticException</b> — usually a whole number divided by zero.',
  ArrayIndexOutOfBoundsException: '📏 <b>ArrayIndexOutOfBoundsException</b> — past the end of the array. Indexes start at 0, so the last one is <code>length - 1</code>.',
  StringIndexOutOfBoundsException: '📏 <b>StringIndexOutOfBoundsException</b> — past the end of the string. The last character is at <code>length() - 1</code>.',
  NullPointerException: '🕳️ <b>NullPointerException</b> — you used a variable that holds <code>null</code> (nothing) as if it were an object.',
  InputMismatchException: '⌨️ <b>InputMismatchException</b> — the Scanner expected one kind of input (say a number) and got another.',
  NoSuchElementException: '⌨️ <b>NoSuchElementException</b> — the Scanner asked for more input than there was.',
  NumberFormatException: '🔢 <b>NumberFormatException</b> — that text is not a number, so it could not be converted.',
  StackOverflowError: '🌀 <b>StackOverflowError</b> — a method kept calling itself and never stopped.',
};
const PYERR = {
  NameError: '🔤 <b>NameError</b> — Python does not know that name. A typo, missing quotes around text, or used before it was given a value?',
  UnboundLocalError: '🔤 <b>UnboundLocalError</b> — you used a variable inside a function before assigning it there.',
  TypeError: '🧩 <b>TypeError</b> — these types do not fit together (like <code>"3" + 4</code>), or a function got the wrong number of arguments.',
  ValueError: '🔢 <b>ValueError</b> — the right type but an impossible value, like <code>int("hello")</code>.',
  IndexError: '📏 <b>IndexError</b> — past the end of the list or string. Indexes start at 0, so the last one is <code>len - 1</code>.',
  KeyError: '🗝️ <b>KeyError</b> — that key is not in the dictionary. <code>.get()</code> is the safe way to look things up.',
  ZeroDivisionError: '➗ <b>ZeroDivisionError</b> — something was divided by zero.',
  AttributeError: '🔍 <b>AttributeError</b> — that object has no attribute or method with that name. Check the spelling.',
  EOFError: '⌨️ <b>EOFError</b> — your program called <code>input()</code> more times than there were lines of input.',
  RecursionError: '🌀 <b>RecursionError</b> — a function kept calling itself and never reached its base case.',
  FileNotFoundError: '📂 <b>FileNotFoundError</b> — there is no file with that name (yet).',
  ModuleNotFoundError: '📦 <b>ModuleNotFoundError</b> — that module is not installed. Only the standard library is available here.',
  AssertionError: '🧪 <b>AssertionError</b> — an <code>assert</code> was false.',
};
function crashNote(r) {
  if (r.timedOut || r.code === 137) return '⏱️ Timed out — infinite loop, or waiting for input that never comes?';
  if (r.flooded) return '🌊 Way too much output — probably an infinite loop.';
  if (wrapOf()) {                                                  // Python and JavaScript name their errors on the last line
    const last = String(r.stderr || '').trim().split('\n').pop() || '', kind = (last.match(/^(\w+)(?::|$)/) || [])[1], known = isPy() ? PYERR : JSERR;
    if (kind && known[kind]) return known[kind];
    return r.code ? '💥 The program stopped with an error' + (kind ? ' (' + esc(kind) + ')' : '') + '.' : '';
  }
  if (r.code === 3221225477 || r.code === 139) return '💥 Segmentation fault — your program touched memory it does not own.';
  if (r.code === 3221225725) return '💥 Stack overflow — runaway recursion or a gigantic local array.';
  if (r.code === 3221225620 || r.code === 136) return '💥 Crash: division by zero.';
  const je = /Exception in thread "[^"]*" ([\w.$]+)/.exec(r.stderr || '');                 // Java
  if (je) { const kind = je[1].split('.').pop(); return JAVAERR[kind] || '💥 The program stopped with an exception (' + esc(kind) + '). Nothing caught it.'; }
  const ue = /Unhandled Exception[.:]?\s*([^\n]+)/i.exec(r.stderr || '');
  if (ue) return '💥 Unhandled exception — ' + esc(ue[1].trim()) + ' Nothing caught it, so the program stopped.';
  if (/terminate called/.test(r.stderr || '')) return '💥 An exception was thrown and never caught' + ((r.stderr.match(/what\(\):\s*([^\n]*)/) || [])[1] ? ': ' + esc(r.stderr.match(/what\(\):\s*([^\n]*)/)[1].trim()) : '') + '.';
  if (r.code === 134) return '💥 The program aborted.';
  if (r.code > 255 || r.code < 0) return '💥 The program crashed (exit code ' + r.code + ').';
  return '';
}
/* what went wrong in a run: Python's traceback (the others print theirs at compile time), then a plain-English note */
const errBox = x => ((wrapOf() || co().showErr) && x.stderr ? `<div class="lbl">💥 Error</div><pre class="err">${esc(x.stderr.trim())}</pre>` : '') + (crashNote(x) ? `<p>${crashNote(x)}</p>` : '');

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
      ins('\n' + line.match(/^\s*/)[0] + ((isPy() ? /:\s*(#.*)?$/ : /\{\s*$/).test(line) ? '    ' : ''));    // indent after "{", or after ":" in Python
    } else if (!isPy() && e.key === '}') {
      const before = ta.value.slice(0, ta.selectionStart), line = before.slice(before.lastIndexOf('\n') + 1);
      if (/^\s{4,}$/.test(line) && ta.selectionStart === ta.selectionEnd) { e.preventDefault(); ta.setSelectionRange(ta.selectionStart - 4, ta.selectionStart); ins('}'); }
    } else if (isPy() && e.key === 'Backspace' && ta.selectionStart === ta.selectionEnd) {                  // Python: Backspace removes one indent level
      const before = ta.value.slice(0, ta.selectionStart), line = before.slice(before.lastIndexOf('\n') + 1);
      if (/^( {4})+$/.test(line)) { e.preventDefault(); ta.setSelectionRange(ta.selectionStart - 4, ta.selectionStart); ins(''); }
    }
  });
  sync();
  return { node: w, ta, get value() { return ta.value; }, set(v) { ta.value = v; sync(); } };
}

/* ---------- SQL: queries run in the browser with sql.js (real SQLite); see sqlrun.js ---------- */
let sqlReady = null;
const sqlEngine = () => sqlReady || (sqlReady = new Promise((ok, fail) => {
  const sc = document.createElement('script');
  sc.src = 'vendor/sqljs/sql-wasm.js'; sc.onload = ok; sc.onerror = () => fail(new Error('could not load the SQL engine'));
  document.head.append(sc);
}).then(() => window.initSqlJs({ locateFile: f => 'vendor/sqljs/' + f })).catch(e => { sqlReady = null; throw e; }));
async function sqlRun(setup, code, check) {
  try { return window.SqlRun.runSql(await sqlEngine(), setup, code, check); }
  catch (e) { return { ok: false, error: 'The SQL engine could not start (' + (e.message || e) + '). Check your connection and reload the page.' }; }
}
/* which dataset a step uses: the step's own, else its lesson's, its topic's, or the course default */
const dbOf = key => { const x = IDX[key] || {}; return (x.step && x.step.db) || (x.lesson && x.lesson.db) || (x.topic && x.topic.db) || co().db || ''; };
const setupOf = db => (co().datasets || {})[db] || '';
const sqlTable = (set, label, max = 60) => {
  if (!set) return '';
  const rows = set.rows.slice(0, max), more = set.rows.length - rows.length;
  return `${label ? `<div class="lbl">${label}</div>` : ''}<div class="sqlt-wrap"><table class="sqlt"><thead><tr>${set.columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${
    rows.map(r => `<tr>${r.map(v => `<td${v === 'NULL' ? ' class="null"' : ''}>${esc(v)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${set.columns.length || 1}" class="null">(no rows)</td></tr>`
  }</tbody></table></div>${more > 0 ? `<p class="muted">… and ${more} more row${more > 1 ? 's' : ''}</p>` : ''}`;
};
const sqlErr = msg => `<div class="lbl">❌ SQLite says</div><pre class="err">${esc(msg)}</pre>`;
function sqlOut(r, check) {
  if (!r.ok) return sqlErr(r.error);
  let h = r.sets.map((set, i) => sqlTable(set, r.sets.length > 1 ? 'Result ' + (i + 1) : 'Result')).join('');
  if (r.changed) h += `<p class="sql-done">✓ ${r.changed} row${r.changed > 1 ? 's' : ''} changed</p>`;
  if (check && r.last) h += sqlTable(r.last, 'The table afterwards');
  return h || '<p class="sql-done">✓ Done — that SQL ran without returning a table.</p>';
}
/* "Look inside the database": every table and its rows, loaded the first time the panel is opened */
const tablesBox = db => `<details class="sqldb" data-db="${esc(db)}"><summary>📋 Look inside the <b>${esc(db || 'empty')}</b> database</summary><div class="sqldb-in muted">Loading…</div></details>`;
document.addEventListener('toggle', async e => {
  const d = e.target;
  if (!d.matches || !d.matches('details.sqldb') || !d.open || d.dataset.loaded) return;
  d.dataset.loaded = '1';
  const box = $('.sqldb-in', d), setup = setupOf(d.dataset.db);
  if (!setup) { box.textContent = 'This database starts empty — you create the tables yourself.'; return; }
  const names = await sqlRun(setup, "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY rowid");
  if (!names.ok) { box.innerHTML = sqlErr(names.error); return; }
  let h = '';
  for (const [name] of names.last.rows) { const t = await sqlRun(setup, `SELECT * FROM "${name}"`); h += t.ok ? sqlTable(t.last, '🗂️ ' + name) : ''; }
  box.classList.remove('muted'); box.innerHTML = h;
}, true);
const stripSqlComments = s => String(s).replace(/--.*|\/\*[\s\S]*?\*\//g, '');

/* An SQL challenge has no keyboard input: the learner's result is compared with the answer's result on the same data. */
function sqlCode(s, ctx) {
  const db = dbOf(ctx.key), setup = setupOf(db), ed = editor(s.start || co().blank); let fails = 0;
  const n = el(`<div class="step"><span class="tag">SQL challenge</span><div class="q">${md(s.q)}</div>${tablesBox(db)}<div class="edw"></div><div class="ed-tools"><button class="btn sm blue run">▶ Run</button><button class="btn sm ghost reset">↺ Reset</button>${s.hint ? '<button class="btn sm ghost hint">💡 Hint</button>' : ''}<button class="btn sm ghost sol" hidden>👀 Show solution</button><button class="btn sm ghost skip" hidden>Skip for now →</button></div><div class="hintw"></div><div class="out"></div></div>`);
  $('.edw', n).append(ed.node);
  const out = $('.out', n);
  const struggling = () => { $('.sol', n).hidden = !s.sol; $('.skip', n).hidden = false; };
  $('.run', n).onclick = async () => { out.innerHTML = '<span class="muted">Running…</span>'; out.innerHTML = sqlOut(await sqlRun(setup, ed.value, s.check), s.check); };
  $('.reset', n).onclick = () => ed.set(s.start || co().blank);
  if (s.hint) $('.hint', n).onclick = () => { $('.hintw', n).innerHTML = `<div class="hintbox">💡 ${inl(s.hint)}</div>`; };
  $('.sol', n).onclick = () => { ctx.wrong(); ed.set(s.sol); toast('Solution loaded — read it line by line, then Check.'); };
  $('.skip', n).onclick = () => { ctx.wrong(); ctx.skip(); };
  ctx.ready(true);
  return { node: n, async check() {
    const fail = msg => { fails++; if (fails >= 2) struggling(); return { retry: true, msg }; };
    const bare = stripSqlComments(ed.value);
    for (const [re, msg] of s.must || []) if (!new RegExp(re, 'i').test(bare)) return fail(`<p>${inl(msg)}</p>`);
    for (const [re, msg] of s.not || []) if (new RegExp(re, 'i').test(bare)) return fail(`<p>${inl(msg)}</p>`);
    out.innerHTML = '<span class="muted">Checking your SQL…</span>';
    const [want, mine] = [await sqlRun(setup, s.sol, s.check), await sqlRun(setup, ed.value, s.check)];
    if (!want.ok) { out.innerHTML = sqlErr('This exercise has a problem of its own: ' + want.error); return { retry: true, msg: '<p>Sorry — this exercise is broken. Skip it for now.</p>' }; }
    if (!mine.ok) { out.innerHTML = sqlErr(mine.error); return fail('<p>SQLite could not run that. The message usually names the word it tripped over — look just before it.</p>'); }
    if (!mine.last) { out.innerHTML = sqlOut(mine); return fail('<p>That ran, but it did not produce a result table. Is there a <code>SELECT</code>?</p>'); }
    const ordered = s.ordered != null ? s.ordered : window.SqlRun.isOrdered(s.check || s.sol);
    if (!window.SqlRun.sameResult(want.last, mine.last, ordered)) {
      const a = want.last, b = mine.last;
      const why = a.columns.length !== b.columns.length ? `The answer has ${a.columns.length} column${a.columns.length > 1 ? 's' : ''}; yours has ${b.columns.length}.`
        : a.rows.length !== b.rows.length ? `The answer has ${a.rows.length} row${a.rows.length === 1 ? '' : 's'}; yours has ${b.rows.length}.`
        : ordered ? 'Same size, but some values or the order are different.' : 'Same size, but some values are different.';
      out.innerHTML = sqlTable(b, s.check ? 'Your table afterwards' : 'Your result') + sqlTable(a, s.check ? 'What it should look like' : 'Expected result');
      return fail(`<p>Not the result we are after yet. ${why}</p>`);
    }
    out.innerHTML = sqlTable(mine.last, s.check ? 'Your table afterwards' : 'Your result');
    S.solved[ctx.key] = 1;
    return { ok: true, msg: '' };
  } };
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
    const n = el(`<div class="step"><span class="tag">Predict the output</span><div class="q">${md(s.q || (co().sql ? 'What does this query return? Type one row per line, with ~|~ between columns.' : `What does this print? Be the ${W().be}.`))}</div>${codeBlock(s.code)}${co().sql ? tablesBox(dbOf(ctx.key)) : ''}${multi ? `<textarea class="ans" rows="${s.out.split('\n').length + 1}" placeholder="Type the exact output (one line per line)" spellcheck="false"></textarea>` : '<input class="ans" placeholder="Type the exact output" spellcheck="false" autocomplete="off" autocapitalize="off">'}</div>`);
    const inp = $('.ans', n); inp.oninput = () => ctx.ready(inp.value.trim() !== '');
    return { node: n, focus: inp, check() {
      const tidy = v => (co().sql ? norm(v).replace(/[ \t]*\|[ \t]*/g, ' | ') : norm(v));      // SQL: spacing around | does not matter
      inp.disabled = true; const ok = tidy(inp.value) === tidy(s.out);
      return { ok, msg: ok ? '' : `<p>It prints:</p><pre>${esc(s.out)}</pre>` };
    } };
  },
  fill(s, ctx) {
    const blanks = []; let k = 0;
    const src = s.code.replace(/^\n+|\s+$/g, '').replace(/\[\[(.+?)\]\]/g, (m, a) => { blanks.push(a.split('~')); return String.fromCharCode(0xE000 + k++); });
    const html = hl(src).replace(/[-]/g, ch => { const i = ch.charCodeAt(0) - 0xE000, w = Math.max(...blanks[i].map(x => x.length)); return `<input class="blank" data-i="${i}" style="width:${w + 2.5}ch" autocomplete="off" autocapitalize="off" spellcheck="false">`; });
    const n = el(`<div class="step"><span class="tag">Fill the blanks</span><div class="q">${md(s.q)}</div><pre class="code">${html}</pre>${co().sql && s.db !== false ? tablesBox(dbOf(ctx.key)) : ''}</div>`);
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
    if (co().sql) return sqlCode(s, ctx);
    const ed = editor(s.start || co().blank); let fails = 0;
    const n = el(`<div class="step"><span class="tag">Code challenge</span><div class="q">${md(s.q)}</div><div class="edw"></div><div class="ed-tools"><button class="btn sm blue run">▶ Run</button><button class="btn sm ghost reset">↺ Reset</button>${s.hint ? '<button class="btn sm ghost hint">💡 Hint</button>' : ''}<button class="btn sm ghost sol" hidden>👀 Show solution</button><button class="btn sm ghost skip" hidden>Skip for now →</button></div><div class="hintw"></div><div class="out"></div></div>`);
    $('.edw', n).append(ed.node);
    const out = $('.out', n), tests = s.tests || [{ in: '' }];
    const struggling = () => { $('.sol', n).hidden = !s.sol; $('.skip', n).hidden = false; };
    const compileBox = r => r.compile.output ? `<div class="lbl">${r.compile.ok ? '⚠️ ' + W().warn : '❌ ' + W().says}</div><pre${wrapOf() ? ' class="err"' : ''}>${esc(r.compile.output)}</pre>` : '';
    const guard = r => { if (r.offline) { out.innerHTML = offMsg(); struggling(); return true; } if (r.noCompiler) { out.innerHTML = noccMsg(); struggling(); return true; } return false; };
    $('.run', n).onclick = async () => {
      out.innerHTML = '<span class="muted">' + W().busy + waitNote() + '</span>';
      const r = await runCode(ed.value, [tests[0].in || '']);
      if (guard(r)) return;
      let h = compileBox(r);
      if (r.compile.ok) { const x = r.runs[0]; h += `${tests[0].in ? `<div class="lbl">Input used</div><pre>${esc(tests[0].in)}</pre>` : ''}<div class="lbl">Output</div><pre>${esc(x.stdout) || '<span class="muted">(no output)</span>'}</pre>${errBox(x)}`; }
      out.innerHTML = h;
    };
    $('.reset', n).onclick = () => ed.set(s.start || co().blank);
    if (s.hint) $('.hint', n).onclick = () => { $('.hintw', n).innerHTML = `<div class="hintbox">💡 ${inl(s.hint)}</div>`; };
    $('.sol', n).onclick = () => { ctx.wrong(); ed.set(s.sol); toast('Solution loaded — read it line by line, then Check.'); };
    $('.skip', n).onclick = () => { ctx.wrong(); ctx.skip(); };
    ctx.ready(true);
    return { node: n, async check() {
      const fail = msg => { fails++; if (fails >= 2) struggling(); return { retry: true, msg }; };
      const bare = ed.value.replace(isPy() ? /#.*/g : /\/\/.*|\/\*[\s\S]*?\*\//g, '');      // the must / not rules ignore comments
      for (const [re, msg] of s.must || []) if (!new RegExp(re).test(bare)) return fail(`<p>${inl(msg)}</p>`);
      for (const [re, msg] of s.not || []) if (new RegExp(re).test(bare)) return fail(`<p>${inl(msg)}</p>`);
      out.innerHTML = '<span class="muted">' + W().busyTests + waitNote() + '</span>';
      const r = await runCode(ed.value, tests.map(t => t.in || ''));
      if (guard(r)) return { retry: true, msg: '<p>Could not run your code.</p>' };
      if (!r.compile.ok) { out.innerHTML = compileBox(r); return fail(W().broken); }
      let all = true, h = compileBox(r);
      r.runs.forEach((x, i) => {
        const t = tests[i], o = norm(x.stdout);
        const ok = !crashNote(x) && (t.out == null || o === norm(t.out)) && (!t.has || t.has.every(v => o.includes(v))) && (!t.re || new RegExp(t.re).test(o));
        if (!ok) all = false;
        h += `<div class="test ${ok ? 'pass' : 'fail'}"><b>${ok ? '✓' : '✗'} Test ${i + 1}</b>${ok ? '' : `${t.in ? `<div class="lbl">Input</div><pre>${esc(t.in)}</pre>` : ''}${t.out != null ? `<div class="lbl">Expected output</div><pre>${esc(t.out)}</pre>` : t.has ? `<div class="lbl">Output must contain</div><pre>${esc(t.has.join('\n'))}</pre>` : ''}<div class="lbl">Your output</div><pre>${esc(x.stdout) || '(no output)'}</pre>${errBox(x)}`}</div>`;
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
const PRAISE = ['Nice!', 'Correct!', 'Exactly right.', 'You are getting dangerous.', 'Clean.', 'Boom.'];
const praise = () => { const all = PRAISE.concat(isPy() ? ['Very Pythonic.', 'No traceback in sight.'] : co().sql ? ['The database agrees.', 'Query perfect.'] : wrapOf() ? ['No errors in sight.', 'Runs first time.'] : ['Compiles in my heart.', 'Zero warnings.']); return all[Math.floor(Math.random() * all.length)]; };

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
      feedback(true, praise(), step.why ? md(step.why) : '');
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
  return `<div class="vid" data-s="${s}" data-e="${e}"><button class="vid-thumb" style="background-image:url(https://i.ytimg.com/vi/${co().video}/hqdefault.jpg)" title="Play clip"><span class="play">▶</span></button><div class="vid-meta"><b>🎬 ${esc(v[2])}</b><span>Bro Code · ${v[0]} → ${e ? v[1] + ' · about ' + mins + ' min' : 'end of video'}</span><a href="https://www.youtube.com/watch?v=${co().video}&t=${s}s" target="_blank" rel="noopener">Open on YouTube ↗</a></div></div>`;
}
function wireVideos() {
  $$('.vid-thumb').forEach(b => { b.onclick = () => {
    const v = b.parentElement, meta = $('.vid-meta', v);
    b.remove(); v.classList.add('playing');
    v.prepend(el(`<iframe src="https://www.youtube.com/embed/${co().video}?start=${v.dataset.s}${+v.dataset.e ? '&end=' + v.dataset.e : ''}&autoplay=1&rel=0" title="Bro Code clip" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`));
    if (+v.dataset.e) meta.querySelector('span').textContent += ' · the clip stops by itself at the end of this section';
  }; });
}

function vHome() {
  const cur = currentUnit(), doneN = co().lessons.filter(l => S.done[l.gid]).length, today = S.days[dayKey()] || 0;
  const pct = Math.min(1, today / S.goal), C = 2 * Math.PI * 40, due = Object.keys(S.mistakes).filter(mine).length;
  const first = window.Cloud && Cloud.user && (Cloud.user.displayName || '').split(' ')[0];
  const hello = first ? 'Hello, ' + first : doneN ? 'Welcome back' : 'Hello, ' + co().name;
  let h = '<div class="home"><div><div class="hello"><h1>👋 ' + esc(hello) + '</h1><p>' + (doneN ? 'Continue your ' : 'Start your ') + esc(co().name) + ' journey.</p></div>' + (hasTracks(S.course) ? '<p class="trackline">' + TRACKS[trackOf(S.course)].join(' ') + ' · <a href="#/start/' + S.course + '">change starting point</a></p>' : '');
  co().topics.forEach((t, ti) => {
    const d = t.lessons.filter(l => S.done[l.gid]).length;
    h += `<section class="topic" style="--tc:${t.color}"><header class="topic-head"><div><small>TOPIC ${ti + 1}</small><h2>${t.icon} ${esc(t.title)}</h2><p>${esc(t.blurb)}</p></div><span class="topic-art" aria-hidden="true"><span>&lt;/&gt;</span></span><div class="topic-prog">${d}/${t.lessons.length}</div>${cur && (cur === 'quiz:' + t.gid || t.lessons.some(l => l.gid === cur)) ? `<a class="topic-go" href="${cur.startsWith('quiz:') ? '#/quiz/' + cur.slice(5) : '#/lesson/' + cur}" title="Continue this topic">▶</a>` : ''}</header><div class="nodes">`;
    const node = (u, href, icon, title, sub, k) => { const st = unitDone(u) ? 'done' : unlocked(u) ? 'open' : 'locked'; return `<a class="node ${st}${cur === u ? ' cur' : ''}" style="--o:${Math.round(Math.sin(k * 1.15) * 80)}px" href="${href}" data-u="${u}"><span class="bubble">${st === 'done' ? '✓' : st === 'locked' ? '🔒' : icon}</span><span class="nlabel">${esc(title)}<small>${sub}</small></span></a>`; };
    t.lessons.forEach((l, li) => { h += node(l.gid, '#/lesson/' + l.gid, l.icon || '★', l.title, l.steps.some(s => s.t === 'code') ? '⌨️ hands-on' : 'concepts', li); });
    h += node('quiz:' + t.gid, '#/quiz/' + t.gid, '🏆', t.title + ' quiz', S.quiz[t.gid] != null ? 'best: ' + S.quiz[t.gid] + '%' : 'revision', t.lessons.length);
    h += '</div></section>';
  });
  const nxt = cur && (cur.startsWith('quiz:') ? '#/quiz/' + cur.slice(5) : '#/lesson/' + cur);
  h += `</div><aside class="side">
    <div class="card"><div class="row"><div class="ring"><svg width="96" height="96"><circle cx="48" cy="48" r="40" fill="none" style="stroke:var(--line)" stroke-width="10"/><circle cx="48" cy="48" r="40" fill="none" stroke="${pct >= 1 ? '#ffc800' : '#58cc02'}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg><b>${pct >= 1 ? '✓' : today + '/' + S.goal}</b></div><div><h3>Daily goal</h3><span class="muted">${pct >= 1 ? 'Done for today. Anything more is a bonus.' : (S.goal - today) + ' XP to go today'}</span></div></div></div>
    <div class="card"><h3>🔥 ${liveStreak()} day streak</h3><span class="muted">${S.last === dayKey() ? 'Safe for today. See you tomorrow!' : liveStreak() ? 'Do one lesson today to keep it alive.' : 'Finish a lesson to start a streak.'}</span></div>
    <div class="card"><h3>Course progress</h3><div class="pbar"><i style="width:${doneN / co().lessons.length * 100}%"></i></div><p class="muted" style="margin:.5em 0 .8em">${doneN} of ${co().lessons.length} lessons · ${levelName()}</p>${nxt ? `<a class="btn primary" href="${nxt}">${doneN ? 'Continue' : 'Start learning'}</a>` : '<b>👑 Course complete!</b>'}</div>
    <div class="card"><h3>🎯 Practice</h3><p class="muted" style="margin:.2em 0 .8em">${due ? due + ' question' + (due > 1 ? 's' : '') + ' you got wrong ' + (due > 1 ? 'are' : 'is') + ' waiting for revenge.' : 'No mistakes waiting. Suspiciously good.'}</p><a class="btn" href="#/practice">Practice now</a></div>
  </aside></div>`;
  view.innerHTML = h;
  $$('.node.locked').forEach(n => { n.onclick = e => { e.preventDefault(); n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); toast('🔒 Finish the previous step first — or turn on “Unlock everything” in Profile.'); }; });
  const c = $('.node.cur'); if (c && doneN) c.scrollIntoView({ block: 'center' });
}

function vLesson(gid) {
  const l = ALL.find(x => x.gid === gid);
  if (l) setCourse(l.topic.course.id, true);
  if (!l || !unlocked(l.gid)) { location.hash = '#/'; return; }
  const nCode = l.steps.filter(s => s.t === 'code').length;
  view.innerHTML = `<div class="intro"><a class="back" href="#/">← Back to path</a><br><small style="background:${l.topic.color}">${esc(co().name)} · ${esc(l.topic.title)}</small><h1>${l.icon || ''} ${esc(l.title)}</h1><p class="lead">${esc(l.desc || '')}</p><div class="chips"><span>${l.steps.length} steps</span>${nCode ? `<span>⌨️ ${nCode} coding challenge${nCode > 1 ? 's' : ''}</span>` : ''}<span>~${Math.max(3, Math.round(l.steps.length * .8 + nCode * 2.5))} min</span>${S.done[l.gid] ? '<span class="okc">✓ Completed</span>' : ''}</div>${(l.v || []).map(videoCard).join('')}<div class="intro-go"><button class="btn primary big start">${S.done[l.gid] ? 'Practice again' : 'Start lesson'}</button><p class="muted">${l.v ? 'Watch the clip first, or dive straight in and come back if you get stuck — your call.' : 'No clip for this one — you learn it by doing.'}</p></div></div>`;
  wireVideos();
  $('.start').onclick = () => session({ keys: l.keys, requeue: true, exit: '#/', done: r => {
    const first = !S.done[l.gid], perfect = r.wrong === 0;
    S.done[l.gid] = { at: Date.now() }; if (perfect) S.perfect++;
    return { emoji: perfect ? '💎' : '🎉', title: perfect ? 'Flawless!' : 'Lesson complete!', sub: perfect ? 'Not a single mistake. Show-off.' : 'Mistakes are saved in Practice so you can get revenge later.', xp: (first ? 15 : 5) + (perfect ? 5 : 0) };
  } });
}

function vQuiz(tid) {
  const t = ALLTOPICS.find(x => x.gid === tid);
  if (t) setCourse(t.course.id, true);
  if (!t || !unlocked('quiz:' + tid)) { location.hash = '#/'; return; }
  const extra = shuffle(t.lessons.flatMap(l => l.keys).filter(k => ['mcq', 'predict', 'fill'].includes(IDX[k].step.t))).slice(0, 4);
  const keys = shuffle([...t.quizKeys, ...extra]);
  view.innerHTML = `<div class="intro"><a class="back" href="#/">← Back to path</a><br><small style="background:${t.color}">${esc(co().name)} · Revision quiz</small><h1>🏆 ${esc(t.title)}</h1><p class="lead">${keys.length} questions covering every lesson in this topic. Score ${PASS}% or more to unlock the next topic. No second chances inside the quiz — but you can retake it as often as you like.</p><div class="chips">${S.quiz[tid] != null ? `<span class="${S.quiz[tid] >= PASS ? 'okc' : ''}">Best score: ${S.quiz[tid]}%</span>` : ''}</div><div class="intro-go"><button class="btn primary big start">Start quiz</button></div></div>`;
  $('.start').onclick = () => session({ keys, requeue: false, exit: '#/', done: r => {
    const first = (S.quiz[tid] || 0) < PASS, pass = r.acc >= PASS;
    S.quiz[tid] = Math.max(S.quiz[tid] || 0, r.acc);
    return pass ? { emoji: '🏆', title: `Passed with ${r.acc}%`, sub: `${t.title} — done. Next topic unlocked.`, xp: first ? 30 : 10 }
      : { emoji: '🧗', title: `${r.acc}% — so close`, sub: `You need ${PASS}%. Your misses are now in Practice; hit those, then retake.`, xp: 3, party: false };
  } });
}

function vPractice() {
  let keys = Object.keys(S.mistakes).filter(mine).sort((a, b) => S.mistakes[b] - S.mistakes[a]).slice(0, 8);
  const had = keys.length;
  const pool = shuffle(co().lessons.filter(l => S.done[l.gid]).flatMap(l => l.keys).filter(k => IDX[k].step.t !== 'info' && !keys.includes(k)));
  keys = keys.concat(pool.slice(0, Math.max(0, 6 - keys.length)));
  if (!keys.length) { view.innerHTML = '<div class="page intro"><h1>🎯 Practice</h1><div class="card"><p>Nothing to practise yet. Finish your first lesson and this page becomes your personal revision deck — built from the exact questions <b>you</b> got wrong.</p><a class="btn primary" href="#/">Go to lessons</a></div></div>'; return; }
  view.innerHTML = `<div class="page intro"><h1>🎯 Practice · ${esc(co().name)}</h1><p class="lead">${had ? `${had} question${had > 1 ? 's' : ''} from your mistake pile${keys.length > had ? ', topped up with random review' : ''}. Get one right and it leaves the pile.` : 'Your mistake pile is empty, so here is a random mix from lessons you have finished.'}</p><div class="intro-go"><button class="btn primary big start">Start (${keys.length} questions)</button></div></div>`;
  $('.start').onclick = () => session({ keys, requeue: false, practice: true, exit: '#/', done: () => {
    const clear = had && !Object.keys(S.mistakes).filter(mine).length; if (clear) S.cleared = 1;
    return { emoji: clear ? '🧽' : '💪', title: clear ? 'Mistake pile cleared!' : 'Practice complete', sub: 'Repetition is how this sticks.', xp: 10 };
  } });
}

function stepLabel(k) {
  const { step, lesson, topic } = IDX[k];
  return { type: TYPE[step.t], where: topic.title + (lesson ? ' › ' + lesson.title : ' › Quiz'), text: plain(step.title || step.q || step.text).slice(0, 140) || 'What does this code print?', code: step.t !== 'code' && step.code ? step.code : '' };
}
function vBookmarks() {
  const gp = 'g:' + S.course + ':';
  const keys = Object.keys(S.bookmarks).filter(k => k.startsWith(gp) || mine(k)).sort((a, b) => S.bookmarks[b].at - S.bookmarks[a].at);
  let h = `<div class="page"><h1>🔖 Bookmarks · ${esc(co().name)}</h1><p class="lead">Everything you flagged as tricky in ${esc(co().name)}. Tap 🔖 during any lesson, or next to any glossary term.</p>`;
  if (!keys.length) h += '<div class="card">Nothing saved yet. When a question makes you go “wait, what?”, hit the 🔖 in the top-right corner of the lesson.</div>';
  keys.forEach(k => {
    if (k.startsWith('g:')) { const g = co().glossary.find(x => x.term === k.slice(gp.length)); if (!g) return; h += `<div class="item" data-k="${esc(k)}"><div class="meta">Definition</div><b>${esc(g.term)}</b><div>${inl(g.def)}</div>`; }
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
  setCourse(IDX[key].course.id, true);
  session({ keys: [key], requeue: false, practice: true, exit: '#/bookmarks', done: r => ({ emoji: r.wrong ? '🔁' : '✅', title: r.wrong ? 'Keep it bookmarked' : 'Nailed it', sub: r.wrong ? 'Come back to this one tomorrow.' : 'If it feels easy now, remove the bookmark.', xp: 2, party: !r.wrong }) });
}

function sqlPlay() {
  const names = Object.keys(co().datasets || {}).filter(d => d !== 'empty'), pick = S.playDb && (names.includes(S.playDb) || S.playDb === 'empty') ? S.playDb : names[0] || 'empty';
  view.innerHTML = `<div class="page"><h1>🧪 Playground · SQL</h1><p class="lead">Run any SQL against a practice database. Every run starts from a fresh copy, so you cannot break anything — try a DELETE without a WHERE and see.</p>
    <label class="sql-pick">Database <select id="pdb">${names.concat('empty').map(d => `<option value="${d}"${d === pick ? ' selected' : ''}>${d === 'empty' ? 'empty (make your own tables)' : d}</option>`).join('')}</select></label>
    <div id="pdb-box">${tablesBox(pick === 'empty' ? '' : pick)}</div><div class="edw"></div><div class="ed-tools"><button class="btn primary run">▶ Run</button><button class="btn ghost reset">↺ Reset</button></div><div class="out" style="margin-top:14px"></div></div>`;
  const ed = editor(S.play.sql || co().blank); $('.edw').append(ed.node);
  ed.ta.addEventListener('input', () => { S.play.sql = ed.value; save(); });
  $('#pdb').onchange = e => { S.playDb = e.target.value; save(); $('#pdb-box').innerHTML = tablesBox(e.target.value === 'empty' ? '' : e.target.value); };
  $('.reset').onclick = () => { ed.set(co().blank); delete S.play.sql; save(); };
  $('.run').onclick = async () => { const out = $('.out'); out.innerHTML = '<span class="muted">Running…</span>'; const d = $('#pdb').value; out.innerHTML = sqlOut(await sqlRun(d === 'empty' ? '' : setupOf(d), ed.value)); };
}
function vPlay() {
  if (co().sql) return sqlPlay();
  view.innerHTML = '<div class="page"><h1>🧪 Playground · ' + esc(co().name) + '</h1><p class="lead">A blank canvas. Try things, break things — ' + (isOnline() ? 'it runs real ' + esc(co().name) + ' on a free online service, so give it a few seconds.' : 'it runs real ' + esc(co().name) + ' on your machine.') + ' Your code is saved automatically.</p><div class="edw"></div><div class="ed-tools"><button class="btn primary run">▶ Run</button><button class="btn ghost reset">↺ Reset</button></div><div class="lbl muted">Program input (stdin) — what the program would read from the keyboard</div><textarea class="field" rows="2" id="stdin" spellcheck="false"></textarea><div class="out" style="margin-top:14px"></div></div>';
  const ed = editor(S.play[S.course] || co().blank); $('.edw').append(ed.node);
  ed.ta.addEventListener('input', () => { S.play[S.course] = ed.value; save(); });
  $('.reset').onclick = () => { ed.set(co().blank); delete S.play[S.course]; save(); };
  $('.run').onclick = async () => {
    const out = $('.out'); out.innerHTML = '<span class="muted">' + W().busy + waitNote() + '</span>';
    const r = await runCode(ed.value, [$('#stdin').value]);
    if (r.offline) { out.innerHTML = offMsg(); return; } if (r.noCompiler) { out.innerHTML = noccMsg(); return; }
    let h = r.compile.output ? `<div class="lbl">${r.compile.ok ? '⚠️ Warnings' : '❌ ' + W().says}</div><pre${wrapOf() ? ' class="err"' : ''}>${esc(r.compile.output)}</pre>` : '';
    if (r.compile.ok) { const x = r.runs[0]; h += `<div class="lbl">Output</div><pre>${esc(x.stdout) || '(no output)'}</pre>${errBox(x) || (wrapOf() ? '<span class="muted">✓ finished</span>' : `<span class="muted">exit code ${x.code}</span>`)}`; }
    out.innerHTML = h;
  };
}

function vGlossary() {
  const gp = 'g:' + S.course + ':';
  view.innerHTML = `<div class="page"><h1>📖 Glossary · ${esc(co().name)}</h1><p class="lead">Every term in the ${esc(co().name)} course in one plain-English sentence. 🔖 the ones that will not stick.</p><input class="search" placeholder="Search… (try “${esc(co().glossTry)}”)" autofocus><div id="gl"></div></div>`;
  const draw = f => {
    $('#gl').innerHTML = co().glossary.filter(g => (g.term + ' ' + g.def).toLowerCase().includes(f)).sort((a, b) => a.term.localeCompare(b.term))
      .map(g => `<div class="item gl"><button class="bm${S.bookmarks[gp + g.term] ? ' on' : ''}" data-t="${esc(g.term)}">🔖</button><div><b>${esc(g.term)}</b><div>${inl(g.def)}</div></div></div>`).join('') || '<p class="muted">No match.</p>';
    $$('#gl .bm').forEach(b => { b.onclick = () => { const k = gp + b.dataset.t; if (S.bookmarks[k]) delete S.bookmarks[k]; else S.bookmarks[k] = { at: Date.now(), note: '' }; b.classList.toggle('on'); checkAch(); }; });
  };
  $('.search').oninput = e => draw(e.target.value.toLowerCase()); draw('');
}

/* ---------- Connections: sixteen tiles hide four groups of four (puzzles live in connections.js) ---------- */
const PUZZLES = window.CONNECTIONS || [];
const CN_SQUARE = ['🟨', '🟩', '🟦', '🟪'], CN_LIVES = 4;
const wait = ms => new Promise(r => setTimeout(r, ms));
/* Slide tiles from where they were to where they are now (used for shuffling and for a found group moving up). */
function slideTiles(box, change) {
  const before = new Map($$('.cn-tile', box).map(e => [e.dataset.t, e.getBoundingClientRect()]));
  change();
  $$('.cn-tile', box).forEach(e => {
    const a = before.get(e.dataset.t); if (!a) return;
    const b = e.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
    if (!dx && !dy) return;
    e.style.transition = 'none'; e.style.transform = `translate(${dx}px,${dy}px)`;
    void e.offsetWidth;
    e.style.transition = 'transform .45s cubic-bezier(.3,.7,.3,1)'; e.style.transform = '';
  });
}
const cnStatus = id => { const r = S.connect[id]; return !r ? ['new', 'Not played yet'] : r.won ? ['won', r.mistakes ? `Solved · ${r.mistakes} mistake${r.mistakes > 1 ? 's' : ''}` : 'Solved · perfect!'] : ['lost', 'Not solved — try again']; };
function vConnectList() {
  const won = PUZZLES.filter(p => S.connect[p.id] && S.connect[p.id].won).length;
  view.innerHTML = `<div class="page"><h1>🧩 Connections</h1><p class="lead">Sixteen tiles, four hidden groups of four. Keywords, symbols and trivia from the most popular programming languages — you will meet a few you have not learned yet. ${won} of ${PUZZLES.length} solved.</p>
    <div class="cn-list">${PUZZLES.map((p, i) => { const [k, label] = cnStatus(p.id); return `<a class="cn-card ${k}" href="#/connect/${p.id}"><span class="cn-num">${k === 'won' ? '✓' : i + 1}</span><span><b>${esc(p.name)}</b><small>${label}</small></span></a>`; }).join('')}</div>
    <div class="card" style="margin-top:20px"><h3>How to play</h3><p class="muted" style="margin:0">Tap four tiles you think belong together, then press <b>Submit</b>. Groups are coloured by difficulty: 🟨 easiest, then 🟩, 🟦, and 🟪 trickiest. You can make four mistakes. Watch out: some tiles look like they fit in more than one group.</p></div></div>`;
}
function vConnect(id) {
  const pz = PUZZLES.find(p => p.id === id);
  if (!pz) { location.hash = '#/connect'; return; }
  const idx = PUZZLES.indexOf(pz), nextPz = PUZZLES.slice(idx + 1).concat(PUZZLES.slice(0, idx)).find(p => !(S.connect[p.id] && S.connect[p.id].won));
  let left, solved, sel, lives, guesses, tried, busy, over, result;
  const start = () => { left = shuffle(pz.groups.flatMap((g, gi) => g.items.map(t => ({ t, g: gi })))); solved = []; sel = new Set(); lives = CN_LIVES; guesses = []; tried = new Set(); busy = false; over = false; result = null; };
  start();
  const saved = S.connect[id];
  if (saved && saved.won) { left = []; solved = [0, 1, 2, 3]; over = true; lives = CN_LIVES - saved.mistakes; guesses = saved.guesses || []; result = { won: true, replayed: true }; }   // already solved: show the answers

  view.innerHTML = `<div class="cn"><a class="back" href="#/connect">← All puzzles</a><h1>🧩 ${esc(pz.name)}</h1><p class="cn-sub">Create four groups of four!</p><div class="cn-board"></div><div class="cn-lives"></div><div class="cn-btns"></div><div class="cn-result"></div></div>`;
  const board = $('.cn-board'), tileEl = t => $$('.cn-tile', board).find(e => e.dataset.t === t);
  const size = t => (t.length > 16 ? ' xs' : t.length > 11 ? ' sm' : '');

  function draw() {
    board.innerHTML = solved.map(gi => { const g = pz.groups[gi]; return `<div class="cn-group l${gi}"><b>${esc(g.title)}</b><span>${g.items.map(esc).join(', ')}</span><small>${esc(g.note)}</small></div>`; }).join('')
      + `<div class="cn-grid">${left.map(x => `<button class="cn-tile${size(x.t)}${sel.has(x.t) ? ' sel' : ''}" data-t="${esc(x.t)}">${esc(x.t)}</button>`).join('')}</div>`;
    $$('.cn-tile', board).forEach(b => { b.onclick = () => {
      if (busy || over) return;
      const t = b.dataset.t;
      if (sel.has(t)) sel.delete(t); else if (sel.size < 4) sel.add(t); else return;
      b.classList.toggle('sel', sel.has(t)); controls();
    }; });
    controls();
  }
  function controls() {
    $('.cn-lives').innerHTML = over ? '' : `Mistakes remaining: ${Array.from({ length: CN_LIVES }, (_, i) => `<i class="${i < lives ? '' : 'gone'}"></i>`).join('')}`;
    $('.cn-btns').innerHTML = over ? '' : `<button class="btn ghost" id="cn-shuffle">Shuffle</button><button class="btn ghost" id="cn-clear"${sel.size ? '' : ' disabled'}>Deselect all</button><button class="btn primary" id="cn-submit"${sel.size === 4 ? '' : ' disabled'}>Submit</button>`;
    if (over) return showResult();
    $('#cn-shuffle').onclick = () => { if (!busy) slideTiles(board, () => { left = shuffle(left); draw(); }); };
    $('#cn-clear').onclick = () => { if (!busy) { sel.clear(); draw(); } };
    $('#cn-submit').onclick = submit;
  }
  async function found(gi) {                       // the four tiles slide to the top row, then merge into a coloured bar
    slideTiles(board, () => { left = left.filter(x => x.g === gi).concat(left.filter(x => x.g !== gi)); draw(); });
    await wait(480);
    left = left.filter(x => x.g !== gi); solved.push(gi); sel.clear(); draw();
    await wait(380);
  }
  async function submit() {
    if (busy || over || sel.size !== 4) return;
    const pick = left.filter(x => sel.has(x.t)), key = pick.map(x => x.t).sort().join('|');
    if (tried.has(key)) { toast('Already guessed!'); return; }
    busy = true; tried.add(key);
    const els = pick.map(x => tileEl(x.t));
    els.forEach((e, i) => { e.style.animation = `cn-hop .34s ${i * 90}ms`; });      // the little hop, one tile after another
    await wait(340 + 3 * 90 + 120);
    els.forEach(e => { e.style.animation = ''; });
    const counts = [0, 0, 0, 0]; pick.forEach(x => counts[x.g]++);
    const gi = counts.indexOf(4);
    guesses.push(pick.map(x => x.g));
    if (gi >= 0) {
      beep([660, 880]);
      await found(gi);
      if (!left.length) finish(true);
    } else {
      lives--; beep([200, 150]);
      els.forEach(e => e.classList.add('cn-shake'));
      if (Math.max(...counts) === 3) toast('One away…');
      controls();
      await wait(450);
      els.forEach(e => e.classList.remove('cn-shake'));
      if (lives <= 0) {                             // out of guesses: reveal what was left, easiest first
        sel.clear(); draw();
        for (const g of [0, 1, 2, 3].filter(g => !solved.includes(g))) { left.forEach(x => { if (x.g === g) sel.add(x.t); }); draw(); await wait(350); await found(g); }
        finish(false);
      }
    }
    busy = false;
  }
  function finish(won) {
    over = true;
    const mistakes = CN_LIVES - lives, before = S.connect[id], firstWin = won && !(before && before.won);
    const xp = firstWin ? 10 + (mistakes ? 0 : 5) : before ? 0 : 2;
    if (!before || firstWin) S.connect[id] = { won, mistakes, guesses, at: Date.now() };
    let fresh = [];
    if (xp) fresh = award(xp); else { fresh = checkAch(); }
    if (won) { beep([523, 659, 784, 1047], .13); confetti(); }
    result = { won, mistakes, xp, fresh };
    controls();
  }
  function showResult() {
    const r = result, grid = guesses.map(row => row.map(g => CN_SQUARE[g]).join('')).join('<br>');
    const title = r.replayed ? 'Already solved' : !r.won ? 'Next time!' : r.mistakes ? 'Solved!' : 'Perfect!';
    const sub = r.replayed ? 'Here are the groups again.' : !r.won ? 'The groups are shown above. Have another go — it is the only way to win it.' : r.mistakes ? `With ${r.mistakes} mistake${r.mistakes > 1 ? 's' : ''}.` : 'Not a single mistake.';
    $('.cn-result').innerHTML = `<div class="card"><h2>${title}</h2><p class="muted">${sub}</p>${grid ? `<div class="cn-squares">${grid}</div>` : ''}${r.xp ? `<p><b>⚡ +${r.xp} XP</b></p>` : ''}${(r.fresh || []).map(a => `<p class="toast" style="display:inline-block">${a[1]} Achievement unlocked: <b>${a[2]}</b></p>`).join('')}
      <div class="cn-btns">${r.won ? '' : '<button class="btn" id="cn-again">Try again</button>'}${nextPz ? `<a class="btn primary" href="#/connect/${nextPz.id}">Next puzzle</a>` : ''}<a class="btn ghost" href="#/connect">All puzzles</a>${r.won ? '<button class="btn ghost" id="cn-again">Play again</button>' : ''}</div></div>`;
    $('#cn-again').onclick = () => { start(); $('.cn-result').innerHTML = ''; draw(); };
  }
  draw();
}

/* ---------- leaderboard ---------- */
const STALE_MS = 2 * 86400000;      // no save for 2 days = the streak has lapsed
const boardStreak = e => (Date.now() - e.updatedAtMs > STALE_MS ? 0 : e.streak);
const nameError = 'Nicknames are 3–20 characters: letters, numbers, spaces, _ . - (starting and ending with a letter or number).';
async function boardWrite(btn, label, work) {
  const wait = Cloud.boardWait();
  btn.disabled = true; btn.textContent = wait > 1000 ? `${label}… (about ${Math.ceil(wait / 1000)} s — one change a minute)` : label + '…';
  try { await work(); return true; }
  catch (err) { toast(err.message === 'bad-name' ? nameError : 'Could not update the leaderboard (' + esc(err.code || err.message) + '). Try again in a minute.', 6000); return false; }
  finally { if (btn.isConnected) btn.disabled = false; }
}
function joinCard(e) {
  return `<div class="card lb-join"><h3>${e ? 'Rejoin the leaderboard' : 'Join the leaderboard'}</h3>
    <p class="muted" style="margin-top:0">Pick a nickname — your Google name is never shown. Other signed-in learners will see your nickname, XP and streak. You can rename or leave any time in Profile.</p>
    <div class="row" style="flex-wrap:wrap"><input class="field" id="lbname" maxlength="20" placeholder="Nickname, e.g. PointerPro" value="${esc(e ? e.name : '')}" style="margin:0;flex:1;min-width:200px" autocomplete="off" spellcheck="false"><button class="btn primary" id="lbjoin">${e ? 'Rejoin' : 'Join'}</button></div></div>`;
}
async function vBoard() {
  const C = window.Cloud;
  view.innerHTML = '<div class="page"><h1>🏆 Leaderboard</h1><p class="lead">The learners with the most XP, all time. 🔥 is each person\'s current daily streak.</p><div id="lb"></div></div>';
  const box = $('#lb');
  if (!C || !C.enabled) { box.innerHTML = '<div class="card muted">The leaderboard needs accounts, which are not switched on for this copy of the site.</div>'; return; }
  if (!C.user) { box.innerHTML = '<div class="card"><p style="margin-top:0"><b>Sign in to see the leaderboard</b> and compete for the top spot. Joining is optional, and you choose the nickname people see.</p><button class="btn primary" id="lbsign">Sign in with Google</button></div>'; $('#lbsign').onclick = signIn; return; }
  const me = C.board.entry, joined = !!(me && me.visible);
  box.innerHTML = (joined ? '' : joinCard(me)) + '<div class="card lb" id="lbt"><span class="muted">Loading the leaderboard…</span></div>';
  if (!joined) {
    const inp = $('#lbname'), btn = $('#lbjoin');
    const go = async () => {
      if (!C.isValidName(C.cleanName(inp.value))) { toast(nameError, 6000); inp.focus(); return; }
      if (await boardWrite(btn, me ? 'Rejoining' : 'Joining', () => C.joinBoard(inp.value, S))) toast('🏆 You\'re on the leaderboard!');
    };
    btn.onclick = go; inp.onkeydown = ev => { if (ev.key === 'Enter') go(); };
  }
  let rows;
  try { rows = await C.topBoard(); }
  catch (err) {
    if (!box.isConnected) return;
    $('#lbt').innerHTML = `<span class="muted">Could not load the leaderboard (${esc(err.code || 'network')}).${err.code === 'failed-precondition' ? ' The database index has not been created yet — see “Changing the security rules” in SETUP.md.' : ' Check your connection and try again.'}</span>`;
    return;
  }
  if (!box.isConnected) return;
  if (joined) {                                       // show my own freshest numbers
    const i = rows.findIndex(r => r.uid === C.user.uid);
    if (i >= 0) rows[i] = { ...rows[i], ...me }; else if (rows.length < 25 || me.xp > rows[rows.length - 1].xp) rows.push({ uid: C.user.uid, ...me });
    rows.sort((a, b) => b.xp - a.xp); rows = rows.slice(0, 25);
  }
  if (!rows.length) { $('#lbt').innerHTML = '<span class="muted">Nobody has joined yet. Be the first!</span>'; return; }
  const medal = ['🥇', '🥈', '🥉'];
  let rank = 0, prev = null;
  const html = rows.map((r, i) => {
    if (r.xp !== prev) { rank = i + 1; prev = r.xp; }               // ties share a rank
    const mine = r.uid === C.user.uid, st = boardStreak(r);
    return `<div class="lb-row${mine ? ' me' : ''}${rank <= 3 ? ' top' : ''}"><span class="lb-rank">${medal[rank - 1] || '#' + rank}</span><span class="lb-name">${esc(r.name)}${mine ? ' <em>you</em>' : ''}</span><span class="lb-streak${st ? '' : ' cold'}" title="Current daily streak">🔥 ${st}</span><span class="lb-xp">⚡ ${r.xp.toLocaleString()}</span></div>`;
  }).join('');
  let foot = '';
  if (joined) {
    const i = rows.findIndex(r => r.uid === C.user.uid);
    if (i > 0) { const above = rows.slice(0, i).reverse().find(r => r.xp > me.xp); if (above) foot += `<p class="lb-nudge">⚡ <b>${(above.xp - me.xp + 1).toLocaleString()} XP</b> to overtake ${esc(above.name)}</p>`; }
    else if (i === 0) foot += '<p class="lb-nudge">👑 You\'re in first place. Defend it!</p>';
    if (S.xp > me.xp) foot += `<p class="muted">Your leaderboard XP updates about once a minute and adds at most 600 XP a day — ${(S.xp - me.xp).toLocaleString()} XP still to add.</p>`;
  }
  $('#lbt').innerHTML = html + foot;
  if (joined && !rows.some(r => r.uid === C.user.uid)) {
    try { const k = await C.boardRank(me.xp); if (box.isConnected) $('#lbt').insertAdjacentHTML('beforeend', `<p class="lb-nudge">You're <b>#${k.rank}</b> of ${k.total} — ${(rows[rows.length - 1].xp - me.xp + 1).toLocaleString()} XP to reach the top 25.</p>`); }
    catch (err) { console.warn('rank lookup failed', err); }
  }
}
function boardSettings() {
  const C = window.Cloud, e = C.board.entry;
  if (e && e.visible) return `<div class="card row lb-set" style="justify-content:space-between;flex-wrap:wrap;margin-top:12px"><div>🏆 On the leaderboard as <b>${esc(e.name)}</b><br><span class="muted">Shown to signed-in learners: nickname, XP and streak.</span></div><span><button class="btn sm" id="lbren">Rename</button> <button class="btn sm ghost" id="lbleave">Leave</button></span></div>`;
  return `<div class="card row lb-set" style="justify-content:space-between;flex-wrap:wrap;margin-top:12px"><div>🏆 You're not on the leaderboard.<br><span class="muted">Join with a nickname to compete on XP.</span></div><a class="btn sm" href="#/board">${e ? 'Rejoin' : 'Join'}</a></div>`;
}
function wireBoardSettings() {
  if ($('#lbren')) $('#lbren').onclick = async e => {
    const n = prompt('New nickname (3–20 characters):', Cloud.board.entry.name);
    if (n == null || Cloud.cleanName(n) === Cloud.board.entry.name) return;
    if (!Cloud.isValidName(Cloud.cleanName(n))) { toast(nameError, 6000); return; }
    if (await boardWrite(e.target, 'Renaming', () => Cloud.renameBoard(n))) toast('Renamed to ' + esc(Cloud.cleanName(n)));
  };
  if ($('#lbleave')) $('#lbleave').onclick = async e => {
    if (!confirm('Leave the leaderboard? Your entry will be hidden from everyone. You can rejoin later.')) return;
    if (await boardWrite(e.target, 'Leaving', () => Cloud.leaveBoard())) toast('You have left the leaderboard.');
  };
}

function accountCard() {
  const C = window.Cloud;
  if (!C || !C.enabled) return LOCAL ? '<h2 class="sec">Account</h2><div class="card"><span class="muted">Accounts are not switched on yet. Follow <code>SETUP.md</code> to connect Firebase — until then progress stays in this browser.</span></div>' : '';
  if (C.user) return `<h2 class="sec">Account</h2><div class="card row" style="justify-content:space-between;flex-wrap:wrap"><div><b>${esc(C.user.displayName || 'Signed in')}</b><br><span class="muted">${esc(C.user.email || '')} · progress syncs to this account</span></div><button class="btn sm" id="signout">Sign out</button></div>${boardSettings()}`;
  return '<h2 class="sec">Account</h2><div class="card"><p style="margin-top:0"><b>Sign in to keep your progress.</b> Your XP, streak, bookmarks and mistake pile are saved to your account and follow you to any device.</p><button class="btn primary" id="signin">Sign in with Google</button><p class="muted" style="margin-bottom:0;font-size:13px">What is stored: your Google name and email address (for signing in) and your course progress. Nothing else.</p></div>';
}
function vMe() {
  const doneN = co().lessons.filter(l => S.done[l.gid]).length;
  let cal = '';
  for (let i = 34; i >= 0; i--) { const d = daysAgo(i), xp = S.days[dayKey(d)] || 0; cal += `<span class="${xp >= S.goal ? 'a2' : xp ? 'a1' : ''}${i === 0 ? ' today' : ''}" title="${dayKey(d)}: ${xp} XP">${d.getDate()}</span>`; }
  view.innerHTML = `<div class="page"><h1>🏅 ${levelName()}</h1><p class="lead">Level ${level()} · ${120 - S.xp % 120} XP to the next level</p>
  <div class="tiles" style="justify-content:flex-start"><div class="tile"><small>Total XP</small><b>⚡ ${S.xp}</b></div><div class="tile"><small>Streak</small><b>🔥 ${liveStreak()}</b></div><div class="tile"><small>Best streak</small><b>🏔️ ${S.best}</b></div><div class="tile"><small>${esc(co().name)} lessons</small><b>📚 ${doneN}/${co().lessons.length}</b></div><div class="tile"><small>Code challenges</small><b>⌨️ ${count(S.solved)}</b></div></div>
  <h2 class="sec">My courses</h2>${courseCards()}
  <h2 class="sec">Last 5 weeks</h2><div class="cal">${cal}</div><p class="muted">Light green = you practised. Bright green = you hit your daily goal.</p>
  <h2 class="sec">Achievements (${count(S.ach)}/${ACH.length})</h2><div class="grid">${ACH.map(a => `<div class="ach${S.ach[a[0]] ? '' : ' off'}"><i>${a[1]}</i><b>${a[2]}</b><small>${a[3]}</small></div>`).join('')}</div>
  ${accountCard()}<h2 class="sec">Settings</h2><div class="card settings">
    <label>Daily XP goal <select id="goal">${[[15, 'Casual — 15'], [30, 'Regular — 30'], [50, 'Serious — 50'], [80, 'Insane — 80']].map(g => `<option value="${g[0]}"${S.goal === g[0] ? ' selected' : ''}>${g[1]}</option>`).join('')}</select></label>
    ${hasTracks(S.course) ? `<label>Starting point for ${esc(co().name)} — ${TRACKS[trackOf(S.course)][1].toLowerCase()} <a class="btn sm" href="#/start/${S.course}">Change</a></label>` : ''}
    <label>Appearance <select id="thm">${[['system', 'Match my device'], ['light', 'Light'], ['dark', 'Dark']].map(o => `<option value="${o[0]}"${themeChoice() === o[0] ? ' selected' : ''}>${o[1]}</option>`).join('')}</select></label>
    <label>Sound effects <input type="checkbox" id="snd"${S.sound ? ' checked' : ''}></label>
    <label>Unlock everything (skip the lesson order) <input type="checkbox" id="unl"${S.unlockAll ? ' checked' : ''}></label>
    <label>Back up or move your progress <span><button class="btn sm" id="exp">Export</button> <button class="btn sm" id="imp">Import</button></span></label>
    <label>Start over <button class="btn sm danger" id="rst">Reset all progress</button></label>
  </div><p class="muted">${window.Cloud && Cloud.user ? 'Progress is saved to your account.' : 'Progress is stored in this browser only.'}</p></div>`;
  if ($('#signin')) $('#signin').onclick = signIn;
  if ($('#signout')) $('#signout').onclick = () => Cloud.signOut();
  wireBoardSettings(); wireCourseCards();
  $('#goal').onchange = e => { S.goal = +e.target.value; save(); };
  $('#thm').onchange = e => setTheme(e.target.value);
  $('#snd').onchange = e => { S.sound = e.target.checked; save(); };
  $('#unl').onchange = e => { S.unlockAll = e.target.checked; save(); };
  $('#exp').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = 'code-quest-progress.json'; a.click(); };
  $('#imp').onclick = () => { const f = document.createElement('input'); f.type = 'file'; f.accept = '.json'; f.onchange = async () => { try { const was = S.course; S = Object.assign(upgrade(JSON.parse(await f.files[0].text())), { owner: S.owner }); if (!S.course) S.course = was; save(); toast('Progress imported'); vMe(); } catch { toast('That file is not a Code Quest backup'); } }; f.click(); };
  $('#rst').onclick = () => { if (confirm('Delete ALL progress, bookmarks and streaks? This cannot be undone.')) { S = Object.assign(structuredClone(DEF), { owner: S.owner, course: S.course, start: S.start }); save(); vMe(); } };
}

/* ---------- courses: the language switcher ---------- */
function courseStats(cid) {
  const c = COURSES[cid], d = doneIn(S, cid);
  return { c, d, n: c.lessons.length, xp: S.cxp[cid] || 0, pct: d / c.lessons.length * 100 };
}
function courseCards() {
  return `<div class="courses">${CIDS.map(cid => { const { c, d, n, xp, pct } = courseStats(cid), on = S.course === cid;
    return `<button class="course-card${on ? ' on' : ''}" data-c="${cid}" style="--cc:${c.color}">${badge(c, true)}<span class="cc-body"><b>${esc(c.name)}</b><span class="muted">${esc(c.tagline)}</span><span class="pbar"><i style="width:${pct}%"></i></span><small>${hasTracks(cid) && S.start[cid] ? TRACKS[S.start[cid]].join(' ') + ' · ' : ''}${d} of ${n} lessons · ⚡ ${xp} XP${d === n ? ' · 👑 complete' : ''}${c.preview ? ' · 🚧 first topic, more coming' : ''}</small></span><span class="cc-go">${on ? '✓ Learning' : d ? 'Continue' : 'Start'}</span></button>`; }).join('')}</div>`;
}
/* choosing a course: the first time, ask where to start */
function pickCourse(cid) {
  if (!hasTracks(cid)) S.start[cid] = 'new';                       // one path: nothing to ask
  if (!S.start[cid]) { location.hash = '#/start/' + cid; return; }
  setCourse(cid);
  if (location.hash.replace(/^#\/?/, '') === '') route(); else location.hash = '#/';
}
function wireCourseCards() {
  $$('.course-card[data-c]').forEach(b => { b.onclick = () => pickCourse(b.dataset.c); });
}
/* ---------- welcome: what a first-time visitor sees until they pick a language ---------- */
const GUIDE = [          // "Don't know which language is for you?"
  ['py', '🌱', 'I have never written code before', 'Start with Python. It reads almost like English, so you can focus on ideas instead of punctuation.'],
  ['c', '⚙️', 'I want to understand how computers really work', 'Start with C. It is small and close to the machine: memory, pointers, the lot. Every other language makes more sense afterwards.'],
  ['cpp', '🎮', 'I want to make fast games or software', 'Start with C++. It powers game engines like Unreal, browsers and anything that has to be quick.'],
  ['sql', '🗄️', 'I want to work with data', 'Start with SQL. It is how almost every app, website and business stores and searches its data — and it is quick to learn.'],
  ['js', '🌐', 'I want to build websites', 'Start with JavaScript. It is the language every web page runs, and you can see results quickly.'],
  ['java', '☕', 'I am studying Java, or want to build Android apps', 'Start with Java. It is widely taught at school and university and used by big companies everywhere.'],
  ['cs', '🕹️', 'I want to build Unity games or Windows apps', 'Start with C#. It is the language of Unity, with a friendlier feel than C or C++.'],
];
function vWelcome() {
  document.body.classList.add('landing');
  const C = window.Cloud, canSignIn = !!(C && C.enabled);
  const account = !canSignIn ? ''
    : C.user ? `<div class="wl-account done">✓ Signed in as <b>${esc(C.user.displayName || C.user.email || 'you')}</b> — your progress will be saved to your account.</div>`
    : S.later ? '<div class="wl-account done">No problem — you can sign in any time from <b>Profile</b>. Until then, progress is saved in this browser.</div>'
    : `<div class="wl-account"><div><b>Already have an account, or want to save your progress?</b><span class="muted">Log in with Google to keep your XP and streak on any device. It is free and optional.</span></div><span class="wl-btns"><button class="btn primary" id="wl-login">Log in now</button><button class="btn ghost" id="wl-later">Maybe later</button></span></div>`;
  view.innerHTML = `<div class="welcome"><button class="stat wl-theme" id="wl-theme"></button>
    <div class="wl-hero"><img class="wl-logo" src="logos/code-quest.svg" alt=""><h1>Welcome to Code Quest!</h1><p class="lead">Learn to code by doing: bite-sized lessons, real code you run yourself, and a streak to keep you coming back.</p></div>
    ${account}
    <h2 class="wl-h">Choose a language!</h2>
    ${courseCards()}
    <details class="wl-guide"><summary>🤔 Don't know which language is for you?</summary>
      <p class="muted">Pick the line that sounds most like you. You can switch or learn more than one later, and your XP and streak carry across.</p>
      ${GUIDE.filter(g => COURSES[g[0]]).map(([cid, icon, who, why]) => `<button class="wl-pick" data-c="${cid}" style="--cc:${COURSES[cid].color}"><i>${icon}</i><span><b>${who}</b><span class="muted">${why}</span></span><em>Start ${esc(COURSES[cid].name)} →</em></button>`).join('')}
    </details></div>`;
  wireCourseCards();
  $$('.wl-pick').forEach(b => { b.onclick = () => pickCourse(b.dataset.c); });
  if ($('#wl-login')) $('#wl-login').onclick = signIn;
  $('#wl-theme').onclick = flipTheme; applyTheme();
  if ($('#wl-later')) $('#wl-later').onclick = () => { S.later = true; save(); vWelcome(); };
}
function vCourses() {
  const started = CIDS.filter(c => hasTracks(c) && S.start[c]);
  view.innerHTML = `<div class="page"><h1>🌍 I want to learn…</h1><p class="lead">Pick a language to start with. Every course begins at the very first line of code — and if you already know some C, the C++ and C# courses can skip straight to what is <b>different</b>.</p>${courseCards()}${started.length ? `<p style="margin-top:14px">${started.map(c => `<a href="#/start/${c}">Change where ${esc(COURSES[c].name)} starts</a>`).join(' · ')}</p>` : ''}<p class="muted" style="margin-top:14px">You can learn more than one. Switch any time with the language button at the top of the page. Lessons, quizzes, bookmarks and mistakes are kept separately for each language; your XP, streak and achievements are shared.</p></div>`;
  wireCourseCards();
}
function vStart(cid) {
  const c = COURSES[cid];
  if (!c) { location.hash = '#/courses'; return; }
  if (!hasTracks(cid)) { pickCourse(cid); return; }
  const cur = S.start[cid], n = tr => onTrack(cid, tr).reduce((a, t) => a + t.lessons.length, 0);
  const card = (tr, col, title, text) => `<button class="course-card${cur === tr ? ' on' : ''}" data-t="${tr}" style="--cc:${col}"><span class="cbadge big" style="background:${col}">${TRACKS[tr][0]}</span><span class="cc-body"><b>${title}</b><span class="muted">${text}</span><small>${TRACKS[tr][1]} · ${n(tr)} lessons</small></span><span class="cc-go">${cur === tr ? '✓ Current' : 'Start here'}</span></button>`;
  view.innerHTML = `<div class="page"><a class="back" href="#/courses">← All courses</a><h1 style="margin-top:10px">${badge(c)} How much do you already know?</h1><p class="lead">Pick where your ${esc(c.name)} path begins. You can change this later without losing any progress.</p><div class="courses">${
    card('new', '#58cc02', 'I\'m new to programming', `Start from the very first line of code: printing, variables, input, decisions, loops, functions and arrays. Then carry on into the rest of ${esc(c.name)}.`)}${
    card('c', c.color, 'I already know some C', `For example, you finished the C course here. Skips the basics and opens with what ${esc(c.name)} does differently from C.`)}</div></div>`;
  $$('.course-card[data-t]').forEach(b => { b.onclick = () => {
    S.start[cid] = b.dataset.t; S.course = cid; save();
    toast(`${TRACKS[b.dataset.t][0]} <b>${esc(c.name)}</b> — ${TRACKS[b.dataset.t][1].toLowerCase()}`);
    location.hash = '#/';
  }; });
}
function closeMenu() { const m = $('.cmenu'); if (m) m.remove(); }
$('#st-course').onclick = e => {
  e.stopPropagation();
  if ($('.cmenu')) return closeMenu();
  const m = el(`<div class="cmenu"><div class="cmenu-h">My courses</div>${CIDS.map(cid => { const { c, d, n } = courseStats(cid);
    return `<button data-c="${cid}" class="${S.course === cid ? 'on' : ''}">${badge(c)}<span><b>${esc(c.name)}</b><small>${d}/${n} lessons</small></span><i>${S.course === cid ? '✓' : ''}</i></button>`; }).join('')}<a href="#/courses">All courses →</a></div>`);
  $('#top').append(m);
  $$('button', m).forEach(b => { b.onclick = () => { closeMenu(); if (b.dataset.c !== S.course) pickCourse(b.dataset.c); }; });
  $('a', m).onclick = closeMenu;
};
document.addEventListener('click', e => { if (!e.target.closest('.cmenu')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ---------- router ---------- */
function route() {
  keyHandler = null; closeMenu(); document.body.classList.remove('in-session', 'landing'); window.scrollTo(0, 0);
  const p = location.hash.replace(/^#\/?/, '').split('/'), r = p[0] || 'home';
  $$('#nav a[data-r]').forEach(a => a.classList.toggle('on', a.dataset.r === (['lesson', 'quiz'].includes(r) ? 'home' : r === 'review' ? 'bookmarks' : r)));
  if (!S.course && !['lesson', 'quiz', 'review', 'start'].includes(r)) { hud(); return vWelcome(); }      // first visit: welcome + pick a language
  if (r === 'lesson') vLesson(p.slice(1).join('/'));
  else if (r === 'quiz') vQuiz(p.slice(1).join('/'));
  else if (r === 'courses') vCourses();
  else if (r === 'start') vStart(p[1]);
  else if (r === 'practice') vPractice();
  else if (r === 'bookmarks') vBookmarks();
  else if (r === 'review') vReview(p.slice(1).join('/'));
  else if (r === 'play') vPlay();
  else if (r === 'glossary') vGlossary();
  else if (r === 'me') vMe();
  else if (r === 'board') vBoard();
  else if (r === 'connect') { if (p[1]) vConnect(p[1]); else vConnectList(); }
  else vHome();
  hud();
}
window.addEventListener('hashchange', route);
window.addEventListener('board-change', () => { if (/^#\/(board|me)\b/.test(location.hash) && !document.querySelector('#lbname:focus')) route(); });
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
    if (remote && (remote.xp || 0) >= S.xp) { const was = S.course; S = upgrade(remote); if (!S.course) S.course = was; }   // else keep (and upload) what was earned as a guest
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
