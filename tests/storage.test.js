const test = require("node:test");
const assert = require("node:assert/strict");

// Minimal in-memory localStorage so this test doesn't depend on which
// Node version has Web Storage stabilized.
class MemoryStorage {
  constructor() { this._data = new Map(); }
  getItem(key) { return this._data.has(key) ? this._data.get(key) : null; }
  setItem(key, value) { this._data.set(key, String(value)); }
  removeItem(key) { this._data.delete(key); }
  clear() { this._data.clear(); }
}
global.localStorage = new MemoryStorage();

const { Store } = require("../web/js/storage.js");

test("locale defaults to null (follow device), round-trips when set", () => {
  assert.equal(Store.getLocale(), null);
  Store.setLocale("id");
  assert.equal(Store.getLocale(), "id");
  Store.setLocale(null);
  assert.equal(Store.getLocale(), null);
});

test("theme defaults to system, round-trips", () => {
  assert.equal(Store.getTheme(), "system");
  Store.setTheme("dark");
  assert.equal(Store.getTheme(), "dark");
});

test("API key is trimmed, empty string clears it, hasApiKey reflects state", () => {
  assert.equal(Store.hasApiKey(), false);
  Store.setApiKey("  sk-ant-test  ");
  assert.equal(Store.getApiKey(), "sk-ant-test");
  assert.equal(Store.hasApiKey(), true);
  Store.setApiKey("");
  assert.equal(Store.getApiKey(), "");
  assert.equal(Store.hasApiKey(), false);
});

test("model defaults to Sonnet, round-trips to a specific model id", () => {
  assert.equal(Store.getModel(), Store.MODELS.sonnet);
  Store.setModel(Store.MODELS.opus);
  assert.equal(Store.getModel(), "claude-opus-5");
});
