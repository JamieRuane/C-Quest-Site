/* ================= Java: topics 6-10 ================= */
G('array', c`A fixed-size row of values of one type: ~int[] scores = {90, 72, 85};~ — positions start at 0.`);
G('2D array', c`An array of arrays — a grid: ~int[][] grid = new int[3][4];~ then ~grid[row][col]~.`);
G('varargs', c`A parameter that takes any number of values: ~static int sum(int... nums)~.`);
G('object', c`A thing made from a class with ~new~. It has its own copy of the class's fields.`);
G('constructor', c`Runs when an object is created. Same name as the class, no return type.`);
G('this', c`The current object. ~this.name = name;~ copies a parameter into a field with the same name.`);
G('toString()', c`The method Java calls when an object is printed. Override it to print something useful.`);
G('inheritance', c`~class Dog extends Animal~ — Dog gets everything Animal has, and can add or change things.`);
G('super', c`The parent class: ~super(name)~ calls its constructor, ~super.speak()~ its version of a method.`);
G('@Override', c`Marks a method that replaces the parent's version. The compiler checks you really are overriding something.`);
G('abstract class', c`A class that cannot be created on its own, only extended. It can have ~abstract~ methods with no body.`);
G('interface', c`A list of methods a class promises to have: ~class Duck implements Swimmer~.`);
G('polymorphism', c`One variable type, many object types: a ~Shape[]~ can hold circles and squares, and each uses its own ~area()~.`);
G('encapsulation', c`Keeping fields ~private~ and giving controlled access through getters and setters.`);
G('ArrayList', c`An array that grows and shrinks: ~ArrayList<String> list = new ArrayList<>();~`);
G('wrapper class', c`The object version of a basic type: ~Integer~ for ~int~, ~Double~ for ~double~. Collections need these.`);
G('HashMap', c`Stores key → value pairs: ~map.put("Ada", 36); map.get("Ada");~`);
G('try / catch', c`Run code that might fail in ~try~; handle the exception in ~catch~ instead of crashing.`);
G('enum', c`A type with a fixed set of values: ~enum Level { LOW, MEDIUM, HIGH }~`);
G('generics', c`The ~<...>~ in ~ArrayList<String>~: a class or method written once to work with any type.`);

