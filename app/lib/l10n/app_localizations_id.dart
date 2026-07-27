// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Indonesian (`id`).
class L10nId extends L10n {
  L10nId([String locale = 'id']) : super(locale);

  @override
  String get appName => 'Satu';

  @override
  String get appTagline => 'Aplikasi segalanya untukmu';

  @override
  String get navToday => 'Hari ini';

  @override
  String get navPeople => 'Orang';

  @override
  String get navChat => 'Obrolan';

  @override
  String get navMore => 'Lainnya';

  @override
  String get todayTitle => 'Hari ini';

  @override
  String get todayEmptyTitle => 'Tidak ada tugas hari ini';

  @override
  String get todayEmptyBody =>
      'Tugas yang kamu tambahkan akan muncul di sini saat jatuh tempo.';

  @override
  String get peopleTitle => 'Orang';

  @override
  String get peopleEmptyTitle => 'Belum ada orang';

  @override
  String get peopleEmptyBody =>
      'Catat orang-orang dalam hidupmu — catatan, ulang tahun, dan tindak lanjut.';

  @override
  String get chatTitle => 'Tanya apa saja';

  @override
  String get chatEmptyTitle => 'Asisten AI kamu';

  @override
  String get chatEmptyBody =>
      'Riset apa pun, ringkas catatanmu, atau rencanakan harimu.';

  @override
  String get chatNeedsKeyTitle => 'Tambahkan kunci API untuk mulai';

  @override
  String get chatNeedsKeyBody =>
      'Fitur AI memerlukan kunci API Anthropic. Kunci disimpan hanya di perangkat ini.';

  @override
  String get chatNeedsKeyAction => 'Buka pengaturan';

  @override
  String get moreTitle => 'Lainnya';

  @override
  String get moreJournal => 'Jurnal';

  @override
  String get moreStudy => 'Belajar';

  @override
  String get moreDecks => 'Presentasi';

  @override
  String get moreSettings => 'Pengaturan';

  @override
  String get comingSoon => 'Segera hadir';

  @override
  String get settingsTitle => 'Pengaturan';

  @override
  String get settingsAppearance => 'Tampilan';

  @override
  String get settingsLanguage => 'Bahasa';

  @override
  String get settingsTheme => 'Tema';

  @override
  String get settingsThemeSystem => 'Ikuti perangkat';

  @override
  String get settingsThemeLight => 'Terang';

  @override
  String get settingsThemeDark => 'Gelap';

  @override
  String get settingsAi => 'AI';

  @override
  String get settingsApiKey => 'Kunci API Anthropic';

  @override
  String get settingsApiKeyHint => 'sk-ant-api03-...';

  @override
  String get settingsApiKeyHelp =>
      'Disimpan hanya di perangkat ini. Ketuk untuk tahu cara mendapatkannya.';

  @override
  String get settingsApiKeySaved => 'Kunci API tersimpan';

  @override
  String get settingsApiKeyCleared => 'Kunci API dihapus';

  @override
  String get settingsModel => 'Model';

  @override
  String get settingsModelOpus => 'Opus — paling pintar, lebih mahal';

  @override
  String get settingsModelSonnet => 'Sonnet — seimbang (disarankan)';

  @override
  String get settingsModelHaiku => 'Haiku — paling cepat dan murah';

  @override
  String get settingsAbout => 'Tentang';

  @override
  String get settingsVersion => 'Versi';

  @override
  String get actionSave => 'Simpan';

  @override
  String get actionClear => 'Hapus';

  @override
  String get actionCancel => 'Batal';
}
