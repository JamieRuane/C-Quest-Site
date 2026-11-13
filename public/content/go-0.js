/* ================= Go =================
   One path for everyone: it starts from the very first line of code.
   Go has no compiler on most learners' machines, so it always runs on the online compiler (Wandbox), like C#.

   Go refuses to compile a program with an unused variable or an unused import, so every snippet has to be a
   complete, tidy program. goProgram(top, body) builds one: "package main", exactly the imports the code uses,
   any top-level code (functions, types), then body inside func main(). M(body) uses it. */
(function () {
  const PKGS = { bufio: 'bufio', errors: 'errors', fmt: 'fmt', math: 'math', os: 'os', rand: 'math/rand', slices: 'slices', sort: 'sort', strconv: 'strconv', strings: 'strings', sync: 'sync', time: 'time', unicode: 'unicode' };
  window.goProgram = (top, body) => {
    const code = (top + '\n' + body).replace(/"(?:\\.|[^"\\\n])*"|`[^`]*`|\/\/[^\n]*/g, '""');   // ignore strings and comments
    const used = Object.keys(PKGS).filter(p => new RegExp('\\b' + p + '\\.').test(code)).map(p => PKGS[p]).sort();
    const imports = !used.length ? '' : used.length === 1 ? `import "${used[0]}"\n\n` : 'import (\n' + used.map(p => `    "${p}"\n`).join('') + ')\n\n';
    return 'package main\n\n' + imports + (top.trim() ? top.trim() + '\n\n' : '') + 'func main() {\n' + body + '\n}\n';
  };
})();

course('go', {
  name: 'Go', badge: 'Go', logo: 'logos/go.svg', color: '#00add8', video: 'yyUHQIec83I', glossTry: 'slice', tool: 'the Go compiler', online: true, showErr: true,
  tagline: 'Made at Google for fast, simple servers and cloud tools. Docker and Kubernetes are written in it.',
  blank: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}\n',
  wandbox: { compiler: 'go-1.23.2' },
  wrap: body => window.goProgram('', body),
});

G('package main', c`The first line of every runnable Go program. It says "this file builds a program, not a library".`);
G('import', c`Brings in a package from Go's library: ~import "fmt"~. Importing something you do not use is a compile error.`);
G('func main()', c`Where a Go program starts.`);
G('fmt', c`Go's formatting package: ~fmt.Println~, ~fmt.Printf~, ~fmt.Sprintf~ and ~fmt.Scan~.`);
G(':=', c`Declares a variable and gives it a value in one go; Go works out the type: ~score := 10~. Only inside functions.`);
G('var', c`Declares a variable: ~var lives int = 3~. Without a value it starts at its **zero value**.`);
G('zero value', c`What an unset variable holds: ~0~ for numbers, ~""~ for strings, ~false~ for bools, ~nil~ for pointers, slices and maps.`);
G('const', c`A value that can never change: ~const MaxLives = 3~.`);
G('Printf verbs', c`~%v~ any value · ~%d~ whole number · ~%s~ text · ~%.2f~ two decimals · ~%t~ bool · ~%T~ the type · ~\n~ new line.`);
G('fmt.Scan', c`Reads typed words into variables: ~fmt.Scan(&name, &age)~. The ~&~ passes the variable's address so Scan can fill it.`);
G('for', c`Go's **only** loop. It covers counting (~for i := 0; i < 5; i++~), while-style (~for x < 10~) and forever (~for { }~).`);
G('switch', c`Picks the first matching case. No ~break~ needed: Go never falls through to the next case.`);
G('multiple return values', c`A function can return several values: ~func divmod(a, b int) (int, int)~.`);
G('error', c`Go reports problems by returning an ~error~ value. Check it straight away: ~if err != nil { ... }~`);
G('nil', c`"Nothing": the zero value of pointers, slices, maps, channels, functions and errors.`);
G('defer', c`Runs a call when the surrounding function finishes. Used for clean-up like closing files.`);
G('closure', c`A function value that remembers the variables around it.`);
G('slice', c`A growable list: ~nums := []int{1, 2, 3}~; ~append(nums, 4)~ adds to it.`);
G('array', c`A fixed-size list: ~[3]int{1, 2, 3}~. Slices are used far more often.`);
G('map', c`Key → value pairs: ~ages := map[string]int{"Ada": 36}~.`);
G('range', c`Loops over a slice, string, map or channel: ~for i, v := range nums~.`);
G('_ (blank identifier)', c`Throws a value away: ~for _, v := range nums~. Handy because unused variables are not allowed.`);

