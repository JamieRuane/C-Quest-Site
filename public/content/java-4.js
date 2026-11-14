/* ================= Java, Part 2: Advanced (topics A6-A9): Multithreading and capstones =================
   The multithreading topics follow two sets of course slides, cited in the lessons as:
     "the Deitel slides"  — Java How to Program, 11/e, Chapter 23 "Concurrency" (section and figure numbers, and
                            roughly where they sit in the 140-slide deck)
     "the intro slides"   — "Concurrency and Java: An introduction with Java" (27 pages)
   Every threaded exercise prints only results that cannot depend on timing (it joins or awaits first), so the
   checker gets the same output every run. */
G('thread', c`An independent path of execution inside a program. Threads in one program share its memory.`);
G('concurrency vs parallelism', c`**Concurrency**: several tasks in progress at once, taking turns. **Parallelism**: tasks literally running at the same instant on different CPU cores.`);
G('thread states', c`~NEW~ → ~RUNNABLE~ → (~BLOCKED~ / ~WAITING~ / ~TIMED_WAITING~) → ~TERMINATED~. ~thread.getState()~ tells you which.`);
G('daemon thread', c`A background thread that does not keep the JVM alive: when only daemon threads are left, the program ends.`);
G('Runnable', c`The task a thread runs: an interface with one method, ~void run()~. Usually written as a lambda.`);
G('start() vs run()', c`~start()~ creates a new thread that then calls ~run()~. Calling ~run()~ yourself just runs it on the **current** thread.`);
G('join()', c`Waits for a thread to finish: ~t.join();~`);
G('interrupt()', c`Politely asks a thread to stop. Blocking calls like ~sleep~ then throw ~InterruptedException~.`);
G('ExecutorService', c`A pool of reusable worker threads. You hand it tasks with ~submit~ or ~execute~; ~shutdown()~ when done.`);
G('Callable / Future', c`A ~Callable~ is a task that returns a value; ~submit~ gives back a ~Future~, and ~future.get()~ waits for the answer.`);
G('race condition', c`A bug where the result depends on how threads happen to interleave, e.g. two threads doing ~count++~ at once and losing an update.`);
G('critical section', c`Code that touches shared data and must only be run by one thread at a time.`);
G('synchronized', c`Lets only one thread at a time into a method or block that uses the same lock (the object's **monitor**).`);
G('atomic variable', c`~AtomicInteger~, ~AtomicLong~…: thread-safe counters whose ~incrementAndGet()~ cannot lose updates.`);
G('ConcurrentHashMap', c`A HashMap that many threads can update at once safely; ~merge~ and ~compute~ update a key in one atomic step.`);
G('ReentrantLock', c`An explicit lock: ~lock()~ … ~finally { unlock(); }~. Adds ~tryLock~ with a timeout and ~Condition~ objects.`);
G('deadlock', c`Two or more threads each waiting for a lock the other holds, so none can ever continue.`);
G('Semaphore', c`A counter of permits: at most N threads may hold one at a time. ~acquire()~ takes one, ~release()~ gives it back.`);
G('producer/consumer', c`One thread makes data and another uses it, passing it through a shared buffer.`);
G('BlockingQueue', c`A thread-safe queue whose ~put~ waits while it is full and whose ~take~ waits while it is empty.`);
G('wait / notifyAll', c`Low-level coordination inside ~synchronized~ code: ~wait()~ sleeps until another thread calls ~notifyAll()~ on the same object.`);
G('CompletableFuture', c`A result that will arrive later, with steps chained on: ~supplyAsync(...).thenApply(...).thenCombine(...)~.`);
G('parallel stream', c`~list.parallelStream()~ splits the work across CPU cores using the fork/join pool.`);

