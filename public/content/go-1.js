/* ================= Go: topics 5-8 ================= */
G('pointer', c`Holds the address of a variable: ~p := &x~. ~*p~ reads or changes the variable it points to.`);
G('struct', c`Groups named fields into one type: ~type Player struct { Name string; Level int }~`);
G('method', c`A function attached to a type: ~func (p Player) Describe() string~.`);
G('pointer receiver', c`~func (a *Account) Deposit(x float64)~ — the method can change the original value, not a copy.`);
G('interface', c`A set of methods. Any type that has them satisfies the interface automatically — no ~implements~ keyword.`);
G('Stringer', c`Any type with a ~String() string~ method. ~fmt~ uses it when printing the value.`);
G('type switch', c`~switch v := x.(type) { case int: ... case string: ... }~ — do different things by the value's real type.`);
G('errors.Is', c`Checks whether an error is (or wraps) a particular error value, like ~ErrNotFound~.`);
G('goroutine', c`A function running at the same time as the rest of the program: ~go work()~. Very cheap — thousands are fine.`);
G('WaitGroup', c`Waits for goroutines to finish: ~wg.Add(1)~ before starting one, ~wg.Done()~ when it ends, ~wg.Wait()~ to wait for all.`);
G('channel', c`A pipe between goroutines: ~ch <- v~ sends, ~v := <-ch~ receives. ~make(chan int)~ makes one.`);
G('Mutex', c`A lock: only one goroutine at a time can hold it. ~mu.Lock()~ … ~mu.Unlock()~ protects shared data.`);
G('select', c`Waits on several channel operations and runs whichever is ready first.`);

