/* ================= Rust: topics 5-8 ================= */
G('struct', c`Groups named fields into one new type: ~struct Player { name: String, level: u32 }~`);
G('impl', c`A block of methods for a type: ~impl Player { fn level_up(&mut self) { ... } }~`);
G('&self / &mut self', c`The first parameter of a method: ~&self~ reads the value, ~&mut self~ is allowed to change it.`);
G('associated function', c`A function in an ~impl~ block with no ~self~, called with ~::~ — usually a constructor like ~Player::new("Link")~.`);
G('#[derive(Debug)]', c`Asks the compiler to write the code that prints a struct or enum with ~{:?}~.`);
G('enum', c`A type that is exactly one of several **variants**: ~enum Light { Red, Yellow, Green }~. Variants can carry data: ~Circle(f64)~.`);
G('Option', c`Rust's answer to null: a value is either ~Some(x)~ or ~None~, and the compiler makes you handle both.`);
G('if let', c`Runs a block only when a value matches one pattern: ~if let Some(x) = maybe { ... }~`);
G('unwrap_or', c`Takes the value out of an Option, or uses a default if it is ~None~: ~maybe.unwrap_or(0)~.`);
G('Result', c`Either ~Ok(value)~ or ~Err(error)~. Functions that can fail return one, and you have to deal with the error.`);
G('?', c`Inside a function that returns a ~Result~: take the ~Ok~ value, or return the ~Err~ to the caller straight away.`);
G('panic!', c`Stops the program with a message. For bugs and impossible situations; expected failures should use ~Result~.`);
G('expect', c`Like ~unwrap~, but with your own message if it fails: ~file.expect("settings file missing")~.`);
G('trait', c`A set of methods that types can promise to have: ~trait Speak { fn speak(&self) -> String; }~`);
G('Display', c`The trait behind ~{}~. Implement it to choose how your type prints for users.`);
G('generics', c`Code that works for many types: ~fn largest<T: PartialOrd>(items: &[T]) -> &T~. ~T~ stands for "some type".`);
G('trait bound', c`~T: PartialOrd~ — limits a generic type to types that have a trait, so you can use its methods (here, ~<~ and ~>~).`);
G('slice', c`A borrowed view of part (or all) of a list: ~&[T]~. ~&v~ turns a ~Vec~ into one.`);
G('closure', c`A small function without a name, written in place: ~|x| x * 2~. It can use variables around it.`);
G('iterator', c`Something that hands out values one at a time. ~v.iter()~, ~s.chars()~ and ranges are iterators.`);
G('map / filter / collect', c`~map~ changes each value, ~filter~ keeps the ones you want, ~collect~ gathers the results into a ~Vec~ or ~String~.`);

