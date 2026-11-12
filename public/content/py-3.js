/* ============ TOPIC 8: CLASSES & OBJECTS ============ */
topic({ id: 'oop', title: 'Classes & Objects', icon: '🧱', color: '#ff86d0', blurb: 'Bundle data and behaviour into your own types.',
lessons: [
{ id: 'classes', title: 'Classes & objects', icon: '🚗', desc: 'Blueprints, __init__, self, attributes and methods.',
  v: [['6:32:32', '6:44:50', 'Object oriented programming']],
  steps: [
  T('A blueprint for things', c`A **class** is a blueprint. Each **object** (or instance) made from it has its own data (**attributes**) and can do things (**methods**).`, c`
class Car:
    def __init__(self, model, colour):
        self.model = model          # attributes
        self.colour = colour
        self.miles = 0

    def drive(self, distance):      # a method
        self.miles += distance
        print(f"The {self.colour} {self.model} drove {distance} miles")

my_car = Car("Mustang", "red")      # creates an object, runs __init__
my_car.drive(30)
print(my_car.miles)                 # 30`),
  T('What is self?', c`~self~ is the object the method was called on. ~my_car.drive(30)~ is really ~Car.drive(my_car, 30)~ — Python fills in ~self~ for you.

~__init__~ ("dunder init") runs automatically when an object is created. Its job is to set up the attributes.`),
  P(c`
class Dog:
    def __init__(self, name):
        self.name = name
        self.tricks = 0

    def learn(self):
        self.tricks += 1

a = Dog("Rex")
b = Dog("Fido")
a.learn()
a.learn()
b.learn()
print(a.name, a.tricks, b.name, b.tricks)`, 'Rex 2 Fido 1', c`Each object keeps its **own** attributes.`),
  Q(c`What is wrong with ~def bark():~ inside a class, called as ~dog.bark()~?`, ['Nothing', c`It needs ~self~ as its first parameter`, 'Methods cannot be called with a dot', 'It must return something'], 1, c`Python passes the object automatically, so a method with no parameters gets "1 positional argument but 0 were expected" — a TypeError.`),
  F('Complete the class.', c`
class Player:
    def [[__init__]](self, name):
        [[self]].name = name
        self.hp = 100

    def hit(self, damage):
        self.hp -= damage

p = Player("Ada")
p.hit(30)
print(p.hp)`),
  X({ q: c`Create a class ~BankAccount~ with:

- ~__init__(self, owner, balance=0)~
- ~deposit(self, amount)~ — adds to the balance
- ~withdraw(self, amount)~ — subtracts, but if there isn't enough money prints ~Insufficient funds~ and changes nothing

The test code must print:

~Insufficient funds~
~Ada: 70~`, start: c`
class BankAccount:
    pass

acc = BankAccount("Ada")
acc.deposit(100)
acc.withdraw(30)
acc.withdraw(500)
print(f"{acc.owner}: {acc.balance}")
`, tests: [{ out: 'Insufficient funds\nAda: 70' }], must: [['class\\s+BankAccount', 'Keep the class called ~BankAccount~.'], ['def\\s+__init__', 'Add an ~__init__~ method.']], sol: c`
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
        else:
            self.balance -= amount

acc = BankAccount("Ada")
acc.deposit(100)
acc.withdraw(30)
acc.withdraw(500)
print(f"{acc.owner}: {acc.balance}")` }),
] },

{ id: 'classvars', title: 'Class variables & methods', icon: '🎓', desc: 'Data shared by every object, @classmethod and @staticmethod.',
  v: [['6:44:50', '6:53:06', 'Class variables'], ['7:33:34', '7:39:31', 'Static methods'], ['7:39:31', '7:46:16', 'Class methods']],
  steps: [
  T('Shared by everyone', c`A variable written directly in the class body is a **class variable**: one value shared by all instances. Use the class name to change it:`, c`
class Student:
    school = "Python High"     # class variable
    count = 0

    def __init__(self, name):
        self.name = name       # instance variable
        Student.count += 1

a = Student("Ada")
b = Student("Bo")
print(a.school, Student.count)   # Python High 2`),
  P(c`
class Counter:
    total = 0
    def __init__(self):
        Counter.total += 1
        self.id = Counter.total

x = Counter()
y = Counter()
z = Counter()
print(x.id, z.id, Counter.total)`, '1 3 3'),
  T('@classmethod and @staticmethod', c`A **class method** receives the class (~cls~) instead of an object — handy for alternative ways to create objects. A **static method** receives neither: it's just a helper function that lives in the class.`, c`
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5 / 9)

    @staticmethod
    def is_freezing(celsius):
        return celsius <= 0

t = Temperature.from_fahrenheit(212)
print(t.celsius, Temperature.is_freezing(-5))   # 100.0 True`),
  Q(c`What does a ~@staticmethod~ receive automatically?`, [c`~self~`, c`~cls~`, 'Nothing', 'Both self and cls'], 2),
  X({ q: c`Give ~Pizza~ a class variable ~made~ that counts every pizza created, and a class method ~margherita(cls)~ that returns a pizza with ~["tomato", "mozzarella"]~. The test prints:

~['tomato', 'mozzarella']~
~2~`, start: c`
class Pizza:
    def __init__(self, toppings):
        self.toppings = toppings

p1 = Pizza(["ham"])
p2 = Pizza.margherita()
print(p2.toppings)
print(Pizza.made)
`, tests: [{ out: "['tomato', 'mozzarella']\n2" }], must: [['@classmethod', 'Use ~@classmethod~.']], sol: c`
class Pizza:
    made = 0

    def __init__(self, toppings):
        self.toppings = toppings
        Pizza.made += 1

    @classmethod
    def margherita(cls):
        return cls(["tomato", "mozzarella"])

p1 = Pizza(["ham"])
p2 = Pizza.margherita()
print(p2.toppings)
print(Pizza.made)` }),
] },

{ id: 'inherit', title: 'Inheritance & polymorphism', icon: '👨‍👦‍👦', desc: 'Build on existing classes, super(), and one method call that does different things.',
  v: [['6:53:06', '7:00:02', 'Inheritance'], ['7:08:04', '7:21:10', 'super()'], ['7:21:10', '7:29:15', 'Polymorphism']],
  steps: [
  T('Children inherit', c`~class Dog(Animal):~ means a Dog **is an** Animal: it gets all of Animal's attributes and methods, and can add or **override** its own.`, c`
class Animal:
    def __init__(self, name):
        self.name = name
    def eat(self):
        print(f"{self.name} is eating")
    def speak(self):
        print("...")

class Dog(Animal):
    def speak(self):                 # overrides Animal.speak
        print(f"{self.name} says Woof")

rex = Dog("Rex")
rex.eat()      # inherited: Rex is eating
rex.speak()    # overridden: Rex says Woof`),
  T('super()', c`When a child needs extra setup, it calls the parent's ~__init__~ with ~super()~ and then adds its own:`, c`
class Shape:
    def __init__(self, colour):
        self.colour = colour

class Circle(Shape):
    def __init__(self, colour, radius):
        super().__init__(colour)     # let Shape set up colour
        self.radius = radius`),
  P(c`
class A:
    def hello(self):
        return "A"

class B(A):
    def hello(self):
        return "B+" + super().hello()

class C(A):
    pass

print(B().hello(), C().hello())`, 'B+A A'),
  T('Polymorphism', c`Different classes can answer the **same** method call in their own way. Code that calls ~shape.area()~ doesn't care which shape it has:`, c`
class Square:
    def __init__(self, side): self.side = side
    def area(self): return self.side ** 2

class Circle:
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2

for shape in [Square(2), Circle(1)]:
    print(shape.area())`, c`Python doesn't even need them to share a parent — if it has an ~area()~ method, it works. That's called **duck typing**: if it quacks like a duck...`),
  Q(c`~isinstance(rex, Animal)~ where ~rex = Dog("Rex")~ and ~Dog(Animal)~ — the result?`, ['True', 'False', 'Error', 'Dog'], 0, c`A Dog **is an** Animal.`),
  X({ q: c`Create ~Employee(name, salary)~ with a method ~pay()~ that returns the salary. Then ~Manager(Employee)~ that also takes a ~bonus~, uses ~super().__init__~, and overrides ~pay()~ to return salary + bonus. The test prints:

~Ada 3000~
~Bo 4500~`, start: c`
staff = [Employee("Ada", 3000), Manager("Bo", 4000, 500)]
for person in staff:
    print(person.name, person.pay())
`, tests: [{ out: 'Ada 3000\nBo 4500' }], must: [['class\\s+Manager\\s*\\(\\s*Employee\\s*\\)', 'Make ~Manager~ inherit from ~Employee~.'], ['super\\(\\)', 'Use ~super().__init__(...)~.']], sol: c`
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def pay(self):
        return self.salary

class Manager(Employee):
    def __init__(self, name, salary, bonus):
        super().__init__(name, salary)
        self.bonus = bonus

    def pay(self):
        return self.salary + self.bonus

staff = [Employee("Ada", 3000), Manager("Bo", 4000, 500)]
for person in staff:
    print(person.name, person.pay())` }),
] },

{ id: 'magic', title: 'Magic methods & @property', icon: '🌟', desc: 'Make your objects print nicely, compare, add — and guard their data.',
  v: [['7:46:16', '7:59:51', 'Magic methods'], ['7:59:51', '8:07:33', '@property'], ['8:07:33', '8:14:57', 'Decorators']],
  steps: [
  T('Dunder methods', c`Methods with double underscores are called by Python **for you**:`, c`
class Book:
    def __init__(self, title, pages):
        self.title, self.pages = title, pages
    def __str__(self):                 # used by print() and str()
        return f"'{self.title}' ({self.pages} pages)"
    def __len__(self):                 # used by len()
        return self.pages
    def __eq__(self, other):           # used by ==
        return self.title == other.title
    def __lt__(self, other):           # used by < (and so by sorted)
        return self.pages < other.pages

b = Book("Dune", 412)
print(b)            # 'Dune' (412 pages)
print(len(b))       # 412`),
  P(c`
class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        return Vec(self.x + other.x, self.y + other.y)
    def __str__(self):
        return f"({self.x}, {self.y})"

print(Vec(1, 2) + Vec(10, 20))`, '(11, 22)', c`~+~ calls ~__add__~.`),
  Q(c`Without ~__str__~, what does ~print(obj)~ show?`, ['Nothing', 'All its attributes', c`Something like ~<__main__.Book object at 0x...>~`, 'An error'], 2),
  T('@property', c`~@property~ turns a method into something you **read like an attribute**. Add a ~.setter~ and you can validate values as they're set:`, c`
class Rectangle:
    def __init__(self, width):
        self.width = width            # goes through the setter below

    @property
    def width(self):
        return self._width

    @width.setter
    def width(self, value):
        if value <= 0:
            raise ValueError("width must be positive")
        self._width = value

r = Rectangle(3)
print(r.width)      # 3   — no brackets
r.width = 5         # runs the setter`, c`A leading underscore (~_width~) is the convention for "internal — don't touch from outside".`),
  T('Decorators', c`~@property~ and ~@classmethod~ are **decorators**: functions that wrap another function to add behaviour. You can write your own:`, c`
def shout(func):
    def wrapper(*args):
        return func(*args).upper() + "!"
    return wrapper

@shout
def greet(name):
    return f"hello {name}"

print(greet("ada"))     # HELLO ADA!`),
  X({ q: c`Give ~Money~ a ~__str__~ that shows ~€12.50~ style (2 decimals), an ~__add__~ that returns a new ~Money~, and ~__eq__~ comparing amounts. The test prints:

~€12.50~
~True~`, start: c`
class Money:
    def __init__(self, amount):
        self.amount = amount

total = Money(10) + Money(2.5)
print(total)
print(total == Money(12.5))
`, tests: [{ out: '€12.50\nTrue' }], must: [['__str__', 'Add ~__str__~.'], ['__add__', 'Add ~__add__~.'], ['__eq__', 'Add ~__eq__~.']], sol: c`
class Money:
    def __init__(self, amount):
        self.amount = amount

    def __str__(self):
        return f"€{self.amount:.2f}"

    def __add__(self, other):
        return Money(self.amount + other.amount)

    def __eq__(self, other):
        return self.amount == other.amount

total = Money(10) + Money(2.5)
print(total)
print(total == Money(12.5))` }),
] },
],
quiz: [
  Q(c`What is ~__init__~ for?`, ['Deleting an object', 'Setting up a new object\'s attributes', 'Printing an object', 'Importing a class'], 1),
  P(c`
class K:
    n = 0
    def __init__(self):
        K.n += 1
K(); K()
print(K.n)`, '2'),
  P(c`
class P:
    def who(self): return "parent"
class C(P):
    def who(self): return "child"
print(C().who(), P().who())`, 'child parent'),
  Q(c`Which method does ~print(obj)~ use?`, [c`~__init__~`, c`~__repr__~ only`, c`~__str__~`, c`~__print__~`], 2),
  Q(c`What does ~super().__init__(name)~ do?`, ['Creates a new parent object', 'Runs the parent class\'s __init__ on this object', 'Deletes the parent', 'Calls the method twice'], 1),
  P(c`
class T:
    def __init__(self, v): self.v = v
    def __len__(self): return self.v * 2
print(len(T(4)))`, '8'),
] });

