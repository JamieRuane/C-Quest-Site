/* ================= SQL =================
   One path for everyone: it starts from the very first query.
   SQL runs in the browser with real SQLite (sql.js), so it works offline and needs nothing installed.
   Every run starts from a fresh copy of a practice database (see `datasets` below). A step uses the database of its
   lesson (`db`), else its topic's, else the course default. 'empty' starts with no tables at all.

   SQL challenges: X({ q, start, sol, check, ordered, must, not, hint })
     The learner's result is compared with the result of `sol` on the same data: same number of columns and the same
     rows. Column names do not matter. Row order matters only if `sol` (or `check`) uses ORDER BY.
     check: a query run afterwards, for challenges that change data, e.g. 'SELECT * FROM pets ORDER BY id'.
   Predict steps: the answer is the result as text, one row per line, columns separated by " | ". */
course('sql', {
  name: 'SQL', badge: 'SQL', logo: 'logos/sql.svg', color: '#3b7ccf', video: '5OdVJbNCSso', glossTry: 'JOIN', tool: 'SQLite', sql: true, db: 'pets',
  tagline: 'The language of data. Every app, website and business stores and searches its data with it.',
  blank: '-- Write your SQL here\n',
  x: o => ({ ...o, start: o.start != null ? trimNL(o.start) + '\n' : undefined, sol: trimNL(o.sol) + '\n' }),
  datasets: {
    pets: c`
CREATE TABLE pets (
  id      INTEGER PRIMARY KEY,
  name    TEXT NOT NULL,
  species TEXT,
  age     INTEGER,
  weight  REAL,
  owner   TEXT
);
INSERT INTO pets VALUES
  (1, 'Rex',      'dog',    3,  30.5, 'Ana'),
  (2, 'Whiskers', 'cat',    5,  4.2,  'Ben'),
  (3, 'Bubbles',  'fish',   1,  0.1,  'Ana'),
  (4, 'Luna',     'cat',    2,  3.8,  'Cara'),
  (5, 'Max',      'dog',    7,  35.0, 'Dev'),
  (6, 'Coco',     'parrot', 12, 0.4,  'Ben'),
  (7, 'Bella',    'dog',    1,  8.2,  NULL),
  (8, 'Oscar',    'cat',    9,  5.1,  'Dev');`,
    shop: c`
CREATE TABLE customers (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL,
  city   TEXT,
  email  TEXT UNIQUE,
  joined TEXT
);
CREATE TABLE products (
  id       INTEGER PRIMARY KEY,
  name     TEXT NOT NULL,
  category TEXT,
  price    REAL CHECK (price >= 0),
  stock    INTEGER DEFAULT 0
);
CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  product_id  INTEGER REFERENCES products(id),
  quantity    INTEGER NOT NULL,
  order_date  TEXT
);
INSERT INTO customers VALUES
  (1, 'Ada Lovelace',      'London',     'ada@example.com',      '2024-01-15'),
  (2, 'Alan Turing',       'Manchester', 'alan@example.com',     '2024-02-03'),
  (3, 'Grace Hopper',      'New York',   NULL,                   '2024-03-22'),
  (4, 'Linus Torvalds',    'Helsinki',   'linus@example.com',    '2024-05-09'),
  (5, 'Margaret Hamilton', 'Boston',     'margaret@example.com', '2024-06-30'),
  (6, 'Tim Berners-Lee',   'London',     'tim@example.com',      '2024-08-12');
INSERT INTO products VALUES
  (1, 'Keyboard',        'Hardware',    49.99, 15),
  (2, 'Mouse',           'Hardware',    19.99, 40),
  (3, 'Monitor',         'Hardware',    189,   6),
  (4, 'USB Cable',       'Accessories', 7.5,   120),
  (5, 'Laptop Stand',    'Accessories', 34,    0),
  (6, 'Code Editor Pro', 'Software',    59,    999),
  (7, 'Antivirus',       'Software',    29.99, 999),
  (8, 'Mug',             'Merch',       12,    55);
INSERT INTO orders VALUES
  (1,  1, 1, 1, '2024-09-01'),
  (2,  1, 4, 3, '2024-09-01'),
  (3,  2, 3, 1, '2024-09-05'),
  (4,  3, 6, 1, '2024-09-10'),
  (5,  3, 2, 2, '2024-09-10'),
  (6,  4, 1, 1, '2024-09-15'),
  (7,  4, 7, 1, '2024-09-20'),
  (8,  5, 3, 2, '2024-10-02'),
  (9,  5, 5, 1, '2024-10-02'),
  (10, 2, 2, 1, '2024-10-11'),
  (11, 1, 6, 1, '2024-10-20'),
  (12, 4, 4, 5, '2024-10-25');`,
    empty: '',
  },
});

