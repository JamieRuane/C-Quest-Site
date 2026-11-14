/* ================= Python, Part 2: Advanced (topics A5-A8) ================= */
G('regular expression', c`A pattern for matching text: ~\d+~ is "one or more digits". Python's ~re~ module searches, extracts and replaces with them.`);
G('raw string', c`~r"\d+"~: backslashes are kept as they are. Always use raw strings for regular expressions.`);
G('csv module', c`Reads and writes CSV properly, including quoted fields with commas inside. Never just ~split(",")~.`);
G('JSON', c`The text format most web APIs use. ~json.loads~ turns text into Python data; ~json.dumps~ goes the other way.`);
G('datetime', c`Dates and times: ~datetime~, ~date~, ~timedelta~ for differences, ~strptime~ to read text, ~strftime~ to format it.`);
G('Big-O', c`How the work grows with the size of the input: ~O(1)~ constant, ~O(n)~ linear, ~O(n²)~ quadratic, ~O(log n)~ logarithmic.`);
G('memoisation', c`Remembering results you have already worked out. ~@functools.cache~ does it for you.`);
G('heap', c`A structure that always hands out its smallest item quickly. ~heapq~ turns a list into one: a ready-made priority queue.`);
G('binary search', c`Finding a place in a **sorted** list by halving the search each step. ~bisect~ does it in ~O(log n)~.`);
G('thread', c`A separate line of execution in the same program. In Python, threads help most when the program is **waiting** (network, disk).`);
G('GIL', c`The Global Interpreter Lock: in standard Python, only one thread runs Python code at a time. CPU-heavy work uses processes instead.`);
G('asyncio', c`Python's way to juggle many waiting tasks in one thread: ~async def~, ~await~, ~asyncio.gather~. Used by modern web frameworks and bots.`);
G('coroutine', c`What an ~async def~ function returns. It only runs when awaited (or handed to ~asyncio.run~ / ~gather~).`);