/* ============ TOPIC 5: STRUCTS, POINTERS & METHODS ============ */
topic({ id: 'structs', title: 'Structs & Pointers', icon: '🧱', color: '#ff4b4b', blurb: 'Your own types, addresses, and methods that change things.',
lessons: [
{ id: 'pointers', title: 'Pointers', icon: '👉', desc: 'Addresses, & and *.',
  v: [['0:47:19', '0:57:16', 'Pointers']],
  steps: [
  T('Where a variable lives', c`Every variable lives at an **address** in memory. ~&x~ gives that address; a variable holding it is a **pointer**. ~*p~ follows the pointer to the original variable.`, c`
x := 10
p := &x           // p points to x (its type is *int)

fmt.Println(*p)   // 10 — read through the pointer
*p = 20           // change x through the pointer
fmt.Println(x)    // 20`, c`This is why ~fmt.Scan(&age)~ needs the ~&~: it gets the address, so it can fill in your variable.`),
  T('Why bother?', c`Go passes **copies** to functions. To let a function change your variable, pass a pointer to it.`, c`
func resetCopy(n int)  { n = 0 }    // changes its own copy: no effect outside
func reset(n *int)     { *n = 0 }   // changes the original

score := 50
resetCopy(score)    // score is still 50
reset(&score)       // score is now 0`),
  P(c`
x := 10
p := &x
*p = *p + 5
fmt.Println(x)`, '15'),
  P(c`
package main

import "fmt"

func addOne(n int) {
    n++
}

func main() {
    n := 1
    addOne(n)
    fmt.Println(n)
}`, '1', c`~addOne~ got a copy.`),
  X({ q: c`Write ~func double(n *int)~ that doubles the variable it points to. The program prints ~42~.`, start: c`package main

import "fmt"

// write double here

func main() {
    n := 21
    double(&n)
    fmt.Println(n)
}
`, tests: [{ out: '42' }], must: [[c`func\s+double\s*\(\s*\w+\s+\*int\s*\)`, c`~func double(n *int)~`]], sol: c`package main

import "fmt"

func double(n *int) {
    *n *= 2
}

func main() {
    n := 21
    double(&n)
    fmt.Println(n)
}
` }),
  X({ q: c`Write ~func swap(a, b *int)~ that swaps two variables. ~main~ reads two numbers, swaps them and prints them.

~3 8~ → ~8 3~`, start: c`package main

import "fmt"

// write swap here

func main() {
    var a, b int
    fmt.Scan(&a, &b)
    swap(&a, &b)
    fmt.Println(a, b)
}
`, tests: [{ in: '3 8', out: '8 3' }, { in: '5 -1', out: '-1 5' }], must: [[c`func\s+swap\s*\(`, c`Write ~func swap(a, b *int)~.`]], hint: c`Go can swap in one line: ~*a, *b = *b, *a~`, sol: c`package main

import "fmt"

func swap(a, b *int) {
    *a, *b = *b, *a
}

func main() {
    var a, b int
    fmt.Scan(&a, &b)
    swap(&a, &b)
    fmt.Println(a, b)
}
` }),
] },

{ id: 'structs', title: 'Structs', icon: '📇', desc: 'Your own types with named fields.',
  v: [['2:53:20', '3:02:15', 'Structs']],
  steps: [
  T('type ... struct', c`A **struct** groups related fields into a new type. Go has no classes: structs (plus methods, next lesson) do that job.`, c`
type Player struct {
    Name  string
    Level int
}

p := Player{Name: "Link", Level: 3}
p.Level++
fmt.Println(p)               // {Link 4}
fmt.Printf("%+v\n", p)       // {Name:Link Level:4}

team := []Player{
    {Name: "Zelda", Level: 9},
    {Name: "Mario", Level: 5},
}
for _, pl := range team {
    fmt.Println(pl.Name)
}`, c`Assigning a struct **copies** it. Use a pointer (~&p~) when you want to share one.`),
  P(c`
package main

import "fmt"

type Point struct {
    X, Y int
}

func main() {
    p := Point{3, 4}
    p.X *= 2
    fmt.Println(p, p.X+p.Y)
}`, '{6 4} 10'),
  P(c`
package main

import "fmt"

type Box struct {
    Size int
}

func main() {
    a := Box{1}
    b := a
    b.Size = 99
    c := &a
    c.Size = 5
    fmt.Println(a.Size, b.Size)
}`, '5 99', c`~b~ is a copy; ~c~ points at ~a~ itself. (Go lets you write ~c.Size~ instead of ~(*c).Size~.)`),
  X({ q: c`Print the names of products that cost **under 100** and are in stock, joined with commas: ~Mouse,Cable~`, start: c`package main

import "fmt"

type Product struct {
    Name  string
    Price float64
    Stock int
}

func main() {
    products := []Product{
        {"Mouse", 20, 40},
        {"Monitor", 189, 6},
        {"Keyboard", 50, 0},
        {"Cable", 8, 120},
    }
    fmt.Println(len(products))
}
`, tests: [{ out: 'Mouse,Cable' }], hint: c`Collect the names in a ~[]string~, then ~strings.Join(names, ",")~ — and add ~"strings"~ to the imports.`, sol: c`package main

import (
    "fmt"
    "strings"
)

type Product struct {
    Name  string
    Price float64
    Stock int
}

func main() {
    products := []Product{
        {"Mouse", 20, 40},
        {"Monitor", 189, 6},
        {"Keyboard", 50, 0},
        {"Cable", 8, 120},
    }
    names := []string{}
    for _, p := range products {
        if p.Price < 100 && p.Stock > 0 {
            names = append(names, p.Name)
        }
    }
    fmt.Println(strings.Join(names, ","))
}
` }),
] },

{ id: 'methods', title: 'Methods', icon: '🔧', desc: 'Functions that belong to a type.',
  v: [['2:53:20', '3:02:15', 'Structs (recap)']],
  steps: [
  T('Receivers', c`A **method** is a function with a **receiver** written before its name. A value receiver gets a copy; a **pointer receiver** (~*T~) can change the original.`, c`
type Rect struct {
    W, H float64
}

func (r Rect) Area() float64 {        // value receiver: only reads
    return r.W * r.H
}

func (r *Rect) Scale(f float64) {     // pointer receiver: changes r
    r.W *= f
    r.H *= f
}

box := Rect{2, 3}
box.Scale(2)                // Go takes &box for you
fmt.Println(box.Area())     // 24`, c`Rule of thumb: if any method needs to change the struct, give them all pointer receivers.`),
  P(c`
package main

import "fmt"

type Counter struct {
    N int
}

func (c Counter) BumpCopy() { c.N++ }
func (c *Counter) Bump()    { c.N++ }

func main() {
    var c Counter
    c.BumpCopy()
    c.Bump()
    c.Bump()
    fmt.Println(c.N)
}`, '2', c`~BumpCopy~ changed a copy, so only the two ~Bump~ calls count.`),
  X({ q: c`Give ~Account~ two methods with **pointer** receivers: ~Deposit(amount float64)~, and ~Withdraw(amount float64)~ which prints ~Insufficient funds~ and changes nothing when the amount is too big.

Expected output:
~Insufficient funds~
~Balance: 70~`, start: c`package main

import "fmt"

type Account struct {
    Owner   string
    Balance float64
}

// write Deposit and Withdraw here

func main() {
    acc := Account{Owner: "Ada"}
    acc.Deposit(100)
    acc.Withdraw(30)
    acc.Withdraw(500)
    fmt.Println("Balance:", acc.Balance)
}
`, tests: [{ out: 'Insufficient funds\nBalance: 70' }], must: [[c`func\s*\(\s*\w+\s+\*Account\s*\)\s*Deposit`, c`~func (a *Account) Deposit(amount float64)~`], [c`func\s*\(\s*\w+\s+\*Account\s*\)\s*Withdraw`, c`~func (a *Account) Withdraw(amount float64)~`]], sol: c`package main

import "fmt"

type Account struct {
    Owner   string
    Balance float64
}

func (a *Account) Deposit(amount float64) {
    a.Balance += amount
}

func (a *Account) Withdraw(amount float64) {
    if amount > a.Balance {
        fmt.Println("Insufficient funds")
        return
    }
    a.Balance -= amount
}

func main() {
    acc := Account{Owner: "Ada"}
    acc.Deposit(100)
    acc.Withdraw(30)
    acc.Withdraw(500)
    fmt.Println("Balance:", acc.Balance)
}
` }),
] },
],
quiz: [
  P(c`
a := 5
b := &a
*b = 7
fmt.Println(a)`, '7'),
  Q(c`What does ~&x~ give you?`, ['The value of x', 'The address of x', 'A copy of x', 'x as text'], 1),
  Q(c`Which receiver lets a method change the struct it is called on?`, [c`~func (r Rect)~`, c`~func (r *Rect)~`, c`~func Rect(r)~`, 'Any receiver can'], 1),
  P(c`
package main

import "fmt"

type P struct{ X int }

func main() {
    ps := []P{{1}, {2}, {3}}
    t := 0
    for _, p := range ps {
        t += p.X
    }
    fmt.Println(t)
}`, '6'),
] });

