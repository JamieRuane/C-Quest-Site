/* ============ TOPIC 6: COLLECTIONS ============ */
topic({ id: 'collections', title: 'Lists, Tuples, Sets & Dicts', icon: '🗃️', color: '#ffc800', blurb: 'Many values, one name.',
lessons: [
{ id: 'lists', title: 'Lists', icon: '📋', desc: 'Ordered, changeable, and the collection you will use most.',
  v: [['2:23:03', '2:38:08', 'Lists, sets and tuples']],
  steps: [
  T('A list of things', c`A **list** holds many values in order, inside square brackets. Indexing and slicing work just like strings:`, c`
fruits = ["apple", "banana", "cherry"]
print(fruits[0])       # apple
print(fruits[-1])      # cherry
print(fruits[1:])      # ['banana', 'cherry']
print(len(fruits))     # 3`),
  T('Lists can change', c`Unlike strings, lists are **mutable** — methods change the list itself:`, c`
nums = [3, 1, 2]
nums.append(5)        # add to the end       [3, 1, 2, 5]
nums.insert(0, 9)     # insert at index 0    [9, 3, 1, 2, 5]
nums.remove(1)        # remove first 1       [9, 3, 2, 5]
last = nums.pop()     # remove + return last  -> 5
nums.sort()           # sort in place        [2, 3, 9]
nums[0] = 100         # replace an item      [100, 3, 9]`),
  P(c`
items = ["a", "b"]
items.append("c")
items.insert(1, "x")
print(items, len(items))`, "['a', 'x', 'b', 'c'] 4"),
  P(c`
nums = [4, 8, 15, 16, 23, 42]
print(sum(nums), max(nums), min(nums), 15 in nums)`, '108 42 4 True'),
  Q(c`What does ~nums.sort()~ return?`, ['The sorted list', c`~None~ — it sorts the list in place`, 'A copy of the list', 'True'], 1, c`So ~nums = nums.sort()~ is a classic bug: ~nums~ becomes ~None~. Use ~nums.sort()~ alone, or ~new = sorted(nums)~ for a sorted copy.`),
  T('Looping over a list', c`~for item in list~ gives you each item. Need the position too? ~enumerate()~ hands you both:`, c`
fruits = ["apple", "banana", "cherry"]
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")`),
  X({ q: c`Read numbers until the user types ~done~. Then print how many there were, their total, and their average with 2 decimals:

~Count: 3~
~Total: 60.0~
~Average: 20.00~

If no numbers were entered, print ~No numbers~.`, start: c`
numbers = []
while True:
    entry = input("Number or done: ")
`, tests: [{ in: '10\n20\n30\ndone\n', has: ['Count: 3', 'Total: 60.0', 'Average: 20.00'] }, { in: '2.5\ndone\n', has: ['Count: 1', 'Total: 2.5', 'Average: 2.50'] }, { in: 'done\n', re: 'No numbers$' }], hint: c`~numbers.append(float(entry))~, then ~len()~ and ~sum()~ at the end.`, sol: c`
numbers = []
while True:
    entry = input("Number or done: ")
    if entry == "done":
        break
    numbers.append(float(entry))
if numbers:
    print("Count:", len(numbers))
    print("Total:", sum(numbers))
    print(f"Average: {sum(numbers) / len(numbers):.2f}")
else:
    print("No numbers")` }),
  X({ q: c`**Shopping cart.** Read item names until the user types ~q~ (each item can appear more than once). Then print the cart in **alphabetical** order, numbered:

~1. apple~
~2. bread~
~3. milk~`, start: c`
cart = []
`, tests: [{ in: 'milk\napple\nbread\nq\n', re: '1\\. apple\\n2\\. bread\\n3\\. milk$' }, { in: 'tea\nq\n', re: '1\\. tea$' }], sol: c`
cart = []
while True:
    item = input("Item (q to quit): ")
    if item == "q":
        break
    cart.append(item)
cart.sort()
for i, item in enumerate(cart, start=1):
    print(f"{i}. {item}")` }),
] },

{ id: 'tuples', title: 'Tuples, sets & unpacking', icon: '🍎', desc: 'Fixed groups, unique values, and assigning several names at once.',
  steps: [
  T('Tuples', c`A **tuple** is like a list in round brackets — but it **cannot change**. Use one for a fixed group of values, like a coordinate or an RGB colour:`, c`
point = (3, 4)
print(point[0])        # 3
# point[0] = 5         # TypeError: tuples are immutable`),
  T('Unpacking', c`Assign the items of a tuple (or list) to several names in one go. This also gives Python its famous one-line swap:`, c`
x, y = (3, 4)
name, age = "Ada", 36       # the brackets are optional
a, b = 1, 2
a, b = b, a                 # swap!
print(a, b)                 # 2 1`),
  P(c`
first, *rest = [1, 2, 3, 4]
print(first, rest)`, '1 [2, 3, 4]', c`~*rest~ collects "everything else" into a list.`),
  T('Sets', c`A **set** has no order and **no duplicates**. Perfect for "unique things" and fast ~in~ checks:`, c`
colours = {"red", "green", "red", "blue"}
print(len(colours))            # 3 — duplicates vanish
colours.add("pink")

a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)   # union         {1, 2, 3, 4}
print(a & b)   # intersection  {2, 3}
print(a - b)   # difference    {1}`),
  P(c`
words = ["hi", "yo", "hi", "hey", "yo"]
print(len(words), len(set(words)))
print(sorted(set(words)))`, "5 3\n['hey', 'hi', 'yo']", c`Sets have no order, so ~sorted()~ is how you print them predictably.`),
  Q('Which collection would you use to store the unique visitors to a website?', ['list', 'tuple', 'set', 'string'], 2),
  Q('Which of these can you NOT change after creating it?', ['list', 'tuple', 'set', 'dict'], 1),
  X({ q: c`Read two lines of space-separated words. Print the words that appear in **both** lines, sorted alphabetically and separated by spaces. If there are none, print ~nothing in common~.

~cat dog fish~ and ~bird cat fish~ → ~cat fish~`, start: c`
line1 = input("Line 1: ")
line2 = input("Line 2: ")
`, tests: [{ in: 'cat dog fish\nbird cat fish\n', re: '\\ncat fish$' }, { in: 'a b\nc d\n', re: 'nothing in common$' }, { in: 'x x y\ny x\n', re: '\\nx y$' }], hint: c`~set(line1.split()) & set(line2.split())~, then ~" ".join(sorted(common))~.`, sol: c`
line1 = input("Line 1: ")
line2 = input("Line 2: ")
common = set(line1.split()) & set(line2.split())
if common:
    print(" ".join(sorted(common)))
else:
    print("nothing in common")` }),
] },

{ id: 'dicts', title: 'Dictionaries', icon: '📙', desc: 'Look things up by name instead of by position.',
  v: [['3:03:27', '3:11:33', 'Dictionaries'], ['3:11:33', '3:19:42', 'Concession stand program']],
  steps: [
  T('Keys and values', c`A **dictionary** maps **keys** to **values**. Instead of "item number 2" you ask for "the price of popcorn":`, c`
prices = {"popcorn": 4.5, "soda": 2.0, "candy": 1.5}
print(prices["soda"])          # 2.0
prices["nachos"] = 5.0         # add a new pair
prices["soda"] = 2.5           # change a value
del prices["candy"]            # remove a pair
print(len(prices))             # 3`),
  T('Safe lookups', c`Asking for a key that doesn't exist is a ~KeyError~. Check first with ~in~, or use ~.get()~ with a default:`, c`
ages = {"ada": 36}
print("bob" in ages)            # False
print(ages.get("bob"))          # None
print(ages.get("bob", 0))       # 0`),
  T('Looping', c`~.keys()~, ~.values()~ and ~.items()~ let you loop over a dictionary:`, c`
stock = {"apples": 3, "pears": 0}
for fruit, count in stock.items():
    print(f"{fruit}: {count}")`),
  P(c`
d = {"a": 1, "b": 2}
d["c"] = d["a"] + d["b"]
d["a"] = 10
print(d)
print(sum(d.values()))`, "{'a': 10, 'b': 2, 'c': 3}\n15", c`Dictionaries remember the order keys were first added.`),
  Q(c`~d = {"x": 1}~. What does ~d["y"]~ do?`, ['Returns None', 'Returns 0', 'Raises a KeyError', 'Adds "y"'], 2),
  T('Counting with a dictionary', c`One of the most useful patterns in all of programming:`, c`
counts = {}
for word in "a b a c a b".split():
    counts[word] = counts.get(word, 0) + 1
print(counts)        # {'a': 3, 'b': 2, 'c': 1}`),
  X({ q: c`**Concession stand.** The menu is given. Read item names until the user types ~q~. Ignore items that aren't on the menu (print ~Not on the menu~). Then print the total:

~Total: €8.50~`, start: c`
menu = {"popcorn": 4.5, "soda": 2.0, "candy": 1.5, "nachos": 5.0}
total = 0
`, tests: [{ in: 'popcorn\nsoda\nsoda\nq\n', re: 'Total: €8\\.50$' }, { in: 'pizza\ncandy\nq\n', has: ['Not on the menu'], re: 'Total: €1\\.50$' }, { in: 'q\n', re: 'Total: €0\\.00$' }], sol: c`
menu = {"popcorn": 4.5, "soda": 2.0, "candy": 1.5, "nachos": 5.0}
total = 0
while True:
    item = input("Item (q to finish): ")
    if item == "q":
        break
    if item in menu:
        total += menu[item]
    else:
        print("Not on the menu")
print(f"Total: €{total:.2f}")` }),
  X({ q: c`Read a sentence and print how often each word appears, in order of first appearance, ignoring case:

~the: 2~
~cat: 1~
~and: 1~
~dog: 1~

(for ~The cat and the dog~)`, start: c`
text = input("Sentence: ")
`, tests: [{ in: 'The cat and the dog\n', re: '\\nthe: 2\\ncat: 1\\nand: 1\\ndog: 1$' }, { in: 'yes Yes YES\n', re: '\\nyes: 3$' }], sol: c`
text = input("Sentence: ")
counts = {}
for word in text.lower().split():
    counts[word] = counts.get(word, 0) + 1
for word, n in counts.items():
    print(f"{word}: {n}")` }),
] },

{ id: 'grid', title: '2D lists', icon: '⬜', desc: 'Lists of lists: game boards, tables, grids.',
  v: [['2:45:21', '2:53:59', '2D collections']],
  steps: [
  T('A list of lists', c`Put lists inside a list and you get a grid. ~grid[row][col]~ picks one cell:`, c`
board = [
    ["X", "O", "X"],
    [" ", "X", "O"],
    ["O", " ", "X"],
]
print(board[0][2])     # X   row 0, column 2
print(board[1])        # [' ', 'X', 'O']   the whole row

for row in board:
    print("|".join(row))`),
  P(c`
grid = [[1, 2, 3], [4, 5, 6]]
print(grid[1][0], len(grid), len(grid[0]))`, '4 2 3', c`2 rows, 3 columns.`),
  P(c`
grid = [[1, 2], [3, 4]]
total = 0
for row in grid:
    for n in row:
        total += n
print(total)`, '10'),
  Q(c`In ~keypad = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]~, how do you get ~6~?`, [c`~keypad[2][1]~`, c`~keypad[1][2]~`, c`~keypad[6]~`, c`~keypad[2][3]~`], 1),
  X({ q: c`Read a number ~n~ and build an ~n~ × ~n~ multiplication table as a 2D list, where ~table[r][c]~ is ~(r + 1) * (c + 1)~. Then print each row with values separated by tabs. For 3:

~1	2	3~
~2	4	6~
~3	6	9~`, start: c`
n = int(input("n: "))
table = []
`, tests: [{ in: '3\n', re: '1\\t2\\t3\\n2\\t4\\t6\\n3\\t6\\t9$' }, { in: '1\n', re: '\\n1$' }], must: [['append', 'Build the grid with ~.append()~.']], hint: c`For each row, build a list ~row = []~, append the products, then ~table.append(row)~. Print with ~"\t".join(str(x) for x in row)~ — or ~print(*row, sep="\t")~.`, sol: c`
n = int(input("n: "))
table = []
for r in range(n):
    row = []
    for c in range(n):
        row.append((r + 1) * (c + 1))
    table.append(row)
for row in table:
    print(*row, sep="\t")` }),
] },

{ id: 'comprehensions', title: 'Comprehensions & iterables', icon: '📃', desc: 'Build lists in one readable line. Plus zip, sorted and friends.',
  v: [['4:30:33', '4:37:04', 'Iterables'], ['4:45:56', '4:56:17', 'List comprehensions']],
  steps: [
  T('List comprehensions', c`Building a new list from an old one is so common that Python has a shortcut:`, c`
nums = [1, 2, 3, 4, 5]

doubled = []                 # the long way
for n in nums:
    doubled.append(n * 2)

doubled = [n * 2 for n in nums]            # the comprehension
evens = [n for n in nums if n % 2 == 0]    # with a filter
print(doubled, evens)        # [2, 4, 6, 8, 10] [2, 4]`, c`Read it as: "**n × 2**, for each **n** in **nums**".`),
  P(c`print([x ** 2 for x in range(5)])`, '[0, 1, 4, 9, 16]'),
  P(c`
words = ["apple", "Bob", "cat", "Dog"]
print([w.upper() for w in words if len(w) == 3])`, "['BOB', 'CAT', 'DOG']"),
  T('Iterable helpers', c`A few built-ins that work on any list, string, tuple...`, c`
names = ["Ada", "Bo", "Cy"]
scores = [90, 72, 85]
for name, score in zip(names, scores):    # walk two lists side by side
    print(name, score)

print(sorted(scores, reverse=True))        # [90, 85, 72]
print(sorted(names, key=len))              # shortest first
print(any(s > 88 for s in scores))         # True  — at least one
print(all(s > 70 for s in scores))         # True  — every one`),
  P(c`
a = [3, 1, 2]
b = sorted(a)
print(a, b, list(reversed(b)))`, '[3, 1, 2] [1, 2, 3] [3, 2, 1]', c`~sorted()~ returns a **new** list — the original is untouched.`),
  F('Keep only the positive numbers.', c`positives = [n [[for]] n in nums [[if]] n > 0]`),
  X({ q: c`Read a line of space-separated numbers. Using **list comprehensions**, print:

~Squares: [1, 4, 9]~
~Odd: [1, 3]~

(for ~1 2 3~)`, start: c`
nums = [int(x) for x in input("Numbers: ").split()]
`, tests: [{ in: '1 2 3\n', has: ['Squares: [1, 4, 9]', 'Odd: [1, 3]'] }, { in: '4 -5 10\n', has: ['Squares: [16, 25, 100]', 'Odd: [-5]'] }], must: [['\\[[^\\]]*\\bfor\\b[^\\]]*\\bin\\b[\\s\\S]*\\[[^\\]]*\\bfor\\b[^\\]]*\\bin\\b[\\s\\S]*\\[[^\\]]*\\bfor\\b', 'Use list comprehensions for both lists: ~[... for n in nums]~.']], sol: c`
nums = [int(x) for x in input("Numbers: ").split()]
squares = [n * n for n in nums]
odd = [n for n in nums if n % 2 != 0]
print("Squares:", squares)
print("Odd:", odd)` }),
] },

{ id: 'quizgame', title: 'Project: quiz game', icon: '💯', desc: 'Lists, tuples and dictionaries working together.',
  v: [['2:53:59', '3:03:27', 'Quiz game']],
  steps: [
  T('Data drives the program', c`Good programs keep **data** (questions, answers, prices) separate from **logic** (loops, ifs). Add a question to the list and the game just works — no new code.`),
  X({ q: c`The questions are stored as a list of tuples. Ask each one (print the question, read an answer), then print a score. Answers are case-insensitive and ignore surrounding spaces.

~Score: 2/3 (67%)~`, start: c`
questions = [
    ("What is 2 ** 3?", "8"),
    ("Which keyword defines a function?", "def"),
    ("What is the capital of France?", "paris"),
]
score = 0
`, tests: [{ in: '8\ndef\nParis\n', re: 'Score: 3/3 \\(100%\\)$' }, { in: '6\n DEF \nrome\n', re: 'Score: 1/3 \\(33%\\)$' }, { in: '8\nclass\n  PARIS\n', re: 'Score: 2/3 \\(67%\\)$' }], hint: c`~for question, answer in questions:~ — compare ~input(...).strip().lower()~ with ~answer~. The percentage is ~{score / len(questions):.0%}~.`, sol: c`
questions = [
    ("What is 2 ** 3?", "8"),
    ("Which keyword defines a function?", "def"),
    ("What is the capital of France?", "paris"),
]
score = 0
for question, answer in questions:
    print(question)
    guess = input("> ").strip().lower()
    if guess == answer:
        score += 1
print(f"Score: {score}/{len(questions)} ({score / len(questions):.0%})")` }),
  X({ q: c`**Gradebook.** Read lines of ~name score~ until an empty line. Then print each student with their grade, **best score first**:

~Ada 92 A~
~Cy 75 B~
~Bo 40 F~

Grades: 90+ ~A~, 70+ ~B~, 50+ ~C~, else ~F~.`, start: c`
students = {}
`, tests: [{ in: 'Bo 40\nAda 92\nCy 75\n\n', re: 'Ada 92 A\\nCy 75 B\\nBo 40 F$' }, { in: 'Zed 50\n\n', re: 'Zed 50 C$' }], hint: c`Store ~students[name] = int(score)~. Sort with ~sorted(students.items(), key=lambda pair: pair[1], reverse=True)~.`, sol: c`
students = {}
while True:
    line = input()
    if line == "":
        break
    name, score = line.split()
    students[name] = int(score)

for name, score in sorted(students.items(), key=lambda pair: pair[1], reverse=True):
    if score >= 90:
        grade = "A"
    elif score >= 70:
        grade = "B"
    elif score >= 50:
        grade = "C"
    else:
        grade = "F"
    print(name, score, grade)` }),
] },
],
quiz: [
  P(c`
a = [1, 2, 3]
a.append(4)
a.pop(0)
print(a)`, '[2, 3, 4]', c`~pop(0)~ removes the item at index 0.`),
  Q('Which is a tuple?', [c`~[1, 2]~`, c`~(1, 2)~`, c`~{1, 2}~`, c`~{"a": 1}~`], 1),
  P(c`print(len({3, 3, 3, 4}))`, '2'),
  P(c`
d = {"x": 5}
print(d.get("y", 7), d.get("x", 7))`, '7 5'),
  P(c`print([c * 2 for c in "abc"])`, "['aa', 'bb', 'cc']"),
  P(c`
x, y = 1, 2
x, y = y, x + y
print(x, y)`, '2 3', c`The whole right side is worked out first (~2, 3~), then assigned.`),
  Q(c`~nums = nums.sort()~ — what is ~nums~ afterwards?`, ['The sorted list', 'None', 'The original list', 'An error'], 1),
] });

