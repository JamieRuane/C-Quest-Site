/* ============ JavaScript TOPIC 6: ARRAY METHODS ============ */
topic({ id: 'callbacks', title: 'Callbacks & Array Methods', icon: '♻️', color: '#ffc800', blurb: 'Hand a function to another function: forEach, map, filter, reduce.',
lessons: [
{ id: 'foreach', title: 'Callbacks and forEach', icon: '🤙', desc: 'Passing a function as an argument.',
  v: [['4:10:49', '4:18:05', 'Callbacks'], ['4:18:05', '4:26:07', 'forEach()']],
  steps: [
  T('Functions as arguments', c`A **callback** is a function you pass to another function, for it to call later. Arrays have methods built around this idea.`, c`
const names = ["Ada", "Bo", "Cy"];

names.forEach(name => {
    console.log("Hi " + name);
});

// the callback can also receive the index
names.forEach((name, i) => console.log(i + ": " + name));`),
  P(c`
let total = 0;
[2, 4, 6].forEach(n => total += n);
console.log(total);`, '12'),
  X({ q: c`Use ~forEach~ to print every item with its position, starting from 1:

~1. Pizza~ · ~2. Burger~ · ~3. Sushi~ (one per line)`, start: c`const menu = ["Pizza", "Burger", "Sushi"];`, tests: [{ out: '1. Pizza\n2. Burger\n3. Sushi' }], must: [[c`\.forEach\s*\(`, c`Use ~forEach~.`]], sol: c`
const menu = ["Pizza", "Burger", "Sushi"];
menu.forEach((item, i) => console.log(${tl('${i + 1}. ${item}')}));` }),
] },

{ id: 'map-filter', title: 'map and filter', icon: '🗺️', desc: 'Transform every item, or keep only some.',
  v: [['4:26:07', '4:33:08', 'map()'], ['4:33:08', '4:39:37', 'filter()']],
  steps: [
  T('map: transform every item', c`~map~ calls your function on every item and collects the results into a **new** array of the same length.`, c`
const prices = [10, 20, 30];
const withTax = prices.map(p => p * 1.2);    // [12, 24, 36]`),
  T('filter: keep some items', c`~filter~ keeps only the items for which your function returns ~true~.`, c`
const ages = [12, 25, 17, 40];
const adults = ages.filter(a => a >= 18);    // [25, 40]`, c`Both return new arrays and leave the original alone — so you can chain them: ~ages.filter(...).map(...)~.`),
  P(c`console.log([1, 2, 3, 4].map(n => n * n).join(" "));`, '1 4 9 16'),
  P(c`console.log([5, 12, 8, 21].filter(n => n > 10).length);`, '2'),
  X({ q: c`Use ~map~ to turn every name into upper case, and print them joined with spaces.`, start: c`const names = ["ada", "grace", "linus"];`, tests: [{ out: 'ADA GRACE LINUS' }], must: [[c`\.map\s*\(`, c`Use ~map~.`]], sol: c`
const names = ["ada", "grace", "linus"];
console.log(names.map(n => n.toUpperCase()).join(" "));` }),
  X({ q: c`Keep only the **even** numbers, then double them. Print the result joined with commas.`, start: c`const nums = [1, 2, 3, 4, 5, 6, 7, 8];`, tests: [{ out: '4,8,12,16' }], must: [[c`\.filter\s*\(`, c`Use ~filter~.`], [c`\.map\s*\(`, c`Use ~map~.`]], sol: c`
const nums = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(nums.filter(n => n % 2 === 0).map(n => n * 2).join(","));` }),
] },

{ id: 'reduce', title: 'reduce, find, some, every', icon: '🧺', desc: 'Boil an array down to one answer.',
  v: [['4:39:37', '4:45:07', 'reduce()']],
  steps: [
  T('reduce: many values into one', c`~reduce~ walks through the array carrying an **accumulator** — a running total — and returns its final value. The second argument is the starting value.`, c`
const total = [5, 10, 15].reduce((sum, n) => sum + n, 0);   // 30
const biggest = [3, 9, 4].reduce((max, n) => n > max ? n : max);   // 9`),
  T('Asking questions', c`Three more methods answer questions about an array:`, c`
const nums = [3, 8, 12, 5];
nums.find(n => n > 6);        // 8     the first match (or undefined)
nums.some(n => n > 10);       // true  at least one matches
nums.every(n => n > 1);       // true  all of them match`),
  P(c`console.log([1, 2, 3, 4].reduce((acc, n) => acc * n, 1));`, '24'),
  P(c`console.log([4, 7, 10].find(n => n % 2 === 1), [4, 6].some(n => n > 5));`, '7 true'),
  X({ q: c`Use ~reduce~ to add up the prices in the cart, and print ~Total: 41.5~.`, start: c`const cart = [12.5, 9, 20];`, tests: [{ out: 'Total: 41.5' }], must: [[c`\.reduce\s*\(`, c`Use ~reduce~.`]], sol: c`
const cart = [12.5, 9, 20];
const total = cart.reduce((sum, p) => sum + p, 0);
console.log("Total: " + total);` }),
  X({ q: c`Print ~all passed~ if **every** score is at least 50, otherwise print the **first** score below 50.`, start: c`const scores = [72, 64, 45, 90, 38];`, tests: [{ out: '45' }], must: [[c`\.every\s*\(`, c`Use ~every~.`], [c`\.find\s*\(`, c`Use ~find~.`]], sol: c`
const scores = [72, 64, 45, 90, 38];
if (scores.every(s => s >= 50)) {
    console.log("all passed");
} else {
    console.log(scores.find(s => s < 50));
}` }),
] },
],
quiz: [
  P(c`console.log([1, 2, 3].map(n => n + 1).join(""));`, '234'),
  P(c`console.log([10, 15, 20, 25].filter(n => n % 10 === 0).length);`, '2'),
  P(c`console.log([2, 3, 4].reduce((a, n) => a + n, 10));`, '19'),
  Q(c`Which method gives back a **new array of the same length**?`, ['filter', 'map', 'find', 'reduce'], 1),
  Q(c`What does ~find~ return if nothing matches?`, ['null', '-1', 'undefined', 'An empty array'], 2),
] });

