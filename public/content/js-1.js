/* ============ JavaScript TOPIC 2: STRINGS & MATH ============ */
topic({ id: 'strings', title: 'Strings & Math', icon: '🧵', color: '#1cb0f6', blurb: 'Slice, search and transform text. Round, clamp and randomise numbers.',
lessons: [
{ id: 'methods', title: 'String methods', icon: '🔤', desc: 'length, toUpperCase, trim, includes and friends.',
  v: [['1:55:33', '2:03:35', 'String methods']],
  steps: [
  T('Strings come with tools', c`Every string has **methods**: built-in functions you call with a dot. They never change the original string — they give you a new one.`, c`
const name = "  Ada Lovelace ";

console.log(name.length);              // 15 (spaces count)
console.log(name.trim());              // "Ada Lovelace"
console.log(name.toUpperCase());       // "  ADA LOVELACE "
console.log(name.includes("Love"));    // true
console.log(name.indexOf("L"));        // 6
console.log("ha".repeat(3));           // "hahaha"`),
  P(c`console.log("JavaScript".length);`, '10'),
  P(c`
const word = "banana";
console.log(word.indexOf("n"), word.lastIndexOf("n"));`, '2 4', c`Positions start at 0. ~indexOf~ finds the first match, ~lastIndexOf~ the last.`),
  Q(c`What does ~"hello".toUpperCase()~ do to the variable holding "hello"?`, ['Changes it to HELLO', 'Nothing — it returns a new string', 'Deletes it', 'Throws an error'], 1, c`Strings can never be changed in place. Store the result if you want to keep it.`),
  X({ q: c`Ask for a username, then print it with the spaces at both ends removed and in lower case:

~  AdaL ~ → ~adal~`, start: c`const typed = prompt("Username: ");`, tests: [{ in: '  AdaL \n', has: ['adal'] }, { in: 'BOB\n', has: ['bob'] }], sol: c`
const typed = prompt("Username: ");
console.log(typed.trim().toLowerCase());`, hint: c`Methods can be chained: ~typed.trim().toLowerCase()~.` }),
  X({ q: c`Ask for an email address and print ~valid~ if it contains an ~@~, otherwise ~invalid~.`, tests: [{ in: 'ada@example.com\n', re: '(^|\\n)valid$' }, { in: 'ada.example.com\n', re: '(^|\\n)invalid$' }], sol: c`
const email = prompt("Email: ");
console.log(email.includes("@") ? "valid" : "invalid");`, hint: c`~email.includes("@")~ is true or false.` }),
] },

{ id: 'slicing', title: 'Slicing and chaining', icon: '✂️', desc: 'Cut strings apart and chain methods together.',
  v: [['2:03:35', '2:11:36', 'String slicing'], ['2:11:36', '2:17:03', 'Method chaining']],
  steps: [
  T('slice', c`~slice(start, end)~ cuts out part of a string. ~end~ is **not** included. Negative numbers count from the end.`, c`
const text = "Code Quest";
console.log(text.slice(0, 4));     // "Code"
console.log(text.slice(5));        // "Quest"   (to the end)
console.log(text.slice(-5));       // "Quest"   (last 5)
console.log(text.charAt(0));       // "C"
console.log(text[0]);              // "C" (same thing)`),
  P(c`console.log("JavaScript".slice(4, 10));`, 'Script'),
  P(c`console.log("hello".slice(-3));`, 'llo'),
  T('Chaining', c`Each method returns a new string, so you can call another method on it straight away:`, c`
const raw = "  ada  ";
const pretty = raw.trim().charAt(0).toUpperCase() + raw.trim().slice(1).toLowerCase();
console.log(pretty);   // "Ada"`),
  X({ q: c`Ask for a full name like ~ada lovelace~ and print just the first name with a capital first letter:

~ada lovelace~ → ~Ada~`, tests: [{ in: 'ada lovelace\n', has: ['Ada'], re: '(^|\\n)Ada$' }, { in: 'GRACE hopper\n', re: '(^|\\n)Grace$' }], sol: c`
const full = prompt("Full name: ");
const first = full.slice(0, full.indexOf(" "));
console.log(first.charAt(0).toUpperCase() + first.slice(1).toLowerCase());`, hint: c`~full.slice(0, full.indexOf(" "))~ is the first name. Then capitalise it.` }),
  X({ q: c`Ask for an email and print the part **after** the ~@~ (the domain).

~ada@example.com~ → ~example.com~`, tests: [{ in: 'ada@example.com\n', re: '(^|\\n)example\\.com$' }, { in: 'bo@code.quest\n', re: '(^|\\n)code\\.quest$' }], sol: c`
const email = prompt("Email: ");
console.log(email.slice(email.indexOf("@") + 1));` }),
] },

{ id: 'math', title: 'The Math object', icon: '🧮', desc: 'Rounding, powers, min and max — and random numbers.',
  v: [['1:01:46', '1:07:23', 'Math object'], ['1:07:23', '1:15:59', 'Random number generator']],
  steps: [
  T('Math', c`~Math~ holds handy number functions:`, c`
Math.round(4.5);     // 5
Math.floor(4.9);     // 4   always down
Math.ceil(4.1);      // 5   always up
Math.trunc(-4.7);    // -4  just drops the decimals
Math.pow(2, 8);      // 256 (same as 2 ** 8)
Math.sqrt(81);       // 9
Math.abs(-7);        // 7
Math.max(3, 9, 2);   // 9
Math.PI;             // 3.141592653589793`, c`To round to 2 decimals for display, use ~num.toFixed(2)~ — it gives back a string.`),
  P(c`console.log(Math.floor(7.9), Math.ceil(7.1), Math.round(7.5));`, '7 8 8'),
  P(c`console.log((19.999).toFixed(2), Math.max(4, -1, 10));`, '20.00 10'),
  T('Random numbers', c`~Math.random()~ gives a decimal from 0 up to (not including) 1. Scale it and round down to get whole numbers:`, c`
const dice = Math.floor(Math.random() * 6) + 1;   // 1 to 6

// a number from min to max, both included
const between = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;`),
  Q(c`What range does ~Math.floor(Math.random() * 10)~ give?`, ['1 to 10', '0 to 9', '0 to 10', '1 to 9'], 1),
  X({ q: c`Ask for the radius of a circle and print its area rounded to 2 decimals:

~Area: 78.54~ (for radius 5)`, tests: [{ in: '5\n', has: ['Area: 78.54'] }, { in: '1.5\n', has: ['Area: 7.07'] }], sol: c`
const r = Number(prompt("Radius: "));
console.log("Area: " + (Math.PI * r ** 2).toFixed(2));`, hint: c`~Math.PI * r ** 2~, then ~.toFixed(2)~.` }),
  X({ q: c`Roll two dice and print them and their total, like ~Rolled 3 and 5 = 8~.`, tests: [{ re: '^Rolled [1-6] and [1-6] = ([2-9]|1[0-2])$' }], sol: c`
const a = Math.floor(Math.random() * 6) + 1;
const b = Math.floor(Math.random() * 6) + 1;
console.log(${tl('Rolled ${a} and ${b} = ${a + b}')});`, must: [[c`Math\.random`, c`Use ~Math.random()~.`]] }),
] },
],
quiz: [
  P(c`console.log("Code Quest".toLowerCase().slice(0, 4));`, 'code'),
  P(c`console.log(Math.trunc(-3.9));`, '-3'),
  Q(c`What does ~"abc".charAt(5)~ return?`, ['An error', 'An empty string', c`~undefined~`, c`~"c"~`], 1),
  P(c`console.log("ab".repeat(2) + "!".repeat(3));`, 'abab!!!'),
  F('Last three characters.', c`console.log("Keyboard".[[slice]](-3));`),
  Q(c`What type does ~(3.14159).toFixed(2)~ return?`, ['number', 'string', 'boolean', 'object'], 1),
] });