/* ============ TOPIC 5: STRUCTS & ENUMS ============ */
topic({ id: 'types', title: 'Structs & Enums', icon: '🧱', color: '#ff4b4b', blurb: 'Your own types, methods, enums with data — and Option instead of null.',
lessons: [
{ id: 'structs', title: 'Structs & methods', icon: '📇', desc: 'Your own types, with methods in an impl block.',
  steps: [
  T('struct', c`A **struct** groups related fields into a new type. Rust has no classes: structs plus methods do that job.`, c`
struct Player {
    name: String,
    level: u32,
}

let mut p = Player { name: String::from("Link"), level: 3 };
p.level += 1;                           // needs mut, like any variable
println!("{} is level {}", p.name, p.level);`),
  T('Methods live in impl', c`Methods go in an ~impl~ block. The first parameter says what the method may do with the value: ~&self~ to read it, ~&mut self~ to change it. A function with no ~self~ is called with ~::~ — it is usually the constructor, ~new~.`, c`
impl Player {
    fn new(name: &str) -> Player {
        Player { name: name.to_string(), level: 1 }
    }

    fn describe(&self) -> String {
        format!("{} (level {})", self.name, self.level)
    }

    fn level_up(&mut self) {
        self.level += 1;
    }
}

let mut hero = Player::new("Zelda");
hero.level_up();
println!("{}", hero.describe());   // Zelda (level 2)`),
  P(c`
struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn area(&self) -> u32 {
        self.w * self.h
    }
}

fn main() {
    let r = Rect { w: 3, h: 4 };
    println!("{}", r.area());
}`, '12'),
  P(c`
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("{:?}", p);
}`, 'Point { x: 1, y: 2 }', c`~#[derive(Debug)]~ asks the compiler to write the printing code for you.`),
  Q(c`A method changes one of the struct's fields. Its first parameter should be…`, [c`~self~`, c`~&self~`, c`~&mut self~`, 'Nothing: methods can always change fields'], 2),
  X({ q: c`Finish the bank account. Write an ~impl Account~ block with:

~fn new(owner: &str) -> Account~ (balance starts at 0) · ~fn deposit(&mut self, amount: f64)~ · ~fn withdraw(&mut self, amount: f64) -> bool~, which takes the money and returns ~true~, or returns ~false~ and changes nothing if there is not enough.`, start: c`struct Account {
    owner: String,
    balance: f64,
}

// write impl Account here

fn main() {
    let mut acc = Account::new("Ferris");
    acc.deposit(50.0);
    if !acc.withdraw(80.0) {
        println!("Not enough money");
    }
    acc.withdraw(20.0);
    println!("{}: {:.2}", acc.owner, acc.balance);
}
`, tests: [{ out: 'Not enough money\nFerris: 30.00' }], must: [[c`impl\s+Account`, c`Write an ~impl Account { ... }~ block.`]], sol: c`struct Account {
    owner: String,
    balance: f64,
}

impl Account {
    fn new(owner: &str) -> Account {
        Account { owner: owner.to_string(), balance: 0.0 }
    }

    fn deposit(&mut self, amount: f64) {
        self.balance += amount;
    }

    fn withdraw(&mut self, amount: f64) -> bool {
        if amount > self.balance {
            return false;
        }
        self.balance -= amount;
        true
    }
}

fn main() {
    let mut acc = Account::new("Ferris");
    acc.deposit(50.0);
    if !acc.withdraw(80.0) {
        println!("Not enough money");
    }
    acc.withdraw(20.0);
    println!("{}: {:.2}", acc.owner, acc.balance);
}
` }),
  X({ q: c`Give ~Rect~ two methods: ~area(&self) -> u32~ and ~can_hold(&self, other: &Rect) -> bool~ (true if ~other~ fits inside: narrower **and** shorter). The program reads two rectangles (~w h w h~).

~4 3 2 2~ → ~Areas: 12 and 4~ then ~Fits: yes~`, start: c`use std::io;

struct Rect {
    w: u32,
    h: u32,
}

// write impl Rect here

fn main() {
    let input = io::read_to_string(io::stdin()).unwrap();
    let n: Vec<u32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let a = Rect { w: n[0], h: n[1] };
    let b = Rect { w: n[2], h: n[3] };
    println!("Areas: {} and {}", a.area(), b.area());
    println!("Fits: {}", if a.can_hold(&b) { "yes" } else { "no" });
}
`, tests: [{ in: '4 3 2 2', out: 'Areas: 12 and 4\nFits: yes' }, { in: '4 3 2 3', out: 'Areas: 12 and 6\nFits: no' }, { in: '1 1 5 5', out: 'Areas: 1 and 25\nFits: no' }], must: [[c`fn\s+can_hold\s*\(\s*&self`, c`~fn can_hold(&self, other: &Rect) -> bool~`]], sol: c`use std::io;

struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn area(&self) -> u32 {
        self.w * self.h
    }

    fn can_hold(&self, other: &Rect) -> bool {
        self.w > other.w && self.h > other.h
    }
}

fn main() {
    let input = io::read_to_string(io::stdin()).unwrap();
    let n: Vec<u32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let a = Rect { w: n[0], h: n[1] };
    let b = Rect { w: n[2], h: n[3] };
    println!("Areas: {} and {}", a.area(), b.area());
    println!("Fits: {}", if a.can_hold(&b) { "yes" } else { "no" });
}
` }),
] },

{ id: 'enums', title: 'Enums', icon: '🚥', desc: 'One of several variants — and variants can carry data.',
  steps: [
  T('enum', c`An **enum** is a type that is exactly one of a fixed set of **variants**. ~match~ on it, and the compiler checks you handled every one.`, c`
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

fn arrow(d: Direction) -> char {
    match d {
        Direction::Up => '↑',
        Direction::Down => '↓',
        Direction::Left => '←',
        Direction::Right => '→',
    }
}`),
  T('Variants with data', c`This is where Rust's enums get powerful: each variant can carry its own data. ~match~ unpacks it into variables.`, c`
enum Shape {
    Circle(f64),          // a radius
    Rect(f64, f64),       // width and height
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => 3.14159 * r * r,
        Shape::Rect(w, h) => w * h,
    }
}

let shapes = vec![Shape::Circle(1.0), Shape::Rect(2.0, 3.5)];`),
  P(c`
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value(c: Coin) -> u32 {
    match c {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

fn main() {
    println!("{}", value(Coin::Dime) + value(Coin::Quarter));
}`, '35'),
  P(c`
enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => 3.0 * r * r,
        Shape::Rect(w, h) => w * h,
    }
}

fn main() {
    println!("{}", area(&Shape::Rect(2.0, 3.5)));
}`, '7'),
  Q(c`You add a fourth variant to an enum. What happens to a ~match~ elsewhere that only handles the first three?`, ['It silently ignores the new one', 'It crashes when it meets the new one', 'It stops compiling until you handle the new variant', 'It uses the first arm'], 2, c`That is the point: the compiler finds every place you need to update.`),
  X({ q: c`A traffic light. Write ~fn next(l: Light) -> Light~ (red → green → yellow → red) and ~fn name(l: &Light) -> &str~. ~main~ is done:

~Red~ ~Green~ ~Yellow~ ~Red~ (one per line)`, start: c`enum Light {
    Red,
    Yellow,
    Green,
}

// write next and name here

fn main() {
    let mut light = Light::Red;
    for _ in 0..4 {
        println!("{}", name(&light));
        light = next(light);
    }
}
`, tests: [{ out: 'Red\nGreen\nYellow\nRed' }], must: [[c`fn\s+next\s*\(`, c`Write ~fn next(l: Light) -> Light~.`], [c`match`, c`Use ~match~.`]], sol: c`enum Light {
    Red,
    Yellow,
    Green,
}

fn next(l: Light) -> Light {
    match l {
        Light::Red => Light::Green,
        Light::Green => Light::Yellow,
        Light::Yellow => Light::Red,
    }
}

fn name(l: &Light) -> &str {
    match l {
        Light::Red => "Red",
        Light::Yellow => "Yellow",
        Light::Green => "Green",
    }
}

fn main() {
    let mut light = Light::Red;
    for _ in 0..4 {
        println!("{}", name(&light));
        light = next(light);
    }
}
` }),
  X({ q: c`Read shapes, one per line — ~circle <r>~ or ~rect <w> <h>~ — turn each into a ~Shape~ and print its area with two decimals. Write ~fn area(s: &Shape) -> f64~ (use ~std::f64::consts::PI~).

~circle 1~ → ~3.14~ · ~rect 2 3~ → ~6.00~`, start: c`use std::io;

enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

// write area here

fn main() {
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let p: Vec<&str> = line.split_whitespace().collect();
        let shape = match p[0] {
            "circle" => Shape::Circle(p[1].parse().unwrap()),
            _ => Shape::Rect(p[1].parse().unwrap(), p[2].parse().unwrap()),
        };
        println!("{:.2}", area(&shape));
    }
}
`, tests: [{ in: 'circle 1\nrect 2 3', out: '3.14\n6.00' }, { in: 'rect 1.5 4\ncircle 2', out: '6.00\n12.57' }], must: [[c`fn\s+area\s*\(\s*\w+\s*:\s*&Shape\s*\)`, c`~fn area(s: &Shape) -> f64~`]], sol: c`use std::io;

enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rect(w, h) => w * h,
    }
}

fn main() {
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let p: Vec<&str> = line.split_whitespace().collect();
        let shape = match p[0] {
            "circle" => Shape::Circle(p[1].parse().unwrap()),
            _ => Shape::Rect(p[1].parse().unwrap(), p[2].parse().unwrap()),
        };
        println!("{:.2}", area(&shape));
    }
}
` }),
] },

{ id: 'option', title: 'Option: no more null', icon: '🎁', desc: 'Some or None, and the compiler makes you check.',
  steps: [
  T('The billion-dollar mistake', c`Most languages have ~null~: a "nothing" that can hide in any variable and crash the program when you use it. Its inventor calls it his billion-dollar mistake.

Rust has no null. A value that might be missing has the type ~Option~, which is an enum:`, c`
enum Option<T> {
    Some(T),     // there is a value
    None,        // there is not
}`, c`Because ~Option<i32>~ is not an ~i32~, you **cannot** forget to check: the compiler will not let you use it as a number until you have handled ~None~.`),
  T('Where Options come from', c`Anything that might find nothing returns one:`, c`
let v = vec![4, 8];
v.get(1)                 // Some(8)
v.get(5)                 // None
v.iter().max()           // Some(8)
"crab".find('r')         // Some(1)
ages.get("Bob")          // None, if Bob is not in the map`),
  T('Getting the value out', c`Four ways, from most to least careful:`, c`
match v.get(5) {
    Some(x) => println!("found {}", x),
    None => println!("nothing there"),
}

if let Some(x) = v.get(1) {      // only care about the Some case
    println!("found {}", x);
}

let n = maybe.unwrap_or(0);      // use 0 if it is None
let n = maybe.unwrap();          // crash if it is None: avoid`),
  P(c`
let v = vec![4, 8];
println!("{:?} {:?}", v.get(1), v.get(5));`, 'Some(8) None'),
  P(c`
let n: Option<i32> = None;
println!("{}", n.unwrap_or(10));`, '10'),
  P(c`
let maybe = Some(3);
if let Some(x) = maybe {
    println!("got {}", x);
} else {
    println!("nothing");
}`, 'got 3'),
  Q(c`Why can you not write ~v.get(0) + 1~?`, [c`~get~ gives an ~Option~, not a number: handle the ~None~ case first`, c`~get~ is too slow`, 'You can, it works', c`Vectors cannot hold numbers`], 0),
  X({ q: c`Write ~fn find_index(v: &Vec<i32>, target: i32) -> Option<usize>~ that returns the position of the first match, or ~None~. ~main~ reads the target.

~15~ → ~Found at 2~ · ~7~ → ~Not found~`, start: c`use std::io;

// write find_index here

fn main() {
    let v = vec![4, 8, 15, 16, 23, 42];
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let target: i32 = line.trim().parse().unwrap();
    match find_index(&v, target) {
        Some(i) => println!("Found at {}", i),
        None => println!("Not found"),
    }
}
`, tests: [{ in: '15', out: 'Found at 2' }, { in: '7', out: 'Not found' }, { in: '4', out: 'Found at 0' }], must: [[c`->\s*Option<usize>`, c`Return ~Option<usize>~.`]], hint: c`~for i in 0..v.len()~, and ~return Some(i);~ when ~v[i] == target~. After the loop, ~None~.`, sol: c`use std::io;

fn find_index(v: &Vec<i32>, target: i32) -> Option<usize> {
    for i in 0..v.len() {
        if v[i] == target {
            return Some(i);
        }
    }
    None
}

fn main() {
    let v = vec![4, 8, 15, 16, 23, 42];
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let target: i32 = line.trim().parse().unwrap();
    match find_index(&v, target) {
        Some(i) => println!("Found at {}", i),
        None => println!("Not found"),
    }
}
` }),
  X({ q: c`Write ~fn divide(a: i32, b: i32) -> Option<i32>~ that returns ~None~ when ~b~ is 0. Read two numbers and print the answer, or ~Cannot divide by zero~.`, start: c`use std::io;

// write divide here

fn main() {
    let input = io::read_to_string(io::stdin()).unwrap();
    let n: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    println!("{} {}", n[0], n[1]);
}
`, tests: [{ in: '10 2', out: '5' }, { in: '7 0', out: 'Cannot divide by zero' }, { in: '-9 3', out: '-3' }], must: [[c`fn\s+divide\s*\([^)]*\)\s*->\s*Option<i32>`, c`~fn divide(a: i32, b: i32) -> Option<i32>~`]], sol: c`use std::io;

fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    let input = io::read_to_string(io::stdin()).unwrap();
    let n: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    match divide(n[0], n[1]) {
        Some(q) => println!("{}", q),
        None => println!("Cannot divide by zero"),
    }
}
` }),
] },
],
quiz: [
  Q(c`How do you call an associated function ~new~ on ~Player~?`, [c`~Player.new()~`, c`~Player::new()~`, c`~new Player()~`, c`~Player->new()~`], 1),
  P(c`
let v = vec![1, 2, 3];
match v.get(3) {
    Some(x) => println!("{}", x),
    None => println!("none"),
}`, 'none'),
  P(c`
let x: Option<i32> = Some(4);
println!("{}", x.unwrap_or(0) * 2);`, '8'),
  Q(c`What is special about Rust's enums compared with most languages?`, ['They can only hold numbers', 'Each variant can carry its own data', 'They cannot be used with match', 'They are always null'], 1),
  F('Make a struct printable with {:?}.', c`
#[derive([[Debug]])]
struct Cat {
    lives: u32,
}

fn main() {
    println!("{:?}", Cat { lives: 9 });
}`),
] });