G('database', c`An organised collection of data, stored in **tables**. SQL is the language for asking it questions and changing it.`);
G('table', c`Data laid out in rows and columns, like a spreadsheet with strict rules. Each table holds one kind of thing: pets, customers, orders.`);
G('row', c`One record in a table: one pet, one customer, one order. Also called a record.`);
G('column', c`One piece of information every row has, with a fixed type: ~name~, ~age~, ~price~. Also called a field.`);
G('query', c`A question you ask the database, usually starting with ~SELECT~. The answer is itself a table.`);
G('SELECT', c`Chooses which columns to show: ~SELECT name, age FROM pets;~. ~SELECT *~ means every column.`);
G('FROM', c`Says which table to read: ~SELECT * FROM pets;~`);
G('alias (AS)', c`A temporary name for a column or table in a query: ~SELECT weight * 2.2 AS pounds~.`);
G('WHERE', c`Keeps only the rows that match a condition: ~WHERE species = 'cat'~.`);
G('AND / OR / NOT', c`Combine or flip conditions. ~AND~ needs both, ~OR~ needs either, ~NOT~ reverses.`);
G('IN', c`Matches any value in a list: ~WHERE owner IN ('Ana', 'Ben')~. Short for several ORs.`);
G('BETWEEN', c`An inclusive range: ~WHERE age BETWEEN 2 AND 5~ includes 2 and 5.`);
G('LIKE', c`Pattern matching on text. ~%~ means "any number of characters", ~_~ means "exactly one": ~name LIKE 'B%'~.`);
G('NULL', c`"No value here" — unknown or missing. It is not zero and not empty text. Test it with ~IS NULL~, never ~= NULL~.`);
G('ORDER BY', c`Sorts the result: ~ORDER BY age DESC~. Without it, the row order is not guaranteed.`);
G('LIMIT / OFFSET', c`~LIMIT 3~ keeps the first 3 rows; ~OFFSET 3~ skips 3 first. Together they make pages.`);
G('DISTINCT', c`Removes duplicate rows from the result: ~SELECT DISTINCT species FROM pets;~`);
G('||', c`Joins text in SQLite (and standard SQL): ~first || ' ' || last~. MySQL uses ~CONCAT()~ instead.`);
G('CASE', c`An if/else inside a query: ~CASE WHEN price > 50 THEN 'pricey' ELSE 'cheap' END~.`);
G('aggregate function', c`Turns many rows into one value: ~COUNT~, ~SUM~, ~AVG~, ~MIN~, ~MAX~.`);
G('COUNT', c`~COUNT(*)~ counts rows. ~COUNT(column)~ counts the rows where that column is **not** NULL.`);
G('GROUP BY', c`Splits rows into groups that share a value, so aggregates are worked out per group: one row per species.`);
G('HAVING', c`Filters **groups** after GROUP BY, the way WHERE filters rows before it: ~HAVING COUNT(*) > 2~.`);
G('primary key', c`A column whose value is unique and never NULL, identifying each row: usually ~id~.`);
G('foreign key', c`A column that holds another table's primary key, linking the two: ~orders.customer_id~ points to ~customers.id~.`);
G('JOIN', c`Combines rows from two tables where a condition matches, usually a foreign key: ~orders JOIN customers ON orders.customer_id = customers.id~.`);
G('INNER JOIN', c`Keeps only rows that have a match in **both** tables.`);
G('LEFT JOIN', c`Keeps **every** row of the left table, filling in NULL where the right table has no match.`);
G('subquery', c`A query inside another query, in brackets: ~WHERE price > (SELECT AVG(price) FROM products)~.`);
G('UNION', c`Stacks the results of two queries with the same columns. ~UNION~ removes duplicates; ~UNION ALL~ keeps them.`);
G('INSERT', c`Adds rows: ~INSERT INTO pets (name, species) VALUES ('Nemo', 'fish');~`);
G('UPDATE', c`Changes existing rows: ~UPDATE pets SET age = 4 WHERE id = 1;~. Without WHERE it changes **every** row.`);
G('DELETE', c`Removes rows: ~DELETE FROM pets WHERE id = 3;~. Without WHERE it empties the whole table.`);
G('transaction', c`A group of changes that succeed or fail together. ~BEGIN~ starts one, ~COMMIT~ keeps it, ~ROLLBACK~ undoes it.`);
G('CREATE TABLE', c`Makes a new table, naming each column and its type: ~CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT);~`);
G('constraint', c`A rule the database enforces on a column: ~NOT NULL~, ~UNIQUE~, ~CHECK~, ~DEFAULT~, ~PRIMARY KEY~, ~REFERENCES~.`);
G('view', c`A saved query that behaves like a table: ~CREATE VIEW big_orders AS SELECT ...~.`);
G('index', c`A lookup structure that makes searching a column fast, like the index at the back of a book.`);
G('SQLite', c`A small database engine that lives in a single file. It powers this course, every phone, and most browsers.`);

