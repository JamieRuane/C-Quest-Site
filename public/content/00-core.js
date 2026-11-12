/* Course authoring helpers.
   Text fields: ~code~ = inline code, **bold** = bold, blank line = new paragraph.
   Step types:  T info · Q multiple choice · P predict output · F fill blanks ([[answer~alternative]])
                O order the lines · X code challenge (run and tested with the real compiler or interpreter)

   This site holds several courses. course('id', {...}) starts one; every topic() and G() after it
   belongs to that course until the next course() call. */
window.COURSES = {};
let CUR = null;
const course = (id, meta) => { CUR = window.COURSES[id] = { id, topics: [], glossary: [], ...meta }; };
const c = String.raw;
const trimNL = s => s.replace(/^\n+|\s+$/g, '');
const T = (title, text, code, after) => ({ t: 'info', title, text, code, after });
const Q = (q, opts, ans, why, code) => ({ t: 'mcq', q, opts, ans, why, code });
const P = (code, out, why, q) => ({ t: 'predict', code: trimNL(code), out, why, q });
const F = (q, code, why, nc) => ({ t: 'fill', q, code, why, nc });
const O = (q, lines, why, extra) => ({ t: 'order', q, lines: trimNL(lines).split('\n'), why, extra });
/* a course can tidy its own code challenges with an x() hook (Python trims the starter and solution) */
const X = o => CUR.x ? CUR.x({ t: 'code', ...o }) : { t: 'code', ...o };
/* M(body, ...) wraps statements in a complete program for the current course.
   C / C++: extra arguments are headers, e.g. M(body, 'math.h').  C#: extra arguments are namespaces.  Python does not use M. */
const M = (body, ...extra) => CUR.wrap(trimNL(body), extra);
const topic = t => CUR.topics.push(t);
const G = (term, def) => CUR.glossary.push({ term, def });
