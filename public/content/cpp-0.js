/* ================= C++ =================
   Two starting points:
     track: 'new'  beginner path only (this file)  - assumes nothing
     track: 'c'    "I already know C" path only (cpp-1.js, first topic)
     no track      both paths */
course('cpp', {
  name: 'C++', badge: 'C++', logo: 'logos/cpp.svg', color: '#1c8ef6', video: '-TkoO8Z07hI', glossTry: 'reference',
  tagline: 'C plus classes, strings that just work and memory that cleans up after itself.',
  blank: '#include <iostream>\n\nint main() {\n    \n    return 0;\n}\n',
  wandbox: { compiler: 'gcc-13.2.0', 'compiler-option-raw': '-std=c++20\n-Wall' },
  wrap: (body, incs) => '#include <iostream>\n' + incs.map(h => '#include <' + h + '>\n').join('') + '\nint main() {\n' + body + '\n    return 0;\n}\n',
});

/* ============ BEGINNER 1: FIRST STEPS ============ */
topic({ id: 'b-first', track: 'new', title: 'First Steps', icon: '🌱', color: '#58cc02', blurb: 'Your first programs: print, store, calculate, ask.',
lessons: [
{ id: 'hello', title: 'Your first program', icon: '🚀', desc: 'Meet main(), std::cout and the semicolon that will haunt you.',
  v: [['0:00:00', '0:13:30', 'C++ tutorial for beginners (setup + first program)']],
  steps: [
  T('What is a program?', c`A program is a list of instructions the computer follows, top to bottom, exactly as written. C++ is one of the most widely used languages for writing them: games, browsers, robots and operating systems are built with it.

This is a complete C++ program:`, c`
#include <iostream>

int main() {
    std::cout << "Hello, World!\n";
    return 0;
}`, c`Don't memorise it. You are about to take it apart.`),
  T('The parts', c`~#include <iostream>~ — borrow the toolkit for **i**nput and **o**utput. That is where ~std::cout~ lives.

~int main() { ... }~ — the starting point. The computer runs whatever is between these braces.

~std::cout << "text";~ — print text to the screen. Read ~<<~ as "send this to the screen".

~\n~ — inside the quotes, this means "start a new line".

~;~ — ends every instruction. Forget one and the program will not build.

~return 0;~ — tells the computer "finished, no problems".`),
  Q('Where does a C++ program start running?', ['At the first line of the file', c`At the ~main~ function`, c`At ~#include~`, c`Wherever the first ~std::cout~ is`], 1),
  P(c`
std::cout << "A";
std::cout << "B\n";
std::cout << "C";`, 'AB\nC', c`~std::cout~ does not press Enter for you. Only ~\n~ starts a new line.`),
  F('Rebuild Hello World.', c`
#include <[[iostream]]>

int [[main]]() {
    std::[[cout]] << "Hello, World!\n";
    return [[0]];
}`),
  X({ q: c`Your turn. Make the program print exactly: ~I am learning C++!~

Press **Run** to see what your code does, and **Check** when you think it is right.`, start: M(c`
    // your code goes here
`), tests: [{ out: 'I am learning C++!' }], hint: c`~std::cout << "text goes here\n";~ — and don't forget the semicolon.`, sol: M(c`
    std::cout << "I am learning C++!\n";`) }),
  Q(c`You forget the ~;~ after a line. What happens?`, ['The program runs but prints nothing', 'The compiler refuses to build the program', 'C++ adds it for you', 'The program stops halfway'], 1, c`Before a C++ program can run, a tool called the **compiler** translates the whole file. One mistake and you get no program at all — but you do get an error message with a line number.`),
] },

{ id: 'vars', title: 'Variables', icon: '📦', desc: 'Labelled boxes for numbers, letters and text.',
  v: [['0:13:30', '0:24:14', 'Variables and basic data types']],
  steps: [
  T('A box with a label and a type', c`A **variable** is a named box that holds a value. In C++ every box has a **type** that says what kind of value fits in it — and the type never changes.`, c`
int lives = 3;                 // whole numbers
double price = 4.99;           // numbers with a decimal point
char grade = 'A';              // ONE character, in single quotes
bool gameOver = false;         // true or false
std::string name = "Ada";      // text, in double quotes`, c`To print a variable, send it to ~std::cout~ **without** quotes. You can chain several ~<<~ in one line:`),
  P(c`
int lives = 3;
std::cout << "Lives: " << lives << "\n";
lives = lives - 1;
std::cout << "Lives: " << lives << "\n";`, 'Lives: 3\nLives: 2', c`~=~ does not mean "equals". It means "put the value on the right into the box on the left".`),
  Q('Which type fits the price 2.50?', [c`~int~`, c`~double~`, c`~char~`, c`~bool~`], 1, c`~int~ would throw away the ~.50~.`),
  Q(c`What is wrong with ~char letter = "A";~ ?`, ['Nothing', c`A ~char~ uses single quotes: ~'A'~`, 'Variable names cannot be "letter"', 'It needs two semicolons'], 1, c`Single quotes for one character, double quotes for text.`),
  F('Create a whole-number variable and print it.', c`
[[int]] score = 100;
std::cout << "Score: " << [[score]] << "\n";`),
  X({ q: c`Create an ~int~ called ~age~ holding 15 and a ~std::string~ called ~name~ holding Sam. Then print exactly:

~Sam is 15~`, start: c`#include <iostream>
#include <string>

int main() {
    // create the two variables, then print

    return 0;
}
`, tests: [{ out: 'Sam is 15' }], must: [[String.raw`int\s+age`, c`Create ~int age~.`], [String.raw`string\s+name`, c`Create ~std::string name~.`]], hint: c`~std::cout << name << " is " << age << "\n";~ — the spaces live inside the quotes.`, sol: c`#include <iostream>
#include <string>

int main() {
    int age = 15;
    std::string name = "Sam";
    std::cout << name << " is " << age << "\n";
    return 0;
}
` }),
] },

{ id: 'io', title: 'Maths & input', icon: '🧮', desc: 'Calculate things, and ask the user questions.',
  v: [['0:37:39', '0:43:18', 'Arithmetic operators'], ['0:47:05', '0:52:35', 'User input']],
  steps: [
  T('Arithmetic', c`~+~ ~-~ ~*~ ~/~ do what you expect — with one famous surprise.`, c`
int a = 7, b = 2;

a + b;    // 9
a * b;    // 14
a / b;    // 3   <- not 3.5!
a % b;    // 1   the remainder
7.0 / 2;  // 3.5`, c`Dividing two whole numbers gives a whole number: the remainder is thrown away. Make one side a decimal to get a decimal answer. ~%~ ("modulus") gives you the remainder instead — perfect for "is it even?".`),
  P(c`
int total = 17;
std::cout << total / 5 << " " << total % 5 << "\n";`, '3 2', c`5 goes into 17 three times, with 2 left over.`),
  T('Shortcuts', c`Changing a variable based on its own value is so common that it has shortcuts:`, c`
score = score + 10;   // the long way
score += 10;          // the same
score++;              // add exactly 1
score--;              // subtract exactly 1`),
  T('Asking the user: std::cin', c`~std::cin~ is the keyboard. ~>>~ takes what was typed and puts it **into** a variable. Notice the arrows point the other way from ~cout~.`, c`
int age;
std::cout << "How old are you? ";
std::cin >> age;
std::cout << "Next year: " << age + 1 << "\n";`, c`~std::cin >> word~ reads one word. For a whole line of text with spaces, use ~std::getline(std::cin, text);~`),
  Q(c`Which line reads a number into ~int n;~ ?`, [c`~std::cin << n;~`, c`~std::cin >> n;~`, c`~std::cout >> n;~`, c`~n = std::cin;~`], 1),
  X({ q: c`Read two whole numbers. Print their sum on one line and their product on the next.

Input ~4 5~ gives:

~9~
~20~`, start: M(c`
    int a, b;
    // read a and b, then print

`), tests: [{ in: '4 5\n', out: '9\n20' }, { in: '10 3\n', out: '13\n30' }], hint: c`~std::cin >> a >> b;~ then ~std::cout << a + b << "\n";~`, sol: M(c`
    int a, b;
    std::cin >> a >> b;
    std::cout << a + b << "\n";
    std::cout << a * b << "\n";`) }),
] },
],
quiz: [
  Q('Every C++ instruction ends with…', ['a new line', 'a semicolon', 'a full stop', 'a closing brace'], 1),
  P(c`
int x = 10;
x += 5;
x++;
std::cout << x / 4 << "\n";`, '4'),
  Q(c`Which type holds ~true~ or ~false~ ?`, [c`~int~`, c`~char~`, c`~bool~`, c`~double~`], 2),
  F('Read a number and print double it.', c`
int n;
std::cin [[>>]] n;
std::cout [[<<]] n * 2 << "\n";`),
  Q(c`What is ~9 % 4~ ?`, ['2', '2.25', '1', '36'], 2, c`4 goes into 9 twice with **1** left over.`),
  Q(c`What does ~std::cout << "Hi" << "\n";~ print after ~Hi~ ?`, ['The letters \\n', 'A new line', 'A space', 'Nothing'], 1),
] });