/* ============ TOPIC 1: FIRST QUERIES ============ */
topic({ id: 'first', title: 'First Queries', icon: '🔍', color: '#58cc02', blurb: 'Tables, rows and columns — and your first SELECT.', db: 'pets',
lessons: [
{ id: 'tables', title: 'Tables and SELECT', icon: '🗂️', desc: 'What a database is, and how to ask it for everything it has.',
  v: [['0:10:29', '0:14:29', 'Databases'], ['0:28:32', '0:33:32', 'SELECT']],
  steps: [
  T('Data lives in tables', c`A **database** stores data in **tables**. A table looks like a spreadsheet: each **row** is one thing (one pet), each **column** is one fact about it (its name, its age).

The difference from a spreadsheet: every column has a fixed type and the database enforces rules, so millions of rows stay tidy and searchable in milliseconds.

**SQL** (often said "sequel") is the language for talking to databases. Almost every app you use runs SQL behind the scenes.`),
  T('Your first query', c`This query shows every row and every column of the ~pets~ table:`, c`SELECT * FROM pets;`, c`Read it as: "select everything (~*~) from the pets table". The result is a new table.

Open **📋 Look inside the database** on any exercise to see the tables you are working with.`),
  Q(c`In ~SELECT * FROM pets;~ what does the ~*~ mean?`, ['Multiply', 'Every column', 'Only the first row', 'Every table'], 1),
  X({ q: c`Show everything in the ~pets~ table: every row and every column.`, start: c`-- your query here`, sol: c`SELECT * FROM pets;`, hint: c`~SELECT * FROM pets;~` }),
  T('Spelling rules', c`SQL **keywords** are not case-sensitive: ~select~, ~SELECT~ and ~Select~ all work. Writing them in capitals is a convention that makes queries easy to scan.

Statements end with a semicolon ~;~. Extra spaces and new lines are ignored, so long queries can be spread over several lines.

Comments start with ~--~ and run to the end of the line.`, c`-- these two queries are the same
SELECT * FROM pets;
select *
from   pets;`),
  Q('Which query is NOT valid SQL?', [c`~select * from pets;~`, c`~SELECT * FROM pets;~`, c`~SELECT * pets;~`, c`~SELECT *\nFROM pets;~`], 2, c`~FROM~ is required: SQLite needs to know which table to read.`),
  F('Ask for everything in the pets table.', c`[[SELECT]] * [[FROM]] pets;`),
  T('A note about dialects', c`SQL is a standard, but each database adds its own extras. This course runs **SQLite**, the database inside every phone and browser. Bro Code's video uses **MySQL**.

Everything you learn here works in both. Where they differ (a few function names, how ids count up) the lesson says so.`),
] },

{ id: 'columns', title: 'Choosing columns', icon: '🎯', desc: 'Only the columns you need, in the order you want, with the names you choose.',
  steps: [
  T('Name the columns you want', c`Instead of ~*~, list the columns, separated by commas. They come back in the order you list them.`, c`SELECT name, age FROM pets;`, c`Real databases can have tables with dozens of columns. Asking only for what you need is faster and easier to read.`),
  Q(c`How many columns does ~SELECT name, species, owner FROM pets;~ return?`, ['1', '3', '6', 'It depends on the number of rows'], 1),
  X({ q: c`Show each pet's ~name~ and ~species~ — in that order.`, start: c`SELECT`, sol: c`SELECT name, species FROM pets;`, hint: c`Separate the column names with a comma.` }),
  X({ q: c`Show the ~owner~ first, then the ~name~ of each pet.`, sol: c`SELECT owner, name FROM pets;`, hint: c`Columns come back in the order you write them.` }),
  T('Renaming with AS', c`~AS~ gives a column a new name in the result. It does not change the table — only the heading of this answer.`, c`
SELECT name AS pet, owner AS human
FROM pets;`, c`Aliases become really useful once you calculate new columns, which is next.`),
  X({ q: c`Show each pet's name in a column called ~pet_name~.`, sol: c`SELECT name AS pet_name FROM pets;`, must: [[c`\bAS\s+pet_name\b`, c`Use ~AS pet_name~ to rename the column.`]], hint: c`~SELECT name AS pet_name FROM pets;~` }),
  F('Show the age, renamed to years.', c`SELECT name, age [[AS]] years [[FROM]] pets;`),
] },

{ id: 'calc', title: 'Calculated columns', icon: '🧮', desc: 'Maths and text right inside a query.',
  steps: [
  T('A column can be a calculation', c`A SELECT can work things out for every row. This converts each weight from kilograms to pounds:`, c`
SELECT name, weight * 2.2 AS pounds
FROM pets;`, c`The table is not changed — the calculation only exists in the answer. Use ~+~ ~-~ ~*~ ~/~ and brackets as in school maths.`),
  P(c`SELECT 7 + 3 * 2;`, '13', c`Multiplication first, as usual. A SELECT does not even need a table.`),
  P(c`SELECT 10 / 4, 10 / 4.0;`, '2 | 2.5', c`Whole number divided by whole number gives a whole number in SQLite: the .5 is dropped. Write one side as a decimal to keep it.`),
  T('Joining text', c`In SQLite, ~||~ glues text together. (In MySQL the same job is done by ~CONCAT(a, b)~.)`, c`
SELECT name || ' the ' || species AS intro
FROM pets;`, c`That gives "Rex the dog", "Whiskers the cat", and so on.`),
  P(c`SELECT 'Code' || ' ' || 'Quest';`, 'Code Quest'),
  X({ q: c`A dog year is said to be 7 human years. Show each pet's ~name~ and its ~age~ multiplied by 7.`, sol: c`SELECT name, age * 7 AS human_years FROM pets;`, hint: c`~age * 7~ is a column like any other.` }),
  X({ q: c`Make one column that reads like ~Rex belongs to Ana~ for every pet.

(Bella has no owner yet, so her line comes out empty. You will see why in the NULL lesson.)`, sol: c`SELECT name || ' belongs to ' || owner FROM pets;`, hint: c`~name || ' belongs to ' || owner~ — mind the spaces inside the quotes.` }),
] },
],
quiz: [
  Q(c`What does ~SELECT name FROM pets;~ return?`, ['Every column of one pet', 'The name of every pet', 'The number of pets', 'An error'], 1),
  P(c`SELECT 9 / 2;`, '4', c`Whole-number division.`),
  Q('Are SQL keywords case-sensitive?', ['Yes — they must be in capitals', 'No', 'Only SELECT is', 'Only in SQLite'], 1),
  P(c`SELECT 'a' || 'b' || 'c';`, 'abc'),
  F('Show name and species.', c`SELECT name[[,]] species FROM pets;`),
  Q(c`What does ~AS~ do in ~SELECT age AS years~?`, ['Changes the column in the table', 'Names the column in this result only', 'Converts the type', 'Sorts by it'], 1),
] });

