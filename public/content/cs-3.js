/* ============ C# TOPIC: INHERITANCE & INTERFACES ============ */
topic({ id: 'inherit', title: 'Inheritance & Interfaces', icon: '👪', color: '#ff4b4b', blurb: 'Build new classes on old ones, and let each answer in its own way.',
lessons: [
{ id: 'inherit', title: 'Inheritance', icon: '👪', desc: 'A Dog is an Animal. Say so, and get everything an Animal has.',
  v: [['2:50:04', '2:54:32', 'Inheritance']],
  steps: [
  T('"is a" relationships', c`Inheritance lets a class start with everything another class has, then add its own. The colon reads "is a".`, c`
class Animal {
    public string Name { get; set; }
    public void Eat() { Console.WriteLine($"{Name} eats"); }
}

class Dog : Animal {                 // a Dog is an Animal
    public void Bark() { Console.WriteLine("Woof"); }
}

Dog d = new Dog();
d.Name = "Rex";     // inherited
d.Eat();            // inherited
d.Bark();           // its own`, c`~Animal~ is the **base** class, ~Dog~ the **derived** class. A class can inherit from only **one** base class.`),
  Q('Given the code above, which line does not compile?', [c`~Dog d = new Dog(); d.Eat();~`, c`~Animal a = new Animal(); a.Bark();~`, c`~Dog d = new Dog(); d.Bark();~`, c`~Animal a = new Dog();~`], 1, c`Inheritance flows one way: every Dog is an Animal, but a plain Animal cannot bark. The last option is fine — a Dog can be stored anywhere an Animal is expected.`),
  T('base: calling the parent constructor', c`If the base class needs constructor arguments, the derived class passes them up with ~: base(...)~.`, c`
class Animal {
    public string Name { get; private set; }
    public Animal(string name) { Name = name; }
}

class Dog : Animal {
    public Dog(string name) : base(name) { }     // hand name up to Animal
}`, c`The base part of an object is always built first.

One more access level appears with inheritance: ~protected~ members are hidden from the outside but visible to derived classes.`),
  P(c`
class Vehicle {
    public int Wheels { get; private set; }
    public Vehicle(int wheels) { Wheels = wheels; }
}
class Bike : Vehicle {
    public Bike() : base(2) { }
}
class Car : Vehicle {
    public Car() : base(4) { }
}

class Program {
    static void Main() {
        Console.WriteLine(new Bike().Wheels + new Car().Wheels);
    }
}`, '6'),
  F('Cat inherits from Animal and passes the name up.', c`
class Cat [[:]] Animal {
    public Cat(string name) : [[base]](name) { }
}`, null, true),
  X({ q: c`Create a class ~Student~ that inherits from ~Person~. Its constructor takes a name and a school, passes the name to ~Person~, and stores the school in a public property ~School~.

The starter ~Main~ must print ~Ada studies at MIT~`, start: c`using System;

class Person {
    public string Name { get; private set; }
    public Person(string name) { Name = name; }
}

// class Student : Person

class Program {
    static void Main() {
        Student s = new Student("Ada", "MIT");
        Console.WriteLine($"{s.Name} studies at {s.School}");
    }
}
`, tests: [{ out: 'Ada studies at MIT' }], must: [[String.raw`:\s*base\s*\(`, c`Pass the name up with ~: base(name)~.`]], hint: c`~class Student : Person { public string School { get; private set; } public Student(string name, string school) : base(name) { School = school; } }~`, sol: c`using System;

class Person {
    public string Name { get; private set; }
    public Person(string name) { Name = name; }
}

class Student : Person {
    public string School { get; private set; }

    public Student(string name, string school) : base(name) {
        School = school;
    }
}

class Program {
    static void Main() {
        Student s = new Student("Ada", "MIT");
        Console.WriteLine($"{s.Name} studies at {s.School}");
    }
}
` }),
] },

{ id: 'poly', title: 'virtual, override & polymorphism', icon: '🎭', desc: 'One call, many behaviours.',
  v: [['3:05:15', '3:09:07', 'Method overriding'], ['3:09:07', '3:12:34', 'ToString method'], ['3:12:34', '3:17:44', 'Polymorphism']],
  steps: [
  T('Replacing an inherited method', c`A derived class can supply its own version of a base method. The base marks the method ~virtual~ ("may be replaced"); the derived class marks its version ~override~.`, c`
class Animal {
    public virtual string Speak() { return "..."; }
}

class Dog : Animal {
    public override string Speak() { return "Woof"; }
}

class Cat : Animal {
    public override string Speak() { return "Meow"; }
}`),
  T('Polymorphism', c`Here is the payoff. A variable of the base type can hold **any** derived object — and a virtual call runs the version belonging to what the object **really is**.`, c`
Animal[] zoo = { new Dog(), new Cat(), new Animal() };

foreach (Animal a in zoo) {
    Console.WriteLine(a.Speak());      // Woof, Meow, ...
}`, c`The loop has no idea which animals it holds, and does not need to. Add a ~Cow~ class next year and this loop works unchanged. (In C you would build this by hand with function pointers.)`),
  P(c`
class Shape {
    public virtual int Sides() { return 0; }
}
class Triangle : Shape {
    public override int Sides() { return 3; }
}
class Square : Shape {
    public override int Sides() { return 4; }
}

class Program {
    static void Main() {
        Shape[] shapes = { new Triangle(), new Square(), new Shape() };
        foreach (Shape s in shapes) {
            Console.Write(s.Sides());
        }
    }
}`, '340'),
  T('ToString: every object can describe itself', c`Every class in C# secretly inherits from one root class, ~object~, which has a virtual method ~ToString()~. ~Console.WriteLine~ and ~$"..."~ call it automatically. By default it just returns the class name — override it to print something useful:`, c`
class Point {
    public int X, Y;
    public override string ToString() { return $"({X}, {Y})"; }
}

Point p = new Point { X = 2, Y = 5 };
Console.WriteLine(p);              // (2, 5)`),
  Q(c`A base method is not marked ~virtual~. Can a derived class ~override~ it?`, ['Yes, always', 'No — the compiler rejects the override', 'Only if it is static', 'Only in the same file'], 1, c`The base class has to opt in with ~virtual~ (or ~abstract~ — next lesson).`),
  X({ q: c`Add two classes derived from ~Enemy~: ~Goblin~, whose ~Attack()~ returns 5, and ~Dragon~, whose ~Attack()~ returns 50.

The starter ~Main~ must print ~56~ (1 + 5 + 50).`, start: c`using System;

class Enemy {
    public virtual int Attack() { return 1; }
}

// class Goblin, class Dragon

class Program {
    static void Main() {
        Enemy[] wave = { new Enemy(), new Goblin(), new Dragon() };
        int total = 0;
        foreach (Enemy e in wave) {
            total += e.Attack();
        }
        Console.WriteLine(total);
    }
}
`, tests: [{ out: '56' }], must: [[String.raw`\boverride\b`, c`Replace ~Attack~ with ~public override int Attack()~.`]], hint: c`~class Goblin : Enemy { public override int Attack() { return 5; } }~`, sol: c`using System;

class Enemy {
    public virtual int Attack() { return 1; }
}

class Goblin : Enemy {
    public override int Attack() { return 5; }
}

class Dragon : Enemy {
    public override int Attack() { return 50; }
}

class Program {
    static void Main() {
        Enemy[] wave = { new Enemy(), new Goblin(), new Dragon() };
        int total = 0;
        foreach (Enemy e in wave) {
            total += e.Attack();
        }
        Console.WriteLine(total);
    }
}
` }),
] },

{ id: 'abstract', title: 'Abstract classes & interfaces', icon: '👻', desc: 'Promises a class must keep.',
  v: [['2:54:32', '2:57:08', 'Abstract classes'], ['3:17:44', '3:23:22', 'Interfaces']],
  steps: [
  T('Abstract: too vague to exist', c`What sound does "an animal" make? None — only specific animals make sounds. An ~abstract~ class is one that exists only to be inherited from: you cannot ~new~ it. An ~abstract~ method has no body, and every derived class **must** override it.`, c`
abstract class Shape {
    public abstract double Area();             // no body
    public void Describe() {                   // normal methods are allowed too
        Console.WriteLine($"Area: {Area()}");
    }
}

class Square : Shape {
    public double Side { get; set; }
    public override double Area() { return Side * Side; }
}

// new Shape();      compile error`),
  Q(c`A class inherits from an abstract class but does not override one of its abstract methods. What happens?`, ['The method returns 0', 'It does not compile (unless the class is abstract too)', 'It throws when called', 'Nothing'], 1),
  T('Interfaces: a list of abilities', c`An **interface** is a pure contract: a list of members with no code. A class that **implements** it promises to provide them all. By convention the name starts with ~I~.`, c`
interface IDamageable {
    void TakeDamage(int amount);
}

class Crate : IDamageable {
    public void TakeDamage(int amount) { Console.WriteLine("Crack!"); }
}

class Wizard : IDamageable {
    public void TakeDamage(int amount) { Console.WriteLine("Ouch!"); }
}`, c`A crate and a wizard have nothing else in common, yet both can be handed to any code that wants "something damageable".`),
  T('Why both?', c`A class can inherit from only **one** base class, but can implement **many** interfaces:`, c`
class Duck : Animal, IFlyable, ISwimmable { }`, c`Rule of thumb: inheritance says what something **is** (a Dog is an Animal). An interface says what something **can do** (it can be damaged, compared, saved). Much of .NET is built on interfaces — ~foreach~ works on anything that implements ~IEnumerable~.`),
  P(c`
interface IScore {
    int Points();
}
class Coin : IScore {
    public int Points() { return 10; }
}
class Gem : IScore {
    public int Points() { return 50; }
}

class Program {
    static void Main() {
        IScore[] loot = { new Coin(), new Gem(), new Coin() };
        int total = 0;
        foreach (IScore item in loot) {
            total += item.Points();
        }
        Console.WriteLine(total);
    }
}`, '70'),
  Q('How many interfaces can one class implement?', ['None', 'Exactly one', 'As many as it likes', 'Two'], 2),
  X({ q: c`Create an interface ~ISpeaker~ with one method, ~string Speak()~. Make ~Robot~ implement it (returning ~Beep~) and ~Parrot~ implement it (returning ~Squawk~).

The starter ~Main~ must print:

~Beep~
~Squawk~`, start: c`using System;

// interface ISpeaker, class Robot, class Parrot

class Program {
    static void Main() {
        ISpeaker[] crowd = { new Robot(), new Parrot() };
        foreach (ISpeaker s in crowd) {
            Console.WriteLine(s.Speak());
        }
    }
}
`, tests: [{ out: 'Beep\nSquawk' }], must: [[String.raw`interface\s+ISpeaker`, c`Declare ~interface ISpeaker~.`]], hint: c`~interface ISpeaker { string Speak(); }~ then ~class Robot : ISpeaker { public string Speak() { return "Beep"; } }~`, sol: c`using System;

interface ISpeaker {
    string Speak();
}

class Robot : ISpeaker {
    public string Speak() { return "Beep"; }
}

class Parrot : ISpeaker {
    public string Speak() { return "Squawk"; }
}

class Program {
    static void Main() {
        ISpeaker[] crowd = { new Robot(), new Parrot() };
        foreach (ISpeaker s in crowd) {
            Console.WriteLine(s.Speak());
        }
    }
}
` }),
] },
],
quiz: [
  Q(c`In ~class Dog : Animal~, which is the base class?`, [c`~Dog~`, c`~Animal~`, 'Both', 'Neither'], 1),
  P(c`
class A {
    public virtual string Who() { return "A"; }
}
class B : A {
    public override string Who() { return "B"; }
}

class Program {
    static void Main() {
        A x = new B();
        Console.WriteLine(x.Who());
    }
}`, 'B', c`The variable's type is ~A~, but the object is a ~B~ — and the method is virtual.`),
  Q(c`Which keyword passes arguments to the parent constructor?`, [c`~this~`, c`~base~`, c`~super~`, c`~parent~`], 1),
  F('Describe an object when it is printed.', c`
class Coin {
    public [[override]] string [[ToString]]() { return "a coin"; }
}`, null, true),
  Q(c`Can you write ~new Shape()~ if ~Shape~ is abstract?`, ['Yes', 'No', 'Only once', 'Only inside Shape'], 1),
  Q('An interface contains…', ['fields and constructors', 'a list of members a class promises to provide', 'only static methods', 'private data'], 1),
] });

