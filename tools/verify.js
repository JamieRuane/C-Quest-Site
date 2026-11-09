// Checks every exercise in the course against real gcc:
//  - code challenges: the reference solution must pass its own tests
//  - predict-the-output: the stated output must be what gcc actually produces
//  - fill-the-blanks / ordering: the completed code must compile
// Usage: node tools/verify.js [topicId]
const fs = require('fs'), path = require('path'), vm = require('vm');
const { compileAndRun } = require('../runner');

const dir = path.join(__dirname, '..', 'public', 'content');
const ctx = vm.createContext({ console }); ctx.window = ctx;
for (const f of fs.readdirSync(dir).sort()) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
const COURSE = ctx.COURSE, only = process.argv[2];

const INCS = ['stdio.h', 'stdlib.h', 'string.h', 'stdbool.h', 'math.h', 'time.h', 'ctype.h'].map(h => `#include <${h}>`).join('\n') + '\n';
const wrap = code => /\bmain\s*\(/.test(code) ? (code.includes('#include') ? code : INCS + code) : INCS + 'int main(void){\n' + code + '\n;return 0;}\n';
const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();

const jobs = [], problems = [];
const bad = (where, msg) => problems.push(`✗ ${where}: ${msg}`);
function add(where, s) {
  if (s.t === 'mcq') { if (!(s.ans >= 0 && s.ans < s.opts.length)) bad(where, 'answer index out of range'); return; }
  if (s.t === 'info') return;
  if (s.t === 'code') {
    if (!s.sol) return bad(where, 'no solution');
    const bare = s.sol.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    for (const [re, m] of s.must || []) if (!new RegExp(re).test(bare)) bad(where, 'solution fails must: ' + m);
    for (const [re, m] of s.not || []) if (new RegExp(re).test(bare)) bad(where, 'solution fails not: ' + m);
    const tests = s.tests || [{ in: '' }];
    jobs.push(async () => {
      const r = await compileAndRun(s.sol, tests.map(t => t.in || ''));
      if (!r.compile.ok) return bad(where, 'solution does not compile\n' + r.compile.output);
      if (r.compile.output) bad(where, 'solution has warnings\n' + r.compile.output);
      r.runs.forEach((x, i) => {
        const t = tests[i], o = norm(x.stdout);
        if (x.timedOut || x.code !== 0) bad(where, `test ${i + 1} exit ${x.code} timeout=${x.timedOut}`);
        if (t.out != null && o !== norm(t.out)) bad(where, `test ${i + 1} expected ${JSON.stringify(norm(t.out))} got ${JSON.stringify(o)}`);
        if (t.has && !t.has.every(v => o.includes(v))) bad(where, `test ${i + 1} missing ${JSON.stringify(t.has)} in ${JSON.stringify(o)}`);
        if (t.re && !new RegExp(t.re).test(o)) bad(where, `test ${i + 1} regex ${t.re} vs ${JSON.stringify(o)}`);
      });
      if (s.start && s.start !== s.sol) {
        const st = await compileAndRun(s.start, tests.map(t => t.in || ''));
        if (st.compile.ok && st.runs.every((x, i) => { const t = tests[i], o = norm(x.stdout); return (t.out == null || o === norm(t.out)) && (!t.has || t.has.every(v => o.includes(v))) && (!t.re || new RegExp(t.re).test(o)); }) && !(s.must || []).length)
          bad(where, 'starter code already passes the tests');
      }
    });
    return;
  }
  if (s.nc) return;
  if (s.t === 'predict') jobs.push(async () => {
    const r = await compileAndRun(wrap(s.code), ['']);
    if (!r.compile.ok) return bad(where, 'predict code does not compile\n' + r.compile.output);
    if (norm(r.runs[0].stdout) !== norm(s.out)) bad(where, `says ${JSON.stringify(s.out)} but gcc prints ${JSON.stringify(norm(r.runs[0].stdout))}`);
  });
  if (s.t === 'fill' || s.t === 'order') jobs.push(async () => {
    const code = s.t === 'fill' ? s.code.replace(/\[\[(.+?)\]\]/g, (m, a) => a.split('~')[0]) : s.lines.join('\n');
    const r = await compileAndRun(wrap(code), ['']);
    if (!r.compile.ok) bad(where, s.t + ' code does not compile\n' + r.compile.output);
  });
}

let nSteps = 0;
const ids = new Set();
for (const t of COURSE.topics) {
  if (ids.has(t.id)) bad(t.id, 'duplicate topic id'); ids.add(t.id);
  if (only && t.id !== only) continue;
  const lids = new Set();
  for (const l of t.lessons) {
    if (lids.has(l.id)) bad(t.id + '/' + l.id, 'duplicate lesson id'); lids.add(l.id);
    l.steps.forEach((s, i) => { nSteps++; add(`${t.id}/${l.id}/${i} (${s.t})`, s); });
  }
  (t.quiz || []).forEach((s, i) => { nSteps++; add(`${t.id}/quiz/${i} (${s.t})`, s); });
}

(async () => {
  let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (next < jobs.length) await jobs[next++](); }));
  const L = COURSE.topics.reduce((a, t) => a + t.lessons.length, 0);
  console.log(`${COURSE.topics.length} topics, ${L} lessons, ${nSteps} steps checked (${jobs.length} compiled).`);
  console.log(problems.length ? problems.join('\n\n') : 'All good ✓');
  process.exit(problems.length ? 1 : 0);
})();
