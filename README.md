# Code Quest

Duolingo-style courses that teach programming by doing. Nine languages, one account:

| Course | Lessons | Starts from | Runs your code with |
|---|---|---|---|
| **C** | 52 | The very first line of code | gcc |
| **Python** | 46 | The very first line of code | Python 3 |
| **C++** | 29 | The beginning, or "I already know some C" | g++ |
| **C#** | 28 | The beginning, or "I already know some C" | Online compiler (Mono) |
| **JavaScript** | 32 | The very first line of code | Node.js |
| **Java** | 32 | The very first line of code | The JDK (`javac` / `java`) |
| **Go** | 23 | The very first line of code | Online compiler (Go 1.23) |
| **Rust** | 23 | The very first line of code | Online compiler (Rust 1.82) |
| **SQL** | 35 | The very first query | SQLite in the browser ([sql.js](https://sql.js.org)), nothing to install |

Every course has a lesson path, quizzes, a Practice deck built from your own mistakes, bookmarks,
a glossary and a Playground. Every course except Rust also has clips from Bro Code's free courses (Bro Code
has no Rust course). XP, streak, achievements and the
leaderboard are shared across languages; lessons, quizzes, bookmarks and mistakes are kept per language.

## Run it on your computer

Needs [Node.js](https://nodejs.org). For code challenges you also need the tool for the language you are
learning: gcc (C), g++ (C++), [Python 3](https://www.python.org) or a JDK (Java). JavaScript runs on Node.js itself,
and C#, Go and Rust always use the online compiler.

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
| `public/sqlrun.js` | Runs SQL lessons on a fresh copy of a practice database with SQLite (sql.js) |
| `public/vendor/sqljs/` | sql.js (MIT licence): SQLite compiled to WebAssembly |
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

Go and Rust have no local compiler either, so `tools/verify.js` runs every Go and Rust exercise on the online compiler
(it needs an internet connection and takes a few minutes).

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
