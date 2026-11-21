/* ================= C, Part 2: Advanced (topics A1-A4) =================
   Topics marked advanced: true appear after the Final Boss, under a "Part 2" heading.
   Everything here gives the same output with gcc on Windows (MSYS2) and on the online compiler (Linux): no long
   (4 bytes on Windows, 8 on Linux), no file names or strerror text in checked output. */
G('bitwise operator', c`Works on the individual bits of a number: ~&~ AND, ~|~ OR, ~^~ XOR, ~\~~ NOT, ~<<~ shift left, ~>>~ shift right.`);
G('bit mask', c`A number with chosen bits set, used to pick out, set or clear those bits: ~flags & MASK~.`);
G('flag', c`One bit that means yes/no. Many flags fit in one integer: ~perms |= WRITE;~`);
G('hexadecimal', c`Base 16, written ~0x~: each hex digit is exactly 4 bits, so ~0xFF~ is 8 ones.`);
G('function pointer', c`A variable that holds the address of a function: ~int (*op)(int, int) = add;~ then ~op(2, 3)~.`);
G('callback', c`A function you pass to another function for it to call, like the compare function you give ~qsort~.`);
G('qsort', c`The standard library sort: ~qsort(array, count, sizeof array[0], compare)~.`);
G('dispatch table', c`An array of names and function pointers, used to look up which function to run instead of a long if/else chain.`);
G('macro', c`A ~#define~ with parameters that the preprocessor pastes in as text: ~#define SQUARE(x) ((x) * (x))~.`);
G('include guard', c`~#ifndef NAME_H / #define NAME_H / ... / #endif~ — stops a header being pasted in twice.`);
G('conditional compilation', c`~#if~, ~#ifdef~, ~#else~: parts of the file only compiled when a condition holds, e.g. debug logging.`);
G('static (local)', c`A local variable that keeps its value between calls: it lives for the whole program.`);
G('static (file)', c`A global variable or function only visible inside its own ~.c~ file.`);
G('extern', c`Declares a global variable that is defined in another ~.c~ file.`);
G('union', c`Like a struct, but all members share the **same** memory: only one is in use at a time.`);
G('tagged union', c`A struct holding an ~enum~ that says which member of a union is currently valid.`);
G('padding', c`Unused bytes the compiler adds inside a struct so each member sits at an address it can read quickly.`);
G('alignment', c`The address boundary a type must start on (often its own size): an ~int~ on a multiple of 4, a ~double~ on 8.`);
G('variadic function', c`A function that takes a variable number of arguments, like ~printf~: ~int sum(int count, ...)~ with ~<stdarg.h>~.`);

