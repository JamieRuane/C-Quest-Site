/* ============ TOPIC 6: ARRAYS & STRINGS ============ */
topic({ id: 'arrays', title: 'Arrays & Strings', icon: '🗃️', color: '#00cd9c', blurb: 'Many values, one name. And what text really is.',
lessons: [
{ id: 'arrays', title: 'Arrays', icon: '🗃️', desc: 'A row of boxes, numbered from zero, with no guard rails.',
  v: [['4:21:11', '4:32:17', 'Arrays']],
  steps: [
  T('One name, many boxes', c`An array is a row of same-typed boxes sitting side by side in memory. You pick one with an **index** in square brackets.`, c`
int scores[5] = {90, 72, 85, 60, 99};

printf("%d", scores[0]);   // 90  <- the FIRST element
scores[1] = 75;            // overwrite the second
printf("%d", scores[4]);   // 99  <- the LAST element`, c`The index means "how many steps from the start" — so the first element is zero steps away: ~[0]~.`),
  P(c`
int a[] = {4, 8, 15, 16};
printf("%d", a[1] + a[3]);`, '24', c`~a[1]~ is the **second** element (8), ~a[3]~ the fourth (16).`),
  Q(c`What is the last valid index of ~int a[10];~ ?`, ['10', '9', '11', '0'], 1, c`Ten elements: indexes 0 to 9.`),
  Q(c`So what happens if you read ~a[10]~ anyway?`, ['The compiler refuses', 'The program always crashes with a clear error', 'C just reads whatever is in memory next to the array', 'You get 0'], 2, c`**No bounds checking.** C trusts you completely. You'll get garbage, a crash, or — worst of all — something that seems to work. This is "undefined behaviour".`),
  T('Looping over an array', c`Arrays and ~for~ loops were made for each other. And this idiom calculates the element count so you never hard-code it:`, c`
int scores[] = {90, 72, 85, 60, 99};
int count = sizeof(scores) / sizeof(scores[0]);   // 20 bytes / 4 bytes = 5

for (int i = 0; i < count; i++) {
    printf("%d\n", scores[i]);
}`, c`~i < count~, never ~i <= count~ — that one extra step walks off the end.`),
  P(c`
int a[] = {1, 2, 3, 4, 5, 6};
int n = sizeof(a) / sizeof(a[0]);
printf("%d", n);`, '6'),
  F('Loop over all 5 prices.', c`
double prices[5] = {1.5, 2.0, 0.5, 3.0, 1.0};
double total = 0;
for (int i = [[0]]; i [[<]] 5; i++) {
    total += prices[i];
}`),
  X({ q: c`Loop over the scores and print:

~Total: 413~
~Average: 82.60~`, start: M(c`
    int scores[] = {72, 85, 90, 66, 100};
    int count = sizeof(scores) / sizeof(scores[0]);

`), tests: [{ out: 'Total: 413\nAverage: 82.60' }], must: [['for|while', 'Use a loop.']], hint: c`Add each ~scores[i]~ to a total. For the average, remember the integer-division trap: ~(double)total / count~.`, sol: M(c`
    int scores[] = {72, 85, 90, 66, 100};
    int count = sizeof(scores) / sizeof(scores[0]);

    int total = 0;
    for (int i = 0; i < count; i++) {
        total += scores[i];
    }
    printf("Total: %d\n", total);
    printf("Average: %.2f\n", (double)total / count);`) }),
  X({ q: c`This prints the five lottery numbers… and then a sixth mystery number from beyond the array. Fix the off-by-one.

Expected: 4, 8, 15, 16, 23 — one per line.`, start: M(c`
    int lotto[5] = {4, 8, 15, 16, 23};

    for (int i = 0; i <= 5; i++) {
        printf("%d\n", lotto[i]);
    }`), tests: [{ out: '4\n8\n15\n16\n23' }], hint: c`Valid indexes are 0 to 4.`, sol: M(c`
    int lotto[5] = {4, 8, 15, 16, 23};

    for (int i = 0; i < 5; i++) {
        printf("%d\n", lotto[i]);
    }`) }),
] },

{ id: 'arrinput', title: 'Arrays, input & functions', icon: '➡️', desc: 'Fill arrays from the keyboard and hand them to functions.',
  v: [['4:32:17', '4:37:56', 'Arrays and user input']],
  steps: [
  T('Filling an array', c`Each element is an ordinary variable, so ~scanf~ can fill them one by one:`, c`
int nums[5];

for (int i = 0; i < 5; i++) {
    scanf("%d", &nums[i]);    // & because nums[i] is a single int
}`),
  X({ q: c`Read 5 numbers, then print them in **reverse** order on one line:

input ~1 2 3 4 5~ → ~5 4 3 2 1~`, start: M(c`
    int nums[5];

`), tests: [{ in: '1 2 3 4 5', out: '5 4 3 2 1' }, { in: '9 0 -4 7 7', out: '7 7 -4 0 9' }], hint: c`One loop to read (0 up to 4), a second loop to print (4 down to 0).`, sol: M(c`
    int nums[5];

    for (int i = 0; i < 5; i++) {
        scanf("%d", &nums[i]);
    }
    for (int i = 4; i >= 0; i--) {
        printf("%d ", nums[i]);
    }
    printf("\n");`) }),
  X({ q: c`First read ~n~ (at most 100), then ~n~ numbers. Print the largest and smallest:

~Max: 9~
~Min: -2~`, start: M(c`
    int nums[100];
    int n;
    scanf("%d", &n);

`), tests: [{ in: '5 3 9 -2 7 4', out: 'Max: 9\nMin: -2' }, { in: '1 5', out: 'Max: 5\nMin: 5' }, { in: '3 -5 -1 -9', out: 'Max: -1\nMin: -9' }], hint: c`Start with ~max = nums[0]~ and ~min = nums[0]~ — **not** 0. (Why? Look at the third test.)`, sol: M(c`
    int nums[100];
    int n;
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    int max = nums[0], min = nums[0];
    for (int i = 1; i < n; i++) {
        if (nums[i] > max) max = nums[i];
        if (nums[i] < min) min = nums[i];
    }
    printf("Max: %d\n", max);
    printf("Min: %d\n", min);`) }),
  Q(c`Why start with ~max = nums[0]~ instead of ~max = 0~ ?`, ['It is faster', 'If every number is negative, 0 would wrongly win', 'Arrays cannot contain 0', 'No reason, both are fine'], 1, c`Seed "best so far" with a real element, never with a made-up value.`),
  T('Arrays as function arguments', c`You can pass an array to a function — but the function can't tell how long it is, so pass the **size** too.`, c`
void printAll(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
}`),
  P(c`
#include <stdio.h>

void wipe(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        arr[i] = 0;
    }
}

int main() {
    int a[] = {1, 2, 3};
    wipe(a, 3);
    printf("%d%d%d", a[0], a[1], a[2]);
    return 0;
}`, '000', c`Plot twist! Ints are copied into functions, but arrays are **not** — the function works on the caller's original. (Because what's actually passed is the array's *address*. Pointers are coming.)`),
  X({ q: c`Write ~sum~: it takes an int array and its size and returns the total.`, start: c`#include <stdio.h>

// int sum(int arr[], int size)


int main() {
    int a[] = {5, 10, 15};
    int b[] = {1, 1, 1, 1, 1, 1, 1};
    printf("%d\n", sum(a, 3));
    printf("%d\n", sum(b, 7));
    return 0;
}
`, tests: [{ out: '30\n7' }], hint: c`A total variable, a loop to ~size~, a ~return~.`, sol: c`#include <stdio.h>

int sum(int arr[], int size) {
    int total = 0;
    for (int i = 0; i < size; i++) {
        total += arr[i];
    }
    return total;
}

int main() {
    int a[] = {5, 10, 15};
    int b[] = {1, 1, 1, 1, 1, 1, 1};
    printf("%d\n", sum(a, 3));
    printf("%d\n", sum(b, 7));
    return 0;
}
` }),
] },

{ id: 'grid', title: '2D arrays', icon: '⬜', desc: 'Grids: game boards, pixels, spreadsheets.',
  v: [['4:37:56', '4:46:03', '2D arrays']],
  steps: [
  T('An array of arrays', c`Add a second pair of brackets and you get a grid: ~grid[row][col]~.`, c`
int grid[2][3] = {
    {1, 2, 3},     // row 0
    {4, 5, 6}      // row 1
};

printf("%d", grid[1][2]);   // row 1, column 2 -> 6`, c`To visit every cell, use a nested loop: outer = rows, inner = columns.`),
  P(c`
int g[2][3] = {{1, 2, 3}, {4, 5, 6}};
printf("%d", g[1][0] + g[0][2]);`, '7', c`Row 1, column 0 is 4. Row 0, column 2 is 3.`),
  Q(c`How many ints does ~int g[4][5];~ hold?`, ['9', '20', '45', '5'], 1),
  F('Visit every cell of a grid with 2 rows and 3 columns.', c`
int g[2][3] = {{1, 2, 3}, {4, 5, 6}};
for (int r = 0; r < [[2]]; r++) {
    for (int c = 0; c < [[3]]; c++) {
        printf("%d ", g[r][c]);
    }
}`),
  X({ q: c`Draw the tic-tac-toe board with ~|~ between the cells:

~X|O|X~
~ |X|O~
~O| |X~`, start: M(c`
    char board[3][3] = {
        {'X', 'O', 'X'},
        {' ', 'X', 'O'},
        {'O', ' ', 'X'}
    };

`), tests: [{ out: 'X|O|X\n |X|O\nO| |X' }], must: [['for', 'Use nested loops, not nine printfs.']], hint: c`Print ~board[r][c]~ with ~%c~. Only print a ~|~ when ~c < 2~. Newline after each row.`, sol: M(c`
    char board[3][3] = {
        {'X', 'O', 'X'},
        {' ', 'X', 'O'},
        {'O', ' ', 'X'}
    };

    for (int r = 0; r < 3; r++) {
        for (int col = 0; col < 3; col++) {
            printf("%c", board[r][col]);
            if (col < 2) printf("|");
        }
        printf("\n");
    }`) }),
  X({ q: c`Read a 3×3 grid of numbers (9 values, row by row) and print the sum of each row:

~Row 0: 6~
~Row 1: 15~
~Row 2: 24~`, start: M(c`
    int grid[3][3];

`), tests: [{ in: '1 2 3 4 5 6 7 8 9', out: 'Row 0: 6\nRow 1: 15\nRow 2: 24' }, { in: '0 0 0\n10 -10 5\n1 1 1', out: 'Row 0: 0\nRow 1: 5\nRow 2: 3' }], hint: c`Read with a nested loop: ~scanf("%d", &grid[r][c]);~. Then for each row, reset a sum to 0 and add up its three cells.`, sol: M(c`
    int grid[3][3];

    for (int r = 0; r < 3; r++) {
        for (int col = 0; col < 3; col++) {
            scanf("%d", &grid[r][col]);
        }
    }
    for (int r = 0; r < 3; r++) {
        int sum = 0;
        for (int col = 0; col < 3; col++) {
            sum += grid[r][col];
        }
        printf("Row %d: %d\n", r, sum);
    }`) }),
] },

{ id: 'strings', title: 'Strings are char arrays', icon: '🧵', desc: 'The invisible character at the end of every string.',
  steps: [
  T('What a string really is', c`C has no string type. A "string" is just a ~char~ array with a special marker at the end: the **null terminator** ~'\0'~.`, c`
char name[] = "Bro";

//   index:   0    1    2    3
//   value:  'B'  'r'  'o'  '\0'`, c`Every string function — ~printf("%s")~, ~strlen~, all of them — simply walks along the array until it bumps into ~'\0'~.`),
  Q(c`How many bytes does ~"Hello"~ need?`, ['5', '6', '4', '10'], 1, c`Five letters **plus** the terminator. Forgetting that +1 is a classic.`),
  P(c`
char s[] = "cat";
s[0] = 'b';
printf("%s", s);`, 'bat', c`It's an array — you can change individual characters.`),
  T('The string.h toolbox', c`You can't use ~=~ or ~==~ on whole strings. Use these instead:`, c`
#include <string.h>

strlen(s)          // length, not counting '\0'
strcpy(dest, src)  // copy src INTO dest      (instead of dest = src)
strcat(dest, src)  // glue src onto the end of dest
strcmp(a, b)       // compare: returns 0 when EQUAL`, c`~strcmp~ returning **0** for "equal" trips everyone up. Read ~strcmp(a, b) == 0~ as "the difference between a and b is zero".`),
  P(c`
int n = strlen("hello");
printf("%d", n);`, '5'),
  Q(c`Why doesn't ~if (password == "hunter2")~ work?`, ['It does work', c`~==~ compares the two memory **addresses**, not the letters`, 'Strings cannot be used in an if', c`You need ~===~`], 1, c`Two different arrays live at two different addresses, even if their contents match. Compare contents with ~strcmp~.`),
  F('Check the password properly.', c`
char pass[] = "hunter2";
if ([[strcmp]](pass, "hunter2") == [[0]]) {
    printf("Welcome");
}`),
  X({ q: c`Read a word and print its length, then the word backwards:

~Length: 5~
~Reversed: olleh~`, start: M(c`
    char word[50];
    scanf("%s", word);

`, 'string.h'), tests: [{ in: 'hello', out: 'Length: 5\nReversed: olleh' }, { in: 'C', out: 'Length: 1\nReversed: C' }, { in: 'stressed', out: 'Length: 8\nReversed: desserts' }], hint: c`~int len = strlen(word);~ then loop ~i~ from ~len - 1~ down to 0 printing ~word[i]~ with ~%c~.`, sol: M(c`
    char word[50];
    scanf("%s", word);

    int len = strlen(word);
    printf("Length: %d\n", len);
    printf("Reversed: ");
    for (int i = len - 1; i >= 0; i--) {
        printf("%c", word[i]);
    }
    printf("\n");`, 'string.h') }),
  X({ q: c`Read a whole line (it may contain spaces) and count its vowels — a, e, i, o, u, upper or lower case.

~Programming in C~ → ~Vowels: 4~`, start: M(c`
    char line[200];
    fgets(line, sizeof(line), stdin);

`), tests: [{ in: 'Programming in C', out: 'Vowels: 4' }, { in: 'AEIOU xyz', out: 'Vowels: 5' }, { in: 'rhythm', out: 'Vowels: 0' }], hint: c`Loop ~for (int i = 0; line[i] != '\0'; i++)~. ~tolower(line[i])~ from ~<ctype.h>~ halves the number of comparisons.`, sol: M(c`
    char line[200];
    fgets(line, sizeof(line), stdin);

    int vowels = 0;
    for (int i = 0; line[i] != '\0'; i++) {
        char ch = tolower(line[i]);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            vowels++;
        }
    }
    printf("Vowels: %d\n", vowels);`, 'ctype.h') }),
] },

{ id: 'strarr', title: 'Arrays of strings', icon: '📚', desc: 'Menus, name lists, word banks.',
  v: [['4:46:03', '4:58:44', 'Arrays of strings']],
  steps: [
  T('A list of words', c`A string is a char array, so a list of strings is a **2D** char array: one row per word.`, c`
char fruits[][10] = {"apple", "banana", "cherry"};

printf("%s", fruits[1]);      // banana  (a whole row = a string)
printf("%c", fruits[1][0]);   // b       (one character)`, c`The ~[10]~ is the maximum length of each word, terminator included. The first ~[]~ is left empty: the compiler counts the words.`),
  P(c`
char names[][10] = {"Ann", "Bob", "Cy"};
printf("%s %c", names[1], names[2][0]);`, 'Bob C'),
  Q(c`In ~char cities[][15]~, what does the 15 mean?`, ['There are 15 cities', 'Each city name can be up to 14 letters plus the terminator', 'The array uses 15 bytes in total', 'Names must be exactly 15 letters'], 1),
  X({ q: c`Print the menu as a numbered list (starting at 1):

~1. Pizza~
~2. Burger~
~3. Sushi~
~4. Tacos~`, start: M(c`
    char menu[][20] = {"Pizza", "Burger", "Sushi", "Tacos"};
    int count = sizeof(menu) / sizeof(menu[0]);

`), tests: [{ out: '1. Pizza\n2. Burger\n3. Sushi\n4. Tacos' }], must: [['for|while', 'Use a loop.']], hint: c`~printf("%d. %s\n", i + 1, menu[i]);~`, sol: M(c`
    char menu[][20] = {"Pizza", "Burger", "Sushi", "Tacos"};
    int count = sizeof(menu) / sizeof(menu[0]);

    for (int i = 0; i < count; i++) {
        printf("%d. %s\n", i + 1, menu[i]);
    }`) }),
  X({ q: c`Read a city name. If it's in the list, print ~Found at index 2~ (with the right index), otherwise ~Not found~.`, start: M(c`
    char cities[][15] = {"Dublin", "Paris", "Tokyo", "Lima", "Cairo"};
    char target[15];
    scanf("%s", target);

`, 'string.h'), tests: [{ in: 'Tokyo', out: 'Found at index 2' }, { in: 'Dublin', out: 'Found at index 0' }, { in: 'Oslo', out: 'Not found' }, { in: 'Cairo', out: 'Found at index 4' }], hint: c`Keep ~int found = -1;~. In the loop: ~if (strcmp(cities[i], target) == 0) { found = i; break; }~`, sol: M(c`
    char cities[][15] = {"Dublin", "Paris", "Tokyo", "Lima", "Cairo"};
    char target[15];
    scanf("%s", target);

    int found = -1;
    for (int i = 0; i < 5; i++) {
        if (strcmp(cities[i], target) == 0) {
            found = i;
            break;
        }
    }
    if (found >= 0) {
        printf("Found at index %d\n", found);
    } else {
        printf("Not found\n");
    }`, 'string.h') }),
  X({ q: c`Read three names into the array, then print the longest one:

~Al Barbara Chen~ → ~Longest: Barbara~`, start: M(c`
    char names[3][30];

`, 'string.h'), tests: [{ in: 'Al Barbara Chen', out: 'Longest: Barbara' }, { in: 'Maximilian Bo Li', out: 'Longest: Maximilian' }, { in: 'a bb ccc', out: 'Longest: ccc' }], hint: c`~scanf("%s", names[i]);~ to read. Track the **index** of the longest so far using ~strlen~.`, sol: M(c`
    char names[3][30];

    for (int i = 0; i < 3; i++) {
        scanf("%s", names[i]);
    }
    int best = 0;
    for (int i = 1; i < 3; i++) {
        if (strlen(names[i]) > strlen(names[best])) {
            best = i;
        }
    }
    printf("Longest: %s\n", names[best]);`, 'string.h') }),
] },

{ id: 'arrwork', title: 'Array workout', icon: '🏋️', desc: 'Reverse, sort, palindromes — the interview classics.',
  v: [['4:58:44', '5:13:50', 'Bonus: Bro builds a quiz game with arrays']],
  steps: [
  T('The classics', c`These three problems show up in programming courses and job interviews everywhere. They all use the same move: **two indexes walking through an array**.

Swapping two elements needs a temporary variable:`, c`
int temp = a[i];
a[i] = a[j];
a[j] = temp;`),
  X({ q: c`Write ~reverse~: it flips an array **in place** (no second array).`, start: c`#include <stdio.h>

void reverse(int arr[], int n) {
    // your code
}

int main() {
    int a[] = {1, 2, 3, 4, 5};
    int b[] = {7, 8};
    reverse(a, 5);
    reverse(b, 2);
    for (int i = 0; i < 5; i++) printf("%d ", a[i]);
    printf("\n");
    for (int i = 0; i < 2; i++) printf("%d ", b[i]);
    printf("\n");
    return 0;
}
`, tests: [{ out: '5 4 3 2 1\n8 7' }], hint: c`Swap ~arr[i]~ with ~arr[n - 1 - i]~, but only for the first **half** (~i < n / 2~). Go all the way and you reverse it twice!`, sol: c`#include <stdio.h>

void reverse(int arr[], int n) {
    for (int i = 0; i < n / 2; i++) {
        int temp = arr[i];
        arr[i] = arr[n - 1 - i];
        arr[n - 1 - i] = temp;
    }
}

int main() {
    int a[] = {1, 2, 3, 4, 5};
    int b[] = {7, 8};
    reverse(a, 5);
    reverse(b, 2);
    for (int i = 0; i < 5; i++) printf("%d ", a[i]);
    printf("\n");
    for (int i = 0; i < 2; i++) printf("%d ", b[i]);
    printf("\n");
    return 0;
}
` }),
  X({ q: c`Read a word. Print ~Palindrome~ if it reads the same backwards (racecar, level), otherwise ~Not a palindrome~.`, start: M(c`
    char word[50];
    scanf("%s", word);

`, 'string.h'), tests: [{ in: 'racecar', out: 'Palindrome' }, { in: 'hello', out: 'Not a palindrome' }, { in: 'abba', out: 'Palindrome' }, { in: 'abca', out: 'Not a palindrome' }, { in: 'x', out: 'Palindrome' }], hint: c`Compare ~word[i]~ with ~word[len - 1 - i]~ for the first half. One mismatch and it's not a palindrome.`, sol: M(c`
    char word[50];
    scanf("%s", word);

    int len = strlen(word);
    int ok = 1;
    for (int i = 0; i < len / 2; i++) {
        if (word[i] != word[len - 1 - i]) {
            ok = 0;
            break;
        }
    }
    printf("%s\n", ok ? "Palindrome" : "Not a palindrome");`, 'string.h') }),
  X({ q: c`**Sort it.** Read 6 numbers and print them from smallest to largest.

~5 2 9 1 5 6~ → ~1 2 5 5 6 9~

Bubble sort: walk through the array comparing neighbours; if the left one is bigger, swap them. Do that whole walk n − 1 times and everything is sorted.`, start: M(c`
    int a[6];
    for (int i = 0; i < 6; i++) {
        scanf("%d", &a[i]);
    }

`), tests: [{ in: '5 2 9 1 5 6', out: '1 2 5 5 6 9' }, { in: '6 5 4 3 2 1', out: '1 2 3 4 5 6' }, { in: '-1 0 -3 8 2 2', out: '-3 -1 0 2 2 8' }], hint: c`Outer loop: ~pass~ from 0 to 4. Inner loop: ~j~ from 0 to 4. ~if (a[j] > a[j + 1])~ swap them.`, sol: M(c`
    int a[6];
    for (int i = 0; i < 6; i++) {
        scanf("%d", &a[i]);
    }

    for (int pass = 0; pass < 5; pass++) {
        for (int j = 0; j < 5; j++) {
            if (a[j] > a[j + 1]) {
                int temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
        }
    }
    for (int i = 0; i < 6; i++) {
        printf("%d ", a[i]);
    }
    printf("\n");`) }),
] },
],
quiz: [
  Q('What is the index of the first element of any C array?', ['1', '0', '-1', 'It depends on the type'], 1),
  P(c`
int a[5] = {1, 2};
printf("%d", a[4]);`, '0', c`If you initialise only some elements, the rest are set to 0. (No initialiser at all = garbage.)`),
  P(c`
char s[] = "abc";
int n = sizeof(s);
printf("%d", n);`, '4', c`Three letters plus the invisible ~'\0'~.`),
  Q('How do you check whether two strings have the same content?', [c`~a == b~`, c`~strcmp(a, b) == 0~`, c`~a.equals(b)~`, c`~strcmp(a, b) == 1~`], 1),
  P(c`
int m[2][2] = {{1, 2}, {3, 4}};
printf("%d", m[1][1] - m[0][1]);`, '2'),
  Q(c`A function receives ~int arr[]~ and sets ~arr[0] = 99~. What happens to the caller's array?`, ['Nothing — arrays are copied', 'Its first element becomes 99', 'Compile error', 'The array is deleted'], 1, c`Arrays are passed by address, never copied.`),
] });

