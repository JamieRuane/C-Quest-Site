/* ================= C, Part 2: Advanced (topics A5-A8) ================= */
G('errno', c`A global error number set by many library functions when they fail. Check the function's return value first, then ~errno~.`);
G('strtol', c`Converts text to a number safely: it tells you where the number stopped (~endptr~) and reports overflow through ~errno~.`);
G('buffer overflow', c`Writing past the end of an array. In C it silently corrupts memory and is the classic security hole.`);
G('snprintf', c`~printf~ into a buffer that never writes more than the size you give, and returns how long the full text would have been.`);
G('assert', c`~assert(condition)~ stops the program with a message if a "this can never happen" condition is false. For bugs, not for user input.`);
G('goto cleanup', c`The standard C pattern for releasing several resources in one place when something fails part-way through.`);
G('dynamic array', c`An array on the heap that grows when full (usually doubling) with ~realloc~: C's version of a list or vector.`);
G('linked list', c`Nodes on the heap, each holding a value and a pointer to the next node. Cheap to insert anywhere, slow to index.`);
G('queue', c`First in, first out. With a linked list, keep pointers to both the head (remove) and the tail (add).`);
G('hash table', c`An array of buckets; a hash function turns a key into a bucket number, so lookups are usually ~O(1)~.`);
G('hash function', c`Turns a key (like a string) into a number. A good one spreads keys evenly over the buckets.`);
G('collision', c`Two keys landing in the same bucket. **Chaining** keeps a small linked list in each bucket.`);
G('binary search tree', c`Each node's left subtree holds smaller keys and its right subtree larger ones, so searching halves the work each step.`);
G('binary heap', c`A tree stored in an array where every parent is smaller than its children: the smallest item is always at index 0.`);