/* ============ ADVANCED 1: BITS & BYTES ============ */
topic({ id: 'adv-bits', advanced: true, title: 'Bits & Bytes', icon: '🔢', color: '#ff4b4b', blurb: 'Bitwise operators, flags and masks, and the tricks that embedded code lives on.',
lessons: [
{ id: 'bitwise', title: 'Bitwise operators', icon: '0️⃣', desc: 'AND, OR, XOR, NOT and shifts — maths on single bits.',
  steps: [
  T('Down to the bits', c`Every integer is a row of bits. **Bitwise** operators work on those bits one position at a time. Embedded systems, graphics, networking, compression and games all depend on them.`, c`
12      = 1100
10      = 1010

12 & 10 = 1000  =  8     AND: 1 only where BOTH are 1
12 | 10 = 1110  = 14     OR:  1 where EITHER is 1
12 ^ 10 = 0110  =  6     XOR: 1 where they DIFFER
~12             (flips every bit)

1 << 4  = 10000 = 16     shift left: x << n multiplies by 2^n
200 >> 3        = 25     shift right: divides by 2^n (rounding down)`, c`Use **unsigned** types for bit work: shifting and flipping signed numbers can hit undefined or implementation-defined behaviour.`),
  P(c`printf("%d %d %d", 12 & 10, 12 | 10, 12 ^ 10);`, '8 14 6'),
  P(c`printf("%d %d", 1 << 4, 200 >> 3);`, '16 25'),
  P(c`
unsigned char x = 5;
x = ~x;
printf("%d", x);`, '250', c`5 is ~00000101~ in 8 bits. Flipping every bit gives ~11111010~ = 250.`),
  Q(c`What does ~x << 1~ do to a (small, unsigned) number?`, ['Adds 1', 'Doubles it', 'Halves it', 'Flips its last bit'], 1),
  X({ q: c`Read a number from 0 to 255 and print it as **8 binary digits**:

~5~ → ~00000101~ · ~200~ → ~11001000~`, start: M(c`
    unsigned int n;
    scanf("%u", &n);
    printf("%u\n", n);`), tests: [{ in: '5', out: '00000101' }, { in: '200', out: '11001000' }, { in: '255', out: '11111111' }], must: [[c`>>|<<`, c`Use a shift (~>>~ or ~<<~).`], [c`&`, c`Pick out each bit with ~&~.`]], hint: c`Loop ~i~ from 7 down to 0 and print ~(n >> i) & 1~.`, sol: M(c`
    unsigned int n;
    scanf("%u", &n);
    for (int i = 7; i >= 0; i--) {
        printf("%u", (n >> i) & 1);
    }
    printf("\n");`) }),
  X({ q: c`Count how many bits are ~1~ in an unsigned number (the "population count"):

~255~ → ~8~ · ~1024~ → ~1~ · ~4294967295~ → ~32~`, start: M(c`
    unsigned int n;
    scanf("%u", &n);
    int count = 0;
    printf("%d\n", count);`), tests: [{ in: '255', out: '8' }, { in: '1024', out: '1' }, { in: '0', out: '0' }, { in: '4294967295', out: '32' }], must: [[c`&`, c`Test bits with ~&~.`]], not: [[c`__builtin`, c`Do it yourself rather than with a compiler built-in.`]], hint: c`~while (n) { count += n & 1; n >>= 1; }~`, sol: M(c`
    unsigned int n;
    scanf("%u", &n);
    int count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    printf("%d\n", count);`) }),
] },

{ id: 'flags', title: 'Flags & masks', icon: '🚩', desc: 'Pack many yes/no settings into one integer.',
  steps: [
  T('One bit per setting', c`Instead of eight ~bool~ variables, store eight **flags** in one byte. File permissions, keyboard modifiers, game states and hardware registers all work this way.`, c`
#define READ  (1u << 0)     // 001
#define WRITE (1u << 1)     // 010
#define EXEC  (1u << 2)     // 100

unsigned perms = 0;
perms |= READ | WRITE;      // set bits     -> 011
perms &= ~WRITE;            // clear a bit  -> 001
perms ^= EXEC;              // toggle a bit -> 101
if (perms & READ) { }       // test a bit`, c`The pattern to remember: **set** with ~|=~, **clear** with ~&= \~~, **toggle** with ~^=~, **test** with ~&~.`),
  P(c`
unsigned perms = 0;
perms |= 1 | 4;
perms &= ~1u;
printf("%u %d", perms, (perms & 4) != 0);`, '4 1'),
  Q(c`Which line turns **off** the WRITE flag and leaves the others alone?`, [c`~perms = WRITE;~`, c`~perms |= WRITE;~`, c`~perms &= \~WRITE;~`, c`~perms ^= perms;~`], 2),
  X({ q: c`**File permissions.** Start with no permissions. Read commands until the input ends: ~+r~ ~+w~ ~+x~ set a flag, ~-r~ ~-w~ ~-x~ clear it, and ~?~ prints them as ~rwx~ with ~-~ for each one that is off.

~+r +w ? -r +x ?~ → ~rw-~ then ~-wx~`, start: c`#include <stdio.h>

#define READ  (1u << 0)
#define WRITE (1u << 1)
#define EXEC  (1u << 2)

int main() {
    unsigned perms = 0;
    char cmd[4];
    while (scanf("%3s", cmd) == 1) {
        printf("%s\n", cmd);
    }
    return 0;
}
`, tests: [{ in: '+r +w ? -r +x ?', out: 'rw-\n-wx' }, { in: '? +x +x ? -x ?', out: '---\n--x\n---' }], must: [[c`\|=`, c`Set flags with ~|=~.`], [c`&=\s*~`, c`Clear flags with ~&= \~~.`]], hint: c`Turn the letter into its flag first: ~unsigned f = cmd[1] == 'r' ? READ : cmd[1] == 'w' ? WRITE : EXEC;~`, sol: c`#include <stdio.h>

#define READ  (1u << 0)
#define WRITE (1u << 1)
#define EXEC  (1u << 2)

int main() {
    unsigned perms = 0;
    char cmd[4];
    while (scanf("%3s", cmd) == 1) {
        if (cmd[0] == '?') {
            printf("%c%c%c\n", perms & READ ? 'r' : '-', perms & WRITE ? 'w' : '-', perms & EXEC ? 'x' : '-');
            continue;
        }
        unsigned f = cmd[1] == 'r' ? READ : cmd[1] == 'w' ? WRITE : EXEC;
        if (cmd[0] == '+') perms |= f;
        else perms &= ~f;
    }
    return 0;
}
` }),
] },

{ id: 'tricks', title: 'Bit tricks', icon: '🎩', desc: 'Packing colours, testing powers of two, and other classics.',
  steps: [
  T('Packing several values into one', c`A colour is three 8-bit numbers. Shift each into its own byte of one ~unsigned~, and pull them back out with a shift and a mask. Network packets, file formats and graphics do this constantly.`, c`
unsigned rgb = (r << 16) | (g << 8) | b;     // pack:  0xRRGGBB

unsigned red   = (rgb >> 16) & 0xFF;         // unpack: shift down, keep 8 bits
unsigned green = (rgb >> 8)  & 0xFF;
unsigned blue  =  rgb        & 0xFF;`, c`~0xFF~ is eight 1-bits: ~& 0xFF~ keeps the lowest byte and throws the rest away.`),
  T('Classic one-liners', c`Interviewers and low-level code love these:`, c`
x & 1                   // 1 if x is odd
x & (x - 1)             // x with its lowest 1-bit cleared
x && !(x & (x - 1))     // true if x is a power of two (exactly one bit set)
a ^= b; b ^= a; a ^= b; // swap without a temporary (cute, but just use a temp)`),
  P(c`printf("%d %d %d", 12 & (12 - 1), (16 & 15) == 0, 7 & 1);`, '8 1 1', c`12 is ~1100~; clearing the lowest 1-bit leaves ~1000~ = 8. 16 is a power of two, so ~16 & 15~ is 0.`),
  P(c`
unsigned rgb = (255u << 16) | (128u << 8) | 64u;
printf("%u %u %u", (rgb >> 16) & 0xFF, (rgb >> 8) & 0xFF, rgb & 0xFF);`, '255 128 64'),
  X({ q: c`Read a web colour as six hex digits (~scanf("%x", ...)~ reads hex) and print its red, green and blue parts:

~FF8040~ → ~R=255 G=128 B=64~`, start: M(c`
    unsigned colour;
    scanf("%x", &colour);
    printf("%u\n", colour);`), tests: [{ in: 'FF8040', out: 'R=255 G=128 B=64' }, { in: '00FF00', out: 'R=0 G=255 B=0' }, { in: '123456', out: 'R=18 G=52 B=86' }], must: [[c`>>`, c`Shift each part down with ~>>~.`], [c`&\s*0x[fF][fF]|&\s*255`, c`Keep 8 bits with ~& 0xFF~.`]], sol: M(c`
    unsigned colour;
    scanf("%x", &colour);
    printf("R=%u G=%u B=%u\n", (colour >> 16) & 0xFF, (colour >> 8) & 0xFF, colour & 0xFF);`) }),
  X({ q: c`Read whole numbers until the input ends and print ~yes~ for each power of two, otherwise ~no~. Use the ~x & (x - 1)~ trick — no loops over the bits.`, start: M(c`
    unsigned n;
    while (scanf("%u", &n) == 1) {
        printf("%u\n", n);
    }`), tests: [{ in: '1 6 64 0 1000 1024', out: 'yes\nno\nyes\nno\nno\nyes' }], must: [[c`&\s*\(\s*n\s*-\s*1\s*\)`, c`Use ~n & (n - 1)~.`]], sol: M(c`
    unsigned n;
    while (scanf("%u", &n) == 1) {
        printf("%s\n", n && !(n & (n - 1)) ? "yes" : "no");
    }`) }),
] },
],
quiz: [
  P(c`printf("%d", 5 ^ 5);`, '0', c`Anything XOR itself is 0.`),
  P(c`printf("%d", (6 >> 1) | 8);`, '11'),
  Q(c`Which test is true exactly when bit 3 of ~flags~ is set?`, [c`~flags == 3~`, c`~flags & (1u << 3)~`, c`~flags | 8~`, c`~flags >> 3 == 0~`], 1),
  F('Clear the WRITE flag.', c`
unsigned perms = 7, WRITE = 2;
perms [[&=]] ~WRITE;
printf("%u", perms);`),
] });