/* ============ JavaScript TOPIC 7: OBJECTS ============ */
topic({ id: 'objects', title: 'Objects', icon: '🧍', color: '#ff4b4b', blurb: 'Group related data, add methods, destructure and convert to JSON.',
lessons: [
{ id: 'literals', title: 'Objects and properties', icon: '📦', desc: 'Keys, values, dots and brackets.',
  v: [['5:00:40', '5:07:40', 'JavaScript objects']],
  steps: [
  T('Named values together', c`An **object** groups related values under names (keys).`, c`
const player = {
    name: "Link",
    level: 7,
    online: true,
};

console.log(player.name);         // Link
console.log(player["level"]);     // 7 — brackets work too
player.level++;                   // change a property
player.weapon = "sword";          // add one
delete player.online;             // remove one`, c`Use brackets when the key is in a variable: ~player[key]~.`),
  P(c`
const p = { x: 3, y: 4 };
p.x = p.x * 2;
console.log(p.x + p.y);`, '10'),
  P(c`
const user = { name: "Ada" };
const key = "name";
console.log(user[key], user.age);`, 'Ada undefined', c`Reading a property that does not exist gives ~undefined~, not an error.`),
  T('Looping over an object', c`~Object.keys~, ~Object.values~ and ~Object.entries~ turn an object into arrays you can loop over.`, c`
const stock = { apples: 4, pears: 0, kiwis: 9 };
for (const [fruit, count] of Object.entries(stock)) {
    console.log(fruit + ": " + count);
}`),
  X({ q: c`Add up all the values in ~stock~ and print the total.`, start: c`const stock = { apples: 4, pears: 0, kiwis: 9, plums: 12 };`, tests: [{ out: '25' }], sol: c`
const stock = { apples: 4, pears: 0, kiwis: 9, plums: 12 };
let total = 0;
for (const n of Object.values(stock)) total += n;
console.log(total);`, hint: c`~Object.values(stock)~ is an array of the numbers.` }),
  X({ q: c`**Word counter.** Read one line of text and print how many times each word appears, in the order the words first appear:

~the cat and the hat~ →
~the: 2~
~cat: 1~
~and: 1~
~hat: 1~`, tests: [{ in: 'the cat and the hat\n', has: ['the: 2\ncat: 1\nand: 1\nhat: 1'] }, { in: 'go go go\n', has: ['go: 3'] }], sol: c`
const words = prompt("Text: ").split(" ");
const counts = {};
for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
}
for (const [w, n] of Object.entries(counts)) {
    console.log(w + ": " + n);
}`, hint: c`~counts[w] = (counts[w] || 0) + 1~ — start at 0 the first time a word is seen.` }),
] },

{ id: 'methods', title: 'Methods and this', icon: '👈', desc: 'Functions that belong to an object.',
  v: [['5:07:40', '5:12:07', 'What is this']],
  steps: [
  T('this', c`A function stored in an object is a **method**. Inside it, ~this~ means "the object the method was called on".`, c`
const account = {
    owner: "Ada",
    balance: 100,
    deposit(amount) {
        this.balance += amount;
    },
    describe() {
        return this.owner + " has " + this.balance;
    },
};

account.deposit(50);
console.log(account.describe());   // Ada has 150`, c`Arrow functions do **not** get their own ~this~, so do not use them for methods like these.`),
  P(c`
const counter = {
    n: 0,
    up() { this.n++; return this; },
};
counter.up().up().up();
console.log(counter.n);`, '3', c`Each ~up()~ returns the object itself, so the calls can be chained.`),
  X({ q: c`Add a method ~area()~ to the rectangle that returns ~width * height~, using ~this~.`, start: c`
const rect = {
    width: 4,
    height: 5,
    // add area() here
};
console.log(rect.area());`, tests: [{ out: '20' }], must: [[c`this\.width`, c`Use ~this.width~ and ~this.height~.`]], sol: c`
const rect = {
    width: 4,
    height: 5,
    area() {
        return this.width * this.height;
    },
};
console.log(rect.area());` }),
] },

{ id: 'destructuring', title: 'Destructuring & nesting', icon: '💥', desc: 'Unpack objects and arrays, and work with lists of objects.',
  v: [['6:01:28', '6:10:08', 'Destructuring'], ['6:10:08', '6:19:21', 'Nested objects'], ['6:19:21', '6:29:21', 'Arrays of objects']],
  steps: [
  T('Destructuring', c`**Destructuring** pulls values out into variables in one line.`, c`
const user = { name: "Ada", age: 36, city: "London" };
const { name, age } = user;              // two variables from an object

const [first, second] = [10, 20, 30];    // from an array by position
[a, b] = [b, a];                         // swap two variables`),
  P(c`
const { x, y = 5 } = { x: 1 };
console.log(x, y);`, '1 5', c`~y~ is missing from the object, so its default is used.`),
  T('Arrays of objects', c`Real data is often a list of objects. All the array methods work on them:`, c`
const products = [
    { name: "Mouse",    price: 20, stock: 40 },
    { name: "Monitor",  price: 189, stock: 6 },
    { name: "Keyboard", price: 50, stock: 0 },
];

const inStock = products.filter(p => p.stock > 0).map(p => p.name);
const cheapest = [...products].sort((a, b) => a.price - b.price)[0];`),
  X({ q: c`Print the names of products that cost **under 100** and are in stock, joined with commas.`, start: c`
const products = [
    { name: "Mouse", price: 20, stock: 40 },
    { name: "Monitor", price: 189, stock: 6 },
    { name: "Keyboard", price: 50, stock: 0 },
    { name: "Cable", price: 8, stock: 120 },
];`, tests: [{ out: 'Mouse,Cable' }], sol: c`
const products = [
    { name: "Mouse", price: 20, stock: 40 },
    { name: "Monitor", price: 189, stock: 6 },
    { name: "Keyboard", price: 50, stock: 0 },
    { name: "Cable", price: 8, stock: 120 },
];
console.log(products.filter(p => p.price < 100 && p.stock > 0).map(p => p.name).join(","));` }),
  X({ q: c`Print the name of the **oldest** student, using ~reduce~.`, start: c`
const students = [
    { name: "Ana", age: 19 },
    { name: "Ben", age: 23 },
    { name: "Cy", age: 21 },
];`, tests: [{ out: 'Ben' }], must: [[c`\.reduce\s*\(`, c`Use ~reduce~.`]], sol: c`
const students = [
    { name: "Ana", age: 19 },
    { name: "Ben", age: 23 },
    { name: "Cy", age: 21 },
];
const oldest = students.reduce((best, s) => s.age > best.age ? s : best);
console.log(oldest.name);` }),
] },

{ id: 'json', title: 'JSON', icon: '📄', desc: 'Turn objects into text and back.',
  v: [['10:57:00', '11:07:07', 'JSON files']],
  steps: [
  T('Objects as text', c`**JSON** is how JavaScript objects travel between programs and over the internet: as text.`, c`
const user = { name: "Ada", langs: ["C", "JS"] };

const text = JSON.stringify(user);   // '{"name":"Ada","langs":["C","JS"]}'
const back = JSON.parse(text);       // an object again
console.log(back.langs[1]);          // JS`, c`In JSON, keys must be in double quotes. ~JSON.parse~ throws an error on invalid text.`),
  P(c`console.log(JSON.stringify({ a: 1, b: [true, null] }));`, '{"a":1,"b":[true,null]}'),
  P(c`
const data = JSON.parse('{"score": 42, "tags": ["x", "y"]}');
console.log(data.score + data.tags.length);`, '44'),
  X({ q: c`Read a line of JSON describing a player, like ~{"name":"Link","hp":80}~, and print ~Link has 80 HP~.`, tests: [{ in: '{"name":"Link","hp":80}\n', has: ['Link has 80 HP'] }, { in: '{"hp":5,"name":"Zelda"}\n', has: ['Zelda has 5 HP'] }], must: [[c`JSON\.parse`, c`Use ~JSON.parse~.`]], sol: c`
const player = JSON.parse(prompt("JSON: "));
console.log(${tl('${player.name} has ${player.hp} HP')});` }),
] },
],
quiz: [
  P(c`
const o = { a: 1, b: 2 };
o.c = o.a + o.b;
console.log(Object.keys(o).length, o.c);`, '3 3'),
  Q(c`Inside a method, what does ~this~ refer to?`, ['The global object', 'The object the method was called on', 'The method itself', 'The previous object'], 1),
  P(c`
const [p, , q] = [1, 2, 3];
console.log(p + q);`, '4', c`The empty slot skips the second value.`),
  P(c`console.log(JSON.parse("[1, 2, 3]").length);`, '3'),
  F('Pull name out of the object.', c`const [[{ name }~{name}]] = { name: "Ada", age: 36 };`),
] });

