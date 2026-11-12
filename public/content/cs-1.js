/* ============ C# · "I already know C" path only: FROM C TO C# ============ */
topic({ id: 'start', track: 'c', title: 'From C to C#', icon: '👋', color: '#58cc02', blurb: 'Same braces, same semicolons — but no headers, no pointers and no garbage values.',
lessons: [
{ id: 'hello', title: 'Hello again, World', icon: '🚀', desc: 'printf retires. Everything moves inside a class.',
  v: [['0:06:30', '0:10:48', 'Output'], ['0:00:00', '0:06:30', 'Optional: installing Visual Studio on your own machine']],
  steps: [
  T('You already know most of this', c`C# borrowed its syntax from C: ~int~, ~if~, ~for~, ~while~, ~switch~, braces and semicolons all work the way you expect. This course skips those and teaches only what is **new or different**.

First difference: the shape of a program.`, c`
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`, c`There are no free-standing functions in C#. **Everything lives inside a class** — even ~Main~ (capital M). For now, read ~class Program { }~ as "the box my program goes in".`),
  T('What replaced what', c`~#include <stdio.h>~ → ~using System;~ There are no header files at all. ~using~ just lets you write ~Console~ instead of ~System.Console~.

~int main(void)~ → ~static void Main()~ No ~return 0;~ needed.

~printf("...\n")~ → ~Console.WriteLine("...")~ It adds the newline for you. ~Console.Write~ does not.

Functions are called **methods**, and by convention their names start with a capital letter.`),
  Q(c`Where can a method such as ~Main~ be written in C#?`, ['Anywhere in the file, like a C function', 'Only inside a class (or struct)', 'Only in a header file', c`Only after ~using System;~ on the same line`], 1),
  P(c`
Console.Write("A");
Console.Write("B");
Console.WriteLine("C");
Console.WriteLine("D");`, 'ABC\nD', c`~Write~ stays on the line; ~WriteLine~ ends it.`),
  T('It runs differently too', c`C compiles to machine code for one kind of processor. C# compiles to an intermediate code that the **.NET runtime** turns into machine code as the program runs. The runtime also checks every array index, every cast and every null — and cleans up memory for you.

The price is a little speed and no direct access to hardware. The reward: whole categories of C bugs (buffer overruns, use-after-free, wild pointers) cannot happen.`),
  F('Rebuild the C# Hello World.', c`
[[using]] System;

class Program {
    [[static]] void [[Main]]() {
        Console.[[WriteLine]]("Hello, World!");
    }
}`),
  X({ q: c`Make the program print these two lines, using ~Console.WriteLine~:

~No headers~
~No printf~

(C# runs on an online compiler, so each run takes a few seconds.)`, start: M(c`
        // your code goes here
`), tests: [{ out: 'No headers\nNo printf' }], hint: c`Two calls: ~Console.WriteLine("No headers");~ and ~Console.WriteLine("No printf");~`, sol: M(c`
        Console.WriteLine("No headers");
        Console.WriteLine("No printf");`) }),
] },

{ id: 'types', title: 'Types, var & $ strings', icon: '📦', desc: 'A real string, a real bool, and printing without format specifiers.',
  v: [['0:10:48', '0:19:32', 'Variables'], ['2:16:53', '2:20:18', 'String interpolation']],
  steps: [
  T('The types you know, plus two you wanted', c`~int~, ~double~, ~float~, ~char~ and ~long~ are all here. Two upgrades:`, c`
string name = "Ada";      // a real text type - no char arrays, no '\0'
bool alive = true;        // a real boolean - not an int in disguise

float speed = 2.5f;       // float literals need the f
char rank = 'S';          // a char is 16 bits (Unicode), not 8`, c`And one thing C let you do that C# forbids: an ~int~ is **not** a condition. ~if (lives)~ does not compile; write ~if (lives > 0)~. That also means the famous ~if (x = 5)~ typo is a compile error here.`),
  Q(c`~int lives = 3;~ Which line compiles in C#?`, [c`~if (lives) { }~`, c`~if (lives != 0) { }~`, c`~if (lives = 3) { }~`, c`~while (1) { }~`], 1, c`Conditions must be ~bool~. For an endless loop write ~while (true)~.`),
  T('No garbage values', c`In C, ~int x;~ holds whatever was in memory. In C#, the compiler **refuses to let you read** a local variable before you assign it:`, c`
int x;
Console.WriteLine(x);    // compile error: use of unassigned local variable`, c`An entire class of "works on my machine" bugs, gone at compile time.`),
  T('var and string interpolation', c`~var~ asks the compiler to work out the type from the value. The type is still fixed forever — ~var~ only saves typing.

And instead of ~printf~ format specifiers, put a ~$~ before a string and drop expressions straight into ~{ }~:`, c`
var lives = 3;            // int
var price = 4.5;          // double
var name = "Ada";         // string

Console.WriteLine($"{name} has {lives} lives and {price * 2} coins");
Console.WriteLine($"{price:F2}");     // 4.50  - like %.2f`, c`There is no ~%d~ / ~%s~ to mismatch: each value already knows its own type.`),
  P(c`
int a = 7, b = 2;
Console.WriteLine($"{a / b} {a % b} {a / 2.0}");
Console.WriteLine($"{a > b}");`, '3 1 3.5\nTrue', c`Integer division is unchanged from C. A ~bool~ prints as ~True~ or ~False~ — with a capital letter.`),
  F('Print the variables without printf.', c`
string item = "sword";
int cost = 40;
Console.WriteLine([[$]]"The [[{item}]] costs {cost}");`),
  X({ q: c`Translate this C line to C#, using string interpolation:

~printf("%d items cost %.2f\n", items, price);~

With the starter's variables it must print exactly ~3 items cost 4.50~`, start: M(c`
        int items = 3;
        double price = 4.5;
        // print with $"..."
`), tests: [{ out: '3 items cost 4.50' }], must: [[String.raw`\$"`, c`Use an interpolated string: ~$"..."~`]], hint: c`~{price:F2}~ formats with two decimal places.`, sol: M(c`
        int items = 3;
        double price = 4.5;
        Console.WriteLine($"{items} items cost {price:F2}");`) }),
] },

{ id: 'input', title: 'Input & conversions', icon: '⌨️', desc: 'scanf retires. Read a line, then convert it.',
  v: [['0:27:49', '0:31:24', 'User input'], ['0:20:35', '0:27:49', 'Type casting']],
  steps: [
  T('ReadLine gives you text', c`There is no ~scanf~. ~Console.ReadLine()~ returns the next line the user typed as a ~string~ — no buffer size to get wrong. You then convert it yourself:`, c`
string name = Console.ReadLine();

int age = int.Parse(Console.ReadLine());
double height = double.Parse(Console.ReadLine());`, c`~int.Parse~ replaces ~atoi~ — with one big difference: on bad input it does not quietly return 0, it throws an error that stops the program (unless you handle it; that is the Exceptions lesson).`),
  Q(c`The user types 5. What does this print?

~string a = Console.ReadLine();~
~Console.WriteLine(a + a);~`, ['10', '55', '5', 'A compile error'], 1, c`~a~ is a string, and ~+~ on strings joins them. Parse first to do arithmetic.`),
  T('Casts are stricter', c`C converts between numeric types silently, even when that loses data. C# only converts automatically when nothing can be lost. Otherwise you must cast, to show you mean it:`, c`
int whole = 7;
double d = whole;          // fine: int -> double loses nothing

double pi = 3.99;
// int n = pi;             compile error
int n = (int)pi;           // 3 - the cast truncates, same as C

string text = n.ToString();        // number -> string
int back = Convert.ToInt32("12");  // string -> int (like int.Parse)`, c`You cannot cast between a string and a number at all — ~(int)"12"~ is an error. Text needs ~Parse~, ~Convert~ or ~ToString~.`),
  P(c`
double d = 9.7;
int n = (int)d;
Console.WriteLine(n + 1);
Console.WriteLine("1" + n);`, '10\n19', c`The cast truncates 9.7 to 9. In the second line one side is a string, so ~+~ joins: "1" and "9".`),
  X({ q: c`Read a name, then an age (each on its own line). Print the name and the age the person will be **next year**.

Input:
~Ada~
~36~

Output: ~Ada will be 37~`, start: M(c`
        // read a string, then an int

`), tests: [{ in: 'Ada\n36\n', out: 'Ada will be 37' }], hint: c`~string name = Console.ReadLine();~ · ~int age = int.Parse(Console.ReadLine());~ · ~$"{name} will be {age + 1}"~`, sol: M(c`
        string name = Console.ReadLine();
        int age = int.Parse(Console.ReadLine());
        Console.WriteLine($"{name} will be {age + 1}");`) }),
  Q(c`Which line is a compile error in C#?`, [c`~double d = 5;~`, c`~int n = 2.5;~`, c`~int n = (int)2.5;~`, c`~long big = 5;~`], 1, c`Losing the ~.5~ needs an explicit cast.`),
] },

{ id: 'arrays', title: 'Arrays that know their size', icon: '🗃️', desc: 'Bounds-checked, with a Length — and a loop made for them.',
  v: [['1:46:53', '1:52:50', 'Arrays'], ['1:52:50', '1:54:42', 'Foreach loop']],
  steps: [
  T('The brackets moved', c`In C# the ~[]~ belongs to the **type**, not the name. And an array is an object that remembers how long it is:`, c`
int[] scores = { 90, 75, 88 };      // C: int scores[] = {...};
int[] empty = new int[5];           // five ints, all guaranteed 0

Console.WriteLine(scores.Length);   // 3 - no sizeof trick`, c`Pass an array to a method and it **still** knows its ~Length~. No more passing the size as a second parameter.`),
  T('Out of bounds is caught', c`This is the big one. In C, ~scores[10]~ reads whatever is in memory. In C#, every index is checked:`, c`
int[] scores = { 90, 75, 88 };
Console.WriteLine(scores[10]);
// stops with: System.IndexOutOfRangeException`, c`You get a clear error at the exact line, instead of corrupted data three functions later.`),
  Q(c`~int[] a = new int[3];~ What does ~a[3] = 1;~ do?`, ['Writes past the end, corrupting memory', 'Grows the array to 4 elements', c`Stops the program with an ~IndexOutOfRangeException~`, 'Nothing'], 2),
  T('foreach', c`How often have you written ~for (int i = 0; i < n; i++)~ just to visit every element? C# has a loop for exactly that:`, c`
foreach (int s in scores) {
    Console.WriteLine(s);
}`, c`Read it as "for each ~s~ **in** ~scores~". No index, no off-by-one. It works on every collection in the language.`),
  P(c`
int[] nums = { 4, 1, 3 };
int total = 0;
foreach (int n in nums) {
    total += n;
}
Console.WriteLine($"{total} {nums.Length}");`, '8 3'),
  X({ q: c`Use ~foreach~ to find the largest value in ~temps~ and print it.

Expected output: ~31~`, start: M(c`
        int[] temps = { 18, 25, 31, 22, 29 };
        int best = temps[0];
        // foreach over temps

        Console.WriteLine(best);`), tests: [{ out: '31' }], must: [[String.raw`\bforeach\b`, c`Use ~foreach (int t in temps)~.`]], hint: c`~foreach (int t in temps) { if (t > best) best = t; }~`, sol: M(c`
        int[] temps = { 18, 25, 31, 22, 29 };
        int best = temps[0];
        foreach (int t in temps) {
            if (t > best) best = t;
        }
        Console.WriteLine(best);`) }),
] },
],
quiz: [
  Q(c`What replaces ~#include <stdio.h>~ in a C# program?`, [c`~#include <System>~`, c`~using System;~`, c`~import System~`, 'Nothing is needed for Console'], 1),
  P(c`
int x = 5;
Console.Write($"x{x}");
Console.WriteLine(x + 1);`, 'x56'),
  Q(c`Which is true in C# but not in C?`, ['Arrays start at index 0', 'An int can be used directly as an if condition', 'Reading an unassigned local variable is a compile error', 'Statements end with a semicolon'], 2),
  F('Read a whole number.', c`
int n = int.[[Parse]](Console.[[ReadLine]]());`),
  Q(c`How do you get the number of elements in ~int[] a~ ?`, [c`~sizeof(a) / sizeof(a[0])~`, c`~a.Length~`, c`~a.size()~`, c`~len(a)~`], 1),
  P(c`
double d = 7.9;
Console.WriteLine((int)d * 2);`, '14', c`The cast binds tighter than ~*~: 7.9 becomes 7, then doubles.`),
] });

