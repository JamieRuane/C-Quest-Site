# Putting C Quest online with accounts

Everything here is free. It takes about 15 minutes, once.

## How it fits together

| Piece | Service | Notes |
|---|---|---|
| The website | GitHub Pages | Deployed automatically from the `public/` folder on every push to `main` |
| Accounts | Firebase Authentication | "Sign in with Google" |
| Saved progress | Firebase Firestore | One small document per user (`users/<their id>`) |
| Running C code | Wandbox (free public compiler) | Used when the site is online. `start.bat` still uses your own gcc |

Until step 1 is done the site works exactly as before: no accounts, progress kept in the browser.

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and click **Add project**. Any name; Google Analytics is not needed.
2. **Build > Authentication > Get started > Sign-in method > Google > Enable**, pick a support email, **Save**.
3. **Build > Firestore Database > Create database**. Choose a location near you and **Start in production mode**.
4. In Firestore, open the **Rules** tab, replace everything with the contents of [`firestore.rules`](firestore.rules), and click **Publish**.
   These rules mean a signed-in user can only read and write their own progress.
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
- What is stored per user: their Google name and email (held by Firebase Authentication) and one progress document.

## Things to know

- **The online compiler is a free shared service.** Each run takes a few seconds, and it can occasionally be busy or down.
  Only the code challenges and the Playground depend on it; everything else keeps working.
- **Code is sent to Wandbox** when someone presses Run or Check on the hosted site. Nothing is sent when you use `start.bat`.
- **Testing the online compiler locally:** open `http://localhost:4321/?online` to force it.
- **Free limits:** Firebase's free plan allows far more sign-ins and saves than a small site will use.
