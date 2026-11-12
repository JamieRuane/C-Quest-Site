// Developer tool: checks the C# course against the same online compiler the site uses.
// (tools/verify.js cannot do this, because there is no C# compiler on this machine.)
//
// How to use: start the site, open it in a browser, open the browser console and run
//     await import('./verify-cs.js')
// It works through every C# exercise ONE AT A TIME (the free compiler refuses parallel runs), which takes
// several minutes. Progress and problems are printed to the console and kept in window.__csVerify.
const course = window.COURSES.cs;
const V = window.__csVerify = { done: 0, total: 0, problems: [], finished: false, log: [] };
const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const USES = 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n';

async function run(code, stdin = '') {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch('https://wandbox.org/api/compile.json', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, stdin, ...course.wandbox }) });
      const j = await r.json();
      if (attempt < 4 && (j.status === '126' || /OCI runtime error|Resource temporarily unavailable/.test(j.program_error || ''))) { await sleep(3000 * (attempt + 1)); continue; }   // service hiccup: wait and try again
      return j;
    } catch (e) { if (attempt >= 4) return { status: '-1', compiler_error: 'network: ' + e, program_output: '' }; await sleep(3000); }
  }
}
const errors = j => (j.compiler_error || '').split('\n').filter(l => /error CS/.test(l)).join('\n');
const bad = (where, msg) => { V.problems.push(where + ': ' + msg); console.warn('✗', where, msg); };

const jobs = [], batch = [];           // batch: statement-only snippets, compiled together as separate methods
function add(where, s) {
  if (s.t === 'code') {
    const tests = s.tests || [{ in: '' }];
    tests.forEach((t, i) => jobs.push(async () => {
      const j = await run(s.sol, t.in || '');
      if (errors(j)) return bad(where, 'solution does not compile\n' + errors(j));
      const o = norm(j.program_output);
      if (j.status !== '0') bad(where, `test ${i + 1} exit ${j.status} ${j.program_error || ''}`);
      if (t.out != null && o !== norm(t.out)) bad(where, `test ${i + 1} expected ${JSON.stringify(norm(t.out))} got ${JSON.stringify(o)}`);
      if (t.has && !t.has.every(v => o.includes(v))) bad(where, `test ${i + 1} missing ${JSON.stringify(t.has)}`);
    }));
    if (s.start && s.start !== s.sol && !(s.must || []).length) jobs.push(async () => {
      const t = tests[0], j = await run(s.start, t.in || '');
      if (!errors(j) && j.status === '0' && t.out != null && norm(j.program_output) === norm(t.out)) bad(where, 'starter code already passes');
    });
    return;
  }
  if (s.nc || !['predict', 'fill', 'order'].includes(s.t)) return;
  const code = s.t === 'fill' ? s.code.replace(/\[\[(.+?)\]\]/g, (m, a) => a.split('~')[0]) : s.t === 'order' ? s.lines.join('\n') : s.code;
  const full = /\bclass Program\b/.test(code) ? (/\busing System;/.test(code) ? code : USES + code)
    : /\bstatic void Main\b/.test(code) ? USES + 'class Program {\n' + code + '\n}\n' : null;
  if (!full) { batch.push({ where, code, out: s.t === 'predict' ? s.out : null }); return; }
  jobs.push(async () => {
    const j = await run(full);
    if (errors(j)) return bad(where, s.t + ' code does not compile\n' + errors(j));
    if (s.t === 'predict' && norm(j.program_output) !== norm(s.out)) bad(where, `says ${JSON.stringify(s.out)} but prints ${JSON.stringify(norm(j.program_output))}`);
  });
}
for (const t of course.topics.length ? course.all || course.topics : []) {
  for (const l of t.lessons) l.steps.forEach((s, i) => add(`${t.id}/${l.id}/${i} (${s.t})`, s));
  (t.quiz || []).forEach((s, i) => add(`${t.id}/quiz/${i} (${s.t})`, s));
}
for (let k = 0; k < batch.length; k += 12) {
  const part = batch.slice(k, k + 12);
  jobs.push(async () => {
    const src = USES + 'class Program {\n' + part.map((b, i) => `static void S${i}() {\n${b.code}\n;}\n`).join('') +
      'static void Main() {\n' + part.map((b, i) => b.out == null ? '' : `Console.WriteLine("\\n@@${i}"); try { S${i}(); } catch (Exception e) { Console.WriteLine("EXC " + e.GetType().Name); }\n`).join('') + 'Console.WriteLine("\\n@@end");\n}\n}\n';
    const j = await run(src);
    if (errors(j)) {                     // find the culprit(s) one by one
      for (const b of part) { const one = await run(USES + 'class Program {\nstatic void Main() {\n' + b.code + '\n;}\n}\n'); if (errors(one)) bad(b.where, 'does not compile\n' + errors(one)); }
      return;
    }
    const out = j.program_output.replace(/\r/g, '');
    part.forEach((b, i) => {
      if (b.out == null) return;
      const m = out.split(`\n@@${i}\n`)[1];
      const got = norm((m || '').split(/\n@@(\d+|end)\n/)[0]);
      if (got !== norm(b.out)) bad(b.where, `says ${JSON.stringify(b.out)} but prints ${JSON.stringify(got)}`);
    });
  });
}
V.total = jobs.length;
console.log(`Checking C#: ${jobs.length} compiler runs, one at a time…`);
for (const job of jobs) { await job(); V.done++; if (V.done % 5 === 0) console.log(`${V.done}/${V.total}`); await sleep(400); }
V.finished = true;
console.log(V.problems.length ? V.problems.join('\n\n') : 'C#: all good ✓');
