/* ================= Java =================
   One path for everyone: it starts from the very first line of code.  preview: true = the course is still being written.
   Programs are compiled with javac and run with java. The class that holds main() can have any name:
   javafix.js makes that work from a single file, locally and on the online compiler.
   M(body, 'java.util.Scanner') wraps statements in a complete program; extra arguments are imports. */
course('java', {
  name: 'Java', badge: 'Jv', logo: 'logos/java.svg', color: '#e2573b', video: 'xTtL8E4LzTQ', glossTry: 'Scanner', tool: 'the JDK (javac)', showErr: true, preview: true,
  tagline: 'Taught in schools and universities everywhere, and behind Android apps and big business systems.',
  blank: 'public class Main {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  wandbox: { compiler: 'openjdk-jdk-22+36' },
  prep: code => window.javaFix.prep(code),
  wrap: (body, imports) => imports.map(i => 'import ' + i + ';\n').join('') + (imports.length ? '\n' : '') + 'public class Main {\n    public static void main(String[] args) {\n' + body + '\n    }\n}\n',
});

G('class', c`The container all Java code lives in. Every program needs at least one: ~public class Main { ... }~`);
G('main method', c`Where a Java program starts: ~public static void main(String[] args)~. Learn it as a phrase for now.`);
G('System.out.println()', c`Prints a value and then starts a new line. ~System.out.print()~ does the same without the new line.`);
G('statement', c`One instruction, ended with a semicolon ~;~.`);
G('comment', c`Text the compiler ignores: ~// to the end of the line~ or ~/* between these */~.`);
G('compiler', c`~javac~ translates your whole file before anything runs. One mistake and you get no program at all.`);
G('variable', c`A named box with a fixed type: ~int lives = 3;~`);
G('int', c`A whole number. Dividing two ints throws away the remainder: ~7 / 2~ is ~3~.`);
G('double', c`A decimal number: ~3.14~. Make one side of a division a double to keep the decimals.`);
G('boolean', c`~true~ or ~false~.`);
G('char', c`A single character in single quotes: ~'A'~.`);
G('String', c`Text in double quotes: ~"hello"~. Capital S, because it is a class rather than a basic type.`);
G('concatenation', c`Joining text with ~+~: ~"Score: " + 10~ gives ~"Score: 10"~.`);
G('Scanner', c`Reads typed input: ~Scanner in = new Scanner(System.in);~ then ~in.nextInt()~, ~in.nextDouble()~ or ~in.nextLine()~.`);
G('import', c`Brings a class from Java's library into your file: ~import java.util.Scanner;~`);
G('remainder (%)', c`What is left after dividing: ~7 % 2~ is ~1~.`);
G('condition', c`An expression that is ~true~ or ~false~, used by ~if~.`);
G('.equals()', c`Compares the **contents** of two strings: ~name.equals("Ada")~. Never use ~==~ for strings.`);
G('exception', c`An error while the program runs, such as dividing a whole number by zero. If nothing catches it, the program stops.`);