/* ============ TOPIC 1: FIRST STEPS ============ */
topic({ id: 'first', title: 'First Steps', icon: '🌱', color: '#58cc02', blurb: 'Print, store, format and read input.',
lessons: [
{ id: 'hello', title: 'Your first program', icon: '🚀', desc: 'package, import, func main — and Go\'s strict rules.',
  v: [['0:12:54', '0:22:02', 'Write your first Go program']],
  steps: [
  T('Why Go?', c`Go was made at Google to build fast, reliable servers without the complexity of C++. Docker, Kubernetes and much of the cloud run on it. It is a **small** language: you can learn all of it.

This is a complete Go program:`, c`
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`),
  T('The three parts', c`~package main~ — this file builds a runnable program.

~import "fmt"~ — bring in the **fmt** package, which prints and reads text.

~func main() { ... }~ — the program starts here.

~fmt.Println~ prints its values separated by spaces, then a new line. ~fmt.Print~ does not add the new line.`, null, c`Go is strict: an opening brace ~{~ **must** be on the same line, and importing a package you never use is an error. The upside: every Go program looks the same, and the official ~gofmt~ tool can tidy any file automatically.`),
  Q('Where does a Go program start running?', [c`At ~package main~`, c`In ~func main()~`, c`At the first ~import~`, 'At the first line of the file'], 1),
  P(c`
fmt.Print("A")
fmt.Println("B")
fmt.Println("C", 1, true)`, 'AB\nC 1 true', c`~Println~ puts a space between its values.`),
  F('Rebuild Hello World.', c`
[[package]] main

[[import]] "fmt"

[[func]] main() {
    fmt.Println("Hello, World!")
}`),
  O('Put the lines of a complete program in order.', c`
package main
import "fmt"
func main() {
    fmt.Println("It works!")
}`),
  X({ q: c`Make the program print exactly: ~I am learning Go!~`, start: M(c`
    // your code goes here
    fmt.Println()`), tests: [{ out: 'I am learning Go!' }], sol: M(c`
    fmt.Println("I am learning Go!")`) }),
  X({ q: c`Three bugs. Press **Run**, read the **first** error, fix it, repeat.

Expected output:

~Mission control~
~Lift off!~`, start: c`package main

import "fmt"

func main()
{
    fmt.Println("Mission control")
    fmt.println("Lift off!)
}
`, tests: [{ out: 'Mission control\nLift off!' }], hint: c`The ~{~ must be on the same line as ~func main()~. A quote is missing. And it is ~Println~ with a capital P: in Go, only names starting with a capital letter can be used from outside their package.`, sol: M(c`
    fmt.Println("Mission control")
    fmt.Println("Lift off!")`) }),
] },

{ id: 'variables', title: 'Variables & types', icon: '📦', desc: 'var, :=, const — and no unused variables allowed.',
  v: [['0:22:02', '0:30:43', 'Variables & constants'], ['0:33:43', '0:45:18', 'Data types']],
  steps: [
  T('Two ways to make a variable', c`Every Go variable has a **type**. Usually Go works it out for you with ~:=~.`, c`
var lives int = 3       // the full form
var name = "Ada"        // type worked out from the value
score := 10             // the short form: the one you will use most
price := 19.99          // float64
online := true          // bool

const MaxLives = 5      // can never change

var count int           // no value: starts at its "zero value", 0`, c`The basic types: ~int~ (whole numbers), ~float64~ (decimals), ~string~ (text), ~bool~ (~true~/~false~).`),
  T('Go is strict', c`Two things that are only warnings elsewhere are **errors** in Go:

**An unused variable:** ~declared and not used: x~

**An unused import:** ~"strings" imported and not used~

It feels harsh at first, but it keeps every Go program free of leftover clutter.`),
  Q('Which of these stops a Go program from compiling?', ['A variable that is never used', 'A comment with no code', 'A blank line', 'Printing a number'], 0),
  P(c`
x := 5
x = x + 2
x *= 2
fmt.Println(x)`, '14', c`~:=~ makes a new variable; ~=~ changes an existing one.`),
  P(c`fmt.Println(7/2, 7.0/2)`, '3 3.5', c`Two whole numbers give a whole number: the .5 is thrown away.`),
  P(c`
var n int
var s string
var ok bool
fmt.Println(n, s == "", ok)`, '0 true false', c`Every type has a **zero value**, so a Go variable is never "garbage".`),
  T('Types never mix by themselves', c`Go will not quietly convert between types. Multiplying an ~int~ by a ~float64~ is an error — convert one of them first:`, c`
qty := 3
price := 8.5
total := float64(qty) * price   // 25.5
whole := int(price)             // 8 — the decimals are cut off`),
  X({ q: c`Print a receipt line using all three variables:

~3 x Pizza = 25.5~`, start: M(c`
    item := "Pizza"
    price := 8.5
    qty := 3
    fmt.Println(item, price, qty)`), tests: [{ out: '3 x Pizza = 25.5' }], not: [['"3 x Pizza', 'Build the line from the variables — no hard-coding.']], hint: c`~fmt.Println(qty, "x", item, "=", price*float64(qty))~`, sol: M(c`
    item := "Pizza"
    price := 8.5
    qty := 3
    fmt.Println(qty, "x", item, "=", price*float64(qty))`) }),
  X({ q: c`This should print ~Average: 7.5~ but prints ~Average: 7~. Fix the calculation.`, start: M(c`
    a, b := 7, 8
    average := (a + b) / 2
    fmt.Println("Average:", average)`), tests: [{ out: 'Average: 7.5' }], not: [['"Average: 7\\.5', 'Fix the calculation, not the message.']], hint: c`Convert the total to a ~float64~ before dividing: ~float64(a+b) / 2~.`, sol: M(c`
    a, b := 7, 8
    average := float64(a+b) / 2
    fmt.Println("Average:", average)`) }),
] },

{ id: 'printf', title: 'Printf: formatted output', icon: '🖨️', desc: 'Two decimal places, and seeing a value\'s type.',
  v: [['0:30:43', '0:33:43', 'Formatted output']],
  steps: [
  T('Format verbs', c`~fmt.Printf~ prints a template, filling each **verb** (~%d~, ~%s~…) with the next value. Unlike ~Println~, it does **not** add a new line — end with ~\n~.`, c`
name, lives, price := "Mario", 3, 4.5

fmt.Printf("%s has %d lives\n", name, lives)   // Mario has 3 lives
fmt.Printf("Price: %.2f\n", price)              // Price: 4.50
fmt.Printf("%v and %v\n", lives, name)          // %v: any value, sensible format
fmt.Printf("%T\n", price)                       // float64 — the type

msg := fmt.Sprintf("%03d", 7)                   // "007" — build a string, don't print`),
  P(c`fmt.Printf("%.2f\n", 3.14159)`, '3.14'),
  P(c`fmt.Printf("%d|%T|%t\n", 42, "hi", 1 > 2)`, '42|string|false'),
  F('Print the price with two decimals.', c`
price := 9.5
fmt.Printf("Price: [[%.2f]]\n", price)`),
  X({ q: c`Print the area of a circle with radius ~r~ using ~math.Pi~, with **two** decimals:

~Area: 12.57~`, start: M(c`
    r := 2.0
    fmt.Println(r)`), tests: [{ out: 'Area: 12.57' }], must: [[c`Printf|Sprintf`, c`Use ~fmt.Printf~.`], [c`math\.Pi`, c`Use ~math.Pi~.`]], sol: M(c`
    r := 2.0
    fmt.Printf("Area: %.2f\n", math.Pi*r*r)`) }),
] },

{ id: 'input', title: 'Reading input', icon: '⌨️', desc: 'fmt.Scan, and what that & is doing.',
  v: [['0:45:18', '0:47:19', 'Getting user input']],
  steps: [
  T('fmt.Scan', c`~fmt.Scan~ reads typed words (separated by spaces or new lines) into variables. Put ~&~ in front of each variable — it hands Scan the variable's **address** so it can fill it in. (More on ~&~ in the pointers lesson.)`, c`
var name string
var age int

fmt.Print("Name and age: ")
fmt.Scan(&name, &age)          // typing "Ada 36" fills both

fmt.Println(name, "will be", age+1, "next year")`),
  Q(c`Why ~fmt.Scan(&age)~ and not ~fmt.Scan(age)~?`, ['The & makes it read faster', 'Scan needs the address of age so it can change it', 'The & converts it to a string', 'It is optional'], 1),
  X({ q: c`Read the user's age and print:

~In 10 years you will be 30.~

(In the tests, the typed input is supplied automatically.)`, start: M(c`
    var age int
    fmt.Scan(&age)`), tests: [{ in: '20', out: 'In 10 years you will be 30.' }, { in: '41', out: 'In 10 years you will be 51.' }], hint: c`~Println~ would put a space before the full stop. Use ~fmt.Printf("In 10 years you will be %d.\n", age+10)~.`, sol: M(c`
    var age int
    fmt.Scan(&age)
    fmt.Printf("In 10 years you will be %d.\n", age+10)`) }),
  X({ q: c`Read a price (a decimal) and a quantity (a whole number) and print the total with two decimals:

~2.5 4~ → ~Total: 10.00~`, start: M(c`
    var price float64
    var qty int
    fmt.Scan(&price, &qty)`), tests: [{ in: '2.5 4', out: 'Total: 10.00' }, { in: '0.99 3', out: 'Total: 2.97' }], hint: c`Use ~Printf~ with ~%.2f~, and remember to convert ~qty~ to ~float64~ before multiplying.`, sol: M(c`
    var price float64
    var qty int
    fmt.Scan(&price, &qty)
    fmt.Printf("Total: %.2f\n", price*float64(qty))`) }),
] },
],
quiz: [
  P(c`fmt.Println(9 / 2)`, '4'),
  P(c`fmt.Println("Go", 1, 2.5)`, 'Go 1 2.5'),
  Q(c`What does ~x := 5~ do?`, ['Compares x with 5', 'Declares a new variable x holding 5', 'Changes a constant', 'Imports a package'], 1),
  Q(c`A variable declared with ~var n int~ and no value holds…`, ['garbage', 'nil', '0', 'an error'], 2),
  P(c`fmt.Printf("%T\n", 3.0)`, 'float64'),
  F('Read a number into n.', c`
var n int
fmt.Scan([[&n]])
fmt.Println(n)`),
] });

