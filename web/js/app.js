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
  if (name === "people") renderPeople();
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

function renderTodayBirthdays() {
  const monthDay = todayDateOnly().slice(5);
  const people = People.birthdaysOn(monthDay);

  const section = document.getElementById("today-birthdays-section");
  const container = document.getElementById("today-birthdays-items");
  container.innerHTML = "";

  if (people.length === 0) {
    section.hidden = true;
    return;
  }
  section.hidden = false;

  people.forEach((person) => {
    const row = document.createElement("div");
    row.className = "list-tile";
    row.style.cursor = "pointer";
    row.addEventListener("click", () => openPersonForm(person.id));

    const avatar = document.createElement("div");
    avatar.className = "avatar-circle";
    avatar.style.background = `var(${person.photoColor})`;
    avatar.textContent = (person.name[0] || "?").toUpperCase();
    row.appendChild(avatar);

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = person.name;
    row.appendChild(label);

    const trailing = document.createElement("div");
    trailing.className = "trailing";
    trailing.textContent = "🎂";
    row.appendChild(trailing);

    container.appendChild(row);
  });
}

function renderTodayFollowUps() {
  const today = todayDateOnly();
  const people = People.dueForFollowUp(today);

  const section = document.getElementById("today-followups-section");
  const container = document.getElementById("today-followups-items");
  container.innerHTML = "";

  if (people.length === 0) {
    section.hidden = true;
    return;
  }
  section.hidden = false;

  people.forEach((person) => {
    const overdue = person.followUpDate < today;

    const row = document.createElement("div");
    row.className = "list-tile";
    row.style.cursor = "pointer";
    row.addEventListener("click", () => openPersonForm(person.id));

    const avatar = document.createElement("div");
    avatar.className = "avatar-circle";
    avatar.style.background = `var(${person.photoColor})`;
    avatar.textContent = (person.name[0] || "?").toUpperCase();
    row.appendChild(avatar);

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = person.name;
    row.appendChild(label);

    const trailing = document.createElement("div");
    trailing.className = "trailing";
    trailing.textContent = overdue ? t("todayFollowUpOverdue") : t("todayFollowUpToday");
    if (overdue) trailing.style.color = "var(--berry)";
    row.appendChild(trailing);

    container.appendChild(row);
  });
}

function renderToday() {
  renderTodayBirthdays();
  renderTodayFollowUps();

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
        Tasks.complete(task.id);
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

    const trailing = document.createElement("div");
    trailing.className = "trailing";
    trailing.style.display = "flex";
    trailing.style.alignItems = "center";
    trailing.style.gap = "4px";

    if (task.recurrence && task.recurrence !== "none") {
      const repeatIcon = document.createElement("span");
      repeatIcon.style.display = "inline-flex";
      repeatIcon.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
      trailing.appendChild(repeatIcon);
    }

    const badgeText = document.createElement("span");
    badgeText.textContent = overdue ? t("todayOverdueBadge") : t("todayDueTodayBadge");
    if (overdue) badgeText.style.color = "var(--berry)";
    trailing.appendChild(badgeText);

    row.appendChild(trailing);

    listEl.appendChild(row);
  });
}

function renderTaskFormListOptions() {
  const select = document.getElementById("task-list");
  const current = select.value;

  select.innerHTML = "";
  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = t("taskListNone");
  select.appendChild(noneOption);

  Lists.getAll().forEach((list) => {
    const option = document.createElement("option");
    option.value = list.id;
    option.textContent = list.name;
    select.appendChild(option);
  });

  select.value = current;
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
  document.getElementById("task-recurrence").value = task ? (task.recurrence || "none") : "none";
  document.getElementById("task-delete").hidden = !editingTaskId;

  renderTaskFormListOptions();
  document.getElementById("task-list").value = task ? (task.listId || "") : "";

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
    listId: document.getElementById("task-list").value || null,
    recurrence: document.getElementById("task-recurrence").value,
  };

  if (editingTaskId) Tasks.update(editingTaskId, fields);
  else Tasks.add(fields);

  closeTaskForm();
}