/* ============ TOPIC 6: INTERFACES ============ */
topic({ id: 'interfaces', title: 'Interfaces & Errors', icon: '🔌', color: '#1c8ef6', blurb: 'Behaviour as a type, Stringers, type switches and proper errors.',
lessons: [
{ id: 'interfaces', title: 'Interfaces', icon: '🔌', desc: 'Satisfied automatically.',
  v: [['2:53:20', '3:02:15', 'Structs and types']],
  steps: [
  T('Behaviour, not family', c`An **interface** lists methods. Any type that has those methods **automatically** satisfies it — there is no ~implements~ keyword. Code written for the interface then works with all of them.`, c`
type Shape interface {
    Area() float64
}

type Square struct{ Side float64 }
type Circle struct{ R float64 }

func (s Square) Area() float64 { return s.Side * s.Side }
func (c Circle) Area() float64 { return math.Pi * c.R * c.R }

shapes := []Shape{Square{2}, Circle{1}}
for _, s := range shapes {
    fmt.Printf("%.2f\n", s.Area())   // each shape uses its own Area
}`, c`Go's own library is full of tiny interfaces like this: ~io.Reader~ (anything you can read from), ~error~ (anything with an ~Error() string~ method).`),
  P(c`
package main

import "fmt"

type Speaker interface {
    Sound() string
}

type Dog struct{}
type Cat struct{}

func (Dog) Sound() string { return "woof" }
func (Cat) Sound() string { return "meow" }

func main() {
    for _, s := range []Speaker{Dog{}, Cat{}, Dog{}} {
        fmt.Print(s.Sound(), " ")
    }
    fmt.Println()
}`, 'woof meow woof'),
  X({ q: c`Write ~Circle~ (field ~R~) and ~Rect~ (fields ~W~, ~H~) so both satisfy ~Shape~. The loop prints:

~3.14~
~6.00~
~12.57~`, start: c`package main

import (
    "fmt"
    "math"
)

type Shape interface {
    Area() float64
}

// write Circle and Rect, and their Area methods, here

func main() {
    shapes := []Shape{Circle{1}, Rect{2, 3}, Circle{2}}
    for _, s := range shapes {
        fmt.Printf("%.2f\n", s.Area())
    }
}
`, tests: [{ out: '3.14\n6.00\n12.57' }], must: [[c`func\s*\(\s*\w*\s*\*?Circle\s*\)\s*Area`, c`Give ~Circle~ an ~Area()~ method.`], [c`func\s*\(\s*\w*\s*\*?Rect\s*\)\s*Area`, c`Give ~Rect~ an ~Area()~ method.`]], sol: c`package main

import (
    "fmt"
    "math"
)

type Shape interface {
    Area() float64
}

type Circle struct {
    R float64
}

type Rect struct {
    W, H float64
}

func (c Circle) Area() float64 { return math.Pi * c.R * c.R }
func (r Rect) Area() float64   { return r.W * r.H }

func main() {
    shapes := []Shape{Circle{1}, Rect{2, 3}, Circle{2}}
    for _, s := range shapes {
        fmt.Printf("%.2f\n", s.Area())
    }
}
` }),
] },

{ id: 'stringer', title: 'Stringers & type switches', icon: '🏷️', desc: 'Control how values print; branch on a type.',
  v: [['2:53:20', '3:02:15', 'Structs and types']],
  steps: [
  T('String()', c`Give a type a ~String() string~ method and every ~fmt~ print uses it. It satisfies the built-in ~fmt.Stringer~ interface.`, c`
type Card struct {
    Rank string
    Suit string
}

func (c Card) String() string {
    return c.Rank + " of " + c.Suit
}

fmt.Println(Card{"Ace", "Spades"})   // Ace of Spades`),
  T('Type switches', c`~any~ (an empty interface) can hold **any** value. A **type switch** finds out what is really inside:`, c`
func describe(v any) string {
    switch x := v.(type) {
    case int:
        return fmt.Sprintf("number %d", x)
    case string:
        return "text " + x
    default:
        return "something else"
    }
}`),
  P(c`
package main

import "fmt"

type Celsius float64

func (c Celsius) String() string {
    return fmt.Sprintf("%.1fC", float64(c))
}

func main() {
    t := Celsius(21.46)
    fmt.Println(t, t+1)
}`, '21.5C 22.5C'),
  X({ q: c`Write ~func describe(v any) string~ with a type switch: an ~int~ gives ~number 5~, a ~string~ gives ~text hi~, a ~bool~ gives ~yes/no true~, and anything else gives ~something else~.`, start: c`package main

import "fmt"

// write describe here

func main() {
    for _, v := range []any{5, "hi", true, 2.5} {
        fmt.Println(describe(v))
    }
}
`, tests: [{ out: 'number 5\ntext hi\nyes/no true\nsomething else' }], must: [[c`\.\(type\)`, c`Use a type switch: ~switch x := v.(type)~`]], sol: c`package main

import "fmt"

func describe(v any) string {
    switch x := v.(type) {
    case int:
        return fmt.Sprintf("number %d", x)
    case string:
        return "text " + x
    case bool:
        return fmt.Sprintf("yes/no %t", x)
    default:
        return "something else"
    }
}

func main() {
    for _, v := range []any{5, "hi", true, 2.5} {
        fmt.Println(describe(v))
    }
}
` }),
] },

{ id: 'errors', title: 'Errors done properly', icon: '🧯', desc: 'Sentinel errors, wrapping and errors.Is.',
  v: [['2:16:00', '2:37:16', 'Errors and validation']],
  steps: [
  T('Named errors', c`~error~ is just an interface: anything with an ~Error() string~ method. Packages declare **sentinel** errors that callers can check for. Add context with ~fmt.Errorf~ and ~%w~ (wrap), and ~errors.Is~ still recognises the original underneath.`, c`
var ErrNotFound = errors.New("not found")

func find(name string) error {
    return fmt.Errorf("user %q: %w", name, ErrNotFound)
}

err := find("bob")
fmt.Println(err)                          // user "bob": not found
fmt.Println(errors.Is(err, ErrNotFound))  // true`),
  P(c`
base := errors.New("disk full")
err := fmt.Errorf("saving file: %w", base)
fmt.Println(err)
fmt.Println(errors.Is(err, base))`, 'saving file: disk full\ntrue'),
  X({ q: c`Finish ~findAge~: it returns the age, or ~ErrNotFound~ wrapped with the name (~fmt.Errorf("%s: %w", name, ErrNotFound)~). In ~main~, use ~errors.Is~ to print ~No such user: Bob~ for missing users.

~Ada~ → ~Ada is 36~ · ~Bob~ → ~No such user: Bob~`, start: c`package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

var ages = map[string]int{"Ada": 36, "Linus": 54}

func findAge(name string) (int, error) {
    return ages[name], nil
}

func main() {
    var name string
    fmt.Scan(&name)
    age, err := findAge(name)
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println(name, "is", age)
}
`, tests: [{ in: 'Ada', out: 'Ada is 36' }, { in: 'Bob', out: 'No such user: Bob' }], must: [[c`errors\.Is`, c`Check the error with ~errors.Is(err, ErrNotFound)~.`], [c`%w`, c`Wrap the error with ~%w~.`]], sol: c`package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

var ages = map[string]int{"Ada": 36, "Linus": 54}

func findAge(name string) (int, error) {
    age, ok := ages[name]
    if !ok {
        return 0, fmt.Errorf("%s: %w", name, ErrNotFound)
    }
    return age, nil
}

func main() {
    var name string
    fmt.Scan(&name)
    age, err := findAge(name)
    if errors.Is(err, ErrNotFound) {
        fmt.Println("No such user:", name)
        return
    }
    fmt.Println(name, "is", age)
}
` }),
] },
],
quiz: [
  Q(c`How does a type satisfy an interface in Go?`, [c`With the ~implements~ keyword`, 'By having all of its methods', 'By embedding it', 'By registering it'], 1),
  Q(c`What must a type have to be an ~error~?`, [c`An ~Error() string~ method`, c`A ~Message~ field`, c`A ~String()~ method`, 'Nothing'], 0),
  P(c`
package main

import "fmt"

type Money int

func (m Money) String() string { return fmt.Sprintf("€%d", int(m)) }

func main() {
    fmt.Println(Money(5))
}`, '€5'),
  P(c`
var x any = "go"
_, isInt := x.(int)
s, isStr := x.(string)
fmt.Println(isInt, isStr, s)`, 'false true go'),
] });

