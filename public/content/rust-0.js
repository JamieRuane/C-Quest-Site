/* ================= Rust =================
   One path for everyone: it starts from the very first line of code.
   Rust has no compiler on most learners' machines, so it always runs on the online compiler (Wandbox), like Go.

   rustProgram(top, body) builds a complete program: exactly the "use" lines the code needs, any top-level
   items (functions, structs, enums, traits), then body inside fn main(). M(body) uses it. */
(function () {
  const USES = [
    [/\bHashMap\b/, 'std::collections::HashMap'], [/\bHashSet\b/, 'std::collections::HashSet'], [/\bBTreeMap\b/, 'std::collections::BTreeMap'],
    [/\bio::/, 'std::io'], [/\bfmt::/, 'std::fmt'], [/\bOrdering::/, 'std::cmp::Ordering'], [/\bParseIntError\b/, 'std::num::ParseIntError'],
  ];
  window.rustProgram = (top, body) => {
    const all = top + '\n' + body, code = all.replace(/"(?:\\.|[^"\\])*"|\/\/[^\n]*/g, '""');   // ignore strings and comments
    const uses = USES.filter(([re, path]) => re.test(code) && !all.includes('use ' + path)).map(([, path]) => `use ${path};\n`).join('');
    return (uses ? uses + '\n' : '') + (top.trim() ? top.trim() + '\n\n' : '') + 'fn main() {\n' + body + '\n}\n';
  };
})();

course('rust', {
  name: 'Rust', badge: 'Rs', logo: 'logos/rust.svg', color: '#f74c00', glossTry: 'borrow', tool: 'the Rust compiler', online: true, showErr: true,
  tagline: 'As fast as C++, but the compiler catches memory bugs before your program ever runs. Voted the most-admired language year after year.',
  blank: 'fn main() {\n    println!("Hello, Rust!");\n}\n',
  wandbox: { compiler: 'rust-1.82.0', 'compiler-option-raw': '--edition=2021' },
  wrap: body => window.rustProgram('', body),
});

G('fn main()', c`Where a Rust program starts.`);
G('macro', c`Code that writes code. Its name ends in ~!~: ~println!~, ~format!~, ~vec!~, ~panic!~.`);
G('println!', c`Prints a line. ~{}~ placeholders are filled with the values that follow: ~println!("{} has {} lives", name, lives)~.`);
G('let', c`Makes a variable: ~let lives = 3;~ Variables cannot change unless you add ~mut~.`);
G('mut', c`Short for mutable: ~let mut score = 0;~ lets ~score~ change later.`);
G('shadowing', c`Making a new variable with the same name: ~let x = x * 2;~ The old one is hidden, not changed.`);
G('i32 / u32 / f64', c`Number types: ~i32~ whole numbers (can be negative), ~u32~ whole numbers from 0 up, ~f64~ decimals. ~usize~ is used for lengths and indexes.`);
G('as', c`Converts between number types: ~qty as f64~.`);
G('{:?}', c`The **Debug** placeholder. Prints vectors, Options and structs that have ~#[derive(Debug)]~.`);
G('format!', c`Like ~println!~, but gives back the text as a ~String~ instead of printing it.`);
G('read_line', c`~io::stdin().read_line(&mut s)~ reads one line of input (including its new line) into the String ~s~.`);
G('parse', c`Turns text into a number: ~"42".parse::<i32>()~. It returns a ~Result~, because the text might not be a number.`);
G('unwrap', c`Takes the value out of an ~Option~ or ~Result~, and **crashes** (panics) if there is none. Fine for quick programs; handle errors properly in real ones.`);
G('expression', c`Code that produces a value. In Rust, ~if~, ~match~ and blocks are expressions: ~let kind = if n > 0 { "positive" } else { "not" };~`);
G('loop / while / for', c`~loop~ repeats forever (until ~break~), ~while~ repeats while a condition holds, ~for x in 0..5~ walks through a range or collection.`);
G('range', c`~0..5~ is 0, 1, 2, 3, 4. ~0..=5~ includes the 5.`);
G('match', c`Compares a value against patterns and runs the first that fits. It must cover **every** possible value; ~_~ means "anything else".`);
G('ownership', c`Every value has exactly one owner. When the owner goes out of scope, the value is freed. No garbage collector, no manual ~free~.`);
G('move', c`Giving a value to a new owner: ~let b = a;~ For a String, ~a~ can no longer be used afterwards.`);
G('Copy', c`Simple values (numbers, ~bool~, ~char~) are copied instead of moved, so the original stays usable.`);
G('clone', c`Makes a full, independent copy of a value: ~let b = a.clone();~`);
G('borrow', c`Using a value without taking ownership, through a reference: ~&name~ (read only) or ~&mut name~ (allowed to change it).`);
G('reference', c`A borrowed pointer to a value: ~&x~ or ~&mut x~. ~*r~ follows it to the value.`);
G('borrowing rules', c`At any moment you can have **either** any number of ~&~ references **or** exactly one ~&mut~ — never both. And a reference can never outlive its value.`);
G('Vec', c`A growable list: ~let mut v = vec![1, 2, 3]; v.push(4);~`);
G('String vs &str', c`~String~ owns its text and can grow. ~&str~ is a borrowed view of some text; string literals like ~"hi"~ are ~&str~.`);
G('HashMap', c`Key → value pairs: ~let mut ages = HashMap::new(); ages.insert("Ada", 36);~ The order is random.`);
G('BTreeMap', c`Like a HashMap, but keeps its keys sorted.`);

