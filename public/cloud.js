// Accounts + cloud progress (Firebase). Does nothing until firebase-config.js is filled in.
// Exposes window.Cloud and fires two window events: 'cloud-ready' (once) and 'cloud-auth' (detail = user or null).
const cfg = window.FIREBASE_CONFIG;
const Cloud = window.Cloud = {
  enabled: !!(cfg && cfg.apiKey), user: null,
  signIn: async () => {}, signOut: async () => {}, load: async () => null, save: () => {}, flush: async () => {},
};

if (Cloud.enabled) {
  try {
    const V = 'https://www.gstatic.com/firebasejs/10.12.2/';
    const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }, { getFirestore, doc, getDoc, setDoc, serverTimestamp }] =
      await Promise.all([import(V + 'firebase-app.js'), import(V + 'firebase-auth.js'), import(V + 'firebase-firestore.js')]);

    const app = initializeApp(cfg), auth = getAuth(app), db = getFirestore(app);
    const ref = () => doc(db, 'users', Cloud.user.uid);     // one small document per user
    let pending = null, timer = null;

    Cloud.signIn = () => signInWithPopup(auth, new GoogleAuthProvider());
    Cloud.signOut = async () => { await Cloud.flush(); await signOut(auth); };
    Cloud.load = async () => { const snap = await getDoc(ref()); return snap.exists() && snap.data().json ? JSON.parse(snap.data().json) : null; };
    Cloud.flush = async () => {
      clearTimeout(timer); timer = null;
      if (!pending || !Cloud.user) return;
      const state = pending; pending = null;
      try { await setDoc(ref(), { json: JSON.stringify(state), xp: state.xp || 0, updatedAt: serverTimestamp() }); }
      catch (e) { console.warn('cloud save failed', e); pending = pending || state; }
    };
    Cloud.save = state => { pending = state; if (!timer) timer = setTimeout(Cloud.flush, 1500); };   // batch rapid saves into one write
    document.addEventListener('visibilitychange', () => { if (document.hidden) Cloud.flush(); });

    onAuthStateChanged(auth, u => {
      Cloud.user = u ? { uid: u.uid, displayName: u.displayName, email: u.email } : null;
      window.dispatchEvent(new CustomEvent('cloud-auth', { detail: Cloud.user }));
    });
  } catch (e) {
    console.warn('Firebase could not be loaded - continuing without accounts', e);
    Cloud.enabled = false;
  }
}
window.dispatchEvent(new Event('cloud-ready'));
