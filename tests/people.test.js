const test = require("node:test");
const assert = require("node:assert/strict");

// Minimal in-memory localStorage, same approach as tasks.test.js.
class MemoryStorage {
  constructor() { this._data = new Map(); }
  getItem(key) { return this._data.has(key) ? this._data.get(key) : null; }
  setItem(key, value) { this._data.set(key, String(value)); }
  removeItem(key) { this._data.delete(key); }
  clear() { this._data.clear(); }
}
global.localStorage = new MemoryStorage();

const { People } = require("../web/js/people.js");

test("getAll starts empty", () => {
  assert.deepEqual(People.getAll(), []);
});

test("add creates a person with defaults, a trimmed name, and a photo color", () => {
  People.clearAll();
  const person = People.add({ name: "  Ada Lovelace  " });
  assert.equal(person.name, "Ada Lovelace");
  assert.deepEqual(person.tags, []);
  assert.equal(person.birthday, null);
  assert.equal(person.notes, "");
  assert.deepEqual(person.interactions, []);
  assert.equal(person.followUpDate, null);
  assert.equal(typeof person.photoColor, "string");
  assert.ok(person.photoColor.startsWith("--"));
  assert.equal(typeof person.id, "string");
  assert.ok(person.id.length > 0);
});

test("add trims and drops empty tags", () => {
  People.clearAll();
  const person = People.add({ name: "Grace Hopper", tags: [" mentor ", "", "  ", "navy"] });
  assert.deepEqual(person.tags, ["mentor", "navy"]);
});

test("successive people cycle through photo colors", () => {
  People.clearAll();
  const a = People.add({ name: "A" });
  const b = People.add({ name: "B" });
  assert.notEqual(a.photoColor, b.photoColor);
});

test("photo colors wrap around once every color has been used", () => {
  People.clearAll();
  const colors = [];
  for (let i = 0; i < 7; i++) {
    colors.push(People.add({ name: `Person ${i}` }).photoColor);
  }
  const distinctColors = new Set(colors);
  assert.equal(distinctColors.size, 6);
  assert.equal(colors[6], colors[0]);
});

test("full CRUD lifecycle: add, read, update, then delete", () => {
  People.clearAll();
  const created = People.add({ name: "Lifecycle Test", tags: ["temp"], birthday: "05-20" });
  assert.equal(People.get(created.id).name, "Lifecycle Test");
  assert.equal(People.get(created.id).birthday, "05-20");

  const updated = People.update(created.id, { name: "Renamed", tags: ["permanent"] });
  assert.equal(updated.name, "Renamed");
  assert.deepEqual(People.get(created.id).tags, ["permanent"]);

  assert.equal(People.remove(created.id), true);
  assert.equal(People.get(created.id), null);
  assert.equal(People.getAll().length, 0);
});

test("added people are retrievable via getAll/get", () => {
  People.clearAll();
  const a = People.add({ name: "Ada" });
  const b = People.add({ name: "Grace" });

  assert.equal(People.getAll().length, 2);
  assert.deepEqual(People.get(a.id), a);
  assert.equal(People.get(b.id).name, "Grace");
  assert.equal(People.get("nonexistent"), null);
});

test("update changes fields without changing the id", () => {
  People.clearAll();
  const person = People.add({ name: "Original" });
  const updated = People.update(person.id, { name: "Renamed", notes: "met at a conference" });
  assert.equal(updated.name, "Renamed");
  assert.equal(updated.notes, "met at a conference");
  assert.equal(updated.id, person.id);
  assert.equal(People.get(person.id).name, "Renamed");
});

test("update on an unknown id returns null and changes nothing", () => {
  People.clearAll();
  People.add({ name: "Keep me" });
  const result = People.update("nonexistent", { name: "Nope" });
  assert.equal(result, null);
  assert.equal(People.getAll().length, 1);
});