/* ============ TOPIC 6: ARRAYS ============ */
topic({ id: 'arrays', title: 'Arrays', icon: '🗃️', color: '#ffc800', blurb: 'Rows of values, searching them, varargs and 2D grids.',
lessons: [
{ id: 'basics', title: 'Array basics', icon: '📚', desc: 'Make, read, loop over and sort.',
  v: [['5:03:26', '5:12:35', 'Arrays'], ['5:12:35', '5:20:38', 'Input into arrays']],
  steps: [
  T('A row of boxes', c`An **array** holds a fixed number of values of one type. Positions (indexes) start at **0**, and ~.length~ says how many there are.`, c`
int[] scores = {90, 72, 85};
String[] names = new String[3];   // 3 empty slots (null)

scores[1] = 75;                    // change the second value
System.out.println(scores[0]);     // 90
System.out.println(scores.length); // 3

for (int s : scores) {             // for-each: every value in turn
    System.out.println(s);
}`, c`Going past the end — ~scores[3]~ — crashes with an ~ArrayIndexOutOfBoundsException~.`),
  T('Arrays helpers', c`~java.util.Arrays~ has ready-made tools:`, c`
import java.util.Arrays;

int[] nums = {5, 2, 9, 1};
Arrays.sort(nums);                          // sorts in place
System.out.println(Arrays.toString(nums));  // [1, 2, 5, 9]`, c`Printing an array directly gives gibberish like ~[I@1b6d3586~. Use ~Arrays.toString~.`),
  P(c`
int[] a = {3, 6, 9};
a[0] = a[1] + a[2];
System.out.println(a[0] + " " + a.length);`, '15 3'),
  P(c`
int total = 0;
for (int n : new int[]{4, 5, 6}) total += n;
System.out.println(total);`, '15'),
  P(c`
String[] w = {"pear", "apple", "fig"};
Arrays.sort(w);
System.out.println(Arrays.toString(w));`, '[apple, fig, pear]'),
  X({ q: c`Read 5 whole numbers into an array, then print them in **reverse** order on one line, separated by spaces.

~1 2 3 4 5~ → ~5 4 3 2 1~`, start: M(c`
        Scanner in = new Scanner(System.in);
        int[] nums = new int[5];
`, 'java.util.Scanner'), tests: [{ in: '1 2 3 4 5', out: '5 4 3 2 1' }, { in: '9 0 7 0 3', out: '3 0 7 0 9' }], must: [[c`nums\s*\[`, c`Store the numbers in the array.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        int[] nums = new int[5];
        for (int i = 0; i < nums.length; i++) {
            nums[i] = in.nextInt();
        }
        for (int i = nums.length - 1; i >= 0; i--) {
            System.out.print(nums[i] + " ");
        }
        System.out.println();`, 'java.util.Scanner') }),
  X({ q: c`Read how many scores there are, then the scores. Print the highest and the average (one decimal):

~4~ then ~70 85 90 60~ →
~Highest: 90~
~Average: 76.3~`, start: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] scores = new int[n];
`, 'java.util.Scanner'), tests: [{ in: '4\n70 85 90 60', out: 'Highest: 90\nAverage: 76.3' }, { in: '1\n42', out: 'Highest: 42\nAverage: 42.0' }], hint: c`Start ~highest~ at ~scores[0]~. For the average, divide by ~(double) n~ so the decimals survive.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            scores[i] = in.nextInt();
        }

        int highest = scores[0], total = 0;
        for (int s : scores) {
            if (s > highest) highest = s;
            total += s;
        }
        System.out.println("Highest: " + highest);
        System.out.printf("Average: %.1f%n", (double) total / n);`, 'java.util.Scanner') }),
] },

{ id: 'search', title: 'Searching & varargs', icon: '🔍', desc: 'Find a value, and accept any number of arguments.',
  v: [['5:20:38', '5:28:07', 'Search an array'], ['5:28:07', '5:34:36', 'Varargs']],
  steps: [
  T('Linear search', c`To find something in an array, check each item in turn and stop when you hit it. Return ~-1~ to mean "not found" — a common convention.`, c`
static int indexOf(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;   // found: stop right here
    }
    return -1;                            // checked everything
}`),
  T('Varargs', c`~...~ after a type lets a method take **any number** of values. Inside the method they arrive as an array.`, c`
static int sum(int... nums) {
    int total = 0;
    for (int n : nums) total += n;
    return total;
}

sum(1, 2)          // 3
sum(4, 5, 6, 7)    // 22
sum()              // 0`),
  P(c`
public class Main {
    static int count(String... words) {
        return words.length;
    }
    public static void main(String[] args) {
        System.out.println(count("a", "b", "c") + count());
    }
}`, '3'),
  X({ q: c`Write ~static int indexOf(String[] arr, String target)~ that returns the position of ~target~, or ~-1~ if it is not there. ~main~ reads a name to look for.`, start: c`import java.util.Scanner;

public class Main {

    // write indexOf here

    public static void main(String[] args) {
        String[] team = {"Ada", "Grace", "Linus", "Guido"};
        Scanner in = new Scanner(System.in);
        System.out.println(indexOf(team, in.nextLine()));
    }
}
`, tests: [{ in: 'Linus\n', out: '2' }, { in: 'Ada\n', out: '0' }, { in: 'Bjarne\n', out: '-1' }], must: [[c`static\s+int\s+indexOf\s*\(`, c`Write ~static int indexOf(String[] arr, String target)~.`]], hint: c`Compare strings with ~.equals~, not ~==~.`, sol: c`import java.util.Scanner;

public class Main {

    static int indexOf(String[] arr, String target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i].equals(target)) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        String[] team = {"Ada", "Grace", "Linus", "Guido"};
        Scanner in = new Scanner(System.in);
        System.out.println(indexOf(team, in.nextLine()));
    }
}
` }),
  X({ q: c`Write ~static double average(double... nums)~. It should return ~0~ when given nothing at all. The program prints ~2.5~, ~10.0~ and ~0.0~.`, start: c`public class Main {

    // write average here

    public static void main(String[] args) {
        System.out.println(average(1, 2, 3, 4));
        System.out.println(average(10));
        System.out.println(average());
    }
}
`, tests: [{ out: '2.5\n10.0\n0.0' }], must: [[c`double\s*\.\.\.`, c`Use varargs: ~double... nums~.`]], sol: c`public class Main {

    static double average(double... nums) {
        if (nums.length == 0) return 0;
        double total = 0;
        for (double n : nums) total += n;
        return total / nums.length;
    }

    public static void main(String[] args) {
        System.out.println(average(1, 2, 3, 4));
        System.out.println(average(10));
        System.out.println(average());
    }
}
` }),
] },

{ id: 'grid', title: '2D arrays', icon: '🧱', desc: 'Rows and columns: boards, maps and tables.',
  v: [['5:34:36', '5:44:00', '2D arrays']],
  steps: [
  T('Arrays of arrays', c`A **2D array** is a grid. The first index picks the row, the second the column. Loop over it with a loop inside a loop.`, c`
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
};

System.out.println(grid[1][2]);       // 6   row 1, column 2
System.out.println(grid.length);      // 2   rows
System.out.println(grid[0].length);   // 3   columns

for (int[] row : grid) {
    for (int value : row) {
        System.out.print(value + " ");
    }
    System.out.println();
}`),
  P(c`
char[][] board = {
    {'X', 'O', 'X'},
    {' ', 'X', 'O'},
    {'O', ' ', 'X'},
};
System.out.println("" + board[0][0] + board[1][1] + board[2][2]);`, 'XXX', c`The diagonal — X wins!`),
  X({ q: c`Print the sum of each row of the grid, then the grand total:

~Row 0: 6~
~Row 1: 15~
~Row 2: 24~
~Total: 45~`, start: M(c`
        int[][] grid = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9},
        };
`), tests: [{ out: 'Row 0: 6\nRow 1: 15\nRow 2: 24\nTotal: 45' }], sol: M(c`
        int[][] grid = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9},
        };
        int total = 0;
        for (int r = 0; r < grid.length; r++) {
            int rowSum = 0;
            for (int value : grid[r]) rowSum += value;
            System.out.println("Row " + r + ": " + rowSum);
            total += rowSum;
        }
        System.out.println("Total: " + total);`) }),
] },
],
quiz: [
  P(c`
int[] a = {2, 4, 6, 8};
System.out.println(a[a.length - 1]);`, '8'),
  Q(c`What happens if you read ~a[4]~ from an array of length 4?`, ['You get 0', 'You get null', 'An ArrayIndexOutOfBoundsException', 'It wraps around to a[0]'], 2),
  P(c`
int[][] g = new int[3][5];
System.out.println(g.length * g[0].length);`, '15'),
  P(c`
int[] n = {3, 1, 2};
Arrays.sort(n);
System.out.println(Arrays.toString(n));`, '[1, 2, 3]'),
  F('Loop over every value.', c`
int[] nums = {1, 2, 3};
for (int n [[:]] nums) {
    System.out.println(n);
}`),
] });