/* ============ TOPIC 7: FUNCTIONS ============ */
topic({ id: 'functions', title: 'Functions', icon: '📞', color: '#ce82ff', blurb: 'Write code once. Call it forever.',
lessons: [
{ id: 'def', title: 'def & arguments', icon: '📞', desc: 'Stop copy-pasting. Name a block of code and reuse it.',
  v: [['3:52:12', '4:02:50', 'Functions']],
  steps: [
  T('Define once, call many times', c`~def~ creates a function. The indented block is its body. Nothing runs until you **call** it with brackets:`, c`
def happy_birthday(name, age):
    print(f"Happy birthday to {name}!")
    print(f"You are {age} years old!")

happy_birthday("Ada", 36)
happy_birthday("Bo", 7)`, c`~name~ and ~age~ are **parameters**. ~"Ada"~ and ~36~ are the **arguments** you pass in.`),
  P(c`
def shout(word):
    print(word.upper() + "!")

shout("hey")
shout("python")`, 'HEY!\nPYTHON!'),
  P(c`
def greet():
    print("Hi")

print("Start")
greet
greet()
print("End")`, 'Start\nHi\nEnd', c`~greet~ without brackets just **names** the function — it doesn't call it.`),
  Q('A function is defined but never called. What does it print?', ['Its first print', 'Everything in it', 'Nothing', 'An error'], 2),
  Q(c`~def add(a, b):~ is called as ~add(1)~. What happens?`, ['b becomes 0', 'b becomes None', 'TypeError: missing 1 required argument', 'It returns 1'], 2),
  O('Arrange a function definition and a call.', c`
def show_total(price, qty):
    total = price * qty
    print(f"Total: {total}")
show_total(2.5, 4)`),
  X({ q: c`Write a function ~box(word)~ that prints the word inside a box made of ~*~. Then call it with ~"Python"~ and ~"Hi"~:

~**********~
~* Python *~
~**********~
~******~
~* Hi *~
~******~`, start: c`
def box(word):
    pass   # replace this

box("Python")
box("Hi")
`, tests: [{ out: '**********\n* Python *\n**********\n******\n* Hi *\n******' }], must: [['def\\s+box\\s*\\(', 'Define ~def box(word):~.']], hint: c`The border is ~"*" * (len(word) + 4)~.`, sol: c`
def box(word):
    border = "*" * (len(word) + 4)
    print(border)
    print(f"* {word} *")
    print(border)

box("Python")
box("Hi")` }),
] },

{ id: 'return', title: 'Return values', icon: '🔙', desc: 'Functions that answer questions instead of printing.',
  steps: [
  T('return hands a value back', c`~return~ ends the function and sends a value back to wherever it was called. The call then **becomes** that value:`, c`
def square(n):
    return n * n

result = square(4)
print(result)               # 16
print(square(3) + square(4))   # 25`, c`Printing shows a value to a **human**. Returning gives it to the **program**, which can keep using it. Most good functions return.`),
  P(c`
def double(x):
    return x * 2

print(double(double(3)))`, '12'),
  P(c`
def nothing():
    x = 5

print(nothing())`, 'None', c`A function with no ~return~ hands back ~None~.`),
  P(c`
def check(n):
    if n > 0:
        return "positive"
    return "not positive"
    print("never runs")

print(check(5), check(-1))`, 'positive not positive', c`~return~ ends the function immediately. Nothing after it runs.`),
  T('Several values', c`Return several values separated by commas — you get a tuple, which you can unpack:`, c`
def min_max(nums):
    return min(nums), max(nums)

low, high = min_max([4, 9, 1])
print(low, high)     # 1 9`),
  F('Make the function give its answer back.', c`
def area(w, h):
    [[return]] w * h

print(area(3, 4))`),
  X({ q: c`Write ~is_even(n)~ that **returns** ~True~ or ~False~. The test code below must print ~True False True~.`, start: c`
def is_even(n):
    print(n % 2 == 0)

print(is_even(4), is_even(7), is_even(0))
`, tests: [{ out: 'True False True' }], must: [['return', 'Use ~return~ instead of ~print~ inside the function.']], sol: c`
def is_even(n):
    return n % 2 == 0

print(is_even(4), is_even(7), is_even(0))` }),
  X({ q: c`Write ~average(nums)~ that returns the average of a list, or ~0~ for an empty list. Then:

~print(average([1, 2, 3, 4]))~ → ~2.5~
~print(average([]))~ → ~0~`, start: c`
def average(nums):
    pass

print(average([1, 2, 3, 4]))
print(average([]))
print(average([10]))
`, tests: [{ out: '2.5\n0\n10.0' }], sol: c`
def average(nums):
    if not nums:
        return 0
    return sum(nums) / len(nums)

print(average([1, 2, 3, 4]))
print(average([]))
print(average([10]))` }),
] },

{ id: 'args', title: 'Default & keyword arguments', icon: '🗝️', desc: 'Optional parameters, named arguments, *args and **kwargs.',
  v: [['4:02:50', '4:08:56', 'Default arguments'], ['4:08:56', '4:15:40', 'Keyword arguments'], ['4:15:40', '4:30:33', '*args & **kwargs']],
  steps: [
  T('Default arguments', c`Give a parameter a default value and the caller can leave it out:`, c`
def net_price(price, discount=0, tax=0.23):
    return price * (1 - discount) * (1 + tax)

print(net_price(100))              # uses both defaults
print(net_price(100, 0.1))         # discount 0.1, default tax
print(net_price(100, tax=0))       # keyword argument: skip to tax`, c`Parameters with defaults must come **after** the ones without.`),
  T('Keyword arguments', c`Pass arguments by **name** and the order stops mattering. It also makes calls self-explanatory — you've already used ~print(..., sep="-", end="")~.`, c`
def hello(greeting, title, first, last):
    print(f"{greeting} {title} {first} {last}")

hello("Hello", title="Mr.", last="Bond", first="James")`),
  P(c`
def power(base, exp=2):
    return base ** exp

print(power(3), power(2, 5), power(exp=3, base=2))`, '9 32 8'),
  T('*args and **kwargs', c`~*args~ collects any number of extra positional arguments into a **tuple**. ~**kwargs~ collects extra keyword arguments into a **dictionary**:`, c`
def add(*nums):
    return sum(nums)

print(add(1, 2), add(1, 2, 3, 4))    # 3 10

def profile(name, **info):
    print(name)
    for key, value in info.items():
        print(f"  {key}: {value}")

profile("Ada", job="mathematician", born=1815)`),
  P(c`
def show(*args, **kwargs):
    print(len(args), sorted(kwargs))

show(1, 2, 3, a=4, b=5)`, "3 ['a', 'b']"),
  Q(c`What type is ~args~ inside ~def f(*args):~?`, ['list', 'tuple', 'dict', 'set'], 1),
  X({ q: c`Write ~make_tag(text, tag="p", **attrs)~ that returns an HTML-ish string. Attributes appear in the order given:

~make_tag("Hi")~ → ~<p>Hi</p>~
~make_tag("Go", "a", href="/home", id="x")~ → ~<a href="/home" id="x">Go</a>~`, start: c`
def make_tag(text, tag="p", **attrs):
    pass

print(make_tag("Hi"))
print(make_tag("Go", "a", href="/home", id="x"))
print(make_tag("Title", tag="h1"))
`, tests: [{ out: '<p>Hi</p>\n<a href="/home" id="x">Go</a>\n<h1>Title</h1>' }], hint: c`Build ~extra = ""~ and for each ~key, value in attrs.items()~ add ~f' {key}="{value}"'~.`, sol: c`
def make_tag(text, tag="p", **attrs):
    extra = ""
    for key, value in attrs.items():
        extra += f' {key}="{value}"'
    return f"<{tag}{extra}>{text}</{tag}>"

print(make_tag("Hi"))
print(make_tag("Go", "a", href="/home", id="x"))
print(make_tag("Title", tag="h1"))` }),
] },

{ id: 'scope', title: 'Scope', icon: '🏠', desc: 'Where variables live — and why functions should return rather than reach out.',
  v: [['5:08:51', '5:14:22', 'Scope resolution']],
  steps: [
  T('Local variables', c`A variable created inside a function is **local**: it exists only while the function runs, and the outside world can't see it.`, c`
def make_total():
    total = 99      # local
    return total

make_total()
print(total)        # NameError: name 'total' is not defined`),
  T('LEGB', c`When Python meets a name it looks in this order: **L**ocal → **E**nclosing function → **G**lobal (the file) → **B**uilt-in (~print~, ~len~...). The first match wins.`, c`
x = "global"

def show():
    x = "local"
    print(x)

show()        # local
print(x)      # global — untouched`),
  P(c`
count = 10

def bump():
    count = 1
    count += 5
    return count

print(bump(), count)`, '6 10', c`The ~count~ inside ~bump~ is a brand-new local variable. The global one is untouched.`),
  P(c`
def add_item(item, basket):
    basket.append(item)

stuff = []
add_item("pen", stuff)
add_item("ink", stuff)
print(stuff)`, "['pen', 'ink']", c`The function received the **same list object**, not a copy. Changing a mutable argument (like a list) is visible outside.`),
  Q(c`Inside a function you write ~score += 1~ where ~score~ is only defined globally. What happens?`, ['The global score goes up by 1', 'UnboundLocalError', 'A new local score is created with value 1', 'Nothing'], 1, c`Assigning makes ~score~ local, but it has no local value yet. ~global score~ would fix it — but returning the new value is cleaner.`),
  X({ q: c`This program uses ~global~. Rewrite ~add_points~ so it takes the score as a **parameter** and **returns** the new score — no ~global~ anywhere. Output must stay:

~15~
~35~`, start: c`
score = 0

def add_points(points):
    global score
    score += points

add_points(15)
print(score)
add_points(20)
print(score)
`, tests: [{ out: '15\n35' }], not: [['\\bglobal\\b', 'No ~global~ — pass the score in and return the new one.']], must: [['return', 'Return the new score.']], sol: c`
score = 0

def add_points(score, points):
    return score + points

score = add_points(score, 15)
print(score)
score = add_points(score, 20)
print(score)` }),
] },

{ id: 'fnwork', title: 'Function workout', icon: '🏋️', desc: 'Lambdas, recursion and three functions with zero hand-holding.',
  steps: [
  T('Two extra tools', c`A **lambda** is a tiny unnamed function, handy as a ~key~ for sorting:`, c`
people = [("Ada", 36), ("Bo", 7), ("Cy", 52)]
print(sorted(people, key=lambda p: p[1]))   # by age`, c`**Recursion** is a function calling itself, with a **base case** that stops it:`),
  T('', c`Each call works on a smaller problem until it hits the base case:`, c`
def countdown(n):
    if n == 0:          # base case
        print("Lift off!")
        return
    print(n)
    countdown(n - 1)    # smaller problem

countdown(3)`),
  P(c`
def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)

print(fact(5), fact(1))`, '120 1'),
  X({ q: c`Write ~count_vowels(text)~ that **returns** the number of vowels (any case). The test code prints:

~3~
~0~
~5~`, start: c`
def count_vowels(text):
    pass

print(count_vowels("Python is fun"))
print(count_vowels("rhythm"))
print(count_vowels("AEIOU"))
`, tests: [{ out: '3\n0\n5' }], must: [['return', 'Return the count.']], sol: c`
def count_vowels(text):
    return sum(1 for ch in text.lower() if ch in "aeiou")

print(count_vowels("Python is fun"))
print(count_vowels("rhythm"))
print(count_vowels("AEIOU"))` }),
  X({ q: c`Write a **recursive** ~fib(n)~: ~fib(0)~ is 0, ~fib(1)~ is 1, otherwise ~fib(n - 1) + fib(n - 2)~. The test prints the first 10:

~0 1 1 2 3 5 8 13 21 34~`, start: c`
def fib(n):
    pass

print(*[fib(i) for i in range(10)])
`, tests: [{ out: '0 1 1 2 3 5 8 13 21 34' }], must: [['def\\s+fib[\\s\\S]*fib\\s*\\([^)]*-', 'Make ~fib~ call itself.']], sol: c`
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(*[fib(i) for i in range(10)])` }),
  X({ q: c`Write ~longest_word(sentence)~ that returns the longest word (the first one, if there's a tie), ignoring punctuation ~.,!?~ at the ends of words. Return ~""~ for an empty sentence.`, start: c`
def longest_word(sentence):
    pass

print(longest_word("The quick brown fox jumped."))
print(longest_word("Hi, yo!"))
print(repr(longest_word("")))
`, tests: [{ out: "jumped\nHi\n''" }], hint: c`~word.strip(".,!?")~ removes those characters from the ends. ~max(words, key=len)~ returns the first longest — but ~max~ of an empty list is an error.`, sol: c`
def longest_word(sentence):
    words = [w.strip(".,!?") for w in sentence.split()]
    if not words:
        return ""
    return max(words, key=len)

print(longest_word("The quick brown fox jumped."))
print(longest_word("Hi, yo!"))
print(repr(longest_word("")))` }),
] },
],
quiz: [
  P(c`
def f(x, y=10):
    return x + y

print(f(1), f(1, 2), f(y=0, x=5))`, '11 3 5'),
  Q(c`What does a function return if it has no ~return~ statement?`, ['0', 'An empty string', 'None', 'It is an error'], 2),
  P(c`
def total(*n):
    return sum(n)

print(total(), total(1, 2, 3))`, '0 6'),
  P(c`
x = 1
def f():
    x = 2
    return x
print(f() + x)`, '3'),
  Q(c`What is the base case in a recursive function?`, ['The first line', 'The condition that stops the recursion', 'The default argument', 'The return type'], 1),
  P(c`print(sorted(["bb", "a", "ccc"], key=lambda s: -len(s)))`, "['ccc', 'bb', 'a']"),
] });
