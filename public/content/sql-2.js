/* ============ TOPIC 7: SUBQUERIES & SETS ============ */
topic({ id: 'subqueries', title: 'Subqueries & Sets', icon: '🪆', color: '#ffc800', blurb: 'Queries inside queries, named steps with WITH, and UNION.', db: 'shop',
lessons: [
{ id: 'scalar', title: 'A query inside a query', icon: '🪆', desc: 'Use one answer to ask the next question.',
  v: [['2:11:06', '2:17:52', 'Subqueries']],
  steps: [
  T('Subqueries', c`Which products cost more than average? You need the average first — so put that query **inside** the other one, in brackets.`, c`
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);`, c`The inner query runs first and becomes a single value. A subquery that returns one value can go anywhere a value can.`),
  P(c`SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products);`, 'Monitor\nCode Editor Pro', c`The average price is about 50.18.`),
  X({ q: c`Show every column of the **most recent** order(s): the ones whose ~order_date~ equals the latest date in the table.`, sol: c`SELECT * FROM orders WHERE order_date = (SELECT MAX(order_date) FROM orders);`, must: [[c`\(\s*SELECT`, c`Use a subquery: ~(SELECT MAX(order_date) FROM orders)~.`]] }),
  X({ q: c`Show the ~name~ of every customer who joined **after** Ada Lovelace. Find Ada's ~joined~ date with a subquery rather than typing it in.`, sol: c`SELECT name FROM customers WHERE joined > (SELECT joined FROM customers WHERE name = 'Ada Lovelace');`, must: [[c`\(\s*SELECT`, c`Use a subquery to look up Ada's date.`]], not: [[`2024-01-15`, 'No typing the date in — let the subquery find it.']] }),
  Q('Why use a subquery instead of typing in the number?', ['It is faster to type', 'It stays correct when the data changes', 'Subqueries ignore NULL', 'Typed numbers are not allowed'], 1),
] },

{ id: 'in', title: 'IN and NOT IN with subqueries', icon: '📋', desc: 'Match against a whole list that another query builds.',
  steps: [
  T('A list from another query', c`A subquery can return a whole **column** of values. Pair it with ~IN~ or ~NOT IN~.`, c`
-- customers who have ordered a Monitor (product 3)
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE product_id = 3);`, c`This often answers the same questions as a JOIN. Use whichever reads more clearly to you.`),
  P(c`SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE product_id = 3);`, 'Alan Turing\nMargaret Hamilton'),
  X({ q: c`Show the names of products that have **never** been ordered. Use ~NOT IN~ with a subquery this time.`, sol: c`SELECT name FROM products WHERE id NOT IN (SELECT product_id FROM orders);`, must: [[c`NOT\s+IN\s*\(\s*SELECT`, c`Use ~NOT IN (SELECT ...)~.`]] }),
  X({ q: c`Show the names of customers who have bought anything from the **Software** category.`, sol: c`SELECT name FROM customers WHERE id IN (SELECT o.customer_id FROM orders o JOIN products p ON o.product_id = p.id WHERE p.category = 'Software');`, hint: c`The subquery can contain a JOIN of its own.` }),
] },

{ id: 'with', title: 'WITH: name your steps', icon: '🏷️', desc: 'Break a big query into small, readable pieces.',
  steps: [
  T('Common table expressions', c`Big queries get hard to read. ~WITH~ lets you give a subquery a name first, then use it like a table.`, c`
WITH spending AS (
  SELECT c.name, SUM(p.price * o.quantity) AS total
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  JOIN products  p ON o.product_id  = p.id
  GROUP BY c.id
)
SELECT name, total
FROM spending
WHERE total > 150;`, c`The named query is often called a **CTE** (common table expression). It only exists while this query runs.`),
  X({ q: c`Using ~WITH~, first work out each customer's total spend, then show the **names** of customers who spent more than 150.`, sol: c`WITH spending AS (SELECT c.name, SUM(p.price * o.quantity) AS total FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id GROUP BY c.id) SELECT name FROM spending WHERE total > 150;`, must: [[c`^\s*WITH\b`, c`Start with ~WITH name AS (...)~.`]] }),
  X({ q: c`With ~WITH~, count how many orders each ~customer_id~ has, then show the **highest** number of orders anyone has.`, sol: c`WITH counts AS (SELECT customer_id, COUNT(*) AS n FROM orders GROUP BY customer_id) SELECT MAX(n) FROM counts;`, must: [[c`^\s*WITH\b`, c`Use ~WITH~.`]] }),
] },

{ id: 'union', title: 'UNION', icon: '🥞', desc: 'Stack two results on top of each other.',
  v: [['1:44:24', '1:48:37', 'Unions']],
  steps: [
  T('Stacking results', c`~UNION~ puts the rows of two queries into one result. Both must return the **same number of columns**.

~UNION~ removes duplicates; ~UNION ALL~ keeps them (and is faster).`, c`
SELECT name FROM customers WHERE city = 'London'
UNION
SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE product_id = 3);`),
  P(c`SELECT 'a' UNION SELECT 'a';`, 'a'),
  P(c`SELECT 1 UNION ALL SELECT 1;`, '1\n1'),
  X({ q: c`Make one list of names to email: customers who live in **London**, plus customers who have ordered a **Monitor** (product 3). No duplicates.`, sol: c`SELECT name FROM customers WHERE city = 'London' UNION SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE product_id = 3);`, must: [[c`\bUNION\b`, c`Combine the two lists with ~UNION~.`]] }),
  Q(c`What goes wrong with ~SELECT name, city FROM customers UNION SELECT name FROM products;~?`, ['Nothing', 'The two sides have different numbers of columns', 'UNION cannot mix tables', 'It returns duplicates'], 1),
] },
],
quiz: [
  P(c`SELECT COUNT(*) FROM products WHERE price < (SELECT AVG(price) FROM products);`, '6'),
  Q(c`What does ~UNION ALL~ do that ~UNION~ does not?`, ['Keeps duplicate rows', 'Sorts the result', 'Joins the tables side by side', 'Removes NULLs'], 0),
  Q(c`A subquery used with ~=~ must return…`, ['Any number of rows', 'Exactly one value', 'At least two columns', 'A table name'], 1),
  P(c`SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders);`, 'Tim Berners-Lee'),
  F('Name a subquery first.', c`
[[WITH]] cheap [[AS]] (SELECT * FROM products WHERE price < 20)
SELECT name FROM cheap;`),
] });

