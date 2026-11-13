# Putting Code Quest online with accounts

Everything here is free. It takes about 15 minutes, once.

## How it fits together

| Piece | Service | Notes |
|---|---|---|
| The website | GitHub Pages | Deployed automatically from the `public/` folder on every push to `main` |
| Accounts | Firebase Authentication | "Sign in with Google" |
| Saved progress | Firebase Firestore | One small document per user (`users/<their id>`) |
| Running code | Wandbox (free public compiler) | Used when the site is online, and always for C# and Go. `start.bat` uses your own gcc, g++, Python, JDK and Node.js |

Until step 1 is done the site works exactly as before: no accounts, progress kept in the browser.

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and click **Add project**. Any name; Google Analytics is not needed.
2. **Build > Authentication > Get started > Sign-in method > Google > Enable**, pick a support email, **Save**.
3. **Build > Firestore Database > Create database**. Choose a location near you and **Start in production mode**.
4. In Firestore, open the **Rules** tab, replace everything with the contents of [`firestore.rules`](firestore.rules), and click **Publish**.
   These rules mean a signed-in user can only read and write their own progress, in the exact format the site writes,
   at most once every 5 seconds. See [Changing the security rules](#changing-the-security-rules) below.
5. **Project settings (gear icon) > General > Your apps > Web (`</>`)**. Register an app (no hosting needed).
   Copy the `firebaseConfig = { ... }` object it shows.
6. Open [`public/firebase-config.js`](public/firebase-config.js) and replace `null` with that object:

   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

   These values are designed to be public, so committing them is fine. The rules from step 4 are what protect the data.

## 2. Turn on GitHub Pages

1. On GitHub: **repo > Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. Merge this work into `main` and push. The workflow in `.github/workflows/pages.yml` publishes the site.
3. The address appears under **Settings > Pages** (and in the Actions run), in the form
   `https://<your-username>.github.io/<repo-name>/`.

On a free GitHub account the repository has to be public for Pages to work.

## 3. Allow that address to sign in

Firebase only accepts sign-ins from addresses you list.

**Authentication > Settings > Authorised domains > Add domain** and add `<your-username>.github.io`.

(`localhost` is already on the list, so sign-in also works when you run `start.bat`.)

## How accounts behave

- Signing in is optional. Guests can learn straight away; their progress stays in that browser.
- When a guest signs in for the first time, the progress they already earned is moved into their account.
- After that, progress is saved to the account a moment after every change and loaded on any device they sign in on.
- Signing out clears the progress from that browser (it is safe in the account), so shared computers do not mix people up.
- What is stored per user: their Google name and email (held by Firebase Authentication) and one progress document covering every language.
- Progress saved before the site became Code Quest (when it only taught C) is upgraded automatically the first time it is loaded: see `public/migrate.js`.

## Changing the security rules

[`firestore.rules`](firestore.rules) controls who can read and write saved progress and the leaderboard.

**Private progress** (`users/<id>`):

| Rule | Why |
|---|---|
| Users can only get, create or update `users/<their own id>` | Nobody can see or change anyone else's progress |
| Nobody can list or query the `users` collection | No browsing other accounts, even when signed in |
| Documents must have exactly `json`, `xp` and `updatedAt` | No junk fields |
| `json` is at most 300,000 characters | A finished course is about 30 KB; stops anyone filling the free 1 GB storage |
| `xp` is a whole number from 0 to 10,000,000 | Keeps the field trustworthy |
| `updatedAt` must be the server's time | Clients cannot fake or backdate it |
| At most one save every 5 seconds per user | Protects the shared daily write quota (see below) |
| No deletes | Deleting and re-creating would get around the 5-second limit |

**Leaderboard** (`leaderboard/<id>`, opt-in, nickname only):

| Rule | Why |
|---|---|
| Only signed-in users can read it, and only entries with `visible == true` | Leaving hides your entry from everyone |
| Nicknames: 3–20 letters, digits, spaces, `_ . -` | No HTML, no impersonating system text, no Google names |
| Joining: at most 1,500 XP and a 30-day streak | Higher real totals catch up through the daily cap |
| Each update: at most +200 XP, and at most one update a minute | No sudden jumps |
| At most +600 XP per UTC day (`dayXp` must add up exactly) | A cheating script can at best match a very dedicated learner |
| Streak rises by at most 1 a day (or 0 → 1 when a new streak starts) | Streaks can't be inflated |
| XP and streaks can always fall | Resetting progress or breaking a streak always works |
| No deletes; leaving sets `visible = false` | Same reason as above |

**Write quota:** the free plan allows 20,000 writes a day across all users. One progress save per 5 s (17,280/day) plus one leaderboard save per minute (1,440/day) caps any single account at 18,720, so nobody can use up the quota for everyone else.

The limits in `public/cloud.js` must match the rules, so the site never sends a write the rules reject. The tests check this by running the site's own code against the rules.

**Before changing the rules, run the tests.** They start a local Firestore emulator (needs Java 11 or newer) and check 63 allowed and blocked cases. They never touch the real database.

```bash
npm install
npm run test:rules
```

The same tests run automatically on every pull request that touches the rules, `public/cloud.js` or the tests.

**Rules and indexes are not deployed by pushing to GitHub.** Publish them with:

```bash
npx firebase login
npm run deploy:rules
```

`npx firebase login` is only needed once. `deploy:rules` publishes `firestore.rules` and the leaderboard's database indexes from `firestore.indexes.json`; new indexes take a few minutes to build. (The rules alone can also be pasted into Firebase console → Firestore → Rules → **Publish**, but the indexes can't.)

### Trying features locally without touching real data

```bash
npm run emulators
```

Then open `http://localhost:4321/?emulator` (with `start.bat` running). The site talks to a local, throwaway copy of Firebase Authentication and Firestore. Sign-in uses the emulator's fake accounts, and nothing reaches the real project.

## Things to know

- **The online compiler is a free shared service.** Each run takes a few seconds, and it can occasionally be busy or down.
  Only the code challenges and the Playground depend on it; everything else keeps working.
- **Code is sent to Wandbox** when someone presses Run or Check on the hosted site. From `start.bat`, C, C++, Python, Java and JavaScript run on your own machine and nothing is sent; C# and Go have no local compiler, so their code is always sent.
- **Testing the online compiler locally:** open `http://localhost:4321/?online` to force it.
- **Free limits:** Firebase's free plan allows far more sign-ins and saves than a small site will use.