function deleteTaskForm() {
  if (editingTaskId) Tasks.remove(editingTaskId);
  closeTaskForm();
}

let editingPersonId = null;

function renderPeople() {
  const query = document.getElementById("people-search").value;
  const results = People.search(query);

  const container = document.getElementById("people-items");
  const emptyEl = document.getElementById("people-empty");

  container.innerHTML = "";
  if (results.length === 0) {
    container.hidden = true;
    emptyEl.hidden = false;
    const hasAnyPeople = People.getAll().length > 0;
    document.getElementById("people-empty-title").textContent =
      t(hasAnyPeople ? "peopleNoMatchesTitle" : "peopleEmptyTitle");
    document.getElementById("people-empty-body").textContent =
      t(hasAnyPeople ? "peopleNoMatchesBody" : "peopleEmptyBody");
    return;
  }
  emptyEl.hidden = true;
  container.hidden = false;

  results.forEach((person) => {
    const row = document.createElement("div");
    row.className = "list-tile";
    row.style.cursor = "pointer";
    row.addEventListener("click", () => openPersonForm(person.id));

    const avatar = document.createElement("div");
    avatar.className = "avatar-circle";
    avatar.style.background = `var(${person.photoColor})`;
    avatar.textContent = (person.name[0] || "?").toUpperCase();
    row.appendChild(avatar);

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = person.name;
    row.appendChild(label);

    if (person.tags.length > 0) {
      const trailing = document.createElement("div");
      trailing.className = "trailing";
      trailing.textContent = person.tags.join(", ");
      row.appendChild(trailing);
    }

    container.appendChild(row);
  });
}

function openPersonForm(personId) {
  editingPersonId = personId || null;
  const person = editingPersonId ? People.get(editingPersonId) : null;

  document.getElementById("person-form-title").textContent =
    t(editingPersonId ? "personFormTitleEdit" : "personFormTitleNew");
  document.getElementById("person-name").value = person ? person.name : "";
  document.getElementById("person-tags").value = person ? person.tags.join(", ") : "";
  document.getElementById("person-birthday").value =
    person && person.birthday ? `2000-${person.birthday}` : "";
  document.getElementById("person-follow-up").value = person ? (person.followUpDate || "") : "";
  document.getElementById("person-notes").value = person ? person.notes : "";
  document.getElementById("person-delete").hidden = !editingPersonId;

  document.getElementById("person-interactions-section").hidden = !editingPersonId;
  if (editingPersonId) {
    document.getElementById("interaction-type").value = "call";
    document.getElementById("interaction-date").value = todayDateOnly();
    document.getElementById("interaction-note").value = "";
    renderPersonInteractions();
  }

  document.querySelectorAll("[data-screen]").forEach((el) => {
    el.classList.toggle("active", el.id === "screen-person-form");
  });
}

function closePersonForm() {
  showTab("people");
}

const INTERACTION_ICONS = {
  call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 1-2z"/></svg>',
  met: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 19c.6-3.4 3.2-5.4 6.2-5.4s5.6 2 6.2 5.4"/><path d="M15.5 5.2a3.2 3.2 0 0 1 0 6.2M18.5 13.7c2.4.5 4.1 2.3 4.7 5.3"/></svg>',
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4V5z"/></svg>',
};

const INTERACTION_TYPE_KEYS = {
  call: "interactionTypeCall",
  met: "interactionTypeMet",
  message: "interactionTypeMessage",
};

