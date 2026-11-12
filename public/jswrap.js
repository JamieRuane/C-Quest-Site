/* Wraps a learner's JavaScript so it runs the same way locally (runner.js) and online (Wandbox), both on Node:
   - syntax errors are reported as "@@SYNTAX@@" so the site can say "JavaScript cannot read this yet"
   - prompt("question") reads the next line of input and echoes it, so the output looks like a real session
     (it returns null when there is no more input, like pressing Cancel in a browser)
   - errors only show the learner's own file (main.js) and line, never this wrapper
   check = true only checks the syntax and runs nothing.
   The wrapper never calls process.exit(): output written just before an exit can be lost. */
(function (root) {
  const jsWrap = (src, check = false) => `const __vm = require('vm'), __fs = require('fs');
const __SRC = ${JSON.stringify(String(src))};
(function () {
  let script;
  try { script = new __vm.Script(__SRC, { filename: 'main.js' }); }
  catch (e) {
    const st = String((e && e.stack) || e).split('\\n'), i = st.findIndex(l => /^\\w*Error\\b/.test(l));
    process.stderr.write('@@SYNTAX@@\\n' + st.slice(0, i < 0 ? 1 : i + 1).join('\\n') + '\\n');
    process.exitCode = 3; return;
  }
  if (${check ? 'true' : 'false'}) return;
  let lines = null;
  globalThis.prompt = (question = '') => {
    if (lines === null) {
      try { lines = __fs.readFileSync(0, 'utf8').split(/\\r?\\n/); } catch (e) { lines = []; }
      if (lines.length && lines[lines.length - 1] === '') lines.pop();
    }
    process.stdout.write(String(question));
    if (!lines.length) { process.stdout.write('\\n'); return null; }
    const line = lines.shift();
    process.stdout.write(line + '\\n');
    return line;
  };
  let failed = false;
  const fail = e => {
    if (failed) return; failed = true;
    const at = String((e && e.stack) || '').split('\\n').find(l => /main\\.js:\\d+/.test(l));
    const n = at ? +(at.match(/main\\.js:(\\d+)/) || [])[1] : 0;
    const where = n ? 'main.js, line ' + n + '\\n    ' + (__SRC.split('\\n')[n - 1] || '').trim() + '\\n' : '';
    process.stderr.write(where + (e && e.name ? e.name + ': ' + e.message : 'Error: ' + String(e)) + '\\n');
    process.exitCode = 1;
  };
  process.on('uncaughtException', fail);
  process.on('unhandledRejection', fail);
  try { script.runInThisContext(); } catch (e) { fail(e); }
})();
`;
  jsWrap.SYNTAX = '@@SYNTAX@@\n';
  if (typeof module !== 'undefined' && module.exports) module.exports = jsWrap; else root.jsWrap = jsWrap;
})(this);
