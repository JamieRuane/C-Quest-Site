// Accounts, cloud progress and the leaderboard (Firebase). Does nothing until firebase-config.js is filled in.
// Exposes window.Cloud and fires window events:
//   'cloud-ready' (once)   'cloud-auth' (detail = user or null)   'board-change' (own leaderboard entry changed)
//
// Every write must pass firestore.rules. The limits below mirror the rules - keep them in sync.
const MIN_GAP_MS = 5000 + 500;         // rules: 5 s between progress saves (+ margin for clock differences)
const BOARD_GAP_MS = 60000 + 1000;     // rules: 60 s between leaderboard saves
const BATCH_MS = 1500;                 // wait this long after a change so rapid changes become one write
const MAX_JSON = 300000;               // rules: json.size() <= 300000
const BOARD = { joinXp: 1500, joinStreak: 30, stepXp: 200, dayXp: 600, maxStreak: 3650 };
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9 _.-]{1,18}[A-Za-z0-9]$/;
const DAY_MS = 86400000;

const cfg = window.FIREBASE_CONFIG;
const Cloud = window.Cloud = {
  enabled: !!(cfg && cfg.apiKey), user: null, board: { entry: null, loaded: false },
  signIn: async () => {}, signOut: async () => {}, load: async () => null, save: () => {}, flush: async () => {},
  joinBoard: async () => {}, leaveBoard: async () => {}, renameBoard: async () => {},
  topBoard: async () => [], boardRank: async () => null,
};

/* ---------- pure helpers (also used by tests/firestore.rules.test.js) ---------- */

// The exact progress document shape the rules accept. If it is too big, drop the
// Playground code (it stays in this browser) before giving up.
export function toDocument(state, serverTime) {
  let json = JSON.stringify(state);
  if (json.length > MAX_JSON) json = JSON.stringify({ ...state, play: '' });
  if (json.length > MAX_JSON) return null;
  return { json, xp: clampInt(state.xp, 0, 10000000), updatedAt: serverTime };
}

export const isValidName = name => typeof name === 'string' && NAME_RE.test(name);
export const cleanName = name => String(name || '').replace(/\s+/g, ' ').trim();

// The streak as it stands today: it only counts if the learner practised today or yesterday (local time).
export function liveStreak(state, now = new Date()) {
  const key = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  return state.last === key(now) || state.last === key(yesterday) ? clampInt(state.streak, 0, BOARD.maxStreak) : 0;
}

// First leaderboard entry. XP and streak start capped and catch up later.
export function boardJoin(name, xp, streak) {
  return { name, visible: true, xp: Math.min(clampInt(xp, 0, 1e7), BOARD.joinXp), dayXp: 0, streak: Math.min(clampInt(streak, 0, BOARD.maxStreak), BOARD.joinStreak) };
}

// Next leaderboard entry on the way from `old` (as stored, updatedAtMs = last write) towards `target`
// ({ name, visible, xp, streak }), moving only as far as the rules allow. Returns null if nothing would change.
export function boardStep(old, target, nowMs) {
  const sameDay = Math.floor(old.updatedAtMs / DAY_MS) === Math.floor(nowMs / DAY_MS);    // UTC days, like the rules
  const base = sameDay ? old.dayXp : 0;
  const want = clampInt(target.xp, 0, 1e7);
  let xp, dayXp;
  if (want <= old.xp) { xp = want; dayXp = base; }                                       // XP can always fall (reset)
  else {
    const gain = Math.max(0, Math.min(want - old.xp, BOARD.stepXp, BOARD.dayXp - base));
    xp = old.xp + gain; dayXp = base + gain;
  }
  const wantStreak = clampInt(target.streak, 0, BOARD.maxStreak);
  const streak = wantStreak <= old.streak ? wantStreak : sameDay && old.streak > 0 ? old.streak : old.streak + 1;
  const next = { name: target.name, visible: target.visible, xp, dayXp, streak };
  const same = next.name === old.name && next.visible === old.visible && xp === old.xp && streak === old.streak;
  return same ? null : next;
}

// Same XP and streak, different name and/or visibility (rename, leave, rejoin). dayXp follows the UTC day.
export function boardPatch(old, { name = old.name, visible = old.visible }, nowMs) {
  const sameDay = Math.floor(old.updatedAtMs / DAY_MS) === Math.floor(nowMs / DAY_MS);
  return { name, visible, xp: old.xp, dayXp: sameDay ? old.dayXp : 0, streak: old.streak };
}

