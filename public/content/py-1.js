/* ============ TOPIC 3: DECISIONS ============ */
topic({ id: 'decisions', title: 'Decisions', icon: '🤔', color: '#ff9600', blurb: 'Teach your programs to choose.',
lessons: [
{ id: 'if', title: 'if, elif, else', icon: '🚦', desc: 'Branching — and why indentation is not just decoration.',
  v: [['0:51:46', '1:00:06', 'If statements']],
  steps: [
  T('Choosing a path', c`An ~if~ runs its block only when the condition is ~True~. The line ends with a **colon**, and the block underneath is **indented** by 4 spaces:`, c`
age = 20
if age >= 18:
    print("You can vote")
    print("Go on, then")
print("This line always runs")`, c`The indentation **is** the block. Python has no braces — it uses spaces to know what belongs to the ~if~.`),
  T('Comparisons', c`~==~ equal, ~!=~ not equal, ~<~ ~>~ ~<=~ ~>=~. Each gives ~True~ or ~False~.

Careful: ~=~ **assigns**, ~==~ **compares**. Writing ~if x = 5:~ is a SyntaxError in Python.`, c`
print(3 == 3, 3 != 3, "a" < "b", 10 <= 9)   # True False True False`),
  T('elif and else', c`~elif~ ("else if") checks another condition only if the earlier ones were False. ~else~ catches everything left over. Python checks top to bottom and runs **only the first** matching block.`, c`
score = 72
if score >= 90:
    print("A")
elif score >= 70:
    print("B")
elif score >= 50:
    print("C")
else:
    print("Fail")`),
  P(c`
temp = 25
if temp > 30:
    print("Hot")
elif temp > 20:
    print("Warm")
elif temp > 10:
    print("Mild")
else:
    print("Cold")`, 'Warm', c`25 > 20 is the first True condition. Python never even looks at the ~> 10~ check.`),
  P(c`
x = 5
if x > 3:
    print("A")
if x > 4:
    print("B")
else:
    print("C")`, 'A\nB', c`Two **separate** ~if~ statements — both are checked. Only an ~elif~ chain stops at the first match.`),
  Q('What is wrong here?', ['Nothing', 'Missing colon after the condition', '== should be =', 'print needs no brackets'], 1, c`Every ~if~, ~elif~, ~else~ (and later ~for~, ~while~, ~def~) line ends with ~:~.`, c`
if score > 50
    print("Pass")`),
  O('Build a program that says whether a number is positive, negative or zero.', c`
n = int(input())
if n > 0:
    print("positive")
elif n < 0:
    print("negative")
else:
    print("zero")`),
  X({ q: c`Read an age and print ~Child~ (under 13), ~Teen~ (13 to 17) or ~Adult~ (18+).`, start: c`
age = int(input("Age: "))
`, tests: [{ in: '8\n', re: 'Child$' }, { in: '13\n', re: 'Teen$' }, { in: '17\n', re: 'Teen$' }, { in: '18\n', re: 'Adult$' }], hint: c`Check the smallest range first: ~if age < 13:~ then ~elif age < 18:~ then ~else:~.`, sol: c`
age = int(input("Age: "))
if age < 13:
    print("Child")
elif age < 18:
    print("Teen")
else:
    print("Adult")` }),
  X({ q: c`**Weight converter.** Read a weight (a decimal) and then a unit, ~K~ or ~L~. Convert kilograms to pounds (× 2.205) or pounds to kilograms (÷ 2.205) and print with one decimal:

~Your weight is 176.4 Lbs~ (for 80 and K)
~Your weight is 68.0 Kgs~ (for 150 and L)

Any other unit: ~K or L only~`, start: c`
weight = float(input("Weight: "))
unit = input("K or L: ")
`, tests: [{ in: '80\nK\n', re: 'Your weight is 176\\.4 Lbs$' }, { in: '150\nL\n', re: 'Your weight is 68\\.0 Kgs$' }, { in: '3\nX\n', re: 'K or L only$' }], sol: c`
weight = float(input("Weight: "))
unit = input("K or L: ")
if unit == "K":
    print(f"Your weight is {weight * 2.205:.1f} Lbs")
elif unit == "L":
    print(f"Your weight is {weight / 2.205:.1f} Kgs")
else:
    print("K or L only")` }),
] },

{ id: 'logic', title: 'Logical operators', icon: '🔗', desc: 'and, or, not — plus Python\'s chained comparisons.',
  v: [['1:13:58', '1:21:28', 'Logical operators']],
  steps: [
  T('and, or, not', c`~a and b~ — True only if **both** are True.
~a or b~ — True if **at least one** is True.
~not a~ — flips True and False.

They are real English words in Python.`, c`
temp = 25
sunny = True
if temp > 20 and sunny:
    print("Beach day")
if temp < 0 or temp > 35:
    print("Stay inside")
if not sunny:
    print("Bring a jacket")`),
  P(c`
a, b = True, False
print(a and b, a or b, not a, not (a and b))`, 'False True False True'),
  T('Chained comparisons', c`Python lets you write ranges the way maths does:`, c`
age = 15
if 13 <= age <= 19:
    print("Teenager")`, c`That means ~13 <= age and age <= 19~ — shorter, and much easier to read.`),
  P(c`
x = 7
print(1 < x < 10, 1 < x < 5, x == 7 or x == 8)`, 'True False True'),
  Q(c`Why does ~if colour == "red" or "blue":~ always run?`, ['It does not, it works fine', c`~"blue"~ on its own is a non-empty string, so it is always truthy`, c`~or~ only checks the first part`, 'Strings cannot be compared'], 1, c`Python reads it as ~(colour == "red") or ("blue")~. Write ~colour == "red" or colour == "blue"~ — or ~colour in ("red", "blue")~.`),
  F('A ticket is free for kids under 5 OR adults 65 and over.', c`
if age < 5 [[or]] age >= 65:
    print("Free")`),
  X({ q: c`Read a year and print ~Leap~ or ~Not leap~.

A year is a leap year if it is divisible by 4 **and** not divisible by 100 — **or** if it is divisible by 400.`, start: c`
year = int(input("Year: "))
`, tests: [{ in: '2024\n', re: '\\bLeap$' }, { in: '1900\n', re: 'Not leap$' }, { in: '2000\n', re: '\\bLeap$' }, { in: '2023\n', re: 'Not leap$' }], hint: c`~(year % 4 == 0 and year % 100 != 0) or year % 400 == 0~`, sol: c`
year = int(input("Year: "))
if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
    print("Leap")
else:
    print("Not leap")` }),
] },

{ id: 'ternary', title: 'Conditional expressions', icon: '❓', desc: 'The one-line if/else that produces a value.',
  v: [['1:21:28', '1:27:03', 'Conditional expressions']],
  steps: [
  T('if/else in one line', c`When you just need to pick between two **values**, Python has a compact form:`, c`
age = 20
status = "adult" if age >= 18 else "minor"
print(status)

print("even" if 7 % 2 == 0 else "odd")`, c`Read it as English: "**adult** if age >= 18, else **minor**".`),
  P(c`
n = -4
print("positive" if n > 0 else "not positive")
print(n if n >= 0 else -n)`, 'not positive\n4', c`The second line is a hand-made ~abs()~.`),
  Q('Which is a valid conditional expression?', [c`~x = if a > b: a else b~`, c`~x = a if a > b else b~`, c`~x = a > b ? a : b~`, c`~x = (a > b) then a else b~`], 1, c`~?:~ is how C and JavaScript do it. Python uses words.`),
  F('Pick the bigger number in one line.', c`biggest = a [[if]] a > b [[else]] b`),
  X({ q: c`Read a number of items. Print ~1 item~ for one, and ~N items~ for anything else (~0 items~, ~3 items~...). Use **one** conditional expression for the word.`, start: c`
n = int(input("How many? "))
`, tests: [{ in: '1\n', re: '\\b1 item$' }, { in: '3\n', re: '\\b3 items$' }, { in: '0\n', re: '\\b0 items$' }], must: [['if[\\s\\S]*else', 'Use a conditional expression: ~"item" if n == 1 else "items"~.']], sol: c`
n = int(input("How many? "))
word = "item" if n == 1 else "items"
print(n, word)` }),
] },

{ id: 'match', title: 'match-case', icon: '🎛️', desc: 'A tidy alternative to a long elif chain.',
  v: [['4:56:17', '5:02:13', 'Match-case statements']],
  steps: [
  T('match one value against many', c`When you compare **one** value against a list of possibilities, ~match~ is cleaner than a wall of ~elif~:`, c`
day = "Sat"
match day:
    case "Mon" | "Tue" | "Wed" | "Thu" | "Fri":
        print("Work day")
    case "Sat" | "Sun":
        print("Weekend!")
    case _:
        print("That's not a day")`, c`~|~ means "or". ~case _:~ is the catch-all, like ~else~. Only the **first** matching case runs — no fall-through.`),
  P(c`
code = 404
match code:
    case 200:
        print("OK")
    case 404:
        print("Not found")
    case _:
        print("Unknown")`, 'Not found'),
  Q(c`What does ~case _:~ do?`, ['Matches an underscore character', 'Matches anything not matched above', 'Matches nothing', 'Ends the match'], 1),
  F('Finish the menu.', c`
[[match]] choice:
    case "1":
        print("Start")
    case "2":
        print("Quit")
    [[case _]]:
        print("Unknown option")`),
  X({ q: c`Read a weekday number 1–7 and print its name (~1~ is ~Monday~ ... ~7~ is ~Sunday~). Anything else: ~Invalid~.

Use ~match~.`, start: c`
day = int(input("Day number: "))
`, tests: [{ in: '1\n', re: 'Monday$' }, { in: '5\n', re: 'Friday$' }, { in: '7\n', re: 'Sunday$' }, { in: '9\n', re: 'Invalid$' }], must: [['match\\s', 'Use ~match day:~.']], sol: c`
day = int(input("Day number: "))
match day:
    case 1:
        print("Monday")
    case 2:
        print("Tuesday")
    case 3:
        print("Wednesday")
    case 4:
        print("Thursday")
    case 5:
        print("Friday")
    case 6:
        print("Saturday")
    case 7:
        print("Sunday")
    case _:
        print("Invalid")` }),
] },

{ id: 'calc', title: 'Project: calculator', icon: '🧮', desc: 'Your first genuinely useful program.',
  v: [['1:00:06', '1:05:59', 'Calculator program']],
  steps: [
  T('The plan', c`Read a number, an operator (~+ - * /~), and another number. Print the result rounded to 3 decimals.

Two things can go wrong: an unknown operator, and dividing by zero. A good program handles both politely instead of crashing.`),
  X({ q: c`Build the calculator. Input is three lines: number, operator, number (numbers may be decimals). Print:

~Result: 7.5~ (for 5, +, 2.5) — use ~round(result, 3)~
~Cannot divide by zero~
~Unknown operator~`, start: c`
a = float(input("First number: "))
op = input("Operator (+ - * /): ")
b = float(input("Second number: "))
`, tests: [{ in: '5\n+\n2.5\n', re: 'Result: 7\\.5$' }, { in: '10\n/\n3\n', re: 'Result: 3\\.333$' }, { in: '6\n*\n7\n', re: 'Result: 42\\.0$' }, { in: '1\n/\n0\n', re: 'Cannot divide by zero$' }, { in: '2\n^\n3\n', re: 'Unknown operator$' }, { in: '2\n-\n5\n', re: 'Result: -3\\.0$' }], hint: c`An ~if/elif~ chain on ~op~. Inside the ~"/"~ branch, check ~b == 0~ first.`, sol: c`
a = float(input("First number: "))
op = input("Operator (+ - * /): ")
b = float(input("Second number: "))
if op == "+":
    print("Result:", round(a + b, 3))
elif op == "-":
    print("Result:", round(a - b, 3))
elif op == "*":
    print("Result:", round(a * b, 3))
elif op == "/":
    if b == 0:
        print("Cannot divide by zero")
    else:
        print("Result:", round(a / b, 3))
else:
    print("Unknown operator")` }),
  X({ q: c`**Shipping cost.** Read an order total (decimal) and whether the customer is a member (~y~ or ~n~).

Members always ship free. Non-members ship free on orders of €50 or more, otherwise pay €4.99. Print the final total with 2 decimals:

~Total: €54.99~`, start: c`
total = float(input("Order total: "))
member = input("Member? (y/n): ")
`, tests: [{ in: '50\nn\n', re: 'Total: €50\\.00$' }, { in: '49.99\nn\n', re: 'Total: €54\\.98$' }, { in: '10\ny\n', re: 'Total: €10\\.00$' }, { in: '0.5\nn\n', re: 'Total: €5\\.49$' }], sol: c`
total = float(input("Order total: "))
member = input("Member? (y/n): ")
if member != "y" and total < 50:
    total += 4.99
print(f"Total: €{total:.2f}")` }),
] },
],
quiz: [
  P(c`
x = 15
if x > 10 and x < 20:
    print("teen")
elif x > 10:
    print("big")
else:
    print("small")`, 'teen'),
  Q(c`Which operator checks equality?`, [c`~=~`, c`~==~`, c`~===~`, c`~eq~`], 1),
  P(c`print(not 0, bool("0"), 3 < 5 < 4)`, 'True True False'),
  Q('How does Python know which lines belong to an if?', ['Curly braces', 'The indentation', 'An endif keyword', 'Semicolons'], 1),
  P(c`print("big" if 2 ** 5 > 30 else "small")`, 'big'),
  Q('In match-case, how many case blocks run when several would match?', ['All of them', 'Only the first', 'Only the last', 'None — it is an error'], 1),
] });