/* ============ ADVANCED 5: TEXT & DATA ============ */
topic({ id: 'adv-textdata', advanced: true, title: 'Text & Data', icon: '📊', color: '#2b70c9', blurb: 'Regular expressions, CSV and JSON, dates and times.',
lessons: [
{ id: 'regex', title: 'Regular expressions', icon: '🔍', desc: 'Find, check and replace patterns in text.',
  steps: [
  T('Patterns', c`A **regular expression** describes a pattern of text. They look cryptic at first, but a handful of pieces cover most needs:`, c`
\d   a digit          \w  letter, digit or _       \s  whitespace
.    any character    [abc]  one of these          [^abc]  none of these
+    one or more      *  zero or more              ?  optional        {2,4}  2 to 4 times
^    start            $  end                       ( )  a group you can pull out`, c`Always write patterns as **raw strings**, ~r"\d+"~, so Python leaves the backslashes alone.`),
  T('The re module', c`Four functions do almost everything:`, c`
import re

re.search(r"\d+", "Order 66 shipped")       # first match anywhere (or None)
re.fullmatch(r"\d{4}", "2024")              # the WHOLE string must match
re.findall(r"#(\w+)", "#python and #rust")  # every match: ['python', 'rust']
re.sub(r"\s+", " ", "too    many   spaces") # replace

m = re.search(r"(\w+)@(\w+)\.com", "mail ada@example.com")
m.group(1), m.group(2)                      # 'ada', 'example'`),
  P(c`
import re
print(re.findall(r"\d+", "3 apples, 12 pears"))`, "['3', '12']"),
  P(c`
import re
m = re.search(r"(\w+)@(\w+)\.com", "mail ada@example.com now")
print(m.group(1), m.group(2))`, 'ada example'),
  P(c`
import re
print(re.sub(r"\s+", " ", "too    many   spaces"))`, 'too many spaces'),
  P(c`
import re
print(bool(re.fullmatch(r"[A-Z]{2}\d{2}", "AB12")), bool(re.fullmatch(r"[A-Z]{2}\d{2}", "AB123")))`, 'True False', c`~fullmatch~ insists the whole string fits; ~search~ would have been happy with ~AB12~ inside ~AB123~.`),
  Q(c`Why write ~r"\d+"~ instead of ~"\d+"~?`, ['The r makes it faster', 'In a raw string backslashes are left alone, so the pattern reaches re exactly as written', 'r means "regex"', 'It is required for findall'], 1),
  X({ q: c`Check usernames, one per line: 3 to 16 characters, starting with a **letter**, then only letters, digits or ~_~. Print ~valid~ or ~invalid~ for each.`, start: c`
import sys

for line in sys.stdin:
    name = line.strip()
    print(name)
`, tests: [{ in: 'ferris_99\n9lives\nab\nCode_Quest_Rules_OK\nAda\n', out: 'valid\ninvalid\ninvalid\ninvalid\nvalid' }], must: [[c`re\.(fullmatch|match|search)`, c`Use the ~re~ module.`]], hint: c`~re.fullmatch(r"[A-Za-z]\w{2,15}", name)~ — the first letter plus 2 to 15 more makes 3 to 16.`, sol: c`
import re
import sys

for line in sys.stdin:
    name = line.strip()
    print("valid" if re.fullmatch(r"[A-Za-z]\w{2,15}", name) else "invalid")
` }),
  X({ q: c`Pull every email address out of some text. Print each **different** address once, in lower case, in alphabetical order.`, start: c`
import sys

text = sys.stdin.read()
print(text)
`, tests: [{ in: 'Contact Ada@Example.com or bo@test.org. Again: ada@example.com!', out: 'ada@example.com\nbo@test.org' }, { in: 'no emails here', out: '' }], must: [[c`re\.findall`, c`Use ~re.findall~.`]], hint: c`~r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+"~ — the last part repeats "dot then word" so a full stop at the end of a sentence is not swallowed. A ~set~ removes duplicates.`, sol: c`
import re
import sys

text = sys.stdin.read()
emails = {e.lower() for e in re.findall(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+", text)}
for email in sorted(emails):
    print(email)
` }),
] },

{ id: 'csvjson', title: 'CSV & JSON', icon: '📑', desc: 'The two formats real data arrives in.',
  steps: [
  T('csv, not split', c`CSV looks simple until a field contains a comma: ~"Smith, Jo",Leeds~. The ~csv~ module handles quotes properly. ~DictReader~ uses the header row, so each row is a dict.`, c`
import csv, sys

for row in csv.DictReader(sys.stdin):          # any file-like object works
    print(row["name"], float(row["salary"]))

writer = csv.writer(sys.stdout)
writer.writerow(["name", "city"])
writer.writerow(["Smith, Jo", "Leeds"])        # quoted automatically`, c`~io.StringIO("some text")~ turns a string into a file-like object — handy for testing code that reads files.`),
  P(c`
import csv, io
rows = list(csv.reader(io.StringIO('name,city\n"Smith, Jo",Leeds\n')))
print(rows[1])`, "['Smith, Jo', 'Leeds']"),
  T('JSON', c`Web APIs speak **JSON**. ~json.loads~ turns JSON text into dicts and lists; ~json.dumps~ turns them back, optionally pretty-printed.`, c`
import json

data = json.loads('{"name": "Ada", "langs": ["py", "c"]}')
data["langs"].append("rust")
print(json.dumps(data, indent=2, sort_keys=True))`),
  P(c`
import json
data = json.loads('{"name": "Ada", "langs": ["py", "c"]}')
print(data["langs"][1], json.dumps({"b": 1, "a": [1, 2]}, sort_keys=True))`, 'c {"a": [1, 2], "b": 1}'),
  Q(c`Why not read a CSV line with ~line.split(",")~?`, ['It is too slow', 'A quoted field can contain commas, which split would cut in two', 'split cannot handle numbers', 'It only reads the first line'], 1),
  X({ q: c`Read a CSV of staff (~name,department,salary~) and print each department in alphabetical order with its head count and average salary (whole pounds, with a thousands separator). Use ~person~ for one and ~people~ for more.

~Engineering: 2 people, average £55,000~`, start: c`
import sys

for line in sys.stdin:
    print(line.strip())
`, tests: [{ in: 'name,department,salary\n"Smith, Jo",Engineering,60000\nAda,Engineering,50000\nBo,Sales,40000\n', out: 'Engineering: 2 people, average £55,000\nSales: 1 person, average £40,000' }], must: [[c`csv\.DictReader`, c`Read it with ~csv.DictReader~.`]], hint: c`Collect salaries in a ~defaultdict(list)~ keyed by department. ~f"{avg:,.0f}"~ adds the thousands separator.`, sol: c`
import csv
import sys
from collections import defaultdict

salaries = defaultdict(list)
for row in csv.DictReader(sys.stdin):
    salaries[row["department"]].append(float(row["salary"]))

for dept in sorted(salaries):
    pay = salaries[dept]
    word = "person" if len(pay) == 1 else "people"
    print(f"{dept}: {len(pay)} {word}, average £{sum(pay) / len(pay):,.0f}")
` }),
  X({ q: c`Convert CSV to JSON: read ~name,age~ rows and print them as a JSON list of objects, with ~age~ as a number, using ~indent=2~.`, start: c`
import sys

print(sys.stdin.read())
`, tests: [{ in: 'name,age\nAda,36\nBo,22\n', out: '[\n  {\n    "name": "Ada",\n    "age": 36\n  },\n  {\n    "name": "Bo",\n    "age": 22\n  }\n]' }], must: [[c`json\.dumps`, c`Use ~json.dumps~.`], [c`csv\.`, c`Read it with the ~csv~ module.`]], sol: c`
import csv
import json
import sys

people = [{"name": row["name"], "age": int(row["age"])} for row in csv.DictReader(sys.stdin)]
print(json.dumps(people, indent=2))
` }),
] },

{ id: 'datetime', title: 'Dates & times', icon: '📅', desc: 'Parse, format and do arithmetic with dates.',
  steps: [
  T('datetime', c`Never do date maths by hand: months have different lengths, and leap years exist. The ~datetime~ module knows all of it.`, c`
from datetime import date, datetime, timedelta

d = date(2024, 2, 28) + timedelta(days=2)       # 2024-03-01 (a leap year!)
gap = date(2025, 1, 1) - date(2024, 12, 25)     # a timedelta: gap.days == 7

t = datetime.strptime("2024-07-04 09:30", "%Y-%m-%d %H:%M")   # text → datetime
t.strftime("%A %d %B, %H:%M")                                 # → 'Thursday 04 July, 09:30'
date.fromisoformat("2024-07-04")                              # the ISO shortcut`, c`Common codes: ~%Y~ year, ~%m~ month number, ~%d~ day, ~%H:%M~ time, ~%A~ weekday name, ~%B~ month name, ~%b~ short month name.`),
  P(c`
from datetime import date, timedelta
print(date(2024, 2, 28) + timedelta(days=2))`, '2024-03-01'),
  P(c`
from datetime import datetime
t = datetime.strptime("2024-07-04 09:30", "%Y-%m-%d %H:%M")
print(t.strftime("%d %b %Y, %H:%M"))`, '04 Jul 2024, 09:30'),
  P(c`
from datetime import date
print((date(2025, 1, 1) - date(2024, 12, 25)).days)`, '7'),
  Q(c`Why should code that is tested avoid ~date.today()~ inside its calculations?`, ['It is slow', 'The answer changes every day, so tests cannot know what to expect: pass the date in instead', 'It does not exist', 'It ignores leap years'], 1),
  X({ q: c`Read two dates (~YYYY-MM-DD YYYY-MM-DD~) and print how many days from the first to the second (~1 day~ / ~N days~), then the weekday of the second:

~2025-11-14 2025-12-25~ → ~41 days~ then ~That is a Thursday~`, start: c`
import sys

start, end = sys.stdin.read().split()
print(start, end)
`, tests: [{ in: '2025-11-14 2025-12-25', out: '41 days\nThat is a Thursday' }, { in: '2025-12-31 2026-01-01', out: '1 day\nThat is a Thursday' }], must: [[c`fromisoformat|strptime`, c`Turn the text into dates with ~date.fromisoformat~ or ~strptime~.`]], sol: c`
import sys
from datetime import date

start, end = (date.fromisoformat(s) for s in sys.stdin.read().split())
days = (end - start).days
print(f"{days} day" if days == 1 else f"{days} days")
print(f"That is a {end.strftime('%A')}")
` }),
  X({ q: c`Add up shifts given as ~HH:MM-HH:MM~, one per line, and print the total as ~Total: 14h 00m~. Use ~datetime.strptime~ and ~timedelta~.`, start: c`
import sys

for line in sys.stdin:
    print(line.strip())
`, tests: [{ in: '09:00-17:30\n22:00-23:45\n08:15-12:00\n', out: 'Total: 14h 00m' }, { in: '10:00-10:20\n', out: 'Total: 0h 20m' }], must: [[c`strptime`, c`Read the times with ~strptime~.`], [c`timedelta`, c`Keep the total as a ~timedelta~.`]], hint: c`Start with ~total = timedelta()~. Each shift: ~end - start~. At the end, ~minutes = int(total.total_seconds()) // 60~.`, sol: c`
import sys
from datetime import datetime, timedelta

total = timedelta()
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    start, end = (datetime.strptime(t, "%H:%M") for t in line.split("-"))
    total += end - start

minutes = int(total.total_seconds()) // 60
print(f"Total: {minutes // 60}h {minutes % 60:02}m")
` }),
] },
],
quiz: [
  P(c`
import re
print(re.findall(r"[aeiou]", "rhythm and blues"))`, "['a', 'u', 'e']"),
  P(c`
import json
print(json.loads("[1, 2, 3]")[-1] + 1)`, '4'),
  P(c`
from datetime import date
print(date(2024, 3, 1).strftime("%A"))`, 'Friday'),
  Q(c`Which pattern matches exactly three digits and nothing else, with ~re.fullmatch~?`, [c`~r"\d+"~`, c`~r"\d{3}"~`, c`~r"[0-3]"~`, c`~r"ddd"~`], 1),
  F('Read CSV rows as dicts.', c`
import csv, io
for row in csv.[[DictReader]](io.StringIO("a,b\n1,2\n")):
    print(row["b"])`),
] });