/* ============ TOPIC 2: FILTERING ============ */
topic({ id: 'filter', title: 'Filtering Rows', icon: '🧹', color: '#1cb0f6', blurb: 'WHERE, AND, OR, LIKE — and the strange case of NULL.', db: 'pets',
lessons: [
{ id: 'where', title: 'WHERE', icon: '🎯', desc: 'Keep only the rows you want.',
  steps: [
  T('Filtering rows', c`~WHERE~ keeps only the rows that match a condition. It comes after ~FROM~.`, c`
SELECT name, age
FROM pets
WHERE species = 'cat';`, c`Text goes in **single quotes**. Numbers do not. Compare with ~=~ ~<>~ (not equal) ~<~ ~>~ ~<=~ ~>=~.`),
  P(c`SELECT name FROM pets WHERE age > 8;`, 'Coco\nOscar', c`Coco is 12 and Oscar is 9. Everyone else is 8 or younger.`),
  Q(c`Why does ~WHERE species = cat~ fail?`, ['Text values need single quotes', 'You must use ==', 'species must be in capitals', 'It works fine'], 0, c`Without quotes, SQLite thinks ~cat~ is a column name and complains: ~no such column: cat~.`),
  X({ q: c`Show the ~name~ of every dog.`, sol: c`SELECT name FROM pets WHERE species = 'dog';`, must: [[c`\bWHERE\b`, c`Filter the rows with ~WHERE~.`]], hint: c`~WHERE species = 'dog'~` }),
  X({ q: c`Show the ~name~ and ~age~ of every pet younger than 3.`, sol: c`SELECT name, age FROM pets WHERE age < 3;`, must: [[c`\bWHERE\b`, c`Use ~WHERE~.`]] }),
  X({ q: c`Show every column for the pet whose ~id~ is 5.`, sol: c`SELECT * FROM pets WHERE id = 5;` }),
  F('Find the pets that are not dogs.', c`SELECT name FROM pets [[WHERE]] species [[<>~!=]] 'dog';`),
] },

{ id: 'logic', title: 'AND, OR, IN, BETWEEN', icon: '🔗', desc: 'Combine conditions, and two handy shortcuts.',
  v: [['1:28:40', '1:34:37', 'AND, OR, NOT']],
  steps: [
  T('More than one condition', c`~AND~ needs both conditions to be true. ~OR~ needs at least one. ~NOT~ flips a condition.`, c`
SELECT name FROM pets
WHERE species = 'dog' AND weight > 20;   -- big dogs

SELECT name FROM pets
WHERE species = 'fish' OR species = 'parrot';`),
  P(c`SELECT name FROM pets WHERE species = 'cat' AND age < 6;`, 'Whiskers\nLuna'),
  T('Shortcuts: IN and BETWEEN', c`~IN~ matches any value in a list. ~BETWEEN~ is an **inclusive** range: both ends count.`, c`
SELECT name FROM pets WHERE owner IN ('Ana', 'Ben');
SELECT name FROM pets WHERE age BETWEEN 2 AND 5;   -- 2, 3, 4 and 5`),
  P(c`SELECT name FROM pets WHERE age BETWEEN 3 AND 7;`, 'Rex\nWhiskers\nMax', c`3, 5 and 7 are all inside, because BETWEEN includes both ends.`),
  Q(c`Which is the same as ~WHERE owner IN ('Ana', 'Dev')~?`, [c`~WHERE owner = 'Ana' AND owner = 'Dev'~`, c`~WHERE owner = 'Ana' OR owner = 'Dev'~`, c`~WHERE owner BETWEEN 'Ana' AND 'Dev'~`, c`~WHERE NOT owner = 'Ana'~`], 1, c`A pet cannot have two owners at once, so the AND version finds nothing.`),
  X({ q: c`Show the ~name~ and ~weight~ of every dog that weighs more than 10.`, sol: c`SELECT name, weight FROM pets WHERE species = 'dog' AND weight > 10;`, must: [[c`\bAND\b`, c`Combine the two conditions with ~AND~.`]] }),
  X({ q: c`Show the ~name~ of every pet owned by Ana, Ben or Cara. Use ~IN~.`, sol: c`SELECT name FROM pets WHERE owner IN ('Ana', 'Ben', 'Cara');`, must: [[c`\bIN\s*\(`, c`Use ~IN (...)~.`]] }),
  X({ q: c`Show the ~name~ and ~age~ of every pet that is **not** a cat and is at least 5 years old.`, sol: c`SELECT name, age FROM pets WHERE species <> 'cat' AND age >= 5;`, hint: c`~species <> 'cat' AND age >= 5~` }),
] },

{ id: 'like', title: 'Patterns with LIKE', icon: '🔤', desc: 'Find text that starts with, ends with or contains something.',
  v: [['1:34:37', '1:38:55', 'Wild cards']],
  steps: [
  T('Wildcards', c`~LIKE~ compares text with a **pattern**. Two wildcards:

~%~ stands for any number of characters (even none). ~_~ stands for exactly one character.`, c`
SELECT name FROM pets WHERE name LIKE 'B%';     -- starts with B
SELECT name FROM pets WHERE name LIKE '%a';     -- ends with a
SELECT name FROM pets WHERE name LIKE '%sk%';   -- contains sk
SELECT name FROM pets WHERE name LIKE '___';    -- exactly three letters`, c`In SQLite, LIKE ignores upper and lower case for English letters.`),
  P(c`SELECT name FROM pets WHERE name LIKE 'B%';`, 'Bubbles\nBella'),
  P(c`SELECT name FROM pets WHERE name LIKE '___';`, 'Rex\nMax', c`Three underscores: exactly three characters.`),
  Q(c`Which pattern finds names that **end** in "s"?`, [c`~'s%'~`, c`~'%s'~`, c`~'%s%'~`, c`~'_s'~`], 1),
  X({ q: c`Show the ~name~ of every pet whose name **contains** the letter "a".`, sol: c`SELECT name FROM pets WHERE name LIKE '%a%';`, must: [[c`\bLIKE\b`, c`Use ~LIKE~ with wildcards.`]], hint: c`~'%a%'~ — anything, then "a", then anything.` }),
  X({ q: c`Show the ~name~ and ~species~ of every pet whose name ends in "o".`, sol: c`SELECT name, species FROM pets WHERE name LIKE '%o';`, must: [[c`\bLIKE\b`, c`Use ~LIKE~.`]] }),
] },

{ id: 'null', title: 'The trouble with NULL', icon: '🕳️', desc: 'Missing values, and why = NULL never works.',
  v: [['0:47:09', '0:50:01', 'NOT NULL']],
  steps: [
  T('NULL means "unknown"', c`Bella has no owner yet, so her ~owner~ is **NULL**: no value at all. Not an empty string, not zero — *unknown*.

That has a strange effect: anything compared with NULL is also unknown, so it never counts as true.`, c`
SELECT name FROM pets WHERE owner = NULL;    -- returns nothing!
SELECT name FROM pets WHERE owner IS NULL;   -- Bella
SELECT name FROM pets WHERE owner IS NOT NULL;`),
  Q(c`How many rows does ~SELECT * FROM pets WHERE owner = NULL;~ return?`, ['1 (Bella)', '0', '8', 'An error'], 1, c`~owner = NULL~ is "unknown" for every row, so no row passes. Always use ~IS NULL~.`),
  P(c`SELECT name FROM pets WHERE owner IS NULL;`, 'Bella'),
  P(c`SELECT 'Bella belongs to ' || NULL;`, 'NULL', c`Joining anything with NULL gives NULL. That is why Bella's line came out empty in the calculated-columns lesson.`),
  T('Choosing a fallback', c`~COALESCE(a, b)~ gives the first value that is not NULL. Perfect for "show this, or a default".`, c`
SELECT name, COALESCE(owner, 'nobody yet') AS owner
FROM pets;`),
  X({ q: c`Show the ~name~ and ~owner~ of every pet that **has** an owner.`, sol: c`SELECT name, owner FROM pets WHERE owner IS NOT NULL;`, must: [[c`IS\s+NOT\s+NULL`, c`Use ~IS NOT NULL~.`]] }),
  X({ q: c`Show each pet's ~name~ and its owner, but show ~up for adoption~ where there is no owner.`, sol: c`SELECT name, COALESCE(owner, 'up for adoption') FROM pets;`, hint: c`~COALESCE(owner, 'up for adoption')~` }),
] },
],
quiz: [
  P(c`SELECT name FROM pets WHERE weight < 1;`, 'Bubbles\nCoco'),
  Q(c`Which finds pets aged 2 to 4, including 2 and 4?`, [c`~age > 2 AND age < 4~`, c`~age BETWEEN 2 AND 4~`, c`~age IN (2, 4)~`, c`~age = 2 OR 4~`], 1),
  Q(c`What does ~name LIKE '_a%'~ match?`, ['Names starting with a', 'Names whose second letter is a', 'Names ending with a', 'Names exactly two letters long'], 1),
  Q(c`How do you find rows where email is missing?`, [c`~WHERE email = NULL~`, c`~WHERE email IS NULL~`, c`~WHERE email = ''~`, c`~WHERE NOT email~`], 1),
  P(c`SELECT name FROM pets WHERE species = 'dog' OR age > 10;`, 'Rex\nMax\nCoco\nBella'),
  F('Find pets owned by Ana or Dev.', c`SELECT name FROM pets WHERE owner [[IN]] ('Ana', 'Dev');`),
] });

