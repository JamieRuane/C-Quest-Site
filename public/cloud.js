// Accounts + cloud progress (Firebase). Does nothing until firebase-config.js is filled in.
// Exposes window.Cloud and fires two window events: 'cloud-ready' (once) and 'cloud-auth' (detail = user or null).
//
// Every write must pass firestore.rules. In particular the rules allow at most one save every
// 5 seconds per user and cap the progress JSON at 300,000 characters - keep these in sync.
const MIN_GAP_MS = 5000 + 500;    // rules: 5 s between saves (+ margin for clock differences)
const BATCH_MS = 1500;            // wait this long after a change so rapid changes become one write
const MAX_JSON = 300000;          // rules: json.size() <= 300000

const cfg = window.FIREBASE_CONFIG;
const Cloud = window.Cloud = {
  enabled: !!(cfg && cfg.apiKey), user: null,
  signIn: async () => {}, signOut: async () => {}, load: async () => null, save: () => {}, flush: async () => {},
};

// Turn the progress object into the exact document shape the rules accept.
// If it is too big, drop the Playground code (it stays in this browser) before giving up.
export function toDocument(state, serverTime) {
  let json = JSON.stringify(state);
  if (json.length > MAX_JSON) json = JSON.stringify({ ...state, play: '' });
  if (json.length > MAX_JSON) return null;
  const xp = Number.isFinite(state.xp) ? Math.min(10000000, Math.max(0, Math.floor(state.xp))) : 0;
  return { json, xp, updatedAt: serverTime };
}

if (Cloud.enabled) {
  try {
    const V = 'https://www.gstatic.com/firebasejs/10.12.2/';
    const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }, { getFirestore, doc, getDoc, setDoc, serverTimestamp }] =
      await Promise.all([import(V + 'firebase-app.js'), import(V + 'firebase-auth.js'), import(V + 'firebase-firestore.js')]);

    const app = initializeApp(cfg), auth = getAuth(app), db = getFirestore(app);
    const ref = () => doc(db, 'users', Cloud.user.uid);     // one small document per user
    let pending = null, timer = null, lastWrite = 0, failures = 0, warnedSize = false;
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // Schedule the next write: after the batching delay, but never sooner than the rules allow.
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

    // Send the latest state. With { wait: true } (sign-out) it waits out the rate limit instead of skipping.
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
        pending = pending || state;                       // keep the newest state for the retry
        failures++;
        lastWrite = Date.now();                           // treat as a write attempt for spacing
        if (!wait) schedule(Math.min(60000, 2000 * 2 ** failures));   // back off: 4 s, 8 s ... 60 s
      }
    };
    Cloud.save = state => { pending = state; schedule(); };
    document.addEventListener('visibilitychange', () => { if (document.hidden) Cloud.flush(); });

    onAuthStateChanged(auth, u => {
      clearTimeout(timer); timer = null; pending = null; lastWrite = 0; failures = 0;
      Cloud.user = u ? { uid: u.uid, displayName: u.displayName, email: u.email } : null;
      window.dispatchEvent(new CustomEvent('cloud-auth', { detail: Cloud.user }));
    });
  } catch (e) {
    console.warn('Firebase could not be loaded - continuing without accounts', e);
    Cloud.enabled = false;
  }
}
window.dispatchEvent(new Event('cloud-ready'));
