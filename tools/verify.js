// Checks every exercise in every course against the real compiler or interpreter on this machine.
//
//  C (gcc), C++ (g++) and Python:
//   - code challenges: the reference solution must pass its own tests, and the starter code must not
//   - predict-the-output: the stated output must be exactly what the program prints
//   - fill-the-blanks / ordering: the completed code must compile (Python: must be valid syntax)
//  C# (no local compiler - it only runs on the online compiler): structure checks only.
//   Its exercises are run for real by public/verify-cs.js, from the browser.
//
// Usage: node tools/verify.js [courseId] [topicId]        e.g.  node tools/verify.js py loops
const fs = require('fs'), path = require('path'), vm = require('vm');
const { run, findTool } = require('../runner');
const SqlRun = require('../public/sqlrun.js');
let sqlEngine = null;                                   // sql.js (real SQLite), loaded the first time it is needed
const getSql = () => sqlEngine || (sqlEngine = require('sql.js')());
let SQLSETUP = '';                                      // the dataset of the step being checked (SQL course only)

const dir = path.join(__dirname, '..', 'public', 'content');
const ctx = vm.createContext({ console }); ctx.window = ctx;
for (const f of fs.readdirSync(dir).sort()) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
const COURSES = ctx.COURSES, [onlyCourse, onlyTopic] = process.argv.slice(2);