/* ============ TOPIC 7: OBJECTS ============ */
topic({ id: 'oop', title: 'Classes & Objects', icon: '🏗️', color: '#ff4b4b', blurb: 'Design your own types: fields, constructors, static and toString.',
lessons: [
{ id: 'classes', title: 'Classes and objects', icon: '🚗', desc: 'A blueprint, and the things built from it.',
  v: [['6:41:47', '6:51:38', 'Object-oriented programming']],
  steps: [
  T('Blueprints', c`A **class** is a blueprint. **Objects** are the things built from it with ~new~. Each object has its own copy of the class's **fields** (data) and shares its **methods** (behaviour).`, c`
class Car {
    String model;
    int speed;

    void accelerate(int amount) {
        speed += amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Car a = new Car();
        a.model = "Mini";
        a.accelerate(30);

        Car b = new Car();         // a completely separate car
        b.model = "Tesla";

        System.out.println(a.model + " " + a.speed);   // Mini 30
        System.out.println(b.model + " " + b.speed);   // Tesla 0
    }
}`, c`Methods without ~static~ belong to an object: you call them on one, like ~a.accelerate(30)~.`),
  P(c`
class Counter {
    int n;
    void up() { n++; }
}

public class Main {
    public static void main(String[] args) {
        Counter x = new Counter();
        Counter y = new Counter();
        x.up(); x.up(); y.up();
        System.out.println(x.n + " " + y.n);
    }
}`, '2 1'),
  X({ q: c`Finish the ~Dog~ class: add a method ~bark()~ that prints ~Rex says Woof!~ (using the dog's own name) and a method ~birthday()~ that adds 1 to its age.`, start: c`class Dog {
    String name;
    int age;

    // add bark() and birthday() here
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.name = "Rex";
        d.age = 3;
        d.bark();
        d.birthday();
        System.out.println(d.name + " is " + d.age);
    }
}
`, tests: [{ out: 'Rex says Woof!\nRex is 4' }], must: [[c`void\s+bark\s*\(`, c`Write ~void bark()~.`], [c`void\s+birthday\s*\(`, c`Write ~void birthday()~.`]], sol: c`class Dog {
    String name;
    int age;

    void bark() {
        System.out.println(name + " says Woof!");
    }

    void birthday() {
        age++;
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.name = "Rex";
        d.age = 3;
        d.bark();
        d.birthday();
        System.out.println(d.name + " is " + d.age);
    }
}
` }),
] },

{ id: 'constructors', title: 'Constructors', icon: '🏭', desc: 'Set an object up in one line.',
  v: [['6:51:38', '7:01:45', 'Constructors'], ['7:01:45', '7:08:22', 'Overloaded constructors']],
  steps: [
  T('Born ready', c`A **constructor** runs when you write ~new~. It has the class's name and no return type. ~this.name~ means "this object's field", which tells it apart from the parameter called ~name~.`, c`
class Player {
    String name;
    int level;

    Player(String name) {            // new Player("Link")
        this.name = name;
        this.level = 1;
    }

    Player(String name, int level) { // overloaded: new Player("Zelda", 9)
        this.name = name;
        this.level = level;
    }
}`),
  P(c`
class Box {
    int w, h;
    Box(int w, int h) { this.w = w; this.h = h; }
    Box(int side) { this(side, side); }
    int area() { return w * h; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Box(2, 5).area() + new Box(3).area());
    }
}`, '19', c`~this(side, side)~ calls the other constructor.`),
  Q(c`What is special about a constructor's name?`, [c`It always starts with ~make~`, 'It is the same as the class name', 'It must be main', 'It ends with Constructor'], 1),
  X({ q: c`Give ~Pizza~ two constructors: ~Pizza(String topping)~ makes a ~medium~ pizza, and ~Pizza(String topping, String size)~ uses the size given. The program prints:

~medium Margherita~
~large Pepperoni~`, start: c`class Pizza {
    String topping;
    String size;

    // add the two constructors here

    String describe() {
        return size + " " + topping;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Pizza("Margherita").describe());
        System.out.println(new Pizza("Pepperoni", "large").describe());
    }
}
`, tests: [{ out: 'medium Margherita\nlarge Pepperoni' }], must: [[c`Pizza\s*\(\s*String\s+\w+\s*\)`, c`Write ~Pizza(String topping)~.`], [c`Pizza\s*\(\s*String\s+\w+\s*,\s*String`, c`Write ~Pizza(String topping, String size)~.`]], sol: c`class Pizza {
    String topping;
    String size;

    Pizza(String topping) {
        this(topping, "medium");
    }

    Pizza(String topping, String size) {
        this.topping = topping;
        this.size = size;
    }

    String describe() {
        return size + " " + topping;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Pizza("Margherita").describe());
        System.out.println(new Pizza("Pepperoni", "large").describe());
    }
}
` }),
] },

{ id: 'static', title: 'static, toString & arrays of objects', icon: '🗂️', desc: 'Shared data, printable objects and lists of them.',
  v: [['7:08:22', '7:14:07', 'Array of objects'], ['7:14:07', '7:22:04', 'Static'], ['7:46:08', '7:51:58', 'toString method']],
  steps: [
  T('static and toString', c`A ~static~ field belongs to the **class**, so all objects share one copy — handy for counting them.

When you print an object, Java calls its ~toString()~ method. Write your own and printing just works.`, c`
class Product {
    static int made = 0;          // one shared counter
    String name;
    double price;

    Product(String name, double price) {
        this.name = name;
        this.price = price;
        made++;
    }

    @Override
    public String toString() {
        return name + " (" + price + ")";
    }
}

Product p = new Product("Mouse", 19.99);
System.out.println(p);               // Mouse (19.99)
System.out.println(Product.made);    // 1`),
  T('Arrays of objects', c`An array can hold objects, and a for-each loop walks through them:`, c`
Product[] shop = {
    new Product("Mouse", 19.99),
    new Product("Cable", 4.5),
};
for (Product p : shop) {
    System.out.println(p);
}`),
  P(c`
class Ticket {
    static int next = 1;
    int number;
    Ticket() { number = next++; }
}

public class Main {
    public static void main(String[] args) {
        Ticket a = new Ticket(), b = new Ticket(), c = new Ticket();
        System.out.println(a.number + " " + c.number + " " + Ticket.next);
    }
}`, '1 3 4'),
  X({ q: c`Add a ~toString()~ to ~Product~ so it prints like ~Cable: 4.50~ (two decimals), then print the **cheapest** product.`, start: c`class Product {
    String name;
    double price;

    Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    // add toString() here
}

public class Main {
    public static void main(String[] args) {
        Product[] shop = {
            new Product("Mouse", 19.99),
            new Product("Cable", 4.5),
            new Product("Monitor", 189),
        };
        // print the cheapest product
    }
}
`, tests: [{ out: 'Cable: 4.50' }], must: [[c`public\s+String\s+toString\s*\(`, c`Write ~public String toString()~.`]], hint: c`~return String.format("%s: %.2f", name, price);~ — then keep track of the cheapest while looping, and ~System.out.println(cheapest);~`, sol: c`class Product {
    String name;
    double price;

    Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    @Override
    public String toString() {
        return String.format("%s: %.2f", name, price);
    }
}

public class Main {
    public static void main(String[] args) {
        Product[] shop = {
            new Product("Mouse", 19.99),
            new Product("Cable", 4.5),
            new Product("Monitor", 189),
        };
        Product cheapest = shop[0];
        for (Product p : shop) {
            if (p.price < cheapest.price) cheapest = p;
        }
        System.out.println(cheapest);
    }
}
` }),
] },
],
quiz: [
  Q(c`What creates an object from a class?`, [c`~new~`, c`~class~`, c`~static~`, c`~this~`], 0),
  Q(c`A ~static~ field is…`, ['copied into every object', 'shared by all objects of the class', 'private', 'constant'], 1),
  P(c`
class P {
    int x;
    P(int x) { this.x = x * 2; }
    public String toString() { return "P" + x; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new P(4));
    }
}`, 'P8'),
  F('Copy the parameter into the field.', c`
class Cat {
    String name;
    Cat(String name) {
        [[this]].name = name;
    }
}`, null, 1),
] });