/* ============ TOPIC 1: FIRST STEPS ============ */
topic({ id: 'first', title: 'First Steps', icon: '🌱', color: '#58cc02', blurb: 'Print, store, format and read input.',
lessons: [
{ id: 'hello', title: 'Your first program', icon: '🚀', desc: 'fn main, println! — and a compiler that actually helps.',
  steps: [
  T('Why Rust?', c`Rust is as fast as C and C++, but its compiler refuses to build programs with the memory bugs that crash C and C++ programs (and cause most of their security holes). Firefox, Discord, Dropbox, the Linux kernel and Windows all use it. Developers have voted it their **most-admired language** for years running.

Its mascot is Ferris the crab 🦀, and its fans call themselves **Rustaceans**. This is a complete Rust program:`, c`
fn main() {
    println!("Hello, World!");
}`),
  T('The parts', c`~fn main() { ... }~ — a function called ~main~. The program starts here.

~println!~ prints a line. The ~!~ means it is a **macro**: code that writes code for you. You can spot macros by that ~!~.

Every statement ends with a semicolon ~;~.`, c`
fn main() {
    print!("No new line... ");   // print! does not end the line
    println!("{} and {}", 1, "two");   // {} is filled with the next value
}`, c`The Rust compiler is famous for its error messages. They point at the exact spot, explain what went wrong, and often suggest the fix. Reading them is half of learning Rust.`),
  Q(c`What does the ~!~ in ~println!~ tell you?`, ['It prints loudly', 'It is a macro, not a normal function', 'The line is important', 'It ends the program'], 1),
  P(c`
print!("A");
println!("B");
println!("{} and {}", 1, "two");`, 'AB\n1 and two', c`~print!~ does not end the line, so ~B~ follows straight after ~A~.`),
  F('Rebuild Hello World.', c`
[[fn]] main() {
    [[println!]]("Hello, World!");
}`),
  O('Put the lines of a complete program in order.', c`
fn main() {
    println!("Ferris is a crab");
    println!("Crabs are great");
}`),
  X({ q: c`Make the program print exactly: ~I am learning Rust!~`, start: M(c`
    // your code goes here
    println!();`), tests: [{ out: 'I am learning Rust!' }], sol: M(c`
    println!("I am learning Rust!");`) }),
  X({ q: c`Three bugs. Press **Run**, read the **first** error, fix it, repeat.

Expected output:

~Ferris says hi~
~Crabs rule!~`, start: c`fn main() {
    println!("Ferris says hi")
    println("Crabs rule!);
}
`, tests: [{ out: 'Ferris says hi\nCrabs rule!' }], hint: c`A quote is missing after ~Crabs rule!~. The first line needs a ~;~ at the end. And ~println~ is a macro, so it needs its ~!~.`, sol: M(c`
    println!("Ferris says hi");
    println!("Crabs rule!");`) }),
] },

{ id: 'variables', title: 'Variables & types', icon: '📦', desc: 'let, mut, shadowing — and why nothing changes unless you say so.',
  steps: [
  T('let', c`~let~ makes a variable. Rust usually works out the type itself, but you can write it after a colon.`, c`
let lives = 3;            // i32: a whole number
let name = "Ferris";      // text
let price: f64 = 4.99;    // f64: a decimal, type written out
let alive = true;         // bool
let crab = '🦀';          // char: one character, single quotes

const MAX_LIVES: u32 = 5; // a constant: type required, never changes`, c`The number types you will meet most: ~i32~ (whole numbers, the default), ~u32~ (whole numbers from 0 up), ~f64~ (decimals) and ~usize~ (sizes and positions in lists).`),
  T('Nothing changes unless you say so', c`Variables are **immutable** by default: once set, they stay set. To allow a change, add ~mut~.`, c`
let score = 0;
score = 10;        // ❌ error: cannot assign twice to immutable variable

let mut score = 0;
score += 10;       // ✅ fine`, c`Why? Most values never change after they are made. When something *does* change, ~mut~ shouts it, so you (and the compiler) always know where to look.`),
  Q('Which one compiles?', [c`~let x = 5; x = 6;~`, c`~let mut x = 5; x = 6;~`, c`~let x; x = 5; x = 6;~`, c`~mut x = 5; x = 6;~`], 1),
  P(c`
let x = 5;
let x = x * 2;
let x = x + 1;
println!("{}", x);`, '11', c`This is **shadowing**: each ~let~ makes a new ~x~ that hides the old one. Handy for turning a value into a new form without inventing new names.`),
  P(c`println!("{} {}", 7 / 2, 7.0 / 2.0);`, '3 3.5', c`Two whole numbers give a whole number: the .5 is thrown away.`),
  T('Types never mix by themselves', c`Rust will not quietly convert between number types. Multiplying an ~i32~ by an ~f64~ is an error, so convert one with ~as~:`, c`
let qty = 3;
let price = 8.5;
let total = qty as f64 * price;   // 25.5
let whole = price as i32;         // 8: the decimals are cut off`),
  X({ q: c`Print a receipt line using all three variables:

~3 x Pizza = 25.5~`, start: M(c`
    let item = "Pizza";
    let price = 8.5;
    let qty = 3;
    println!("{} {} {}", item, price, qty);`), tests: [{ out: '3 x Pizza = 25.5' }], not: [['"3 x Pizza', 'Build the line from the variables — no hard-coding.']], hint: c`~println!("{} x {} = {}", qty, item, qty as f64 * price);~`, sol: M(c`
    let item = "Pizza";
    let price = 8.5;
    let qty = 3;
    println!("{} x {} = {}", qty, item, qty as f64 * price);`) }),
  X({ q: c`This should print ~Score: 15~, but it does not compile. Read the error and fix it.`, start: M(c`
    let score = 10;
    score += 5;
    println!("Score: {}", score);`), tests: [{ out: 'Score: 15' }], not: [['"Score: 15', 'Fix the variable, not the message.']], hint: c`The compiler even suggests the fix: make the variable mutable with ~let mut~.`, sol: M(c`
    let mut score = 10;
    score += 5;
    println!("Score: {}", score);`) }),
] },

{ id: 'format', title: 'Formatting output', icon: '🖨️', desc: 'Decimals, debug printing, padding and names inside {}.',
  steps: [
  T('Inside the braces', c`What you put inside ~{}~ controls how the value looks.`, c`
let name = "Ferris";
let pi = 3.14159;
let v = vec![1, 2, 3];

println!("{}", pi);          // 3.14159
println!("{:.2}", pi);       // 3.14   two decimals
println!("{:?}", v);         // [1, 2, 3]   Debug: for lists and more
println!("[{:>6}]", 42);     // [    42]   right-align in 6 spaces
println!("[{:<6}]", 42);     // [42    ]   left-align
println!("{:03}", 7);        // 007   pad with zeros
println!("{name} is here");  // a variable's name inside the braces

let msg = format!("{} lives", 3);   // builds a String instead of printing`),
  P(c`println!("{:.2}", 3.14159);`, '3.14'),
  P(c`
let v = vec![10, 20, 30];
println!("{:?}", v);`, '[10, 20, 30]', c`A plain ~{}~ would not compile here: vectors only know how to print in Debug form, ~{:?}~.`),
  P(c`
let name = "Ferris";
let age = 7;
println!("{name} is {age}");`, 'Ferris is 7'),
  P(c`println!("[{:>5}]", 42);`, '[   42]'),
  F('Print the price with two decimals.', c`
let price = 9.5;
println!("Price: {[[:.2]]}", price);`),
  X({ q: c`Print the area of a circle with radius ~r~ using ~std::f64::consts::PI~, with **two** decimals:

~Area: 12.57~`, start: M(c`
    let r = 2.0;
    println!("{}", r);`), tests: [{ out: 'Area: 12.57' }], must: [[c`PI`, c`Use ~std::f64::consts::PI~.`], [c`\{:\.2\}`, c`Use ~{:.2}~ for two decimals.`]], sol: M(c`
    let r = 2.0;
    println!("Area: {:.2}", std::f64::consts::PI * r * r);`) }),
  X({ q: c`Print a score table. Names are left-aligned in 8 spaces, scores right-aligned in 4, with ~|~ around them:

~|Ferris  |  42|~
~|Corro   |   7|~`, start: M(c`
    let a = "Ferris";
    let b = "Corro";
    println!("{} {}", a, 42);
    println!("{} {}", b, 7);`), tests: [{ out: '|Ferris  |  42|\n|Corro   |   7|' }], must: [[c`\{:<8\}`, c`Left-align with ~{:<8}~.`], [c`\{:>4\}`, c`Right-align with ~{:>4}~.`]], sol: M(c`
    let a = "Ferris";
    let b = "Corro";
    println!("|{:<8}|{:>4}|", a, 42);
    println!("|{:<8}|{:>4}|", b, 7);`) }),
] },

{ id: 'input', title: 'Reading input', icon: '⌨️', desc: 'read_line, trim and parse.',
  steps: [
  T('Reading a line', c`Reading input takes a few more words in Rust than in most languages, but every word has a job.`, c`
use std::io;

fn main() {
    let mut name = String::new();              // an empty, growable String
    io::stdin().read_line(&mut name).unwrap(); // read one line into it
    let name = name.trim();                    // cut off the new line at the end

    println!("Hi, {}!", name);
}`, c`~&mut name~ lets ~read_line~ change your String (more on ~&~ in the borrowing lesson). ~unwrap()~ means "give me the result, and crash if reading failed" — later you will learn to handle failures properly.`),
  T('Turning text into numbers', c`Input is always text. ~parse()~ turns it into a number; tell Rust which kind with a type on the variable.`, c`
let mut line = String::new();
io::stdin().read_line(&mut line).unwrap();
let age: i32 = line.trim().parse().unwrap();

println!("Next year: {}", age + 1);`),
  Q(c`Why ~line.trim().parse()~ and not just ~line.parse()~?`, [c`~trim~ makes it faster`, c`The line ends with a new line (~"20\n"~), and that is not a number`, c`~parse~ only works on short text`, 'It is just a style choice'], 1),
  X({ q: c`Read the user's age and print:

~In 10 years you will be 30.~

(In the tests, the typed input is supplied automatically.)`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();`), tests: [{ in: '20', out: 'In 10 years you will be 30.' }, { in: '41', out: 'In 10 years you will be 51.' }], hint: c`~let age: i32 = line.trim().parse().unwrap();~ then print ~age + 10~.`, sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let age: i32 = line.trim().parse().unwrap();
    println!("In 10 years you will be {}.", age + 10);`) }),
  T('Several values at once', c`To read numbers separated by spaces (or new lines), read **all** the input, then split it into words.`, c`
let input = io::read_to_string(io::stdin()).unwrap();
let mut words = input.split_whitespace();

let price: f64 = words.next().unwrap().parse().unwrap();
let qty: u32 = words.next().unwrap().parse().unwrap();`, c`~words.next()~ hands you the next word each time you call it.`),
  X({ q: c`Read a price (a decimal) and a quantity (a whole number) and print the total with two decimals:

~2.5 4~ → ~Total: 10.00~`, start: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    let mut words = input.split_whitespace();`), tests: [{ in: '2.5 4', out: 'Total: 10.00' }, { in: '0.99 3', out: 'Total: 2.97' }], hint: c`Read ~price: f64~ and ~qty: u32~ with ~words.next().unwrap().parse().unwrap()~, then ~{:.2}~ with ~price * qty as f64~.`, sol: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    let mut words = input.split_whitespace();
    let price: f64 = words.next().unwrap().parse().unwrap();
    let qty: u32 = words.next().unwrap().parse().unwrap();
    println!("Total: {:.2}", price * qty as f64);`) }),
] },
],
quiz: [
  P(c`println!("{}", 9 / 2);`, '4'),
  Q(c`What is wrong with ~let n = 1; n += 1;~?`, [c`~n~ is not ~mut~, so it cannot change`, c`~+=~ does not exist in Rust`, 'Nothing', c`~n~ needs a type`], 0),
  P(c`
let v = vec!["a", "b"];
println!("{:?}", v);`, '["a", "b"]'),
  P(c`
let x = "5";
let x: i32 = x.parse().unwrap();
println!("{}", x + 1);`, '6', c`Shadowing lets the text ~x~ become the number ~x~.`),
  F('Read one line into s.', c`
let mut s = String::new();
io::stdin().read_line([[&mut s]]).unwrap();
println!("{}", s.trim());`),
  Q(c`Which placeholder prints ~3.14159~ as ~3.14~?`, [c`~{2}~`, c`~{:.2}~`, c`~{:?}~`, c`~{:2}~`], 1),
] });

