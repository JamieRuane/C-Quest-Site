// Runs learners' code with the tools installed on THIS machine: gcc (C), g++ (C++), Python, the JDK (Java)
// and Node itself (JavaScript).
// C# has no local runner - the site sends it to the online compiler straight from the browser.
//
// Every language answers in the same shape:
//   { compile: { ok, output }, runs: [{ stdout, stderr, code, timedOut, flooded }] }
// or { noCompiler: true } when the tool for that language is not installed.
const fs = require('fs'), path = require('path'), os = require('os');
const { spawn, spawnSync } = require('child_process');
const pyWrap = require('./public/pywrap.js'), jsWrap = require('./public/jswrap.js'), javaFix = require('./public/javafix.js');

const MSYS = ['C:\\msys64\\ucrt64\\bin\\', 'C:\\msys64\\mingw64\\bin\\', 'C:\\msys64\\clang64\\bin\\', 'C:\\MinGW\\bin\\'];
const COMPILED = {
  c: { name: 'C', file: 'main.c', flags: ['-std=c17', '-Wall', '-lm'], cands: ['gcc', MSYS[0] + 'gcc.exe', MSYS[1] + 'gcc.exe', MSYS[2] + 'clang.exe', MSYS[3] + 'gcc.exe', 'clang', 'cc'] },
  cpp: { name: 'C++', file: 'main.cpp', flags: ['-std=c++20', '-Wall'], cands: ['g++', MSYS[0] + 'g++.exe', MSYS[1] + 'g++.exe', MSYS[2] + 'clang++.exe', MSYS[3] + 'g++.exe', 'clang++', 'c++'] },
};
const LANGS = ['c', 'cpp', 'py', 'java', 'js'];

const found = {};
/* Which tool runs this language here? { cmd, pre, version } or false. Looked up once, then remembered. */
function findTool(lang) {
  if (lang in found) return found[lang];
  if (lang === 'js') return (found.js = { cmd: process.execPath, pre: [], version: 'Node.js ' + process.version });   // the Node running this server
  const local = process.env.LOCALAPPDATA || '';
  const cands = lang === 'py'
    ? [['python', []], ['py', ['-3']], ['python3', []], ...['314', '313', '312', '311', '310'].map(v => [path.join(local, 'Programs', 'Python', 'Python' + v, 'python.exe'), []])]
    : lang === 'java' ? [['javac', []], ...(process.env.JAVA_HOME ? [[path.join(process.env.JAVA_HOME, 'bin', 'javac'), []]] : [])]
    : COMPILED[lang] ? COMPILED[lang].cands.map(c => [c, []]) : [];
  for (const [cmd, pre] of cands) {
    try {
      const r = spawnSync(cmd, [...pre, '--version'], { encoding: 'utf8', timeout: 8000, windowsHide: true });
      const v = ((r.stdout || '') + (r.stderr || '')).trim().split('\n')[0].trim();
      if (r.status === 0 && (lang !== 'py' || /^Python 3\./.test(v))) return (found[lang] = { cmd, pre, version: v });
    } catch { /* try next */ }
  }
  return (found[lang] = false);
}

function exec(cmd, args, { cwd, input = '', timeout = 4000, env } = {}) {
  return new Promise(resolve => {
    const MAX = 64 * 1024;
    let out = '', err = '', timedOut = false, flooded = false, p;
    try { p = spawn(cmd, args, { cwd, env, windowsHide: true }); }
    catch (e) { return resolve({ code: -1, stdout: '', stderr: String(e), timedOut: false }); }
    const timer = setTimeout(() => { timedOut = true; p.kill(); }, timeout);
    p.stdout.setEncoding('utf8'); p.stderr.setEncoding('utf8');
    p.stdout.on('data', d => { out += d; if (out.length > MAX) { flooded = true; p.kill(); } });
    p.stderr.on('data', d => { if (err.length < MAX) err += d; });
    p.on('error', e => { clearTimeout(timer); resolve({ code: -1, stdout: out, stderr: String(e), timedOut }); });
    p.on('close', code => {
      clearTimeout(timer);
      resolve({ code, stdout: out.slice(0, MAX), stderr: err.slice(0, MAX), timedOut, flooded });
    });
    p.stdin.on('error', () => {});
    p.stdin.end(input);
  });
}

const tempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'codequest-'));
const cleanUp = dir => fs.rm(dir, { recursive: true, force: true, maxRetries: 8, retryDelay: 150 }, () => {});