/* ============ TOPIC 8: INHERITANCE ============ */
topic({ id: 'inheritance', title: 'Inheritance', icon: '🧬', color: '#1c8ef6', blurb: 'extends, super, overriding, abstract classes, interfaces and polymorphism.',
lessons: [
{ id: 'extends', title: 'extends and super', icon: '👪', desc: 'Build a class on top of another.',
  v: [['7:22:04', '7:31:09', 'Inheritance'], ['7:31:09', '7:41:37', 'Super'], ['7:41:37', '7:46:08', 'Method overriding']],
  steps: [
  T('Children inherit', c`~class Dog extends Animal~ gives ~Dog~ every field and method of ~Animal~. The child can **add** new ones and **override** (replace) inherited methods.

~super(...)~ calls the parent's constructor; ~super.method()~ calls the parent's version of a method.`, c`
class Animal {
    String name;
    Animal(String name) { this.name = name; }
    String speak() { return name + " makes a sound"; }
}

class Dog extends Animal {
    Dog(String name) { super(name); }

    @Override
    String speak() { return name + " barks"; }

    void fetch() { System.out.println(name + " fetches!"); }
}`, c`~@Override~ is optional, but it makes the compiler check that you really are replacing a parent method — a typo becomes an error instead of a silent new method.`),
  P(c`
class A {
    String hi() { return "A"; }
}
class B extends A {
    @Override
    String hi() { return super.hi() + "B"; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new B().hi());
    }
}`, 'AB'),
  X({ q: c`Make ~Cat~ extend ~Animal~. Its constructor passes the name to ~super~, and it overrides ~speak()~ to return ~Tom meows~ (with its own name).`, start: c`class Animal {
    String name;
    Animal(String name) { this.name = name; }
    String speak() { return name + " makes a sound"; }
}

// write Cat here

public class Main {
    public static void main(String[] args) {
        Animal a = new Animal("Generic");
        Cat c = new Cat("Tom");
        System.out.println(a.speak());
        System.out.println(c.speak());
    }
}
`, tests: [{ out: 'Generic makes a sound\nTom meows' }], must: [[c`extends\s+Animal`, c`~class Cat extends Animal~`], [c`super\s*\(`, c`Call ~super(name)~.`]], sol: c`class Animal {
    String name;
    Animal(String name) { this.name = name; }
    String speak() { return name + " makes a sound"; }
}

class Cat extends Animal {
    Cat(String name) {
        super(name);
    }

    @Override
    String speak() {
        return name + " meows";
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Animal("Generic");
        Cat c = new Cat("Tom");
        System.out.println(a.speak());
        System.out.println(c.speak());
    }
}
` }),
] },

{ id: 'abstract', title: 'Abstract classes & interfaces', icon: '📜', desc: 'Promises a class must keep — and polymorphism.',
  v: [['7:51:58', '8:01:30', 'Abstraction'], ['8:01:30', '8:07:44', 'Interfaces'], ['8:07:44', '8:19:35', 'Polymorphism']],
  steps: [
  T('abstract', c`Some classes only make sense as a parent: there is no such thing as "a shape", only circles and squares. Mark them ~abstract~ — you cannot create one with ~new~. An ~abstract~ method has no body; every child **must** write one.`, c`
abstract class Shape {
    abstract double area();          // every shape must say how

    String describe() {              // normal methods are fine too
        return "Area " + area();
    }
}

class Square extends Shape {
    double side;
    Square(double side) { this.side = side; }
    double area() { return side * side; }
}`),
  T('Interfaces', c`An **interface** is a list of methods a class promises to have. A class can extend only one parent, but implement many interfaces.`, c`
interface Swimmer { void swim(); }
interface Flyer   { void fly(); }

class Duck implements Swimmer, Flyer {
    public void swim() { System.out.println("paddle"); }
    public void fly()  { System.out.println("flap"); }
}`),
  T('Polymorphism', c`A variable of the parent type can hold **any** child. Each object still runs **its own** version of a method. This is polymorphism — one loop handling many kinds of things.`, c`
Shape[] shapes = { new Square(2), new Circle(1) };
for (Shape s : shapes) {
    System.out.println(s.area());   // each shape works out its own area
}`),
  P(c`
abstract class Vehicle {
    abstract int wheels();
}
class Bike extends Vehicle { int wheels() { return 2; } }
class Car extends Vehicle { int wheels() { return 4; } }

public class Main {
    public static void main(String[] args) {
        Vehicle[] all = { new Bike(), new Car(), new Bike() };
        int total = 0;
        for (Vehicle v : all) total += v.wheels();
        System.out.println(total);
    }
}`, '8'),
  Q(c`Which of these is **not** allowed?`, [c`~Shape s = new Square(2);~`, c`~Shape s = new Shape();~ when Shape is abstract`, c`A class implementing two interfaces`, c`An abstract class with a normal method`], 1),
  X({ q: c`Write ~Circle~ and ~Rectangle~, both extending the abstract ~Shape~. The loop should print each area with two decimals:

~3.14~
~6.00~
~12.57~`, start: c`abstract class Shape {
    abstract double area();
}

// write Circle and Rectangle here

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(1), new Rectangle(2, 3), new Circle(2) };
        for (Shape s : shapes) {
            System.out.printf("%.2f%n", s.area());
        }
    }
}
`, tests: [{ out: '3.14\n6.00\n12.57' }], must: [[c`class\s+Circle\s+extends\s+Shape`, c`~class Circle extends Shape~`], [c`class\s+Rectangle\s+extends\s+Shape`, c`~class Rectangle extends Shape~`]], sol: c`abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    double area() { return Math.PI * r * r; }
}

class Rectangle extends Shape {
    double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }
    double area() { return w * h; }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(1), new Rectangle(2, 3), new Circle(2) };
        for (Shape s : shapes) {
            System.out.printf("%.2f%n", s.area());
        }
    }
}
` }),
] },

{ id: 'encapsulation', title: 'Getters and setters', icon: '🔐', desc: 'Private fields, guarded doors.',
  v: [['8:19:35', '8:28:00', 'Getters & setters']],
  steps: [
  T('private', c`A ~private~ field can only be touched by code inside its own class. Other code goes through **getters** (read) and **setters** (change) — so the class can refuse bad values. This is called **encapsulation**.`, c`
class Account {
    private double balance;

    double getBalance() {
        return balance;
    }

    void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("Invalid amount");
            return;
        }
        balance += amount;
    }
}

// account.balance = -1000000;   compile error: balance is private`),
  Q(c`Why make a field ~private~?`, ['It makes the program faster', 'So only the class itself can change it, and it can check the values', 'Private fields use less memory', 'So it can be static'], 1),
  X({ q: c`Finish ~Account~: ~withdraw(amount)~ must print ~Insufficient funds~ and change nothing if the amount is more than the balance. Expected output:

~Insufficient funds~
~Balance: 70.0~`, start: c`class Account {
    private double balance;

    double getBalance() { return balance; }

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    // write withdraw here
}

public class Main {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.deposit(100);
        acc.withdraw(30);
        acc.withdraw(500);
        System.out.println("Balance: " + acc.getBalance());
    }
}
`, tests: [{ out: 'Insufficient funds\nBalance: 70.0' }], must: [[c`void\s+withdraw\s*\(\s*double`, c`Write ~void withdraw(double amount)~.`], [c`private\s+double\s+balance`, c`Keep ~balance~ private.`]], sol: c`class Account {
    private double balance;

    double getBalance() { return balance; }

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    void withdraw(double amount) {
        if (amount > balance) {
            System.out.println("Insufficient funds");
            return;
        }
        balance -= amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.deposit(100);
        acc.withdraw(30);
        acc.withdraw(500);
        System.out.println("Balance: " + acc.getBalance());
    }
}
` }),
] },
],
quiz: [
  Q(c`Which keyword makes a class inherit from another?`, ['implements', 'extends', 'inherits', 'super'], 1),
  Q(c`Which keyword makes a class keep an interface's promises?`, ['implements', 'extends', 'abstract', 'interface'], 0),
  P(c`
class Base { String who() { return "base"; } }
class Child extends Base { String who() { return "child"; } }

public class Main {
    public static void main(String[] args) {
        Base b = new Child();
        System.out.println(b.who());
    }
}`, 'child', c`The variable's type is ~Base~, but the object is a ~Child~ — and the object decides. That is polymorphism.`),
  F('Call the parent constructor.', c`
class Dog extends Animal {
    Dog(String name) {
        [[super]](name);
    }
}`, null, 1),
] });

