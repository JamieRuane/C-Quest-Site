/* ================= Java: topics 2-5 ================= */
G('Math class', c`Ready-made maths: ~Math.max(a, b)~, ~Math.sqrt(x)~, ~Math.pow(a, b)~, ~Math.round(x)~, ~Math.abs(x)~.`);
G('printf', c`Prints with a format: ~System.out.printf("%.2f%n", price);~ — ~%d~ whole number, ~%f~ decimal, ~%s~ text, ~%n~ new line.`);
G('substring()', c`Part of a string: ~"hello".substring(1, 3)~ is ~"el"~. The end position is not included.`);
G('ternary operator', c`A one-line if/else that gives a value: ~age >= 18 ? "adult" : "minor"~.`);
G('switch', c`Picks one branch by matching a value: ~case "Sat", "Sun" -> ...~`);
G('&& / || / !', c`And, or, not: combine conditions like ~age >= 13 && age <= 19~.`);
G('loop', c`Repeats code: ~while~ (until a condition fails), ~for~ (counting), ~do-while~ (at least once).`);
G('break / continue', c`~break~ leaves a loop now; ~continue~ skips to the next round.`);
G('method', c`A named, reusable block of code: ~static int square(int n) { return n * n; }~`);
G('return', c`Sends a value back from a method. A ~void~ method returns nothing.`);
G('overloading', c`Several methods with the same name but different parameters. Java picks the one that fits the arguments.`);
G('scope', c`Where a variable exists. A variable made inside ~{ }~ disappears at the closing brace.`);