/* ============ C# TOPIC: NO MORE MALLOC ============ */
topic({ id: 'modern', title: 'Memory & Modern C#', icon: '♻️', color: '#00cd9c', blurb: 'References, null, the garbage collector, generics and LINQ — then a final boss.',
lessons: [
{ id: 'refs', title: 'References, null & the GC', icon: '♻️', desc: 'Who owns an object? Who frees it? And what is null?',
  steps: [
  T('Two kinds of types', c`**Value types** (~int~, ~double~, ~bool~, ~char~ and every ~struct~) hold their data directly. Assigning one **copies** it.

**Reference types** (every ~class~, plus ~string~ and arrays) hold a **reference** to an object that lives elsewhere. Assigning one copies the reference — both variables now refer to the **same** object.`, c`
int a = 5;
int b = a;          // a copy
b = 9;              // a is still 5

int[] x = { 1, 2, 3 };
int[] y = x;        // the SAME array
y[0] = 99;
Console.WriteLine(x[0]);     // 99`, c`If you know C: a reference is a pointer with the sharp edges removed — no arithmetic, no ~*~, no dangling. Class variables are always references; that is why objects are created with ~new~.`),
  P(c`
class Box { public int Value; }

class Program {
    static void Main() {
        Box a = new Box();
        a.Value = 1;
        Box b = a;
        b.Value = 7;
        Console.WriteLine(a.Value);
    }
}`, '7', c`~b = a~ copied the reference, not the box. There is only one ~Box~.`),
  T('Nobody calls free', c`You have written ~new~ dozens of times and never released anything. That is not a leak: the **garbage collector** (GC) finds objects that no variable refers to any more and reclaims their memory automatically.`, c`
Player p = new Player();
p = new Player();      // the first Player is now unreachable -> the GC will collect it`, c`There is no ~free~, no ~delete~, and so no double free and no use-after-free. The cost: you do not control exactly **when** memory is reclaimed.`),
  T('null', c`A reference that refers to nothing is ~null~. Using it gives the most common runtime error in C#: the ~NullReferenceException~. Two operators make null easy to live with:`, c`
string name = null;

// name.Length                     NullReferenceException
int? len = name?.Length;           // ?.  "only if not null" -> gives null
string shown = name ?? "nobody";   // ??  "or else, if null"

Console.WriteLine(shown);                  // nobody
Console.WriteLine(name?.Length ?? 0);      // 0`, c`~int?~ is a "nullable int": an int that is also allowed to be ~null~.`),
  Q(c`~string s = null;~ What does ~Console.WriteLine(s ?? "empty");~ print?`, ['Nothing', c`~empty~`, c`~null~`, 'It throws'], 1),
  Q('What does the garbage collector free?', ['Every object when its method ends', 'Objects that nothing refers to any more', 'Only objects you mark with free', 'Nothing until the program exits'], 1),
  X({ q: c`~FindPet~ returns ~null~ when the name is unknown, and the starter crashes on it. Fix ~Main~ so it prints the pet's name in capitals — or ~no pet~ when there is none — using ~?.~ and ~??~.

Input ~rex~ gives ~REX~ · input ~bob~ gives ~no pet~`, start: c`using System;

class Program {
    static string FindPet(string name) {
        if (name == "rex" || name == "tom") return name;
        return null;
    }

    static void Main() {
        string pet = FindPet(Console.ReadLine());
        Console.WriteLine(pet.ToUpper());
    }
}
`, tests: [{ in: 'rex\n', out: 'REX' }, { in: 'bob\n', out: 'no pet' }], must: [[String.raw`\?\?`, c`Supply the fallback with ~??~.`]], hint: c`~Console.WriteLine(pet?.ToUpper() ?? "no pet");~`, sol: c`using System;

class Program {
    static string FindPet(string name) {
        if (name == "rex" || name == "tom") return name;
        return null;
    }

    static void Main() {
        string pet = FindPet(Console.ReadLine());
        Console.WriteLine(pet?.ToUpper() ?? "no pet");
    }
}
` }),
] },

{ id: 'generics', title: 'Enums, structs & generics', icon: '🧬', desc: 'Named choices, lightweight values and code that works for any type.',
  v: [['3:40:26', '3:47:33', 'Enums'], ['3:47:33', '3:52:56', 'Generics']],
  steps: [
  T('Enums', c`An ~enum~ is a type with a fixed set of named values — far clearer than magic numbers or strings.`, c`
enum Difficulty { Easy, Normal, Hard }

Difficulty d = Difficulty.Hard;

if (d == Difficulty.Hard) {
    Console.WriteLine("Good luck");
}
Console.WriteLine(d);           // Hard   - prints the NAME
Console.WriteLine((int)d);      // 2      - the number underneath`, c`Unlike a C enum, a C# enum is its own type: you cannot pass a random int where a ~Difficulty~ is expected, and it prints as its name.`),
  P(c`
enum Light { Red, Amber, Green }

class Program {
    static void Main() {
        Light l = Light.Amber;
        Console.WriteLine($"{l} {(int)l} {(int)Light.Green}");
    }
}`, 'Amber 1 2'),
  T('Structs are value types', c`A C# ~struct~ looks like a class, but it is a **value type**: assignment copies the whole thing. Use one for small bundles of data such as a point or a colour.`, c`
struct Point {
    public int X, Y;
}

Point a = new Point { X = 1, Y = 2 };
Point b = a;        // a full copy
b.X = 99;
Console.WriteLine(a.X);     // 1`, c`With a ~class~ that last line would print 99. Same syntax, different behaviour — the choice between ~struct~ and ~class~ is the choice between copy and share.`),
  T('Generics', c`You have used ~List<int>~ and ~Dictionary<string, int>~. The ~<T>~ is a **type parameter**, and you can write your own generic methods and classes:`, c`
static T Biggest<T>(T a, T b) where T : IComparable<T> {
    return a.CompareTo(b) > 0 ? a : b;
}

Biggest(3, 7);              // T is int
Biggest("pear", "apple");   // T is string

class Box<T> {
    public T Value { get; set; }
}

var b = new Box<string> { Value = "hi" };`, c`One piece of code, any type, fully checked by the compiler. ~where T : IComparable<T>~ is a **constraint**: "T must be something that can be compared".`),
  Q(c`~struct S { public int N; }~ What does this print?

~S a = new S { N = 1 }; S b = a; b.N = 5; Console.WriteLine(a.N);~`, ['5', '1', '0', 'It does not compile'], 1, c`Structs are copied on assignment.`),
  X({ q: c`Write a generic method ~static void Swap<T>(ref T a, ref T b)~ that swaps any two variables of the same type.

The starter ~Main~ must print:

~2 1~
~world hello~`, start: c`using System;

class Program {
    // generic Swap

    static void Main() {
        int x = 1, y = 2;
        Swap(ref x, ref y);
        Console.WriteLine($"{x} {y}");

        string s = "hello", t = "world";
        Swap(ref s, ref t);
        Console.WriteLine($"{s} {t}");
    }
}
`, tests: [{ out: '2 1\nworld hello' }], must: [[String.raw`Swap\s*<\s*T\s*>`, c`Make it generic: ~Swap<T>~.`]], hint: c`~static void Swap<T>(ref T a, ref T b) { T temp = a; a = b; b = temp; }~`, sol: c`using System;

class Program {
    static void Swap<T>(ref T a, ref T b) {
        T temp = a;
        a = b;
        b = temp;
    }

    static void Main() {
        int x = 1, y = 2;
        Swap(ref x, ref y);
        Console.WriteLine($"{x} {y}");

        string s = "hello", t = "world";
        Swap(ref s, ref t);
        Console.WriteLine($"{s} {t}");
    }
}
` }),
] },

{ id: 'linq', title: 'Lambdas & LINQ', icon: '⚡', desc: 'Filter, transform and sort a collection in one readable line.',
  steps: [
  T('Lambdas: a method on the spot', c`A **lambda** is a small unnamed method written right where it is needed. ~=>~ reads "goes to".`, c`
Func<int, int> square = x => x * x;
Func<int, bool> isEven = x => x % 2 == 0;

Console.WriteLine(square(5));     // 25
Console.WriteLine(isEven(5));     // False`, c`~Func<int, bool>~ is the type "a method taking an int and returning a bool". Mostly you will not store lambdas in variables — you will hand them straight to other methods.`),
  T('LINQ', c`Add ~using System.Linq;~ and every array, list and dictionary gains a set of methods that replace hand-written loops:`, c`
int[] scores = { 45, 90, 72, 88, 30 };

scores.Where(s => s >= 50)        // keep the ones that pass: 90 72 88
scores.Select(s => s / 10)        // transform each one:      4 9 7 8 3
scores.OrderBy(s => s)            // sorted copy:             30 45 72 88 90
scores.Count(s => s >= 50)        // 3
scores.Max()                      // 90
scores.Sum()                      // 325
scores.Any(s => s > 95)           // false`, c`None of these change the original collection — each produces a new sequence.`),
  T('Chaining', c`The real power is chaining them. Read this top to bottom like a sentence:`, c`
var top = scores
    .Where(s => s >= 50)
    .OrderByDescending(s => s)
    .Take(2);

Console.WriteLine(string.Join(" ", top));     // 90 88`, c`To turn the result back into a list or array, finish with ~.ToList()~ or ~.ToArray()~.`),
  P(c`
int[] n = { 1, 2, 3, 4, 5, 6 };
Console.WriteLine(n.Where(x => x % 2 == 0).Select(x => x * 10).Sum());`, '120', c`Evens: 2 4 6. Times ten: 20 40 60. Sum: 120.`),
  Q(c`What does ~names.Where(n => n.Length > 3)~ do?`, ['Removes short names from the list', 'Produces a new sequence with only the names longer than 3 characters', 'Sorts by length', 'Counts the long names'], 1),
  X({ q: c`Read a line of whole numbers separated by spaces. Print the numbers **greater than 10**, sorted from **largest to smallest**, separated by spaces. Use LINQ.

Input ~5 40 12 8 25~ gives ~40 25 12~`, start: M(c`
        string[] parts = Console.ReadLine().Split(' ');
        // Select(int.Parse), Where, OrderByDescending, then string.Join

`, 'System.Linq'), tests: [{ in: '5 40 12 8 25\n', out: '40 25 12' }], must: [[String.raw`\.Where\(`, c`Filter with ~.Where(...)~.`]], hint: c`~var big = parts.Select(p => int.Parse(p)).Where(x => x > 10).OrderByDescending(x => x);~ then ~Console.WriteLine(string.Join(" ", big));~`, sol: M(c`
        string[] parts = Console.ReadLine().Split(' ');
        var big = parts.Select(p => int.Parse(p)).Where(x => x > 10).OrderByDescending(x => x);
        Console.WriteLine(string.Join(" ", big));`, 'System.Linq') }),
] },

{ id: 'boss', title: 'Final boss', icon: '👑', desc: 'Two programs that use everything at once.',
  steps: [
  T('Putting it together', c`You now have the core of C#:

**strings, lists and dictionaries** instead of raw arrays · **ref / out** instead of pointers · **exceptions** instead of return codes · **classes** with constructors and **properties** · **inheritance, virtual methods and interfaces** for polymorphism · the **garbage collector** instead of ~free~ · **generics, lambdas and LINQ** instead of hand-written loops.

Two capstones. No hints about which tool to use — that choice is the skill.`),
  X({ q: c`**Gradebook.** Each input line is a name, a space and a whole-number score. Read until the line ~end~. Print every student from the **highest score to the lowest** as ~name score~, then ~average~ followed by the average score as a whole number (integer division).

Input:
~Ada 90~
~Bo 72~
~Cy 85~
~end~

Output:
~Ada 90~
~Cy 85~
~Bo 72~
~average 82~`, start: c`using System;
using System.Collections.Generic;
using System.Linq;

class Student {
    public string Name { get; set; }
    public int Score { get; set; }
}

class Program {
    static void Main() {
        var students = new List<Student>();
        // read, sort, print

    }
}
`, tests: [{ in: 'Ada 90\nBo 72\nCy 85\nend\n', out: 'Ada 90\nCy 85\nBo 72\naverage 82' }], hint: c`Split each line on a space. ~students.OrderByDescending(s => s.Score)~ sorts; ~students.Sum(s => s.Score) / students.Count~ averages.`, sol: c`using System;
using System.Collections.Generic;
using System.Linq;

class Student {
    public string Name { get; set; }
    public int Score { get; set; }
}

class Program {
    static void Main() {
        var students = new List<Student>();
        while (true) {
            string line = Console.ReadLine();
            if (line == "end") break;
            string[] parts = line.Split(' ');
            students.Add(new Student { Name = parts[0], Score = int.Parse(parts[1]) });
        }
        foreach (Student s in students.OrderByDescending(s => s.Score)) {
            Console.WriteLine($"{s.Name} {s.Score}");
        }
        Console.WriteLine($"average {students.Sum(s => s.Score) / students.Count}");
    }
}
` }),
  X({ q: c`**Shapes.** Finish the program: ~Circle~ and ~Rect~ both derive from the abstract class ~Shape~. Use 3 for pi so the numbers stay whole.

• ~Circle(r)~ — area is ~3 * r * r~, name is ~circle~
• ~Rect(w, h)~ — area is ~w * h~, name is ~rect~

The starter ~Main~ must print:

~circle 12~
~rect 20~
~total 32~`, start: c`using System;
using System.Collections.Generic;

abstract class Shape {
    public abstract int Area();
    public abstract string Name { get; }
    public override string ToString() { return $"{Name} {Area()}"; }
}

// class Circle, class Rect

class Program {
    static void Main() {
        var shapes = new List<Shape> { new Circle(2), new Rect(4, 5) };
        int total = 0;
        foreach (Shape s in shapes) {
            Console.WriteLine(s);
            total += s.Area();
        }
        Console.WriteLine($"total {total}");
    }
}
`, tests: [{ out: 'circle 12\nrect 20\ntotal 32' }], hint: c`~class Circle : Shape { private int r; public Circle(int r) { this.r = r; } public override int Area() { return 3 * r * r; } public override string Name { get { return "circle"; } } }~`, sol: c`using System;
using System.Collections.Generic;

abstract class Shape {
    public abstract int Area();
    public abstract string Name { get; }
    public override string ToString() { return $"{Name} {Area()}"; }
}

class Circle : Shape {
    private int r;
    public Circle(int r) { this.r = r; }
    public override int Area() { return 3 * r * r; }
    public override string Name { get { return "circle"; } }
}

class Rect : Shape {
    private int w, h;
    public Rect(int w, int h) { this.w = w; this.h = h; }
    public override int Area() { return w * h; }
    public override string Name { get { return "rect"; } }
}

class Program {
    static void Main() {
        var shapes = new List<Shape> { new Circle(2), new Rect(4, 5) };
        int total = 0;
        foreach (Shape s in shapes) {
            Console.WriteLine(s);
            total += s.Area();
        }
        Console.WriteLine($"total {total}");
    }
}
` }),
  T('Where next?', c`That second program is real C#: an abstract base class, a generic list, polymorphic calls and an overridden ~ToString~ — with no memory management anywhere.

Newer versions of C# add shortcuts worth knowing once you install the .NET SDK on your own machine: **top-level statements** (no ~class Program~ wrapper), **switch expressions**, **records** and ~using var~. The online compiler on this site is a little older, so the course sticks to the classic forms that work everywhere.

From here: build a console game, try **Unity** or **Godot** for games, or **ASP.NET** for websites. And if you have not tried the other language on this site yet: the switcher is at the top of the page.`),
] },
],
quiz: [
  P(c`
int[] a = { 1, 2 };
int[] b = a;
b[0] = 5;
int x = 3;
int y = x;
y = 8;
Console.WriteLine($"{a[0]} {x}");`, '5 3', c`Arrays are reference types (shared); ints are value types (copied).`),
  Q(c`What does ~name?.Length~ give when ~name~ is ~null~ ?`, ['0', c`~null~ — and no exception`, 'A NullReferenceException', '-1'], 1),
  Q('Who frees the memory of an object nothing refers to any more?', [c`You, with ~free~`, c`You, with ~delete~`, 'The garbage collector', 'Nobody — it leaks'], 2),
  P(c`
int[] n = { 3, 8, 1, 6 };
Console.WriteLine(n.Count(x => x > 2) + n.Max());`, '11', c`Three values are greater than 2, and the largest is 8.`),
  F('Keep only the long words.', c`
var longWords = words.[[Where]](w [[=>]] w.Length > 5);`, null, true),
  Q(c`A ~struct~ differs from a ~class~ because…`, ['it cannot have methods', 'it is a value type: assigning it copies it', 'it is always static', 'it is slower'], 1),
] });

