// Tests for firestore.rules, run against the local Firestore emulator.
//   npm run test:rules
// The emulator uses a "demo-" project, so these tests never touch the real database.
import { test, describe, before, after, beforeEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where, orderBy, limit, getCountFromServer, serverTimestamp, Timestamp, setLogLevel } from 'firebase/firestore';

setLogLevel('silent');   // denied writes are expected here; don't print each one as an SDK error

// Load the real document builder from the site, so the tests check exactly what the site sends.
globalThis.window = { FIREBASE_CONFIG: null, dispatchEvent() {} };
const { toDocument, boardJoin, boardStep, boardPatch, isValidName } = await import(pathToFileURL('public/cloud.js').href);

const ALICE = 'alice', BOB = 'bob';
// A timestamp made by the client. 5 s in the future so it can never equal the server's request.time
// (on a local emulator, Timestamp.now() occasionally lands in the same millisecond and passes).
const clientTime = () => Timestamp.fromMillis(Date.now() + 5000);
let env;

const progress = (extra = {}) => ({ xp: 120, streak: 3, done: { 'hello/first': { at: 1 } }, bookmarks: {}, play: '', ...extra });
const valid = () => toDocument(progress(), serverTimestamp());
const as = uid => (uid ? env.authenticatedContext(uid) : env.unauthenticatedContext()).firestore();
const userDoc = (db, uid) => doc(db, 'users', uid);

// Put a document in place directly, bypassing the rules (as if it had been saved earlier).
const seed = (uid, secondsAgo = 60, data = {}) => env.withSecurityRulesDisabled(ctx =>
  setDoc(userDoc(ctx.firestore(), uid), { json: '{"xp":1}', xp: 1, updatedAt: Timestamp.fromMillis(Date.now() - secondsAgo * 1000), ...data }));

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-c-quest',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  });
});
after(() => env.cleanup());
beforeEach(() => env.clearFirestore());

describe('the site\'s own saves are accepted', () => {
  test('first save creates the document', async () => {
    await assertSucceeds(setDoc(userDoc(as(ALICE), ALICE), valid()));
  });

  test('a later save updates it', async () => {
    await seed(ALICE, 60);
    await assertSucceeds(setDoc(userDoc(as(ALICE), ALICE), valid()));
  });

  test('a fully completed course with notes and Playground code still fits', async () => {
    const big = progress({ play: 'int main(void) { return 0; }\n'.repeat(600), bookmarks: Object.fromEntries(Array.from({ length: 150 }, (_, i) => [`t/l/${i}`, { at: 1, note: 'n'.repeat(500) }])) });
    const data = toDocument(big, serverTimestamp());
    assert(data && data.json.length > 90000, 'expected a large document');
    await assertSucceeds(setDoc(userDoc(as(ALICE), ALICE), data));
  });

  test('oversized progress drops the Playground code instead of failing', async () => {
    const data = toDocument(progress({ play: 'x'.repeat(400000) }), serverTimestamp());
    assert(data && data.json.length <= 300000 && !data.json.includes('xxxx'));
    await assertSucceeds(setDoc(userDoc(as(ALICE), ALICE), data));
  });

  test('a user can read their own progress', async () => {
    await seed(ALICE);
    await assertSucceeds(getDoc(userDoc(as(ALICE), ALICE)));
  });

  test('a user cannot delete their progress (delete + re-create would dodge the rate limit)', async () => {
    await seed(ALICE);
    await assertFails(deleteDoc(userDoc(as(ALICE), ALICE)));
  });
});