/* ============ TOPIC 2: MATH & STRINGS ============ */
topic({ id: 'strings', title: 'Math & Strings', icon: '🧮', color: '#1cb0f6', blurb: 'The Math class, tidy output with printf, and string superpowers.',
lessons: [
{ id: 'math', title: 'The Math class', icon: '📐', desc: 'Square roots, powers and rounding — already written for you.',
  v: [['1:27:28', '1:42:37', 'Math class']],
  steps: [
  T('Maths for free', c`Java's **Math** class holds the formulas you would otherwise write yourself. No import needed.`, c`
Math.max(3, 8)       // 8
Math.min(3, 8)       // 3
Math.abs(-5)         // 5
Math.pow(2, 10)      // 1024.0  — always a double
Math.sqrt(49)        // 7.0
Math.round(2.5)      // 3       — nearest whole number
Math.ceil(2.1)       // 3.0     — always up
Math.floor(2.9)      // 2.0     — always down
Math.PI              // 3.141592653589793`),
  P(c`System.out.println(Math.max(3, 8) + Math.abs(-2));`, '10'),
  P(c`System.out.println(Math.pow(2, 10));`, '1024.0', c`~pow~ and ~sqrt~ always give back a ~double~, so a ~.0~ appears.`),
  P(c`System.out.println(Math.round(2.5) + " " + Math.floor(2.9));`, '3 2.0'),
  X({ q: c`**Pythagoras.** Read the two shorter sides of a right-angled triangle and print the long side (the hypotenuse): ~c = √(a² + b²)~.

~3 4~ → ~5.0~`, start: M(c`
        Scanner in = new Scanner(System.in);
        double a = in.nextDouble();
        double b = in.nextDouble();
`, 'java.util.Scanner'), tests: [{ in: '3 4', out: '5.0' }, { in: '6 8', out: '10.0' }], must: [[c`Math\.sqrt`, c`Use ~Math.sqrt~.`]], hint: c`~Math.sqrt(a * a + b * b)~`, sol: M(c`
        Scanner in = new Scanner(System.in);
        double a = in.nextDouble();
        double b = in.nextDouble();
        System.out.println(Math.sqrt(a * a + b * b));`, 'java.util.Scanner') }),
] },

{ id: 'printf', title: 'printf: tidy output', icon: '🖨️', desc: 'Two decimal places, lined-up columns.',
  v: [['1:42:37', '1:54:00', 'printf']],
  steps: [
  T('Format strings', c`~println~ prints doubles with as many digits as it likes: ~12.566370614359172~. **printf** lets you say exactly how a value should look. Each ~%~ marks a slot, filled by the values after the comma.`, c`
String name = "Mario";
int lives = 3;
double price = 4.5;

System.out.printf("%s has %d lives%n", name, lives);   // Mario has 3 lives
System.out.printf("Price: %.2f%n", price);             // Price: 4.50
System.out.printf("[%5d]%n", 42);                      // [   42]  width 5`, c`~%d~ whole number · ~%f~ decimal · ~%.2f~ two decimals · ~%s~ text · ~%n~ new line. ~String.format~ builds the same text without printing it.`),
  P(c`System.out.printf("%.2f%n", 3.14159);`, '3.14'),
  P(c`System.out.printf("%s scored %d%n", "Ada", 97);`, 'Ada scored 97'),
  F('Print the price with two decimals.', c`System.out.printf("Price: [[%.2f]]%n", 9.5);`),
  X({ q: c`Read a radius and print the circle's area with **two** decimals:

~2~ → ~Area: 12.57~`, start: M(c`
        Scanner in = new Scanner(System.in);
        double r = in.nextDouble();
`, 'java.util.Scanner'), tests: [{ in: '2', out: 'Area: 12.57' }, { in: '1', out: 'Area: 3.14' }], must: [[c`printf|String\.format`, c`Use ~printf~ (or ~String.format~).`]], hint: c`~System.out.printf("Area: %.2f%n", Math.PI * r * r);~`, sol: M(c`
        Scanner in = new Scanner(System.in);
        double r = in.nextDouble();
        System.out.printf("Area: %.2f%n", Math.PI * r * r);`, 'java.util.Scanner') }),
  X({ q: c`**Compound interest.** Read a starting amount, a yearly interest rate in percent, and a number of years. Print what the money grows to:

~1000 5 2~ → ~Amount: 1102.50~

The formula: ~amount × (1 + rate / 100)^years~`, start: M(c`
        Scanner in = new Scanner(System.in);
`, 'java.util.Scanner'), tests: [{ in: '1000 5 2', out: 'Amount: 1102.50' }, { in: '500 10 3', out: 'Amount: 665.50' }], must: [[c`Math\.pow`, c`Use ~Math.pow~ for the power.`]], hint: c`~double total = amount * Math.pow(1 + rate / 100, years);~`, sol: M(c`
        Scanner in = new Scanner(System.in);
        double amount = in.nextDouble();
        double rate = in.nextDouble();
        int years = in.nextInt();

        double total = amount * Math.pow(1 + rate / 100, years);
        System.out.printf("Amount: %.2f%n", total);`, 'java.util.Scanner') }),
] },

{ id: 'methods', title: 'String methods', icon: '🔤', desc: 'Measure, search, slice and change text.',
  v: [['2:10:20', '2:18:55', 'String methods'], ['2:18:55', '2:27:00', 'Substrings']],
  steps: [
  T('Strings can do things', c`A ~String~ comes with dozens of **methods**. Positions start at **0**.`, c`
String s = "Hello, World";

s.length()              // 12
s.charAt(0)             // 'H'
s.indexOf("World")      // 7    (-1 if not found)
s.toUpperCase()         // "HELLO, WORLD"
s.contains("lo")        // true
s.replace("l", "L")     // "HeLLo, WorLd"
s.isEmpty()             // false
"  hi  ".trim()         // "hi"
s.equalsIgnoreCase("hello, world")   // true`, c`Strings never change: ~toUpperCase()~ gives back a **new** string. Save it: ~s = s.toUpperCase();~`),
  P(c`
String s = "Hello";
System.out.println(s.length() + " " + s.charAt(1));`, '5 e'),
  P(c`System.out.println("banana".indexOf("an") + " " + "banana".replace('a', 'o'));`, '1 bonono'),
  T('substring', c`~substring(start, end)~ cuts out a piece. The **end is not included**, so ~end - start~ is the length of the piece. Leave out the end to go to the finish.`, c`
String word = "JavaScript";
word.substring(0, 4)     // "Java"
word.substring(4)        // "Script"`),
  P(c`
String email = "ada@code.org";
System.out.println(email.substring(0, email.indexOf("@")));`, 'ada'),
  X({ q: c`Read an email address and split it at the ~@~:

~ada@code.org~ →
~Username: ada~
~Domain: code.org~`, start: M(c`
        Scanner in = new Scanner(System.in);
        String email = in.nextLine();
`, 'java.util.Scanner'), tests: [{ in: 'ada@code.org\n', out: 'Username: ada\nDomain: code.org' }, { in: 'linus@kernel.io\n', out: 'Username: linus\nDomain: kernel.io' }], must: [[c`substring`, c`Use ~substring~.`]], hint: c`Find the position of ~@~ with ~indexOf~. The domain starts one after it.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        String email = in.nextLine();
        int at = email.indexOf("@");

        System.out.println("Username: " + email.substring(0, at));
        System.out.println("Domain: " + email.substring(at + 1));`, 'java.util.Scanner') }),
  X({ q: c`Read a first and last name on one line and print the initials in capitals:

~ada lovelace~ → ~A.L.~`, start: M(c`
        Scanner in = new Scanner(System.in);
        String name = in.nextLine();
`, 'java.util.Scanner'), tests: [{ in: 'ada lovelace\n', out: 'A.L.' }, { in: 'Grace Hopper\n', out: 'G.H.' }], hint: c`The second initial is the character just after the space: ~name.charAt(name.indexOf(" ") + 1)~. Make the whole name upper case first.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        String name = in.nextLine().toUpperCase();
        int space = name.indexOf(" ");

        System.out.println(name.charAt(0) + "." + name.charAt(space + 1) + ".");`, 'java.util.Scanner') }),
] },

{ id: 'ternary', title: 'The ternary operator', icon: '❓', desc: 'A whole if/else in one line.',
  v: [['2:35:19', '2:42:00', 'Ternary operator']],
  steps: [
  T('condition ? yes : no', c`When an if/else only chooses between two **values**, the ternary operator says it in one line.`, c`
int score = 72;

String result = score >= 50 ? "Pass" : "Fail";

// the same as:
String result2;
if (score >= 50) {
    result2 = "Pass";
} else {
    result2 = "Fail";
}`),
  P(c`
int t = 25;
System.out.println(t > 20 ? "Warm" : "Cold");`, 'Warm'),
  P(c`
int a = 4, b = 9;
int bigger = a > b ? a : b;
System.out.println(bigger);`, '9'),
  X({ q: c`Read a whole number and print ~even~ or ~odd~ — in one line, using the ternary operator.`, start: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
`, 'java.util.Scanner'), tests: [{ in: '4', out: 'even' }, { in: '7', out: 'odd' }], must: [[c`\?[^:]*:`, c`Use the ternary operator: ~condition ? a : b~.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(n % 2 == 0 ? "even" : "odd");`, 'java.util.Scanner') }),
] },
],
quiz: [
  P(c`System.out.println(Math.sqrt(49));`, '7.0'),
  P(c`System.out.println("hello".substring(1, 3));`, 'el', c`Positions 1 and 2. The end (3) is not included.`),
  P(c`System.out.println("Java".toUpperCase().charAt(3));`, 'A'),
  P(c`System.out.printf("%d items cost %.1f%n", 3, 7.25);`, '3 items cost 7.3'),
  Q(c`What does ~"cat".indexOf("z")~ return?`, ['0', '-1', 'null', 'An error'], 1),
  F('Pick the bigger number in one line.', c`
int a = 4, b = 9;
int max = a > b [[?]] a [[:]] b;`),
] });

/* ============ TOPIC 3: DECISIONS ============ */
topic({ id: 'decisions', title: 'Decisions', icon: '🔀', color: '#ff9600', blurb: 'Combine conditions, switch on values and build a calculator.',
lessons: [
{ id: 'logic', title: 'Logical operators', icon: '🧠', desc: 'and, or, not.',
  v: [['3:09:58', '3:21:23', 'Logical operators']],
  steps: [
  T('Combining conditions', c`~&&~ (and) is true only if **both** sides are. ~||~ (or) is true if **either** is. ~!~ (not) flips true and false.`, c`
int temp = 22;
boolean sunny = true;

if (temp > 15 && temp < 30) { ... }     // between 15 and 30
if (temp < 0 || temp > 40) { ... }      // extreme either way
if (!sunny) { ... }                      // not sunny`, c`Java stops as soon as it knows the answer: in ~a && b~, if ~a~ is false then ~b~ is never even checked.`),
  P(c`
int age = 16;
boolean hasTicket = true;
System.out.println(age >= 18 || hasTicket);
System.out.println(age >= 18 && hasTicket);`, 'true\nfalse'),
  P(c`System.out.println(!(5 > 3) || 2 == 2);`, 'true'),
  X({ q: c`Read a temperature. Print ~Go outside~ if it is from 15 to 30 (both included), otherwise ~Stay in~.`, start: M(c`
        Scanner in = new Scanner(System.in);
        int temp = in.nextInt();
`, 'java.util.Scanner'), tests: [{ in: '20', out: 'Go outside' }, { in: '15', out: 'Go outside' }, { in: '30', out: 'Go outside' }, { in: '10', out: 'Stay in' }, { in: '31', out: 'Stay in' }], must: [[c`&&`, c`Combine the two checks with ~&&~.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        int temp = in.nextInt();

        if (temp >= 15 && temp <= 30) {
            System.out.println("Go outside");
        } else {
            System.out.println("Stay in");
        }`, 'java.util.Scanner') }),
  X({ q: c`Read a username. It is ~Valid~ if it has 4 to 12 characters **and** no spaces; otherwise print ~Invalid~.`, start: M(c`
        Scanner in = new Scanner(System.in);
        String user = in.nextLine();
`, 'java.util.Scanner'), tests: [{ in: 'ada_99\n', out: 'Valid' }, { in: 'bo\n', out: 'Invalid' }, { in: 'ada lovelace\n', out: 'Invalid' }, { in: 'averyveryverylongname\n', out: 'Invalid' }], hint: c`~!user.contains(" ")~ is true when there is no space.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        String user = in.nextLine();

        if (user.length() >= 4 && user.length() <= 12 && !user.contains(" ")) {
            System.out.println("Valid");
        } else {
            System.out.println("Invalid");
        }`, 'java.util.Scanner') }),
] },

{ id: 'switch', title: 'switch', icon: '🎛️', desc: 'One value, many possible matches.',
  v: [['2:49:05', '2:57:42', 'Enhanced switch']],
  steps: [
  T('Matching a value', c`When you compare one value against many options, a **switch** is clearer than a ladder of ~else if~. Modern Java uses arrows, and one case can list several values.`, c`
String day = "Sat";

switch (day) {
    case "Sat", "Sun" -> System.out.println("Weekend!");
    case "Fri" -> System.out.println("Almost there");
    default -> System.out.println("Weekday");
}`, c`A switch can also **give back a value**:

~String kind = switch (day) { case "Sat", "Sun" -> "weekend"; default -> "weekday"; };~`),
  P(c`
int n = 3;
switch (n) {
    case 1 -> System.out.println("one");
    case 2, 3 -> System.out.println("two or three");
    default -> System.out.println("many");
}`, 'two or three'),
  P(c`
char grade = 'B';
String msg = switch (grade) {
    case 'A' -> "Excellent";
    case 'B', 'C' -> "Good";
    default -> "Keep going";
};
System.out.println(msg);`, 'Good'),
  X({ q: c`Read a day name. Print ~Weekend~ for Saturday or Sunday, ~Weekday~ for Monday–Friday, and ~Not a day~ for anything else. Use a switch.`, start: M(c`
        Scanner in = new Scanner(System.in);
        String day = in.nextLine();
`, 'java.util.Scanner'), tests: [{ in: 'Saturday\n', out: 'Weekend' }, { in: 'Monday\n', out: 'Weekday' }, { in: 'Friday\n', out: 'Weekday' }, { in: 'Funday\n', out: 'Not a day' }], must: [[c`\bswitch\b`, c`Use a ~switch~.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        String day = in.nextLine();

        switch (day) {
            case "Saturday", "Sunday" -> System.out.println("Weekend");
            case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" -> System.out.println("Weekday");
            default -> System.out.println("Not a day");
        }`, 'java.util.Scanner') }),
] },

{ id: 'calculator', title: 'Project: calculator', icon: '🧾', desc: 'Nested decisions in a real program.',
  v: [['2:03:47', '2:10:20', 'Nested if statements'], ['2:57:42', '3:09:58', 'Calculator program']],
  steps: [
  T('Decisions inside decisions', c`An ~if~ can sit inside another. Use it when a second question only makes sense once the first is answered.`, c`
if (isMember) {
    if (age >= 65) {
        discount = 0.3;
    } else {
        discount = 0.1;
    }
}`),
  P(c`
int x = 7;
if (x > 5) {
    if (x % 2 == 0) {
        System.out.println("big even");
    } else {
        System.out.println("big odd");
    }
} else {
    System.out.println("small");
}`, 'big odd'),
  X({ q: c`**Calculator.** Read a number, an operator (~+ - * /~) and another number, like ~8 * 2.5~, and print the result.

Dividing by zero prints ~Cannot divide by zero~; any other operator prints ~Unknown operator~.`, start: M(c`
        Scanner in = new Scanner(System.in);
        double a = in.nextDouble();
        char op = in.next().charAt(0);
        double b = in.nextDouble();
`, 'java.util.Scanner'), tests: [{ in: '8 * 2.5', out: '20.0' }, { in: '9 - 4', out: '5.0' }, { in: '7 / 2', out: '3.5' }, { in: '7 / 0', out: 'Cannot divide by zero' }, { in: '1 ^ 2', out: 'Unknown operator' }], must: [[c`\bswitch\b`, c`Use a ~switch~ on the operator.`]], hint: c`~switch (op) { case '+' -> ...; case '/' -> { if (b == 0) ... else ... } default -> ... }~`, sol: M(c`
        Scanner in = new Scanner(System.in);
        double a = in.nextDouble();
        char op = in.next().charAt(0);
        double b = in.nextDouble();

        switch (op) {
            case '+' -> System.out.println(a + b);
            case '-' -> System.out.println(a - b);
            case '*' -> System.out.println(a * b);
            case '/' -> {
                if (b == 0) {
                    System.out.println("Cannot divide by zero");
                } else {
                    System.out.println(a / b);
                }
            }
            default -> System.out.println("Unknown operator");
        }`, 'java.util.Scanner') }),
] },
],
quiz: [
  P(c`System.out.println(3 > 2 && 2 > 3);`, 'false'),
  P(c`System.out.println(!(1 == 1) || 4 >= 4);`, 'true'),
  Q(c`In a modern switch, how do you make one case match both "Sat" and "Sun"?`, [c`~case "Sat" || "Sun"~`, c`~case "Sat", "Sun"~`, c`~case "Sat" && "Sun"~`, 'You need two switches'], 1),
  P(c`
int n = 0;
String s = switch (n) { case 0 -> "zero"; default -> "other"; };
System.out.println(s);`, 'zero'),
  F('Between 1 and 10, inclusive.', c`
int n = 7;
if (n >= 1 [[&&]] n <= 10) { }`),
] });

/* ============ TOPIC 4: LOOPS ============ */
topic({ id: 'loops', title: 'Loops', icon: '🔁', color: '#ce82ff', blurb: 'while, do-while, for, nested loops — and a guessing game.',
lessons: [
{ id: 'while', title: 'while and do-while', icon: '🔄', desc: 'Repeat until something changes.',
  v: [['3:21:23', '3:33:47', 'While loops']],
  steps: [
  T('while', c`A **while** loop repeats its block as long as the condition is true. Something inside must eventually make it false, or the loop never ends.`, c`
int lives = 3;
while (lives > 0) {
    System.out.println("Lives: " + lives);
    lives--;                    // without this: an infinite loop
}`),
  T('do-while', c`A **do-while** checks the condition at the **end**, so its block always runs at least once. Perfect for "ask until the answer is valid".`, c`
int n;
do {
    System.out.print("Pick 1-10: ");
    n = in.nextInt();
} while (n < 1 || n > 10);`),
  P(c`
int n = 1;
while (n < 50) {
    n = n * 3;
}
System.out.println(n);`, '81', c`1 → 3 → 9 → 27 → 81, and 81 is not below 50, so the loop stops.`),
  P(c`
int x = 10;
do {
    System.out.println(x);
} while (x < 5);`, '10', c`The condition is false, but a do-while runs once before checking.`),
  X({ q: c`Read whole numbers until a ~0~ is entered, then print their sum.

~5 3 2 0~ → ~10~`, start: M(c`
        Scanner in = new Scanner(System.in);
`, 'java.util.Scanner'), tests: [{ in: '5 3 2 0', out: '10' }, { in: '0', out: '0' }, { in: '100 -40 0', out: '60' }], must: [[c`\bwhile\b`, c`Use a ~while~ loop.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        int sum = 0;
        int n = in.nextInt();
        while (n != 0) {
            sum += n;
            n = in.nextInt();
        }
        System.out.println(sum);`, 'java.util.Scanner') }),
  X({ q: c`Keep reading numbers until one is between 1 and 10, then print ~Accepted: 7~ (with that number). Use a **do-while**.`, start: M(c`
        Scanner in = new Scanner(System.in);
`, 'java.util.Scanner'), tests: [{ in: '0 15 7', out: 'Accepted: 7' }, { in: '3', out: 'Accepted: 3' }], must: [[c`\bdo\s*\{`, c`Use a ~do { ... } while (...);~ loop.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        int n;
        do {
            n = in.nextInt();
        } while (n < 1 || n > 10);
        System.out.println("Accepted: " + n);`, 'java.util.Scanner') }),
] },

{ id: 'for', title: 'for loops', icon: '🔢', desc: 'Counting loops.',
  v: [['3:43:33', '3:53:33', 'For loops']],
  steps: [
  T('Start, check, step', c`When you know how many times to repeat, a **for** loop keeps all the counting in one line.`, c`
for (int i = 1; i <= 5; i++) {
    System.out.println("Round " + i);
}
//   start      check     step
//   int i = 1  i <= 5    i++

for (int i = 10; i > 0; i -= 2) { ... }   // 10 8 6 4 2`),
  P(c`
int total = 0;
for (int i = 1; i <= 4; i++) {
    total += i;
}
System.out.println(total);`, '10'),
  P(c`
for (int i = 0; i < 10; i += 3) {
    System.out.print(i + " ");
}`, '0 3 6 9'),
  X({ q: c`Read a number and print its times table from 1 to 10:

~7 x 1 = 7~
~7 x 2 = 14~
…
~7 x 10 = 70~`, start: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
`, 'java.util.Scanner'), tests: [{ in: '7', has: ['7 x 1 = 7\n7 x 2 = 14', '7 x 10 = 70'] }, { in: '3', has: ['3 x 4 = 12', '3 x 10 = 30'] }], must: [[c`\bfor\s*\(`, c`Use a ~for~ loop.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + n * i);
        }`, 'java.util.Scanner') }),
  X({ q: c`Read ~n~ and print ~n!~ (n factorial: ~1 × 2 × … × n~). For ~20~ the answer is ~2432902008176640000~ — far too big for an ~int~, so use a ~long~.`, start: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
`, 'java.util.Scanner'), tests: [{ in: '5', out: '120' }, { in: '20', out: '2432902008176640000' }], must: [[c`\blong\b`, c`Store the result in a ~long~.`]], hint: c`An ~int~ tops out at about 2.1 billion. ~long result = 1;~ goes up to about 9 quintillion.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        System.out.println(result);`, 'java.util.Scanner') }),
] },

{ id: 'nested', title: 'break, continue & nesting', icon: '🪆', desc: 'Leave early, skip a round, loop inside loops.',
  v: [['3:53:33', '3:55:45', 'Break & continue'], ['3:55:45', '4:04:27', 'Nested loops']],
  steps: [
  T('break and continue', c`~break~ leaves the loop immediately. ~continue~ skips the rest of this round and moves to the next.`, c`
for (int i = 1; i <= 10; i++) {
    if (i == 3) continue;     // skip 3
    if (i == 6) break;        // stop at 6
    System.out.print(i + " ");
}
// 1 2 4 5`),
  T('Loops inside loops', c`A loop inside another runs **completely** for every round of the outer one. Great for grids and tables.`, c`
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 4; col++) {
        System.out.print("#");
    }
    System.out.println();
}
// ####
// ####
// ####`),
  P(c`
for (int i = 1; i <= 5; i++) {
    if (i % 2 == 0) continue;
    System.out.print(i);
}`, '135'),
  P(c`
int count = 0;
for (int a = 0; a < 3; a++) {
    for (int b = 0; b < 4; b++) {
        count++;
    }
}
System.out.println(count);`, '12'),
  X({ q: c`Read ~n~ and print a triangle of stars with ~n~ rows:

~*~
~**~
~***~`, start: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
`, 'java.util.Scanner'), tests: [{ in: '3', out: '*\n**\n***' }, { in: '5', out: '*\n**\n***\n****\n*****' }], sol: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int row = 1; row <= n; row++) {
            for (int i = 0; i < row; i++) {
                System.out.print("*");
            }
            System.out.println();
        }`, 'java.util.Scanner') }),
  X({ q: c`Read ~n~ and print every **prime** number up to ~n~, separated by spaces. (A prime can only be divided evenly by 1 and itself.)

~20~ → ~2 3 5 7 11 13 17 19~`, start: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
`, 'java.util.Scanner'), tests: [{ in: '20', out: '2 3 5 7 11 13 17 19' }, { in: '2', out: '2' }], must: [[c`\bbreak\b`, c`Use ~break~ to stop checking once you find a divisor.`]], hint: c`For each number, try dividing by 2, 3, … up to the number itself. As soon as one divides evenly, it is not prime: ~break~.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        for (int num = 2; num <= n; num++) {
            boolean prime = true;
            for (int d = 2; d * d <= num; d++) {
                if (num % d == 0) {
                    prime = false;
                    break;
                }
            }
            if (prime) System.out.print(num + " ");
        }
        System.out.println();`, 'java.util.Scanner') }),
] },

{ id: 'game', title: 'Project: guessing game', icon: '🎯', desc: 'A loop, decisions and a counter.',
  v: [['3:33:47', '3:43:33', 'Number guessing game']],
  steps: [
  T('Putting loops to work', c`A real game normally picks its secret number with ~new Random().nextInt(1, 101)~. To make the tests repeatable, this one always hides **42**.`),
  X({ q: c`**Guessing game.** The secret number is ~42~. Read guesses until the player gets it. For each wrong guess print ~Too high~ or ~Too low~; when they are right, print ~Correct! 3 guesses~ (with the real count).`, start: M(c`
        Scanner in = new Scanner(System.in);
        int secret = 42;
`, 'java.util.Scanner'), tests: [{ in: '50 30 42', out: 'Too high\nToo low\nCorrect! 3 guesses' }, { in: '42', out: 'Correct! 1 guesses' }], hint: c`Count every guess. Loop ~while (guess != secret)~ — or use ~do-while~ so the first guess is read inside the loop.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        int secret = 42;
        int guesses = 0;
        int guess;
        do {
            guess = in.nextInt();
            guesses++;
            if (guess > secret) {
                System.out.println("Too high");
            } else if (guess < secret) {
                System.out.println("Too low");
            }
        } while (guess != secret);
        System.out.println("Correct! " + guesses + " guesses");`, 'java.util.Scanner') }),
] },
],
quiz: [
  P(c`
int i = 0;
while (i < 3) {
    System.out.print(i);
    i++;
}`, '012'),
  P(c`
for (int i = 5; i > 0; i -= 2) {
    System.out.print(i + " ");
}`, '5 3 1'),
  Q(c`Which loop always runs its body at least once?`, ['for', 'while', 'do-while', 'none of them'], 2),
  P(c`
for (int i = 1; i <= 10; i++) {
    if (i == 4) break;
    System.out.print(i);
}`, '123'),
  F('Count from 1 to 5.', c`for (int i = 1; i [[<=]] 5; [[i++]]) { }`),
] });

/* ============ TOPIC 5: METHODS ============ */
topic({ id: 'methods', title: 'Methods', icon: '🧩', color: '#2b70c9', blurb: 'Write a piece of code once and use it everywhere.',
lessons: [
{ id: 'basics', title: 'Writing methods', icon: '🔧', desc: 'Parameters, return values and void.',
  v: [['4:04:27', '4:19:51', 'Methods']],
  steps: [
  T('Your own methods', c`A **method** is a named block of code. It sits inside the class, next to ~main~ (not inside it). ~static~ lets ~main~ call it directly.`, c`
public class Main {

    static int square(int n) {        // returns an int, takes an int
        return n * n;
    }

    static void greet(String name) {  // void: returns nothing
        System.out.println("Hi " + name);
    }

    public static void main(String[] args) {
        greet("Ada");
        System.out.println(square(7));    // 49
    }
}`, c`The type before the name is what the method **returns**. Values passed in are **arguments**; the variables that receive them are **parameters**.`),
  P(c`
public class Main {
    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        System.out.println(add(2, 3) * add(1, 1));
    }
}`, '10'),
  P(c`
public class Main {
    static boolean isAdult(int age) {
        return age >= 18;
    }
    public static void main(String[] args) {
        System.out.println(isAdult(20) + " " + isAdult(12));
    }
}`, 'true false'),
  Q(c`What does ~void~ mean in ~static void greet(String name)~?`, ['The method takes no parameters', 'The method returns nothing', 'The method is empty', 'The method is private'], 1),
  X({ q: c`Write ~static double toCelsius(double f)~ using ~C = (F - 32) × 5 / 9~. ~main~ already reads a temperature and prints it with one decimal.`, start: c`import java.util.Scanner;

public class Main {

    // write toCelsius here

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        double f = in.nextDouble();
        System.out.printf("%.1f%n", toCelsius(f));
    }
}
`, tests: [{ in: '212', out: '100.0' }, { in: '50', out: '10.0' }, { in: '98.6', out: '37.0' }], must: [[c`static\s+double\s+toCelsius\s*\(\s*double`, c`Write ~static double toCelsius(double f)~.`]], sol: c`import java.util.Scanner;

public class Main {

    static double toCelsius(double f) {
        return (f - 32) * 5 / 9;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        double f = in.nextDouble();
        System.out.printf("%.1f%n", toCelsius(f));
    }
}
` }),
  X({ q: c`Write ~static boolean isPalindrome(String word)~ that returns ~true~ if the word reads the same backwards (ignore upper/lower case). ~main~ prints the result.`, start: c`import java.util.Scanner;

public class Main {

    // write isPalindrome here

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String word = in.nextLine();
        System.out.println(isPalindrome(word));
    }
}
`, tests: [{ in: 'Racecar\n', out: 'true' }, { in: 'level\n', out: 'true' }, { in: 'java\n', out: 'false' }], must: [[c`static\s+boolean\s+isPalindrome`, c`Write ~static boolean isPalindrome(String word)~.`]], hint: c`Compare the first and last letters, then the second and second-last… Or build the reversed word in a loop and use ~equalsIgnoreCase~.`, sol: c`import java.util.Scanner;

public class Main {

    static boolean isPalindrome(String word) {
        String w = word.toLowerCase();
        for (int i = 0; i < w.length() / 2; i++) {
            if (w.charAt(i) != w.charAt(w.length() - 1 - i)) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String word = in.nextLine();
        System.out.println(isPalindrome(word));
    }
}
` }),
] },

{ id: 'overloading', title: 'Overloading', icon: '🎭', desc: 'One name, different parameters.',
  v: [['4:19:51', '4:25:59', 'Overloaded methods']],
  steps: [
  T('Same name, different inputs', c`Methods can share a name if their **parameters** differ (in number or type). Java picks the one that matches the arguments. ~println~ itself is overloaded: it has versions for ints, doubles, Strings and more.`, c`
static int add(int a, int b)            { return a + b; }
static int add(int a, int b, int c)     { return a + b + c; }
static double add(double a, double b)   { return a + b; }

add(1, 2)        // 3      the first one
add(1, 2, 3)     // 6      the second
add(1.5, 2.0)    // 3.5    the third`),
  P(c`
public class Main {
    static String describe(int n)    { return "int " + n; }
    static String describe(String s) { return "text " + s; }
    public static void main(String[] args) {
        System.out.println(describe("7") + ", " + describe(7));
    }
}`, 'text 7, int 7'),
  X({ q: c`Write two methods called ~area~: ~area(double r)~ for a circle (~π × r²~) and ~area(double w, double h)~ for a rectangle. The program should print ~3.14~ and ~6.00~.`, start: c`public class Main {

    // write the two area methods here

    public static void main(String[] args) {
        System.out.printf("%.2f%n", area(1));
        System.out.printf("%.2f%n", area(2, 3));
    }
}
`, tests: [{ out: '3.14\n6.00' }], must: [[c`area\s*\(\s*double\s+\w+\s*\)`, c`Write ~area(double r)~.`], [c`area\s*\(\s*double\s+\w+\s*,\s*double`, c`Write ~area(double w, double h)~.`]], sol: c`public class Main {

    static double area(double r) {
        return Math.PI * r * r;
    }

    static double area(double w, double h) {
        return w * h;
    }

    public static void main(String[] args) {
        System.out.printf("%.2f%n", area(1));
        System.out.printf("%.2f%n", area(2, 3));
    }
}
` }),
] },

{ id: 'scope', title: 'Scope', icon: '🔭', desc: 'Where a variable lives — and dies.',
  v: [['4:25:59', '4:31:00', 'Variable scope']],
  steps: [
  T('Inside the braces', c`A variable exists from where it is declared to the end of its ~{ }~ block. A method's variables are **local**: other methods cannot see them, and each call gets fresh copies.

A ~static~ variable declared in the class (outside any method) is shared by every method.`, c`
public class Main {
    static int score = 0;            // class-level: every method sees it

    static void addPoints() {
        int bonus = 5;               // local to addPoints
        score += bonus;
    }

    public static void main(String[] args) {
        addPoints();
        addPoints();
        System.out.println(score);   // 10
        // System.out.println(bonus);   error: bonus does not exist here
    }
}`),
  P(c`
public class Main {
    static void change(int x) {
        x = 99;
    }
    public static void main(String[] args) {
        int x = 1;
        change(x);
        System.out.println(x);
    }
}`, '1', c`The method gets a **copy** of the number. Changing its copy does not touch ~main~'s ~x~.`),
  P(c`
public class Main {
    static int count = 0;
    static void tick() { count++; }
    public static void main(String[] args) {
        for (int i = 0; i < 4; i++) tick();
        System.out.println(count);
    }
}`, '4'),
  Q(c`A variable declared inside a ~for~ loop's braces can be used…`, ['anywhere in the class', 'anywhere in the method', 'only inside that loop', 'only in main'], 2),
] },
],
quiz: [
  P(c`
public class Main {
    static int twice(int n) { return n * 2; }
    public static void main(String[] args) {
        System.out.println(twice(twice(3)));
    }
}`, '12'),
  Q(c`Which method signature returns a whole number?`, [c`~static void total()~`, c`~static int total()~`, c`~static String total()~`, c`~static total()~`], 1),
  Q(c`Two methods with the same name but different parameters are…`, ['an error', 'overloaded', 'overridden', 'static'], 1),
  F('Return the bigger value.', c`
static int bigger(int a, int b) {
    [[return]] a > b ? a : b;
}`, null, 1),
] });
