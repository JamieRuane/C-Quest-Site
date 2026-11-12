/* ============ C++ · "I already know C" path only: FROM C TO C++ ============ */
topic({ id: 'start', track: 'c', title: 'From C to C++', icon: '👋', color: '#58cc02', blurb: 'Same braces, same semicolons — new ways to print, read and declare.',
lessons: [
{ id: 'hello', title: 'Hello again, World', icon: '🚀', desc: 'printf retires. Meet std::cout and the << operator.',
  v: [['0:00:00', '0:13:30', 'C++ tutorial for beginners (setup + first program)'], ['0:27:37', '0:32:13', 'Namespaces']],
  steps: [
  T('You already know most of this', c`C++ started life as "C with classes". Almost everything you know still works: ~int~, ~if~, ~for~, ~while~, functions, arrays, structs, pointers.

This course skips all of that and only teaches what is **new or different**. First difference: printing.`, c`
#include <iostream>

int main() {
    std::cout << "Hello, World!\n";
    return 0;
}`, c`~<iostream>~ replaces ~<stdio.h>~ (no ~.h~ on C++ headers). ~std::cout~ is "**c**haracter **out**put". ~<<~ pushes a value into it.`),
  Q(c`In ~std::cout << "Hi";~ what does ~<<~ do?`, ['Shifts bits to the left, like in C', c`Sends the value on its right into the output stream on its left`, 'Compares two values', 'Reads a value from the keyboard'], 1, c`It is the same symbol as C's left shift, but C++ lets types give operators new meanings. For streams, ~<<~ means "insert". Picture the arrows: data flows **towards** ~cout~.`),
  T('No more format specifiers', c`~printf~ needed ~%d~, ~%f~, ~%s~ — and crashed or printed garbage if you picked the wrong one. ~cout~ already knows the type of every value, and you can chain as many ~<<~ as you like:`, c`
int lives = 3;
double speed = 2.5;
char rank = 'S';

std::cout << "Lives: " << lives << ", speed: " << speed << ", rank: " << rank << "\n";
// Lives: 3, speed: 2.5, rank: S`, c`To end a line use ~"\n"~ or ~std::endl~. They look the same on screen; ~std::endl~ also forces the output to be written out immediately, which is slower in a loop.`),
  P(c`
int a = 7, b = 2;
std::cout << a << b << "\n";
std::cout << a / b << " " << a % b << "\n";`, '72\n3 1', c`~cout~ adds **no** spaces of its own: 7 then 2 is ~72~. And the maths has not changed since C: int / int is still integer division.`),
  T('What is std:: ?', c`C has one giant pile of names — which is why libraries prefix everything (~SDL_Init~, ~gtk_window_new~...). C++ sorts names into **namespaces**. Everything in the standard library lives in the namespace ~std~, and ~::~ means "look inside".`, c`
namespace robot { int speed = 5; }
namespace car   { int speed = 90; }

std::cout << robot::speed << " " << car::speed << "\n";   // 5 90`, c`You will see tutorials write ~using namespace std;~ so they can type plain ~cout~. It works, but it dumps hundreds of names into your program. This course writes ~std::~ every time — the habit most C++ teams insist on.`),
  F('Rebuild the C++ Hello World.', c`
#include <[[iostream]]>

int main() {
    [[std]]::[[cout]] [[<<]] "Hello, World!\n";
    return 0;
}`),
  X({ q: c`Translate this C line to C++ (no ~printf~ allowed):

~printf("%d items cost %.1f\n", items, price);~

With the variables in the starter code it must print exactly ~3 items cost 4.5~`, start: M(c`
    int items = 3;
    double price = 4.5;
    // print them with std::cout
`), tests: [{ out: '3 items cost 4.5' }], not: [['printf', c`No ~printf~ this time — use ~std::cout~.`]], hint: c`Chain it: ~std::cout << items << " items cost " << price << "\n";~`, sol: M(c`
    int items = 3;
    double price = 4.5;
    std::cout << items << " items cost " << price << "\n";`) }),
  Q(c`Which line compiles in a program that includes ~<iostream>~ and has **no** ~using~ line?`, [c`~cout << "Hi";~`, c`~std::cout << "Hi";~`, c`~std.cout << "Hi";~`, c`~std->cout << "Hi";~`], 1, c`~::~ is the scope operator. The dot and arrow are still for members of objects and pointers, exactly as in C.`),
] },

{ id: 'cin', title: 'Reading input with cin', icon: '⌨️', desc: 'scanf retires too — no & and no format string.',
  v: [['0:47:05', '0:52:35', 'User input']],
  steps: [
  T('cin >> variable', c`~std::cin~ is the keyboard. ~>>~ pulls a value **out** of it and into a variable. The arrows flip because the data flows the other way.`, c`
int age;
double height;

std::cout << "Age and height? ";
std::cin >> age >> height;`, c`Compare with ~scanf("%d %lf", &age, &height);~ — no format string to get wrong, and no ~&~ to forget. ~cin~ works out the type from the variable.`),
  Q(c`Which reads a whole number into ~int n;~ ?`, [c`~std::cin << n;~`, c`~std::cin >> &n;~`, c`~std::cin >> n;~`, c`~std::cout >> n;~`], 2, c`~>>~ points from the stream **into** the variable. No ~&~ needed — ~cin~ takes the variable by reference (you will build that yourself in a few lessons).`),
  T('Words vs. whole lines', c`~cin >> text~ skips spaces and then reads **one word**. For a full line, use ~std::getline~.

~std::string~ is C++'s text type (it lives in ~<string>~). It grows to fit — no ~char name[50]~, no buffer overflow. It gets its own topic next.`, c`
std::string first, full;

std::cin >> first;               // typed "Ada Lovelace" -> first is "Ada"
std::getline(std::cin, full);    // reads the REST of the line: " Lovelace"`),
  Q(c`The user types ~Grace Hopper~ and presses Enter. What is in ~name~ after ~std::cin >> name;~ ?`, [c`~Grace Hopper~`, c`~Grace~`, c`~Hopper~`, 'Nothing — it is an error'], 1, c`~>>~ stops at the first space. Exactly like ~scanf("%s")~, but without the overflow risk.`),
  T('The classic trap: >> then getline', c`~cin >> age~ reads the number but leaves the Enter key (~'\n'~) sitting in the input. A ~getline~ straight after sees that newline and returns an **empty** line.

The fix is ~std::ws~, which eats leftover whitespace first:`, c`
int age;
std::string name;

std::cin >> age;
std::getline(std::cin >> std::ws, name);   // skip the old newline, then read the line`),
  X({ q: c`Read a whole number and then a full name (which may contain spaces). Print them as shown.

Input:
~36~
~Ada Lovelace~

Output: ~Ada Lovelace is 36~`, start: c`#include <iostream>
#include <string>

int main() {
    int age;
    std::string name;
    // read age, then the whole name line

    return 0;
}
`, tests: [{ in: '36\nAda Lovelace\n', out: 'Ada Lovelace is 36' }, { in: '7\nBo\n', out: 'Bo is 7' }], hint: c`~std::cin >> age;~ then ~std::getline(std::cin >> std::ws, name);~`, sol: c`#include <iostream>
#include <string>

int main() {
    int age;
    std::string name;
    std::cin >> age;
    std::getline(std::cin >> std::ws, name);
    std::cout << name << " is " << age << "\n";
    return 0;
}
` }),
  F('Read two numbers and print their sum.', c`
int a, b;
std::[[cin]] [[>>]] a [[>>]] b;
std::cout [[<<]] a + b << "\n";`),
] },

{ id: 'upgrades', title: 'Small upgrades you get for free', icon: '🎁', desc: 'bool, auto, nullptr, constexpr and a for loop that cannot go out of bounds.',
  v: [['3:05:40', '3:08:36', 'Foreach loop'], ['0:24:14', '0:27:37', 'Const']],
  steps: [
  T('Things C made you ask for', c`Several things that needed a header or a ~typedef~ in C are simply built in:`, c`
bool alive = true;            // no <stdbool.h>
int *p = nullptr;             // a real null pointer, replaces NULL

struct Player { int hp; };
Player hero = {100};          // no "struct Player", no typedef

constexpr int MAX = 64;       // a true compile-time constant, replaces #define
int grid[MAX];`, c`~nullptr~ has its own type, so it can never be mistaken for the integer 0. ~constexpr~ values obey scope and have a type — everything ~#define~ does not.`),
  Q(c`In C++, how do you declare a variable of this type?

~struct Enemy { int hp; };~`, [c`It must be ~struct Enemy e;~`, c`~Enemy e;~ works — the struct name is a type name`, c`Only after a ~typedef~`, c`~new Enemy e;~`], 1, c`The ~typedef struct { ... } Name;~ dance from C is not needed any more.`),
  T('auto: let the compiler write the type', c`~auto~ tells the compiler: "you can see what the right-hand side is — use that type."`, c`
auto lives = 3;        // int
auto speed = 2.5;      // double
auto rank = 'S';       // char
auto done = false;     // bool`, c`The type is still fixed forever at compile time. This is **not** a "can hold anything" variable — ~lives = "three";~ is still an error. ~auto~ just saves typing, which matters once type names get long.`),
  Q(c`What is the type of ~x~ ?

~auto x = 7 / 2;~`, [c`~double~, value 3.5`, c`~int~, value 3`, c`~float~, value 3.5`, c`It changes while the program runs`], 1, c`Both operands are ~int~, so the result is the ~int~ 3 and ~auto~ becomes ~int~. ~auto~ copies the type the expression already has — it never "upgrades" it.`),
  T('The range-based for loop', c`How many times have you written ~for (int i = 0; i < n; i++)~ just to visit every element? C++ has a loop for exactly that:`, c`
int scores[] = {90, 75, 88};

for (int s : scores) {
    std::cout << s << "\n";
}`, c`Read it as "for each ~s~ **in** ~scores~". No index, no size, no off-by-one. It works on arrays, strings, vectors — every container you will meet in this course.`),
  P(c`
int nums[] = {4, 1, 3};
int total = 0;
for (int n : nums) {
    total += n;
}
std::cout << total << "\n";`, '8'),
  X({ q: c`Use a **range-based for loop** to find the largest value in ~temps~ and print it.

Expected output: ~31~`, start: M(c`
    int temps[] = {18, 25, 31, 22, 29};
    int best = temps[0];
    // loop over temps with a range-based for

    std::cout << best << "\n";`), tests: [{ out: '31' }], must: [[String.raw`for\s*\(\s*(const\s+)?(int|auto)\s*&?\s*\w+\s*:`, c`Use the range-based form: ~for (int t : temps)~`]], hint: c`~for (int t : temps) { if (t > best) best = t; }~`, sol: M(c`
    int temps[] = {18, 25, 31, 22, 29};
    int best = temps[0];
    for (int t : temps) {
        if (t > best) best = t;
    }
    std::cout << best << "\n";`) }),
] },
],
quiz: [
  Q(c`Which header gives you ~std::cout~ and ~std::cin~ ?`, [c`~<stdio.h>~`, c`~<iostream>~`, c`~<cout>~`, c`~<std>~`], 1),
  P(c`
int x = 5;
std::cout << "x" << x << "\n" << x + 1;`, 'x5\n6'),
  Q(c`What does ~::~ mean in ~std::cout~ ?`, ['Member of a struct', 'Pointer dereference', c`"Look inside this namespace"`, 'Shift left twice'], 2),
  F('Read a number, print double it.', c`
int n;
std::cin [[>>]] n;
std::cout [[<<]] n * 2 << "\n";`),
  Q(c`Which replaces ~NULL~ in modern C++?`, [c`~null~`, c`~nullptr~`, c`~nil~`, c`~0L~`], 1),
  Q(c`After ~std::cin >> age;~ a ~std::getline~ returns an empty string. Why?`, ['getline cannot follow cin', 'The Enter key pressed after the number is still waiting in the input', 'The string is too small', c`~age~ was not initialised`], 1, c`Fix: ~std::getline(std::cin >> std::ws, name);~`),
  O('Print every element of an array.', c`
int a[] = {1, 2, 3};
for (int v : a) {
    std::cout << v << "\n";
}`),
] });

