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

const { Tasks } = require("../web/js/tasks.js");

test("getAll starts empty", () => {
  assert.deepEqual(Tasks.getAll(), []);
});

test("add creates a task with defaults and returns it", () => {
  Tasks.clearAll();
  const task = Tasks.add({ title: "  Buy milk  " });
  assert.equal(task.title, "Buy milk");
  assert.equal(task.notes, "");
  assert.equal(task.dueDate, null);
  assert.equal(task.priority, "none");
  assert.equal(task.done, false);
  assert.equal(task.listId, null);
  assert.equal(task.recurrence, "none");
  assert.equal(typeof task.id, "string");
  assert.ok(task.id.length > 0);
});

test("added tasks are persisted and retrievable via getAll/get", () => {
  Tasks.clearAll();
  const a = Tasks.add({ title: "Task A" });
  const b = Tasks.add({ title: "Task B", priority: "high", dueDate: "2026-08-10" });

  const all = Tasks.getAll();
  assert.equal(all.length, 2);
  assert.deepEqual(Tasks.get(a.id), a);
  assert.equal(Tasks.get(b.id).priority, "high");
  assert.equal(Tasks.get("nonexistent"), null);
});

test("update changes fields without changing the id", () => {
  Tasks.clearAll();
  const task = Tasks.add({ title: "Original" });
  const updated = Tasks.update(task.id, { title: "Renamed", done: true });
  assert.equal(updated.title, "Renamed");
  assert.equal(updated.done, true);
  assert.equal(updated.id, task.id);
  assert.equal(Tasks.get(task.id).title, "Renamed");
});

test("update on an unknown id returns null and changes nothing", () => {
  Tasks.clearAll();
  Tasks.add({ title: "Keep me" });
  const result = Tasks.update("nonexistent", { title: "Nope" });
  assert.equal(result, null);
  assert.equal(Tasks.getAll().length, 1);
});

test("remove deletes a task and reports whether it existed", () => {
  Tasks.clearAll();
  const task = Tasks.add({ title: "Temp" });
  assert.equal(Tasks.remove(task.id), true);
  assert.equal(Tasks.getAll().length, 0);
  assert.equal(Tasks.remove(task.id), false);
});

test("complete marks a non-recurring task done and leaves its due date alone", () => {
  Tasks.clearAll();
  const task = Tasks.add({ title: "One-off", dueDate: "2026-08-10" });
  const completed = Tasks.complete(task.id);
  assert.equal(completed.done, true);
  assert.equal(completed.dueDate, "2026-08-10");
});

test("complete rolls a daily task forward by 1 day and keeps it undone", () => {
  Tasks.clearAll();
  const task = Tasks.add({ title: "Daily", dueDate: "2026-08-10", recurrence: "daily" });
  const completed = Tasks.complete(task.id);
  assert.equal(completed.done, false);
  assert.equal(completed.dueDate, "2026-08-11");
});

test("complete rolls a weekly task forward by 7 days", () => {
  Tasks.clearAll();
  const task = Tasks.add({ title: "Weekly", dueDate: "2026-08-01", recurrence: "weekly" });
  const completed = Tasks.complete(task.id);
  assert.equal(completed.done, false);
  assert.equal(completed.dueDate, "2026-08-08");
});

test("complete rolls a monthly task forward by 1 month", () => {
  Tasks.clearAll();
  const task = Tasks.add({ title: "Monthly", dueDate: "2026-01-05", recurrence: "monthly" });
  const completed = Tasks.complete(task.id);
  assert.equal(completed.done, false);
  assert.equal(completed.dueDate, "2026-02-05");
});

test("complete on a recurring task with no due date just marks it done", () => {
  Tasks.clearAll();
  const task = Tasks.add({ title: "No date but recurring", recurrence: "daily" });
  const completed = Tasks.complete(task.id);
  assert.equal(completed.done, true);
  assert.equal(completed.dueDate, null);
});

test("complete on an unknown id returns null", () => {
  Tasks.clearAll();
  assert.equal(Tasks.complete("nonexistent"), null);
});

test("search filters by title substring, case-insensitively", () => {
  Tasks.clearAll();
  Tasks.add({ title: "Buy milk" });
  Tasks.add({ title: "Walk the dog" });
  const results = Tasks.search({ query: "MILK" });
  assert.equal(results.length, 1);
  assert.equal(results[0].title, "Buy milk");
});

test("search filters by list: specific list, unassigned, and all", () => {
  Tasks.clearAll();
  Tasks.add({ title: "In list A", listId: "list-a" });
  Tasks.add({ title: "In list B", listId: "list-b" });
  Tasks.add({ title: "No list" });

  assert.deepEqual(
    Tasks.search({ listId: "list-a" }).map((t) => t.title),
    ["In list A"]
  );
  assert.deepEqual(
    Tasks.search({ listId: "unassigned" }).map((t) => t.title),
    ["No list"]
  );
  assert.equal(Tasks.search({ listId: "" }).length, 3);
});

test("search filters by status: all, active, done", () => {
  Tasks.clearAll();
  const a = Tasks.add({ title: "Active task" });
  const b = Tasks.add({ title: "Done task" });
  Tasks.update(b.id, { done: true });

  assert.equal(Tasks.search({ status: "all" }).length, 2);
  assert.deepEqual(
    Tasks.search({ status: "active" }).map((t) => t.title),
    ["Active task"]
  );
  assert.deepEqual(
    Tasks.search({ status: "done" }).map((t) => t.title),
    ["Done task"]
  );
});

test("search sorts active before done, then by due date, then priority", () => {
  Tasks.clearAll();
  const done = Tasks.add({ title: "Already done", dueDate: "2026-01-01" });
  Tasks.update(done.id, { done: true });
  Tasks.add({ title: "Later, low priority", dueDate: "2026-08-15", priority: "low" });
  Tasks.add({ title: "Later, high priority", dueDate: "2026-08-15", priority: "high" });
  Tasks.add({ title: "Sooner", dueDate: "2026-08-01" });
  Tasks.add({ title: "No due date" });

  const titles = Tasks.search().map((t) => t.title);
  assert.deepEqual(titles, [
    "Sooner",
    "Later, high priority",
    "Later, low priority",
    "No due date",
    "Already done",
  ]);
});
