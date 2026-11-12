// Tests for public/migrate.js - upgrading progress saved by C Quest to Code Quest's per-course format.
//   npm run test:unit
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const migrate = require('../public/migrate.js');

const IDS = ['c', 'py', 'cpp', 'cs'];
// What C Quest saved before this change (trimmed to the interesting parts).
const oldSave = () => ({
  xp: 245, streak: 4, best: 6, last: '2026-11-11', days: { '2026-11-10': 40, '2026-11-11': 30 },
  done: { 'hello/first': { at: 1 }, 'hello/printf': { at: 2 }, 'loops/while': { at: 3 } },
  quiz: { hello: 86, vars: 60 },
  mistakes: { 'hello/first/1': 2, 'vars/quiz/3': 1 },
  solved: { 'hello/first/5': 1 },
  bookmarks: { 'pointers/deref/2': { at: 5, note: 'star has two jobs' }, 'g:pointer': { at: 6, note: '' }, 'g:= vs ==': { at: 7, note: '' } },
  ach: { first: 100, boss: 200 }, perfect: 2, cleared: 1, goal: 50, sound: false, unlockAll: false,
  play: 'int main() { return 0; }', owner: 'uid-1',
});

describe('C Quest progress becomes C progress in Code Quest', () => {
  const s = migrate(oldSave(), IDS);

  test('lessons, quizzes, mistakes and solved challenges get the c/ prefix', () => {
    assert.deepEqual(Object.keys(s.done), ['c/hello/first', 'c/hello/printf', 'c/loops/while']);
    assert.deepEqual(s.quiz, { 'c/hello': 86, 'c/vars': 60 });
    assert.deepEqual(s.mistakes, { 'c/hello/first/1': 2, 'c/vars/quiz/3': 1 });
    assert.deepEqual(s.solved, { 'c/hello/first/5': 1 });
  });

  test('bookmarks keep their notes; glossary bookmarks move under the C course', () => {
    assert.deepEqual(s.bookmarks['c/pointers/deref/2'], { at: 5, note: 'star has two jobs' });
    assert.ok(s.bookmarks['g:c:pointer']);
    assert.ok(s.bookmarks['g:c:= vs ==']);
    assert.equal(Object.keys(s.bookmarks).length, 3);
  });

  test('XP, streak, history and settings are untouched', () => {
    const o = oldSave();
    for (const k of ['xp', 'streak', 'best', 'last', 'perfect', 'cleared', 'goal', 'sound', 'unlockAll', 'owner']) assert.equal(s[k], o[k], k);
    assert.deepEqual(s.days, o.days);
  });

  test('all earlier XP is credited to C, and the learner carries on in C', () => {
    assert.deepEqual(s.cxp, { c: 245 });
    assert.equal(s.course, 'c');
    assert.equal(s.start.c, 'new');
  });

  test('the Playground program is kept as the C program', () => assert.deepEqual(s.play, { c: 'int main() { return 0; }' }));

  test('"finished every C lesson" keeps its date under its new id', () => {
    assert.equal(s.ach.cdone, 200);
    assert.equal(s.ach.boss, undefined);
    assert.equal(s.ach.first, 100);
  });

  test('the original object is not modified', () => {
    const o = oldSave(), copy = JSON.parse(JSON.stringify(o));
    migrate(o, IDS);
    assert.deepEqual(o, copy);
  });
});

describe('safe to run again and again', () => {
  test('migrating twice gives the same result as once', () => {
    const once = migrate(oldSave(), IDS);
    assert.deepEqual(migrate(JSON.parse(JSON.stringify(once)), IDS), once);
  });

  test('a new "boss" achievement earned later is not renamed', () => {
    const s = migrate(oldSave(), IDS);
    s.ach.boss = 999;
    assert.equal(migrate(s, IDS).ach.boss, 999);
  });

  test('progress already in the new format is left alone', () => {
    const cur = { v: 2, xp: 90, course: 'py', start: { py: 'new', cpp: 'c' }, cxp: { py: 60, cpp: 30 }, play: { py: 'print(1)' },
      done: { 'py/hello/first': { at: 1 }, 'cpp/b-first/hello': { at: 2 } }, quiz: { 'py/hello': 100 }, mistakes: {}, solved: {}, bookmarks: { 'g:py:list': { at: 1, note: '' } }, ach: {} };
    assert.deepEqual(migrate(cur, IDS), cur);
  });
});

describe('edge cases', () => {
  test('a first-time visitor gets no course, so the language picker shows', () => {
    const s = migrate({}, IDS);
    assert.equal(s.course, null);
    assert.deepEqual(s.cxp, {});
    assert.deepEqual(s.start, {});
    assert.deepEqual(s.done, {});
  });

  test('nothing saved at all (null) is handled', () => assert.deepEqual(migrate(null, IDS), {}));

  test('an old tab that saved old-style keys next to new ones is healed, keeping the best score', () => {
    const mixed = { v: 2, xp: 50, course: 'c', start: { c: 'new' }, cxp: { c: 50 },
      done: { 'c/hello/first': { at: 1 }, 'hello/printf': { at: 9 } }, quiz: { 'c/hello': 70, hello: 90 }, mistakes: { 'c/hello/first/1': 1, 'hello/first/1': 3 } };
    const s = migrate(mixed, IDS);
    assert.deepEqual(Object.keys(s.done).sort(), ['c/hello/first', 'c/hello/printf']);
    assert.deepEqual(s.quiz, { 'c/hello': 90 });
    assert.deepEqual(s.mistakes, { 'c/hello/first/1': 3 });
  });

  test('a saved course that no longer exists falls back to the picker without losing progress', () => {
    const s = migrate({ v: 2, xp: 10, course: 'rust', done: { 'c/hello/first': { at: 1 } } }, IDS);
    assert.equal(s.course, null);
    assert.ok(s.done['c/hello/first']);
  });

  test('damaged fields are replaced with empty ones instead of crashing', () => {
    const s = migrate({ xp: 'lots', done: null, quiz: 5, bookmarks: [], play: 7, cxp: 'x', start: null }, IDS);
    assert.deepEqual([s.done, s.quiz, s.bookmarks, s.play, s.cxp, s.start], [{}, {}, {}, {}, {}, {}]);
  });
});
