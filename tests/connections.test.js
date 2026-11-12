// Checks the shape of every Connections puzzle in public/connections.js.
//   npm run test:unit
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');

const ctx = vm.createContext({}); ctx.window = ctx;
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'public', 'connections.js'), 'utf8'), ctx);
const puzzles = ctx.CONNECTIONS;

test('there are puzzles, each with a unique id and a name', () => {
  assert.ok(Array.isArray(puzzles) && puzzles.length >= 4);
  const ids = puzzles.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate puzzle id');
  for (const p of puzzles) { assert.match(p.id, /^[a-z0-9-]+$/, 'id: ' + p.id); assert.ok(p.name && p.name.length <= 40, 'name: ' + p.id); }
});

for (const p of puzzles || []) {
  test(`"${p.name}" has four groups of four different tiles`, () => {
    assert.equal(p.groups.length, 4);
    for (const g of p.groups) {
      assert.ok(g.title && g.title.length <= 45, 'title missing or too long: ' + g.title);
      assert.ok(g.note && g.note.length >= 30, 'every group needs a note that teaches something: ' + g.title);
      assert.equal(g.items.length, 4, g.title);
      for (const t of g.items) assert.ok(typeof t === 'string' && t.trim() === t && t.length >= 1 && t.length <= 24, 'tile too long or untidy: ' + JSON.stringify(t));
    }
    const tiles = p.groups.flatMap(g => g.items);
    assert.equal(new Set(tiles).size, 16, 'a tile appears twice');
    assert.equal(new Set(tiles.map(t => t.toLowerCase())).size, 16, 'two tiles differ only by capital letters');
    assert.equal(new Set(p.groups.map(g => g.title)).size, 4, 'two groups share a title');
  });
}
