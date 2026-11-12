/* Brings saved progress up to date. Used for the browser's saved copy, the cloud copy and imported backups.

   Before Code Quest, the site taught only C and saved progress under keys like "loops/while". Now every
   course has its own prefix ("c/loops/while", "py/loops/while"), so anything without a course prefix is
   C progress from before and gets the "c/" prefix. Running it twice changes nothing.

   migrateState(state, courseIds) returns a new object; it never changes the one passed in. */
(function (root) {
  const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);

  function migrateState(state, courseIds) {
    if (!isObj(state)) return {};
    const ids = new Set(courseIds), s = { ...state };
    const prefixed = k => ids.has(String(k).split('/')[0]);
    // Re-key a map. If the same lesson somehow exists under both the old and the new key, keep the better
    // value (higher score / more mistakes) so nothing a learner earned is thrown away.
    const rekey = (obj, fix, best) => {
      const out = {};
      for (const [k, v] of Object.entries(isObj(obj) ? obj : {})) {
        const nk = fix(k);
        out[nk] = nk in out && best ? best(out[nk], v) : v;
      }
      return out;
    };
    const lessonKey = k => (prefixed(k) ? k : 'c/' + k);
    const max = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.max(a, b) : a);

    s.done = rekey(s.done, lessonKey);
    s.solved = rekey(s.solved, lessonKey);
    s.quiz = rekey(s.quiz, lessonKey, max);
    s.mistakes = rekey(s.mistakes, lessonKey, max);
    // bookmarks: lesson steps as above; glossary terms were "g:<term>" and are now "g:<course>:<term>"
    s.bookmarks = rekey(s.bookmarks, k => {
      if (!k.startsWith('g:')) return lessonKey(k);
      return ids.has(k.slice(2).split(':')[0]) && k.indexOf(':', 2) > 0 ? k : 'g:c:' + k.slice(2);
    });

    // the Playground used to hold one program; now one per course
    if (typeof s.play === 'string') s.play = s.play ? { c: s.play } : {};
    else if (!isObj(s.play)) s.play = {};

    const xp = Number.isFinite(s.xp) ? s.xp : 0;
    const hadC = xp > 0 || Object.keys(s.done).some(k => k.startsWith('c/'));
    if (!isObj(s.cxp)) s.cxp = {};
    if (!Object.keys(s.cxp).length && xp > 0) s.cxp = { c: xp };          // all XP so far was earned in C
    if (!isObj(s.start)) s.start = {};
    if (!ids.has(s.course)) s.course = !('course' in state) && hadC ? 'c' : null;   // returning C learners carry on in C
    if (s.course === 'c' && !s.start.c) s.start = { ...s.start, c: 'new' };

    // "boss" used to mean "finished every C lesson"; it now means "finished every course"
    if (!s.v && isObj(s.ach) && s.ach.boss) { const { boss, ...rest } = s.ach; s.ach = { ...rest, cdone: boss }; }
    s.v = 2;
    return s;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = migrateState; else root.migrateState = migrateState;
})(this);