/* ============ TOPIC 6: ERROR HANDLING ============ */
topic({ id: 'errors', title: 'Error Handling', icon: '🛡️', color: '#1c8ef6', blurb: 'Result, the ? operator, and your own error types.',
lessons: [
{ id: 'result', title: 'Result', icon: '📨', desc: 'Ok or Err — failures you can see coming.',
  steps: [
  T('Ok or Err', c`Some things can fail: turning text into a number, opening a file. Those functions return a ~Result~ — another enum:`, c`
enum Result<T, E> {
    Ok(T),       // it worked, here is the value
    Err(E),      // it failed, here is why
}`, c`Like ~Option~, the compiler will not let you use the value until you have looked at both cases.`),
  T('Handling it', c`~match~ on it, and you decide what a failure means.`, c`
let text = "42x";
match text.parse::<i32>() {
    Ok(n) => println!("Double: {}", n * 2),
    Err(e) => println!("Not a number: {}", e),
}
// Not a number: invalid digit found in string`, c`~unwrap()~ — which you have used since the input lesson — means "I am sure this is ~Ok~; crash if not". Now you know how to do better.`),
  P(c`
let r = "42".parse::<i32>();
println!("{:?}", r);`, 'Ok(42)'),
  P(c`
match "x7".parse::<i32>() {
    Ok(n) => println!("{}", n),
    Err(_) => println!("bad"),
}`, 'bad'),
  Q(c`What happens when you call ~unwrap()~ on an ~Err~?`, ['It returns 0', 'It returns the error', 'The program panics (stops with an error)', 'Nothing'], 2),
  X({ q: c`Read an age. If it is a valid whole number (0 or more, so use ~u32~), print ~Next year you will be N~. Otherwise print ~That is not a number~ — no crashing.`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let age: u32 = line.trim().parse().unwrap();
    println!("Next year you will be {}", age + 1);`), tests: [{ in: '20', out: 'Next year you will be 21' }, { in: 'abc', out: 'That is not a number' }, { in: '-5', out: 'That is not a number' }], must: [[c`Ok\(`, c`~match~ on the ~Result~ with ~Ok(age)~ and ~Err(_)~.`]], sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    match line.trim().parse::<u32>() {
        Ok(age) => println!("Next year you will be {}", age + 1),
        Err(_) => println!("That is not a number"),
    }`) }),
  X({ q: c`Read words. Add up the ones that are whole numbers and count the ones that are not:

~3 x 4 hello 5~ → ~Sum: 12, skipped: 2~`, start: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    for word in input.split_whitespace() {
        println!("{}", word);
    }`), tests: [{ in: '3 x 4 hello 5', out: 'Sum: 12, skipped: 2' }, { in: '1 2 3', out: 'Sum: 6, skipped: 0' }, { in: 'nope', out: 'Sum: 0, skipped: 1' }], hint: c`Two ~mut~ counters, and inside the loop ~match word.parse::<i32>() { Ok(n) => sum += n, Err(_) => skipped += 1 }~.`, sol: M(c`
    let input = io::read_to_string(io::stdin()).unwrap();
    let mut sum = 0;
    let mut skipped = 0;
    for word in input.split_whitespace() {
        match word.parse::<i32>() {
            Ok(n) => sum += n,
            Err(_) => skipped += 1,
        }
    }
    println!("Sum: {}, skipped: {}", sum, skipped);`) }),
] },

{ id: 'question', title: 'The ? operator', icon: '❓', desc: 'Pass errors up in one character.',
  steps: [
  T('Your own Result functions', c`Your functions can return ~Result~ too. Use ~Ok(value)~ for success and ~Err(...)~ for failure. A ~String~ makes a simple error type.`, c`
fn check_age(age: i32) -> Result<i32, String> {
    if age < 0 {
        return Err(String::from("age cannot be negative"));
    }
    Ok(age)
}`),
  P(c`
fn check(age: i32) -> Result<i32, String> {
    if age < 0 {
        return Err(String::from("negative"));
    }
    Ok(age)
}

fn main() {
    println!("{:?} {:?}", check(5), check(-1));
}`, 'Ok(5) Err("negative")'),
  T('?', c`Often a function just wants to pass a failure on to its caller. Writing a ~match~ every time gets long, so Rust has ~?~: "if this is ~Ok~, give me the value; if it is ~Err~, return that error **right now**".`, c`
use std::num::ParseIntError;

fn add_strs(a: &str, b: &str) -> Result<i32, ParseIntError> {
    let x: i32 = a.parse()?;    // returns early if a is not a number
    let y: i32 = b.parse()?;
    Ok(x + y)
}`, c`~?~ only works inside a function that itself returns a ~Result~ (or an ~Option~), because it needs somewhere to send the error.`),
  P(c`
use std::num::ParseIntError;

fn add_strs(a: &str, b: &str) -> Result<i32, ParseIntError> {
    let x: i32 = a.parse()?;
    let y: i32 = b.parse()?;
    Ok(x + y)
}

fn main() {
    match add_strs("2", "40") {
        Ok(n) => println!("{}", n),
        Err(e) => println!("Error: {}", e),
    }
    match add_strs("2", "forty") {
        Ok(n) => println!("{}", n),
        Err(e) => println!("Error: {}", e),
    }
}`, '42\nError: invalid digit found in string'),
  Q(c`Where can you use ~?~?`, ['Anywhere', 'Only in main', c`Inside a function that returns a ~Result~ or ~Option~`, 'Only on numbers'], 2),
  X({ q: c`Write ~fn withdraw(balance: u32, amount: u32) -> Result<u32, String>~. It returns the new balance, or one of two errors: ~Amount must be positive~ (for 0) and ~Insufficient funds~. ~main~ reads a balance and an amount.

~100 30~ → ~New balance: 70~ · ~50 80~ → ~Error: Insufficient funds~`, start: c`use std::io;

// write withdraw here

fn main() {
    let input = io::read_to_string(io::stdin()).unwrap();
    let n: Vec<u32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    match withdraw(n[0], n[1]) {
        Ok(b) => println!("New balance: {}", b),
        Err(e) => println!("Error: {}", e),
    }
}
`, tests: [{ in: '100 30', out: 'New balance: 70' }, { in: '50 80', out: 'Error: Insufficient funds' }, { in: '50 0', out: 'Error: Amount must be positive' }, { in: '20 20', out: 'New balance: 0' }], must: [[c`->\s*Result<u32,\s*String>`, c`Return ~Result<u32, String>~.`]], sol: c`use std::io;

fn withdraw(balance: u32, amount: u32) -> Result<u32, String> {
    if amount == 0 {
        return Err(String::from("Amount must be positive"));
    }
    if amount > balance {
        return Err(String::from("Insufficient funds"));
    }
    Ok(balance - amount)
}

fn main() {
    let input = io::read_to_string(io::stdin()).unwrap();
    let n: Vec<u32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    match withdraw(n[0], n[1]) {
        Ok(b) => println!("New balance: {}", b),
        Err(e) => println!("Error: {}", e),
    }
}
` }),
  X({ q: c`Write ~fn total(line: &str) -> Result<i32, ParseIntError>~ that adds up every word, using ~?~ so the first bad word ends it. ~main~ prints ~Total: N~ or the error.

~1 2 3~ → ~Total: 6~ · ~1 two 3~ → ~Error: invalid digit found in string~`, start: c`use std::io;
use std::num::ParseIntError;

// write total here

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    match total(&line) {
        Ok(t) => println!("Total: {}", t),
        Err(e) => println!("Error: {}", e),
    }
}
`, tests: [{ in: '1 2 3', out: 'Total: 6' }, { in: '1 two 3', out: 'Error: invalid digit found in string' }, { in: '10 -4', out: 'Total: 6' }], must: [[c`\?`, c`Use ~?~ after ~parse()~.`]], sol: c`use std::io;
use std::num::ParseIntError;

fn total(line: &str) -> Result<i32, ParseIntError> {
    let mut sum = 0;
    for word in line.split_whitespace() {
        let n: i32 = word.parse()?;
        sum += n;
    }
    Ok(sum)
}

fn main() {
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    match total(&line) {
        Ok(t) => println!("Total: {}", t),
        Err(e) => println!("Error: {}", e),
    }
}
` }),
] },

{ id: 'custom', title: 'Your own errors', icon: '🚨', desc: 'panic or Result? And error enums that say exactly what went wrong.',
  steps: [
  T('panic or Result?', c`**~panic!~** stops the program. Use it for bugs — things that should be impossible if the code is right.

**~Result~** is for failures you can expect: bad input, a missing file, a network that is down. The caller decides what to do.

~expect("message")~ is ~unwrap()~ with your own message, for when a failure really would be a bug.`, c`
let config = load().expect("the config file ships with the program");`),
  Q(c`A user types their age and might type letters. Should a bad age panic, or return a ~Result~?`, ['Panic: users should type properly', c`Return a ~Result~: bad input is expected, not a bug`, 'Neither: ignore it', 'Restart the program'], 1),
  T('Error enums', c`A ~String~ error is easy to print but hard for code to react to. An **enum** lists exactly what can go wrong, so callers can ~match~ on it — and the compiler makes sure they handle every case.`, c`
enum LoginError {
    UnknownUser,
    WrongPassword,
    Locked { minutes: u32 },     // a variant can carry details
}

match login(user, pass) {
    Ok(name) => println!("Welcome, {}!", name),
    Err(LoginError::UnknownUser) => println!("No such user"),
    Err(LoginError::WrongPassword) => println!("Wrong password"),
    Err(LoginError::Locked { minutes }) => println!("Try again in {} minutes", minutes),
}`),
  P(c`
enum CheckError {
    Empty,
    TooLong(usize),
}

fn check(name: &str) -> Result<&str, CheckError> {
    if name.is_empty() {
        return Err(CheckError::Empty);
    }
    if name.len() > 5 {
        return Err(CheckError::TooLong(name.len()));
    }
    Ok(name)
}

fn main() {
    for n in ["Ferris", "", "Corro"] {
        match check(n) {
            Ok(n) => println!("ok {}", n),
            Err(CheckError::Empty) => println!("empty"),
            Err(CheckError::TooLong(len)) => println!("too long ({})", len),
        }
    }
}`, 'too long (6)\nempty\nok Corro'),
  X({ q: c`Write ~fn login(user: &str, pass: &str) -> Result<String, LoginError>~. Rules: ~corro~ is locked · any user other than ~ferris~ or ~corro~ is unknown · ferris's password is ~crab123~. On success, return ~Welcome, ferris!~.

~main~ reads ~user password~ lines and prints the result.`, start: c`use std::io;

enum LoginError {
    UnknownUser,
    WrongPassword,
    Locked,
}

// write login here

fn main() {
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let p: Vec<&str> = line.split_whitespace().collect();
        match login(p[0], p[1]) {
            Ok(msg) => println!("{}", msg),
            Err(LoginError::UnknownUser) => println!("Error: no such user"),
            Err(LoginError::WrongPassword) => println!("Error: wrong password"),
            Err(LoginError::Locked) => println!("Error: account locked"),
        }
    }
}
`, tests: [{ in: 'ferris crab123\nferris fish\ncorro crab123\nbob hunter2', out: 'Welcome, ferris!\nError: wrong password\nError: account locked\nError: no such user' }], must: [[c`fn\s+login\s*\(`, c`Write ~fn login(user: &str, pass: &str) -> Result<String, LoginError>~.`]], sol: c`use std::io;

enum LoginError {
    UnknownUser,
    WrongPassword,
    Locked,
}

fn login(user: &str, pass: &str) -> Result<String, LoginError> {
    if user == "corro" {
        return Err(LoginError::Locked);
    }
    if user != "ferris" {
        return Err(LoginError::UnknownUser);
    }
    if pass != "crab123" {
        return Err(LoginError::WrongPassword);
    }
    Ok(format!("Welcome, {}!", user))
}

fn main() {
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let p: Vec<&str> = line.split_whitespace().collect();
        match login(p[0], p[1]) {
            Ok(msg) => println!("{}", msg),
            Err(LoginError::UnknownUser) => println!("Error: no such user"),
            Err(LoginError::WrongPassword) => println!("Error: wrong password"),
            Err(LoginError::Locked) => println!("Error: account locked"),
        }
    }
}
` }),
  X({ q: c`This adds up numbers, one per line, but **panics** on a line that is not a number. Make it print ~Skipping <line>~ for those instead, and keep going.

~5~ ~x~ ~7~ → ~Skipping x~ then ~Total: 12~`, start: M(c`
    let mut total = 0;
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let n: i32 = line.trim().parse().unwrap();
        total += n;
    }
    println!("Total: {}", total);`), tests: [{ in: '5\nx\n7', out: 'Skipping x\nTotal: 12' }, { in: '1\n2', out: 'Total: 3' }, { in: 'a\nb', out: 'Skipping a\nSkipping b\nTotal: 0' }], not: [[c`parse\(\)\.unwrap\(\)`, c`Handle the parse ~Result~ instead of unwrapping it.`]], sol: M(c`
    let mut total = 0;
    for line in io::stdin().lines() {
        let line = line.unwrap();
        match line.trim().parse::<i32>() {
            Ok(n) => total += n,
            Err(_) => println!("Skipping {}", line.trim()),
        }
    }
    println!("Total: {}", total);`) }),
] },
],
quiz: [
  P(c`
match "12".parse::<u8>() {
    Ok(n) => println!("{}", n + 1),
    Err(_) => println!("error"),
}`, '13'),
  P(c`
match "300".parse::<u8>() {
    Ok(n) => println!("{}", n),
    Err(_) => println!("error"),
}`, 'error', c`A ~u8~ only holds 0 to 255, so 300 cannot be parsed into one.`),
  Q(c`What does ~let n: i32 = s.parse()?;~ do when ~s~ is not a number?`, ['Sets n to 0', 'Panics', 'Returns the error from the current function', 'Skips the line'], 2),
  Q(c`Which is the best fit for ~panic!~?`, ['A user typed a bad email address', 'A file the user picked does not exist', 'A situation the code should make impossible has happened', 'The network is down'], 2),
  F('Return the success value.', c`
fn half(n: i32) -> Result<i32, String> {
    if n % 2 != 0 {
        return Err(String::from("odd"));
    }
    [[Ok]](n / 2)
}`),
] });

/* ============ TOPIC 7: TRAITS, GENERICS & ITERATORS ============ */
topic({ id: 'traits', title: 'Traits & Iterators', icon: '🧩', color: '#b197fc', blurb: 'Shared behaviour, code for any type, and iterator chains.',
lessons: [
{ id: 'traits', title: 'Traits', icon: '🤝', desc: 'Promise that a type can do something.',
  steps: [
  T('trait', c`A **trait** is a list of methods. A type that implements the trait promises to have them. It is how Rust shares behaviour between types (other languages use interfaces).`, c`
trait Speak {
    fn speak(&self) -> String;

    fn greet(&self) -> String {          // a default: types get it for free
        format!("Hello! {}", self.speak())
    }
}

struct Dog;
struct Cat;

impl Speak for Dog {
    fn speak(&self) -> String { String::from("Woof") }
}

impl Speak for Cat {
    fn speak(&self) -> String { String::from("Meow") }
}`),
  P(c`
trait Speak {
    fn speak(&self) -> String;
}

struct Dog;
struct Crab;

impl Speak for Dog {
    fn speak(&self) -> String {
        String::from("Woof")
    }
}

impl Speak for Crab {
    fn speak(&self) -> String {
        String::from("Click click")
    }
}

fn main() {
    println!("{} / {}", Dog.speak(), Crab.speak());
}`, 'Woof / Click click'),
  T('Display', c`~println!("{}", x)~ works for any type that implements the standard **Display** trait. Implement it, and your type prints however you like.`, c`
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

println!("{}", Point { x: 3, y: -1 });   // (3, -1)`, c`~write!~ is ~println!~'s cousin: it writes into ~f~ instead of the screen. The ~fmt~ line looks scary, but you copy it the same way every time.`),
  Q(c`What is the difference between ~#[derive(Debug)]~ and implementing ~Display~?`, [c`None`, c`Debug (~{:?}~) is generated for you and shows the raw fields; Display (~{}~) you write yourself, for users`, c`Display is faster`, c`Debug only works on numbers`], 1),
  T('Accepting any type with a trait', c`~&impl Speak~ means "a reference to any type that implements Speak".`, c`
fn introduce(animal: &impl Speak) {
    println!("It says {}", animal.speak());
}

introduce(&Dog);
introduce(&Cat);`),
  X({ q: c`Make ~Money~ print as pounds and pence by implementing ~fmt::Display~:

~£12.05~ ~£0.99~ ~£1000.00~ (one per line)`, start: c`use std::fmt;

struct Money {
    pence: u64,
}

// write impl fmt::Display for Money here

fn main() {
    println!("{}", Money { pence: 1205 });
    println!("{}", Money { pence: 99 });
    println!("{}", Money { pence: 100000 });
}
`, tests: [{ out: '£12.05\n£0.99\n£1000.00' }], must: [[c`impl\s+fmt::Display\s+for\s+Money`, c`~impl fmt::Display for Money~`]], hint: c`~write!(f, "£{}.{:02}", self.pence / 100, self.pence % 100)~ — ~{:02}~ pads with a zero so 5 pence shows as 05.`, sol: c`use std::fmt;

struct Money {
    pence: u64,
}

impl fmt::Display for Money {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "£{}.{:02}", self.pence / 100, self.pence % 100)
    }
}

fn main() {
    println!("{}", Money { pence: 1205 });
    println!("{}", Money { pence: 99 });
    println!("{}", Money { pence: 100000 });
}
` }),
  X({ q: c`Implement the ~Shape~ trait for ~Circle~ and ~Square~ so ~main~ prints:

~circle: 3.14~
~square: 4.00~`, start: c`trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}

struct Circle {
    r: f64,
}

struct Square {
    side: f64,
}

// implement Shape for Circle and Square here

fn print_area(s: &impl Shape) {
    println!("{}: {:.2}", s.name(), s.area());
}

fn main() {
    print_area(&Circle { r: 1.0 });
    print_area(&Square { side: 2.0 });
}
`, tests: [{ out: 'circle: 3.14\nsquare: 4.00' }], must: [[c`impl\s+Shape\s+for\s+Circle`, c`~impl Shape for Circle~`], [c`impl\s+Shape\s+for\s+Square`, c`~impl Shape for Square~`]], sol: c`trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
}

struct Circle {
    r: f64,
}

struct Square {
    side: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.r * self.r
    }
    fn name(&self) -> String {
        String::from("circle")
    }
}

impl Shape for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
    fn name(&self) -> String {
        String::from("square")
    }
}

fn print_area(s: &impl Shape) {
    println!("{}: {:.2}", s.name(), s.area());
}

fn main() {
    print_area(&Circle { r: 1.0 });
    print_area(&Square { side: 2.0 });
}
` }),
] },

{ id: 'generics', title: 'Generics', icon: '🧬', desc: 'Write it once, use it for any type.',
  steps: [
  T('<T>', c`You have already used generic types: ~Vec<i32>~, ~Option<String>~, ~HashMap<&str, u32>~. The ~<...>~ fills in a type.

Your own functions and structs can do the same. ~T~ stands for "some type, chosen by whoever calls this".`, c`
fn first<T>(items: &[T]) -> &T {
    &items[0]
}

first(&vec![1, 2, 3]);         // works with numbers
first(&vec!["a", "b"]);        // and with text`, c`~&[T]~ is a **slice**: a borrowed view of a list. ~&v~ turns a ~Vec~ into one.`),
  T('Trait bounds', c`Inside a generic function, Rust only lets you do what **every** possible ~T~ can do. To compare with ~>~, promise that ~T~ can be compared: a **trait bound**.`, c`
fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {
    let mut big = items[0];
    for &item in items {
        if item > big {
            big = item;
        }
    }
    big
}`, c`~PartialOrd~ allows ~<~ and ~>~. ~Copy~ allows copying values out of the slice. ~+~ asks for both.`),
  P(c`
fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {
    let mut big = items[0];
    for &item in items {
        if item > big {
            big = item;
        }
    }
    big
}

fn main() {
    println!("{} {}", largest(&[3, 42, 7]), largest(&['r', 'u', 's', 't']));
}`, '42 u'),
  P(c`
struct Pair<T> {
    a: T,
    b: T,
}

impl<T: PartialOrd + Copy> Pair<T> {
    fn bigger(&self) -> T {
        if self.a > self.b { self.a } else { self.b }
    }
}

fn main() {
    let p = Pair { a: 2.5, b: 1.5 };
    println!("{}", p.bigger());
}`, '2.5'),
  Q(c`Why does ~largest~ need ~T: PartialOrd~?`, ['To make it faster', c`So that ~>~ can be used on values of type ~T~`, 'So that T can be printed', 'It does not need it'], 1),
  X({ q: c`Write ~fn count_matching<T: PartialEq>(items: &[T], target: T) -> usize~ that counts how many items equal ~target~. (~PartialEq~ allows ~==~.)

~main~ prints ~3~ then ~2~.`, start: c`// write count_matching here

fn main() {
    println!("{}", count_matching(&[1, 2, 1, 3, 1], 1));
    println!("{}", count_matching(&["a", "b", "a"], "a"));
}
`, tests: [{ out: '3\n2' }], must: [[c`fn\s+count_matching\s*<\s*T\s*:\s*PartialEq\s*>`, c`~fn count_matching<T: PartialEq>(...)~`]], sol: c`fn count_matching<T: PartialEq>(items: &[T], target: T) -> usize {
    let mut count = 0;
    for item in items {
        if *item == target {
            count += 1;
        }
    }
    count
}

fn main() {
    println!("{}", count_matching(&[1, 2, 1, 3, 1], 1));
    println!("{}", count_matching(&["a", "b", "a"], "a"));
}
` }),
  X({ q: c`Build a generic ~Stack<T>~ on top of a ~Vec<T>~. It needs ~new~, ~push~, ~pop~ (returns ~Option<T>~), ~peek~ (returns ~Option<&T>~ for the top item), ~len~ and ~is_empty~. ~main~ is written.`, start: c`struct Stack<T> {
    items: Vec<T>,
}

// write impl<T> Stack<T> here

fn main() {
    let mut s = Stack::new();
    s.push(1);
    s.push(2);
    s.push(3);
    println!("{:?}", s.peek());
    println!("{:?}", s.pop());
    println!("{}", s.len());
    s.pop();
    s.pop();
    println!("{:?} {}", s.pop(), s.is_empty());
}
`, tests: [{ out: 'Some(3)\nSome(3)\n2\nNone true' }], must: [[c`impl\s*<\s*T\s*>\s*Stack\s*<\s*T\s*>`, c`~impl<T> Stack<T> { ... }~`]], hint: c`Each method can hand the work to the Vec: ~self.items.pop()~, ~self.items.last()~, ~self.items.len()~, ~self.items.is_empty()~.`, sol: c`struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Stack<T> {
        Stack { items: Vec::new() }
    }
    fn push(&mut self, item: T) {
        self.items.push(item);
    }
    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }
    fn peek(&self) -> Option<&T> {
        self.items.last()
    }
    fn len(&self) -> usize {
        self.items.len()
    }
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}

fn main() {
    let mut s = Stack::new();
    s.push(1);
    s.push(2);
    s.push(3);
    println!("{:?}", s.peek());
    println!("{:?}", s.pop());
    println!("{}", s.len());
    s.pop();
    s.pop();
    println!("{:?} {}", s.pop(), s.is_empty());
}
` }),
] },

{ id: 'iterators', title: 'Closures & iterators', icon: '⛓️', desc: 'map, filter, sum, collect — whole loops in one line.',
  steps: [
  T('Closures', c`A **closure** is a small function with no name, written right where you need it. Parameters go between ~| |~. It can use variables from around it.`, c`
let double = |x: i32| x * 2;
println!("{}", double(5));      // 10

let bonus = 3;
let add_bonus = |x: i32| x + bonus;   // uses bonus from outside
println!("{}", add_bonus(5));   // 8`),
  T('Iterator chains', c`An **iterator** hands out values one at a time. Chain methods onto it, and finish with something that produces a result.`, c`
let v = vec![1, 2, 3, 4, 5, 6];

let evens: Vec<i32> = v.iter().filter(|x| *x % 2 == 0).cloned().collect();  // [2, 4, 6]
let squares: Vec<i32> = v.iter().map(|x| x * x).collect();                  // [1, 4, 9, ...]
let total: i32 = v.iter().sum();                                            // 21
let big = v.iter().filter(|x| **x > 3).count();                             // 3

for (i, x) in v.iter().enumerate() { }      // i is the position, x the value`, c`~map~ changes each value · ~filter~ keeps some · ~sum~, ~count~, ~max~, ~collect~ finish the chain. ~collect~ needs to know what to build, so give the variable a type.`),
  P(c`
let total: i32 = (1..=4).map(|x| x * x).sum();
println!("{}", total);`, '30'),
  P(c`
let v = vec![1, 2, 3, 4, 5];
let evens: Vec<i32> = v.into_iter().filter(|x| x % 2 == 0).collect();
println!("{:?}", evens);`, '[2, 4]'),
  P(c`
let words = vec!["ferris", "is", "cute"];
let caps: Vec<String> = words.iter().map(|w| w.to_uppercase()).collect();
println!("{}", caps.join(" "));`, 'FERRIS IS CUTE'),
  P(c`
let bonus = 10;
let add = |x: i32| x + bonus;
println!("{}", add(5));`, '15'),
  P(c`
for (i, c) in "abc".chars().enumerate() {
    println!("{} {}", i, c);
}`, '0 a\n1 b\n2 c'),
  Q(c`Why does ~let v: Vec<i32> = ... .collect();~ need the ~Vec<i32>~?`, ['It does not', c`~collect~ can build many kinds of collection, so it needs to be told which`, 'To make it faster', 'Closures need types'], 1),
  X({ q: c`Read numbers on one line and print the sum of the **squares** of the **odd** ones, using ~filter~, ~map~ and ~sum~ (no ~for~ loop):

~1 2 3 4 5~ → ~35~ (1 + 9 + 25)`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let nums: Vec<i32> = line.split_whitespace().map(|w| w.parse().unwrap()).collect();
    println!("{:?}", nums);`), tests: [{ in: '1 2 3 4 5', out: '35' }, { in: '2 4', out: '0' }, { in: '-3 7', out: '58' }], must: [[c`filter`, c`Use ~filter~.`], [c`sum`, c`Finish with ~sum()~.`]], not: [[c`\bfor\b`, c`Do it with an iterator chain, no ~for~ loop.`]], sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let nums: Vec<i32> = line.split_whitespace().map(|w| w.parse().unwrap()).collect();
    let total: i32 = nums.iter().filter(|n| *n % 2 != 0).map(|n| n * n).sum();
    println!("{}", total);`) }),
  X({ q: c`Read a line of words. Print how many are **longer than 3 letters**, and the longest word:

~ferris the crab loves rust~ →
~Long words: 4~
~Longest: ferris~`, start: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let words: Vec<&str> = line.split_whitespace().collect();
    println!("{:?}", words);`), tests: [{ in: 'ferris the crab loves rust', out: 'Long words: 4\nLongest: ferris' }, { in: 'a bb ccc', out: 'Long words: 0\nLongest: ccc' }], must: [[c`filter`, c`Count with ~filter(...).count()~.`]], hint: c`~words.iter().filter(|w| w.len() > 3).count()~, and ~words.iter().max_by_key(|w| w.len())~ gives an ~Option~ with the longest.`, sol: M(c`
    let mut line = String::new();
    io::stdin().read_line(&mut line).unwrap();
    let words: Vec<&str> = line.split_whitespace().collect();
    let long = words.iter().filter(|w| w.len() > 3).count();
    let longest = words.iter().max_by_key(|w| w.len()).unwrap();
    println!("Long words: {}", long);
    println!("Longest: {}", longest);`) }),
] },
],
quiz: [
  P(c`
let v = vec![3, 8, 1];
let n = v.iter().filter(|x| **x > 2).count();
println!("{}", n);`, '2'),
  P(c`
let s: String = vec!["a", "b", "c"].iter().map(|x| x.to_uppercase()).collect();
println!("{}", s);`, 'ABC', c`~collect~ into a ~String~ glues the pieces together.`),
  Q(c`In ~fn show<T: Display>(x: T)~, what does ~: Display~ do?`, ['Prints x automatically', 'Only allows types that can be printed with {}', 'Makes T a string', 'Nothing'], 1),
  Q(c`What is ~|x| x + 1~?`, ['A pattern', 'A closure: a small unnamed function', 'An OR between x and x + 1', 'A comment'], 1),
  F('Implement the trait for Dog.', c`
trait Speak {
    fn speak(&self) -> String;
}

struct Dog;

[[impl]] Speak [[for]] Dog {
    fn speak(&self) -> String {
        String::from("Woof")
    }
}`),
] });

/* ============ TOPIC 8: FINAL BOSS ============ */
topic({ id: 'boss', title: 'Final Boss', icon: '👑', color: '#c0c7ff', blurb: 'Three bigger programs that use everything.',
lessons: [
{ id: 'projects', title: 'Capstone projects', icon: '🏆', desc: 'A to-do list, a grade book and a bank with proper errors.',
  steps: [
  T('No new syntax', c`Three realistic programs. Plan the types first (a struct? an enum? a map?), write one piece at a time and Run often. Read every compiler message: in Rust, they are a to-do list with hints.`),
  X({ q: c`**To-do list.** Read commands, one per line, until ~quit~ or the input ends:

~add <task>~ adds a task · ~done <number>~ marks task N (from 1) done, or prints ~No such task~ · ~list~ prints every task as ~1. [x] Buy milk~ or ~2. [ ] Walk dog~, or ~Nothing to do~ if there are none.`, start: c`use std::io;

struct Task {
    text: String,
    done: bool,
}

fn main() {
    let mut tasks: Vec<Task> = Vec::new();
    for line in io::stdin().lines() {
        let line = line.unwrap();
        if line == "quit" {
            break;
        }
        // handle add, done and list here
    }
}
`, tests: [{ in: 'add Buy milk\nadd Walk dog\ndone 1\nlist\nquit', out: '1. [x] Buy milk\n2. [ ] Walk dog' }, { in: 'list\nadd Learn Rust\ndone 3\nlist', out: 'Nothing to do\nNo such task\n1. [ ] Learn Rust' }], hint: c`~if let Some(text) = line.strip_prefix("add ")~ gives you the task text. For ~done~, parse the number and check ~n >= 1 && n <= tasks.len()~ before ~tasks[n - 1].done = true~.`, sol: c`use std::io;

struct Task {
    text: String,
    done: bool,
}

fn main() {
    let mut tasks: Vec<Task> = Vec::new();
    for line in io::stdin().lines() {
        let line = line.unwrap();
        if line == "quit" {
            break;
        }
        if let Some(text) = line.strip_prefix("add ") {
            tasks.push(Task { text: text.to_string(), done: false });
        } else if let Some(num) = line.strip_prefix("done ") {
            match num.trim().parse::<usize>() {
                Ok(n) if n >= 1 && n <= tasks.len() => tasks[n - 1].done = true,
                _ => println!("No such task"),
            }
        } else if line == "list" {
            if tasks.is_empty() {
                println!("Nothing to do");
            }
            for (i, t) in tasks.iter().enumerate() {
                println!("{}. [{}] {}", i + 1, if t.done { "x" } else { " " }, t.text);
            }
        }
    }
}
` }),
  X({ q: c`**Grade book.** Read lines of ~name score~. Then print every student in alphabetical order with their average (one decimal) and how many scores they have, and finally the student with the best average (the first alphabetically if there is a tie):

~ada: 85.0 (2 scores)~ … ~Top: cy~`, start: c`use std::collections::BTreeMap;
use std::io;

fn main() {
    let mut book: BTreeMap<String, Vec<u32>> = BTreeMap::new();
    for line in io::stdin().lines() {
        let line = line.unwrap();
        println!("{}", line);
    }
    println!("{}", book.len());
}
`, tests: [{ in: 'ada 90\nbob 70\nada 80\ncy 88', out: 'ada: 85.0 (2 scores)\nbob: 70.0 (1 score)\ncy: 88.0 (1 score)\nTop: cy' }, { in: 'zed 50\namy 50', out: 'amy: 50.0 (1 score)\nzed: 50.0 (1 score)\nTop: amy' }], hint: c`~book.entry(name.to_string()).or_insert(Vec::new()).push(score);~ — then loop over ~&book~, work out each average, and remember the best one (use ~>~, not ~>=~, so the first wins a tie).`, sol: c`use std::collections::BTreeMap;
use std::io;

fn main() {
    let mut book: BTreeMap<String, Vec<u32>> = BTreeMap::new();
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let p: Vec<&str> = line.split_whitespace().collect();
        let score: u32 = p[1].parse().unwrap();
        book.entry(p[0].to_string()).or_insert(Vec::new()).push(score);
    }
    let mut top = String::new();
    let mut best = -1.0;
    for (name, scores) in &book {
        let sum: u32 = scores.iter().sum();
        let avg = sum as f64 / scores.len() as f64;
        let word = if scores.len() == 1 { "score" } else { "scores" };
        println!("{}: {:.1} ({} {})", name, avg, scores.len(), word);
        if avg > best {
            best = avg;
            top = name.clone();
        }
    }
    println!("Top: {}", top);
}
` }),
  X({ q: c`**Bank.** The error type and ~main~ are written. Write ~impl Bank~ with ~open~, ~deposit~, ~withdraw~ (all returning ~Result<(), BankError>~) and ~balance~ (returning ~Result<u32, BankError>~). Errors: opening an existing account, any other action on a missing account, and withdrawing more than the balance.`, start: c`use std::collections::HashMap;
use std::fmt;
use std::io;

enum BankError {
    NoAccount(String),
    AlreadyExists(String),
    Insufficient { name: String, balance: u32 },
}

impl fmt::Display for BankError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            BankError::NoAccount(n) => write!(f, "no account {}", n),
            BankError::AlreadyExists(n) => write!(f, "{} already exists", n),
            BankError::Insufficient { name, balance } => write!(f, "{} only has {}", name, balance),
        }
    }
}

struct Bank {
    accounts: HashMap<String, u32>,
}

// write impl Bank here

fn main() {
    let mut bank = Bank { accounts: HashMap::new() };
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let p: Vec<&str> = line.split_whitespace().collect();
        let amount = p.get(2).map(|a| a.parse::<u32>().unwrap()).unwrap_or(0);
        let result = match p[0] {
            "open" => bank.open(p[1]),
            "deposit" => bank.deposit(p[1], amount),
            "withdraw" => bank.withdraw(p[1], amount),
            _ => bank.balance(p[1]).map(|b| println!("{}: {}", p[1], b)),
        };
        if let Err(e) = result {
            println!("Error: {}", e);
        }
    }
}
`, tests: [{ in: 'open ada\ndeposit ada 50\nwithdraw ada 80\nwithdraw ada 20\nbalance ada\ndeposit bob 5\nopen ada', out: 'Error: ada only has 50\nada: 30\nError: no account bob\nError: ada already exists' }], must: [[c`impl\s+Bank`, c`Write an ~impl Bank { ... }~ block.`]], hint: c`~self.accounts.get_mut(name)~ gives an ~Option<&mut u32>~: ~None~ means no account. ~.ok_or(BankError::NoAccount(name.to_string()))?~ turns that ~None~ into an error and returns it.`, sol: c`use std::collections::HashMap;
use std::fmt;
use std::io;

