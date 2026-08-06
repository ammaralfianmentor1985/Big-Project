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
}

function init() {
  applyTheme();
  applyI18n();
  refreshChatGate();
  wireEvents();
}

document.addEventListener("DOMContentLoaded", init);
