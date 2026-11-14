/* ================= Java, Part 2: Advanced (topics A1-A5) =================
   Topics marked advanced: true appear after the Final Boss, under a "Part 2" heading.
   Everything stays within Java 21, the version the online compiler (JDK 22) and most employers use.
   Predict snippets that need more than java.util are written as complete programs with their own imports. */
G('generic method', c`A method with its own type parameter: ~static <T> T first(List<T> items)~.`);
G('bounded type', c`~<T extends Comparable<T>>~ — T can be any type, as long as it can be compared.`);
G('wildcard', c`~List<? extends Number>~ accepts a list of Integers, Doubles or any other kind of Number.`);
G('functional interface', c`An interface with exactly one abstract method, so a lambda can stand in for it: ~Runnable~, ~Comparator~, ~Predicate~, ~Function~…`);
G('method reference', c`A short lambda that just calls one method: ~String::length~, ~System.out::println~.`);
G('Comparator', c`An object that decides the order of two items. ~Comparator.comparing(Player::score).reversed()~ builds one.`);
G('stream', c`A pipeline over a collection: a source, then steps like ~filter~ and ~map~, then a final step like ~toList()~ or ~sum()~.`);
G('Collectors', c`Ready-made ways to finish a stream: ~groupingBy~, ~counting~, ~joining~, ~partitioningBy~, ~toMap~…`);
G('Optional', c`A box that holds a value or is empty, instead of returning ~null~: ~findFirst()~, ~max()~, ~orElse(...)~.`);
G('ArrayDeque', c`The go-to stack (~push~/~pop~) and queue (~offer~/~poll~) in modern Java.`);
G('PriorityQueue', c`A queue that always hands out its **smallest** item first (or by your own Comparator).`);
G('TreeMap', c`A map that keeps its keys sorted, with lookups like ~floorKey~ and ~ceilingKey~.`);
G('record', c`A compact, immutable data class: ~record Point(int x, int y) {}~ gives a constructor, accessors, ~equals~, ~hashCode~ and ~toString~.`);
G('sealed', c`~sealed interface Shape permits Circle, Square~ — only the listed types may implement it, so a ~switch~ can check it covered them all.`);
G('pattern matching', c`~if (o instanceof String s)~ and ~case Circle c ->~ test the type and give you a typed variable in one go.`);
G('hashCode', c`A number that ~HashMap~ and ~HashSet~ use to find an object. Equal objects **must** have equal hash codes.`);
G('immutable', c`Cannot change after it is made, like ~String~ and records. Safe to share, including between threads.`);
G('checked exception', c`An exception the compiler makes you handle or declare with ~throws~ (it extends ~Exception~, not ~RuntimeException~).`);
G('try-with-resources', c`~try (var r = open()) { ... }~ — closes the resource automatically, even after an exception.`);
G('AutoCloseable', c`The interface a resource implements so that try-with-resources can close it.`);
G('builder pattern', c`Creating an object step by step: ~new Pizza.Builder().size("large").topping("ham").build()~.`);
G('strategy pattern', c`Swapping behaviour by passing in an object (or a lambda) that does the job a particular way.`);

