/* ============ TOPIC 1: HELLO, C ============ */
topic({ id: 'hello', title: 'Hello, C', icon: '👋', color: '#58cc02', blurb: 'Write, break and fix your first programs.',
lessons: [
{ id: 'first', title: 'Your first program', icon: '🚀', desc: 'Meet main(), printf and the semicolon that will haunt you.',
  v: [['0:09:53', '0:15:04', 'Your first C program'], ['0:00:00', '0:09:53', 'Optional: installing VS Code + gcc on your own machine']],
  steps: [
  T('Why C?', c`C is 50 years old and still runs the world: Windows, Linux, the Python interpreter, your router, your car's brakes.

It is tiny, fast and brutally literal — it does **exactly** what you type, nothing more. Learn C and every other language starts making sense.

This is a complete C program:`, c`
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}`, c`Don't memorise it. You're about to take it apart instead.`),
  Q('Where does a C program start running?', [c`At the first line of the file`, c`At the ~main~ function`, c`At ~#include~`, c`Wherever the first ~printf~ is`], 1, c`The operating system calls ~main~. Everything inside its braces runs top to bottom.`),
  T('The five parts', c`~#include <stdio.h>~ — borrow the **st**andar**d** **i**nput/**o**utput toolkit. That is where ~printf~ lives.

~int main() { ... }~ — the starting point. The braces mark what belongs to it.

~printf("...");~ — print text to the screen.

~;~ — ends every statement. Forget one and the compiler will tell you. Loudly.

~return 0;~ — report "finished, no errors" to the operating system.`),
  F('Rebuild Hello World from memory.', c`
#include <[[stdio.h]]>

int [[main]]() {
    [[printf]]("Hello, World!\n");
    return [[0]];
}`),
  O('Tap the lines into a working program.', c`
#include <stdio.h>
int main() {
    printf("It works!\n");
    return 0;
}`, c`Include first, then ~main~, then the statements inside its braces.`),
  X({ q: c`Your turn. Make the program print exactly: ~I am learning C!~

Hit **Run** to see what it does, **Check** when you think it is right.`, start: M(c`
    // your code goes here
`), tests: [{ out: 'I am learning C!' }], hint: c`~printf("text goes here\n");~ — and don't forget the semicolon.`, sol: M(c`
    printf("I am learning C!\n");`) }),
  Q('You forget the semicolon after a ~printf~. What happens?', ['The program runs but prints nothing', 'The compiler refuses to build the program', 'C adds the semicolon for you', 'The program crashes halfway'], 1, c`C is compiled: one syntax error and you get **no program at all**. Pro tip: the error often points at the line *after* the missing semicolon.`),
] },

{ id: 'printf', title: 'printf & escape codes', icon: '🖨️', desc: 'New lines, tabs, quotes — and the Windows-path trap.',
  steps: [
  T('printf does not press Enter for you', c`~printf~ prints exactly the characters you give it. Want a new line? Ask for one with ~\n~.

Backslash codes like that are called **escape sequences**:`, c`
printf("Line one\nLine two\n");   // \n  new line
printf("Name:\tBro\n");           // \t  tab
printf("She said \"hi\"\n");      // \"  a literal quote
printf("C:\\Users\\you\n");       // \\  a literal backslash`),
  P(c`
printf("A");
printf("B\n");
printf("C");`, 'AB\nC', c`No ~\n~ after A, so B lands right next to it.`),
  Q(c`Which line prints: ~She said "hi"~`, [c`~printf("She said "hi"");~`, c`~printf("She said \"hi\"");~`, c`~printf('She said "hi"');~`, c`~printf("She said /"hi/"");~`], 1, c`A bare ~"~ ends the string early. ~\"~ means "a quote character, not the end".`),
  F('Make this print Ready and Go! on two separate lines.', c`printf("Ready[[\n]]Go!");`),
  Q(c`How many lines of output does this produce?`, ['2', '3', '4', '1'], 2, c`a, b, an **empty** line (two ~\n~ in a row), then c.`, c`printf("a\nb\n\nc");`),
  X({ q: c`This program has **4 bugs**. Fix them all so it prints:

~Mission control~
~Lift off!~`, start: c`#include <stdio.h>

int main() {
    Printf("Mission control\n")
    printf("Lift off!\n);
    return 0
}
`, tests: [{ out: 'Mission control\nLift off!' }], hint: c`C is case-sensitive. Count your quotes. Count your semicolons.`, sol: M(c`
    printf("Mission control\n");
    printf("Lift off!\n");`) }),
  X({ q: c`A real-world trap. Print exactly these two lines:

~Path: C:\temp\new~
~She said "hi"~

Run it naively first and watch what ~\t~ and ~\n~ do to your path.`, start: M(c`
    printf("Path: C:\temp\new\n");
`), tests: [{ out: 'Path: C:\\temp\\new\nShe said "hi"' }], hint: c`To print one backslash you must type two: ~\\~.`, sol: M(c`
    printf("Path: C:\\temp\\new\n");
    printf("She said \"hi\"\n");`) }),
] },

{ id: 'errors', title: 'Comments & compiler errors', icon: '🧯', desc: 'Leave notes for future you, and learn to read what gcc is yelling.',
  steps: [
  T('Comments', c`The compiler ignores comments completely. They are for humans — mostly for you, three weeks from now, wondering what you were thinking.`, c`
// a single-line comment

/* a comment
   that spans lines */

printf("Hi\n");  // comments can sit after code too`, c`Commenting a line out is also the quickest way to switch code off while testing.`),
  P(c`
printf("1");
// printf("2");
printf("3"); /* printf("4"); */
printf("5");`, '135'),
  T('What "compiling" means', c`You write ~main.c~ (text). The **compiler** ~gcc~ translates the whole thing to machine code (~main.exe~). Then you run that.

Two kinds of complaints:

**error** — "I can't build this." You get no program.

**warning** — "This builds, but I bet it's a bug." You get a program, and usually a bad day. Read your warnings.

The Run button here does all of that with real gcc.`),
  Q('gcc reports 1 error and 0 warnings. Can you run your program?', ['Yes, but it might misbehave', 'No — no executable was produced', 'Yes, errors are just suggestions', 'Only the lines before the error run'], 1, c`C isn't run line by line. Either the whole file compiles, or nothing runs.`),
  Q(c`gcc says: ~main.c:5:5: error: expected ';' before 'return'~

Line 5 is ~return 0;~. Where is the actual mistake?`, ['On line 5, in the word return', 'At the end of line 4 — the statement before it', 'In the #include line', 'Column 5 of every line'], 1, c`The compiler only notices the missing ~;~ when it bumps into the next thing. Look one line **up**.`),
  X({ q: c`Three errors. Don't hunt by eye — press **Run**, read the **first** error, fix it, repeat. That loop is how real C gets written.

Expected output:

~Errors are just directions~
~Read the first one first~
~Then fix and recompile~`, start: c`#include <stdio.h>

int main() {
    printf("Errors are just directions\n");
    print("Read the first one first\n");
    printf("Then fix and recompile\n")
    return 0;
`, tests: [{ out: 'Errors are just directions\nRead the first one first\nThen fix and recompile' }], hint: c`A misspelt function, a missing ~;~ and a missing closing ~}~.`, sol: M(c`
    printf("Errors are just directions\n");
    printf("Read the first one first\n");
    printf("Then fix and recompile\n");`) }),
] },
],
quiz: [
  Q('Every C statement ends with…', ['a new line', 'a semicolon', 'a full stop', 'a closing brace'], 1),
  P(c`
printf("Hi");
printf("Hi\n");
printf("!");`, 'HiHi\n!'),
  Q(c`Which header gives you ~printf~?`, [c`~<stdio.h>~`, c`~<print.h>~`, c`~<stdlib.h>~`, c`~<main.h>~`], 0),
  Q(c`What does ~return 0;~ at the end of ~main~ tell the operating system?`, ['The program printed nothing', 'The program finished without errors', 'Restart the program', 'Delete the program'], 1),
  Q(c`What does ~printf("\\");~ print?`, ['Two backslashes', 'One backslash', 'Nothing', 'A new line'], 1, c`~\\~ is the escape sequence for a single backslash.`),
  F('Complete the skeleton.', c`
#include <stdio.h>

int [[main]]() {
    printf("Done\n");
    [[return]] 0;
}`),
] });

