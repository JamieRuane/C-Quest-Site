// Code Quest — tiny zero-dependency server. Serves the site and runs your code with the tools on this machine:
// gcc for C, g++ for C++, Python, the JDK for Java and Node for JavaScript.
// (C# is compiled by the online compiler, straight from the browser.)
// Only listens on 127.0.0.1, so nothing outside this computer can reach it.
const http = require('http'), fs = require('fs'), path = require('path');
const { run, findTool, LANGS } = require('./runner');

const PORT = +process.env.PORT || 4321;
const ROOT = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon' };
const LOCAL = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`]);
const NAMES = { c: 'C', cpp: 'C++', py: 'Python', java: 'Java', js: 'JavaScript' };

const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

http.createServer(async (req, res) => {
  // Refuse anything that is not addressed to localhost (blocks other websites from using the code runner).
  if (!LOCAL.has(req.headers.host)) return json(res, 403, { error: 'forbidden' });
  const url = new URL(req.url, 'http://x');

  if (url.pathname === '/api/health') {
    return json(res, 200, Object.fromEntries(LANGS.map(l => [l, (findTool(l) || {}).version || null])));
  }

  if (url.pathname === '/api/run') {
    const origin = req.headers.origin;
    if (req.method !== 'POST' || !/application\/json/.test(req.headers['content-type'] || '') ||
        (origin && !LOCAL.has(origin.replace(/^https?:\/\//, '')))) return json(res, 403, { error: 'forbidden' });
    let body = '';
    for await (const chunk of req) { body += chunk; if (body.length > 200000) return json(res, 413, { error: 'too large' }); }
    try {
      const { code, stdins, lang = 'c' } = JSON.parse(body);
      if (typeof code !== 'string' || !LANGS.includes(lang)) throw new Error('bad request');
      return json(res, 200, await run(lang, code, Array.isArray(stdins) ? stdins : ['']));
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
  console.log(`\n  Code Quest is running:  http://localhost:${PORT}\n`);
  for (const l of LANGS) {
    const t = findTool(l);
    console.log(`  ${NAMES[l].padEnd(11)} ${t ? t.version : 'NOT FOUND - ' + NAMES[l] + ' coding exercises will not run on this machine'}`);
  }
  console.log('  C#          runs on the online compiler (needs an internet connection)');
  console.log('\n  Leave this window open while you learn. Press Ctrl+C to stop.\n');
});