/* ============ ADVANCED 1: GENERICS & LAMBDAS ============ */
topic({ id: 'adv-generics', advanced: true, title: 'Generics & Lambdas', icon: 'λ', color: '#ff4b4b', blurb: 'Type-safe reusable code, functions as values and smart sorting.',
lessons: [
{ id: 'generics', title: 'Generics in depth', icon: '🧬', desc: 'Generic classes, generic methods, bounds and wildcards.',
  steps: [
  T('Write it once, for any type', c`You have used generic types since ~ArrayList<String>~. Writing your own means one class or method works for every type, with the compiler still checking each use.`, c`
class Box<T> {
    private final T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

static <T> T first(List<T> items) {          // a generic METHOD: <T> before the return type
    return items.get(0);
}

Box<String> b = new Box<>("hi");             // <> works out the type
String s = b.get();                          // no cast needed`),
  T('Bounds and wildcards', c`Inside a generic method you can only do what **every** possible ~T~ can do. A **bound** promises more: ~<T extends Comparable<T>>~ means "T can be compared", so ~compareTo~ is allowed.

A **wildcard** loosens a parameter: a ~List<Integer>~ is **not** a ~List<Number>~, but it **is** a ~List<? extends Number>~.`, c`
static <T extends Comparable<T>> T largest(List<T> items) { ... }

static double sum(List<? extends Number> nums) {
    double total = 0;
    for (Number n : nums) total += n.doubleValue();
    return total;
}`),
  P(c`
import java.util.*;

public class Main {
    static <T extends Comparable<T>> T largest(List<T> items) {
        T best = items.get(0);
        for (T item : items) {
            if (item.compareTo(best) > 0) best = item;
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(largest(List.of(3, 42, 7)) + " " + largest(List.of("pear", "apple", "zebra")));
    }
}`, '42 zebra'),
  P(c`
import java.util.*;

public class Main {
    static double sum(List<? extends Number> nums) {
        double total = 0;
        for (Number n : nums) total += n.doubleValue();
        return total;
    }

    public static void main(String[] args) {
        List<Integer> ints = List.of(1, 2, 3);
        List<Double> doubles = List.of(0.5, 1.0);
        System.out.println(sum(ints) + " " + sum(doubles));
    }
}`, '6.0 1.5'),
  Q(c`A method takes ~List<Number>~. What happens if you pass it a ~List<Integer>~?`, ['It works: Integer is a Number', 'Compile error: List<Integer> is not a List<Number>. Use List<? extends Number>', 'It works but loses the decimals', 'It crashes when run'], 1),
  X({ q: c`Write a generic class ~Pair<A, B>~ with ~getFirst()~, ~getSecond()~, ~swap()~ (returns a ~Pair<B, A>~) and a ~toString()~ that looks like ~(Ada, 36)~.

Expected:
~(Ada, 36)~
~(36, Ada)~
~39~`, start: c`// write Pair<A, B> here

public class Main {
    public static void main(String[] args) {
        Pair<String, Integer> p = new Pair<>("Ada", 36);
        System.out.println(p);
        System.out.println(p.swap());
        System.out.println(p.getFirst().length() + p.getSecond());
    }
}
`, tests: [{ out: '(Ada, 36)\n(36, Ada)\n39' }], must: [[c`class\s+Pair\s*<\s*A\s*,\s*B\s*>`, c`~class Pair<A, B>~`]], sol: c`class Pair<A, B> {
    private final A first;
    private final B second;

    Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    A getFirst() { return first; }
    B getSecond() { return second; }

    Pair<B, A> swap() {
        return new Pair<>(second, first);
    }

    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Pair<String, Integer> p = new Pair<>("Ada", 36);
        System.out.println(p);
        System.out.println(p.swap());
        System.out.println(p.getFirst().length() + p.getSecond());
    }
}
` }),
  X({ q: c`Write two generic methods: ~static <T> List<T> repeat(T item, int times)~ and ~static <T extends Comparable<T>> T smallest(List<T> items)~.

Expected: ~[hi, hi, hi]~ ~2~ ~apple~`, start: c`import java.util.*;

public class Main {
    // write repeat and smallest here

    public static void main(String[] args) {
        System.out.println(repeat("hi", 3));
        System.out.println(smallest(List.of(5, 2, 9)));
        System.out.println(smallest(List.of("pear", "apple", "fig")));
    }
}
`, tests: [{ out: '[hi, hi, hi]\n2\napple' }], must: [[c`static\s+<\s*T\s*>\s+List<T>\s+repeat`, c`~static <T> List<T> repeat(T item, int times)~`], [c`<\s*T\s+extends\s+Comparable<T>\s*>`, c`~static <T extends Comparable<T>> T smallest(List<T> items)~`]], sol: c`import java.util.*;

public class Main {
    static <T> List<T> repeat(T item, int times) {
        List<T> result = new ArrayList<>();
        for (int i = 0; i < times; i++) {
            result.add(item);
        }
        return result;
    }

    static <T extends Comparable<T>> T smallest(List<T> items) {
        T best = items.get(0);
        for (T item : items) {
            if (item.compareTo(best) < 0) best = item;
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(repeat("hi", 3));
        System.out.println(smallest(List.of(5, 2, 9)));
        System.out.println(smallest(List.of("pear", "apple", "fig")));
    }
}
` }),
] },

{ id: 'lambdas', title: 'Lambdas & functional interfaces', icon: '🏹', desc: 'Pass behaviour around like data.',
  steps: [
  T('Lambdas', c`A **lambda** is a function written inline: ~(a, b) -> a + b~. It can be used anywhere Java expects a **functional interface**: an interface with exactly one abstract method. ~java.util.function~ has the common shapes:`, c`
import java.util.function.*;

Function<Integer, Integer> square = x -> x * x;          // T -> R
Predicate<String> isLong = s -> s.length() > 3;          // T -> boolean
Consumer<String> shout = s -> System.out.println(s + "!");
Supplier<Double> dice = () -> Math.random() * 6;         // () -> T
BinaryOperator<Integer> add = (a, b) -> a + b;           // (T, T) -> T

square.apply(5);            // 25
isLong.test("Java");        // true
square.andThen(x -> x + 1)  // chain functions
isLong.negate()             // flip a predicate; and(), or() combine them`, c`A **method reference** is a lambda that only calls one method: ~String::length~, ~String::toUpperCase~, ~System.out::println~.`),
  P(c`
import java.util.function.*;

public class Main {
    public static void main(String[] args) {
        Function<Integer, Integer> square = x -> x * x;
        Function<Integer, Integer> plusOne = x -> x + 1;
        Predicate<String> isLong = s -> s.length() > 3;
        System.out.println(square.apply(5) + " " + isLong.test("Java") + " " + square.andThen(plusOne).apply(3));
    }
}`, '25 true 10'),
  P(c`
List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
nums.removeIf(n -> n % 2 == 0);
nums.replaceAll(n -> n * 10);
System.out.println(nums);`, '[10, 30, 50]', c`Collections take lambdas too: ~removeIf~, ~replaceAll~, ~forEach~, ~sort~.`),
  Q('Which of these is NOT a functional interface?', [c`~Runnable~`, c`~Comparator<T>~`, c`~List<T>~`, c`~Predicate<T>~`], 2, c`~List~ has dozens of abstract methods, so no single lambda can implement it.`),
  X({ q: c`**Calculator with a map of lambdas.** Store the operations in a ~Map<String, BinaryOperator<Integer>>~ instead of a ~switch~. Read ~a op b~ and print the answer, or ~Unknown operator~. Support ~+ - * / %~.`, start: c`import java.util.*;
import java.util.function.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        String op = in.next();
        int b = in.nextInt();
        System.out.println(a + op + b);
    }
}
`, tests: [{ in: '6 * 7', out: '42' }, { in: '17 % 5', out: '2' }, { in: '2 ^ 3', out: 'Unknown operator' }], must: [[c`BinaryOperator`, c`Use ~BinaryOperator<Integer>~ for the operations.`], [c`Map\s*<\s*String\s*,\s*BinaryOperator`, c`Keep them in a ~Map<String, BinaryOperator<Integer>>~.`]], not: [[c`switch`, c`Use the map, not a switch.`]], sol: c`import java.util.*;
import java.util.function.*;

public class Main {
    public static void main(String[] args) {
        Map<String, BinaryOperator<Integer>> ops = Map.of(
            "+", (x, y) -> x + y,
            "-", (x, y) -> x - y,
            "*", (x, y) -> x * y,
            "/", (x, y) -> x / y,
            "%", (x, y) -> x % y
        );
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        String op = in.next();
        int b = in.nextInt();
        BinaryOperator<Integer> f = ops.get(op);
        System.out.println(f == null ? "Unknown operator" : String.valueOf(f.apply(a, b)));
    }
}
` }),
  X({ q: c`Write ~static List<String> keep(List<String> items, Predicate<String> rule)~. ~main~ is written and passes three rules, the last made by combining two with ~and~.

Expected:
~[apple, avocado]~
~[banana, avocado, cherry]~
~[avocado]~`, start: c`import java.util.*;
import java.util.function.*;

public class Main {
    // write keep here

    public static void main(String[] args) {
        List<String> fruit = List.of("apple", "banana", "avocado", "fig", "cherry");
        Predicate<String> startsWithA = s -> s.startsWith("a");
        Predicate<String> isLong = s -> s.length() > 5;
        System.out.println(keep(fruit, startsWithA));
        System.out.println(keep(fruit, isLong));
        System.out.println(keep(fruit, startsWithA.and(isLong)));
    }
}
`, tests: [{ out: '[apple, avocado]\n[banana, avocado, cherry]\n[avocado]' }], must: [[c`static\s+List<String>\s+keep\s*\(\s*List<String>\s+\w+\s*,\s*Predicate<String>`, c`~static List<String> keep(List<String> items, Predicate<String> rule)~`]], sol: c`import java.util.*;
import java.util.function.*;

public class Main {
    static List<String> keep(List<String> items, Predicate<String> rule) {
        List<String> result = new ArrayList<>();
        for (String item : items) {
            if (rule.test(item)) result.add(item);
        }
        return result;
    }

    public static void main(String[] args) {
        List<String> fruit = List.of("apple", "banana", "avocado", "fig", "cherry");
        Predicate<String> startsWithA = s -> s.startsWith("a");
        Predicate<String> isLong = s -> s.length() > 5;
        System.out.println(keep(fruit, startsWithA));
        System.out.println(keep(fruit, isLong));
        System.out.println(keep(fruit, startsWithA.and(isLong)));
    }
}
` }),
] },

{ id: 'comparators', title: 'Comparators', icon: '🔢', desc: 'Sort by anything, then by anything else.',
  steps: [
  T('Building a Comparator', c`~Comparator~ has helper methods that read almost like English:`, c`
players.sort(Comparator.comparing(Player::getName));                 // A-Z by name
players.sort(Comparator.comparingInt(Player::getScore).reversed());  // high score first
players.sort(Comparator.comparingInt(Player::getScore).reversed()
                       .thenComparingInt(Player::getSeconds));      // ...then fastest
words.sort(Comparator.comparing(String::length)
                     .thenComparing(Comparator.naturalOrder()));    // by length, then A-Z
words.sort(Comparator.reverseOrder());                              // Z-A`, c`Use ~comparingInt~ / ~comparingDouble~ for numbers: they avoid boxing every value into an object.`),
  P(c`
List<String> words = new ArrayList<>(List.of("kiwi", "fig", "banana", "date"));
words.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));
System.out.println(words);`, '[fig, date, kiwi, banana]', c`~date~ and ~kiwi~ are both 4 letters, so the tie is broken alphabetically.`),
  P(c`
List<Integer> nums = new ArrayList<>(List.of(3, 10, 7));
nums.sort(Comparator.reverseOrder());
System.out.println(nums + " " + Collections.max(nums, Comparator.comparing(n -> n % 5)));`, '[10, 7, 3] 3', c`By "remainder after dividing by 5", 3 (remainder 3) beats 7 (2) and 10 (0).`),
  Q(c`What does ~.reversed()~ at the end of ~comparingInt(Player::getScore).thenComparing(Player::getName).reversed()~ reverse?`, ['Only the name order', 'Only the score order', 'The whole comparator: both score and name', 'Nothing'], 2, c`Put ~reversed()~ straight after the part you mean to flip.`),
  X({ q: c`Sort the leaderboard: highest **score** first, and on a tie the **faster** time (fewer seconds) first. Use ~Comparator.comparingInt~ with ~reversed()~ and ~thenComparingInt~.

~1. Cy 150~ ~2. Bo 150~ ~3. Ada 120~ ~4. Di 90~`, start: c`import java.util.*;

class Player {
    private final String name;
    private final int score, seconds;
    Player(String name, int score, int seconds) { this.name = name; this.score = score; this.seconds = seconds; }
    String getName() { return name; }
    int getScore() { return score; }
    int getSeconds() { return seconds; }
}

public class Main {
    public static void main(String[] args) {
        List<Player> players = new ArrayList<>(List.of(
            new Player("Ada", 120, 33), new Player("Bo", 150, 51),
            new Player("Cy", 150, 22), new Player("Di", 90, 10)));

        for (int i = 0; i < players.size(); i++) {
            Player p = players.get(i);
            System.out.println((i + 1) + ". " + p.getName() + " " + p.getScore());
        }
    }
}
`, tests: [{ out: '1. Cy 150\n2. Bo 150\n3. Ada 120\n4. Di 90' }], must: [[c`Comparator\.comparingInt`, c`Build it with ~Comparator.comparingInt(Player::getScore)~.`], [c`thenComparingInt`, c`Break ties with ~thenComparingInt~.`]], sol: c`import java.util.*;

class Player {
    private final String name;
    private final int score, seconds;
    Player(String name, int score, int seconds) { this.name = name; this.score = score; this.seconds = seconds; }
    String getName() { return name; }
    int getScore() { return score; }
    int getSeconds() { return seconds; }
}

public class Main {
    public static void main(String[] args) {
        List<Player> players = new ArrayList<>(List.of(
            new Player("Ada", 120, 33), new Player("Bo", 150, 51),
            new Player("Cy", 150, 22), new Player("Di", 90, 10)));

        players.sort(Comparator.comparingInt(Player::getScore).reversed()
                               .thenComparingInt(Player::getSeconds));

        for (int i = 0; i < players.size(); i++) {
            Player p = players.get(i);
            System.out.println((i + 1) + ". " + p.getName() + " " + p.getScore());
        }
    }
}
` }),
] },
],
quiz: [
  P(c`
List<String> names = new ArrayList<>(List.of("bo", "Ada", "cy"));
names.sort(String.CASE_INSENSITIVE_ORDER);
System.out.println(names);`, '[Ada, bo, cy]'),
  Q(c`Which built-in functional interface fits "take a String, answer true or false"?`, [c`~Function<String, String>~`, c`~Predicate<String>~`, c`~Supplier<String>~`, c`~Consumer<String>~`], 1),
  Q(c`Why write ~<T extends Comparable<T>>~ rather than just ~<T>~?`, ['It is faster', c`So the method may call ~compareTo~ on T values`, 'So T can be null', 'It is required for every generic method'], 1),
  F('Use a method reference to get each word\'s length.', c`
List<String> words = new ArrayList<>(List.of("ccc", "a", "bb"));
words.sort(Comparator.comparing(String[[::]]length));
System.out.println(words);`),
] });