/* ============ JavaScript TOPIC 3: LOOPS ============ */
topic({ id: 'loops', title: 'Loops', icon: '🔁', color: '#ff9600', blurb: 'while, for, break and continue — let the computer repeat itself.',
lessons: [
{ id: 'while', title: 'while loops', icon: '♾️', desc: 'Repeat until something changes.',
  v: [['2:26:41', '2:34:53', 'While loops']],
  steps: [
  T('Repeat while true', c`A ~while~ loop checks its condition, runs its block, and checks again — until the condition is false.`, c`
let countdown = 3;
while (countdown > 0) {
    console.log(countdown);
    countdown--;
}
console.log("Lift off!");`, c`Something inside the loop must eventually make the condition false, or it runs forever. A ~do...while~ loop runs its block once **before** checking.`),
  P(c`
let n = 1;
while (n < 20) {
    n = n * 3;
}
console.log(n);`, '27', c`1 → 3 → 9 → 27. At 27 the condition fails.`),
  X({ q: c`Keep asking for numbers until the user types ~0~, then print their sum:

~Sum: 18~`, tests: [{ in: '5\n10\n3\n0\n', has: ['Sum: 18'] }, { in: '0\n', has: ['Sum: 0'] }], sol: c`
let sum = 0;
let n = Number(prompt("Number: "));
while (n !== 0) {
    sum += n;
    n = Number(prompt("Number: "));
}
console.log("Sum: " + sum);`, hint: c`Read the first number before the loop; read the next one at the end of each round.` }),
  X({ q: c`Keep asking for a password until the user types ~opensesame~, then print ~Welcome~. Use a ~do...while~ loop.`, tests: [{ in: 'abc\n123\nopensesame\n', re: 'Welcome' }, { in: 'opensesame\n', re: 'Welcome' }], must: [[c`\bdo\s*\{`, c`Use a ~do { ... } while (...)~ loop.`]], sol: c`
let password;
do {
    password = prompt("Password: ");
} while (password !== "opensesame");
console.log("Welcome");` }),
] },

{ id: 'for', title: 'for loops', icon: '🔂', desc: 'When you know how many times.',
  v: [['2:34:53', '2:40:37', 'For loops']],
  steps: [
  T('Counting loops', c`A ~for~ loop has three parts: where to start, when to keep going, and how to step.`, c`
for (let i = 1; i <= 5; i++) {
    console.log(i);
}

for (let i = 10; i > 0; i -= 2) {
    console.log(i);   // 10 8 6 4 2
}`, c`~break~ leaves the loop early. ~continue~ skips to the next round.`),
  P(c`
let s = "";
for (let i = 0; i < 4; i++) {
    s += i;
}
console.log(s);`, '0123', c`Adding a number to a string joins them.`),
  P(c`
for (let i = 1; i <= 10; i++) {
    if (i % 3 !== 0) continue;
    if (i > 7) break;
    console.log(i);
}`, '3\n6', c`Only multiples of 3 get past ~continue~; 9 is over 7, so the loop breaks.`),
  X({ q: c`Ask for a number ~n~ and print its times table from 1 to 5:

~7 x 1 = 7~ … ~7 x 5 = 35~`, tests: [{ in: '7\n', has: ['7 x 1 = 7', '7 x 3 = 21', '7 x 5 = 35'] }, { in: '2\n', has: ['2 x 4 = 8'] }], sol: c`
const n = Number(prompt("Number: "));
for (let i = 1; i <= 5; i++) {
    console.log(${tl('${n} x ${i} = ${n * i}')});
}`, must: [[c`\bfor\s*\(`, c`Use a ~for~ loop.`]] }),
  X({ q: c`**FizzBuzz.** Print the numbers 1 to 15, one per line — but print ~Fizz~ for multiples of 3, ~Buzz~ for multiples of 5, and ~FizzBuzz~ for multiples of both.`, tests: [{ out: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }], sol: c`
for (let i = 1; i <= 15; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(i);
}`, hint: c`Check "both" (~i % 15 === 0~) first.` }),
] },

{ id: 'nested', title: 'Nested loops & a game', icon: '🎮', desc: 'Loops in loops, and a number guessing game.',
  v: [['2:40:37', '2:49:31', 'Number guessing game']],
  steps: [
  T('Loops inside loops', c`The inner loop runs completely for every round of the outer loop — perfect for grids.`, c`
for (let row = 1; row <= 3; row++) {
    let line = "";
    for (let col = 1; col <= 4; col++) {
        line += "*";
    }
    console.log(line);
}`),
  P(c`
for (let r = 1; r <= 3; r++) {
    console.log("#".repeat(r));
}`, '#\n##\n###'),
  X({ q: c`Ask for a size ~n~ and print a right-angled triangle of stars. For 4:

~*~
~**~
~***~
~****~`, tests: [{ in: '4\n', has: ['*\n**\n***\n****'] }, { in: '2\n', has: ['*\n**'] }], sol: c`
const n = Number(prompt("Size: "));
for (let r = 1; r <= n; r++) {
    let line = "";
    for (let c = 0; c < r; c++) line += "*";
    console.log(line);
}`, hint: c`Row ~r~ has ~r~ stars.` }),
  X({ q: c`**Guessing game.** The secret is 42 (a real game would use Math.random). Keep reading guesses: print ~Too high~ or ~Too low~, and when it is right print ~Correct! Tries: N~.`, tests: [{ in: '50\n20\n42\n', has: ['Too high', 'Too low', 'Correct! Tries: 3'] }, { in: '42\n', has: ['Correct! Tries: 1'] }], sol: c`
const secret = 42;
let tries = 0;
let guess;
do {
    guess = Number(prompt("Guess: "));
    tries++;
    if (guess > secret) console.log("Too high");
    else if (guess < secret) console.log("Too low");
} while (guess !== secret);
console.log("Correct! Tries: " + tries);` }),
] },
],
quiz: [
  P(c`
let t = 0;
for (let i = 1; i <= 4; i++) t += i;
console.log(t);`, '10'),
  Q('Which loop always runs its block at least once?', ['for', 'while', 'do...while', 'none'], 2),
  P(c`
let i = 0;
while (i < 5) { i += 2; }
console.log(i);`, '6'),
  Q(c`What does ~continue~ do inside a loop?`, ['Stops the loop', 'Skips to the next round', 'Restarts from the beginning', 'Pauses the program'], 1),
  F('Count down from 5.', c`for (let i = 5; i > 0; i[[--]]) console.log(i);`),
] });

