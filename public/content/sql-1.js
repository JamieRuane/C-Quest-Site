/* ============ TOPIC 4: FUNCTIONS & CASE ============ */
topic({ id: 'functions', title: 'Functions & CASE', icon: '🧰', color: '#ce82ff', blurb: 'Reshape text, numbers and dates — and add if/else to a query.', db: 'shop',
lessons: [
{ id: 'meet-shop', title: 'Meet the shop', icon: '🛒', desc: 'A new database with three tables that work together.',
  steps: [
  T('A bigger database', c`From here on most lessons use the **shop** database: a small online shop with three tables.

**customers** — who buys (~id~, ~name~, ~city~, ~email~, ~joined~)

**products** — what is for sale (~id~, ~name~, ~category~, ~price~, ~stock~)

**orders** — who bought what (~id~, ~customer_id~, ~product_id~, ~quantity~, ~order_date~)

Open **📋 Look inside the database** on the next steps and have a look around. Notice that an order does not store the customer's name — just their ~id~. That idea is the key to the Joins topic.`),
  X({ q: c`Warm-up: show every column of the ~products~ table.`, sol: c`SELECT * FROM products;` }),
  X({ q: c`Show the ~name~ and ~price~ of every **Hardware** product, cheapest first.`, sol: c`SELECT name, price FROM products WHERE category = 'Hardware' ORDER BY price;` }),
  X({ q: c`Show the ~name~ and ~city~ of every customer who lives in London.`, sol: c`SELECT name, city FROM customers WHERE city = 'London';` }),
] },

{ id: 'text', title: 'Text functions', icon: '🔤', desc: 'UPPER, LENGTH, SUBSTR, REPLACE and friends.',
  v: [['1:24:55', '1:28:40', 'Functions']],
  steps: [
  T('Functions on text', c`A **function** takes values in brackets and gives one back. They work on every row.`, c`
SELECT UPPER(name),              -- KEYBOARD
       LOWER(name),              -- keyboard
       LENGTH(name),             -- 8
       SUBSTR(name, 1, 3),       -- Key   (start at character 1, take 3)
       REPLACE(name, 'board', 'BOARD')
FROM products;`, c`~INSTR(text, 'x')~ tells you where ~'x'~ first appears (0 if it does not).`),
  P(c`SELECT UPPER('sql') || LENGTH('quest');`, 'SQL5'),
  P(c`SELECT SUBSTR('Code Quest', 6, 5);`, 'Quest', c`Start at character 6 (the Q) and take 5 characters.`),
  X({ q: c`Show every product ~name~ in capital letters, next to how many characters the name has.`, sol: c`SELECT UPPER(name), LENGTH(name) FROM products;`, must: [[c`UPPER\s*\(`, c`Use ~UPPER()~.`], [c`LENGTH\s*\(`, c`Use ~LENGTH()~.`]] }),
  X({ q: c`Show each customer's **first name** only — the part of ~name~ before the space.

Ada Lovelace → ~Ada~`, sol: c`SELECT SUBSTR(name, 1, INSTR(name, ' ') - 1) FROM customers;`, hint: c`~INSTR(name, ' ')~ is where the space is. Take everything before it: ~SUBSTR(name, 1, INSTR(name, ' ') - 1)~.` }),
  X({ q: c`Show the ~name~ of every customer whose email is at ~example.com~, with the email changed to end in ~@codequest.dev~ instead.`, sol: c`SELECT name, REPLACE(email, '@example.com', '@codequest.dev') FROM customers WHERE email LIKE '%@example.com';`, hint: c`~REPLACE(email, '@example.com', '@codequest.dev')~ — and leave out the customer with no email.` }),
] },

{ id: 'numbers', title: 'Numbers and dates', icon: '📅', desc: 'ROUND, calculations across columns, and dates stored as text.',
  v: [['0:39:41', '0:42:26', 'Current date & time']],
  steps: [
  T('Numbers', c`Columns can be combined in calculations, and ~ROUND(x, places)~ tidies the answer.`, c`
SELECT name,
       price * stock            AS stock_value,
       ROUND(price * 1.2, 2)    AS price_with_tax
FROM products;`),
  P(c`SELECT ROUND(2.567, 1), ROUND(2.5);`, '2.6 | 3'),
  X({ q: c`Show each product's ~name~ and the total value of its stock (~price~ × ~stock~), rounded to 2 decimal places, **most valuable first**.`, sol: c`SELECT name, ROUND(price * stock, 2) AS stock_value FROM products ORDER BY stock_value DESC;`, hint: c`You can sort by an alias: ~ORDER BY stock_value DESC~.` }),
  T('Dates', c`SQLite has no special date type: dates are stored as text in the form ~YYYY-MM-DD~. That form sorts and compares correctly, so ~joined < '2024-07-01'~ just works.

~strftime~ pulls parts out of a date, and ~date~ does date maths:`, c`
SELECT strftime('%Y', joined) AS year,      -- 2024
       strftime('%m', joined) AS month,     -- 01
       date(joined, '+30 days') AS trial_end,
       date('now') AS today
FROM customers;`, c`MySQL has a real ~DATE~ type and different functions (~YEAR(joined)~, ~CURRENT_DATE()~), but the idea is the same.`),
  P(c`SELECT strftime('%m', '2024-09-15'), date('2024-01-31', '+1 day');`, '09 | 2024-02-01'),
  X({ q: c`Show the ~name~ and ~joined~ date of every customer who joined **before July 2024**.`, sol: c`SELECT name, joined FROM customers WHERE joined < '2024-07-01';`, hint: c`Compare the text: ~joined < '2024-07-01'~.` }),
  X({ q: c`Show the ~id~ and ~order_date~ of every order placed in **October** (any year).`, sol: c`SELECT id, order_date FROM orders WHERE strftime('%m', order_date) = '10';`, must: [[c`strftime`, c`Use ~strftime('%m', ...)~ to get the month.`]] }),
] },

{ id: 'case', title: 'CASE: if/else in a query', icon: '🔀', desc: 'Turn values into labels.',
  steps: [
  T('If/else inside SQL', c`~CASE~ checks conditions from the top and uses the first one that is true. ~ELSE~ covers everything else.`, c`
SELECT name, price,
       CASE
         WHEN price < 20 THEN 'budget'
         WHEN price < 60 THEN 'mid-range'
         ELSE 'premium'
       END AS band
FROM products;`, c`It always ends with ~END~. Without an ~ELSE~, rows that match nothing get NULL.`),
  P(c`SELECT CASE WHEN 5 > 3 THEN 'yes' ELSE 'no' END;`, 'yes'),
  P(c`SELECT CASE WHEN 1 = 2 THEN 'a' END;`, 'NULL', c`No condition matched and there is no ELSE.`),
  X({ q: c`Show each product's ~name~ and ~sold out~ when its stock is 0, otherwise ~in stock~.`, sol: c`SELECT name, CASE WHEN stock = 0 THEN 'sold out' ELSE 'in stock' END FROM products;`, must: [[c`\bCASE\b`, c`Use ~CASE~.`]] }),
  X({ q: c`Label each product by price: under 20 → ~budget~, under 60 → ~mid-range~, anything else → ~premium~. Show ~name~ and the label.`, sol: c`SELECT name, CASE WHEN price < 20 THEN 'budget' WHEN price < 60 THEN 'mid-range' ELSE 'premium' END FROM products;`, must: [[c`\bCASE\b`, c`Use ~CASE~.`]], hint: c`Three branches: two ~WHEN~s and an ~ELSE~. The order of the WHENs matters.` }),
  F('Finish the CASE.', c`
SELECT name,
  [[CASE]] WHEN stock > 100 THEN 'plenty' [[ELSE]] 'some' [[END]]
FROM products;`),
] },
],
quiz: [
  P(c`SELECT LENGTH('database');`, '8'),
  P(c`SELECT ROUND(10 / 3.0, 2);`, '3.33'),
  Q(c`How are dates usually stored in SQLite?`, ['As a special DATE type', c`As text like ~'2024-09-15'~`, 'As the number of days since 1900', 'They cannot be stored'], 1),
  P(c`SELECT CASE WHEN 7 % 2 = 0 THEN 'even' ELSE 'odd' END;`, 'odd'),
  Q(c`What does ~SUBSTR('Hello', 2, 3)~ give?`, [c`~'Hel'~`, c`~'ell'~`, c`~'llo'~`, c`~'el'~`], 1),
  F('Name in capitals.', c`SELECT [[UPPER]](name) FROM customers;`),
] });