/* ============ ADVANCED 2: STREAMS ============ */
topic({ id: 'adv-streams', advanced: true, title: 'Streams', icon: '🌊', color: '#1cb0f6', blurb: 'Filter, transform and summarise data in a single readable pipeline.',
lessons: [
{ id: 'streams', title: 'Stream pipelines', icon: '🚰', desc: 'filter, map, sorted, collect.',
  steps: [
  T('A pipeline', c`A **stream** processes a collection as a pipeline: a **source**, any number of **intermediate** steps, and one **terminal** step that produces the result. It reads like a description of what you want rather than a loop of how to get it.`, c`
import java.util.stream.*;

List<Integer> result = scores.stream()        // source
    .filter(s -> s >= 50)                       // keep some
    .map(s -> s + 5)                            // change each
    .sorted()                                   // order them
    .toList();                                  // terminal: collect into a list

long passed = scores.stream().filter(s -> s >= 50).count();
int total = scores.stream().mapToInt(Integer::intValue).sum();
double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0);
IntStream.rangeClosed(1, 5)                     // 1 2 3 4 5, without a list`, c`Streams are **lazy**: nothing runs until the terminal step. Other intermediate steps: ~distinct()~, ~limit(n)~, ~skip(n)~, ~flatMap~. Terminal steps: ~forEach~, ~reduce~, ~anyMatch~, ~min~, ~max~.`),
  P(c`System.out.println(List.of(5, 3, 8, 1).stream().filter(n -> n > 2).map(n -> n * 2).sorted().toList());`, '[6, 10, 16]'),
  P(c`
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        System.out.println(IntStream.rangeClosed(1, 5).map(x -> x * x).sum());
    }
}`, '55'),
  P(c`
import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<String> words = List.of("java", "is", "fun");
        System.out.println(words.stream().map(String::toUpperCase).collect(Collectors.joining(", ", "[", "]")));
    }
}`, '[JAVA, IS, FUN]'),
  Q(c`~list.stream().filter(...).map(...)~ — with no terminal step. What runs?`, ['Everything', 'Only the filter', 'Nothing: streams are lazy until a terminal step', 'It does not compile'], 2),
  X({ q: c`Read whole numbers until the input ends. Using streams, print the **different even** numbers in order, then the sum of the squares of all the numbers:

~4 7 2 4 9~ → ~Evens: [2, 4]~ then ~Sum of squares: 166~`, start: c`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<Integer> nums = new ArrayList<>();
        while (in.hasNextInt()) {
            nums.add(in.nextInt());
        }
        System.out.println(nums);
    }
}
`, tests: [{ in: '4 7 2 4 9', out: 'Evens: [2, 4]\nSum of squares: 166' }, { in: '1 3', out: 'Evens: []\nSum of squares: 10' }], must: [[c`\.stream\(\)`, c`Use streams.`], [c`distinct\(\)`, c`Use ~distinct()~ to drop repeats.`]], sol: c`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<Integer> nums = new ArrayList<>();
        while (in.hasNextInt()) {
            nums.add(in.nextInt());
        }
        List<Integer> evens = nums.stream().filter(n -> n % 2 == 0).distinct().sorted().toList();
        int squares = nums.stream().mapToInt(n -> n * n).sum();
        System.out.println("Evens: " + evens);
        System.out.println("Sum of squares: " + squares);
    }
}
` }),
  X({ q: c`Read a line of words. With streams, print the longest word (the first one if there is a tie) and the average word length with two decimals:

~ferris loves rust~ → ~Longest: ferris~ then ~Average: 5.00~`, start: c`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<String> words = Arrays.asList(in.nextLine().trim().split("\\s+"));
        System.out.println(words);
    }
}
`, tests: [{ in: 'ferris loves rust', out: 'Longest: ferris\nAverage: 5.00' }, { in: 'a bb cc', out: 'Longest: bb\nAverage: 1.67' }], must: [[c`mapToInt`, c`Use ~mapToInt(String::length)~ for the average.`]], hint: c`~reduce((a, b) -> b.length() > a.length() ? b : a)~ keeps the first longest word; ~max~ with a Comparator would keep the last one on a tie.`, sol: c`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<String> words = Arrays.asList(in.nextLine().trim().split("\\s+"));
        String longest = words.stream().reduce((a, b) -> b.length() > a.length() ? b : a).orElse("");
        double avg = words.stream().mapToInt(String::length).average().orElse(0);
        System.out.println("Longest: " + longest);
        System.out.printf("Average: %.2f%n", avg);
    }
}
` }),
] },

{ id: 'collectors', title: 'Collectors', icon: '🧺', desc: 'Group, count and summarise like a database.',
  steps: [
  T('Summarising with Collectors', c`~collect(...)~ with the ~Collectors~ helpers turns a stream into maps and summaries — the sort of report that would take a page of loops.`, c`
import java.util.stream.*;

Map<String, List<Order>> byCustomer = orders.stream()
    .collect(Collectors.groupingBy(Order::customer));

Map<String, Long> countByCity = people.stream()
    .collect(Collectors.groupingBy(Person::city, Collectors.counting()));

Map<String, Double> totalByRegion = sales.stream()
    .collect(Collectors.groupingBy(Sale::region, TreeMap::new,          // TreeMap: keys sorted
                                   Collectors.summingDouble(Sale::amount)));

Map<Boolean, List<Integer>> passFail = scores.stream()
    .collect(Collectors.partitioningBy(s -> s >= 50));`),
  P(c`
import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Map<Integer, List<String>> byLength = Stream.of("hi", "yo", "sun", "sky", "a")
            .collect(Collectors.groupingBy(String::length, TreeMap::new, Collectors.toList()));
        System.out.println(byLength);
    }
}`, '{1=[a], 2=[hi, yo], 3=[sun, sky]}'),
  P(c`
import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Map<Boolean, List<Integer>> parts = Stream.of(1, 2, 3, 4).collect(Collectors.partitioningBy(n -> n % 2 == 0));
        System.out.println(parts);
    }
}`, '{false=[1, 3], true=[2, 4]}'),
  Q(c`You need a count per category, with the categories in alphabetical order. Which collector?`, [c`~Collectors.toList()~`, c`~Collectors.groupingBy(Item::category, TreeMap::new, Collectors.counting())~`, c`~Collectors.joining()~`, c`~Collectors.partitioningBy(...)~`], 1),
  X({ q: c`**Word frequency.** Read all the input, split it into words (lower case, letters only), and print each word with its count in alphabetical order, as ~word: n~. Use ~groupingBy~ and ~counting()~.`, start: c`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<String> words = new ArrayList<>();
        while (in.hasNext()) {
            words.add(in.next().toLowerCase().replaceAll("[^a-z]", ""));
        }
        System.out.println(words);
    }
}
`, tests: [{ in: 'The cat and the hat.\nThe END', out: 'and: 1\ncat: 1\nend: 1\nhat: 1\nthe: 3' }], must: [[c`groupingBy`, c`Use ~Collectors.groupingBy~.`], [c`counting\(\)`, c`Count with ~Collectors.counting()~.`]], sol: c`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<String> words = new ArrayList<>();
        while (in.hasNext()) {
            words.add(in.next().toLowerCase().replaceAll("[^a-z]", ""));
        }
        Map<String, Long> counts = words.stream()
            .filter(w -> !w.isEmpty())
            .collect(Collectors.groupingBy(w -> w, TreeMap::new, Collectors.counting()));
        counts.forEach((word, n) -> System.out.println(word + ": " + n));
    }
}
` }),
  X({ q: c`**Sales report.** Print each region's total sales, regions in alphabetical order, with two decimals, then the best region. Use ~groupingBy~ with ~summingDouble~.

~North: 350.00~ ~South: 90.50~ ~West: 410.00~ then ~Best: West~`, start: c`import java.util.*;
import java.util.stream.*;

class Sale {
    private final String region;
    private final double amount;
    Sale(String region, double amount) { this.region = region; this.amount = amount; }
    String getRegion() { return region; }
    double getAmount() { return amount; }
}

public class Main {
    public static void main(String[] args) {
        List<Sale> sales = List.of(new Sale("North", 200), new Sale("West", 410), new Sale("South", 90.5), new Sale("North", 150));
        System.out.println(sales.size());
    }
}
`, tests: [{ out: 'North: 350.00\nSouth: 90.50\nWest: 410.00\nBest: West' }], must: [[c`summingDouble`, c`Total with ~Collectors.summingDouble~.`]], sol: c`import java.util.*;
import java.util.stream.*;

class Sale {
    private final String region;
    private final double amount;
    Sale(String region, double amount) { this.region = region; this.amount = amount; }
    String getRegion() { return region; }
    double getAmount() { return amount; }
}

public class Main {
    public static void main(String[] args) {
        List<Sale> sales = List.of(new Sale("North", 200), new Sale("West", 410), new Sale("South", 90.5), new Sale("North", 150));
        Map<String, Double> totals = sales.stream()
            .collect(Collectors.groupingBy(Sale::getRegion, TreeMap::new, Collectors.summingDouble(Sale::getAmount)));
        totals.forEach((region, total) -> System.out.printf("%s: %.2f%n", region, total));
        String best = totals.entrySet().stream().max(Map.Entry.comparingByValue()).get().getKey();
        System.out.println("Best: " + best);
    }
}
` }),
] },

{ id: 'optional', title: 'Optional', icon: '🎁', desc: 'Say "there might be nothing" without null.',
  steps: [
  T('No more null surprises', c`Returning ~null~ for "not found" invites a ~NullPointerException~ somewhere far away. ~Optional<T>~ makes the "might be empty" part of the type, so callers have to deal with it.`, c`
Optional<String> found = names.stream().filter(n -> n.startsWith("Z")).findFirst();

found.isPresent()                       // true or false
found.orElse("nobody")                  // the value, or a default
found.map(String::toUpperCase)          // transform it if it is there
found.ifPresent(System.out::println)    // only runs if there is a value
found.orElseThrow()                     // the value, or NoSuchElementException

Optional.of("x")   Optional.empty()   Optional.ofNullable(maybeNull)`, c`Use Optional as a **return type**. Do not use it for fields or parameters.`),
  P(c`
Optional<String> name = Optional.of("ada");
Optional<String> none = Optional.empty();
System.out.println(name.map(String::toUpperCase).orElse("nobody") + " " + none.orElse("nobody"));`, 'ADA nobody'),
  P(c`System.out.println(List.of(3, 9, 4).stream().filter(n -> n > 10).findFirst());`, 'Optional.empty'),
  Q(c`What is wrong with calling ~opt.get()~ straight away?`, ['Nothing', 'If the Optional is empty it throws, which is the same trap as null', 'It is slower than orElse', 'get() does not exist'], 1),
  X({ q: c`Write ~static Optional<String> findEmail(Map<String, String> emails, String name)~. ~main~ reads names and prints each email's **domain** (the part after ~@~) using ~map~, or ~no email~.

~ada~ → ~example.com~ · ~zed~ → ~no email~`, start: c`import java.util.*;

public class Main {
    // write findEmail here

    public static void main(String[] args) {
        Map<String, String> emails = Map.of("ada", "ada@example.com", "bo", "bo@test.org");
        Scanner in = new Scanner(System.in);
        while (in.hasNext()) {
            String name = in.next();
            System.out.println(name);
        }
    }
}
`, tests: [{ in: 'ada zed bo', out: 'example.com\nno email\ntest.org' }], must: [[c`Optional<String>\s+findEmail`, c`~static Optional<String> findEmail(...)~`], [c`\.map\(`, c`Get the domain with ~.map(...)~.`], [c`orElse`, c`Use ~orElse("no email")~.`]], sol: c`import java.util.*;

public class Main {
    static Optional<String> findEmail(Map<String, String> emails, String name) {
        return Optional.ofNullable(emails.get(name));
    }

    public static void main(String[] args) {
        Map<String, String> emails = Map.of("ada", "ada@example.com", "bo", "bo@test.org");
        Scanner in = new Scanner(System.in);
        while (in.hasNext()) {
            String name = in.next();
            System.out.println(findEmail(emails, name).map(e -> e.substring(e.indexOf('@') + 1)).orElse("no email"));
        }
    }
}
` }),
] },
],
quiz: [
  P(c`System.out.println(List.of(1, 2, 3, 4).stream().map(n -> n * n).filter(n -> n > 4).toList());`, '[9, 16]'),
  P(c`System.out.println(List.of("b", "a", "c").stream().sorted().findFirst().orElse("none"));`, 'a'),
  Q(c`Which terminal step gives one combined value from all the elements, like a total?`, [c`~map~`, c`~filter~`, c`~reduce~`, c`~sorted~`], 2),
  Q(c`A method looks up a user who might not exist. What should it return?`, [c`~null~ when missing`, c`~Optional<User>~`, 'An empty User object', 'It should throw every time'], 1),
] });