/* ============ TOPIC 7: CONCURRENCY ============ */
topic({ id: 'concurrency', title: 'Concurrency', icon: '⚡', color: '#b197fc', blurb: 'Goroutines, WaitGroups, channels and mutexes — Go\'s superpower.',
lessons: [
{ id: 'goroutines', title: 'Goroutines', icon: '🐹', desc: 'Doing several things at once.',
  v: [['3:02:15', '3:12:00', 'Goroutines & concurrency']],
  steps: [
  T('go', c`Put ~go~ in front of a function call and it runs **at the same time** as the rest of the program, in a **goroutine**. They are so cheap that a program can run thousands.

But ~main~ does not wait for them: when ~main~ ends, the program ends. A **WaitGroup** waits.`, c`
var wg sync.WaitGroup

for i := 1; i <= 3; i++ {
    wg.Add(1)                  // one more to wait for
    go func(n int) {
        defer wg.Done()        // this one has finished
        fmt.Println("worker", n)
    }(i)
}

wg.Wait()                      // block until every Done
fmt.Println("all done")`, c`The workers can print in **any** order — they really do run at the same time. When order matters, have each goroutine write to its own slot of a slice, or use channels (next lesson).`),
  Q(c`What happens if ~main~ starts goroutines and then returns immediately?`, ['main waits for them automatically', 'The program ends and the goroutines are stopped', 'They keep running in the background forever', 'It does not compile'], 1),
  P(c`
var wg sync.WaitGroup
results := make([]int, 4)
for i := 0; i < 4; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        results[n] = n * 10
    }(i)
}
wg.Wait()
fmt.Println(results)`, '[0 10 20 30]', c`Each goroutine writes only its own slot, so the result is the same every time.`),
  X({ q: c`Square every number in a separate goroutine, storing each result in its own slot of ~results~. Wait for them all, then print ~[1 4 9 16 25]~.`, start: M(c`
    nums := []int{1, 2, 3, 4, 5}
    results := make([]int, len(nums))
    fmt.Println(results)`), tests: [{ out: '[1 4 9 16 25]' }], must: [[c`\bgo\s+func|\bgo\s+\w+\(`, c`Start a goroutine with ~go~.`], [c`WaitGroup`, c`Wait for them with a ~sync.WaitGroup~.`]], sol: M(c`
    nums := []int{1, 2, 3, 4, 5}
    results := make([]int, len(nums))
    var wg sync.WaitGroup
    for i, n := range nums {
        wg.Add(1)
        go func(i, n int) {
            defer wg.Done()
            results[i] = n * n
        }(i, n)
    }
    wg.Wait()
    fmt.Println(results)`) }),
] },

{ id: 'channels', title: 'Channels', icon: '📨', desc: 'Goroutines talking to each other.',
  v: [['3:12:00', '3:24:00', 'Channels']],
  steps: [
  T('Pipes between goroutines', c`A **channel** passes values between goroutines. Sending (~ch <- v~) waits until someone receives (~<-ch~), so channels also **synchronise**.

"Don't communicate by sharing memory; share memory by communicating." — a Go proverb.`, c`
ch := make(chan int)

go func() {
    for i := 1; i <= 3; i++ {
        ch <- i              // send
    }
    close(ch)                // no more values coming
}()

for v := range ch {          // receive until closed
    fmt.Println(v)
}

buf := make(chan string, 2)  // buffered: holds 2 values before a send waits`),
  P(c`
ch := make(chan int)
go func() {
    for i := 1; i <= 4; i++ {
        ch <- i
    }
    close(ch)
}()
sum := 0
for v := range ch {
    sum += v
}
fmt.Println(sum)`, '10'),
  P(c`
ch := make(chan string, 2)
ch <- "first"
ch <- "second"
fmt.Println(<-ch, <-ch)`, 'first second', c`A channel is a queue: first in, first out.`),
  X({ q: c`Write ~func countdown(n int, ch chan int)~ that sends ~n, n-1, …, 1~ on the channel and then closes it. ~main~ prints each value, then ~Lift off!~.`, start: c`package main

import "fmt"

// write countdown here

func main() {
    ch := make(chan int)
    go countdown(3, ch)
    for v := range ch {
        fmt.Println(v)
    }
    fmt.Println("Lift off!")
}
`, tests: [{ out: '3\n2\n1\nLift off!' }], must: [[c`close\s*\(\s*ch\s*\)`, c`Close the channel when you are done: ~close(ch)~.`]], hint: c`Without ~close(ch)~ the ~range~ in main waits forever — Go notices and stops with "deadlock".`, sol: c`package main

import "fmt"

func countdown(n int, ch chan int) {
    for i := n; i > 0; i-- {
        ch <- i
    }
    close(ch)
}

func main() {
    ch := make(chan int)
    go countdown(3, ch)
    for v := range ch {
        fmt.Println(v)
    }
    fmt.Println("Lift off!")
}
` }),
  X({ q: c`Add up 1 to 100 using **two** goroutines: one sums 1–50, the other 51–100. Each sends its part on a channel; ~main~ receives both and prints the total, ~5050~.`, start: c`package main

import "fmt"

func sumRange(from, to int, ch chan int) {
    total := 0
    for i := from; i <= to; i++ {
        total += i
    }
    ch <- total
}

func main() {
    ch := make(chan int)
    fmt.Println(ch != nil)
}
`, tests: [{ out: '5050' }], must: [[c`go\s+sumRange`, c`Start ~sumRange~ twice with ~go~.`]], sol: c`package main

import "fmt"

func sumRange(from, to int, ch chan int) {
    total := 0
    for i := from; i <= to; i++ {
        total += i
    }
    ch <- total
}

func main() {
    ch := make(chan int)
    go sumRange(1, 50, ch)
    go sumRange(51, 100, ch)
    fmt.Println(<-ch + <-ch)
}
` }),
] },

{ id: 'mutex', title: 'Mutexes & select', icon: '🔒', desc: 'Sharing safely, and waiting on several things.',
  v: [['3:12:00', '3:24:00', 'Concurrency (recap)']],
  steps: [
  T('Race conditions', c`When goroutines change the **same** variable, updates can clash and get lost: a **race condition**. A ~sync.Mutex~ is a lock — only one goroutine at a time gets past ~Lock()~.`, c`
var mu sync.Mutex
count := 0

// inside each goroutine:
mu.Lock()
count++            // safe: one goroutine at a time
mu.Unlock()`),
  T('select', c`~select~ waits on several channel operations and runs whichever is ready **first**. With ~time.After~ it makes a timeout:`, c`
select {
case msg := <-results:
    fmt.Println("got", msg)
case <-time.After(2 * time.Second):
    fmt.Println("too slow, giving up")
}`),
  P(c`
ch := make(chan string)
go func() {
    time.Sleep(200 * time.Millisecond)
    ch <- "slow answer"
}()
select {
case m := <-ch:
    fmt.Println(m)
case <-time.After(20 * time.Millisecond):
    fmt.Println("timeout")
}`, 'timeout'),
  X({ q: c`Start **1000** goroutines that each add 1 to ~count~. Protect ~count~ with a ~sync.Mutex~ and wait for them all; the program must print ~1000~ every time.`, start: M(c`
    count := 0
    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            count++
        }()
    }
    wg.Wait()
    fmt.Println(count)`), tests: [{ out: '1000' }], must: [[c`Mutex`, c`Use a ~sync.Mutex~.`], [c`\.Lock\(\)`, c`Call ~Lock()~ and ~Unlock()~ around ~count++~.`]], hint: c`Without the lock this sometimes prints less than 1000 — which is exactly why races are so sneaky.`, sol: M(c`
    count := 0
    var mu sync.Mutex
    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            mu.Lock()
            count++
            mu.Unlock()
        }()
    }
    wg.Wait()
    fmt.Println(count)`) }),
] },
],
quiz: [
  Q(c`What keyword starts a goroutine?`, [c`~async~`, c`~go~`, c`~thread~`, c`~spawn~`], 1),
  Q(c`What does ~wg.Wait()~ do?`, ['Pauses for one second', 'Blocks until every goroutine has called Done', 'Stops all goroutines', 'Starts the goroutines'], 1),
  P(c`
ch := make(chan int, 3)
ch <- 1
ch <- 2
ch <- 3
close(ch)
total := 0
for v := range ch {
    total += v
}
fmt.Println(total)`, '6'),
  Q(c`Two goroutines both run ~count++~ on the same variable with no lock. What can happen?`, ['Nothing — Go makes it safe', 'Some increments are lost (a race condition)', 'It does not compile', 'Go runs them one after another automatically'], 1),
] });