/* ============ C# TOPIC: STRINGS & COLLECTIONS ============ */
topic({ id: 'strings', title: 'Strings & Collections', icon: '🧵', color: '#1cb0f6', blurb: 'Text with batteries included, lists that grow and dictionaries that look things up.',
lessons: [
{ id: 'string', title: 'Strings', icon: '🧵', desc: 'Compare with ==, join with +, and a method for almost everything.',
  v: [['0:46:35', '0:53:26', 'String methods']],
  steps: [
  T('Text is a real type', c`A C# ~string~ manages its own memory and knows its own length. The operators do what you would hope:`, c`
string name = "Ada";
string greeting = "Hello, " + name;     // join with +

if (name == "Ada") {                    // == compares the TEXT
    Console.WriteLine(greeting);
}

Console.WriteLine(name.Length);         // 3
Console.WriteLine(name[0]);             // A`, c`If you know C: that is ~strcat~, ~strcmp~ and ~strlen~ replaced by ~+~, ~==~ and ~.Length~ — and there is no buffer to overflow.`),
  T('The toolkit', c`A string comes with dozens of methods. The ones you will use every day:`, c`
string s = "Hello World";

s.ToUpper()            // "HELLO WORLD"
s.ToLower()            // "hello world"
s.Contains("World")    // true
s.IndexOf("World")     // 6      (-1 if not found)
s.Substring(0, 5)      // "Hello"  (start, how many)
s.Substring(6)         // "World"  from index 6 to the end
s.Replace("l", "L")    // "HeLLo WorLd"
"  hi  ".Trim()        // "hi"`),
  P(c`
string s = "programming";
Console.WriteLine(s.Substring(3, 4));
Console.WriteLine(s.IndexOf("z"));`, 'gram\n-1', c`Start at index 3, take 4 characters. A failed search gives ~-1~.`),
  T('Strings never change', c`Strings in C# are **immutable**. No method ever modifies a string — each one returns a **new** string. Forgetting to use the result is the classic mistake:`, c`
string word = "shout";
word.ToUpper();               // result thrown away - word is still "shout"
word = word.ToUpper();        // now word is "SHOUT"

// word[0] = 'X';             compile error: cannot assign to a character`),
  Q(c`What does this print?

~string s = "abc";~
~s.Replace("a", "z");~
~Console.WriteLine(s);~`, [c`~zbc~`, c`~abc~`, c`~z~`, 'It does not compile'], 1, c`~Replace~ returned a new string, which nobody kept.`),
  T('Split and Join', c`Two methods that replace pages of C: ~Split~ cuts a string into an array, ~string.Join~ glues an array back together.`, c`
string line = "red,green,blue";
string[] parts = line.Split(',');       // { "red", "green", "blue" }

Console.WriteLine(parts.Length);                 // 3
Console.WriteLine(string.Join(" | ", parts));    // red | green | blue`),
  X({ q: c`Read an email address. Print the part **before** the ~@~ in capitals, then the part **after** it, on separate lines.

Input ~ada@example.com~ gives:

~ADA~
~example.com~`, start: M(c`
        string email = Console.ReadLine();
        // find the @, cut with Substring (or use Split)

`), tests: [{ in: 'ada@example.com\n', out: 'ADA\nexample.com' }], must: [['ToUpper', c`Use ~.ToUpper()~ for the capitals.`]], hint: c`~int at = email.IndexOf("@");~ then ~email.Substring(0, at).ToUpper()~ and ~email.Substring(at + 1)~`, sol: M(c`
        string email = Console.ReadLine();
        int at = email.IndexOf("@");
        Console.WriteLine(email.Substring(0, at).ToUpper());
        Console.WriteLine(email.Substring(at + 1));`) }),
] },

{ id: 'list', title: 'List<T>', icon: '📃', desc: 'The array that grows. You will use it far more than arrays.',
  v: [['3:23:22', '3:30:07', 'Lists']],
  steps: [
  T('A resizable array', c`An array's size is fixed when it is created. A ~List~ grows and shrinks as you go. It lives in ~System.Collections.Generic~.`, c`
using System.Collections.Generic;

List<int> scores = new List<int>();    // the element type goes in < >

scores.Add(90);
scores.Add(75);
scores.Add(88);

Console.WriteLine(scores.Count);       // 3   (Count, not Length!)
Console.WriteLine(scores[0]);          // 90`, c`If you know C: this is ~malloc~ + ~realloc~ + ~free~, written once by someone else and never leaking.`),
  Q(c`What does ~<int>~ mean in ~List<int>~ ?`, ['The list holds at most int-many items', 'Every element of this list is an int', 'The list is indexed by ints', 'It is a cast'], 1, c`~List<T>~ is a **generic** type: one design, any element type. ~List<string>~, ~List<double>~, ~List<Player>~...`),
  T('Everyday operations', c`You can fill a list as you create it, and it has methods for the things you would otherwise write loops for:`, c`
var names = new List<string> { "Linus", "Ada", "Grace" };

names.Remove("Linus");          // remove by value
names.Insert(0, "Bjarne");      // insert at an index
names.Contains("Ada");          // true
names.Sort();                   // alphabetical, in place

foreach (string n in names) {
    Console.WriteLine(n);
}`),
  P(c`
var v = new List<int> { 5, 2, 8 };
v.Add(1);
v.Sort();
v.RemoveAt(0);
Console.WriteLine($"{v[0]} {v.Count}");`, '2 3', c`Sorted: 1 2 5 8. ~RemoveAt(0)~ removes the 1, leaving 2 5 8.`),
  F('Add a value, then print how many there are.', c`
var prices = new List<double>();
prices.[[Add]](9.99);
Console.WriteLine(prices.[[Count]]);`),
  X({ q: c`Read whole numbers, one per line, until you read ~0~. Store them (not the 0) in a ~List<int>~, then print them in **reverse** order, one per line.

Input ~3~ ~8~ ~5~ ~0~ gives:

~5~
~8~
~3~`, start: M(c`
        var nums = new List<int>();
        // read until 0, Add each one

        // print from the last index down to 0

`, 'System.Collections.Generic'), tests: [{ in: '3\n8\n5\n0\n', out: '5\n8\n3' }], must: [[String.raw`\.Add\(`, c`Store the numbers with ~nums.Add(...)~.`]], hint: c`Loop: ~int n = int.Parse(Console.ReadLine()); if (n == 0) break; nums.Add(n);~ — then count down from ~nums.Count - 1~.`, sol: M(c`
        var nums = new List<int>();
        while (true) {
            int n = int.Parse(Console.ReadLine());
            if (n == 0) break;
            nums.Add(n);
        }
        for (int i = nums.Count - 1; i >= 0; i--) {
            Console.WriteLine(nums[i]);
        }`, 'System.Collections.Generic') }),
] },

{ id: 'dict', title: 'Dictionary', icon: '🗺️', desc: 'Look things up by name instead of by number.',
  steps: [
  T('Key → value', c`A list finds things by index. A ~Dictionary~ finds things by **key** — any type you like, most often a string.`, c`
var stock = new Dictionary<string, int>();   // key type, value type

stock["apple"] = 5;          // add
stock["pear"] = 2;
stock["apple"] += 1;         // update

Console.WriteLine(stock["apple"]);    // 6
Console.WriteLine(stock.Count);       // 2`, c`Building this in C means writing your own hash table. Here it is one line.`),
  T('Missing keys', c`Reading a key that is not there throws a ~KeyNotFoundException~. Ask first with ~ContainsKey~:`, c`
if (stock.ContainsKey("kiwi")) {
    Console.WriteLine(stock["kiwi"]);
} else {
    Console.WriteLine("no kiwi");
}`, c`Writing to a missing key is fine — ~stock["kiwi"] = 3;~ adds it.`),
  T('Looping over a dictionary', c`~foreach~ gives you each entry as a pair with a ~.Key~ and a ~.Value~:`, c`
foreach (var item in stock) {
    Console.WriteLine($"{item.Key}: {item.Value}");
}`, c`This is where ~var~ earns its keep — the full type is ~KeyValuePair<string, int>~.`),
  P(c`
var ages = new Dictionary<string, int>();
ages["Bo"] = 7;
ages["Cy"] = 9;
ages["Bo"] += 1;
Console.WriteLine($"{ages["Bo"]} {ages.Count} {ages.ContainsKey("Al")}");`, '8 2 False'),
  Q(c`~var d = new Dictionary<string, int>();~ What does ~Console.WriteLine(d["x"]);~ do?`, ['Prints 0', 'Prints an empty line', c`Throws a ~KeyNotFoundException~`, 'Adds "x" to the dictionary'], 2),
  X({ q: c`Read words, one per line, until the line ~end~. Then print how many times the word ~tea~ appeared, and how many **different** words there were.

Input ~tea~ ~milk~ ~tea~ ~end~ gives:

~2~
~2~`, start: M(c`
        var counts = new Dictionary<string, int>();
        // read words until "end", counting each one

        // print the count for "tea", then the number of different words

`, 'System.Collections.Generic'), tests: [{ in: 'tea\nmilk\ntea\nend\n', out: '2\n2' }], must: [['ContainsKey|TryGetValue', c`A new word is not in the dictionary yet — check with ~ContainsKey~ before adding to its count.`]], hint: c`~if (counts.ContainsKey(w)) counts[w]++; else counts[w] = 1;~`, sol: M(c`
        var counts = new Dictionary<string, int>();
        while (true) {
            string w = Console.ReadLine();
            if (w == "end") break;
            if (counts.ContainsKey(w)) counts[w]++;
            else counts[w] = 1;
        }
        Console.WriteLine(counts.ContainsKey("tea") ? counts["tea"] : 0);
        Console.WriteLine(counts.Count);`, 'System.Collections.Generic') }),
] },
],
quiz: [
  P(c`
string s = "Keyboard";
Console.WriteLine(s.Substring(3).ToUpper() + s.Length);`, 'BOARD8'),
  Q(c`~Substring(2, 3)~ means…`, ['from index 2 up to index 3', 'start at index 2, take 3 characters', 'the 2nd and 3rd characters', 'skip 2, then skip 3'], 1),
  Q(c`After ~string t = "hi"; t.ToUpper();~ what is ~t~ ?`, [c`~"HI"~`, c`~"hi"~ — strings are immutable and the result was not stored`, c`~"Hi"~`, 'An error'], 1),
  F('A list of names.', c`
var names = new [[List]]<string>();
names.[[Add]]("Ada");
Console.WriteLine(names.[[Count]]);`),
  P(c`
string[] parts = "a-b-c".Split('-');
Console.WriteLine(parts.Length + parts[2]);`, '3c'),
  Q(c`Which checks for a key without risking an exception?`, [c`~d["k"] != null~`, c`~d.ContainsKey("k")~`, c`~d.Has("k")~`, c`~d.Length > 0~`], 1),
] });
