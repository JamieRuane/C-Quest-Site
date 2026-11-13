/* ================= JavaScript =================
   One path for everyone: it starts from the very first line of code.  preview: true = the course is still being written.
   Programs run on Node.js through jswrap.js: console.log() prints, and prompt("question") reads a line of input
   and echoes it, so prompts and typed lines appear in the output (as in the Python course).
   Code challenges: tests are [{ in: 'typed input\n', out: 'exact output' | has: ['must contain'] | re: 'regex' }].

   Lesson code is written inside c`...`, where a backtick cannot appear. tl('Hi ${name}') writes a JavaScript
   template string for you: use it as ${tl('Hi ${name}')} inside c`...`. */
const tl = s => '\x60' + s + '\x60';
course('js', {
  name: 'JavaScript', badge: 'JS', logo: 'logos/javascript.svg', color: '#00a3a3', video: 'lfmg-EJ8gm4', glossTry: 'const', tool: 'Node.js', script: 'jsWrap', preview: true,
  tagline: 'The language of the web. Every site you visit runs it — and it is quick to get results.',
  blank: '// Write your JavaScript here\n',
  wandbox: { compiler: 'nodejs-20.17.0' },
  x: o => ({ ...o, start: o.start != null ? trimNL(o.start) + '\n' : undefined, sol: trimNL(o.sol) + '\n' }),
});

G('console.log()', c`Prints values. Several values are separated by a space, and each call ends with a new line.`);
G('statement', c`One instruction. End each one with a semicolon ~;~ — JavaScript can often guess, but not always correctly.`);
G('comment', c`Text JavaScript ignores: ~// to the end of the line~ or ~/* between these */~.`);
G('string', c`Text in quotes: ~"hello"~ or ~'hello'~. Join strings with ~+~.`);
G('variable', c`A named value. Declare it with ~let~ (can change) or ~const~ (cannot be reassigned).`);
G('let', c`Declares a variable whose value can change later: ~let score = 0;~`);
G('const', c`Declares a variable that can never be reassigned: ~const PI = 3.14159;~. Use it by default.`);
G('number', c`JavaScript's only everyday number type: ~42~ and ~3.14~ are both ~number~. So ~7 / 2~ is ~3.5~.`);
G('boolean', c`~true~ or ~false~ — the result of every comparison.`);
G('typeof', c`Tells you a value's type as a string: ~typeof 42~ is ~"number"~.`);
G('template string', c`A string in backticks that fills in ~${'${expressions}'}~ for you. Tidier than joining with ~+~.`);
G('prompt()', c`Asks a question and returns what was typed — **always as a string**.`);
G('Number()', c`Converts a value to a number: ~Number("42")~ is ~42~. Text that is not a number becomes ~NaN~.`);
G('NaN', c`"Not a Number": what you get from maths that makes no sense, like ~Number("hello")~.`);
G('remainder (%)', c`What is left after dividing: ~7 % 2~ is ~1~. Great for "is it even?".`);
G('condition', c`An expression that is true or false, used by ~if~.`);
G('=== vs ==', c`~===~ compares value **and** type. ~==~ converts types first, so ~5 == "5"~ is true. Always use ~===~.`);
G('ternary operator', c`A one-line if/else that produces a value: ~condition ? ifTrue : ifFalse~.`);
G('ReferenceError', c`JavaScript does not know that name: a typo, or a variable used before it was declared.`);

