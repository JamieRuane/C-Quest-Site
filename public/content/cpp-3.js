/* ============ C++ TOPIC: MEMORY, THE C++ WAY ============ */
topic({ id: 'memory', title: 'Memory, the C++ Way', icon: '🧠', color: '#ff4b4b', blurb: 'new and delete — and then how to never write delete again.',
lessons: [
{ id: 'newdel', title: 'new & delete', icon: '🏢', desc: 'Ask for memory while the program is running, and give it back.',
  v: [['4:46:26', '4:52:15', 'Dynamic memory']],
  steps: [
  T('The heap', c`Ordinary variables live on the **stack**: they vanish when their function ends. Sometimes you need memory that outlives a function, or whose size you only learn while the program runs. That memory comes from the **heap**, and you ask for it with ~new~.`, c`
int *score = new int;        // one int on the heap
*score = 42;
delete score;                // give it back

int *grid = new int[100];    // an array of 100 ints
grid[0] = 7;
delete[] grid;               // arrays use delete[]`, c`~new~ gives you a pointer to fresh memory. It stays yours until **you** ~delete~ it. (If you know C: ~new~ / ~delete~ replace ~malloc~ / ~free~, with no ~sizeof~ and no cast.)`),
  Q(c`You allocated with ~new int[50]~. How do you release it?`, [c`~delete p;~`, c`~delete[] p;~`, c`~free(p);~`, 'It is released automatically'], 1, c`~new~ pairs with ~delete~, ~new[]~ pairs with ~delete[]~. Mixing them up is undefined behaviour.`),
  T('new also constructs', c`For a class, ~new~ does two jobs: it gets the memory **and** runs the constructor. ~delete~ runs the clean-up code (the destructor — next lesson) and then releases the memory.`, c`
Player *p = new Player("Ada", 100);   // constructor runs
std::cout << p->name << "\n";         // arrow, because p is a pointer
delete p;`),
  T('Three ways it goes wrong', c`Manual memory management has exactly the same dangers in every language that offers it:

**Leak** — you never ~delete~. The memory is lost until the program ends.

**Dangling pointer** — you use the pointer after ~delete~. Anything can happen.

**Double delete** — you ~delete~ the same memory twice. Usually a crash.`, c`
int *p = new int(5);
delete p;
// *p = 6;      dangling: p still holds the old address
// delete p;    double delete
p = nullptr;    // good habit: a deleted pointer points nowhere`, c`Modern C++ has a way to make all three impossible. First you need to see the mechanism it is built on.`),
  Q('A function allocates with new, then returns early because of an error, before reaching delete. What is that?', ['A dangling pointer', 'A memory leak', 'A double delete', 'A stack overflow'], 1),
  X({ q: c`Read ~n~, then ~n~ whole numbers. Store them in a heap array created with ~new~, print their sum, and release the array.

Input ~3~ then ~4 5 6~ gives ~15~`, start: M(c`
    int n;
    std::cin >> n;
    // allocate n ints with new[]

    // read them and add them up

    // release the memory
`), tests: [{ in: '3\n4 5 6\n', out: '15' }, { in: '1\n9\n', out: '9' }], must: [[String.raw`new\s+int\s*\[`, c`Allocate with ~new int[n]~.`], [String.raw`delete\s*\[\s*\]`, c`Release it with ~delete[]~.`]], hint: c`~int *a = new int[n];~ … loop with ~std::cin >> a[i]~ … ~delete[] a;~`, sol: M(c`
    int n;
    std::cin >> n;
    int *a = new int[n];
    int total = 0;
    for (int i = 0; i < n; i++) {
        std::cin >> a[i];
        total += a[i];
    }
    std::cout << total << "\n";
    delete[] a;`) }),
] },

{ id: 'raii', title: 'Destructors & RAII', icon: '🧹', desc: 'Clean-up code that the compiler promises to run.',
  steps: [
  T('The destructor', c`A constructor runs when an object is born. A **destructor** runs when it dies. It is named ~\~~ plus the class name, takes nothing and returns nothing.`, c`
class Door {
public:
    Door()  { std::cout << "open\n"; }
    ~Door() { std::cout << "close\n"; }
};

int main() {
    Door d;                    // prints: open
    std::cout << "inside\n";
}                              // d goes out of scope -> prints: close`, c`You never call the destructor yourself. For an ordinary (stack) object the compiler calls it at the closing brace — on **every** way out of the block, including an early ~return~.`),
  P(c`
class Tag {
    int id;
public:
    Tag(int i) : id(i) { std::cout << "+" << id; }
    ~Tag() { std::cout << "-" << id; }
};

int main() {
    Tag a(1);
    {
        Tag b(2);
    }
    Tag c(3);
}`, '+1+2-2+3-3-1', c`~b~ dies at the end of its inner block. At the end of ~main~, objects are destroyed in **reverse** order of creation: ~c~ then ~a~.`),
  T('RAII: let the object own the resource', c`Put those two facts together and you get the most important idea in C++: **acquire a resource in the constructor, release it in the destructor**. Then the resource is freed exactly when the object goes out of scope — automatically.`, c`
class Buffer {
    int *data;
public:
    Buffer(int n) : data(new int[n]) { }
    ~Buffer() { delete[] data; }      // runs no matter how we leave
};

void work() {
    Buffer b(1000);
    if (somethingWrong) return;       // no leak: ~Buffer still runs
}`, c`This pattern has the awkward name **RAII** ("resource acquisition is initialisation"). It is how ~std::string~ and ~std::vector~ free their memory, how files close themselves and how locks unlock.`),
  Q(c`Why did you never have to free a ~std::vector~ ?`, ['Vectors do not use the heap', 'Its destructor releases its memory when it goes out of scope', 'The operating system collects it once a minute', 'C++ has a garbage collector'], 1, c`C++ has **no** garbage collector. Clean-up is deterministic: it happens at the closing brace.`),
  Q(c`When does the destructor of a local object run?`, ['When you call it', 'When the object goes out of scope', 'When the program ends, always', 'Never, unless you use delete'], 1),
  X({ q: c`Give ~Session~ a constructor that prints ~login~ and a destructor that prints ~logout~ (each on its own line).

With the starter ~main~ the output must be:

~login~
~working~
~logout~`, start: c`#include <iostream>

class Session {
public:
    // constructor and destructor

};

int main() {
    Session s;
    std::cout << "working\n";
    return 0;
}
`, tests: [{ out: 'login\nworking\nlogout' }], must: [[String.raw`~\s*Session\s*\(`, c`Write a destructor: ~\~Session() { ... }~`]], hint: c`~Session() { std::cout << "login\n"; }~ and ~\~Session() { std::cout << "logout\n"; }~`, sol: c`#include <iostream>

class Session {
public:
    Session() { std::cout << "login\n"; }
    ~Session() { std::cout << "logout\n"; }
};

int main() {
    Session s;
    std::cout << "working\n";
    return 0;
}
` }),
] },

{ id: 'smart', title: 'Smart pointers', icon: '🤖', desc: 'Heap memory that deletes itself. You may never type delete again.',
  steps: [
  T('unique_ptr', c`RAII applied to ~new~ gives you the **smart pointer**: a small object that holds a pointer and deletes it in its destructor. The one to reach for first is ~std::unique_ptr~, from ~<memory>~.`, c`
#include <memory>

std::unique_ptr<Player> p = std::make_unique<Player>("Ada", 100);

std::cout << p->name << "\n";    // use it like a normal pointer
p->hp -= 10;

// no delete. When p goes out of scope, the Player is destroyed.`, c`~std::make_unique<Player>(...)~ replaces ~new Player(...)~. With ~auto~ the line gets much shorter: ~auto p = std::make_unique<Player>("Ada", 100);~`),
  Q(c`What deletes the object owned by a ~std::unique_ptr~ ?`, [c`You, with ~delete~`, c`The ~unique_ptr~'s destructor, when it goes out of scope`, 'A garbage collector, some time later', 'Nothing — it leaks'], 1),
  T('"unique" means one owner', c`A ~unique_ptr~ cannot be copied — if two of them owned the same object, both would delete it. Ownership can only be **moved**, which leaves the old pointer empty.`, c`
auto a = std::make_unique<int>(5);
// auto b = a;             compile error: cannot copy
auto b = std::move(a);     // b owns it now; a is empty (nullptr)`, c`When several parts of a program really must share one object, there is ~std::shared_ptr~: it counts its owners and deletes the object when the last one goes away.`),
  P(c`
auto a = std::make_unique<int>(7);
auto b = std::move(a);
*b += 1;
std::cout << *b << " " << (a == nullptr) << "\n";`, '8 1', c`After the move, ~a~ owns nothing and compares equal to ~nullptr~.`),
  Q('Which is the modern default for a single heap object?', [c`~Player *p = new Player();~ plus a careful ~delete~`, c`~auto p = std::make_unique<Player>();~`, c`~Player *p = (Player *)malloc(sizeof(Player));~`, c`A global variable`], 1, c`Rule of thumb for modern C++: no naked ~new~, no naked ~delete~. Containers for collections, smart pointers for single objects.`),
  X({ q: c`The starter leaks: it uses ~new~ and never deletes. Change it to use ~std::make_unique~ so no ~new~ and no ~delete~ appear.

The output must stay ~Rex says woof~`, start: c`#include <iostream>
#include <memory>
#include <string>

class Dog {
public:
    std::string name;
    Dog(std::string n) : name(n) { }
    void speak() const { std::cout << name << " says woof\n"; }
};

int main() {
    Dog *d = new Dog("Rex");
    d->speak();
    return 0;
}
`, tests: [{ out: 'Rex says woof' }], must: [['make_unique', c`Create the dog with ~std::make_unique<Dog>("Rex")~.`]], not: [[String.raw`\bnew\b`, c`No ~new~ — ~make_unique~ does the allocating.`], [String.raw`\bdelete\b`, c`No ~delete~ needed: the smart pointer cleans up.`]], hint: c`~auto d = std::make_unique<Dog>("Rex");~ — the next line does not change at all.`, sol: c`#include <iostream>
#include <memory>
#include <string>

class Dog {
public:
    std::string name;
    Dog(std::string n) : name(n) { }
    void speak() const { std::cout << name << " says woof\n"; }
};

int main() {
    auto d = std::make_unique<Dog>("Rex");
    d->speak();
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`Which pair is correct?`, [c`~new~ with ~free~`, c`~new[]~ with ~delete~`, c`~new[]~ with ~delete[]~`, c`~malloc~ with ~delete~`], 2),
  P(c`
class Note {
public:
    Note()  { std::cout << "A"; }
    ~Note() { std::cout << "Z"; }
};

int main() {
    std::cout << "1";
    {
        Note n;
        std::cout << "2";
    }
    std::cout << "3";
}`, '1A2Z3'),
  Q('RAII means…', ['Memory is collected by a background process', 'A resource is acquired in a constructor and released in the destructor', 'Every pointer must be checked for null', 'Arrays are always heap allocated'], 1),
  F('Heap memory with no delete.', c`
auto p = std::[[make_unique]]<int>(5);
std::cout << [[*]]p << "\n";`),
  Q(c`Can a ~std::unique_ptr~ be copied?`, ['Yes, freely', c`No — ownership can only be moved with ~std::move~`, 'Only inside a class', 'Only if it is null'], 1),
  Q('Using a pointer after its memory was deleted is called…', ['a leak', 'a dangling pointer', 'an overload', 'a template'], 1),
] });

/* ============ C++ TOPIC: THE STANDARD TOOLBOX ============ */
topic({ id: 'stl', title: 'The Standard Toolbox', icon: '🧰', color: '#00cd9c', blurb: 'Maps, lambdas, algorithms and exceptions — then a final boss.',
lessons: [
{ id: 'map', title: 'std::map', icon: '🗺️', desc: 'Look things up by name instead of by number.',
  steps: [
  T('Key → value', c`An array finds things by index. A ~std::map~ (from ~<map>~) finds things by **key** — any type you like, most often a string.`, c`
std::map<std::string, int> stock;    // key type, value type

stock["apple"] = 5;                  // insert
stock["pear"] = 2;
stock["apple"] += 1;                 // update

std::cout << stock["apple"] << "\n"; // 6
std::cout << stock.size() << "\n";   // 2`, c`Building this in C means writing your own hash table or search tree. Here it is one line.`),
  T('Checking and looping', c`Careful: reading a missing key with ~[ ]~ **creates** it (with value 0). To just ask, use ~.count(key)~, which is 1 if the key exists and 0 if not.

Looping gives you each pair, **sorted by key**.`, c`
if (stock.count("kiwi") == 0) {
    std::cout << "no kiwi\n";
}

for (const auto &item : stock) {
    std::cout << item.first << ": " << item.second << "\n";
}`, c`~item.first~ is the key, ~item.second~ the value. This is where ~auto~ earns its keep — the real type is ~std::pair<const std::string, int>~.`),
  P(c`
std::map<std::string, int> m;
m["b"] = 2;
m["a"] = 1;
m["b"] += 5;
for (const auto &kv : m) {
    std::cout << kv.first << kv.second << " ";
}`, 'a1 b7', c`A ~std::map~ keeps its keys in sorted order, whatever order you inserted them.`),
  Q(c`~std::map<std::string, int> ages;~ is empty. What does ~std::cout << ages["Bo"];~ do?`, ['Crashes', c`Prints 0 — and "Bo" is now in the map`, 'Prints nothing', 'Compile error'], 1),
  X({ q: c`Read words until the input ends. Print each different word with how many times it appeared, in alphabetical order.

Input ~tea milk tea tea milk~ gives:

~milk 2~
~tea 3~`, start: c`#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> counts;
    std::string word;
    while (std::cin >> word) {
        // count it

    }
    // print every word and its count

    return 0;
}
`, tests: [{ in: 'tea milk tea tea milk\n', out: 'milk 2\ntea 3' }, { in: 'x\n', out: 'x 1' }], hint: c`~counts[word]++;~ works even for a new word, because a missing key starts at 0.`, sol: c`#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> counts;
    std::string word;
    while (std::cin >> word) {
        counts[word]++;
    }
    for (const auto &kv : counts) {
        std::cout << kv.first << " " << kv.second << "\n";
    }
    return 0;
}
` }),
  Q(c`In ~for (const auto &kv : m)~ over a map, what is ~kv.second~ ?`, ['The key', 'The value', 'The index', 'The next element'], 1),
] },

{ id: 'algo', title: 'Lambdas & algorithms', icon: '⚡', desc: 'Sort, search and count in one line each.',
  steps: [
  T('Stop writing the same loops', c`~<algorithm>~ contains ready-made, well-tested versions of the loops everybody writes. They work on a **range**: from ~v.begin()~ to ~v.end()~.`, c`
std::vector<int> v = {4, 1, 3};

std::sort(v.begin(), v.end());                 // 1 3 4
std::reverse(v.begin(), v.end());              // 4 3 1
int n = std::count(v.begin(), v.end(), 3);     // how many 3s? -> 1`, c`~begin()~ and ~end()~ return **iterators** — think of them as pointers to the first element and to one past the last.`),
  T('Lambdas: a function on the spot', c`Many algorithms want you to supply a rule: sort **how**? count **which**? A **lambda** is a small unnamed function written right where it is needed.`, c`
auto isEven = [](int x) { return x % 2 == 0; };

std::cout << isEven(4) << "\n";    // 1`, c`~[]~ starts a lambda, then come the parameters and the body. If the lambda needs a variable from the surrounding code, name it in the brackets: ~[limit](int x) { return x > limit; }~. That is called a **capture**.`),
  P(c`
std::vector<int> v = {5, 12, 8, 20};
int limit = 10;
int n = std::count_if(v.begin(), v.end(), [limit](int x) { return x > limit; });
std::cout << n << "\n";`, '2'),
  T('Sorting your way', c`Give ~std::sort~ a lambda that answers "should ~a~ come before ~b~?" and you can sort by anything:`, c`
std::vector<std::string> names = {"Linus", "Ada", "Bjarne"};

std::sort(names.begin(), names.end(),
          [](const std::string &a, const std::string &b) { return a.length() < b.length(); });
// Ada Linus Bjarne`, c`In C this is ~qsort~ with a function pointer and ~void *~ casts. The lambda version is type-checked and usually faster.`),
  Q(c`What does ~[](int a, int b) { return a > b; }~ do when given to ~std::sort~ ?`, ['Sorts smallest first', 'Sorts largest first', 'Removes duplicates', 'Nothing — it is ignored'], 1, c`"~a~ comes before ~b~ when ~a~ is bigger" — descending order.`),
  X({ q: c`Read whole numbers until the input ends. Print them sorted from **largest to smallest**, separated by spaces.

Input ~3 9 1 7~ gives ~9 7 3 1~`, start: c`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    int n;
    while (std::cin >> n) v.push_back(n);
    // sort descending

    for (int x : v) std::cout << x << " ";
    std::cout << "\n";
    return 0;
}
`, tests: [{ in: '3 9 1 7\n', out: '9 7 3 1' }, { in: '2 2 5\n', out: '5 2 2' }], must: [[String.raw`std::sort`, c`Use ~std::sort~.`]], hint: c`~std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });~`, sol: c`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    int n;
    while (std::cin >> n) v.push_back(n);
    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
    for (int x : v) std::cout << x << " ";
    std::cout << "\n";
    return 0;
}
` }),
] },

{ id: 'except', title: 'Exceptions', icon: '⚠️', desc: 'Report an error from anywhere; handle it where it makes sense.',
  steps: [
  T('Errors without return codes', c`Checking a return code after every call — ~if (result == -1)~ — is easy to forget, and a forgotten check fails silently. C++ adds **exceptions**: an error is **thrown**, and it travels up through the calling functions until something **catches** it.`, c`
#include <stdexcept>

int divide(int a, int b) {
    if (b == 0) throw std::runtime_error("division by zero");
    return a / b;
}

try {
    std::cout << divide(10, 0) << "\n";
    std::cout << "never printed\n";
} catch (const std::runtime_error &e) {
    std::cout << "Error: " << e.what() << "\n";
}`, c`When ~throw~ happens, the rest of the ~try~ block is skipped. If **nobody** catches the exception, the program is terminated — an error can no longer be ignored by accident.`),
  P(c`
try {
    std::cout << "A";
    throw std::runtime_error("x");
    std::cout << "B";
} catch (const std::exception &e) {
    std::cout << "C";
}
std::cout << "D";`, 'ACD', c`~std::exception~ is the base class of all the standard exceptions, so catching it by reference catches any of them — polymorphism at work.`),
  T('Exceptions and RAII', c`While an exception travels upwards, every local object it passes has its **destructor** run. This is why RAII matters so much: vectors, strings and smart pointers all clean up properly even when an error interrupts the function. A raw ~new~ without ~delete~ would leak.

The standard library throws too:`, c`
std::vector<int> v = {1, 2, 3};

try {
    v.at(10) = 5;                       // out_of_range
} catch (const std::out_of_range &e) {
    std::cout << "bad index\n";
}

std::stoi("abc");                       // throws std::invalid_argument`),
  Q('An exception is thrown and no catch block anywhere matches it. What happens?', ['The error is ignored', 'The program is terminated', 'The function returns 0', 'The throw is retried'], 1),
  Q(c`Why catch by ~const std::exception &e~ rather than ~std::exception e~ ?`, ['It is shorter', 'A reference avoids a copy and keeps the real derived type', 'Exceptions cannot be copied', 'There is no difference'], 1),
  X({ q: c`Read one word and convert it with ~std::stoi~. If it is a number, print double it. If ~std::stoi~ throws, print ~not a number~.

~21~ gives ~42~ · ~cat~ gives ~not a number~`, start: c`#include <iostream>
#include <stdexcept>
#include <string>

int main() {
    std::string text;
    std::cin >> text;
    // try to convert; catch the failure

    return 0;
}
`, tests: [{ in: '21\n', out: '42' }, { in: 'cat\n', out: 'not a number' }], must: [[String.raw`\btry\b`, c`Wrap the conversion in ~try { ... }~.`], [String.raw`\bcatch\b`, c`Handle the failure with ~catch~.`]], hint: c`~try { int n = std::stoi(text); ... } catch (const std::exception &e) { ... }~`, sol: c`#include <iostream>
#include <stdexcept>
#include <string>

int main() {
    std::string text;
    std::cin >> text;
    try {
        int n = std::stoi(text);
        std::cout << n * 2 << "\n";
    } catch (const std::exception &e) {
        std::cout << "not a number\n";
    }
    return 0;
}
` }),
] },

{ id: 'boss', title: 'Final boss', icon: '👑', desc: 'Two programs that use everything at once.',
  steps: [
  T('Putting it together', c`You now have the core of modern C++:

**std::string** and **std::vector** instead of raw arrays · **references** instead of most pointers · **classes** with constructors and private data · **virtual** methods for polymorphism · **RAII** and **smart pointers** instead of manual clean-up · **maps, algorithms and lambdas** instead of hand-written loops · **exceptions** instead of return codes.

Two capstones. No hints about which tool to use — that choice is the skill.`),
  X({ q: c`**Gradebook.** Each input line is a name followed by a whole-number score. Read until the input ends, then print every student from the **highest score to the lowest** as ~name score~, and finally ~average~ followed by the average score as a whole number (integer division).

Input:
~Ada 90~
~Bo 72~
~Cy 85~

Output:
~Ada 90~
~Cy 85~
~Bo 72~
~average 82~`, start: c`#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Student {
    std::string name;
    int score;
};

int main() {
    std::vector<Student> students;
    // read, sort, print

    return 0;
}
`, tests: [{ in: 'Ada 90\nBo 72\nCy 85\n', out: 'Ada 90\nCy 85\nBo 72\naverage 82' }, { in: 'Zed 10\nAmy 30\n', out: 'Amy 30\nZed 10\naverage 20' }], hint: c`Read with ~while (std::cin >> name >> score)~ and ~push_back({name, score})~. Sort with a lambda comparing ~a.score > b.score~.`, sol: c`#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Student {
    std::string name;
    int score;
};

int main() {
    std::vector<Student> students;
    std::string name;
    int score;
    while (std::cin >> name >> score) {
        students.push_back({name, score});
    }
    std::sort(students.begin(), students.end(),
              [](const Student &a, const Student &b) { return a.score > b.score; });
    int total = 0;
    for (const Student &s : students) {
        std::cout << s.name << " " << s.score << "\n";
        total += s.score;
    }
    std::cout << "average " << total / (int)students.size() << "\n";
    return 0;
}
` }),
  X({ q: c`**Shapes.** Finish the program: ~Circle~ and ~Rect~ both derive from ~Shape~ and override ~area()~ and ~name()~. Use 3 for pi so the numbers stay whole.

• ~Circle(r)~ — area is ~3 * r * r~, name is ~circle~
• ~Rect(w, h)~ — area is ~w * h~, name is ~rect~

The starter ~main~ must print:

~circle 12~
~rect 20~
~total 32~`, start: c`#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Shape {
public:
    virtual int area() const = 0;            // "= 0": every shape MUST provide this
    virtual std::string name() const = 0;
    virtual ~Shape() { }
};

// class Circle, class Rect

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(2));
    shapes.push_back(std::make_unique<Rect>(4, 5));

    int total = 0;
    for (const auto &s : shapes) {
        std::cout << s->name() << " " << s->area() << "\n";
        total += s->area();
    }
    std::cout << "total " << total << "\n";
    return 0;
}
`, tests: [{ out: 'circle 12\nrect 20\ntotal 32' }], hint: c`~class Circle : public Shape { int r; public: Circle(int r) : r(r) { } int area() const override { return 3 * r * r; } std::string name() const override { return "circle"; } };~`, sol: c`#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Shape {
public:
    virtual int area() const = 0;
    virtual std::string name() const = 0;
    virtual ~Shape() { }
};

class Circle : public Shape {
    int r;
public:
    Circle(int r) : r(r) { }
    int area() const override { return 3 * r * r; }
    std::string name() const override { return "circle"; }
};

class Rect : public Shape {
    int w, h;
public:
    Rect(int w, int h) : w(w), h(h) { }
    int area() const override { return w * h; }
    std::string name() const override { return "rect"; }
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(2));
    shapes.push_back(std::make_unique<Rect>(4, 5));

    int total = 0;
    for (const auto &s : shapes) {
        std::cout << s->name() << " " << s->area() << "\n";
        total += s->area();
    }
    std::cout << "total " << total << "\n";
    return 0;
}
` }),
  T('Where next?', c`That second program is real, modern C++: an abstract base class, a vector of smart pointers, polymorphic calls and not one ~delete~ in sight.

From here: write your own class templates, learn move semantics properly, explore ~<algorithm>~ and ~<ranges>~, and build something — a text adventure, a small game with SFML or raylib, a command-line tool.

And if you have not tried the other language on this site yet: the switcher is at the top of the page.`),
] },
],
quiz: [
  P(c`
std::map<std::string, int> m;
m["x"]++;
m["x"]++;
m["y"];
std::cout << m["x"] << m.size() << "\n";`, '22'),
  Q(c`What does ~[]~ at the start of ~[](int x) { return x * 2; }~ mark?`, ['An empty array', 'The start of a lambda (its capture list)', 'An index operator', 'A template'], 1),
  P(c`
std::vector<int> v = {3, 1, 2};
std::sort(v.begin(), v.end());
std::cout << v[0] << v[2] << "\n";`, '13'),
  F('Catch any standard exception.', c`
[[try]] {
    risky();
} [[catch]] (const std::exception &e) {
    std::cout << e.[[what]]() << "\n";
}`, null, true),
  Q('While an exception travels up through functions, what happens to their local objects?', ['They leak', 'Their destructors run', 'They are copied to the catch block', 'Nothing until the program ends'], 1),
  Q(c`~virtual int area() const = 0;~ makes ~Shape~…`, ['a class whose area is always 0', 'an abstract class: you cannot create a plain Shape, and derived classes must provide area', 'a template', 'a constant'], 1),
] });

/* ============ C++ GLOSSARY ============ */
G('compiler', c`The program (here: ~g++~) that translates your whole ~.cpp~ file into machine code before anything runs.`);
G('main()', c`The function where every C++ program starts executing.`);
G('variable', c`A named box in memory with a fixed type, e.g. ~int lives = 3;~`);
G('integer division', c`Dividing two ints throws away the remainder: ~7 / 2~ is ~3~. Make one side a decimal to get ~3.5~.`);
G('function', c`A named, reusable block of code. Takes parameters, optionally returns one value.`);
G('array', c`A fixed-size row of same-typed values, indexed from **0**.`);
G('struct', c`A custom type that bundles several variables (members) into one. In C++ it can have methods too.`);
G('pointer', c`A variable that stores a memory address. ~int *p = &x;~ — follow it with ~*p~.`);
G('std::cout', c`The standard output stream. ~std::cout << value;~ prints any built-in type without a format string.`);
G('std::cin', c`The standard input stream. ~std::cin >> variable;~ reads one value; ~std::getline~ reads a whole line.`);
G('<< and >>', c`Stream insertion and extraction. The arrows show which way the data flows.`);
G('namespace', c`A named container for names. Everything in the standard library is in ~std~; ~::~ looks inside.`);
G('std::endl', c`Ends the line **and** flushes the output. ~"\n"~ just ends the line and is faster.`);
G('auto', c`Lets the compiler deduce a variable's type from its initial value. The type is still fixed at compile time.`);
G('nullptr', c`The null pointer value. Has its own type, so it is never confused with the integer 0.`);
G('constexpr', c`A value the compiler computes at compile time. The typed, scoped replacement for ~#define~ constants.`);
G('range-based for', c`~for (int x : container)~ — visits every element with no index and no off-by-one.`);
G('std::string', c`C++'s text type. Manages its own memory; supports ~=~, ~+~, ~==~, ~.length()~, ~.substr()~, ~.find()~.`);
G('std::string::npos', c`The "not found" value returned by ~find~.`);
G('std::vector', c`A resizable array that knows its size and frees its own memory. ~push_back~ adds to the end.`);
G('template', c`A blueprint with a placeholder type (~template <typename T>~). The compiler generates a real version for each type you use.`);
G('reference', c`An alias for an existing variable: ~int &r = x;~. Cannot be null and cannot be re-bound.`);
G('pass by reference', c`A parameter declared with ~&~ works on the caller's variable instead of a copy.`);
G('const reference', c`~const T &~ — pass without copying and promise not to modify. The default for strings, vectors and objects.`);
G('overloading', c`Several functions with the same name but different parameter lists. The compiler picks by the arguments.`);
G('default argument', c`A parameter value used when the caller leaves it out: ~void f(int n = 1);~`);
G('class', c`A type that bundles data with the functions that work on it. Members are private by default.`);
G('object', c`One variable of a class type — an **instance** of the class.`);
G('method (member function)', c`A function that belongs to a class and is called on an object: ~player.heal(10);~`);
G('private / public / protected', c`Access levels. Private: only the class's own methods. Protected: also derived classes. Public: everyone.`);
G('encapsulation', c`Hiding data behind methods so the rules for changing it live in one place.`);
G('constructor', c`A method with the class's name and no return type that runs automatically when an object is created.`);
G('initialiser list', c`The ~: member(value), ...~ part of a constructor that initialises members directly.`);
G('this', c`Inside a method, a pointer to the object the method was called on.`);
G('const method', c`A method marked ~const~ after its parameter list: a promise not to modify the object.`);
G('inheritance', c`~class Dog : public Animal~ — Dog starts with everything Animal has. Base class → derived class.`);
G('virtual', c`Marks a method whose derived version should be chosen at run time, even through a base reference or pointer.`);
G('override', c`Asks the compiler to check that a method really overrides a virtual method in the base class.`);
G('polymorphism', c`One call, many behaviours: ~shape.area()~ runs the right version for whatever shape the object really is.`);
G('abstract class', c`A class with at least one pure virtual method (~= 0~). You cannot create objects of it directly.`);
G('new / delete', c`Allocate and release heap memory (and run the constructor / destructor). ~new[]~ pairs with ~delete[]~.`);
G('memory leak', c`Heap memory that was allocated but never released.`);
G('dangling pointer', c`A pointer to memory that has already been deleted.`);
G('destructor', c`~\~ClassName()~ — runs automatically when an object dies. Used to release what the object owns.`);
G('RAII', c`Acquire a resource in a constructor, release it in the destructor, so clean-up happens automatically at the end of scope.`);
G('std::unique_ptr', c`A smart pointer that solely owns a heap object and deletes it automatically. Create with ~std::make_unique~.`);
G('std::shared_ptr', c`A smart pointer for shared ownership: the object is deleted when its last owner goes away.`);
G('std::move', c`Transfers ownership from one object to another, leaving the source empty.`);
G('std::map', c`A sorted key → value container. ~m[key]~ reads or creates; ~m.count(key)~ asks whether it exists.`);
G('iterator', c`An object that points at an element of a container. ~begin()~ is the first; ~end()~ is one past the last.`);
G('lambda', c`A small unnamed function written in place: ~[](int x) { return x * 2; }~. The ~[]~ lists captured variables.`);
G('STL', c`The Standard Template Library: the containers (~vector~, ~map~...) and algorithms (~sort~, ~count_if~...) of the standard library.`);
G('exception', c`An error object that is thrown with ~throw~ and travels up the call stack until a matching ~catch~ handles it.`);
G('try / catch', c`~try~ wraps code that might throw; ~catch~ handles the exception. Catch by ~const~ reference.`);