Object.assign(Cloud, { isValidName, cleanName });   // for app.js, which is not a module

function clampInt(n, lo, hi) { return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.floor(n))) : lo; }

/* ---------- Firebase ---------- */

if (Cloud.enabled) {
  try {
    const V = 'https://www.gstatic.com/firebasejs/10.12.2/';
    const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, connectAuthEmulator },
      { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, where, orderBy, limit, getDocs, getCountFromServer, connectFirestoreEmulator }] =
      await Promise.all([import(V + 'firebase-app.js'), import(V + 'firebase-auth.js'), import(V + 'firebase-firestore.js')]);

    // Development only: http://localhost:4321/?emulator talks to the local emulators (`npm run emulators`)
    // with fake accounts, so features can be tried without touching the real database.
    const EMU = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('emulator');
    const app = initializeApp(EMU ? { ...cfg, projectId: 'demo-c-quest' } : cfg), auth = getAuth(app), db = getFirestore(app);
    if (EMU) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
      console.info('Code Quest is using the local Firebase emulators.');
    }
    const ref = () => doc(db, 'users', Cloud.user.uid);
    const boardRef = () => doc(db, 'leaderboard', Cloud.user.uid);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const boardChanged = () => window.dispatchEvent(new Event('board-change'));

    /* ----- progress ----- */
    let pending = null, timer = null, lastWrite = 0, failures = 0, warnedSize = false;
    const schedule = (extra = 0) => {
      if (timer) return;
      const wait = Math.max(BATCH_MS, lastWrite + MIN_GAP_MS - Date.now()) + extra;
      timer = setTimeout(() => { timer = null; Cloud.flush(); }, wait);
    };

    Cloud.signIn = () => signInWithPopup(auth, new GoogleAuthProvider());
    Cloud.signOut = async () => { await Cloud.flush({ wait: true }); await signOut(auth); };
    Cloud.load = async () => {
      const snap = await getDoc(ref());
      if (snap.exists() && snap.data().updatedAt) lastWrite = snap.data().updatedAt.toMillis();
      return snap.exists() && snap.data().json ? JSON.parse(snap.data().json) : null;
    };

    // Send the latest progress. With { wait: true } (sign-out) it waits out the rate limit instead of skipping.
    Cloud.flush = async ({ wait = false } = {}) => {
      clearTimeout(timer); timer = null;
      if (!pending || !Cloud.user) return;
      const tooSoon = lastWrite + MIN_GAP_MS - Date.now();
      if (tooSoon > 0) { if (!wait) return schedule(); await sleep(tooSoon); }
      const state = pending; pending = null;
      const data = toDocument(state, serverTimestamp());
      if (!data) {
        if (!warnedSize) { warnedSize = true; console.warn('Progress is too large to sync; it is kept in this browser.'); }
        return;
      }
      try {
        await setDoc(ref(), data);
        lastWrite = Date.now(); failures = 0;
      } catch (e) {
        console.warn('cloud save failed, will retry', e);
        pending = pending || state;
        failures++; lastWrite = Date.now();
        if (!wait) schedule(Math.min(60000, 2000 * 2 ** failures));      // back off: 4 s, 8 s ... 60 s
      }
    };
    Cloud.save = state => { pending = state; schedule(); queueBoard(state); };
    document.addEventListener('visibilitychange', () => { if (document.hidden) Cloud.flush(); });

    /* ----- leaderboard: own entry ----- */
    let target = null, bTimer = null, bLast = 0, bFailures = 0, bBusy = null;
    const fromSnap = s => { const d = s.data(); return { name: d.name, visible: d.visible, xp: d.xp, dayXp: d.dayXp, streak: d.streak, updatedAtMs: d.updatedAt ? d.updatedAt.toMillis() : 0 }; };

    function queueBoard(state) {
      const e = Cloud.board.entry;
      if (!e || !e.visible) return;
      target = { name: e.name, visible: true, xp: state.xp || 0, streak: liveStreak(state) };
      scheduleBoard();
    }
    function scheduleBoard(extra = 0) {
      if (bTimer || !target) return;
      const wait = Math.max(BATCH_MS, bLast + BOARD_GAP_MS - Date.now()) + extra;
      bTimer = setTimeout(() => { bTimer = null; flushBoard(); }, wait);
    }
    // Write one rules-sized step towards the target; keep stepping (once a minute) until caught up.
    async function flushBoard() {
      const e = Cloud.board.entry;
      if (!target || !e || !Cloud.user || bBusy) return;
      if (bLast + BOARD_GAP_MS > Date.now()) return scheduleBoard();
      const next = boardStep(e, target, Date.now());
      if (!next) { target = null; return; }
      try {
        bBusy = setDoc(boardRef(), { ...next, updatedAt: serverTimestamp() }); await bBusy;
        Cloud.board.entry = { ...next, updatedAtMs: Date.now() }; bLast = Date.now(); bFailures = 0; boardChanged();
        if (boardStep(Cloud.board.entry, target, Date.now() + BOARD_GAP_MS)) scheduleBoard(); else target = null;
      } catch (err) {
        console.warn('leaderboard save failed, will retry', err);
        bFailures++; bLast = Date.now();
        scheduleBoard(Math.min(300000, 5000 * 2 ** bFailures));
      } finally { bBusy = null; }
    }
    // Join / rename / leave write straight away, waiting out the 60-second limit if needed.
    async function writeBoardNow(make) {
      if (bBusy) await bBusy.catch(() => {});
      clearTimeout(bTimer); bTimer = null;
      const wait = bLast + BOARD_GAP_MS - Date.now();
      if (wait > 0) await sleep(wait);
      const data = make(Cloud.board.entry);
      bBusy = setDoc(boardRef(), { ...data, updatedAt: serverTimestamp() });
      try { await bBusy; } finally { bBusy = null; }
      Cloud.board.entry = { ...data, updatedAtMs: Date.now() }; bLast = Date.now(); boardChanged();
    }
    Cloud.boardWait = () => Math.max(0, bLast + BOARD_GAP_MS - Date.now());
    const checkedName = name => { const n = cleanName(name); if (!isValidName(n)) throw new Error('bad-name'); return n; };
    Cloud.joinBoard = async (name, state) => {
      const n = checkedName(name);
      await writeBoardNow(old => !old ? boardJoin(n, state.xp, liveStreak(state))
        : boardStep(old, { name: n, visible: true, xp: state.xp, streak: liveStreak(state) }, Date.now()) || boardPatch(old, { name: n, visible: true }, Date.now()));
      queueBoard(state);                     // keep catching up if XP was capped on joining
    };
    Cloud.renameBoard = async name => { const n = checkedName(name); await writeBoardNow(old => boardPatch(old, { name: n }, Date.now())); };
    Cloud.leaveBoard = async () => { target = null; await writeBoardNow(old => boardPatch(old, { visible: false }, Date.now())); };

    /* ----- leaderboard: reading ----- */
    const col = () => collection(db, 'leaderboard');
    let topCache = null;
    Cloud.topBoard = async ({ force = false } = {}) => {
      if (!force && topCache && Date.now() - topCache.at < 60000) return topCache.rows;
      const snap = await getDocs(query(col(), where('visible', '==', true), orderBy('xp', 'desc'), limit(25)));
      const rows = snap.docs.map(d => ({ uid: d.id, ...fromSnap(d) }));
      topCache = { at: Date.now(), rows };
      return rows;
    };
    Cloud.boardRank = async xp => {
      const [above, all] = await Promise.all([
        getCountFromServer(query(col(), where('visible', '==', true), where('xp', '>', xp))),
        getCountFromServer(query(col(), where('visible', '==', true))),
      ]);
      return { rank: above.data().count + 1, total: all.data().count };
    };

    onAuthStateChanged(auth, async u => {
      clearTimeout(timer); timer = null; pending = null; lastWrite = 0; failures = 0;
      clearTimeout(bTimer); bTimer = null; target = null; bLast = 0; bFailures = 0; topCache = null;
      Cloud.user = u ? { uid: u.uid, displayName: u.displayName, email: u.email } : null;
      Cloud.board = { entry: null, loaded: false };
      if (u) {
        try {
          const s = await getDoc(boardRef());
          if (s.exists()) { Cloud.board.entry = fromSnap(s); bLast = Cloud.board.entry.updatedAtMs; }
        } catch (e) { console.warn('could not load leaderboard entry', e); }
        Cloud.board.loaded = true;
      }
      window.dispatchEvent(new CustomEvent('cloud-auth', { detail: Cloud.user }));
    });
  } catch (e) {
    console.warn('Firebase could not be loaded - continuing without accounts', e);
    Cloud.enabled = false;
  }
}
window.dispatchEvent(new Event('cloud-ready'));