/* ============ C# GLOSSARY ============ */
G('Main', c`The method where every C# program starts: ~static void Main()~.`);
G('using', c`Brings a namespace into scope so you can write ~Console~ instead of ~System.Console~. Not a file include.`);
G('Console.WriteLine', c`Prints a line. ~Console.Write~ prints without ending the line; ~Console.ReadLine()~ reads a line as a string.`);
G('variable', c`A named box with a fixed type, e.g. ~int lives = 3;~. A local variable must be assigned before it is read.`);
G('var', c`Lets the compiler deduce a local variable's type from its initial value. The type is still fixed at compile time.`);
G('string interpolation', c`~$"Hello {name}"~ — expressions inside ~{ }~ are evaluated and inserted. ~{x:F2}~ formats to 2 decimals.`);
G('int.Parse', c`Converts text to an int; throws ~FormatException~ on bad input. ~int.TryParse~ returns ~false~ instead.`);
G('cast', c`~(int)3.9~ — an explicit conversion. Required whenever data could be lost.`);
G('integer division', c`Dividing two ints throws away the remainder: ~7 / 2~ is ~3~. Make one side a decimal to get ~3.5~.`);
G('method', c`A named block of code inside a class — what C calls a function.`);
G('array', c`A fixed-size, bounds-checked row of values: ~int[] a = new int[5];~. Knows its ~Length~.`);
G('foreach', c`~foreach (int x in items)~ — visits every element of any collection.`);
G('.NET runtime', c`The engine that runs compiled C# code, checks array bounds and nulls, and manages memory.`);
G('string', c`Immutable text. Compare with ~==~, join with ~+~. Methods return new strings: ~ToUpper~, ~Substring~, ~Replace~, ~Split~...`);
G('immutable', c`Cannot be changed after creation. String methods never modify the original — they return a new string.`);
G('List<T>', c`A resizable array. ~Add~, ~Remove~, ~Count~, ~Sort~, ~Contains~. In ~System.Collections.Generic~.`);
G('Dictionary<K, V>', c`A key → value lookup table. ~d[key] = value~, ~ContainsKey~, ~TryGetValue~.`);
G('overloading', c`Several methods with the same name but different parameter lists.`);
G('optional parameter', c`A parameter with a default value, used when the caller leaves it out.`);
G('params', c`Lets a method accept any number of arguments, gathered into an array.`);
G('ref', c`Passes a variable itself rather than a copy. Written at both the method and the call.`);
G('out', c`Like ~ref~, but the method must assign it. Used to return extra values: ~int.TryParse(s, out int n)~.`);
G('exception', c`An error object that is thrown and travels up the call stack until a matching ~catch~ handles it.`);
G('try / catch / finally', c`~try~ wraps risky code, ~catch~ handles an exception, ~finally~ always runs.`);
G('class', c`A blueprint for objects: fields (data) plus methods (behaviour). A reference type.`);
G('object', c`One instance of a class, created with ~new~.`);
G('field', c`A variable that belongs to an object (or, if ~static~, to the class).`);
G('public / private / protected', c`Access levels. Private (the default): only the class itself. Protected: also derived classes. Public: everyone.`);
G('encapsulation', c`Hiding data behind methods or properties so the rules for changing it live in one place.`);
G('constructor', c`A method with the class's name and no return type that runs when an object is created with ~new~.`);
G('this', c`Inside an instance method or constructor: the current object.`);
G('property', c`A member used like a field that runs ~get~ / ~set~ code. ~public int Hp { get; private set; }~`);
G('auto-property', c`A property whose backing field and trivial ~get~/~set~ are generated for you: ~{ get; set; }~`);
G('static', c`Belongs to the class itself rather than to any object. Called through the class name: ~Math.Max(1, 2)~.`);
G('inheritance', c`~class Dog : Animal~ — Dog starts with everything Animal has. One base class only.`);
G('base', c`Refers to the parent class. ~: base(args)~ calls the parent constructor.`);
G('virtual / override', c`~virtual~ lets a base method be replaced; ~override~ replaces it in a derived class.`);
G('polymorphism', c`One call, many behaviours: ~animal.Speak()~ runs the version belonging to the object's real type.`);
G('ToString', c`A virtual method every object has. Override it to control how the object prints.`);
G('abstract', c`An abstract class cannot be created with ~new~; an abstract method has no body and must be overridden.`);
G('interface', c`A contract: a list of members a class promises to provide. A class can implement many. Names start with ~I~.`);
G('value type', c`Holds its data directly; assignment copies it. ~int~, ~double~, ~bool~, ~char~, every ~struct~ and ~enum~.`);
G('reference type', c`Holds a reference to an object; assignment shares the object. Every ~class~, plus ~string~ and arrays.`);
G('null', c`"Refers to nothing". Using a null reference throws ~NullReferenceException~.`);
G('?. and ??', c`~a?.B~ gives null instead of throwing when ~a~ is null. ~a ?? b~ gives ~b~ when ~a~ is null.`);
G('garbage collector', c`The part of the runtime that automatically frees objects nothing refers to any more.`);
G('enum', c`A type with a fixed set of named values: ~enum Level { Easy, Hard }~. Prints as its name.`);
G('struct', c`Like a class, but a value type: copied on assignment. For small bundles of data.`);
G('generics', c`Types and methods with a type parameter, ~<T>~, so one piece of code works for any type, fully type-checked.`);
G('lambda', c`A small unnamed method: ~x => x * 2~.`);
G('LINQ', c`Query methods for any collection: ~Where~, ~Select~, ~OrderBy~, ~Count~, ~Sum~, ~Max~, ~Any~... Needs ~using System.Linq;~`);