/* ============ TOPIC 8: CHANGING DATA ============ */
topic({ id: 'changing', title: 'Changing Data', icon: '✏️', color: '#1c8ef6', blurb: 'INSERT, UPDATE, DELETE — and the undo button called ROLLBACK.', db: 'shop',
lessons: [
{ id: 'insert', title: 'INSERT', icon: '➕', desc: 'Add new rows.',
  v: [['0:22:38', '0:28:32', 'Insert rows'], ['1:07:41', '1:11:36', 'Auto increment']],
  steps: [
  T('Adding rows', c`~INSERT INTO~ adds rows. List the columns you are filling, then the values in the same order.`, c`
INSERT INTO customers (name, city, email, joined)
VALUES ('Katherine Johnson', 'Hampton', 'kj@example.com', '2024-11-01');`, c`We left out ~id~: an ~INTEGER PRIMARY KEY~ fills itself in with the next number (7 here). MySQL calls that ~AUTO_INCREMENT~.

Every run starts from a fresh copy of the shop, so practise as much as you like — nothing is kept.`),
  P(c`
INSERT INTO products (name, category, price, stock) VALUES ('Sticker', 'Merch', 2, 500);
SELECT id, name FROM products WHERE name = 'Sticker';`, '9 | Sticker', c`Eight products already exist, so the new one gets id 9.`),
  X({ q: c`Add a new customer: **Katherine Johnson** from **Hampton**, email ~kj@example.com~, joined ~2024-11-01~. Let the ~id~ fill itself in.`, check: 'SELECT * FROM customers ORDER BY id', sol: c`INSERT INTO customers (name, city, email, joined) VALUES ('Katherine Johnson', 'Hampton', 'kj@example.com', '2024-11-01');`, must: [[c`INSERT\s+INTO`, c`Use ~INSERT INTO~.`]], hint: c`~INSERT INTO customers (name, city, email, joined) VALUES (...);~` }),
  X({ q: c`Add **two** products in one statement:

~Webcam~ (Hardware, price 39.99, stock 10) and ~Hoodie~ (Merch, price 30, stock 25).`, check: 'SELECT * FROM products ORDER BY id', sol: c`INSERT INTO products (name, category, price, stock) VALUES ('Webcam', 'Hardware', 39.99, 10), ('Hoodie', 'Merch', 30, 25);`, hint: c`One ~VALUES~ with two bracketed rows separated by a comma.` }),
  Q(c`The shop's ~price~ column has ~CHECK (price >= 0)~. What happens to an INSERT with price -5?`, ['It is stored as 0', 'It is stored as -5', 'The database refuses it', 'The price becomes NULL'], 2),
] },

{ id: 'update', title: 'UPDATE', icon: '🛠️', desc: 'Change rows — carefully.',
  v: [['0:33:32', '0:37:03', 'Update & delete']],
  steps: [
  T('Changing existing rows', c`~UPDATE~ changes values in rows that match a WHERE.`, c`
UPDATE products
SET price = 17.99
WHERE name = 'Mouse';

UPDATE products
SET stock = stock - 1        -- the new value can use the old one
WHERE id = 1;`, c`⚠️ **Forget the WHERE and every row is changed.** A classic, career-defining mistake. Write the WHERE first.`),
  P(c`
UPDATE products SET stock = stock - 1 WHERE id = 1;
SELECT stock FROM products WHERE id = 1;`, '14'),
  X({ q: c`The Mouse is on sale. Change its price to **17.99**.`, check: 'SELECT id, name, price FROM products ORDER BY id', sol: c`UPDATE products SET price = 17.99 WHERE name = 'Mouse';`, must: [[c`\bUPDATE\b`, c`Use ~UPDATE~.`], [c`\bWHERE\b`, c`Only the Mouse should change: use ~WHERE~.`]] }),
  X({ q: c`Raise the price of every **Software** product by 10%. Round the new prices to 2 decimal places.`, check: 'SELECT id, name, price FROM products ORDER BY id', sol: c`UPDATE products SET price = ROUND(price * 1.1, 2) WHERE category = 'Software';`, hint: c`~SET price = ROUND(price * 1.1, 2)~` }),
  X({ q: c`Grace Hopper has no email. Set it to ~grace@example.com~.`, check: 'SELECT id, email FROM customers ORDER BY id', sol: c`UPDATE customers SET email = 'grace@example.com' WHERE name = 'Grace Hopper';` }),
] },

{ id: 'delete', title: 'DELETE', icon: '🗑️', desc: 'Remove rows — and what foreign keys protect.',
  v: [['2:26:50', '2:34:20', 'ON DELETE']],
  steps: [
  T('Removing rows', c`~DELETE FROM~ removes rows that match a WHERE.`, c`
DELETE FROM products WHERE name = 'Mug';`, c`⚠️ Same warning as UPDATE: **without WHERE, every row goes.**

Foreign keys protect you here too: deleting a customer who still has orders is refused, because those orders would point at nobody.`),
  Q(c`What does ~DELETE FROM orders;~ do?`, ['Deletes the orders table', 'Deletes every order', 'Nothing without WHERE', 'Deletes the first order'], 1, c`The table stays, but empty. (Removing the table itself is ~DROP TABLE~.)`),
  X({ q: c`The Mug has been discontinued (nobody ever ordered one). Delete it from ~products~.`, check: 'SELECT id, name FROM products ORDER BY id', sol: c`DELETE FROM products WHERE name = 'Mug';`, must: [[c`\bWHERE\b`, c`Delete only the Mug: use ~WHERE~.`]] }),
  X({ q: c`Delete every order placed **before October 2024**.`, check: 'SELECT id, order_date FROM orders ORDER BY id', sol: c`DELETE FROM orders WHERE order_date < '2024-10-01';` }),
  Q(c`Ada (customer 1) has orders. What happens to ~DELETE FROM customers WHERE id = 1;~ in this shop?`, ['Ada and her orders are deleted', 'Only Ada is deleted', 'It is refused: FOREIGN KEY constraint failed', 'Her orders move to customer 2'], 2, c`Her orders still reference her id. Delete (or reassign) the orders first. Tables can also be set up with ~ON DELETE CASCADE~ to remove them automatically.`),
] },

{ id: 'transactions', title: 'Transactions', icon: '↩️', desc: 'All or nothing — and the undo button.',
  v: [['0:37:03', '0:39:41', 'Autocommit, commit, rollback']],
  steps: [
  T('All or nothing', c`Moving stock from one product to another takes two UPDATEs. If the first runs and the second fails, the data is wrong.

A **transaction** groups statements so they succeed or fail **together**. ~BEGIN~ starts it, ~COMMIT~ makes it permanent, ~ROLLBACK~ undoes everything since BEGIN.`, c`
BEGIN;
UPDATE products SET stock = stock - 5 WHERE id = 4;
UPDATE products SET stock = stock + 5 WHERE id = 8;
COMMIT;`),
  P(c`
BEGIN;
DELETE FROM orders;
ROLLBACK;
SELECT COUNT(*) FROM orders;`, '12', c`ROLLBACK undid the delete: all 12 orders are back.`),
  X({ q: c`In **one transaction**, move 10 units of stock from the USB Cable (id 4) to the Mouse (id 2), and commit it.`, check: 'SELECT id, stock FROM products ORDER BY id', sol: c`BEGIN;
UPDATE products SET stock = stock - 10 WHERE id = 4;
UPDATE products SET stock = stock + 10 WHERE id = 2;
COMMIT;`, must: [[c`\bBEGIN\b`, c`Start with ~BEGIN~.`], [c`\bCOMMIT\b`, c`Finish with ~COMMIT~.`]] }),
  Q(c`After ~BEGIN; UPDATE ...; ROLLBACK;~ what has changed?`, ['The UPDATE is saved', 'Nothing', 'The table is deleted', 'Only the first row changed'], 1),
] },
],
quiz: [
  Q(c`Which statement adds a row?`, [c`~ADD~`, c`~INSERT INTO~`, c`~UPDATE~`, c`~CREATE ROW~`], 1),
  P(c`
UPDATE products SET stock = 0 WHERE category = 'Merch';
SELECT SUM(stock) FROM products WHERE category = 'Merch';`, '0'),
  Q(c`What is the danger in ~UPDATE products SET price = 0;~?`, ['Nothing', 'It sets every product to 0', 'It deletes the table', 'Price cannot be 0'], 1),
  P(c`
DELETE FROM orders WHERE customer_id = 4;
SELECT COUNT(*) FROM orders;`, '9'),
  F('Undo everything since BEGIN.', c`
BEGIN;
DELETE FROM orders;
[[ROLLBACK]];`),
] });