/* ============ JavaScript TOPIC 8: CLASSES ============ */
topic({ id: 'classes', title: 'Classes', icon: '🏭', color: '#1c8ef6', blurb: 'Blueprints for objects: constructors, static, inheritance, getters.',
lessons: [
{ id: 'class', title: 'Classes and constructors', icon: '🏭', desc: 'One blueprint, many objects.',
  v: [['5:12:07', '5:17:38', 'Constructors'], ['5:17:38', '5:23:47', 'Classes']],
  steps: [
  T('A blueprint', c`A **class** describes what a kind of object looks like. ~constructor~ runs when you make one with ~new~.`, c`
class Player {
    constructor(name, level = 1) {
        this.name = name;
        this.level = level;
    }
    levelUp() {
        this.level++;
        return this.name + " reached level " + this.level;
    }
}

const hero = new Player("Link");
console.log(hero.levelUp());   // Link reached level 2`),
  P(c`
class Box {
    constructor(w, h) { this.w = w; this.h = h; }
    area() { return this.w * this.h; }
}
const a = new Box(2, 3), b = new Box(4, 5);
console.log(a.area() + b.area());`, '26'),
  X({ q: c`Write a class ~BankAccount~ with an ~owner~ and a ~balance~ (starting at 0), plus methods ~deposit(amount)~ and ~withdraw(amount)~. ~withdraw~ must refuse to go below zero by printing ~Insufficient funds~.`, start: c`
// write BankAccount here


const acc = new BankAccount("Ada");
acc.deposit(100);
acc.withdraw(30);
acc.withdraw(500);
console.log(acc.owner + ": " + acc.balance);`, tests: [{ out: 'Insufficient funds\nAda: 70' }], must: [[c`\bclass\s+BankAccount`, c`Write a ~class BankAccount~.`]], sol: c`
class BankAccount {
    constructor(owner) {
        this.owner = owner;
        this.balance = 0;
    }
    deposit(amount) {
        this.balance += amount;
    }
    withdraw(amount) {
        if (amount > this.balance) {
            console.log("Insufficient funds");
            return;
        }
        this.balance -= amount;
    }
}

const acc = new BankAccount("Ada");
acc.deposit(100);
acc.withdraw(30);
acc.withdraw(500);
console.log(acc.owner + ": " + acc.balance);` }),
] },

{ id: 'static', title: 'Static members', icon: '⚡', desc: 'Things that belong to the class itself.',
  v: [['5:23:47', '5:31:50', 'Static keyword']],
  steps: [
  T('static', c`A ~static~ property or method belongs to the **class**, not to each object. Use it for counters and helpers.`, c`
class User {
    static count = 0;
    constructor(name) {
        this.name = name;
        User.count++;
    }
    static describe() {
        return User.count + " users";
    }
}
new User("Ada"); new User("Bo");
console.log(User.describe());   // 2 users`),
  P(c`
class MathPlus {
    static square(n) { return n * n; }
}
console.log(MathPlus.square(7));`, '49'),
  X({ q: c`Give ~Ticket~ a static counter so each new ticket gets the next number automatically. The code below should print ~1 2 3~.`, start: c`
class Ticket {
    constructor() {
        // give each ticket a number
    }
}

const a = new Ticket(), b = new Ticket(), c = new Ticket();
console.log(a.number, b.number, c.number);`, tests: [{ out: '1 2 3' }], must: [[c`\bstatic\b`, c`Use a ~static~ counter.`]], sol: c`
class Ticket {
    static next = 1;
    constructor() {
        this.number = Ticket.next++;
    }
}

const a = new Ticket(), b = new Ticket(), c = new Ticket();
console.log(a.number, b.number, c.number);` }),
] },

{ id: 'inherit', title: 'Inheritance and super', icon: '🐇', desc: 'Build on an existing class.',
  v: [['5:31:50', '5:38:53', 'Inheritance'], ['5:38:53', '5:48:14', 'Super keyword']],
  steps: [
  T('extends', c`A class can **extend** another, inheriting its properties and methods. ~super(...)~ calls the parent's constructor; ~super.method()~ calls the parent's version of a method.`, c`
class Animal {
    constructor(name) { this.name = name; }
    speak() { return this.name + " makes a sound"; }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);              // must come first
        this.breed = breed;
    }
    speak() {                     // override the parent's version
        return this.name + " barks";
    }
}

console.log(new Dog("Rex", "lab").speak());   // Rex barks`),
  P(c`
class A { hi() { return "A"; } }
class B extends A { hi() { return super.hi() + "B"; } }
console.log(new B().hi());`, 'AB'),
  Q(c`In a child constructor, what must happen before you use ~this~?`, [c`Call ~super(...)~`, c`Call ~new~`, 'Nothing', c`Declare ~static~`], 0),
  X({ q: c`Make ~Square~ extend ~Rectangle~. A square only needs one side length, so pass it to ~super~ twice.`, start: c`
class Rectangle {
    constructor(w, h) { this.w = w; this.h = h; }
    area() { return this.w * this.h; }
}

// write Square here


console.log(new Square(5).area());`, tests: [{ out: '25' }], must: [[c`extends\s+Rectangle`, c`~class Square extends Rectangle~`], [c`super\s*\(`, c`Call ~super(...)~.`]], sol: c`
class Rectangle {
    constructor(w, h) { this.w = w; this.h = h; }
    area() { return this.w * this.h; }
}

class Square extends Rectangle {
    constructor(side) {
        super(side, side);
    }
}

console.log(new Square(5).area());` }),
] },

{ id: 'getters', title: 'Getters and setters', icon: '🔐', desc: 'Properties that run code.',
  v: [['5:48:14', '6:01:28', 'Getters & setters']],
  steps: [
  T('get and set', c`A **getter** looks like a property but runs a function when read. A **setter** runs when a value is assigned — perfect for checking values.`, c`
class Temperature {
    constructor(celsius) { this.celsius = celsius; }
    get fahrenheit() { return this.celsius * 9 / 5 + 32; }
    set fahrenheit(f) { this.celsius = (f - 32) * 5 / 9; }
}

const t = new Temperature(100);
console.log(t.fahrenheit);   // 212 — no brackets
t.fahrenheit = 32;
console.log(t.celsius);      // 0`),
  P(c`
class Circle {
    constructor(r) { this.r = r; }
    get diameter() { return this.r * 2; }
}
console.log(new Circle(4).diameter);`, '8'),
  X({ q: c`Add a setter for ~age~ that refuses negative numbers by printing ~Invalid age~ and keeping the old value. Store the real value in ~this._age~.`, start: c`
class Person {
    constructor(age) { this._age = age; }
    get age() { return this._age; }
    // add the setter here
}

const p = new Person(30);
p.age = -5;
p.age = 31;
console.log(p.age);`, tests: [{ out: 'Invalid age\n31' }], must: [[c`\bset\s+age\s*\(`, c`Write a setter: ~set age(value) { ... }~`]], sol: c`
class Person {
    constructor(age) { this._age = age; }
    get age() { return this._age; }
    set age(value) {
        if (value < 0) {
            console.log("Invalid age");
            return;
        }
        this._age = value;
    }
}

const p = new Person(30);
p.age = -5;
p.age = 31;
console.log(p.age);` }),
] },
],
quiz: [
  P(c`
class C { constructor(n) { this.n = n; } twice() { return this.n * 2; } }
console.log(new C(21).twice());`, '42'),
  Q(c`What keyword creates an object from a class?`, ['make', 'new', 'create', 'class'], 1),
  Q(c`A ~static~ method is called on…`, ['each object', 'the class itself', 'the parent class only', 'nothing — it is private'], 1),
  P(c`
class P { get x() { return 5; } }
console.log(new P().x * 2);`, '10'),
  F('Inherit from Animal.', c`
class Cat [[extends]] Animal {
  constructor(name) { [[super]](name); }
}`, null, 1),
] });