/* ============ TOPIC 2: DECISIONS & LOOPS ============ */
topic({ id: 'flow', title: 'Decisions & Loops', icon: '🔀', color: '#ff9600', blurb: 'if, switch and the one loop Go needs.',
lessons: [
{ id: 'if', title: 'if and else', icon: '🚦', desc: 'No brackets, always braces.',
  v: [['1:24:24', '1:38:00', 'If-else & conditionals']],
  steps: [
  T('Choosing a path', c`Go's ~if~ needs **no** round brackets but **always** needs braces. ~else~ goes on the same line as the closing ~}~. Combine conditions with ~&&~ (and), ~||~ (or) and ~!~ (not).`, c`
temp := 31

if temp > 30 {
    fmt.Println("Too hot")
} else if temp > 15 {
    fmt.Println("Nice")
} else {
    fmt.Println("Too cold")
}

// an if can start with a short statement; n only exists inside the if
if n := len("gopher"); n > 5 {
    fmt.Println("long word")
}`, c`Strings compare with ~==~ in Go — no ~.equals()~ needed.`),
  P(c`
score := 85
if score >= 50 {
    fmt.Println("D")
} else if score >= 80 {
    fmt.Println("A")
}`, 'D', c`The first matching branch wins. Check the strictest condition first.`),
  P(c`
age, member := 16, true
fmt.Println(age >= 18 || member, age >= 18 && member)`, 'true false'),
  X({ q: c`Read an age and print exactly one word:

under 13 → ~Child~ · under 20 → ~Teen~ · under 65 → ~Adult~ · otherwise ~Senior~`, start: M(c`
    var age int
    fmt.Scan(&age)`), tests: [{ in: '8', out: 'Child' }, { in: '13', out: 'Teen' }, { in: '30', out: 'Adult' }, { in: '65', out: 'Senior' }], sol: M(c`
    var age int
    fmt.Scan(&age)

    if age < 13 {
        fmt.Println("Child")
    } else if age < 20 {
        fmt.Println("Teen")
    } else if age < 65 {
        fmt.Println("Adult")
    } else {
        fmt.Println("Senior")
    }`) }),
  X({ q: c`Read a username and a password. Print ~Welcome~ only if the username is ~admin~ **and** the password is ~opensesame~; otherwise ~Access denied~.`, start: M(c`
    var user, pass string
    fmt.Scan(&user, &pass)`), tests: [{ in: 'admin opensesame', out: 'Welcome' }, { in: 'admin letmein', out: 'Access denied' }, { in: 'guest opensesame', out: 'Access denied' }], must: [[c`&&`, c`Combine the two checks with ~&&~.`]], sol: M(c`
    var user, pass string
    fmt.Scan(&user, &pass)

    if user == "admin" && pass == "opensesame" {
        fmt.Println("Welcome")
    } else {
        fmt.Println("Access denied")
    }`) }),
] },

{ id: 'for', title: 'for: the only loop', icon: '🔁', desc: 'Counting, while-style and forever.',
  v: [['1:11:12', '1:24:24', 'Loops']],
  steps: [
  T('One loop, three shapes', c`Go has no ~while~ and no ~do-while~. The ~for~ loop does every job:`, c`
for i := 1; i <= 3; i++ {        // counting
    fmt.Println("Round", i)
}

n := 1
for n < 100 {                    // while-style
    n *= 2
}

for {                            // forever, until break
    // ...
    break
}`, c`~break~ leaves the loop; ~continue~ jumps to the next round.`),
  P(c`
total := 0
for i := 1; i <= 4; i++ {
    total += i
}
fmt.Println(total)`, '10'),
  P(c`
n := 1
for n < 50 {
    n *= 3
}
fmt.Println(n)`, '81'),
  P(c`
for i := 1; i <= 6; i++ {
    if i%2 == 0 {
        continue
    }
    if i == 5 {
        break
    }
    fmt.Print(i, " ")
}`, '1 3'),
  X({ q: c`Read a number and print its times table from 1 to 10:

~7 x 1 = 7~
…
~7 x 10 = 70~`, start: M(c`
    var n int
    fmt.Scan(&n)`), tests: [{ in: '7', has: ['7 x 1 = 7\n7 x 2 = 14', '7 x 10 = 70'] }, { in: '3', has: ['3 x 4 = 12'] }], must: [[c`\bfor\b`, c`Use a ~for~ loop.`]], sol: M(c`
    var n int
    fmt.Scan(&n)
    for i := 1; i <= 10; i++ {
        fmt.Printf("%d x %d = %d\n", n, i, n*i)
    }`) }),
  X({ q: c`Read whole numbers until a ~0~ is entered, then print their sum.

~5 3 2 0~ → ~10~`, start: M(c`
    sum := 0
    fmt.Println(sum)`), tests: [{ in: '5 3 2 0', out: '10' }, { in: '0', out: '0' }, { in: '100 -40 0', out: '60' }], sol: M(c`
    sum := 0
    for {
        var n int
        fmt.Scan(&n)
        if n == 0 {
            break
        }
        sum += n
    }
    fmt.Println(sum)`) }),
  X({ q: c`**Guessing game.** The secret number is ~42~. Read guesses until the player gets it, printing ~Too high~ or ~Too low~ for each wrong one. Finish with ~Correct! 3 guesses~ (the real count).`, start: M(c`
    secret := 42
    fmt.Println(secret)`), tests: [{ in: '50 30 42', out: 'Too high\nToo low\nCorrect! 3 guesses' }, { in: '42', out: 'Correct! 1 guesses' }], sol: M(c`
    secret := 42
    guesses := 0
    for {
        var guess int
        fmt.Scan(&guess)
        guesses++
        if guess > secret {
            fmt.Println("Too high")
        } else if guess < secret {
            fmt.Println("Too low")
        } else {
            break
        }
    }
    fmt.Printf("Correct! %d guesses\n", guesses)`) }),
] },

{ id: 'switch', title: 'switch', icon: '🎛️', desc: 'Cleaner than a ladder of else ifs.',
  v: [['1:54:02', '1:58:37', 'Switch statement']],
  steps: [
  T('No break needed', c`Go's ~switch~ runs the **first** matching case and stops — there is no fall-through, so no ~break~. One case can list several values. A switch with **no** value works like a tidy if/else chain.`, c`
switch day {
case "Sat", "Sun":
    fmt.Println("Weekend!")
case "Fri":
    fmt.Println("Almost there")
default:
    fmt.Println("Weekday")
}

switch {                      // no value: each case is a condition
case temp > 30:
    fmt.Println("hot")
case temp < 10:
    fmt.Println("cold")
}`),
  P(c`
n := 3
switch n {
case 1:
    fmt.Println("one")
case 2, 3:
    fmt.Println("two or three")
default:
    fmt.Println("many")
}`, 'two or three'),
  X({ q: c`Read a day name. Print ~Weekend~ for Saturday or Sunday, ~Weekday~ for Monday to Friday, and ~Not a day~ for anything else.`, start: M(c`
    var day string
    fmt.Scan(&day)`), tests: [{ in: 'Saturday', out: 'Weekend' }, { in: 'Monday', out: 'Weekday' }, { in: 'Friday', out: 'Weekday' }, { in: 'Funday', out: 'Not a day' }], must: [[c`\bswitch\b`, c`Use a ~switch~.`]], sol: M(c`
    var day string
    fmt.Scan(&day)

    switch day {
    case "Saturday", "Sunday":
        fmt.Println("Weekend")
    case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday":
        fmt.Println("Weekday")
    default:
        fmt.Println("Not a day")
    }`) }),
  X({ q: c`**Calculator.** Read a number, an operator (~+ - * /~) and another number, like ~8 * 2.5~, and print the result with ~Println~.

Dividing by zero prints ~Cannot divide by zero~; any other operator prints ~Unknown operator~.`, start: M(c`
    var a, b float64
    var op string
    fmt.Scan(&a, &op, &b)`), tests: [{ in: '8 * 2.5', out: '20' }, { in: '9 - 4', out: '5' }, { in: '7 / 2', out: '3.5' }, { in: '7 / 0', out: 'Cannot divide by zero' }, { in: '1 ^ 2', out: 'Unknown operator' }], must: [[c`\bswitch\b`, c`Use a ~switch~ on the operator.`]], sol: M(c`
    var a, b float64
    var op string
    fmt.Scan(&a, &op, &b)

    switch op {
    case "+":
        fmt.Println(a + b)
    case "-":
        fmt.Println(a - b)
    case "*":
        fmt.Println(a * b)
    case "/":
        if b == 0 {
            fmt.Println("Cannot divide by zero")
        } else {
            fmt.Println(a / b)
        }
    default:
        fmt.Println("Unknown operator")
    }`) }),
] },
],
quiz: [
  Q(c`Which loop keywords does Go have?`, [c`~for~, ~while~ and ~do~`, c`Only ~for~`, c`~for~ and ~while~`, c`~loop~`], 1),
  P(c`
i := 0
for i < 3 {
    fmt.Print(i)
    i++
}`, '012'),
  P(c`
x := 7
switch {
case x > 5:
    fmt.Println("big")
case x > 2:
    fmt.Println("medium")
}`, 'big', c`Only the first matching case runs.`),
  Q(c`What is wrong with ~if (x > 3)~ followed by the brace on the next line?`, ['Nothing', 'The brackets are not allowed', 'The { must be on the same line', 'if needs then'], 2),
  F('Count from 1 to 5.', c`
for i := 1; i [[<=]] 5; [[i++]] {
    fmt.Println(i)
}`),
] });

