/* ================= C# =================
   Two starting points, exactly like the C++ course:
     track: 'new'  beginner path only (this file)
     track: 'c'    "I already know C" path only (cs-1.js, first topic)
     no track      both paths
   C# code is compiled by the online compiler (online: true) - there is no local C# compiler.
   That compiler is Mono's, which understands C# up to version 7: no switch expressions, records,
   "using var", ranges or top-level statements in runnable code. */
course('cs', {
  name: 'C#', badge: 'C#', color: '#a560f0', video: 'wxznTygnRfQ', glossTry: 'property', online: true,
  tagline: 'C-style syntax, no manual memory, a huge built-in library — and the language of Unity.',
  blank: 'using System;\n\nclass Program {\n    static void Main() {\n        \n    }\n}\n',
  wandbox: { compiler: 'mono-6.12.0.199' }, oneAtATime: true,
  wrap: (body, uses) => 'using System;\n' + uses.map(u => 'using ' + u + ';\n').join('') + '\nclass Program {\n    static void Main() {\n' + body + '\n    }\n}\n',
});

/* ============ BEGINNER 1: FIRST STEPS ============ */
topic({ id: 'b-first', track: 'new', title: 'First Steps', icon: '🌱', color: '#58cc02', blurb: 'Your first programs: print, store, calculate, ask.',
lessons: [
{ id: 'hello', title: 'Your first program', icon: '🚀', desc: 'Meet Main, Console.WriteLine and the semicolon that will haunt you.',
  v: [['0:06:30', '0:10:48', 'Output'], ['0:00:00', '0:06:30', 'Optional: installing Visual Studio on your own machine']],
  steps: [
  T('What is a program?', c`A program is a list of instructions the computer follows, top to bottom, exactly as written. C# (say "C sharp") is used for games — it is the language of the Unity engine — as well as websites, apps and business software.

This is a complete C# program:`, c`
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`, c`It looks like a lot of wrapping for one instruction. Only the middle line is "yours"; the rest is the same in every program you will write for a while.`),
  T('The parts', c`~using System;~ — borrow the standard toolkit. That is where ~Console~ lives.

~class Program { ... }~ — in C#, all code lives inside a **class**. For now, treat it as a box with your program's name on it.

~static void Main() { ... }~ — the starting point. The computer runs whatever is between these braces.

~Console.WriteLine("text");~ — print a line of text on the screen.

~;~ — ends every instruction. Forget one and the program will not build.`),
  Q('Where does a C# program start running?', ['At the first line of the file', c`At the ~Main~ method`, c`At ~using System;~`, c`At the word ~class~`], 1),
  T('WriteLine vs Write', c`~Console.WriteLine~ prints and then moves to a new line. ~Console.Write~ prints and **stays** on the same line.`, c`
Console.Write("A");
Console.Write("B");
Console.WriteLine("C");
Console.WriteLine("D");`, c`That prints ~ABC~ on the first line and ~D~ on the second.`),
  P(c`
Console.WriteLine("Ready");
Console.Write("Set ");
Console.WriteLine("Go!");`, 'Ready\nSet Go!'),
  F('Rebuild Hello World.', c`
using [[System]];

class Program {
    static void [[Main]]() {
        [[Console]].[[WriteLine]]("Hello, World!");
    }
}`),
  X({ q: c`Your turn. Make the program print exactly: ~I am learning C#!~

Press **Run** to see what your code does, and **Check** when you think it is right. (C# runs on an online compiler, so each run takes a few seconds.)`, start: M(c`
        // your code goes here
`), tests: [{ out: 'I am learning C#!' }], hint: c`~Console.WriteLine("text goes here");~ — and don't forget the semicolon.`, sol: M(c`
        Console.WriteLine("I am learning C#!");`) }),
] },

{ id: 'vars', title: 'Variables', icon: '📦', desc: 'Labelled boxes for numbers, letters and text.',
  v: [['0:10:48', '0:19:32', 'Variables']],
  steps: [
  T('A box with a label and a type', c`A **variable** is a named box that holds a value. In C# every box has a **type** that says what kind of value fits in it — and the type never changes.`, c`
int lives = 3;              // whole numbers
double price = 4.99;        // numbers with a decimal point
char grade = 'A';           // ONE character, in single quotes
bool gameOver = false;      // true or false
string name = "Ada";        // text, in double quotes`, c`~=~ does not mean "equals". It means "put the value on the right into the box on the left". ~lives = lives - 1;~ makes perfect sense: work out the right side, store it on the left.`),
  Q('Which type fits the price 2.50?', [c`~int~`, c`~double~`, c`~char~`, c`~bool~`], 1, c`~int~ cannot hold the ~.50~.`),
  T('Printing variables', c`Put a ~$~ in front of the string and you can drop variables straight into it with curly braces. This is called **string interpolation**.`, c`
string name = "Ada";
int age = 36;

Console.WriteLine($"{name} is {age} years old");
Console.WriteLine($"Next year: {age + 1}");`, c`Anything inside ~{ }~ is worked out first, then turned into text. Without the ~$~ you would literally print the braces.`),
  P(c`
int lives = 3;
Console.WriteLine($"Lives: {lives}");
lives = lives - 1;
Console.WriteLine($"Lives: {lives}");`, 'Lives: 3\nLives: 2'),
  F('Create a whole-number variable and print it.', c`
[[int]] score = 100;
Console.WriteLine([[$]]"Score: {[[score]]}");`),
  X({ q: c`Create an ~int~ called ~age~ holding 15 and a ~string~ called ~name~ holding Sam. Then print exactly:

~Sam is 15~`, start: M(c`
        // create the two variables, then print
`), tests: [{ out: 'Sam is 15' }], must: [[String.raw`int\s+age`, c`Create ~int age~.`], [String.raw`string\s+name`, c`Create ~string name~.`]], hint: c`~Console.WriteLine($"{name} is {age}");~`, sol: M(c`
        int age = 15;
        string name = "Sam";
        Console.WriteLine($"{name} is {age}");`) }),
] },

{ id: 'io', title: 'Maths & input', icon: '🧮', desc: 'Calculate things, and ask the user questions.',
  v: [['0:31:24', '0:35:54', 'Arithmetic operators'], ['0:27:49', '0:31:24', 'User input']],
  steps: [
  T('Arithmetic', c`~+~ ~-~ ~*~ ~/~ do what you expect — with one famous surprise.`, c`
int a = 7, b = 2;

a + b      // 9
a * b      // 14
a / b      // 3    <- not 3.5!
a % b      // 1    the remainder
7.0 / 2    // 3.5`, c`Dividing two whole numbers gives a whole number: the remainder is thrown away. Make one side a decimal to get a decimal answer. ~%~ ("modulus") gives you the remainder instead — perfect for "is it even?".

Shortcuts: ~score += 10;~ adds 10. ~score++;~ adds exactly 1.`),
  P(c`
int total = 17;
Console.WriteLine(total / 5);
Console.WriteLine(total % 5);`, '3\n2', c`5 goes into 17 three times, with 2 left over.`),
  T('Asking the user', c`~Console.ReadLine()~ waits for the user to type a line and press Enter, then hands you that line as a ~string~.`, c`
Console.Write("What is your name? ");
string name = Console.ReadLine();
Console.WriteLine($"Hello, {name}!");`),
  T('Text is not a number', c`~ReadLine~ **always** gives you text. The text ~"42"~ is not the number 42 — you cannot do maths with it until you convert it.`, c`
string typed = Console.ReadLine();     // "42"
int age = int.Parse(typed);            // 42

// usually written in one line:
int age2 = int.Parse(Console.ReadLine());
double height = double.Parse(Console.ReadLine());`, c`~int.Parse~ turns text into a whole number, ~double.Parse~ into a decimal one.`),
  Q(c`The user types 5. What does this print?

~string a = Console.ReadLine();~
~Console.WriteLine(a + a);~`, ['10', '55', '5', 'An error'], 1, c`~a~ is text, and ~+~ on text **joins** it. Convert with ~int.Parse~ first to get 10.`),
  X({ q: c`Read two whole numbers, each on its own line. Print their sum on one line and their product on the next.

Input ~4~ and ~5~ gives:

~9~
~20~`, start: M(c`
        // read two numbers with int.Parse(Console.ReadLine())

`), tests: [{ in: '4\n5\n', out: '9\n20' }], must: [['int\\.Parse|Convert\\.ToInt32', c`Convert the text to a number with ~int.Parse~.`]], hint: c`~int a = int.Parse(Console.ReadLine());~ twice, then ~Console.WriteLine(a + b);~`, sol: M(c`
        int a = int.Parse(Console.ReadLine());
        int b = int.Parse(Console.ReadLine());
        Console.WriteLine(a + b);
        Console.WriteLine(a * b);`) }),
] },
],
quiz: [
  Q('Every C# instruction ends with…', ['a new line', 'a semicolon', 'a full stop', 'a closing brace'], 1),
  P(c`
int x = 10;
x += 5;
x++;
Console.WriteLine(x / 4);`, '4'),
  Q(c`Which prints the value of ~score~ inside a sentence?`, [c`~Console.WriteLine("Score: {score}");~`, c`~Console.WriteLine($"Score: {score}");~`, c`~Console.WriteLine('Score: score');~`, c`~Console.WriteLine(Score: score);~`], 1, c`Without the ~$~, the braces are printed as they are.`),
  F('Read a whole number from the user.', c`
int n = int.[[Parse]](Console.[[ReadLine]]());`),
  Q(c`What is ~9 % 4~ ?`, ['2', '2.25', '1', '36'], 2),
  Q(c`What is the difference between ~Console.Write~ and ~Console.WriteLine~ ?`, ['Write is faster', 'WriteLine moves to a new line afterwards', 'Write only prints numbers', 'There is none'], 1),
] });

