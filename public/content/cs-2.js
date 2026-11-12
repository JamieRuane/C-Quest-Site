/* ============ C# TOPIC: METHODS, UPGRADED ============ */
topic({ id: 'methods', title: 'Methods, Upgraded', icon: '📞', color: '#ff9600', blurb: 'Overloads, ref and out, and errors that cannot be ignored.',
lessons: [
{ id: 'overload', title: 'Overloading & optional parameters', icon: '🍕', desc: 'One name, several versions. The compiler picks by the arguments.',
  v: [['2:04:12', '2:05:44', 'Method overloading'], ['2:05:44', '2:08:52', 'params keyword']],
  steps: [
  T('Same name, different parameters', c`Several methods can share one name as long as their **parameter lists** differ. This is **overloading** — and it is why ~Console.WriteLine~ accepts an int, a double, a string or nothing at all.`, c`
static int Area(int side)           { return side * side; }
static int Area(int w, int h)       { return w * h; }
static double Area(double radius)   { return 3.14159 * radius * radius; }

Area(4);        // first one
Area(4, 5);     // second one
Area(2.0);      // third one`, c`The compiler chooses by the number and types of the arguments. A different return type alone is **not** enough to tell two overloads apart.`),
  P(c`
static void Show(int x)    { Console.Write("int "); }
static void Show(double x) { Console.Write("double "); }
static void Show(string x) { Console.Write("string "); }

static void Main() {
    Show(3);
    Show("3");
    Show(3.0);
}`, 'int string double'),
  T('Optional and named parameters', c`A parameter can have a default value; leave the argument out and the default is used. You can also pass arguments **by name**, in any order:`, c`
static void Greet(string name, int times = 1) {
    for (int i = 0; i < times; i++) {
        Console.WriteLine($"Hi {name}");
    }
}

Greet("Ada");                    // times is 1
Greet("Ada", 3);
Greet(times: 2, name: "Bo");     // named arguments`, c`Optional parameters must come **last**.`),
  T('params: any number of arguments', c`Put ~params~ before a final array parameter and callers can pass as many values as they like — they are gathered into the array for you.`, c`
static int Sum(params int[] numbers) {
    int total = 0;
    foreach (int n in numbers) total += n;
    return total;
}

Sum(1, 2);            // 3
Sum(4, 5, 6, 7);      // 22`, c`This is the safe, type-checked version of C's ~...~ varargs.`),
  Q(c`Can these two methods be in the same class?

~static int Roll(int sides)~
~static double Roll(int sides)~`, ['Yes — the return types differ', 'No — overloads must differ in their parameters', 'Yes, if one is private', 'Only with params'], 1),
  X({ q: c`Write **two** methods called ~Biggest~:

• ~Biggest(a, b)~ returns the larger of two ints
• ~Biggest(a, b, c)~ returns the largest of three ints

The starter ~Main~ must print:

~9~
~12~`, start: c`using System;

class Program {
    // two overloads of Biggest

    static void Main() {
        Console.WriteLine(Biggest(4, 9));
        Console.WriteLine(Biggest(12, 3, 7));
    }
}
`, tests: [{ out: '9\n12' }], hint: c`The three-argument version can call the two-argument one: ~return Biggest(Biggest(a, b), c);~`, sol: c`using System;

class Program {
    static int Biggest(int a, int b) {
        return a > b ? a : b;
    }

    static int Biggest(int a, int b, int c) {
        return Biggest(Biggest(a, b), c);
    }

    static void Main() {
        Console.WriteLine(Biggest(4, 9));
        Console.WriteLine(Biggest(12, 3, 7));
    }
}
` }),
] },

{ id: 'refout', title: 'ref & out', icon: '🔗', desc: 'Let a method change the caller\'s variable — without pointers.',
  steps: [
  T('Arguments are copied', c`By default a method receives a **copy** of each argument. Changing the copy does nothing to the caller's variable:`, c`
static void AddFive(int n) { n += 5; }

int x = 1;
AddFive(x);
Console.WriteLine(x);    // still 1`, c`In C you would fix that by passing a pointer: ~addFive(&x)~. C# has no ~&~ and ~*~ in everyday code. It has two keywords instead.`),
  T('ref', c`~ref~ makes the parameter another name for the caller's variable. It must be written in **both** places — the method and the call — so nobody is surprised that ~x~ changes.`, c`
static void AddFive(ref int n) { n += 5; }

int x = 1;
AddFive(ref x);
Console.WriteLine(x);    // 6`),
  P(c`
static void Swap(ref int a, ref int b) {
    int t = a; a = b; b = t;
}

static void Main() {
    int x = 1, y = 2;
    Swap(ref x, ref y);
    Console.WriteLine($"{x} {y}");
}`, '2 1'),
  T('out: extra return values', c`~out~ is like ~ref~, but one-way: the method **must** assign it, and the caller does not need to initialise it first. It is how a method hands back more than one result.

The most famous example is ~int.TryParse~: it returns ~true~ or ~false~ for "did it work?" and delivers the number through an ~out~ parameter.`, c`
if (int.TryParse("42", out int n)) {
    Console.WriteLine(n + 1);        // 43
} else {
    Console.WriteLine("not a number");
}`, c`~out int n~ declares the variable right there in the call. ~TryParse~ is the safe way to read numbers from users: no crash on bad input.`),
  Q(c`What is the difference between ~ref~ and ~out~ ?`, ['There is none', c`~out~ parameters must be assigned by the method and need not be initialised by the caller`, c`~ref~ only works with strings`, c`~out~ makes a copy`], 1),
  X({ q: c`Read one line. If it is a whole number, print double it. Otherwise print ~not a number~. Use ~int.TryParse~.

~21~ gives ~42~ · ~cat~ gives ~not a number~`, start: M(c`
        string text = Console.ReadLine();
        // int.TryParse(text, out int n)

`), tests: [{ in: '21\n', out: '42' }, { in: 'cat\n', out: 'not a number' }], must: [['TryParse', c`Use ~int.TryParse(text, out int n)~.`]], hint: c`~if (int.TryParse(text, out int n)) { ... } else { ... }~`, sol: M(c`
        string text = Console.ReadLine();
        if (int.TryParse(text, out int n)) {
            Console.WriteLine(n * 2);
        } else {
            Console.WriteLine("not a number");
        }`) }),
] },

{ id: 'except', title: 'Exceptions', icon: '⚠️', desc: 'Errors that travel up until someone handles them.',
  v: [['2:08:52', '2:13:53', 'Exception handling']],
  steps: [
  T('Errors without return codes', c`In C a function reports failure with a return code — ~-1~, ~NULL~ — which is easy to forget to check. In C#, an error is an **exception**: it is **thrown**, and it travels up through the calling methods until something **catches** it. If nothing does, the program stops with a message.`, c`
try {
    int n = int.Parse("abc");            // throws FormatException
    Console.WriteLine("never printed");
} catch (FormatException) {
    Console.WriteLine("That was not a number");
}`, c`When the exception is thrown, the rest of the ~try~ block is skipped and control jumps to the matching ~catch~.`),
  T('Several catches, and finally', c`You can catch different exception types separately. ~catch (Exception e)~ catches anything; ~e.Message~ describes what went wrong. A ~finally~ block runs **no matter what** — use it for clean-up.`, c`
try {
    int[] a = new int[2];
    a[5] = 1;
} catch (IndexOutOfRangeException) {
    Console.WriteLine("bad index");
} catch (Exception e) {
    Console.WriteLine(e.Message);
} finally {
    Console.WriteLine("done");
}`, c`Common ones: ~FormatException~ (bad text to parse), ~DivideByZeroException~, ~IndexOutOfRangeException~, ~NullReferenceException~, ~KeyNotFoundException~.`),
  P(c`
try {
    Console.Write("A");
    int zero = 0;
    Console.Write(10 / zero);
    Console.Write("B");
} catch (DivideByZeroException) {
    Console.Write("C");
} finally {
    Console.Write("D");
}
Console.WriteLine("E");`, 'ACDE'),
  T('Throwing your own', c`Your own methods can refuse bad input with ~throw~:`, c`
static void SetAge(int age) {
    if (age < 0) {
        throw new ArgumentException("Age cannot be negative");
    }
    Console.WriteLine($"Age set to {age}");
}`, c`Throw when a method **cannot do its job**. Do not use exceptions for ordinary, expected outcomes — that is what ~TryParse~-style methods are for.`),
  Q('An exception is thrown and no catch block anywhere matches it. What happens?', ['It is ignored', 'The program stops with an "unhandled exception" message', 'The method returns 0', 'The compiler reports it'], 1),
  X({ q: c`Read two whole numbers (one per line) and print the first divided by the second. If the second is 0, catch the exception and print ~cannot divide by zero~.

~12~ ~4~ gives ~3~ · ~5~ ~0~ gives ~cannot divide by zero~`, start: M(c`
        int a = int.Parse(Console.ReadLine());
        int b = int.Parse(Console.ReadLine());
        // try the division, catch DivideByZeroException

`), tests: [{ in: '12\n4\n', out: '3' }, { in: '5\n0\n', out: 'cannot divide by zero' }], must: [[String.raw`\btry\b`, c`Wrap the division in ~try { ... }~.`], [String.raw`\bcatch\b`, c`Handle the failure with ~catch~.`]], hint: c`~try { Console.WriteLine(a / b); } catch (DivideByZeroException) { ... }~`, sol: M(c`
        int a = int.Parse(Console.ReadLine());
        int b = int.Parse(Console.ReadLine());
        try {
            Console.WriteLine(a / b);
        } catch (DivideByZeroException) {
            Console.WriteLine("cannot divide by zero");
        }`) }),
] },
],
quiz: [
  P(c`
static void Add(int n)      { n += 5; }
static void Add2(ref int n) { n += 5; }

static void Main() {
    int x = 1;
    Add(x);
    Add2(ref x);
    Console.WriteLine(x);
}`, '6', c`~Add~ changed a copy. ~Add2~ changed the real ~x~.`),
  Q('Overloaded methods must differ in…', ['their names', 'their return types only', 'the number or types of their parameters', 'the file they are in'], 2),
  P(c`
static int F(int a, int b = 10) {
    return a + b;
}

static void Main() {
    Console.WriteLine(F(1) + F(1, 2));
}`, '14', c`11 + 3.`),
  F('Convert safely.', c`
if (int.[[TryParse]]("7", [[out]] int n)) {
    Console.WriteLine(n);
}`),
  Q(c`Which block always runs, exception or not?`, [c`~try~`, c`~catch~`, c`~finally~`, c`~throw~`], 2),
  Q(c`What does ~params~ allow?`, ['Passing arguments by name', 'Passing any number of arguments, collected into an array', 'Changing the caller\'s variable', 'Skipping the return type'], 1),
] });

