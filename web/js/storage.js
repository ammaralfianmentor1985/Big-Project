// Settings persistence via localStorage. Everything stays on-device —
// the API key never touches the repo or any server.
const Store = (() => {
  const KEYS = {
    locale: "satu.locale",
    theme: "satu.theme",
    apiKey: "satu.apiKey",
    model: "satu.model",
  };

  const MODELS = {
    opus: "claude-opus-5",
    sonnet: "claude-sonnet-5",
    haiku: "claude-haiku-4-5",
  };

  return {
    getLocale() {
      return localStorage.getItem(KEYS.locale); // null = follow device
    },
    setLocale(locale) {
      if (locale) localStorage.setItem(KEYS.locale, locale);
      else localStorage.removeItem(KEYS.locale);
    },

    getTheme() {
      return localStorage.getItem(KEYS.theme) || "system";
    },
    setTheme(theme) {
      localStorage.setItem(KEYS.theme, theme);
    },

    getApiKey() {
      return localStorage.getItem(KEYS.apiKey) || "";
    },
    setApiKey(key) {
      const trimmed = (key || "").trim();
      if (trimmed) localStorage.setItem(KEYS.apiKey, trimmed);
      else localStorage.removeItem(KEYS.apiKey);
    },
    hasApiKey() {
      return this.getApiKey().length > 0;
    },

    getModel() {
      return localStorage.getItem(KEYS.model) || MODELS.sonnet;
    },
    setModel(modelId) {
      localStorage.setItem(KEYS.model, modelId);
    },

    MODELS,
  };
})();

function applyTheme() {
  const theme = Store.getTheme();
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

// Node test runner support only — browsers never define `module`.
if (typeof module !== "undefined") module.exports = { Store };