/* ============ BEGINNER 2: DECISIONS & LOOPS ============ */
topic({ id: 'b-logic', track: 'new', title: 'Decisions & Loops', icon: '🤔', color: '#ff9600', blurb: 'Teach your programs to choose, and to repeat.',
lessons: [
{ id: 'if', title: 'if, else if, else', icon: '🚦', desc: 'Run some code only when a condition is true.',
  v: [['0:58:44', '1:03:40', 'If statements'], ['1:18:53', '1:23:55', 'Logical operators']],
  steps: [
  T('Making a choice', c`An ~if~ runs its block only when the condition in the brackets is true. ~else if~ tries another condition; ~else~ catches everything that is left.`, c`
int temp = 25;

if (temp > 30) {
    std::cout << "Hot\n";
} else if (temp > 15) {
    std::cout << "Nice\n";
} else {
    std::cout << "Cold\n";
}`, c`Only **one** branch ever runs: the first one whose condition is true.`),
  T('Comparing', c`These produce true or false:

~==~ equal to · ~!=~ not equal to · ~>~ ~<~ ~>=~ ~<=~

And these combine them: ~&&~ (and — both must be true), ~||~ (or — at least one), ~!~ (not — flips it).`, c`
if (age >= 13 && age <= 19) {
    std::cout << "Teenager\n";
}`, c`The most famous bug in the language: ~=~ **stores** a value, ~==~ **compares**. Writing ~if (x = 5)~ changes ~x~ instead of testing it.`),
  Q(c`Which checks whether ~score~ is exactly 100?`, [c`~if (score = 100)~`, c`~if (score == 100)~`, c`~if score == 100~`, c`~if (score === 100)~`], 1),
  P(c`
int n = 15;
if (n > 10) {
    std::cout << "big ";
} else if (n > 5) {
    std::cout << "medium ";
}
std::cout << "done\n";`, 'big done', c`15 is also greater than 5, but the first matching branch wins and the rest are skipped.`),
  X({ q: c`Read a whole number. Print ~even~ if it divides by 2, otherwise ~odd~.`, start: M(c`
    int n;
    std::cin >> n;
    // decide and print

`), tests: [{ in: '8\n', out: 'even' }, { in: '7\n', out: 'odd' }], hint: c`The remainder tells you: ~if (n % 2 == 0)~`, sol: M(c`
    int n;
    std::cin >> n;
    if (n % 2 == 0) {
        std::cout << "even\n";
    } else {
        std::cout << "odd\n";
    }`) }),
  Q(c`~age~ is 20. Is ~age >= 13 && age <= 19~ true?`, ['Yes', 'No — the second part is false, and && needs both', 'Only the first time', 'It is an error'], 1),
] },

{ id: 'loops', title: 'while & for loops', icon: '🔁', desc: 'Make the computer do the boring part a thousand times.',
  v: [['1:35:51', '1:38:56', 'While loops'], ['1:42:15', '1:47:34', 'For loops, break & continue']],
  steps: [
  T('while: repeat as long as…', c`A ~while~ loop checks its condition, runs the block, and checks again — until the condition is false.`, c`
int countdown = 3;

while (countdown > 0) {
    std::cout << countdown << "\n";
    countdown--;
}
std::cout << "Lift off!\n";`, c`If nothing inside the loop ever makes the condition false, it runs forever: an **infinite loop**.`),
  T('for: the counting loop', c`When you know how many times to repeat, ~for~ puts the three parts of counting on one line: **start; keep going while; step**.`, c`
for (int i = 1; i <= 3; i++) {
    std::cout << i << "\n";
}`, c`That prints 1, 2, 3. Programmers usually count from 0: ~for (int i = 0; i < 3; i++)~ also runs three times, with ~i~ being 0, 1, 2.`),
  P(c`
for (int i = 0; i < 4; i++) {
    std::cout << i * 2 << " ";
}`, '0 2 4 6'),
  Q(c`How many times does this loop run?

~for (int i = 0; i < 5; i++)~`, ['4', '5', '6', 'Forever'], 1, c`~i~ takes the values 0, 1, 2, 3, 4 — five of them.`),
  T('break and continue', c`~break~ leaves the loop immediately. ~continue~ skips the rest of this round and starts the next one.`, c`
for (int i = 1; i <= 10; i++) {
    if (i == 3) continue;   // skip 3
    if (i == 6) break;      // stop completely at 6
    std::cout << i << " ";  // 1 2 4 5
}`),
  X({ q: c`Read a whole number ~n~. Print the sum of all the numbers from 1 to ~n~.

Input ~5~ gives ~15~ (1+2+3+4+5).`, start: M(c`
    int n;
    std::cin >> n;
    int total = 0;
    // add up 1..n with a loop

    std::cout << total << "\n";`), tests: [{ in: '5\n', out: '15' }, { in: '10\n', out: '55' }], must: [[String.raw`\b(for|while)\b`, 'Use a loop.']], hint: c`~for (int i = 1; i <= n; i++) { total += i; }~`, sol: M(c`
    int n;
    std::cin >> n;
    int total = 0;
    for (int i = 1; i <= n; i++) {
        total += i;
    }
    std::cout << total << "\n";`) }),
] },
],
quiz: [
  P(c`
int x = 7;
if (x > 10) {
    std::cout << "A";
} else if (x > 5) {
    std::cout << "B";
} else {
    std::cout << "C";
}`, 'B'),
  Q(c`~||~ means…`, ['and', 'or', 'not', 'equals'], 1),
  P(c`
int n = 3;
while (n > 0) {
    std::cout << n;
    n--;
}`, '321'),
  F('Count from 0 to 9.', c`
[[for]] (int i = 0; i [[<]] 10; i[[++]]) {
    std::cout << i << "\n";
}`),
  Q(c`What does ~break~ do inside a loop?`, ['Skips to the next round', 'Leaves the loop immediately', 'Pauses the program', 'Restarts the loop'], 1),
  Q(c`What is wrong with ~if (lives = 0)~ ?`, ['Nothing', c`~=~ stores 0 in lives; comparing needs ~==~`, 'Brackets are not allowed', c`It should be ~lives := 0~`], 1),
] });

