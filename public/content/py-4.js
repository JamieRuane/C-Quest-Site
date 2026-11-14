/* ================= Python, Part 2: Advanced (topics A1-A4) =================
   Topics marked advanced: true appear after the Final Boss, under a "Part 2" heading.
   Exercises here mostly use fixed data or read with sys.stdin (no echo), like real command-line tools. */
G('*args / **kwargs', c`~*args~ collects extra positional arguments into a tuple; ~**kwargs~ collects extra keyword arguments into a dict.`);
G('keyword-only argument', c`A parameter after a bare ~*~ that callers must name: ~def connect(host, *, port=80)~.`);
G('key function', c`Passed as ~key=~ to ~sorted~, ~min~ and ~max~: called on each item to get the value to compare.`);
G('closure', c`An inner function that remembers variables from the function that made it, even after that function has finished.`);
G('nonlocal', c`Lets an inner function change a variable of the enclosing function: ~nonlocal count~.`);
G('generator', c`A function that uses ~yield~. It produces values one at a time, only when asked, so it can handle huge or endless streams.`);
G('yield', c`Hands back one value and **pauses** the generator, ready to carry on from the same spot next time.`);
G('lazy evaluation', c`Working something out only when it is needed. Generators and ~range~ are lazy; lists are not.`);
G('itertools', c`The standard library's toolbox for iterators: ~combinations~, ~permutations~, ~groupby~, ~accumulate~, ~islice~, ~count~, ~chain~…`);
G('sys.stdin', c`The program's input as a file. ~for line in sys.stdin:~ reads piped data line by line, like real command-line tools.`);
G('type hint', c`A note about types: ~def area(w: float, h: float) -> float~. Python ignores them when running; editors and ~mypy~ check them.`);
G('dataclass', c`~@dataclass~ writes ~__init__~, ~__repr__~ and ~__eq__~ for a class from its annotated fields.`);
G('Enum', c`A fixed set of named constants: ~class Status(Enum): TODO = 1; DONE = 2~.`);
G('defaultdict', c`A dict that creates a missing value on first use: ~defaultdict(list)~ starts each new key with ~[]~.`);
G('deque', c`A double-ended queue: fast to add or remove at **both** ends. ~deque(maxlen=3)~ keeps only the last 3 items.`);
G('namedtuple', c`A tuple with named fields: ~Point = namedtuple("Point", "x y")~, then ~p.x~.`);
G('custom exception', c`Your own error type: ~class OutOfStock(Exception): pass~. Callers can catch exactly that.`);
G('raise ... from', c`Raises a new error and records the original as its cause: ~raise ConfigError("bad line") from err~.`);
G('context manager', c`An object for ~with~: it sets something up, and **always** cleans up afterwards, even after an error.`);
G('logging', c`The standard way to record what a program is doing, with levels: ~DEBUG~ < ~INFO~ < ~WARNING~ < ~ERROR~ < ~CRITICAL~.`);
G('unittest', c`Python's built-in test framework: test classes inherit ~unittest.TestCase~, test methods start with ~test_~.`);
G('assertion', c`A check inside a test: ~self.assertEqual(a, b)~, ~self.assertTrue(x)~, ~with self.assertRaises(ValueError):~`);