enum BankError {
    NoAccount(String),
    AlreadyExists(String),
    Insufficient { name: String, balance: u32 },
}

impl fmt::Display for BankError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            BankError::NoAccount(n) => write!(f, "no account {}", n),
            BankError::AlreadyExists(n) => write!(f, "{} already exists", n),
            BankError::Insufficient { name, balance } => write!(f, "{} only has {}", name, balance),
        }
    }
}

struct Bank {
    accounts: HashMap<String, u32>,
}

impl Bank {
    fn open(&mut self, name: &str) -> Result<(), BankError> {
        if self.accounts.contains_key(name) {
            return Err(BankError::AlreadyExists(name.to_string()));
        }
        self.accounts.insert(name.to_string(), 0);
        Ok(())
    }

    fn deposit(&mut self, name: &str, amount: u32) -> Result<(), BankError> {
        let balance = self.accounts.get_mut(name).ok_or(BankError::NoAccount(name.to_string()))?;
        *balance += amount;
        Ok(())
    }

    fn withdraw(&mut self, name: &str, amount: u32) -> Result<(), BankError> {
        let balance = self.accounts.get_mut(name).ok_or(BankError::NoAccount(name.to_string()))?;
        if amount > *balance {
            return Err(BankError::Insufficient { name: name.to_string(), balance: *balance });
        }
        *balance -= amount;
        Ok(())
    }

