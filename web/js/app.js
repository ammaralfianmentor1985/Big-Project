// Nav shell: tab switching, i18n binding, settings form. No framework,
// no build step — this file is served exactly as written.

function applyI18n() {
  document.documentElement.lang = Store.getLocale() || detectLocale();
  document.querySelectorAll("[data-t]").forEach((el) => {
    el.textContent = t(el.dataset.t);
  });
  document.querySelectorAll("[data-t-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.tPlaceholder));
  });
}

function showTab(name) {
  document.querySelectorAll(".tab").forEach((btn) => {
    const active = btn.dataset.tab === name;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-screen]").forEach((el) => {
    el.classList.toggle("active", el.id === `screen-${name}`);
  });
  if (name === "today") renderToday();
}

function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

function priorityWeight(priority) {
  return { high: 0, medium: 1, low: 2, none: 3 }[priority] ?? 3;
}

function priorityColorVar(priority) {
  return { high: "var(--berry)", medium: "var(--sun)", low: "var(--teal)" }[priority] || null;
}

let editingTaskId = null;

function renderToday() {
  const today = todayDateOnly();
  const dueTasks = Tasks.getAll()
    .filter((task) => !task.done && task.dueDate && task.dueDate <= today)
    .sort((a, b) => {
      if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      return priorityWeight(a.priority) - priorityWeight(b.priority);
    });

  const listEl = document.getElementById("today-tasks");
  const emptyEl = document.getElementById("today-empty");

  listEl.innerHTML = "";
  if (dueTasks.length === 0) {
    listEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
  listEl.hidden = false;

  dueTasks.forEach((task) => {
    const overdue = task.dueDate < today;

    const row = document.createElement("div");
    row.className = "list-tile task-tile";
    row.addEventListener("click", () => openTaskForm(task.id));

    const check = document.createElement("button");
    check.className = "task-check";
    check.setAttribute("aria-label", "Complete task");
    check.addEventListener("click", (event) => {
      event.stopPropagation();
      row.classList.add("task-tile-done");
      window.setTimeout(() => {
        Tasks.update(task.id, { done: true });
        renderToday();
      }, 220);
    });
    row.appendChild(check);

    const colorVar = priorityColorVar(task.priority);
    if (colorVar) {
      const dot = document.createElement("span");
      dot.className = "priority-dot";
      dot.style.background = colorVar;
      row.appendChild(dot);
    }

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = task.title;
    row.appendChild(label);

    const badge = document.createElement("div");
    badge.className = "trailing";
    badge.textContent = overdue ? t("todayOverdueBadge") : t("todayDueTodayBadge");
    if (overdue) badge.style.color = "var(--berry)";
    row.appendChild(badge);

    listEl.appendChild(row);
  });
}

function openTaskForm(taskId) {
  editingTaskId = taskId || null;
  const task = editingTaskId ? Tasks.get(editingTaskId) : null;

  document.getElementById("task-form-title").textContent =
    t(editingTaskId ? "taskFormTitleEdit" : "taskFormTitleNew");
  document.getElementById("task-title").value = task ? task.title : "";
  document.getElementById("task-notes").value = task ? task.notes : "";
  document.getElementById("task-due-date").value = task ? (task.dueDate || "") : todayDateOnly();
  document.getElementById("task-priority").value = task ? task.priority : "none";
  document.getElementById("task-delete").hidden = !editingTaskId;

  document.querySelectorAll("[data-screen]").forEach((el) => {
    el.classList.toggle("active", el.id === "screen-task-form");
  });
}

function closeTaskForm() {
  showTab("today");
}

function saveTaskForm() {
  const title = document.getElementById("task-title").value.trim();
  if (!title) return;

  const fields = {
    title,
    notes: document.getElementById("task-notes").value,
    dueDate: document.getElementById("task-due-date").value || null,
    priority: document.getElementById("task-priority").value,
  };

  if (editingTaskId) Tasks.update(editingTaskId, fields);
  else Tasks.add(fields);

  closeTaskForm();
}

function deleteTaskForm() {
  if (editingTaskId) Tasks.remove(editingTaskId);
  closeTaskForm();
}

function refreshChatGate() {
  const hasKey = Store.hasApiKey();
  document.getElementById("chat-no-key").hidden = hasKey;
  document.getElementById("chat-ready").hidden = !hasKey;
}

function openSettings() {
  document.getElementById("select-locale").value = Store.getLocale() || "system";
  document.getElementById("select-theme").value = Store.getTheme();
  document.getElementById("input-api-key").value = Store.getApiKey();
  document.getElementById("select-model").value = Store.getModel();
  document.querySelectorAll("[data-screen]").forEach((el) => {
    el.classList.toggle("active", el.id === "screen-settings");
  });
}

function closeSettings() {
  showTab("more");
}

function wireEvents() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  document.getElementById("open-settings").addEventListener("click", openSettings);
  document.getElementById("chat-open-settings").addEventListener("click", openSettings);
  document.getElementById("settings-back").addEventListener("click", closeSettings);

  document.getElementById("select-locale").addEventListener("change", (e) => {
    Store.setLocale(e.target.value === "system" ? null : e.target.value);
    applyI18n();
  });

  document.getElementById("select-theme").addEventListener("change", (e) => {
    Store.setTheme(e.target.value);
    applyTheme();
  });

  document.getElementById("select-model").addEventListener("change", (e) => {
    Store.setModel(e.target.value);
  });

  document.getElementById("save-api-key").addEventListener("click", () => {
    Store.setApiKey(document.getElementById("input-api-key").value);
    refreshChatGate();
  });

  document.getElementById("clear-api-key").addEventListener("click", () => {
    Store.setApiKey("");
    document.getElementById("input-api-key").value = "";
    refreshChatGate();
  });

  document.getElementById("today-add-task").addEventListener("click", () => openTaskForm(null));
  document.getElementById("task-form-back").addEventListener("click", closeTaskForm);
  document.getElementById("task-save").addEventListener("click", saveTaskForm);
  document.getElementById("task-delete").addEventListener("click", deleteTaskForm);
}

function init() {
  applyTheme();
  applyI18n();
  refreshChatGate();
  renderToday();
  wireEvents();
}

document.addEventListener("DOMContentLoaded", init);