describe('other people\'s data is off limits', () => {
  test('signed-out visitors cannot read', async () => {
    await seed(ALICE);
    await assertFails(getDoc(userDoc(as(null), ALICE)));
  });

  test('signed-out visitors cannot write', async () => {
    await assertFails(setDoc(userDoc(as(null), ALICE), valid()));
  });

  test('another user cannot read', async () => {
    await seed(ALICE);
    await assertFails(getDoc(userDoc(as(BOB), ALICE)));
  });

  test('another user cannot create, overwrite or delete', async () => {
    await assertFails(setDoc(userDoc(as(BOB), ALICE), valid()));
    await seed(ALICE);
    await assertFails(setDoc(userDoc(as(BOB), ALICE), valid()));
    await assertFails(deleteDoc(userDoc(as(BOB), ALICE)));
  });

  test('nobody can list the users collection, not even signed in', async () => {
    await seed(ALICE); await seed(BOB);
    await assertFails(getDocs(collection(as(ALICE), 'users')));
    await assertFails(getDocs(query(collection(as(ALICE), 'users'), where('xp', '>', 0))));
  });

  test('other collections are closed', async () => {
    await assertFails(setDoc(doc(as(ALICE), 'admins', ALICE), { xp: 1 }));
    await assertFails(getDoc(doc(as(ALICE), 'admins', ALICE)));
    await assertFails(setDoc(doc(as(ALICE), 'users', ALICE, 'extra', 'x'), { a: 1 }));
  });
});

describe('documents must have the exact expected shape', () => {
  const tryWrite = data => setDoc(userDoc(as(ALICE), ALICE), { ...valid(), ...data });

  test('extra fields are rejected', () => assertFails(tryWrite({ isAdmin: true })));
  test('missing fields are rejected', async () => {
    const { xp, ...noXp } = valid();
    await assertFails(setDoc(userDoc(as(ALICE), ALICE), noXp));
  });
  test('json must be a string', () => assertFails(tryWrite({ json: { xp: 1 } })));
  test('json must not be empty', () => assertFails(tryWrite({ json: '' })));
  test('json over 300,000 characters is rejected', () => assertFails(tryWrite({ json: 'x'.repeat(300001) })));
  test('json of exactly 300,000 characters is accepted', () => assertSucceeds(tryWrite({ json: 'x'.repeat(300000) })));
  test('xp must be a whole number', () => assertFails(tryWrite({ xp: 1.5 })));
  test('xp cannot be a string', () => assertFails(tryWrite({ xp: '9999' })));
  test('xp cannot be negative', () => assertFails(tryWrite({ xp: -1 })));
  test('xp has a sane upper limit', () => assertFails(tryWrite({ xp: 10000001 })));
  test('updatedAt must come from the server, not the client', () => assertFails(tryWrite({ updatedAt: clientTime() })));
  test('updatedAt cannot be backdated', () => assertFails(tryWrite({ updatedAt: Timestamp.fromMillis(0) })));
  test('partial updates must still leave a valid document', async () => {
    await seed(ALICE, 60);
    await assertFails(updateDoc(userDoc(as(ALICE), ALICE), { xp: 5 }));                       // updatedAt not refreshed
    await assertFails(updateDoc(userDoc(as(ALICE), ALICE), { cheat: 1, updatedAt: serverTimestamp() }));
  });
});

describe('saving is rate-limited to protect the shared daily quota', () => {
  test('a second save within 5 seconds is rejected', async () => {
    await seed(ALICE, 1);
    await assertFails(setDoc(userDoc(as(ALICE), ALICE), valid()));
  });

  test('a save after 5 seconds is accepted', async () => {
    await seed(ALICE, 6);
    await assertSucceeds(setDoc(userDoc(as(ALICE), ALICE), valid()));
  });

  test('two saves back to back: the first succeeds, the second is rejected', async () => {
    const db = as(ALICE);
    await assertSucceeds(setDoc(userDoc(db, ALICE), valid()));
    await assertFails(setDoc(userDoc(db, ALICE), valid()));
  });

  test('the limit cannot be dodged by deleting and re-creating', async () => {
    await seed(ALICE, 1);
    await assertFails(deleteDoc(userDoc(as(ALICE), ALICE)));
    await assertFails(setDoc(userDoc(as(ALICE), ALICE), valid()));
  });
});

/* ================= leaderboard ================= */