test("remove deletes a person and reports whether it existed", () => {
  People.clearAll();
  const person = People.add({ name: "Temp" });
  assert.equal(People.remove(person.id), true);
  assert.equal(People.getAll().length, 0);
  assert.equal(People.remove(person.id), false);
});

test("search matches by name or tag, case-insensitively, sorted alphabetically", () => {
  People.clearAll();
  People.add({ name: "Zara", tags: ["designer"] });
  People.add({ name: "Amir", tags: ["engineer"] });
  People.add({ name: "Beth", tags: ["Designer", "friend"] });

  assert.deepEqual(
    People.search("").map((p) => p.name),
    ["Amir", "Beth", "Zara"]
  );
  assert.deepEqual(
    People.search("desi").map((p) => p.name),
    ["Beth", "Zara"]
  );
  assert.deepEqual(
    People.search("amir").map((p) => p.name),
    ["Amir"]
  );
  assert.deepEqual(People.search("nobody"), []);
});

test("addInteraction appends a logged interaction with a generated id", () => {
  People.clearAll();
  const person = People.add({ name: "Contact" });
  const updated = People.addInteraction(person.id, { type: "call", date: "2026-08-07", note: "Caught up" });
  assert.equal(updated.interactions.length, 1);
  const interaction = updated.interactions[0];
  assert.equal(interaction.type, "call");
  assert.equal(interaction.date, "2026-08-07");
  assert.equal(interaction.note, "Caught up");
  assert.equal(typeof interaction.id, "string");
  assert.ok(interaction.id.length > 0);
});

test("addInteraction on an unknown person id returns null", () => {
  People.clearAll();
  assert.equal(People.addInteraction("nonexistent", { type: "call" }), null);
});

test("multiple interactions accumulate in the order they were added", () => {
  People.clearAll();
  const person = People.add({ name: "Contact" });
  People.addInteraction(person.id, { type: "call", date: "2026-08-01" });
  const updated = People.addInteraction(person.id, { type: "message", date: "2026-08-05" });
  assert.deepEqual(updated.interactions.map((i) => i.type), ["call", "message"]);
});

test("removeInteraction deletes a logged interaction by id", () => {
  People.clearAll();
  const person = People.add({ name: "Contact" });
  const withOne = People.addInteraction(person.id, { type: "met", date: "2026-08-01" });
  const interactionId = withOne.interactions[0].id;
  const after = People.removeInteraction(person.id, interactionId);
  assert.deepEqual(after.interactions, []);
});

test("removeInteraction on an unknown person id returns null", () => {
  People.clearAll();
  assert.equal(People.removeInteraction("nonexistent", "whatever"), null);
});

test("addInteraction clears a pending follow-up date", () => {
  People.clearAll();
  const person = People.add({ name: "Contact", followUpDate: "2026-08-01" });
  const updated = People.addInteraction(person.id, { type: "call", date: "2026-08-01" });
  assert.equal(updated.followUpDate, null);
});

test("dueForFollowUp finds people due today or overdue, soonest first", () => {
  People.clearAll();
  People.add({ name: "Overdue", followUpDate: "2026-07-01" });
  People.add({ name: "Due today", followUpDate: "2026-08-07" });
  People.add({ name: "Future", followUpDate: "2026-09-01" });
  People.add({ name: "No follow-up" });

  assert.deepEqual(
    People.dueForFollowUp("2026-08-07").map((p) => p.name),
    ["Overdue", "Due today"]
  );
  assert.deepEqual(People.dueForFollowUp("2026-01-01"), []);
});

test("birthdaysOn finds people whose MM-DD birthday matches", () => {
  People.clearAll();
  People.add({ name: "Same day A", birthday: "03-14" });
  People.add({ name: "Same day B", birthday: "03-14" });
  People.add({ name: "Different day", birthday: "07-04" });
  People.add({ name: "No birthday" });

  assert.deepEqual(
    People.birthdaysOn("03-14").map((p) => p.name).sort(),
    ["Same day A", "Same day B"]
  );
  assert.deepEqual(People.birthdaysOn("01-01"), []);
});
