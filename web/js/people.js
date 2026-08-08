// Personal CRM storage via localStorage, JSON-encoded array of person
// records. Same local-first pattern as tasks.js / lists.js.
const People = (() => {
  const KEY = "satu.people";

  // Cycled through in insertion order, same palette as LIST_DOT_COLORS in
  // app.js — kept as a separate copy here so this module has no dependency
  // on the DOM-glue file.
  const PHOTO_COLORS = ["--teal", "--grape", "--berry", "--leaf", "--sun", "--mango"];

  function readAll() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeAll(people) {
    localStorage.setItem(KEY, JSON.stringify(people));
  }

  function makeId(prefix = "p") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  return {
    getAll() {
      return readAll();
    },

    get(id) {
      return readAll().find((p) => p.id === id) || null;
    },

    add({ name, tags = [], birthday = null, notes = "", followUpDate = null }) {
      const people = readAll();
      const person = {
        id: makeId(),
        name: (name || "").trim(),
        photoColor: PHOTO_COLORS[people.length % PHOTO_COLORS.length],
        tags: Array.isArray(tags) ? tags.map((tag) => tag.trim()).filter(Boolean) : [],
        birthday, // "MM-DD" or null — no birth year is tracked, just the annual date
        notes,
        followUpDate, // "YYYY-MM-DD" or null — "reach out to this person by"
        interactions: [], // { id, type: "call"|"met"|"message", date, note }
        createdAt: new Date().toISOString(),
      };
      people.push(person);
      writeAll(people);
      return person;
    },

    update(id, changes) {
      const people = readAll();
      const index = people.findIndex((p) => p.id === id);
      if (index === -1) return null;
      people[index] = { ...people[index], ...changes, id: people[index].id };
      writeAll(people);
      return people[index];
    },

    // Appends a logged interaction and returns the updated person record.
    // Logging any interaction counts as having reached out, so it clears a
    // pending follow-up reminder rather than leaving it to nag forever.
    addInteraction(id, { type, date = null, note = "" }) {
      const people = readAll();
      const index = people.findIndex((p) => p.id === id);
      if (index === -1) return null;
      const interaction = { id: makeId("i"), type, date, note };
      const interactions = [...(people[index].interactions || []), interaction];
      people[index] = { ...people[index], interactions, followUpDate: null };
      writeAll(people);
      return people[index];
    },

    removeInteraction(id, interactionId) {
      const people = readAll();
      const index = people.findIndex((p) => p.id === id);
      if (index === -1) return null;
      const interactions = (people[index].interactions || []).filter((i) => i.id !== interactionId);
      people[index] = { ...people[index], interactions };
      writeAll(people);
      return people[index];
    },

    remove(id) {
      const people = readAll();
      const next = people.filter((p) => p.id !== id);
      writeAll(next);
      return next.length !== people.length;
    },

    // Matches on name or any tag, case-insensitively. Empty query returns
    // everyone, sorted alphabetically by name.
    search(query = "") {
      const q = query.trim().toLowerCase();
      const matches = readAll().filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
      return matches.sort((a, b) => a.name.localeCompare(b.name));
    },

    // People whose "MM-DD" birthday matches today's month and day.
    birthdaysOn(monthDay) {
      return readAll().filter((p) => p.birthday === monthDay);
    },

    // People with a follow-up date due today or overdue, soonest first.
    dueForFollowUp(today) {
      return readAll()
        .filter((p) => p.followUpDate && p.followUpDate <= today)
        .sort((a, b) => (a.followUpDate < b.followUpDate ? -1 : a.followUpDate > b.followUpDate ? 1 : 0));
    },

    clearAll() {
      writeAll([]);
    },
  };
})();

// Node test runner support only — browsers never define `module`.
if (typeof module !== "undefined") module.exports = { People };