/* ============ TOPIC 9: ERRORS & FILES ============ */
topic({ id: 'files', title: 'Errors & Files', icon: '💾', color: '#84d8ff', blurb: 'Survive bad input, and make data outlive your program.',
lessons: [
{ id: 'except', title: 'try / except', icon: '🚦', desc: 'Catch errors instead of crashing.',
  v: [['8:14:57', '8:20:46', 'Exception handling']],
  steps: [
  T('Catching exceptions', c`Put risky code in a ~try~ block. If an exception happens, Python jumps to the matching ~except~ instead of crashing:`, c`
try:
    number = int(input("Number: "))
    print(10 / number)
except ValueError:
    print("That wasn't a number")
except ZeroDivisionError:
    print("You can't divide by zero")
else:
    print("No errors!")          # only if nothing went wrong
finally:
    print("This always runs")    # cleanup, error or not`),
  P(c`
try:
    print("a")
    x = int("oops")
    print("b")
except ValueError:
    print("c")
print("d")`, 'a\nc\nd', c`The moment ~int("oops")~ fails, the rest of the ~try~ block is skipped.`),
  P(c`
def safe_div(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
    finally:
        print("checked", end=" ")

print(safe_div(6, 3))
print(safe_div(1, 0))`, 'checked 2.0\nchecked None'),
  Q(c`Why is a bare ~except:~ (or ~except Exception:~) around everything usually a bad idea?`, ['It is slower', 'It hides bugs you did not expect, like typos', 'It is a SyntaxError', 'It only catches one error'], 1, c`Catch the specific errors you **expect** and know how to handle. Let surprises crash loudly so you notice them.`),
  T('raise', c`You can raise exceptions yourself when something is wrong:`, c`
def set_age(age):
    if age < 0:
        raise ValueError("age cannot be negative")
    return age

try:
    set_age(-5)
except ValueError as e:
    print("Error:", e)        # Error: age cannot be negative`),
  X({ q: c`Keep asking for an age until the user types a valid whole number that is 0 or more. Print ~Not a number~ for things like ~abc~ and ~Must be 0 or more~ for negatives. Then print ~Age accepted: 25~.`, start: c`
while True:
    age = int(input("Age: "))
    break
`, tests: [{ in: 'abc\n-3\n25\n', has: ['Not a number', 'Must be 0 or more'], re: 'Age accepted: 25$' }, { in: '0\n', re: 'Age accepted: 0$' }], must: [['except\\s+ValueError', 'Catch the ~ValueError~ from ~int()~.']], sol: c`
while True:
    try:
        age = int(input("Age: "))
    except ValueError:
        print("Not a number")
        continue
    if age < 0:
        print("Must be 0 or more")
    else:
        break
print("Age accepted:", age)` }),
] },

{ id: 'write', title: 'Writing files', icon: '✍️', desc: 'open, with, and the mode that wipes your data.',
  v: [['8:20:46', '8:27:47', 'File detection'], ['8:27:47', '8:41:33', 'Writing files']],
  steps: [
  T('open() and with', c`~open(filename, mode)~ gives you a file object. Always use it in a ~with~ block — the file is **closed automatically** when the block ends, even if an error happens:`, c`
with open("notes.txt", "w") as file:
    file.write("First line\n")
    file.write("Second line\n")
# file is closed here`, c`~write()~ does **not** add a new line for you — include ~\n~ yourself.`),
  T('Modes', c`~"w"~ — write. Creates the file, or **wipes it** if it exists.
~"a"~ — append. Adds to the end, keeps what was there.
~"r"~ — read (the default). Error if the file doesn't exist.

~"w"~ on the wrong file is how people lose their homework.`),
  Q(c`A file has 100 lines. You open it with ~"w"~ and write one line. How many lines does it have now?`, ['101', '100', '1', '0'], 2),
  T('Checking first', c`The ~os~ module can check whether a path exists before you touch it:`, c`
import os

if os.path.exists("save.txt"):
    print("Found a save file")
else:
    print("Starting a new game")`),
  F('Add a line to the end of the log without erasing it.', c`
with open("log.txt", [["a"~'a']]) as f:
    f.write("Game started\n")`),
  X({ q: c`Write the shopping list to ~list.txt~, one item per line, then read the file back and print it to prove it worked:

~eggs~
~milk~
~bread~`, start: c`
items = ["eggs", "milk", "bread"]

# write the file here

with open("list.txt") as f:
    print(f.read().strip())
`, tests: [{ out: 'eggs\nmilk\nbread' }], must: [['open\\([^)]*["\']w["\']', 'Open the file with mode ~"w"~.']], sol: c`
items = ["eggs", "milk", "bread"]

with open("list.txt", "w") as f:
    for item in items:
        f.write(item + "\n")

with open("list.txt") as f:
    print(f.read().strip())` }),
] },

{ id: 'read', title: 'Reading files', icon: '📖', desc: 'Whole files, line by line, and the missing-file case.',
  v: [['8:41:33', '8:48:29', 'Reading files']],
  steps: [
  T('Three ways to read', c``, c`
with open("notes.txt") as f:
    everything = f.read()           # one big string

with open("notes.txt") as f:
    lines = f.readlines()           # list of lines, each ending in "\n"

with open("notes.txt") as f:
    for line in f:                  # one line at a time (best for big files)
        print(line.strip())`, c`~.strip()~ removes the ~\n~ at the end of each line.`),
  T('Missing files', c`Opening a file that doesn't exist for reading raises ~FileNotFoundError~. Catch it:`, c`
try:
    with open("save.txt") as f:
        data = f.read()
except FileNotFoundError:
    print("No save file yet")`),
  P(c`
with open("t.txt", "w") as f:
    f.write("a\nb\n")
with open("t.txt", "a") as f:
    f.write("c\n")
with open("t.txt") as f:
    print(len(f.readlines()))`, '3'),
  X({ q: c`The program creates ~scores.txt~ with lines like ~Ada,92~. Read it back and print the name with the highest score and the average:

~Best: Cy (97)~
~Average: 83.0~`, start: c`
with open("scores.txt", "w") as f:
    f.write("Ada,92\nBo,60\nCy,97\n")

# read scores.txt here
`, tests: [{ out: 'Best: Cy (97)\nAverage: 83.0' }], not: [['print\\(\\s*["\']Best: Cy', 'Calculate it from the file!']], hint: c`For each line: ~name, score = line.strip().split(",")~. Keep a dict or a list of ~(score, name)~ pairs.`, sol: c`
with open("scores.txt", "w") as f:
    f.write("Ada,92\nBo,60\nCy,97\n")

scores = {}
with open("scores.txt") as f:
    for line in f:
        name, score = line.strip().split(",")
        scores[name] = int(score)

best = max(scores, key=scores.get)
print(f"Best: {best} ({scores[best]})")
print("Average:", round(sum(scores.values()) / len(scores), 1))` }),
  X({ q: c`Write ~load_settings(filename)~ that reads lines of ~key=value~ into a dictionary and returns it. If the file doesn't exist, return ~{}~. Skip blank lines.`, start: c`
def load_settings(filename):
    pass

with open("game.cfg", "w") as f:
    f.write("volume=7\n\ndifficulty=hard\n")

print(load_settings("game.cfg"))
print(load_settings("missing.cfg"))
`, tests: [{ out: "{'volume': '7', 'difficulty': 'hard'}\n{}" }], must: [['FileNotFoundError', 'Catch ~FileNotFoundError~.']], sol: c`
def load_settings(filename):
    settings = {}
    try:
        with open(filename) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                key, value = line.split("=", 1)
                settings[key] = value
    except FileNotFoundError:
        return {}
    return settings

with open("game.cfg", "w") as f:
    f.write("volume=7\n\ndifficulty=hard\n")

print(load_settings("game.cfg"))
print(load_settings("missing.cfg"))` }),
] },

{ id: 'json', title: 'Project: save & load', icon: '🎮', desc: 'Save a whole game state with the json module.',
  steps: [
  T('json', c`Turning Python data into text and back by hand gets tedious. The ~json~ module does it for dictionaries, lists, strings, numbers, booleans and ~None~:`, c`
import json

state = {"player": "Ada", "level": 3, "items": ["sword", "map"]}

with open("save.json", "w") as f:
    json.dump(state, f)           # Python -> file

with open("save.json") as f:
    loaded = json.load(f)         # file -> Python
print(loaded["items"])            # ['sword', 'map']`, c`~json.dumps(x)~ and ~json.loads(text)~ (with an **s**, for "string") do the same with strings instead of files.`),
  P(c`
import json
text = json.dumps({"a": [1, 2], "ok": True, "x": None})
print(text)
print(json.loads(text)["a"][1])`, '{"a": [1, 2], "ok": true, "x": null}\n2', c`JSON writes ~true~ / ~null~ — Python reads them back as ~True~ / ~None~.`),
  X({ q: c`Write ~save_game(state, filename)~ and ~load_game(filename)~ using ~json~. ~load_game~ returns a fresh game ~{"level": 1, "coins": 0}~ if the file doesn't exist. The test prints:

~{'level': 1, 'coins': 0}~
~{'level': 4, 'coins': 120}~`, start: c`
import json

def save_game(state, filename):
    pass

def load_game(filename):
    pass

print(load_game("nothing.json"))
save_game({"level": 4, "coins": 120}, "slot1.json")
print(load_game("slot1.json"))
`, tests: [{ out: "{'level': 1, 'coins': 0}\n{'level': 4, 'coins': 120}" }], must: [['json\\.dump', 'Use ~json.dump~.'], ['json\\.load', 'Use ~json.load~.']], sol: c`
import json

def save_game(state, filename):
    with open(filename, "w") as f:
        json.dump(state, f)

def load_game(filename):
    try:
        with open(filename) as f:
            return json.load(f)
    except FileNotFoundError:
        return {"level": 1, "coins": 0}

print(load_game("nothing.json"))
save_game({"level": 4, "coins": 120}, "slot1.json")
print(load_game("slot1.json"))` }),
] },
],
quiz: [
  P(c`
try:
    print(1)
    print([1, 2][5])
    print(2)
except IndexError:
    print(3)
finally:
    print(4)`, '1\n3\n4'),
  Q(c`Which mode adds to the end of a file without erasing it?`, [c`~"w"~`, c`~"r"~`, c`~"a"~`, c`~"x"~`], 2),
  Q(c`Why use ~with open(...) as f:~?`, ['It is faster', 'The file is closed automatically', 'It is required for reading', 'It creates a backup'], 1),
  Q(c`Which exception does ~int("ten")~ raise?`, ['TypeError', 'ValueError', 'NameError', 'KeyError'], 1),
  P(c`
import json
print(json.loads("[1, 2, 3]")[-1] * 2)`, '6'),
  Q(c`What does ~raise~ do?`, ['Catches an exception', 'Throws an exception yourself', 'Increases a number', 'Ignores errors'], 1),
] });