/* ============ TOPIC 2: DECISIONS & LOOPS ============ */
topic({ id: 'flow', title: 'Decisions & Loops', icon: '🔀', color: '#ff9600', blurb: 'if as a value, three kinds of loop, and match.',
lessons: [
{ id: 'if', title: 'if and else', icon: '🚦', desc: 'No brackets, always braces — and if gives back a value.',
  steps: [
  T('Choosing a path', c`Rust's ~if~ needs **no** round brackets but **always** needs braces. The condition must be a real ~bool~: ~if 1 { }~ is an error, not "true".`, c`
let temp = 31;

if temp > 30 {
    println!("Too hot");
} else if temp > 15 {
    println!("Nice");
} else {
    println!("Too cold");
}`, c`Combine conditions with ~&&~ (and), ~||~ (or) and ~!~ (not).`),
  T('if gives back a value', c`In Rust, ~if~ is an **expression**: it produces a value, so you can store it. Both branches must give the same type, and there is **no** semicolon after the values.`, c`
let score = 72;
let result = if score >= 50 { "pass" } else { "fail" };
println!("{}", result);   // pass`),
  P(c`
let n = 7;
let kind = if n % 2 == 0 { "even" } else { "odd" };
println!("{} is {}", n, kind);`, '7 is odd'),
  Q(c`What happens with ~let n = 1; if n { println!("yes"); }~?`, ['It prints yes', 'It prints nothing', c`Compile error: expected ~bool~, found integer`, 'It crashes when run'], 2, c`Rust never treats numbers as true or false. Write ~if n != 0~.`),
  X({ q: c`Read a temperature (a whole number) and print ~Too hot~ above 30, ~Nice~ above 15, otherwise ~Too cold~.`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let temp: i32 = line.trim().parse().unwrap();`), tests: [{ in: '35', out: 'Too hot' }, { in: '20', out: 'Nice' }, { in: '15', out: 'Too cold' }, { in: '-3', out: 'Too cold' }], sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let temp: i32 = line.trim().parse().unwrap();
    if temp > 30 {
        println!("Too hot");
    } else if temp > 15 {
        println!("Nice");
    } else {
        println!("Too cold");
    }`) }),
  X({ q: c`Read a year and print ~leap~ or ~not leap~. A year is a leap year if it divides by 4, **except** years that divide by 100, **unless** they also divide by 400.

Use ~if~ as an expression: store the word in a variable, then print it once.`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let year: i32 = line.trim().parse().unwrap();`), tests: [{ in: '2024', out: 'leap' }, { in: '1900', out: 'not leap' }, { in: '2000', out: 'leap' }, { in: '2023', out: 'not leap' }], must: [[c`let\s+\w+\s*=\s*if\b`, c`Store the result with ~let word = if ... { "leap" } else { "not leap" };~`]], hint: c`~(year % 4 == 0 && year % 100 != 0) || year % 400 == 0~`, sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let year: i32 = line.trim().parse().unwrap();
    let word = if (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 { "leap" } else { "not leap" };
    println!("{}", word);`) }),
] },

{ id: 'loops', title: 'Loops', icon: '🔁', desc: 'loop, while, for — and a loop that returns a value.',
  steps: [
  T('Three loops', c`~loop~ repeats forever until you ~break~. ~while~ repeats while a condition is true. ~for~ walks through a **range** or a collection: it is the one you will use most.`, c`
for i in 0..5 { }          // 0, 1, 2, 3, 4    (5 not included)
for i in 1..=5 { }         // 1, 2, 3, 4, 5    (= includes the end)
for i in (1..=3).rev() { } // 3, 2, 1

let mut n = 1;
while n < 100 {
    n *= 2;
}

loop {
    // forever, until:
    break;
}`, c`~continue~ skips straight to the next round of a loop.`),
  P(c`
for i in (1..=3).rev() {
    println!("{}", i);
}
println!("Lift off!");`, '3\n2\n1\nLift off!'),
  P(c`
let mut total = 0;
for i in 1..=4 {
    total += i;
}
println!("{}", total);`, '10'),
  T('A loop that gives back a value', c`~break~ can carry a value out of a ~loop~, just like ~if~ gives one back.`, c`
let mut n = 1;
let first_big = loop {
    n *= 3;
    if n > 50 {
        break n;   // the loop's value
    }
};
println!("{}", first_big);   // 81`),
  P(c`
let mut n = 1;
let r = loop {
    n *= 2;
    if n > 20 {
        break n;
    }
};
println!("{}", r);`, '32'),
  Q(c`How many times does ~for i in 0..3~ run?`, ['2', '3', '4', 'Forever'], 1),
  X({ q: c`**FizzBuzz.** Read ~n~ and print the numbers from 1 to n, one per line — but print ~Fizz~ for multiples of 3, ~Buzz~ for multiples of 5, and ~FizzBuzz~ for multiples of both.`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let n: u32 = line.trim().parse().unwrap();`), tests: [{ in: '15', out: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }, { in: '5', out: '1\n2\nFizz\n4\nBuzz' }], hint: c`Check ~i % 15 == 0~ **first**, otherwise multiples of 15 get caught by the Fizz case.`, sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let n: u32 = line.trim().parse().unwrap();
    for i in 1..=n {
        if i % 15 == 0 {
            println!("FizzBuzz");
        } else if i % 3 == 0 {
            println!("Fizz");
        } else if i % 5 == 0 {
            println!("Buzz");
        } else {
            println!("{}", i);
        }
    }`) }),
  T('One line at a time', c`To handle input line by line until it runs out, loop over ~io::stdin().lines()~. Each line arrives wrapped in a ~Result~, hence the ~unwrap()~.`, c`
for line in io::stdin().lines() {
    let line = line.unwrap();
    println!("You typed: {}", line);
}`),
  X({ q: c`**Guess the number.** The secret is ~42~. Read guesses (one per line) and answer each with ~Too low~ or ~Too high~. On the right guess print ~Got it in N guesses!~ and stop.`, start: M(c`
    let secret = 42;
    for line in io::stdin().lines() {
        let guess: i32 = line.unwrap().trim().parse().unwrap();
        println!("{}", guess);
    }`), tests: [{ in: '50\n25\n42', out: 'Too high\nToo low\nGot it in 3 guesses!' }, { in: '42\n7', out: 'Got it in 1 guesses!' }], hint: c`Keep a ~let mut count = 0;~ outside the loop, add 1 for every guess, and ~break~ when it is right.`, sol: M(c`
    let secret = 42;
    let mut count = 0;
    for line in io::stdin().lines() {
        let guess: i32 = line.unwrap().trim().parse().unwrap();
        count += 1;
        if guess < secret {
            println!("Too low");
        } else if guess > secret {
            println!("Too high");
        } else {
            println!("Got it in {} guesses!", count);
            break;
        }
    }`) }),
] },

