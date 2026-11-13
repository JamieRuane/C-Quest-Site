/* Runs SQL for the SQL course with sql.js (real SQLite, compiled to WebAssembly). Used by the site in the browser
   and by tools/verify.js in Node, so both always agree.

   Every run gets a brand-new database: the lesson's dataset is loaded, then the learner's SQL runs. Nothing a
   learner does can affect the next run, another exercise or anyone else.

   runSql(SQL, setup, code, check) -> { ok: true, sets, last, changed } or { ok: false, error }
     setup  the dataset script (CREATE TABLE + INSERT ...), or '' for an empty database
     check  optional query run AFTER the learner's SQL, e.g. 'SELECT * FROM pets ORDER BY id' to see what an
            INSERT or UPDATE did. Its result becomes `last`.
     sets   every result table, in order: [{ columns: [...], rows: [[...], ...] }] (values already as text)
     last   the table that is marked: the check query's result, else the learner's last result table
     changed  how many rows INSERT / UPDATE / DELETE changed in total
   sameResult(expected, got, ordered) compares two `last` tables: same number of columns and the same rows,
   in the same order when `ordered` (the answer uses ORDER BY), in any order otherwise. Column names may differ. */
(function (root) {
  const cell = v => v === null ? 'NULL'
    : typeof v === 'number' ? String(Number(v.toPrecision(12)))           // 0.1 + 0.2 shows as 0.3, like the sqlite3 tool
    : v instanceof Uint8Array ? '(binary)' : String(v);
  const tidyError = e => String((e && e.message) || e).replace(/^Error:\s*/, '');

  function results(db, code) {
    const sets = [];
    let changed = 0;
    for (const stmt of db.iterateStatements(code)) {
      const columns = stmt.getColumnNames(), rows = [];
      while (stmt.step()) rows.push(stmt.get().map(cell));
      if (columns.length) sets.push({ columns, rows });
      else changed += db.getRowsModified();
    }
    return { sets, changed };
  }

  function runSql(SQL, setup, code, check) {
    const db = new SQL.Database();
    try {
      db.exec('PRAGMA foreign_keys = ON;');
      if (setup) db.exec(setup);
      let mine;
      try { mine = results(db, String(code || '')); }
      catch (e) { return { ok: false, error: tidyError(e) }; }
      let last = mine.sets[mine.sets.length - 1] || null;
      if (check) {
        try { last = results(db, check).sets.pop() || { columns: [], rows: [] }; }
        catch (e) { return { ok: false, error: tidyError(e) }; }
      }
      return { ok: true, sets: mine.sets, last, changed: mine.changed };
    } finally { db.close(); }
  }

  /* the result as plain text, one row per line: used by "predict the output" steps */
  const asText = set => (set ? set.rows.map(r => r.join(' | ')).join('\n') : '');

  function sameResult(expected, got, ordered) {
    if (!expected || !got) return false;
    if (expected.columns.length !== got.columns.length || expected.rows.length !== got.rows.length) return false;
    const key = r => JSON.stringify(r);
    const a = expected.rows.map(key), b = got.rows.map(key);
    if (!ordered) { a.sort(); b.sort(); }
    return a.every((r, i) => r === b[i]);
  }

  /* does the answer sort its rows? Then the learner's rows must come out in the same order. */
  const isOrdered = sql => /\border\s+by\b/i.test(String(sql).replace(/--.*|\/\*[\s\S]*?\*\//g, ''));

  const api = { runSql, sameResult, isOrdered, asText };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.SqlRun = api;
})(this);