/* ============ TOPIC 1: FIRST STEPS ============ */
topic({ id: 'first', title: 'First Steps', icon: '🌱', color: '#58cc02', blurb: 'Print, store, calculate, ask and decide.',
lessons: [
{ id: 'hello', title: 'Your first program', icon: '🚀', desc: 'A class, a main method and the semicolon that will haunt you.',
  v: [['0:00:00', '0:10:58', 'Introduction to Java']],
  steps: [
  T('Why Java?', c`Java runs Android apps, banking systems and Minecraft, and it is the first language at countless schools and universities. It is strict — which means the compiler catches a lot of your mistakes before the program ever runs.

This is a complete Java program:`, c`
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`, c`It looks like a lot for one line of output. Only the middle line is *your* code; the rest is a wrapper you will write the same way every time.`),
  T('The three parts', c`~public class Main { ... }~ — all Java code lives inside a **class**. Think of it as the file's container.

~public static void main(String[] args) { ... }~ — the **main method**. Java starts running here. Treat it as a magic phrase for now; every word gets explained later in the course.

~System.out.println("...");~ — print a line. Note the semicolon: every statement ends with one.`),
  Q('Where does a Java program start running?', ['At the first line of the file', c`In the ~main~ method`, c`At ~public class~`, 'At the first print statement'], 1),
  P(c`
System.out.print("A");
System.out.println("B");
System.out.println("C");`, 'AB\nC', c`~print~ stays on the same line; ~println~ ("print line") moves to a new line afterwards.`),
  F('Rebuild Hello World.', c`
public [[class]] Main {
    public static void [[main]](String[] args) {
        System.out.[[println]]("Hello, World!");
    }
}`),
  O('Put the lines of a complete program in order.', c`
public class Main {
    public static void main(String[] args) {
        System.out.println("It works!");
    }
}`),
  X({ q: c`Your turn. Make the program print exactly: ~I am learning Java!~`, start: M(c`
        // your code goes here`), tests: [{ out: 'I am learning Java!' }], hint: c`~System.out.println("text goes here");~ — and don't forget the semicolon.`, sol: M(c`
        System.out.println("I am learning Java!");`) }),
  X({ q: c`Three bugs. Press **Run**, read the **first** error, fix it, repeat — that loop is how real Java gets written.

Expected output:

~Mission control~
~Lift off!~`, start: c`public class Main {
    public static void main(String[] args) {
        System.out.println("Mission control")
        system.out.println("Lift off!);
    }
}
`, tests: [{ out: 'Mission control\nLift off!' }], hint: c`A missing semicolon, a missing quote, and Java is case-sensitive: it is ~System~, not ~system~.`, sol: M(c`
        System.out.println("Mission control");
        System.out.println("Lift off!");`) }),
] },

{ id: 'variables', title: 'Variables & types', icon: '📦', desc: 'int, double, boolean, char, String — and the division trap.',
  v: [['0:10:58', '0:31:30', 'Variables'], ['0:54:08', '1:02:29', 'Arithmetic']],
  steps: [
  T('A box with a type', c`A variable is a named box. In Java every box has a **type** that never changes, and the compiler checks you only put the right kind of thing in it.`, c`
int lives = 3;            // whole numbers
double price = 19.99;     // decimals
boolean online = true;    // true or false
char grade = 'A';         // ONE character, single quotes
String name = "Ada";      // text, double quotes, capital S`),
  Q('Which type fits a price like 19.99?', [c`~int~`, c`~double~`, c`~boolean~`, c`~char~`], 1, c`~int~ cannot hold the decimals. Use ~double~.`),
  F('Pick the right type for each value.', c`
[[int]] age = 21;
[[String]] city = "Dublin";
[[boolean]] raining = false;`),
  P(c`
int x = 5;
x = x + 2;
x = x * 2;
System.out.println(x);`, '14', c`~=~ means "work out the right side, then store it". 5 → 7 → 14.`),
  T('Joining text and numbers', c`~+~ adds numbers, but with a String it **joins**. Java works left to right, which leads to a famous surprise:`, c`
String name = "Ada";
int age = 36;
System.out.println(name + " is " + age);   // Ada is 36

System.out.println("Total: " + 1 + 2);     // Total: 12   (joined, left to right)
System.out.println("Total: " + (1 + 2));   // Total: 3    (brackets first)`),
  P(c`System.out.println(1 + 2 + "a");`, '3a', c`Left to right: 1 + 2 is 3 (both numbers), then 3 + "a" joins.`),
  P(c`System.out.println(7 / 2);`, '3', c`**Integer division.** Two ints in, an int out: the .5 is thrown away, not rounded.`),
  P(c`System.out.println(7 / 2.0);`, '3.5', c`Make one side a ~double~ and the decimals survive.`),
  X({ q: c`Print a receipt line using all three variables:

~3 x Pizza = 25.5~`, start: M(c`
        String item = "Pizza";
        double price = 8.5;
        int qty = 3;
`), tests: [{ out: '3 x Pizza = 25.5' }], not: [['"3 x Pizza', 'Build the line from the variables — no hard-coding.']], hint: c`~System.out.println(qty + " x " + item + " = " + price * qty);~`, sol: M(c`
        String item = "Pizza";
        double price = 8.5;
        int qty = 3;

        System.out.println(qty + " x " + item + " = " + price * qty);`) }),
  X({ q: c`This should print ~Average: 7.5~ but prints ~Average: 7.0~. Find the trap and fix it.`, start: M(c`
        int a = 7, b = 8;
        double average = (a + b) / 2;
        System.out.println("Average: " + average);`), tests: [{ out: 'Average: 7.5' }], not: [['"Average: 7\\.5', 'Fix the calculation, not the message.']], hint: c`int / int = int, and the damage is done **before** the result is stored in the double. Try ~2.0~.`, sol: M(c`
        int a = 7, b = 8;
        double average = (a + b) / 2.0;
        System.out.println("Average: " + average);`) }),
] },

{ id: 'input', title: 'Reading input', icon: '⌨️', desc: 'The Scanner, and the trap that catches every beginner.',
  v: [['0:31:30', '0:47:25', 'User input']],
  steps: [
  T('Meet the Scanner', c`To read what the user types, Java uses a **Scanner**. It lives in Java's library, so you ~import~ it at the very top of the file.`, c`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);

        System.out.print("How old are you? ");
        int age = in.nextInt();

        System.out.println("Next year you will be " + (age + 1));
    }
}`, c`~nextInt()~ reads a whole number, ~nextDouble()~ a decimal, ~next()~ one word and ~nextLine()~ a whole line.`),
  Q(c`Which line makes the Scanner available in your file?`, [c`~import java.util.Scanner;~`, c`~#include <Scanner>~`, c`~using Scanner;~`, c`~Scanner.load();~`], 0),
  F('Read a whole number and a decimal.', c`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int count = in.[[nextInt]]();
        double price = in.[[nextDouble]]();
        System.out.println(count * price);
    }
}`),
  X({ q: c`Read the user's age and print:

~In 10 years you will be 30.~

(In the tests, the typed input is supplied automatically.)`, start: M(c`
        Scanner in = new Scanner(System.in);
`, 'java.util.Scanner'), tests: [{ in: '20', has: ['In 10 years you will be 30.'] }, { in: '41', has: ['In 10 years you will be 51.'] }], hint: c`~int age = in.nextInt();~ then print ~age + 10~ — in brackets, or it gets joined as text.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        int age = in.nextInt();
        System.out.println("In 10 years you will be " + (age + 10) + ".");`, 'java.util.Scanner') }),
  T('The nextLine trap', c`~nextInt()~ reads the number but leaves the **Enter key** behind. If you then call ~nextLine()~, it reads that leftover Enter and returns an empty line.

The fix: call ~nextLine()~ once to throw the leftover away.`, c`
int age = in.nextInt();
in.nextLine();                    // clear the leftover Enter
String name = in.nextLine();      // now this really waits for a line`),
  Q(c`After ~in.nextInt()~, why might ~in.nextLine()~ return an empty string?`, ['The Scanner is broken', 'It reads the Enter key left over from the number', 'nextLine only works once', 'Strings cannot be read after numbers'], 1),
  X({ q: c`Read an age (a number) and then a full name (which may contain spaces). Print:

~Ada Lovelace is 36~`, start: M(c`
        Scanner in = new Scanner(System.in);
        int age = in.nextInt();
        String name = in.nextLine();

        System.out.println(name + " is " + age);`, 'java.util.Scanner'), tests: [{ in: '36\nAda Lovelace\n', has: ['Ada Lovelace is 36'] }, { in: '54\nLinus Torvalds\n', has: ['Linus Torvalds is 54'] }], hint: c`Add ~in.nextLine();~ between reading the number and reading the name.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        int age = in.nextInt();
        in.nextLine();
        String name = in.nextLine();

        System.out.println(name + " is " + age);`, 'java.util.Scanner') }),
] },

{ id: 'if', title: 'Decisions', icon: '🚦', desc: 'if, else — and why == lies about strings.',
  v: [['1:09:00', '1:22:28', 'If statements']],
  steps: [
  T('Choosing a path', c`An ~if~ runs its block only when the condition is true. Java checks from the top and runs the **first** branch that matches.`, c`
int temp = 31;

if (temp > 30) {
    System.out.println("Too hot");
} else if (temp > 15) {
    System.out.println("Nice");
} else {
    System.out.println("Too cold");
}`, c`Compare numbers with ~==~ ~!=~ ~<~ ~>~ ~<=~ ~>=~.`),
  P(c`
int score = 85;
if (score >= 50) {
    System.out.println("D");
} else if (score >= 80) {
    System.out.println("A");
}`, 'D', c`85 >= 50 is true, so the first branch wins and the rest are skipped. Check the strictest condition first.`),
  F('Adults are 18 or over.', c`
int age = 20;
if (age [[>=]] 18) {
    System.out.println("Adult");
} [[else]] {
    System.out.println("Minor");
}`),
  T('Comparing strings', c`For numbers, ~==~ is right. For **strings** it is a trap: ~==~ asks "are these the very same object in memory?", not "do they contain the same letters?".

Compare text with ~.equals()~:`, c`
String answer = in.nextLine();

if (answer.equals("yes")) {        // compares the letters
    System.out.println("Great!");
}`, c`~==~ on strings sometimes appears to work, which is exactly what makes this bug so nasty.`),
  Q('How do you check whether two Strings contain the same text?', [c`~a == b~`, c`~a.equals(b)~`, c`~a = b~`, c`~equals(a, b)~`], 1),
  X({ q: c`Read an age and print exactly one word:

under 13 → ~Child~ · under 20 → ~Teen~ · under 65 → ~Adult~ · otherwise ~Senior~`, start: M(c`
        Scanner in = new Scanner(System.in);
        int age = in.nextInt();
`, 'java.util.Scanner'), tests: [{ in: '8', out: 'Child' }, { in: '13', out: 'Teen' }, { in: '30', out: 'Adult' }, { in: '65', out: 'Senior' }], hint: c`Start with ~if (age < 13)~ and work upwards with ~else if~.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        int age = in.nextInt();

        if (age < 13) {
            System.out.println("Child");
        } else if (age < 20) {
            System.out.println("Teen");
        } else if (age < 65) {
            System.out.println("Adult");
        } else {
            System.out.println("Senior");
        }`, 'java.util.Scanner') }),
  X({ q: c`Read a password. Print ~Welcome~ if it is ~opensesame~, otherwise ~Access denied~.

Use the right way to compare strings.`, start: M(c`
        Scanner in = new Scanner(System.in);
        String password = in.nextLine();
`, 'java.util.Scanner'), tests: [{ in: 'opensesame\n', out: 'Welcome' }, { in: 'letmein\n', out: 'Access denied' }], must: [[c`\.equals\s*\(`, c`Compare strings with ~.equals()~, not ~==~.`]], hint: c`~if (password.equals("opensesame"))~`, sol: M(c`
        Scanner in = new Scanner(System.in);
        String password = in.nextLine();

        if (password.equals("opensesame")) {
            System.out.println("Welcome");
        } else {
            System.out.println("Access denied");
        }`, 'java.util.Scanner') }),
] },
],
quiz: [
  P(c`System.out.println(9 / 2);`, '4', c`Integer division: the remainder is dropped.`),
  Q(c`Which type holds ~true~ or ~false~?`, [c`~int~`, c`~String~`, c`~boolean~`, c`~char~`], 2),
  P(c`System.out.println("Sum: " + 2 + 3);`, 'Sum: 23', c`Left to right: once a String is involved, ~+~ joins.`),
  Q(c`What does ~System.out.print~ do differently from ~System.out.println~?`, ['It prints in a different colour', 'It does not start a new line afterwards', 'It only prints numbers', 'Nothing'], 1),
  P(c`System.out.println(10 % 4);`, '2'),
  Q('Which method reads a whole number from a Scanner?', [c`~nextInt()~`, c`~nextLine()~`, c`~readInt()~`, c`~getNumber()~`], 0),
  F('Compare the text properly.', c`
String word = "yes";
if (word.[[equals]]("yes")) {
    System.out.println("Match");
}`),
] });