/* ============ TOPIC 9: DESIGNING TABLES ============ */
topic({ id: 'design', title: 'Designing Tables', icon: '📐', color: '#ff86d0', blurb: 'CREATE TABLE, types, constraints, keys, views and indexes.', db: 'empty',
lessons: [
{ id: 'create', title: 'CREATE TABLE', icon: '🧱', desc: 'Make your own tables.',
  v: [['0:14:29', '0:22:38', 'Tables']],
  steps: [
  T('Making a table', c`~CREATE TABLE~ names the table and each column with its **type**. SQLite's main types: ~INTEGER~, ~REAL~ (decimals), ~TEXT~. (MySQL uses ~INT~, ~DECIMAL~, ~VARCHAR(50)~ and more.)`, c`
CREATE TABLE books (
  id     INTEGER PRIMARY KEY,
  title  TEXT,
  author TEXT,
  year   INTEGER
);`, c`This lesson's database starts **empty** — you build everything.`),
  X({ q: c`Create a table called ~books~ with four columns: ~id~ (INTEGER PRIMARY KEY), ~title~ (TEXT), ~author~ (TEXT), ~year~ (INTEGER).`, check: "SELECT name, UPPER(type), pk FROM pragma_table_info('books')", sol: c`CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, year INTEGER);`, hint: c`~CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, ...);~` }),
  X({ q: c`Create the ~books~ table again, then add two books and show them all:

~Dune~ by Frank Herbert (1965) and ~Neuromancer~ by William Gibson (1984).`, sol: c`
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, year INTEGER);
INSERT INTO books (title, author, year) VALUES ('Dune', 'Frank Herbert', 1965), ('Neuromancer', 'William Gibson', 1984);
SELECT * FROM books;`, hint: c`Three statements, each ending with ~;~ — CREATE, INSERT, SELECT.` }),
  Q(c`Which type would you use for a price like 19.99 in SQLite?`, [c`~INTEGER~`, c`~REAL~`, c`~TEXT~`, c`~BOOLEAN~`], 1),
] },

{ id: 'constraints', title: 'Constraints', icon: '🛡️', desc: 'Rules the database enforces for you.',
  v: [['0:42:26', '0:47:09', 'Unique'], ['0:50:01', '0:53:58', 'Check'], ['0:53:58', '1:02:16', 'Default']],
  steps: [
  T('Rules on columns', c`**Constraints** stop bad data getting in, no matter which app writes it.`, c`
CREATE TABLE users (
  id       INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,        -- required, and no two the same
  age      INTEGER CHECK (age >= 13),   -- must pass the test
  role     TEXT DEFAULT 'member'        -- used when no value is given
);`, c`Break a rule and the statement is refused with an error like ~UNIQUE constraint failed: users.username~.`),
  P(c`
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, role TEXT DEFAULT 'member');
INSERT INTO users (name) VALUES ('Ada');
SELECT name, role FROM users;`, 'Ada | member', c`No role was given, so the DEFAULT was used.`),
  Q(c`A column is ~TEXT NOT NULL~. What happens to an INSERT that leaves it out?`, ['It stores an empty string', 'It stores NULL', 'It is refused', 'It uses 0'], 2),
  X({ q: c`Create a table ~players~ with:

~id~ INTEGER PRIMARY KEY · ~name~ TEXT that is **NOT NULL** · ~level~ INTEGER with a **DEFAULT** of 1.`, check: "SELECT name, UPPER(type), \"notnull\", dflt_value, pk FROM pragma_table_info('players')", sol: c`CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT NOT NULL, level INTEGER DEFAULT 1);` }),
  F('Make usernames required and unique.', c`
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  username TEXT [[NOT NULL]] [[UNIQUE]]
);`),
] },

{ id: 'fk', title: 'Foreign keys', icon: '🔗', desc: 'Link your own tables together.',
  steps: [
  T('REFERENCES', c`To link tables, give the child table a column that ~REFERENCES~ the parent's primary key.`, c`
CREATE TABLE authors (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE books (
  id        INTEGER PRIMARY KEY,
  title     TEXT NOT NULL,
  author_id INTEGER REFERENCES authors(id)
);`, c`Now a book cannot point at an author who does not exist. (SQLite only enforces this when ~PRAGMA foreign_keys = ON~ — this course switches it on for you.)`),
  X({ q: c`Create ~authors~ (~id~, ~name~) and ~books~ (~id~, ~title~, ~author_id~) where ~books.author_id~ **references** ~authors(id)~.`, check: "SELECT \"table\", \"from\", \"to\" FROM pragma_foreign_key_list('books')", sol: c`
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id));`, must: [[c`\bREFERENCES\b`, c`Link the tables with ~REFERENCES authors(id)~.`]] }),
  X({ q: c`Create the two tables again, add the author **Ursula K. Le Guin** and her book **The Dispossessed**, then show the book title next to the author's name using a JOIN.`, sol: c`
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id));
INSERT INTO authors (name) VALUES ('Ursula K. Le Guin');
INSERT INTO books (title, author_id) VALUES ('The Dispossessed', 1);
SELECT b.title, a.name FROM books b JOIN authors a ON b.author_id = a.id;`, hint: c`The first author gets id 1, so the book's ~author_id~ is 1.` }),
] },

{ id: 'alter', title: 'ALTER, views and indexes', icon: '🏗️', desc: 'Change tables, save queries, make searches fast.', db: 'pets',
  v: [['1:58:39', '2:04:41', 'Views'], ['2:04:41', '2:11:06', 'Indexes']],
  steps: [
  T('Changing and removing tables', c`Tables can change after they are made:`, c`
ALTER TABLE pets ADD COLUMN vaccinated INTEGER DEFAULT 0;
ALTER TABLE pets RENAME TO animals;
DROP TABLE animals;          -- gone, with all its rows`, c`~DROP TABLE~ has no undo outside a transaction. Treat it with respect.`),
  X({ q: c`Add a column ~chipped~ (INTEGER) to ~pets~ with a default of ~0~.`, check: "SELECT name, UPPER(type), dflt_value FROM pragma_table_info('pets')", sol: c`ALTER TABLE pets ADD COLUMN chipped INTEGER DEFAULT 0;` }),
  T('Views: saved queries', c`A **view** is a query with a name. You select from it like a table, and it always shows the current data.`, c`
CREATE VIEW cats AS
SELECT id, name, age FROM pets WHERE species = 'cat';

SELECT * FROM cats;`),
  X({ q: c`Create a view called ~dogs~ showing the ~id~, ~name~ and ~weight~ of every dog.`, check: 'SELECT * FROM dogs ORDER BY id', sol: c`CREATE VIEW dogs AS SELECT id, name, weight FROM pets WHERE species = 'dog';`, must: [[c`CREATE\s+VIEW`, c`Use ~CREATE VIEW~.`]] }),
  T('Indexes: fast lookups', c`Finding one row in millions means checking every row — unless there is an **index**, which works like the index at the back of a book.`, c`CREATE INDEX idx_pets_owner ON pets(owner);`, c`Indexes make reading faster but writing slightly slower, so add them to columns you search or join on often. Primary keys get one automatically.`),
  X({ q: c`Create an index called ~idx_pets_species~ on the ~species~ column of ~pets~.`, check: "SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'pets'", sol: c`CREATE INDEX idx_pets_species ON pets(species);` }),
] },
],
quiz: [
  Q(c`Which constraint stops two rows having the same email?`, [c`~NOT NULL~`, c`~UNIQUE~`, c`~DEFAULT~`, c`~CHECK~`], 1),
  Q(c`What does ~DROP TABLE pets;~ do?`, ['Deletes every row but keeps the table', 'Removes the table completely', 'Hides the table', 'Removes one column'], 1),
  Q('What is a view?', ['A copy of a table', 'A saved query you can select from', 'An index', 'A backup'], 1),
  P(c`
CREATE TABLE t (id INTEGER PRIMARY KEY, n INTEGER DEFAULT 5);
INSERT INTO t DEFAULT VALUES;
SELECT n FROM t;`, '5'),
  F('Link the tables.', c`
CREATE TABLE lessons (
  id INTEGER PRIMARY KEY,
  course_id INTEGER [[REFERENCES]] courses(id)
);`, null, 1),
] });