/* ============ ADVANCED 6: PERFORMANCE & ALGORITHMS ============ */
topic({ id: 'adv-algorithms', advanced: true, title: 'Performance & Algorithms', icon: '🏎️', color: '#00cd9c', blurb: 'Big-O, recursion with memoisation, heaps and binary search.',
lessons: [
{ id: 'bigo', title: 'Big-O & the right container', icon: '📈', desc: 'Why the same program can take a second or a week.',
  steps: [
  T('How does the work grow?', c`**Big-O** describes how the running time grows as the input grows. It is the language of every technical interview — and the reason some programs collapse on real data.`, c`
O(1)        constant      dict lookup, set membership, list[i]
O(log n)    logarithmic   binary search: 1,000,000 items → about 20 steps
O(n)        linear        one loop over the data, "x in list"
O(n log n)  sort          sorted(), list.sort()
O(n²)       quadratic     a loop inside a loop over the same data`, c`At a million items, O(n) is a million steps; O(n²) is a **trillion**.`),
  T('Pick the right container', c`The cheapest speed-up is usually choosing a better container, not cleverer code.`, c`
x in my_list       # O(n): checks every item
x in my_set        # O(1): jumps straight there
my_dict[key]       # O(1)
my_list.pop(0)     # O(n): every other item shifts along
my_deque.popleft() # O(1)`),
  P(c`
def pairs(n):
    count = 0
    for i in range(n):
        for j in range(n):
            count += 1
    return count

print(pairs(10), pairs(20))`, '100 400', c`Twice the input, four times the work: that is O(n²).`),
  Q(c`You check ~if name in banned~ a million times. ~banned~ has 50,000 names. Which container should it be?`, ['A list', 'A set', 'A string', 'It makes no difference'], 1),
  Q(c`Roughly how many steps does a binary search need for 1,000,000 sorted items?`, ['About 20', 'About 1,000', 'About 500,000', 'About 1,000,000'], 0),
  X({ q: c`Read whole numbers and print the **first** number that appears a second time, or ~none~. Use a ~set~ of numbers already seen, so it is O(n) rather than O(n²).`, start: c`
import sys

nums = [int(w) for w in sys.stdin.read().split()]
print(nums)
`, tests: [{ in: '3 8 1 8 3', out: '8' }, { in: '1 2 3', out: 'none' }, { in: '5 5', out: '5' }], must: [[c`set\(\)|\{\s*\}`, c`Keep a ~set()~ of numbers already seen.`]], not: [[c`\.count\(`, c`~list.count~ loops over the whole list each time: O(n²).`]], sol: c`
import sys

nums = [int(w) for w in sys.stdin.read().split()]
seen = set()
for n in nums:
    if n in seen:
        print(n)
        break
    seen.add(n)
else:
    print("none")
` }),
  X({ q: c`**Two-sum**, the most famous interview question. The first number is a target; the rest are a list. Print the positions (from 0) of the first pair that adds up to the target, as ~i j~, or ~none~. Do it in **one pass** with a dict that remembers where each number was.

~9~ then ~2 7 11 15~ → ~0 1~`, start: c`
import sys

target, *nums = (int(w) for w in sys.stdin.read().split())
print(target, nums)
`, tests: [{ in: '9\n2 7 11 15', out: '0 1' }, { in: '6\n3 2 4', out: '1 2' }, { in: '10\n1 2 3', out: 'none' }], must: [[c`\{\s*\}|dict\(`, c`Use a dict: number → position.`]], hint: c`For each ~i, n~: if ~target - n~ is already in the dict, you found the pair. Otherwise store ~seen[n] = i~.`, sol: c`
import sys

target, *nums = (int(w) for w in sys.stdin.read().split())
seen = {}
for i, n in enumerate(nums):
    if target - n in seen:
        print(seen[target - n], i)
        break
    seen[n] = i
else:
    print("none")
` }),
] },

{ id: 'recursion', title: 'Recursion & memoisation', icon: '🪆', desc: 'Functions that call themselves — made fast.',
  steps: [
  T('Recursion', c`A **recursive** function solves a problem by calling itself on a **smaller** version of it. It needs a **base case** that stops the chain. Recursion fits naturally shaped problems: trees, nested data, folders inside folders.`, c`
def factorial(n):
    if n <= 1:                 # base case
        return 1
    return n * factorial(n - 1)

def total_size(folder):        # nested data: recursion shines
    return sum(total_size(f) if isinstance(f, list) else f for f in folder)`, c`Python stops runaway recursion at about 1,000 calls deep (~RecursionError~).`),
  T('Memoisation', c`Some recursive functions solve the **same** sub-problem again and again. ~fib(40)~ the naive way makes over 300 million calls. Remember the answers with ~@functools.cache~, and it makes 41.`, c`
from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(200)      # instant`),
  P(c`
def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)

print(fact(5))`, '120'),
  P(c`
from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(80))`, '23416728348467685'),
  Q(c`Why is the naive recursive ~fib(40)~ so slow?`, ['Recursion is always slow', 'It works out the same smaller values over and over, so the calls grow exponentially', 'Python cannot add big numbers', 'It never reaches the base case'], 1),
  X({ q: c`You can climb stairs 1, 2 or 3 steps at a time. Write ~ways(n)~, the number of different ways to climb ~n~ stairs, recursively with ~@cache~. Read ~n~ and print the answer.

~4~ → ~7~ · ~30~ → ~53798080~`, start: c`
import sys

n = int(sys.stdin.read())
print(n)
`, tests: [{ in: '4', out: '7' }, { in: '10', out: '274' }, { in: '30', out: '53798080' }], must: [[c`@(functools\.)?(cache|lru_cache)`, c`Use ~@cache~.`], [c`def\s+ways`, c`Write ~def ways(n):~`]], hint: c`Base cases: ~ways(0) == 1~ (one way: do nothing) and ~ways(negative) == 0~. Otherwise ~ways(n - 1) + ways(n - 2) + ways(n - 3)~.`, sol: c`
import sys
from functools import cache

@cache
def ways(n):
    if n < 0:
        return 0
    if n == 0:
        return 1
    return ways(n - 1) + ways(n - 2) + ways(n - 3)

n = int(sys.stdin.read())
print(ways(n))
` }),
  X({ q: c`Write a recursive ~flatten(items)~ that turns any nested list into one flat list.

Expected: ~[1, 2, 3, 4, 5]~ then ~[]~ then ~['a', 'b', 'c']~`, start: c`
# write flatten here

print(flatten([1, [2, [3, 4]], 5]))
print(flatten([[], [[]]]))
print(flatten(["a", ["b"], [[["c"]]]]))
`, tests: [{ out: "[1, 2, 3, 4, 5]\n[]\n['a', 'b', 'c']" }], must: [[c`isinstance`, c`Check ~isinstance(item, list)~.`], [c`def\s+flatten[\s\S]+flatten\(\s*item`, c`Call ~flatten~ on the nested lists.`]], sol: c`
def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, 4]], 5]))
print(flatten([[], [[]]]))
print(flatten(["a", ["b"], [[["c"]]]]))
` }),
] },

{ id: 'heaps', title: 'Heaps & binary search', icon: '⛰️', desc: 'Priority queues and lightning-fast lookups in sorted data.',
  steps: [
  T('heapq: a priority queue', c`A **heap** always gives you its **smallest** item quickly. Schedulers, "top 10" lists and route-finding all use one. ~heapq~ turns an ordinary list into a heap.`, c`
import heapq

tasks = []
heapq.heappush(tasks, (2, "write report"))    # (priority, task)
heapq.heappush(tasks, (1, "fix bug"))
heapq.heappop(tasks)                          # (1, 'fix bug'): smallest first

heapq.nlargest(3, scores)                     # top 3, without sorting everything`),
  P(c`
import heapq
h = [5, 1, 8, 3]
heapq.heapify(h)
print(heapq.heappop(h), heapq.heappop(h))`, '1 3'),
  P(c`
import heapq
print(heapq.nlargest(2, [4, 9, 1, 7]))`, '[9, 7]'),
  T('bisect: binary search', c`~bisect~ finds where a value belongs in a **sorted** list in ~O(log n)~ steps. A neat trick: grade boundaries.`, c`
import bisect

bounds = [50, 60, 70, 80]
"FDCBA"[bisect.bisect(bounds, 75)]      # 'C': 75 belongs after 70

bisect.insort(sorted_list, 42)          # insert and keep it sorted`),
  P(c`
import bisect
grades = [60, 70, 80, 90]
print(bisect.bisect(grades, 75), "FDCBA"[bisect.bisect(grades, 85)])`, '2 B'),
  X({ q: c`**Task scheduler.** Read tasks as ~priority task name~ (lower number = more urgent) and print the task names in the order they should be done. Equal priorities keep their input order. Use ~heapq~.`, start: c`
import sys

for line in sys.stdin:
    print(line.strip())
`, tests: [{ in: '3 write report\n1 fix bug\n2 email Ada\n1 deploy\n', out: 'fix bug\ndeploy\nemail Ada\nwrite report' }], must: [[c`heapq\.heappush|heapq\.heapify`, c`Use ~heapq~.`], [c`heapq\.heappop`, c`Take tasks out with ~heappop~.`]], hint: c`Push ~(priority, position, name)~: the position breaks ties in input order.`, sol: c`
import heapq
import sys

heap = []
for i, line in enumerate(sys.stdin):
    line = line.strip()
    if line:
        priority, name = line.split(" ", 1)
        heapq.heappush(heap, (int(priority), i, name))

while heap:
    print(heapq.heappop(heap)[2])
` }),
  X({ q: c`Turn scores into grades with ~bisect~: below 50 ~F~, 50+ ~D~, 60+ ~C~, 70+ ~B~, 80+ ~A~. Print the grades separated by spaces.

~45 50 79 80 100~ → ~F D B A A~`, start: c`
import sys

scores = [int(w) for w in sys.stdin.read().split()]
print(scores)
`, tests: [{ in: '45 50 79 80 100', out: 'F D B A A' }, { in: '60 69', out: 'C C' }], must: [[c`bisect`, c`Use ~bisect~.`]], not: [[c`\bif\b`, c`Let ~bisect~ choose the grade: no ~if~ chain.`]], sol: c`
import bisect
import sys

bounds = [50, 60, 70, 80]
scores = [int(w) for w in sys.stdin.read().split()]
print(" ".join("FDCBA"[bisect.bisect(bounds, s)] for s in scores))
` }),
] },
],
quiz: [
  Q(c`A function loops over a list, and inside that loop checks ~x in other_list~. Both have n items. What is its Big-O?`, ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], 2),
  P(c`
import heapq
h = []
for x in [7, 2, 9]:
    heapq.heappush(h, -x)
print(-heapq.heappop(h))`, '9', c`Pushing negatives turns the smallest-first heap into a largest-first one.`),
  P(c`
def depth(x):
    return 1 + max((depth(i) for i in x), default=0) if isinstance(x, list) else 0

print(depth([1, [2, [3]]]))`, '3'),
  Q(c`What must be true before you use ~bisect~ on a list?`, ['It has no duplicates', 'It is sorted', 'It holds strings', 'It is shorter than 1,000 items'], 1),
  F('Remember the answers.', c`
from functools import [[cache]]

@cache
def square(n):
    return n * n

print(square(4))`),
] });