/* ============ TOPIC 3: FUNCTIONS ============ */
topic({ id: 'functions', title: 'Functions & Errors', icon: '🧩', color: '#2b70c9', blurb: 'Several return values, errors as values, defer and closures.',
lessons: [
{ id: 'funcs', title: 'Writing functions', icon: '🔧', desc: 'Parameters and return types.',
  v: [['1:58:37', '2:16:00', 'Functions']],
  steps: [
  T('func', c`A function lists its parameters with their types, then its **return type**. Functions sit outside ~main~.`, c`
func square(n int) int {
    return n * n
}

func greet(name string) {          // no return type: returns nothing
    fmt.Println("Hi", name)
}

func add(a, b int) int {           // a and b share the type
    return a + b
}

func main() {
    greet("Ada")
    fmt.Println(square(7), add(2, 3))   // 49 5
}`),
  P(c`
package main

import "fmt"

func add(a, b int) int {
    return a + b
}

func main() {
    fmt.Println(add(2, 3) * add(1, 1))
}`, '10'),
  X({ q: c`Write ~func toCelsius(f float64) float64~ using ~(f - 32) * 5 / 9~. ~main~ already reads a temperature and prints the result with one decimal.`, start: c`package main

import "fmt"

// write toCelsius here

func main() {
    var f float64
    fmt.Scan(&f)
    fmt.Printf("%.1f\n", toCelsius(f))
}
`, tests: [{ in: '212', out: '100.0' }, { in: '50', out: '10.0' }, { in: '98.6', out: '37.0' }], must: [[c`func\s+toCelsius\s*\(\s*\w+\s+float64\s*\)\s*float64`, c`Write ~func toCelsius(f float64) float64~.`]], sol: c`package main

import "fmt"

func toCelsius(f float64) float64 {
    return (f - 32) * 5 / 9
}

func main() {
    var f float64
    fmt.Scan(&f)
    fmt.Printf("%.1f\n", toCelsius(f))
}
` }),
  X({ q: c`Write ~func isPalindrome(word string) bool~ that returns ~true~ if the word reads the same backwards (ignore upper/lower case — ~strings.ToLower~ helps).`, start: c`package main

import "fmt"

// write isPalindrome here

func main() {
    var word string
    fmt.Scan(&word)
    fmt.Println(isPalindrome(word))
}
`, tests: [{ in: 'Racecar', out: 'true' }, { in: 'level', out: 'true' }, { in: 'gopher', out: 'false' }], must: [[c`func\s+isPalindrome`, c`Write ~func isPalindrome(word string) bool~.`]], hint: c`Compare ~w[i]~ with ~w[len(w)-1-i]~ for the first half of the word. Remember to ~import "strings"~ if you use it.`, sol: c`package main

import (
    "fmt"
    "strings"
)

func isPalindrome(word string) bool {
    w := strings.ToLower(word)
    for i := 0; i < len(w)/2; i++ {
        if w[i] != w[len(w)-1-i] {
            return false
        }
    }
    return true
}

func main() {
    var word string
    fmt.Scan(&word)
    fmt.Println(isPalindrome(word))
}
` }),
] },

{ id: 'errors', title: 'Multiple returns & errors', icon: '⚠️', desc: 'Go\'s way of saying "that did not work".',
  v: [['2:16:00', '2:37:16', 'Returning multiple values']],
  steps: [
  T('More than one result', c`A Go function can return **several** values. Use ~_~ to ignore one you do not need.`, c`
func divmod(a, b int) (int, int) {
    return a / b, a % b
}

q, r := divmod(17, 5)      // 3 2
_, rem := divmod(9, 4)     // just the remainder: 1`),
  T('Errors are values', c`Go has no exceptions. A function that can fail returns an extra ~error~ value: ~nil~ means "all good". You check it **straight away**:`, c`
n, err := strconv.Atoi("42x")      // text → int
if err != nil {
    fmt.Println("Not a number:", err)
    return
}
fmt.Println(n * 2)

// your own functions make errors with errors.New or fmt.Errorf
func withdraw(balance, amount float64) (float64, error) {
    if amount > balance {
        return balance, errors.New("insufficient funds")
    }
    return balance - amount, nil
}`, c`~if err != nil~ is the most common line in all of Go. It looks repetitive, but you always see exactly where something can fail.`),
  P(c`
package main

import "fmt"

func minMax(a, b int) (int, int) {
    if a < b {
        return a, b
    }
    return b, a
}

func main() {
    lo, hi := minMax(9, 4)
    fmt.Println(lo, hi)
}`, '4 9'),
  P(c`
_, err := strconv.Atoi("seven")
fmt.Println(err == nil)`, 'false'),
  X({ q: c`Read a word. If it is a whole number, print it doubled; otherwise print ~Not a number~. Use ~strconv.Atoi~ and check its error.`, start: M(c`
    var text string
    fmt.Scan(&text)`), tests: [{ in: '21', out: '42' }, { in: 'twelve', out: 'Not a number' }, { in: '-5', out: '-10' }], must: [[c`strconv\.Atoi`, c`Use ~strconv.Atoi~.`], [c`err\s*!=\s*nil`, c`Check ~if err != nil~.`]], sol: M(c`
    var text string
    fmt.Scan(&text)
    n, err := strconv.Atoi(text)
    if err != nil {
        fmt.Println("Not a number")
        return
    }
    fmt.Println(n * 2)`) }),
  X({ q: c`Write ~func divide(a, b float64) (float64, error)~. When ~b~ is 0 it returns an error made with ~errors.New("cannot divide by zero")~. ~main~ is ready.`, start: c`package main

import (
    "errors"
    "fmt"
)

// write divide here

func main() {
    pairs := [][2]float64{{10, 4}, {7, 0}}
    for _, p := range pairs {
        result, err := divide(p[0], p[1])
        if err != nil {
            fmt.Println("Error:", err)
            continue
        }
        fmt.Println(result)
    }
}
`, tests: [{ out: '2.5\nError: cannot divide by zero' }], must: [[c`errors\.New`, c`Use ~errors.New(...)~.`]], sol: c`package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}

func main() {
    pairs := [][2]float64{{10, 4}, {7, 0}}
    for _, p := range pairs {
        result, err := divide(p[0], p[1])
        if err != nil {
            fmt.Println("Error:", err)
            continue
        }
        fmt.Println(result)
    }
}
` }),
] },

{ id: 'defer', title: 'defer & closures', icon: '🎁', desc: 'Clean up later; functions that remember.',
  v: [['1:58:37', '2:05:00', 'Functions (recap)']],
  steps: [
  T('defer', c`~defer~ schedules a call to run when the surrounding function **finishes** — however it finishes. It is used for clean-up: closing files, unlocking, printing a footer. Several defers run in **reverse** order.`, c`
func main() {
    defer fmt.Println("3. goodbye")
    fmt.Println("1. hello")
    fmt.Println("2. working")
}`),
  T('Functions as values', c`Functions are values: store them in variables, pass them around, return them. A function that uses variables from around it is a **closure**, and it keeps them alive.`, c`
double := func(n int) int { return n * 2 }
fmt.Println(double(21))            // 42

func counter() func() int {
    count := 0
    return func() int {
        count++                    // remembers count between calls
        return count
    }
}`),
  P(c`
for i := 1; i <= 3; i++ {
    defer fmt.Print(i, " ")
}
fmt.Print("go ")`, 'go 3 2 1', c`Deferred calls stack up and run last-in, first-out.`),
  P(c`
package main

import "fmt"

func counter() func() int {
    n := 0
    return func() int {
        n++
        return n
    }
}

func main() {
    a, b := counter(), counter()
    a()
    a()
    fmt.Println(a(), b())
}`, '3 1', c`Each counter has its own ~n~.`),
  X({ q: c`Write ~func multiplier(n int) func(int) int~ that returns a function multiplying its argument by ~n~. The program prints ~10 21~.`, start: c`package main

import "fmt"

// write multiplier here

func main() {
    double := multiplier(2)
    triple := multiplier(3)
    fmt.Println(double(5), triple(7))
}
`, tests: [{ out: '10 21' }], must: [[c`func\s+multiplier\s*\(\s*\w+\s+int\s*\)\s*func\s*\(\s*int\s*\)\s*int`, c`~func multiplier(n int) func(int) int~`]], sol: c`package main

import "fmt"

func multiplier(n int) func(int) int {
    return func(x int) int {
        return x * n
    }
}

func main() {
    double := multiplier(2)
    triple := multiplier(3)
    fmt.Println(double(5), triple(7))
}
` }),
] },
],
quiz: [
  Q(c`What does a Go function usually return to say it failed?`, ['It throws an exception', c`An extra ~error~ value that is not ~nil~`, c`~-1~`, 'It prints a message'], 1),
  P(c`
n, err := strconv.Atoi("12")
fmt.Println(n+1, err)`, '13 <nil>'),
  Q(c`When does a deferred call run?`, ['Immediately', 'When the surrounding function finishes', 'When the program starts', 'Never, unless called'], 1),
  F('Ignore the first value.', c`
q, r := 17/5, 17%5
[[_]], rem := q, r
fmt.Println(rem)`),
] });