/* ============ TOPIC 10: FINAL BOSS ============ */
topic({ id: 'boss', title: 'Final Boss', icon: '👑', color: '#c0c7ff', blurb: 'Modules, pro habits and three capstone programs.',
lessons: [
{ id: 'modules', title: 'Modules & __main__', icon: '📨', desc: 'Split code across files and use the standard library.',
  v: [['5:02:13', '5:08:51', 'Modules'], ['5:14:22', '5:23:34', "if __name__ == '__main__'"]],
  steps: [
  T('import', c`A **module** is just a Python file. Python ships with hundreds (the **standard library**):`, c`
import math                        # use as math.sqrt
from random import randint         # use as randint
import datetime as dt              # nickname
from collections import Counter

print(Counter("banana").most_common(1))   # [('a', 3)]`, c`Your own file ~helpers.py~ can be imported with ~import helpers~ from a file in the same folder.`),
  T('if __name__ == "__main__"', c`When a file is **run directly**, ~__name__~ is ~"__main__"~. When it's **imported**, ~__name__~ is the module's name. So this guard means "only start the program if I'm the file being run":`, c`
def main():
    print("Running the program")

if __name__ == "__main__":
    main()`, c`Without it, importing your file to reuse one function would also start your whole program.`),
  P(c`
from collections import Counter
c = Counter("mississippi")
print(c["s"], c.most_common(1))`, "4 [('i', 4)]", c`~i~ and ~s~ both appear 4 times; on a tie ~most_common~ keeps the order they were first seen.`),
  Q(c`File ~tools.py~ contains ~print(__name__)~. You run ~main.py~ which does ~import tools~. What is printed?`, [c`~__main__~`, c`~tools~`, c`~main~`, 'Nothing'], 1),
  X({ q: c`Use ~Counter~ from ~collections~ to print the 2 most common letters in a word (letters only, ignore case), one per line as ~letter count~. Wrap the program in ~main()~ with the ~__name__~ guard.

~a 3~
~n 2~ (for ~Banana~)`, start: c`
from collections import Counter

def main():
    word = input("Word: ")

`, tests: [{ in: 'Banana\n', re: '\\na 3\\nn 2$' }, { in: 'Mississippi\n', re: '\\ni 4\\ns 4$' }], must: [['__name__', 'Add the ~if __name__ == "__main__":~ guard.'], ['Counter\\(', 'Use ~Counter~.']], sol: c`
from collections import Counter

def main():
    word = input("Word: ")
    counts = Counter(ch for ch in word.lower() if ch.isalpha())
    for letter, n in counts.most_common(2):
        print(letter, n)

if __name__ == "__main__":
    main()` }),
] },

{ id: 'banking', title: 'Capstone: banking app', icon: '💰', desc: 'A menu-driven program with functions, loops and validation.',
  v: [['5:23:34', '5:38:34', 'Banking program']],
  steps: [
  T('The brief', c`A text menu that loops until the user quits:

~1~ show balance · ~2~ deposit · ~3~ withdraw · ~4~ exit

Every amount must be validated. No crashes allowed, whatever the user types.`),
  X({ q: c`Build it. Start with balance ~0~. Menu choices come one per line, and deposit/withdraw read an amount on the next line.

~Balance: €0.00~ — for 1, with 2 decimals
Invalid amounts (not a number, or ≤ 0): ~Invalid amount~
Withdrawing more than the balance: ~Insufficient funds~
Unknown menu choice: ~Invalid choice~
On 4: ~Goodbye!~ and stop.

Write at least the functions ~deposit(balance)~ and ~withdraw(balance)~ that **return** the new balance.`, start: c`
def show_balance(balance):
    print(f"Balance: €{balance:.2f}")

def main():
    balance = 0
    while True:
        choice = input("1) Balance 2) Deposit 3) Withdraw 4) Exit: ")

main()
`, tests: [
    { in: '1\n2\n50\n3\n20.5\n1\n4\n', has: ['Balance: €0.00', 'Balance: €29.50', 'Goodbye!'] },
    { in: '2\nabc\n2\n-5\n3\n10\n9\n4\n', has: ['Invalid amount', 'Insufficient funds', 'Invalid choice', 'Goodbye!'] },
  ], must: [['def\\s+deposit', 'Write a ~deposit(balance)~ function.'], ['def\\s+withdraw', 'Write a ~withdraw(balance)~ function.']], hint: c`Put the ~float(input(...))~ inside ~try/except ValueError~ in a small helper ~read_amount()~ that returns ~None~ when the amount is invalid.`, sol: c`
def show_balance(balance):
    print(f"Balance: €{balance:.2f}")

def read_amount():
    try:
        amount = float(input("Amount: "))
    except ValueError:
        return None
    return amount if amount > 0 else None

def deposit(balance):
    amount = read_amount()
    if amount is None:
        print("Invalid amount")
        return balance
    return balance + amount

def withdraw(balance):
    amount = read_amount()
    if amount is None:
        print("Invalid amount")
        return balance
    if amount > balance:
        print("Insufficient funds")
        return balance
    return balance - amount

def main():
    balance = 0
    while True:
        choice = input("1) Balance 2) Deposit 3) Withdraw 4) Exit: ")
        if choice == "1":
            show_balance(balance)
        elif choice == "2":
            balance = deposit(balance)
        elif choice == "3":
            balance = withdraw(balance)
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("Invalid choice")

main()` }),
] },

{ id: 'hangman', title: 'Capstone: hangman', icon: '🕺', desc: 'Strings, sets and game state.',
  v: [['6:07:26', '6:32:32', 'Hangman game']],
  steps: [
  T('The brief', c`The first input line is the secret word (in a real game: ~random.choice(words)~). Then the player guesses one letter per line.

After each guess, show the word with unguessed letters as ~_~, e.g. ~p _ t h _ n~. The player has **6** wrong guesses. Win → ~You win!~. Out of guesses → ~You lose! The word was python~.

Repeated guesses don't count against the player: print ~Already guessed~.`),
  X({ q: c`Build hangman following the brief.`, start: c`
secret = input().lower()
guessed = set()
wrong = 0
`, tests: [
    { in: 'python\np\ny\nz\nt\nh\no\nn\n', has: ['p _ _ _ _ _', 'p y t h o n', 'You win!'] },
    { in: 'cat\na\na\nq\nw\ne\nr\ns\nu\n', has: ['_ a _', 'Already guessed', 'You lose! The word was cat'] },
  ], hint: c`Display: ~" ".join(ch if ch in guessed else "_" for ch in secret)~. Win when every letter of ~secret~ is in ~guessed~ — ~set(secret) <= guessed~.`, sol: c`
secret = input().lower()
guessed = set()
wrong = 0
while wrong < 6:
    guess = input("Letter: ").lower()
    if guess in guessed:
        print("Already guessed")
        continue
    guessed.add(guess)
    if guess not in secret:
        wrong += 1
        print(f"Wrong! {6 - wrong} left")
    print(" ".join(ch if ch in guessed else "_" for ch in secret))
    if set(secret) <= guessed:
        print("You win!")
        break
else:
    print(f"You lose! The word was {secret}")` }),
] },

{ id: 'todo', title: 'Capstone: to-do manager', icon: '🗂️', desc: 'A class, a dictionary and a command loop. The final exam.',
  steps: [
  T('The final exam', c`Everything at once: a class that holds the data, methods that change it, a command loop that reads input, and error handling for bad commands.`),
  X({ q: c`Build a ~TodoList~ class with methods ~add(task)~, ~done(number)~ and ~show()~. Then read commands until ~quit~:

~add Buy milk~ → adds a task
~done 2~ → marks task 2 as done (numbers start at 1). Bad number → ~No such task~
~show~ → prints every task as ~1. [ ] Buy milk~ or ~2. [x] Walk dog~, or ~Nothing to do~ if empty
anything else → ~Unknown command~`, start: c`
class TodoList:
    pass

todo = TodoList()
while True:
    command = input("> ")
    if command == "quit":
        break
`, tests: [
    { in: 'show\nadd Buy milk\nadd Walk dog\ndone 2\nshow\nquit\n', has: ['Nothing to do', '1. [ ] Buy milk\n2. [x] Walk dog'] },
    { in: 'add A\ndone 5\ndone x\nfly\nquit\n', has: ['No such task', 'Unknown command'] },
  ], must: [['class\\s+TodoList', 'Keep the ~TodoList~ class.'], ['def\\s+add', 'Give the class an ~add~ method.'], ['def\\s+done', 'Give the class a ~done~ method.'], ['def\\s+show', 'Give the class a ~show~ method.']], hint: c`Store tasks as a list of dictionaries: ~{"text": "Buy milk", "done": False}~. For commands, ~command.split(" ", 1)~ separates the word from the rest.`, sol: c`
class TodoList:
    def __init__(self):
        self.tasks = []

    def add(self, text):
        self.tasks.append({"text": text, "done": False})

    def done(self, number):
        if 1 <= number <= len(self.tasks):
            self.tasks[number - 1]["done"] = True
        else:
            print("No such task")

    def show(self):
        if not self.tasks:
            print("Nothing to do")
        for i, task in enumerate(self.tasks, start=1):
            mark = "x" if task["done"] else " "
            print(f"{i}. [{mark}] {task['text']}")

todo = TodoList()
while True:
    command = input("> ")
    if command == "quit":
        break
    word, _, rest = command.partition(" ")
    if word == "add" and rest:
        todo.add(rest)
    elif word == "done":
        try:
            todo.done(int(rest))
        except ValueError:
            print("No such task")
    elif word == "show":
        todo.show()
    else:
        print("Unknown command")` }),
] },
],
quiz: [
  Q(c`What is ~__name__~ when a file is run directly?`, [c`~"main"~`, c`~"__main__"~`, 'The file name', c`~None~`], 1),
  P(c`
nums = [5, 3, 8]
print(sorted(nums)[-1], [n for n in nums if n > 4])`, '8 [5, 8]'),
  P(c`
d = {}
for ch in "hello":
    d[ch] = d.get(ch, 0) + 1
print(d["l"], len(d))`, '2 4'),
  P(c`
class S:
    def __init__(self): self.items = []
    def push(self, x): self.items.append(x)
    def pop(self): return self.items.pop()
s = S()
s.push(1); s.push(2); s.push(3)
print(s.pop(), s.pop())`, '3 2', c`A **stack**: last in, first out.`),
  Q(c`Which import lets you write ~randint(1, 6)~ directly?`, [c`~import random~`, c`~from random import randint~`, c`~import randint~`, c`~using random~`], 1),
  P(c`
try:
    {}["x"]
except KeyError as e:
    print("missing", e)`, "missing 'x'"),
] });
