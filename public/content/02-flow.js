/* ============ TOPIC 3: DECISIONS ============ */
topic({ id: 'decisions', title: 'Decisions', icon: '🤔', color: '#ff9600', blurb: 'Teach your programs to choose.',
lessons: [
{ id: 'if', title: 'if, else if, else', icon: '🚦', desc: 'Branching — plus the single most famous bug in C.',
  v: [['1:44:28', '1:55:25', 'If statements']],
  steps: [
  T('Choosing a path', c`An ~if~ runs its block only when the condition is true. Compare with ~==~ ~!=~ ~<~ ~>~ ~<=~ ~>=~.`, c`
int temp = 31;

if (temp > 30) {
    printf("Too hot\n");
} else if (temp > 15) {
    printf("Nice\n");
} else {
    printf("Too cold\n");
}`, c`C checks from the top and runs the **first** branch that is true — then skips all the rest.`),
  P(c`
int score = 85;
if (score >= 50) printf("D");
else if (score >= 70) printf("B");
else if (score >= 80) printf("A");`, 'D', c`85 >= 50 is true, so C takes the first branch and never looks at the others. **Order matters** — check the strictest condition first.`),
  P(c`
int x = 0;
if (x = 5) {
    printf("yes");
} else {
    printf("no");
}`, 'yes', c`The Famous Bug. ~x = 5~ is an **assignment**: it stores 5 in x, and the "result" 5 counts as true. You wanted ~x == 5~. gcc warns about this — one more reason to read warnings.`),
  Q('In C, which values count as "true" in a condition?', ['Only 1', 'Any non-zero value (even -1)', 'Only positive numbers', c`Only the keyword ~true~`], 1, c`0 is false. **Everything else** is true.`),
  F('Complete the age check.', c`
int age = 20;
if (age [[>=]] 18) {
    printf("Adult");
} [[else]] {
    printf("Minor");
}`),
  X({ q: c`The age is already read for you. Print exactly one word:

under 13 → ~Child~ · under 20 → ~Teen~ · under 65 → ~Adult~ · otherwise ~Senior~`, start: M(c`
    int age;
    scanf("%d", &age);

`), tests: [{ in: '8', out: 'Child' }, { in: '13', out: 'Teen' }, { in: '19', out: 'Teen' }, { in: '30', out: 'Adult' }, { in: '65', out: 'Senior' }], hint: c`Start with ~if (age < 13)~ and work upwards with ~else if~. Each branch only runs if all the ones above it failed.`, sol: M(c`
    int age;
    scanf("%d", &age);

    if (age < 13) {
        printf("Child\n");
    } else if (age < 20) {
        printf("Teen\n");
    } else if (age < 65) {
        printf("Adult\n");
    } else {
        printf("Senior\n");
    }`) }),
  X({ q: c`This weather program says ~Cool~ for 35 degrees. It should print:

above 30 → ~Hot~ · above 20 → ~Warm~ · above 0 → ~Cool~ · otherwise ~Freezing~

Fix it.`, start: M(c`
    int temp;
    scanf("%d", &temp);

    if (temp > 0) {
        printf("Cool\n");
    } else if (temp > 20) {
        printf("Warm\n");
    } else if (temp > 30) {
        printf("Hot\n");
    } else {
        printf("Freezing\n");
    }`), tests: [{ in: '35', out: 'Hot' }, { in: '25', out: 'Warm' }, { in: '10', out: 'Cool' }, { in: '-5', out: 'Freezing' }], hint: c`First true branch wins. Which check should come first?`, sol: M(c`
    int temp;
    scanf("%d", &temp);

    if (temp > 30) {
        printf("Hot\n");
    } else if (temp > 20) {
        printf("Warm\n");
    } else if (temp > 0) {
        printf("Cool\n");
    } else {
        printf("Freezing\n");
    }`) }),
] },

{ id: 'logic', title: 'Logical operators', icon: '🔗', desc: 'AND, OR, NOT — and a comparison that lies to you.',
  v: [['2:34:23', '2:41:49', 'Logical operators']],
  steps: [
  T('Combining conditions', c`Three operators glue conditions together:`, c`
if (age >= 18 && hasTicket) { }   // AND: both must be true
if (isWeekend || isHoliday) { }   // OR:  at least one is true
if (!isRaining) { }               // NOT: flips true/false`),
  P(c`
int a = 5, b = 10;
if (a > 3 && b < 10) printf("X");
else printf("Y");`, 'Y', c`~b < 10~ is false (10 is not less than 10), and AND needs both.`),
  P(c`
int n = 15;
if (n % 3 == 0 || n % 2 == 0) printf("yes");
else printf("no");`, 'yes', c`15 is divisible by 3. OR only needs one side.`),
  Q(c`~x~ is 50. Is this condition true? ~if (1 < x < 10)~`, ['No — 50 is not between 1 and 10', c`Yes — C computes ~(1 < x)~ first, which is 1, and then ~1 < 10~`, 'It does not compile'], 1, c`Maths notation doesn't work in C! Write it as two comparisons: ~x > 1 && x < 10~.`),
  Q(c`Why is this safe even when ~b~ is 0? ~if (b != 0 && a / b > 2)~`, ['Dividing by zero is fine in C', c`~&&~ stops at the first false — the division never runs`, 'The compiler removes the division', 'It is not safe'], 1, c`This is **short-circuit evaluation**. Put the cheap safety check on the left.`),
  F('You may ride if you are at least 120 cm tall AND at most 70 years old.', c`
int height = 150, age = 30;
if (height [[>=]] 120 [[&&]] age <= 70) {
    printf("Enjoy the ride");
}`),
  X({ q: c`Leap years: divisible by 4, **except** centuries — unless the century is divisible by 400.

Print ~Leap year~ or ~Not a leap year~.`, start: M(c`
    int year;
    scanf("%d", &year);

`), tests: [{ in: '2024', out: 'Leap year' }, { in: '1900', out: 'Not a leap year' }, { in: '2000', out: 'Leap year' }, { in: '2023', out: 'Not a leap year' }], hint: c`~(year % 4 == 0 && year % 100 != 0) || year % 400 == 0~`, sol: M(c`
    int year;
    scanf("%d", &year);

    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        printf("Leap year\n");
    } else {
        printf("Not a leap year\n");
    }`) }),
] },

{ id: 'switch', title: 'switch', icon: '🎛️', desc: 'A tidy alternative to long else-if chains, with one sharp edge.',
  v: [['2:10:27', '2:18:34', 'Switches']],
  steps: [
  T('One value, many cases', c`When you're comparing **one** variable against a list of exact values, ~switch~ reads better than ten ~else if~s.`, c`
char grade = 'B';

switch (grade) {
    case 'A':
        printf("Excellent\n");
        break;
    case 'B':
        printf("Good\n");
        break;
    default:
        printf("Keep going\n");
}`, c`~break~ jumps out of the switch. ~default~ catches everything that matched no case.`),
  P(c`
int n = 2;
switch (n) {
    case 1: printf("one ");
    case 2: printf("two ");
    case 3: printf("three ");
    default: printf("done");
}`, 'two three done', c`No ~break~ = **fall-through**. C jumps to ~case 2~ and then just keeps running downwards through every case below.`),
  Q(c`What can you ~switch~ on?`, ['Anything: strings, floats, ints', 'Only whole-number types: int and char', 'Only chars', 'Only bool'], 1, c`No strings, no floats. A ~char~ works because it's secretly a small integer.`),
  F('Finish the switch.', c`
int day = 6;
switch (day) {
    case 6:
        printf("Saturday");
        [[break]];
    [[default]]:
        printf("Some other day");
}`),
  X({ q: c`Sometimes fall-through is useful: stack cases that share code.

Days 1–5 → ~Weekday~ · 6–7 → ~Weekend~ · anything else → ~Invalid~

Use a ~switch~.`, start: M(c`
    int day;
    scanf("%d", &day);

`), tests: [{ in: '3', out: 'Weekday' }, { in: '7', out: 'Weekend' }, { in: '9', out: 'Invalid' }, { in: '6', out: 'Weekend' }, { in: '1', out: 'Weekday' }], must: [['switch', c`Use a ~switch~ for this one.`]], hint: c`~case 1: case 2: case 3: case 4: case 5:~ can all sit on top of a single printf + break.`, sol: M(c`
    int day;
    scanf("%d", &day);

    switch (day) {
        case 1: case 2: case 3: case 4: case 5:
            printf("Weekday\n");
            break;
        case 6: case 7:
            printf("Weekend\n");
            break;
        default:
            printf("Invalid\n");
    }`) }),
  X({ q: c`The medal ceremony is a mess — first place gets ~GoldSilverBronzeNo medal~. Fix it so each place prints only its own line.`, start: M(c`
    int place;
    scanf("%d", &place);

    switch (place) {
        case 1: printf("Gold\n");
        case 2: printf("Silver\n");
        case 3: printf("Bronze\n");
        default: printf("No medal\n");
    }`), tests: [{ in: '1', out: 'Gold' }, { in: '2', out: 'Silver' }, { in: '3', out: 'Bronze' }, { in: '8', out: 'No medal' }], hint: c`Every case needs a ~break;~`, sol: M(c`
    int place;
    scanf("%d", &place);

    switch (place) {
        case 1: printf("Gold\n"); break;
        case 2: printf("Silver\n"); break;
        case 3: printf("Bronze\n"); break;
        default: printf("No medal\n");
    }`) }),
] },

{ id: 'nested', title: 'Nested ifs & the ternary', icon: '🪆', desc: 'Decisions inside decisions, and the one-line if.',
  v: [['2:18:34', '2:26:35', 'Nested if statements'], ['5:13:50', '5:21:58', 'Ternary operator']],
  steps: [
  T('Ifs inside ifs', c`An ~if~ block can contain anything — including another ~if~.`, c`
if (loggedIn) {
    if (isAdmin) {
        printf("Welcome, boss\n");
    } else {
        printf("Welcome\n");
    }
} else {
    printf("Please log in\n");
}`, c`Rule of thumb: if you're three levels deep, look for a way to flatten it with ~&&~.`),
  P(c`
int age = 16;
bool student = true;
if (age < 18) {
    if (student) printf("A");
    else printf("B");
} else {
    printf("C");
}
printf("D");`, 'AD', c`The last printf isn't inside any if — it always runs.`),
  T('The ternary operator', c`A tiny if/else that **produces a value**:

~condition ? valueIfTrue : valueIfFalse~`, c`
int max = (a > b) ? a : b;

printf("You have %d item%s\n", n, n == 1 ? "" : "s");`, c`Great for picking between two values. Terrible when nested — don't.`),
  P(c`
int n = 7;
printf("%s", n % 2 == 0 ? "even" : "odd");`, 'odd'),
  F('Kids under 12 pay 5, everyone else pays 10.', c`
int age = 9;
int fee = (age < 12) [[?]] 5 [[:]] 10;`),
  X({ q: c`Print ~Good morning~ if the hour is before 12, otherwise ~Good afternoon~.

The catch: **no if allowed.** Use the ternary.`, start: M(c`
    int hour;
    scanf("%d", &hour);

`), tests: [{ in: '9', out: 'Good morning' }, { in: '15', out: 'Good afternoon' }, { in: '12', out: 'Good afternoon' }], must: [[c`\?`, c`Use the ternary operator ~? :~`]], not: [[c`\bif\b`, c`No ~if~ this time!`]], hint: c`~printf("%s\n", hour < 12 ? "Good morning" : "Good afternoon");~`, sol: M(c`
    int hour;
    scanf("%d", &hour);

    printf("%s\n", hour < 12 ? "Good morning" : "Good afternoon");`) }),
  X({ q: c`Cinema pricing. Input: age, then 1 if student, 0 if not.

under 12 → $6.00 · 65 or over → $8.00 · otherwise students pay $9.00 and everyone else $12.00

Print like: ~Ticket: $9.00~`, start: M(c`
    int age, student;
    scanf("%d %d", &age, &student);
    double price;

`), tests: [{ in: '30 1', out: 'Ticket: $9.00' }, { in: '30 0', out: 'Ticket: $12.00' }, { in: '8 0', out: 'Ticket: $6.00' }, { in: '70 1', out: 'Ticket: $8.00' }], hint: c`Handle the age rules first. In the final ~else~, decide between 9 and 12 — a nested if or a ternary both work.`, sol: M(c`
    int age, student;
    scanf("%d %d", &age, &student);
    double price;

    if (age < 12) {
        price = 6;
    } else if (age >= 65) {
        price = 8;
    } else {
        price = student ? 9 : 12;
    }
    printf("Ticket: $%.2f\n", price);`) }),
] },

{ id: 'calc', title: 'Project: calculator', icon: '🧮', desc: 'Your first genuinely useful program.',
  v: [['2:26:35', '2:34:23', 'Bro builds the calculator'], ['2:02:36', '2:10:27', 'Bonus: temperature conversion program']],
  steps: [
  T('One gotcha before you start', c`Reading a single character with ~scanf("%c", &op)~ has a trap: it happily reads the leftover **Enter key** or space from the previous input.

The fix is one space inside the format string:`, c`scanf(" %c", &op);   // the space means "skip any whitespace first"`),
  Q(c`What does the space in ~scanf(" %c", &op)~ do?`, ['Prints a space', 'Skips leftover whitespace (spaces, Enter) before reading the char', 'Reads two characters', 'Nothing — it is a typo'], 1),
  X({ q: c`**Calculator.** The input looks like ~8 * 2.5~ (number, operator, number). Support ~+ - * /~.

Print ~Result: 20.00~

Dividing by zero → ~Cannot divide by zero~ · unknown operator → ~Unknown operator~`, start: M(c`
    double a, b;
    char op;
    scanf("%lf %c %lf", &a, &op, &b);

`), tests: [{ in: '8 * 2.5', out: 'Result: 20.00' }, { in: '7 / 2', out: 'Result: 3.50' }, { in: '5 / 0', out: 'Cannot divide by zero' }, { in: '3 ^ 2', out: 'Unknown operator' }, { in: '10 - 4', out: 'Result: 6.00' }, { in: '1 + 1', out: 'Result: 2.00' }], hint: c`A ~switch (op)~ with ~case '+':~ etc. Inside ~case '/':~ put an ~if (b == 0)~.`, sol: M(c`
    double a, b;
    char op;
    scanf("%lf %c %lf", &a, &op, &b);

    switch (op) {
        case '+': printf("Result: %.2f\n", a + b); break;
        case '-': printf("Result: %.2f\n", a - b); break;
        case '*': printf("Result: %.2f\n", a * b); break;
        case '/':
            if (b == 0) {
                printf("Cannot divide by zero\n");
            } else {
                printf("Result: %.2f\n", a / b);
            }
            break;
        default:
            printf("Unknown operator\n");
    }`) }),
  X({ q: c`**Temperature converter.** Input: a number and a unit, like ~100 C~ or ~32 F~.

C → print Fahrenheit: ~212.0F~ · F → print Celsius: ~0.0C~ · anything else → ~Unknown unit~

F = C × 9 / 5 + 32 and C = (F − 32) × 5 / 9`, start: M(c`
    double temp;
    char unit;
    scanf("%lf %c", &temp, &unit);

`), tests: [{ in: '100 C', out: '212.0F' }, { in: '32 F', out: '0.0C' }, { in: '98.6 F', out: '37.0C' }, { in: '5 K', out: 'Unknown unit' }], hint: c`~if (unit == 'C')~ — chars are compared with single quotes.`, sol: M(c`
    double temp;
    char unit;
    scanf("%lf %c", &temp, &unit);

    if (unit == 'C') {
        printf("%.1fF\n", temp * 9 / 5 + 32);
    } else if (unit == 'F') {
        printf("%.1fC\n", (temp - 32) * 5 / 9);
    } else {
        printf("Unknown unit\n");
    }`) }),
] },
],
quiz: [
  P(c`
int x = 10;
if (x > 5) printf("A");
if (x > 8) printf("B");
else printf("C");`, 'AB', c`Two **separate** ifs — the second one isn't an ~else if~, so both get checked.`),
  Q(c`What is the difference between ~=~ and ~==~?`, [c`~=~ compares, ~==~ assigns`, c`~=~ assigns, ~==~ compares`, 'No difference', c`~==~ is for floats only`], 1),
  P(c`
char c = 'b';
switch (c) {
    case 'a': printf("1");
    case 'b': printf("2");
    case 'c': printf("3"); break;
    default: printf("4");
}`, '23'),
  Q(c`Is ~!(5 > 3) || (2 == 2)~ true or false?`, ['True', 'False'], 0, c`~!(true)~ is false, but ~2 == 2~ is true, and OR needs only one.`),
  P(c`
int a = 3, b = 9;
printf("%d", a > b ? a : b);`, '9'),
  Q(c`What does ~if (0)~ do?`, ['Always runs its block', 'Never runs its block', 'Causes a compile error', 'Runs once then stops'], 1),
] });

