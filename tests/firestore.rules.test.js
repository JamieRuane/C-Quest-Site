// Tests for firestore.rules, run against the local Firestore emulator.
//   npm run test:rules
// The emulator uses a "demo-" project, so these tests never touch the real database.
import { test, describe, before, after, beforeEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where, serverTimestamp, Timestamp, setLogLevel } from 'firebase/firestore';

setLogLevel('silent');   // denied writes are expected here; don't print each one as an SDK error

// Load the real document builder from the site, so the tests check exactly what the site sends.
globalThis.window = { FIREBASE_CONFIG: null, dispatchEvent() {} };
const { toDocument } = await import(pathToFileURL('public/cloud.js').href);

const ALICE = 'alice', BOB = 'bob';
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

  test('a user can delete their own progress', async () => {
    await seed(ALICE);
    await assertSucceeds(deleteDoc(userDoc(as(ALICE), ALICE)));
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
    await assertFails(setDoc(doc(as(ALICE), 'leaderboard', ALICE), { xp: 1 }));
    await assertFails(getDoc(doc(as(ALICE), 'leaderboard', ALICE)));
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
  test('updatedAt must come from the server, not the client', () => assertFails(tryWrite({ updatedAt: Timestamp.now() })));
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

  test('deleting is never rate-limited', async () => {
    await seed(ALICE, 0);
    await assertSucceeds(deleteDoc(userDoc(as(ALICE), ALICE)));
  });
});

function assert(ok, msg = 'assertion failed') { if (!ok) throw new Error(msg); }