/* ============ TOPIC 5: SUMMARIES ============ */
topic({ id: 'summaries', title: 'Summarising Data', icon: '📊', color: '#ff4b4b', blurb: 'COUNT, SUM, AVG — and GROUP BY for one answer per group.', db: 'shop',
lessons: [
{ id: 'aggregates', title: 'COUNT, SUM, AVG, MIN, MAX', icon: '🧮', desc: 'Many rows in, one answer out.',
  steps: [
  T('Aggregate functions', c`**Aggregate** functions squash many rows into one value.`, c`
SELECT COUNT(*)      FROM customers;   -- how many rows
SELECT SUM(quantity) FROM orders;      -- add them all up
SELECT AVG(price)    FROM products;    -- average
SELECT MIN(price), MAX(price) FROM products;`, c`They skip NULLs. So ~COUNT(*)~ counts rows, but ~COUNT(email)~ counts only rows that have an email.`),
  P(c`SELECT COUNT(*), COUNT(email) FROM customers;`, '6 | 5', c`Grace Hopper has no email, so COUNT(email) skips her.`),
  Q(c`What does ~SELECT COUNT(*) FROM orders WHERE quantity > 1;~ return?`, ['The quantities over 1', 'How many orders have a quantity over 1', 'The total quantity', 'Every order'], 1),
  X({ q: c`How many units have been ordered in total? (Add up ~quantity~ in ~orders~.)`, sol: c`SELECT SUM(quantity) FROM orders;`, must: [[c`SUM\s*\(`, c`Use ~SUM()~.`]] }),
  X({ q: c`Show the cheapest and the most expensive price in ~products~, in that order.`, sol: c`SELECT MIN(price), MAX(price) FROM products;` }),
  X({ q: c`What is the average price of a **Software** product? Round it to 2 decimal places.`, sol: c`SELECT ROUND(AVG(price), 2) FROM products WHERE category = 'Software';`, hint: c`WHERE runs first, then AVG works on the rows that are left.` }),
] },

{ id: 'group', title: 'GROUP BY', icon: '🧺', desc: 'One answer per category, per customer, per anything.',
  v: [['2:17:52', '2:23:00', 'GROUP BY'], ['2:23:00', '2:26:50', 'ROLLUP (MySQL)']],
  steps: [
  T('A summary per group', c`~GROUP BY~ splits rows into groups that share a value, then the aggregate runs **once per group**.`, c`
SELECT category, COUNT(*) AS products, AVG(price) AS avg_price
FROM products
GROUP BY category;`, c`Rule of thumb: every column in the SELECT is either in the GROUP BY or inside an aggregate.`),
  P(c`SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY category;`, 'Accessories | 2\nHardware | 3\nMerch | 1\nSoftware | 2'),
  Q(c`~SELECT city, COUNT(*) FROM customers GROUP BY city;~ — how many rows come back?`, ['6, one per customer', 'One per different city', '1', '2'], 1, c`London appears twice but becomes one group.`),
  X({ q: c`How many customers live in each city? Show ~city~ and the count.`, sol: c`SELECT city, COUNT(*) FROM customers GROUP BY city;`, must: [[c`GROUP\s+BY`, c`Use ~GROUP BY~.`]] }),
  X({ q: c`For each ~product_id~, show the total ~quantity~ ordered. Biggest total first.`, sol: c`SELECT product_id, SUM(quantity) AS units FROM orders GROUP BY product_id ORDER BY units DESC, product_id;`, ordered: false, hint: c`~GROUP BY product_id~, ~SUM(quantity)~, ~ORDER BY ... DESC~.` }),
  X({ q: c`Show each ~category~ with its average price rounded to 2 decimal places, alphabetically by category.`, sol: c`SELECT category, ROUND(AVG(price), 2) FROM products GROUP BY category ORDER BY category;` }),
] },

{ id: 'having', title: 'HAVING', icon: '🚧', desc: 'Filter the groups, not the rows.',
  steps: [
  T('WHERE versus HAVING', c`~WHERE~ filters **rows** before they are grouped. ~HAVING~ filters **groups** after aggregating, so it can use ~COUNT~, ~SUM~ and friends.`, c`
SELECT customer_id, COUNT(*) AS orders
FROM orders
WHERE quantity >= 1           -- rows first
GROUP BY customer_id
HAVING COUNT(*) > 2;          -- then whole groups`, c`The full order of clauses: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.`),
  Q(c`Why does ~WHERE COUNT(*) > 2~ fail?`, ['COUNT needs a column name', 'WHERE runs before the groups exist, so there is nothing to count yet', 'It should be WHERE COUNT > 2', 'It works fine'], 1),
  P(c`SELECT customer_id FROM orders GROUP BY customer_id HAVING SUM(quantity) >= 4 ORDER BY customer_id;`, '1\n4'),
  X({ q: c`Which customers (by ~customer_id~) have placed **more than 2** orders? Show the id and the number of orders.`, sol: c`SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id HAVING COUNT(*) > 2;`, must: [[c`\bHAVING\b`, c`Filter the groups with ~HAVING~.`]] }),
  X({ q: c`Which categories have an average price **over 30**? Show the category only.`, sol: c`SELECT category FROM products GROUP BY category HAVING AVG(price) > 30;`, must: [[c`\bHAVING\b`, c`Use ~HAVING~.`]] }),
  O('Put the clauses in the right order.', c`
SELECT category, COUNT(*)
FROM products
WHERE price > 5
GROUP BY category
HAVING COUNT(*) > 1
ORDER BY category;`),
] },
],
quiz: [
  P(c`SELECT COUNT(*) FROM products WHERE stock = 0;`, '1'),
  Q(c`Which counts only customers who have an email?`, [c`~COUNT(*)~`, c`~COUNT(email)~`, c`~SUM(email)~`, c`~COUNT(NULL)~`], 1),
  P(c`SELECT MAX(quantity) FROM orders;`, '5'),
  Q(c`Where does ~HAVING~ go?`, ['Before WHERE', 'After GROUP BY', 'After ORDER BY', 'Instead of FROM'], 1),
  P(c`SELECT COUNT(DISTINCT city) FROM customers;`, '5', c`~DISTINCT~ inside COUNT counts each city once: London only once.`),
  F('Count customers per city.', c`SELECT city, [[COUNT]](*) FROM customers [[GROUP]] BY city;`),
] });