/* ============ ADVANCED 1: FUNCTIONS, LEVELLED UP ============ */
topic({ id: 'adv-functions', advanced: true, title: 'Functions, Levelled Up', icon: '🧙', color: '#ff4b4b', blurb: 'Flexible arguments, lambdas, closures and decorators.',
lessons: [
{ id: 'args', title: '*args & **kwargs', icon: '🎒', desc: 'Functions that take any number of arguments.',
  steps: [
  T('Any number of arguments', c`A ~*~ in front of a parameter collects all the extra **positional** arguments into a tuple. ~**~ collects the extra **keyword** arguments into a dict. ~print~ itself works like this.`, c`
def total(*nums):
    return sum(nums)

print(total(1, 2, 3))          # 6
print(total())                 # 0

def profile(name, **info):
    print(name, info)

profile("Ada", age=36, role="engineer")   # Ada {'age': 36, 'role': 'engineer'}`),
  T('Unpacking at the call', c`The same symbols work the other way round when **calling**: ~*~ spreads a list into separate arguments, ~**~ spreads a dict into keyword arguments.`, c`
scores = [3, 9, 4]
print(max(*scores))                # same as max(3, 9, 4)

style = {"sep": " | ", "end": "!\n"}
print("a", "b", **style)           # a | b!`, c`Professional code uses this to pass options straight through: ~def log(msg, **opts): print(msg, **opts)~.`),
  T('Keyword-only arguments', c`Parameters after a bare ~*~ **must** be given by name. Library authors use this to keep calls readable: ~connect("db", 5432, 10)~ is a puzzle; ~connect("db", port=5432, timeout=10)~ is not.`, c`
def connect(host, *, port=80, timeout=5):
    print(host, port, timeout)

connect("example.com", port=8080)   # ✅
connect("example.com", 8080)        # ❌ TypeError: takes 1 positional argument`),
  P(c`
def f(a, *rest, **opts):
    print(a, rest, opts)

f(1, 2, 3, x=4)`, "1 (2, 3) {'x': 4}"),
  P(c`
nums = [4, 1, 7]
print(*nums, sep=", ")`, '4, 1, 7'),
  Q(c`With ~def connect(host, *, port=80)~, what does ~connect("x", 8080)~ do?`, ['Connects to port 8080', 'Connects to port 80 and ignores 8080', c`~TypeError~: ~port~ must be given by name`, c`~port~ becomes a tuple`], 2),
  X({ q: c`Write ~describe(name, *skills, **details)~. It prints the name and skills on one line (or ~no skills~), then each detail indented by two spaces as ~key = value~.

The calls are already written. Expected output:

~Ada: python, sql~
~  age = 36~
~  city = London~
~Bo: no skills~`, start: c`
# write describe here

describe("Ada", "python", "sql", age=36, city="London")
describe("Bo")
`, tests: [{ out: 'Ada: python, sql\n  age = 36\n  city = London\nBo: no skills' }], must: [[c`\*skills`, c`Collect skills with ~*skills~.`], [c`\*\*details`, c`Collect details with ~**details~.`]], hint: c`~", ".join(skills)~ joins the tuple. ~for key, value in details.items():~ walks through the dict in the order the arguments were given.`, sol: c`
def describe(name, *skills, **details):
    print(f"{name}: {', '.join(skills) if skills else 'no skills'}")
    for key, value in details.items():
        print(f"  {key} = {value}")

describe("Ada", "python", "sql", age=36, city="London")
describe("Bo")
` }),
  X({ q: c`Write ~average(*nums, round_to=2)~. It returns the average rounded to ~round_to~ places, or ~0~ when there are no numbers. ~round_to~ must be keyword-only (it already is, because it comes after ~*nums~).

Expected: ~1.67~, ~2.0~, ~0~`, start: c`
# write average here

print(average(1, 2, 2))
print(average(1, 2, 2, round_to=0))
print(average())
`, tests: [{ out: '1.67\n2.0\n0' }], must: [[c`def\s+average\s*\(\s*\*nums\s*,\s*round_to\s*=\s*2\s*\)`, c`~def average(*nums, round_to=2):~`]], sol: c`
def average(*nums, round_to=2):
    if not nums:
        return 0
    return round(sum(nums) / len(nums), round_to)

print(average(1, 2, 2))
print(average(1, 2, 2, round_to=0))
print(average())
` }),
] },

{ id: 'lambda', title: 'Lambdas & key functions', icon: '🔑', desc: 'Sort anything by anything.',
  steps: [
  T('lambda', c`A **lambda** is a tiny function written in one expression, with no name. You will mostly use them for one job: telling ~sorted~, ~min~ and ~max~ **what to compare**.`, c`
people = [("Ada", 36), ("Bo", 22), ("Cy", 29)]

sorted(people, key=lambda p: p[1])         # by age, youngest first
max(people, key=lambda p: p[1])            # ('Ada', 36)
sorted(people, key=lambda p: p[1], reverse=True)

words = ["Pear", "apple", "fig"]
sorted(words, key=len)                     # a normal function works too
sorted(words, key=str.lower)               # ignore capitals`, c`~key~ is called once on each item, and the items are sorted by what it returns.`),
  P(c`
words = ["kiwi", "fig", "banana"]
print(sorted(words, key=len))`, "['fig', 'kiwi', 'banana']"),
  P(c`print(list(map(lambda x: x ** 2, [1, 2, 3])))`, '[1, 4, 9]', c`~map~ applies a function to every item. A comprehension (~[x ** 2 for x in ...]~) usually reads better.`),
  T('Sorting by two things', c`Return a **tuple** from the key: Python compares the first items, and only looks at the second on a tie. Flip a number with ~-~ to sort it high-to-low while the rest stays low-to-high.`, c`
# score high-to-low, then name A-Z on a tie
ranking = sorted(players, key=lambda p: (-p.score, p.name))`),
  P(c`
data = [("b", 2), ("a", 2), ("c", 1)]
print(sorted(data, key=lambda t: (t[1], t[0])))`, "[('c', 1), ('a', 2), ('b', 2)]"),
  Q(c`What does the ~key~ function receive?`, ['The whole list', 'Each item, one at a time', 'Two items to compare', 'The index of each item'], 1),
  X({ q: c`Print the leaderboard: highest **score** first, and on a tie the **faster** time (smaller) first. Each tuple is ~(name, score, seconds)~.

~1. Cy 150~
~2. Bo 150~
~3. Ada 120~
~4. Di 90~`, start: c`
players = [("Ada", 120, 33), ("Bo", 150, 51), ("Cy", 150, 22), ("Di", 90, 10)]

for p in players:
    print(p)
`, tests: [{ out: '1. Cy 150\n2. Bo 150\n3. Ada 120\n4. Di 90' }], must: [[c`lambda`, c`Use a ~lambda~ as the key.`], [c`sorted\(|\.sort\(`, c`Sort the list.`]], hint: c`~key=lambda p: (-p[1], p[2])~ and ~enumerate(ranking, start=1)~ for the numbers.`, sol: c`
players = [("Ada", 120, 33), ("Bo", 150, 51), ("Cy", 150, 22), ("Di", 90, 10)]

ranking = sorted(players, key=lambda p: (-p[1], p[2]))
for i, (name, score, _) in enumerate(ranking, start=1):
    print(f"{i}. {name} {score}")
` }),
] },

{ id: 'closures', title: 'Closures', icon: '🎁', desc: 'Functions that make functions — and remember things.',
  steps: [
  T('Functions are values', c`A function is an object like any other: store it in a variable, put it in a dict, pass it in, hand it back.`, c`
ops = {
    "+": lambda a, b: a + b,
    "*": lambda a, b: a * b,
}
print(ops["*"](6, 7))      # 42: a "dispatch table" instead of a long if/elif`),
  T('Closures', c`A function defined **inside** another one can use the outer function's variables — and it keeps them even after the outer function has returned. That is a **closure**.`, c`
def make_multiplier(n):
    def multiply(x):
        return x * n        # remembers n
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5), triple(5))   # 10 15`),
  T('nonlocal', c`Reading an outer variable just works. **Changing** it needs ~nonlocal~, or Python thinks you mean a new local variable.`, c`
def make_counter():
    count = 0
    def tick():
        nonlocal count
        count += 1
        return count
    return tick`),
  P(c`
def make_counter():
    count = 0
    def tick():
        nonlocal count
        count += 1
        return count
    return tick

c = make_counter()
c()
c()
print(c())`, '3'),
  P(c`
ops = {"+": lambda a, b: a + b, "*": lambda a, b: a * b}
print(ops["*"](6, 7), ops["+"](6, 7))`, '42 13'),
  Q(c`Without ~nonlocal count~, what happens when ~tick()~ runs ~count += 1~?`, ['It works the same', c`~UnboundLocalError~: Python treats ~count~ as a new local variable`, 'It creates a global variable', 'count becomes None'], 1),
  X({ q: c`Write ~make_accumulator(start)~. It returns a function ~add(x)~ that adds ~x~ to a running total (starting at ~start~) and returns the new total. Each accumulator keeps its own total.

Expected: ~15~, ~12~, ~1~, ~12~`, start: c`
# write make_accumulator here

acc = make_accumulator(10)
print(acc(5))
print(acc(-3))
other = make_accumulator(0)
print(other(1))
print(acc(0))
`, tests: [{ out: '15\n12\n1\n12' }], must: [[c`nonlocal`, c`Use ~nonlocal~ to change the outer total.`]], sol: c`
def make_accumulator(start):
    total = start
    def add(x):
        nonlocal total
        total += x
        return total
    return add

acc = make_accumulator(10)
print(acc(5))
print(acc(-3))
other = make_accumulator(0)
print(other(1))
print(acc(0))
` }),
] },

{ id: 'decorators', title: 'Decorators', icon: '🎀', desc: 'Wrap functions with extra behaviour: the @ you see everywhere.',
  steps: [
  T('A function that wraps a function', c`A **decorator** takes a function and returns a new function that usually calls the original with something extra around it. The ~@~ line is shorthand: ~@shout~ above ~def greet~ means ~greet = shout(greet)~.`, c`
def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout
def greet(name):
    return f"hi {name}"

print(greet("ada"))     # HI ADA`, c`Decorators are everywhere in professional Python: ~@app.route("/")~ in Flask, ~@pytest.fixture~, ~@functools.cache~, ~@property~, ~@dataclass~. Logging, timing, retrying and permission checks are all typical uses.`),
  P(c`
def log(func):
    def wrapper(*args):
        print("calling", func.__name__)
        return func(*args)
    return wrapper

@log
def square(n):
    return n * n

print(square(4))`, 'calling square\n16'),
  P(c`
def counted(func):
    def wrapper(*args):
        wrapper.calls += 1
        return func(*args)
    wrapper.calls = 0
    return wrapper

@counted
def add(a, b):
    return a + b

add(1, 2)
add(3, 4)
print(add.calls)`, '2', c`Functions are objects, so you can even hang an attribute like ~calls~ on one.`),
  Q(c`~@shout~ written above ~def greet(...)~ is the same as…`, [c`~shout = greet(shout)~`, c`~greet = shout(greet)~`, c`~greet(shout)~ every call`, 'Nothing: it is a comment'], 1),
  X({ q: c`Write a decorator ~require_positive~. If **any** argument is negative, the wrapper raises ~ValueError("negative input")~; otherwise it calls the function normally.

Expected: ~12~ then ~Error: negative input~`, start: c`
# write require_positive here

@require_positive
def area(w, h):
    return w * h

print(area(3, 4))
try:
    area(-1, 5)
except ValueError as e:
    print("Error:", e)
`, tests: [{ out: '12\nError: negative input' }], must: [[c`def\s+require_positive\s*\(`, c`Write ~def require_positive(func):~`], [c`raise\s+ValueError`, c`~raise ValueError("negative input")~`]], sol: c`
def require_positive(func):
    def wrapper(*args):
        if any(a < 0 for a in args):
            raise ValueError("negative input")
        return func(*args)
    return wrapper

@require_positive
def area(w, h):
    return w * h

print(area(3, 4))
try:
    area(-1, 5)
except ValueError as e:
    print("Error:", e)
` }),
  T('Decorators with settings', c`~@retry(3)~ calls ~retry(3)~ first, and **that** returns the decorator. So there are three layers: settings → decorator → wrapper.`, c`
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def cheer():
    print("hip hip hooray")`),
  X({ q: c`Write ~retry(times)~: the decorated function is tried up to ~times~ times. If it raises ~ConnectionError~, try again; if the last try fails too, let the error escape.

Expected:
~connected~
~attempts: 3~
~gave up: still down~`, start: c`
# write retry here

attempts = 0

@retry(3)
def flaky():
    global attempts
    attempts += 1
    if attempts < 3:
        raise ConnectionError("network down")
    return "connected"

print(flaky())
print("attempts:", attempts)

@retry(2)
def always_fails():
    raise ConnectionError("still down")

try:
    always_fails()
except ConnectionError as e:
    print("gave up:", e)
`, tests: [{ out: 'connected\nattempts: 3\ngave up: still down' }], must: [[c`def\s+retry\s*\(\s*times\s*\)`, c`~def retry(times):~`]], hint: c`Inside the wrapper: ~for attempt in range(times):~ with a ~try~ that returns the result, and an ~except ConnectionError:~ that re-raises (~raise~) only when ~attempt == times - 1~.`, sol: c`
def retry(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except ConnectionError:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorator

attempts = 0

@retry(3)
def flaky():
    global attempts
    attempts += 1
    if attempts < 3:
        raise ConnectionError("network down")
    return "connected"

print(flaky())
print("attempts:", attempts)

@retry(2)
def always_fails():
    raise ConnectionError("still down")

try:
    always_fails()
except ConnectionError as e:
    print("gave up:", e)
` }),
] },
],
quiz: [
  P(c`
def f(*args, **kwargs):
    print(len(args), sorted(kwargs))

f(1, 2, b=3, a=4)`, "2 ['a', 'b']"),
  P(c`print(sorted(["b", "A", "c"], key=str.lower))`, "['A', 'b', 'c']"),
  P(c`
def outer():
    x = "outer"
    def inner():
        return x.upper()
    return inner

print(outer()())`, 'OUTER'),
  Q(c`Which is a typical use for a decorator?`, ['Storing data in a list', 'Adding timing, logging or retries around many functions without editing them', 'Making a variable global', 'Reading files'], 1),
  F('Sort people by age.', c`
people = [("Ada", 36), ("Bo", 22)]
print(sorted(people, key=[[lambda]] p: p[1]))`),
] });

