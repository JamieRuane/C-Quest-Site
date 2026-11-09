// C Quest — tiny zero-dependency server. Serves the site and runs your C code with your local gcc.
// Only listens on 127.0.0.1, so nothing outside this computer can reach it.
const http = require('http'), fs = require('fs'), path = require('path');
const { compileAndRun, findCompiler } = require('./runner');

const PORT = +process.env.PORT || 4321;
const ROOT = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon' };
const LOCAL = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`]);

const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

http.createServer(async (req, res) => {
  // Refuse anything that is not addressed to localhost (blocks other websites from using the code runner).
  if (!LOCAL.has(req.headers.host)) return json(res, 403, { error: 'forbidden' });
  const url = new URL(req.url, 'http://x');

  if (url.pathname === '/api/health') {
    const cc = findCompiler();
    return json(res, 200, { compiler: cc ? cc.version : null });
  }

  if (url.pathname === '/api/run') {
    const origin = req.headers.origin;
    if (req.method !== 'POST' || !/application\/json/.test(req.headers['content-type'] || '') ||
        (origin && !LOCAL.has(origin.replace(/^https?:\/\//, '')))) return json(res, 403, { error: 'forbidden' });
    let body = '';
    for await (const chunk of req) { body += chunk; if (body.length > 200000) return json(res, 413, { error: 'too large' }); }
    try {
      const { code, stdins } = JSON.parse(body);
      if (typeof code !== 'string') throw new Error('bad request');
      return json(res, 200, await compileAndRun(code, Array.isArray(stdins) ? stdins : ['']));
    } catch (e) { return json(res, 400, { error: String(e.message || e) }); }
  }

  let file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)));
  if (!file.startsWith(ROOT)) return json(res, 403, { error: 'forbidden' });
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': (MIME[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => {
  const cc = findCompiler();
  console.log(`\n  C Quest is running:  http://localhost:${PORT}\n`);
  console.log(cc ? `  Compiler: ${cc.version}` : '  WARNING: no C compiler (gcc) found - coding exercises will not run.');
  console.log('  Leave this window open while you learn. Press Ctrl+C to stop.\n');
});
