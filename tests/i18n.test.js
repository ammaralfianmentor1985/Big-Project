const test = require("node:test");
const assert = require("node:assert/strict");

// i18n.js references `Store` and `navigator` as free variables (they're
// globals in the browser); stub both before requiring it. Node 22 defines
// its own read-only `navigator` global, so it must be deleted first or
// this assignment silently no-ops.
delete global.navigator;
global.navigator = { language: "en-US" };
let currentLocale = null;
global.Store = { getLocale: () => currentLocale };

const { STRINGS, t, detectLocale } = require("../web/js/i18n.js");

test("English and Indonesian dictionaries define the same keys", () => {
  const enKeys = Object.keys(STRINGS.en).sort();
  const idKeys = Object.keys(STRINGS.id).sort();
  assert.deepEqual(idKeys, enKeys, "app_id strings are missing/extra vs app_en");
});

test("detectLocale falls back to English for an unsupported device language", () => {
  global.navigator.language = "fr-FR";
  assert.equal(detectLocale(), "en");
});

test("detectLocale picks Indonesian when the device is set to id", () => {
  global.navigator.language = "id-ID";
  assert.equal(detectLocale(), "id");
});

test("t() follows the stored locale once one is set", () => {
  currentLocale = null;
  global.navigator.language = "en-US";
  assert.equal(t("navToday"), "Today");

  currentLocale = "id";
  assert.equal(t("navToday"), "Hari ini");
});

test("t() falls back to the key itself for an unknown string", () => {
  assert.equal(t("thisKeyDoesNotExist"), "thisKeyDoesNotExist");
});
