// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class L10nEn extends L10n {
  L10nEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'Satu';

  @override
  String get appTagline => 'Your everything app';

  @override
  String get navToday => 'Today';

  @override
  String get navPeople => 'People';

  @override
  String get navChat => 'Chat';

  @override
  String get navMore => 'More';

  @override
  String get todayTitle => 'Today';

  @override
  String get todayEmptyTitle => 'Nothing due today';

  @override
  String get todayEmptyBody =>
      'Tasks you add will show up here when they\'re due.';

  @override
  String get peopleTitle => 'People';

  @override
  String get peopleEmptyTitle => 'No people yet';

  @override
  String get peopleEmptyBody =>
      'Keep track of the people in your life — notes, birthdays, and follow-ups.';

  @override
  String get chatTitle => 'Ask anything';

  @override
  String get chatEmptyTitle => 'Your AI assistant';

  @override
  String get chatEmptyBody =>
      'Research anything, summarize your notes, or plan your day.';

  @override
  String get chatNeedsKeyTitle => 'Add an API key to start';

  @override
  String get chatNeedsKeyBody =>
      'AI features need an Anthropic API key. It\'s stored only on this device.';

  @override
  String get chatNeedsKeyAction => 'Open settings';

  @override
  String get moreTitle => 'More';

  @override
  String get moreJournal => 'Journal';

  @override
  String get moreStudy => 'Study';

  @override
  String get moreDecks => 'Slide decks';

  @override
  String get moreSettings => 'Settings';

  @override
  String get comingSoon => 'Coming soon';

  @override
  String get settingsTitle => 'Settings';

  @override
  String get settingsAppearance => 'Appearance';

  @override
  String get settingsLanguage => 'Language';

  @override
  String get settingsTheme => 'Theme';

  @override
  String get settingsThemeSystem => 'Match device';

  @override
  String get settingsThemeLight => 'Light';

  @override
  String get settingsThemeDark => 'Dark';

  @override
  String get settingsAi => 'AI';

  @override
  String get settingsApiKey => 'Anthropic API key';

  @override
  String get settingsApiKeyHint => 'sk-ant-api03-...';

  @override
  String get settingsApiKeyHelp =>
      'Stored only on this device. Tap to learn how to get one.';

  @override
  String get settingsApiKeySaved => 'API key saved';

  @override
  String get settingsApiKeyCleared => 'API key removed';

  @override
  String get settingsModel => 'Model';

  @override
  String get settingsModelOpus => 'Opus — smartest, costs more';

  @override
  String get settingsModelSonnet => 'Sonnet — balanced (recommended)';

  @override
  String get settingsModelHaiku => 'Haiku — fastest and cheapest';

  @override
  String get settingsAbout => 'About';

  @override
  String get settingsVersion => 'Version';

  @override
  String get actionSave => 'Save';

  @override
  String get actionClear => 'Clear';

  @override
  String get actionCancel => 'Cancel';
}