/* ============ TOPIC 2: STRINGS & VECTORS ============ */
topic({ id: 'strings', title: 'Strings & Vectors', icon: '🧵', color: '#1cb0f6', blurb: 'Text and arrays that know their own size and grow when you ask.',
lessons: [
{ id: 'string', title: 'std::string', icon: '🧵', desc: 'No more strcpy, strcat, strcmp or counting the null terminator.',
  v: [['1:29:17', '1:35:51', 'Useful string methods in C++']],
  steps: [
  T('Text is finally a real type', c`In C a string is a ~char~ array you manage by hand. In C++, ~std::string~ (from ~<string>~) manages its own memory, so the operators you always wished worked... work:`, c`
std::string name = "Ada";
std::string greeting = "Hello, " + name;   // join with +   (was strcat)

name = "Grace";                            // assign with = (was strcpy)

if (name == "Grace") {                     // compare with == (was strcmp)
    std::cout << greeting << "\n";
}`, c`It grows as needed and frees its memory by itself. Buffer overflows from ~strcpy~ simply cannot happen here.`),
  Q(c`In C, ~if (a == b)~ on two ~char~ arrays compares their addresses. With two ~std::string~ values, ~a == b~ compares…`, ['their addresses, as before', 'their lengths only', 'their characters — the actual text', 'nothing; it is a compile error'], 2, c`~std::string~ defines ~==~ to mean "same text". Also ~<~ and ~>~ for alphabetical order.`),
  P(c`
std::string a = "sun";
std::string b = a + "flower";
a += "!";
std::cout << b << " " << a << "\n";`, 'sunflower sun!', c`~b~ was built from the old value of ~a~. Strings are **values**: copying one makes an independent copy.`),
  T('Length and characters', c`A ~std::string~ knows its own length — no ~strlen~ walk, no ~'\0'~ to account for. You can still index it like an array, and the range-based for visits each ~char~.`, c`
std::string word = "pixel";

std::cout << word.length() << "\n";   // 5
std::cout << word[0] << "\n";         // p
word[0] = 'P';                        // strings are mutable

for (char ch : word) {
    std::cout << ch << "-";           // P-i-x-e-l-
}`, c`~.length()~ and ~.size()~ are the same thing. The dot calls a **member function** — a function that belongs to the object. You will write your own in the Classes topic.`),
  F('Print how many characters the user typed.', c`
std::string word;
std::cin >> word;
std::cout << word.[[length~size]]() << "\n";`),
  X({ q: c`Read one word. Print it, then print it **backwards** on the next line.

Input ~stressed~ gives:

~stressed~
~desserts~`, start: c`#include <iostream>
#include <string>

int main() {
    std::string word;
    std::cin >> word;
    std::string reversed = "";
    // build reversed here

    std::cout << word << "\n" << reversed << "\n";
    return 0;
}
`, tests: [{ in: 'stressed\n', out: 'stressed\ndesserts' }, { in: 'abc\n', out: 'abc\ncba' }], hint: c`Loop over the characters and put each one at the **front**: ~reversed = ch + reversed;~`, sol: c`#include <iostream>
#include <string>

int main() {
    std::string word;
    std::cin >> word;
    std::string reversed = "";
    for (char ch : word) {
        reversed = ch + reversed;
    }
    std::cout << word << "\n" << reversed << "\n";
    return 0;
}
` }),
] },

{ id: 'strmeth', title: 'String methods', icon: '🔧', desc: 'Search, slice and convert without touching a single pointer.',
  steps: [
  T('The everyday toolkit', c`Everything you once did with ~<string.h>~ is now a method on the string itself:`, c`
std::string s = "hello world";

s.empty();          // false      is it ""?
s.find("world");    // 6          index where it starts
s.substr(0, 5);     // "hello"    (start, how many)
s.substr(6);        // "world"    from index 6 to the end
s.append("!");      // s is now "hello world!"
s.clear();          // s is now ""`, c`~substr~ takes a **start** and a **count** — not a start and an end. That trips up everyone once.`),
  P(c`
std::string s = "programming";
std::cout << s.substr(3, 4) << "\n";`, 'gram', c`Start at index 3 (~g~), take 4 characters.`),
  T('When find finds nothing', c`~find~ cannot return ~-1~ because positions are unsigned. Instead it returns a special giant value: ~std::string::npos~ ("no position").`, c`
std::string email = "ada@example.com";

if (email.find("@") != std::string::npos) {
    std::cout << "looks like an email\n";
}`),
  Q(c`What does ~s.find("z")~ return when ~s~ is ~"apple"~ ?`, [c`~-1~`, c`~0~`, c`~std::string::npos~`, 'It throws an error'], 2),
  T('Numbers ⇄ text', c`~atoi~ and ~sprintf~ are replaced by two tidy families of functions:`, c`
int n = std::stoi("42");            // string -> int   ("string to int")
double d = std::stod("3.5");        // string -> double
std::string t = std::to_string(7);  // number -> string

std::string label = "Level " + std::to_string(n + 1);   // "Level 43"`, c`You need ~to_string~ because ~"Level " + 43~ does **not** join text and a number — it is C pointer arithmetic on a string literal, just like before.`),
  Q(c`Which builds the text ~Score: 10~ from ~int score = 10;~ ?`, [c`~"Score: " + score~`, c`~"Score: " + std::to_string(score)~`, c`~"Score: " . score~`, c`~std::stoi("Score: ") + score~`], 1),
  X({ q: c`Read an email address (one word). Print the part **before** the ~@~, then the part **after** it, on separate lines.

Input ~ada@example.com~ gives:

~ada~
~example.com~`, start: c`#include <iostream>
#include <string>

int main() {
    std::string email;
    std::cin >> email;
    // find the @, then use substr twice

    return 0;
}
`, tests: [{ in: 'ada@example.com\n', out: 'ada\nexample.com' }, { in: 'x@y.org\n', out: 'x\ny.org' }], must: [['substr', c`Use ~.substr()~ to cut the string.`]], hint: c`~auto at = email.find("@");~ then ~email.substr(0, at)~ and ~email.substr(at + 1)~`, sol: c`#include <iostream>
#include <string>

int main() {
    std::string email;
    std::cin >> email;
    auto at = email.find("@");
    std::cout << email.substr(0, at) << "\n";
    std::cout << email.substr(at + 1) << "\n";
    return 0;
}
` }),
] },

{ id: 'vector', title: 'std::vector', icon: '📚', desc: 'The array you always wanted: it knows its size and it grows.',
  steps: [
  T('malloc + realloc, done for you', c`A C array has a fixed size and forgets it the moment you pass it to a function. A ~std::vector~ (from ~<vector>~) is a resizable array that looks after its own heap memory.`, c`
std::vector<int> scores = {90, 75};   // the type of element goes in < >

scores.push_back(88);                 // add to the end - grows automatically

std::cout << scores.size() << "\n";   // 3
std::cout << scores[0] << "\n";       // 90   same indexing as an array`, c`No ~malloc~, no ~realloc~, no ~free~. When the vector goes out of scope, its memory is released for you.`),
  Q(c`What does the ~<int>~ in ~std::vector<int>~ mean?`, ['The vector can hold at most int-many items', 'Every element in this vector is an int', 'The vector is indexed by ints', 'It is a cast'], 1, c`~vector~ is a **template**: one design, any element type. ~std::vector<double>~, ~std::vector<std::string>~, ~std::vector<Player>~...`),
  P(c`
std::vector<int> v = {1, 2};
v.push_back(5);
v.push_back(7);
v.pop_back();
std::cout << v.size() << " " << v.back() << "\n";`, '3 5', c`~pop_back~ removes the last element (the 7). ~back()~ is the last one still there.`),
  T('Looping and safe access', c`The range-based for was made for this. And when you want bounds checking, ~.at(i)~ refuses to read outside the vector instead of handing you garbage.`, c`
std::vector<std::string> names = {"Ada", "Linus"};

for (std::string n : names) {
    std::cout << n << "\n";
}

names[5];       // out of bounds: undefined behaviour, same as C
names.at(5);    // out of bounds: stops the program with a clear error`),
  Q(c`A vector has 3 elements. What happens with ~v.at(3)~ ?`, ['Returns 0', 'Returns garbage, like a C array', 'Throws an out_of_range error instead of reading bad memory', 'The vector grows to 4 elements'], 2, c`Valid indexes are still 0 to ~size() - 1~. ~at~ checks; ~[ ]~ does not.`),
  F('Add a value, then print how many there are.', c`
std::vector<double> prices;
prices.[[push_back]](9.99);
std::cout << prices.[[size]]() << "\n";`),
  X({ q: c`Read whole numbers until you read a ~0~. Store them (not the 0) in a vector, then print them in **reverse** order, one per line.

Input ~3 8 5 0~ gives:

~5~
~8~
~3~`, start: c`#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums;
    int n;
    // read until 0, push_back each one

    // print from the last index down to 0

    return 0;
}
`, tests: [{ in: '3 8 5 0\n', out: '5\n8\n3' }, { in: '42 0\n', out: '42' }], must: [['push_back', c`Store the numbers with ~push_back~.`]], hint: c`~while (std::cin >> n && n != 0) nums.push_back(n);~ then count down: ~for (int i = nums.size() - 1; i >= 0; i--)~`, sol: c`#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums;
    int n;
    while (std::cin >> n && n != 0) {
        nums.push_back(n);
    }
    for (int i = (int)nums.size() - 1; i >= 0; i--) {
        std::cout << nums[i] << "\n";
    }
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`Which C function does ~a == b~ replace for two ~std::string~ values?`, [c`~strlen~`, c`~strcpy~`, c`~strcmp~`, c`~strcat~`], 2),
  P(c`
std::string s = "keyboard";
std::cout << s.substr(3) << s.length() << "\n";`, 'board8'),
  Q(c`~substr(2, 3)~ means…`, ['from index 2 up to index 3', 'start at index 2, take 3 characters', 'the 2nd and 3rd characters', 'skip 2, then skip 3'], 1),
  F('Turn text into a number and back.', c`
int n = std::[[stoi]]("41");
std::string t = std::[[to_string]](n + 1);`),
  P(c`
std::vector<int> v;
for (int i = 1; i <= 3; i++) {
    v.push_back(i * i);
}
std::cout << v[2] << " " << v.size() << "\n";`, '9 3'),
  Q(c`Who frees the memory of a ~std::vector~ declared inside a function?`, [c`You, with ~free(v)~`, c`You, with ~delete v~`, 'Nobody — it leaks', 'The vector itself, when it goes out of scope'], 3),
] });
