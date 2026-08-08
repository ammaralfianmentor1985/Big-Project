const test = require("node:test");
const assert = require("node:assert/strict");

// Minimal in-memory localStorage, same approach as storage.test.js.
class MemoryStorage {
  constructor() { this._data = new Map(); }
  getItem(key) { return this._data.has(key) ? this._data.get(key) : null; }
  setItem(key, value) { this._data.set(key, String(value)); }
  removeItem(key) { this._data.delete(key); }
  clear() { this._data.clear(); }
}
global.localStorage = new MemoryStorage();

const { Lists } = require("../web/js/lists.js");

test("getAll starts empty", () => {
  assert.deepEqual(Lists.getAll(), []);
});

test("add creates a list with a trimmed name and returns it", () => {
  Lists.clearAll();
  const list = Lists.add({ name: "  Work  " });
  assert.equal(list.name, "Work");
  assert.equal(typeof list.id, "string");
  assert.ok(list.id.length > 0);
});

test("added lists are retrievable via getAll/get", () => {
  Lists.clearAll();
  const a = Lists.add({ name: "Work" });
  const b = Lists.add({ name: "Home" });

  assert.equal(Lists.getAll().length, 2);
  assert.deepEqual(Lists.get(a.id), a);
  assert.equal(Lists.get(b.id).name, "Home");
  assert.equal(Lists.get("nonexistent"), null);
});

test("rename changes the name without changing the id", () => {
  Lists.clearAll();
  const list = Lists.add({ name: "Old name" });
  const renamed = Lists.rename(list.id, "New name");
  assert.equal(renamed.name, "New name");
  assert.equal(renamed.id, list.id);
  assert.equal(Lists.get(list.id).name, "New name");
});

test("rename on an unknown id returns null and changes nothing", () => {
  Lists.clearAll();
  Lists.add({ name: "Keep me" });
  const result = Lists.rename("nonexistent", "Nope");
  assert.equal(result, null);
  assert.equal(Lists.getAll().length, 1);
});

test("remove deletes a list and reports whether it existed", () => {
  Lists.clearAll();
  const list = Lists.add({ name: "Temp" });
  assert.equal(Lists.remove(list.id), true);
  assert.equal(Lists.getAll().length, 0);
  assert.equal(Lists.remove(list.id), false);
});