    fn balance(&self, name: &str) -> Result<u32, BankError> {
        self.accounts.get(name).copied().ok_or(BankError::NoAccount(name.to_string()))
    }
}

fn main() {
    let mut bank = Bank { accounts: HashMap::new() };
    for line in io::stdin().lines() {
        let line = line.unwrap();
        let p: Vec<&str> = line.split_whitespace().collect();
        let amount = p.get(2).map(|a| a.parse::<u32>().unwrap()).unwrap_or(0);
        let result = match p[0] {
            "open" => bank.open(p[1]),
            "deposit" => bank.deposit(p[1], amount),
            "withdraw" => bank.withdraw(p[1], amount),
            _ => bank.balance(p[1]).map(|b| println!("{}: {}", p[1], b)),
        };
        if let Err(e) = result {
            println!("Error: {}", e);
        }
    }
}
` }),
] },
],
quiz: [
  P(c`
let v = vec![2, 4, 6];
let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();
println!("{:?}", doubled);`, '[4, 8, 12]'),
  P(c`
let name = String::from("Ferris");
let len = name.len();
let moved = name;
println!("{} {}", moved, len);`, 'Ferris 6'),
  Q(c`Which tool fits "a value that might not exist"?`, [c`~Result~`, c`~Option~`, c`~panic!~`, c`~null~`], 1),
  Q(c`Which tool fits "an action that might fail, and the caller should know why"?`, [c`~Result~`, c`~Option~`, c`~unwrap~`, c`~loop~`], 0),
] });