/* ============ ADVANCED 6: THREADS ============ */
topic({ id: 'adv-threads', advanced: true, title: 'Multithreading: Threads', icon: '🧵', color: '#2b70c9', blurb: 'What a thread is, its life cycle, creating threads and thread pools.',
lessons: [
{ id: 'lifecycle', title: 'Threads & their life cycle', icon: '🔄', desc: 'Concurrency, parallelism and the states every thread passes through.',
  steps: [
  T('Why threads?', c`A **thread** is an independent path of execution inside a program; a program can run many at once, and they all share its memory *(intro slides, pp. 10–11)*. Multi**tasking** is the computer running several programs; multi**threading** is one program doing several things *(p. 12)*.

Threads keep an app **responsive** during a long job, let separate tasks be cancelled, and use **all** the cores of a modern CPU *(intro slides pp. 3, 14; Deitel §23.1)*. The Deitel slides put it this way: in a single-threaded program, lengthy activities must finish before others can begin *(Performance Tip 23.1, around slide 8)*.`),
  T('Concurrency vs parallelism', c`**Concurrency**: several tasks are *in progress* at the same time, taking turns on the CPU. **Parallelism**: tasks literally run at the *same instant* on different cores *(intro slides pp. 7, 13)*. With one core you get concurrency; with several you can get both.`),
  Q('A single-core laptop switches rapidly between a download and a game. That is…', ['Parallelism', 'Concurrency', 'Deadlock', 'A race condition'], 1),
  T('The life cycle', c`Every thread moves through these states *(Deitel §23.2, around slides 9–13; intro slides pp. 16–18)*:

**NEW** — created, not started yet.
**RUNNABLE** — started: running, or ready to run as soon as it gets a core.
**WAITING** — waiting for another thread to do something (~join()~, ~wait()~).
**TIMED_WAITING** — the same, with a time limit (~sleep(500)~, ~join(1000)~).
**BLOCKED** — waiting to get a lock that another thread holds.
**TERMINATED** — ~run()~ has finished.

~thread.getState()~ shows the current one.`, c`
Thread t = new Thread(() -> System.out.println("working"));
System.out.println(t.getState());   // NEW
t.start();                          // RUNNABLE
t.join();                           // main waits until t finishes
System.out.println(t.getState());   // TERMINATED`),
  P(c`
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {});
        System.out.println(t.getState());
        t.start();
        t.join();
        System.out.println(t.getState());
    }
}`, 'NEW\nTERMINATED'),
  Q(c`A thread calls ~Thread.sleep(1000)~. Which state is it in while it sleeps?`, [c`~BLOCKED~`, c`~WAITING~`, c`~TIMED_WAITING~`, c`~TERMINATED~`], 2),
  T('Daemon threads and priorities', c`A **daemon** thread runs in the background (the garbage collector is one). The JVM exits as soon as only daemon threads are left — it does not wait for them *(intro slides p. 19)*. Mark one with ~t.setDaemon(true)~ **before** ~start()~.

Threads have a **priority** from ~MIN_PRIORITY~ (1) through ~NORM_PRIORITY~ (5) to ~MAX_PRIORITY~ (10), inherited from the thread that created them *(intro slides p. 20; Deitel §23.2.7)*. Priorities are only hints to the operating system, and the Deitel slides advise that most programmers never need to set them *(Software Engineering Observation 23.1, around slide 11)*.`),
  Q(c`The main thread finishes, but a **daemon** thread is still looping. What happens?`, ['The program keeps running until the daemon finishes', 'The JVM exits; daemon threads do not keep it alive', 'The daemon becomes the main thread', 'An exception is thrown'], 1),
] },

{ id: 'creating', title: 'Creating threads', icon: '🛠️', desc: 'Extending Thread vs implementing Runnable, start, join, sleep and interrupt.',
  steps: [
  T('Two ways to make a thread', c`The intro slides show both ways *(pp. 21–27)*: **extend ~Thread~**, or **implement ~Runnable~** and hand it to a ~Thread~. Either way, the work goes in ~run()~.`, c`
class Multi extends Thread {                 // way 1: extend Thread
    public void run() { System.out.println("thread is running..."); }
}
new Multi().start();

class Multi3 implements Runnable {           // way 2: implement Runnable
    public void run() { System.out.println("thread is running..."); }
}
new Thread(new Multi3()).start();

new Thread(() -> System.out.println("thread is running...")).start();   // a Runnable lambda`, c`Prefer **Runnable**: your class can still extend something else, and the task is kept separate from the thread that runs it. The Deitel slides use Runnable tasks throughout *(§23.3)*.`),
  T('The key Thread methods', c`From the intro slides' method list *(pp. 24–26)*:

~start()~ — creates the new thread, which then calls ~run()~. It can only be called **once**.
~join()~ — wait for the thread to finish.
~Thread.sleep(ms)~ — pause the **current** thread.
~interrupt()~ — ask a thread to stop; a sleeping thread gets an ~InterruptedException~.
~Thread.currentThread()~, ~setName~, ~isAlive()~, ~setDaemon~, ~setPriority~.
~stop()~ is **deprecated**: it can leave shared data half-updated. Use ~interrupt()~ instead.`),
  P(c`
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> System.out.println("in thread"));
        t.start();
        t.join();
        System.out.println("main done");
    }
}`, 'in thread\nmain done', c`Without ~join()~, "main done" could appear first: the order would be up to the scheduler.`),
  P(c`
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> System.out.println(Thread.currentThread().getName()), "worker");
        t.run();
        t.start();
        t.join();
    }
}`, 'main\nworker', c`The classic mistake: ~run()~ just calls the method on the **current** thread (main). Only ~start()~ makes a new thread.`),
  Q(c`What happens if you call ~start()~ twice on the same Thread object?`, ['It runs twice', 'The second call is ignored', c`~IllegalThreadStateException~: a thread can only be started once`, 'It restarts the thread'], 2),
  X({ q: c`Add up 1 to 300 using **three threads**: thread 1 sums 1–100, thread 2 sums 101–200, thread 3 sums 201–300. Each stores its answer in ~parts[i]~. Start all three, **join** them all, then print each part and the total.

~Part 1: 5050~ ~Part 2: 15050~ ~Part 3: 25050~ ~Total: 45150~`, start: c`public class Main {
    public static void main(String[] args) throws InterruptedException {
        long[] parts = new long[3];
        Thread[] threads = new Thread[3];

        // create and start the three threads here

        for (int i = 0; i < 3; i++) {
            System.out.println("Part " + (i + 1) + ": " + parts[i]);
        }
    }
}
`, tests: [{ out: 'Part 1: 5050\nPart 2: 15050\nPart 3: 25050\nTotal: 45150' }], must: [[c`new\s+Thread\s*\(`, c`Create the threads with ~new Thread(...)~.`], [c`\.start\(\)`, c`Start them with ~start()~.`], [c`\.join\(\)`, c`Wait for them with ~join()~ before printing.`]], hint: c`A lambda can only use local variables that never change, so copy the loop counter first: ~final int id = i;~ then ~threads[i] = new Thread(() -> { for (int n = id * 100 + 1; n <= id * 100 + 100; n++) parts[id] += n; });~`, sol: c`public class Main {
    public static void main(String[] args) throws InterruptedException {
        long[] parts = new long[3];
        Thread[] threads = new Thread[3];

        for (int i = 0; i < 3; i++) {
            final int id = i;
            threads[i] = new Thread(() -> {
                for (int n = id * 100 + 1; n <= id * 100 + 100; n++) {
                    parts[id] += n;
                }
            });
            threads[i].start();
        }
        for (Thread t : threads) {
            t.join();
        }

        long total = 0;
        for (int i = 0; i < 3; i++) {
            System.out.println("Part " + (i + 1) + ": " + parts[i]);
            total += parts[i];
        }
        System.out.println("Total: " + total);
    }
}
` }),
  X({ q: c`**Stopping a thread properly.** The ticker thread counts ticks every 20 ms, forever. Make it stop cleanly when ~main~ calls ~interrupt()~: catch the ~InterruptedException~ (or check ~isInterrupted()~) and leave the loop. Then ~main~ joins it and prints:

~stopped cleanly~
~ticked: true~`, start: c`import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger ticks = new AtomicInteger();
        Thread ticker = new Thread(() -> {
            while (true) {
                ticks.incrementAndGet();
            }
        });
        ticker.start();
        Thread.sleep(150);
        // interrupt the ticker, wait for it, then print the two lines
    }
}
`, tests: [{ out: 'stopped cleanly\nticked: true' }], must: [[c`\.interrupt\(\)`, c`Call ~ticker.interrupt()~.`], [c`InterruptedException|isInterrupted`, c`React to the interrupt inside the thread.`]], sol: c`import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger ticks = new AtomicInteger();
        Thread ticker = new Thread(() -> {
            try {
                while (true) {
                    ticks.incrementAndGet();
                    Thread.sleep(20);
                }
            } catch (InterruptedException e) {
                // asked to stop: fall out of the loop
            }
        });
        ticker.start();
        Thread.sleep(150);
        ticker.interrupt();
        ticker.join();
        System.out.println(ticker.isAlive() ? "still running" : "stopped cleanly");
        System.out.println("ticked: " + (ticks.get() > 0));
    }
}
` }),
] },

{ id: 'executors', title: 'Thread pools & executors', icon: '🏊', desc: 'Let an ExecutorService manage the threads for you.',
  steps: [
  T('Do not manage threads by hand', c`Creating a new thread for every task is slow and does not scale. A **thread pool** keeps a set of reusable threads *(intro slides p. 9)*. In Java that is an ~ExecutorService~ — the approach the Deitel slides use from §23.3 onwards *(Figs. 23.3–23.4, around slides 14–19: PrintTask objects run by an executor)*.`, c`
ExecutorService pool = Executors.newFixedThreadPool(4);   // 4 worker threads

pool.execute(() -> System.out.println("a Runnable"));     // no result
Future<Integer> f = pool.submit(() -> 6 * 7);             // a Callable: has a result
int answer = f.get();                                     // waits for it

pool.shutdown();                                          // no new tasks; finish the queued ones
pool.awaitTermination(1, TimeUnit.MINUTES);               // wait for them to finish`, c`Other pools: ~newCachedThreadPool()~ (grows as needed — used in the Deitel examples) and, since Java 21, ~newVirtualThreadPerTaskExecutor()~ for huge numbers of lightweight tasks.`),
  T('Runnable vs Callable', c`A ~Runnable~ returns nothing. A ~Callable<T>~ returns a value and may throw a checked exception *(Deitel §23.14)*. ~submit~ gives you a ~Future~ that holds the result once it is ready. ~get()~ **waits** until then.`),
  P(c`
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        Future<Integer> a = pool.submit(() -> 6 * 7);
        Future<String> b = pool.submit(() -> "done");
        System.out.println(a.get() + " " + b.get());
        pool.shutdown();
    }
}`, '42 done'),
  Q(c`What does ~shutdown()~ do to tasks already submitted?`, ['Cancels them immediately', 'Lets them finish, but accepts no new tasks', 'Restarts them', 'Nothing until awaitTermination is called'], 1),
  Q(c`You forget to call ~shutdown()~ on a fixed thread pool. What can happen?`, ['Nothing', 'The program may never exit, because the pool\'s (non-daemon) threads stay alive', 'Tasks run twice', 'It does not compile'], 1),
  X({ q: c`**Parallel prime counter.** Read ~N~ and count the primes below it. Split ~2 … N-1~ into **4 chunks**, submit each chunk as a ~Callable<Integer>~ to a fixed pool of 4 threads, then add up the four ~Future~ results.

~100~ → ~25~ · ~100000~ → ~9592~`, start: c`import java.util.*;
import java.util.concurrent.*;

public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; (long) d * d <= n; d++) {
            if (n % d == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) throws Exception {
        int n = new Scanner(System.in).nextInt();
        int count = 0;
        for (int i = 2; i < n; i++) {
            if (isPrime(i)) count++;
        }
        System.out.println(count);
    }
}
`, tests: [{ in: '100', out: '25' }, { in: '100000', out: '9592' }, { in: '3', out: '1' }], must: [[c`newFixedThreadPool`, c`Use ~Executors.newFixedThreadPool(4)~.`], [c`Future`, c`Collect the results as ~Future<Integer>~ objects.`], [c`shutdown\(\)`, c`Shut the pool down.`]], hint: c`Chunk ~c~ covers ~from = c * n / 4~ up to (not including) ~to = (c + 1) * n / 4~. Copy them into ~final~ locals before writing the lambda.`, sol: c`import java.util.*;
import java.util.concurrent.*;

public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; (long) d * d <= n; d++) {
            if (n % d == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) throws Exception {
        int n = new Scanner(System.in).nextInt();
        ExecutorService pool = Executors.newFixedThreadPool(4);
        List<Future<Integer>> parts = new ArrayList<>();
        for (int c = 0; c < 4; c++) {
            final int from = c * n / 4, to = (c + 1) * n / 4;
            parts.add(pool.submit(() -> {
                int count = 0;
                for (int i = from; i < to; i++) {
                    if (isPrime(i)) count++;
                }
                return count;
            }));
        }
        int total = 0;
        for (Future<Integer> f : parts) {
            total += f.get();
        }
        pool.shutdown();
        System.out.println(total);
    }
}
` }),
] },
],
quiz: [
  Q(c`Which method actually creates a new thread of execution?`, [c`~run()~`, c`~start()~`, c`~join()~`, c`~new Thread()~ on its own`], 1),
  Q(c`A thread is waiting to enter a ~synchronized~ method that another thread is inside. Its state is…`, [c`~BLOCKED~`, c`~NEW~`, c`~TERMINATED~`, c`~TIMED_WAITING~`], 0),
  P(c`
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newSingleThreadExecutor();
        Future<Integer> f = pool.submit(() -> 2 + 3);
        System.out.println(f.get() * 10);
        pool.shutdown();
    }
}`, '50'),
  Q(c`Why is implementing ~Runnable~ usually preferred to extending ~Thread~?`, ['It is faster', 'Your class stays free to extend another class, and the task is separate from how it is run (e.g. by a pool)', 'Thread cannot be extended', 'Runnable threads never crash'], 1),
  F('Wait for the thread to finish before carrying on.', c`
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> System.out.println("work"));
        t.start();
        t.[[join]]();
        System.out.println("after");
    }
}`),
] });