{ id: 'match', title: 'match', icon: '🎯', desc: 'A switch that checks you covered every case.',
  steps: [
  T('match', c`~match~ compares a value with a list of **patterns** and runs the first one that fits. Like ~if~, it gives back a value.`, c`
let day = 3;
let name = match day {
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    6 | 7 => "Weekend!",       // either one
    _ => "Some other day",     // _ matches anything else
};

let size = match day {
    0 => "none",
    1..=9 => "small",          // a range
    _ => "big",
};`),
  T('No case left behind', c`A ~match~ must cover **every** possible value. Forget one and the program does not compile: ~non-exhaustive patterns~. That sounds strict, but it means you can never forget a case — the compiler checks for you.`),
  P(c`
let n = 15;
let size = match n {
    0 => "none",
    1..=9 => "small",
    10..=99 => "medium",
    _ => "huge",
};
println!("{}", size);`, 'medium'),
  Q(c`A ~match~ on an ~i32~ has arms for ~0~, ~1~ and ~2~ only. What happens?`, ['Other numbers are ignored', 'It crashes for other numbers', 'Compile error: not every number is covered', 'Other numbers use the last arm'], 2),
  X({ q: c`**Calculator.** Read a sum like ~8 + 12~ (two numbers and an operator, separated by spaces) and print the answer. Support ~+ - * /~; for anything else print ~Unknown operator~. Use ~f64~ and a ~match~ on the operator.

~8 + 12~ → ~20~ · ~10 / 4~ → ~2.5~`, start: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    let mut words = input.split_whitespace();
    let a: f64 = words.next().unwrap().parse().unwrap();
    let op = words.next().unwrap();
    let b: f64 = words.next().unwrap().parse().unwrap();
    println!("{} {} {}", a, op, b);`), tests: [{ in: '8 + 12', out: '20' }, { in: '10 / 4', out: '2.5' }, { in: '7 * 6', out: '42' }, { in: '2 % 3', out: 'Unknown operator' }], must: [[c`match\s+op`, c`Use ~match op { ... }~.`]], hint: c`~"+" => println!("{}", a + b),~ and so on, with ~_ => println!("Unknown operator"),~ last.`, sol: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    let mut words = input.split_whitespace();
    let a: f64 = words.next().unwrap().parse().unwrap();
    let op = words.next().unwrap();
    let b: f64 = words.next().unwrap().parse().unwrap();
    match op {
        "+" => println!("{}", a + b),
        "-" => println!("{}", a - b),
        "*" => println!("{}", a * b),
        "/" => println!("{}", a / b),
        _ => println!("Unknown operator"),
    }`) }),
  X({ q: c`Read a score and print its grade with a ~match~ on ranges: 90–100 ~A~, 80–89 ~B~, 70–79 ~C~, 0–69 ~F~, anything else ~Invalid~.`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let score: i32 = line.trim().parse().unwrap();`), tests: [{ in: '95', out: 'A' }, { in: '85', out: 'B' }, { in: '72', out: 'C' }, { in: '40', out: 'F' }, { in: '120', out: 'Invalid' }], must: [[c`match`, c`Use a ~match~.`], [c`\.\.=`, c`Use ranges like ~90..=100~.`]], sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let score: i32 = line.trim().parse().unwrap();
    let grade = match score {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        0..=69 => "F",
        _ => "Invalid",
    };
    println!("{}", grade);`) }),
] },
],
quiz: [
  P(c`
let x = 4;
let msg = match x {
    1 | 2 => "low",
    3..=5 => "mid",
    _ => "high",
};
println!("{}", msg);`, 'mid'),
  P(c`
let mut n = 10;
let steps = loop {
    if n == 1 { break 0; }
    n -= 3;
    if n < 3 { break n; }
};
println!("{}", steps);`, '1'),
  Q(c`What does ~1..=4~ contain?`, ['1, 2, 3', '1, 2, 3, 4', '0, 1, 2, 3, 4', '2, 3'], 1),
  Q(c`Why is there no semicolon in ~if ok { "yes" } else { "no" }~ when it is stored with ~let~?`, ['Semicolons are optional in Rust', 'The values are the result of the if; a semicolon would throw them away', 'Strings never need semicolons', 'It is a typo'], 1),
  F('Count from 1 to 5, including 5.', c`
for i in 1[[..=]]5 {
    println!("{}", i);
}`),
] });

