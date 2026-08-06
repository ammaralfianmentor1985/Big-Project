// English and Bahasa Indonesia strings. Same copy as the original app,
// just plain objects instead of ARB files — no codegen step needed.
const STRINGS = {
  en: {
    appName: "Satu",
    appTagline: "Your everything app",

    navToday: "Today",
    navPeople: "People",
    navChat: "Chat",
    navMore: "More",

    todayTitle: "Today",
    todayEmptyTitle: "Nothing due today",
    todayEmptyBody: "Tasks you add will show up here when they're due.",

    peopleTitle: "People",
    peopleEmptyTitle: "No people yet",
    peopleEmptyBody: "Keep track of the people in your life — notes, birthdays, and follow-ups.",

    chatTitle: "Ask anything",
    chatEmptyTitle: "Your AI assistant",
    chatEmptyBody: "Research anything, summarize your notes, or plan your day.",
    chatNeedsKeyTitle: "Add an API key to start",
    chatNeedsKeyBody: "AI features need an Anthropic API key. It's stored only on this device.",
    chatNeedsKeyAction: "Open settings",

    moreTitle: "More",
    moreJournal: "Journal",
    moreStudy: "Study",
    moreDecks: "Slide decks",
    moreSettings: "Settings",
    comingSoon: "Coming soon",

    settingsTitle: "Settings",
    settingsAppearance: "Appearance",
    settingsLanguage: "Language",
    settingsTheme: "Theme",
    settingsThemeSystem: "Match device",
    settingsThemeLight: "Light",
    settingsThemeDark: "Dark",

    settingsAi: "AI",
    settingsApiKey: "Anthropic API key",
    settingsApiKeyHint: "sk-ant-api03-...",
    settingsApiKeyHelp: "Stored only on this device.",
    settingsApiKeySaved: "API key saved",
    settingsApiKeyCleared: "API key removed",
    settingsModel: "Model",
    settingsModelOpus: "Opus — smartest, costs more",
    settingsModelSonnet: "Sonnet — balanced (recommended)",
    settingsModelHaiku: "Haiku — fastest and cheapest",

    settingsAbout: "About",

    actionSave: "Save",
    actionClear: "Clear",
    actionBack: "Back",
  },
  id: {
    appName: "Satu",
    appTagline: "Aplikasi segalanya untukmu",

    navToday: "Hari ini",
    navPeople: "Orang",
    navChat: "Obrolan",
    navMore: "Lainnya",

    todayTitle: "Hari ini",
    todayEmptyTitle: "Tidak ada tugas hari ini",
    todayEmptyBody: "Tugas yang kamu tambahkan akan muncul di sini saat jatuh tempo.",

    peopleTitle: "Orang",
    peopleEmptyTitle: "Belum ada orang",
    peopleEmptyBody: "Catat orang-orang dalam hidupmu — catatan, ulang tahun, dan tindak lanjut.",

    chatTitle: "Tanya apa saja",
    chatEmptyTitle: "Asisten AI kamu",
    chatEmptyBody: "Riset apa pun, ringkas catatanmu, atau rencanakan harimu.",
    chatNeedsKeyTitle: "Tambahkan kunci API untuk mulai",
    chatNeedsKeyBody: "Fitur AI memerlukan kunci API Anthropic. Kunci disimpan hanya di perangkat ini.",
    chatNeedsKeyAction: "Buka pengaturan",

    moreTitle: "Lainnya",
    moreJournal: "Jurnal",
    moreStudy: "Belajar",
    moreDecks: "Presentasi",
    moreSettings: "Pengaturan",
    comingSoon: "Segera hadir",

    settingsTitle: "Pengaturan",
    settingsAppearance: "Tampilan",
    settingsLanguage: "Bahasa",
    settingsTheme: "Tema",
    settingsThemeSystem: "Ikuti perangkat",
    settingsThemeLight: "Terang",
    settingsThemeDark: "Gelap",

    settingsAi: "AI",
    settingsApiKey: "Kunci API Anthropic",
    settingsApiKeyHint: "sk-ant-api03-...",
    settingsApiKeyHelp: "Disimpan hanya di perangkat ini.",
    settingsApiKeySaved: "Kunci API tersimpan",
    settingsApiKeyCleared: "Kunci API dihapus",
    settingsModel: "Model",
    settingsModelOpus: "Opus — paling pintar, lebih mahal",
    settingsModelSonnet: "Sonnet — seimbang (disarankan)",
    settingsModelHaiku: "Haiku — paling cepat dan murah",

    settingsAbout: "Tentang",

    actionSave: "Simpan",
    actionClear: "Hapus",
    actionBack: "Kembali",
  },
};

function t(key) {
  const lang = Store.getLocale() || detectLocale();
  return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
}

function detectLocale() {
  const nav = (navigator.language || "en").slice(0, 2);
  return STRINGS[nav] ? nav : "en";
}

// Node test runner support only — browsers never define `module`.
if (typeof module !== "undefined") module.exports = { STRINGS, t, detectLocale };