/* ============ ADVANCED 3: DATA STRUCTURES ============ */
topic({ id: 'adv-structures', advanced: true, title: 'Data Structures', icon: '🏗️', color: '#ce82ff', blurb: 'Stacks, queues, priority queues and sorted maps — the right tool every time.',
lessons: [
{ id: 'deque', title: 'Stacks & queues', icon: '🥞', desc: 'ArrayDeque: last-in-first-out and first-in-first-out.',
  steps: [
  T('ArrayDeque', c`A **stack** gives back the **last** thing you put in (undo history, brackets, recursion). A **queue** gives back the **first** (print jobs, customers, messages). ~ArrayDeque~ does both quickly.`, c`
Deque<String> stack = new ArrayDeque<>();
stack.push("a");  stack.push("b");
stack.pop();      // "b"   last in, first out
stack.peek();     // "a"   look without removing

Queue<String> queue = new ArrayDeque<>();
queue.offer("first");  queue.offer("second");
queue.poll();     // "first"   first in, first out`, c`Old code uses ~Stack~ and ~Vector~. They still work, but they are slower legacy classes: prefer ~ArrayDeque~.`),
  P(c`
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
stack.push(3);
System.out.println(stack.pop() + " " + stack.peek() + " " + stack);`, '3 2 [2, 1]'),
  P(c`
Queue<String> q = new ArrayDeque<>(List.of("ann", "bo"));
q.offer("cy");
q.poll();
System.out.println(q + " " + q.peek());`, '[bo, cy] bo'),
  Q('Which structure fits an "undo" button?', ['A queue', 'A stack', 'A TreeMap', 'A HashSet'], 1),
  X({ q: c`**Bracket checker.** For each line, print ~balanced~ if every ~( [ {~ is closed by the matching bracket in the right order, otherwise ~not balanced~. Use an ~ArrayDeque~ as a stack.`, start: c`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.hasNextLine()) {
            String line = in.nextLine();
            System.out.println(line);
        }
    }
}
`, tests: [{ in: '(a[b]{c})\n([)]\n((\n{x}(y)\n', out: 'balanced\nnot balanced\nnot balanced\nbalanced' }], must: [[c`ArrayDeque`, c`Use an ~ArrayDeque~.`]], hint: c`Push each opening bracket. On a closing bracket, the stack must not be empty and ~pop()~ must give its partner. At the end, the stack must be empty.`, sol: c`import java.util.*;

public class Main {
    static boolean balanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if ("([{".indexOf(c) >= 0) {
                stack.push(c);
            } else if (")]}".indexOf(c) >= 0) {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if ("([{".indexOf(open) != ")]}".indexOf(c)) return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.hasNextLine()) {
            String line = in.nextLine();
            System.out.println(balanced(line) ? "balanced" : "not balanced");
        }
    }
}
` }),
] },

{ id: 'priority', title: 'Priority queues', icon: '🚑', desc: 'Always serve the most urgent item next.',
  steps: [
  T('PriorityQueue', c`A ~PriorityQueue~ always gives back its **smallest** item, by natural order or by a Comparator you supply. Adding and removing are fast (~O(log n)~). Schedulers, A&E triage, route-finding and "top 10" lists all use one.`, c`
PriorityQueue<Integer> pq = new PriorityQueue<>(List.of(5, 1, 8));
pq.poll();        // 1

PriorityQueue<Integer> max = new PriorityQueue<>(Comparator.reverseOrder());

PriorityQueue<Task> tasks = new PriorityQueue<>(
    Comparator.comparingInt(Task::priority).thenComparingInt(Task::order));`, c`Printing a PriorityQueue shows its internal order, **not** sorted order. Only ~poll()~ promises the smallest.`),
  P(c`
PriorityQueue<Integer> pq = new PriorityQueue<>(List.of(5, 1, 8, 3));
System.out.println(pq.poll() + " " + pq.poll());`, '1 3'),
  P(c`
PriorityQueue<String> pq = new PriorityQueue<>(Comparator.comparing(String::length).reversed());
pq.addAll(List.of("fig", "banana", "kiwi"));
System.out.println(pq.poll());`, 'banana'),
  Q(c`You add 7, 2 and 9 to a ~PriorityQueue<Integer>~. What does ~poll()~ return?`, ['7', '2', '9', 'It depends on the order they were added'], 1),
  X({ q: c`**A&E triage.** Read patients as ~priority name~ (1 is most urgent) until the input ends, then print the names in the order they will be seen. Equal priorities are seen in arrival order. Use a ~PriorityQueue~.`, start: c`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.hasNextInt()) {
            int priority = in.nextInt();
            String name = in.next();
            System.out.println(priority + " " + name);
        }
    }
}
`, tests: [{ in: '3 Ada\n1 Bo\n2 Cy\n1 Di\n3 Ed\n', out: 'Bo\nDi\nCy\nAda\nEd' }], must: [[c`PriorityQueue`, c`Use a ~PriorityQueue~.`]], hint: c`Store an arrival number with each patient (a small class or an ~int[]~), and compare by priority, then arrival.`, sol: c`import java.util.*;

public class Main {
    static class Patient {
        final int priority, arrival;
        final String name;
        Patient(int priority, int arrival, String name) { this.priority = priority; this.arrival = arrival; this.name = name; }
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        PriorityQueue<Patient> queue = new PriorityQueue<>(
            Comparator.comparingInt((Patient p) -> p.priority).thenComparingInt(p -> p.arrival));
        int arrival = 0;
        while (in.hasNextInt()) {
            int priority = in.nextInt();
            String name = in.next();
            queue.offer(new Patient(priority, arrival++, name));
        }
        while (!queue.isEmpty()) {
            System.out.println(queue.poll().name);
        }
    }
}
` }),
] },

{ id: 'treemap', title: 'Sorted maps & sets', icon: '🌳', desc: 'TreeMap and TreeSet: sorted keys and "nearest" lookups.',
  steps: [
  T('TreeMap and TreeSet', c`~TreeMap~ and ~TreeSet~ keep their keys **sorted** at all times, and can find the **nearest** key — something a HashMap cannot do.`, c`
TreeMap<Integer, String> bands = new TreeMap<>();
bands.put(0, "F"); bands.put(50, "D"); bands.put(70, "B");

bands.floorKey(65)        // 50: the largest key <= 65
bands.ceilingKey(65)      // 70: the smallest key >= 65
bands.firstKey()          // 0
bands.headMap(50)         // everything below 50
bands.floorEntry(65).getValue()   // "D"

TreeSet<String> tags = new TreeSet<>(List.of("java", "api", "web"));
tags.first();   tags.higher("b");   tags.descendingSet();`),
  P(c`
TreeMap<Integer, String> grades = new TreeMap<>(Map.of(90, "A", 80, "B", 70, "C", 0, "F"));
System.out.println(grades.floorEntry(85).getValue() + grades.floorEntry(70).getValue() + grades.floorEntry(12).getValue());`, 'BCF'),
  P(c`
TreeSet<String> s = new TreeSet<>(List.of("pear", "apple", "fig", "apple"));
System.out.println(s + " " + s.first() + " " + s.ceiling("b"));`, '[apple, fig, pear] apple fig'),
  Q(c`You need to find "the next train at or after 14:05" quickly. Which method of a ~TreeMap<LocalTime, Train>~?`, [c`~get~`, c`~floorKey~`, c`~ceilingKey~`, c`~firstKey~`], 2),
  X({ q: c`**Room bookings.** Commands, one per line:

~book <hour> <name>~ books that hour (or prints ~<hour> is taken~) · ~next <hour>~ prints the first booking at or after that hour as ~<hour> <name>~, or ~none~ · ~list~ prints every booking in time order on one line as ~9 Ada, 11 Bo~.`, start: c`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.hasNext()) {
            String cmd = in.next();
            System.out.println(cmd);
        }
    }
}
`, tests: [{ in: 'book 11 Bo\nbook 9 Ada\nbook 11 Cy\nnext 10\nnext 12\nlist\n', out: '11 is taken\n11 Bo\nnone\n9 Ada, 11 Bo' }], must: [[c`TreeMap`, c`Use a ~TreeMap~.`], [c`ceiling(Key|Entry)`, c`Find the next booking with ~ceilingEntry~ (or ~ceilingKey~).`]], sol: c`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        TreeMap<Integer, String> bookings = new TreeMap<>();
        while (in.hasNext()) {
            String cmd = in.next();
            if (cmd.equals("book")) {
                int hour = in.nextInt();
                String name = in.next();
                if (bookings.containsKey(hour)) {
                    System.out.println(hour + " is taken");
                } else {
                    bookings.put(hour, name);
                }
            } else if (cmd.equals("next")) {
                Map.Entry<Integer, String> e = bookings.ceilingEntry(in.nextInt());
                System.out.println(e == null ? "none" : e.getKey() + " " + e.getValue());
            } else if (cmd.equals("list")) {
                List<String> parts = new ArrayList<>();
                bookings.forEach((h, n) -> parts.add(h + " " + n));
                System.out.println(String.join(", ", parts));
            }
        }
    }
}
` }),
] },
],
quiz: [
  P(c`
Deque<String> d = new ArrayDeque<>();
d.offerLast("a");
d.offerFirst("b");
d.offerLast("c");
System.out.println(d.pollFirst() + d.pollLast());`, 'bc'),
  Q(c`Why prefer ~ArrayDeque~ over the old ~Stack~ class?`, ['Stack cannot hold objects', 'Stack is a slower, synchronised legacy class; ArrayDeque is the modern choice', 'ArrayDeque sorts its items', 'There is no difference'], 1),
  P(c`
TreeMap<String, Integer> m = new TreeMap<>(Map.of("b", 2, "a", 1, "c", 3));
System.out.println(m.firstKey() + m.lastKey() + m.headMap("c"));`, 'ac{a=1, b=2}'),
  F('Get the smallest item from the priority queue.', c`
PriorityQueue<Integer> pq = new PriorityQueue<>(List.of(4, 1, 3));
System.out.println(pq.[[poll]]());`),
] });