/* ============ TOPIC 1: FIRST STEPS ============ */
topic({ id: 'first', title: 'First Steps', icon: '🌱', color: '#58cc02', blurb: 'Print, store, calculate, ask and decide.',
lessons: [
{ id: 'hello', title: 'Your first program', icon: '🚀', desc: 'console.log, strings, comments — and where your output actually goes.',
  v: [['0:00:00', '0:12:32', 'JavaScript tutorial for beginners']],
  steps: [
  T('The language of the web', c`Every website you have ever used runs JavaScript. It makes buttons do things, loads your feed, and these days runs servers too.

Here is a complete JavaScript program:`, c`console.log("Hello, World!");`, c`One line. No setup, no ~main~. JavaScript runs your file from the top, one statement at a time.

In a browser, ~console.log~ prints to the developer console (press F12). Here, it prints straight to the output box.`),
  Q(c`What does ~console.log("Hi");~ do?`, ['Shows a pop-up box', 'Prints Hi', 'Saves Hi to a file', 'Nothing until the page reloads'], 1),
  P(c`
console.log("A");
console.log("B");`, 'A\nB', c`Each ~console.log~ ends with a new line by itself.`),
  T('Strings and comments', c`Text goes in quotes — single or double, your choice, as long as they match. Comments are notes for humans.`, c`
console.log("double quotes");
console.log('single quotes');   // a comment: JavaScript ignores this
/* a comment
   over several lines */
console.log("Rock", "Paper", 3);   // several values: Rock Paper 3`),
  P(c`
console.log("1");
// console.log("2");
console.log("3", 4);`, '1\n3 4', c`The commented-out line never runs. Separate values are printed with a space between them.`),
  F('Print the text Ready!', c`[[console]].[[log]]("Ready!");`),
  X({ q: c`Your turn. Make the program print exactly: ~I am learning JavaScript!~`, start: c`// your code goes here`,
    tests: [{ out: 'I am learning JavaScript!' }], hint: c`~console.log("text goes here");~`, sol: c`console.log("I am learning JavaScript!");` }),
  X({ q: c`Three bugs. Press **Run**, read the first error, fix it, repeat.

Expected output:

~Mission control~
~Lift off!~`, start: c`
console.log("Mission control);
Console.log("Lift off!")`, tests: [{ out: 'Mission control\nLift off!' }], hint: c`A missing quote, and JavaScript is case-sensitive: it is ~console~, not ~Console~.`, sol: c`
console.log("Mission control");
console.log("Lift off!");` }),
] },

{ id: 'variables', title: 'Variables: let and const', icon: '📦', desc: 'Store values, change them — or lock them.',
  v: [['0:12:32', '0:25:20', 'Variables'], ['0:44:48', '0:52:30', 'Constants']],
  steps: [
  T('Named values', c`A variable is a name for a value. JavaScript has two everyday ways to make one:`, c`
let score = 0;          // let: the value can change
score = score + 10;

const name = "Ada";     // const: can never be reassigned
const lives = 3;
const online = true;    // a boolean: true or false`, c`Use ~const~ by default and switch to ~let~ only when the value really has to change. Your future self will know at a glance what can move.`),
  P(c`
let x = 5;
x = x + 2;
x = x * 2;
console.log(x);`, '14', c`~=~ means "work out the right side, then store it". 5 → 7 → 14.`),
  Q(c`What happens here?`, ['It prints 4', 'It prints 3', 'An error: you cannot reassign a const', 'It prints undefined'], 2, c`~TypeError: Assignment to constant variable.~ That is the whole point of ~const~: it protects you from changing something by accident.`, c`
const lives = 3;
lives = 4;
console.log(lives);`),
  T('Types, and joining text', c`Values have types. The three you will use first: **number**, **string** and **boolean**. ~typeof~ tells you which.

Join text and values with ~+~, or use a **template string**: backticks, with ~${'${...}'}~ wherever a value should go.`, c`
const name = "Ada";
const age = 36;

console.log(typeof age);                       // number
console.log(name + " is " + age);              // Ada is 36
console.log(${tl('${name} is ${age}')});            // Ada is 36`),
  P(c`console.log(typeof "42");`, 'string', c`Quotes make it text, even if the text looks like a number.`),
  P(c`
const item = "Pizza";
const qty = 3;
console.log(${tl('${qty} x ${item}')});`, '3 x Pizza'),
  F('Declare a value that never changes and one that does.', c`
[[const]] PI = 3.14159;
[[let]] score = 0;
score = score + 1;`),
  X({ q: c`A boss just hit your character. Subtract ~damage~ from ~hp~, then print:

~HP: 65~

Use the variables — don't just type 65.`, start: c`
let hp = 100;
const damage = 35;
`, tests: [{ out: 'HP: 65' }], not: [['["\'`]HP: 65', 'No hard-coding — let the program calculate it.']], hint: c`~hp = hp - damage;~ then ~console.log("HP: " + hp);~`, sol: c`
let hp = 100;
const damage = 35;

hp = hp - damage;
console.log("HP: " + hp);` }),
] },

{ id: 'input', title: 'Maths & input', icon: '⌨️', desc: 'Operators, prompt() — and why "5" + 1 is 51.',
  v: [['0:25:20', '0:33:47', 'Arithmetic operators'], ['0:33:47', '0:39:09', 'Accept user input'], ['0:39:09', '0:44:48', 'Type conversion']],
  steps: [
  T('The operators', c`~+~ ~-~ ~*~ ~/~ work as you expect, plus a few extras:`, c`
console.log(7 / 2);     // 3.5   (no integer-division trap here)
console.log(7 % 2);     // 1     remainder
console.log(2 ** 10);   // 1024  power

let x = 10;
x += 5;                 // same as x = x + 5
x++;                    // add one`),
  P(c`console.log(2 + 3 * 4);`, '14', c`Same order as school maths: multiply and divide before add and subtract.`),
  P(c`console.log(17 % 5);`, '2', c`17 ÷ 5 is 3 remainder **2**.`),
  T('Asking the user', c`~prompt("question")~ shows the question, waits for an answer and returns it.

The catch: the answer is **always a string**, even if the user types a number.`, c`
const name = prompt("Your name: ");
const age = prompt("Your age: ");      // "36" - a string!

console.log("Hello " + name);
console.log(age + 1);                  // 361  - oops, text was joined
console.log(Number(age) + 1);          // 37   - converted first`, c`With strings, ~+~ means "join". So convert with ~Number()~ before doing maths.`),
  P(c`console.log("5" + 1);`, '51', c`One side is a string, so ~+~ joins: "5" and "1" become "51". The most famous JavaScript surprise.`),
  P(c`console.log(Number("5") + 1);`, '6'),
  Q(c`What is ~Number("hello")~?`, ['0', c`~NaN~ — "not a number"`, 'An error that stops the program', c`~"hello"~`], 1, c`JavaScript does not crash; it hands you ~NaN~. Any maths with ~NaN~ gives ~NaN~ again, so it spreads quietly.`),
  X({ q: c`Ask for the user's age and print how old they will be in 10 years:

~In 10 years you will be 30.~

(In the tests, the typed input is supplied automatically.)`, start: c`
const age = prompt("Your age: ");
`, tests: [{ in: '20\n', has: ['In 10 years you will be 30.'] }, { in: '41\n', has: ['In 10 years you will be 51.'] }], hint: c`Convert first: ~Number(age) + 10~. Without ~Number~ you get 2010.`, sol: c`
const age = prompt("Your age: ");
console.log("In 10 years you will be " + (Number(age) + 10) + ".");` }),
  X({ q: c`Ask for a width and a height, then print the area of the rectangle:

~Area: 10~`, start: c`// ask for two numbers, then print the area
`, tests: [{ in: '2.5\n4\n', has: ['Area: 10'] }, { in: '3\n7\n', has: ['Area: 21'] }], hint: c`Two prompts, each wrapped in ~Number(...)~, then multiply.`, sol: c`
const width = Number(prompt("Width: "));
const height = Number(prompt("Height: "));
console.log("Area: " + width * height);` }),
] },

{ id: 'if', title: 'Decisions', icon: '🚦', desc: 'if, else — and why JavaScript has three equals signs.',
  v: [['1:15:59', '1:31:56', 'If statements'], ['2:22:44', '2:26:41', 'Strict equality']],
  steps: [
  T('Choosing a path', c`An ~if~ runs its block only when the condition is true. JavaScript checks from the top and runs the **first** branch that matches.`, c`
const temp = 31;

if (temp > 30) {
    console.log("Too hot");
} else if (temp > 15) {
    console.log("Nice");
} else {
    console.log("Too cold");
}`),
  P(c`
const score = 85;
if (score >= 50) {
    console.log("D");
} else if (score >= 80) {
    console.log("A");
}`, 'D', c`85 >= 50 is true, so the first branch wins and the rest are skipped. Check the strictest condition first.`),
  T('Three equals signs', c`~=~ assigns. ~==~ compares after **converting types**. ~===~ compares value **and** type, with no surprises.`, c`
console.log(5 == "5");    // true   - the string was converted
console.log(5 === "5");   // false  - a number is not a string
console.log(5 !== 6);     // true   - "not equal", the strict way`, c`Always use ~===~ and ~!==~. The loose versions are a classic source of bugs.`),
  P(c`console.log(1 === 1, 1 === "1");`, 'true false'),
  F('Adults are 18 or over.', c`
const age = 20;
if (age [[>=]] 18) {
    console.log("Adult");
} [[else]] {
    console.log("Minor");
}`),
  P(c`
const n = 7;
console.log(n % 2 === 0 ? "even" : "odd");`, 'odd', c`The **ternary** operator: ~condition ? ifTrue : ifFalse~. A one-line if/else that produces a value.`),
  X({ q: c`Ask for an age and print exactly one word:

under 13 → ~Child~ · under 20 → ~Teen~ · under 65 → ~Adult~ · otherwise ~Senior~`, start: c`
const age = Number(prompt("Age: "));
`, tests: [{ in: '8\n', has: ['Child'] }, { in: '13\n', has: ['Teen'] }, { in: '30\n', has: ['Adult'] }, { in: '65\n', has: ['Senior'] }], hint: c`Start with ~if (age < 13)~ and work upwards with ~else if~.`, sol: c`
const age = Number(prompt("Age: "));

if (age < 13) {
    console.log("Child");
} else if (age < 20) {
    console.log("Teen");
} else if (age < 65) {
    console.log("Adult");
} else {
    console.log("Senior");
}` }),
  X({ q: c`This door only opens for the password ~1234~, but it lets everyone in. Find the bug.

Typing 1234 → ~Welcome~ · anything else → ~Access denied~`, start: c`
const pin = prompt("PIN: ");

if (pin = "1234") {
    console.log("Welcome");
} else {
    console.log("Access denied");
}`, tests: [{ in: '1234\n', has: ['Welcome'] }, { in: '0000\n', has: ['Access denied'] }], not: [['if\\s*\\(\\s*pin\\s*=\\s*"', c`~=~ assigns. You need a comparison.`]], hint: c`~=~ stores "1234" in pin, and a non-empty string counts as true. Compare with ~===~.`, sol: c`
const pin = prompt("PIN: ");

if (pin === "1234") {
    console.log("Welcome");
} else {
    console.log("Access denied");
}` }),
] },
],
quiz: [
  P(c`
let a = 3;
a += 4;
console.log(a * 2);`, '14'),
  Q(c`Which declares a value that can never be reassigned?`, [c`~let~`, c`~const~`, c`~var~`, c`~fixed~`], 1),
  P(c`console.log("3" + 4);`, '34', c`A string plus anything joins text.`),
  Q(c`What does ~prompt()~ give you when the user types 42?`, [c`The number ~42~`, c`The string ~"42"~`, c`~true~`, c`~NaN~`], 1),
  P(c`console.log(10 % 3);`, '1'),
  Q(c`Which comparison should you use by default?`, [c`~=~`, c`~==~`, c`~===~`, c`~equals()~`], 2),
  F('Convert the text to a number before adding.', c`
const typed = "8";
console.log([[Number]](typed) + 2);`),
] });