/* ============ TOPIC 3: OWNERSHIP ============ */
topic({ id: 'ownership', title: 'Functions & Ownership', icon: '🦀', color: '#ce82ff', blurb: 'Functions, then the idea that makes Rust Rust: who owns what.',
lessons: [
{ id: 'functions', title: 'Functions', icon: '🧩', desc: 'Parameters, return types, and the missing semicolon.',
  steps: [
  T('fn', c`Parameters always have types. The return type goes after ~->~. The **last expression** (with no semicolon) is what the function gives back.`, c`
fn add(a: i32, b: i32) -> i32 {
    a + b          // no semicolon: this is the return value
}

fn greet(name: &str) {        // no -> means it returns nothing
    println!("Hi, {}!", name);
}

fn main() {
    greet("Ferris");
    println!("{}", add(2, 3));   // 5
}`, c`You can also write ~return a + b;~, which is handy for leaving a function early.`),
  T('The semicolon trap', c`Add a semicolon to that last line and it becomes a **statement**, which gives back nothing. The compiler says ~mismatched types: expected i32, found ()~ — ~()~ is Rust's word for "nothing".`, c`
fn add(a: i32, b: i32) -> i32 {
    a + b;      // ❌ the ; throws the value away
}`),
  P(c`
fn square(n: i32) -> i32 {
    n * n
}

fn main() {
    println!("{}", square(square(2)));
}`, '16'),
  Q(c`What does ~fn five() -> i32 { 5; }~ do?`, ['Returns 5', 'Returns 0', c`Does not compile: the ~;~ means nothing is returned`, 'Crashes when called'], 2),
  X({ q: c`Write ~fn is_even(n: i32) -> bool~. ~main~ reads a number and prints ~even~ or ~odd~ using it.`, start: c`use std::io;

// write is_even here

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let n: i32 = line.trim().parse().unwrap();
    if is_even(n) {
        println!("even");
    } else {
        println!("odd");
    }
}
`, tests: [{ in: '4', out: 'even' }, { in: '7', out: 'odd' }, { in: '0', out: 'even' }], must: [[c`fn\s+is_even\s*\(\s*\w+\s*:\s*i32\s*\)\s*->\s*bool`, c`~fn is_even(n: i32) -> bool~`]], sol: c`use std::io;

fn is_even(n: i32) -> bool {
    n % 2 == 0
}

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let n: i32 = line.trim().parse().unwrap();
    if is_even(n) {
        println!("even");
    } else {
        println!("odd");
    }
}
` }),
  X({ q: c`Write ~fn to_fahrenheit(c: f64) -> f64~ (multiply by 9, divide by 5, add 32). Read a temperature in Celsius and print it in Fahrenheit with one decimal:

~100~ → ~212.0°F~`, start: c`use std::io;

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let c: f64 = line.trim().parse().unwrap();
    println!("{}", c);
}
`, tests: [{ in: '100', out: '212.0°F' }, { in: '-40', out: '-40.0°F' }, { in: '37', out: '98.6°F' }], must: [[c`fn\s+to_fahrenheit`, c`Write ~fn to_fahrenheit(c: f64) -> f64~.`]], sol: c`use std::io;

fn to_fahrenheit(c: f64) -> f64 {
    c * 9.0 / 5.0 + 32.0
}

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let c: f64 = line.trim().parse().unwrap();
    println!("{:.1}°F", to_fahrenheit(c));
}
` }),
] },

{ id: 'ownership', title: 'Ownership', icon: '👑', desc: 'One owner per value. Move it, copy it, or clone it.',
  steps: [
  T('Who cleans up?', c`Every program has to free the memory it is done with. C makes you do it by hand (and forgetting crashes programs). Python and Java run a garbage collector that tidies up in the background (which costs speed).

Rust does neither. It follows three rules, checked while compiling:

**1.** Every value has one **owner** (a variable).
**2.** There is only ever one owner at a time.
**3.** When the owner goes out of scope (its ~}~), the value is freed.`),
  T('Moving', c`Assigning a ~String~ to another variable **moves** it: the new variable is now the owner, and the old one can no longer be used.`, c`
let a = String::from("crab");
let b = a;                 // the String moves from a to b

println!("{}", b);         // ✅ crab
println!("{}", a);         // ❌ error: borrow of moved value: a`, c`Why not just copy it? A String can be huge. Moving only hands over the keys, so it is instant — and since only one variable owns it, it is freed exactly once.`),
  T('Copy and clone', c`Small, simple values — numbers, ~bool~, ~char~ — are **copied** instead, because copying them is as cheap as moving. When you really want two separate Strings, ask for a copy with ~clone()~.`, c`
let x = 5;
let y = x;                 // copied: both usable
println!("{} {}", x, y);   // 5 5

let s1 = String::from("hi");
let s2 = s1.clone();       // a full copy
println!("{} {}", s1, s2); // hi hi`),
  P(c`
let a = 5;
let b = a;
println!("{} {}", a, b);`, '5 5', c`Integers are ~Copy~, so ~a~ is still fine.`),
  Q(c`After ~let s2 = s1;~ where ~s1~ is a ~String~, what can you do with ~s1~?`, ['Read it but not change it', 'Nothing: it was moved to s2', 'Everything, it is a copy', 'Only print it'], 1),
  P(c`
let s1 = String::from("crab");
let s2 = s1.clone();
println!("{} {}", s1, s2);`, 'crab crab'),
  T('Functions take ownership too', c`Passing a String to a function moves it into the function. When the function ends, the String is freed — so the caller cannot use it any more.`, c`
fn shout(s: String) {
    println!("{}!", s);
}                          // s is freed here

let name = String::from("Ferris");
shout(name);               // name moves into shout
println!("{}", name);      // ❌ error: name was moved`, c`Handing values back and forth would get tiring fast. The fix is **borrowing**, in the next lesson.`),
  X({ q: c`This does not compile. Fix it so it prints:

~Ferris says hi~
~Ferris~`, start: M(c`
    let name = String::from("Ferris");
    let greeting = name;
    println!("{} says hi", name);
    println!("{}", greeting);`), tests: [{ out: 'Ferris says hi\nFerris' }], not: [['"Ferris says hi', 'Keep using the variables.']], hint: c`~let greeting = name.clone();~ gives ~greeting~ its own copy.`, sol: M(c`
    let name = String::from("Ferris");
    let greeting = name.clone();
    println!("{} says hi", name);
    println!("{}", greeting);`) }),
  X({ q: c`A function can hand ownership **back** by returning the value. Write ~fn add_crab(s: String) -> String~ that returns the text with ~" 🦀"~ on the end. The program reads a name and prints it with the crab.

~Ferris~ → ~Ferris 🦀~`, start: c`use std::io;

// write add_crab here

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let name = line.trim().to_string();
    let tagged = add_crab(name);
    println!("{}", tagged);
}
`, tests: [{ in: 'Ferris', out: 'Ferris 🦀' }, { in: 'Corro', out: 'Corro 🦀' }], must: [[c`fn\s+add_crab\s*\(\s*\w+\s*:\s*String\s*\)\s*->\s*String`, c`~fn add_crab(s: String) -> String~`]], hint: c`~format!("{} 🦀", s)~ builds the new String — and it is the last expression, so no semicolon.`, sol: c`use std::io;

fn add_crab(s: String) -> String {
    format!("{} 🦀", s)
}

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let name = line.trim().to_string();
    let tagged = add_crab(name);
    println!("{}", tagged);
}
` }),
] },

{ id: 'borrowing', title: 'Borrowing', icon: '🤝', desc: 'Lend a value with & and &mut instead of giving it away.',
  steps: [
  T('Lending with &', c`A **reference** (~&~) lets a function use a value without taking ownership. This is called **borrowing**: the function gets to look, and the owner gets it back afterwards.`, c`
fn count_letters(s: &String) -> usize {
    s.len()
}

let word = String::from("ownership");
let n = count_letters(&word);   // lend it
println!("{} has {} letters", word, n);   // ✅ word is still ours`, c`Functions that only read text usually take ~&str~ instead of ~&String~: it accepts both Strings (~&word~) and string literals (~"hi"~).`),
  T('Changing through &mut', c`A plain ~&~ reference is read-only. To let a function **change** the value, lend it with ~&mut~ (and the variable itself must be ~mut~). Use ~*~ to reach the value behind a reference to a number.`, c`
fn add_one(n: &mut i32) {
    *n += 1;          // * follows the reference to the real number
}

fn exclaim(s: &mut String) {
    s.push_str("!");  // methods follow the reference by themselves
}

let mut score = 5;
add_one(&mut score);       // score is now 6

let mut msg = String::from("Hi");
exclaim(&mut msg);         // msg is now "Hi!"`),
  T('The borrowing rules', c`At any moment, a value can have **either**:

• any number of ~&~ references (lots of readers), **or**
• exactly **one** ~&mut~ reference (one writer).

Never both. And a reference can never outlive the value it points to. These two rules, checked at compile time, are how Rust rules out whole families of bugs: data races, and "dangling" pointers to memory that was already freed.`),
  Q('Which of these is allowed at the same moment?', [c`Two ~&mut~ references to one String`, c`One ~&~ and one ~&mut~`, c`Three ~&~ references`, c`A ~&mut~ to a variable without ~mut~`], 2),
  P(c`
fn add_one(n: &mut i32) {
    *n += 1;
}

fn main() {
    let mut x = 5;
    add_one(&mut x);
    add_one(&mut x);
    println!("{}", x);
}`, '7'),
  X({ q: c`~describe~ takes ownership of the word, so ~main~ cannot print it afterwards. Change ~describe~ to **borrow** instead (and the call to match), so the program prints:

~ownership has 9 letters~`, start: c`fn describe(s: String) -> usize {
    s.len()
}

fn main() {
    let word = String::from("ownership");
    let n = describe(word);
    println!("{} has {} letters", word, n);
}
`, tests: [{ out: 'ownership has 9 letters' }], must: [[c`fn\s+describe\s*\(\s*\w+\s*:\s*&`, c`Make ~describe~ take a reference: ~s: &String~ or ~s: &str~.`]], not: [['clone', 'Borrow instead of cloning.']], sol: c`fn describe(s: &str) -> usize {
    s.len()
}

fn main() {
    let word = String::from("ownership");
    let n = describe(&word);
    println!("{} has {} letters", word, n);
}
` }),
  X({ q: c`Write ~fn shout(s: &mut String)~ that turns the text into capitals and adds ~!~ on the end. The program reads a line, shouts it and prints it.

~hello~ → ~HELLO!~`, start: c`use std::io;

// write shout here

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let mut text = line.trim().to_string();
    shout(&mut text);
    println!("{}", text);
}
`, tests: [{ in: 'hello', out: 'HELLO!' }, { in: 'rust is fun', out: 'RUST IS FUN!' }], must: [[c`fn\s+shout\s*\(\s*\w+\s*:\s*&mut\s+String\s*\)`, c`~fn shout(s: &mut String)~`]], hint: c`~*s = s.to_uppercase();~ replaces the String, then ~s.push_str("!");~`, sol: c`use std::io;

fn shout(s: &mut String) {
    *s = s.to_uppercase();
    s.push_str("!");
}

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let mut text = line.trim().to_string();
    shout(&mut text);
    println!("{}", text);
}
` }),
] },
],
quiz: [
  Q('How many owners can a value have at one time?', ['None', 'Exactly one', 'Two', 'As many as you like'], 1),
  P(c`
let a = String::from("hi");
let b = a.clone();
let c = a;
println!("{} {}", b, c);`, 'hi hi'),
  Q(c`You need to lend a value to a function that will change it. You pass…`, [c`~&value~`, c`~&mut value~`, c`~value.clone()~`, c`~*value~`], 1),
  P(c`
fn double(n: i32) -> i32 {
    n * 2
}

fn main() {
    let x = 4;
    let y = double(x);
    println!("{} {}", x, y);
}`, '4 8'),
  F('Finish the function signature.', c`
fn area(w: u32, h: u32) [[->]] u32 {
    w * h
}`),
] });