const HOUR = 3600 * 1000;
const boardDoc = (db, uid) => doc(db, 'leaderboard', uid);
const entry = (extra = {}) => ({ name: 'PointerPro', visible: true, xp: 300, dayXp: 0, streak: 4, ...extra });
// A stored entry last written `msAgo` ago. Defaults to just over a minute, on the same UTC day where possible.
const sameDayAgo = () => Math.min(61000, Date.now() % (24 * HOUR) - 1000);
const seedBoard = (uid, data = {}, msAgo = 61000) => env.withSecurityRulesDisabled(ctx =>
  setDoc(boardDoc(ctx.firestore(), uid), { ...entry(), ...data, updatedAt: Timestamp.fromMillis(Date.now() - msAgo) }));
const stored = (data = {}, msAgo = 61000) => ({ ...entry(), ...data, updatedAtMs: Date.now() - msAgo });
const write = (uid, data) => setDoc(boardDoc(as(uid), uid), { ...data, updatedAt: serverTimestamp() });
const visibleTop = db => query(collection(db, 'leaderboard'), where('visible', '==', true), orderBy('xp', 'desc'), limit(25));

describe('leaderboard: joining', () => {
  test('the site\'s join entry is accepted', () => assertSucceeds(write(ALICE, boardJoin('PointerPro', 900, 3))));
  test('existing XP above a full course is capped on joining (and catches up later)', async () => {
    const join = boardJoin('Veteran', 9000, 80);
    assert(join.xp === 1500 && join.streak === 30 && join.dayXp === 0);
    await assertSucceeds(write(ALICE, join));
  });
  test('joining with more than 1,500 XP is rejected', () => assertFails(write(ALICE, entry({ xp: 1501 }))));
  test('joining with a head start on dayXp is rejected', () => assertFails(write(ALICE, entry({ dayXp: 10 }))));
  test('joining with a streak above 30 is rejected', () => assertFails(write(ALICE, entry({ streak: 31 }))));
  test('joining hidden is rejected', () => assertFails(write(ALICE, entry({ visible: false }))));
  test('nobody can create an entry for someone else', () => assertFails(write(BOB, entry()).then(() => setDoc(boardDoc(as(BOB), ALICE), { ...entry(), updatedAt: serverTimestamp() }))));
  test('signed-out visitors cannot join', () => assertFails(setDoc(boardDoc(as(null), ALICE), { ...entry(), updatedAt: serverTimestamp() })));
});

describe('leaderboard: nicknames', () => {
  const good = ['Ada', 'PointerPro', 'jamie_r', 'C.Wizard', 'Seg-Fault 9', 'a'.repeat(20)];
  const bad = ['ab', 'a'.repeat(21), ' Ada', 'Ada ', '_Ada', 'Ada!', '<script>', 'Ünïcode', 'two\nlines', '', 42];
  test('the site and the rules agree on valid names', async () => {
    for (const n of good) { assert(isValidName(n), 'site rejected ' + n); await env.clearFirestore(); await assertSucceeds(write(ALICE, entry({ name: n }))); }
  });
  test('invalid names are rejected by the site and the rules', async () => {
    for (const n of bad) { assert(!isValidName(n), 'site accepted ' + JSON.stringify(n)); await assertFails(write(ALICE, entry({ name: n }))); }
  });
});