/* ============ TOPIC 10: FINAL BOSS ============ */
topic({ id: 'boss', title: 'Final Boss', icon: '👑', color: '#c0c7ff', blurb: 'Real questions, real answers. Everything you have learned, combined.', db: 'shop',
lessons: [
{ id: 'questions', title: 'Questions from the boss', icon: '💼', desc: 'Your manager has questions. Only SQL can answer them.',
  steps: [
  T('You are the data person now', c`No new syntax here. Each challenge is a question a real business would ask. Plan before you type: **which tables? which rows? one answer per what?**

Open **📋 Look inside the database** whenever you need to check a column name.`),
  X({ q: c`"What is our **best-selling product** by units sold?" Show its name and the number of units.`, sol: c`SELECT p.name, SUM(o.quantity) AS units FROM orders o JOIN products p ON o.product_id = p.id GROUP BY p.id ORDER BY units DESC LIMIT 1;`, hint: c`JOIN orders to products, GROUP BY product, SUM the quantity, sort, LIMIT 1.` }),
  X({ q: c`"What was our total **revenue each month**?" Show the month as ~YYYY-MM~ and the revenue rounded to 2 decimal places, in month order.`, sol: c`SELECT strftime('%Y-%m', o.order_date) AS month, ROUND(SUM(p.price * o.quantity), 2) FROM orders o JOIN products p ON o.product_id = p.id GROUP BY month ORDER BY month;`, hint: c`~strftime('%Y-%m', order_date)~ gives "2024-09". Group by it.` }),
  X({ q: c`"Which products are **running low**?" Show the name and stock of every product with fewer than 10 in stock **that someone has ordered at least once**, lowest stock first.`, sol: c`SELECT name, stock FROM products WHERE stock < 10 AND id IN (SELECT product_id FROM orders) ORDER BY stock;` }),
  X({ q: c`"Which customers have spent **more than the average customer**?" Show their names. (Average over customers who have ordered.)`, sol: c`WITH spending AS (SELECT o.customer_id, SUM(p.price * o.quantity) AS total FROM orders o JOIN products p ON o.product_id = p.id GROUP BY o.customer_id) SELECT c.name FROM spending s JOIN customers c ON s.customer_id = c.id WHERE s.total > (SELECT AVG(total) FROM spending);`, hint: c`WITH to get each customer's total, then compare each total with ~(SELECT AVG(total) FROM spending)~.` }),
] },

{ id: 'build', title: 'Build it from scratch', icon: '🏗️', desc: 'Design, fill and query a database of your own.', db: 'empty',
  steps: [
  T('The last challenge', c`An empty database and a brief. Design the tables, fill them, and answer a question — all in one go. This is what real database work looks like.`),
  X({ q: c`Build a tiny **music library**:

1. ~artists~ (~id~, ~name~) and ~songs~ (~id~, ~title~, ~artist_id~ referencing ~artists~, ~plays~ INTEGER)
2. Artists: **Daft Punk** and **ABBA**
3. Songs: "One More Time" (Daft Punk, 900 plays), "Around the World" (Daft Punk, 650), "Dancing Queen" (ABBA, 1200)
4. Finally, show each artist's name and their **total plays**, highest first.`, sol: c`
CREATE TABLE artists (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE songs (id INTEGER PRIMARY KEY, title TEXT NOT NULL, artist_id INTEGER REFERENCES artists(id), plays INTEGER);
INSERT INTO artists (name) VALUES ('Daft Punk'), ('ABBA');
INSERT INTO songs (title, artist_id, plays) VALUES ('One More Time', 1, 900), ('Around the World', 1, 650), ('Dancing Queen', 2, 1200);
SELECT a.name, SUM(s.plays) AS total FROM songs s JOIN artists a ON s.artist_id = a.id GROUP BY a.id ORDER BY total DESC;`, hint: c`Daft Punk gets id 1 and ABBA id 2, because they are inserted in that order.` }),
  T('Where next?', c`You can now ask a database almost any question — and change it safely. That is a genuinely valuable skill.

**Try a real database:** install SQLite or MySQL and connect to it from Python or JavaScript, which you can learn here too.

**Go deeper:** window functions (~ROW_NUMBER() OVER (...)~), normalisation, and stored procedures and triggers (the last two chapters of Bro Code's video).`),
] },
],
quiz: [
  Q('Which clause filters groups after GROUP BY?', [c`~WHERE~`, c`~HAVING~`, c`~LIMIT~`, c`~ON~`], 1),
  P(c`SELECT COUNT(DISTINCT customer_id) FROM orders;`, '5'),
  Q(c`To list every customer with their orders, including customers with none, use…`, [c`~INNER JOIN~`, c`~LEFT JOIN~ from customers`, c`~UNION~`, c`~GROUP BY~`], 1),
  P(c`SELECT category FROM products GROUP BY category HAVING COUNT(*) = 1;`, 'Merch'),
  Q(c`What makes ~UPDATE~ and ~DELETE~ dangerous?`, ['They are slow', 'Without WHERE they affect every row', 'They cannot be undone inside a transaction', 'They delete tables'], 1),
  F('Count orders per customer, busiest first.', c`SELECT customer_id, COUNT(*) AS n FROM orders [[GROUP]] BY customer_id [[ORDER]] BY n DESC;`),
] });