/* ============ ADVANCED 7: CONCURRENCY ============ */
topic({ id: 'adv-concurrency', advanced: true, title: 'Concurrency', icon: '⚡', color: '#ffc800', blurb: 'Threads for waiting, asyncio for juggling thousands of tasks.',
lessons: [
{ id: 'threads', title: 'Threads & executors', icon: '🧵', desc: 'Do the waiting in parallel.',
  steps: [
  T('Waiting vs working', c`Most slow programs are **waiting**: for a website, a database, a disk. While one request waits, others could be running. That is what threads are good at in Python.

Python has a **GIL** (Global Interpreter Lock): only one thread runs Python code at any instant. So threads speed up **waiting** (I/O-bound work), but not heavy **calculating** (CPU-bound work). For that, use processes: ~ProcessPoolExecutor~.`),
  T('ThreadPoolExecutor', c`Do not manage threads by hand. An **executor** keeps a pool of worker threads and hands them jobs. ~map~ returns results **in the original order**, however the jobs finish.`, c`
from concurrent.futures import ThreadPoolExecutor

def fetch(url):
    ...                          # waits on the network

with ThreadPoolExecutor(max_workers=8) as pool:
    pages = list(pool.map(fetch, urls))     # same order as urls`),
  P(c`
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=4) as pool:
    print(list(pool.map(lambda x: x * x, [1, 2, 3])))`, '[1, 4, 9]'),
  T('Race conditions', c`When threads **change** shared data, their steps can interleave and lose updates. Protect shared changes with a ~Lock~.`, c`
import threading

lock = threading.Lock()
count = 0

def add_many():
    global count
    for _ in range(100_000):
        with lock:              # one thread at a time in here
            count += 1`),
  P(c`
import threading

lock = threading.Lock()
count = 0

def add_many():
    global count
    for _ in range(1000):
        with lock:
            count += 1

threads = [threading.Thread(target=add_many) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print(count)`, '4000', c`~start()~ launches a thread; ~join()~ waits for it to finish.`),
  Q(c`Which job gets faster with threads in standard Python?`, ['Calculating a billion square roots', 'Downloading 50 web pages', 'Sorting a huge list', 'None: threads never help'], 1),
  X({ q: c`~fake_download~ takes 0.2 seconds per file. Downloading 10 files one after another takes 2 seconds. Use a ~ThreadPoolExecutor~ (10 workers) so they all wait **at the same time**. Print each file's size in the original order, then whether it took under a second.

~report.pdf: 1000~ … ~Fast: True~`, start: c`
import time

def fake_download(name):
    time.sleep(0.2)
    return len(name) * 100

files = [f"file{i}.txt" for i in range(9)] + ["report.pdf"]

start = time.perf_counter()
sizes = [fake_download(f) for f in files]
for name, size in zip(files, sizes):
    print(f"{name}: {size}")
print("Fast:", time.perf_counter() - start < 1)
`, tests: [{ out: 'file0.txt: 900\nfile1.txt: 900\nfile2.txt: 900\nfile3.txt: 900\nfile4.txt: 900\nfile5.txt: 900\nfile6.txt: 900\nfile7.txt: 900\nfile8.txt: 900\nreport.pdf: 1000\nFast: True' }], must: [[c`ThreadPoolExecutor`, c`Use a ~ThreadPoolExecutor~.`]], sol: c`
import time
from concurrent.futures import ThreadPoolExecutor

def fake_download(name):
    time.sleep(0.2)
    return len(name) * 100

files = [f"file{i}.txt" for i in range(9)] + ["report.pdf"]

start = time.perf_counter()
with ThreadPoolExecutor(max_workers=10) as pool:
    sizes = list(pool.map(fake_download, files))
for name, size in zip(files, sizes):
    print(f"{name}: {size}")
print("Fast:", time.perf_counter() - start < 1)
` }),
] },

{ id: 'asyncio', title: 'async & await', icon: '🎭', desc: 'Thousands of waiting tasks in one thread.',
  steps: [
  T('async and await', c`~asyncio~ juggles many waiting tasks in a **single** thread. An ~async def~ function is a **coroutine**. Inside it, ~await~ means "pause me here and let something else run until this is ready". Modern web frameworks (FastAPI), chat bots and scrapers are built on it.`, c`
import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)        # pretend to wait on the network
    return f"{name} ready"

async def main():
    results = await asyncio.gather(   # run them all at once
        fetch("users", 0.3),
        fetch("orders", 0.1),
    )
    print(results)                    # in the order given, not finish order

asyncio.run(main())                   # the entry point`, c`Inside async code, use ~await asyncio.sleep()~, never ~time.sleep()~: that would freeze every task at once.`),
  P(c`
import asyncio

async def hello():
    await asyncio.sleep(0.01)
    return "hi"

print(asyncio.run(hello()))`, 'hi'),
  P(c`
import asyncio

async def job(name, delay):
    await asyncio.sleep(delay)
    print(name, "done")
    return name

async def main():
    results = await asyncio.gather(job("A", 0.3), job("B", 0.1), job("C", 0.2))
    print(results)

asyncio.run(main())`, "B done\nC done\nA done\n['A', 'B', 'C']", c`They **finish** in order of delay, but ~gather~ returns the results in the order you **gave** them.`),
  Q(c`What happens if you call ~fetch("users", 1)~ without ~await~ inside a coroutine?`, ['It runs normally', 'You get a coroutine object back and nothing runs (Python warns it was never awaited)', 'It runs in a new thread', 'It raises TimeoutError'], 1),
  X({ q: c`Call three services at once with ~asyncio.gather~, but give each **0.5 seconds** at most with ~asyncio.wait_for~. Print ~name: ok~ or ~name: timed out~ for each, in the given order.

~users: ok~ ~reports: timed out~ ~orders: ok~`, start: c`
import asyncio

SERVICES = [("users", 0.1), ("reports", 2.0), ("orders", 0.3)]

async def call(name, delay):
    await asyncio.sleep(delay)
    return "ok"

async def main():
    for name, delay in SERVICES:
        print(name, await call(name, delay))

asyncio.run(main())
`, tests: [{ out: 'users: ok\nreports: timed out\norders: ok' }], must: [[c`asyncio\.gather`, c`Run them together with ~asyncio.gather~.`], [c`asyncio\.wait_for`, c`Limit each one with ~asyncio.wait_for(..., timeout=0.5)~.`]], hint: c`Write ~async def safe_call(name, delay)~ that awaits ~asyncio.wait_for(call(name, delay), timeout=0.5)~ inside ~try~, and catches ~TimeoutError~. Then ~gather~ one ~safe_call~ per service.`, sol: c`
import asyncio

SERVICES = [("users", 0.1), ("reports", 2.0), ("orders", 0.3)]

async def call(name, delay):
    await asyncio.sleep(delay)
    return "ok"

async def safe_call(name, delay):
    try:
        return await asyncio.wait_for(call(name, delay), timeout=0.5)
    except TimeoutError:
        return "timed out"

async def main():
    results = await asyncio.gather(*(safe_call(n, d) for n, d in SERVICES))
    for (name, _), result in zip(SERVICES, results):
        print(f"{name}: {result}")

asyncio.run(main())
` }),
] },
],
quiz: [
  Q(c`Your program does heavy maths on 8 CPU cores. Which tool spreads the work across them in standard Python?`, [c`~ThreadPoolExecutor~`, c`~ProcessPoolExecutor~`, c`~asyncio~`, c`~time.sleep~`], 1),
  Q(c`Inside an ~async def~, why use ~await asyncio.sleep(1)~ rather than ~time.sleep(1)~?`, ['They are identical', 'time.sleep blocks the whole thread, freezing every other task', 'asyncio.sleep is more accurate', 'time.sleep does not exist'], 1),
  P(c`
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor() as pool:
    print(list(pool.map(str.upper, ["a", "b"])))`, "['A', 'B']"),
  F('Start the async program.', c`
import asyncio

async def main():
    print("running")

asyncio.[[run]](main())`),
] });