/* ============ ADVANCED 4: MODERN JAVA ============ */
topic({ id: 'adv-modern', advanced: true, title: 'Modern Java', icon: '✨', color: '#00cd9c', blurb: 'Records, sealed types, pattern matching — and equals/hashCode done right.',
lessons: [
{ id: 'records', title: 'Records', icon: '📇', desc: 'Data classes in one line.',
  steps: [
  T('record', c`Most classes just carry data, and writing the constructor, getters, ~equals~, ~hashCode~ and ~toString~ by hand is tedious and error-prone. A **record** (Java 16+) writes all of it from one line. Records are **immutable**: their fields are final.`, c`
record Point(int x, int y) {}

Point p = new Point(3, 4);
p.x();                      // 3  (accessors have no "get")
p.equals(new Point(3, 4));  // true
System.out.println(p);      // Point[x=3, y=4]`),
  T('Adding rules and methods', c`A **compact constructor** checks the values; you can also add methods and static factories.`, c`
record Temperature(double celsius) {
    Temperature {                                   // compact constructor
        if (celsius < -273.15) throw new IllegalArgumentException("below absolute zero");
    }
    double fahrenheit() { return celsius * 9 / 5 + 32; }
    static Temperature freezing() { return new Temperature(0); }
}`),
  P(c`
record Point(int x, int y) {}
System.out.println(new Point(1, 2) + " " + new Point(1, 2).equals(new Point(1, 2)) + " " + new Point(3, 4).x());`, 'Point[x=1, y=2] true 3'),
  Q(c`What can you NOT do with a record?`, ['Add methods', 'Validate values in a compact constructor', 'Change a field after the object is made', 'Implement an interface'], 2),
  X({ q: c`Write ~record Money(String currency, long pence)~. The compact constructor rejects negative amounts (~IllegalArgumentException("negative amount")~). Add ~plus(Money other)~, which refuses different currencies (~IllegalArgumentException("currency mismatch")~), and override ~toString()~ to show ~GBP 12.05~.`, start: c`// write record Money here

public class Main {
    public static void main(String[] args) {
        Money a = new Money("GBP", 1000);
        Money b = new Money("GBP", 205);
        System.out.println(a.plus(b));
        System.out.println(a.equals(new Money("GBP", 1000)));
        try {
            a.plus(new Money("EUR", 1));
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
        try {
            new Money("GBP", -5);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
`, tests: [{ out: 'GBP 12.05\ntrue\nError: currency mismatch\nError: negative amount' }], must: [[c`record\s+Money\s*\(\s*String\s+currency\s*,\s*long\s+pence\s*\)`, c`~record Money(String currency, long pence)~`]], sol: c`record Money(String currency, long pence) {
    Money {
        if (pence < 0) throw new IllegalArgumentException("negative amount");
    }

    Money plus(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException("currency mismatch");
        return new Money(currency, pence + other.pence);
    }

    @Override
    public String toString() {
        return String.format("%s %d.%02d", currency, pence / 100, pence % 100);
    }
}

public class Main {
    public static void main(String[] args) {
        Money a = new Money("GBP", 1000);
        Money b = new Money("GBP", 205);
        System.out.println(a.plus(b));
        System.out.println(a.equals(new Money("GBP", 1000)));
        try {
            a.plus(new Money("EUR", 1));
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
        try {
            new Money("GBP", -5);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
` }),
] },

{ id: 'sealed', title: 'Sealed types & pattern matching', icon: '🧩', desc: 'Switch on the shape of your data, with the compiler checking every case.',
  steps: [
  T('Pattern matching', c`~instanceof~ can test a type **and** give you a typed variable in one go. ~switch~ can do the same for several types, and even take records apart.`, c`
if (obj instanceof String s && !s.isEmpty()) {
    System.out.println(s.length());          // s is already a String
}

String describe(Object o) {
    return switch (o) {
        case Integer i when i > 100 -> "big number";
        case Integer i              -> "number " + i;
        case String s               -> "text of length " + s.length();
        default                     -> "something else";
    };
}`),
  T('Sealed hierarchies', c`~sealed~ lists **every** type allowed to implement an interface. Then a ~switch~ over it needs no ~default~, and if someone adds a new shape later, every switch that forgot it **stops compiling**. Records + sealed interfaces are how modern Java models "one of these kinds of thing".`, c`
sealed interface Shape permits Circle, Square, Rect {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}
record Rect(double w, double h) implements Shape {}

static double area(Shape s) {
    return switch (s) {
        case Circle c -> Math.PI * c.r() * c.r();
        case Square sq -> sq.side() * sq.side();
        case Rect(double w, double h) -> w * h;      // a record pattern: takes it apart
    };
}`),
  P(c`
sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}

public class Main {
    static String describe(Shape s) {
        return switch (s) {
            case Circle c -> "circle r=" + c.r();
            case Square(double side) -> "square " + side + "x" + side;
        };
    }

    public static void main(String[] args) {
        System.out.println(describe(new Circle(2)) + " / " + describe(new Square(3)));
    }
}`, 'circle r=2.0 / square 3.0x3.0'),
  P(c`
Object[] things = {42, "hi", 3.5};
for (Object o : things) {
    String d = switch (o) {
        case Integer i when i > 10 -> "big int";
        case Integer i -> "int";
        case String s -> "string " + s.length();
        default -> "other";
    };
    System.out.println(d);
}`, 'big int\nstring 2\nother'),
  Q(c`Why does a ~switch~ over a sealed interface not need a ~default~ case?`, ['Defaults are banned in modern Java', 'The compiler knows every permitted type, so it can check you covered them all', 'It always picks the first case', 'It does need one'], 1),
  X({ q: c`**Expression trees.** Given ~sealed interface Expr permits Num, Add, Mul~ (all records), write ~static int eval(Expr e)~ and ~static String show(Expr e)~ using ~switch~ with record patterns.

Expected: ~(2 + (3 * 4)) = 14~`, start: c`sealed interface Expr permits Num, Add, Mul {}
record Num(int value) implements Expr {}
record Add(Expr left, Expr right) implements Expr {}
record Mul(Expr left, Expr right) implements Expr {}

public class Main {
    // write eval and show here

    public static void main(String[] args) {
        Expr e = new Add(new Num(2), new Mul(new Num(3), new Num(4)));
        System.out.println(show(e) + " = " + eval(e));
    }
}
`, tests: [{ out: '(2 + (3 * 4)) = 14' }], must: [[c`switch\s*\(`, c`Use ~switch~.`], [c`case\s+(Add|Mul)\s*\(`, c`Take records apart with record patterns: ~case Add(Expr l, Expr r) ->~`]], sol: c`sealed interface Expr permits Num, Add, Mul {}
record Num(int value) implements Expr {}
record Add(Expr left, Expr right) implements Expr {}
record Mul(Expr left, Expr right) implements Expr {}

public class Main {
    static int eval(Expr e) {
        return switch (e) {
            case Num(int v) -> v;
            case Add(Expr l, Expr r) -> eval(l) + eval(r);
            case Mul(Expr l, Expr r) -> eval(l) * eval(r);
        };
    }

    static String show(Expr e) {
        return switch (e) {
            case Num(int v) -> String.valueOf(v);
            case Add(Expr l, Expr r) -> "(" + show(l) + " + " + show(r) + ")";
            case Mul(Expr l, Expr r) -> "(" + show(l) + " * " + show(r) + ")";
        };
    }

    public static void main(String[] args) {
        Expr e = new Add(new Num(2), new Mul(new Num(3), new Num(4)));
        System.out.println(show(e) + " = " + eval(e));
    }
}
` }),
] },

{ id: 'equality', title: 'equals, hashCode & immutability', icon: '⚖️', desc: 'Why HashSet "loses" your objects, and how to fix it.',
  steps: [
  T('== vs equals', c`~==~ asks "is this the **same object**?". ~equals~ asks "do they have the **same value**?". For your own classes, ~equals~ only does the second job if you override it.`, c`
String a = new String("hi"), b = new String("hi");
a == b          // false: two different objects
a.equals(b)     // true: same text`),
  T('The contract', c`~HashMap~ and ~HashSet~ first use ~hashCode()~ to find the right bucket, then ~equals()~ to check. So the rule is: **override both or neither**, and equal objects must have equal hash codes. ~Objects.hash(...)~ and ~Objects.equals(...)~ make it easy. (Records do all this for you.)`, c`
@Override
public boolean equals(Object o) {
    return o instanceof Card c && suit.equals(c.suit) && rank == c.rank;
}

@Override
public int hashCode() {
    return Objects.hash(suit, rank);
}`, c`**Immutable** objects (all fields ~final~, no setters, copies of any lists they are given) are safe to use as keys and safe to share between threads — the multithreading topics come back to this.`),
  P(c`
String a = new String("hi");
String b = new String("hi");
System.out.println((a == b) + " " + a.equals(b));`, 'false true'),
  P(c`
import java.util.*;

class Tag {
    final String name;
    Tag(String name) { this.name = name; }
}

record Label(String name) {}

public class Main {
    public static void main(String[] args) {
        Set<Tag> tags = new HashSet<>(List.of(new Tag("java"), new Tag("java")));
        Set<Label> labels = new HashSet<>(List.of(new Label("java"), new Label("java")));
        System.out.println(tags.size() + " " + labels.size());
    }
}`, '2 1', c`~Tag~ has no ~equals~/~hashCode~, so two ~Tag("java")~ objects count as different. The record gets both for free.`),
  Q(c`You override ~equals~ but not ~hashCode~. What goes wrong?`, ['Nothing', 'Equal objects can land in different HashSet buckets, so duplicates slip in and lookups fail', 'The code does not compile', 'toString stops working'], 1),
  X({ q: c`~Card~ objects with the same suit and rank should count as the same card. Add ~equals~ and ~hashCode~ (use ~Objects.hash~), so the program prints:

~2~
~true~`, start: c`import java.util.*;

class Card {
    private final String suit;
    private final int rank;

    Card(String suit, int rank) {
        this.suit = suit;
        this.rank = rank;
    }

    // add equals and hashCode here
}

public class Main {
    public static void main(String[] args) {
        Set<Card> hand = new HashSet<>();
        hand.add(new Card("hearts", 12));
        hand.add(new Card("spades", 1));
        hand.add(new Card("hearts", 12));
        System.out.println(hand.size());
        System.out.println(hand.contains(new Card("spades", 1)));
    }
}
`, tests: [{ out: '2\ntrue' }], must: [[c`boolean\s+equals\s*\(\s*Object`, c`Override ~public boolean equals(Object o)~.`], [c`int\s+hashCode\s*\(\s*\)`, c`Override ~public int hashCode()~.`]], sol: c`import java.util.*;

class Card {
    private final String suit;
    private final int rank;

    Card(String suit, int rank) {
        this.suit = suit;
        this.rank = rank;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Card c && suit.equals(c.suit) && rank == c.rank;
    }

    @Override
    public int hashCode() {
        return Objects.hash(suit, rank);
    }
}

public class Main {
    public static void main(String[] args) {
        Set<Card> hand = new HashSet<>();
        hand.add(new Card("hearts", 12));
        hand.add(new Card("spades", 1));
        hand.add(new Card("hearts", 12));
        System.out.println(hand.size());
        System.out.println(hand.contains(new Card("spades", 1)));
    }
}
` }),
] },
],
quiz: [
  P(c`
record Pair(String a, int b) {}
Pair p = new Pair("x", 1);
System.out.println(p.a() + p.b() + " " + p);`, 'x1 Pair[a=x, b=1]'),
  Q(c`Which keyword lists exactly which classes may implement an interface?`, [c`~final~`, c`~sealed ... permits~`, c`~private~`, c`~static~`], 1),
  Q(c`Two objects are ~equals~. What must be true of their ~hashCode()~?`, ['Nothing', 'They must be equal', 'They must be different', 'They must both be 0'], 1),
  F('Test the type and get a typed variable in one step.', c`
Object o = "hello";
if (o [[instanceof]] String s) {
    System.out.println(s.length());
}`),
] });