/* ============ TOPIC 2: VARIABLES & DATA ============ */
topic({ id: 'vars', title: 'Variables & Data', icon: '📦', color: '#1cb0f6', blurb: 'Store things, print them nicely, do maths, read input.',
lessons: [
{ id: 'variables', title: 'Variables: labelled boxes', icon: '📦', desc: 'int, float, double, char — and why an empty box is full of garbage.',
  v: [['0:15:04', '0:35:06', 'Variables']],
  steps: [
  T('A box with a label and a type', c`A variable is a named box in memory. In C, every box has a **type** that never changes.`, c`
int lives = 3;           // whole numbers
float speed = 2.5;       // decimals (~7 digits of precision)
double pi = 3.14159265;  // decimals (~15 digits)
char rank = 'S';         // ONE character, single quotes
char name[] = "Bro";     // text: an array of chars, double quotes`, c`~int lives = 3;~ does two jobs: it **declares** the box and **initialises** it with a value.`),
  Q('Which type fits a price like 19.99?', [c`~int~`, c`~char~`, c`~float~`, c`~void~`], 2, c`~int~ would chop it to 19. Use ~float~ or ~double~ for anything with a decimal point.`),
  F('Pick the right type for each value.', c`
[[int]] lives = 3;
[[char]] rank = 'S';
[[float~double]] speed = 2.5;`),
  T('Printing a variable', c`~printf~ can't guess what's in a box, so you leave a **placeholder** in the text and pass the variable after the comma.`, c`
int age = 21;
printf("I am %d years old\n", age);   // I am 21 years old`, c`~%d~ means "an int goes here". More placeholders in the next lesson.`),
  P(c`
int x = 5;
x = x + 2;
x = x * 2;
printf("%d", x);`, '14', c`~=~ is not "equals" — it means "compute the right side, then store it in the left". 5 → 7 → 14.`),
  Q(c`What does this print?`, ['0', 'Nothing', 'An unpredictable garbage value', 'A compile error'], 2, c`Declaring a box doesn't clean it. It holds whatever bytes were lying around in memory. **Always initialise.**`, c`
int count;
printf("%d", count);`),
  Q(c`What is the difference between ~'A'~ and ~"A"~?`, ['Nothing, quotes are interchangeable', c`~'A'~ is a single char; ~"A"~ is a string (an array)`, c`~"A"~ is a char; ~'A'~ is a string`, 'Single quotes are for comments'], 1, c`Single quotes = exactly one character. Double quotes = text, stored as an array of characters.`),
  P(c`
bool online = true;
printf("%d", online);`, '1', c`C has no magic "true". ~true~ is just 1 and ~false~ is 0 (you need ~#include <stdbool.h>~ to even use the words).`),
  X({ q: c`A boss just hit your character. Subtract ~damage~ from ~hp~, then print the result in this format:

~HP: 65~

Use the variable — don't just type 65.`, start: M(c`
    int hp = 100;
    int damage = 35;

`), tests: [{ out: 'HP: 65' }], must: [['%d', c`Print the variable using the ~%d~ placeholder.`]], not: [['"HP: 65', c`No hard-coding — let the program calculate it.`]], hint: c`~hp = hp - damage;~ then ~printf("HP: %d\n", hp);~`, sol: M(c`
    int hp = 100;
    int damage = 35;

    hp = hp - damage;
    printf("HP: %d\n", hp);`) }),
] },

{ id: 'format', title: 'Format specifiers', icon: '🛠️', desc: 'Control exactly how numbers and text appear.',
  v: [['0:35:06', '0:44:15', 'Format specifiers']],
  steps: [
  T('The placeholder cheat sheet', c`Each type has its own placeholder. Between the ~%~ and the letter you can add width and precision.`, c`
printf("%d", 42);         // int             42
printf("%f", 3.5);        // float/double    3.500000
printf("%.2f", 3.14159);  // 2 decimals      3.14
printf("%c", 'A');        // char            A
printf("%s", "hello");    // string          hello
printf("%5d|", 42);       // width 5            42|
printf("%-5d|", 42);      // left-aligned    42   |
printf("%05d", 42);       // zero-padded     00042`),
  Q(c`Which placeholder prints a single ~char~?`, [c`~%s~`, c`~%c~`, c`~%d~`, c`~%ch~`], 1),
  P(c`
float price = 9.5;
printf("$%.2f", price);`, '$9.50', c`~.2~ = exactly two digits after the point. Money formatting, solved.`),
  P(c`printf("%f", 2.5);`, '2.500000', c`Plain ~%f~ always shows 6 decimals. That's why you'll nearly always write ~%.1f~ or ~%.2f~.`),
  F('Fill in the placeholders.', c`
char name[] = "Ada";
int age = 36;
printf("%[[s]] is %[[d]] years old", name, age);`),
  P(c`printf("Agent %03d", 7);`, 'Agent 007', c`~0~ = pad with zeros, ~3~ = at least three characters wide.`),
  Q(c`What happens if you lie to printf — ~printf("%d", 3.14);~ ?`, ['It prints 3', 'It prints 3.14', 'It prints garbage (and gcc warns you)', 'The program refuses to compile'], 2, c`C trusts you. Say "int" while handing over a double and it reads the wrong bytes. gcc's **warning** is your only safety net — read warnings!`),
  X({ q: c`Print a receipt line using all three variables:

~3 x Pizza = $25.50~`, start: M(c`
    char item[] = "Pizza";
    float price = 8.5;
    int qty = 3;

`), tests: [{ out: '3 x Pizza = $25.50' }], must: [['%s', c`Use ~%s~ for the item name.`], ['%\\.2f', c`Use ~%.2f~ for the money.`]], hint: c`~printf("%d x %s = $%.2f\n", qty, item, price * qty);~ — placeholders are filled left to right.`, sol: M(c`
    char item[] = "Pizza";
    float price = 8.5;
    int qty = 3;

    printf("%d x %s = $%.2f\n", qty, item, price * qty);`) }),
] },

{ id: 'arith', title: 'Maths & the division trap', icon: '➗', desc: 'Operators, shortcuts, and the bug every C programmer writes once.',
  v: [['0:44:15', '0:50:40', 'Arithmetic operators']],
  steps: [
  T('The operators', c`~+~ ~-~ ~*~ ~/~ do what you expect — almost. Plus a few extras:`, c`
int x = 10;
x = x % 3;   // modulus: the remainder of 10 / 3  -> 1
x += 5;      // shortcut for x = x + 5            -> 6
x++;         // add one                           -> 7
x--;         // subtract one                      -> 6`, c`Now the trap…`),
  P(c`printf("%d", 7 / 2);`, '3', c`**Integer division.** Two ints in, an int out — the .5 is thrown away, not rounded. This bug has cost humanity millions of hours.`),
  P(c`printf("%d", 7 % 2);`, '1', c`7 ÷ 2 = 3 remainder **1**. ~n % 2~ is 0 for even numbers and 1 for odd ones.`),
  Q('How do you actually get 3.5 out of 7 and 2?', [c`~7 / 2~ printed with ~%f~`, c`~7 / 2.0~`, c`~7 % 2~`, c`~(7 / 2) * 1.0~`], 1, c`Make at least one side a decimal. With variables, cast one: ~(float)a / b~.`),
  P(c`printf("%d", 2 + 3 * 4);`, '14', c`Same precedence as school maths: ~* / %~ before ~+ -~. Use brackets when in doubt.`),
  P(c`
int a = 5;
int b = a++;
printf("%d %d", a, b);`, '6 5', c`~a++~ hands over the **old** value, then increments. (~++a~ increments first.) When it matters, put the increment on its own line.`),
  F('Split a number of seconds into minutes and leftover seconds.', c`
int secs = 135;
int mins = secs [[/]] 60;
int left = secs [[%]] 60;
printf("%d:%d", mins, left);`, c`Division and modulus are a team: ~/~ gives "how many whole ones", ~%~ gives "what's left".`),
  X({ q: c`Convert ~totalSeconds~ into hours, minutes and seconds. Print:

~1h 2m 5s~`, start: M(c`
    int totalSeconds = 3725;

`), tests: [{ out: '1h 2m 5s' }], must: [['%[^d]*d', 'Print with ~%d~.'], ['/|%', 'Use ~/~ and ~%~ to do the conversion.']], not: [['"1h 2m 5s', 'Calculate it — no hard-coding.']], hint: c`Hours = ~totalSeconds / 3600~. What's left = ~totalSeconds % 3600~. Repeat with 60.`, sol: M(c`
    int totalSeconds = 3725;

    int h = totalSeconds / 3600;
    int m = totalSeconds % 3600 / 60;
    int s = totalSeconds % 60;
    printf("%dh %dm %ds\n", h, m, s);`) }),
  X({ q: c`This should print ~Average: 7.67~ but prints ~Average: 7.00~. Find the trap and fix it.`, start: M(c`
    int a = 7, b = 8, c = 8;
    float avg = (a + b + c) / 3;
    printf("Average: %.2f\n", avg);`), tests: [{ out: 'Average: 7.67' }], hint: c`int / int = int. The damage is done **before** the result is stored in the float. Try ~3.0~.`, sol: M(c`
    int a = 7, b = 8, c = 8;
    float avg = (a + b + c) / 3.0;
    printf("Average: %.2f\n", avg);`) }),
] },

{ id: 'input', title: 'Reading input', icon: '⌨️', desc: 'scanf, the mysterious &, and reading whole lines.',
  v: [['0:50:40', '1:06:54', 'User input']],
  steps: [
  T('scanf: printf in reverse', c`~scanf~ reads what the user types and stores it in a variable.`, c`
int age;
printf("How old are you? ");
scanf("%d", &age);`, c`See the ~&~? It means **"the address of"**. scanf can't use a copy of ~age~ — it needs to know *where the box is* so it can put something in it.

(That ~&~ is your first taste of pointers. It will all click in Topic 8.)`),
  F('Read an integer into score.', c`
int score;
scanf("%[[d]]", [[&score~& score]]);`, c`Same placeholders as printf, plus an ~&~ in front of the variable.`),
  Q(c`What happens if you write ~scanf("%d", age);~ without the ~&~?`, ['It works the same', c`scanf treats the garbage *value* of age as an address — usually a crash`, 'It reads a float instead', 'Nothing is read, the program continues normally'], 1, c`It compiles (with a warning!) and then writes to some random memory location. Welcome to C.`),
  X({ q: c`Read the user's age and print:

~In 10 years you will be N.~

(In the tests, the "keyboard input" is supplied automatically.)`, start: M(c`
    int age;

`), tests: [{ in: '20', has: ['In 10 years you will be 30.'] }, { in: '41', has: ['In 10 years you will be 51.'] }], hint: c`~scanf("%d", &age);~ then print ~age + 10~.`, sol: M(c`
    int age;
    scanf("%d", &age);
    printf("In 10 years you will be %d.\n", age + 10);`) }),
  T('Reading text', c`Two ways to read a string:`, c`
char name[30];                       // room for 29 letters + terminator

scanf("%s", name);                   // one WORD (stops at a space). No & needed!
fgets(name, sizeof(name), stdin);    // a whole LINE, spaces included`, c`No ~&~ with ~%s~: an array's name already *is* an address.

~fgets~ also stores the Enter key (~\n~) at the end — the usual fix is to chop it off: ~name[strlen(name) - 1] = '\0';~`),
  Q(c`The user types ~Bro Code~ and presses Enter. What does ~scanf("%s", name)~ store?`, [c`~Bro Code~`, c`~Bro~`, c`~Code~`, c`~B~`], 1, c`~%s~ stops at the first whitespace. For full lines use ~fgets~.`),
  X({ q: c`Read a first name (one word) and an age, then print:

~Hello Ada, you are 36!~`, start: M(c`
    char name[30];
    int age;

`), tests: [{ in: 'Ada 36', has: ['Hello Ada, you are 36!'] }, { in: 'Linus\n54', has: ['Hello Linus, you are 54!'] }], hint: c`~scanf("%s", name);~ (no &) then ~scanf("%d", &age);~ (with &).`, sol: M(c`
    char name[30];
    int age;
    scanf("%s", name);
    scanf("%d", &age);
    printf("Hello %s, you are %d!\n", name, age);`) }),
  X({ q: c`Read a rectangle's width and height (decimals), then print the area with two decimals:

~Area: 10.00~`, start: M(c`
    float width, height;

`), tests: [{ in: '2.5 4', has: ['Area: 10.00'] }, { in: '3 3.5', has: ['Area: 10.50'] }], hint: c`~scanf("%f", &width);~ — floats use ~%f~ in scanf.`, sol: M(c`
    float width, height;
    scanf("%f", &width);
    scanf("%f", &height);
    printf("Area: %.2f\n", width * height);`) }),
] },

{ id: 'math', title: 'Math functions', icon: '🧮', desc: 'sqrt, pow, round and friends from math.h.',
  v: [['1:25:25', '1:30:40', 'Math functions'], ['1:30:40', '1:36:44', 'Bonus: Bro builds the circle calculator']],
  steps: [
  T('math.h', c`Add ~#include <math.h>~ and you get a calculator's worth of functions. They all work with ~double~.`, c`
sqrt(81)      // 9.0     square root
pow(2, 10)    // 1024.0  2 to the power of 10
round(3.6)    // 4.0     nearest whole number
ceil(3.1)     // 4.0     always up
floor(3.9)    // 3.0     always down
fabs(-7.5)    // 7.5     absolute value`),
  P(c`printf("%.1f", sqrt(81));`, '9.0'),
  P(c`printf("%.0f", pow(2, 10));`, '1024', c`~%.0f~ prints a double with no decimals.`),
  Q(c`What is ~ceil(3.1) + floor(3.9)~ ?`, ['6', '7', '8', '7.0 is impossible to know'], 1, c`ceil rounds **up** to 4, floor rounds **down** to 3.`),
  Q(c`In C, what does ~2 ^ 3~ give you?`, ['8', '6', '1 — because ^ is not "power" in C', 'A compile error'], 2, c`~^~ is bitwise XOR. For powers, always use ~pow(2, 3)~. This one bites everybody coming from maths class.`),
  X({ q: c`Circle calculator. Read a radius and print the area and circumference with two decimals:

~Area: 28.27~
~Circumference: 18.85~

Use 3.14159 for π.`, start: M(c`
    double PI = 3.14159;
    double radius;

`, 'math.h'), tests: [{ in: '3', has: ['Area: 28.27', 'Circumference: 18.85'] }, { in: '1.5', has: ['Area: 7.07', 'Circumference: 9.42'] }], hint: c`Reading a ~double~ with scanf needs ~%lf~ (long float). Area = ~PI * pow(radius, 2)~.`, sol: M(c`
    double PI = 3.14159;
    double radius;
    scanf("%lf", &radius);
    printf("Area: %.2f\n", PI * pow(radius, 2));
    printf("Circumference: %.2f\n", 2 * PI * radius);`, 'math.h') }),
  X({ q: c`Pythagoras. Read the two short sides of a right triangle and print the long side:

~Hypotenuse: 5.00~`, start: M(c`
    double a, b;

`, 'math.h'), tests: [{ in: '3 4', has: ['Hypotenuse: 5.00'] }, { in: '5 12', has: ['Hypotenuse: 13.00'] }], hint: c`~sqrt(a * a + b * b)~`, sol: M(c`
    double a, b;
    scanf("%lf %lf", &a, &b);
    printf("Hypotenuse: %.2f\n", sqrt(a * a + b * b));`, 'math.h') }),
] },

{ id: 'cart', title: 'Project: checkout & interest', icon: '🛒', desc: 'Two small real programs using everything so far. No new theory.',
  v: [['1:06:54', '1:15:38', 'Bro builds the shopping cart'], ['1:36:44', '1:44:28', 'Bro builds the compound interest calculator']],
  steps: [
  T('Boss fight', c`No new concepts here — just you, a blank ~main~, and two programs people actually write.

Try each one **before** watching Bro build it. Struggling for five minutes teaches more than watching for twenty.`),
  X({ q: c`**Shopping cart.** Read an item name (one word), its price, and a quantity. Print:

~You bought 3 x Pizza~
~Total: $25.50~`, start: M(c`
    char item[50];
    float price;
    int quantity;

`), tests: [{ in: 'Pizza 8.5 3', has: ['You bought 3 x Pizza', 'Total: $25.50'] }, { in: 'Taco\n2.25\n4', has: ['You bought 4 x Taco', 'Total: $9.00'] }], hint: c`Three scanf calls: ~%s~ (no &), ~%f~, ~%d~. Then two printf lines.`, sol: M(c`
    char item[50];
    float price;
    int quantity;

    scanf("%s", item);
    scanf("%f", &price);
    scanf("%d", &quantity);

    printf("You bought %d x %s\n", quantity, item);
    printf("Total: $%.2f\n", price * quantity);`) }),
  X({ q: c`**Compound interest.** Read a starting amount, a yearly interest rate in percent, and a number of years. Print the final balance:

~Balance: $1102.50~

Formula: ~amount * pow(1 + rate / 100, years)~`, start: M(c`
    double amount, rate;
    int years;

`, 'math.h'), tests: [{ in: '1000 5 2', has: ['Balance: $1102.50'] }, { in: '500 10 3', has: ['Balance: $665.50'] }], hint: c`Doubles are read with ~%lf~. Careful: if ~rate~ were an int, ~rate / 100~ would be 0!`, sol: M(c`
    double amount, rate;
    int years;

    scanf("%lf %lf %d", &amount, &rate, &years);
    printf("Balance: $%.2f\n", amount * pow(1 + rate / 100, years));`, 'math.h') }),
] },
],
quiz: [
  P(c`printf("%d", 9 / 2 * 2);`, '8', c`9 / 2 is 4 (integer division), times 2 is 8.`),
  Q('Which line correctly declares a single character?', [c`~char c = "x";~`, c`~char c = 'x';~`, c`~string c = 'x';~`, c`~char c = x;~`], 1),
  P(c`
int a = 7;
a %= 4;
printf("%d", a);`, '3'),
  F('Read a decimal number into t.', c`
float t;
scanf("%[[f]]", [[&t~& t]]);`),
  Q(c`What is stored by ~int x = 3.99;~ ?`, ['4', '3', '3.99', 'A compile error'], 1, c`Converting to int **truncates** — it chops, never rounds.`),
  P(c`printf("%.1f", 10 / 4.0);`, '2.5'),
] });