/* ============ C# TOPIC: CLASSES & OBJECTS ============ */
topic({ id: 'oop', title: 'Classes & Objects', icon: '🧱', color: '#ce82ff', blurb: 'Bundle data with the code that works on it — the heart of C#.',
lessons: [
{ id: 'classes', title: 'Classes & objects', icon: '🧱', desc: 'Design your own type, then make as many of them as you like.',
  v: [['2:25:23', '2:30:07', 'Classes'], ['2:30:07', '2:34:58', 'Objects']],
  steps: [
  T('A blueprint', c`A **class** describes a kind of thing: what data it holds (**fields**) and what it can do (**methods**). An **object** is one actual thing built from that blueprint, created with ~new~.`, c`
class Player {
    public string name;
    public int hp = 100;

    public void Heal(int amount) {
        hp += amount;            // "this player's hp"
    }
}

Player p = new Player();
p.name = "Ada";
p.Heal(10);
Console.WriteLine(p.hp);         // 110`, c`If you know C: a class is a struct that carries its own functions. Instead of ~player_heal(&p, 10)~ you write ~p.Heal(10)~, and the method reaches the object's fields directly.`),
  Q(c`Inside ~Heal~, whose ~hp~ changes when you call ~b.Heal(5);~ ?`, ['Every player\'s', c`~b~'s — the object the method was called on`, 'A global hp', 'Nobody\'s; methods work on copies'], 1),
  T('Each object has its own data', c`Make two players and you get two separate sets of fields. Note there is no ~static~ on ~Heal~: it is an **instance** method, one that belongs to each object. (~static~ methods belong to the class itself — more in a moment.)`, c`
Player a = new Player();
Player b = new Player();
a.Heal(50);

Console.WriteLine(a.hp);    // 150
Console.WriteLine(b.hp);    // 100`),
  T('public and private', c`Members are **private** unless you say otherwise: only the class's own methods can touch them. ~public~ members are visible to everyone.`, c`
class Account {
    private double balance = 0;          // hidden

    public void Deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    public double GetBalance() { return balance; }
}

Account acc = new Account();
acc.Deposit(50);
// acc.balance = -999;    compile error: balance is private`, c`This is **encapsulation**: the only way to change ~balance~ is through code you wrote, so a rule like "never negative" lives in one place.`),
  P(c`
class Counter {
    private int n = 0;
    public void Tick() { n++; }
    public int Value() { return n; }
}

class Program {
    static void Main() {
        Counter a = new Counter();
        Counter b = new Counter();
        a.Tick(); a.Tick(); b.Tick();
        Console.WriteLine($"{a.Value()}{b.Value()}");
    }
}`, '21'),
  X({ q: c`Finish the ~Light~ class: a private ~bool on~ that starts ~false~, a public ~Toggle()~ that flips it and a public ~IsOn()~ that returns it.

The starter ~Main~ must print:

~False~
~True~`, start: c`using System;

class Light {
    // private field, Toggle(), IsOn()

}

class Program {
    static void Main() {
        Light lamp = new Light();
        Console.WriteLine(lamp.IsOn());
        lamp.Toggle();
        Console.WriteLine(lamp.IsOn());
    }
}
`, tests: [{ out: 'False\nTrue' }], hint: c`~private bool on = false;~ · ~public void Toggle() { on = !on; }~ · ~public bool IsOn() { return on; }~`, sol: c`using System;

class Light {
    private bool on = false;

    public void Toggle() { on = !on; }
    public bool IsOn() { return on; }
}

class Program {
    static void Main() {
        Light lamp = new Light();
        Console.WriteLine(lamp.IsOn());
        lamp.Toggle();
        Console.WriteLine(lamp.IsOn());
    }
}
` }),
] },

{ id: 'ctors', title: 'Constructors', icon: '👷', desc: 'A method that runs automatically the moment an object is born.',
  v: [['2:34:58', '2:40:41', 'Constructors'], ['2:45:43', '2:50:04', 'Overloaded constructors']],
  steps: [
  T('Born ready', c`A **constructor** is a special method — same name as the class, no return type — that runs when you write ~new~. Use it to make sure every object starts out complete.`, c`
class Player {
    public string name;
    public int hp;

    public Player(string name, int hp) {     // constructor
        this.name = name;
        this.hp = hp;
    }
}

Player p = new Player("Ada", 100);`, c`~this~ means "the object being built". ~this.name = name;~ copies the parameter into the field of the same name. Once a class has a constructor with parameters, ~new Player()~ with no arguments no longer compiles — half-built objects become impossible.`),
  Q('How do you recognise a constructor?', [c`It is called ~Init~`, 'It has the same name as the class and no return type', c`It returns ~void~`, c`It is marked ~static~`], 1),
  T('Overloaded constructors', c`Constructors can be overloaded like any other method. One constructor can hand off to another with ~: this(...)~.`, c`
class Pizza {
    public string topping;
    public int slices;

    public Pizza(string topping, int slices) {
        this.topping = topping;
        this.slices = slices;
    }
    public Pizza(string topping) : this(topping, 8) { }
    public Pizza() : this("cheese", 8) { }
}

Pizza a = new Pizza();              // cheese, 8
Pizza b = new Pizza("ham");         // ham, 8
Pizza c = new Pizza("veg", 6);      // veg, 6`),
  P(c`
class Box {
    public int w, h;
    public Box(int side) : this(side, side) { }
    public Box(int w, int h) { this.w = w; this.h = h; }
    public int Area() { return w * h; }
}

class Program {
    static void Main() {
        Box a = new Box(3);
        Box b = new Box(2, 5);
        Console.WriteLine($"{a.Area()} {b.Area()}");
    }
}`, '9 10'),
  F('Store the constructor parameters in the fields.', c`
class Point {
    public int x, y;
    public [[Point]](int x, int y) {
        [[this]].x = x;
        [[this]].y = y;
    }
}`, null, true),
  X({ q: c`Give ~Rectangle~ a constructor taking a width and a height, and a method ~Area()~.

The starter ~Main~ must print ~12~`, start: c`using System;

class Rectangle {
    public int width, height;
    // constructor and Area()

}

class Program {
    static void Main() {
        Rectangle r = new Rectangle(3, 4);
        Console.WriteLine(r.Area());
    }
}
`, tests: [{ out: '12' }], hint: c`~public Rectangle(int w, int h) { width = w; height = h; }~ and ~public int Area() { return width * height; }~`, sol: c`using System;

class Rectangle {
    public int width, height;

    public Rectangle(int w, int h) {
        width = w;
        height = h;
    }

    public int Area() { return width * height; }
}

class Program {
    static void Main() {
        Rectangle r = new Rectangle(3, 4);
        Console.WriteLine(r.Area());
    }
}
` }),
] },

{ id: 'props', title: 'Properties', icon: '🔒', desc: 'Looks like a field, behaves like a method. C#\'s signature feature.',
  v: [['3:33:35', '3:37:41', 'Getters & setters'], ['3:37:41', '3:40:26', 'Auto-implemented properties']],
  steps: [
  T('Fields with a guard on the door', c`Public fields let anyone write anything: ~stove.temperature = 9000;~. Other languages fix that with ~getTemperature()~ / ~setTemperature()~ methods. C# has something nicer — a **property**: it is used like a field but runs code when read or written.`, c`
class Stove {
    private int temperature;

    public int Temperature {
        get { return temperature; }
        set {
            if (value < 0) value = 0;
            if (value > 10) value = 10;
            temperature = value;        // "value" is what the caller assigned
        }
    }
}

Stove s = new Stove();
s.Temperature = 9000;                   // runs set
Console.WriteLine(s.Temperature);       // runs get -> 10`, c`By convention the private field is lower case and the property starts with a capital.`),
  Q(c`Inside a ~set~ block, what is ~value~ ?`, ['The current value of the field', 'Whatever the caller is assigning to the property', 'Always 0', 'The return value of get'], 1),
  T('Auto-properties', c`Most properties have no special rules. For those, C# writes the hidden field and the trivial ~get~/~set~ for you:`, c`
class Player {
    public string Name { get; set; }             // read and write
    public int Level { get; private set; } = 1;  // anyone reads, only the class writes

    public void LevelUp() { Level++; }
}`, c`Why not just use a public field? Because you can add validation later, or make the setter private, **without changing any code that uses the class**. In C# the rule is: fields private, properties public.`),
  P(c`
class Tank {
    private int fuel = 50;
    public int Fuel {
        get { return fuel; }
        set { if (value >= 0 && value <= 100) fuel = value; }
    }
}

class Program {
    static void Main() {
        Tank t = new Tank();
        t.Fuel = 500;
        t.Fuel = 80;
        t.Fuel = -1;
        Console.WriteLine(t.Fuel);
    }
}`, '80', c`The two silly values were rejected by the setter.`),
  T('Object initialisers', c`With public properties you can set several while creating the object, no constructor needed:`, c`
var p = new Player { Name = "Ada" };`),
  X({ q: c`Finish ~Health~. Give it a property ~Hp~ that anyone can read but only the class can set, starting at 100, and a method ~Damage(n)~ that subtracts ~n~ but never lets ~Hp~ drop below 0.

The starter ~Main~ must print:

~70~
~0~`, start: c`using System;

class Health {
    // property Hp, method Damage(int n)

}

class Program {
    static void Main() {
        Health h = new Health();
        h.Damage(30);
        Console.WriteLine(h.Hp);
        h.Damage(500);
        Console.WriteLine(h.Hp);
    }
}
`, tests: [{ out: '70\n0' }], must: [[String.raw`private\s+set`, c`Make the setter private: ~{ get; private set; }~`]], hint: c`~public int Hp { get; private set; } = 100;~ then ~public void Damage(int n) { Hp -= n; if (Hp < 0) Hp = 0; }~`, sol: c`using System;

class Health {
    public int Hp { get; private set; } = 100;

    public void Damage(int n) {
        Hp -= n;
        if (Hp < 0) Hp = 0;
    }
}

class Program {
    static void Main() {
        Health h = new Health();
        h.Damage(30);
        Console.WriteLine(h.Hp);
        h.Damage(500);
        Console.WriteLine(h.Hp);
    }
}
` }),
] },

{ id: 'static', title: 'static', icon: '🚫', desc: 'Things that belong to the class itself, not to any one object.',
  v: [['2:40:41', '2:45:43', 'static']],
  steps: [
  T('One shared copy', c`A normal field exists once **per object**. A ~static~ field exists once **for the whole class**, shared by every object.`, c`
class Car {
    public static int count = 0;     // one counter for all cars
    public string model;

    public Car(string model) {
        this.model = model;
        count++;
    }
}

new Car("Mini");
new Car("Golf");
Console.WriteLine(Car.count);        // 2 - accessed through the CLASS name`),
  T('Static methods', c`A ~static~ method is called on the class, not on an object — so it cannot use instance fields or ~this~. You have used these from the start:`, c`
Console.WriteLine("hi");     // Console is a class; WriteLine is static
Math.Max(3, 7);              // 7
Math.Sqrt(16);               // 4
int.Parse("12");`, c`This finally explains ~static void Main()~: the program has to start **before** any object exists, so ~Main~ must belong to the class itself. It is also why your helper methods next to ~Main~ needed ~static~.`),
  Q(c`Why can a ~static~ method not use ~this~ ?`, ['It is a compiler bug', 'A static method is not called on any particular object', c`~this~ is private`, 'It can, if the class is public'], 1),
  P(c`
class Ticket {
    public static int sold = 0;
    public int number;
    public Ticket() {
        sold++;
        number = sold;
    }
}

class Program {
    static void Main() {
        Ticket a = new Ticket();
        Ticket b = new Ticket();
        Ticket c = new Ticket();
        Console.WriteLine($"{b.number} {Ticket.sold}");
    }
}`, '2 3'),
  Q(c`How do you call the static method ~Roll~ of class ~Dice~ ?`, [c`~new Dice().Roll()~`, c`~Dice.Roll()~`, c`~Roll.Dice()~`, c`~static Roll()~`], 1),
  X({ q: c`Give ~Enemy~ a static counter. Every time an ~Enemy~ is created the counter goes up by one. ~Enemy.Alive()~ (a static method) returns it.

The starter ~Main~ must print ~3~`, start: c`using System;

class Enemy {
    // static field, constructor, static method Alive()

}

class Program {
    static void Main() {
        new Enemy();
        new Enemy();
        new Enemy();
        Console.WriteLine(Enemy.Alive());
    }
}
`, tests: [{ out: '3' }], must: [[String.raw`static\s+int`, c`The counter and ~Alive()~ must be ~static~.`]], hint: c`~private static int count = 0;~ · ~public Enemy() { count++; }~ · ~public static int Alive() { return count; }~`, sol: c`using System;

class Enemy {
    private static int count = 0;

    public Enemy() { count++; }

    public static int Alive() { return count; }
}

class Program {
    static void Main() {
        new Enemy();
        new Enemy();
        new Enemy();
        Console.WriteLine(Enemy.Alive());
    }
}
` }),
] },
],
quiz: [
  Q('Members of a C# class are, by default…', [c`~public~`, c`~private~`, c`~static~`, c`~protected~`], 1),
  P(c`
class Dial {
    private int v;
    public Dial(int start) { v = start; }
    public void Up() { v++; }
    public int Get() { return v; }
}

class Program {
    static void Main() {
        Dial a = new Dial(5);
        Dial b = new Dial(9);
        a.Up(); a.Up();
        Console.WriteLine(a.Get() + b.Get());
    }
}`, '16'),
  Q(c`~public int Level { get; private set; }~ means…`, ['Nobody can read Level', 'Anyone can read Level; only the class itself can change it', 'Level is static', 'Level can never change'], 1),
  F('An auto-property.', c`
class Pet {
    public string Name { [[get]]; [[set]]; }
}`, null, true),
  Q(c`What creates an object from a class?`, [c`~malloc~`, c`~new~`, c`~create~`, c`~class~`], 1),
  Q(c`A ~static~ field is…`, ['copied into every object', 'shared by all objects of the class', 'read-only', 'private by force'], 1),
  Q(c`What does ~this~ refer to inside a constructor?`, ['The class', 'The object being created', 'The caller', 'The base class'], 1),
] });