/* ============ ADVANCED 7: SYNCHRONIZATION ============ */
topic({ id: 'adv-sync', advanced: true, title: 'Multithreading: Synchronization', icon: '🔒', color: '#ff4b4b', blurb: 'Race conditions, synchronized, atomics, concurrent collections, locks and deadlock.',
lessons: [
{ id: 'race', title: 'Race conditions & synchronized', icon: '🏁', desc: 'Why count++ goes wrong with two threads, and how to fix it.',
  steps: [
  T('A race condition', c`A **race condition** happens when two or more threads use shared data at the same time and the result depends on the timing *(intro slides p. 7)*. ~count++~ looks like one step but is really three: **read** count, **add** 1, **write** it back. Two threads can both read 5, both write 6 — and one increment is lost.

The Deitel slides demonstrate exactly this with ~SimpleArray~: several writer threads share one array and overwrite each other's values *(§23.4.3, Figs. 23.5–23.7, around slides 22–28)*. Their warning: access to a shared object by concurrent threads must be controlled carefully, or the program may produce incorrect results *(Error-Prevention Tip 23.1, around slide 47)*.`),
  T('synchronized', c`Code that touches shared data is a **critical section**: only one thread may be inside it at a time *(intro slides p. 8)*. Java's ~synchronized~ keyword does that. Every object has a **monitor lock**; a thread must hold it to enter a ~synchronized~ method or block, and other threads wait (**BLOCKED**) until it is released *(Deitel §23.4.2)*. The fixed ~SimpleArray~ simply makes its ~add~ method ~synchronized~ *(§23.4.4, Fig. 23.8, around slides 30–33)*.`, c`
class Counter {
    private int count = 0;
    public synchronized void increment() { count++; }   // one thread at a time
    public synchronized int get() { return count; }
}

synchronized (this) { ... }                              // or lock just a block`, c`Keep critical sections short: while one thread is inside, the others just wait.`),
  Q(c`Why is ~count++~ unsafe when two threads run it at once?`, ['++ is slow', 'It is really read, add, write: both threads can read the same old value, and one update is lost', 'ints cannot be shared', 'It is not unsafe'], 1),
  P(c`
public class Main {
    private static int count = 0;
    private static synchronized void increment() { count++; }

    public static void main(String[] args) throws InterruptedException {
        Thread[] threads = new Thread[4];
        for (int i = 0; i < 4; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 10_000; j++) increment();
            });
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        System.out.println(count);
    }
}`, '40000', c`Remove ~synchronized~ and run it a few times in the Playground: you will usually get less than 40000, and a different number each time.`),
  T('Immutable data needs no locks', c`Data that **never changes** can be shared freely: there is nothing to race on. The Deitel slides recommend declaring fields you do not expect to change as ~final~ *(§23.4.1, Software Engineering Observation 23.3, around slide 20)*. Records, ~String~ and ~List.of(...)~ are all immutable.`),
  X({ q: c`Four threads each deposit £1 ten thousand times into one account, but the balance comes out short. Make the account **thread-safe** so it always prints ~Balance: 40000~.`, start: c`class Account {
    private int balance = 0;

    void deposit(int amount) {
        balance += amount;
    }

    int getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Account account = new Account();
        Thread[] threads = new Thread[4];
        for (int i = 0; i < 4; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 10_000; j++) account.deposit(1);
            });
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        System.out.println("Balance: " + account.getBalance());
    }
}
`, tests: [{ out: 'Balance: 40000' }], must: [[c`synchronized|AtomicInteger|ReentrantLock`, c`Protect the balance with ~synchronized~ (or an ~AtomicInteger~ or a lock).`]], sol: c`class Account {
    private int balance = 0;

    synchronized void deposit(int amount) {
        balance += amount;
    }

    synchronized int getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Account account = new Account();
        Thread[] threads = new Thread[4];
        for (int i = 0; i < 4; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 10_000; j++) account.deposit(1);
            });
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        System.out.println("Balance: " + account.getBalance());
    }
}
` }),
] },

{ id: 'atomics', title: 'Atomics & concurrent collections', icon: '⚛️', desc: 'Thread-safe building blocks, so you rarely need synchronized at all.',
  steps: [
  T('Atomic variables', c`For a single shared counter or flag, ~java.util.concurrent.atomic~ is simpler and faster than ~synchronized~. Each operation happens as one indivisible (**atomic**) step.`, c`
AtomicInteger hits = new AtomicInteger();
hits.incrementAndGet();          // ++, safely
hits.addAndGet(5);
hits.compareAndSet(10, 0);       // set to 0 only if it is still 10

LongAdder total = new LongAdder();   // even faster when many threads add at once
total.add(3);  total.sum();`),
  T('Concurrent collections', c`Ordinary ~ArrayList~ and ~HashMap~ break when several threads change them at once. ~java.util.concurrent~ has thread-safe versions *(Deitel §23.10, "Concurrent Collections")*:`, c`
ConcurrentHashMap<String, Integer> counts = new ConcurrentHashMap<>();
counts.merge(word, 1, Integer::sum);        // add 1 (or start at 1) in one atomic step

CopyOnWriteArrayList<Listener> listeners;   // many readers, rare writers
ArrayBlockingQueue<Job> jobs;               // producer/consumer: next topic
ConcurrentLinkedQueue<Event> events;`, c`~counts.put(w, counts.get(w) + 1)~ is **still** a race, even on a ConcurrentHashMap: the get and the put are two separate steps. Use ~merge~ or ~compute~.`),
  P(c`
import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger count = new AtomicInteger();
        Thread a = new Thread(() -> { for (int i = 0; i < 1000; i++) count.incrementAndGet(); });
        Thread b = new Thread(() -> { for (int i = 0; i < 1000; i++) count.incrementAndGet(); });
        a.start(); b.start();
        a.join(); b.join();
        System.out.println(count.get());
    }
}`, '2000'),
  Q(c`On a ~ConcurrentHashMap~, why is ~map.put(k, map.get(k) + 1)~ still unsafe?`, ['It is safe', 'get and put are two separate steps; another thread can update k in between, so use merge or compute', 'ConcurrentHashMap has no put', 'Integers cannot be stored'], 1),
  X({ q: c`**Parallel word count.** Four threads each count the words in their share of the lines, all updating **one** ~ConcurrentHashMap~ with ~merge~. When they have all finished, print the counts in alphabetical order (copy into a ~TreeMap~).`, start: c`import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        List<String> lines = List.of(
            "the cat sat", "the dog sat", "a cat ran",
            "the end", "a dog", "cat cat");
        Map<String, Integer> counts = new HashMap<>();
        for (String line : lines) {
            for (String w : line.split(" ")) {
                counts.put(w, counts.getOrDefault(w, 0) + 1);
            }
        }
        System.out.println(new TreeMap<>(counts));
    }
}
`, tests: [{ out: '{a=2, cat=4, dog=2, end=1, ran=1, sat=2, the=3}' }], must: [[c`ConcurrentHashMap`, c`Share one ~ConcurrentHashMap~.`], [c`\.merge\(`, c`Update it with ~merge(w, 1, Integer::sum)~.`], [c`Thread|Executor`, c`Do the counting on four threads (or a pool of four).`]], sol: c`import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        List<String> lines = List.of(
            "the cat sat", "the dog sat", "a cat ran",
            "the end", "a dog", "cat cat");
        ConcurrentHashMap<String, Integer> counts = new ConcurrentHashMap<>();
        ExecutorService pool = Executors.newFixedThreadPool(4);
        for (int t = 0; t < 4; t++) {
            final int id = t;
            pool.execute(() -> {
                for (int i = id; i < lines.size(); i += 4) {
                    for (String w : lines.get(i).split(" ")) {
                        counts.merge(w, 1, Integer::sum);
                    }
                }
            });
        }
        pool.shutdown();
        pool.awaitTermination(1, TimeUnit.MINUTES);
        System.out.println(new TreeMap<>(counts));
    }
}
` }),
] },

{ id: 'locks', title: 'Locks, semaphores & deadlock', icon: '🔐', desc: 'Explicit locks, limiting access, and the bug where everything just stops.',
  steps: [
  T('Lock and Condition', c`~ReentrantLock~ is an explicit version of ~synchronized~ with extras: ~tryLock()~ (give up instead of waiting forever), timeouts, and fairness. **Always** unlock in ~finally~. A ~Condition~ lets threads wait for a particular state, like "buffer not empty" *(Deitel §23.9, around slides 81–97)*.`, c`
private final Lock lock = new ReentrantLock();
private final Condition notEmpty = lock.newCondition();

lock.lock();
try {
    while (queue.isEmpty()) notEmpty.await();   // release the lock and wait
    ...
    notEmpty.signalAll();                         // wake the waiting threads
} finally {
    lock.unlock();                                // ALWAYS, even after an exception
}`, c`The Deitel slides warn: if one thread calls ~await~, another must eventually call ~signal~ — and when several threads may be waiting, use ~signalAll~ so none of them **starves** *(Error-Prevention Tip 23.5, around slide 84)*.`),
  T('Semaphores', c`A **semaphore** controls access to a resource with a **counter** *(intro slides p. 8)*: at most N threads may hold a permit at once. Think "only 3 database connections".`, c`
Semaphore connections = new Semaphore(3);
connections.acquire();          // waits if all 3 are in use
try { useConnection(); }
finally { connections.release(); }`),
  T('Deadlock', c`**Deadlock**: two or more threads each wait for a resource the other holds, so none can ever continue *(intro slides p. 7; Deitel §23.2.8)*. Classic case: thread 1 locks A then waits for B, while thread 2 has locked B and waits for A.

Cures: always take locks in the **same global order** (for example by account number), hold them as briefly as possible, or use ~tryLock~ with a timeout and back off. **Indefinite postponement** (starvation) is the milder cousin: a thread that never gets its turn *(§23.2.8)*.`),
  P(c`
import java.util.concurrent.Semaphore;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Semaphore s = new Semaphore(3);
        s.acquire();
        s.acquire();
        System.out.println(s.availablePermits() + " " + s.tryAcquire() + " " + s.tryAcquire());
    }
}`, '1 true false'),
  Q(c`Thread 1 holds lock A and waits for B. Thread 2 holds B and waits for A. What is this?`, ['A race condition', 'Deadlock', 'Starvation', 'A daemon thread'], 1),
  Q(c`Why must ~lock.unlock()~ go in a ~finally~ block?`, ['It runs faster there', 'If the code in between throws, the lock would otherwise never be released and every other thread would wait forever', 'The compiler requires it', 'It does not have to'], 1),
  X({ q: c`**Deadlock-free transfers.** Two threads transfer £1 between accounts A and B a thousand times — one A→B, the other B→A. As written, each locks the **from** account and then the **to** account, so they can deadlock (and the program hangs). Fix ~transfer~ so the locks are always taken in the **same order** (lower ~id~ first).

Expected: ~A: 100, B: 100~ then ~Total: 200~`, start: c`class Account {
    final int id;
    int balance;
    Account(int id, int balance) { this.id = id; this.balance = balance; }
}

public class Main {
    static void transfer(Account from, Account to, int amount) {
        synchronized (from) {
            synchronized (to) {
                from.balance -= amount;
                to.balance += amount;
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Account a = new Account(1, 100), b = new Account(2, 100);
        Thread t1 = new Thread(() -> { for (int i = 0; i < 1000; i++) transfer(a, b, 1); });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 1000; i++) transfer(b, a, 1); });
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println("A: " + a.balance + ", B: " + b.balance);
        System.out.println("Total: " + (a.balance + b.balance));
    }
}
`, tests: [{ out: 'A: 100, B: 100\nTotal: 200' }], must: [[c`\.id\s*[<>]`, c`Compare the account ~id~s to decide which lock to take first.`]], hint: c`~Account first = from.id < to.id ? from : to;~ and ~Account second = first == from ? to : from;~ — then lock ~first~, then ~second~.`, sol: c`class Account {
    final int id;
    int balance;
    Account(int id, int balance) { this.id = id; this.balance = balance; }
}

public class Main {
    static void transfer(Account from, Account to, int amount) {
        Account first = from.id < to.id ? from : to;
        Account second = first == from ? to : from;
        synchronized (first) {
            synchronized (second) {
                from.balance -= amount;
                to.balance += amount;
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Account a = new Account(1, 100), b = new Account(2, 100);
        Thread t1 = new Thread(() -> { for (int i = 0; i < 1000; i++) transfer(a, b, 1); });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 1000; i++) transfer(b, a, 1); });
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println("A: " + a.balance + ", B: " + b.balance);
        System.out.println("Total: " + (a.balance + b.balance));
    }
}
` }),
] },
],
quiz: [
  Q(c`Which tool is simplest for a counter shared by many threads?`, [c`~int~ with ++`, c`~AtomicInteger~`, c`~ArrayList~`, c`~Thread.sleep~`], 1),
  Q(c`What is a **critical section**?`, ['The main method', 'Code that uses shared data and must run in only one thread at a time', 'A finally block', 'The first line of run()'], 1),
  P(c`
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> m = new ConcurrentHashMap<>();
        m.merge("a", 1, Integer::sum);
        m.merge("a", 1, Integer::sum);
        m.merge("b", 5, Integer::sum);
        System.out.println(m.get("a") + m.get("b"));
    }
}`, '7'),
  Q('Which strategy prevents the classic two-lock deadlock?', ['Using more threads', 'Always taking the locks in the same order', 'Calling Thread.sleep before locking', 'Making the threads daemons'], 1),
  F('Only one thread at a time may run this method.', c`
class Counter {
    private int n;
    public [[synchronized]] void inc() { n++; }
}`),
] });