/* ============ TOPIC 4: LOOPS ============ */
topic({ id: 'loops', title: 'Loops', icon: '🔁', color: '#ff4b4b', blurb: 'Make the computer do the boring part a million times.',
lessons: [
{ id: 'while', title: 'while loops', icon: '♾️', desc: 'Repeat until something changes.',
  v: [['1:51:55', '1:58:53', 'While loops']],
  steps: [
  T('Repeat while true', c`A ~while~ loop checks its condition, runs the block, checks again, runs again... until the condition is ~False~.`, c`
count = 1
while count <= 3:
    print("Round", count)
    count += 1
print("Done")`, c`Forget ~count += 1~ and the condition never becomes False: an **infinite loop**. (The runner here stops it after a few seconds.)`),
  P(c`
n = 10
while n > 0:
    print(n, end=" ")
    n -= 3`, '10 7 4 1', c`10, 7, 4, 1 — the next value would be -2, which fails ~n > 0~.`),
  T('Keep asking until it is valid', c`The classic use: keep asking until the user gives a good answer.`, c`
age = int(input("Age: "))
while age < 0:
    print("Age can't be negative")
    age = int(input("Age: "))
print("Thanks!")`),
  Q('How many times does "hi" print?', ['0', '1', '3', 'Forever'], 0, c`The condition is checked **before** the first round: 5 < 3 is False, so the block never runs.`, c`
x = 5
while x < 3:
    print("hi")`),
  F('Count down from 5 to 1.', c`
n = 5
[[while]] n > 0:
    print(n)
    n [[-=]] 1`),
  X({ q: c`Keep reading numbers until the user types ~0~, then print the total of everything they typed:

~Total: 15~ (for 5, 10, 0)`, start: c`
total = 0
n = int(input("Number (0 to stop): "))
`, tests: [{ in: '5\n10\n0\n', re: 'Total: 15$' }, { in: '0\n', re: 'Total: 0$' }, { in: '-2\n7\n1\n0\n', re: 'Total: 6$' }], hint: c`~while n != 0:~ add ~n~ to ~total~, then read the next ~n~ at the bottom of the loop.`, sol: c`
total = 0
n = int(input("Number (0 to stop): "))
while n != 0:
    total += n
    n = int(input("Number (0 to stop): "))
print("Total:", total)` }),
  X({ q: c`**Savings goal.** Read a starting balance and a goal. Each year the balance grows by 5%. Print how many years until the balance reaches the goal:

~Years: 15~ (for 100 and 200)`, start: c`
balance = float(input("Balance: "))
goal = float(input("Goal: "))
years = 0
`, tests: [{ in: '100\n200\n', re: 'Years: 15$' }, { in: '500\n400\n', re: 'Years: 0$' }, { in: '1000\n1100\n', re: 'Years: 2$' }], sol: c`
balance = float(input("Balance: "))
goal = float(input("Goal: "))
years = 0
while balance < goal:
    balance *= 1.05
    years += 1
print("Years:", years)` }),
] },

{ id: 'for', title: 'for loops & range()', icon: '🔂', desc: 'When you know how many times — or want to walk through something.',
  v: [['2:06:28', '2:11:33', 'For loops'], ['2:11:33', '2:17:28', 'Countdown timer']],
  steps: [
  T('for each item', c`A ~for~ loop walks through a sequence and gives you one item each round:`, c`
for letter in "Hey":
    print(letter)`, c`To loop over numbers, use ~range()~.`),
  T('range()', c`~range(stop)~ — 0 up to (not including) stop.
~range(start, stop)~ — start up to stop - 1.
~range(start, stop, step)~ — jump by step; a negative step counts down.`, c`
for i in range(3):          # 0 1 2
    print(i)
for i in range(1, 6):       # 1 2 3 4 5
    print(i)
for i in range(10, 0, -3):  # 10 7 4 1
    print(i)`),
  P(c`
for i in range(2, 11, 4):
    print(i, end=" ")`, '2 6 10'),
  P(c`
total = 0
for n in range(1, 5):
    total += n
print(total)`, '10', c`1 + 2 + 3 + 4. The stop value 5 is not included.`),
  Q(c`How many times does ~for i in range(5, 10):~ run?`, ['4', '5', '6', '10'], 1, c`5, 6, 7, 8, 9 — five rounds. In general: stop - start.`),
  F('Print 10, 8, 6, 4, 2.', c`
for n in range([[10]], [[0]], [[-2]]):
    print(n)`, '', true),
  X({ q: c`Read a number ~n~ and print its times table from 1 to 10, like:

~3 x 1 = 3~
~3 x 2 = 6~
...
~3 x 10 = 30~`, start: c`
n = int(input("Number: "))
`, tests: [{ in: '3\n', has: ['3 x 1 = 3\n3 x 2 = 6', '3 x 10 = 30'] }, { in: '7\n', has: ['7 x 7 = 49', '7 x 10 = 70'] }], must: [['for\\s', 'Use a ~for~ loop.']], sol: c`
n = int(input("Number: "))
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")` }),
  X({ q: c`Read ~n~ and print ~n!~ (factorial: 1 × 2 × ... × n). By definition ~0!~ is ~1~.

~5! = 120~`, start: c`
n = int(input("n: "))
`, tests: [{ in: '5\n', re: '5! = 120$' }, { in: '0\n', re: '0! = 1$' }, { in: '20\n', re: '20! = 2432902008176640000$' }], hint: c`Start ~result = 1~ and multiply by each number in ~range(1, n + 1)~.`, sol: c`
n = int(input("n: "))
result = 1
for i in range(1, n + 1):
    result *= i
print(f"{n}! = {result}")` }),
] },

{ id: 'breakcont', title: 'break & continue', icon: '🛑', desc: 'Bail out early, or skip a round.',
  steps: [
  T('Two escape hatches', c`~break~ — leave the loop **immediately**.
~continue~ — skip the rest of **this** round and go to the next.`, c`
for n in range(1, 10):
    if n == 5:
        break          # stop the whole loop at 5
    if n % 2 == 0:
        continue       # skip even numbers
    print(n)           # prints 1, 3`),
  P(c`
for i in range(6):
    if i == 2:
        continue
    if i == 4:
        break
    print(i, end="")`, '013'),
  T('while True + break', c`A very common pattern: loop "forever" and ~break~ out when you are done. It keeps the input in one place:`, c`
while True:
    answer = input("Type quit to stop: ")
    if answer == "quit":
        break
    print("You said", answer)`),
  Q(c`What does ~continue~ do in a ~while~ loop?`, ['Exits the loop', 'Jumps back to the condition check for the next round', 'Restarts the program', 'Nothing'], 1, c`Careful: if the line that changes your counter is **after** the ~continue~, you just made an infinite loop.`),
  X({ q: c`Read words one per line until the user types ~stop~. Print how many words were typed (not counting ~stop~) — but **skip** empty lines, they don't count:

~Words: 3~`, start: c`
count = 0
while True:
    word = input("Word: ")
`, tests: [{ in: 'apple\nbanana\n\ncherry\nstop\n', re: 'Words: 3$' }, { in: 'stop\n', re: 'Words: 0$' }], must: [['break', 'Use ~break~ to leave the loop.'], ['continue', 'Use ~continue~ to skip empty lines.']], sol: c`
count = 0
while True:
    word = input("Word: ")
    if word == "stop":
        break
    if word == "":
        continue
    count += 1
print("Words:", count)` }),
  X({ q: c`Read ~n~ and print whether it is prime: ~7 is prime~ or ~9 is not prime~. Numbers below 2 are not prime.

Use a loop that ~break~s as soon as it finds a divisor.`, start: c`
n = int(input("n: "))
is_prime = n >= 2
`, tests: [{ in: '7\n', re: '7 is prime$' }, { in: '9\n', re: '9 is not prime$' }, { in: '2\n', re: '2 is prime$' }, { in: '1\n', re: '1 is not prime$' }, { in: '97\n', re: '97 is prime$' }], must: [['break', 'Use ~break~ once you find a divisor.']], hint: c`Try every ~d~ in ~range(2, n)~. If ~n % d == 0~, set ~is_prime = False~ and ~break~.`, sol: c`
n = int(input("n: "))
is_prime = n >= 2
for d in range(2, n):
    if n % d == 0:
        is_prime = False
        break
print(f"{n} is prime" if is_prime else f"{n} is not prime")` }),
] },

{ id: 'nested', title: 'Nested loops', icon: '➿', desc: 'Loops inside loops: grids, patterns, tables.',
  v: [['2:17:28', '2:23:03', 'Nested loops']],
  steps: [
  T('A loop in a loop', c`The inner loop runs **completely** for every single round of the outer loop. Think of rows and columns:`, c`
for row in range(3):
    for col in range(4):
        print("*", end="")
    print()          # new line after each row`, c`3 rows × 4 columns = 12 stars.`),
  P(c`
for i in range(1, 4):
    for j in range(i):
        print(i, end="")
    print()`, '1\n22\n333'),
  Q(c`How many times does the inner ~print~ run?`, ['8', '6', '15', '5'], 2, c`3 × 5 = 15.`, c`
for a in range(3):
    for b in range(5):
        print(a, b)`),
  X({ q: c`Read a number of rows and columns and a symbol, then draw a rectangle. For 2, 5 and ~#~:

~#####~
~#####~`, start: c`
rows = int(input("Rows: "))
cols = int(input("Columns: "))
symbol = input("Symbol: ")
`, tests: [{ in: '2\n5\n#\n', has: ['#####\n#####'], re: '#####\\n#####$' }, { in: '3\n1\n@\n', re: '@\\n@\\n@$' }], must: [['for[\\s\\S]*for', 'Use nested ~for~ loops (no ~symbol * cols~ shortcut this time!).']], not: [['\\*\\s*cols|cols\\s*\\*', 'Use nested ~for~ loops (no ~symbol * cols~ shortcut this time!).']], sol: c`
rows = int(input("Rows: "))
cols = int(input("Columns: "))
symbol = input("Symbol: ")
for r in range(rows):
    for c in range(cols):
        print(symbol, end="")
    print()` }),
  X({ q: c`Read ~n~ and print a right-angled triangle of numbers. For 4:

~1~
~1 2~
~1 2 3~
~1 2 3 4~`, start: c`
n = int(input("n: "))
`, tests: [{ in: '4\n', re: '\\n1\\n1 2\\n1 2 3\\n1 2 3 4$' }, { in: '1\n', re: '\\n1$' }], hint: c`Outer loop ~row~ from 1 to n. Inner loop prints ~1..row~ with ~end=" "~ — or collect them and print once. Watch the trailing space: the checker ignores spaces at the end of a line.`, sol: c`
n = int(input("n: "))
for row in range(1, n + 1):
    for k in range(1, row + 1):
        print(k, end=" ")
    print()` }),
] },

{ id: 'random', title: 'Random numbers', icon: '🎲', desc: 'Dice, coin flips and shuffles.',
  v: [['3:19:42', '3:24:16', 'Random numbers']],
  steps: [
  T('import random', c`The ~random~ module does exactly what it says:`, c`
import random

print(random.randint(1, 6))          # 1..6, both ends included
print(random.random())               # a float from 0.0 up to 1.0
options = ["rock", "paper", "scissors"]
print(random.choice(options))        # one random item
random.shuffle(options)              # shuffles the list in place
print(options)`),
  Q(c`Which values can ~random.randint(1, 3)~ return?`, ['1, 2', '1, 2, 3', '0, 1, 2', '0, 1, 2, 3'], 1, c`Unlike ~range()~, ~randint~ includes **both** ends.`),
  T('Same "random" every time', c`~random.seed(42)~ makes the sequence repeatable: the same seed gives the same numbers every run. Games use a fresh seed (the default); tests and simulations often fix one so results can be checked.`),
  X({ q: c`Roll a six-sided die **5 times** with ~random.randint~ and print each roll on its own line, then the total:

~4~
~1~
~6~
~2~
~2~
~Total: 15~`, start: c`
import random
`, tests: [{ re: '^([1-6]\\n){5}Total: \\d+$' }], must: [['randint', 'Use ~random.randint(1, 6)~.']], sol: c`
import random

total = 0
for _ in range(5):
    roll = random.randint(1, 6)
    print(roll)
    total += roll
print("Total:", total)` }),
] },

{ id: 'games', title: 'Project: three classics', icon: '🎮', desc: 'A guessing game, FizzBuzz and rock-paper-scissors.',
  v: [['3:24:16', '3:32:37', 'Number guessing game'], ['3:32:37', '3:42:06', 'Rock, paper, scissors']],
  steps: [
  T('Testing random games', c`Random games are hard to check automatically, so in this lesson the "random" part is **typed in** as the first line of input. In a real game you'd use ~random.randint~ instead — that is the only line that changes.`),
  X({ q: c`**Guess the number.** The first input line is the secret number. Then keep reading guesses: print ~Too low~ or ~Too high~, until the guess is right. Then print:

~Correct! You got it in 3 guesses.~`, start: c`
secret = int(input())   # in a real game: random.randint(1, 100)
guesses = 0
`, tests: [{ in: '42\n50\n25\n42\n', has: ['Too high', 'Too low', 'Correct! You got it in 3 guesses.'] }, { in: '7\n7\n', has: ['Correct! You got it in 1 guesses.'] }], sol: c`
secret = int(input())   # in a real game: random.randint(1, 100)
guesses = 0
while True:
    guess = int(input("Guess: "))
    guesses += 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print(f"Correct! You got it in {guesses} guesses.")
        break` }),
  X({ q: c`**FizzBuzz** — the most famous interview warm-up. Print the numbers 1 to 15, but:

multiples of 3 → ~Fizz~
multiples of 5 → ~Buzz~
multiples of both → ~FizzBuzz~`, start: c`
for n in range(1, 16):
    print(n)
`, tests: [{ out: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }], hint: c`Check ~n % 15 == 0~ **first** — otherwise 15 gets caught by the Fizz branch.`, sol: c`
for n in range(1, 16):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)` }),
  X({ q: c`**Rock, paper, scissors.** Input: the computer's choice, then the player's choice (each ~rock~, ~paper~ or ~scissors~). Print ~Tie~, ~You win~ or ~You lose~.`, start: c`
computer = input()      # in a real game: random.choice(["rock", "paper", "scissors"])
player = input("rock, paper or scissors? ")
`, tests: [{ in: 'rock\nrock\n', re: 'Tie$' }, { in: 'rock\npaper\n', re: 'You win$' }, { in: 'paper\nscissors\n', re: 'You win$' }, { in: 'scissors\nrock\n', re: 'You win$' }, { in: 'paper\nrock\n', re: 'You lose$' }, { in: 'rock\nscissors\n', re: 'You lose$' }], hint: c`Tie first. Then list the three winning pairs with ~or~; everything else is a loss.`, sol: c`
computer = input()      # in a real game: random.choice(["rock", "paper", "scissors"])
player = input("rock, paper or scissors? ")
if player == computer:
    print("Tie")
elif (player == "rock" and computer == "scissors") or \
     (player == "paper" and computer == "rock") or \
     (player == "scissors" and computer == "paper"):
    print("You win")
else:
    print("You lose")` }),
] },
],
quiz: [
  P(c`
for i in range(3, 0, -1):
    print(i, end=" ")
print("Go")`, '3 2 1 Go'),
  Q(c`What does ~range(4)~ produce?`, ['1, 2, 3, 4', '0, 1, 2, 3', '0, 1, 2, 3, 4', '4'], 1),
  P(c`
n = 0
while n < 10:
    n += 4
print(n)`, '12'),
  P(c`
for i in range(5):
    if i % 2:
        continue
    print(i, end="")`, '024', c`~i % 2~ is 1 (truthy) for odd numbers, so odd rounds are skipped.`),
  Q(c`Which ends a loop early?`, [c`~continue~`, c`~stop~`, c`~break~`, c`~exit~`], 2),
  P(c`
count = 0
for a in range(4):
    for b in range(a):
        count += 1
print(count)`, '6', c`0 + 1 + 2 + 3.`),
] });