/* ============ BEGINNER 3: BUILDING BLOCKS ============ */
topic({ id: 'b-build', track: 'new', title: 'Building Blocks', icon: '🧩', color: '#ffc800', blurb: 'Functions, arrays, structs and pointers — the tools the rest of the course builds on.',
lessons: [
{ id: 'funcs', title: 'Functions', icon: '📞', desc: 'Name a block of code. Call it whenever you need it.',
  v: [['2:03:10', '2:10:33', 'User defined functions'], ['2:10:33', '2:16:42', 'Return keyword']],
  steps: [
  T('Write once, use forever', c`A **function** is a named block of code. You have been writing one all along: ~main~. Here is another:`, c`
#include <iostream>

int square(int n) {        // takes an int, gives back an int
    return n * n;
}

int main() {
    std::cout << square(4) << "\n";   // 16
    std::cout << square(9) << "\n";   // 81
    return 0;
}`, c`~int square(int n)~ reads: "a function called ~square~, which takes one ~int~ (called ~n~ inside it) and **returns** an ~int~". ~return~ hands the answer back to whoever called it.`),
  T('void: nothing to give back', c`Some functions just **do** something. Their return type is ~void~.`, c`
void greet(std::string name) {
    std::cout << "Hello, " << name << "!\n";
}

greet("Ada");
greet("Linus");`, c`The values in the brackets when you call a function are **arguments**; the variables that receive them are **parameters**. A function must be written **above** the place where it is called.`),
  P(c`
int add(int a, int b) {
    return a + b;
}

int main() {
    int x = add(2, 3);
    std::cout << add(x, 10) << "\n";
}`, '15'),
  Q(c`What does a ~void~ function return?`, ['0', 'Nothing', 'An empty string', 'Whatever was printed'], 1),
  X({ q: c`Write a function ~int triple(int n)~ that returns ~n~ times 3.

The starter ~main~ must print ~12 30~`, start: c`#include <iostream>

// write triple here

int main() {
    std::cout << triple(4) << " " << triple(10) << "\n";
    return 0;
}
`, tests: [{ out: '12 30' }], hint: c`~int triple(int n) { return n * 3; }~`, sol: c`#include <iostream>

int triple(int n) {
    return n * 3;
}

int main() {
    std::cout << triple(4) << " " << triple(10) << "\n";
    return 0;
}
` }),
  Q(c`In ~int area(int w, int h)~ what are ~w~ and ~h~ ?`, ['Return values', 'Parameters', 'Functions', 'Types'], 1),
] },

{ id: 'arrays', title: 'Arrays', icon: '🗃️', desc: 'Many values under one name, numbered from zero.',
  v: [['2:51:11', '2:56:40', 'Arrays'], ['3:05:40', '3:08:36', 'Foreach loop']],
  steps: [
  T('A row of boxes', c`An **array** holds several values of the same type, side by side. Each one has a position number, its **index** — and the first index is **0**.`, c`
int scores[] = {90, 75, 88};

std::cout << scores[0] << "\n";   // 90  (the first)
std::cout << scores[2] << "\n";   // 88  (the last)

scores[1] = 80;                   // change the middle one`, c`Three elements means indexes 0, 1 and 2. There is no ~scores[3]~ — and C++ will **not** stop you reading it. You just get garbage, or a crash.`),
  Q(c`An array has 5 elements. What is the index of the last one?`, ['5', '4', '6', '1'], 1),
  T('Visiting every element', c`The classic way uses a counting loop. The modern way is the **range-based for**: "for each value in the array".`, c`
int scores[] = {90, 75, 88};

for (int i = 0; i < 3; i++) {     // classic: i is the index
    std::cout << scores[i] << "\n";
}

for (int s : scores) {            // range-based: s is each value
    std::cout << s << "\n";
}`, c`Use the range-based loop whenever you do not need the index. It cannot go out of bounds.`),
  P(c`
int nums[] = {4, 1, 3};
int total = 0;
for (int n : nums) {
    total += n;
}
std::cout << total << "\n";`, '8'),
  X({ q: c`Find the largest value in ~temps~ and print it. Use a loop.

Expected output: ~31~`, start: M(c`
    int temps[] = {18, 25, 31, 22, 29};
    int best = temps[0];
    // loop over temps

    std::cout << best << "\n";`), tests: [{ out: '31' }], must: [[String.raw`\bfor\b`, c`Use a ~for~ loop.`]], hint: c`~for (int t : temps) { if (t > best) best = t; }~`, sol: M(c`
    int temps[] = {18, 25, 31, 22, 29};
    int best = temps[0];
    for (int t : temps) {
        if (t > best) best = t;
    }
    std::cout << best << "\n";`) }),
] },

{ id: 'structs', title: 'Structs', icon: '🏗️', desc: 'Bundle related variables into a type of your own.',
  v: [['5:03:49', '5:08:49', 'Structs']],
  steps: [
  T('Your own types', c`A player has a name, health and a level. Three loose variables per player gets messy fast. A **struct** bundles them into one new type:`, c`
struct Player {
    std::string name;
    int hp;
    int level;
};

Player hero = {"Ada", 100, 1};

std::cout << hero.name << "\n";   // the dot reaches inside
hero.hp -= 30;`, c`The variables inside are called **members**. ~Player~ is now a type just like ~int~: you can make as many players as you like, each with their own members.`),
  P(c`
struct Point { int x; int y; };

int main() {
    Point a = {2, 3};
    Point b = a;
    b.x = 10;
    std::cout << a.x << " " << b.x + b.y << "\n";
}`, '2 13', c`~b = a~ made a **copy**. Changing ~b~ leaves ~a~ alone.`),
  Q(c`How do you read the ~hp~ of a ~Player~ variable called ~p~ ?`, [c`~p->hp~`, c`~p.hp~`, c`~hp.p~`, c`~Player.hp~`], 1),
  X({ q: c`Create a struct ~Book~ with a ~std::string title~ and an ~int pages~. In ~main~, make one book — "Dune", 412 pages — and print:

~Dune has 412 pages~`, start: c`#include <iostream>
#include <string>

// struct Book

int main() {
    // make a Book and print it

    return 0;
}
`, tests: [{ out: 'Dune has 412 pages' }], must: [[String.raw`struct\s+Book`, c`Define ~struct Book~.`]], hint: c`~Book b = {"Dune", 412};~ then ~std::cout << b.title << " has " << b.pages << " pages\n";~`, sol: c`#include <iostream>
#include <string>

struct Book {
    std::string title;
    int pages;
};

int main() {
    Book b = {"Dune", 412};
    std::cout << b.title << " has " << b.pages << " pages\n";
    return 0;
}
` }),
  Q('What ends a struct definition?', [c`~}~`, c`~};~`, c`~end~`, c`~);~`], 1, c`The semicolon after the closing brace is easy to forget — and the error message it causes is famously confusing.`),
] },

{ id: 'pointers', title: 'Addresses & pointers', icon: '👈', desc: 'Every variable lives somewhere. A pointer remembers where.',
  v: [['3:57:42', '4:00:31', 'Memory addresses'], ['4:17:56', '4:27:17', 'Pointers & null pointers']],
  steps: [
  T('Where variables live', c`Memory is a long street of numbered boxes. Every variable lives at an **address**. ~&x~ means "the address of ~x~".

A **pointer** is a variable that stores an address.`, c`
int hp = 100;
int *p = &hp;      // p holds the address of hp: "p points to hp"

std::cout << *p << "\n";   // 100 - follow the pointer and read
*p = 50;                   // follow the pointer and write
std::cout << hp << "\n";   // 50`, c`~*p~ means "the thing ~p~ points at". This is called **dereferencing**. Through a pointer, one part of a program can change a variable that lives somewhere else.`),
  P(c`
int a = 5;
int *p = &a;
*p = *p + 1;
a = a * 2;
std::cout << a << " " << *p << "\n";`, '12 12', c`There is only one int. ~a~ is its name; ~*p~ is another route to the same box.`),
  T('Pointing at nothing', c`A pointer that does not point anywhere yet should hold ~nullptr~. Following a null pointer crashes the program, so check first:`, c`
int *p = nullptr;

if (p != nullptr) {
    std::cout << *p << "\n";
}`, c`With a pointer to a struct, the arrow ~->~ reaches the members: ~ptr->hp~ is short for ~(*ptr).hp~.`),
  Q(c`~int *p = &score;~ What does ~*p~ give you?`, ['The address of score', 'The value of score', 'The address of p', 'Always 0'], 1),
  Q(c`What is ~&x~ ?`, ['The value of x', 'The address of x', 'x times 2', 'A copy of x'], 1),
  X({ q: c`Finish ~heal~ so it adds 25 to the int that ~hp~ points to.

The starter ~main~ must print ~75~`, start: c`#include <iostream>

void heal(int *hp) {
    // add 25 to the value hp points at

}

int main() {
    int health = 50;
    heal(&health);
    std::cout << health << "\n";
    return 0;
}
`, tests: [{ out: '75' }], hint: c`~*hp += 25;~`, sol: c`#include <iostream>

void heal(int *hp) {
    *hp += 25;
}

int main() {
    int health = 50;
    heal(&health);
    std::cout << health << "\n";
    return 0;
}
` }),
] },
],
quiz: [
  P(c`
int twice(int n) { return n * 2; }

int main() {
    std::cout << twice(twice(3)) << "\n";
}`, '12'),
  Q('The first element of an array has index…', ['1', '0', '-1', 'It depends'], 1),
  P(c`
int a[] = {5, 6, 7};
a[1] = a[0] + a[2];
std::cout << a[1] << "\n";`, '12'),
  F('Follow the pointer and change the value.', c`
int lives = 3;
int *p = [[&]]lives;
[[*]]p = 5;`),
  Q(c`Which reaches the member ~hp~ through a **pointer** ~ptr~ to a struct?`, [c`~ptr.hp~`, c`~ptr->hp~`, c`~ptr::hp~`, c`~*ptr.hp~`], 1),
  Q(c`What should a pointer hold when it points at nothing?`, [c`~nullptr~`, c`~-1~`, c`~void~`, c`~"none"~`], 0),
] });