/* ============ TOPIC 4: FUNCTIONS ============ */
topic({ id: 'functions', title: 'Functions', icon: '📞', color: '#ce82ff', blurb: 'Write code once. Call it forever.',
lessons: [
{ id: 'funcs', title: 'Functions & arguments', icon: '📞', desc: 'Stop copy-pasting. Name a block of code and reuse it.',
  v: [['2:41:49', '2:51:45', 'Functions']],
  steps: [
  T('Name it, reuse it', c`A function is a named block of code. Define it once, **call** it as often as you like — with different inputs each time.`, c`
#include <stdio.h>

void happyBirthday(char name[], int age) {
    printf("Happy birthday %s!\n", name);
    printf("You are %d!\n", age);
}

int main() {
    happyBirthday("Bro", 21);
    happyBirthday("Ada", 36);
    return 0;
}`, c`~void~ = this function gives nothing back. ~name~ and ~age~ are its **parameters** — local variables filled in by each call.`),
  P(c`
#include <stdio.h>

void hi() {
    printf("hi ");
}

int main() {
    hi();
    hi();
    printf("bye");
    return 0;
}`, 'hi hi bye'),
  Q(c`In ~greet("Sam")~, what is ~"Sam"~?`, ['A parameter', 'An argument — the actual value passed in', 'A prototype', 'A return value'], 1, c`**Parameter** = the variable in the definition. **Argument** = the value you pass when calling. People mix the words up constantly; now you won't.`),
  F('Complete the function.', c`
#include <stdio.h>

[[void]] greet(char name[]) {
    printf("Hello %s\n", [[name]]);
}

int main() {
    [[greet]]("Sam");
    return 0;
}`),
  Q(c`The function is ~void happyBirthday(char name[], int age)~. What's wrong with ~happyBirthday(21, "Bro");~ ?`, ['Nothing', 'Arguments are matched by position — they are in the wrong order', 'You need to write the parameter names', 'Strings cannot be passed to functions'], 1, c`First argument goes to the first parameter, second to second. C doesn't look at names.`),
  X({ q: c`Write the function ~introduce~ so the program prints:

~Link is level 7~
~Zelda is level 9~

Don't change ~main~.`, start: c`#include <stdio.h>

// write introduce() here


int main() {
    introduce("Link", 7);
    introduce("Zelda", 9);
    return 0;
}
`, tests: [{ out: 'Link is level 7\nZelda is level 9' }], must: [[c`void\s+introduce\s*\(`, c`Define ~void introduce(...)~ above main.`]], hint: c`~void introduce(char name[], int level) { printf("%s is level %d\n", name, level); }~`, sol: c`#include <stdio.h>

void introduce(char name[], int level) {
    printf("%s is level %d\n", name, level);
}

int main() {
    introduce("Link", 7);
    introduce("Zelda", 9);
    return 0;
}
` }),
  X({ q: c`Copy-paste alert. Move the two repeated lines into a function called ~chorus~ and call it three times. The output must stay exactly the same.`, start: M(c`
    printf("Never gonna give you up\n");
    printf("Never gonna let you down\n");
    printf("Never gonna give you up\n");
    printf("Never gonna let you down\n");
    printf("Never gonna give you up\n");
    printf("Never gonna let you down\n");`), tests: [{ out: 'Never gonna give you up\nNever gonna let you down\nNever gonna give you up\nNever gonna let you down\nNever gonna give you up\nNever gonna let you down' }], must: [[c`void\s+chorus\s*\(`, c`Create a function ~void chorus()~.`], [c`chorus\s*\(\s*\)\s*;[\s\S]*chorus\s*\(\s*\)\s*;[\s\S]*chorus\s*\(\s*\)\s*;`, c`Call ~chorus();~ three times.`]], not: [[c`(give you up[\s\S]*){2}`, c`The lyrics should now appear only once in your code.`]], hint: c`Define ~void chorus() { ... }~ **above** main, then main just contains three calls.`, sol: c`#include <stdio.h>

void chorus() {
    printf("Never gonna give you up\n");
    printf("Never gonna let you down\n");
}

int main() {
    chorus();
    chorus();
    chorus();
    return 0;
}
` }),
] },

{ id: 'return', title: 'Return values', icon: '🔙', desc: 'Functions that answer questions.',
  v: [['2:51:45', '3:00:05', 'Return']],
  steps: [
  T('Sending a value back', c`Replace ~void~ with a type and the function can **return** a value of that type.`, c`
int square(int n) {
    return n * n;
}

int main() {
    int area = square(5);          // area = 25
    printf("%d\n", square(3) + 1); // 10
    return 0;
}`, c`Think of it like this: the call ~square(5)~ **becomes** the value 25, right there in the expression.`),
  P(c`
#include <stdio.h>

int twice(int n) {
    return n * 2;
}

int main() {
    printf("%d", twice(twice(3)) + 1);
    return 0;
}`, '13', c`Inside out: twice(3) is 6, twice(6) is 12, plus 1.`),
  Q(c`Function A **prints** 25. Function B **returns** 25. Which one can you use in ~int x = f() + 1;~ ?`, ['A', 'B', 'Both', 'Neither'], 1, c`Printing shows something to a human. Returning hands a value to the **program**. Functions that return are far more reusable.`),
  P(c`
#include <stdio.h>

int f() {
    printf("A");
    return 1;
    printf("B");
}

int main() {
    f();
    printf("C");
    return 0;
}`, 'AC', c`~return~ exits the function **immediately**. Anything after it is dead code.`),
  F('A function that cubes a decimal number.', c`
[[double]] cube(double x) {
    [[return]] x * x * x;
}`),
  X({ q: c`Write ~max~ so it returns the larger of two ints. ~main~ is done for you.`, start: c`#include <stdio.h>

int max(int a, int b) {
    // your code
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    printf("%d\n", max(x, y));
    return 0;
}
`, tests: [{ in: '3 9', out: '9' }, { in: '10 2', out: '10' }, { in: '-5 -7', out: '-5' }, { in: '4 4', out: '4' }], hint: c`~if (a > b) return a;~ then ~return b;~ — or one ternary.`, sol: c`#include <stdio.h>

int max(int a, int b) {
    return a > b ? a : b;
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    printf("%d\n", max(x, y));
    return 0;
}
` }),
  X({ q: c`Write ~isEven~. It should return ~true~ for even numbers and ~false~ for odd ones.`, start: c`#include <stdio.h>
#include <stdbool.h>

// write isEven here


int main() {
    int n;
    scanf("%d", &n);
    printf("%s\n", isEven(n) ? "even" : "odd");
    return 0;
}
`, tests: [{ in: '4', out: 'even' }, { in: '7', out: 'odd' }, { in: '0', out: 'even' }, { in: '-3', out: 'odd' }], hint: c`~bool isEven(int n) { return n % 2 == 0; }~ — a comparison already *is* a true/false value.`, sol: c`#include <stdio.h>
#include <stdbool.h>

bool isEven(int n) {
    return n % 2 == 0;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%s\n", isEven(n) ? "even" : "odd");
    return 0;
}
` }),
  X({ q: c`Write ~toFahrenheit~: takes Celsius as a ~double~, returns Fahrenheit (C × 9 / 5 + 32).`, start: c`#include <stdio.h>

// write toFahrenheit here


int main() {
    double c;
    scanf("%lf", &c);
    printf("%.1f\n", toFahrenheit(c));
    return 0;
}
`, tests: [{ in: '100', out: '212.0' }, { in: '-40', out: '-40.0' }, { in: '37', out: '98.6' }], hint: c`Return type ~double~, one parameter ~double c~, one line of maths.`, sol: c`#include <stdio.h>

double toFahrenheit(double c) {
    return c * 9 / 5 + 32;
}

int main() {
    double c;
    scanf("%lf", &c);
    printf("%.1f\n", toFahrenheit(c));
    return 0;
}
` }),
] },

{ id: 'scope', title: 'Scope & pass-by-value', icon: '🏠', desc: 'Where variables live, and why functions get copies.',
  v: [['3:00:05', '3:05:26', 'Variable scope']],
  steps: [
  T('Variables live inside their braces', c`A variable exists only inside the ~{ }~ where it was declared. That region is its **scope**.`, c`
void shop() {
    int coins = 50;      // exists only inside shop()
}

int main() {
    int coins = 10;      // a completely different variable
    shop();
    printf("%d", coins); // 10
    return 0;
}`, c`Two functions can use the same name without clashing — each has its own private box.`),
  Q(c`Can ~main~ read a variable that was declared inside another function?`, ['Yes, always', 'No — it is out of scope', 'Only if it is an int', 'Only after calling the function'], 1, c`The only ways in and out of a function are **parameters** and the **return value**.`),
  P(c`
#include <stdio.h>

void addTen(int n) {
    n = n + 10;
}

int main() {
    int score = 5;
    addTen(score);
    printf("%d", score);
    return 0;
}`, '5', c`**Pass by value.** ~addTen~ receives a *copy* of score. It changes the copy; the original never notices. Remember this moment — it is the reason pointers exist.`),
  P(c`
#include <stdio.h>

int x = 1;

int main() {
    int x = 2;
    {
        int x = 3;
        printf("%d", x);
    }
    printf("%d", x);
    return 0;
}`, '32', c`The innermost variable "shadows" the outer ones. When its block ends, the outer x is visible again. (Legal, but confusing — avoid reusing names.)`),
  Q('Why do programmers avoid global variables?', ['They are slower', 'Any function can change them, so bugs are hard to trace', 'C does not allow them', 'They use too much memory'], 1, c`With locals you know exactly who can touch a value. With globals, the answer is "everyone".`),
  X({ q: c`~addBonus~ is supposed to add 50 to the score, but the program prints ~Score: 100~.

Fix it using what you know: make ~addBonus~ **return** the new score, and use that return value in ~main~.`, start: c`#include <stdio.h>

void addBonus(int score) {
    score = score + 50;
}

int main() {
    int score = 100;
    addBonus(score);
    printf("Score: %d\n", score);
    return 0;
}
`, tests: [{ out: 'Score: 150' }], must: [[c`int\s+addBonus`, c`Change the return type of ~addBonus~ to ~int~.`], [c`score\s*=\s*addBonus\s*\(`, c`In main, store the result: ~score = addBonus(score);~`]], hint: c`~int addBonus(int score) { return score + 50; }~ and in main ~score = addBonus(score);~`, sol: c`#include <stdio.h>

int addBonus(int score) {
    return score + 50;
}

int main() {
    int score = 100;
    score = addBonus(score);
    printf("Score: %d\n", score);
    return 0;
}
` }),
] },

{ id: 'proto', title: 'Function prototypes', icon: '📌', desc: 'Why order matters, and how to make it not matter.',
  v: [['3:05:26', '3:10:31', 'Function prototypes']],
  steps: [
  T('The compiler reads top to bottom', c`If ~main~ calls a function that is defined further **down** the file, the compiler hasn't seen it yet and complains.

A **prototype** is a one-line promise placed above main: "this function exists, here's its shape, the body comes later."`, c`
#include <stdio.h>

int add(int a, int b);        // prototype: note the semicolon

int main() {
    printf("%d\n", add(2, 3));
    return 0;
}

int add(int a, int b) {       // the real definition
    return a + b;
}`, c`This lets ~main~ sit at the top where readers expect it — and it's exactly what header files like ~stdio.h~ contain: prototypes.`),
  Q('Which is a valid prototype?', [c`~int add(int a, int b);~`, c`~int add(int a, int b) {}~`, c`~add(a, b);~`, c`~prototype int add;~`], 0, c`Return type, name, parameter types, **semicolon**, no body.`),
  O('Arrange a program that uses a prototype so main can come first.', c`
#include <stdio.h>
void hello(char name[]);
int main() {
    hello("Bro");
    return 0;
}
void hello(char name[]) {
    printf("Hello %s\n", name);
}`),
  Q(c`The prototype says ~int area(int w, int h);~ but you call ~area(5)~. What happens?`, ['It runs with h = 0', 'The compiler stops you: too few arguments', 'It crashes at runtime', 'h gets a random value'], 1, c`That's the real value of prototypes: mistakes get caught at compile time instead of at 3 a.m. in production.`),
  X({ q: c`This doesn't compile because ~main~ uses functions before they are defined.

Fix it **without moving any function** — add prototypes.

Expected output: ~20~ then ~4.5~`, start: c`#include <stdio.h>

int main() {
    printf("%d\n", area(4, 5));
    printf("%.1f\n", half(9));
    return 0;
}

int area(int w, int h) {
    return w * h;
}

double half(double x) {
    return x / 2;
}
`, tests: [{ out: '20\n4.5' }], must: [[c`int\s+area\s*\([^)]*\)\s*;[\s\S]*int\s+main`, c`Add a prototype for ~area~ above main.`], [c`double\s+half\s*\([^)]*\)\s*;[\s\S]*int\s+main`, c`Add a prototype for ~half~ above main.`]], hint: c`Copy each function's first line above main and end it with ~;~`, sol: c`#include <stdio.h>

int area(int w, int h);
double half(double x);

int main() {
    printf("%d\n", area(4, 5));
    printf("%.1f\n", half(9));
    return 0;
}

int area(int w, int h) {
    return w * h;
}

double half(double x) {
    return x / 2;
}
` }),
] },

{ id: 'workout', title: 'Function workout', icon: '🏋️', desc: 'Three functions, zero hand-holding.',
  steps: [
  T('Reps', c`You know everything you need. Each challenge gives you a finished ~main~ and a missing function.

A good habit starts here: write **small functions that do one thing** and return a result. Let ~main~ do the talking.`),
  X({ q: c`Write ~clamp~: it forces ~value~ into the range ~lo~…~hi~. Too small → return ~lo~. Too big → return ~hi~. Otherwise return it unchanged.`, start: c`#include <stdio.h>

// int clamp(int value, int lo, int hi)


int main() {
    int volume;
    scanf("%d", &volume);
    printf("%d\n", clamp(volume, 0, 100));
    return 0;
}
`, tests: [{ in: '150', out: '100' }, { in: '-3', out: '0' }, { in: '42', out: '42' }], hint: c`Two ifs with early returns, then ~return value;~`, sol: c`#include <stdio.h>

int clamp(int value, int lo, int hi) {
    if (value < lo) return lo;
    if (value > hi) return hi;
    return value;
}

int main() {
    int volume;
    scanf("%d", &volume);
    printf("%d\n", clamp(volume, 0, 100));
    return 0;
}
` }),
  X({ q: c`Write ~grade~: it takes a score and returns a ~char~.

90+ → ~'A'~ · 80+ → ~'B'~ · 70+ → ~'C'~ · 60+ → ~'D'~ · below → ~'F'~`, start: c`#include <stdio.h>

// char grade(int score)


int main() {
    int score;
    scanf("%d", &score);
    printf("Grade: %c\n", grade(score));
    return 0;
}
`, tests: [{ in: '95', out: 'Grade: A' }, { in: '80', out: 'Grade: B' }, { in: '71', out: 'Grade: C' }, { in: '60', out: 'Grade: D' }, { in: '12', out: 'Grade: F' }], hint: c`~if (score >= 90) return 'A';~ — once you return, you don't even need ~else~.`, sol: c`#include <stdio.h>

char grade(int score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

int main() {
    int score;
    scanf("%d", &score);
    printf("Grade: %c\n", grade(score));
    return 0;
}
` }),
  X({ q: c`Functions calling functions. Write **two**:

~isLeap(year)~ → true for leap years (÷4 and not ÷100, or ÷400)

~daysInMonth(month, year)~ → 28–31. February must ask ~isLeap~.`, start: c`#include <stdio.h>
#include <stdbool.h>

// bool isLeap(int year)

// int daysInMonth(int month, int year)


int main() {
    int month, year;
    scanf("%d %d", &month, &year);
    printf("%d\n", daysInMonth(month, year));
    return 0;
}
`, tests: [{ in: '2 2024', out: '29' }, { in: '2 2023', out: '28' }, { in: '4 2023', out: '30' }, { in: '12 1999', out: '31' }, { in: '2 1900', out: '28' }], hint: c`A ~switch (month)~ works nicely: ~case 4: case 6: case 9: case 11: return 30;~ and ~case 2: return isLeap(year) ? 29 : 28;~`, sol: c`#include <stdio.h>
#include <stdbool.h>

bool isLeap(int year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

int daysInMonth(int month, int year) {
    switch (month) {
        case 4: case 6: case 9: case 11:
            return 30;
        case 2:
            return isLeap(year) ? 29 : 28;
        default:
            return 31;
    }
}

int main() {
    int month, year;
    scanf("%d %d", &month, &year);
    printf("%d\n", daysInMonth(month, year));
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`What does ~void~ mean in ~void beep()~ ?`, ['The function takes no arguments', 'The function returns no value', 'The function is empty', 'The function is private'], 1),
  P(c`
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    printf("%d", add(add(1, 2), add(3, 4)));
    return 0;
}`, '10'),
  P(c`
#include <stdio.h>

void reset(int n) {
    n = 0;
}

int main() {
    int lives = 3;
    reset(lives);
    printf("%d", lives);
    return 0;
}`, '3', c`Pass by value: ~reset~ zeroed its own copy.`),
  Q('What is a function prototype for?', ['It makes the function run faster', 'It tells the compiler a function exists before its definition appears', 'It replaces the function body', 'It makes a function global'], 1),
  F('Return the square.', c`
int square(int n) {
    [[return]] n * n;
}`),
  Q('When does a local variable stop existing?', ['When the program ends', 'At the closing brace of the block it was declared in', 'When you call free on it', 'Never'], 1),
] });

/* ============ TOPIC 5: LOOPS ============ */
topic({ id: 'loops', title: 'Loops', icon: '🔁', color: '#ff4b4b', blurb: 'Make the computer do the boring part a million times.',
lessons: [
{ id: 'while', title: 'while & do-while', icon: '♾️', desc: 'Repeat until something changes.',
  v: [['3:10:31', '3:21:57', 'While loops']],
  steps: [
  T('Repeat while true', c`A ~while~ loop is an ~if~ that keeps going: check the condition, run the block, check again…`, c`
int countdown = 3;

while (countdown > 0) {
    printf("%d...\n", countdown);
    countdown--;
}
printf("Lift off!\n");`, c`Something inside the loop **must** move the condition towards false. Otherwise: infinite loop.`),
  P(c`
int i = 1;
while (i < 20) {
    i = i * 2;
}
printf("%d", i);`, '32', c`1 → 2 → 4 → 8 → 16 → 32. At 32 the condition fails and the loop ends.`),
  Q(c`You delete the line ~countdown--;~ from the countdown loop. What happens?`, ['It prints 3 once', 'It prints "3..." forever', 'It does not compile', 'It skips the loop'], 1, c`An infinite loop. Out in the real world, you stop a runaway program with **Ctrl+C**. In here, the runner kills it after 4 seconds.`),
  T('do-while: act first, ask later', c`A ~do-while~ checks the condition **after** the block, so the block always runs at least once. Perfect for "keep asking until the answer is valid".`, c`
int age;
do {
    printf("Enter your age: ");
    scanf("%d", &age);
} while (age < 0);`, c`Note the semicolon after the ~while (...)~ — only do-while has that.`),
  P(c`
int n = 10;
do {
    printf("%d", n);
    n++;
} while (n < 5);`, '10', c`The condition is false from the start — but a do-while runs once before checking.`),
  F('Keep hitting until the monster is down.', c`
int hp = 35;
[[while]] (hp [[>]] 0) {
    hp -= 10;
}`),
  X({ q: c`Read a number ~n~ and count down to 1, one number per line, then print ~Lift off!~

For input 3:

~3~
~2~
~1~
~Lift off!~`, start: M(c`
    int n;
    scanf("%d", &n);

`), tests: [{ in: '3', out: '3\n2\n1\nLift off!' }, { in: '1', out: '1\nLift off!' }, { in: '5', out: '5\n4\n3\n2\n1\nLift off!' }], must: [['while', c`Use a ~while~ loop.`]], hint: c`~while (n > 0) { print n; n--; }~`, sol: M(c`
    int n;
    scanf("%d", &n);

    while (n > 0) {
        printf("%d\n", n);
        n--;
    }
    printf("Lift off!\n");`) }),
  X({ q: c`Keep reading numbers until the user enters ~0~, then print their sum:

~Sum: 18~

You don't know in advance how many numbers there will be — that's exactly what while is for.`, start: M(c`
    int number;
    int sum = 0;

`), tests: [{ in: '5 10 3 0', out: 'Sum: 18' }, { in: '0', out: 'Sum: 0' }, { in: '-2 7 0', out: 'Sum: 5' }], hint: c`Read the first number before the loop. Inside ~while (number != 0)~: add it, then read the next one.`, sol: M(c`
    int number;
    int sum = 0;

    scanf("%d", &number);
    while (number != 0) {
        sum += number;
        scanf("%d", &number);
    }
    printf("Sum: %d\n", sum);`) }),
] },

{ id: 'for', title: 'for loops', icon: '🔂', desc: 'When you know how many times.',
  v: [['3:21:57', '3:27:56', 'For loops']],
  steps: [
  T('Counting in one line', c`A ~for~ loop packs the three parts of a counting loop into one line:

~for (start; keep-going condition; step)~`, c`
for (int i = 0; i < 5; i++) {
    printf("%d\n", i);     // 0 1 2 3 4
}`, c`Programmers count from **0**. It feels odd for a week and then it never feels odd again (arrays will show you why).`),
  P(c`
for (int i = 0; i < 5; i++) {
    printf("%d", i);
}`, '01234', c`Starts at 0, stops **before** 5. Five rounds in total.`),
  P(c`
for (int i = 10; i > 0; i -= 3) {
    printf("%d ", i);
}`, '10 7 4 1', c`The step can be anything — here it counts down by 3.`),
  Q(c`How many times does this loop run? ~for (int i = 0; i <= 10; i++)~`, ['9', '10', '11', '12'], 2, c`0 through 10 **inclusive** is 11 numbers. Mixing up ~<~ and ~<=~ is called an **off-by-one error** and you will make it roughly forever.`),
  F('Print every number from 1 to 100.', c`
for (int i = [[1]]; i [[<=]] 100; i[[++]]) {
    printf("%d\n", i);
}`),
  X({ q: c`Read ~n~ and print the sum of all numbers from 1 to n:

~Sum: 5050~   (for n = 100)`, start: M(c`
    int n;
    scanf("%d", &n);

`), tests: [{ in: '100', out: 'Sum: 5050' }, { in: '1', out: 'Sum: 1' }, { in: '10', out: 'Sum: 55' }], must: [['for', c`Use a ~for~ loop.`]], hint: c`Create ~int sum = 0;~ before the loop and do ~sum += i;~ inside it.`, sol: M(c`
    int n;
    scanf("%d", &n);

    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    printf("Sum: %d\n", sum);`) }),
  X({ q: c`Read ~n~ and print its times table from 1 to 10. For n = 7:

~7 x 1 = 7~
~7 x 2 = 14~
… up to ~7 x 10 = 70~`, start: M(c`
    int n;
    scanf("%d", &n);

`), tests: [{ in: '7', out: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70' }, { in: '2', out: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20' }], hint: c`~printf("%d x %d = %d\n", n, i, n * i);~ inside a loop from 1 to 10.`, sol: M(c`
    int n;
    scanf("%d", &n);

    for (int i = 1; i <= 10; i++) {
        printf("%d x %d = %d\n", n, i, n * i);
    }`) }),
  X({ q: c`Factorial: 5! = 5 × 4 × 3 × 2 × 1 = 120. Read ~n~ and print:

~5! = 120~`, start: M(c`
    int n;
    scanf("%d", &n);

`), tests: [{ in: '5', out: '5! = 120' }, { in: '1', out: '1! = 1' }, { in: '10', out: '10! = 3628800' }], hint: c`Like the sum, but start with ~int result = 1;~ and multiply.`, sol: M(c`
    int n;
    scanf("%d", &n);

    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    printf("%d! = %d\n", n, result);`) }),
] },

{ id: 'breakcont', title: 'break & continue', icon: '🛑', desc: 'Bail out early, or skip a round.',
  v: [['3:27:56', '3:30:16', 'Break & continue']],
  steps: [
  T('Two escape hatches', c`~break~ — leave the loop **right now**.

~continue~ — skip the rest of **this round** and go to the next one.`, c`
for (int i = 1; i <= 10; i++) {
    if (i == 5) continue;   // skip 5
    if (i == 8) break;      // stop completely at 8
    printf("%d ", i);       // 1 2 3 4 6 7
}`),
  P(c`
for (int i = 1; i <= 10; i++) {
    if (i == 4) break;
    printf("%d", i);
}`, '123'),
  P(c`
for (int i = 1; i <= 6; i++) {
    if (i % 2 == 0) continue;
    printf("%d", i);
}`, '135', c`Every even number hits ~continue~ and skips the printf.`),
  Q(c`A ~break~ sits in a loop that is inside another loop. Which loop does it exit?`, ['Both loops', 'Only the innermost loop it is in', 'Only the outer loop', 'The whole program'], 1),
  X({ q: c`Print the numbers 1 to 20 on one line separated by spaces — but **skip every multiple of 3**.

~1 2 4 5 7 8 10 11 13 14 16 17 19 20~`, start: M(c`

`), tests: [{ out: '1 2 4 5 7 8 10 11 13 14 16 17 19 20' }], must: [['continue', c`Use ~continue~ to skip the multiples of 3.`]], hint: c`~if (i % 3 == 0) continue;~ before the printf.`, sol: M(c`
    for (int i = 1; i <= 20; i++) {
        if (i % 3 == 0) continue;
        printf("%d ", i);
    }
    printf("\n");`) }),
  X({ q: c`Prime detector. Read ~n~, print ~Prime~ or ~Not prime~.

A prime is greater than 1 and divisible only by 1 and itself. As soon as you find any divisor, you can ~break~ — no need to keep looking.`, start: M(c`
    int n;
    scanf("%d", &n);

`), tests: [{ in: '7', out: 'Prime' }, { in: '9', out: 'Not prime' }, { in: '2', out: 'Prime' }, { in: '1', out: 'Not prime' }, { in: '97', out: 'Prime' }, { in: '100', out: 'Not prime' }], hint: c`Keep a flag: ~int prime = n > 1;~. Loop ~i~ from 2 to n−1; if ~n % i == 0~, set the flag to 0 and break.`, sol: M(c`
    int n;
    scanf("%d", &n);

    int prime = n > 1;
    for (int i = 2; i < n; i++) {
        if (n % i == 0) {
            prime = 0;
            break;
        }
    }
    printf("%s\n", prime ? "Prime" : "Not prime");`) }),
] },

{ id: 'nestedloops', title: 'Nested loops', icon: '➿', desc: 'Loops inside loops: grids, patterns, tables.',
  v: [['3:30:16', '3:40:00', 'Nested loops']],
  steps: [
  T('Rows and columns', c`Put a loop inside a loop and the inner one runs **completely** for every single round of the outer one. Think: outer = rows, inner = columns.`, c`
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 5; col++) {
        printf("#");
    }
    printf("\n");    // end of the row
}`, c`That prints 3 rows of 5 ~#~ characters.`),
  P(c`
for (int r = 1; r <= 2; r++) {
    for (int c = 1; c <= 3; c++) {
        printf("%d", r * c);
    }
    printf("\n");
}`, '123\n246'),
  Q('The outer loop runs 3 times and the inner loop runs 4 times. How often does the inner body execute?', ['7', '4', '12', '3'], 2, c`3 × 4. This is why nested loops get slow quickly with big numbers.`),
  X({ q: c`Read ~rows~ and ~cols~ and draw a rectangle of stars. For ~2 3~:

~***~
~***~`, start: M(c`
    int rows, cols;
    scanf("%d %d", &rows, &cols);

`), tests: [{ in: '2 3', out: '***\n***' }, { in: '3 1', out: '*\n*\n*' }, { in: '1 6', out: '******' }], hint: c`Outer loop over rows, inner loop prints one ~*~ per column, newline after the inner loop.`, sol: M(c`
    int rows, cols;
    scanf("%d %d", &rows, &cols);

    for (int r = 0; r < rows; r++) {
        for (int col = 0; col < cols; col++) {
            printf("*");
        }
        printf("\n");
    }`) }),
  X({ q: c`Read ~n~ and draw a staircase. For 4:

~*~
~**~
~***~
~****~

The trick: the inner loop's limit depends on the outer loop's counter.`, start: M(c`
    int n;
    scanf("%d", &n);

`), tests: [{ in: '4', out: '*\n**\n***\n****' }, { in: '1', out: '*' }, { in: '2', out: '*\n**' }], hint: c`Row number ~r~ needs ~r~ stars: ~for (int s = 0; s < r; s++)~`, sol: M(c`
    int n;
    scanf("%d", &n);

    for (int r = 1; r <= n; r++) {
        for (int s = 0; s < r; s++) {
            printf("*");
        }
        printf("\n");
    }`) }),
  X({ q: c`**Boss pattern.** Read ~n~ and draw a centred pyramid. For 3 (spaces matter on the left!):

~  *~
~ ***~
~*****~

Row r needs (n − r) spaces, then (2r − 1) stars.`, start: M(c`
    int n;
    scanf("%d", &n);

`), tests: [{ in: '3', out: '  *\n ***\n*****' }, { in: '4', out: '   *\n  ***\n *****\n*******' }, { in: '2', out: ' *\n***' }], hint: c`Two inner loops one after the other inside the row loop: first spaces, then stars.`, sol: M(c`
    int n;
    scanf("%d", &n);

    for (int r = 1; r <= n; r++) {
        for (int s = 0; s < n - r; s++) {
            printf(" ");
        }
        for (int s = 0; s < 2 * r - 1; s++) {
            printf("*");
        }
        printf("\n");
    }`) }),
] },

{ id: 'random', title: 'Random numbers', icon: '🎲', desc: 'Dice, coin flips and why your game is the same every time.',
  v: [['3:40:00', '3:46:01', 'Random numbers']],
  steps: [
  T('Rolling dice', c`~rand()~ (from ~stdlib.h~) returns a big pseudo-random integer. Squeeze it into a range with ~%~:`, c`
#include <stdlib.h>
#include <time.h>

srand(time(NULL));            // seed ONCE, at the start of main

int coin = rand() % 2;        // 0 or 1
int dice = rand() % 6 + 1;    // 1 to 6`, c`"Pseudo" random: it's a fixed sequence that only *looks* random. ~srand~ picks the starting point — and seeding with the current time gives a different start on every run.`),
  Q(c`What range does ~rand() % 10~ produce?`, ['1 to 10', '0 to 9', '0 to 10', '1 to 9'], 1, c`A remainder after dividing by 10 can only be 0 to 9.`),
  F('Roll a normal six-sided die (1–6).', c`int roll = rand() % [[6]] + [[1]];`),
  Q(c`You forget ~srand(time(NULL));~. What happens?`, ['rand() returns 0', 'The program crashes', 'You get the exact same "random" numbers on every run', 'Nothing changes'], 2, c`Same seed, same sequence. Handy for debugging, terrible for games.`),
  Q('Which expression gives a random number from 50 to 100 inclusive?', [c`~rand() % 100 + 50~`, c`~rand() % 51 + 50~`, c`~rand() % 50 + 50~`, c`~rand() % 100 - 50~`], 1, c`General recipe: ~rand() % (max - min + 1) + min~. Here: 51 possible values, starting at 50.`),
  X({ q: c`Roll two dice and print the result in this format (your numbers will differ):

~Rolled: 3 + 5 = 8~

Seed the generator so each run is different.`, start: M(c`

`, 'stdlib.h', 'time.h'), tests: [{ re: c`^Rolled: [1-6] \+ [1-6] = ([2-9]|1[0-2])$` }], must: [[c`srand\s*\(`, c`Seed with ~srand(time(NULL));~`], [c`rand\s*\(\s*\)\s*%\s*6`, c`Use ~rand() % 6 + 1~ for each die.`]], hint: c`Two variables ~a~ and ~b~, each ~rand() % 6 + 1~, then one printf with three ~%d~.`, sol: M(c`
    srand(time(NULL));
    int a = rand() % 6 + 1;
    int b = rand() % 6 + 1;
    printf("Rolled: %d + %d = %d\n", a, b, a + b);`, 'stdlib.h', 'time.h') }),
] },

{ id: 'games', title: 'Project: three classics', icon: '🎮', desc: 'A guessing game, FizzBuzz and a bank — all loops.',
  v: [['3:46:01', '3:53:30', 'Bro builds the number guessing game'], ['4:05:40', '4:21:11', 'Bro builds the banking program'], ['3:53:30', '4:05:40', 'Bonus: rock paper scissors']],
  steps: [
  T('Loops + decisions = programs', c`Nearly every interactive program has the same skeleton: **loop** → read input → **decide** → respond → repeat.

One note: the real game would pick the secret with ~rand()~. Automated tests can't guess a random number, so here the secret is fixed at 42.`),
  X({ q: c`**Guessing game.** Keep reading guesses until the player hits the secret.

Each wrong guess prints ~Too high~ or ~Too low~. The right one prints ~Correct! Tries: N~ and ends the program.`, start: M(c`
    int secret = 42;
    int guess;
    int tries = 0;

`), tests: [{ in: '50 20 42', out: 'Too high\nToo low\nCorrect! Tries: 3' }, { in: '42', out: 'Correct! Tries: 1' }, { in: '1 2 99 43 41 42', out: 'Too low\nToo low\nToo high\nToo high\nToo low\nCorrect! Tries: 6' }], hint: c`A ~do { ... } while (guess != secret);~ fits perfectly: read, count, compare.`, sol: M(c`
    int secret = 42;
    int guess;
    int tries = 0;

    do {
        scanf("%d", &guess);
        tries++;
        if (guess > secret) {
            printf("Too high\n");
        } else if (guess < secret) {
            printf("Too low\n");
        } else {
            printf("Correct! Tries: %d\n", tries);
        }
    } while (guess != secret);`) }),
  X({ q: c`**FizzBuzz** — the most famous interview warm-up in programming.

Print 1 to 15, one per line. But: multiples of 3 → ~Fizz~, multiples of 5 → ~Buzz~, multiples of both → ~FizzBuzz~.`, start: M(c`

`), tests: [{ out: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }], hint: c`Check "both" (~i % 15 == 0~) **first** — remember, the first true branch wins.`, sol: M(c`
    for (int i = 1; i <= 15; i++) {
        if (i % 15 == 0) {
            printf("FizzBuzz\n");
        } else if (i % 3 == 0) {
            printf("Fizz\n");
        } else if (i % 5 == 0) {
            printf("Buzz\n");
        } else {
            printf("%d\n", i);
        }
    }`) }),
  X({ q: c`**Bank.** The balance starts at 0. Read menu choices in a loop:

~1~ → print ~Balance: $70.00~
~2 amount~ → deposit
~3 amount~ → withdraw — or print ~Insufficient funds~ if there isn't enough
~4~ → print ~Bye~ and stop`, start: M(c`
    double balance = 0;
    int choice;
    double amount;

`), tests: [{ in: '2 100 3 30 1 4', out: 'Balance: $70.00\nBye' }, { in: '3 50 1 4', out: 'Insufficient funds\nBalance: $0.00\nBye' }, { in: '2 20.5 2 4.5 1 3 25 1 4', out: 'Balance: $25.00\nBalance: $0.00\nBye' }], hint: c`~do { scanf choice; switch (choice) { ... } } while (choice != 4);~ — cases 2 and 3 do a second scanf for the amount.`, sol: M(c`
    double balance = 0;
    int choice;
    double amount;

    do {
        scanf("%d", &choice);
        switch (choice) {
            case 1:
                printf("Balance: $%.2f\n", balance);
                break;
            case 2:
                scanf("%lf", &amount);
                balance += amount;
                break;
            case 3:
                scanf("%lf", &amount);
                if (amount > balance) {
                    printf("Insufficient funds\n");
                } else {
                    balance -= amount;
                }
                break;
            case 4:
                printf("Bye\n");
                break;
        }
    } while (choice != 4);`) }),
] },
],
quiz: [
  P(c`
int s = 0;
for (int i = 1; i <= 4; i++) {
    s += i;
}
printf("%d", s);`, '10'),
  Q('Which loop always runs its body at least once?', [c`~for~`, c`~while~`, c`~do-while~`, 'None of them'], 2),
  P(c`
int i = 0;
while (i < 3) {
    i++;
    if (i == 2) continue;
    printf("%d", i);
}`, '13'),
  Q(c`How many stars does this print?`, ['3', '6', '9', '4'], 1, c`Row 1 prints 1, row 2 prints 2, row 3 prints 3. 1 + 2 + 3 = 6.`, c`
for (int i = 1; i <= 3; i++)
    for (int j = 1; j <= i; j++)
        printf("*");`),
  F('Make this loop run exactly 10 times.', c`
for (int i = 0; i [[<]] 10; i++) {
    printf("again\n");
}`),
  Q(c`What range does ~rand() % 100 + 1~ produce?`, ['0 to 100', '1 to 100', '0 to 99', '1 to 101'], 1),
] });