function renderPersonInteractions() {
  const person = editingPersonId ? People.get(editingPersonId) : null;
  const items = (person && person.interactions) || [];
  const container = document.getElementById("person-interactions-items");
  container.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "help-text";
    empty.textContent = t("personInteractionsEmpty");
    container.appendChild(empty);
    return;
  }

  [...items].reverse().forEach((interaction) => {
    const row = document.createElement("div");
    row.className = "list-tile";

    const icon = document.createElement("div");
    icon.className = "leading";
    icon.style.background = "rgb(var(--teal-rgb) / 0.15)";
    icon.style.color = "var(--teal)";
    icon.innerHTML = INTERACTION_ICONS[interaction.type] || INTERACTION_ICONS.met;
    row.appendChild(icon);

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = interaction.note || t(INTERACTION_TYPE_KEYS[interaction.type] || "interactionTypeMet");
    row.appendChild(label);

    const trailing = document.createElement("div");
    trailing.className = "trailing";
    trailing.textContent = interaction.date || "";
    row.appendChild(trailing);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-text";
    deleteBtn.style.padding = "8px";
    deleteBtn.setAttribute("aria-label", "Delete interaction");
    deleteBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    deleteBtn.addEventListener("click", () => {
      People.removeInteraction(editingPersonId, interaction.id);
      renderPersonInteractions();
    });
    row.appendChild(deleteBtn);

    container.appendChild(row);
  });
}

function addInteraction() {
  if (!editingPersonId) return;
  const type = document.getElementById("interaction-type").value;
  const date = document.getElementById("interaction-date").value || null;
  const note = document.getElementById("interaction-note").value.trim();
  People.addInteraction(editingPersonId, { type, date, note });
  document.getElementById("interaction-note").value = "";
  renderPersonInteractions();
}

function savePersonForm() {
  const name = document.getElementById("person-name").value.trim();
  if (!name) return;

  const birthdayValue = document.getElementById("person-birthday").value;
  const fields = {
    name,
    tags: document.getElementById("person-tags").value.split(",").map((tag) => tag.trim()).filter(Boolean),
    birthday: birthdayValue ? birthdayValue.slice(5) : null,
    followUpDate: document.getElementById("person-follow-up").value || null,
    notes: document.getElementById("person-notes").value,
  };

  if (editingPersonId) People.update(editingPersonId, fields);
  else People.add(fields);

  closePersonForm();
}

function deletePersonForm() {
  if (editingPersonId) People.remove(editingPersonId);
  closePersonForm();
}

function renderAllTasksListFilterOptions() {
  const select = document.getElementById("all-tasks-filter-list");
  const current = select.value;

  select.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = t("allTasksFilterListAll");
  select.appendChild(allOption);

  const unassignedOption = document.createElement("option");
  unassignedOption.value = "unassigned";
  unassignedOption.textContent = t("taskListNone");
  select.appendChild(unassignedOption);

  Lists.getAll().forEach((list) => {
    const option = document.createElement("option");
    option.value = list.id;
    option.textContent = list.name;
    select.appendChild(option);
  });

  select.value = current;
}