/* ============ ADVANCED 5: ROBUST C ============ */
topic({ id: 'adv-robust', advanced: true, title: 'Robust C', icon: '🛡️', color: '#ff9600', blurb: 'Error handling, safe strings and cleaning up properly.',
lessons: [
{ id: 'errors', title: 'Error handling', icon: '🚨', desc: 'Return codes, errno and parsing numbers safely.',
  steps: [
  T('C has no exceptions', c`In C, a function reports failure through its **return value**: ~NULL~ from ~malloc~ or ~fopen~, ~EOF~ from ~scanf~, ~-1~ from many system calls. Many also set the global ~errno~ to say **why**. Professional C checks every one.`, c`
FILE *f = fopen("data.txt", "r");
if (f == NULL) {
    perror("data.txt");          // prints e.g. "data.txt: No such file or directory"
    return 1;                    // a non-zero exit status means failure
}`, c`Only read ~errno~ **after** a call has told you it failed: successful calls may leave old values in it.`),
  T('atoi vs strtol', c`~atoi("abc")~ returns 0 — the same as ~atoi("0")~ — so you cannot tell a bad input from a real zero, and overflow is undefined. ~strtol~ / ~strtoll~ tell you where the number ended and set ~errno~ to ~ERANGE~ on overflow.`, c`
char *end;
errno = 0;
long long v = strtoll(text, &end, 10);
if (end == text)          -> no digits at all
else if (*end != '\0')    -> junk after the number
else if (errno == ERANGE) -> too big to fit`),
  P(c`
char *end;
int v = (int)strtol("42abc", &end, 10);
printf("%d [%s]", v, end);`, '42 [abc]', c`~end~ points at the first character that was not part of the number.`),
  Q(c`Why is ~atoi~ a poor choice for user input?`, ['It is slow', 'It returns 0 for garbage, so a bad input looks the same as a real 0, and it cannot report overflow', 'It only reads hex', 'It modifies the string'], 1),
  X({ q: c`**Strict number parser.** For each line, print ~ok N~ if the whole line is a whole number, ~invalid: LINE~ if not (empty, letters, or junk after the digits), or ~out of range~ if it is too big for a ~long long~. Use ~strtoll~ with an end pointer and ~errno~.`, start: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

int main() {
    char line[100];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\r\n")] = '\0';
        printf("ok %d\n", atoi(line));
    }
    return 0;
}
`, tests: [{ in: '42\n-7\n12abc\n\n99999999999999999999\nhello\n', out: 'ok 42\nok -7\ninvalid: 12abc\ninvalid: \nout of range\ninvalid: hello' }], must: [[c`strtoll?\s*\(`, c`Parse with ~strtoll~.`], [c`errno`, c`Check ~errno~ for ~ERANGE~.`]], not: [[c`atoi`, c`Replace ~atoi~.`]], sol: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

int main() {
    char line[100];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\r\n")] = '\0';
        char *end;
        errno = 0;
        long long v = strtoll(line, &end, 10);
        if (end == line || *end != '\0') printf("invalid: %s\n", line);
        else if (errno == ERANGE) printf("out of range\n");
        else printf("ok %lld\n", v);
    }
    return 0;
}
` }),
] },

{ id: 'strings', title: 'Safe strings', icon: '🧵', desc: 'Never overflow a buffer again: snprintf, fgets and friends.',
  steps: [
  T('The danger', c`C strings are just arrays, and most old string functions do **not** know how big your array is. Write one byte too many and you silently corrupt whatever sits next to it in memory — the cause of countless crashes and security holes.

~gets~ — removed from C entirely. Use ~fgets(buf, sizeof buf, stdin)~.
~strcpy~ / ~strcat~ / ~sprintf~ — no size limit. Prefer ~snprintf~.
~strncpy~ — sounds safe, but does **not** add the ~'\0'~ if the source is too long.`),
  T('snprintf does it right', c`~snprintf(buf, size, ...)~ never writes more than ~size~ bytes (including the ~'\0'~), always terminates the string, and **returns the length the full text would have had** — so you can detect truncation.`, c`
char buf[8];
int needed = snprintf(buf, sizeof buf, "%s-%d", "player", 42);
if (needed >= (int)sizeof buf) {
    // truncated: buf holds "player-" safely, and needed is 9
}

line[strcspn(line, "\r\n")] = '\0';    // strip the newline that fgets keeps`),
  P(c`
char buf[8];
int n = snprintf(buf, sizeof buf, "%s-%d", "player", 42);
printf("%s %d", buf, n);`, 'player- 9', c`7 characters plus the terminator fit; ~n~ reports that the whole text needed 9.`),
  Q(c`~strncpy(dst, "elephant", 4)~ with a 4-byte ~dst~ — what is the problem?`, ['Nothing', 'dst ends up with no terminating \\0, so later string functions run off the end', 'It copies 8 bytes', 'It does not compile'], 1),
  X({ q: c`Write ~int join_words(char *dst, size_t size, const char *words[], int n)~ that joins the words with single spaces into ~dst~ **without ever overflowing it**. Return 1 if everything fitted, or 0 if the result had to be cut short (it must still be a valid, terminated string). Use ~snprintf~.

Expected:
~OK: cat dog~
~TRUNCATED: elephan~`, start: c`#include <stdio.h>
#include <string.h>

// write join_words here

int main() {
    char buf[8];
    const char *a[] = {"cat", "dog"};
    const char *b[] = {"elephant", "seal"};

    int ok = join_words(buf, sizeof buf, a, 2);
    printf("%s: %s\n", ok ? "OK" : "TRUNCATED", buf);
    ok = join_words(buf, sizeof buf, b, 2);
    printf("%s: %s\n", ok ? "OK" : "TRUNCATED", buf);
    return 0;
}
`, tests: [{ out: 'OK: cat dog\nTRUNCATED: elephan' }], must: [[c`snprintf`, c`Build the string with ~snprintf~.`]], not: [[c`strcpy|strcat|sprintf\s*\(`, c`No unbounded ~strcpy~, ~strcat~ or ~sprintf~.`]], hint: c`Keep a ~used~ count. Each time: ~int w = snprintf(dst + used, size - used, "%s%s", i ? " " : "", words[i]);~ and if ~used + w >= size~ the text was cut short.`, sol: c`#include <stdio.h>
#include <string.h>

int join_words(char *dst, size_t size, const char *words[], int n) {
    size_t used = 0;
    dst[0] = '\0';
    for (int i = 0; i < n; i++) {
        int w = snprintf(dst + used, size - used, "%s%s", i ? " " : "", words[i]);
        if (w < 0 || used + (size_t)w >= size) return 0;
        used += (size_t)w;
    }
    return 1;
}

int main() {
    char buf[8];
    const char *a[] = {"cat", "dog"};
    const char *b[] = {"elephant", "seal"};

    int ok = join_words(buf, sizeof buf, a, 2);
    printf("%s: %s\n", ok ? "OK" : "TRUNCATED", buf);
    ok = join_words(buf, sizeof buf, b, 2);
    printf("%s: %s\n", ok ? "OK" : "TRUNCATED", buf);
    return 0;
}
` }),
] },

{ id: 'cleanup', title: 'assert & cleanup', icon: '🧹', desc: 'Catch bugs early, and never leak on the way out.',
  steps: [
  T('assert for "impossible" things', c`~assert(condition)~ (from ~<assert.h>~) crashes immediately with the file and line if the condition is false. Use it to catch **bugs** — a NULL that can never happen, an index that must be in range — not to handle bad user input. Compiling with ~-DNDEBUG~ removes every assert from a release build.`, c`
void set_cell(Grid *g, int row, int col, int v) {
    assert(g != NULL);
    assert(row >= 0 && row < g->rows);
    g->cells[row * g->cols + col] = v;
}`, c`Tools that find memory bugs for you: compile with ~-fsanitize=address~ (AddressSanitizer), or run under **Valgrind** on Linux. Professional C projects run their tests under both.`),
  T('The goto cleanup pattern', c`When a function grabs several resources (memory, files, locks) and something fails half-way, everything grabbed so far must be released. Copy-pasting ~free~ calls before every ~return~ goes wrong quickly. The standard C answer — used all over the Linux kernel — is **one** exit path at the bottom, reached with ~goto~.`, c`
int process(void) {
    int ok = 0;
    char *a = NULL, *b = NULL;
    FILE *f = NULL;

    a = malloc(100);           if (!a) goto done;
    b = malloc(100);           if (!b) goto done;
    f = fopen("out.txt", "w"); if (!f) goto done;
    // ... the real work ...
    ok = 1;

done:                          // released in reverse order, whatever happened
    if (f) fclose(f);
    free(b);                   // free(NULL) is allowed and does nothing
    free(a);
    return ok;
}`),
  Q(c`A user types a negative age. Should the program ~assert(age >= 0)~?`, ['Yes, always', 'No: bad user input is expected and must be handled; assert is for programming mistakes', 'Only on Fridays', 'Only in release builds'], 1),
  P(c`
#include <stdio.h>
#include <stdlib.h>

int main() {
    char *p = NULL;
    free(p);
    printf("freeing NULL is fine");
    return 0;
}`, 'freeing NULL is fine'),
  X({ q: c`~process(fail_at)~ grabs two buffers and does some work, but it **leaks** when a step fails. Rewrite it with the **goto cleanup** pattern so that, whatever happens, everything grabbed is released in reverse order through ~release()~.

Expected:
~got a~ ~got b~ ~work done~ ~freed b~ ~freed a~ ~success~, then for the failed run ~got a~ ~freed b~ ~freed a~ ~cleaned up after failure~ (one per line). Step 2 fails **after** b was allocated, so b must be freed too.`, start: c`#include <stdio.h>
#include <stdlib.h>

void release(char *p, const char *name) {
    if (p) {
        printf("freed %s\n", name);
        free(p);
    }
}

int process(int fail_at) {
    char *a = malloc(16);
    if (!a || fail_at == 1) return 0;
    printf("got a\n");

    char *b = malloc(16);
    if (!b || fail_at == 2) return 0;
    printf("got b\n");

    printf("work done\n");
    release(b, "b");
    release(a, "a");
    return 1;
}

int main() {
    printf("%s\n", process(0) ? "success" : "cleaned up after failure");
    printf("%s\n", process(2) ? "success" : "cleaned up after failure");
    return 0;
}
`, tests: [{ out: 'got a\ngot b\nwork done\nfreed b\nfreed a\nsuccess\ngot a\nfreed b\nfreed a\ncleaned up after failure' }], must: [[c`goto\s+\w+`, c`Jump to one cleanup label with ~goto~.`]], hint: c`Declare ~char *a = NULL, *b = NULL; int ok = 0;~ at the top, ~goto done;~ on any failure, set ~ok = 1;~ after the work, and put both ~release~ calls after the ~done:~ label.`, sol: c`#include <stdio.h>
#include <stdlib.h>

void release(char *p, const char *name) {
    if (p) {
        printf("freed %s\n", name);
        free(p);
    }
}

int process(int fail_at) {
    int ok = 0;
    char *a = NULL, *b = NULL;

    a = malloc(16);
    if (!a || fail_at == 1) goto done;
    printf("got a\n");

    b = malloc(16);
    if (!b || fail_at == 2) goto done;
    printf("got b\n");

    printf("work done\n");
    ok = 1;

done:
    release(b, "b");
    release(a, "a");
    return ok;
}

int main() {
    printf("%s\n", process(0) ? "success" : "cleaned up after failure");
    printf("%s\n", process(2) ? "success" : "cleaned up after failure");
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`~malloc~ returns ~NULL~. What should the program do?`, ['Carry on: it is probably fine', 'Handle the failure: report it and stop or clean up, because using NULL will crash', 'Call malloc again forever', 'Ignore it on Windows'], 1),
  P(c`
char buf[4];
int n = snprintf(buf, sizeof buf, "%d", 12345);
printf("%s %d", buf, n);`, '123 5'),
  Q(c`Which function should you use to read a line of text safely?`, [c`~gets~`, c`~fgets~`, c`~scanf("%s")~ with no width`, c`~strcpy~`], 1),
  F('Strip the newline that fgets keeps.', c`
char line[] = "hello\n";
size_t end = [[strcspn]](line, "\n");
line[end] = '\0';
printf("[%s]", line);`),
] });

/* ============ ADVANCED 6: DATA STRUCTURES I ============ */
topic({ id: 'adv-ds1', advanced: true, title: 'Data Structures I', icon: '🔗', color: '#2b70c9', blurb: 'Build a growable array, a linked list and a queue from scratch.',
lessons: [
{ id: 'vector', title: 'A growable array', icon: '📈', desc: 'realloc and doubling: how every list type works inside.',
  steps: [
  T('Arrays that grow', c`Python lists, Java ~ArrayList~s and C++ ~vector~s are all the same idea underneath: an array on the heap plus a **size** (how many are used) and a **capacity** (how many fit). When it is full, ~realloc~ it to **double** the capacity. Doubling means copying rarely, so adding is ~O(1)~ on average.`, c`
typedef struct {
    int *data;
    int size, capacity;
} Vec;

void vec_push(Vec *v, int value) {
    if (v->size == v->capacity) {
        int cap = v->capacity ? v->capacity * 2 : 4;
        int *bigger = realloc(v->data, cap * sizeof *bigger);
        if (!bigger) { /* handle it */ }
        v->data = bigger;
        v->capacity = cap;
    }
    v->data[v->size++] = value;
}`, c`Assign ~realloc~'s result to a **temporary** first: if it fails it returns ~NULL~ but the old block is still yours, and ~v->data = realloc(v->data, ...)~ would lose (leak) it.`),
  P(c`
#include <stdio.h>
#include <stdlib.h>

int main() {
    int cap = 1, size = 0;
    int *data = malloc(cap * sizeof *data);
    for (int i = 0; i < 9; i++) {
        if (size == cap) {
            cap *= 2;
            data = realloc(data, cap * sizeof *data);
            printf("%d ", cap);
        }
        data[size++] = i;
    }
    free(data);
    return 0;
}`, '2 4 8 16', c`9 pushes caused only 4 reallocations. A million pushes need just 20.`),
  Q(c`Why double the capacity instead of adding one slot each time?`, ['It uses less memory', 'Copying happens rarely, so each push is O(1) on average instead of O(n)', 'realloc requires it', 'It is not better'], 1),
  X({ q: c`Finish the ~Vec~ functions (~vec_push~, ~vec_free~). ~main~ reads numbers until the input ends, then prints how many there were, their sum, and the numbers in reverse.

~4 8 15 16 23 42~ → ~count 6~ ~sum 108~ ~42 23 16 15 8 4~`, start: c`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size, capacity;
} Vec;

void vec_push(Vec *v, int value) {
    // grow (double) when full, then store the value
}

void vec_free(Vec *v) {
    // free the data and reset the fields
}

int main() {
    Vec v = {NULL, 0, 0};
    int x;
    while (scanf("%d", &x) == 1) vec_push(&v, x);

    long long sum = 0;
    for (int i = 0; i < v.size; i++) sum += v.data[i];
    printf("count %d\nsum %lld\n", v.size, sum);
    for (int i = v.size - 1; i >= 0; i--) printf("%d ", v.data[i]);
    printf("\n");
    vec_free(&v);
    return 0;
}
`, tests: [{ in: '4 8 15 16 23 42', out: 'count 6\nsum 108\n42 23 16 15 8 4' }, { in: '7', out: 'count 1\nsum 7\n7' }], must: [[c`realloc`, c`Grow the array with ~realloc~.`], [c`free\s*\(`, c`Free it in ~vec_free~.`]], sol: c`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int size, capacity;
} Vec;

void vec_push(Vec *v, int value) {
    if (v->size == v->capacity) {
        int cap = v->capacity ? v->capacity * 2 : 4;
        int *bigger = realloc(v->data, cap * sizeof *bigger);
        if (!bigger) {
            fprintf(stderr, "out of memory\n");
            exit(1);
        }
        v->data = bigger;
        v->capacity = cap;
    }
    v->data[v->size++] = value;
}

void vec_free(Vec *v) {
    free(v->data);
    v->data = NULL;
    v->size = v->capacity = 0;
}

int main() {
    Vec v = {NULL, 0, 0};
    int x;
    while (scanf("%d", &x) == 1) vec_push(&v, x);

    long long sum = 0;
    for (int i = 0; i < v.size; i++) sum += v.data[i];
    printf("count %d\nsum %lld\n", v.size, sum);
    for (int i = v.size - 1; i >= 0; i--) printf("%d ", v.data[i]);
    printf("\n");
    vec_free(&v);
    return 0;
}
` }),
] },

{ id: 'linkedlist', title: 'Linked lists', icon: '⛓️', desc: 'Nodes, pointers to pointers, and the famous reverse.',
  steps: [
  T('Nodes linked by pointers', c`A **linked list** is a chain of separate heap blocks. Each node holds a value and a pointer to the next; the last points to ~NULL~. Inserting or removing in the middle is just re-pointing — no shifting — but finding item 500 means walking 500 nodes.`, c`
typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *push_front(Node *head, int value) {
    Node *n = malloc(sizeof *n);
    n->value = value;
    n->next = head;
    return n;                         // the new node is the new head
}

for (Node *p = head; p; p = p->next) printf("%d ", p->value);`),
  T('Pointer to a pointer', c`Removing a node means changing whichever pointer points at it: the ~head~, or the previous node's ~next~. Walking a **pointer to that pointer** handles both cases with no special code for the head — a trick Linus Torvalds calls "good taste".`, c`
void remove_value(Node **link, int value) {
    while (*link && (*link)->value != value)
        link = &(*link)->next;        // move to the next "next" field
    if (*link) {
        Node *dead = *link;
        *link = dead->next;           // unhook it
        free(dead);
    }
}

remove_value(&head, 7);`),
  P(c`
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int value; struct Node *next; } Node;

Node *push_front(Node *head, int value) {
    Node *n = malloc(sizeof *n);
    n->value = value;
    n->next = head;
    return n;
}

int main() {
    Node *head = NULL;
    for (int i = 1; i <= 3; i++) head = push_front(head, i);
    for (Node *p = head; p; p = p->next) printf("%d ", p->value);
    return 0;
}`, '3 2 1'),
  Q(c`Compared with an array, what is a linked list **bad** at?`, ['Inserting at the front', 'Jumping straight to the 500th item', 'Growing', 'Removing a node you already have a pointer to'], 1),
  X({ q: c`**Sorted list.** Commands, one per line: ~add N~ inserts N keeping the list in ascending order, ~del N~ removes the first N (if there is one), ~print~ prints the list as ~1 -> 5 -> 7~ or ~(empty)~. Free every node at the end.`, start: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

int main() {
    Node *head = NULL;
    char cmd[8];
    int n;
    while (scanf("%7s", cmd) == 1) {
        if (strcmp(cmd, "print") != 0) scanf("%d", &n);
        printf("%s\n", cmd);
    }
    return 0;
}
`, tests: [{ in: 'print\nadd 5\nadd 1\nadd 7\nadd 3\nprint\ndel 3\ndel 9\nprint\ndel 1\ndel 5\ndel 7\nprint', out: '(empty)\n1 -> 3 -> 5 -> 7\n1 -> 5 -> 7\n(empty)' }], must: [[c`malloc`, c`Allocate nodes with ~malloc~.`], [c`free\s*\(`, c`Free removed nodes (and the rest at the end).`]], hint: c`Both insert and delete are easiest with a ~Node **link = &head;~ walk: stop where the new value belongs, or where the value is found.`, sol: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

void insert_sorted(Node **link, int value) {
    while (*link && (*link)->value < value) link = &(*link)->next;
    Node *n = malloc(sizeof *n);
    n->value = value;
    n->next = *link;
    *link = n;
}

void remove_value(Node **link, int value) {
    while (*link && (*link)->value != value) link = &(*link)->next;
    if (*link) {
        Node *dead = *link;
        *link = dead->next;
        free(dead);
    }
}

void print(const Node *p) {
    if (!p) { printf("(empty)\n"); return; }
    for (; p; p = p->next) printf("%d%s", p->value, p->next ? " -> " : "\n");
}

int main() {
    Node *head = NULL;
    char cmd[8];
    int n;
    while (scanf("%7s", cmd) == 1) {
        if (strcmp(cmd, "print") == 0) { print(head); continue; }
        if (scanf("%d", &n) != 1) break;
        if (strcmp(cmd, "add") == 0) insert_sorted(&head, n);
        else if (strcmp(cmd, "del") == 0) remove_value(&head, n);
    }
    while (head) {
        Node *next = head->next;
        free(head);
        head = next;
    }
    return 0;
}
` }),
  X({ q: c`**Reverse a linked list in place** — the most famous linked-list interview question. Write ~Node *reverse(Node *head)~ that re-points the ~next~ fields (no new nodes, no arrays) and returns the new head.

Expected: ~1 2 3 4 5~ then ~5 4 3 2 1~`, start: c`#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

// write reverse here

void print(const Node *p) {
    for (; p; p = p->next) printf("%d ", p->value);
    printf("\n");
}

int main() {
    Node *head = NULL;
    for (int i = 5; i >= 1; i--) {
        Node *n = malloc(sizeof *n);
        n->value = i;
        n->next = head;
        head = n;
    }
    print(head);
    head = reverse(head);
    print(head);
    while (head) { Node *next = head->next; free(head); head = next; }
    return 0;
}
`, tests: [{ out: '1 2 3 4 5\n5 4 3 2 1' }], must: [[c`Node\s*\*\s*reverse\s*\(`, c`Write ~Node *reverse(Node *head)~.`]], not: [[c`Node\s*\*\s*reverse\s*\([^)]*\)\s*\{[^}]*(malloc|calloc|\w+\s*\[)`, c`Re-point the existing nodes: no new nodes or arrays inside ~reverse~.`]], hint: c`Three pointers: ~prev = NULL~, ~cur = head~. Each step: save ~next = cur->next~, point ~cur->next = prev~, then move ~prev = cur; cur = next;~. Return ~prev~.`, sol: c`#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *reverse(Node *head) {
    Node *prev = NULL, *cur = head;
    while (cur) {
        Node *next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}

void print(const Node *p) {
    for (; p; p = p->next) printf("%d ", p->value);
    printf("\n");
}

int main() {
    Node *head = NULL;
    for (int i = 5; i >= 1; i--) {
        Node *n = malloc(sizeof *n);
        n->value = i;
        n->next = head;
        head = n;
    }
    print(head);
    head = reverse(head);
    print(head);
    while (head) { Node *next = head->next; free(head); head = next; }
    return 0;
}
` }),
] },

{ id: 'queue', title: 'Queues', icon: '🎟️', desc: 'First in, first out, with a head and a tail pointer.',
  steps: [
  T('A queue with two pointers', c`A **queue** hands things out in the order they arrived: print jobs, network packets, customers. With a linked list, keep a pointer to the **head** (take from here) and the **tail** (add here), so both are ~O(1)~ — no walking.`, c`
typedef struct {
    Node *head, *tail;
    int count;
} Queue;

void enqueue(Queue *q, Node *n) {
    n->next = NULL;
    if (q->tail) q->tail->next = n; else q->head = n;   // empty queue: n is also the head
    q->tail = n;
    q->count++;
}`, c`The stack you built in the Final Boss takes from the **same** end it adds to; a queue takes from the **other** end.`),
  Q(c`Why keep a ~tail~ pointer?`, ['To save memory', 'So adding at the back is O(1) instead of walking the whole list', 'Queues need two heads', 'It is required by malloc'], 1),
  X({ q: c`**Printer queue.** Commands until the input ends: ~add NAME~ queues a document, ~print~ prints the oldest as ~printing NAME~ (or ~queue empty~), ~count~ prints how many are waiting. Use a linked list with head **and** tail pointers, and free everything at the end.`, start: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Job {
    char name[32];
    struct Job *next;
} Job;

typedef struct {
    Job *head, *tail;
    int count;
} Queue;

int main() {
    Queue q = {NULL, NULL, 0};
    char cmd[8], name[32];
    while (scanf("%7s", cmd) == 1) {
        if (strcmp(cmd, "add") == 0) scanf("%31s", name);
        printf("%s\n", cmd);
    }
    return 0;
}
`, tests: [{ in: 'add report\nadd photo\ncount\nprint\nadd essay\nprint\nprint\nprint\ncount', out: '2\nprinting report\nprinting photo\nprinting essay\nqueue empty\n0' }], must: [[c`tail`, c`Add at the ~tail~.`], [c`free\s*\(`, c`Free jobs once printed.`]], sol: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Job {
    char name[32];
    struct Job *next;
} Job;

typedef struct {
    Job *head, *tail;
    int count;
} Queue;

void enqueue(Queue *q, const char *name) {
    Job *j = malloc(sizeof *j);
    snprintf(j->name, sizeof j->name, "%s", name);
    j->next = NULL;
    if (q->tail) q->tail->next = j; else q->head = j;
    q->tail = j;
    q->count++;
}

void print_next(Queue *q) {
    if (!q->head) { printf("queue empty\n"); return; }
    Job *j = q->head;
    printf("printing %s\n", j->name);
    q->head = j->next;
    if (!q->head) q->tail = NULL;
    q->count--;
    free(j);
}

int main() {
    Queue q = {NULL, NULL, 0};
    char cmd[8], name[32];
    while (scanf("%7s", cmd) == 1) {
        if (strcmp(cmd, "add") == 0) {
            if (scanf("%31s", name) == 1) enqueue(&q, name);
        } else if (strcmp(cmd, "print") == 0) {
            print_next(&q);
        } else if (strcmp(cmd, "count") == 0) {
            printf("%d\n", q.count);
        }
    }
    while (q.head) print_next(&q);
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`Why assign ~realloc~'s result to a temporary first?`, ['It is faster', 'If realloc fails it returns NULL but the old block is still allocated; overwriting your only pointer would leak it', 'realloc cannot return to the same variable', 'Style only'], 1),
  P(c`
#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int v; struct Node *next; } Node;

int main() {
    Node c = {3, NULL}, b = {2, &c}, a = {1, &b};
    int sum = 0;
    for (Node *p = &a; p; p = p->next) sum += p->v;
    printf("%d", sum);
    return 0;
}`, '6'),
  Q('Which structure gives items back in the order they arrived?', ['A stack', 'A queue', 'A binary search tree', 'A hash table'], 1),
  F('Move to the next node.', c`
typedef struct Node { int v; struct Node *next; } Node;

int count(Node *p) {
    int n = 0;
    for (; p; p = p->[[next]]) n++;
    return n;
}`),
] });

/* ============ ADVANCED 7: DATA STRUCTURES II ============ */
topic({ id: 'adv-ds2', advanced: true, title: 'Data Structures II', icon: '🌳', color: '#ffc800', blurb: 'Hash tables, binary search trees and heaps — built by hand.',
lessons: [
{ id: 'hashtable', title: 'Hash tables', icon: '#️⃣', desc: 'The data structure behind every dictionary and cache.',
  steps: [
  T('Instant lookups', c`A **hash table** is behind Python's ~dict~, Java's ~HashMap~ and most caches and databases. A **hash function** turns the key into a number; that number, modulo the table size, picks a **bucket**. Lookups go straight to one bucket instead of searching everything.`, c`
unsigned hash(const char *s) {          // djb2, a classic simple string hash
    unsigned h = 5381;
    while (*s) h = h * 33 + (unsigned char)*s++;
    return h;
}

int bucket = hash("apple") % NBUCKETS;`),
  T('Collisions and chaining', c`Different keys can land in the same bucket: a **collision**. The simplest fix is **chaining**: each bucket is a small linked list. Keep the buckets short (grow the table when it gets too full — its **load factor**) and lookups stay ~O(1)~ on average.`, c`
typedef struct Entry {
    char key[32];
    int count;
    struct Entry *next;       // the next entry in the same bucket
} Entry;

Entry *table[NBUCKETS];       // all NULL at the start

Entry *find(const char *key) {
    for (Entry *e = table[hash(key) % NBUCKETS]; e; e = e->next)
        if (strcmp(e->key, key) == 0) return e;
    return NULL;
}`),
  P(c`
#include <stdio.h>

unsigned hash(const char *s) {
    unsigned h = 5381;
    while (*s) h = h * 33 + (unsigned char)*s++;
    return h;
}

int main() {
    printf("%u %u", hash("a") % 8, hash("b") % 8);
    return 0;
}`, '6 7', c`5381 × 33 + 97 = 177670, and 177670 % 8 = 6. "b" is one more.`),
  Q(c`Two different keys land in the same bucket. What is that called, and how does chaining cope?`, ['A crash; it cannot', 'A collision; the bucket holds a linked list of all its entries', 'An overflow; the table doubles', 'A duplicate; the second key is ignored'], 1),
  X({ q: c`**Word counter with your own hash table** (16 buckets, chaining, djb2). Read words until the input ends. A word starting with ~?~ is a **query**: print ~word: N~ with how many times that word has been seen so far (0 if never). Every other word is counted. Free everything at the end.`, start: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define NBUCKETS 16

typedef struct Entry {
    char key[32];
    int count;
    struct Entry *next;
} Entry;

Entry *table[NBUCKETS];

unsigned hash(const char *s) {
    unsigned h = 5381;
    while (*s) h = h * 33 + (unsigned char)*s++;
    return h;
}

int main() {
    char word[32];
    while (scanf("%31s", word) == 1) {
        printf("%s\n", word);
    }
    return 0;
}
`, tests: [{ in: 'the cat sat on the mat the end\n?the ?cat ?dog ?end', out: 'the: 3\ncat: 1\ndog: 0\nend: 1' }], must: [[c`table\s*\[\s*hash`, c`Pick the bucket with ~table[hash(word) % NBUCKETS]~.`], [c`->next`, c`Chain entries with ~next~.`]], sol: c`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define NBUCKETS 16

typedef struct Entry {
    char key[32];
    int count;
    struct Entry *next;
} Entry;

Entry *table[NBUCKETS];

unsigned hash(const char *s) {
    unsigned h = 5381;
    while (*s) h = h * 33 + (unsigned char)*s++;
    return h;
}

Entry *find(const char *key) {
    for (Entry *e = table[hash(key) % NBUCKETS]; e; e = e->next)
        if (strcmp(e->key, key) == 0) return e;
    return NULL;
}

void add(const char *key) {
    Entry *e = find(key);
    if (e) { e->count++; return; }
    unsigned b = hash(key) % NBUCKETS;
    e = malloc(sizeof *e);
    snprintf(e->key, sizeof e->key, "%s", key);
    e->count = 1;
    e->next = table[b];
    table[b] = e;
}

int main() {
    char word[32];
    while (scanf("%31s", word) == 1) {
        if (word[0] == '?') {
            Entry *e = find(word + 1);
            printf("%s: %d\n", word + 1, e ? e->count : 0);
        } else {
            add(word);
        }
    }
    for (int b = 0; b < NBUCKETS; b++) {
        while (table[b]) {
            Entry *next = table[b]->next;
            free(table[b]);
            table[b] = next;
        }
    }
    return 0;
}
` }),
] },

{ id: 'bst', title: 'Binary search trees', icon: '🌲', desc: 'Sorted data you can search, insert into and walk in order.',
  steps: [
  T('Smaller left, bigger right', c`In a **binary search tree** every node has up to two children: everything in the **left** subtree is smaller, everything in the **right** is bigger. Searching discards half the tree at each step — ~O(log n)~ when the tree is balanced. Trees are **recursive** by nature, so the code is short.`, c`
typedef struct Tree {
    int key;
    struct Tree *left, *right;
} Tree;

Tree *insert(Tree *t, int key) {
    if (!t) {                                   // empty spot: the new node goes here
        t = calloc(1, sizeof *t);
        t->key = key;
    } else if (key < t->key) t->left = insert(t->left, key);
    else if (key > t->key)   t->right = insert(t->right, key);
    return t;
}

void in_order(Tree *t) {                        // left, me, right = sorted order
    if (!t) return;
    in_order(t->left);
    printf("%d ", t->key);
    in_order(t->right);
}`, c`Insert already-sorted data and the tree degenerates into a linked list (~O(n)~). Real libraries use **self-balancing** trees (red-black, AVL) to prevent that.`),
  P(c`
#include <stdio.h>
#include <stdlib.h>

typedef struct Tree { int key; struct Tree *left, *right; } Tree;

Tree *insert(Tree *t, int key) {
    if (!t) { t = calloc(1, sizeof *t); t->key = key; }
    else if (key < t->key) t->left = insert(t->left, key);
    else t->right = insert(t->right, key);
    return t;
}

void in_order(Tree *t) {
    if (!t) return;
    in_order(t->left);
    printf("%d ", t->key);
    in_order(t->right);
}

int main() {
    Tree *root = NULL;
    int keys[] = {5, 3, 8, 1, 4};
    for (int i = 0; i < 5; i++) root = insert(root, keys[i]);
    in_order(root);
    return 0;
}`, '1 3 4 5 8', c`An in-order walk of a BST always comes out sorted.`),
  Q(c`You insert 1, 2, 3, 4, 5 in that order into a plain BST. What shape does it take?`, ['Perfectly balanced', 'A straight line down the right: effectively a linked list', 'A straight line down the left', 'It refuses sorted input'], 1),
  X({ q: c`Read whole numbers until the input ends and insert them into a BST (ignore duplicates). Then print the keys in order, the smallest, the largest, and the **height** (a single node has height 1). Free the tree at the end with a post-order walk.

~50 30 70 20 40 60 80 35~ →
~20 30 35 40 50 60 70 80~
~min 20~ ~max 80~ ~height 4~`, start: c`#include <stdio.h>
#include <stdlib.h>

typedef struct Tree {
    int key;
    struct Tree *left, *right;
} Tree;

int main() {
    Tree *root = NULL;
    int x;
    while (scanf("%d", &x) == 1) {
        printf("%d ", x);
    }
    printf("\n");
    return 0;
}
`, tests: [{ in: '50 30 70 20 40 60 80 35', out: '20 30 35 40 50 60 70 80\nmin 20\nmax 80\nheight 4' }, { in: '1 2 3 2', out: '1 2 3\nmin 1\nmax 3\nheight 3' }], must: [[c`->left`, c`Store smaller keys on the ~left~.`], [c`free\s*\(`, c`Free the tree at the end.`]], hint: c`~height(t) = t ? 1 + max(height(t->left), height(t->right)) : 0~. The minimum is the left-most node; the maximum the right-most.`, sol: c`#include <stdio.h>
#include <stdlib.h>

typedef struct Tree {
    int key;
    struct Tree *left, *right;
} Tree;

Tree *insert(Tree *t, int key) {
    if (!t) {
        t = calloc(1, sizeof *t);
        t->key = key;
    } else if (key < t->key) {
        t->left = insert(t->left, key);
    } else if (key > t->key) {
        t->right = insert(t->right, key);
    }
    return t;
}

void in_order(const Tree *t, int *first) {
    if (!t) return;
    in_order(t->left, first);
    printf(*first ? "%d" : " %d", t->key);
    *first = 0;
    in_order(t->right, first);
}

int height(const Tree *t) {
    if (!t) return 0;
    int l = height(t->left), r = height(t->right);
    return 1 + (l > r ? l : r);
}

void free_tree(Tree *t) {
    if (!t) return;
    free_tree(t->left);
    free_tree(t->right);
    free(t);
}

int main() {
    Tree *root = NULL;
    int x;
    while (scanf("%d", &x) == 1) root = insert(root, x);

    int first = 1;
    in_order(root, &first);
    printf("\n");
    const Tree *lo = root, *hi = root;
    while (lo->left) lo = lo->left;
    while (hi->right) hi = hi->right;
    printf("min %d\nmax %d\nheight %d\n", lo->key, hi->key, height(root));
    free_tree(root);
    return 0;
}
` }),
] },

{ id: 'heap', title: 'Binary heaps', icon: '⛰️', desc: 'A priority queue that lives in a plain array.',
  steps: [
  T('A tree hiding in an array', c`A **binary heap** keeps the **smallest** item at the top, ready to take in ~O(1)~, and adding or removing costs only ~O(log n)~. It is the engine of priority queues, schedulers and Dijkstra's shortest-path algorithm.

The neat part: it needs no pointers. Store the tree in an array, row by row, and the family links are just arithmetic:`, c`
parent of i:       (i - 1) / 2
children of i:     2*i + 1   and   2*i + 2

push: put it at the end, then "sift up": swap with the parent while it is smaller
pop:  take heap[0], move the last item to the top, then "sift down":
      swap with the smaller child while a child is smaller`, c`Pushing everything and popping everything gives you the items in sorted order: that is **heap sort**, ~O(n log n)~.`),
  P(c`
int i = 4;
printf("%d %d %d", (i - 1) / 2, 2 * i + 1, 2 * i + 2);`, '1 9 10'),
  Q(c`In a min-heap, where is the smallest item?`, ['At the end of the array', 'At index 0', 'In the middle', 'Anywhere'], 1),
  X({ q: c`Finish the min-heap's ~push~ (sift up) and ~pop~ (sift down). ~main~ pushes every number it reads, then pops them all — which prints them in sorted order (heap sort).

~5 3 9 1 7 3~ → ~1 3 3 5 7 9~`, start: c`#include <stdio.h>

#define MAX 100

int heap[MAX];
int size = 0;

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void push(int value) {
    heap[size++] = value;
    // sift up
}

int pop(void) {
    int top = heap[0];
    heap[0] = heap[--size];
    // sift down
    return top;
}

int main() {
    int x;
    while (size < MAX && scanf("%d", &x) == 1) push(x);
    while (size > 0) printf("%d ", pop());
    printf("\n");
    return 0;
}
`, tests: [{ in: '5 3 9 1 7 3', out: '1 3 3 5 7 9' }, { in: '42', out: '42' }, { in: '10 9 8 7 6 5 4 3 2 1', out: '1 2 3 4 5 6 7 8 9 10' }], must: [[c`\(\s*\w+\s*-\s*1\s*\)\s*/\s*2`, c`Find the parent with ~(i - 1) / 2~.`], [c`2\s*\*\s*\w+\s*\+\s*1`, c`Find the left child with ~2 * i + 1~.`]], not: [[c`qsort`, c`Let the heap do the sorting.`]], sol: c`#include <stdio.h>

#define MAX 100

int heap[MAX];
int size = 0;

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void push(int value) {
    int i = size++;
    heap[i] = value;
    while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

int pop(void) {
    int top = heap[0];
    heap[0] = heap[--size];
    int i = 0;
    for (;;) {
        int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
        if (l < size && heap[l] < heap[smallest]) smallest = l;
        if (r < size && heap[r] < heap[smallest]) smallest = r;
        if (smallest == i) break;
        swap(&heap[i], &heap[smallest]);
        i = smallest;
    }
    return top;
}

int main() {
    int x;
    while (size < MAX && scanf("%d", &x) == 1) push(x);
    while (size > 0) printf("%d ", pop());
    printf("\n");
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`What is the average lookup time of a well-sized hash table?`, ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], 2),
  Q(c`Which walk of a binary search tree visits the keys in sorted order?`, ['Pre-order', 'In-order', 'Post-order', 'Level-order'], 1),
  Q(c`Which walk should you use to **free** a tree?`, ['Pre-order: free the parent first', 'Post-order: free both children before their parent', 'In-order', 'Any order works'], 1, c`Free a parent first and you lose the pointers to its children.`),
  P(c`
int heap[] = {1, 3, 2, 7, 4};
int i = 1;
printf("%d %d %d", heap[(i - 1) / 2], heap[2 * i + 1], heap[2 * i + 2]);`, '1 7 4'),
] });

/* ============ ADVANCED 8: SYSTEMS PROJECTS ============ */
topic({ id: 'adv-projects', advanced: true, title: 'Systems Projects', icon: '💼', color: '#c0c7ff', blurb: 'Three bigger programs of the kind C is really used for.',
lessons: [
{ id: 'pro', title: 'Pro capstones', icon: '🏆', desc: 'A tiny virtual machine, an expression evaluator and a bit-packed file format.',
  steps: [
  T('What C is really used for', c`Interpreters, compilers, operating systems, databases and file formats are all written in C. These three capstones are small versions of exactly that. Plan the data first, write one function at a time, and keep **every** allocation paired with a ~free~.`),
  X({ q: c`**A tiny stack machine** — the kind of virtual machine inside Python, Java and Lua. Read one instruction per line and run it on a stack of ints:

~push N~ · ~add~ ~sub~ ~mul~ ~div~ (pop two, push the result: ~sub~ and ~div~ do *second-from-top* op *top*) · ~dup~ (copy the top) · ~print~ (print the top)

Errors stop the machine: ~error: stack underflow at line N~ and ~error: division by zero at line N~ (lines count from 1).`, start: c`#include <stdio.h>
#include <string.h>

#define STACK_MAX 64

int main() {
    int stack[STACK_MAX], top = 0;
    char op[16];
    int line = 0;
    while (scanf("%15s", op) == 1) {
        line++;
        printf("%d %s\n", line, op);
    }
    return 0;
}
`, tests: [{ in: 'push 2\npush 3\nadd\ndup\nmul\nprint\npush 4\nsub\nprint', out: '25\n21' }, { in: 'push 7\npush 2\ndiv\nprint\npush 0\ndiv\nprint', out: '3\nerror: division by zero at line 6' }, { in: 'push 1\nadd\nprint', out: 'error: stack underflow at line 2' }], must: [[c`strcmp`, c`Decode each instruction with ~strcmp~ (or a dispatch table).`]], sol: c`#include <stdio.h>
#include <string.h>

#define STACK_MAX 64

int main() {
    int stack[STACK_MAX], top = 0;
    char op[16];
    int line = 0;
    while (scanf("%15s", op) == 1) {
        line++;
        if (strcmp(op, "push") == 0) {
            int n;
            if (scanf("%d", &n) != 1 || top == STACK_MAX) {
                printf("error: bad push at line %d\n", line);
                return 0;   /* the machine halts */
            }
            stack[top++] = n;
        } else if (strcmp(op, "dup") == 0 || strcmp(op, "print") == 0) {
            if (top < 1) {
                printf("error: stack underflow at line %d\n", line);
                return 0;   /* the machine halts */
            }
            if (op[0] == 'p') printf("%d\n", stack[top - 1]);
            else if (top < STACK_MAX) { stack[top] = stack[top - 1]; top++; }
        } else {
            if (top < 2) {
                printf("error: stack underflow at line %d\n", line);
                return 0;   /* the machine halts */
            }
            int b = stack[--top], a = stack[--top], r;
            if (strcmp(op, "add") == 0) r = a + b;
            else if (strcmp(op, "sub") == 0) r = a - b;
            else if (strcmp(op, "mul") == 0) r = a * b;
            else {
                if (b == 0) {
                    printf("error: division by zero at line %d\n", line);
                    return 0;   /* the machine halts */
                }
                r = a / b;
            }
            stack[top++] = r;
        }
    }
    return 0;
}
` }),
  X({ q: c`**Expression evaluator.** Read expressions, one per line, with whole numbers, ~+ - * /~, brackets and spaces, and print each answer. Use **recursive descent** — one function per precedence level:

~expr~ = ~term~ { (~+~ | ~-~) ~term~ } · ~term~ = ~factor~ { (~*~ | ~/~) ~factor~ } · ~factor~ = number | ~(~ ~expr~ ~)~

Print ~error: division by zero~ or ~error: syntax~ for bad input.`, start: c`#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char line[200];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\r\n")] = '\0';
        if (line[0] == '\0') continue;
        printf("%s\n", line);
    }
    return 0;
}
`, tests: [{ in: '2+3*4\n(2 + 3) * 4\n100 / 7 - 1\n10/(5-5)\n2*(3\n-4\n', out: '14\n20\n13\nerror: division by zero\nerror: syntax\nerror: syntax' }], must: [[c`\bexpr\s*\(`, c`Write an ~expr()~ function.`], [c`\bterm\s*\(`, c`Write a ~term()~ function.`], [c`\bfactor\s*\(`, c`Write a ~factor()~ function.`]], hint: c`Keep a global ~const char *p~ pointing at the next character and an ~int error~ flag. ~factor~ skips spaces, then reads digits or a bracketed ~expr~. After parsing the whole line, anything left over (other than spaces) is a syntax error.`, sol: c`#include <stdio.h>
#include <string.h>
#include <ctype.h>

static const char *p;
static int error;      /* 0 = fine, 1 = syntax, 2 = division by zero */

static long long expr(void);

static void skip(void) {
    while (*p == ' ') p++;
}

static long long factor(void) {
    skip();
    if (*p == '(') {
        p++;
        long long v = expr();
        skip();
        if (*p != ')') { if (!error) error = 1; return 0; }
        p++;
        return v;
    }
    if (!isdigit((unsigned char)*p)) { if (!error) error = 1; return 0; }
    long long v = 0;
    while (isdigit((unsigned char)*p)) v = v * 10 + (*p++ - '0');
    return v;
}

static long long term(void) {
    long long v = factor();
    for (;;) {
        skip();
        char op = *p;
        if (op != '*' && op != '/') return v;
        p++;
        long long r = factor();
        if (op == '*') v *= r;
        else if (r == 0) { if (!error) error = 2; return 0; }
        else v /= r;
    }
}

static long long expr(void) {
    long long v = term();
    for (;;) {
        skip();
        char op = *p;
        if (op != '+' && op != '-') return v;
        p++;
        long long r = term();
        v = op == '+' ? v + r : v - r;
    }
}

int main() {
    char line[200];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\r\n")] = '\0';
        if (line[0] == '\0') continue;
        p = line;
        error = 0;
        long long v = expr();
        skip();
        if (!error && *p != '\0') error = 1;
        if (error == 2) printf("error: division by zero\n");
        else if (error) printf("error: syntax\n");
        else printf("%lld\n", v);
    }
    return 0;
}
` }),
  X({ q: c`**Bit-packed dates.** File formats squeeze data into as few bits as possible. Pack a date into **16 bits**: day in bits 0–4 (1–31), month in bits 5–8 (1–12), and year − 2000 in bits 9–15 (2000–2127). For each line ~dd/mm/yyyy~, print the packed value as 4 hex digits and the date unpacked again, or ~invalid date~ if a part is out of range.

~21/11/2026~ → ~0x3575 -> 21/11/2026~`, start: c`#include <stdio.h>
#include <stdint.h>

int main() {
    int d, m, y;
    while (scanf("%d/%d/%d", &d, &m, &y) == 3) {
        printf("%d %d %d\n", d, m, y);
    }
    return 0;
}
`, tests: [{ in: '21/11/2026\n01/01/2000\n31/12/2127\n32/01/2020\n15/06/1999', out: '0x3575 -> 21/11/2026\n0x0021 -> 01/01/2000\n0xFF9F -> 31/12/2127\ninvalid date\ninvalid date' }], must: [[c`uint16_t`, c`Store the packed date in a ~uint16_t~.`], [c`<<`, c`Pack with ~<<~ and ~|~.`], [c`>>`, c`Unpack with ~>>~ and a mask.`]], hint: c`Pack: ~(uint16_t)(((y - 2000) << 9) | (m << 5) | d)~. Unpack: ~d = p & 0x1F~, ~m = (p >> 5) & 0xF~, ~y = (p >> 9) + 2000~. Print with ~"0x%04X"~.`, sol: c`#include <stdio.h>
#include <stdint.h>

uint16_t pack(int d, int m, int y) {
    return (uint16_t)(((y - 2000) << 9) | (m << 5) | d);
}

int main() {
    int d, m, y;
    while (scanf("%d/%d/%d", &d, &m, &y) == 3) {
        if (d < 1 || d > 31 || m < 1 || m > 12 || y < 2000 || y > 2127) {
            printf("invalid date\n");
            continue;
        }
        uint16_t p = pack(d, m, y);
        int dd = p & 0x1F, mm = (p >> 5) & 0xF, yy = (p >> 9) + 2000;
        printf("0x%04X -> %02d/%02d/%d\n", (unsigned)p, dd, mm, yy);
    }
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`In the stack machine, why does ~sub~ compute second-from-top minus top?`, ['It is random', 'For "push 5, push 2, sub", the first number pushed is the left-hand side, so 5 - 2 = 3', 'Stacks reverse everything', 'To make division work'], 1),
  Q(c`In recursive descent, why is ~term~ (for * and /) called **from inside** ~expr~ (for + and -)?`, ['It is faster', 'Deeper levels bind tighter, so * and / are worked out before + and -', 'Alphabetical order', 'It does not matter'], 1),
  P(c`
unsigned p = (5u << 9) | (3u << 5) | 7u;
printf("%u %u %u", p & 0x1F, (p >> 5) & 0xF, p >> 9);`, '7 3 5'),
] });