/* ============ TOPIC 3: SORTING & LIMITING ============ */
topic({ id: 'sort', title: 'Sorting & Limiting', icon: '📶', color: '#ff9600', blurb: 'ORDER BY, LIMIT and DISTINCT: tidy, short answers.', db: 'pets',
lessons: [
{ id: 'order', title: 'ORDER BY', icon: '🔢', desc: 'Sort the result — and why you must ask.',
  v: [['1:38:55', '1:41:31', 'ORDER BY']],
  steps: [
  T('Sorting', c`Without ~ORDER BY~, a database may return rows in **any** order. If order matters, ask for it.`, c`
SELECT name, age FROM pets ORDER BY age;        -- youngest first (ASC is the default)
SELECT name, age FROM pets ORDER BY age DESC;   -- oldest first
SELECT name, species FROM pets ORDER BY species, name;   -- by species, then name`),
  P(c`SELECT name FROM pets WHERE species = 'cat' ORDER BY age;`, 'Luna\nWhiskers\nOscar', c`Luna is 2, Whiskers 5, Oscar 9.`),
  Q(c`What does ~ORDER BY price DESC~ do?`, ['Cheapest first', 'Most expensive first', 'Removes duplicate prices', 'Sorts by description'], 1),
  X({ q: c`Show every pet's ~name~ and ~age~, **oldest first**.`, sol: c`SELECT name, age FROM pets ORDER BY age DESC;`, must: [[c`ORDER\s+BY`, c`Sort with ~ORDER BY~.`]] }),
  X({ q: c`Show ~species~ and ~name~, sorted by species alphabetically, and within each species by name.`, sol: c`SELECT species, name FROM pets ORDER BY species, name;`, hint: c`~ORDER BY species, name~ — the second column breaks ties in the first.` }),
  F('Heaviest pets first.', c`SELECT name, weight FROM pets [[ORDER]] [[BY]] weight [[DESC]];`),
] },

{ id: 'limit', title: 'LIMIT and OFFSET', icon: '✂️', desc: 'Top 3 lists and page-by-page results.',
  v: [['1:41:31', '1:44:24', 'LIMIT']],
  steps: [
  T('Only the first few rows', c`~LIMIT~ keeps the first rows of the result. Combined with ~ORDER BY~ it answers "top 3" questions.

~OFFSET~ skips rows first, which is how websites show results page by page.`, c`
SELECT name, weight FROM pets ORDER BY weight DESC LIMIT 3;   -- 3 heaviest

SELECT name FROM pets ORDER BY id LIMIT 3;            -- page 1
SELECT name FROM pets ORDER BY id LIMIT 3 OFFSET 3;   -- page 2`),
  P(c`SELECT name FROM pets ORDER BY name LIMIT 2;`, 'Bella\nBubbles'),
  Q(c`Why sort before using LIMIT?`, ['LIMIT does not work without ORDER BY', 'Otherwise "the first 3" could be any 3 rows', 'It is faster', 'It removes duplicates'], 1),
  X({ q: c`Show the ~name~ and ~weight~ of the **3 heaviest** pets.`, sol: c`SELECT name, weight FROM pets ORDER BY weight DESC LIMIT 3;`, must: [[c`\bLIMIT\b`, c`Use ~LIMIT~.`]] }),
  X({ q: c`Results are shown 3 per page, in ~id~ order. Show every column of **page 2**.`, sol: c`SELECT * FROM pets ORDER BY id LIMIT 3 OFFSET 3;`, must: [[c`\bOFFSET\b`, c`Skip the first page with ~OFFSET~.`]] }),
  X({ q: c`Who is the youngest **cat**? Show just its ~name~.`, sol: c`SELECT name FROM pets WHERE species = 'cat' ORDER BY age LIMIT 1;`, hint: c`Filter, sort youngest first, keep one row.` }),
] },

{ id: 'distinct', title: 'DISTINCT', icon: '🦄', desc: 'Each value once.',
  steps: [
  T('No repeats', c`~DISTINCT~ removes duplicate rows from the result. Ask "which species do we have?" without seeing "dog" three times.`, c`
SELECT DISTINCT species FROM pets;
SELECT DISTINCT owner, species FROM pets;   -- distinct pairs`),
  P(c`SELECT DISTINCT species FROM pets ORDER BY species;`, 'cat\ndog\nfish\nparrot'),
  Q(c`~SELECT DISTINCT species FROM pets;~ — how many rows?`, ['8', '4', '3', '1'], 1, c`cat, dog, fish and parrot.`),
  X({ q: c`List each owner **once**, alphabetically, leaving out the pet with no owner.`, sol: c`SELECT DISTINCT owner FROM pets WHERE owner IS NOT NULL ORDER BY owner;`, must: [[c`\bDISTINCT\b`, c`Use ~DISTINCT~.`]], hint: c`~SELECT DISTINCT owner ... WHERE owner IS NOT NULL ORDER BY owner~` }),
  O('Put the clauses in the order SQL requires.', c`
SELECT DISTINCT species
FROM pets
WHERE age > 2
ORDER BY species
LIMIT 2;`, c`SELECT, FROM, WHERE, ORDER BY, LIMIT — always in that order.`),
] },
],
quiz: [
  P(c`SELECT name FROM pets ORDER BY age DESC LIMIT 1;`, 'Coco'),
  Q('Which clause order is valid?', [c`~SELECT … WHERE … FROM …~`, c`~SELECT … FROM … ORDER BY … WHERE …~`, c`~SELECT … FROM … WHERE … ORDER BY … LIMIT …~`, c`~FROM … SELECT … LIMIT …~`], 2),
  P(c`SELECT DISTINCT owner FROM pets WHERE species = 'dog' ORDER BY owner;`, 'NULL\nAna\nDev', c`NULL sorts before everything else in SQLite.`),
  Q(c`What does ~LIMIT 5 OFFSET 10~ return?`, ['Rows 5 to 10', 'Rows 11 to 15', 'Rows 10 to 15', 'Every 5th row'], 1),
  F('Three lightest pets.', c`SELECT name FROM pets ORDER BY weight [[LIMIT]] 3;`),
] });