/* ============ ADVANCED 2: ITERATORS & GENERATORS ============ */
topic({ id: 'adv-generators', advanced: true, title: 'Iterators & Generators', icon: '🔄', color: '#1cb0f6', blurb: 'Lazy streams of data, pipelines and itertools.',
lessons: [
{ id: 'generators', title: 'Generators', icon: '🌊', desc: 'yield one value at a time.',
  steps: [
  T('How for really works', c`~for x in thing~ calls ~iter(thing)~ to get an **iterator**, then calls ~next()~ on it until it raises ~StopIteration~. Anything that follows that protocol works in a ~for~ loop.`, c`
it = iter([10, 20])
print(next(it))    # 10
print(next(it))    # 20
next(it)           # StopIteration: nothing left`),
  T('yield', c`A function containing ~yield~ is a **generator**. Calling it runs nothing yet. Each ~next()~ runs it until the next ~yield~, hands that value out, and **pauses** right there.`, c`
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for x in countdown(3):
    print(x)             # 3, 2, 1`, c`Generators are **lazy**: values are made one at a time, only when asked. A generator over a 10 GB log file uses almost no memory, and one can even be endless.`),
  P(c`
def gen():
    yield 1
    yield 2
    yield 3

print(list(gen()), sum(gen()))`, '[1, 2, 3] 6', c`Each call to ~gen()~ makes a fresh generator.`),
  P(c`
g = (x * x for x in range(4))
print(next(g), next(g), list(g))`, '0 1 [4, 9]', c`Round brackets make a **generator expression**. ~list(g)~ only gets what is left.`),
  P(c`
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

f = fib()
print([next(f) for _ in range(8)])`, '[0, 1, 1, 2, 3, 5, 8, 13]', c`An endless generator is fine: it only does work when asked.`),
  Q(c`You need the sum of the squares of the first 10 million numbers. Why is ~sum(x * x for x in range(10_000_000))~ better than ~sum([x * x for x in range(10_000_000)])~?`, ['It gives a different answer', 'The generator never builds the 10-million-item list in memory', 'Lists cannot be summed', 'It is not better'], 1),
  X({ q: c`Write a generator ~chunks(items, size)~ that yields slices of ~items~ of length ~size~ (the last one may be shorter). It works for lists and strings.

Expected:
~[[1, 2], [3, 4], [5]]~
~abc~ ~def~ ~g~ (one per line)`, start: c`
# write chunks here

print(list(chunks([1, 2, 3, 4, 5], 2)))
for part in chunks("abcdefg", 3):
    print(part)
`, tests: [{ out: '[[1, 2], [3, 4], [5]]\nabc\ndef\ng' }], must: [[c`\byield\b`, c`Use ~yield~.`]], hint: c`~for i in range(0, len(items), size): yield items[i:i + size]~`, sol: c`
def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]

print(list(chunks([1, 2, 3, 4, 5], 2)))
for part in chunks("abcdefg", 3):
    print(part)
` }),
  X({ q: c`Write an **endless** generator ~ids(prefix)~ that yields ~ORD-001~, ~ORD-002~, … (three-digit numbers). Each generator counts on its own.

Expected: ~ORD-001~ ~ORD-002~ ~INV-001~ ~ORD-003~`, start: c`
# write ids here

orders = ids("ORD")
invoices = ids("INV")
print(next(orders))
print(next(orders))
print(next(invoices))
print(next(orders))
`, tests: [{ out: 'ORD-001\nORD-002\nINV-001\nORD-003' }], must: [[c`\byield\b`, c`Use ~yield~.`], [c`while\s+True`, c`Make it endless with ~while True:~.`]], hint: c`~f"{prefix}-{n:03}"~ pads the number to three digits.`, sol: c`
def ids(prefix):
    n = 1
    while True:
        yield f"{prefix}-{n:03}"
        n += 1

orders = ids("ORD")
invoices = ids("INV")
print(next(orders))
print(next(orders))
print(next(invoices))
print(next(orders))
` }),
] },

{ id: 'pipelines', title: 'Generator pipelines', icon: '🏭', desc: 'Process piped data step by step, like real command-line tools.',
  steps: [
  T('Reading piped data', c`Real command-line tools read their input as a stream: ~cat sales.csv | python report.py~. In Python, that stream is ~sys.stdin~, and it behaves like an open file. (Here, the input box plays the part of the pipe.)`, c`
import sys

for line in sys.stdin:            # one line at a time, never all at once
    line = line.rstrip("\n")
    ...

text = sys.stdin.read()           # or everything as one string`, c`Unlike ~input()~, nothing is echoed back, so the output is exactly what your program prints.`),
  T('Pipelines', c`Chain small generators together, each doing one job. Data flows through one item at a time, so it works the same for 10 lines or 10 million.`, c`
def read_numbers(lines):
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#"):
            yield float(line)

def above(values, limit):
    for v in values:
        if v > limit:
            yield v

big = above(read_numbers(sys.stdin), 100)
print(sum(big))`),
  P(c`
lines = ["10", "x", "25", "", "7"]
nums = (int(s) for s in lines if s.isdigit())
big = (n for n in nums if n > 8)
print(sum(big))`, '35'),
  X({ q: c`Sales arrive as ~name,amount~ lines. Skip blank lines and comments (starting with ~#~). Write generators ~read_rows(lines)~ (yields ~(name, amount)~ with amount as a float) and ~large(rows, minimum)~, then print how many sales are **100 or more** and their total:

~Large sales: 2, total 450.00~`, start: c`
import sys

# write read_rows and large here

for line in sys.stdin:
    print(line.strip())
`, tests: [{ in: '# sales export\nada,120\nbo,40\n\ncy,330\n', out: 'Large sales: 2, total 450.00' }, { in: 'x,100\ny,99.5\n', out: 'Large sales: 1, total 100.00' }], must: [[c`def\s+read_rows`, c`Write ~read_rows(lines)~.`], [c`def\s+large`, c`Write ~large(rows, minimum)~.`], [c`\byield\b`, c`Use ~yield~.`]], hint: c`~name, amount = line.split(",")~. At the end, turn the pipeline into a list once (~sales = list(large(read_rows(sys.stdin), 100))~) so you can both count and sum it.`, sol: c`
import sys

def read_rows(lines):
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        name, amount = line.split(",")
        yield name, float(amount)

def large(rows, minimum):
    for name, amount in rows:
        if amount >= minimum:
            yield name, amount

sales = list(large(read_rows(sys.stdin), 100))
total = sum(amount for _, amount in sales)
print(f"Large sales: {len(sales)}, total {total:.2f}")
` }),
  X({ q: c`Write a generator ~running_average(numbers)~ that yields the average **so far** after each number. Print each with one decimal.

~10 20 60~ → ~10.0~ ~15.0~ ~30.0~`, start: c`
import sys

# write running_average here

numbers = [float(w) for w in sys.stdin.read().split()]
print(numbers)
`, tests: [{ in: '10 20 60', out: '10.0\n15.0\n30.0' }, { in: '5', out: '5.0' }], must: [[c`\byield\b`, c`Use ~yield~.`]], sol: c`
import sys

def running_average(numbers):
    total = 0
    for count, n in enumerate(numbers, start=1):
        total += n
        yield total / count

numbers = [float(w) for w in sys.stdin.read().split()]
for avg in running_average(numbers):
    print(f"{avg:.1f}")
` }),
] },

{ id: 'itertools', title: 'itertools', icon: '🧰', desc: 'Combinations, grouping and endless counters, ready-made.',
  steps: [
  T('The iterator toolbox', c`~itertools~ has fast, lazy building blocks. The ones you will reach for most:`, c`
from itertools import combinations, permutations, product, groupby, accumulate, islice, count, chain

combinations("abc", 2)     # ab ac bc           (order does not matter)
permutations("abc", 2)     # ab ac ba bc ca cb  (order matters)
product("ab", [1, 2])      # a1 a2 b1 b2        (every pairing)
accumulate([1, 2, 3])      # 1 3 6              (running totals)
chain([1, 2], [3])         # 1 2 3              (one after another)
islice(count(10), 3)       # 10 11 12           (the first 3 of an endless counter)
groupby("aabccc")          # a:aa  b:b  c:ccc   (runs of equal items)`),
  P(c`
from itertools import combinations
print(list(combinations("abc", 2)))`, "[('a', 'b'), ('a', 'c'), ('b', 'c')]"),
  P(c`
from itertools import accumulate
print(list(accumulate([1, 2, 3, 4])))`, '[1, 3, 6, 10]'),
  P(c`
from itertools import islice, count
print(list(islice(count(10, 5), 4)))`, '[10, 15, 20, 25]'),
  P(c`
from itertools import groupby
for key, group in groupby("aaabccdd"):
    print(key, len(list(group)))`, 'a 3\nb 1\nc 2\nd 2'),
  Q(c`~groupby(["b", "a", "b"])~ gives three groups, not two. Why?`, ['It is a bug', 'groupby only groups items that are next to each other, so sort first', 'Strings cannot be grouped', 'It ignores the first item'], 1),
  X({ q: c`Every player plays every other player once. Use ~combinations~ to print each match, then the total:

~Ada vs Bo~ … ~Total: 6 matches~`, start: c`
players = ["Ada", "Bo", "Cy", "Di"]
`, tests: [{ out: 'Ada vs Bo\nAda vs Cy\nAda vs Di\nBo vs Cy\nBo vs Di\nCy vs Di\nTotal: 6 matches' }], must: [[c`combinations`, c`Use ~itertools.combinations~.`]], sol: c`
from itertools import combinations

players = ["Ada", "Bo", "Cy", "Di"]
matches = list(combinations(players, 2))
for a, b in matches:
    print(f"{a} vs {b}")
print(f"Total: {len(matches)} matches")
` }),
  X({ q: c`**Run-length encoding**, a classic compression trick: read a string and write each run of the same character as the character and its count.

~aaabccdddd~ → ~a3b1c2d4~`, start: c`
import sys

text = sys.stdin.read().strip()
print(text)
`, tests: [{ in: 'aaabccdddd', out: 'a3b1c2d4' }, { in: 'x', out: 'x1' }, { in: 'aabbaa', out: 'a2b2a2' }], must: [[c`groupby`, c`Use ~itertools.groupby~.`]], sol: c`
import sys
from itertools import groupby

text = sys.stdin.read().strip()
print("".join(f"{ch}{len(list(run))}" for ch, run in groupby(text)))
` }),
] },
],
quiz: [
  P(c`
def evens():
    n = 0
    while True:
        yield n
        n += 2

g = evens()
next(g)
print(next(g), next(g))`, '2 4'),
  P(c`
g = (c.upper() for c in "abc")
print("".join(g), "".join(g) == "")`, 'ABC True', c`A generator can only be used once; the second ~join~ gets nothing.`),
  Q(c`What does calling a generator function (~gen()~) do straight away?`, ['Runs it to the end', 'Runs it to the first yield', 'Nothing runs yet: it returns a generator object', 'Raises StopIteration'], 2),
  P(c`
from itertools import chain
print(list(chain([1, 2], (3,), "ab")))`, "[1, 2, 3, 'a', 'b']"),
  F('Hand out one value and pause.', c`
def squares(n):
    for i in range(n):
        [[yield]] i * i

print(list(squares(4)))`),
] });