/* ============ TOPIC 8: FINAL BOSS ============ */
topic({ id: 'boss', title: 'Final Boss', icon: '👑', color: '#c0c7ff', blurb: 'Three bigger programs that use everything.',
lessons: [
{ id: 'projects', title: 'Capstone projects', icon: '🏆', desc: 'A to-do list, a grade book and a parallel prime counter.',
  v: [['2:53:20', '3:02:15', 'Structs (booking app)']],
  steps: [
  T('No new syntax', c`Three realistic programs. Plan the types first (a struct? a map? a slice?), write one piece at a time and Run often. The compiler's complaints about unused variables are a free to-do list.`),
  X({ q: c`**To-do list.** Read lines until ~quit~:

~add <task>~ adds a task · ~done <number>~ marks task N (from 1) as done · ~list~ prints every task as ~1. [x] Buy milk~ or ~2. [ ] Walk dog~`, start: M(c`
    reader := bufio.NewScanner(os.Stdin)
    for reader.Scan() {
        line := reader.Text()
        if line == "quit" {
            break
        }
        // handle the command
    }`), tests: [{ in: 'add Buy milk\nadd Walk dog\ndone 1\nlist\nquit\n', out: '1. [x] Buy milk\n2. [ ] Walk dog' }, { in: 'add A\nlist\nquit\n', out: '1. [ ] A' }], hint: c`A ~type Task struct { Text string; Done bool }~ and a ~[]Task~. ~strings.HasPrefix(line, "add ")~ and ~line[4:]~ split each command; ~strconv.Atoi(line[5:])~ reads the number.`, sol: c`package main

import (
    "bufio"
    "fmt"
    "os"
    "strconv"
    "strings"
)

type Task struct {
    Text string
    Done bool
}

func main() {
    tasks := []Task{}
    reader := bufio.NewScanner(os.Stdin)
    for reader.Scan() {
        line := reader.Text()
        if line == "quit" {
            break
        }
        switch {
        case strings.HasPrefix(line, "add "):
            tasks = append(tasks, Task{Text: line[4:]})
        case strings.HasPrefix(line, "done "):
            n, err := strconv.Atoi(line[5:])
            if err == nil && n >= 1 && n <= len(tasks) {
                tasks[n-1].Done = true
            }
        case line == "list":
            for i, t := range tasks {
                mark := " "
                if t.Done {
                    mark = "x"
                }
                fmt.Printf("%d. [%s] %s\n", i+1, mark, t.Text)
            }
        }
    }
}
` }),
  X({ q: c`**Grade book.** Read pairs like ~Ana 80~ until the name ~end~. A student can appear several times. Print each student's average with one decimal, in **alphabetical** order:

~Ana 80 Ben 60 Ana 91 end~ →
~Ana: 85.5~
~Ben: 60.0~`, start: M(c`
    scores := map[string][]int{}
    fmt.Println(scores)`), tests: [{ in: 'Ana 80\nBen 60\nAna 91\nend\n', out: 'Ana: 85.5\nBen: 60.0' }, { in: 'Zed 70 Amy 90 Zed 71 Amy 100 Amy 80 end', out: 'Amy: 90.0\nZed: 70.5' }], must: [[c`sort\.`, c`Sort the names with ~sort.Strings~.`]], hint: c`~scores[name] = append(scores[name], score)~ works even the first time: a missing key gives a ~nil~ slice, and appending to ~nil~ is fine.`, sol: M(c`
    scores := map[string][]int{}
    for {
        var name string
        fmt.Scan(&name)
        if name == "end" {
            break
        }
        var score int
        fmt.Scan(&score)
        scores[name] = append(scores[name], score)
    }

    names := []string{}
    for n := range scores {
        names = append(names, n)
    }
    sort.Strings(names)
    for _, n := range names {
        total := 0
        for _, s := range scores[n] {
            total += s
        }
        fmt.Printf("%s: %.1f\n", n, float64(total)/float64(len(scores[n])))
    }`) }),
  X({ q: c`**Parallel prime counter.** Read ~N~ and count the primes from 2 to N using **4 goroutines**, each checking a quarter of the range and sending its count on a channel. Print ~Primes up to 100: 25~.`, start: c`package main

import "fmt"

func isPrime(n int) bool {
    if n < 2 {
        return false
    }
    for d := 2; d*d <= n; d++ {
        if n%d == 0 {
            return false
        }
    }
    return true
}

func main() {
    var n int
    fmt.Scan(&n)
    fmt.Println(isPrime(n))
}
`, tests: [{ in: '100', out: 'Primes up to 100: 25' }, { in: '100000', out: 'Primes up to 100000: 9592' }, { in: '2', out: 'Primes up to 2: 1' }], must: [[c`\bgo\s+`, c`Start the workers with ~go~.`], [c`\bchan\b`, c`Send the counts back on a channel.`]], hint: c`Worker ~w~ (0 to 3) checks ~from := w*n/4 + 1~ to ~to := (w+1)*n/4~. Each sends its count; ~main~ receives 4 times and adds them up.`, sol: c`package main

import "fmt"

func isPrime(n int) bool {
    if n < 2 {
        return false
    }
    for d := 2; d*d <= n; d++ {
        if n%d == 0 {
            return false
        }
    }
    return true
}

func countPrimes(from, to int, ch chan int) {
    count := 0
    for i := from; i <= to; i++ {
        if isPrime(i) {
            count++
        }
    }
    ch <- count
}

func main() {
    var n int
    fmt.Scan(&n)

    const workers = 4
    ch := make(chan int)
    for w := 0; w < workers; w++ {
        go countPrimes(w*n/workers+1, (w+1)*n/workers, ch)
    }
    total := 0
    for w := 0; w < workers; w++ {
        total += <-ch
    }
    fmt.Printf("Primes up to %d: %d\n", n, total)
}
` }),
  T('Where next?', c`You know the whole Go language now — it really is that small. Next steps:

**A web server:** ~net/http~ is in the standard library. ~http.HandleFunc~ plus ~http.ListenAndServe(":8080", nil)~ and you have a website.

**Tests:** Go has testing built in. Write ~func TestX(t *testing.T)~ in a ~_test.go~ file and run ~go test~.

**Install Go:** download it from ~go.dev~, then ~go run main.go~ runs your programs on your own machine.`),
] },
],
quiz: [
  P(c`
nums := []int{3, 1, 2}
sort.Ints(nums)
fmt.Println(nums)`, '[1 2 3]'),
  Q(c`Which is the best fit for "look up a price by product name"?`, ['a slice', 'a map', 'a channel', 'a struct'], 1),
  Q(c`What is the Go way to report that a function failed?`, ['panic every time', 'return an error value', 'print to the screen', 'return -1'], 1),
  P(c`
ch := make(chan int)
go func() { ch <- 42 }()
fmt.Println(<-ch)`, '42'),
] });