/* ============ ADVANCED 2: FUNCTION POINTERS ============ */
topic({ id: 'adv-funcptr', advanced: true, title: 'Function Pointers', icon: '🎯', color: '#1cb0f6', blurb: 'Functions as values: callbacks, qsort and dispatch tables.',
lessons: [
{ id: 'fnptr', title: 'Pointers to functions', icon: '👉', desc: 'Store a function in a variable and call it later.',
  steps: [
  T('Functions have addresses too', c`A function lives in memory, so you can point at it. The syntax looks odd at first: the brackets around ~*op~ matter.`, c`
int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int (*op)(int, int) = add;   // op points to a function taking (int, int), returning int
op(2, 3);                    // 5
op = mul;
op(2, 3);                    // 6

typedef int (*BinOp)(int, int);          // a typedef makes it readable
BinOp table[] = { add, mul };`, c`Without the brackets, ~int *op(int, int);~ declares a **function** that returns an ~int *~ — a completely different thing.`),
  P(c`
#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main() {
    int (*op)(int, int) = add;
    printf("%d ", op(2, 3));
    op = mul;
    printf("%d", op(2, 3));
    return 0;
}`, '5 6'),
  P(c`
#include <stdio.h>

typedef int (*BinOp)(int, int);
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

int main() {
    BinOp ops[] = { add, sub, mul };
    for (int i = 0; i < 3; i++) {
        printf("%d ", ops[i](5, 2));
    }
    return 0;
}`, '7 3 10'),
  Q(c`What does ~int (*f)(double);~ declare?`, ['A function returning a pointer to int', 'A pointer to a function that takes a double and returns an int', 'An array of ints', 'A pointer to a double'], 1),
  X({ q: c`Write ~int apply(int (*f)(int), int x)~, which calls ~f~ on ~x~, and the three functions ~twice~, ~square~ and ~negate~. ~main~ is written.

Expected: ~10 25 -5 20~`, start: c`#include <stdio.h>

// write twice, square, negate and apply here

int main() {
    printf("%d %d %d %d\n", apply(twice, 5), apply(square, 5), apply(negate, 5), apply(twice, apply(twice, 5)));
    return 0;
}
`, tests: [{ out: '10 25 -5 20' }], must: [[c`int\s+apply\s*\(\s*int\s*\(\s*\*\s*\w+\s*\)\s*\(\s*int\s*\)`, c`~int apply(int (*f)(int), int x)~`]], sol: c`#include <stdio.h>

int twice(int x) { return 2 * x; }
int square(int x) { return x * x; }
int negate(int x) { return -x; }

int apply(int (*f)(int), int x) {
    return f(x);
}

int main() {
    printf("%d %d %d %d\n", apply(twice, 5), apply(square, 5), apply(negate, 5), apply(twice, apply(twice, 5)));
    return 0;
}
` }),
  X({ q: c`Write ~void map(int *arr, int n, int (*f)(int))~, which replaces every element with ~f(element)~. ~main~ squares the array, then adds one to each, printing it each time.

~1 4 9 16~
~2 5 10 17~`, start: c`#include <stdio.h>

int square(int x) { return x * x; }
int inc(int x) { return x + 1; }

// write map here

void print(int *arr, int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
}

int main() {
    int nums[] = {1, 2, 3, 4};
    map(nums, 4, square);
    print(nums, 4);
    map(nums, 4, inc);
    print(nums, 4);
    return 0;
}
`, tests: [{ out: '1 4 9 16\n2 5 10 17' }], must: [[c`void\s+map\s*\(`, c`Write ~void map(int *arr, int n, int (*f)(int))~.`]], sol: c`#include <stdio.h>

int square(int x) { return x * x; }
int inc(int x) { return x + 1; }

void map(int *arr, int n, int (*f)(int)) {
    for (int i = 0; i < n; i++) {
        arr[i] = f(arr[i]);
    }
}

void print(int *arr, int n) {
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
}

int main() {
    int nums[] = {1, 2, 3, 4};
    map(nums, 4, square);
    print(nums, 4);
    map(nums, 4, inc);
    print(nums, 4);
    return 0;
}
` }),
] },

{ id: 'qsort', title: 'qsort & bsearch', icon: '🔃', desc: 'The library sort, driven by your compare function.',
  steps: [
  T('qsort', c`~qsort~ (in ~<stdlib.h>~) sorts **any** array. It does not know your types, so you hand it a **callback**: a compare function that receives two ~const void *~ pointers and returns negative, zero or positive.`, c`
int by_value(const void *a, const void *b) {
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);          // -1, 0 or 1
}

int nums[] = {5, 2, 9};
qsort(nums, 3, sizeof nums[0], by_value);`, c`The tempting ~return x - y;~ can **overflow** for big values and give the wrong sign. ~(x > y) - (x < y)~ is always safe.`),
  T('Sorting structs, and bsearch', c`For structs, cast to your struct type and compare the field you care about. ~bsearch~ finds a key in a **sorted** array with the same kind of compare function, in ~O(log n)~.`, c`
int by_score_desc(const void *a, const void *b) {
    const Student *s = a, *t = b;
    if (s->score != t->score) return t->score - s->score;   // high first (scores are small)
    return strcmp(s->name, t->name);                       // then A-Z
}

int *hit = bsearch(&key, sorted, n, sizeof sorted[0], by_value);
if (hit) printf("found at %d", (int)(hit - sorted));`),
  P(c`
#include <stdio.h>
#include <stdlib.h>

int desc(const void *a, const void *b) {
    int x = *(const int *)a, y = *(const int *)b;
    return (x < y) - (x > y);
}

int main() {
    int nums[] = {4, 9, 1, 7};
    qsort(nums, 4, sizeof nums[0], desc);
    for (int i = 0; i < 4; i++) printf("%d ", nums[i]);
    return 0;
}`, '9 7 4 1'),
  Q(c`Why can ~return *(int*)a - *(int*)b;~ give wrong answers?`, ['Subtraction is slow', 'For very large or very negative values the subtraction overflows and the sign flips', 'qsort needs exactly -1, 0 or 1', 'It cannot be wrong'], 1),
  X({ q: c`Read ~n~, then ~n~ students (one-word name and score). Sort them with ~qsort~: highest score first, and on a tie alphabetical by name. Print each as ~name score~.`, start: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[20];
    int score;
} Student;

int main() {
    int n;
    scanf("%d", &n);
    Student s[50];
    for (int i = 0; i < n; i++) scanf("%19s %d", s[i].name, &s[i].score);

    for (int i = 0; i < n; i++) printf("%s %d\n", s[i].name, s[i].score);
    return 0;
}
`, tests: [{ in: '4\nCy 70\nAda 90\nBo 70\nDi 85', out: 'Ada 90\nDi 85\nBo 70\nCy 70' }], must: [[c`qsort\s*\(`, c`Sort with ~qsort~.`], [c`strcmp`, c`Break ties with ~strcmp~.`]], sol: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[20];
    int score;
} Student;

int compare(const void *a, const void *b) {
    const Student *s = a, *t = b;
    if (s->score != t->score) return (s->score < t->score) - (s->score > t->score);
    return strcmp(s->name, t->name);
}

int main() {
    int n;
    scanf("%d", &n);
    Student s[50];
    for (int i = 0; i < n; i++) scanf("%19s %d", s[i].name, &s[i].score);

    qsort(s, n, sizeof s[0], compare);
    for (int i = 0; i < n; i++) printf("%s %d\n", s[i].name, s[i].score);
    return 0;
}
` }),
  X({ q: c`The array is already sorted. Read numbers until the input ends and, for each, print its position using ~bsearch~, or ~not found~.`, start: c`#include <stdio.h>
#include <stdlib.h>

int main() {
    int sorted[] = {3, 8, 15, 21, 34, 55, 89};
    int key;
    while (scanf("%d", &key) == 1) {
        printf("%d\n", key);
    }
    return 0;
}
`, tests: [{ in: '21 3 4 89', out: '3\n0\nnot found\n6' }], must: [[c`bsearch\s*\(`, c`Use ~bsearch~.`]], hint: c`~bsearch~ returns a pointer to the match (or ~NULL~). Its position is ~hit - sorted~.`, sol: c`#include <stdio.h>
#include <stdlib.h>

int compare(const void *a, const void *b) {
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);
}

int main() {
    int sorted[] = {3, 8, 15, 21, 34, 55, 89};
    int n = sizeof sorted / sizeof sorted[0];
    int key;
    while (scanf("%d", &key) == 1) {
        int *hit = bsearch(&key, sorted, n, sizeof sorted[0], compare);
        if (hit) printf("%d\n", (int)(hit - sorted));
        else printf("not found\n");
    }
    return 0;
}
` }),
] },

{ id: 'dispatch', title: 'Dispatch tables', icon: '🗂️', desc: 'Replace long if/else chains with a table of functions.',
  steps: [
  T('A table instead of a chain', c`A program that handles many commands often grows a huge ~if (strcmp(cmd, "add") == 0) ... else if ...~ chain. A **dispatch table** pairs each name with a function pointer, so adding a command is one line. Shells, interpreters, network servers and emulators all use this.`, c`
typedef struct {
    const char *name;
    double (*fn)(double, double);
} Command;

Command commands[] = {
    { "add", add },
    { "mul", mul },
};

for (int i = 0; i < count; i++)
    if (strcmp(cmd, commands[i].name) == 0)
        return commands[i].fn(a, b);`),
  P(c`
#include <stdio.h>
#include <string.h>

void hello(void) { printf("hi"); }
void bye(void) { printf("bye"); }

typedef struct { const char *name; void (*run)(void); } Cmd;

int main() {
    Cmd cmds[] = { {"hello", hello}, {"bye", bye} };
    const char *want = "bye";
    for (int i = 0; i < 2; i++) {
        if (strcmp(cmds[i].name, want) == 0) cmds[i].run();
    }
    return 0;
}`, 'bye'),
  Q(c`Your calculator gains a new operation. With a dispatch table, what changes?`, ['The whole main loop', 'You write the function and add one line to the table', 'Every if/else branch', 'Nothing can be added'], 1),
  X({ q: c`**Command calculator.** Read lines ~name a b~ until the input ends and run the matching command from a **dispatch table** (~add~, ~sub~, ~mul~, ~pow~ — ~pow~ comes from ~<math.h>~). Print the result with ~%g~, or ~unknown command: NAME~.`, start: c`#include <stdio.h>
#include <string.h>
#include <math.h>

int main() {
    char name[16];
    double a, b;
    while (scanf("%15s %lf %lf", name, &a, &b) == 3) {
        printf("%s %g %g\n", name, a, b);
    }
    return 0;
}
`, tests: [{ in: 'add 2 3\nmul 4 5\npow 2 10\nfoo 1 2\nsub 1 0.5', out: '5\n20\n1024\nunknown command: foo\n0.5' }], must: [[c`\(\s*\*\s*\w+\s*\)\s*\(\s*double`, c`Store the functions in a table: a struct with ~double (*fn)(double, double)~.`]], not: [[c`strcmp\s*\(\s*name\s*,\s*"add"`, c`Look the name up in the table rather than comparing with each name by hand.`]], sol: c`#include <stdio.h>
#include <string.h>
#include <math.h>

double add(double a, double b) { return a + b; }
double sub(double a, double b) { return a - b; }
double mul(double a, double b) { return a * b; }

typedef struct {
    const char *name;
    double (*fn)(double, double);
} Command;

Command commands[] = {
    { "add", add },
    { "sub", sub },
    { "mul", mul },
    { "pow", pow },
};

int main() {
    int count = sizeof commands / sizeof commands[0];
    char name[16];
    double a, b;
    while (scanf("%15s %lf %lf", name, &a, &b) == 3) {
        int done = 0;
        for (int i = 0; i < count; i++) {
            if (strcmp(name, commands[i].name) == 0) {
                printf("%g\n", commands[i].fn(a, b));
                done = 1;
                break;
            }
        }
        if (!done) printf("unknown command: %s\n", name);
    }
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`What must a compare function for ~qsort~ return when the first item should come **first**?`, ['0', 'A negative number', 'A positive number', 'The first item'], 1),
  P(c`
#include <stdio.h>

int neg(int x) { return -x; }

int main() {
    int (*f)(int) = neg;
    printf("%d", f(f(7)));
    return 0;
}`, '7'),
  Q('Which is a good use of a function pointer?', ['Storing a number', 'Telling a sort routine how to compare items', 'Making a loop faster', 'Declaring a string'], 1),
  F('Declare p as a pointer to a function that takes an int and returns an int.', c`
int dbl(int x) { return 2 * x; }

int main(void) {
    int [[(*p)]](int) = dbl;
    return p(1);
}`),
] });

/* ============ ADVANCED 3: PREPROCESSOR & STORAGE ============ */
topic({ id: 'adv-preproc', advanced: true, title: 'Preprocessor & Storage', icon: '🧰', color: '#ce82ff', blurb: 'Safe macros, conditional compilation, headers, static and const.',
lessons: [
{ id: 'macros', title: 'Macros done right', icon: '🪄', desc: 'Brackets everywhere, do-while(0), # and ##.',
  steps: [
  T('Rules for safe macros', c`You met ~#define~ in Pro habits. Macros are text substitution, so they bite. Real codebases follow three rules:

**1.** Bracket every parameter **and** the whole body: ~#define SQUARE(x) ((x) * (x))~.
**2.** Wrap multi-statement macros in ~do { ... } while (0)~ so they behave like one statement after an ~if~.
**3.** Never pass something with a side effect (~i++~): the macro may evaluate it twice.`, c`
#define MAX(a, b)       ((a) > (b) ? (a) : (b))
#define ARRAY_LEN(arr)  (sizeof(arr) / sizeof((arr)[0]))
#define SWAP(T, a, b)   do { T tmp_ = (a); (a) = (b); (b) = tmp_; } while (0)

#define STR(x)   #x          // # turns the argument into a string literal
#define CAT(a,b) a##b        // ## glues two tokens together`),
  P(c`
#include <stdio.h>
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main() {
    int i = 5;
    int m = MAX(i++, 3);
    printf("%d %d", m, i);
    return 0;
}`, '6 7', c`The macro becomes ~((i++) > (3) ? (i++) : (3))~: ~i++~ runs **twice**. A real function would not do that.`),
  P(c`
#include <stdio.h>
#define STR(x) #x
#define VAR(n) var##n

int main() {
    int VAR(1) = 10;
    printf("%s %d", STR(hello world), var1);
    return 0;
}`, 'hello world 10'),
  Q(c`Why are multi-statement macros wrapped in ~do { ... } while (0)~?`, ['It makes them faster', 'So the macro acts like one statement, e.g. safely after an if with no braces', 'It loops forever', 'It is required by the compiler'], 1),
  X({ q: c`Write four safe macros: ~SQUARE(x)~, ~MIN(a, b)~, ~ARRAY_LEN(arr)~ (the number of elements) and ~SWAP(T, a, b)~ (swaps two variables of type T, wrapped in ~do/while(0)~). ~main~ is written.

Expected: ~25 3 5~ then ~9 2~`, start: c`#include <stdio.h>

// write SQUARE, MIN, ARRAY_LEN and SWAP here

int main() {
    int nums[] = {4, 8, 15, 16, 23};
    int a = 2, b = 9;
    printf("%d %d %d\n", SQUARE(2 + 3), MIN(7, 3), (int)ARRAY_LEN(nums));
    if (a < b)
        SWAP(int, a, b);
    else
        printf("never\n");
    printf("%d %d\n", a, b);
    return 0;
}
`, tests: [{ out: '25 3 5\n9 2' }], must: [[c`#define\s+ARRAY_LEN\s*\(\s*\w+\s*\)[^\n]*sizeof`, c`~ARRAY_LEN~ divides two ~sizeof~s.`], [c`do\s*\{`, c`Wrap ~SWAP~ in ~do { ... } while (0)~.`]], sol: c`#include <stdio.h>

#define SQUARE(x)       ((x) * (x))
#define MIN(a, b)       ((a) < (b) ? (a) : (b))
#define ARRAY_LEN(arr)  (sizeof(arr) / sizeof((arr)[0]))
#define SWAP(T, a, b)   do { T tmp_ = (a); (a) = (b); (b) = tmp_; } while (0)

int main() {
    int nums[] = {4, 8, 15, 16, 23};
    int a = 2, b = 9;
    printf("%d %d %d\n", SQUARE(2 + 3), MIN(7, 3), (int)ARRAY_LEN(nums));
    if (a < b)
        SWAP(int, a, b);
    else
        printf("never\n");
    printf("%d %d\n", a, b);
    return 0;
}
` }),
] },

{ id: 'conditional', title: 'Conditional compilation & headers', icon: '🧩', desc: '#if, debug builds, header files and include guards.',
  steps: [
  T('#if and #ifdef', c`The preprocessor can leave code out **before** compiling. Projects use it for debug-only logging, platform differences (Windows vs Linux) and optional features.`, c`
#define DEBUG 1

#if DEBUG
    #define LOG(msg) printf("[debug] %s\n", msg)
#else
    #define LOG(msg) ((void)0)        // compiles to nothing
#endif

#ifdef _WIN32
    // Windows-only code
#endif`, c`You can set these from the command line instead of the file: ~gcc -DDEBUG=0 main.c~.`),
  T('Splitting a program into files', c`Real programs are split into ~.c~ files compiled separately, with **header** files (~.h~) holding the declarations they share. Every header gets an **include guard**, so pasting it in twice does no harm.`, c`
/* stack.h */
#ifndef STACK_H
#define STACK_H

void push(int value);       // declarations only
int pop(void);
extern int stack_size;      // defined in stack.c

#endif

/* stack.c  — the definitions */        /* main.c */
#include "stack.h"                        #include "stack.h"
int stack_size = 0;                       int main(void) { push(1); ... }
void push(int value) { ... }

gcc main.c stack.c -o app                 // compile both, link them together`, c`This site runs one file at a time, so the exercises stay in a single file — but every C project you open will be laid out like this.`),
  P(c`
#include <stdio.h>
#define LEVEL 2

int main() {
#if LEVEL > 1
    printf("verbose");
#else
    printf("quiet");
#endif
    return 0;
}`, 'verbose'),
  P(c`
#include <stdio.h>

int main() {
#ifdef FAST_MODE
    printf("fast");
#else
    printf("safe");
#endif
    return 0;
}`, 'safe', c`~FAST_MODE~ was never defined, so only the ~#else~ part is compiled.`),
  Q('What does an include guard prevent?', ['Viruses', 'The same header being pasted in twice and causing duplicate definitions', 'Warnings', 'Linking'], 1),
  X({ q: c`Add a ~DEBUG~ setting (~#define DEBUG 1~) and a ~LOG(msg)~ macro that prints ~[debug] msg~ only when ~DEBUG~ is 1, using ~#if~. When DEBUG is 0, LOG must compile to nothing.

Expected:
~[debug] starting~
~[debug] adding~
~Total: 60~`, start: c`#include <stdio.h>

// add DEBUG and LOG here

int main() {
    LOG("starting");
    int total = 0;
    int nums[] = {10, 20, 30};
    LOG("adding");
    for (int i = 0; i < 3; i++) total += nums[i];
    printf("Total: %d\n", total);
    return 0;
}
`, tests: [{ out: '[debug] starting\n[debug] adding\nTotal: 60' }], must: [[c`#if\s+DEBUG`, c`Use ~#if DEBUG~.`], [c`#else`, c`Give ~LOG~ an ~#else~ version that does nothing.`]], sol: c`#include <stdio.h>

#define DEBUG 1

#if DEBUG
#define LOG(msg) printf("[debug] %s\n", msg)
#else
#define LOG(msg) ((void)0)
#endif

int main() {
    LOG("starting");
    int total = 0;
    int nums[] = {10, 20, 30};
    LOG("adding");
    for (int i = 0; i < 3; i++) total += nums[i];
    printf("Total: %d\n", total);
    return 0;
}
` }),
] },

{ id: 'storage', title: 'static, extern & const', icon: '🗄️', desc: 'How long a variable lives, who can see it, and who may change it.',
  steps: [
  T('Lifetime and visibility', c`~static~ means two different things depending on where you write it:

**Inside a function**: the variable lives for the **whole program** and keeps its value between calls (it starts at 0, or your initial value, once).
**Outside any function**: the variable or function is **private to this file**. Other ~.c~ files cannot see it — C's version of "private".

~extern~ says "this global is defined in another file".`, c`
int next_ticket(void) {
    static int n = 0;       // initialised once, remembered between calls
    return ++n;
}

static int cache_hits;      // only this .c file can use it
static void helper(void);   // likewise for functions`),
  T('const and pointers', c`Read pointer declarations **right to left**:`, c`
const char *p;        // p points to const char: you cannot change the chars through p
char *const p;        // p is a const pointer: it cannot point anywhere else
const char *const p;  // neither

size_t strlen(const char *s);   // const promises the function will not modify your string`, c`~volatile~ tells the compiler a value may change behind its back (hardware registers, signal handlers), so it must re-read it every time.`),
  P(c`
#include <stdio.h>

int counter(void) {
    static int calls = 0;
    calls++;
    return calls;
}

int main() {
    counter();
    counter();
    printf("%d", counter());
    return 0;
}`, '3'),
  Q(c`With ~const char *p = name;~, which of these is NOT allowed?`, [c`~p = other;~`, c`~p[0] = 'X';~`, c`~printf("%s", p);~`, c`~p++;~`], 1, c`The **characters** are const; the pointer itself can move.`),
  X({ q: c`Write an ID generator: ~int next_id(void)~ returns 1001, 1002, 1003… and ~void reset_ids(void)~ starts again from 1001. Both share **one** counter that the rest of the program cannot touch: a file-level ~static~ variable.

Expected: ~1001 1002 1003~ then ~1001 1002~`, start: c`#include <stdio.h>

// write the counter, next_id and reset_ids here

int main() {
    int a = next_id(), b = next_id(), c = next_id();
    printf("%d %d %d\n", a, b, c);
    reset_ids();
    int d = next_id(), e = next_id();
    printf("%d %d\n", d, e);
    return 0;
}
`, tests: [{ out: '1001 1002 1003\n1001 1002' }], must: [[c`static\s+int`, c`Keep the counter in a ~static int~ at file level.`]], sol: c`#include <stdio.h>

static int last_id = 1000;

int next_id(void) {
    return ++last_id;
}

void reset_ids(void) {
    last_id = 1000;
}

int main() {
    int a = next_id(), b = next_id(), c = next_id();
    printf("%d %d %d\n", a, b, c);
    reset_ids();
    int d = next_id(), e = next_id();
    printf("%d %d\n", d, e);
    return 0;
}
` }),
] },
],
quiz: [
  P(c`
#include <stdio.h>
#define DOUBLE(x) x + x

int main() {
    printf("%d", 3 * DOUBLE(2));
    return 0;
}`, '8', c`~3 * 2 + 2~ = 8. With brackets, ~((x) + (x))~, it would be 12.`),
  Q(c`A ~static~ variable declared **inside** a function…`, ['is reset every call', 'keeps its value between calls', 'is visible to other files', 'cannot be changed'], 1),
  Q(c`Which declaration lets the function read your string but promises not to change it?`, [c`~void show(char *s)~`, c`~void show(const char *s)~`, c`~void show(char *const s)~`, c`~void show(static char *s)~`], 1),
  F('Only compile the logging line when DEBUG is defined.', c`
#include <stdio.h>
#define DEBUG

int main(void) {
#[[ifdef]] DEBUG
    printf("debugging\n");
#endif
    return 0;
}`),
] });

/* ============ ADVANCED 4: ADVANCED TYPES ============ */
topic({ id: 'adv-types', advanced: true, title: 'Unions, Layout & Variadics', icon: '🧬', color: '#00cd9c', blurb: 'Unions, how structs sit in memory, and functions like printf.',
lessons: [
{ id: 'unions', title: 'Unions & tagged unions', icon: '🔀', desc: 'Several types sharing one piece of memory.',
  steps: [
  T('union', c`A **union** looks like a struct, but all its members share the **same** bytes, so it is as big as its largest member and only one member is meaningful at a time. That saves memory when a value can be one of several types.`, c`
union Number {
    int i;
    double d;
};                      // 8 bytes, not 12

union Number n;
n.i = 42;               // now n.i is valid
n.d = 3.5;              // now n.d is valid, and n.i is garbage`),
  T('Tagged unions', c`On its own, a union cannot tell you which member is in use. So it is almost always paired with an ~enum~ **tag** in a struct. This is how JSON libraries, interpreters and compilers store "a value of any type".`, c`
typedef struct {
    enum { INT, DBL, STR } type;    // which one is valid?
    union {
        int i;
        double d;
        const char *s;
    } as;
} Value;

Value v = { .type = DBL, .as.d = 2.5 };
switch (v.type) {
    case INT: printf("%d", v.as.i); break;
    case DBL: printf("%.2f", v.as.d); break;
    case STR: printf("%s", v.as.s); break;
}`),
  P(c`
union U { char c; int i; double d; };
printf("%d", (int)sizeof(union U));`, '8', c`As big as the largest member: the ~double~.`),
  Q(c`You store ~3.5~ in ~n.d~, then read ~n.i~. What do you get?`, ['3', '3.5', 'Meaningless bits: n.i shares the bytes of the double', 'A compile error'], 2),
  X({ q: c`Finish ~print_value~ for the tagged union ~Value~: integers print as is, doubles with two decimals, strings inside double quotes. ~main~ is written.

Expected: ~42~ ~3.50~ ~"hi"~ (one per line)`, start: c`#include <stdio.h>

typedef enum { INT, DBL, STR } Type;

typedef struct {
    Type type;
    union {
        int i;
        double d;
        const char *s;
    } as;
} Value;

void print_value(Value v) {
    // switch on v.type here
}

int main() {
    Value values[] = {
        { .type = INT, .as.i = 42 },
        { .type = DBL, .as.d = 3.5 },
        { .type = STR, .as.s = "hi" },
    };
    for (int i = 0; i < 3; i++) print_value(values[i]);
    return 0;
}
`, tests: [{ out: '42\n3.50\n"hi"' }], must: [[c`switch\s*\(\s*v\.type`, c`~switch (v.type)~`]], sol: c`#include <stdio.h>

typedef enum { INT, DBL, STR } Type;

typedef struct {
    Type type;
    union {
        int i;
        double d;
        const char *s;
    } as;
} Value;

void print_value(Value v) {
    switch (v.type) {
        case INT: printf("%d\n", v.as.i); break;
        case DBL: printf("%.2f\n", v.as.d); break;
        case STR: printf("\"%s\"\n", v.as.s); break;
    }
}

int main() {
    Value values[] = {
        { .type = INT, .as.i = 42 },
        { .type = DBL, .as.d = 3.5 },
        { .type = STR, .as.s = "hi" },
    };
    for (int i = 0; i < 3; i++) print_value(values[i]);
    return 0;
}
` }),
] },

{ id: 'layout', title: 'Struct layout & padding', icon: '📐', desc: 'Why sizeof a struct is bigger than its parts.',
  steps: [
  T('Alignment and padding', c`CPUs read memory fastest when each value starts at an address that is a multiple of its size: an ~int~ on a multiple of 4, a ~double~ on 8. So the compiler inserts **padding** bytes between struct members, and at the end so arrays of the struct stay aligned.`, c`
struct A {          offset
    char c;         0     then 3 bytes of padding
    int  i;         4
    char d;         8     then 3 bytes of padding at the end
};                  sizeof = 12

struct B {
    int  i;         0
    char c;         4
    char d;         5     then 2 bytes of padding
};                  sizeof = 8   — same data, a third smaller`, c`Rule of thumb: order members **largest first**. In an array of a million structs, that saving is real memory. ~offsetof(struct A, i)~ (in ~<stddef.h>~) tells you where a member sits.`),
  P(c`
struct A { char c; int i; char d; };
struct B { int i; char c; char d; };
printf("%d %d", (int)sizeof(struct A), (int)sizeof(struct B));`, '12 8'),
  P(c`
#include <stdio.h>
#include <stddef.h>

struct A { char c; int i; char d; };

int main() {
    printf("%d %d", (int)offsetof(struct A, i), (int)offsetof(struct A, d));
    return 0;
}`, '4 8'),
  Q(c`Why does the compiler add padding inside structs?`, ['To waste memory', 'So each member is aligned for fast (and on some CPUs, possible) access', 'To make sizeof harder', 'Only in debug builds'], 1),
  X({ q: c`This ~Record~ is 32 bytes because of padding. **Reorder** its fields (keep the same five fields and types) so ~sizeof(Record)~ is 16. No ~#pragma pack~.`, start: c`#include <stdio.h>

typedef struct {
    char a;
    double d;
    char b;
    int n;
    char c;
} Record;

int main() {
    printf("%d\n", (int)sizeof(Record));
    return 0;
}
`, tests: [{ out: '16' }], must: [[c`double\s+d\s*;`, c`Keep ~double d~.`], [c`int\s+n\s*;`, c`Keep ~int n~.`], [c`char\s+a\s*;[\s\S]*char\s+b\s*;[\s\S]*char\s+c\s*;|char\s+a\s*,\s*b\s*,\s*c\s*;`, c`Keep the three chars ~a~, ~b~ and ~c~.`]], not: [[c`pragma`, c`Reorder the fields; no pragmas.`], [c`printf\(\s*"16`, c`Print the real sizeof.`]], hint: c`Largest first: the ~double~ (8), then the ~int~ (4), then the three ~char~s (3) — 15 bytes, padded to 16.`, sol: c`#include <stdio.h>

typedef struct {
    double d;
    int n;
    char a;
    char b;
    char c;
} Record;

int main() {
    printf("%d\n", (int)sizeof(Record));
    return 0;
}
` }),
] },

{ id: 'variadic', title: 'Variadic functions', icon: '🎛️', desc: 'Write your own printf-style function with stdarg.h.',
  steps: [
  T('Any number of arguments', c`~printf~ takes any number of arguments. Your functions can too, with ~<stdarg.h>~. The function must find out **how many** there are and **what type** each is — from a count, a format string, or a sentinel value like ~NULL~ at the end.`, c`
#include <stdarg.h>

int sum(int count, ...) {
    va_list args;
    va_start(args, count);              // start after the last named parameter
    int total = 0;
    for (int i = 0; i < count; i++)
        total += va_arg(args, int);     // fetch the next one, as an int
    va_end(args);                       // always clean up
    return total;
}

sum(3, 10, 20, 30);    // 60`, c`Extra arguments are **promoted**: ~char~ and ~short~ arrive as ~int~, ~float~ as ~double~. Ask ~va_arg~ for the promoted type, or the result is undefined.`),
  P(c`
#include <stdio.h>
#include <stdarg.h>

int sum(int count, ...) {
    va_list args;
    va_start(args, count);
    int total = 0;
    for (int i = 0; i < count; i++) total += va_arg(args, int);
    va_end(args);
    return total;
}

int main() {
    printf("%d %d", sum(3, 1, 2, 3), sum(0));
    return 0;
}`, '6 0'),
  Q(c`You pass a ~float~ to a variadic function. Which type should ~va_arg~ ask for?`, [c`~float~`, c`~double~`, c`~int~`, c`~void *~`], 1),
  X({ q: c`Write two variadic functions:

~double average(int count, ...)~ — the average of ~count~ doubles (0 if count is 0).
~void join(const char *first, ...)~ — prints the strings separated by ~", "~, stopping at a ~NULL~ sentinel.

Expected: ~2.50~ ~0.00~ ~apple, banana, cherry~`, start: c`#include <stdio.h>
#include <stdarg.h>

// write average and join here

int main() {
    printf("%.2f\n", average(4, 1.0, 2.0, 3.0, 4.0));
    printf("%.2f\n", average(0));
    join("apple", "banana", "cherry", NULL);
    return 0;
}
`, tests: [{ out: '2.50\n0.00\napple, banana, cherry' }], must: [[c`va_start`, c`Use ~va_start~.`], [c`va_arg\s*\(\s*\w+\s*,\s*double\s*\)`, c`Fetch the numbers with ~va_arg(args, double)~.`], [c`va_end`, c`Finish with ~va_end~.`]], sol: c`#include <stdio.h>
#include <stdarg.h>

double average(int count, ...) {
    if (count == 0) return 0;
    va_list args;
    va_start(args, count);
    double total = 0;
    for (int i = 0; i < count; i++) total += va_arg(args, double);
    va_end(args);
    return total / count;
}

void join(const char *first, ...) {
    va_list args;
    va_start(args, first);
    printf("%s", first);
    const char *s;
    while ((s = va_arg(args, const char *)) != NULL) {
        printf(", %s", s);
    }
    va_end(args);
    printf("\n");
}

int main() {
    printf("%.2f\n", average(4, 1.0, 2.0, 3.0, 4.0));
    printf("%.2f\n", average(0));
    join("apple", "banana", "cherry", NULL);
    return 0;
}
` }),
] },
],
quiz: [
  P(c`
struct S { double d; char c; };
printf("%d", (int)sizeof(struct S));`, '16', c`9 bytes of data, padded to a multiple of 8 so an array of them keeps every ~double~ aligned.`),
  Q(c`What makes a **tagged** union safe to use?`, ['It is smaller', 'An enum alongside it records which member is currently valid', 'The compiler checks it', 'Nothing'], 1),
  Q(c`Which header provides ~va_list~, ~va_start~, ~va_arg~ and ~va_end~?`, [c`~<stdio.h>~`, c`~<stdarg.h>~`, c`~<stdlib.h>~`, c`~<string.h>~`], 1),
  F('Make a type whose members share the same memory.', c`
[[union]] Box {
    int i;
    float f;
};

int main(void) {
    union Box b;
    b.i = 1;
    return b.i - 1;
}`),
] });