/* ============ TOPIC 9: COLLECTIONS & ERRORS ============ */
topic({ id: 'collections', title: 'Collections & Errors', icon: '🧰', color: '#b197fc', blurb: 'ArrayList, HashMap, exceptions, enums and generics.',
lessons: [
{ id: 'arraylist', title: 'ArrayList', icon: '📋', desc: 'A list that grows and shrinks.',
  v: [['8:45:17', '8:55:51', 'Wrapper classes'], ['8:55:51', '9:05:29', 'ArrayList']],
  steps: [
  T('Lists that grow', c`Arrays have a fixed size. An **ArrayList** grows and shrinks as you add and remove. The type in ~< >~ says what it holds.`, c`
import java.util.ArrayList;

ArrayList<String> todo = new ArrayList<>();
todo.add("Buy milk");
todo.add("Walk dog");
todo.add(0, "Wake up");       // insert at the front

todo.get(1)                   // "Buy milk"
todo.size()                   // 3
todo.contains("Walk dog")     // true
todo.remove("Buy milk");      // remove by value
todo.set(0, "Get up");        // replace

for (String t : todo) System.out.println(t);`),
  T('Wrapper classes', c`Collections can only hold **objects**, not basic types like ~int~. Each basic type has an object twin: ~Integer~, ~Double~, ~Boolean~, ~Character~. Java converts between them automatically.`, c`
ArrayList<Integer> scores = new ArrayList<>();   // not <int>
scores.add(90);                                  // int → Integer automatically
int first = scores.get(0);                       // and back

Integer.parseInt("42")     // 42 — text to number
Integer.MAX_VALUE          // 2147483647`),
  P(c`
ArrayList<Integer> list = new ArrayList<>();
list.add(5); list.add(10); list.add(15);
list.remove(0);
System.out.println(list + " " + list.size());`, '[10, 15] 2', c`~remove(0)~ with an int removes by **position**.`),
  X({ q: c`Read words until the word ~end~. Print how many words there were, then the words in **reverse** order on one line:

~red green blue end~ →
~3~
~blue green red~`, start: M(c`
        Scanner in = new Scanner(System.in);
        ArrayList<String> words = new ArrayList<>();
`, 'java.util.Scanner', 'java.util.ArrayList'), tests: [{ in: 'red green blue end', out: '3\nblue green red' }, { in: 'solo end', out: '1\nsolo' }], must: [[c`\.add\s*\(`, c`Store the words in the ArrayList with ~add~.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        ArrayList<String> words = new ArrayList<>();
        String w = in.next();
        while (!w.equals("end")) {
            words.add(w);
            w = in.next();
        }
        System.out.println(words.size());
        for (int i = words.size() - 1; i >= 0; i--) {
            System.out.print(words.get(i) + " ");
        }
        System.out.println();`, 'java.util.Scanner', 'java.util.ArrayList') }),
] },

{ id: 'hashmap', title: 'HashMap', icon: '🗝️', desc: 'Look things up by name.',
  v: [['10:52:09', '11:02:38', 'HashMap']],
  steps: [
  T('Keys and values', c`A **HashMap** stores pairs: a **key** you look up, and its **value**. Keys are unique — putting the same key again replaces its value.`, c`
import java.util.HashMap;

HashMap<String, Integer> ages = new HashMap<>();
ages.put("Ada", 36);
ages.put("Linus", 54);

ages.get("Ada")                 // 36
ages.get("Bob")                 // null — not there
ages.getOrDefault("Bob", 0)     // 0
ages.containsKey("Linus")       // true
ages.put("Ada", 37);            // replaces 36

for (String name : ages.keySet()) {
    System.out.println(name + " is " + ages.get(name));
}`, c`A HashMap does not keep any order. Use a ~TreeMap~ to keep the keys sorted.`),
  P(c`
HashMap<String, Integer> stock = new HashMap<>();
stock.put("apple", 3);
stock.put("apple", stock.get("apple") + 2);
System.out.println(stock.get("apple") + " " + stock.size());`, '5 1'),
  X({ q: c`**Vote counter.** Read names until ~done~, then print the winner and their number of votes:

~Ada Bo Ada Cy Ada Bo done~ → ~Ada wins with 3 votes~`, start: M(c`
        Scanner in = new Scanner(System.in);
        HashMap<String, Integer> votes = new HashMap<>();
`, 'java.util.Scanner', 'java.util.HashMap'), tests: [{ in: 'Ada Bo Ada Cy Ada Bo done', out: 'Ada wins with 3 votes' }, { in: 'Cy Bo Bo done', out: 'Bo wins with 2 votes' }], must: [[c`\.put\s*\(`, c`Count the votes in the HashMap.`]], hint: c`~votes.put(name, votes.getOrDefault(name, 0) + 1);~ — then loop over ~votes.keySet()~ to find the biggest count.`, sol: M(c`
        Scanner in = new Scanner(System.in);
        HashMap<String, Integer> votes = new HashMap<>();
        String name = in.next();
        while (!name.equals("done")) {
            votes.put(name, votes.getOrDefault(name, 0) + 1);
            name = in.next();
        }

        String winner = "";
        int most = 0;
        for (String n : votes.keySet()) {
            if (votes.get(n) > most) {
                most = votes.get(n);
                winner = n;
            }
        }
        System.out.println(winner + " wins with " + most + " votes");`, 'java.util.Scanner', 'java.util.HashMap') }),
] },

{ id: 'exceptions', title: 'Exceptions', icon: '💥', desc: 'Catch errors instead of crashing.',
  v: [['9:05:29', '9:14:00', 'Exception handling']],
  steps: [
  T('try and catch', c`When something goes wrong at run time, Java **throws an exception**. Uncaught, it stops the program. Code that might fail goes in ~try~; ~catch~ handles a specific kind of exception; ~finally~ always runs.`, c`
try {
    int x = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Maths error: " + e.getMessage());   // / by zero
} finally {
    System.out.println("done");
}`, c`Common ones: ~ArithmeticException~ (whole-number ÷ 0), ~ArrayIndexOutOfBoundsException~, ~NullPointerException~, ~NumberFormatException~ (~Integer.parseInt("abc")~), ~InputMismatchException~ (Scanner got text, wanted a number).`),
  T('throw', c`Your own code can throw too — the right reaction to impossible input:`, c`
static void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
    ...
}`),
  P(c`
try {
    int[] a = new int[2];
    a[5] = 1;
    System.out.println("stored");
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("caught");
}
System.out.println("still running");`, 'caught\nstill running'),
  X({ q: c`Read a line of text. If it is a whole number, print it doubled; otherwise print ~Not a number~. Use ~Integer.parseInt~ and catch the ~NumberFormatException~.`, start: M(c`
        Scanner in = new Scanner(System.in);
        String text = in.nextLine();
`, 'java.util.Scanner'), tests: [{ in: '21\n', out: '42' }, { in: 'twelve\n', out: 'Not a number' }, { in: '-5\n', out: '-10' }], must: [[c`catch\s*\(\s*NumberFormatException`, c`Catch ~NumberFormatException~.`]], sol: M(c`
        Scanner in = new Scanner(System.in);
        String text = in.nextLine();
        try {
            int n = Integer.parseInt(text);
            System.out.println(n * 2);
        } catch (NumberFormatException e) {
            System.out.println("Not a number");
        }`, 'java.util.Scanner') }),
  X({ q: c`Write ~static int divide(int a, int b)~ that **throws** an ~IllegalArgumentException~ with the message ~Cannot divide by zero~ when ~b~ is 0. ~main~ catches it.`, start: c`public class Main {

    // write divide here

    public static void main(String[] args) {
        int[][] pairs = { {10, 2}, {7, 0} };
        for (int[] p : pairs) {
            try {
                System.out.println(divide(p[0], p[1]));
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}
`, tests: [{ out: '5\nError: Cannot divide by zero' }], must: [[c`throw\s+new\s+IllegalArgumentException`, c`~throw new IllegalArgumentException("...")~`]], sol: c`public class Main {

    static int divide(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("Cannot divide by zero");
        }
        return a / b;
    }

    public static void main(String[] args) {
        int[][] pairs = { {10, 2}, {7, 0} };
        for (int[] p : pairs) {
            try {
                System.out.println(divide(p[0], p[1]));
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}
` }),
] },

{ id: 'enums', title: 'Enums & generics', icon: '🏷️', desc: 'Fixed sets of values, and code that works for any type.',
  v: [['11:02:38', '11:12:00', 'Enums'], ['10:38:16', '10:52:09', 'Generics']],
  steps: [
  T('enum', c`An **enum** is a type with a fixed list of values. The compiler stops typos like ~"MEDUIM"~ that a String would let through.`, c`
enum Level { LOW, MEDIUM, HIGH }

Level l = Level.MEDIUM;
System.out.println(l);             // MEDIUM
System.out.println(l.ordinal());   // 1 — its position

switch (l) {
    case LOW -> System.out.println("Relax");
    case MEDIUM -> System.out.println("Careful");
    case HIGH -> System.out.println("Run!");
}

Level.valueOf("HIGH")              // text → enum value`),
  T('Generics', c`The ~<String>~ in ~ArrayList<String>~ is a **type parameter**. You can write your own generic classes and methods: ~T~ stands for "whatever type is used".`, c`
class Box<T> {
    private T item;
    Box(T item) { this.item = item; }
    T get() { return item; }
}

Box<String> a = new Box<>("hello");
Box<Integer> b = new Box<>(42);
String s = a.get();      // no casting needed — the compiler knows it is a String`),
  P(c`
enum Size { SMALL, MEDIUM, LARGE }

public class Main {
    public static void main(String[] args) {
        Size s = Size.valueOf("LARGE");
        System.out.println(s + " " + s.ordinal() + " " + Size.values().length);
    }
}`, 'LARGE 2 3'),
  X({ q: c`Read a traffic light colour (~RED~, ~AMBER~ or ~GREEN~), turn it into the ~Light~ enum with ~valueOf~, and use a switch to print ~Stop~, ~Get ready~ or ~Go~.`, start: c`import java.util.Scanner;

enum Light { RED, AMBER, GREEN }

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String text = in.nextLine();
    }
}
`, tests: [{ in: 'RED\n', out: 'Stop' }, { in: 'AMBER\n', out: 'Get ready' }, { in: 'GREEN\n', out: 'Go' }], must: [[c`Light\.valueOf`, c`Use ~Light.valueOf(text)~.`], [c`\bswitch\b`, c`Use a ~switch~.`]], sol: c`import java.util.Scanner;

enum Light { RED, AMBER, GREEN }

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String text = in.nextLine();
        Light light = Light.valueOf(text);

        switch (light) {
            case RED -> System.out.println("Stop");
            case AMBER -> System.out.println("Get ready");
            case GREEN -> System.out.println("Go");
        }
    }
}
` }),
] },
],
quiz: [
  P(c`
ArrayList<String> l = new ArrayList<>();
l.add("a"); l.add("b"); l.add(1, "c");
System.out.println(l);`, '[a, c, b]'),
  Q(c`Why ~ArrayList<Integer>~ and not ~ArrayList<int>~?`, ['int is too small', 'Collections can only hold objects', 'It is a typo either way', 'Integer is faster'], 1),
  P(c`
HashMap<String, Integer> m = new HashMap<>();
m.put("x", 1);
System.out.println(m.getOrDefault("y", 9));`, '9'),
  P(c`
try {
    Integer.parseInt("12a");
    System.out.println("ok");
} catch (NumberFormatException e) {
    System.out.println("bad");
} finally {
    System.out.println("end");
}`, 'bad\nend'),
  Q(c`Which block always runs, error or not?`, ['try', 'catch', 'finally', 'throw'], 2),
] });

/* ============ TOPIC 10: FINAL BOSS ============ */
topic({ id: 'boss', title: 'Final Boss', icon: '👑', color: '#c0c7ff', blurb: 'Three bigger programs that use everything.',
lessons: [
{ id: 'projects', title: 'Capstone projects', icon: '🏆', desc: 'A library, a grade book and a bank.',
  v: [['5:44:00', '6:00:00', 'Quiz game']],
  steps: [
  T('No new syntax', c`Three realistic programs. Decide on your classes and collections first, then build one piece at a time and **Run** often. Java's compiler is your friend: fix the first error, then the next.`),
  X({ q: c`**Library.** Read commands, one per line, until ~quit~:

~add <title>~ adds a book · ~borrow <title>~ prints ~Borrowed <title>~, or ~Not available~ if it is missing or already on loan · ~return <title>~ makes it available again · ~list~ prints each book as ~Dune (available)~ or ~Dune (on loan)~ in the order they were added.

Write a ~Book~ class to hold each book.`, start: c`import java.util.ArrayList;
import java.util.Scanner;

class Book {
    // title, and whether it is on loan
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        ArrayList<Book> books = new ArrayList<>();
        String line = in.nextLine();
        while (!line.equals("quit")) {
            // handle the command
            line = in.nextLine();
        }
    }
}
`, tests: [{ in: 'add Dune\nadd Emma\nborrow Dune\nborrow Dune\nborrow Ulysses\nlist\nreturn Dune\nlist\nquit\n', out: 'Borrowed Dune\nNot available\nNot available\nDune (on loan)\nEmma (available)\nDune (available)\nEmma (available)' }, { in: 'add The Hobbit\nborrow The Hobbit\nlist\nquit\n', out: 'Borrowed The Hobbit\nThe Hobbit (on loan)' }], must: [[c`class\s+Book`, c`Write a ~Book~ class.`]], hint: c`Give ~Book~ a ~String title~ and a ~boolean onLoan~. Split each command with ~line.startsWith("borrow ")~ and ~line.substring(7)~. A helper ~static Book find(ArrayList<Book> books, String title)~ saves repeating the search.`, sol: c`import java.util.ArrayList;
import java.util.Scanner;

class Book {
    String title;
    boolean onLoan;

    Book(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return title + (onLoan ? " (on loan)" : " (available)");
    }
}

public class Main {

    static Book find(ArrayList<Book> books, String title) {
        for (Book b : books) {
            if (b.title.equals(title)) return b;
        }
        return null;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        ArrayList<Book> books = new ArrayList<>();
        String line = in.nextLine();
        while (!line.equals("quit")) {
            if (line.startsWith("add ")) {
                books.add(new Book(line.substring(4)));
            } else if (line.startsWith("borrow ")) {
                Book b = find(books, line.substring(7));
                if (b == null || b.onLoan) {
                    System.out.println("Not available");
                } else {
                    b.onLoan = true;
                    System.out.println("Borrowed " + b.title);
                }
            } else if (line.startsWith("return ")) {
                Book b = find(books, line.substring(7));
                if (b != null) b.onLoan = false;
            } else if (line.equals("list")) {
                for (Book b : books) System.out.println(b);
            }
            line = in.nextLine();
        }
    }
}
` }),
  X({ q: c`**Grade book.** Read lines like ~Ana 80~ until ~end~. A student can appear several times. Print each student's average with one decimal, in **alphabetical** order:

~Ana 80~ · ~Ben 60~ · ~Ana 91~ · ~end~ →
~Ana: 85.5~
~Ben: 60.0~`, start: c`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        // a TreeMap keeps its keys sorted
    }
}
`, tests: [{ in: 'Ana 80\nBen 60\nAna 91\nend\n', out: 'Ana: 85.5\nBen: 60.0' }, { in: 'Zed 70\nAmy 90\nZed 71\nAmy 100\nAmy 80\nend\n', out: 'Amy: 90.0\nZed: 70.5' }], must: [[c`TreeMap|HashMap`, c`Store the scores in a map.`]], hint: c`~TreeMap<String, ArrayList<Integer>>~ maps each name to its list of scores. ~scores.computeIfAbsent(name, k -> new ArrayList<>()).add(score);~ — or check ~containsKey~ first.`, sol: c`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        TreeMap<String, ArrayList<Integer>> scores = new TreeMap<>();

        String name = in.next();
        while (!name.equals("end")) {
            int score = in.nextInt();
            if (!scores.containsKey(name)) {
                scores.put(name, new ArrayList<>());
            }
            scores.get(name).add(score);
            name = in.next();
        }

        for (String n : scores.keySet()) {
            int total = 0;
            for (int s : scores.get(n)) total += s;
            System.out.printf("%s: %.1f%n", n, (double) total / scores.get(n).size());
        }
    }
}
` }),
  X({ q: c`**Bank.** An ~Account~ keeps its balance ~private~. Its ~withdraw~ method **throws** an ~IllegalArgumentException~ for amounts that are 0 or less, or more than the balance. Read commands until ~quit~:

~deposit 50~ · ~withdraw 20~ · ~balance~ (prints ~Balance: 30.00~)

When a withdraw fails, catch the exception and print ~Error: ~ followed by its message: ~Insufficient funds~ or ~Invalid amount~.`, start: c`import java.util.Scanner;

class Account {
    private double balance;
    // deposit, withdraw, getBalance
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Account acc = new Account();
    }
}
`, tests: [{ in: 'deposit 50\nwithdraw 20\nbalance\nwithdraw 100\nwithdraw -5\nbalance\nquit\n', out: 'Balance: 30.00\nError: Insufficient funds\nError: Invalid amount\nBalance: 30.00' }, { in: 'deposit 12.5\nbalance\nquit\n', out: 'Balance: 12.50' }], must: [[c`throw\s+new\s+IllegalArgumentException`, c`~withdraw~ should ~throw new IllegalArgumentException(...)~.`], [c`catch\s*\(`, c`Catch the exception in ~main~.`], [c`private\s+double\s+balance`, c`Keep ~balance~ private.`]], sol: c`import java.util.Scanner;

class Account {
    private double balance;

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Invalid amount");
        if (amount > balance) throw new IllegalArgumentException("Insufficient funds");
        balance -= amount;
    }

    double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Account acc = new Account();
        String cmd = in.next();
        while (!cmd.equals("quit")) {
            switch (cmd) {
                case "deposit" -> acc.deposit(in.nextDouble());
                case "withdraw" -> {
                    try {
                        acc.withdraw(in.nextDouble());
                    } catch (IllegalArgumentException e) {
                        System.out.println("Error: " + e.getMessage());
                    }
                }
                case "balance" -> System.out.printf("Balance: %.2f%n", acc.getBalance());
            }
            cmd = in.next();
        }
    }
}
` }),
  T('Where next?', c`You can now write real object-oriented Java. Next steps:

**Build something:** a text adventure, a quiz game, a to-do app that saves to a file (~java.nio.file.Files~).

**Streams and lambdas:** ~list.stream().filter(...).map(...)~ — the modern way to process collections.

**Android or Spring Boot:** the two biggest places Java is used for real apps and servers.`),
] },
],
quiz: [
  Q(c`Which is the best fit for "look up a phone number by name"?`, ['an int[] array', 'an ArrayList', 'a HashMap', 'an enum'], 2),
  P(c`
ArrayList<Integer> n = new ArrayList<>(List.of(4, 8, 15));
int sum = 0;
for (int x : n) sum += x;
System.out.println(sum + " " + n.contains(8));`, '27 true'),
  Q(c`What does ~@Override~ ask the compiler to check?`, ['That the method is fast', 'That a parent really has a method with this signature', 'That the method is static', 'That the method throws no exceptions'], 1),
  Q(c`Which keeps an object's data safe from outside changes?`, [c`~public~ fields`, c`~static~ fields`, c`~private~ fields with getters and setters`, 'No constructors'], 2),
] });