/* ============ JavaScript TOPIC 4: FUNCTIONS ============ */
topic({ id: 'functions', title: 'Functions', icon: '📞', color: '#ce82ff', blurb: 'Reusable blocks of code — including the short arrow kind.',
lessons: [
{ id: 'basics', title: 'Functions and return', icon: '📞', desc: 'Define once, call often, get answers back.',
  v: [['2:49:31', '3:01:44', 'Functions']],
  steps: [
  T('Your own functions', c`A function is a named block of code. **Parameters** are its inputs; ~return~ hands back an answer.`, c`
function greet(name) {
    console.log("Hello " + name);
}

function square(n) {
    return n * n;
}

greet("Ada");                  // Hello Ada
console.log(square(4) + 1);    // 17`, c`A function without ~return~ gives back ~undefined~.`),
  P(c`
function double(n) {
    return n * 2;
}
console.log(double(double(3)));`, '12'),
  P(c`
function nothing() {}
console.log(nothing());`, 'undefined'),
  T('Default values', c`Give a parameter a default for when it is left out:`, c`
function welcome(name = "stranger") {
    return "Welcome, " + name;
}
console.log(welcome());        // Welcome, stranger
console.log(welcome("Bo"));    // Welcome, Bo`),
  X({ q: c`Write ~isEven(n)~ that returns ~true~ or ~false~. The code below uses it.`, start: c`
// write isEven here


const n = Number(prompt("Number: "));
console.log(isEven(n) ? "even" : "odd");`, tests: [{ in: '4\n', re: 'even$' }, { in: '7\n', re: 'odd$' }], sol: c`
function isEven(n) {
    return n % 2 === 0;
}

const n = Number(prompt("Number: "));
console.log(isEven(n) ? "even" : "odd");` }),
  X({ q: c`Write ~toCelsius(f)~ that converts Fahrenheit to Celsius: (f − 32) × 5 / 9. Print the result with 1 decimal.`, start: c`
// write toCelsius here


const f = Number(prompt("Fahrenheit: "));
console.log(toCelsius(f).toFixed(1) + "C");`, tests: [{ in: '212\n', has: ['100.0C'] }, { in: '32\n', has: ['0.0C'] }, { in: '98.6\n', has: ['37.0C'] }], sol: c`
function toCelsius(f) {
    return (f - 32) * 5 / 9;
}

const f = Number(prompt("Fahrenheit: "));
console.log(toCelsius(f).toFixed(1) + "C");` }),
] },

{ id: 'scope', title: 'Scope', icon: '🏠', desc: 'Where variables live and die.',
  v: [['3:01:44', '3:07:10', 'Variable scope']],
  steps: [
  T('Block scope', c`A variable declared with ~let~ or ~const~ only exists inside the ~{ }~ where it was declared. Functions get their own private variables too.`, c`
let score = 10;            // global: visible everywhere

function addBonus() {
    let bonus = 5;         // local: only inside addBonus
    score += bonus;
}
addBonus();
console.log(score);        // 15
console.log(bonus);        // ReferenceError: bonus is not defined`),
  P(c`
let x = 1;
{
    let x = 2;
    console.log(x);
}
console.log(x);`, '2\n1', c`The inner ~x~ is a different variable that disappears at the closing brace.`),
  Q(c`Why prefer local variables over global ones?`, ['They are faster to type', 'Nothing else can change them by accident', 'Globals are not allowed', 'They use less memory'], 1),
  X({ q: c`This should print ~Total: 60~, but it crashes. Fix the scope problem so ~total~ can be printed after the loop.`, start: c`
const prices = [10, 20, 30];
for (const p of prices) {
    let total = 0;
    total += p;
}
console.log("Total: " + total);`, tests: [{ out: 'Total: 60' }], not: [['"Total: 60', 'Calculate it — no hard-coding.']], sol: c`
const prices = [10, 20, 30];
let total = 0;
for (const p of prices) {
    total += p;
}
console.log("Total: " + total);`, hint: c`Declare ~total~ before the loop, so it lives outside it — and is not reset every round.` }),
] },

{ id: 'arrows', title: 'Function expressions & arrows', icon: '🎯', desc: 'Functions are values — and the short way to write them.',
  v: [['4:45:07', '4:52:39', 'Function expressions'], ['4:52:39', '5:00:40', 'Arrow functions']],
  steps: [
  T('Functions are values', c`In JavaScript a function can be stored in a variable, just like a number. The **arrow** form is a shorter way to write it.`, c`
const add = function (a, b) {      // function expression
    return a + b;
};

const add2 = (a, b) => a + b;      // arrow function: same thing
const shout = word => word.toUpperCase() + "!";   // one parameter: no brackets needed

console.log(add2(2, 3));      // 5
console.log(shout("hey"));    // HEY!`, c`With one expression after ~=>~, the result is returned automatically. With ~{ }~ you need ~return~.`),
  P(c`
const triple = n => n * 3;
console.log(triple(4) + triple(1));`, '15'),
  P(c`
const f = (a, b = 10) => a - b;
console.log(f(15), f(15, 5));`, '5 10'),
  F('Write an arrow function that adds one.', c`const plusOne = n [[=>]] n + 1;`),
  X({ q: c`Write an arrow function ~area~ that takes ~width~ and ~height~ and returns their product. Then print the area for the two numbers typed in.`, start: c`
// const area = ...

const w = Number(prompt("Width: "));
const h = Number(prompt("Height: "));
console.log(area(w, h));`, tests: [{ in: '3\n4\n', re: '(^|\\n)12$' }, { in: '2.5\n2\n', re: '(^|\\n)5$' }], must: [[c`=>`, c`Write it as an arrow function.`]], sol: c`
const area = (width, height) => width * height;

const w = Number(prompt("Width: "));
const h = Number(prompt("Height: "));
console.log(area(w, h));` }),
] },

{ id: 'closures', title: 'Closures', icon: '🔒', desc: 'Functions that remember.',
  v: [['6:48:09', '6:59:07', 'Closures']],
  steps: [
  T('A function with a memory', c`A function made inside another function keeps access to the outer function's variables — even after the outer function has finished. That is a **closure**.`, c`
function makeCounter() {
    let count = 0;                 // private: nothing else can touch it
    return () => {
        count++;
        return count;
    };
}

const next = makeCounter();
console.log(next());   // 1
console.log(next());   // 2`),
  P(c`
function makeCounter() {
    let count = 0;
    return () => ++count;
}
const a = makeCounter();
const b = makeCounter();
a(); a();
console.log(a(), b());`, '3 1', c`Each call to ~makeCounter~ creates a separate ~count~.`),
  X({ q: c`Write ~makeMultiplier(n)~ that returns a function which multiplies its input by ~n~. The test code is ready.`, start: c`
// write makeMultiplier here


const double = makeMultiplier(2);
const triple = makeMultiplier(3);
console.log(double(5), triple(5));`, tests: [{ out: '10 15' }], sol: c`
function makeMultiplier(n) {
    return x => x * n;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
console.log(double(5), triple(5));` }),
] },
],
quiz: [
  P(c`
const sq = n => n * n;
console.log(sq(3) + sq(4));`, '25'),
  Q(c`What does a function return if it has no ~return~?`, ['0', 'null', 'undefined', 'An error'], 2),
  P(c`
function f(a, b = 2) { return a * b; }
console.log(f(5));`, '10'),
  Q(c`Which is a valid arrow function that returns the sum of a and b?`, [c`~(a, b) -> a + b~`, c`~(a, b) => a + b~`, c`~function => a + b~`, c`~=> (a, b) a + b~`], 1),
  F('Return the bigger number.', c`
function bigger(a, b) {
  [[return]] a > b ? a : b;
}`),
] });