/* ============ BEGINNER 2: DECISIONS & LOOPS ============ */
topic({ id: 'b-logic', track: 'new', title: 'Decisions & Loops', icon: '🤔', color: '#ff9600', blurb: 'Teach your programs to choose, and to repeat.',
lessons: [
{ id: 'if', title: 'if, else if, else', icon: '🚦', desc: 'Run some code only when a condition is true.',
  v: [['0:53:26', '0:59:43', 'If statements'], ['1:02:50', '1:06:36', 'Logical operators']],
  steps: [
  T('Making a choice', c`An ~if~ runs its block only when the condition in the brackets is true. ~else if~ tries another condition; ~else~ catches everything that is left.`, c`
int temp = 25;

if (temp > 30) {
    Console.WriteLine("Hot");
} else if (temp > 15) {
    Console.WriteLine("Nice");
} else {
    Console.WriteLine("Cold");
}`, c`Only **one** branch ever runs: the first one whose condition is true.`),
  T('Comparing', c`These produce ~true~ or ~false~:

~==~ equal to · ~!=~ not equal to · ~>~ ~<~ ~>=~ ~<=~

And these combine them: ~&&~ (and — both must be true), ~||~ (or — at least one), ~!~ (not — flips it).`, c`
if (age >= 13 && age <= 19) {
    Console.WriteLine("Teenager");
}`, c`~=~ **stores** a value, ~==~ **compares**. Mixing them up is the classic beginner slip — luckily C# refuses to compile ~if (x = 5)~.`),
  Q(c`Which checks whether ~score~ is exactly 100?`, [c`~if (score = 100)~`, c`~if (score == 100)~`, c`~if score == 100~`, c`~if (score === 100)~`], 1),
  P(c`
int n = 15;
if (n > 10) {
    Console.Write("big ");
} else if (n > 5) {
    Console.Write("medium ");
}
Console.WriteLine("done");`, 'big done', c`15 is also greater than 5, but the first matching branch wins and the rest are skipped.`),
  X({ q: c`Read a whole number. Print ~even~ if it divides by 2, otherwise ~odd~.`, start: M(c`
        int n = int.Parse(Console.ReadLine());
        // decide and print

`), tests: [{ in: '8\n', out: 'even' }, { in: '7\n', out: 'odd' }], hint: c`The remainder tells you: ~if (n % 2 == 0)~`, sol: M(c`
        int n = int.Parse(Console.ReadLine());
        if (n % 2 == 0) {
            Console.WriteLine("even");
        } else {
            Console.WriteLine("odd");
        }`) }),
  Q(c`~age~ is 20. Is ~age >= 13 && age <= 19~ true?`, ['Yes', 'No — the second part is false, and && needs both', 'Only the first time', 'It is an error'], 1),
] },

{ id: 'loops', title: 'while & for loops', icon: '🔁', desc: 'Make the computer do the boring part a thousand times.',
  v: [['1:06:36', '1:09:45', 'While loops'], ['1:09:45', '1:13:24', 'For loops']],
  steps: [
  T('while: repeat as long as…', c`A ~while~ loop checks its condition, runs the block, and checks again — until the condition is false.`, c`
int countdown = 3;

while (countdown > 0) {
    Console.WriteLine(countdown);
    countdown--;
}
Console.WriteLine("Lift off!");`, c`If nothing inside the loop ever makes the condition false, it runs forever: an **infinite loop**.`),
  T('for: the counting loop', c`When you know how many times to repeat, ~for~ puts the three parts of counting on one line: **start; keep going while; step**.`, c`
for (int i = 1; i <= 3; i++) {
    Console.WriteLine(i);
}`, c`That prints 1, 2, 3. Programmers usually count from 0: ~for (int i = 0; i < 3; i++)~ also runs three times, with ~i~ being 0, 1, 2.`),
  P(c`
for (int i = 0; i < 4; i++) {
    Console.Write(i * 2);
    Console.Write(" ");
}`, '0 2 4 6'),
  Q(c`How many times does this loop run?

~for (int i = 0; i < 5; i++)~`, ['4', '5', '6', 'Forever'], 1, c`~i~ takes the values 0, 1, 2, 3, 4 — five of them.`),
  T('break and continue', c`~break~ leaves the loop immediately. ~continue~ skips the rest of this round and starts the next one.`, c`
for (int i = 1; i <= 10; i++) {
    if (i == 3) continue;    // skip 3
    if (i == 6) break;       // stop completely at 6
    Console.Write(i);        // 1245
}`),
  X({ q: c`Read a whole number ~n~. Print the sum of all the numbers from 1 to ~n~.

Input ~5~ gives ~15~ (1+2+3+4+5).`, start: M(c`
        int n = int.Parse(Console.ReadLine());
        int total = 0;
        // add up 1..n with a loop

        Console.WriteLine(total);`), tests: [{ in: '5\n', out: '15' }, { in: '10\n', out: '55' }], must: [[String.raw`\b(for|while)\b`, 'Use a loop.']], hint: c`~for (int i = 1; i <= n; i++) { total += i; }~`, sol: M(c`
        int n = int.Parse(Console.ReadLine());
        int total = 0;
        for (int i = 1; i <= n; i++) {
            total += i;
        }
        Console.WriteLine(total);`) }),
] },
],
quiz: [
  P(c`
int x = 7;
if (x > 10) {
    Console.WriteLine("A");
} else if (x > 5) {
    Console.WriteLine("B");
} else {
    Console.WriteLine("C");
}`, 'B'),
  Q(c`~||~ means…`, ['and', 'or', 'not', 'equals'], 1),
  P(c`
int n = 3;
while (n > 0) {
    Console.Write(n);
    n--;
}`, '321'),
  F('Count from 0 to 9.', c`
[[for]] (int i = 0; i [[<]] 10; i[[++]]) {
    Console.WriteLine(i);
}`),
  Q(c`What does ~break~ do inside a loop?`, ['Skips to the next round', 'Leaves the loop immediately', 'Pauses the program', 'Restarts the loop'], 1),
  Q(c`Which compares two values?`, [c`~=~`, c`~==~`, c`~=>~`, c`~:=~`], 1),
] });

