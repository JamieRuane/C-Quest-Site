/* ============ C++ TOPIC 3: FUNCTIONS, UPGRADED ============ */
topic({ id: 'funcs', title: 'Functions, Upgraded', icon: '📞', color: '#ff9600', blurb: 'References, overloading and templates: three things C functions cannot do.',
lessons: [
{ id: 'refs', title: 'References', icon: '🔗', desc: 'Pass by reference without a single * or &x at the call site.',
  v: [['4:00:31', '4:04:47', 'Pass by value vs pass by reference'], ['4:04:47', '4:07:54', 'Const parameters']],
  steps: [
  T('A second name for the same variable', c`You know the C way to let a function change your variable: pass a pointer, dereference everywhere. C++ adds a cleaner tool, the **reference**.

A reference is an **alias** — another name for a variable that already exists.`, c`
int hp = 100;
int &r = hp;     // r is another name for hp

r = 50;          // no * needed
std::cout << hp << "\n";   // 50`, c`Here ~&~ is part of the **type** (~int &~ = "reference to int"). It is not the address-of operator. Same symbol, different job, depending on whether it appears in a declaration.`),
  P(c`
int a = 1;
int &b = a;
b++;
a += 10;
std::cout << a << " " << b << "\n";`, '12 12', c`There is only one int. ~a~ and ~b~ are two names for it.`),
  T('Pass by reference', c`Put ~&~ on a parameter and the function works on the caller's variable directly. Compare the two swaps:`, c`
// C style: pointers
void swapC(int *a, int *b) { int t = *a; *a = *b; *b = t; }
swapC(&x, &y);

// C++ style: references
void swap(int &a, int &b) { int t = a; a = b; b = t; }
swap(x, y);`, c`Same machine code underneath. But a reference can never be null, can never be re-pointed at something else, and needs no ~*~ or ~&~ noise.`),
  Q(c`Which is **not** true of a C++ reference?`, ['It must be initialised when it is declared', 'It can be made to refer to a different variable later', 'It cannot be null', c`You use it without ~*~`], 1, c`A reference is bound once, forever. ~r = other;~ does not re-bind it — it copies ~other~'s value into the original variable.`),
  T('const references: fast and safe', c`Passing a big object by value **copies** it. Passing by reference avoids the copy but lets the function modify it. ~const &~ gives you both: no copy, no modification.`, c`
void print(const std::string &text) {   // no copy, read-only
    std::cout << text << "\n";
    // text += "!";   <- compile error
}`, c`This is the default way to pass strings, vectors and objects in C++. Small things like ~int~ and ~double~ are still passed by value.`),
  Q(c`Best signature for a function that only **reads** a large ~std::vector<int>~ ?`, [c`~int total(std::vector<int> v)~`, c`~int total(std::vector<int> *v)~`, c`~int total(const std::vector<int> &v)~`, c`~int total(std::vector<int> &&v)~`], 2, c`The first one copies every element on each call. ~const &~ is free and promises not to change the caller's data.`),
  X({ q: c`Write ~void levelUp(int &level, int &hp)~ that adds 1 to ~level~ and sets ~hp~ to 100.

The ~main~ in the starter must print ~4 100~`, start: c`#include <iostream>

// write levelUp here

int main() {
    int level = 3, hp = 42;
    levelUp(level, hp);
    std::cout << level << " " << hp << "\n";
    return 0;
}
`, tests: [{ out: '4 100' }], must: [[String.raw`int\s*&\s*level`, c`Take the parameters by reference: ~int &level~`]], hint: c`~void levelUp(int &level, int &hp) { level++; hp = 100; }~`, sol: c`#include <iostream>

void levelUp(int &level, int &hp) {
    level++;
    hp = 100;
}

int main() {
    int level = 3, hp = 42;
    levelUp(level, hp);
    std::cout << level << " " << hp << "\n";
    return 0;
}
` }),
] },

{ id: 'overload', title: 'Overloading & default arguments', icon: '🍕', desc: 'One name, several versions. The compiler picks by the arguments.',
  v: [['2:16:42', '2:19:49', 'Overloaded functions']],
  steps: [
  T('Same name, different parameters', c`C needs a new name for every variant: ~abs~, ~labs~, ~fabs~, ~fabsf~... In C++ several functions can share one name as long as their **parameter lists** differ. This is **overloading**.`, c`
int area(int side)            { return side * side; }
int area(int w, int h)        { return w * h; }
double area(double radius)    { return 3.14159 * radius * radius; }

area(4);        // first one
area(4, 5);     // second one
area(2.0);      // third one`, c`The compiler chooses at compile time by looking at the number and types of the arguments. This is also how ~<<~ works for ints, doubles and strings alike.`),
  P(c`
void show(int x)    { std::cout << "int "; }
void show(double x) { std::cout << "double "; }
void show(char x)   { std::cout << "char "; }

int main() {
    show(3);
    show('3');
    show(3.0);
}`, 'int char double'),
  Q(c`Can these two functions live in the same program?

~int roll(int sides);~
~double roll(int sides);~`, ['Yes — the return types differ', 'No — overloads must differ in their parameters, not just the return type', 'Yes, if they are in the same file', 'Only with a template'], 1, c`A call like ~roll(6);~ gives the compiler no way to choose between them.`),
  T('Default arguments', c`A parameter can have a default value. Leave the argument out and the default is used.`, c`
void greet(std::string name, int times = 1) {
    for (int i = 0; i < times; i++) {
        std::cout << "Hi " << name << "\n";
    }
}

greet("Ada");       // times is 1
greet("Ada", 3);    // times is 3`, c`Defaults must be the **last** parameters — you cannot skip one in the middle.`),
  Q(c`Which declaration is legal?`, [c`~void f(int a = 1, int b);~`, c`~void f(int a, int b = 2);~`, c`~void f(int a = 1, int b, int c = 3);~`, c`~void f(int = , int b);~`], 1),
  X({ q: c`Write **two** functions called ~biggest~:

• ~biggest(a, b)~ returns the larger of two ints
• ~biggest(a, b, c)~ returns the largest of three ints

The starter ~main~ must print ~9 12~`, start: c`#include <iostream>

// two overloads of biggest

int main() {
    std::cout << biggest(4, 9) << " " << biggest(12, 3, 7) << "\n";
    return 0;
}
`, tests: [{ out: '9 12' }], hint: c`The three-argument version can call the two-argument one: ~return biggest(biggest(a, b), c);~`, sol: c`#include <iostream>

int biggest(int a, int b) {
    return a > b ? a : b;
}

int biggest(int a, int b, int c) {
    return biggest(biggest(a, b), c);
}

int main() {
    std::cout << biggest(4, 9) << " " << biggest(12, 3, 7) << "\n";
    return 0;
}
` }),
] },

{ id: 'templates', title: 'Function templates', icon: '🍪', desc: 'Write the function once; let the compiler stamp out a version per type.',
  v: [['4:58:35', '5:03:49', 'Function templates']],
  steps: [
  T('The cookie cutter', c`Overloading still means writing ~biggest~ for ints, again for doubles, again for strings — identical bodies, different types. A **template** lets you write it once with a placeholder type:`, c`
template <typename T>
T biggest(T a, T b) {
    return a > b ? a : b;
}

biggest(3, 7);                  // T is int
biggest(2.5, 1.5);              // T is double
biggest('a', 'z');              // T is char`, c`For each type you actually use, the compiler generates a real function. In C you would reach for a macro or ~void *~; a template is fully type-checked.`),
  Q(c`What is ~T~ in ~template <typename T>~ ?`, ['A variable that holds a type name at run time', 'A placeholder the compiler replaces with a real type for each use', 'A built-in type meaning "text"', 'The return value'], 1, c`It all happens at compile time. Nothing about templates slows your program down while it runs.`),
  P(c`
template <typename T>
T twice(T x) {
    return x + x;
}

int main() {
    std::string s = "ab";
    std::cout << twice(4) << " " << twice(1.5) << " " << twice(s) << "\n";
}`, '8 3 abab', c`The same body means "add" for numbers and "join" for strings, because ~+~ is defined for each of them.`),
  T('You have been using templates all along', c`~std::vector<int>~ is a **class** template: the same idea applied to a whole type. The standard library is built almost entirely this way — hence its old name, the Standard **Template** Library (STL).`, c`
std::vector<int> a;            // vector stamped out for int
std::vector<std::string> b;    // ...and for string`, c`If the types in a call disagree — ~biggest(3, 7.5)~ — the compiler cannot decide what ~T~ is. Say it yourself: ~biggest<double>(3, 7.5)~.`),
  F('Make a function that works for any type.', c`
[[template]] <[[typename~class]] T>
T first(T a, T b) {
    return a;
}`),
  X({ q: c`Write one template function ~clampTo(value, low, high)~ that returns ~low~ if ~value~ is below it, ~high~ if ~value~ is above it, and otherwise ~value~.

The starter ~main~ must print:

~10~
~0.5~`, start: c`#include <iostream>

// template function clampTo

int main() {
    std::cout << clampTo(15, 0, 10) << "\n";
    std::cout << clampTo(0.5, 0.0, 1.0) << "\n";
    return 0;
}
`, tests: [{ out: '10\n0.5' }], must: [['template', c`Use a ~template~ so one function handles both ints and doubles.`]], hint: c`~template <typename T> T clampTo(T value, T low, T high) { ... }~`, sol: c`#include <iostream>

template <typename T>
T clampTo(T value, T low, T high) {
    if (value < low) return low;
    if (value > high) return high;
    return value;
}

int main() {
    std::cout << clampTo(15, 0, 10) << "\n";
    std::cout << clampTo(0.5, 0.0, 1.0) << "\n";
    return 0;
}
` }),
] },
],
quiz: [
  P(c`
void add(int n)  { n += 5; }
void add2(int &n) { n += 5; }

int main() {
    int x = 1;
    add(x);
    add2(x);
    std::cout << x << "\n";
}`, '6', c`~add~ changed a copy. ~add2~ changed the real ~x~.`),
  Q(c`~void show(const std::string &s)~ — what does ~const &~ buy you?`, ['A copy that can be modified', 'No copy, and a promise not to modify the original', 'A pointer that may be null', 'Nothing; it is the same as passing by value'], 1),
  Q(c`Overloaded functions must differ in…`, ['their names', 'their return types only', 'the number or types of their parameters', 'the file they are in'], 2),
  P(c`
int f(int a, int b = 10) { return a + b; }

int main() {
    std::cout << f(1) << " " << f(1, 2) << "\n";
}`, '11 3'),
  F('A swap that changes the caller\'s variables.', c`
void swap(int [[&]]a, int [[&]]b) {
    int t = a; a = b; b = t;
}`),
  Q(c`When is the code for ~biggest<double>~ generated from a template?`, ['When the program starts running', 'At compile time, when the compiler sees it used with double', 'Never; templates are interpreted', 'When you call new'], 1),
] });