function renderAllTasks() {
  const results = Tasks.search({
    query: document.getElementById("all-tasks-search").value,
    listId: document.getElementById("all-tasks-filter-list").value,
    status: document.getElementById("all-tasks-filter-status").value,
  });

  const container = document.getElementById("all-tasks-items");
  const emptyEl = document.getElementById("all-tasks-empty");

  container.innerHTML = "";
  if (results.length === 0) {
    container.hidden = true;
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
  container.hidden = false;

  const today = todayDateOnly();

  results.forEach((task) => {
    const row = document.createElement("div");
    row.className = "list-tile task-tile";
    row.addEventListener("click", () => openTaskForm(task.id));

    const check = document.createElement("button");
    check.className = "task-check";
    check.classList.toggle("task-check-done", task.done);
    check.setAttribute("aria-label", "Toggle task done");
    check.addEventListener("click", (event) => {
      event.stopPropagation();
      if (task.done) Tasks.update(task.id, { done: false });
      else Tasks.complete(task.id);
      renderAllTasks();
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
    if (task.done) {
      label.style.textDecoration = "line-through";
      label.style.color = "var(--ink-soft)";
    }
    row.appendChild(label);

    const trailing = document.createElement("div");
    trailing.className = "trailing";
    trailing.textContent = task.dueDate || t("allTasksNoDueDate");
    if (task.dueDate && task.dueDate < today && !task.done) {
      trailing.style.color = "var(--berry)";
    }
    row.appendChild(trailing);

    container.appendChild(row);
  });
}

function openAllTasks() {
  renderAllTasksListFilterOptions();
  renderAllTasks();
  document.querySelectorAll("[data-screen]").forEach((el) => {
    el.classList.toggle("active", el.id === "screen-all-tasks");
  });
}

function closeAllTasks() {
  showTab("more");
}

const LIST_DOT_COLORS = ["--teal", "--grape", "--berry", "--leaf", "--sun", "--mango"];

function renderLists() {
  const lists = Lists.getAll();
  const container = document.getElementById("lists-items");
  const emptyEl = document.getElementById("lists-empty");

  container.innerHTML = "";
  if (lists.length === 0) {
    container.hidden = true;
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
  container.hidden = false;

  lists.forEach((list, index) => {
    const row = document.createElement("div");
    row.className = "list-tile";

    const dot = document.createElement("span");
    dot.className = "priority-dot";
    dot.style.background = `var(${LIST_DOT_COLORS[index % LIST_DOT_COLORS.length]})`;
    row.appendChild(dot);

    const input = document.createElement("input");
    input.type = "text";
    input.className = "lists-name-input";
    input.value = list.name;
    input.addEventListener("change", () => {
      const name = input.value.trim();
      if (name) Lists.rename(list.id, name);
      else input.value = list.name;
    });
    row.appendChild(input);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-text";
    deleteBtn.style.padding = "8px";
    deleteBtn.setAttribute("aria-label", "Delete list");
    deleteBtn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>';
    deleteBtn.addEventListener("click", () => {
      Tasks.getAll()
        .filter((task) => task.listId === list.id)
        .forEach((task) => Tasks.update(task.id, { listId: null }));
      Lists.remove(list.id);
      renderLists();
    });
    row.appendChild(deleteBtn);

    container.appendChild(row);
  });
}

function openLists() {
  renderLists();
  document.querySelectorAll("[data-screen]").forEach((el) => {
    el.classList.toggle("active", el.id === "screen-lists");
  });
}

function closeLists() {
  showTab("more");
}

function addList() {
  const input = document.getElementById("new-list-name");
  const name = input.value.trim();
  if (!name) return;
  Lists.add({ name });
  input.value = "";
  renderLists();
}

function refreshChatGate() {
  const hasKey = Store.hasApiKey();
  document.getElementById("chat-no-key").hidden = hasKey;
  document.getElementById("chat-ready").hidden = !hasKey;
}

let chatMessages = []; // { role: "user"|"assistant"|"error", content, pending? }

function renderChatMessages() {
  const container = document.getElementById("chat-messages");
  const emptyEl = document.getElementById("chat-empty");
  container.innerHTML = "";

  if (chatMessages.length === 0) {
    container.hidden = true;
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
  container.hidden = false;

  chatMessages.forEach((message) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-message chat-message-${message.role}`;
    if (message.pending) bubble.classList.add("chat-message-pending");
    bubble.textContent = message.content;
    container.appendChild(bubble);
  });

  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

async function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  const apiKey = Store.getApiKey();
  if (!apiKey) return;

  chatMessages.push({ role: "user", content: text });
  input.value = "";

  const pendingMessage = { role: "assistant", content: "…", pending: true };
  chatMessages.push(pendingMessage);
  renderChatMessages();

  const button = document.getElementById("chat-send");
  button.disabled = true;

  try {
    const apiMessages = chatMessages
      .filter((m) => (m.role === "user" || m.role === "assistant") && !m.pending)
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await AI.sendMessage({
      apiKey,
      model: Store.getModel(),
      messages: apiMessages,
      maxTokens: 1024,
    });

    pendingMessage.content = AI.textFromResponse(response) || t("chatEmptyReply");
    pendingMessage.pending = false;
  } catch (error) {
    chatMessages = chatMessages.filter((m) => m !== pendingMessage);
    chatMessages.push({ role: "error", content: error.message });
  } finally {
    button.disabled = false;
    renderChatMessages();
  }
}

function showApiKeyStatus(message, color) {
  const statusEl = document.getElementById("api-key-status");
  statusEl.textContent = message;
  statusEl.style.color = color;
  statusEl.hidden = false;
}

async function testApiKey() {
  const apiKey = document.getElementById("input-api-key").value.trim();
  if (!apiKey) {
    showApiKeyStatus(t("settingsApiKeyNoKey"), "var(--berry)");
    return;
  }

  const button = document.getElementById("test-api-key");
  button.disabled = true;
  showApiKeyStatus(t("settingsApiKeyTesting"), "var(--ink-soft)");

  try {
    await AI.sendMessage({
      apiKey,
      model: Store.getModel(),
      messages: [{ role: "user", content: "Hi" }],
      maxTokens: 8,
    });
    showApiKeyStatus(t("settingsApiKeyTestSuccess"), "var(--leaf)");
  } catch (error) {
    showApiKeyStatus(`${t("settingsApiKeyTestFailure")}: ${error.message}`, "var(--berry)");
  } finally {
    button.disabled = false;
  }
}

function openSettings() {
  document.getElementById("select-locale").value = Store.getLocale() || "system";
  document.getElementById("select-theme").value = Store.getTheme();
  document.getElementById("input-api-key").value = Store.getApiKey();
  document.getElementById("select-model").value = Store.getModel();
  document.getElementById("api-key-status").hidden = true;
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
    showApiKeyStatus(t("settingsApiKeySaved"), "var(--leaf)");
  });

  document.getElementById("clear-api-key").addEventListener("click", () => {
    Store.setApiKey("");
    document.getElementById("input-api-key").value = "";
    refreshChatGate();
    showApiKeyStatus(t("settingsApiKeyCleared"), "var(--ink-soft)");
  });

  document.getElementById("test-api-key").addEventListener("click", testApiKey);

  document.getElementById("chat-send").addEventListener("click", sendChatMessage);
  document.getElementById("chat-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendChatMessage();
    }
  });

  document.getElementById("today-add-task").addEventListener("click", () => openTaskForm(null));
  document.getElementById("task-form-back").addEventListener("click", closeTaskForm);
  document.getElementById("task-save").addEventListener("click", saveTaskForm);
  document.getElementById("task-delete").addEventListener("click", deleteTaskForm);

  document.getElementById("open-lists").addEventListener("click", openLists);
  document.getElementById("lists-back").addEventListener("click", closeLists);
  document.getElementById("add-list").addEventListener("click", addList);

  document.getElementById("open-all-tasks").addEventListener("click", openAllTasks);
  document.getElementById("all-tasks-back").addEventListener("click", closeAllTasks);
  document.getElementById("all-tasks-search").addEventListener("input", renderAllTasks);
  document.getElementById("all-tasks-filter-list").addEventListener("change", renderAllTasks);
  document.getElementById("all-tasks-filter-status").addEventListener("change", renderAllTasks);

  document.getElementById("people-add").addEventListener("click", () => openPersonForm(null));
  document.getElementById("people-search").addEventListener("input", renderPeople);
  document.getElementById("person-form-back").addEventListener("click", closePersonForm);
  document.getElementById("person-save").addEventListener("click", savePersonForm);
  document.getElementById("person-delete").addEventListener("click", deletePersonForm);
  document.getElementById("interaction-add").addEventListener("click", addInteraction);
}

function init() {
  applyTheme();
  applyI18n();
  refreshChatGate();
  renderToday();
  wireEvents();
}

document.addEventListener("DOMContentLoaded", init);