const incs = list => list.map(h => `#include <${h}>`).join('\n') + '\n';
/* How each language turns a loose snippet (a few statements) into something that can be compiled. */
const LANG = {
  c: {
    tool: 'gcc', comments: /\/\/.*|\/\*[\s\S]*?\*\//g, warnings: true,
    incs: incs(['stdio.h', 'stdlib.h', 'string.h', 'stdbool.h', 'math.h', 'time.h', 'ctype.h']),
    wrap(code) { return /\bmain\s*\(/.test(code) ? (code.includes('#include') ? code : this.incs + code) : this.incs + 'int main(void){\n' + code + '\n;return 0;}\n'; },
  },
  cpp: {
    tool: 'g++', comments: /\/\/.*|\/\*[\s\S]*?\*\//g, warnings: true,
    incs: incs(['iostream', 'string', 'vector', 'map', 'algorithm', 'memory', 'stdexcept', 'cmath']),
    wrap(code) { return /\bmain\s*\(/.test(code) ? (code.includes('#include') ? code : this.incs + code) : this.incs + 'int main(){\n' + code + '\n;return 0;}\n'; },
    // a snippet that defines functions or templates cannot sit inside main: try it at file level instead
    fileLevel(code) { return /\bmain\s*\(/.test(code) ? null : this.incs + code + '\nint main() { return 0; }\n'; },
  },
  py: { tool: 'Python', comments: /#.*/g, wrap: code => code, syntaxOnly: true },
  sql: { tool: 'SQLite', comments: /--.*|\/\*[\s\S]*?\*\//g },
  js: { tool: 'Node.js', comments: /\/\/.*|\/\*[\s\S]*?\*\//g, wrap: code => code, syntaxOnly: true },
  java: {
    tool: 'java', comments: /\/\/.*|\/\*[\s\S]*?\*\//g,
    wrap(code) { return /\bclass\s+\w+/.test(code) ? code : 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n' + code + '\n    }\n}\n'; },
    // a snippet that defines methods cannot sit inside main: try it at class level instead
    fileLevel(code) { return /\bclass\s+\w+/.test(code) ? null : 'import java.util.*;\npublic class Main {\n' + code + '\n    public static void main(String[] args) {}\n}\n'; },
  },
  cs: { tool: 'the online compiler', comments: /\/\/.*|\/\*[\s\S]*?\*\//g },
};
const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();
const passes = (x, t) => { const o = norm(x.stdout); return !x.timedOut && x.code === 0 && (t.out == null || o === norm(t.out)) && (!t.has || t.has.every(v => o.includes(v))) && (!t.re || new RegExp(t.re).test(o)); };

const jobs = [], problems = [];
let skipped = 0;
const bad = (where, msg) => problems.push(`✗ ${where}: ${msg}`);

/* SQL: every exercise runs on a fresh copy of its dataset, exactly as in the browser */
function addSql(where, s, setup) {
  const L = LANG.sql, tidy = v => norm(v).replace(/[ \t]*\|[ \t]*/g, ' | ');
  const go = async (code, check) => SqlRun.runSql(await getSql(), setup, code, check);
  if (s.t === 'mcq') { if (!(s.ans >= 0 && s.ans < s.opts.length)) bad(where, 'answer index out of range'); return; }
  if (s.t === 'info') return;
  if (s.t === 'fill' && !/\[\[.+?\]\]/.test(s.code)) bad(where, 'no blanks');
  if (s.t === 'code') {
    if (!s.sol) return bad(where, 'no solution');
    const bare = s.sol.replace(L.comments, '');
    for (const [re, m] of s.must || []) if (!new RegExp(re, 'i').test(bare)) bad(where, 'solution fails must: ' + m);
    for (const [re, m] of s.not || []) if (new RegExp(re, 'i').test(bare)) bad(where, 'solution fails not: ' + m);
    jobs.push(async () => {
      const want = await go(s.sol, s.check);
      if (!want.ok) return bad(where, 'solution fails: ' + want.error);
      if (!want.last) return bad(where, 'solution returns no table (add a SELECT, or a check query)');
      if (!want.last.rows.length) bad(where, 'solution returns no rows, so any empty answer would pass');
      if (s.start && s.start.trim() !== s.sol.trim() && !(s.must || []).length) {
        const st = await go(s.start, s.check);
        const ordered = s.ordered != null ? s.ordered : SqlRun.isOrdered(s.check || s.sol);
        if (st.ok && SqlRun.sameResult(want.last, st.last, ordered)) bad(where, 'starter code already passes');
      }
    });
    return;
  }
  if (s.nc) return;
  if (s.t === 'predict') jobs.push(async () => {
    const r = await go(s.code);
    if (!r.ok) return bad(where, 'predict query fails: ' + r.error);
    const got = SqlRun.asText(r.last);
    if (tidy(got) !== tidy(s.out)) bad(where, `says ${JSON.stringify(s.out)} but SQLite returns ${JSON.stringify(got)}`);
  });
  if (s.t === 'fill' || s.t === 'order') jobs.push(async () => {
    const code = s.t === 'fill' ? s.code.replace(/\[\[(.+?)\]\]/g, (m, a) => a.split('~')[0]) : s.lines.join('\n');
    const r = await go(code);
    if (!r.ok) bad(where, s.t + ' code fails: ' + r.error);
  });
}

function add(where, s, lang, compiled) {
  if (lang === 'sql') return addSql(where, s, SQLSETUP);
  const L = LANG[lang];
  if (s.t === 'mcq') { if (!(s.ans >= 0 && s.ans < s.opts.length)) bad(where, 'answer index out of range'); return; }
  if (s.t === 'info') return;
  if (s.t === 'predict' && !String(s.out).trim()) bad(where, 'empty expected output');
  if (s.t === 'fill' && !/\[\[.+?\]\]/.test(s.code)) bad(where, 'no blanks');
  if (s.t === 'code') {
    if (!s.sol) return bad(where, 'no solution');
    const bare = s.sol.replace(L.comments, '');
    for (const [re, m] of s.must || []) if (!new RegExp(re).test(bare)) bad(where, 'solution fails must: ' + m);
    for (const [re, m] of s.not || []) if (new RegExp(re).test(bare)) bad(where, 'solution fails not: ' + m);
    const tests = s.tests || [{ in: '' }];
    if (!tests.every(t => t.out != null || t.has || t.re)) bad(where, 'a test checks nothing');
    if (!compiled) { skipped++; return; }
    jobs.push(async () => {
      const r = await run(lang, s.sol, tests.map(t => t.in || ''));
      if (!r.compile.ok) return bad(where, 'solution does not compile\n' + r.compile.output);
      if (L.warnings && r.compile.output) bad(where, 'solution has warnings\n' + r.compile.output);
      r.runs.forEach((x, i) => {
        const t = tests[i], o = norm(x.stdout);
        if (x.timedOut || x.code !== 0) bad(where, `test ${i + 1} exit ${x.code} timeout=${x.timedOut}${x.stderr ? '\n' + x.stderr : ''}`);
        if (t.out != null && o !== norm(t.out)) bad(where, `test ${i + 1} expected ${JSON.stringify(norm(t.out))} got ${JSON.stringify(o)}`);
        if (t.has && !t.has.every(v => o.includes(v))) bad(where, `test ${i + 1} missing ${JSON.stringify(t.has)} in ${JSON.stringify(o)}`);
        if (t.re && !new RegExp(t.re).test(o)) bad(where, `test ${i + 1} regex ${t.re} vs ${JSON.stringify(o)}`);
      });
      if (s.start && s.start !== s.sol && !(s.must || []).length) {
        const st = await run(lang, s.start, tests.map(t => t.in || ''));
        if (st.compile.ok && st.runs.every((x, i) => passes(x, tests[i]))) bad(where, 'starter code already passes the tests');
      }
    });
    return;
  }
  if (s.nc) return;
  if (!compiled) { skipped++; return; }
  if (s.t === 'predict') jobs.push(async () => {
    const r = await run(lang, L.wrap(s.code), ['']);
    if (!r.compile.ok) return bad(where, 'predict code does not compile\n' + r.compile.output);
    if (norm(r.runs[0].stdout) !== norm(s.out)) bad(where, `says ${JSON.stringify(s.out)} but ${L.tool} prints ${JSON.stringify(norm(r.runs[0].stdout))}${r.runs[0].stderr ? '\n' + r.runs[0].stderr : ''}`);
  });
  if (s.t === 'fill' || s.t === 'order') jobs.push(async () => {
    const code = s.t === 'fill' ? s.code.replace(/\[\[(.+?)\]\]/g, (m, a) => a.split('~')[0]) : s.lines.join('\n');
    let r = await run(lang, L.wrap(code), [''], { check: !!L.syntaxOnly });
    if (!r.compile.ok && L.fileLevel && L.fileLevel(code)) { const r2 = await run(lang, L.fileLevel(code), ['']); if (r2.compile.ok) r = r2; }
    if (!r.compile.ok) bad(where, s.t + ' code does not compile\n' + r.compile.output);
  });
}

const totals = [];
for (const co of Object.values(COURSES)) {
  if (onlyCourse && co.id !== onlyCourse) continue;
  if (!LANG[co.id]) { bad(co.id, 'tools/verify.js does not know this language'); continue; }
  const compiled = co.sql || (!co.online && !!findTool(co.id)), before = jobs.length;
  const setupFor = (s, l, t) => { const db = (s && s.db) || (l && l.db) || t.db || co.db; if (co.sql && !(db in (co.datasets || {}))) bad(`${co.id}/${t.id}`, 'unknown database ' + db); return (co.datasets || {})[db] || ''; };
  let nSteps = 0, nLessons = 0, nTopics = 0;
  const ids = new Set(), terms = new Set();
  for (const g of co.glossary) { if (terms.has(g.term)) bad(co.id + ' glossary', 'duplicate term ' + g.term); terms.add(g.term); }
  for (const t of co.topics) {
    if (ids.has(t.id)) bad(co.id + '/' + t.id, 'duplicate topic id'); ids.add(t.id);
    if (onlyTopic && t.id !== onlyTopic) continue;
    nTopics++;
    const lids = new Set();
    for (const l of t.lessons) {
      nLessons++;
      if (lids.has(l.id)) bad(`${co.id}/${t.id}/${l.id}`, 'duplicate lesson id'); lids.add(l.id);
      for (const v of l.v || []) if (!/^\d+:\d\d:\d\d$/.test(v[0]) || (v[1] && !/^\d+:\d\d:\d\d$/.test(v[1]))) bad(`${co.id}/${t.id}/${l.id}`, 'bad video time');
      l.steps.forEach((s, i) => { nSteps++; SQLSETUP = setupFor(s, l, t); add(`${co.id}/${t.id}/${l.id}/${i} (${s.t})`, s, co.id, compiled); });
    }
    (t.quiz || []).forEach((s, i) => { nSteps++; SQLSETUP = setupFor(s, null, t); add(`${co.id}/${t.id}/quiz/${i} (${s.t})`, s, co.id, compiled); });
  }
  totals.push(`${co.name.padEnd(7)} ${String(nTopics).padStart(2)} topics, ${String(nLessons).padStart(2)} lessons, ${String(nSteps).padStart(3)} steps - ` +
    (compiled ? `${jobs.length - before} run with ${co.sql ? 'SQLite (sql.js)' : findTool(co.id).version}` : co.online ? 'structure checks only (runs online: see public/verify-cs.js)' : `structure checks only: ${LANG[co.id].tool} was not found on this machine`));
}

(async () => {
  let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (next < jobs.length) await jobs[next++](); }));
  console.log(totals.join('\n'));
  if (skipped) console.log(`(${skipped} exercises were not run here)`);
  console.log(problems.length ? '\n' + problems.join('\n\n') : 'All good ✓');
  process.exit(problems.length ? 1 : 0);
})();