/* ============ ADVANCED 8: PRODUCERS, CONSUMERS & ASYNC ============ */
topic({ id: 'adv-async', advanced: true, title: 'Multithreading: Coordination', icon: '🏭', color: '#ffc800', blurb: 'Producer/consumer buffers, wait/notify, CompletableFuture and parallel streams.',
lessons: [
{ id: 'blockingqueue', title: 'Producer/consumer with BlockingQueue', icon: '📦', desc: 'Hand work from one thread to another safely.',
  steps: [
  T('Producer/consumer', c`One thread **produces** data and another **consumes** it, passing it through a shared buffer — a printer queue, a download pipeline, a game loop. The Deitel slides first try a plain shared ~int~ as the buffer *(§23.5, UnsynchronizedBuffer, Fig. 23.12, around slide 40)*: the consumer reads values twice or misses them, because nothing stops either thread when the buffer is empty or full.`),
  T('ArrayBlockingQueue', c`The fix in §23.6 *(Figs. 23.14–23.15, around slides 47–53)* is a ~BlockingQueue~. ~put~ **waits** while the queue is full; ~take~ **waits** while it is empty. All the locking is done for you.`, c`
BlockingQueue<Integer> buffer = new ArrayBlockingQueue<>(3);   // holds at most 3

// producer thread
buffer.put(value);        // blocks if full

// consumer thread
int v = buffer.take();    // blocks if empty`, c`To tell the consumer "no more data", producers often send a special **poison pill** value, such as ~-1~ or ~"DONE"~.`),
  P(c`
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<Integer> q = new ArrayBlockingQueue<>(2);
        int[] sum = {0};
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) sum[0] += q.take();
            } catch (InterruptedException e) { }
        });
        consumer.start();
        for (int i = 1; i <= 5; i++) q.put(i);
        consumer.join();
        System.out.println("Sum: " + sum[0]);
    }
}`, 'Sum: 15', c`The queue only holds 2 items, so the producer (main) keeps blocking until the consumer catches up — and no value is lost or read twice.`),
  Q(c`What does ~take()~ do when the queue is empty?`, ['Returns null', 'Throws an exception', 'Waits until an item arrives', 'Returns 0'], 2),
  X({ q: c`**A two-thread pipeline.** ~main~ (the producer) reads lines and ~put~s them on an ~ArrayBlockingQueue<String>~ of size 2, followed by the poison pill ~"DONE"~. A worker thread ~take~s each line, prints it in capitals, and when it gets ~"DONE"~ prints how many lines it processed.`, start: c`import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Scanner in = new Scanner(System.in);
        while (in.hasNextLine()) {
            System.out.println(in.nextLine().toUpperCase());
        }
    }
}
`, tests: [{ in: 'hello\nthreads are fun\nbye\n', out: 'HELLO\nTHREADS ARE FUN\nBYE\nProcessed 3 lines' }], must: [[c`BlockingQueue`, c`Use an ~ArrayBlockingQueue~.`], [c`\.put\(`, c`The producer uses ~put~.`], [c`\.take\(`, c`The worker uses ~take~.`]], sol: c`import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(2);
        Thread worker = new Thread(() -> {
            int count = 0;
            try {
                while (true) {
                    String line = queue.take();
                    if (line.equals("DONE")) break;
                    System.out.println(line.toUpperCase());
                    count++;
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            System.out.println("Processed " + count + " lines");
        });
        worker.start();

        Scanner in = new Scanner(System.in);
        while (in.hasNextLine()) {
            queue.put(in.nextLine());
        }
        queue.put("DONE");
        worker.join();
    }
}
` }),
] },

{ id: 'waitnotify', title: 'wait, notifyAll & bounded buffers', icon: '⏸️', desc: 'How a blocking buffer works on the inside.',
  steps: [
  T('Building it yourself', c`Before ~BlockingQueue~ existed, you built the buffer with ~synchronized~ plus the ~Object~ methods ~wait()~ and ~notifyAll()~ *(Deitel §23.7, SynchronizedBuffer, Figs. 23.16–23.17, around slides 54–66)*:

~wait()~ — release the object's lock and sleep until notified.
~notifyAll()~ — wake every thread waiting on this object.

Both may only be called while holding the lock (inside ~synchronized~).`, c`
public synchronized void put(int value) throws InterruptedException {
    while (count == buffer.length) wait();      // full: wait for a consumer
    buffer[writeIndex] = value;
    writeIndex = (writeIndex + 1) % buffer.length;   // wrap around: a circular buffer
    count++;
    notifyAll();                                // wake any waiting consumer
}`, c`The circular index ~(index + 1) % buffer.length~ is exactly how the Deitel ~CircularBuffer~ reuses its three cells *(§23.8, Fig. 23.18, around slide 70)*.`),
  T('Always wait in a while loop', c`Wake-ups can be "spurious", and by the time a woken thread gets the lock back, another thread may have changed the state again. So **always** re-check the condition in a ~while~ loop, never an ~if~. The Deitel buffers do exactly this: ~while (occupiedCells == 0) wait();~ *(Fig. 23.18)*.`),
  Q(c`Why ~while (empty) wait();~ and not ~if (empty) wait();~?`, ['while is faster', 'When the thread wakes, the buffer may be empty again (or the wake-up was spurious), so the condition must be checked again', 'if is not allowed with wait', 'They are identical'], 1),
  Q(c`What happens if you call ~wait()~ outside a ~synchronized~ method or block?`, ['It works normally', c`~IllegalMonitorStateException~: you must hold the object's lock`, 'The thread terminates', 'It waits forever'], 1),
  X({ q: c`Finish ~BoundedBuffer~ (capacity 3) using ~synchronized~, ~wait()~ and ~notifyAll()~, with circular indexes. A producer puts 1…10 and a consumer takes 10 values and adds them up.

Expected: ~Items: 10~ then ~Sum: 55~`, start: c`class BoundedBuffer {
    private final int[] cells = new int[3];
    private int readIndex = 0, writeIndex = 0, count = 0;

    public void put(int value) throws InterruptedException {
        // wait while full, store at writeIndex, move it on, count++, notifyAll
    }

    public int take() throws InterruptedException {
        // wait while empty, read at readIndex, move it on, count--, notifyAll
        return 0;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        BoundedBuffer buffer = new BoundedBuffer();
        int[] result = new int[2];
        Thread producer = new Thread(() -> {
            try { for (int i = 1; i <= 10; i++) buffer.put(i); } catch (InterruptedException e) { }
        });
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) { result[0]++; result[1] += buffer.take(); }
            } catch (InterruptedException e) { }
        });
        producer.start(); consumer.start();
        producer.join(); consumer.join();
        System.out.println("Items: " + result[0]);
        System.out.println("Sum: " + result[1]);
    }
}
`, tests: [{ out: 'Items: 10\nSum: 55' }], must: [[c`synchronized`, c`Make ~put~ and ~take~ ~synchronized~.`], [c`while\s*\([^)]*\)\s*wait\(\)|while\s*\([^)]*\)\s*\{\s*wait\(\)`, c`Wait inside a ~while~ loop.`], [c`notifyAll\(\)`, c`Wake the other side with ~notifyAll()~.`]], sol: c`class BoundedBuffer {
    private final int[] cells = new int[3];
    private int readIndex = 0, writeIndex = 0, count = 0;

    public synchronized void put(int value) throws InterruptedException {
        while (count == cells.length) wait();
        cells[writeIndex] = value;
        writeIndex = (writeIndex + 1) % cells.length;
        count++;
        notifyAll();
    }

    public synchronized int take() throws InterruptedException {
        while (count == 0) wait();
        int value = cells[readIndex];
        readIndex = (readIndex + 1) % cells.length;
        count--;
        notifyAll();
        return value;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        BoundedBuffer buffer = new BoundedBuffer();
        int[] result = new int[2];
        Thread producer = new Thread(() -> {
            try { for (int i = 1; i <= 10; i++) buffer.put(i); } catch (InterruptedException e) { }
        });
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) { result[0]++; result[1] += buffer.take(); }
            } catch (InterruptedException e) { }
        });
        producer.start(); consumer.start();
        producer.join(); consumer.join();
        System.out.println("Items: " + result[0]);
        System.out.println("Sum: " + result[1]);
    }
}
` }),
] },

{ id: 'async', title: 'CompletableFuture & parallel streams', icon: '🚀', desc: 'Asynchronous results and using every core with one word.',
  steps: [
  T('CompletableFuture', c`**Asynchronous** programming starts a task and carries on without waiting for it *(intro slides p. 9)*. ~CompletableFuture~ runs work on a background pool and lets you chain what happens next. The last Deitel example computes ~fibonacci(45)~ and ~fibonacci(44)~ this way: one after the other took about **7.1 s**, both at once about **4.4 s** — the async version was limited only by the slower calculation *(§23.14, Fig. 23.31, slide 140)*.`, c`
CompletableFuture<Long> f45 = CompletableFuture.supplyAsync(() -> fibonacci(45));
CompletableFuture<Long> f44 = CompletableFuture.supplyAsync(() -> fibonacci(44));

long total = f45.thenCombine(f44, Long::sum).join();   // wait for both, add them

CompletableFuture.supplyAsync(() -> download(url))
    .thenApply(String::length)              // transform the result when it arrives
    .thenAccept(System.out::println);       // and use it`),
  T('Parallel streams and parallelSort', c`For big CPU-heavy jobs on a multi-core machine, Java can split the work for you using the **fork/join** framework, which divides a task into subtasks, runs them concurrently and combines the results *(intro slides p. 9; Deitel §23.15)*:

~Arrays.parallelSort(array)~ — the Deitel slides sort 100 million ints with ~sort~ and ~parallelSort~ and time both with ~Instant~ and ~Duration~ *(§23.12, Fig. 23.29, around slides 125–128)*.
~list.parallelStream()~ or ~stream.parallel()~ — the same pipeline, across all cores *(§23.13)*.`, c`
long sum = LongStream.rangeClosed(1, 1_000_000_000).parallel().sum();`, c`Parallel is not automatically faster: for small data, splitting costs more than it saves. And the lambdas must not change shared state.`),
  P(c`
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) {
        int result = CompletableFuture.supplyAsync(() -> 20)
            .thenApply(x -> x + 1)
            .thenCombine(CompletableFuture.supplyAsync(() -> 2), (a, b) -> a * b)
            .join();
        System.out.println(result);
    }
}`, '42'),
  P(c`
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        System.out.println(IntStream.rangeClosed(1, 100).parallel().sum());
    }
}`, '5050', c`Same answer as the sequential version — just potentially computed on several cores.`),
  Q(c`When is a parallel stream likely to be **slower** than a normal one?`, ['On huge CPU-heavy data', 'On small data, where splitting and combining costs more than it saves', 'Never', 'Only on Tuesdays'], 1),
  X({ q: c`Recreate the slides' experiment on a smaller scale: compute ~fib(30)~ and ~fib(31)~ **at the same time** with ~CompletableFuture.supplyAsync~, then combine them with ~thenCombine~.

Expected:
~fib(30) = 832040~
~fib(31) = 1346269~
~Sum = 2178309~`, start: c`import java.util.concurrent.*;

public class Main {
    static long fib(int n) {
        return n < 2 ? n : fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        long a = fib(30);
        long b = fib(31);
        System.out.println(a + " " + b);
    }
}
`, tests: [{ out: 'fib(30) = 832040\nfib(31) = 1346269\nSum = 2178309' }], must: [[c`supplyAsync`, c`Start both with ~CompletableFuture.supplyAsync~.`], [c`thenCombine`, c`Combine them with ~thenCombine~.`]], sol: c`import java.util.concurrent.*;

public class Main {
    static long fib(int n) {
        return n < 2 ? n : fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        CompletableFuture<Long> f30 = CompletableFuture.supplyAsync(() -> fib(30));
        CompletableFuture<Long> f31 = CompletableFuture.supplyAsync(() -> fib(31));
        long sum = f30.thenCombine(f31, Long::sum).join();
        System.out.println("fib(30) = " + f30.join());
        System.out.println("fib(31) = " + f31.join());
        System.out.println("Sum = " + sum);
    }
}
` }),
] },
],
quiz: [
  Q(c`Which class is the ready-made, thread-safe buffer for producer/consumer code?`, [c`~ArrayList~`, c`~ArrayBlockingQueue~`, c`~HashMap~`, c`~StringBuilder~`], 1),
  Q(c`Which pair of methods coordinates threads inside ~synchronized~ code?`, [c`~start~ / ~run~`, c`~wait~ / ~notifyAll~`, c`~put~ / ~take~`, c`~lock~ / ~unlock~`], 1),
  P(c`
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) {
        CompletableFuture<String> f = CompletableFuture.supplyAsync(() -> "java").thenApply(String::toUpperCase);
        System.out.println(f.join() + "!");
    }
}`, 'JAVA!'),
  F('Run the same pipeline across all cores.', c`
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = List.of(1, 2, 3, 4);
        System.out.println(nums.[[parallelStream]]().mapToInt(n -> n * n).sum());
    }
}`),
] });

