# Code Quest

Duolingo-style courses that teach programming by doing. Six languages, one account:

| Course | Lessons | Starts from | Runs your code with |
|---|---|---|---|
| **C** | 52 | The very first line of code | gcc |
| **Python** | 46 | The very first line of code | Python 3 |
| **C++** | 29 | The beginning, or "I already know some C" | g++ |
| **C#** | 28 | The beginning, or "I already know some C" | Online compiler (Mono) |
| **JavaScript** | 4 (first topic; more coming) | The very first line of code | Node.js |
| **Java** | 4 (first topic; more coming) | The very first line of code | The JDK (`javac` / `java`) |

Every course has a lesson path, quizzes, a Practice deck built from your own mistakes, bookmarks,
a glossary, a Playground, and clips from Bro Code's free courses. XP, streak, achievements and the
leaderboard are shared across languages; lessons, quizzes, bookmarks and mistakes are kept per language.

## Run it on your computer

Needs [Node.js](https://nodejs.org). For code challenges you also need the tool for the language you are
learning: gcc (C), g++ (C++), [Python 3](https://www.python.org) or a JDK (Java). JavaScript runs on Node.js itself,
and C# always uses the online compiler.

Double-click `start.bat`, or:

```bash
node server.js
```

Then open <http://localhost:4321>. The window that opens lists which languages can run on this machine.

## How it is organised

| Path | What it is |
|---|---|
| `public/content/00-core.js` | The helpers lessons are written with (`T`, `Q`, `P`, `F`, `O`, `X`) |
| `public/content/<course>-N.js` | Course content. `course('id', {...})` starts a course; `c`, `py`, `cpp`, `cs` |
| `public/app.js` | The site: lesson engine, language picker, runner, leaderboard |
| `public/cloud.js` | Accounts, saved progress and the leaderboard (Firebase) |
| `public/migrate.js` | Upgrades progress saved by older versions of the site |
| `public/pywrap.js` | Wraps Python programs so errors and `input()` behave the same everywhere |
| `public/jswrap.js` | The same for JavaScript: `prompt()` reads input, errors point at the learner's own line |
| `public/javafix.js` | Lets a Java program run from one file whatever its class is called |
| `runner.js`, `server.js` | Local server that runs C, C++, Python, Java and JavaScript on your machine |
| `firestore.rules` | Who can read and write what in the database |

## Checks

```bash
node tools/verify.js             # every exercise in every course, against the real compiler / interpreter
node tools/verify.js py loops    # one course, one topic
npm run test:unit                # saved-progress upgrade (migrate.js)
npm run test:rules               # database security rules (needs Java for the emulator)
```

C# cannot be compiled locally, so `tools/verify.js` only checks its structure. To run every C# exercise
on the online compiler, start the site, open the browser console and run `await import('./verify-cs.js')`
(about ten minutes).

## Adding a language

1. Add `public/content/<id>-0.js` starting with `course('<id>', { name, badge, color, video, blank, wandbox, ... })`.
2. List the file in `public/index.html`.
3. In `public/app.js`, add the language to `HLS` (highlighting), and to `TIDY` / `FAILED` if it is compiled online.
   A language that is run rather than compiled (like Python or JavaScript) instead names a wrapper with `script: '...'`.
   Mark an unfinished course `preview: true` so its card says more lessons are coming.
4. If it can run locally, add it to `runner.js`; add its snippet wrapper to `tools/verify.js`.

## Putting it online

See [SETUP.md](SETUP.md) for GitHub Pages hosting, Firebase accounts, the security rules and the leaderboard.
