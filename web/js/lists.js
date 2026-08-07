// Task list (project) storage via localStorage, JSON-encoded array of
// list records. Same local-first pattern as tasks.js.
const Lists = (() => {
  const KEY = "satu.taskLists";

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

  function writeAll(lists) {
    localStorage.setItem(KEY, JSON.stringify(lists));
  }

  function makeId() {
    return `l_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  return {
    getAll() {
      return readAll();
    },

    get(id) {
      return readAll().find((l) => l.id === id) || null;
    },

    add({ name }) {
      const list = { id: makeId(), name: (name || "").trim() };
      const lists = readAll();
      lists.push(list);
      writeAll(lists);
      return list;
    },

    rename(id, name) {
      const lists = readAll();
      const index = lists.findIndex((l) => l.id === id);
      if (index === -1) return null;
      lists[index] = { ...lists[index], name: (name || "").trim() };
      writeAll(lists);
      return lists[index];
    },

    remove(id) {
      const lists = readAll();
      const next = lists.filter((l) => l.id !== id);
      writeAll(next);
      return next.length !== lists.length;
    },

    clearAll() {
      writeAll([]);
    },
  };
})();

// Node test runner support only — browsers never define `module`.
if (typeof module !== "undefined") module.exports = { Lists };