/* ============ TOPIC 4: COLLECTIONS ============ */
topic({ id: 'collections', title: 'Collections', icon: '📚', color: '#1cb0f6', blurb: 'Vectors, the two kinds of string, and hash maps.',
lessons: [
{ id: 'vectors', title: 'Vectors', icon: '📋', desc: 'Lists that grow: push, index, loop, sort.',
  steps: [
  T('Vec', c`A ~Vec~ is a list that can grow. ~vec![...]~ makes one with values in it; it must be ~mut~ to change.`, c`
let mut scores = vec![70, 85];
scores.push(90);              // add to the end

println!("{}", scores[0]);    // 70: indexes start at 0
println!("{}", scores.len()); // 3
println!("{:?}", scores);     // [70, 85, 90]

for s in &scores {            // & borrows, so scores is still usable afterwards
    println!("{}", s);
}`),
  P(c`
let mut v = vec![10, 20];
v.push(30);
println!("{} {:?}", v.len(), v);`, '3 [10, 20, 30]'),
  T('Handy methods', c`Vectors come with lots of help built in.`, c`
let mut v = vec![5, 2, 9];
v.sort();                          // [2, 5, 9]
v.reverse();                       // [9, 5, 2]
let has_five = v.contains(&5);     // true
let total: i32 = v.iter().sum();   // 16
let biggest = v.iter().max();      // Some(9) — more on Some soon
v.pop();                           // removes the last item`),
  P(c`
let mut v = vec![5, 2, 9];
v.sort();
println!("{:?}", v);`, '[2, 5, 9]'),
  P(c`
let v = vec![3, 1, 2];
let total: i32 = v.iter().sum();
println!("{}", total);`, '6'),
  Q(c`~v~ has 3 items. What does ~v[10]~ do?`, ['Returns 0', 'Returns the last item', 'Panics: the program stops with "index out of bounds"', 'Compile error'], 2, c`Rust checks every index. ~v.get(10)~ is the gentle version: it returns ~None~ instead of crashing.`),
  X({ q: c`Read how many scores there are, then the scores. Print the highest and the average (one decimal):

~4~ then ~70 85 90 61~ →
~Highest: 90~
~Average: 76.5~`, start: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    let mut words = input.split_whitespace();
    let n: usize = words.next().unwrap().parse().unwrap();
    let mut scores: Vec<i32> = Vec::new();
    println!("{} {:?}", n, scores);`), tests: [{ in: '4\n70 85 90 61', out: 'Highest: 90\nAverage: 76.5' }, { in: '1\n42', out: 'Highest: 42\nAverage: 42.0' }], hint: c`Loop ~for _ in 0..n~ pushing ~words.next().unwrap().parse().unwrap()~. Then keep the highest in a variable as you loop, and divide the sum as ~f64~.`, sol: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    let mut words = input.split_whitespace();
    let n: usize = words.next().unwrap().parse().unwrap();
    let mut scores: Vec<i32> = Vec::new();
    for _ in 0..n {
        scores.push(words.next().unwrap().parse().unwrap());
    }
    let mut highest = scores[0];
    let mut total = 0;
    for s in &scores {
        if *s > highest {
            highest = *s;
        }
        total += s;
    }
    println!("Highest: {}", highest);
    println!("Average: {:.1}", total as f64 / n as f64);`) }),
  X({ q: c`Read a line of words and print them in reverse order:

~ferris loves rust~ → ~rust loves ferris~`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let words: Vec<&str> = line.split_whitespace().collect();
    println!("{:?}", words);`), tests: [{ in: 'ferris loves rust', out: 'rust loves ferris' }, { in: 'one', out: 'one' }, { in: 'a b c d', out: 'd c b a' }], hint: c`Make ~words~ ~mut~, call ~words.reverse()~, then ~words.join(" ")~ glues them back together with spaces.`, sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let mut words: Vec<&str> = line.split_whitespace().collect();
    words.reverse();
    println!("{}", words.join(" "));`) }),
] },

{ id: 'strings', title: 'Strings', icon: '🔤', desc: 'String and &str, characters, and splitting text.',
  steps: [
  T('Two kinds of string', c`~String~ **owns** its text and can grow. ~&str~ is a **borrowed view** of some text — every string literal like ~"hi"~ is one.`, c`
let greeting: &str = "hello";               // a literal: &str
let mut name = String::from("Fer");         // an owned String
name.push_str("ris");                       // grow it
let full = format!("{}, {}!", greeting, name);   // a new String

let view: &str = &name;                     // borrow a String as &str`, c`Rule of thumb: **store** text in ~String~, **pass** it to functions as ~&str~.`),
  T('Useful methods', c`A few you will use all the time:`, c`
let s = "  Hello, Rust  ";
s.trim()                 // "Hello, Rust"
s.to_uppercase()         // "  HELLO, RUST  "
s.contains("Rust")       // true
s.replace("Rust", "Ferris")
s.len()                  // the length in bytes

for c in "hey".chars() { }                        // each character
let words: Vec<&str> = "a b c".split_whitespace().collect();
let parts: Vec<&str> = "a,b,c".split(',').collect();
let backwards: String = "abc".chars().rev().collect();   // "cba"`),
  P(c`
let s = String::from("Ferris");
println!("{} {}", s.to_uppercase(), s.len());`, 'FERRIS 6'),
  P(c`
let word = "stressed";
let rev: String = word.chars().rev().collect();
println!("{}", rev);`, 'desserts'),
  Q(c`Why does ~s[0]~ not compile when ~s~ is a String?`, ['Strings cannot be read', 'A character can take more than one byte (é, 🦀), so "the first one" is not a simple position — use s.chars()', 'Indexes start at 1 for strings', 'You must write s.at(0)'], 1),
  P(c`
let parts: Vec<&str> = "a,b,c".split(',').collect();
println!("{:?}", parts);`, '["a", "b", "c"]'),
  X({ q: c`Read a word and print ~palindrome~ if it reads the same backwards (ignoring capitals), otherwise ~not palindrome~.`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let word = line.trim();
    println!("{}", word);`), tests: [{ in: 'Racecar', out: 'palindrome' }, { in: 'Ferris', out: 'not palindrome' }, { in: 'level', out: 'palindrome' }], hint: c`~let w = word.to_lowercase();~ then ~let r: String = w.chars().rev().collect();~ and compare ~w == r~.`, sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let word = line.trim().to_lowercase();
    let reversed: String = word.chars().rev().collect();
    if word == reversed {
        println!("palindrome");
    } else {
        println!("not palindrome");
    }`) }),
  X({ q: c`Read a line and count its vowels (a, e, i, o, u, in capitals too):

~Hello Rustaceans~ → ~Vowels: 6~`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();`), tests: [{ in: 'Hello Rustaceans', out: 'Vowels: 6' }, { in: 'rhythm', out: 'Vowels: 0' }, { in: 'AEIOU aeiou', out: 'Vowels: 10' }], must: [[c`chars\(\)`, c`Loop over ~line.chars()~.`]], hint: c`~for c in line.chars()~, and ~"aeiouAEIOU".contains(c)~ tells you if ~c~ is a vowel.`, sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let mut count = 0;
    for c in line.chars() {
        if "aeiouAEIOU".contains(c) {
            count += 1;
        }
    }
    println!("Vowels: {}", count);`) }),
] },

