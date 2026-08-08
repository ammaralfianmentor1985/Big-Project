// Task storage via localStorage, JSON-encoded array of task records.
// Same local-first pattern as storage.js — nothing here talks to a server.
const Tasks = (() => {
  const KEY = "satu.tasks";

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

  function writeAll(tasks) {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }

  function makeId() {
    return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  // Kept local to this module (rather than shared with app.js's Today
  // sorting) so tasks.js has no dependency on the DOM-glue file.
  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2, none: 3 };

  // "YYYY-MM-DD" + a recurrence rule -> the next "YYYY-MM-DD" due date.
  function advanceDate(dueDate, recurrence) {
    const [y, m, d] = dueDate.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    if (recurrence === "daily") date.setUTCDate(date.getUTCDate() + 1);
    else if (recurrence === "weekly") date.setUTCDate(date.getUTCDate() + 7);
    else if (recurrence === "monthly") date.setUTCMonth(date.getUTCMonth() + 1);
    return date.toISOString().slice(0, 10);
  }

  return {
    getAll() {
      return readAll();
    },

    get(id) {
      return readAll().find((t) => t.id === id) || null;
    },

    add({ title, notes = "", dueDate = null, priority = "none", listId = null, recurrence = "none" }) {
      const task = {
        id: makeId(),
        title: (title || "").trim(),
        notes,
        dueDate, // "YYYY-MM-DD" or null
        priority, // "none" | "low" | "medium" | "high"
        done: false,
        listId,
        recurrence, // "none" | "daily" | "weekly" | "monthly"
        createdAt: new Date().toISOString(),
      };
      const tasks = readAll();
      tasks.push(task);
      writeAll(tasks);
      return task;
    },

    update(id, changes) {
      const tasks = readAll();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return null;
      tasks[index] = { ...tasks[index], ...changes, id: tasks[index].id };
      writeAll(tasks);
      return tasks[index];
    },

    // Marks a task done — unless it recurs, in which case its due date
    // rolls forward instead and it stays undone for the next occurrence.
    complete(id) {
      const tasks = readAll();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return null;
      const task = tasks[index];
      tasks[index] =
        task.recurrence && task.recurrence !== "none" && task.dueDate
          ? { ...task, dueDate: advanceDate(task.dueDate, task.recurrence), done: false }
          : { ...task, done: true };
      writeAll(tasks);
      return tasks[index];
    },

    remove(id) {
      const tasks = readAll();
      const next = tasks.filter((t) => t.id !== id);
      writeAll(next);
      return next.length !== tasks.length;
    },

    // query: substring match on title (case-insensitive).
    // listId: "" = any list, "unassigned" = no list, else a specific list id.
    // status: "all" | "active" | "done".
    search({ query = "", listId = "", status = "all" } = {}) {
      const q = query.trim().toLowerCase();
      return readAll()
        .filter((task) => {
          if (q && !task.title.toLowerCase().includes(q)) return false;
          if (listId === "unassigned") {
            if (task.listId) return false;
          } else if (listId && task.listId !== listId) {
            return false;
          }
          if (status === "active" && task.done) return false;
          if (status === "done" && !task.done) return false;
          return true;
        })
        .sort((a, b) => {
          if (a.done !== b.done) return a.done ? 1 : -1;
          const aDate = a.dueDate || "9999-99-99";
          const bDate = b.dueDate || "9999-99-99";
          if (aDate !== bDate) return aDate < bDate ? -1 : 1;
          return (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3);
        });
    },

    clearAll() {
      writeAll([]);
    },
  };
})();

// Node test runner support only — browsers never define `module`.
if (typeof module !== "undefined") module.exports = { Tasks };