describe('leaderboard: reading', () => {
  test('signed-in users can read the visible top 25', async () => {
    await seedBoard(ALICE); await seedBoard(BOB, { name: 'Bobby', xp: 500 });
    const snap = await assertSucceeds(getDocs(visibleTop(as('carol'))));
    assert(snap.docs.map(d => d.id).join() === 'bob,alice', 'expected bob then alice');
  });
  test('signed-out visitors cannot read it', async () => {
    await seedBoard(ALICE);
    await assertFails(getDocs(visibleTop(as(null))));
    await assertFails(getDoc(boardDoc(as(null), ALICE)));
  });
  test('queries must ask for visible entries only', async () => {
    await seedBoard(ALICE);
    await assertFails(getDocs(query(collection(as(BOB), 'leaderboard'), orderBy('xp', 'desc'))));
  });
  test('the "your rank" count query is allowed', async () => {
    await seedBoard(ALICE, { xp: 900 }); await seedBoard(BOB, { xp: 100 });
    const above = await assertSucceeds(getCountFromServer(query(collection(as(BOB), 'leaderboard'), where('visible', '==', true), where('xp', '>', 100))));
    assert(above.data().count === 1);
  });
  test('a hidden entry is private to its owner', async () => {
    await seedBoard(ALICE, { visible: false });
    await assertFails(getDoc(boardDoc(as(BOB), ALICE)));
    await assertSucceeds(getDoc(boardDoc(as(ALICE), ALICE)));
    const snap = await getDocs(visibleTop(as(BOB)));
    assert(snap.empty, 'hidden entry appeared in the list');
  });
});

describe('leaderboard: updates follow the rules', () => {
  test('a normal step from the site is accepted', async () => {
    await seedBoard(ALICE, {}, sameDayAgo());
    await assertSucceeds(write(ALICE, boardStep(stored({}, sameDayAgo()), { name: 'PointerPro', visible: true, xp: 340, streak: 4 }, Date.now())));
  });
  test('only one update a minute', async () => {
    await seedBoard(ALICE, {}, 30000);
    await assertFails(write(ALICE, boardPatch(stored({}, 30000), { name: 'Renamed' }, Date.now())));
  });
  test('more than 200 XP in one update is rejected', async () => {
    await seedBoard(ALICE, {}, sameDayAgo());
    await assertFails(write(ALICE, entry({ xp: 501, dayXp: 201 })));
  });
  test('more than 600 XP in one UTC day is rejected', async () => {
    await seedBoard(ALICE, { dayXp: 550 }, sameDayAgo());
    await assertFails(write(ALICE, entry({ xp: 400, dayXp: 650 })));
  });
  test('dayXp must add up exactly', async () => {
    await seedBoard(ALICE, { dayXp: 100 }, sameDayAgo());
    await assertFails(write(ALICE, entry({ xp: 350, dayXp: 100 })));       // gained 50 but did not count it
    await assertFails(write(ALICE, entry({ xp: 350, dayXp: 0 })));         // tried to reset the daily count
    await assertSucceeds(write(ALICE, entry({ xp: 350, dayXp: 150 })));
  });
  test('the daily allowance resets on a new UTC day', async () => {
    await seedBoard(ALICE, { dayXp: 600 }, 36 * HOUR);
    await assertSucceeds(write(ALICE, entry({ xp: 500, dayXp: 200 })));
  });
  test('XP can fall (after a reset) without using the daily allowance', async () => {
    await seedBoard(ALICE, { dayXp: 120 }, sameDayAgo());
    await assertSucceeds(write(ALICE, entry({ xp: 0, dayXp: 120 })));
  });
  test('a streak can rise by 1 on a new day', async () => {
    await seedBoard(ALICE, {}, 36 * HOUR);
    await assertSucceeds(write(ALICE, entry({ streak: 5 })));
  });
  test('a streak cannot rise twice on the same day', async () => {
    await seedBoard(ALICE, {}, sameDayAgo());
    await assertFails(write(ALICE, entry({ streak: 5 })));
  });
  test('a brand-new streak can start on the day of joining (found in browser testing)', async () => {
    await seedBoard(ALICE, { streak: 0 }, sameDayAgo());
    const next = boardStep(stored({ streak: 0 }, sameDayAgo()), { name: 'PointerPro', visible: true, xp: 302, streak: 1 }, Date.now());
    assert(next.streak === 1, 'site did not send the new streak');
    await assertSucceeds(write(ALICE, next));
  });
  test('...but cannot then reach 2 on the same day', async () => {
    await seedBoard(ALICE, { streak: 1 }, sameDayAgo());
    await assertFails(write(ALICE, entry({ streak: 2 })));
  });
  test('a streak cannot jump by 2', async () => {
    await seedBoard(ALICE, {}, 36 * HOUR);
    await assertFails(write(ALICE, entry({ streak: 6 })));
  });
  test('a broken streak can drop to 0', async () => {
    await seedBoard(ALICE, { streak: 12 }, sameDayAgo());
    await assertSucceeds(write(ALICE, entry({ streak: 0 })));
  });
  test('extra fields and client timestamps are rejected', async () => {
    await seedBoard(ALICE);
    await assertFails(write(ALICE, { ...entry(), admin: true }));
    await assertFails(setDoc(boardDoc(as(ALICE), ALICE), { ...entry(), updatedAt: clientTime() }));
  });
  test('nobody can edit someone else\'s entry', async () => {
    await seedBoard(ALICE);
    await assertFails(setDoc(boardDoc(as(BOB), ALICE), { ...entry({ xp: 0 }), updatedAt: serverTimestamp() }));
  });
});