{ id: 'hashmaps', title: 'Hash maps', icon: '🗝️', desc: 'Look things up by key, and count things with entry.',
  steps: [
  T('HashMap', c`A ~HashMap~ stores **key → value** pairs. It lives in ~std::collections~, so it needs a ~use~ line.`, c`
use std::collections::HashMap;

let mut ages = HashMap::new();
ages.insert("Ferris", 7);
ages.insert("Corro", 3);

println!("{}", ages["Ferris"]);            // 7 (panics if missing)
println!("{:?}", ages.get("Bob"));         // None: get is the safe way
ages.remove("Corro");
println!("{}", ages.contains_key("Corro")); // false`, c`~get~ returns ~Some(value)~ or ~None~ — an **Option**, which you will meet properly soon.`),
  P(c`
let mut ages = HashMap::new();
ages.insert("Ferris", 7);
ages.insert("Corro", 3);
println!("{}", ages["Ferris"] + ages["Corro"]);`, '10'),
  T('Counting with entry', c`~entry(key).or_insert(0)~ means "find this key's value, or put a 0 there first". It gives back a ~&mut~ to the value, so ~*~ adds to it.`, c`
let mut counts = HashMap::new();
for word in "the cat and the hat".split_whitespace() {
    *counts.entry(word).or_insert(0) += 1;
}
// counts: the → 2, cat → 1, and → 1, hat → 1`, c`A HashMap's order is **random**. When you want sorted keys, use ~BTreeMap~ instead: same methods, keys always in order.`),
  P(c`
let mut counts = BTreeMap::new();
for word in "b a b c b".split_whitespace() {
    *counts.entry(word).or_insert(0) += 1;
}
println!("{:?}", counts);`, '{"a": 1, "b": 3, "c": 1}'),
  Q(c`What does ~map.get("x")~ give back?`, ['The value, or 0 if missing', c`~Some(value)~ if the key is there, ~None~ if not`, 'It panics if the key is missing', 'The key'], 1),
  X({ q: c`**Vote counter.** Read names separated by spaces and print each name with its number of votes, in alphabetical order:

~ada bob ada cy bob ada~ →
~ada: 3~
~bob: 2~
~cy: 1~`, start: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    for name in input.split_whitespace() {
        println!("{}", name);
    }`), tests: [{ in: 'ada bob ada cy bob ada', out: 'ada: 3\nbob: 2\ncy: 1' }, { in: 'zed', out: 'zed: 1' }], must: [[c`entry`, c`Count with ~entry(name).or_insert(0)~.`]], hint: c`A ~BTreeMap~ keeps the names sorted. Afterwards, ~for (name, n) in &votes~ walks through the pairs.`, sol: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    let mut votes = BTreeMap::new();
    for name in input.split_whitespace() {
        *votes.entry(name).or_insert(0) += 1;
    }
    for (name, n) in &votes {
        println!("{}: {}", name, n);
    }`) }),
  X({ q: c`**Stock room.** Read commands, one per line:

~add <item> <amount>~ adds to that item's stock · ~show <item>~ prints ~<item>: <amount>~, or ~<item>: none~ if there has never been any.

~add apple 3~, ~add apple 5~, ~show apple~ → ~apple: 8~`, start: M(c`
    let mut stock: HashMap<String, u32> = HashMap::new();
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let parts: Vec<&str> = line.split_whitespace().collect();
        println!("{:?}", parts);
    }
    println!("{}", stock.len());`), tests: [{ in: 'add apple 3\nadd pear 2\nadd apple 5\nshow apple\nshow kiwi\nshow pear', out: 'apple: 8\nkiwi: none\npear: 2' }], hint: c`~match parts[0]~ on ~"add"~ and ~"show"~. To add: ~*stock.entry(parts[1].to_string()).or_insert(0) += amount;~ To show: ~match stock.get(parts[1]) { Some(n) => ..., None => ... }~`, sol: M(c`
    let mut stock: HashMap<String, u32> = HashMap::new();
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let parts: Vec<&str> = line.split_whitespace().collect();
        match parts[0] {
            "add" => {
                let amount: u32 = parts[2].parse().unwrap();
                *stock.entry(parts[1].to_string()).or_insert(0) += amount;
            }
            "show" => match stock.get(parts[1]) {
                Some(n) => println!("{}: {}", parts[1], n),
                None => println!("{}: none", parts[1]),
            },
            _ => {}
        }
    }`) }),
] },
],
quiz: [
  P(c`
let mut v = vec![1, 2];
v.push(3);
v.push(4);
println!("{}", v.len());`, '4'),
  Q(c`Which type should a function take when it only needs to **read** some text?`, [c`~String~`, c`~&str~`, c`~&mut String~`, c`~Vec<char>~`], 1),
  P(c`
let s = "rust";
let up = s.to_uppercase();
println!("{} {}", s, up);`, 'rust RUST'),
  Q(c`You need a map whose keys come out in sorted order. You use…`, [c`~HashMap~`, c`~BTreeMap~`, c`~Vec~`, c`~HashSet~`], 1),
  F('Count each word.', c`
let mut counts = HashMap::new();
let word = "hi";
*counts.entry(word).[[or_insert]](0) += 1;
println!("{:?}", counts);`),
  P(c`
let words: Vec<&str> = "x y z".split_whitespace().collect();
println!("{}", words.join("-"));`, 'x-y-z'),
] });