/* ============ BEGINNER 3: BUILDING BLOCKS ============ */
topic({ id: 'b-build', track: 'new', title: 'Building Blocks', icon: '🧩', color: '#ffc800', blurb: 'Methods and arrays — the tools the rest of the course builds on.',
lessons: [
{ id: 'methods', title: 'Methods', icon: '📞', desc: 'Name a block of code. Call it whenever you need it.',
  v: [['1:54:42', '2:00:37', 'Methods'], ['2:00:37', '2:04:12', 'Return keyword']],
  steps: [
  T('Write once, use forever', c`A **method** is a named block of code (other languages call it a function). You have been writing one all along: ~Main~. Here is another, next to it inside the class:`, c`
using System;

class Program {
    static int Square(int n) {        // takes an int, gives back an int
        return n * n;
    }

    static void Main() {
        Console.WriteLine(Square(4));    // 16
        Console.WriteLine(Square(9));    // 81
    }
}`, c`~static int Square(int n)~ reads: "a method called ~Square~, which takes one ~int~ (called ~n~ inside it) and **returns** an ~int~". ~return~ hands the answer back to whoever called it. The word ~static~ will make sense in the Classes topic — for now, every method needs it.`),
  T('void: nothing to give back', c`Some methods just **do** something. Their return type is ~void~.`, c`
static void Greet(string name) {
    Console.WriteLine($"Hello, {name}!");
}

Greet("Ada");
Greet("Linus");`, c`The values in the brackets when you call a method are **arguments**; the variables that receive them are **parameters**. By convention, C# method names start with a capital letter.`),
  P(c`
static int Add(int a, int b) {
    return a + b;
}

static void Main() {
    int x = Add(2, 3);
    Console.WriteLine(Add(x, 10));
}`, '15'),
  Q(c`What does a ~void~ method return?`, ['0', 'Nothing', 'An empty string', 'Whatever was printed'], 1),
  X({ q: c`Write a method ~static int Triple(int n)~ that returns ~n~ times 3.

The starter ~Main~ must print:

~12~
~30~`, start: c`using System;

class Program {
    // write Triple here

    static void Main() {
        Console.WriteLine(Triple(4));
        Console.WriteLine(Triple(10));
    }
}
`, tests: [{ out: '12\n30' }], hint: c`~static int Triple(int n) { return n * 3; }~`, sol: c`using System;

class Program {
    static int Triple(int n) {
        return n * 3;
    }

    static void Main() {
        Console.WriteLine(Triple(4));
        Console.WriteLine(Triple(10));
    }
}
` }),
  Q(c`In ~static int Area(int w, int h)~ what are ~w~ and ~h~ ?`, ['Return values', 'Parameters', 'Methods', 'Types'], 1),
] },

{ id: 'arrays', title: 'Arrays & foreach', icon: '🗃️', desc: 'Many values under one name, numbered from zero.',
  v: [['1:46:53', '1:52:50', 'Arrays'], ['1:52:50', '1:54:42', 'Foreach loop']],
  steps: [
  T('A row of boxes', c`An **array** holds several values of the same type, side by side. Each one has a position number, its **index** — and the first index is **0**.`, c`
int[] scores = { 90, 75, 88 };

Console.WriteLine(scores[0]);       // 90  (the first)
Console.WriteLine(scores[2]);       // 88  (the last)
Console.WriteLine(scores.Length);   // 3

scores[1] = 80;                     // change the middle one`, c`Three elements means indexes 0, 1 and 2. Ask for ~scores[3]~ and C# stops the program with an ~IndexOutOfRangeException~ — it never lets you read memory that is not yours.`),
  Q(c`An array has 5 elements. What is the index of the last one?`, ['5', '4', '6', '1'], 1, c`Always ~Length - 1~.`),
  T('Visiting every element', c`The classic way uses a counting loop. The tidier way is ~foreach~: "for each value in the array".`, c`
int[] scores = { 90, 75, 88 };

for (int i = 0; i < scores.Length; i++) {   // i is the index
    Console.WriteLine(scores[i]);
}

foreach (int s in scores) {                 // s is each value
    Console.WriteLine(s);
}`, c`Use ~foreach~ whenever you do not need the index.`),
  P(c`
int[] nums = { 4, 1, 3 };
int total = 0;
foreach (int n in nums) {
    total += n;
}
Console.WriteLine(total);`, '8'),
  T('An empty array of a given size', c`When you know the size but not the values yet, create the array with ~new~. Every element starts at 0.`, c`
int[] rolls = new int[6];    // six ints, all 0
rolls[0] = 4;`),
  X({ q: c`Find the largest value in ~temps~ and print it. Use a loop.

Expected output: ~31~`, start: M(c`
        int[] temps = { 18, 25, 31, 22, 29 };
        int best = temps[0];
        // loop over temps

        Console.WriteLine(best);`), tests: [{ out: '31' }], must: [[String.raw`\b(for|foreach)\b`, c`Use a ~foreach~ or ~for~ loop.`]], hint: c`~foreach (int t in temps) { if (t > best) best = t; }~`, sol: M(c`
        int[] temps = { 18, 25, 31, 22, 29 };
        int best = temps[0];
        foreach (int t in temps) {
            if (t > best) best = t;
        }
        Console.WriteLine(best);`) }),
] },
],
quiz: [
  P(c`
static int Twice(int n) {
    return n * 2;
}

static void Main() {
    Console.WriteLine(Twice(Twice(3)));
}`, '12'),
  Q('The first element of an array has index…', ['1', '0', '-1', 'It depends'], 1),
  P(c`
int[] a = { 5, 6, 7 };
a[1] = a[0] + a[2];
Console.WriteLine(a[1]);`, '12'),
  F('Print every element.', c`
string[] names = { "Ada", "Bo" };
[[foreach]] (string n [[in]] names) {
    Console.WriteLine(n);
}`),
  Q(c`How do you get the number of elements in the array ~scores~ ?`, [c`~scores.Length~`, c`~len(scores)~`, c`~scores.size()~`, c`~sizeof(scores)~`], 0),
  Q(c`What does ~new int[4]~ contain?`, ['Four random numbers', 'Four zeros', 'Nothing — it is empty', 'The number 4'], 1),
] });