/* ============ ADVANCED 9: PRO PROJECTS ============ */
topic({ id: 'adv-projects', advanced: true, title: 'Professional Projects', icon: '💼', color: '#c0c7ff', blurb: 'Three realistic jobs that combine everything in Part 2.',
lessons: [
{ id: 'pro', title: 'Pro capstones', icon: '🏆', desc: 'An order report, a concurrent ticket sale and a multithreaded log analyser.',
  steps: [
  T('Like the real thing', c`These are the kind of task a junior Java developer is really given. Model the data first (records? enums?), choose the right collections, then write small methods and run often. For the threaded ones, ask: **what is shared, and who protects it?**`),
  X({ q: c`**Order report.** Read CSV lines ~id,customer,category,amount~ until the input ends. Using a ~record Order~ and streams, print:

~Revenue by category:~ then each category, **highest revenue first**, as ~  Books: 45.50~
~Top customer: bo (112.25)~ (highest total spend)
~Average order: 36.38~`, start: c`import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        while (in.hasNextLine()) {
            String line = in.nextLine();
            System.out.println(line);
        }
    }
}
`, tests: [{ in: '1,ada,Books,20.00\n2,bo,Games,60.00\n3,ada,Games,35.00\n4,cy,Books,25.50\n5,ada,Music,25.50\n6,bo,Music,52.25\n', out: 'Revenue by category:\n  Games: 95.00\n  Music: 77.75\n  Books: 45.50\nTop customer: bo (112.25)\nAverage order: 36.38' }], must: [[c`record\s+Order`, c`Model each line as a ~record Order~.`], [c`groupingBy`, c`Group with ~Collectors.groupingBy~.`]], hint: c`Group by category with ~summingDouble~, then stream the map's entries sorted by ~Map.Entry.comparingByValue(Comparator.reverseOrder())~.`, sol: c`import java.util.*;
import java.util.stream.*;

record Order(int id, String customer, String category, double amount) {
    static Order parse(String line) {
        String[] p = line.split(",");
        return new Order(Integer.parseInt(p[0]), p[1], p[2], Double.parseDouble(p[3]));
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        List<Order> orders = new ArrayList<>();
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (!line.isEmpty()) orders.add(Order.parse(line));
        }

        Map<String, Double> byCategory = orders.stream()
            .collect(Collectors.groupingBy(Order::category, Collectors.summingDouble(Order::amount)));
        System.out.println("Revenue by category:");
        byCategory.entrySet().stream()
            .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
            .forEach(e -> System.out.printf("  %s: %.2f%n", e.getKey(), e.getValue()));

        Map.Entry<String, Double> top = orders.stream()
            .collect(Collectors.groupingBy(Order::customer, Collectors.summingDouble(Order::amount)))
            .entrySet().stream().max(Map.Entry.comparingByValue()).orElseThrow();
        System.out.printf("Top customer: %s (%.2f)%n", top.getKey(), top.getValue());

        double avg = orders.stream().mapToDouble(Order::amount).average().orElse(0);
        System.out.printf("Average order: %.2f%n", avg);
    }
}
` }),
  X({ q: c`**Concert ticket rush.** 100 fans try to buy a ticket at the same moment, through a thread pool of 8 threads, but there are only 60 seats. Without protection, two fans can get the same last seat. Make ~TicketOffice.tryBook()~ thread-safe, run all 100 attempts on an ~ExecutorService~, wait for them to finish, and print:

~Booked: 60~
~Rejected: 40~
~Seats left: 0~`, start: c`import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

class TicketOffice {
    private int seatsLeft;
    TicketOffice(int seats) { seatsLeft = seats; }

    boolean tryBook() {
        if (seatsLeft > 0) {
            seatsLeft--;
            return true;
        }
        return false;
    }

    int getSeatsLeft() { return seatsLeft; }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        TicketOffice office = new TicketOffice(60);
        AtomicInteger booked = new AtomicInteger(), rejected = new AtomicInteger();

        for (int fan = 0; fan < 100; fan++) {
            if (office.tryBook()) booked.incrementAndGet(); else rejected.incrementAndGet();
        }

        System.out.println("Booked: " + booked.get());
        System.out.println("Rejected: " + rejected.get());
        System.out.println("Seats left: " + office.getSeatsLeft());
    }
}
`, tests: [{ out: 'Booked: 60\nRejected: 40\nSeats left: 0' }], must: [[c`ExecutorService|newFixedThreadPool`, c`Run the attempts on an ~ExecutorService~ with 8 threads.`], [c`awaitTermination`, c`Wait for every attempt with ~awaitTermination~ before printing.`], [c`synchronized|AtomicInteger\s+seats|compareAndSet|ReentrantLock`, c`Protect ~tryBook~: make it ~synchronized~ (or use a lock or an atomic).`]], sol: c`import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

class TicketOffice {
    private int seatsLeft;
    TicketOffice(int seats) { seatsLeft = seats; }

    synchronized boolean tryBook() {
        if (seatsLeft > 0) {
            seatsLeft--;
            return true;
        }
        return false;
    }

    synchronized int getSeatsLeft() { return seatsLeft; }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        TicketOffice office = new TicketOffice(60);
        AtomicInteger booked = new AtomicInteger(), rejected = new AtomicInteger();

        ExecutorService pool = Executors.newFixedThreadPool(8);
        for (int fan = 0; fan < 100; fan++) {
            pool.execute(() -> {
                if (office.tryBook()) booked.incrementAndGet(); else rejected.incrementAndGet();
            });
        }
        pool.shutdown();
        pool.awaitTermination(1, TimeUnit.MINUTES);

        System.out.println("Booked: " + booked.get());
        System.out.println("Rejected: " + rejected.get());
        System.out.println("Seats left: " + office.getSeatsLeft());
    }
}
` }),
  X({ q: c`**Multithreaded log analyser.** Read web-server log lines like ~GET /index.html 200~ (method, path, status) until the input ends. Split the lines into 4 chunks and analyse each chunk as a ~Callable~ on a pool of 4 threads; each returns its own counts. Merge the four results, then print the status codes in order with their counts, and the most requested path.

~200: 4~ ~404: 1~ ~500: 1~ then ~Top path: /index.html (3)~`, start: c`import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner in = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (!line.isEmpty()) lines.add(line);
        }
        System.out.println(lines.size() + " lines");
    }
}
`, tests: [{ in: 'GET /index.html 200\nGET /about 200\nPOST /login 500\nGET /index.html 200\nGET /missing 404\nGET /index.html 200\n', out: '200: 4\n404: 1\n500: 1\nTop path: /index.html (3)' }], must: [[c`Callable|submit\(`, c`Analyse each chunk as a ~Callable~ submitted to the pool.`], [c`Future`, c`Collect the chunk results as ~Future~s.`]], hint: c`Have each task return a small result object (or a ~Map<String, Integer>~ for statuses and another for paths). Merge them on the main thread with ~merge(k, v, Integer::sum)~ — no shared state between the workers means nothing to lock.`, sol: c`import java.util.*;
import java.util.concurrent.*;

public class Main {
    record Counts(Map<String, Integer> statuses, Map<String, Integer> paths) {}

    static Counts analyse(List<String> chunk) {
        Map<String, Integer> statuses = new HashMap<>(), paths = new HashMap<>();
        for (String line : chunk) {
            String[] p = line.split(" ");
            paths.merge(p[1], 1, Integer::sum);
            statuses.merge(p[2], 1, Integer::sum);
        }
        return new Counts(statuses, paths);
    }

    public static void main(String[] args) throws Exception {
        Scanner in = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (!line.isEmpty()) lines.add(line);
        }

        ExecutorService pool = Executors.newFixedThreadPool(4);
        List<Future<Counts>> futures = new ArrayList<>();
        for (int c = 0; c < 4; c++) {
            List<String> chunk = lines.subList(c * lines.size() / 4, (c + 1) * lines.size() / 4);
            futures.add(pool.submit(() -> analyse(chunk)));
        }

        Map<String, Integer> statuses = new TreeMap<>(), paths = new HashMap<>();
        for (Future<Counts> f : futures) {
            Counts part = f.get();
            part.statuses().forEach((k, v) -> statuses.merge(k, v, Integer::sum));
            part.paths().forEach((k, v) -> paths.merge(k, v, Integer::sum));
        }
        pool.shutdown();

        statuses.forEach((code, n) -> System.out.println(code + ": " + n));
        Map.Entry<String, Integer> top = Collections.max(paths.entrySet(), Map.Entry.comparingByValue());
        System.out.println("Top path: " + top.getKey() + " (" + top.getValue() + ")");
    }
}
` }),
] },
],
quiz: [
  Q(c`In the ticket rush, why must ~tryBook~ be protected even though each fan only calls it once?`, ['It does not need to be', 'Two threads can both see seatsLeft == 1 and both book it: check-then-act is a race', 'Because the pool has 8 threads', 'To make it faster'], 1),
  Q(c`The log analyser's workers each build their **own** maps and the main thread merges them. Why is that a good design?`, ['It uses more memory', 'Nothing is shared while the workers run, so no locking is needed and there is nothing to race on', 'Maps are always thread-safe', 'It is not a good design'], 1),
  Q(c`Which combination best describes production-ready Java?`, ['One big class with static methods', 'Immutable records, clear exceptions, the right collections, and threads that share as little as possible', 'Catching Exception everywhere and ignoring it', 'As many threads as possible'], 1),
] });
