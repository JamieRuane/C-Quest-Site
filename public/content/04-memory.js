/* ============ TOPIC 9: FILES ============ */
const SHOWFILE = c`// (helper that prints a file - you'll write this yourself next lesson)
void showFile(char *path) {
    FILE *f = fopen(path, "r");
    if (f == NULL) {
        printf("No such file: %s\n", path);
        return;
    }
    char line[100];
    while (fgets(line, sizeof(line), f) != NULL) {
        printf("%s", line);
    }
    fclose(f);
}`;

topic({ id: 'files', title: 'Files', icon: '💾', color: '#84d8ff', blurb: 'Make your data survive after the program ends.',
lessons: [
{ id: 'write', title: 'Writing files', icon: '✍️', desc: 'fopen, fprintf, fclose — and the mode that eats your data.',
  v: [['6:02:55', '6:08:50', 'Write files']],
  steps: [
  T('Variables die. Files don\'t.', c`Everything in memory vanishes when your program ends. To keep data, write it to a file. Three steps: **open, write, close**.`, c`
FILE *file = fopen("notes.txt", "w");    // open for writing

if (file == NULL) {                      // did it work?
    printf("Could not open file\n");
    return 1;
}

fprintf(file, "Score: %d\n", 100);       // printf, but into the file
fclose(file);                            // ALWAYS close`, c`Look at the type: ~FILE *~ — a pointer. And ~fopen~ returns ~NULL~ on failure. Everything from the Pointers topic applies.`),
  Q(c`You open an existing file with mode ~"w"~. What happens to its old contents?`, ['They are kept, new text is added at the end', 'They are erased immediately', 'fopen fails', 'They move to a backup'], 1, c`~"w"~ = **w**ipe and write. To add to the end instead, use ~"a"~ (append). To read: ~"r"~.`),
  Q(c`Which mode adds new lines to the end of a log file without destroying it?`, [c`~"w"~`, c`~"a"~`, c`~"r"~`, c`~"+"~`], 1),
  F('Append one line to a log file.', c`
FILE *f = [[fopen]]("log.txt", "[[a]]");
[[fprintf]](f, "new entry\n");
fclose(f);`),
  Q(c`Why does ~fclose~ matter so much?`, ['It deletes the file', 'Written text sits in a memory buffer — closing flushes it to disk', 'It is only for style', 'It makes the file read-only'], 1, c`Skip ~fclose~ and your last lines may never reach the disk. You're about to see that for yourself.`),
  O('Put the four steps in order.', c`
FILE *f = fopen("save.txt", "w");
if (f == NULL) return 1;
fprintf(f, "Level 3\n");
fclose(f);`),
  X({ q: c`Create ~shopping.txt~ containing three lines: ~milk~, ~eggs~, ~bread~.

The helper at the bottom of ~main~ prints the file so the tests can see it. Experiment: leave out ~fclose~ and watch what the helper finds.`, start: c`#include <stdio.h>

` + SHOWFILE + c`

int main() {
    // 1. open shopping.txt for writing
    // 2. write the three lines
    // 3. close it


    showFile("shopping.txt");
    return 0;
}
`, tests: [{ out: 'milk\neggs\nbread' }], must: [[c`fopen\s*\(`, c`Open the file with ~fopen~.`], [c`fclose\s*\(`, c`Close the file with ~fclose~.`]], hint: c`~FILE *f = fopen("shopping.txt", "w");~ then three ~fprintf(f, "milk\n");~ lines, then ~fclose(f);~`, sol: c`#include <stdio.h>

` + SHOWFILE + c`

int main() {
    FILE *f = fopen("shopping.txt", "w");
    if (f == NULL) {
        return 1;
    }
    fprintf(f, "milk\n");
    fprintf(f, "eggs\n");
    fprintf(f, "bread\n");
    fclose(f);

    showFile("shopping.txt");
    return 0;
}
` }),
] },

{ id: 'read', title: 'Reading files', icon: '📖', desc: 'Line by line with fgets, value by value with fscanf.',
  v: [['6:08:50', '6:15:14', 'Read files']],
  steps: [
  T('Read until there is nothing left', c`Open with ~"r"~, then read one line at a time. ~fgets~ returns ~NULL~ when the file runs out — which makes a perfect loop condition.`, c`
FILE *file = fopen("notes.txt", "r");
if (file == NULL) {
    printf("File not found\n");
    return 1;
}

char line[100];
while (fgets(line, sizeof(line), file) != NULL) {
    printf("%s", line);
}
fclose(file);`),
  Q(c`You ~fopen~ a file that doesn't exist using mode ~"r"~. What do you get?`, ['An empty file is created', c`~NULL~`, 'A crash', 'The number 0 bytes'], 1, c`…and if you then use that NULL pointer without checking: segfault. **Always** check fopen.`),
  Q(c`When does ~fgets(line, sizeof(line), file)~ return ~NULL~ ?`, ['When the line is empty', 'When there is nothing left to read', 'After every line', 'When the line is too long'], 1),
  T('Reading numbers and words: fscanf', c`For structured data, ~fscanf~ is ~scanf~ for files. It returns **how many values it managed to read** — so you loop while that count is what you expect.`, c`
char name[30];
int score;

while (fscanf(file, "%s %d", name, &score) == 2) {
    printf("%s scored %d\n", name, score);
}`),
  F('Read a file line by line.', c`
FILE *f = fopen("data.txt", "r");
char line[100];
while ([[fgets]](line, sizeof(line), f) != [[NULL]]) {
    printf("%s", line);
}
fclose(f);`, null, 1),
  X({ q: c`~createFile()~ writes four numbers into ~scores.txt~. Open that file, read every number, and print their sum:

~Sum: 72~`, start: c`#include <stdio.h>

void createFile() {    // sets up scores.txt for you
    FILE *f = fopen("scores.txt", "w");
    fprintf(f, "10\n20\n30\n12\n");
    fclose(f);
}

int main() {
    createFile();
    int sum = 0;


    printf("Sum: %d\n", sum);
    return 0;
}
`, tests: [{ out: 'Sum: 72' }], must: [[c`fopen\s*\([^)]*"r"`, c`Open ~scores.txt~ in ~"r"~ mode.`], [c`fscanf|fgets`, c`Read with ~fscanf~ (or ~fgets~).`]], hint: c`~int n; while (fscanf(f, "%d", &n) == 1) { sum += n; }~`, sol: c`#include <stdio.h>

void createFile() {    // sets up scores.txt for you
    FILE *f = fopen("scores.txt", "w");
    fprintf(f, "10\n20\n30\n12\n");
    fclose(f);
}

int main() {
    createFile();
    int sum = 0;

    FILE *f = fopen("scores.txt", "r");
    if (f == NULL) {
        return 1;
    }
    int n;
    while (fscanf(f, "%d", &n) == 1) {
        sum += n;
    }
    fclose(f);

    printf("Sum: %d\n", sum);
    return 0;
}
` }),
  X({ q: c`Count the lines in ~poem.txt~ and print:

~Lines: 4~`, start: c`#include <stdio.h>

void createFile() {
    FILE *f = fopen("poem.txt", "w");
    fprintf(f, "Roses are red\nViolets are blue\nPointers are scary\nBut so are you\n");
    fclose(f);
}

int main() {
    createFile();


    return 0;
}
`, tests: [{ out: 'Lines: 4' }], must: [[c`fgets|fgetc|fscanf`, c`Actually read the file.`]], not: [['"Lines: 4', 'Count them!']], hint: c`Every successful ~fgets~ is one line. Count how many times the loop runs.`, sol: c`#include <stdio.h>

void createFile() {
    FILE *f = fopen("poem.txt", "w");
    fprintf(f, "Roses are red\nViolets are blue\nPointers are scary\nBut so are you\n");
    fclose(f);
}

int main() {
    createFile();

    FILE *f = fopen("poem.txt", "r");
    if (f == NULL) {
        return 1;
    }
    char line[100];
    int lines = 0;
    while (fgets(line, sizeof(line), f) != NULL) {
        lines++;
    }
    fclose(f);
    printf("Lines: %d\n", lines);
    return 0;
}
` }),
] },

{ id: 'save', title: 'Project: save & load', icon: '🎮', desc: 'A save-game system and a log file.',
  steps: [
  T('Structs + files = save games', c`Any program that remembers things between runs does exactly this: turn its structs into lines of text on the way out, and back into structs on the way in.`),
  X({ q: c`**Save game.** Write the three players to ~save.txt~ (one ~name score~ per line), close it, then open it again and read the data into ~loaded~.

~Loaded: Link 300~
~Loaded: Zelda 450~
~Loaded: Ganon 120~`, start: c`#include <stdio.h>

typedef struct {
    char name[20];
    int score;
} Player;

int main() {
    Player team[3] = {{"Link", 300}, {"Zelda", 450}, {"Ganon", 120}};
    Player loaded[3] = {0};

    // 1. save team to save.txt

    // 2. load save.txt into loaded


    for (int i = 0; i < 3; i++) {
        printf("Loaded: %s %d\n", loaded[i].name, loaded[i].score);
    }
    return 0;
}
`, tests: [{ out: 'Loaded: Link 300\nLoaded: Zelda 450\nLoaded: Ganon 120' }], must: [[c`fopen\s*\([^)]*"w"`, c`Open the file for writing first.`], [c`fopen\s*\([^)]*"r"`, c`Then open it again for reading.`], [c`fscanf`, c`Read the values back with ~fscanf~.`]], hint: c`Save: ~fprintf(f, "%s %d\n", team[i].name, team[i].score);~ Load: ~fscanf(f, "%s %d", loaded[i].name, &loaded[i].score);~ — close the file between the two!`, sol: c`#include <stdio.h>

typedef struct {
    char name[20];
    int score;
} Player;

int main() {
    Player team[3] = {{"Link", 300}, {"Zelda", 450}, {"Ganon", 120}};
    Player loaded[3] = {0};

    FILE *f = fopen("save.txt", "w");
    if (f == NULL) return 1;
    for (int i = 0; i < 3; i++) {
        fprintf(f, "%s %d\n", team[i].name, team[i].score);
    }
    fclose(f);

    f = fopen("save.txt", "r");
    if (f == NULL) return 1;
    for (int i = 0; i < 3; i++) {
        fscanf(f, "%s %d", loaded[i].name, &loaded[i].score);
    }
    fclose(f);

    for (int i = 0; i < 3; i++) {
        printf("Loaded: %s %d\n", loaded[i].name, loaded[i].score);
    }
    return 0;
}
` }),
  X({ q: c`**Logger.** Write ~logMessage~: it opens ~log.txt~, adds the message as a new line at the end, and closes the file again.

Pick the right mode — with the wrong one, only the last message survives.`, start: c`#include <stdio.h>

` + SHOWFILE + c`

void logMessage(char *msg) {
    // your code
}

int main() {
    logMessage("Game started");
    logMessage("Player joined");
    logMessage("Game over");
    showFile("log.txt");
    return 0;
}
`, tests: [{ out: 'Game started\nPlayer joined\nGame over' }], hint: c`Mode ~"a"~ appends. ~fprintf(f, "%s\n", msg);~`, sol: c`#include <stdio.h>

` + SHOWFILE + c`

void logMessage(char *msg) {
    FILE *f = fopen("log.txt", "a");
    if (f == NULL) {
        return;
    }
    fprintf(f, "%s\n", msg);
    fclose(f);
}

int main() {
    logMessage("Game started");
    logMessage("Player joined");
    logMessage("Game over");
    showFile("log.txt");
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`What does ~fopen~ return when it fails?`, [c`~0.0~`, c`~NULL~`, c`~-1~`, 'An empty FILE'], 1),
  Q(c`Which mode erases the file before writing?`, [c`~"r"~`, c`~"a"~`, c`~"w"~`, 'None of them'], 2),
  Q(c`~fprintf(f, "%d", x)~ is to files what ___ is to the screen.`, [c`~scanf~`, c`~printf~`, c`~fgets~`, c`~fclose~`], 1),
  Q(c`What loop condition reads a file line by line until the end?`, [c`~while (fgets(line, sizeof(line), f) != NULL)~`, c`~while (f != NULL)~`, c`~while (fopen(f))~`, c`~while (line != "")~`], 0),
  Q(c`~fscanf(f, "%s %d", name, &n)~ successfully reads both values. What does it return?`, ['0', '1', '2', 'The number read'], 2, c`It returns the count of values it filled in.`),
  Q(c`What is the type of the variable that ~fopen~ gives you?`, [c`~FILE~`, c`~FILE *~`, c`~int~`, c`~char *~`], 1),
] });

/* ============ TOPIC 10: DYNAMIC MEMORY ============ */
topic({ id: 'memory', title: 'Dynamic Memory', icon: '🏗️', color: '#b197fc', blurb: 'malloc, free and the heap: memory on your terms.',
lessons: [
{ id: 'malloc', title: 'malloc & free', icon: '🏢', desc: 'Ask for memory while the program is running — and give it back.',
  v: [['6:15:14', '6:24:46', 'malloc']],
  steps: [
  T('Two places to keep things', c`**The stack** — where local variables live. Automatic, but sizes are fixed and everything dies when the function returns.

**The heap** — a big pool of memory you can request from *while the program is running*. You choose the size. It lives until **you** release it.

~malloc~ ("memory allocate") asks the heap for a number of bytes and returns a pointer to them:`, c`
#include <stdlib.h>

int n = 5;
int *scores = malloc(n * sizeof(int));   // room for 5 ints

if (scores == NULL) {                    // out of memory?
    return 1;
}

scores[0] = 90;      // use it exactly like an array
scores[4] = 75;

free(scores);        // done: hand it back`),
  Q(c`With 4-byte ints, how many bytes does ~malloc(10 * sizeof(int))~ request?`, ['10', '14', '40', '4'], 2, c`malloc counts **bytes**. Always multiply the element count by ~sizeof~ the element type.`),
  Q('What is inside a freshly malloc\'d block?', ['Zeros', 'Garbage — whatever was there before', 'The value NULL', 'Empty strings'], 1, c`Like an uninitialised variable. Fill it before you read it.`),
  Q('A local array and a malloc\'d block: what is the key difference?', ['malloc is faster', 'The local dies when its function returns; the heap block lives until you free it', 'Local arrays can be bigger', 'There is none'], 1, c`That's the fix for the dangling-pointer problem: a function can ~malloc~ something and safely return the pointer.`),
  F('Allocate room for n doubles, then release it.', c`
int n = 8;
double *data = [[malloc]](n * [[sizeof]](double));
data[0] = 1.5;
[[free]](data);`),
  X({ q: c`Read ~n~, then ~n~ numbers — the array must be exactly as big as needed, so ~malloc~ it. Print the numbers in reverse, then free the memory.

~4 1 2 3 4~ → ~4 3 2 1~`, start: M(c`
    int n;
    scanf("%d", &n);

`, 'stdlib.h'), tests: [{ in: '4 1 2 3 4', out: '4 3 2 1' }, { in: '1 99', out: '99' }, { in: '6 5 0 5 0 5 1', out: '1 5 0 5 0 5' }], must: [[c`malloc\s*\(`, c`Allocate the array with ~malloc~.`], [c`free\s*\(`, c`Every ~malloc~ needs a ~free~.`]], hint: c`~int *nums = malloc(n * sizeof(int));~ — after that it behaves like any array: ~nums[i]~.`, sol: M(c`
    int n;
    scanf("%d", &n);

    int *nums = malloc(n * sizeof(int));
    if (nums == NULL) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    for (int i = n - 1; i >= 0; i--) {
        printf("%d ", nums[i]);
    }
    printf("\n");
    free(nums);`, 'stdlib.h') }),
  X({ q: c`Write ~makeSquares~: it creates an array of ~n~ ints on the heap, fills it with 1, 4, 9, 16…, and **returns the pointer**.

(With a local array this would be a dangling pointer. With malloc it's perfectly fine — and ~main~ frees it.)`, start: c`#include <stdio.h>
#include <stdlib.h>

int *makeSquares(int n) {
    // your code
}

int main() {
    int n;
    scanf("%d", &n);
    int *sq = makeSquares(n);
    for (int i = 0; i < n; i++) {
        printf("%d ", sq[i]);
    }
    printf("\n");
    free(sq);
    return 0;
}
`, tests: [{ in: '5', out: '1 4 9 16 25' }, { in: '1', out: '1' }, { in: '10', out: '1 4 9 16 25 36 49 64 81 100' }], must: [[c`malloc\s*\(|calloc\s*\(`, c`Allocate on the heap with ~malloc~.`]], hint: c`~int *a = malloc(n * sizeof(int));~, loop ~a[i] = (i + 1) * (i + 1);~, ~return a;~`, sol: c`#include <stdio.h>
#include <stdlib.h>

int *makeSquares(int n) {
    int *a = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        a[i] = (i + 1) * (i + 1);
    }
    return a;
}

int main() {
    int n;
    scanf("%d", &n);
    int *sq = makeSquares(n);
    for (int i = 0; i < n; i++) {
        printf("%d ", sq[i]);
    }
    printf("\n");
    free(sq);
    return 0;
}
` }),
] },

{ id: 'calloc', title: 'calloc', icon: '🧹', desc: 'Like malloc, but it cleans the room first.',
  v: [['6:24:46', '6:31:33', 'calloc']],
  steps: [
  T('Contiguous allocation — zeroed', c`~calloc~ does the same job as ~malloc~ with two differences: it takes the **count** and the **element size** as separate arguments, and it sets every byte to **zero**.`, c`
int *a = malloc(5 * sizeof(int));   // 5 ints of garbage
int *b = calloc(5, sizeof(int));    // 5 ints, all 0`, c`Perfect for counters, tallies and flags — anything that should start at zero.`),
  P(c`
int *a = calloc(3, sizeof(int));
printf("%d%d%d", a[0], a[1], a[2]);
free(a);`, '000'),
  Q(c`Which statement is true?`, [c`~calloc~ memory does not need to be freed`, c`~calloc~ zeroes the memory; ~malloc~ leaves garbage`, c`~malloc~ is for ints, ~calloc~ is for chars`, c`~calloc~ cannot fail`], 1),
  F('Allocate 26 zeroed counters, one per letter.', c`
int *counts = [[calloc]](26, sizeof([[int]]));
counts[0]++;
free(counts);`),
  X({ q: c`**Vote counter.** There are 5 candidates (0–4). Read votes until ~-1~, then print the tally:

input ~0 2 2 4 2 -1~ →

~Candidate 0: 1~
~Candidate 1: 0~
~Candidate 2: 3~
~Candidate 3: 0~
~Candidate 4: 1~

Use ~calloc~ so every counter starts at zero.`, start: M(c`
    int vote;

`, 'stdlib.h'), tests: [{ in: '0 2 2 4 2 -1', out: 'Candidate 0: 1\nCandidate 1: 0\nCandidate 2: 3\nCandidate 3: 0\nCandidate 4: 1' }, { in: '-1', out: 'Candidate 0: 0\nCandidate 1: 0\nCandidate 2: 0\nCandidate 3: 0\nCandidate 4: 0' }, { in: '3 3 3 1 -1', out: 'Candidate 0: 0\nCandidate 1: 1\nCandidate 2: 0\nCandidate 3: 3\nCandidate 4: 0' }], must: [[c`calloc\s*\(`, c`Use ~calloc~.`], [c`free\s*\(`, c`Free the memory at the end.`]], hint: c`~int *tally = calloc(5, sizeof(int));~ and for each vote: ~tally[vote]++;~`, sol: M(c`
    int vote;

    int *tally = calloc(5, sizeof(int));
    if (tally == NULL) {
        return 1;
    }
    scanf("%d", &vote);
    while (vote != -1) {
        tally[vote]++;
        scanf("%d", &vote);
    }
    for (int i = 0; i < 5; i++) {
        printf("Candidate %d: %d\n", i, tally[i]);
    }
    free(tally);`, 'stdlib.h') }),
] },

{ id: 'realloc', title: 'realloc', icon: '🚢', desc: 'Arrays that grow. This is how every "list" in every language works.',
  v: [['6:31:33', '6:43:23', 'realloc']],
  steps: [
  T('Resize a block', c`Ran out of room? ~realloc~ resizes a heap block. If there's no space to grow where it is, realloc **moves** the whole block somewhere bigger, copies your data across, and frees the old one.`, c`
int *temp = realloc(nums, newCount * sizeof(int));

if (temp == NULL) {      // failed: the old block is still valid
    free(nums);
    return 1;
}
nums = temp;             // success: use the (possibly new) address`, c`Because the block may move, the **old pointer value is dead** after a successful realloc. Always continue with what realloc returned.`),
  Q(c`Why store the result in ~temp~ instead of writing ~nums = realloc(nums, ...)~ directly?`, ['It is faster', c`If realloc fails it returns NULL — and you would overwrite your only pointer to the data`, 'realloc cannot assign to the same variable', 'No reason'], 1, c`Losing the only pointer to a heap block = memory leak, plus all your data is unreachable.`),
  Q('After a successful realloc to a bigger size, what happened to your existing data?', ['It is erased', 'It is preserved (copied over if the block had to move)', 'It is reversed', 'Only the first element is kept'], 1),
  F('Grow the array safely.', c`
int *nums = malloc(2 * sizeof(int));
int *temp = [[realloc]](nums, 10 * sizeof(int));
if (temp != NULL) {
    nums = [[temp]];
}
free(nums);`),
  Q('A growing list usually doubles its capacity when full instead of adding 1 slot each time. Why?', ['Doubling uses less memory', 'Far fewer (expensive) reallocations', 'realloc only accepts powers of two', 'It looks nicer'], 1, c`Growing to a million elements takes about 20 doublings — versus a million one-slot reallocs. Python lists, Java ArrayLists and C++ vectors all do this.`),
  X({ q: c`**The growing array.** Read numbers until ~0~ — you have no idea how many are coming. Start with capacity 2 and **double** it with ~realloc~ whenever the array is full.

input ~5 3 8 1 9 0~ →

~Count: 5~
~5 3 8 1 9~`, start: M(c`
    int capacity = 2;
    int count = 0;
    int *nums = malloc(capacity * sizeof(int));
    int n;

`, 'stdlib.h'), tests: [{ in: '5 3 8 1 9 0', out: 'Count: 5\n5 3 8 1 9' }, { in: '7 0', out: 'Count: 1\n7' }, { in: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 0', out: 'Count: 17\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17' }], must: [[c`realloc\s*\(`, c`Grow the array with ~realloc~.`], [c`free\s*\(`, c`Free the array at the end.`]], hint: c`Before storing each number: ~if (count == capacity) { capacity *= 2; temp = realloc(nums, capacity * sizeof(int)); ... nums = temp; }~ then ~nums[count++] = n;~`, sol: M(c`
    int capacity = 2;
    int count = 0;
    int *nums = malloc(capacity * sizeof(int));
    int n;

    scanf("%d", &n);
    while (n != 0) {
        if (count == capacity) {
            capacity *= 2;
            int *temp = realloc(nums, capacity * sizeof(int));
            if (temp == NULL) {
                free(nums);
                return 1;
            }
            nums = temp;
        }
        nums[count++] = n;
        scanf("%d", &n);
    }

    printf("Count: %d\n", count);
    for (int i = 0; i < count; i++) {
        printf("%d ", nums[i]);
    }
    printf("\n");
    free(nums);`, 'stdlib.h') }),
] },

{ id: 'crimes', title: 'Memory crimes', icon: '🚨', desc: 'Leaks, use-after-free, double free: recognise them on sight.',
  steps: [
  T('With great power…', c`C never cleans up after you. Three classic ways to hurt yourself:`, c`
// 1. MEMORY LEAK - allocated, never freed
int *a = malloc(100);
a = NULL;                // the block is now unreachable forever

// 2. USE-AFTER-FREE - touching memory you gave back
free(b);
printf("%d", b[0]);      // undefined behaviour

// 3. DOUBLE FREE - freeing the same block twice
free(c);
free(c);                 // usually a crash`, c`The rule that prevents all three: **every malloc gets exactly one free**, and after freeing, set the pointer to ~NULL~.`),
  Q(c`What is wrong here?`, ['Nothing', 'Memory leak: the only pointer to the block disappears when the function returns', 'Use-after-free', 'Double free'], 1, c`~data~ is a local variable holding the address. When ~load~ returns, the address is forgotten but the heap block stays reserved — every call leaks another 400 bytes.`, c`
void load() {
    int *data = malloc(100 * sizeof(int));
    data[0] = 1;
}`),
  Q(c`And here?`, ['Memory leak', 'Use-after-free: reading memory that was already released', 'Nothing, it prints 5', 'Double free'], 1, c`It might even print 5 today! That's what makes undefined behaviour so nasty: it can "work" until the day it doesn't.`, c`
int *p = malloc(sizeof(int));
*p = 5;
free(p);
printf("%d", *p);`),
  Q(c`And here?`, ['Use-after-free', 'Double free', 'The first block is leaked — its address was overwritten', 'Nothing'], 2, c`The second ~malloc~ replaced the only copy of the first block's address. One free, two mallocs: one leak.`, c`
int *p = malloc(sizeof(int));
p = malloc(sizeof(int));
free(p);`),
  Q(c`Why set a pointer to ~NULL~ right after freeing it?`, ['It frees the memory faster', c`So an accidental later use crashes immediately instead of silently corrupting data — and ~free(NULL)~ is harmless`, 'The compiler requires it', 'It makes the pointer smaller'], 1),
  X({ q: c`**Leak hunt.** This program counts its own live heap blocks (via ~track~ and ~release~). Right now it reports ~Leaks: 3~.

Fix it so the greetings still print and the last line says ~Leaks: 0~. Use ~release(...)~ instead of ~free~ so the counter sees it.`, start: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int live = 0;    // heap blocks currently allocated
void *track(void *p) { if (p != NULL) live++; return p; }
void release(void *p) { if (p != NULL) live--; free(p); }

char *makeGreeting(char *name) {
    char *text = track(malloc(strlen(name) + 8));
    strcpy(text, "Hello, ");
    strcat(text, name);
    return text;
}

int main() {
    char *names[] = {"Ada", "Linus", "Grace"};

    for (int i = 0; i < 3; i++) {
        char *greeting = makeGreeting(names[i]);
        printf("%s\n", greeting);
    }

    printf("Leaks: %d\n", live);
    return 0;
}
`, tests: [{ out: 'Hello, Ada\nHello, Linus\nHello, Grace\nLeaks: 0' }], not: [['"Leaks: 0', 'Fix the leak, not the message.']], must: [[c`release\s*\(\s*greeting\s*\)`, c`Release each greeting once you're done with it: ~release(greeting);~`]], hint: c`Each loop round gets a new block from ~makeGreeting~. Once it's printed, nobody needs it: ~release(greeting);~`, sol: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int live = 0;    // heap blocks currently allocated
void *track(void *p) { if (p != NULL) live++; return p; }
void release(void *p) { if (p != NULL) live--; free(p); }

char *makeGreeting(char *name) {
    char *text = track(malloc(strlen(name) + 8));
    strcpy(text, "Hello, ");
    strcat(text, name);
    return text;
}

int main() {
    char *names[] = {"Ada", "Linus", "Grace"};

    for (int i = 0; i < 3; i++) {
        char *greeting = makeGreeting(names[i]);
        printf("%s\n", greeting);
        release(greeting);
    }

    printf("Leaks: %d\n", live);
    return 0;
}
` }),
  X({ q: c`Structs on the heap. Write ~createPlayer~: it mallocs **one** Player, fills in the name and hp, and returns the pointer.

Expected: ~Link has 80 HP~`, start: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[20];
    int hp;
} Player;

Player *createPlayer(char *name, int hp) {
    // your code
}

int main() {
    Player *hero = createPlayer("Link", 80);
    printf("%s has %d HP\n", hero->name, hero->hp);
    free(hero);
    return 0;
}
`, tests: [{ out: 'Link has 80 HP' }], must: [[c`malloc\s*\(\s*sizeof|calloc\s*\(`, c`Allocate with ~malloc(sizeof(Player))~.`]], hint: c`~Player *p = malloc(sizeof(Player)); strcpy(p->name, name); p->hp = hp; return p;~`, sol: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[20];
    int hp;
} Player;

Player *createPlayer(char *name, int hp) {
    Player *p = malloc(sizeof(Player));
    strcpy(p->name, name);
    p->hp = hp;
    return p;
}

int main() {
    Player *hero = createPlayer("Link", 80);
    printf("%s has %d HP\n", hero->name, hero->hp);
    free(hero);
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`Which function gives you zero-filled memory?`, [c`~malloc~`, c`~calloc~`, c`~realloc~`, c`~free~`], 1),
  Q(c`How do you allocate an array of 20 doubles?`, [c`~malloc(20)~`, c`~malloc(20 * sizeof(double))~`, c`~malloc(double[20])~`, c`~malloc(sizeof(20))~`], 1),
  Q('What is a memory leak?', ['Reading past the end of an array', 'Heap memory that was never freed and can no longer be reached', 'A variable without a value', 'A pointer set to NULL'], 1),
  Q(c`After ~free(p);~ what should you NOT do?`, [c`Set ~p = NULL~`, c`Read or write ~*p~`, 'Allocate new memory', 'End the program'], 1),
  Q(c`~realloc~ returns a different address than the one you passed in. What does that mean?`, ['It failed', 'The block was moved; use the new address from now on', 'Your data is lost', 'You must free both addresses'], 1),
  Q('Where do local variables live, and where does malloc memory live?', ['Both on the heap', 'Locals on the stack, malloc memory on the heap', 'Locals on the heap, malloc memory on the stack', 'Both on the stack'], 1),
  P(c`
int *a = calloc(4, sizeof(int));
a[1] = 7;
printf("%d %d", a[0], a[1]);
free(a);`, '0 7'),
] });

/* ============ TOPIC 11: FINAL BOSS ============ */
topic({ id: 'boss', title: 'Final Boss', icon: '👑', color: '#c0c7ff', blurb: 'Pro habits and three capstone programs. Everything, combined.',
lessons: [
{ id: 'pro', title: 'Pro habits', icon: '🧠', desc: 'Constants, macros and how to debug without panic.',
  steps: [
  T('No more magic numbers', c`A bare ~100~ in the middle of your code says nothing. Give constants a name:`, c`
#define MAX_PLAYERS 4            // preprocessor: find-and-replace before compiling
const double PI = 3.14159;       // a real variable the compiler protects

int scores[MAX_PLAYERS];
PI = 3;                          // compile error: PI is read-only`, c`~#define~ is blunt text substitution — no type, no semicolon. ~const~ is a typed variable that simply can't be changed. Prefer ~const~ where it works; use ~#define~ for array sizes.`),
  P(c`
#include <stdio.h>
#define SQUARE(x) x * x

int main() {
    printf("%d", SQUARE(2 + 3));
    return 0;
}`, '11', c`Macros paste **text**: ~2 + 3 * 2 + 3~ = 11, not 25. That's why macro bodies get wrapped in brackets — ~((x) * (x))~ — and why a real function is usually the better choice.`),
  Q(c`What happens here? ~const int LIVES = 3; LIVES = 5;~`, ['LIVES becomes 5', 'The compiler rejects it', 'It crashes at runtime', 'LIVES becomes 8'], 1),
  T('Debugging without panic', c`When things break, work the checklist:

**Won't compile?** Fix the **first** error only, recompile. Later errors are often echoes of it.

**Wrong output?** Add ~printf~s that show your variables at key moments. Boring. Works every time.

**Segfault?** It's nearly always one of four: a ~NULL~ or uninitialised pointer · an index out of bounds · using freed memory · a missing ~&~ in ~scanf~.

**Works sometimes?** Undefined behaviour. Look for an uninitialised variable or an off-by-one.

And always compile with warnings on (~gcc -Wall~). This site does it for you.`),
  Q('Which of these is NOT a typical cause of a segmentation fault?', ['Dereferencing a NULL pointer', 'Writing past the end of an array', 'A missing semicolon', 'Using memory after free'], 2, c`A missing semicolon is a **compile** error — the program never even exists. Segfaults happen at **run time**.`),
  X({ q: c`**Bug hunt.** This should count how often 8 appears in the array (~Eights: 2~). It contains three different classic bugs — you've met every one of them in this course.

Run it, read the compiler warnings, and fix all three.`, start: M(c`
    int nums[5] = {3, 8, 2, 8, 5};
    int count;

    for (int i = 0; i <= 5; i++) {
        if (nums[i] = 8) {
            count++;
        }
    }

    printf("Eights: %d\n", count);`), tests: [{ out: 'Eights: 2' }], not: [['"Eights: 2', 'Fix the bugs, not the message.']], must: [['==', c`One of the bugs is an ~=~ that should be ~==~.`], [c`count\s*=\s*0`, c`~count~ starts with garbage — initialise it.`], [c`i\s*<\s*5`, c`The loop goes one step too far.`]], hint: c`Uninitialised variable. Off-by-one. Assignment instead of comparison.`, sol: M(c`
    int nums[5] = {3, 8, 2, 8, 5};
    int count = 0;

    for (int i = 0; i < 5; i++) {
        if (nums[i] == 8) {
            count++;
        }
    }

    printf("Eights: %d\n", count);`) }),
] },

{ id: 'gradebook', title: 'Capstone: gradebook', icon: '🎓', desc: 'Structs + malloc + loops in one real program.',
  steps: [
  T('Capstone 1 of 3', c`From here on there are no fill-in-the-blanks. Each capstone is a blank-ish ~main~ and a specification — like a real task.

Plan before you type: What data do I need? What struct? What steps? Write it in small pieces and hit **Run** often.`),
  X({ q: c`**Gradebook.** Input: ~n~, then ~n~ students (one-word name + integer score).

Allocate **exactly** n students on the heap. Then print the average (1 decimal), the top student, and everyone scoring **below** the average:

input ~4 Ann 80 Bob 60 Cleo 95 Dev 65~ →

~Average: 75.0~
~Top: Cleo (95)~
~Needs help: Bob~
~Needs help: Dev~`, start: c`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[30];
    int score;
} Student;

int main() {
    int n;
    scanf("%d", &n);

    return 0;
}
`, tests: [{ in: '4 Ann 80 Bob 60 Cleo 95 Dev 65', out: 'Average: 75.0\nTop: Cleo (95)\nNeeds help: Bob\nNeeds help: Dev' }, { in: '1 Solo 50', out: 'Average: 50.0\nTop: Solo (50)' }, { in: '3 A 10 B 20 C 40', out: 'Average: 23.3\nTop: C (40)\nNeeds help: A\nNeeds help: B' }], must: [[c`malloc\s*\(|calloc\s*\(`, c`Allocate the students with ~malloc~.`], [c`free\s*\(`, c`Free the memory before the program ends.`]], hint: c`~Student *s = malloc(n * sizeof(Student));~ Read with ~scanf("%s %d", s[i].name, &s[i].score)~. One loop for total + top index, then compute the average as a ~double~, then a second loop for "Needs help".`, sol: c`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[30];
    int score;
} Student;

int main() {
    int n;
    scanf("%d", &n);

    Student *s = malloc(n * sizeof(Student));
    if (s == NULL) {
        return 1;
    }

    int total = 0, top = 0;
    for (int i = 0; i < n; i++) {
        scanf("%s %d", s[i].name, &s[i].score);
        total += s[i].score;
        if (s[i].score > s[top].score) {
            top = i;
        }
    }

    double avg = (double)total / n;
    printf("Average: %.1f\n", avg);
    printf("Top: %s (%d)\n", s[top].name, s[top].score);
    for (int i = 0; i < n; i++) {
        if (s[i].score < avg) {
            printf("Needs help: %s\n", s[i].name);
        }
    }

    free(s);
    return 0;
}
` }),
] },

{ id: 'text', title: 'Capstone: text tools', icon: '🔐', desc: 'A word counter and a secret-message cipher.',
  steps: [
  X({ q: c`**Word counter.** Read one line and print how many words it has. Words are separated by one **or more** spaces.

~the quick  brown fox~ → ~Words: 4~

Trick: a word *starts* wherever a non-space character follows a space (or the beginning of the line).`, start: M(c`
    char line[300];
    fgets(line, sizeof(line), stdin);

`), tests: [{ in: 'the quick  brown fox', out: 'Words: 4' }, { in: '   hi   ', out: 'Words: 1' }, { in: 'one', out: 'Words: 1' }, { in: 'a b c d e f', out: 'Words: 6' }, { in: '\n', out: 'Words: 0' }], hint: c`Keep a flag ~inWord = 0~. Walk the string: on a space or ~'\n'~ set ~inWord = 0~; on any other character, if ~inWord~ was 0, count a new word and set it to 1.`, sol: M(c`
    char line[300];
    fgets(line, sizeof(line), stdin);

    int words = 0, inWord = 0;
    for (int i = 0; line[i] != '\0'; i++) {
        if (line[i] == ' ' || line[i] == '\n') {
            inWord = 0;
        } else if (!inWord) {
            inWord = 1;
            words++;
        }
    }
    printf("Words: %d\n", words);`) }),
  X({ q: c`**Caesar cipher** — the 2000-year-old encryption. Write ~encrypt~: shift every letter forward by ~shift~ places, wrapping from z back to a. Keep upper/lower case; leave everything else untouched.

shift 3: ~Hello, World!~ → ~Khoor, Zruog!~

Letters are numbers: ~'a' + 1~ is ~'b'~. And ~%~ handles the wrap-around.`, start: c`#include <stdio.h>

void encrypt(char *s, int shift) {
    // your code
}

int main() {
    int shift;
    char line[200];
    scanf("%d ", &shift);
    fgets(line, sizeof(line), stdin);
    encrypt(line, shift);
    printf("%s\n", line);
    return 0;
}
`, tests: [{ in: '3\nHello, World!', out: 'Khoor, Zruog!' }, { in: '1\nxyz XYZ', out: 'yza YZA' }, { in: '13\nPointers are fun', out: 'Cbvagref ner sha' }], hint: c`For a lowercase letter: ~*s = 'a' + (*s - 'a' + shift) % 26;~ — convert to 0–25, shift, wrap, convert back. Same with ~'A'~ for capitals.`, sol: c`#include <stdio.h>

void encrypt(char *s, int shift) {
    while (*s != '\0') {
        if (*s >= 'a' && *s <= 'z') {
            *s = 'a' + (*s - 'a' + shift) % 26;
        } else if (*s >= 'A' && *s <= 'Z') {
            *s = 'A' + (*s - 'A' + shift) % 26;
        }
        s++;
    }
}

int main() {
    int shift;
    char line[200];
    scanf("%d ", &shift);
    fgets(line, sizeof(line), stdin);
    encrypt(line, shift);
    printf("%s\n", line);
    return 0;
}
` }),
] },

{ id: 'stack', title: 'Capstone: build a stack', icon: '🥞', desc: 'Your own growable data structure. The final exam.',
  v: [['6:43:23', null, 'Victory lap: Bro builds a digital clock']],
  steps: [
  T('The last one', c`A **stack** is a pile: you ~push~ things on top and ~pop~ them off the top — last in, first out. It's how your browser's Back button and every Undo feature work.

You're going to build one that grows automatically. It needs everything: a struct, pointers to that struct, the arrow operator, and realloc.

One gift: ~realloc(NULL, size)~ behaves exactly like ~malloc(size)~, so an empty stack can start with ~data = NULL~.`),
  X({ q: c`Write ~push~ and ~pop~.

~push~: if the stack is full (~size == capacity~), double the capacity (start with 2 when it is 0) and ~realloc~. Then store the value on top.

~pop~: remove the top value and return it.

~main~ pushes numbers until 0, then pops them all — so they come out reversed:

~1 2 3 4 5 0~ → ~5 4 3 2 1~`, start: c`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;       // heap array holding the values
    int size;        // how many values are stored
    int capacity;    // how many fit before we must grow
} Stack;

void push(Stack *s, int value) {
    // your code
}

int pop(Stack *s) {
    // your code
}

int main() {
    Stack s = {NULL, 0, 0};
    int n;

    scanf("%d", &n);
    while (n != 0) {
        push(&s, n);
        scanf("%d", &n);
    }
    while (s.size > 0) {
        printf("%d ", pop(&s));
    }
    printf("\n");

    free(s.data);
    return 0;
}
`, tests: [{ in: '1 2 3 4 5 0', out: '5 4 3 2 1' }, { in: '42 0', out: '42' }, { in: '9 8 7 6 5 4 3 2 1 10 20 30 0', out: '30 20 10 1 2 3 4 5 6 7 8 9' }], must: [[c`realloc\s*\(`, c`Grow the stack with ~realloc~.`], ['->', c`Reach the struct through the pointer with ~->~`]], hint: c`push: ~if (s->size == s->capacity) { s->capacity = s->capacity == 0 ? 2 : s->capacity * 2; s->data = realloc(s->data, s->capacity * sizeof(int)); }~ then ~s->data[s->size++] = value;~ · pop: ~return s->data[--s->size];~`, sol: c`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;       // heap array holding the values
    int size;        // how many values are stored
    int capacity;    // how many fit before we must grow
} Stack;

void push(Stack *s, int value) {
    if (s->size == s->capacity) {
        int newCap = s->capacity == 0 ? 2 : s->capacity * 2;
        int *temp = realloc(s->data, newCap * sizeof(int));
        if (temp == NULL) {
            return;
        }
        s->data = temp;
        s->capacity = newCap;
    }
    s->data[s->size] = value;
    s->size++;
}

int pop(Stack *s) {
    s->size--;
    return s->data[s->size];
}

int main() {
    Stack s = {NULL, 0, 0};
    int n;

    scanf("%d", &n);
    while (n != 0) {
        push(&s, n);
        scanf("%d", &n);
    }
    while (s.size > 0) {
        printf("%d ", pop(&s));
    }
    printf("\n");

    free(s.data);
    return 0;
}
` }),
  T('You can write C. Now what?', c`You started at ~printf("Hello")~ and just built a self-growing data structure with manual memory management. That is not beginner stuff any more.

**Where to go from here:**

**Build something you want.** A text adventure, a to-do list that saves to a file, Conway's Game of Life, a tiny shell. Projects teach what lessons can't.

**Split code across files.** Learn ~.h~ headers and compiling several ~.c~ files together.

**Meet the tools.** A debugger (~gdb~) lets you pause a program and look inside. Sanitizers (~gcc -fsanitize=address~) catch memory crimes automatically.

**Next data structures.** Linked lists, then hash tables. You already have every skill they need.

Keep your streak going in Practice — and go build things.`),
] },
],
quiz: [
  P(c`
int a = 7, b = 2;
printf("%.1f", (double)a / b);`, '3.5'),
  P(c`
#include <stdio.h>

void change(int *p, int v) {
    *p = v;
    v = 0;
}

int main() {
    int x = 1, y = 5;
    change(&x, y);
    printf("%d %d", x, y);
    return 0;
}`, '5 5'),
  Q(c`Which line has a bug?`, [c`~int *a = malloc(5 * sizeof(int));~`, c`~for (int i = 0; i <= 5; i++) a[i] = 0;~`, c`~free(a);~`, 'None of them'], 1, c`Off-by-one: index 5 is outside a 5-element block.`),
  P(c`
char s[] = "code";
char *p = s;
p[0] = 'm';
printf("%s %d", s, (int)(p == s));`, 'mode 1'),
  Q(c`A struct pointer ~Player *p~. How do you read its ~hp~ member?`, [c`~p.hp~`, c`~p->hp~`, c`~*p.hp~`, c`~p::hp~`], 1),
  P(c`
int total = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2) continue;
    if (i > 8) break;
    total += i;
}
printf("%d", total);`, '20', c`Odd numbers are skipped; 10 triggers the break. 2 + 4 + 6 + 8 = 20.`),
  Q(c`What is the correct order?`, ['free → use → malloc', 'malloc → check for NULL → use → free', 'use → malloc → free', 'malloc → free → use'], 1),
  Q(c`~#define SIZE 10~ — what does the preprocessor do with it?`, ['Creates an int variable called SIZE', 'Replaces every SIZE in the code with 10 before compiling', 'Allocates 10 bytes', 'Nothing until runtime'], 1),
] });
