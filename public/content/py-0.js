/* ================= Python =================
   One path for everyone: it starts from the very first line of code.
   Code challenges: tests are [{ in: 'typed input\n', out: 'exact output' | has: ['must contain'] | re: 'regex' }].
   input() echoes what was typed, like a terminal, so prompts and typed lines appear in the output. */
course('py', {
  name: 'Python', badge: 'Py', color: '#f5a300', video: 'ix9cRaBkVe0', glossTry: 'list', tool: 'Python', py: true, script: 'pyWrap',
  tagline: 'Readable, friendly and everywhere: scripts, data, AI, the web. The easiest place to start.',
  blank: '# Write your Python here\n',
  wandbox: { compiler: 'cpython-3.14.0' },
  x: o => ({ ...o, start: o.start != null ? trimNL(o.start) + '\n' : undefined, sol: trimNL(o.sol) + '\n' }),
});

G('interpreter', c`The program (~python~) that reads your code and runs it line by line, top to bottom.`);
G('print()', c`Shows values on the screen. Separates several values with a space and ends with a new line.`);
G('statement', c`One instruction. In Python each statement normally sits on its own line — no semicolons needed.`);
G('comment', c`Text after ~#~ that Python ignores. Notes for humans.`);
G('string', c`Text, written in quotes: ~"hello"~ or ~'hello'~. Its type is ~str~.`);
G('escape sequence', c`A backslash code inside a string: ~\n~ new line, ~\t~ tab, ~\"~ quote, ~\\~ backslash.`);
G('SyntaxError', c`Python could not even read your code — a missing colon, bracket or quote. Nothing runs.`);
G('traceback', c`The error report Python prints when your program crashes. Read the **last** line first: it names the error.`);
G('variable', c`A name that refers to a value: ~lives = 3~. It can be reassigned to anything later.`);
G('assignment', c`Binding a name to a value with ~=~: ~score = 10~.`);
G('int', c`A whole number: ~42~, ~-7~. Python ints can be as big as you like.`);
G('float', c`A decimal number: ~3.14~. Stored approximately, so ~0.1 + 0.2~ is not exactly ~0.3~.`);
G('bool', c`~True~ or ~False~ — the result of every comparison.`);
G('None', c`Python's "nothing here" value. Functions without a ~return~ give back ~None~.`);
G('type()', c`Tells you what type a value is: ~type(3.0)~ is ~<class 'float'>~.`);
G('type casting', c`Converting a value to another type: ~int("42")~, ~str(7)~, ~float("2.5")~.`);
G('input()', c`Pauses the program, reads a line of typed text and returns it — **always as a string**.`);
G('f-string', c`A string with an ~f~ in front, where ~{expressions}~ are filled in: ~f"Hi {name}"~.`);
G('format specifier', c`Formatting after a colon inside an f-string's braces: ~{price:.2f}~ two decimals, ~{n:,}~ thousands separators, ~{x:>8}~ right-align.`);
G('floor division (//)', c`Divides and rounds **down** to a whole number: ~7 // 2~ is ~3~.`);
G('modulus (%)', c`The remainder after division: ~7 % 2~ is ~1~. Great for "is it even?".`);
G('exponent (**)', c`Power: ~2 ** 10~ is ~1024~.`);
G('augmented assignment', c`Shortcuts like ~x += 1~ (same as ~x = x + 1~), ~-=~, ~*=~, ~/=~.`);
G('module', c`A file of Python code you can ~import~: ~import math~, ~import random~.`);
G('condition', c`An expression that is ~True~ or ~False~, used by ~if~ and ~while~.`);
G('indentation', c`The spaces at the start of a line. In Python they **define** which block a line belongs to. Use 4 spaces.`);
G('= vs ==', c`~=~ assigns a value. ~==~ compares two values.`);
G('logical operators', c`~and~, ~or~, ~not~ — combine or flip conditions.`);
G('truthy / falsy', c`~0~, ~""~, ~[]~, ~{}~ and ~None~ count as False in an ~if~. Almost everything else counts as True.`);
G('conditional expression', c`A one-line if/else that produces a value: ~"even" if n % 2 == 0 else "odd"~.`);
G('match-case', c`Compares one value against several patterns: ~match day:~ then ~case "Sat" | "Sun":~. ~case _:~ catches everything else.`);
G('while loop', c`Repeats a block for as long as its condition stays True.`);
G('for loop', c`Repeats a block once for each item in a sequence: ~for ch in "abc":~.`);
G('range()', c`Produces numbers to loop over: ~range(5)~ is 0..4, ~range(1, 6)~ is 1..5, ~range(10, 0, -2)~ counts down by 2.`);
G('break / continue', c`~break~ leaves the loop entirely. ~continue~ skips to the next round.`);
G('nested loop', c`A loop inside another loop. The inner loop runs completely for every round of the outer one.`);
G('random', c`The standard module for randomness: ~random.randint(1, 6)~, ~random.choice(items)~, ~random.shuffle(items)~.`);
G('index', c`An item's position. The first is ~[0]~. Negative indexes count from the end: ~[-1]~ is the last.`);
G('slicing', c`Taking a piece of a sequence: ~s[start:stop:step]~. ~stop~ is not included. ~s[::-1]~ reverses.`);
G('immutable', c`Cannot be changed after creation. Strings and tuples are immutable; methods give you a **new** value.`);
G('method', c`A function that belongs to a value, called with a dot: ~"hi".upper()~, ~items.append(3)~.`);
G('in (membership)', c`Checks whether something is inside a sequence: ~"a" in "cat"~ is ~True~.`);
G('function', c`A named, reusable block of code defined with ~def~. Takes parameters, can ~return~ a value.`);
G('parameter / argument', c`A parameter is the name in the ~def~ line; an argument is the value you pass when calling.`);
G('return', c`Ends a function and hands a value back to the caller.`);
G('default argument', c`A parameter with a fallback value: ~def greet(name="friend"):~.`);
G('keyword argument', c`Passing an argument by name: ~greet(name="Bo")~. Order then does not matter.`);
G('*args', c`Collects any number of extra positional arguments into a tuple.`);
G('**kwargs', c`Collects any number of extra keyword arguments into a dictionary.`);
G('scope', c`Where a name exists. Variables created inside a function are local to it.`);
G('global', c`Declares that a function wants to assign to a module-level variable. Usually a sign to return a value instead.`);
G('docstring', c`A string right under ~def~ (or ~class~) that describes what it does.`);
G('lambda', c`A tiny unnamed function in one expression: ~lambda x: x * 2~.`);
G('recursion', c`A function that calls itself, with a base case that stops it.`);
G('list', c`An ordered, changeable collection: ~[3, 1, 2]~. Add with ~.append()~.`);
G('tuple', c`An ordered collection that cannot change: ~(3, 4)~. Good for fixed groups like coordinates.`);
G('set', c`An unordered collection with no duplicates: ~{1, 2, 3}~. Very fast ~in~ checks.`);
G('dictionary', c`Key → value pairs: ~{"apple": 0.5, "pear": 0.7}~. Look up with ~d[key]~ or ~d.get(key)~.`);
G('2D list', c`A list of lists — a grid. ~grid[row][col]~.`);
G('list comprehension', c`Builds a list in one line: ~[x * 2 for x in nums if x > 0]~.`);
G('unpacking', c`Assigning a sequence to several names at once: ~x, y = (3, 4)~. Also ~a, b = b, a~ to swap.`);
G('enumerate()', c`Loops with a counter: ~for i, item in enumerate(items):~.`);
G('zip()', c`Walks several sequences side by side: ~for name, score in zip(names, scores):~.`);
G('sorted()', c`Returns a new sorted list. ~key=~ chooses what to sort by, ~reverse=True~ flips it.`);
G('class', c`A blueprint for objects: it bundles data (attributes) with behaviour (methods).`);
G('object / instance', c`One thing made from a class: ~car = Car("red")~.`);
G('__init__', c`The method that runs when an object is created. It sets up the object's attributes.`);
G('self', c`The first parameter of every method: the object the method was called on.`);
G('attribute', c`A variable that belongs to an object: ~car.colour~.`);
G('class variable', c`A variable shared by every instance, defined directly in the class body.`);
G('inheritance', c`A class that builds on another: ~class Dog(Animal):~ gets everything ~Animal~ has.`);
G('super()', c`Calls the parent class's version of a method, usually ~super().__init__(...)~.`);
G('polymorphism', c`Different classes answering the same method call in their own way.`);
G('magic method', c`A ~__double_underscore__~ method Python calls for you: ~__str__~ for ~print~, ~__len__~ for ~len()~, ~__eq__~ for ~==~.`);
G('@property', c`Lets a method be read like an attribute, so you can compute or validate a value behind the scenes.`);
G('decorator', c`A function that wraps another function to add behaviour, written ~@name~ above a ~def~.`);
G('exception', c`An error raised while the program runs: ~ValueError~, ~ZeroDivisionError~, ~KeyError~...`);
G('try / except', c`Runs risky code in ~try~; if a matching exception happens, ~except~ handles it instead of crashing.`);
G('raise', c`Throws an exception yourself: ~raise ValueError("age must be positive")~.`);
G('with', c`Opens something and **guarantees** it is closed afterwards: ~with open("f.txt") as f:~.`);
G('file modes', c`~"r"~ read, ~"w"~ write (**wipes** the file first), ~"a"~ append to the end.`);
G('__name__ == "__main__"', c`True only when the file is run directly, not when it is imported. Guards a program's start-up code.`);
G('stack', c`A last-in, first-out collection. ~append()~ to push, ~pop()~ to take the top.`);