/* ============ JavaScript TOPIC 9: ERRORS & ASYNC ============ */
topic({ id: 'async', title: 'Errors & Async', icon: '⏳', color: '#b197fc', blurb: 'try/catch, timers, promises and async/await.',
lessons: [
{ id: 'errors', title: 'Error handling', icon: '⚠️', desc: 'Catch problems instead of crashing.',
  v: [['7:45:04', '7:54:06', 'Error handling']],
  steps: [
  T('try, catch, finally', c`Code that might fail goes in ~try~. If an error is **thrown**, ~catch~ handles it and the program carries on. ~finally~ runs either way.`, c`
try {
    const data = JSON.parse("not json");
} catch (error) {
    console.log("Could not read it: " + error.message);
} finally {
    console.log("done");
}

function divide(a, b) {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
}`),
  P(c`
try {
    console.log("a");
    throw new Error("oops");
    console.log("b");
} catch (e) {
    console.log(e.message);
}
console.log("c");`, 'a\noops\nc', c`Nothing after the ~throw~ inside ~try~ runs.`),
  X({ q: c`Read a line of JSON. If it is valid, print the number of keys in it; if not, print ~Invalid JSON~.`, tests: [{ in: '{"a":1,"b":2}\n', re: '(^|\\n)2$' }, { in: '{oops\n', re: 'Invalid JSON$' }], must: [[c`\btry\s*\{`, c`Use ~try { ... } catch~.`]], sol: c`
const text = prompt("JSON: ");
try {
    const obj = JSON.parse(text);
    console.log(Object.keys(obj).length);
} catch (e) {
    console.log("Invalid JSON");
}` }),
  X({ q: c`Write ~withdraw(balance, amount)~ that **throws** an Error with the message ~Insufficient funds~ when the amount is too big, and otherwise returns the new balance. The calling code is ready.`, start: c`
// write withdraw here


for (const amount of [30, 500]) {
    try {
        console.log(withdraw(100, amount));
    } catch (e) {
        console.log("Error: " + e.message);
    }
}`, tests: [{ out: '70\nError: Insufficient funds' }], must: [[c`throw\s+new\s+Error`, c`~throw new Error(...)~`]], sol: c`
function withdraw(balance, amount) {
    if (amount > balance) throw new Error("Insufficient funds");
    return balance - amount;
}

for (const amount of [30, 500]) {
    try {
        console.log(withdraw(100, amount));
    } catch (e) {
        console.log("Error: " + e.message);
    }
}` }),
] },

{ id: 'timers', title: 'Asynchronous code', icon: '💤', desc: 'setTimeout, and why order can surprise you.',
  v: [['6:59:07', '7:05:20', 'setTimeout()'], ['7:40:17', '7:45:04', 'Asynchronous code']],
  steps: [
  T('Later, not now', c`~setTimeout(fn, ms)~ schedules a function to run **later**. JavaScript does not wait: it carries on with the next line straight away.`, c`
console.log("1");
setTimeout(() => console.log("3"), 1000);
console.log("2");
// prints 1, 2 — then, a second later, 3`, c`This is **asynchronous** code. It lets a web page stay responsive while it waits for a server or a timer.`),
  P(c`
setTimeout(() => console.log("A"), 0);
console.log("B");`, 'B\nA', c`Even with 0 ms, the callback waits until the current code has finished.`),
  P(c`
setTimeout(() => console.log("slow"), 50);
setTimeout(() => console.log("fast"), 10);
console.log("now");`, 'now\nfast\nslow'),
] },

{ id: 'promises', title: 'Promises and async/await', icon: '🤞', desc: 'Values that arrive later, written as if they did not.',
  v: [['10:34:03', '10:39:50', 'Callback hell'], ['10:39:50', '10:52:24', 'Promises'], ['10:52:24', '10:57:00', 'Async/Await']],
  steps: [
  T('Promises', c`A **promise** is a value that will arrive later — or an error. ~.then~ runs when it arrives; ~.catch~ when it fails.`, c`
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait(500)
    .then(() => console.log("half a second later"))
    .catch(error => console.log("failed: " + error));`),
  T('async / await', c`~async~ functions let you **await** a promise, which reads like normal top-to-bottom code. Use ~try/catch~ for errors.`, c`
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function countdown() {
    for (let i = 3; i > 0; i--) {
        console.log(i);
        await wait(100);
    }
    console.log("Go!");
}
countdown();`, c`In a browser, ~await fetch(url)~ downloads data from a web API this way.`),
  P(c`
Promise.resolve(5).then(n => console.log(n * 2));
console.log("first");`, 'first\n10', c`Even an already-finished promise runs its ~.then~ after the current code.`),
  P(c`
const wait = ms => new Promise(r => setTimeout(r, ms));
async function go() {
    console.log("a");
    await wait(10);
    console.log("b");
}
go();
console.log("c");`, 'a\nc\nb', c`~go()~ runs until its first ~await~, then hands control back — so "c" prints before "b".`),
  X({ q: c`Using ~async~/~await~ and the ~wait~ helper, print ~3~, ~2~, ~1~, ~Lift off!~ with a short pause between each.`, start: c`
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// write an async function and call it
`, tests: [{ out: '3\n2\n1\nLift off!' }], must: [[c`\basync\b`, c`Write an ~async~ function.`], [c`\bawait\b`, c`Use ~await~.`]], sol: c`
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function launch() {
    for (let i = 3; i > 0; i--) {
        console.log(i);
        await wait(50);
    }
    console.log("Lift off!");
}
launch();` }),
] },
],
quiz: [
  P(c`
try { null.x; } catch (e) { console.log("caught"); } finally { console.log("finally"); }`, 'caught\nfinally'),
  P(c`
setTimeout(() => console.log(1), 0);
Promise.resolve().then(() => console.log(2));
console.log(3);`, '3\n2\n1', c`Normal code first, then promise callbacks, then timers.`),
  Q(c`What does ~await~ do?`, ['Freezes the whole browser', 'Pauses the async function until the promise settles', 'Makes code run faster', 'Throws an error'], 1),
  Q(c`Which block always runs, error or not?`, ['try', 'catch', 'finally', 'throw'], 2),
] });