/* ============ JavaScript TOPIC 5: ARRAYS ============ */
topic({ id: 'arrays', title: 'Arrays', icon: '🗃️', color: '#00cd9c', blurb: 'Lists of values: add, remove, search, sort and spread.',
lessons: [
{ id: 'basics', title: 'Array basics', icon: '🗃️', desc: 'Make lists, read them, change them.',
  v: [['3:23:28', '3:31:33', 'Arrays']],
  steps: [
  T('Lists of values', c`An **array** holds many values in order. Positions (indexes) start at 0.`, c`
const fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]);        // apple
console.log(fruits.length);    // 3
fruits.push("date");           // add to the end
fruits.pop();                  // remove from the end
fruits.unshift("kiwi");        // add to the start
fruits.shift();                // remove from the start
console.log(fruits.indexOf("cherry"));     // 2
console.log(fruits.includes("mango"));     // false`, c`~const~ stops the variable being reassigned, but you can still change the array's contents.`),
  P(c`
const a = [10, 20, 30];
a.push(40);
console.log(a.length, a[a.length - 1]);`, '4 40'),
  P(c`console.log([1, 2, 3]);`, '[ 1, 2, 3 ]', c`That is how Node prints an array. (A browser console shows it slightly differently.)`),
  T('Looping over an array', c`~for...of~ gives you each value in turn — the tidiest way to visit every item.`, c`
const scores = [72, 85, 90];
let total = 0;
for (const s of scores) {
    total += s;
}
console.log(total / scores.length);   // 82.33...`),
  X({ q: c`Print the largest number in the array **without** using ~Math.max~.`, start: c`const nums = [12, 45, 7, 89, 33, 21];`, tests: [{ out: '89' }], not: [[c`Math\.max`, c`Do it with a loop this time.`]], sol: c`
const nums = [12, 45, 7, 89, 33, 21];
let best = nums[0];
for (const n of nums) {
    if (n > best) best = n;
}
console.log(best);` }),
  X({ q: c`Keep reading names until the user types ~done~. Then print how many names there were, and the names joined with commas:

~3 names: Ada, Bo, Cy~`, tests: [{ in: 'Ada\nBo\nCy\ndone\n', has: ['3 names: Ada, Bo, Cy'] }, { in: 'Zed\ndone\n', has: ['1 names: Zed'] }], sol: c`
const names = [];
let name = prompt("Name: ");
while (name !== "done") {
    names.push(name);
    name = prompt("Name: ");
}
console.log(names.length + " names: " + names.join(", "));`, hint: c`~names.push(name)~ to collect them; ~names.join(", ")~ to glue them together.` }),
] },

{ id: 'spread', title: 'Spread and rest', icon: '📖', desc: 'The three dots that unpack and collect.',
  v: [['3:31:33', '3:36:27', 'Spread operator'], ['3:36:27', '3:44:32', 'Rest parameters']],
  steps: [
  T('...spread', c`~...~ **spreads** an array out into separate values — handy for copying and combining.`, c`
const a = [1, 2];
const b = [3, 4];
const both = [...a, ...b];          // [1, 2, 3, 4]
const copy = [...a];                // a new array, not the same one
console.log(Math.max(...both));     // 4`),
  T('...rest', c`In a function's parameters, ~...~ does the opposite: it **collects** any number of arguments into an array.`, c`
function sum(...nums) {
    let total = 0;
    for (const n of nums) total += n;
    return total;
}
console.log(sum(1, 2, 3, 4));   // 10`),
  P(c`
const x = [5, 1, 9];
const y = [...x, 7];
console.log(y.length, Math.min(...y));`, '4 1'),
  P(c`
const a = [1, 2];
const b = a;
const c = [...a];
a.push(3);
console.log(b.length, c.length);`, '3 2', c`~b~ is the **same** array as ~a~; ~c~ is a copy, so it did not change.`),
  X({ q: c`Write ~average(...nums)~ that returns the average of any number of arguments.`, start: c`
// write average here


console.log(average(2, 4, 6));
console.log(average(10, 20));`, tests: [{ out: '4\n15' }], must: [[c`\.\.\.\s*\w+`, c`Use a rest parameter: ~(...nums)~.`]], sol: c`
function average(...nums) {
    let total = 0;
    for (const n of nums) total += n;
    return total / nums.length;
}

console.log(average(2, 4, 6));
console.log(average(10, 20));` }),
] },

{ id: 'sorting', title: 'Sorting', icon: '📶', desc: 'sort() — and the number trap.',
  v: [['6:29:21', '6:36:03', 'Sorting'], ['6:36:03', '6:40:08', 'Shuffle an array']],
  steps: [
  T('sort() sorts as text', c`~sort()~ sorts an array **in place**. But by default it compares items as **text** — which goes wrong for numbers:`, c`
const words = ["pear", "apple", "fig"];
words.sort();                       // ["apple", "fig", "pear"]

const nums = [10, 9, 100, 1];
nums.sort();                        // [1, 10, 100, 9]   😱 compared as text
nums.sort((a, b) => a - b);         // [1, 9, 10, 100]   ascending
nums.sort((a, b) => b - a);         // [100, 10, 9, 1]   descending`, c`The function tells sort how to compare two items: negative means ~a~ first, positive means ~b~ first.`),
  P(c`console.log([3, 20, 100].sort().join(" "));`, '100 20 3', c`As text, "1" comes before "2", which comes before "3".`),
  P(c`console.log([3, 20, 100].sort((a, b) => a - b).join(" "));`, '3 20 100'),
  X({ q: c`Sort the scores from **highest to lowest** and print them joined with spaces.`, start: c`const scores = [72, 9, 100, 85, 40];`, tests: [{ out: '100 85 72 40 9' }], sol: c`
const scores = [72, 9, 100, 85, 40];
scores.sort((a, b) => b - a);
console.log(scores.join(" "));` }),
  X({ q: c`Print the names sorted by **length**, shortest first.`, start: c`const names = ["Margaret", "Al", "Grace", "Linus"];`, tests: [{ out: 'Al,Grace,Linus,Margaret' }], sol: c`
const names = ["Margaret", "Al", "Grace", "Linus"];
names.sort((a, b) => a.length - b.length);
console.log(names.join(","));`, hint: c`~(a, b) => a.length - b.length~` }),
] },
],
quiz: [
  P(c`
const a = ["x", "y", "z"];
console.log(a.indexOf("z"), a.includes("w"));`, '2 false'),
  P(c`console.log([5, 25, 100].sort().join(","));`, '100,25,5'),
  Q(c`What does ~arr.pop()~ do?`, ['Removes the first item', 'Removes the last item', 'Adds an item', 'Empties the array'], 1),
  P(c`console.log([...[1, 2], ...[3]].length);`, '3'),
  F('Sort numbers ascending.', c`nums.sort((a, b) => a [[-]] b);`, null, 1),
] });