/* ============ ADVANCED 3: BETTER DATA ============ */
topic({ id: 'adv-data', advanced: true, title: 'Modelling Data', icon: '🗃️', color: '#ce82ff', blurb: 'Type hints, dataclasses, enums and the collections toolkit.',
lessons: [
{ id: 'typehints', title: 'Type hints', icon: '🏷️', desc: 'Say what types you mean, and let tools check.',
  steps: [
  T('Annotations', c`**Type hints** say what a function expects and returns. Every serious Python codebase uses them: your editor autocompletes better, and checkers like **mypy** catch mistakes before the code runs.`, c`
def greet(name: str, times: int = 1) -> str:
    return ("Hi " + name + "! ") * times

scores: list[int] = []
ages: dict[str, int] = {"Ada": 36}
point: tuple[int, int] = (3, 4)
nickname: str | None = None         # a str, or None

from collections.abc import Callable
def apply(f: Callable[[int], int], x: int) -> int:
    return f(x)`),
  T('Hints are not checks', c`Python itself **ignores** type hints when running. They are notes for people and tools. That is why projects run ~mypy~ (or Pyright) as part of their tests.`, c`
def add(a: int, b: int) -> int:
    return a + b

add("4", "2")       # Python runs it happily: "42"
                    # mypy: Argument 1 has incompatible type "str"; expected "int"`),
  P(c`
def add(a: int, b: int) -> int:
    return a + b

print(add("4", "2"))`, '42', c`The hints say ~int~, but nothing stops two strings from being joined.`),
  P(c`
def area(w: float, h: float) -> float:
    return w * h

print(area.__annotations__)`, "{'w': <class 'float'>, 'h': <class 'float'>, 'return': <class 'float'>}"),
  Q('What does Python do with type hints when the program runs?', ['Checks every call and raises TypeError', 'Converts values to the right type', 'Nothing: they are for readers and tools like mypy', 'Makes the code faster'], 2),
  X({ q: c`Add type hints to both functions: ~find_age~ takes a ~dict[str, int]~ and a ~str~ and returns ~int | None~; ~describe~ takes a ~str~ and an ~int | None~ and returns a ~str~. Then fix ~describe~, which crashes when the age is ~None~.

Expected: ~Ada is 36~ then ~Zed: age unknown~`, start: c`
def find_age(ages, name):
    return ages.get(name)

def describe(name, age):
    return name + " is " + str(age + 0)

ages = {"Ada": 36, "Bo": 22}
print(describe("Ada", find_age(ages, "Ada")))
print(describe("Zed", find_age(ages, "Zed")))
`, tests: [{ out: 'Ada is 36\nZed: age unknown' }], must: [[c`def\s+find_age\s*\(\s*ages\s*:\s*dict\[str,\s*int\]\s*,\s*name\s*:\s*str\s*\)\s*->\s*int\s*\|\s*None`, c`~def find_age(ages: dict[str, int], name: str) -> int | None:~`], [c`def\s+describe\s*\(\s*name\s*:\s*str\s*,\s*age\s*:\s*int\s*\|\s*None\s*\)\s*->\s*str`, c`~def describe(name: str, age: int | None) -> str:~`]], sol: c`
def find_age(ages: dict[str, int], name: str) -> int | None:
    return ages.get(name)

def describe(name: str, age: int | None) -> str:
    if age is None:
        return f"{name}: age unknown"
    return f"{name} is {age}"

ages = {"Ada": 36, "Bo": 22}
print(describe("Ada", find_age(ages, "Ada")))
print(describe("Zed", find_age(ages, "Zed")))
` }),
] },

{ id: 'dataclasses', title: 'Dataclasses & Enums', icon: '📐', desc: 'Classes without the boilerplate, and named constants.',
  steps: [
  T('@dataclass', c`Most classes just hold data, and writing ~__init__~, ~__repr__~ and ~__eq__~ by hand is dull. ~@dataclass~ writes them for you from the type-hinted fields.`, c`
from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price: float
    tags: list[str] = field(default_factory=list)   # a fresh list for each object

    def with_vat(self) -> float:                    # normal methods still work
        return round(self.price * 1.2, 2)

p = Product("Pen", 1.5)
print(p)                    # Product(name='Pen', price=1.5, tags=[])
print(p == Product("Pen", 1.5))   # True: compares the fields`, c`~@dataclass(frozen=True)~ makes objects that cannot be changed — safe to share and usable as dict keys. ~order=True~ adds ~<~ and ~>~.`),
  P(c`
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int = 0

print(Point(3), Point(1, 2) == Point(1, 2))`, 'Point(x=3, y=0) True'),
  P(c`
from dataclasses import dataclass

@dataclass(frozen=True)
class Card:
    rank: str

c = Card("A")
try:
    c.rank = "K"
except Exception as e:
    print(type(e).__name__)`, 'FrozenInstanceError'),
  T('Enum', c`An **Enum** is a fixed set of named values. Use one instead of "magic" strings like ~"pending"~ that can be mistyped.`, c`
from enum import Enum

class Status(Enum):
    PENDING = 1
    PAID = 2
    SHIPPED = 3

s = Status.PAID
print(s.name, s.value)        # PAID 2
print(Status(3))              # Status.SHIPPED
print([m.name for m in Status])`),
  P(c`
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2

print(Color.GREEN, Color.GREEN.name, Color(1))`, 'Color.GREEN GREEN Color.RED'),
  Q(c`Why ~tags: list[str] = field(default_factory=list)~ and not ~tags: list[str] = []~?`, ['It is shorter', 'A plain [] would be one list shared by every object, so dataclass refuses it', 'Lists are not allowed in dataclasses', 'It makes tags read-only'], 1),
  X({ q: c`Model a shop order. Write:

~Status~ — an Enum with ~NEW~ and ~PAID~ · ~Item~ — a dataclass with ~name~, ~price~ and ~qty~ (default 1) · ~Order~ — a dataclass with ~id~, ~items~ (an empty list by default) and ~status~ (default ~Status.NEW~), plus methods ~add(item)~ and ~total()~.

Expected: ~Order 7: 2 items, total £13.50~ then ~PAID~`, start: c`
# write Status, Item and Order here

order = Order(7)
order.add(Item("pen", 1.5, 3))
order.add(Item("book", 9.0))
print(f"Order {order.id}: {len(order.items)} items, total £{order.total():.2f}")
order.status = Status.PAID
print(order.status.name)
`, tests: [{ out: 'Order 7: 2 items, total £13.50\nPAID' }], must: [[c`@dataclass`, c`Use ~@dataclass~.`], [c`class\s+Status\s*\(\s*Enum\s*\)`, c`~class Status(Enum):~`], [c`default_factory`, c`Give ~items~ a fresh list with ~field(default_factory=list)~.`]], sol: c`
from dataclasses import dataclass, field
from enum import Enum

class Status(Enum):
    NEW = 1
    PAID = 2

@dataclass
class Item:
    name: str
    price: float
    qty: int = 1

@dataclass
class Order:
    id: int
    items: list[Item] = field(default_factory=list)
    status: Status = Status.NEW

    def add(self, item: Item) -> None:
        self.items.append(item)

    def total(self) -> float:
        return sum(i.price * i.qty for i in self.items)

order = Order(7)
order.add(Item("pen", 1.5, 3))
order.add(Item("book", 9.0))
print(f"Order {order.id}: {len(order.items)} items, total £{order.total():.2f}")
order.status = Status.PAID
print(order.status.name)
` }),
] },

{ id: 'collections', title: 'The collections toolkit', icon: '🧺', desc: 'defaultdict, deque, namedtuple and Counter.',
  steps: [
  T('Four specialist containers', c`The ~collections~ module has containers built for common jobs:`, c`
from collections import defaultdict, deque, namedtuple, Counter

groups = defaultdict(list)       # missing keys start as []
groups["fruit"].append("apple")  # no KeyError, no setdefault

recent = deque(maxlen=3)         # fast at both ends; keeps only the last 3
recent.append("a")
recent.appendleft("z")
recent.popleft()

Point = namedtuple("Point", "x y")   # a tuple with names
p = Point(3, 4)
print(p.x, p[1])

Counter("banana").most_common(1)     # [('a', 3)]`),
  P(c`
from collections import defaultdict
groups = defaultdict(list)
for w in ["apple", "avocado", "banana"]:
    groups[w[0]].append(w)
print(dict(groups))`, "{'a': ['apple', 'avocado'], 'b': ['banana']}"),
  P(c`
from collections import deque
d = deque([1, 2, 3], maxlen=3)
d.append(4)
print(list(d))`, '[2, 3, 4]', c`With ~maxlen~, adding at one end drops an item from the other.`),
  P(c`
from collections import namedtuple
Point = namedtuple("Point", "x y")
p = Point(3, 4)
print(p.x + p.y, p)`, '7 Point(x=3, y=4)'),
  Q(c`A queue of a million jobs: why ~deque.popleft()~ rather than ~list.pop(0)~?`, ['They are the same', 'pop(0) has to shift every other item along; popleft is instant', 'Lists cannot remove the first item', 'deque uses less memory per item'], 1),
  X({ q: c`**Recent history.** Read commands, one per line. Keep only the last 3 commands in a ~deque(maxlen=3)~. The command ~show~ is not stored: it prints the history joined with ~" > "~.`, start: c`
import sys

for line in sys.stdin:
    command = line.strip()
    print(command)
`, tests: [{ in: 'open\nedit\nsave\nshow\nclose\nshow\n', out: 'open > edit > save\nedit > save > close' }, { in: 'a\nshow\n', out: 'a' }], must: [[c`deque\s*\(`, c`Use a ~deque~.`], [c`maxlen\s*=\s*3`, c`Set ~maxlen=3~.`]], sol: c`
import sys
from collections import deque

history = deque(maxlen=3)
for line in sys.stdin:
    command = line.strip()
    if command == "show":
        print(" > ".join(history))
    elif command:
        history.append(command)
` }),
  X({ q: c`**Anagram groups.** Read words and print each group of anagrams that has **more than one** word, words in the order they arrived, groups in the order their first word arrived. Use a ~defaultdict(list)~ keyed by the word's sorted letters.

~cat act dog god tac fish~ → ~cat act tac~ then ~dog god~`, start: c`
import sys

words = sys.stdin.read().split()
print(words)
`, tests: [{ in: 'cat act dog god tac fish', out: 'cat act tac\ndog god' }, { in: 'listen google silent banana enlist', out: 'listen silent enlist' }], must: [[c`defaultdict`, c`Use ~defaultdict(list)~.`]], hint: c`The key: ~"".join(sorted(word))~. Dicts remember insertion order, so looping over ~groups.values()~ gives the groups in arrival order.`, sol: c`
import sys
from collections import defaultdict

groups = defaultdict(list)
for word in sys.stdin.read().split():
    groups["".join(sorted(word))].append(word)

for group in groups.values():
    if len(group) > 1:
        print(" ".join(group))
` }),
] },
],
quiz: [
  P(c`
from collections import Counter
print(Counter("hello").most_common(1))`, "[('l', 2)]"),
  P(c`
from dataclasses import dataclass

@dataclass
class Pet:
    name: str
    legs: int = 4

print(Pet("Rex") == Pet("Rex", 4))`, 'True'),
  Q(c`What does ~defaultdict(int)~ give for a key it has never seen?`, ['KeyError', 'None', '0', 'An empty list'], 2),
  Q(c`Which is a good reason to use an ~Enum~?`, ['To store a list of numbers', 'To replace "magic" strings with a fixed set of named values that cannot be mistyped', 'To make code run faster', 'To read files'], 1),
  F('Hint that this returns a string or nothing.', c`
def nickname(name: str) -> str [[|]] None:
    return None if len(name) < 3 else name[:3]

print(nickname("Ada"))`),
] });