/* ============ TOPIC 1: HELLO, PYTHON ============ */
topic({ id: 'hello', title: 'Hello, Python', icon: '👋', color: '#58cc02', blurb: 'Write, break and fix your first programs.',
lessons: [
{ id: 'first', title: 'Your first program', icon: '🚀', desc: 'Meet print() — and see why Python is famous for being readable.',
  v: [['0:00:00', '0:05:49', 'Your first Python program']],
  steps: [
  T('Why Python?', c`Python runs YouTube's back end, Instagram, NASA scripts, most of today's AI research, and a lot of the tiny tools people write to save themselves an afternoon.

It is popular because it reads almost like English. This is a complete Python program:`, c`
print("Hello, World!")`, c`One line. No setup, no braces, no semicolons. Python runs your file from top to bottom, one line at a time.`),
  Q('How does Python run your file?', ['All at once, in a random order', 'From top to bottom, one line at a time', 'Starting from a function called main', 'Bottom to top'], 1, c`Python is an **interpreter**: it reads the first line, runs it, then the next. If line 5 crashes, lines 1–4 have already run.`),
  T('print() and strings', c`~print(...)~ shows whatever you put in the brackets.

Text has to go in quotes — that makes it a **string**. Double quotes ~"..."~ and single quotes ~'...'~ both work; just match them.

Every ~print~ ends with a new line, so two prints give you two lines.`, c`
print("I am line one")
print('I am line two')
print(42)            # numbers need no quotes`),
  P(c`
print("Ready")
print("Set")
print("Go!")`, 'Ready\nSet\nGo!'),
  F('Make this program say hello.', c`[[print]]("Hello, World!")`),
  O('Tap the lines into the right order to count down.', c`
print(3)
print(2)
print(1)
print("Lift off!")`, c`Python runs lines in order, so the order of your lines **is** the order of the output.`),
  X({ q: c`Your turn. Make the program print exactly: ~I am learning Python!~

Hit **Run** to see what it does, **Check** when you think it is right.`, start: c`
# your code goes here
`, tests: [{ out: 'I am learning Python!' }], hint: c`~print("text goes here")~ — quotes around the text, brackets around the quotes.`, sol: c`print("I am learning Python!")` }),
  X({ q: c`Print this little poem, one line per ~print~:

~Roses are red~
~Python is neat~
~Two lines of code~
~And the job is complete~`, start: c`
print("Roses are red")
`, tests: [{ out: 'Roses are red\nPython is neat\nTwo lines of code\nAnd the job is complete' }], sol: c`
print("Roses are red")
print("Python is neat")
print("Two lines of code")
print("And the job is complete")` }),
] },

{ id: 'printing', title: 'print() tricks & escapes', icon: '🖨️', desc: 'Several values at once, sep and end, and the backslash codes.',
  steps: [
  T('Several things at once', c`Give ~print~ several values separated by commas and it puts **one space** between them:`, c`
print("Score:", 10, "points")      # Score: 10 points`, c`Two optional settings change that: ~sep~ (what goes **between** values) and ~end~ (what goes **at the end**, normally a new line).`),
  P(c`
print("a", "b", "c")
print("a", "b", "c", sep="-")
print("a", "b", "c", sep="")`, 'a b c\na-b-c\nabc'),
  P(c`
print("Loading", end="")
print("...", end="")
print("done")`, 'Loading...done', c`~end=""~ stops ~print~ from moving to a new line, so the next print continues on the same line.`),
  T('Escape sequences', c`Some characters cannot be typed straight into a string. A backslash starts an **escape sequence**:`, c`
print("Line one\nLine two")     # \n  new line
print("Name:\tBro")             # \t  tab
print("She said \"hi\"")        # \"  a quote that does not end the string
print("C:\\Users\\you")         # \\  one real backslash`, c`Or mix quote styles: ~'She said "hi"'~ needs no escaping at all.`),
  Q(c`Which line prints: ~It's "fine"~`, [c`~print("It's "fine"")~`, c`~print('It's "fine"')~`, c`~print("It's \"fine\"")~`, c`~print(It's "fine")~`], 2, c`Inside double quotes, the apostrophe is fine but the inner double quotes must be escaped as ~\"~.`),
  Q(c`How many lines does this print?`, ['1', '2', '3', '4'], 2, c`~\n~ starts a new line: "a", "b", then "c" on the third.`, c`print("a\nb\nc")`),
  F('Print the three words with a slash between them: ~red/green/blue~', c`print("red", "green", "blue", [[sep]]="/")`),
  X({ q: c`Print exactly these two lines using **one single** ~print~ call:

~Path: C:\temp\new~
~She said "hi"~

Run it naively first and watch what ~\t~ and ~\n~ do to your path.`, start: c`
print("Path: C:\temp\new")
`, tests: [{ out: 'Path: C:\\temp\\new\nShe said "hi"' }], not: [['print\\([\\s\\S]*print\\(', 'Use just **one** ~print~ call — put a ~\\n~ between the lines.']], hint: c`To print one backslash, type two: ~\\~. Use ~\n~ for the line break and ~\"~ for the quotes.`, sol: c`print("Path: C:\\temp\\new\nShe said \"hi\"")` }),
  X({ q: c`Using ~sep~ and/or ~end~, print the numbers 1 to 5 like this, on one line:

~1 -> 2 -> 3 -> 4 -> 5~`, start: c`
print(1, 2, 3, 4, 5)
`, tests: [{ out: '1 -> 2 -> 3 -> 4 -> 5' }], hint: c`~sep=" -> "~`, sol: c`print(1, 2, 3, 4, 5, sep=" -> ")` }),
] },

{ id: 'errors', title: 'Comments & errors', icon: '🧯', desc: 'Leave notes for future you, and learn to read what Python is telling you.',
  steps: [
  T('Comments', c`Everything after a ~#~ on a line is a **comment**. Python ignores it. Comments are for humans — mostly you, three weeks from now.`, c`
# This program greets the user
print("Hi")   # comments can sit after code too
# print("this line is switched off")`, c`Putting ~#~ in front of a line is the quickest way to switch it off while testing.`),
  P(c`
print("1")
# print("2")
print("3")  # print("4")
print("5")`, '1\n3\n5'),
  T('Two kinds of error', c`**SyntaxError** — Python could not even read your file (a missing bracket, quote or colon). **Nothing** runs, not even the first line.

**Runtime error** — the file was fine, but something went wrong while running, e.g. dividing by zero. Everything **before** that line already ran. Python prints a **traceback** and stops.

Read tracebacks from the **bottom up**: the last line names the error, the line above shows where.`, c`
Traceback (most recent call last):
  File "main.py", line 2, in <module>
    print(10 / 0)
ZeroDivisionError: division by zero`),
  Q('Line 1 prints "Start", line 2 has a missing closing bracket. What happens?', ['"Start" is printed, then a SyntaxError', 'Only a SyntaxError — nothing is printed', 'Python fixes the bracket for you', 'Everything prints, then a warning'], 1, c`A syntax error stops Python before it runs anything — it has to understand the whole file first.`),
  Q('Line 1 prints "Start", line 2 divides by zero. What happens?', ['"Start" is printed, then a ZeroDivisionError traceback', 'Only the traceback — nothing is printed', 'Nothing at all', 'Python prints "Start" twice'], 0, c`That is a **runtime** error. Python already ran line 1 before it hit the problem on line 2.`),
  Q(c`Python says ~NameError: name 'prnt' is not defined~. What is wrong?`, ['The string is missing quotes', 'print is misspelt', 'You need to import prnt', 'The file is empty'], 1, c`A ~NameError~ means Python met a name it does not know. Nine times out of ten it is a typo.`),
  X({ q: c`Three bugs. Don't hunt by eye — press **Run**, read the **last line** of the error, fix it, repeat. That loop is how real code gets written.

Expected output:

~Errors are just directions~
~Read the last line first~
~Then fix and run again~`, start: c`
print("Errors are just directions")
Print("Read the last line first")
print("Then fix and run again)
print(Done)
`, tests: [{ out: 'Errors are just directions\nRead the last line first\nThen fix and run again' }], hint: c`Python is case-sensitive, every quote needs a partner — and the last line should not be there at all.`, sol: c`
print("Errors are just directions")
print("Read the last line first")
print("Then fix and run again")` }),
] },
],
quiz: [
  Q('What does print() put at the end by default?', ['Nothing', 'A space', 'A new line', 'A full stop'], 2),
  P(c`
print("Hi", end="")
print("Hi")
print("!")`, 'HiHi\n!'),
  P(c`print("x", "y", "z", sep="")`, 'xyz'),
  Q(c`What does ~print("\\")~ print?`, ['Two backslashes', 'One backslash', 'Nothing', 'A new line'], 1, c`~\\~ is the escape sequence for a single backslash.`),
  Q('A file has a SyntaxError on its last line. How many lines run?', ['All except the last', 'None', 'Just the first', 'All of them'], 1),
  Q(c`Which symbol starts a comment in Python?`, [c`~//~`, c`~#~`, c`~--~`, c`~/*~`], 1),
] });