/* ============ C++ TOPIC 4: CLASSES & OBJECTS ============ */
topic({ id: 'oop', title: 'Classes & Objects', icon: '🧱', color: '#ce82ff', blurb: 'Structs that carry their own functions and guard their own data.',
lessons: [
{ id: 'classes', title: 'From struct to class', icon: '🧱', desc: 'Put the functions inside the struct. That is the whole idea.',
  v: [['5:18:38', '5:29:32', 'Object Oriented Programming']],
  steps: [
  T('Data + the functions that use it', c`In C you write a struct, then a pile of functions that take a pointer to it: ~player_heal(&p, 10)~. C++ lets the functions live **inside** the type. They are called **member functions** or **methods**.`, c`
struct Player {
    std::string name;
    int hp;

    void heal(int amount) {     // a method
        hp += amount;           // hp means "this player's hp"
    }
};

Player p = {"Ada", 50};
p.heal(10);                     // call it with the dot
std::cout << p.hp << "\n";      // 60`, c`Inside a method you can use the members directly. Behind the scenes the compiler passes a hidden pointer to the object, called ~this~ — it is the ~&p~ you used to pass by hand.`),
  Q(c`Inside ~heal~, which player's ~hp~ changes when you call ~b.heal(5);~ ?`, [c`Every Player's`, c`~b~'s — the object the method was called on`, 'A global hp', 'None; methods get a copy'], 1),
  T('class and private', c`A ~class~ is the same thing as a ~struct~ with one difference: its members are **private** by default. Private members can only be touched by the class's own methods.`, c`
class Account {
private:
    double balance = 0;          // hidden from the outside

public:
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    double getBalance() { return balance; }
};

Account a;
a.deposit(50);
// a.balance = -999;   <- compile error: balance is private`, c`This is **encapsulation**: the only way to change ~balance~ is through code you wrote, so a rule like "never negative" can be enforced in one place.`),
  Q(c`What is the **only** difference between ~struct~ and ~class~ in C++?`, ['Structs cannot have methods', 'Classes live on the heap', 'Members are public by default in a struct, private by default in a class', 'Classes are slower'], 2, c`Convention: ~struct~ for plain bundles of data, ~class~ when there are rules to protect.`),
  P(c`
class Counter {
    int n = 0;
public:
    void tick() { n++; }
    int value() { return n; }
};

int main() {
    Counter a, b;
    a.tick(); a.tick(); b.tick();
    std::cout << a.value() << b.value() << "\n";
}`, '21', c`Each object has its **own** copy of the member variables.`),
  X({ q: c`Finish the ~Light~ class: a private ~bool on~ that starts ~false~, a public ~toggle()~ that flips it, and a public ~isOn()~ that returns it.

The starter ~main~ must print ~0 1 0~`, start: c`#include <iostream>

class Light {
    // private state

public:
    // toggle() and isOn()

};

int main() {
    Light lamp;
    std::cout << lamp.isOn() << " ";
    lamp.toggle();
    std::cout << lamp.isOn() << " ";
    lamp.toggle();
    std::cout << lamp.isOn() << "\n";
    return 0;
}
`, tests: [{ out: '0 1 0' }], hint: c`~bool on = false;~ above ~public:~, then ~void toggle() { on = !on; }~ and ~bool isOn() { return on; }~`, sol: c`#include <iostream>

class Light {
    bool on = false;

public:
    void toggle() { on = !on; }
    bool isOn() { return on; }
};

int main() {
    Light lamp;
    std::cout << lamp.isOn() << " ";
    lamp.toggle();
    std::cout << lamp.isOn() << " ";
    lamp.toggle();
    std::cout << lamp.isOn() << "\n";
    return 0;
}
` }),
] },

{ id: 'ctors', title: 'Constructors', icon: '👷', desc: 'A function that runs automatically the moment an object is born.',
  v: [['5:29:32', '5:38:26', 'Constructors'], ['5:38:26', '5:42:51', 'Constructor overloading']],
  steps: [
  T('No more uninitialised structs', c`In C, a fresh struct is full of garbage until you remember to fill it in. A **constructor** is a special method — same name as the class, no return type — that runs automatically when an object is created.`, c`
class Player {
public:
    std::string name;
    int hp;

    Player(std::string n, int h) {    // constructor
        name = n;
        hp = h;
    }
};

Player p("Ada", 100);     // constructor runs here`, c`If a class has a constructor that takes arguments, you **cannot** create an object without supplying them. Half-built objects become impossible.`),
  Q(c`How do you recognise a constructor?`, [c`It is called ~init~`, 'It has the same name as the class and no return type', c`It returns ~void~`, c`It starts with ~new~`], 1),
  T('The member initialiser list', c`The idiomatic way to set members is the **initialiser list**: a colon after the parameter list, then ~member(value)~ pairs.`, c`
class Player {
public:
    std::string name;
    int hp;

    Player(std::string n, int h) : name(n), hp(h) { }
};`, c`It initialises the members directly instead of creating them and then assigning. For ~const~ members and references it is the **only** way.`),
  T('Overloaded constructors', c`Constructors are functions, so they can be overloaded and have default arguments:`, c`
class Pizza {
public:
    std::string topping;
    int slices;

    Pizza() : topping("cheese"), slices(8) { }
    Pizza(std::string t) : topping(t), slices(8) { }
    Pizza(std::string t, int s) : topping(t), slices(s) { }
};

Pizza a;                    // cheese, 8
Pizza b("ham");             // ham, 8
Pizza c("veg", 6);          // veg, 6`, c`Careful: ~Pizza a();~ with empty brackets does **not** create a pizza — it declares a function named ~a~. Write ~Pizza a;~`),
  P(c`
class Box {
public:
    int w, h;
    Box() : w(1), h(1) { }
    Box(int side) : w(side), h(side) { }
    Box(int w, int h) : w(w), h(h) { }
    int area() { return w * h; }
};

int main() {
    Box a, b(3), c(2, 5);
    std::cout << a.area() << " " << b.area() << " " << c.area() << "\n";
}`, '1 9 10'),
  F('Initialise both members in the initialiser list.', c`
class Point {
public:
    int x, y;
    Point(int a, int b) [[:]] x([[a]]), y([[b]]) { }
};`),
  X({ q: c`Give ~Rectangle~ a constructor taking a width and a height, and a method ~area()~.

The starter ~main~ must print ~12~`, start: c`#include <iostream>

class Rectangle {
public:
    int width, height;
    // constructor and area()

};

int main() {
    Rectangle r(3, 4);
    std::cout << r.area() << "\n";
    return 0;
}
`, tests: [{ out: '12' }], hint: c`~Rectangle(int w, int h) : width(w), height(h) { }~ and ~int area() { return width * height; }~`, sol: c`#include <iostream>

class Rectangle {
public:
    int width, height;
    Rectangle(int w, int h) : width(w), height(h) { }
    int area() { return width * height; }
};

int main() {
    Rectangle r(3, 4);
    std::cout << r.area() << "\n";
    return 0;
}
` }),
] },

{ id: 'encap', title: 'Getters, setters & const', icon: '🔒', desc: 'Let the world look, but only change things through a guarded door.',
  v: [['5:42:51', '5:48:59', 'Getters & setters']],
  steps: [
  T('Controlled access', c`Private data plus small public methods is the standard pattern. A **getter** reads a value. A **setter** changes it — and gets the chance to refuse nonsense.`, c`
class Stove {
    int temperature = 0;

public:
    int getTemperature() const { return temperature; }

    void setTemperature(int t) {
        if (t < 0) t = 0;
        if (t > 10) t = 10;
        temperature = t;
    }
};`, c`With a public member, any line anywhere could write ~stove.temperature = 9000~. With a setter there is exactly one place where the rules live.`),
  T('const methods', c`The ~const~ **after** the parameter list is a promise: "this method does not change the object".`, c`
int getTemperature() const { return temperature; }`, c`It matters because of ~const &~ parameters. Through a ~const Stove &~ you may **only** call ~const~ methods — the compiler will not trust the others. Mark every method that only reads.`),
  Q(c`~void show(const Stove &s) { s.setTemperature(5); }~ — what happens?`, ['It sets the temperature to 5', c`Compile error: ~setTemperature~ is not a ~const~ method`, 'It changes a copy', 'It crashes at run time'], 1, c`The reference is ~const~, and the setter makes no promise not to modify the object.`),
  P(c`
class Tank {
    int fuel = 50;
public:
    int getFuel() const { return fuel; }
    void setFuel(int f) {
        if (f >= 0 && f <= 100) fuel = f;
    }
};

int main() {
    Tank t;
    t.setFuel(500);
    t.setFuel(80);
    t.setFuel(-1);
    std::cout << t.getFuel() << "\n";
}`, '80', c`The two silly values were rejected by the setter.`),
  Q(c`Why make a member ~private~ and add a setter instead of making it ~public~ ?`, ['It makes the program faster', 'It uses less memory', 'So every change goes through code that can validate it', 'Private members are required by the compiler'], 2),
  X({ q: c`Finish ~Health~. ~damage(n)~ subtracts ~n~ but never lets ~hp~ drop below 0. ~get()~ returns it and must be a ~const~ method.

The starter ~main~ must print ~70 0~`, start: c`#include <iostream>

class Health {
    int hp = 100;

public:
    // int get() const
    // void damage(int n)

};

int main() {
    Health h;
    h.damage(30);
    std::cout << h.get() << " ";
    h.damage(500);
    std::cout << h.get() << "\n";
    return 0;
}
`, tests: [{ out: '70 0' }], must: [[String.raw`get\s*\(\s*\)\s*const`, c`Mark the getter ~const~: ~int get() const { ... }~`]], hint: c`~void damage(int n) { hp -= n; if (hp < 0) hp = 0; }~`, sol: c`#include <iostream>

class Health {
    int hp = 100;

public:
    int get() const { return hp; }
    void damage(int n) {
        hp -= n;
        if (hp < 0) hp = 0;
    }
};

int main() {
    Health h;
    h.damage(30);
    std::cout << h.get() << " ";
    h.damage(500);
    std::cout << h.get() << "\n";
    return 0;
}
` }),
] },

{ id: 'inherit', title: 'Inheritance & virtual', icon: '👪', desc: 'Build a new class on top of an old one — and let it answer in its own way.',
  v: [['5:48:59', '', 'Inheritance']],
  steps: [
  T('"is a" relationships', c`A ~Dog~ **is an** ~Animal~. Inheritance says exactly that: the child class starts with everything the parent has, then adds its own.`, c`
class Animal {
public:
    bool alive = true;
    void eat() { std::cout << "nom\n"; }
};

class Dog : public Animal {       // Dog inherits from Animal
public:
    void bark() { std::cout << "woof\n"; }
};

Dog d;
d.eat();      // inherited
d.bark();     // its own`, c`The parent is called the **base** class, the child the **derived** class. A third access level appears here: ~protected~ members are hidden from the outside but visible to derived classes.`),
  Q(c`Given the code above, which line does **not** compile?`, [c`~Dog d; d.eat();~`, c`~Animal a; a.bark();~`, c`~Dog d; d.bark();~`, c`~Animal a; a.eat();~`], 1, c`Inheritance flows one way. Every Dog is an Animal; not every Animal is a Dog.`),
  T('Calling the base constructor', c`If the base class needs constructor arguments, the derived class passes them along in its initialiser list:`, c`
class Animal {
public:
    std::string name;
    Animal(std::string n) : name(n) { }
};

class Dog : public Animal {
public:
    Dog(std::string n) : Animal(n) { }    // hand n up to Animal
};`, c`The base part is always built first, then the derived part.`),
  T('virtual: the right version at run time', c`Now the important part. A derived class can **override** a base method. Mark the base method ~virtual~ and C++ picks the version by what the object **really is**, even when you only hold a base reference or pointer.`, c`
class Animal {
public:
    virtual void speak() const { std::cout << "...\n"; }
};

class Dog : public Animal {
public:
    void speak() const override { std::cout << "Woof\n"; }
};

void interview(const Animal &a) {
    a.speak();          // Woof for a Dog, ... for a plain Animal
}`, c`This is **polymorphism**. In C you would build it by hand with function pointers in a struct; ~virtual~ does exactly that for you. ~override~ asks the compiler to check you really are overriding something — it catches typos.`),
  P(c`
class Shape {
public:
    virtual int sides() const { return 0; }
};
class Triangle : public Shape {
public:
    int sides() const override { return 3; }
};
class Square : public Shape {
public:
    int sides() const override { return 4; }
};

void print(const Shape &s) { std::cout << s.sides(); }

int main() {
    Triangle t; Square q; Shape s;
    print(t); print(q); print(s);
}`, '340'),
  Q(c`Remove the word ~virtual~ from ~Shape::sides~ (and the ~override~ keywords). What does the program above print?`, [c`~340~`, c`~000~`, c`~344~`, 'It does not compile'], 1, c`Without ~virtual~ the call is decided at compile time from the **parameter type**, ~Shape~. Forgetting ~virtual~ is the classic C++ inheritance bug.`),
  X({ q: c`Add two classes derived from ~Enemy~:

• ~Goblin~ — ~attack()~ returns 5
• ~Dragon~ — ~attack()~ returns 50

The starter ~main~ must print ~1 5 50~`, start: c`#include <iostream>

class Enemy {
public:
    virtual int attack() const { return 1; }
};

// class Goblin, class Dragon

void report(const Enemy &e) {
    std::cout << e.attack();
}

int main() {
    Enemy e; Goblin g; Dragon d;
    report(e); std::cout << " ";
    report(g); std::cout << " ";
    report(d); std::cout << "\n";
    return 0;
}
`, tests: [{ out: '1 5 50' }], must: [[String.raw`:\s*public\s+Enemy`, c`Derive from Enemy: ~class Goblin : public Enemy~`]], hint: c`~class Goblin : public Enemy { public: int attack() const override { return 5; } };~`, sol: c`#include <iostream>

class Enemy {
public:
    virtual int attack() const { return 1; }
};

class Goblin : public Enemy {
public:
    int attack() const override { return 5; }
};

class Dragon : public Enemy {
public:
    int attack() const override { return 50; }
};

void report(const Enemy &e) {
    std::cout << e.attack();
}

int main() {
    Enemy e; Goblin g; Dragon d;
    report(e); std::cout << " ";
    report(g); std::cout << " ";
    report(d); std::cout << "\n";
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`Members of a ~class~ are, by default…`, [c`~public~`, c`~private~`, c`~protected~`, c`~static~`], 1),
  P(c`
class Dial {
    int v;
public:
    Dial(int start) : v(start) { }
    void up() { v++; }
    int get() const { return v; }
};

int main() {
    Dial a(5), b(9);
    a.up(); a.up();
    std::cout << a.get() + b.get() << "\n";
}`, '16'),
  Q(c`What does ~const~ mean in ~int get() const { ... }~ ?`, ['The return value is constant', 'The method does not modify the object', 'The method can only be called once', 'The parameters are constant'], 1),
  F('Dog inherits from Animal and overrides speak.', c`
class Dog : [[public]] Animal {
public:
    void speak() const [[override]] { std::cout << "Woof\n"; }
};`, null, true),
  Q(c`A base-class method must be marked ___ for the derived version to be chosen through a base reference.`, [c`~static~`, c`~public~`, c`~virtual~`, c`~inline~`], 2),
  Q(c`What does ~Player p();~ declare?`, ['A Player built with the default constructor', c`A function named ~p~ that returns a Player`, 'A pointer to a Player', 'A compile error'], 1, c`To default-construct, write ~Player p;~`),
  Q(c`In which order are the parts of a derived object constructed?`, ['Derived first, then base', 'Base first, then derived', 'Alphabetical order', 'It is random'], 1),
] });