/* ============ TOPIC 6: JOINS ============ */
topic({ id: 'joins', title: 'Joining Tables', icon: '🔗', color: '#00cd9c', blurb: 'Keys link tables together. JOIN puts them back side by side.', db: 'shop',
lessons: [
{ id: 'keys', title: 'Keys: how tables link up', icon: '🔑', desc: 'Primary keys, foreign keys, and why data is split up.',
  v: [['1:02:16', '1:07:41', 'Primary keys'], ['1:11:36', '1:19:52', 'Foreign keys']],
  steps: [
  T('Why split data into tables?', c`Imagine storing the customer's name and email in every order. Ada has three orders, so her email would be written three times — and if she changes it, three rows must be updated. Miss one and the data disagrees with itself.

Instead, each fact lives in **one** place, and tables point at each other:

**Primary key** — a column that uniquely identifies each row (~customers.id~).

**Foreign key** — a column holding another table's primary key (~orders.customer_id~ points to ~customers.id~).`),
  P(c`SELECT customer_id, product_id FROM orders WHERE id = 3;`, '2 | 3', c`Order 3 was placed by customer 2 and is for product 3. Now look them up: who is customer 2, and what is product 3?`),
  Q('Order 3 has customer_id 2 and product_id 3. Using the other tables, what happened?', ['Ada Lovelace bought a Mouse', 'Alan Turing bought a Monitor', 'Alan Turing bought a Mouse', 'Grace Hopper bought a Monitor'], 1, c`customers.id 2 is Alan Turing; products.id 3 is the Monitor. Looking things up by hand like this is exactly what JOIN automates.`),
  Q(c`Which column is a **foreign key**?`, [c`~customers.id~`, c`~products.name~`, c`~orders.product_id~`, c`~orders.id~`], 2),
  T('Keys keep you honest', c`A foreign key is also a promise the database enforces. This shop's tables are created with ~REFERENCES~, so an order for customer 99 — who does not exist — is refused:`, c`INSERT INTO orders (customer_id, product_id, quantity) VALUES (99, 1, 1);
-- FOREIGN KEY constraint failed`),
] },

{ id: 'inner', title: 'INNER JOIN', icon: '🤝', desc: 'Put orders and customers side by side.',
  v: [['1:19:52', '1:24:55', 'Joins']],
  steps: [
  T('JOIN ... ON', c`~JOIN~ combines two tables. ~ON~ says which rows belong together — almost always "foreign key = primary key".`, c`
SELECT orders.id, customers.name, orders.quantity
FROM orders
JOIN customers ON orders.customer_id = customers.id;`, c`Each order is matched with its customer. Plain ~JOIN~ means ~INNER JOIN~: only rows with a match on both sides appear.`),
  T('Short table names', c`Writing ~customers.name~ everywhere gets long. Give each table a short alias after its name:`, c`
SELECT o.id, c.name, o.quantity
FROM orders o
JOIN customers c ON o.customer_id = c.id;`, c`When both tables have a column with the same name (both have ~id~ and ~name~), you **must** say which one you mean.`),
  P(c`SELECT c.name FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.id = 4;`, 'Grace Hopper'),
  X({ q: c`For every order, show the order ~id~ and the **customer's name**, in order id order.`, sol: c`SELECT o.id, c.name FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.id;`, must: [[c`\bJOIN\b`, c`Use ~JOIN~.`]] }),
  X({ q: c`For every order, show the **product name** and the ~quantity~.`, sol: c`SELECT p.name, o.quantity FROM orders o JOIN products p ON o.product_id = p.id;`, must: [[c`\bJOIN\b`, c`Use ~JOIN~.`]], hint: c`Join ~products~ this time: ~ON o.product_id = p.id~.` }),
  X({ q: c`Which products did **Ada Lovelace** order? Show just the product names.`, sol: c`SELECT p.name FROM orders o JOIN products p ON o.product_id = p.id JOIN customers c ON o.customer_id = c.id WHERE c.name = 'Ada Lovelace';`, hint: c`You need all three tables: orders in the middle, joined to customers and to products.` }),
  F('Join orders to customers.', c`
SELECT o.id, c.name
FROM orders o
[[JOIN]] customers c [[ON]] o.customer_id = c.[[id]];`),
] },

{ id: 'left', title: 'LEFT JOIN', icon: '⬅️', desc: 'Keep everyone — even those with no match.',
  v: [['1:48:37', '1:58:39', 'Self joins']],
  steps: [
  T('Rows with no partner', c`Tim Berners-Lee has never ordered anything, so an INNER JOIN between customers and orders leaves him out completely.

~LEFT JOIN~ keeps **every** row of the left table. Where the right table has no match, its columns are filled with NULL.`, c`
SELECT c.name, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
-- Tim Berners-Lee | NULL`),
  Q(c`~customers LEFT JOIN orders~ — which customers appear?`, ['Only customers with orders', 'Every customer, with or without orders', 'Only customers without orders', 'Only orders without customers'], 1),
  X({ q: c`Which customers have **never** ordered anything? Show their names.`, sol: c`SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;`, must: [[c`LEFT\s+JOIN`, c`Use a ~LEFT JOIN~.`]], hint: c`LEFT JOIN, then keep the rows where the order side is NULL: ~WHERE o.id IS NULL~.` }),
  X({ q: c`Which products have **never** been ordered? Show their names.`, sol: c`SELECT p.name FROM products p LEFT JOIN orders o ON o.product_id = p.id WHERE o.id IS NULL;`, must: [[c`LEFT\s+JOIN`, c`Use a ~LEFT JOIN~.`]] }),
  X({ q: c`Show **every** customer's name and how many orders they have placed — including the ones with 0.`, sol: c`SELECT c.name, COUNT(o.id) FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.id;`, must: [[c`LEFT\s+JOIN`, c`Use a ~LEFT JOIN~ so customers without orders stay in.`]], hint: c`~COUNT(o.id)~, not ~COUNT(*)~: it skips the NULL, so Tim gets 0 instead of 1.` }),
  P(c`SELECT COUNT(*), COUNT(o.id) FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE c.name = 'Tim Berners-Lee';`, '1 | 0', c`One row exists for Tim, but there is no order on it: ~COUNT(*)~ counts the row, ~COUNT(o.id)~ counts orders.`),
] },

{ id: 'together', title: 'Joins + summaries', icon: '💰', desc: 'Real business questions: who spent the most?',
  steps: [
  T('Everything together', c`Joins and GROUP BY combine naturally: join to get the facts side by side, then summarise them.`, c`
SELECT c.name, SUM(p.price * o.quantity) AS spent
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products  p ON o.product_id  = p.id
GROUP BY c.id
ORDER BY spent DESC;`),
  X({ q: c`How much has each customer spent? Show the ~name~ and the total (price × quantity), **biggest spender first**. Round to 2 decimal places.`, sol: c`SELECT c.name, ROUND(SUM(p.price * o.quantity), 2) AS spent FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id GROUP BY c.id ORDER BY spent DESC;`, hint: c`Three tables, ~GROUP BY c.id~, ~SUM(p.price * o.quantity)~.` }),
  X({ q: c`How many units of each **category** have been sold? Show ~category~ and the total quantity, alphabetically.`, sol: c`SELECT p.category, SUM(o.quantity) FROM orders o JOIN products p ON o.product_id = p.id GROUP BY p.category ORDER BY p.category;` }),
  X({ q: c`Which **city** spends the most? Show just the top city and its total, rounded to 2 decimal places.`, sol: c`SELECT c.city, ROUND(SUM(p.price * o.quantity), 2) AS spent FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id GROUP BY c.city ORDER BY spent DESC LIMIT 1;`, hint: c`Like the spender question, but ~GROUP BY c.city~ and ~LIMIT 1~.` }),
] },
],
quiz: [
  Q(c`What does an INNER JOIN leave out?`, ['Nothing', 'Rows without a match in the other table', 'Duplicate rows', 'NULL columns'], 1),
  P(c`SELECT p.name FROM orders o JOIN products p ON o.product_id = p.id WHERE o.id = 12;`, 'USB Cable'),
  Q(c`To list every product, including ones never ordered, you use…`, [c`~products JOIN orders~`, c`~products LEFT JOIN orders~`, c`~orders LEFT JOIN products~`, c`~products UNION orders~`], 1),
  P(c`SELECT COUNT(*) FROM orders o JOIN customers c ON o.customer_id = c.id WHERE c.city = 'London';`, '3'),
  Q(c`~orders.customer_id~ is…`, ['a primary key', 'a foreign key', 'an index', 'an alias'], 1),
  F('Keep customers without orders.', c`SELECT c.name, o.id FROM customers c [[LEFT]] JOIN orders o ON o.customer_id = c.id;`),
] });