/* ============ TOPIC 2: VARIABLES & DATA ============ */
topic({ id: 'vars', title: 'Variables & Data', icon: '📦', color: '#1cb0f6', blurb: 'Store things, convert them, do maths, read input.',
lessons: [
{ id: 'variables', title: 'Variables', icon: '📦', desc: 'Names for values — strings, ints, floats and booleans.',
  v: [['0:05:49', '0:16:05', 'Variables']],
  steps: [
  T('A name for a value', c`A **variable** is a name that refers to a value. Create one with ~=~:`, c`
name = "Bro"        # str   — text
age = 21            # int   — whole number
price = 10.99       # float — decimal
is_student = True   # bool  — True or False`, c`Python works out the type from the value. Names use ~snake_case~: lowercase words joined with underscores.`),
  Q('Which type is ~3.0~?', ['int', 'float', 'str', 'bool'], 1, c`It has a decimal point, so it is a ~float~ — even though the value is whole.`),
  Q('Which type is ~"42"~?', ['int', 'float', 'str', 'bool'], 2, c`Quotes make it text. ~"42"~ is a string that happens to contain digits.`),
  T('Variables can change', c`Assigning again replaces the old value. The right-hand side is worked out **first**, so you can use the old value to make the new one:`, c`
score = 10
score = score + 5    # take 10, add 5, store 15
print(score)         # 15`),
  P(c`
x = 5
y = x
x = 10
print(x, y)`, '10 5', c`~y = x~ copies the **value** 5 into ~y~. Changing ~x~ afterwards does not touch ~y~.`),
  P(c`
food = "pizza"
print("I like", food)
print("I like food")`, 'I like pizza\nI like food', c`Without quotes, ~food~ is the variable. With quotes, it is just the word "food".`),
  F('Store your details in variables.', c`
[[name]] = "Ada"
age = [[36]]
is_coder = [[True]]
print(name, age, is_coder)`, '', true),
  X({ q: c`Create three variables — ~item~ set to ~"pizza"~, ~quantity~ set to ~3~ and ~price~ set to ~9.5~ — then print them on one line exactly like this:

~3 pizza at 9.5~`, start: c`
# create your variables here

print(quantity, item, "at", price)
`, tests: [{ out: '3 pizza at 9.5' }], must: [['item\\s*=', 'Create a variable called ~item~.'], ['quantity\\s*=', 'Create a variable called ~quantity~.'], ['price\\s*=', 'Create a variable called ~price~.']], sol: c`
item = "pizza"
quantity = 3
price = 9.5
print(quantity, item, "at", price)` }),
] },

{ id: 'casting', title: 'Types & type casting', icon: '💱', desc: 'type(), int(), str(), float(), bool() — and why "2" + "2" is "22".',
  v: [['0:16:05', '0:21:15', 'Type casting']],
  steps: [
  T('Check and convert', c`~type(x)~ tells you what type a value is. ~int()~, ~float()~, ~str()~ and ~bool()~ **convert** a value into a new one of that type:`, c`
print(type(3.5))        # <class 'float'>
print(int("42") + 1)    # 43
print(float("2.5"))     # 2.5
print(int(9.99))        # 9  (cuts off the decimals, does not round)
print(str(7) + "7")     # 77`),
  P(c`
print("2" + "2")
print(2 + 2)
print(int("2") + int("2"))`, '22\n4\n4', c`~+~ on two strings **joins** them. On two numbers, it adds.`),
  P(c`print(int(7.9), float(3), str(5) * 3)`, '7 3.0 555', c`~int()~ chops off the fraction, ~float(3)~ is ~3.0~, and a string times a number repeats it.`),
  T('bool() and "truthiness"', c`~bool()~ turns anything into ~True~ or ~False~. Empty or zero things become ~False~, everything else ~True~:`, c`
print(bool(0), bool(""), bool(None))      # False False False
print(bool(5), bool("no"), bool(" "))     # True True True`, c`Yes, ~bool("False")~ is ~True~ — it is a non-empty string.`),
  Q(c`What happens with ~int("hello")~?`, ['It returns 0', 'It returns 5 (the length)', 'ValueError — that is not a number', 'It returns None'], 2),
  Q(c`What does ~"Age: " + 21~ do?`, ['Prints Age: 21', 'TypeError — cannot join a str and an int', 'Returns 21', 'Returns "Age: "'], 1, c`Python refuses to guess. Convert first: ~"Age: " + str(21)~ — or use commas in ~print~, or an f-string (coming soon).`),
  X({ q: c`This program crashes. Fix it so it prints ~Next year you will be 22~.`, start: c`
age = "21"
age = age + 1
print("Next year you will be " + age)
`, tests: [{ out: 'Next year you will be 22' }], hint: c`Convert ~age~ to an ~int~ before adding, and back to a ~str~ before joining.`, sol: c`
age = "21"
age = int(age) + 1
print("Next year you will be " + str(age))` }),
] },

{ id: 'arith', title: 'Arithmetic & math', icon: '➗', desc: 'Operators, the three kinds of division, and the math module.',
  v: [['0:37:55', '0:51:46', 'Arithmetic & math']],
  steps: [
  T('The operators', c`~+~ ~-~ ~*~ as you'd expect. Then three kinds of division, plus powers:`, c`
print(7 / 2)     # 3.5  true division — always gives a float
print(7 // 2)    # 3    floor division — rounds down
print(7 % 2)     # 1    modulus — the remainder
print(2 ** 10)   # 1024 exponent — power`),
  P(c`
print(10 / 5)
print(17 // 5, 17 % 5)
print(-7 // 2)`, '2.0\n3 2\n-4', c`~/~ always gives a float, even when it divides evenly. ~//~ rounds **down**, so ~-3.5~ becomes ~-4~.`),
  Q(c`How do you check whether ~n~ is even?`, [c`~n / 2 == 0~`, c`~n % 2 == 0~`, c`~n // 2 == 0~`, c`~n ** 2 == 0~`], 1, c`Even numbers leave no remainder when divided by 2.`),
  T('Shortcuts and order', c`~x += 3~ means ~x = x + 3~. Same for ~-=~, ~*=~, ~/=~, ~//=~, ~%=~ and ~**=~.

Order is like school maths: ~**~ first, then ~* / // %~, then ~+ -~. Brackets beat everything.`, c`
print(2 + 3 * 4)     # 14
print((2 + 3) * 4)   # 20`),
  P(c`
x = 10
x += 5
x *= 2
x -= 1
print(x)`, '29'),
  T('The math module', c`For anything fancier, ~import math~ at the top of the file. A few built-ins need no import:`, c`
import math

print(round(3.14159, 2))   # 3.14
print(abs(-7))             # 7
print(max(4, 9, 2))        # 9
print(math.sqrt(16))       # 4.0
print(math.pi)             # 3.141592653589793
print(math.ceil(4.1))      # 5   round up
print(math.floor(4.9))     # 4   round down`),
  P(c`
import math
print(math.ceil(2.01), math.floor(2.99), round(2.5), round(3.5))`, '3 2 2 4', c`Surprise: ~round()~ goes to the nearest **even** number on an exact .5 ("banker's rounding"). That's why ~round(2.5)~ is ~2~.`),
  X({ q: c`A circle has radius ~r = 5~. Print its area rounded to 2 decimal places (area = π × r²).

Expected output: ~78.54~`, start: c`
import math

r = 5
`, tests: [{ out: '78.54' }], hint: c`~round(math.pi * r ** 2, 2)~`, sol: c`
import math

r = 5
print(round(math.pi * r ** 2, 2))` }),
  X({ q: c`Turn ~total_seconds = 7384~ into hours, minutes and seconds using ~//~ and ~%~. Print:

~2 h 3 min 4 s~`, start: c`
total_seconds = 7384
`, tests: [{ out: '2 h 3 min 4 s' }], not: [['print\\(\\s*2\\s*,', 'Calculate it from ~total_seconds~ — no typing the answer in!']], hint: c`Hours: ~total_seconds // 3600~. What is left over: ~total_seconds % 3600~. Then split that into minutes and seconds the same way with 60.`, sol: c`
total_seconds = 7384
hours = total_seconds // 3600
minutes = total_seconds % 3600 // 60
seconds = total_seconds % 60
print(hours, "h", minutes, "min", seconds, "s")` }),
] },

{ id: 'input', title: 'Reading input', icon: '⌨️', desc: 'input() — and the fact that it always hands you a string.',
  v: [['0:21:15', '0:32:42', 'User input']],
  steps: [
  T('Asking the user', c`~input()~ pauses, waits for the user to type a line, and **returns it as a string**. The text inside the brackets is the prompt:`, c`
name = input("What is your name? ")
print("Hello,", name)`, c`Here, what the user types is shown right after the prompt — just like in a real terminal.`),
  T('Always a string', c`Even if the user types ~21~, ~input()~ gives you the **string** ~"21"~. To do maths, convert it:`, c`
age = int(input("Age: "))
print("Next year you'll be", age + 1)

height = float(input("Height in m: "))`),
  Q(c`The user types ~5~. What does ~print(input() * 2)~ show?`, ['10', '55', '5 5', 'An error'], 1, c`~input()~ returned the string ~"5"~, and a string times 2 repeats it.`),
  F('Read a whole number and double it.', c`
n = [[int]](input("Number: "))
print(n * 2)`, '', true),
  X({ q: c`Ask for the user's name with the prompt ~Name: ~ and greet them exactly like this:

~Hello, Ada! Welcome to Code Quest.~`, start: c`
name = input("Name: ")
`, tests: [{ in: 'Ada\n', has: ['Hello, Ada! Welcome to Code Quest.'] }, { in: 'Bo\n', has: ['Hello, Bo! Welcome to Code Quest.'] }], hint: c`~print("Hello, " + name + "! Welcome to Code Quest.")~`, sol: c`
name = input("Name: ")
print("Hello, " + name + "! Welcome to Code Quest.")` }),
  X({ q: c`Read the length and width of a rectangle (two lines of input, can be decimals) and print its area:

~Area: 12.5~ for 5 and 2.5`, start: c`
length = input("Length: ")
width = input("Width: ")
`, tests: [{ in: '5\n2.5\n', has: ['Area: 12.5'] }, { in: '3\n4\n', has: ['Area: 12.0'] }], hint: c`Wrap each ~input(...)~ in ~float(...)~. Then ~print("Area:", length * width)~.`, sol: c`
length = float(input("Length: "))
width = float(input("Width: "))
print("Area:", length * width)` }),
] },

{ id: 'fstrings', title: 'f-strings & formatting', icon: '💬', desc: 'Drop variables straight into text — and control decimals, padding and commas.',
  v: [['1:46:35', '1:51:55', 'Format specifiers']],
  steps: [
  T('f-strings', c`Put an ~f~ before the quotes and you can drop any expression inside ~{ }~:`, c`
name, age = "Ada", 36
print(f"{name} is {age} years old")
print(f"In ten years: {age + 10}")`, c`No more ~str()~ and ~+~ juggling. This is how most Python code builds text.`),
  P(c`
item = "tea"
qty = 3
print(f"{qty} x {item} = {qty * 2} euro")`, '3 x tea = 6 euro'),
  T('Format specifiers', c`After a colon inside the braces you can control **how** a value looks:`, c`
price = 1234.5
print(f"{price:.2f}")    # 1234.50     2 decimal places
print(f"{price:,.2f}")   # 1,234.50    thousands separators
print(f"{42:5}|")        #    42|      width 5 (numbers go right)
print(f"{'hi':>5}|")     #    hi|      > right-align
print(f"{'hi':<5}|")     # hi   |      < left-align
print(f"{'hi':^6}|")     #   hi  |     ^ centre
print(f"{7:03}")         # 007         pad with zeros
print(f"{0.25:.0%}")     # 25%         as a percentage`),
  P(c`
pi = 3.14159
print(f"{pi:.2f} {pi:.0f} {10:04}")`, '3.14 3 0010'),
  Q(c`Which shows ~1000000~ as ~1,000,000~?`, [c`~f"{n:.2f}"~`, c`~f"{n:,}"~`, c`~f"{n:>10}"~`, c`~f"{n:%}"~`], 1),
  F('Show the price with exactly two decimals.', c`
price = 4.5
print(f"Total: {price[[:.2f]]}")`),
  X({ q: c`Print a receipt line. With ~item = "Coffee"~ and ~price = 3.5~, the output must be **exactly**:

~Coffee    : €3.50~

(~item~ left-aligned in a width of 10, then ~: €~ and the price with 2 decimals.)`, start: c`
item = "Coffee"
price = 3.5
`, tests: [{ out: 'Coffee    : €3.50' }], must: [['f"|f\'', 'Use an f-string.']], hint: c`~f"{item:<10}: €{price:.2f}"~`, sol: c`
item = "Coffee"
price = 3.5
print(f"{item:<10}: €{price:.2f}")` }),
] },

{ id: 'converters', title: 'Project: converters & mad libs', icon: '🧪', desc: 'Small, real programs using everything so far. No new theory.',
  v: [['0:32:42', '0:37:55', 'Mad libs game'], ['1:09:59', '1:13:58', 'Temperature conversion']],
  steps: [
  T('Project time', c`No new ideas here — just ~input()~, conversion, maths and f-strings, combined into programs you'd actually use.

Remember: Python reads the input lines in the order your program asks for them.`),
  X({ q: c`**Mad libs.** Read an adjective, a noun and a verb (three ~input~ lines, prompts are up to you), then print:

~Today I saw a <adjective> <noun> trying to <verb>.~`, start: c`
adjective = input("Adjective: ")
`, tests: [{ in: 'purple\nllama\ndance\n', has: ['Today I saw a purple llama trying to dance.'] }, { in: 'tiny\ndragon\nsing\n', has: ['Today I saw a tiny dragon trying to sing.'] }], sol: c`
adjective = input("Adjective: ")
noun = input("Noun: ")
verb = input("Verb: ")
print(f"Today I saw a {adjective} {noun} trying to {verb}.")` }),
  X({ q: c`**Temperature.** Read a temperature in Celsius (may be a decimal) and print it in Fahrenheit with one decimal place:

~21.0°C = 69.8°F~

(F = C × 9 / 5 + 32)`, start: c`
celsius = float(input("Celsius: "))
`, tests: [{ in: '21\n', has: ['21.0°C = 69.8°F'] }, { in: '-40\n', has: ['-40.0°C = -40.0°F'] }, { in: '36.6\n', has: ['36.6°C = 97.9°F'] }], hint: c`~f"{celsius:.1f}°C = {fahrenheit:.1f}°F"~`, sol: c`
celsius = float(input("Celsius: "))
fahrenheit = celsius * 9 / 5 + 32
print(f"{celsius:.1f}°C = {fahrenheit:.1f}°F")` }),
  X({ q: c`**Compound interest.** Read a starting amount, a yearly rate in percent and a number of years. Print the final balance with 2 decimals and thousands separators:

~Balance after 10 years: €1,628.89~ (for 1000, 5, 10)

Formula: amount × (1 + rate / 100) ** years`, start: c`
principal = float(input("Amount: "))
`, tests: [{ in: '1000\n5\n10\n', has: ['Balance after 10 years: €1,628.89'] }, { in: '250000\n3.5\n2\n', has: ['Balance after 2 years: €267,806.25'] }], hint: c`Read ~rate~ as a float and ~years~ as an int, then ~{balance:,.2f}~.`, sol: c`
principal = float(input("Amount: "))
rate = float(input("Rate %: "))
years = int(input("Years: "))
balance = principal * (1 + rate / 100) ** years
print(f"Balance after {years} years: €{balance:,.2f}")` }),
] },
],
quiz: [
  Q(c`What type does ~input()~ return?`, ['int', 'Whatever the user typed', 'str', 'float'], 2),
  P(c`print(9 // 4, 9 % 4, 9 / 4)`, '2 1 2.25'),
  P(c`
a = 3
a += 2
a *= a
print(a)`, '25'),
  Q(c`What is ~int("3.7")~?`, ['3', '4', '3.7', 'ValueError'], 3, c`~int()~ can only read whole-number text. ~int(float("3.7"))~ would work and give 3.`),
  P(c`print(f"{2/3:.3f}|{5:>3}|")`, '0.667|  5|'),
  Q(c`Which is a valid variable name?`, [c`~2nd_place~`, c`~my-score~`, c`~my_score~`, c`~my score~`], 2),
  P(c`print("ab" * 3 + "!")`, 'ababab!'),
] });