/* ============ TOPIC 4: COLLECTIONS ============ */
topic({ id: 'collections', title: 'Slices, Maps & Strings', icon: '🗃️', color: '#ffc800', blurb: 'Lists that grow, lookups by key, and the strings package.',
lessons: [
{ id: 'slices', title: 'Arrays and slices', icon: '📚', desc: 'append, len, range and slicing.',
  v: [['0:57:16', '1:11:12', 'Arrays & slices']],
  steps: [
  T('Slices', c`An **array** has a fixed size: ~[3]int~. A **slice** can grow, so it is what you use almost always: ~[]int~.`, c`
nums := []int{10, 20, 30}
nums = append(nums, 40)        // add to the end (keep the result!)

fmt.Println(nums[0], len(nums))   // 10 4
fmt.Println(nums[1:3])            // [20 30] — from 1 up to (not including) 3

for i, n := range nums {          // index and value
    fmt.Println(i, n)
}
for _, n := range nums {          // just the values
    fmt.Println(n)
}

names := make([]string, 3)        // 3 empty strings`, c`Going past the end — ~nums[10]~ — makes the program **panic**: ~index out of range~.`),
  P(c`
s := []int{1, 2, 3}
s = append(s, 4, 5)
fmt.Println(len(s), s[len(s)-1])`, '5 5'),
  P(c`
letters := []string{"a", "b", "c", "d", "e"}
fmt.Println(letters[1:4], letters[:2])`, '[b c d] [a b]'),
  P(c`
total := 0
for _, v := range []int{4, 5, 6} {
    total += v
}
fmt.Println(total)`, '15'),
  X({ q: c`Read 5 whole numbers into a slice, then print them in **reverse** order, separated by spaces.

~1 2 3 4 5~ → ~5 4 3 2 1~`, start: M(c`
    nums := []int{}
    fmt.Println(nums)`), tests: [{ in: '1 2 3 4 5', out: '5 4 3 2 1' }, { in: '9 0 7 0 3', out: '3 0 7 0 9' }], must: [[c`append\s*\(`, c`Add each number with ~append~.`]], sol: M(c`
    nums := []int{}
    for i := 0; i < 5; i++ {
        var n int
        fmt.Scan(&n)
        nums = append(nums, n)
    }
    for i := len(nums) - 1; i >= 0; i-- {
        fmt.Print(nums[i], " ")
    }
    fmt.Println()`) }),
  X({ q: c`Read how many scores there are, then the scores. Print the highest and the average (one decimal):

~4~ then ~70 85 90 61~ →
~Highest: 90~
~Average: 76.5~`, start: M(c`
    var n int
    fmt.Scan(&n)
    scores := make([]int, n)
    fmt.Println(scores)`), tests: [{ in: '4\n70 85 90 61', out: 'Highest: 90\nAverage: 76.5' }, { in: '1\n42', out: 'Highest: 42\nAverage: 42.0' }], sol: M(c`
    var n int
    fmt.Scan(&n)
    scores := make([]int, n)
    for i := range scores {
        fmt.Scan(&scores[i])
    }

    highest, total := scores[0], 0
    for _, s := range scores {
        if s > highest {
            highest = s
        }
        total += s
    }
    fmt.Println("Highest:", highest)
    fmt.Printf("Average: %.1f\n", float64(total)/float64(n))`) }),
] },

{ id: 'maps', title: 'Maps', icon: '🗝️', desc: 'Look things up by key.',
  v: [['2:37:16', '2:53:20', 'Maps']],
  steps: [
  T('Key → value', c`A **map** stores pairs. Reading a missing key gives the zero value — use the **comma ok** form to tell "missing" from "zero".`, c`
ages := map[string]int{"Ada": 36, "Linus": 54}
ages["Grace"] = 85                 // add or replace
delete(ages, "Linus")

fmt.Println(ages["Ada"], len(ages))   // 36 2
fmt.Println(ages["Bob"])              // 0 — not there

age, ok := ages["Bob"]                // ok is false: Bob is missing
if !ok { fmt.Println("no Bob") }

counts := make(map[string]int)        // an empty map, ready to fill
counts["go"]++`, c`Looping over a map with ~range~ gives the keys in a **random** order, on purpose. To print in order, sort the keys first: ~sort.Strings(keys)~.`),
  P(c`
stock := map[string]int{"apple": 3}
stock["apple"] += 2
stock["pear"]++
fmt.Println(stock["apple"], stock["pear"], len(stock))`, '5 1 2'),
  P(c`
m := map[string]bool{"x": false}
v, ok := m["x"]
w, ok2 := m["y"]
fmt.Println(v, ok, w, ok2)`, 'false true false false'),
  X({ q: c`**Vote counter.** Read names until ~done~, then print the winner and their votes:

~Ada Bo Ada Cy Ada Bo done~ → ~Ada wins with 3 votes~`, start: M(c`
    votes := make(map[string]int)
    fmt.Println(votes)`), tests: [{ in: 'Ada Bo Ada Cy Ada Bo done', out: 'Ada wins with 3 votes' }, { in: 'Cy Bo Bo done', out: 'Bo wins with 2 votes' }], sol: M(c`
    votes := make(map[string]int)
    for {
        var name string
        fmt.Scan(&name)
        if name == "done" {
            break
        }
        votes[name]++
    }

    winner, most := "", 0
    for name, n := range votes {
        if n > most {
            winner, most = name, n
        }
    }
    fmt.Printf("%s wins with %d votes\n", winner, most)`) }),
  X({ q: c`**Word counter.** Read words until ~end~ and print how often each appears, in **alphabetical** order:

~the cat and the hat end~ →
~and: 1~
~cat: 1~
~hat: 1~
~the: 2~`, start: M(c`
    counts := make(map[string]int)
    fmt.Println(counts)`), tests: [{ in: 'the cat and the hat end', out: 'and: 1\ncat: 1\nhat: 1\nthe: 2' }, { in: 'go go go end', out: 'go: 3' }], must: [[c`sort\.`, c`Sort the keys with ~sort.Strings~.`]], hint: c`Collect the keys into a slice, ~sort.Strings(keys)~, then loop over the sorted slice.`, sol: M(c`
    counts := make(map[string]int)
    for {
        var w string
        fmt.Scan(&w)
        if w == "end" {
            break
        }
        counts[w]++
    }

    keys := []string{}
    for k := range counts {
        keys = append(keys, k)
    }
    sort.Strings(keys)
    for _, k := range keys {
        fmt.Printf("%s: %d\n", k, counts[k])
    }`) }),
] },

{ id: 'strings', title: 'The strings package', icon: '🔤', desc: 'Split, join, search — and reading whole lines.',
  v: [['0:33:43', '0:45:18', 'Data types (strings)']],
  steps: [
  T('strings and strconv', c`Go's strings cannot be changed; the **strings** package returns new ones. **strconv** converts between text and numbers.`, c`
s := "Hello, Gopher"

strings.ToUpper(s)              // "HELLO, GOPHER"
strings.Contains(s, "Go")       // true
strings.Index(s, "G")           // 7    (-1 if missing)
strings.Replace(s, "l", "L", -1) // "HeLLo, Gopher"  (-1 = all)
strings.Split("a,b,c", ",")     // []string{"a", "b", "c"}
strings.Fields("  go  is fun ") // []string{"go", "is", "fun"}  split on spaces
strings.Join([]string{"a", "b"}, "-")  // "a-b"
strings.Repeat("ab", 3)         // "ababab"
strings.TrimSpace("  hi  ")     // "hi"

strconv.Itoa(42)                // "42"
s[0:5]                          // "Hello" — slicing works on strings too`),
  T('Reading a whole line', c`~fmt.Scan~ stops at spaces. To read a full line, use a **bufio.Scanner**:`, c`
reader := bufio.NewScanner(os.Stdin)
reader.Scan()                    // read one line
line := reader.Text()            // "the whole line, spaces and all"

for reader.Scan() {              // or: every remaining line
    fmt.Println(reader.Text())
}`),
  P(c`fmt.Println(strings.Join(strings.Fields(" go   is  fun "), "_"))`, 'go_is_fun'),
  P(c`
parts := strings.Split("ada@code.org", "@")
fmt.Println(len(parts), parts[1])`, '2 code.org'),
  X({ q: c`Read an email address and split it at the ~@~:

~ada@code.org~ →
~Username: ada~
~Domain: code.org~`, start: M(c`
    var email string
    fmt.Scan(&email)`), tests: [{ in: 'ada@code.org', out: 'Username: ada\nDomain: code.org' }, { in: 'linus@kernel.io', out: 'Username: linus\nDomain: kernel.io' }], must: [[c`strings\.`, c`Use the ~strings~ package (~Split~ or ~Index~).`]], sol: M(c`
    var email string
    fmt.Scan(&email)
    parts := strings.Split(email, "@")
    fmt.Println("Username:", parts[0])
    fmt.Println("Domain:", parts[1])`) }),
  X({ q: c`Read a whole line of text and print how many words it has and the longest word (the first one, if there is a tie):

~Go is fun to learn~ →
~Words: 5~
~Longest: learn~`, start: M(c`
    reader := bufio.NewScanner(os.Stdin)
    reader.Scan()
    line := reader.Text()
    fmt.Println(line)`), tests: [{ in: 'Go is fun to learn\n', out: 'Words: 5\nLongest: learn' }, { in: 'gophers dig tunnels\n', out: 'Words: 3\nLongest: gophers' }], must: [[c`strings\.Fields`, c`Split the line with ~strings.Fields~.`]], sol: M(c`
    reader := bufio.NewScanner(os.Stdin)
    reader.Scan()
    line := reader.Text()

    words := strings.Fields(line)
    longest := ""
    for _, w := range words {
        if len(w) > len(longest) {
            longest = w
        }
    }
    fmt.Println("Words:", len(words))
    fmt.Println("Longest:", longest)`) }),
] },
],
quiz: [
  P(c`
s := []int{1, 2}
s = append(s, 3)
fmt.Println(s, len(s))`, '[1 2 3] 3'),
  P(c`
m := map[string]int{}
m["a"]++
m["a"]++
fmt.Println(m["a"], m["b"])`, '2 0'),
  Q(c`Why does printing a map with ~range~ give a different order each run?`, ['It is a bug', 'Go randomises map order on purpose', 'Maps are sorted by value', 'The keys are hashed into a slice'], 1),
  P(c`fmt.Println(strings.ToUpper("go")+strings.Repeat("!", 3))`, 'GO!!!'),
  F('Loop over the values only.', c`
nums := []int{1, 2, 3}
for [[_]], n := [[range]] nums {
    fmt.Println(n)
}`),
] });