/* ============ TOPIC 7: CUSTOM TYPES ============ */
topic({ id: 'types', title: 'Build Your Own Types', icon: '🧱', color: '#ffc800', blurb: 'typedef, enums and structs: model real things.',
lessons: [
{ id: 'enums', title: 'typedef & enums', icon: '📛', desc: 'Nicknames for types and names for numbers.',
  v: [['5:21:58', '5:27:02', 'typedef'], ['5:27:02', '5:35:54', 'Enums']],
  steps: [
  T('typedef: a nickname for a type', c`~typedef~ gives an existing type a new name. That's all it does.`, c`
typedef unsigned long long BigNumber;
typedef char Name[30];

BigNumber population = 8100000000;
Name hero = "Link";`, c`It looks pointless now. In two lessons, when you meet structs, it becomes the thing you type every day.`),
  Q(c`Does ~typedef~ create a brand-new kind of data?`, ['Yes', 'No — just a new name for an existing type', 'Only for ints', 'Only inside functions'], 1),
  T('enum: names for numbers', c`Which is easier to read — ~if (status == 2)~ or ~if (status == SHIPPED)~?

An **enum** is a list of named integer constants. They number themselves from 0.`, c`
enum Status { PENDING, PAID, SHIPPED, DELIVERED };
//               0       1      2         3

enum Status order = SHIPPED;

if (order == SHIPPED) {
    printf("On its way!\n");
}`, c`Under the hood they are plain ints — so they work beautifully in a ~switch~.`),
  P(c`
enum Day { MON, TUE, WED, THU };
enum Day d = WED;
printf("%d", d);`, '2'),
  P(c`
enum Level { EASY = 5, MEDIUM, HARD };
printf("%d", HARD);`, '7', c`Set a starting value and the rest keep counting from there: 5, 6, 7.`),
  F('Create an enum and use it.', c`
[[enum]] Light { RED, AMBER, GREEN };
enum Light now = [[GREEN]];
if (now == GREEN) printf("Go");`),
  X({ q: c`A game reads the difficulty as a number (1, 2 or 3). Use the enum in a ~switch~ to print the starting lives:

EASY → ~Lives: 5~ · MEDIUM → ~Lives: 3~ · HARD → ~Lives: 1~ · anything else → ~Invalid~`, start: c`#include <stdio.h>

enum Difficulty { EASY = 1, MEDIUM, HARD };

int main() {
    int choice;
    scanf("%d", &choice);

    return 0;
}
`, tests: [{ in: '1', out: 'Lives: 5' }, { in: '2', out: 'Lives: 3' }, { in: '3', out: 'Lives: 1' }, { in: '7', out: 'Invalid' }], must: [[c`case\s+EASY`, c`Use the names: ~case EASY:~ rather than ~case 1:~`], [c`case\s+HARD`, c`Use ~case HARD:~`]], hint: c`~switch (choice) { case EASY: ... break; ... default: ... }~`, sol: c`#include <stdio.h>

enum Difficulty { EASY = 1, MEDIUM, HARD };

int main() {
    int choice;
    scanf("%d", &choice);

    switch (choice) {
        case EASY: printf("Lives: 5\n"); break;
        case MEDIUM: printf("Lives: 3\n"); break;
        case HARD: printf("Lives: 1\n"); break;
        default: printf("Invalid\n");
    }
    return 0;
}
` }),
] },

{ id: 'structs', title: 'Structs', icon: '📦', desc: 'Bundle related variables into one thing.',
  v: [['5:35:54', '5:48:08', 'Structs']],
  steps: [
  T('One variable, many parts', c`A player has a name, a level and hit points. Three loose variables per player gets ugly fast. A **struct** bundles them into a single custom type.`, c`
struct Player {
    char name[20];
    int level;
    int hp;
};

struct Player hero = {"Link", 7, 80};

printf("%s is level %d\n", hero.name, hero.level);
hero.hp -= 25;                 // the dot reaches inside`, c`The parts are called **members**. You reach them with the dot: ~hero.hp~.`),
  P(c`
struct Point { int x; int y; };
struct Point p = {3, 4};
p.x = p.x + p.y;
printf("%d %d", p.x, p.y);`, '7 4'),
  T('typedef + struct = less typing', c`Writing ~struct Player~ everywhere is tiring. Combine it with ~typedef~ and the type is simply ~Player~:`, c`
typedef struct {
    char name[20];
    int level;
    int hp;
} Player;

Player hero = {"Link", 7, 80};
Player boss = {"Ganon", 50, 999};`, c`This is the form you'll see in most real C code.`),
  F('Define a Book type and create one.', c`
typedef [[struct]] {
    char title[40];
    int pages;
} [[Book]];

Book b = {"Dune", 412};
printf("%d", b[[.]]pages);`),
  Q(c`~Player hero;~ exists already. How do you set its name to "Zelda" afterwards?`, [c`~hero.name = "Zelda";~`, c`~strcpy(hero.name, "Zelda");~`, c`~hero->name = "Zelda";~`, c`~name.hero = "Zelda";~`], 1, c`~name~ is a char array, and arrays can't be assigned with ~=~ after creation. Same rule as before: ~strcpy~.`),
  X({ q: c`Define a struct for a car with a model (text), a year (int) and a price (double). Create this car and print it:

~1967 Mustang - $45000.50~`, start: c`#include <stdio.h>

// define your struct here


int main() {

    return 0;
}
`, tests: [{ out: '1967 Mustang - $45000.50' }], must: [['struct', c`Define a ~struct~.`], [c`\.\s*\w+`, c`Print the members using the dot, like ~car.year~.`]], not: [['"1967 Mustang', 'Print from the struct members, not a hard-coded string.']], hint: c`~typedef struct { char model[30]; int year; double price; } Car;~ then ~Car car = {"Mustang", 1967, 45000.50};~`, sol: c`#include <stdio.h>

typedef struct {
    char model[30];
    int year;
    double price;
} Car;

int main() {
    Car car = {"Mustang", 1967, 45000.50};
    printf("%d %s - $%.2f\n", car.year, car.model, car.price);
    return 0;
}
` }),
  X({ q: c`Write ~printPlayer~ so each player is shown like:

~[Lv 7] Link - 80 HP~`, start: c`#include <stdio.h>

typedef struct {
    char name[20];
    int level;
    int hp;
} Player;

// void printPlayer(Player p)


int main() {
    Player hero = {"Link", 7, 80};
    Player boss = {"Ganon", 50, 999};
    printPlayer(hero);
    printPlayer(boss);
    return 0;
}
`, tests: [{ out: '[Lv 7] Link - 80 HP\n[Lv 50] Ganon - 999 HP' }], hint: c`~printf("[Lv %d] %s - %d HP\n", p.level, p.name, p.hp);~`, sol: c`#include <stdio.h>

typedef struct {
    char name[20];
    int level;
    int hp;
} Player;

void printPlayer(Player p) {
    printf("[Lv %d] %s - %d HP\n", p.level, p.name, p.hp);
}

int main() {
    Player hero = {"Link", 7, 80};
    Player boss = {"Ganon", 50, 999};
    printPlayer(hero);
    printPlayer(boss);
    return 0;
}
` }),
] },

{ id: 'structfn', title: 'Structs & functions', icon: '🔄', desc: 'Structs get copied. That matters more than it sounds.',
  steps: [
  T('Structs are passed by value', c`Unlike arrays, a struct handed to a function is **copied** — every member of it.`),
  P(c`
#include <stdio.h>

typedef struct {
    int hp;
} Player;

void hit(Player p) {
    p.hp -= 10;
}

int main() {
    Player a = {50};
    hit(a);
    printf("%d", a.hp);
    return 0;
}`, '50', c`~hit~ damaged a photocopy. The original is untouched — the same thing that happened with ~addTen~ back in Functions.`),
  P(c`
typedef struct { int x; int y; } Point;
Point a = {1, 2};
Point b = a;
b.x = 9;
printf("%d %d", a.x, b.x);`, '1 9', c`~=~ copies a whole struct, member by member. ~a~ and ~b~ are independent afterwards.`),
  T('Returning a struct', c`A function can build a struct and **return** it. This is the clean way to "return several values at once".`, c`
Point makePoint(int x, int y) {
    Point p = {x, y};
    return p;
}

Point origin = makePoint(0, 0);`),
  Q(c`Can you compare two structs with ~if (a == b)~ ?`, ['Yes', 'No — compare them member by member', 'Only if they contain ints', 'Only with typedef'], 1, c`C gives you ~=~ for structs but not ~==~. Write a small ~equals~ function if you need one.`),
  X({ q: c`Write ~midpoint~: it takes two Points and **returns** the Point halfway between them.

~0 0 4 6~ → ~(2.0, 3.0)~`, start: c`#include <stdio.h>

typedef struct {
    double x;
    double y;
} Point;

// Point midpoint(Point a, Point b)


int main() {
    Point a, b;
    scanf("%lf %lf %lf %lf", &a.x, &a.y, &b.x, &b.y);
    Point m = midpoint(a, b);
    printf("(%.1f, %.1f)\n", m.x, m.y);
    return 0;
}
`, tests: [{ in: '0 0 4 6', out: '(2.0, 3.0)' }, { in: '-2 5 3 5', out: '(0.5, 5.0)' }], hint: c`Create a ~Point m~, set ~m.x = (a.x + b.x) / 2~, same for y, return ~m~.`, sol: c`#include <stdio.h>

typedef struct {
    double x;
    double y;
} Point;

Point midpoint(Point a, Point b) {
    Point m;
    m.x = (a.x + b.x) / 2;
    m.y = (a.y + b.y) / 2;
    return m;
}

int main() {
    Point a, b;
    scanf("%lf %lf %lf %lf", &a.x, &a.y, &b.x, &b.y);
    Point m = midpoint(a, b);
    printf("(%.1f, %.1f)\n", m.x, m.y);
    return 0;
}
` }),
  X({ q: c`~levelUp~ should raise the level by 1 and restore hp to 100 — but the hero stays at ~Level 1, 35 HP~.

Fix it the way you know: make ~levelUp~ return the updated Player. Expected: ~Level 2, 100 HP~`, start: c`#include <stdio.h>

typedef struct {
    int level;
    int hp;
} Player;

void levelUp(Player p) {
    p.level++;
    p.hp = 100;
}

int main() {
    Player hero = {1, 35};
    levelUp(hero);
    printf("Level %d, %d HP\n", hero.level, hero.hp);
    return 0;
}
`, tests: [{ out: 'Level 2, 100 HP' }], not: [['"Level 2', 'No hard-coding.']], hint: c`~Player levelUp(Player p) { ...; return p; }~ and in main: ~hero = levelUp(hero);~`, sol: c`#include <stdio.h>

typedef struct {
    int level;
    int hp;
} Player;

Player levelUp(Player p) {
    p.level++;
    p.hp = 100;
    return p;
}

int main() {
    Player hero = {1, 35};
    hero = levelUp(hero);
    printf("Level %d, %d HP\n", hero.level, hero.hp);
    return 0;
}
` }),
] },

{ id: 'structarr', title: 'Arrays of structs', icon: '🗄️', desc: 'A tiny database in memory.',
  v: [['5:48:08', '5:54:48', 'Arrays of structs']],
  steps: [
  T('Rows of records', c`An array of structs is a table: each element is one record, each member is one column.`, c`
typedef struct {
    char name[20];
    double gpa;
} Student;

Student class[] = {
    {"Ann", 3.9},
    {"Bob", 2.5},
    {"Cleo", 3.2}
};

printf("%s", class[1].name);   // Bob`, c`Index first to pick the record, then dot to pick the member.`),
  P(c`
typedef struct { char name[10]; int age; } Pet;
Pet pets[] = {{"Rex", 3}, {"Tom", 5}};
printf("%s %d", pets[1].name, pets[0].age);`, 'Tom 3'),
  X({ q: c`Find the student with the highest GPA and print:

~Top student: Cleo (3.9)~`, start: c`#include <stdio.h>

typedef struct {
    char name[20];
    double gpa;
} Student;

int main() {
    Student class[] = {{"Ann", 3.4}, {"Bob", 2.5}, {"Cleo", 3.9}, {"Dev", 3.7}};
    int count = sizeof(class) / sizeof(class[0]);

    return 0;
}
`, tests: [{ out: 'Top student: Cleo (3.9)' }], must: [['for|while', 'Search with a loop.']], not: [['"Top student: Cleo', 'Find it — do not hard-code it.']], hint: c`Track the **index** of the best so far: ~if (class[i].gpa > class[best].gpa) best = i;~`, sol: c`#include <stdio.h>

typedef struct {
    char name[20];
    double gpa;
} Student;

int main() {
    Student class[] = {{"Ann", 3.4}, {"Bob", 2.5}, {"Cleo", 3.9}, {"Dev", 3.7}};
    int count = sizeof(class) / sizeof(class[0]);

    int best = 0;
    for (int i = 1; i < count; i++) {
        if (class[i].gpa > class[best].gpa) {
            best = i;
        }
    }
    printf("Top student: %s (%.1f)\n", class[best].name, class[best].gpa);
    return 0;
}
` }),
  X({ q: c`**Receipt.** Read ~n~, then ~n~ products (a one-word name and a price each). Store them in the array, then print:

~Total: $11.75~
~Most expensive: Cheese~`, start: c`#include <stdio.h>

typedef struct {
    char name[30];
    double price;
} Product;

int main() {
    Product items[20];
    int n;
    scanf("%d", &n);

    return 0;
}
`, tests: [{ in: '3 Milk 1.5 Cheese 7.25 Bread 3', out: 'Total: $11.75\nMost expensive: Cheese' }, { in: '1\nGum 0.99', out: 'Total: $0.99\nMost expensive: Gum' }, { in: '2 TV 499 Cable 12.5', out: 'Total: $511.50\nMost expensive: TV' }], hint: c`Read with ~scanf("%s %lf", items[i].name, &items[i].price);~ — no & for the name (array), & for the price.`, sol: c`#include <stdio.h>

typedef struct {
    char name[30];
    double price;
} Product;

int main() {
    Product items[20];
    int n;
    scanf("%d", &n);

    double total = 0;
    int top = 0;
    for (int i = 0; i < n; i++) {
        scanf("%s %lf", items[i].name, &items[i].price);
        total += items[i].price;
        if (items[i].price > items[top].price) {
            top = i;
        }
    }
    printf("Total: $%.2f\n", total);
    printf("Most expensive: %s\n", items[top].name);
    return 0;
}
` }),
] },
],
quiz: [
  P(c`
enum Color { RED, GREEN, BLUE };
printf("%d", GREEN + BLUE);`, '3'),
  Q(c`Which operator reaches a member of a struct variable?`, [c`~.~ (dot)`, c`~:~ (colon)`, c`~#~`, c`~&~`], 0),
  P(c`
typedef struct { int n; } Box;
Box a = {5};
Box b = a;
b.n++;
printf("%d %d", a.n, b.n);`, '5 6'),
  Q(c`What does ~typedef~ do?`, ['Allocates memory', 'Creates a new name for an existing type', 'Defines a function', 'Converts between types'], 1),
  F('Define and use a Point.', c`
typedef [[struct]] {
    int x;
    int y;
} Point;

Point p = {3, 4};
printf("%d", p[[.]]x);`),
  Q('A function receives a struct parameter and modifies it. What happens to the caller\'s struct?', ['It changes too', 'Nothing — the function got a copy', 'Compile error', 'It is deleted'], 1),
] });