/* ============ JavaScript TOPIC 10: FINAL BOSS ============ */
topic({ id: 'boss', title: 'Final Boss', icon: '👑', color: '#c0c7ff', blurb: 'Three small programs that use everything.',
lessons: [
{ id: 'projects', title: 'Capstone projects', icon: '🏆', desc: 'A to-do list, a grade report and a password checker.',
  v: [['7:54:06', '8:09:26', 'Calculator program']],
  steps: [
  T('No new syntax', c`Just you and three realistic programs. Plan the data first (an array? objects? a class?), then write small pieces and Run often.`),
  X({ q: c`**To-do list.** Read commands until ~quit~:

~add <task>~ adds a task · ~done <number>~ marks task number N (from 1) as done · ~list~ prints every task as ~1. [x] Buy milk~ or ~2. [ ] Walk dog~`, tests: [{ in: 'add Buy milk\nadd Walk dog\ndone 1\nlist\nquit\n', has: ['1. [x] Buy milk\n2. [ ] Walk dog'] }, { in: 'add A\nlist\nquit\n', has: ['1. [ ] A'] }], sol: c`
const tasks = [];
let line = prompt("> ");
while (line !== "quit") {
    if (line.startsWith("add ")) {
        tasks.push({ text: line.slice(4), done: false });
    } else if (line.startsWith("done ")) {
        tasks[Number(line.slice(5)) - 1].done = true;
    } else if (line === "list") {
        tasks.forEach((t, i) => console.log(${tl('${i + 1}. [${t.done ? "x" : " "}] ${t.text}')}));
    }
    line = prompt("> ");
}`, hint: c`Store objects like ~{ text, done }~ in an array. ~line.startsWith("add ")~ and ~line.slice(4)~ split each command.` }),
  X({ q: c`**Grade report.** Print each student's name and average (1 decimal), best first, then the class average:

~Cy: 91.0~
~Ana: 85.0~
~Ben: 70.0~
~Class: 82.0~`, start: c`
const students = [
    { name: "Ana", scores: [80, 90] },
    { name: "Ben", scores: [60, 80] },
    { name: "Cy", scores: [95, 87] },
];`, tests: [{ out: 'Cy: 91.0\nAna: 85.0\nBen: 70.0\nClass: 82.0' }], sol: c`
const students = [
    { name: "Ana", scores: [80, 90] },
    { name: "Ben", scores: [60, 80] },
    { name: "Cy", scores: [95, 87] },
];
const avg = list => list.reduce((a, n) => a + n, 0) / list.length;
const report = students.map(s => ({ name: s.name, average: avg(s.scores) }));
report.sort((a, b) => b.average - a.average);
report.forEach(r => console.log(${tl('${r.name}: ${r.average.toFixed(1)}')}));
console.log("Class: " + avg(report.map(r => r.average)).toFixed(1));` }),
  X({ q: c`**Password checker.** Read a password and print every rule it breaks, one per line, or ~Strong password~ if none:

~Too short~ (fewer than 8 characters) · ~Needs a number~ · ~Needs a capital letter~`, tests: [{ in: 'abc\n', has: ['Too short', 'Needs a number', 'Needs a capital letter'] }, { in: 'Secret123\n', re: 'Strong password$' }, { in: 'longpassword9\n', re: 'Needs a capital letter$' }], sol: c`
const pw = prompt("Password: ");
const problems = [];
if (pw.length < 8) problems.push("Too short");
if (!/[0-9]/.test(pw)) problems.push("Needs a number");
if (!/[A-Z]/.test(pw)) problems.push("Needs a capital letter");
console.log(problems.length ? problems.join("\n") : "Strong password");`, hint: c`~/[0-9]/.test(pw)~ checks for a digit; ~/[A-Z]/~ for a capital letter.` }),
  T('Where next?', c`You now know the JavaScript every web developer uses daily. Next steps:

**The DOM:** make web pages interactive — the second half of Bro Code's video (element selectors, events, classList).

**Fetch:** load live data from web APIs with ~await fetch(url)~.

**Node.js:** run JavaScript on servers, like the one that runs this site.`),
] },
],
quiz: [
  P(c`console.log([3, 1, 2].sort((a, b) => b - a)[0]);`, '3'),
  P(c`console.log([1, 2, 3, 4].filter(n => n > 1).map(n => n * 10).reduce((a, n) => a + n, 0));`, '90'),
  Q(c`Which is best for "do something with every item and get a new array back"?`, ['forEach', 'map', 'find', 'some'], 1),
  P(c`
const { a, ...rest } = { a: 1, b: 2, c: 3 };
console.log(Object.keys(rest).join(""));`, 'bc'),
] });
