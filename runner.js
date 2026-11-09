// Compiles and runs C code with the gcc that is installed on THIS machine.
const fs = require('fs'), path = require('path'), os = require('os');
const { spawn, spawnSync } = require('child_process');

let CC = null;
function findCompiler() {
  if (CC !== null) return CC;
  const cands = ['gcc', 'C:\\msys64\\ucrt64\\bin\\gcc.exe', 'C:\\msys64\\mingw64\\bin\\gcc.exe',
    'C:\\msys64\\clang64\\bin\\clang.exe', 'C:\\MinGW\\bin\\gcc.exe', 'clang', 'cc'];
  for (const cmd of cands) {
    try {
      const r = spawnSync(cmd, ['--version'], { encoding: 'utf8', timeout: 8000, windowsHide: true });
      if (r.status === 0) return (CC = { cmd, version: r.stdout.split('\n')[0].trim() });
    } catch { /* try next */ }
  }
  return (CC = false);
}

function exec(cmd, args, { cwd, input = '', timeout = 4000, env } = {}) {
  return new Promise(resolve => {
    const MAX = 64 * 1024;
    let out = '', err = '', timedOut = false, flooded = false, p;
    try { p = spawn(cmd, args, { cwd, env, windowsHide: true }); }
    catch (e) { return resolve({ code: -1, stdout: '', stderr: String(e), timedOut: false }); }
    const timer = setTimeout(() => { timedOut = true; p.kill(); }, timeout);
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

async function compileAndRun(code, stdins = ['']) {
  const cc = findCompiler();
  if (!cc) return { noCompiler: true };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cquest-'));
  const exe = path.join(dir, process.platform === 'win32' ? 'main.exe' : 'main');
  const env = { ...process.env };
  if (path.isAbsolute(cc.cmd)) env.PATH = path.dirname(cc.cmd) + path.delimiter + (env.PATH || env.Path || '');
  try {
    fs.writeFileSync(path.join(dir, 'main.c'), code);
    const comp = await exec(cc.cmd, ['main.c', '-o', exe, '-std=c17', '-Wall', '-lm'], { cwd: dir, timeout: 30000, env });
    const output = (comp.stderr + comp.stdout).trim();
    if (comp.code !== 0) return { compile: { ok: false, output: output || 'Compilation failed.' }, runs: [] };
    const runs = [];
    for (const input of stdins.slice(0, 8)) {
      runs.push(await exec(exe, [], { cwd: dir, input: String(input ?? ''), timeout: 4000, env }));
    }
    return { compile: { ok: true, output }, runs };
  } finally {
    fs.rm(dir, { recursive: true, force: true, maxRetries: 8, retryDelay: 150 }, () => {});
  }
}

module.exports = { compileAndRun, findCompiler };