/* C and C++: compile once, then run the program once per input. */
async function runCompiled(lang, code, stdins) {
  const cc = findTool(lang), L = COMPILED[lang];
  if (!cc) return { noCompiler: true };
  const dir = tempDir();
  const exe = path.join(dir, process.platform === 'win32' ? 'main.exe' : 'main');
  const env = { ...process.env };
  if (path.isAbsolute(cc.cmd)) env.PATH = path.dirname(cc.cmd) + path.delimiter + (env.PATH || env.Path || '');
  try {
    fs.writeFileSync(path.join(dir, L.file), code);
    const comp = await exec(cc.cmd, [L.file, '-o', exe, ...L.flags], { cwd: dir, timeout: 30000, env });
    const output = (comp.stderr + comp.stdout).trim();
    if (comp.code !== 0) return { compile: { ok: false, output: output || 'Compilation failed.' }, runs: [] };
    const runs = [];
    for (const input of stdins.slice(0, 8)) runs.push(await exec(exe, [], { cwd: dir, input: String(input ?? ''), timeout: 4000, env }));
    return { compile: { ok: true, output }, runs };
  } finally { cleanUp(dir); }
}

/* Python: nothing to compile. "compile" here means Python could parse the file; a syntax error means nothing runs.
   check = true only checks the syntax. */
async function runPython(code, stdins, check) {
  const py = findTool('py');
  if (!py) return { noCompiler: true };
  const dir = tempDir();
  try {
    fs.writeFileSync(path.join(dir, 'run.py'), pyWrap(code, check));
    const runs = [];
    for (const input of (check ? [''] : stdins.slice(0, 8))) {
      const r = await exec(py.cmd, [...py.pre, '-I', '-u', '-B', 'run.py'], { cwd: dir, input: String(input ?? ''), timeout: 5000, env: { ...process.env } });
      r.stderr = r.stderr.replace(/\r/g, ''); r.stdout = r.stdout.replace(/\r/g, '');
      if (r.stderr.startsWith(pyWrap.SYNTAX)) return { compile: { ok: false, output: r.stderr.slice(pyWrap.SYNTAX.length).trim() }, runs: [] };
      runs.push(r);
    }
    return { compile: { ok: true, output: '' }, runs: check ? [] : runs };
  } finally { cleanUp(dir); }
}

/* Java: compile once with javac, then run the class that has main() once per input.
   The file is always Main.java; javaFix.prep() lets the learner's class have any name. */
async function runJava(code, stdins) {
  const jc = findTool('java');
  if (!jc) return { noCompiler: true };
  const dir = tempDir(), env = { ...process.env };
  const java = path.isAbsolute(jc.cmd) ? path.join(path.dirname(jc.cmd), 'java') : 'java';
  try {
    fs.writeFileSync(path.join(dir, 'Main.java'), javaFix.prep(code));
    const comp = await exec(jc.cmd, ['-encoding', 'UTF-8', '-d', '.', 'Main.java'], { cwd: dir, timeout: 40000, env });
    const output = (comp.stderr + comp.stdout).replace(/\r/g, '').trim();
    if (comp.code !== 0) return { compile: { ok: false, output: output || 'Compilation failed.' }, runs: [] };
    const runs = [];
    for (const input of stdins.slice(0, 8)) {
      const r = await exec(java, ['-cp', '.', '-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-Xss4m', javaFix.mainClass(code)], { cwd: dir, input: String(input ?? ''), timeout: 8000, env });
      r.stderr = r.stderr.replace(/\r/g, ''); r.stdout = r.stdout.replace(/\r/g, '');
      runs.push(r);
    }
    return { compile: { ok: true, output }, runs };
  } finally { cleanUp(dir); }
}

/* JavaScript: run with Node through jswrap.js. Like Python, "compile" means the file could be parsed. */
async function runJs(code, stdins, check) {
  const node = findTool('js'), dir = tempDir();
  try {
    fs.writeFileSync(path.join(dir, 'run.js'), jsWrap(code, check));
    const runs = [];
    for (const input of (check ? [''] : stdins.slice(0, 8))) {
      const r = await exec(node.cmd, ['run.js'], { cwd: dir, input: String(input ?? ''), timeout: 5000, env: { ...process.env } });
      r.stderr = r.stderr.replace(/\r/g, ''); r.stdout = r.stdout.replace(/\r/g, '');
      if (r.stderr.startsWith(jsWrap.SYNTAX)) return { compile: { ok: false, output: r.stderr.slice(jsWrap.SYNTAX.length).trim() }, runs: [] };
      runs.push(r);
    }
    return { compile: { ok: true, output: '' }, runs: check ? [] : runs };
  } finally { cleanUp(dir); }
}

/* run('c' | 'cpp' | 'py' | 'java' | 'js', code, [stdin, ...], { check }) */
function run(lang, code, stdins = [''], { check = false } = {}) {
  if (lang === 'py') return runPython(code, stdins, check);
  if (lang === 'js') return runJs(code, stdins, check);
  if (lang === 'java') return runJava(code, stdins);
  if (COMPILED[lang]) return runCompiled(lang, code, stdins);
  return Promise.reject(new Error('no local runner for ' + lang));
}

module.exports = { run, findTool, LANGS };