/* ============ ADVANCED 5: ROBUST CODE ============ */
topic({ id: 'adv-robust', advanced: true, title: 'Robust Code', icon: '🛡️', color: '#ff9600', blurb: 'Custom exceptions, try-with-resources and classic design patterns.',
lessons: [
{ id: 'exceptions', title: 'Exceptions, properly', icon: '🚨', desc: 'Checked vs unchecked, your own exception types, and causes.',
  steps: [
  T('Checked or unchecked?', c`**Checked** exceptions (extend ~Exception~) must be caught or declared with ~throws~: use them for failures a caller can reasonably recover from, like a missing file or a declined payment. **Unchecked** exceptions (extend ~RuntimeException~) signal bugs or bad arguments: ~IllegalArgumentException~, ~NullPointerException~.`, c`
class InsufficientFundsException extends Exception {      // checked
    private final double shortfall;
    InsufficientFundsException(double shortfall) {
        super(String.format("short by %.2f", shortfall));
        this.shortfall = shortfall;
    }
    double getShortfall() { return shortfall; }
}

void withdraw(double amount) throws InsufficientFundsException { ... }`),
  T('Multi-catch, finally and causes', c`Catch several types in one block with ~|~. ~finally~ always runs. When you translate a low-level error into your own, pass the original as the **cause** so the full story stays in the stack trace.`, c`
try {
    int port = Integer.parseInt(text);
} catch (NumberFormatException e) {
    throw new ConfigException("bad port: " + text, e);    // e becomes getCause()
} finally {
    System.out.println("checked config");
}`),
  P(c`
try {
    throw new IllegalStateException("x");
} catch (IllegalArgumentException | IllegalStateException e) {
    System.out.println(e.getClass().getSimpleName());
} finally {
    System.out.println("done");
}`, 'IllegalStateException\ndone'),
  Q(c`A payment can be declined, and the caller should decide what to do. Checked or unchecked exception?`, ['Unchecked: callers should not be forced to think about it', 'Checked: the compiler then makes callers handle or declare it', 'Neither: return null', 'Use System.exit'], 1),
  X({ q: c`Write a **checked** ~InsufficientFundsException~ whose message is ~short by 30.00~ (from the shortfall). ~Account.withdraw~ must throw it when the amount is more than the balance.

Expected:
~Declined: short by 30.00~
~Balance: 20.00~
~Balance: 5.00~`, start: c`// write InsufficientFundsException here

class Account {
    private double balance;
    Account(double balance) { this.balance = balance; }
    double getBalance() { return balance; }

    void withdraw(double amount) {
        balance -= amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Account acc = new Account(20);
        for (double amount : new double[] {50, 15}) {
            try {
                acc.withdraw(amount);
            } catch (InsufficientFundsException e) {
                System.out.println("Declined: " + e.getMessage());
            }
            System.out.printf("Balance: %.2f%n", acc.getBalance());
        }
    }
}
`, tests: [{ out: 'Declined: short by 30.00\nBalance: 20.00\nBalance: 5.00' }], must: [[c`class\s+InsufficientFundsException\s+extends\s+Exception`, c`Make it checked: ~extends Exception~.`], [c`throws\s+InsufficientFundsException`, c`Declare it: ~void withdraw(double amount) throws InsufficientFundsException~.`]], sol: c`class InsufficientFundsException extends Exception {
    InsufficientFundsException(double shortfall) {
        super(String.format("short by %.2f", shortfall));
    }
}

class Account {
    private double balance;
    Account(double balance) { this.balance = balance; }
    double getBalance() { return balance; }

    void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(amount - balance);
        }
        balance -= amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Account acc = new Account(20);
        for (double amount : new double[] {50, 15}) {
            try {
                acc.withdraw(amount);
            } catch (InsufficientFundsException e) {
                System.out.println("Declined: " + e.getMessage());
            }
            System.out.printf("Balance: %.2f%n", acc.getBalance());
        }
    }
}
` }),
  X({ q: c`~parsePort~ should turn a ~NumberFormatException~ into a ~ConfigException~ with the message ~bad port: abc~, passing the original exception as the **cause**.

Expected: ~8080~ then ~bad port: abc (caused by NumberFormatException)~`, start: c`class ConfigException extends RuntimeException {
    ConfigException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class Main {
    static int parsePort(String text) {
        return Integer.parseInt(text);
    }

    public static void main(String[] args) {
        System.out.println(parsePort("8080"));
        try {
            parsePort("abc");
        } catch (ConfigException e) {
            System.out.println(e.getMessage() + " (caused by " + e.getCause().getClass().getSimpleName() + ")");
        }
    }
}
`, tests: [{ out: '8080\nbad port: abc (caused by NumberFormatException)' }], must: [[c`throw\s+new\s+ConfigException\s*\([^;]*,\s*\w+\s*\)`, c`~throw new ConfigException("bad port: " + text, e);~`]], sol: c`class ConfigException extends RuntimeException {
    ConfigException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class Main {
    static int parsePort(String text) {
        try {
            return Integer.parseInt(text);
        } catch (NumberFormatException e) {
            throw new ConfigException("bad port: " + text, e);
        }
    }

    public static void main(String[] args) {
        System.out.println(parsePort("8080"));
        try {
            parsePort("abc");
        } catch (ConfigException e) {
            System.out.println(e.getMessage() + " (caused by " + e.getCause().getClass().getSimpleName() + ")");
        }
    }
}
` }),
] },

{ id: 'resources', title: 'try-with-resources', icon: '🔌', desc: 'Files, connections and locks that always get closed.',
  steps: [
  T('Always close what you open', c`Files, database connections and network sockets must be closed, even when something goes wrong — otherwise the program leaks them until it falls over. **try-with-resources** closes anything that implements ~AutoCloseable~, automatically, in **reverse** order of opening.`, c`
try (BufferedReader reader = Files.newBufferedReader(path);
     PrintWriter out = new PrintWriter("report.txt")) {
    ...
}   // out.close(), then reader.close() — even after an exception`, c`Before Java 7 this needed a ~finally~ block with its own ~try~/~catch~ inside. You will still see that in older code.`),
  P(c`
class Res implements AutoCloseable {
    private final String name;
    Res(String name) { this.name = name; System.out.println("open " + name); }
    public void close() { System.out.println("close " + name); }
}

public class Main {
    public static void main(String[] args) {
        try (Res a = new Res("A"); Res b = new Res("B")) {
            System.out.println("using");
        }
    }
}`, 'open A\nopen B\nusing\nclose B\nclose A'),
  Q(c`An exception is thrown inside a try-with-resources block. When is the resource closed?`, ['Never', 'Only if the exception is caught', 'Before the exception leaves the block, every time', 'When the program ends'], 2),
  X({ q: c`Make ~Connection~ implement ~AutoCloseable~ (its ~close()~ prints ~disconnect db~), and use it with **try-with-resources** in ~main~. The second query fails, but the connection must still be closed before the error is reported.

Expected:
~connect db~ ~query: users~ ~disconnect db~ ~connect db~ ~disconnect db~ ~Error: no such table: orderz~`, start: c`class Connection {
    Connection(String name) { System.out.println("connect " + name); }

    void query(String table) {
        if (!table.equals("users")) throw new IllegalStateException("no such table: " + table);
        System.out.println("query: " + table);
    }
}

public class Main {
    static void run(String table) {
        Connection c = new Connection("db");
        c.query(table);
    }

    public static void main(String[] args) {
        try {
            run("users");
            run("orderz");
        } catch (IllegalStateException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
`, tests: [{ out: 'connect db\nquery: users\ndisconnect db\nconnect db\ndisconnect db\nError: no such table: orderz' }], must: [[c`implements\s+AutoCloseable`, c`~class Connection implements AutoCloseable~`], [c`try\s*\(\s*Connection`, c`Open it with ~try (Connection c = new Connection("db")) { ... }~`]], sol: c`class Connection implements AutoCloseable {
    Connection(String name) { System.out.println("connect " + name); }

    void query(String table) {
        if (!table.equals("users")) throw new IllegalStateException("no such table: " + table);
        System.out.println("query: " + table);
    }

    @Override
    public void close() {
        System.out.println("disconnect db");
    }
}

public class Main {
    static void run(String table) {
        try (Connection c = new Connection("db")) {
            c.query(table);
        }
    }

    public static void main(String[] args) {
        try {
            run("users");
            run("orderz");
        } catch (IllegalStateException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
` }),
] },

{ id: 'patterns', title: 'Design patterns', icon: '🧭', desc: 'Builder and Strategy: two patterns you will meet in every codebase.',
  steps: [
  T('Builder', c`A constructor with eight parameters is unreadable: ~new Pizza("large", true, false, "ham", null, 2, ...)~. A **builder** sets each option by name, then builds the finished (usually immutable) object. You will see it all over Java libraries.`, c`
Pizza p = new Pizza.Builder("large")
              .topping("ham")
              .topping("olives")
              .extraCheese()
              .build();`, c`Each builder method returns ~this~, which is what lets the calls chain.`),
  T('Strategy', c`**Strategy** swaps an algorithm by passing in an object that does the job a particular way. With lambdas, a strategy is often just a function.`, c`
interface Shipping { double cost(double weightKg); }

Shipping standard = w -> 3.99;
Shipping express  = w -> 6.99 + w * 0.5;

order.total(express);     // same Order code, different behaviour`),
  P(c`
import java.util.*;
import java.util.function.*;

public class Main {
    public static void main(String[] args) {
        Map<String, DoubleUnaryOperator> discounts = new LinkedHashMap<>();
        discounts.put("none", p -> p);
        discounts.put("student", p -> p * 0.9);
        discounts.put("staff", p -> p - 5);
        discounts.forEach((name, rule) -> System.out.printf("%s %.2f%n", name, rule.applyAsDouble(50)));
    }
}`, 'none 50.00\nstudent 45.00\nstaff 45.00'),
  Q('Which problem does the Builder pattern solve?', ['Sharing one object between threads', 'Constructors with many (often optional) parameters that are hard to read', 'Sorting objects', 'Closing resources'], 1),
  X({ q: c`Write ~Pizza.Builder~: the constructor takes the size; ~topping(String)~ adds a topping, ~extraCheese()~ turns extra cheese on, and ~build()~ returns the ~Pizza~. Each setter returns the builder so the calls chain.

Expected:
~Large pizza with ham, olives + extra cheese~
~Small pizza with nothing~`, start: c`import java.util.*;

class Pizza {
    private final String size;
    private final List<String> toppings;
    private final boolean extraCheese;

    private Pizza(Builder b) {
        this.size = b.size;
        this.toppings = List.copyOf(b.toppings);
        this.extraCheese = b.extraCheese;
    }

    @Override
    public String toString() {
        return size + " pizza with " + (toppings.isEmpty() ? "nothing" : String.join(", ", toppings))
            + (extraCheese ? " + extra cheese" : "");
    }

    static class Builder {
        // write the builder here
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Pizza.Builder("Large").topping("ham").topping("olives").extraCheese().build());
        System.out.println(new Pizza.Builder("Small").build());
    }
}
`, tests: [{ out: 'Large pizza with ham, olives + extra cheese\nSmall pizza with nothing' }], must: [[c`Builder\s+topping\s*\(\s*String`, c`~Builder topping(String t)~ returns the builder.`], [c`return\s+this\s*;`, c`Setters end with ~return this;~`]], sol: c`import java.util.*;

class Pizza {
    private final String size;
    private final List<String> toppings;
    private final boolean extraCheese;

    private Pizza(Builder b) {
        this.size = b.size;
        this.toppings = List.copyOf(b.toppings);
        this.extraCheese = b.extraCheese;
    }

    @Override
    public String toString() {
        return size + " pizza with " + (toppings.isEmpty() ? "nothing" : String.join(", ", toppings))
            + (extraCheese ? " + extra cheese" : "");
    }

    static class Builder {
        private final String size;
        private final List<String> toppings = new ArrayList<>();
        private boolean extraCheese;

        Builder(String size) {
            this.size = size;
        }

        Builder topping(String t) {
            toppings.add(t);
            return this;
        }

        Builder extraCheese() {
            extraCheese = true;
            return this;
        }

        Pizza build() {
            return new Pizza(this);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Pizza.Builder("Large").topping("ham").topping("olives").extraCheese().build());
        System.out.println(new Pizza.Builder("Small").build());
    }
}
` }),
] },
],
quiz: [
  Q(c`Which one is a **checked** exception?`, [c`~NullPointerException~`, c`~IllegalArgumentException~`, c`~IOException~`, c`~ArithmeticException~`], 2),
  P(c`
try {
    System.out.println("a");
    throw new RuntimeException("b");
} catch (RuntimeException e) {
    System.out.println(e.getMessage());
} finally {
    System.out.println("c");
}`, 'a\nb\nc'),
  Q(c`What must a class implement to be used in try-with-resources?`, [c`~Closeable~ or ~AutoCloseable~`, c`~Runnable~`, c`~Serializable~`, c`~Comparable~`], 0),
  F('Pass the original exception on as the cause.', c`
try {
    Integer.parseInt("x");
} catch (NumberFormatException e) {
    RuntimeException wrapped = new RuntimeException("bad input", [[e]]);
    System.out.println(wrapped.getCause().getClass().getSimpleName());
}`),
] });