describe('leaderboard: rename, leave and rejoin', () => {
  test('renaming keeps XP and is accepted', async () => {
    await seedBoard(ALICE, { dayXp: 80 }, sameDayAgo());
    await assertSucceeds(write(ALICE, boardPatch(stored({ dayXp: 80 }, sameDayAgo()), { name: 'NewName' }, Date.now())));
  });
  test('leaving hides the entry; rejoining shows it again', async () => {
    await seedBoard(ALICE, {}, sameDayAgo());
    await assertSucceeds(write(ALICE, boardPatch(stored({}, sameDayAgo()), { visible: false }, Date.now())));
    assert((await getDocs(visibleTop(as(BOB)))).empty, 'still listed after leaving');
    await seedBoard(ALICE, { visible: false }, sameDayAgo());                 // a minute later
    await assertSucceeds(write(ALICE, boardPatch(stored({ visible: false }, sameDayAgo()), { visible: true }, Date.now())));
    assert((await getDocs(visibleTop(as(BOB)))).size === 1, 'not listed after rejoining');
  });
  test('entries cannot be deleted (that would dodge the limits)', async () => {
    await seedBoard(ALICE);
    await assertFails(deleteDoc(boardDoc(as(ALICE), ALICE)));
  });
});

describe('leaderboard: the site\'s catch-up never breaks the rules', () => {
  // Drive the real client logic (boardStep) from a capped join up to 2,000 XP and a 33-day streak,
  // jumping the clock forward between writes, and check every single write is accepted.
  test('every step the site would send is accepted, and caps hold', async () => {
    const want = { name: 'Veteran', visible: true, xp: 2000, streak: 33 };
    const join = boardJoin(want.name, want.xp, want.streak);
    await assertSucceeds(write(ALICE, join));
    let cur = { ...join }, gap = sameDayAgo(), writes = 0, days = 0;
    while (true) {
      const old = { ...cur, updatedAtMs: Date.now() - gap };
      await env.withSecurityRulesDisabled(ctx => setDoc(boardDoc(ctx.firestore(), ALICE), { ...cur, updatedAt: Timestamp.fromMillis(old.updatedAtMs) }));
      const next = boardStep(old, want, Date.now());
      if (!next) {
        if (cur.xp === want.xp && cur.streak === want.streak) break;
        gap = 36 * HOUR; days++; continue;                                  // capped for today: come back tomorrow
      }
      await assertSucceeds(write(ALICE, next));
      assert(next.xp - cur.xp <= 200 && next.dayXp <= 600, 'a cap was exceeded');
      cur = next; writes++; gap = gap === 36 * HOUR ? sameDayAgo() : gap;
      assert(writes < 100, 'did not converge');
    }
    assert(cur.xp === 2000 && cur.streak === 33, 'did not reach the target');
    // XP (500 short) catches up the same day; the streak (30 -> 33) can only rise by 1 a day.
    assert(days === 3, `expected three more days to catch up, took ${days}`);
  });
});

function assert(ok, msg = 'assertion failed') { if (!ok) throw new Error(msg); }
