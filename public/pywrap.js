/* Wraps a learner's program so it runs the same way locally (runner.js) and online (Wandbox):
   - syntax errors are reported as "@@SYNTAX@@" so the site can say "Python cannot read this yet"
   - input() echoes what was typed, so the output looks like a real terminal session
   - tracebacks only show the learner's own file (main.py), never this wrapper
   check = true only checks the syntax and runs nothing. */
(function (root) {
  const pyWrap = (src, check = false) => `import sys, builtins, traceback, linecache
for _s in (sys.stdin, sys.stdout, sys.stderr):
    _s.reconfigure(encoding='utf-8', errors='replace')
_SRC = ${JSON.stringify(String(src))}
def _pyquest():
    linecache.cache['main.py'] = (len(_SRC), None, _SRC.splitlines(True), 'main.py')
    try:
        code = compile(_SRC, 'main.py', 'exec')
    except (SyntaxError, ValueError) as e:
        sys.stderr.write('@@SYNTAX@@\\n' + ''.join(traceback.format_exception_only(type(e), e)))
        sys.exit(3)
    if ${check ? 'True' : 'False'}:
        return
    def _input(prompt=''):
        sys.stdout.write(str(prompt))
        sys.stdout.flush()
        line = sys.stdin.readline()
        if not line:
            raise EOFError('EOF when reading a line')
        line = line.rstrip('\\r\\n')
        sys.stdout.write(line + '\\n')
        return line
    builtins.input = _input
    g = {'__name__': '__main__', '__builtins__': builtins}
    try:
        exec(code, g)
    except SystemExit:
        raise
    except BaseException as e:
        sys.stdout.flush()
        frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == 'main.py']
        sys.stderr.write('Traceback (most recent call last):\\n' + ''.join(traceback.format_list(frames)) + ''.join(traceback.format_exception_only(type(e), e)))
        sys.exit(1)
_pyquest()
`;
  pyWrap.SYNTAX = '@@SYNTAX@@\n';
  if (typeof module !== 'undefined' && module.exports) module.exports = pyWrap; else root.pyWrap = pyWrap;
})(this);