/* ============ ADVANCED 4: ROBUST CODE ============ */
topic({ id: 'adv-robust', advanced: true, title: 'Robust Code', icon: '🛡️', color: '#ff9600', blurb: 'Custom exceptions, context managers, logging and tests.',
lessons: [
{ id: 'exceptions', title: 'Custom exceptions', icon: '🚨', desc: 'Errors that say exactly what went wrong.',
  steps: [
  T('Your own error types', c`Built-in errors like ~ValueError~ are vague. A library defines its **own** exceptions, usually under one base class, so callers can catch exactly what they care about — or everything from your library at once.`, c`
class BankError(Exception):
    """Anything that goes wrong in the bank."""

class InsufficientFunds(BankError):
    def __init__(self, balance, amount):
        super().__init__(f"need {amount:.2f}, have {balance:.2f}")
        self.balance = balance
        self.amount = amount

class AccountFrozen(BankError):
    pass

try:
    raise InsufficientFunds(20, 50)
except BankError as e:          # catches every bank error
    print("Declined:", e)       # Declined: need 50.00, have 20.00`),
  T('try … except … else … finally', c`~else~ runs only if **nothing** went wrong; ~finally~ runs **no matter what**. And ~raise NewError(...) from err~ keeps the original error attached as the cause — invaluable when debugging.`, c`
try:
    value = int(text)
except ValueError as err:
    raise ConfigError(f"not a number: {text!r}") from err
else:
    print("parsed", value)
finally:
    print("done checking")`),
  P(c`
class AppError(Exception):
    pass

class NotFound(AppError):
    pass

try:
    raise NotFound("user 7")
except AppError as e:
    print(type(e).__name__, e)`, 'NotFound user 7'),
  P(c`
try:
    x = int("5")
except ValueError:
    print("bad")
else:
    print("ok", x)
finally:
    print("done")`, 'ok 5\ndone'),
  Q(c`Why give all your library's exceptions one base class like ~BankError~?`, ['Python requires it', 'Callers can catch every error from your library with one except', 'It makes errors print in colour', 'Exceptions without a base class cannot be raised'], 1),
  X({ q: c`Write ~BankError~ (base), ~InsufficientFunds(BankError)~ whose message is ~need 50.00, have 20.00~ (from the amount and balance), and ~AccountFrozen(BankError)~. ~Account.withdraw~ must raise them.

Expected:
~Declined: need 50.00, have 20.00~
~Declined: account is frozen~
~Balance: 5.00~`, start: c`
# write the three exception classes here

class Account:
    def __init__(self, balance):
        self.balance = balance
        self.frozen = False

    def withdraw(self, amount):
        # raise AccountFrozen("account is frozen") or InsufficientFunds(...)
        self.balance -= amount

acc = Account(20)
for amount in [50, 15]:
    try:
        acc.withdraw(amount)
    except BankError as e:
        print("Declined:", e)
acc.frozen = True
try:
    acc.withdraw(1)
except BankError as e:
    print("Declined:", e)
print(f"Balance: {acc.balance:.2f}")
`, tests: [{ out: 'Declined: need 50.00, have 20.00\nDeclined: account is frozen\nBalance: 5.00' }], must: [[c`class\s+InsufficientFunds\s*\(\s*BankError\s*\)`, c`~class InsufficientFunds(BankError):~`], [c`class\s+AccountFrozen\s*\(\s*BankError\s*\)`, c`~class AccountFrozen(BankError):~`]], sol: c`
class BankError(Exception):
    pass

class InsufficientFunds(BankError):
    def __init__(self, balance, amount):
        super().__init__(f"need {amount:.2f}, have {balance:.2f}")

class AccountFrozen(BankError):
    pass

class Account:
    def __init__(self, balance):
        self.balance = balance
        self.frozen = False

    def withdraw(self, amount):
        if self.frozen:
            raise AccountFrozen("account is frozen")
        if amount > self.balance:
            raise InsufficientFunds(self.balance, amount)
        self.balance -= amount

acc = Account(20)
for amount in [50, 15]:
    try:
        acc.withdraw(amount)
    except BankError as e:
        print("Declined:", e)
acc.frozen = True
try:
    acc.withdraw(1)
except BankError as e:
    print("Declined:", e)
print(f"Balance: {acc.balance:.2f}")
` }),
  X({ q: c`~parse_config~ turns ~key=value~ lines into a dict of whole numbers. When a value is not a number, raise ~ConfigError~ with the message ~line N: 'the line'~ **from** the original ~ValueError~.

Expected:
~{'workers': 4}~
~line 2: 'retries=lots' (caused by ValueError)~`, start: c`
class ConfigError(Exception):
    pass

def parse_config(text):
    settings = {}
    for n, line in enumerate(text.splitlines(), start=1):
        key, value = line.split("=")
        settings[key] = int(value)
    return settings

print(parse_config("workers=4"))
try:
    parse_config("workers=4\nretries=lots")
except ConfigError as e:
    print(f"{e} (caused by {type(e.__cause__).__name__})")
`, tests: [{ out: "{'workers': 4}\nline 2: 'retries=lots' (caused by ValueError)" }], must: [[c`raise\s+ConfigError\([\s\S]*\)\s+from\s+\w+`, c`~raise ConfigError(...) from err~`]], hint: c`Wrap ~int(value)~ in ~try~ / ~except ValueError as err:~ and use ~{line!r}~ to put quotes around the line.`, sol: c`
class ConfigError(Exception):
    pass

def parse_config(text):
    settings = {}
    for n, line in enumerate(text.splitlines(), start=1):
        key, value = line.split("=")
        try:
            settings[key] = int(value)
        except ValueError as err:
            raise ConfigError(f"line {n}: {line!r}") from err
    return settings

print(parse_config("workers=4"))
try:
    parse_config("workers=4\nretries=lots")
except ConfigError as e:
    print(f"{e} (caused by {type(e.__cause__).__name__})")
` }),
] },

{ id: 'context', title: 'Context managers', icon: '🚪', desc: 'Your own with blocks that always clean up.',
  steps: [
  T('What with really does', c`~with~ calls the object's ~__enter__~ at the start and its ~__exit__~ at the end — **always**, even if an exception flies out of the block. That is why ~with open(...)~ never leaks a file. Locks, database transactions and network connections all work this way.`, c`
class Tag:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"<{self.name}>")
        return self                # becomes the "as" variable

    def __exit__(self, exc_type, exc, tb):
        print(f"</{self.name}>")
        return False               # False: let any exception carry on

with Tag("b"):
    print("bold")`),
  T('The quick way: @contextmanager', c`Write a generator with **one** ~yield~: code before it is the set-up, code after it (in ~finally~) is the clean-up.`, c`
from contextlib import contextmanager

@contextmanager
def opened_connection(url):
    conn = connect(url)
    try:
        yield conn            # the with-block runs here
    finally:
        conn.close()          # always runs`),
  P(c`
class Tag:
    def __init__(self, name):
        self.name = name
    def __enter__(self):
        print(f"<{self.name}>")
    def __exit__(self, *args):
        print(f"</{self.name}>")

with Tag("b"):
    print("bold")`, '<b>\nbold\n</b>'),
  P(c`
from contextlib import contextmanager

@contextmanager
def step(name):
    print("start", name)
    try:
        yield
    finally:
        print("end", name)

try:
    with step("upload"):
        raise RuntimeError("boom")
except RuntimeError:
    print("caught")`, 'start upload\nend upload\ncaught', c`The clean-up ran before the error reached the outer ~except~.`),
  Q(c`When does a context manager's clean-up (~__exit__~, or the code after ~yield~ in ~finally~) run?`, ['Only if the block succeeds', 'Only if the block fails', 'Always, when the with block ends, error or not', 'When the program ends'], 2),
  X({ q: c`Write ~@contextmanager~ ~transaction(data)~. It saves a copy of the dict, yields it, and if **any** exception happens inside the block it restores the copy, prints ~rolled back~ and re-raises the error.

Expected:
~{'apples': 3}~
~rolled back~
~Error: not enough apples~
~{'apples': 3}~`, start: c`
from contextlib import contextmanager

# write transaction here

stock = {"apples": 5}
with transaction(stock) as s:
    s["apples"] -= 2
print(stock)

try:
    with transaction(stock) as s:
        s["apples"] -= 10
        if s["apples"] < 0:
            raise ValueError("not enough apples")
except ValueError as e:
    print("Error:", e)
print(stock)
`, tests: [{ out: "{'apples': 3}\nrolled back\nError: not enough apples\n{'apples': 3}" }], must: [[c`@contextmanager`, c`Use ~@contextmanager~.`], [c`\byield\b`, c`~yield data~ inside a ~try~.`]], hint: c`~backup = dict(data)~, then ~try: yield data~ / ~except Exception: data.clear(); data.update(backup); print("rolled back"); raise~`, sol: c`
from contextlib import contextmanager

@contextmanager
def transaction(data):
    backup = dict(data)
    try:
        yield data
    except Exception:
        data.clear()
        data.update(backup)
        print("rolled back")
        raise

stock = {"apples": 5}
with transaction(stock) as s:
    s["apples"] -= 2
print(stock)

try:
    with transaction(stock) as s:
        s["apples"] -= 10
        if s["apples"] < 0:
            raise ValueError("not enough apples")
except ValueError as e:
    print("Error:", e)
print(stock)
` }),
] },

{ id: 'logging', title: 'Logging', icon: '📝', desc: 'print is for users; logging is for developers.',
  steps: [
  T('Why not print?', c`Leftover ~print~ debugging clutters the output and has to be deleted by hand. **Logging** has levels, so you can turn detail up while hunting a bug and down in production — without touching the code. Logs can add times, file names and line numbers, and go to files or monitoring services.`, c`
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

logging.debug("cache contents: %s", cache)   # hidden: below INFO
logging.info("server started on port %d", 8080)
logging.warning("disk %d%% full", 91)
logging.error("could not save order %s", order_id)`, c`Levels from least to most serious: ~DEBUG~ < ~INFO~ < ~WARNING~ < ~ERROR~ < ~CRITICAL~. Pass values as extra arguments (~%s~, ~%d~) rather than an f-string: the text is only built if the message is actually shown.`),
  T('Where logs go', c`Logs go to **stderr** by default, apart from normal output. In these exercises we send them to ~sys.stdout~ so the checker can see them. In bigger programs, each module gets its own named logger: ~log = logging.getLogger(__name__)~.`, c`
import logging, sys
logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s")`),
  P(c`
import logging, sys
logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s %(message)s")
logging.debug("hidden")
logging.info("started")
logging.warning("disk %d%% full", 91)`, 'INFO started\nWARNING disk 91% full'),
  Q(c`With ~level=logging.WARNING~, which of ~debug~, ~info~, ~warning~ and ~error~ messages appear?`, ['All of them', 'Only warning', 'warning and error', 'debug and info'], 2),
  X({ q: c`Replace the ~print~ calls with logging. Set it up with ~stream=sys.stdout~, level ~INFO~ and the format ~"%(levelname)s: %(message)s"~. Skipped orders are **warnings**; the summary is **info**.

Expected:
~WARNING: order 2 has no items~
~WARNING: order 4 has a negative total~
~INFO: processed 2 of 4 orders~`, start: c`
import sys

orders = [
    {"id": 1, "items": ["pen"], "total": 1.5},
    {"id": 2, "items": [], "total": 0},
    {"id": 3, "items": ["book"], "total": 9.0},
    {"id": 4, "items": ["mug"], "total": -3.0},
]

done = 0
for order in orders:
    if not order["items"]:
        print(f"order {order['id']} has no items")
        continue
    if order["total"] < 0:
        print(f"order {order['id']} has a negative total")
        continue
    done += 1
print(f"processed {done} of {len(orders)} orders")
`, tests: [{ out: 'WARNING: order 2 has no items\nWARNING: order 4 has a negative total\nINFO: processed 2 of 4 orders' }], must: [[c`basicConfig`, c`Set up logging with ~logging.basicConfig(...)~.`], [c`logging\.warning`, c`Use ~logging.warning~ for skipped orders.`], [c`logging\.info`, c`Use ~logging.info~ for the summary.`]], not: [[c`print\(`, c`No ~print~ left: log everything.`]], sol: c`
import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s")

orders = [
    {"id": 1, "items": ["pen"], "total": 1.5},
    {"id": 2, "items": [], "total": 0},
    {"id": 3, "items": ["book"], "total": 9.0},
    {"id": 4, "items": ["mug"], "total": -3.0},
]

done = 0
for order in orders:
    if not order["items"]:
        logging.warning("order %s has no items", order["id"])
        continue
    if order["total"] < 0:
        logging.warning("order %s has a negative total", order["id"])
        continue
    done += 1
logging.info("processed %d of %d orders", done, len(orders))
` }),
] },

{ id: 'testing', title: 'Testing with unittest', icon: '🧪', desc: 'Code that proves your code works — and keeps it working.',
  steps: [
  T('Why test?', c`Every professional codebase has **automated tests**: small programs that call your code and check the answers. Run them after every change and you know straight away if you broke something. Many teams will not merge code without them.`, c`
import unittest

def slugify(title):
    return "-".join(title.lower().split())

class TestSlugify(unittest.TestCase):
    def test_spaces_become_dashes(self):
        self.assertEqual(slugify("Hello World"), "hello-world")

    def test_extra_spaces(self):
        self.assertEqual(slugify("  a   b "), "a-b")

if __name__ == "__main__":
    unittest.main()`, c`Test methods **must** start with ~test_~, or they never run. Useful checks: ~assertEqual~, ~assertTrue~, ~assertIn~, ~assertAlmostEqual~ (for floats), and ~with self.assertRaises(ValueError):~.`),
  T('Running tests here', c`~unittest.main()~ reports to stderr and then stops the program. To see the results here, run the tests with a runner that writes to ~sys.stdout~:`, c`
import sys
suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestSlugify)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)

# test_extra_spaces (__main__.TestSlugify.test_extra_spaces) ... ok
# test_spaces_become_dashes (__main__.TestSlugify.test_spaces_become_dashes) ... ok
# ----------------------------------------------------------------------
# Ran 2 tests in 0.000s
#
# OK`, c`In a real project you would just run ~python -m unittest~ (or the popular ~pytest~) from the terminal.`),
  Q(c`A test method is called ~check_total(self)~. What happens when the tests run?`, ['It runs like any other', 'It never runs: test methods must start with test_', 'It fails', 'It runs last'], 1),
  Q(c`How do you test that ~withdraw(-5)~ raises ~ValueError~?`, [c`~self.assertEqual(withdraw(-5), ValueError)~`, c`~with self.assertRaises(ValueError): withdraw(-5)~`, c`~try: withdraw(-5) except: pass~`, c`~self.assertTrue(withdraw(-5))~`], 1),
  X({ q: c`The tests are written, and three of the four fail. Fix ~price_with_discount(price, percent)~ (do not change the tests) so all four pass: it takes ~percent~ off the price, rounds to 2 decimal places, and raises ~ValueError~ if ~percent~ is not between 0 and 100.`, start: c`
import sys
import unittest

def price_with_discount(price, percent):
    return price - percent

class TestDiscount(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(price_with_discount(100, 20), 80.0)

    def test_zero(self):
        self.assertEqual(price_with_discount(50, 0), 50.0)

    def test_rounding(self):
        self.assertEqual(price_with_discount(9.99, 10), 8.99)

    def test_invalid(self):
        with self.assertRaises(ValueError):
            price_with_discount(10, 150)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestDiscount)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
`, tests: [{ has: ['Ran 4 tests', '\nOK'] }], must: [[c`def\s+test_invalid`, c`Keep the tests as they are.`], [c`raise\s+ValueError`, c`Raise ~ValueError~ for a bad percent.`]], hint: c`~if not 0 <= percent <= 100: raise ValueError(...)~, then ~return round(price * (100 - percent) / 100, 2)~.`, sol: c`
import sys
import unittest

def price_with_discount(price, percent):
    if not 0 <= percent <= 100:
        raise ValueError("percent must be between 0 and 100")
    return round(price * (100 - percent) / 100, 2)

class TestDiscount(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(price_with_discount(100, 20), 80.0)

    def test_zero(self):
        self.assertEqual(price_with_discount(50, 0), 50.0)

    def test_rounding(self):
        self.assertEqual(price_with_discount(9.99, 10), 8.99)

    def test_invalid(self):
        with self.assertRaises(ValueError):
            price_with_discount(10, 150)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestDiscount)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
` }),
  X({ q: c`Now write the tests yourself. ~is_strong(password)~ is finished. Write ~TestPassword~ with **at least four** ~test_~ methods covering: a strong password, one that is too short, one with no digit, and one with no capital letter.`, start: c`
import sys
import unittest

def is_strong(password):
    return (len(password) >= 8
            and any(c.isdigit() for c in password)
            and any(c.isupper() for c in password))

# write TestPassword here

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestPassword)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
`, tests: [{ has: ['\nOK'], re: c`Ran ([4-9]|\d\d) tests` }], must: [[c`class\s+TestPassword\s*\(\s*unittest\.TestCase\s*\)`, c`~class TestPassword(unittest.TestCase):~`], [c`assertTrue|assertEqual`, c`Check a strong password with ~assertTrue~.`], [c`assertFalse|assertEqual`, c`Check weak passwords with ~assertFalse~.`]], sol: c`
import sys
import unittest

def is_strong(password):
    return (len(password) >= 8
            and any(c.isdigit() for c in password)
            and any(c.isupper() for c in password))

class TestPassword(unittest.TestCase):
    def test_strong(self):
        self.assertTrue(is_strong("Ferris2024"))

    def test_too_short(self):
        self.assertFalse(is_strong("Ab1"))

    def test_no_digit(self):
        self.assertFalse(is_strong("Password"))

    def test_no_capital(self):
        self.assertFalse(is_strong("password1"))

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestPassword)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
` }),
] },
],
quiz: [
  P(c`
try:
    raise KeyError("x")
except LookupError as e:
    print("caught", type(e).__name__)`, 'caught KeyError', c`~KeyError~ is a kind of ~LookupError~, so catching the base class catches it.`),
  P(c`
def f():
    try:
        return "try"
    finally:
        print("finally")

print(f())`, 'finally\ntry', c`~finally~ runs even when the ~try~ block returns.`),
  Q(c`Which is the best way to record that a background job skipped a bad record?`, [c`~print("skipped")~`, c`~logging.warning("skipped record %s", rid)~`, 'Raise an exception and crash', 'Ignore it silently'], 1),
  Q(c`What does ~raise ConfigError("bad") from err~ add?`, ['Nothing', c`It keeps the original error as ~__cause__~, so both show in the traceback`, 'It hides the original error', 'It retries the code'], 1),
  F('Make the with block always tidy up.', c`
from contextlib import contextmanager

@contextmanager
def tidy():
    try:
        [[yield]]
    finally:
        print("tidied")

with tidy():
    print("working")`),
] });