/* ============ TOPIC 5: STRINGS ============ */
topic({ id: 'strings', title: 'Strings', icon: '🧵', color: '#00cd9c', blurb: 'Slice, search and transform text.',
lessons: [
{ id: 'methods', title: 'String methods', icon: '〰️', desc: 'upper, strip, replace, find, split — the text toolbox.',
  v: [['1:27:03', '1:39:08', 'String methods']],
  steps: [
  T('Methods', c`A **method** is a function that belongs to a value, called with a dot. Strings come with dozens:`, c`
name = "  ada lovelace  "
print(name.strip())          # "ada lovelace"   trim spaces at both ends
print(name.strip().title())  # "Ada Lovelace"
print("hey".upper())         # "HEY"
print("HEY".lower())         # "hey"
print(len("hello"))          # 5   (len is a function, not a method)`),
  T('Strings never change', c`Strings are **immutable**. Methods don't change the string — they return a **new** one. So you have to keep the result:`, c`
word = "hello"
word.upper()          # makes "HELLO" ... and throws it away
print(word)           # hello
word = word.upper()   # keep it
print(word)           # HELLO`),
  P(c`
s = "banana"
print(s.count("a"), s.find("n"), s.find("z"))
print(s.replace("a", "o"))
print(s.startswith("ban"), s.endswith("x"))`, '3 2 -1\nbonono\nTrue False', c`~find~ gives the index of the first match, or ~-1~ if there is none.`),
  P(c`
print("2024".isdigit(), "abc".isalpha(), "a1".isalnum(), " ".isspace())`, 'True True True True'),
  Q(c`What is ~"a,b,,c".split(",")~?`, [c`~['a', 'b', 'c']~`, c`~['a', 'b', '', 'c']~`, c`~"abc"~`, c`~['a,b,,c']~`], 1, c`~split~ cuts at every comma — two commas in a row leave an empty string between them.`),
  T('split and join', c`~split()~ cuts a string into a list. ~join()~ glues a list back together:`, c`
words = "the quick brown fox".split()   # splits on any whitespace
print(words)                             # ['the', 'quick', 'brown', 'fox']
print("-".join(words))                   # the-quick-brown-fox`),
  X({ q: c`Read a full name with messy spacing and capitals, like ~"   aDA   lovelace "~. Print it cleaned up: ~Ada Lovelace~ — single spaces, each word capitalised.`, start: c`
raw = input("Name: ")
`, tests: [{ in: '   aDA   lovelace \n', re: '\\nAda Lovelace$' }, { in: 'GRACE brewster  HOPPER\n', re: '\\nGrace Brewster Hopper$' }], hint: c`~" ".join(raw.split())~ fixes the spacing; ~.title()~ fixes the capitals.`, sol: c`
raw = input("Name: ")
print(" ".join(raw.split()).title())` }),
  X({ q: c`**Username check.** Read a username. Print ~Valid~ if it is at most 12 characters, has no spaces and has no digits. Otherwise print the **first** problem found, in this order:

~Too long~ / ~No spaces allowed~ / ~No digits allowed~`, start: c`
username = input("Username: ")
`, tests: [{ in: 'bro_code\n', re: 'Valid$' }, { in: 'averyveryverylongname\n', re: 'Too long$' }, { in: 'bro code\n', re: 'No spaces allowed$' }, { in: 'bro123\n', re: 'No digits allowed$' }], hint: c`~len(username) > 12~, ~" " in username~... and for digits, check each character with ~ch.isdigit()~ in a loop.`, sol: c`
username = input("Username: ")
has_digit = False
for ch in username:
    if ch.isdigit():
        has_digit = True
if len(username) > 12:
    print("Too long")
elif " " in username:
    print("No spaces allowed")
elif has_digit:
    print("No digits allowed")
else:
    print("Valid")` }),
] },

{ id: 'slicing', title: 'Indexing & slicing', icon: '✂️', desc: 'Grab characters and pieces of strings — counting from either end.',
  v: [['1:39:08', '1:46:35', 'String indexing']],
  steps: [
  T('Indexes', c`Each character has a position — an **index** — starting at **0**. Negative indexes count from the end:`, c`
s = "PYTHON"
#    012345
print(s[0])     # P
print(s[5])     # N
print(s[-1])    # N   last
print(s[-2])    # O   second to last`, c`~s[6]~ would be an ~IndexError~: there is no 7th character.`),
  T('Slices', c`~s[start:stop]~ takes characters from ~start~ up to (**not** including) ~stop~. Leave one out to go to the edge. A third number is the step:`, c`
s = "PYTHON"
print(s[0:2])    # PY
print(s[2:])     # THON
print(s[:3])     # PYT
print(s[::2])    # PTO   every second character
print(s[::-1])   # NOHTYP   reversed!`),
  P(c`
s = "abcdefg"
print(s[1:4], s[-3:], s[:-3])`, 'bcd efg abcd'),
  P(c`
word = "level"
print(word == word[::-1])`, 'True', c`A palindrome reads the same reversed.`),
  T('in and looping', c`~in~ checks if one string is inside another. And a ~for~ loop walks through a string character by character:`, c`
print("cat" in "concatenate")   # True
print("dog" not in "hotdog")    # False

for ch in "hi!":
    print(ch)`),
  Q(c`~card = "1234-5678-9012-3456"~. Which gives ~3456~?`, [c`~card[-4:]~`, c`~card[:-4]~`, c`~card[4:]~`, c`~card[-4]~`], 0),
  F('Print the first three characters, then the last character.', c`
s = "Python"
print(s[:[[3]]])
print(s[ [[-1~5~len(s) - 1]] ])`, c`~s[:3]~ is "Pyt". ~s[-1]~ is the last character, whatever the length.`),
  X({ q: c`Read a credit card number and print it masked, showing only the last 4 characters:

~************3456~ (for ~1234567890123456~)

Your code must work for any length.`, start: c`
card = input("Card number: ")
`, tests: [{ in: '1234567890123456\n', re: '\\n\\*{12}3456$' }, { in: '987654321\n', re: '\\n\\*{5}4321$' }], hint: c`~"*" * (len(card) - 4) + card[-4:]~`, sol: c`
card = input("Card number: ")
print("*" * (len(card) - 4) + card[-4:])` }),
  X({ q: c`Read a word and print whether it is a palindrome — ignoring capital letters:

~Racecar is a palindrome~ / ~Python is not a palindrome~`, start: c`
word = input("Word: ")
`, tests: [{ in: 'Racecar\n', re: 'Racecar is a palindrome$' }, { in: 'Python\n', re: 'Python is not a palindrome$' }, { in: 'a\n', re: 'a is a palindrome$' }], sol: c`
word = input("Word: ")
w = word.lower()
if w == w[::-1]:
    print(f"{word} is a palindrome")
else:
    print(f"{word} is not a palindrome")` }),
] },

{ id: 'strwork', title: 'String workout', icon: '🏋️', desc: 'Vowels, initials and a secret cipher.',
  v: [['5:58:45', '6:07:26', 'Encryption program']],
  steps: [
  T('No new theory', c`Three programs that use loops, ~in~, methods and slicing together. Two useful built-ins for the cipher: ~ord("a")~ is ~97~ (a character's number), and ~chr(97)~ is ~"a"~.`),
  X({ q: c`Read a sentence and print how many vowels (~a e i o u~, upper or lower case) it contains:

~Vowels: 4~ (for ~Hello World, Python~)`, start: c`
text = input("Text: ")
`, tests: [{ in: 'Hello World, Python\n', re: 'Vowels: 4$' }, { in: 'AEIOU aeiou\n', re: 'Vowels: 10$' }, { in: 'rhythm\n', re: 'Vowels: 0$' }], hint: c`Loop over ~text.lower()~ and check ~if ch in "aeiou":~.`, sol: c`
text = input("Text: ")
count = 0
for ch in text.lower():
    if ch in "aeiou":
        count += 1
print("Vowels:", count)` }),
  X({ q: c`Read a full name and print the initials in capitals, with dots:

~A.M.T.~ (for ~alan mathison turing~)`, start: c`
name = input("Full name: ")
`, tests: [{ in: 'alan mathison turing\n', re: '\\nA\\.M\\.T\\.$' }, { in: '  Grace   Hopper \n', re: '\\nG\\.H\\.$' }], hint: c`~for word in name.split():~ — add ~word[0].upper() + "."~ to a result string.`, sol: c`
name = input("Full name: ")
initials = ""
for word in name.split():
    initials += word[0].upper() + "."
print(initials)` }),
  X({ q: c`**Caesar cipher.** Read a message and a shift. Shift every **lowercase** letter forward by that many places, wrapping from ~z~ back to ~a~. Leave everything else (spaces, punctuation, capitals) unchanged.

~attack at dawn!~ with shift 3 → ~dwwdfn dw gdzq!~`, start: c`
message = input("Message: ")
shift = int(input("Shift: "))
`, tests: [{ in: 'attack at dawn!\n3\n', re: '\\ndwwdfn dw gdzq!$' }, { in: 'xyz\n2\n', re: '\\nzab$' }, { in: 'Hi there\n13\n', re: '\\nHv gurer$' }], hint: c`For a lowercase ~ch~: ~chr((ord(ch) - ord("a") + shift) % 26 + ord("a"))~.`, sol: c`
message = input("Message: ")
shift = int(input("Shift: "))
result = ""
for ch in message:
    if "a" <= ch <= "z":
        result += chr((ord(ch) - ord("a") + shift) % 26 + ord("a"))
    else:
        result += ch
print(result)` }),
] },
],
quiz: [
  P(c`
s = "Hello"
print(s[1], s[-1], s[1:3])`, 'e o el'),
  P(c`print("a-b-c".split("-"), "x".join("abc"))`, "['a', 'b', 'c'] axbxc"),
  Q(c`After ~s = "hi"~ and ~s.upper()~, what is ~s~?`, [c`~"HI"~`, c`~"hi"~`, c`~None~`, 'An error'], 1, c`Strings are immutable — ~upper()~ returned a new string that was thrown away.`),
  P(c`print("abcdef"[::-2])`, 'fdb'),
  Q(c`What does ~"py" in "Python"~ give?`, ['True', 'False', 'An error', '0'], 1, c`It is case-sensitive: ~"Py"~ is in it, ~"py"~ is not.`),
  P(c`print(len("  hi  ".strip()), "Mississippi".count("ss"))`, '2 2'),
] });