/* ============ ADVANCED 8: PRO PROJECTS ============ */
topic({ id: 'adv-projects', advanced: true, title: 'Professional Projects', icon: '💼', color: '#c0c7ff', blurb: 'Three realistic jobs that combine everything in Part 2.',
lessons: [
{ id: 'pro', title: 'Pro capstones', icon: '🏆', desc: 'A log analyser, a tested inventory module and a data pipeline.',
  steps: [
  T('Like the real thing', c`These three are the kind of task a junior developer really gets. Plan before typing: which data structures? Which functions? What can go wrong? Write it in small pieces, run it often, and keep it tidy — someone else would have to read it.`),
  X({ q: c`**Log analyser.** Read web-server log lines from stdin. A valid line looks like:

~10.0.0.1 - - [10/Oct/2024:13:55:36] "GET /index.html HTTP/1.1" 200 2326~

(IP, timestamp, request, status code, bytes.) Skip lines that do not match. Print exactly:

~Requests: 6~
~Errors: 3 (50.0%)~ (status 400 or more)
~Unique visitors: 3~
~Top pages:~ then the 2 most requested paths as ~  /index.html 3~
~Bytes served: 5904~
~Skipped lines: 1~`, start: c`
import sys

for line in sys.stdin:
    print(line.strip())
`, tests: [{ in: '10.0.0.1 - - [10/Oct/2024:13:55:36] "GET /index.html HTTP/1.1" 200 2326\n10.0.0.2 - - [10/Oct/2024:13:55:40] "GET /about.html HTTP/1.1" 200 1200\n10.0.0.1 - - [10/Oct/2024:13:56:01] "POST /login HTTP/1.1" 401 52\ngarbage line\n10.0.0.3 - - [10/Oct/2024:13:57:12] "GET /index.html HTTP/1.1" 200 2326\n10.0.0.2 - - [10/Oct/2024:13:58:00] "GET /missing HTTP/1.1" 404 0\n10.0.0.1 - - [10/Oct/2024:13:59:59] "GET /index.html HTTP/1.1" 500 0\n', out: 'Requests: 6\nErrors: 3 (50.0%)\nUnique visitors: 3\nTop pages:\n  /index.html 3\n  /about.html 1\nBytes served: 5904\nSkipped lines: 1' }], must: [[c`re\.`, c`Parse the lines with a regular expression.`], [c`Counter`, c`Count paths with ~Counter~.`]], hint: c`One pattern does it all: ~r'(\S+) - - \[(.+?)\] "(\w+) (\S+) [^"]*" (\d{3}) (\d+)'~. Groups 1, 4, 5 and 6 are the IP, path, status and bytes.`, sol: c`
import re
import sys
from collections import Counter

LINE = re.compile(r'(\S+) - - \[(.+?)\] "(\w+) (\S+) [^"]*" (\d{3}) (\d+)')

def parse(lines):
    for line in lines:
        m = LINE.fullmatch(line.strip())
        yield m

requests = errors = size = skipped = 0
visitors = set()
pages = Counter()
for m in parse(sys.stdin):
    if not m:
        skipped += 1
        continue
    ip, _, _, path, status, nbytes = m.groups()
    requests += 1
    visitors.add(ip)
    pages[path] += 1
    size += int(nbytes)
    if int(status) >= 400:
        errors += 1

print(f"Requests: {requests}")
print(f"Errors: {errors} ({errors / requests * 100:.1f}%)")
print(f"Unique visitors: {len(visitors)}")
print("Top pages:")
for path, n in pages.most_common(2):
    print(f"  {path} {n}")
print(f"Bytes served: {size}")
print(f"Skipped lines: {skipped}")
` }),
  X({ q: c`**Inventory module, test-first.** The tests are written. Make all five pass by writing: a dataclass ~Product~ (~name~, ~price~), an exception ~OutOfStock~, and a class ~Inventory~ with ~add(product, qty)~, ~remove(name, qty)~ (raises ~OutOfStock~ if there are not enough), ~quantity(name)~ (0 for unknown products) and ~total_value()~.`, start: c`
import sys
import unittest

# write Product, OutOfStock and Inventory here

class TestInventory(unittest.TestCase):
    def setUp(self):
        self.inv = Inventory()
        self.inv.add(Product("pen", 1.5), 10)

    def test_add_increases_quantity(self):
        self.inv.add(Product("pen", 1.5), 5)
        self.assertEqual(self.inv.quantity("pen"), 15)

    def test_remove(self):
        self.inv.remove("pen", 4)
        self.assertEqual(self.inv.quantity("pen"), 6)

    def test_remove_too_many(self):
        with self.assertRaises(OutOfStock):
            self.inv.remove("pen", 11)
        self.assertEqual(self.inv.quantity("pen"), 10)

    def test_unknown_product(self):
        self.assertEqual(self.inv.quantity("mug"), 0)

    def test_total_value(self):
        self.inv.add(Product("mug", 4.0), 2)
        self.assertAlmostEqual(self.inv.total_value(), 23.0)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestInventory)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
`, tests: [{ has: ['Ran 5 tests', '\nOK'] }], must: [[c`@dataclass`, c`Make ~Product~ a ~@dataclass~.`], [c`class\s+OutOfStock\s*\(`, c`Write ~class OutOfStock(Exception):~`], [c`def\s+test_total_value`, c`Keep the tests as they are.`]], hint: c`Store ~self.stock = {}~ mapping a name to ~[product, qty]~. ~total_value~ is ~sum(p.price * q for p, q in self.stock.values())~.`, sol: c`
import sys
import unittest
from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float

class OutOfStock(Exception):
    pass

class Inventory:
    def __init__(self):
        self.stock: dict[str, list] = {}

    def add(self, product: Product, qty: int) -> None:
        entry = self.stock.setdefault(product.name, [product, 0])
        entry[1] += qty

    def remove(self, name: str, qty: int) -> None:
        if self.quantity(name) < qty:
            raise OutOfStock(f"only {self.quantity(name)} {name} left")
        self.stock[name][1] -= qty

    def quantity(self, name: str) -> int:
        return self.stock[name][1] if name in self.stock else 0

    def total_value(self) -> float:
        return sum(p.price * q for p, q in self.stock.values())

class TestInventory(unittest.TestCase):
    def setUp(self):
        self.inv = Inventory()
        self.inv.add(Product("pen", 1.5), 10)

    def test_add_increases_quantity(self):
        self.inv.add(Product("pen", 1.5), 5)
        self.assertEqual(self.inv.quantity("pen"), 15)

    def test_remove(self):
        self.inv.remove("pen", 4)
        self.assertEqual(self.inv.quantity("pen"), 6)

    def test_remove_too_many(self):
        with self.assertRaises(OutOfStock):
            self.inv.remove("pen", 11)
        self.assertEqual(self.inv.quantity("pen"), 10)

    def test_unknown_product(self):
        self.assertEqual(self.inv.quantity("mug"), 0)

    def test_total_value(self):
        self.inv.add(Product("mug", 4.0), 2)
        self.assertAlmostEqual(self.inv.total_value(), 23.0)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestInventory)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
` }),
  X({ q: c`**Data pipeline.** Orders arrive as CSV (~date,customer,amount~) on stdin. Validate each row: a bad date or a bad amount is **logged** as a warning with its line number (the header is line 1) and skipped. Then print a JSON summary per month (~YYYY-MM~, in order) with the number of orders and the revenue, using ~indent=2~.

Log format: ~%(levelname)s: %(message)s~ to ~sys.stdout~, e.g. ~WARNING: line 4: bad amount 'abc'~.`, start: c`
import sys

for line in sys.stdin:
    print(line.strip())
`, tests: [{ in: 'date,customer,amount\n2024-01-05,ada,100\n2024-01-20,bo,50.5\n2024-02-01,cy,abc\n2024-02-11,ada,75\n2024-13-01,di,20\n', out: 'WARNING: line 4: bad amount \'abc\'\nWARNING: line 6: bad date \'2024-13-01\'\n{\n  "2024-01": {\n    "orders": 2,\n    "revenue": 150.5\n  },\n  "2024-02": {\n    "orders": 1,\n    "revenue": 75.0\n  }\n}' }], must: [[c`csv\.DictReader`, c`Read the CSV with ~csv.DictReader~.`], [c`logging\.warning`, c`Log bad rows with ~logging.warning~.`], [c`json\.dumps`, c`Print the summary with ~json.dumps~.`]], hint: c`~for line_no, row in enumerate(csv.DictReader(sys.stdin), start=2):~ — check the date with ~date.fromisoformat~ and the amount with ~float~, each in its own ~try~. Group with ~defaultdict(lambda: {"orders": 0, "revenue": 0.0})~ keyed by ~row["date"][:7]~.`, sol: c`
import csv
import json
import logging
import sys
from collections import defaultdict
from datetime import date

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s")

def valid_rows(reader):
    for line_no, row in enumerate(reader, start=2):
        try:
            day = date.fromisoformat(row["date"])
        except ValueError:
            logging.warning("line %d: bad date %r", line_no, row["date"])
            continue
        try:
            amount = float(row["amount"])
        except ValueError:
            logging.warning("line %d: bad amount %r", line_no, row["amount"])
            continue
        yield day, amount

summary = defaultdict(lambda: {"orders": 0, "revenue": 0.0})
for day, amount in valid_rows(csv.DictReader(sys.stdin)):
    month = summary[day.strftime("%Y-%m")]
    month["orders"] += 1
    month["revenue"] += amount

print(json.dumps(dict(sorted(summary.items())), indent=2))
` }),
] },
],
quiz: [
  Q(c`A colleague's script reads a 20 GB log with ~f.read().splitlines()~ and crashes. What is the professional fix?`, ['Buy more memory', 'Loop over the file line by line (or with a generator pipeline), so only one line is in memory at a time', 'Split the file by hand', 'Use a bigger list'], 1),
  Q(c`Which combination best describes code that is ready for a team?`, ['Clever one-liners and print debugging', 'Type hints, clear names, custom exceptions, logging and automated tests', 'One big function', 'No comments, so it stays short'], 1),
  P(c`
from collections import Counter
paths = ["/a", "/b", "/a", "/c", "/a", "/b"]
print(Counter(paths).most_common(2))`, "[('/a', 3), ('/b', 2)]"),
  F('Log a warning.', c`
import logging, sys
logging.basicConfig(stream=sys.stdout, format="%(levelname)s: %(message)s")
logging.[[warning]]("disk almost full")`),
] });