/* ============ TOPIC 8: POINTERS ============ */
topic({ id: 'pointers', title: 'Pointers', icon: '👈', color: '#ff86d0', blurb: 'The topic everyone fears. You will not.',
lessons: [
{ id: 'addr', title: 'Addresses', icon: '🏠', desc: 'Every variable lives somewhere. A pointer remembers where.',
  v: [['5:54:48', '6:02:55', 'Pointers']],
  steps: [
  T('Memory is a street', c`Picture your computer's memory as one very long street of numbered houses. Every variable lives in a house, and the house number is its **address**.

~&~ in front of a variable means **"address of"**:`, c`
int age = 21;

printf("%d\n", age);     // 21              what is IN the house
printf("%p\n", &age);    // 0x7ffe4a3c      the house NUMBER`, c`You've been using ~&~ since your first ~scanf~. Now you know what you were handing it: directions to the house.`),
  Q(c`What does ~&age~ give you?`, ['The value stored in age', 'The memory address where age lives', 'A copy of age', 'The size of age'], 1),
  T('A pointer stores an address', c`A **pointer** is just a variable whose value is an address. Nothing more mystical than that.`, c`
int age = 21;
int *pAge = &age;      // "pAge points to age"

//      age                 pAge
//   +--------+          +--------+
//   |   21   |  <-----  | 0x1000 |
//   +--------+          +--------+
//   lives at 0x1000`, c`Read ~int *pAge~ as "pAge is a pointer to an int". The ~*~ in a declaration marks it as a pointer.`),
  Q(c`After ~int *p = &age;~ what is stored inside ~p~ ?`, ['21', 'The address of age', 'A second copy of age', 'Nothing yet'], 1, c`The pointer holds the house number, not the contents of the house.`),
  F('Make p point to score.', c`
int score = 90;
int [[*]]p = [[&]]score;`),
  Q(c`Why does a pointer have a type, like ~int *~ or ~char *~ ?`, ['Addresses of ints are bigger', 'So C knows what kind of value is waiting at that address', 'It does not matter, it is decoration', 'Because pointers are ints'], 1, c`An address alone is just a number. The type tells C how many bytes to read there and how to interpret them.`),
  X({ q: c`Right now ~p~ points nowhere. Change **one line** so it points to ~gold~, and the check at the bottom prints ~1~ (true).`, start: M(c`
    int gold = 500;
    int *p = NULL;

    printf("%d\n", p == &gold);`), tests: [{ out: '1' }], must: [[c`\*\s*p\s*=\s*&\s*gold|p\s*=\s*&\s*gold`, c`Point ~p~ at ~gold~ using ~&gold~.`]], not: [['"1', 'Nice try.']], hint: c`~int *p = &gold;~`, sol: M(c`
    int gold = 500;
    int *p = &gold;

    printf("%d\n", p == &gold);`) }),
] },

{ id: 'deref', title: 'Dereferencing', icon: '🎯', desc: 'Follow the arrow: read and change the thing a pointer points at.',
  steps: [
  T('Go to the address', c`Having an address is only useful if you can visit it. ~*p~ means **"the thing p points at"**.`, c`
int age = 21;
int *p = &age;

printf("%d\n", *p);    // 21 — read through the pointer
*p = 22;               // write through the pointer
printf("%d\n", age);   // 22 — age itself has changed!`, c`The star has two jobs. In a **declaration** (~int *p~) it means "this is a pointer". **Everywhere else** (~*p~) it means "go to that address". This double duty is the #1 source of pointer confusion — now you know.`),
  P(c`
int x = 10;
int *p = &x;
*p = *p + 5;
printf("%d", x);`, '15', c`~*p~ **is** x, just under another name.`),
  P(c`
int a = 1, b = 2;
int *p = &a;
p = &b;
*p = 9;
printf("%d %d", a, b);`, '1 9', c`~p = &b~ re-aims the pointer (no star: we change the address it holds). Then ~*p = 9~ writes into whatever it now points at: b.`),
  P(c`
int n = 5;
int *p = &n;
int *q = p;
*q = 7;
printf("%d", *p);`, '7', c`~q = p~ copies the **address**. Now two pointers aim at the same house; change it through one and the other sees it.`),
  Q(c`What is the difference between ~p = &y;~ and ~*p = y;~ ?`, ['None', c`The first re-aims p at y. The second copies y's value into whatever p already points at.`, c`The first copies the value. The second re-aims the pointer.`, 'The second one is a syntax error'], 1, c`No star = you are changing **the pointer**. Star = you are changing **the target**.`),
  F('Set hp to 100 through the pointer.', c`
int hp = 50;
int *p = &hp;
[[*p]] = 100;`),
  P(c`
int x = 3, y = 4;
int *p = &x, *q = &y;
*p = *q;
*q = 10;
printf("%d %d", x, y);`, '4 10', c`~*p = *q~ copies the value 4 into x. Then y becomes 10 — x keeps its copy.`),
  X({ q: c`Hands off the variables! Using **only** ~pa~ and ~pb~, double ~a~ and add 10 to ~b~.

Expected: ~8 15~`, start: M(c`
    int a = 4, b = 5;
    int *pa = &a;
    int *pb = &b;

    // use only pa and pb here


    printf("%d %d\n", a, b);`), tests: [{ out: '8 15' }], must: [[c`\*\s*pa\s*(\*=|=)`, c`Change ~a~ by writing to ~*pa~.`], [c`\*\s*pb\s*(\+=|=)`, c`Change ~b~ by writing to ~*pb~.`]], not: [[c`[;{}]\s*[ab]\s*(\*=|\+=|=[^=])`, c`Don't assign to ~a~ or ~b~ directly — go through the pointers.`], ['"8 15', 'No hard-coding.']], hint: c`~*pa = *pa * 2;~ and ~*pb += 10;~`, sol: M(c`
    int a = 4, b = 5;
    int *pa = &a;
    int *pb = &b;

    *pa = *pa * 2;
    *pb += 10;

    printf("%d %d\n", a, b);`) }),
] },

{ id: 'byref', title: 'Pointers as parameters', icon: '📮', desc: 'Finally: functions that can change your variables.',
  steps: [
  T('The reason pointers exist', c`Remember ~addTen~, which changed a copy and achieved nothing? Give it the **address** instead, and it can reach back into the caller's variable.`, c`
void addTen(int *n) {      // receives an address
    *n = *n + 10;          // changes the original
}

int main() {
    int score = 5;
    addTen(&score);        // hand over the address
    printf("%d", score);   // 15
    return 0;
}`, c`This is called **pass by reference**. And it's exactly why ~scanf("%d", &age)~ needs the ~&~ — scanf has to write into *your* variable.`),
  P(c`
#include <stdio.h>

void f(int a, int *b) {
    a = 100;
    *b = 200;
}

int main() {
    int x = 1, y = 2;
    f(x, &y);
    printf("%d %d", x, y);
    return 0;
}`, '1 200', c`~a~ is a copy of x — changing it does nothing outside. ~b~ is the address of y — writing through it changes the real y.`),
  F('The legendary swap function.', c`
void swap(int *a, int *b) {
    int temp = [[*a]];
    *a = [[*b]];
    *b = [[temp]];
}`),
  X({ q: c`Write ~swap~ yourself. Without pointers this function is literally impossible to write.`, start: c`#include <stdio.h>

// void swap(...)


int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    swap(&x, &y);
    printf("%d %d\n", x, y);
    return 0;
}
`, tests: [{ in: '3 9', out: '9 3' }, { in: '-1 0', out: '0 -1' }], hint: c`Parameters are ~int *a, int *b~. Save ~*a~ in a temp, copy ~*b~ into ~*a~, put temp into ~*b~.`, sol: c`#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    swap(&x, &y);
    printf("%d %d\n", x, y);
    return 0;
}
` }),
  X({ q: c`A function can only ~return~ one value. Need two? Use pointer parameters as extra **outputs**.

Write ~minMax~: it stores the smallest element in ~*min~ and the largest in ~*max~.`, start: c`#include <stdio.h>

void minMax(int arr[], int n, int *min, int *max) {
    // your code
}

int main() {
    int a[] = {7, -3, 12, 5, 0};
    int lo, hi;
    minMax(a, 5, &lo, &hi);
    printf("%d %d\n", lo, hi);
    return 0;
}
`, tests: [{ out: '-3 12' }], hint: c`Start with ~*min = arr[0]; *max = arr[0];~ and loop, comparing against ~*min~ and ~*max~.`, sol: c`#include <stdio.h>

void minMax(int arr[], int n, int *min, int *max) {
    *min = arr[0];
    *max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < *min) *min = arr[i];
        if (arr[i] > *max) *max = arr[i];
    }
}

int main() {
    int a[] = {7, -3, 12, 5, 0};
    int lo, hi;
    minMax(a, 5, &lo, &hi);
    printf("%d %d\n", lo, hi);
    return 0;
}
` }),
  X({ q: c`The healing potion doesn't work: it prints ~HP: 12~. This time fix it **with a pointer** so it prints ~HP: 100~.`, start: c`#include <stdio.h>

void heal(int hp) {
    hp = 100;
}

int main() {
    int hp = 12;
    heal(hp);
    printf("HP: %d\n", hp);
    return 0;
}
`, tests: [{ out: 'HP: 100' }], must: [[c`heal\s*\(\s*int\s*\*`, c`Make the parameter a pointer: ~void heal(int *hp)~`], [c`heal\s*\(\s*&\s*hp\s*\)`, c`Pass the address: ~heal(&hp);~`]], hint: c`Three changes: the parameter type, a star inside the function (~*hp = 100;~), and an ~&~ in the call.`, sol: c`#include <stdio.h>

void heal(int *hp) {
    *hp = 100;
}

int main() {
    int hp = 12;
    heal(&hp);
    printf("HP: %d\n", hp);
    return 0;
}
` }),
] },

{ id: 'ptrarr', title: 'Pointers & arrays', icon: '🚶', desc: 'The secret: arr[i] was pointer maths all along.',
  steps: [
  T('An array name is an address', c`Use an array's name on its own and you get the address of its **first element**. So a pointer can walk along an array:`, c`
int a[] = {10, 20, 30};
int *p = a;            // same as &a[0]

printf("%d", *p);        // 10
printf("%d", *(p + 1));  // 20
printf("%d", *(p + 2));  // 30`, c`~p + 1~ doesn't mean "one byte further". It means "one **element** further" — C multiplies by the element size for you. That's another reason pointers have types.`),
  P(c`
int a[] = {10, 20, 30};
int *p = a;
printf("%d", *(p + 2));`, '30'),
  P(c`
int a[] = {5, 6, 7};
int *p = a;
p++;
printf("%d %d", *p, p[1]);`, '6 7', c`After ~p++~, p points at the 6. And yes — you can use ~[ ]~ on any pointer: ~p[1]~ is one step past where p points.`),
  Q(c`What is ~a[i]~ really?`, ['A special array operation', c`Shorthand for ~*(a + i)~`, 'A function call', c`Shorthand for ~&a + i~`], 1, c`"Start at a, move i elements along, look inside." The square brackets are just a nicer way to write it.`),
  P(c`
int a[] = {10, 20};
int *p = a;
printf("%d %d", *p + 1, *(p + 1));`, '11 20', c`Brackets matter. ~*p + 1~ = (value at p) plus one. ~*(p + 1)~ = value at the **next** element.`),
  Q(c`Inside ~void f(int arr[])~, why does ~sizeof(arr) / sizeof(arr[0])~ give the wrong answer?`, ['sizeof does not work in functions', c`~arr~ is really just a pointer there, so ~sizeof(arr)~ is the size of a pointer (8)`, 'Arrays shrink when passed', 'It gives the right answer'], 1, c`The array "decays" into a pointer when passed. The length is lost — which is why you always pass the size alongside.`),
  X({ q: c`Write ~sum~ using pointer arithmetic: **no square brackets inside the function**.`, start: c`#include <stdio.h>

int sum(int *p, int n) {
    // no [ ] allowed in here
}

int main() {
    int nums[] = {4, 8, 15, 16, 23, 42};
    printf("%d\n", sum(nums, 6));
    printf("%d\n", sum(nums + 2, 3));
    return 0;
}
`, tests: [{ out: '108\n54' }], must: [[c`\*\s*\(\s*p\s*\+|\*\s*p\b|\*p\+\+`, c`Read the elements with ~*(p + i)~ or ~*p~ and ~p++~.`]], not: [[c`p\s*\[`, c`No ~p[i]~ — use the star.`]], hint: c`~total += *(p + i);~ — or the walker's way: ~total += *p; p++;~. Notice ~sum(nums + 2, 3)~: you can start in the middle of an array!`, sol: c`#include <stdio.h>

int sum(int *p, int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += *(p + i);
    }
    return total;
}

int main() {
    int nums[] = {4, 8, 15, 16, 23, 42};
    printf("%d\n", sum(nums, 6));
    printf("%d\n", sum(nums + 2, 3));
    return 0;
}
` }),
  X({ q: c`Functions can also **return** pointers. Write ~findMax~: it returns a pointer to the largest element.

Then ~main~ uses that pointer to overwrite the champion with 0. Expected: ~3 0 4 1~`, start: c`#include <stdio.h>

int *findMax(int *arr, int n) {
    // return the ADDRESS of the largest element
}

int main() {
    int a[] = {3, 9, 4, 1};
    int *best = findMax(a, 4);
    *best = 0;
    printf("%d %d %d %d\n", a[0], a[1], a[2], a[3]);
    return 0;
}
`, tests: [{ out: '3 0 4 1' }], hint: c`Keep ~int *best = arr;~. In the loop: ~if (arr[i] > *best) best = &arr[i];~. Return ~best~.`, sol: c`#include <stdio.h>

int *findMax(int *arr, int n) {
    int *best = arr;
    for (int i = 1; i < n; i++) {
        if (arr[i] > *best) {
            best = &arr[i];
        }
    }
    return best;
}

int main() {
    int a[] = {3, 9, 4, 1};
    int *best = findMax(a, 4);
    *best = 0;
    printf("%d %d %d %d\n", a[0], a[1], a[2], a[3]);
    return 0;
}
` }),
] },

{ id: 'ptrstr', title: 'Strings & pointers', icon: '🧶', desc: 'Walk a string to its terminator. Rebuild strlen yourself.',
  steps: [
  T('char * — a pointer into text', c`A string is a char array, an array name is an address… so a string is very often handled as a ~char *~: a pointer to its first character.`, c`
char *s = "hello";

while (*s != '\0') {     // until we hit the terminator
    printf("%c\n", *s);  // the current letter
    s++;                 // step to the next one
}`, c`This little loop is how ~strlen~, ~strcpy~, ~printf("%s")~ and friends all work inside.`),
  P(c`
char *s = "pointer";
printf("%c%c", *s, *(s + 4));`, 'pt', c`~*s~ is the first letter. Four steps along: p-o-i-n-**t**.`),
  P(c`
char *s = "hello";
s += 2;
printf("%s", s);`, 'llo', c`~%s~ prints from wherever the pointer currently is, up to the terminator.`),
  Q(c`One of these crashes when you run ~s[0] = 'J';~ afterwards. Which?`, [c`~char s[] = "hello";~`, c`~char *s = "hello";~`, 'Both crash', 'Neither crashes'], 1, c`~char s[]~ makes your **own editable copy** of the letters. ~char *s~ points at the original literal, which lives in read-only memory. Writing to it = crash.`),
  X({ q: c`Write your own ~myStrlen~ — count characters until you reach ~'\0'~. No ~string.h~!`, start: c`#include <stdio.h>

int myStrlen(char *s) {
    // your code
}

int main() {
    char word[100];
    scanf("%s", word);
    printf("%d\n", myStrlen(word));
    return 0;
}
`, tests: [{ in: 'hello', out: '5' }, { in: 'a', out: '1' }, { in: 'supercalifragilistic', out: '20' }], not: [['strlen\\s*\\(\\s*(s|word)', c`No cheating with the real ~strlen~!`]], hint: c`~int count = 0; while (*s != '\0') { count++; s++; } return count;~`, sol: c`#include <stdio.h>

int myStrlen(char *s) {
    int count = 0;
    while (*s != '\0') {
        count++;
        s++;
    }
    return count;
}

int main() {
    char word[100];
    scanf("%s", word);
    printf("%d\n", myStrlen(word));
    return 0;
}
` }),
  X({ q: c`Write ~shout~: convert a string to upper case **in place** by walking it with the pointer. Leave non-letters alone.

~hello~ → ~HELLO~`, start: c`#include <stdio.h>
#include <ctype.h>

void shout(char *s) {
    // your code
}

int main() {
    char word[100];
    scanf("%s", word);
    shout(word);
    printf("%s\n", word);
    return 0;
}
`, tests: [{ in: 'hello', out: 'HELLO' }, { in: 'MiXed123', out: 'MIXED123' }], hint: c`~while (*s) { *s = toupper(*s); s++; }~ — ~toupper~ from ctype.h ignores anything that isn't a lowercase letter.`, sol: c`#include <stdio.h>
#include <ctype.h>

void shout(char *s) {
    while (*s != '\0') {
        *s = toupper(*s);
        s++;
    }
}

int main() {
    char word[100];
    scanf("%s", word);
    shout(word);
    printf("%s\n", word);
    return 0;
}
` }),
  X({ q: c`Write ~countChar~: how many times does character ~c~ appear in string ~s~?

~banana a~ → ~3~`, start: c`#include <stdio.h>

// int countChar(char *s, char c)


int main() {
    char word[100];
    char letter;
    scanf("%s %c", word, &letter);
    printf("%d\n", countChar(word, letter));
    return 0;
}
`, tests: [{ in: 'banana a', out: '3' }, { in: 'hello z', out: '0' }, { in: 'mississippi s', out: '4' }], hint: c`Same walk as ~myStrlen~, but only count when ~*s == c~.`, sol: c`#include <stdio.h>

int countChar(char *s, char c) {
    int count = 0;
    while (*s != '\0') {
        if (*s == c) count++;
        s++;
    }
    return count;
}

int main() {
    char word[100];
    char letter;
    scanf("%s %c", word, &letter);
    printf("%d\n", countChar(word, letter));
    return 0;
}
` }),
] },

{ id: 'ptrstruct', title: 'Struct pointers, NULL & crashes', icon: '💥', desc: 'The arrow operator, and how pointers go wrong.',
  steps: [
  T('Pointers to structs: the arrow', c`Passing a big struct by value copies all of it — and the function can't change the original. So in real C code, structs nearly always travel as **pointers**.`, c`
typedef struct {
    char name[20];
    int hp;
} Player;

void heal(Player *p) {
    p->hp = 100;        // arrow: follow the pointer, then pick a member
}                       // identical to (*p).hp = 100;

heal(&hero);`, c`Have the struct itself? Use the **dot**. Have a pointer to it? Use the **arrow**.`),
  P(c`
#include <stdio.h>

typedef struct { int x; int y; } Point;

int main() {
    Point a = {1, 2};
    Point *p = &a;
    p->x = 5;
    printf("%d %d", a.x, p->y);
    return 0;
}`, '5 2'),
  F('Take 10 hp off the player through the pointer.', c`
typedef struct { int hp; } Player;
Player hero = {50};
Player *p = &hero;
p[[->]]hp -= 10;`),
  T('NULL: pointing at nothing', c`A pointer that has nowhere to point should be set to ~NULL~ — "no address". Following a NULL pointer crashes your program on the spot with a **segmentation fault**.`, c`
int *p = NULL;

if (p != NULL) {       // always check when a pointer MIGHT be NULL
    printf("%d", *p);
}`, c`A crash sounds bad, but it is the *good* outcome: an uninitialised pointer aims somewhere random and silently corrupts memory instead. Always initialise pointers.`),
  Q(c`What happens here? ~int *p = NULL; *p = 5;~`, ['p becomes 5', 'The program crashes (segmentation fault)', 'A new int is created', 'Compile error'], 1, c`There is no house at address 0. The operating system kills the program.`),
  Q(c`What is wrong with this function?`, ['Nothing', c`~n~ dies when the function returns — the returned pointer points at a dead variable`, c`You cannot use ~&~ on an int`, 'It should return void'], 1, c`This is a **dangling pointer**. Locals live on the stack and vanish at the closing brace. Never return the address of a local. (How to make memory that outlives a function? Topic 10.)`, c`
int *makeNumber() {
    int n = 42;
    return &n;
}`),
  X({ q: c`Write ~levelUp~: it takes a **pointer** to a Player, adds 1 to the level and sets hp to 100.

Expected: ~Level 2, 100 HP~`, start: c`#include <stdio.h>

typedef struct {
    int level;
    int hp;
} Player;

// void levelUp(Player *p)


int main() {
    Player hero = {1, 35};
    levelUp(&hero);
    printf("Level %d, %d HP\n", hero.level, hero.hp);
    return 0;
}
`, tests: [{ out: 'Level 2, 100 HP' }], must: [['->', c`Use the arrow operator ~->~`]], hint: c`~p->level++;~ and ~p->hp = 100;~ — compare this with the copy-and-return version you wrote in Topic 7.`, sol: c`#include <stdio.h>

typedef struct {
    int level;
    int hp;
} Player;

void levelUp(Player *p) {
    p->level++;
    p->hp = 100;
}

int main() {
    Player hero = {1, 35};
    levelUp(&hero);
    printf("Level %d, %d HP\n", hero.level, hero.hp);
    return 0;
}
` }),
  X({ q: c`Run this first and meet your first **segfault**. (Notice that even Ada's greeting vanishes — the crash kills the program before the output is flushed.)

Then make ~greet~ safe: when the name is NULL, print ~Hello stranger~ instead.

~Hello Ada (3 letters)~
~Hello stranger~
~Hello Bro (3 letters)~`, start: c`#include <stdio.h>
#include <string.h>

void greet(char *name) {
    printf("Hello %s (%d letters)\n", name, (int)strlen(name));
}

int main() {
    greet("Ada");
    greet(NULL);
    greet("Bro");
    return 0;
}
`, tests: [{ out: 'Hello Ada (3 letters)\nHello stranger\nHello Bro (3 letters)' }], must: [['NULL[\\s\\S]*NULL|!\\s*name', c`Check for ~NULL~ inside ~greet~.`]], hint: c`First lines of greet: ~if (name == NULL) { printf("Hello stranger\n"); return; }~`, sol: c`#include <stdio.h>
#include <string.h>

void greet(char *name) {
    if (name == NULL) {
        printf("Hello stranger\n");
        return;
    }
    printf("Hello %s (%d letters)\n", name, (int)strlen(name));
}

int main() {
    greet("Ada");
    greet(NULL);
    greet("Bro");
    return 0;
}
` }),
] },
],
quiz: [
  Q(c`In an expression, what do ~&x~ and ~*p~ mean?`, [c`~&x~: value of x · ~*p~: address of p`, c`~&x~: address of x · ~*p~: the value p points at`, 'Both mean the address', 'Both mean the value'], 1),
  P(c`
int v = 8;
int *p = &v;
*p /= 2;
printf("%d", v);`, '4'),
  P(c`
int a[] = {2, 4, 6, 8};
int *p = a + 1;
printf("%d", p[1] + *a);`, '8', c`p points at the 4, so ~p[1]~ is 6. ~*a~ is the first element, 2.`),
  Q(c`~ptr->hp~ is shorthand for…`, [c`~*ptr.hp~`, c`~(*ptr).hp~`, c`~&ptr.hp~`, c`~ptr.hp~`], 1),
  P(c`
#include <stdio.h>

void bump(int *n) {
    (*n)++;
}

int main() {
    int k = 9;
    bump(&k);
    bump(&k);
    printf("%d", k);
    return 0;
}`, '11'),
  Q('What happens when you dereference a NULL pointer?', ['You get 0', 'The program crashes', 'The pointer is created automatically', 'Nothing'], 1),
  F('A function that sets the caller\'s variable to zero.', c`
void reset(int [[*]]n) {
    [[*n]] = 0;
}`),
] });
