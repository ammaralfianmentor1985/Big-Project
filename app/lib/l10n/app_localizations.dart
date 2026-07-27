import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_id.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of L10n
/// returned by `L10n.of(context)`.
///
/// Applications need to include `L10n.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: L10n.localizationsDelegates,
///   supportedLocales: L10n.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the L10n.supportedLocales
/// property.
abstract class L10n {
  L10n(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static L10n of(BuildContext context) {
    return Localizations.of<L10n>(context, L10n)!;
  }

  static const LocalizationsDelegate<L10n> delegate = _L10nDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('id'),
  ];

  /// No description provided for @appName.
  ///
  /// In en, this message translates to:
  /// **'Satu'**
  String get appName;

  /// No description provided for @appTagline.
  ///
  /// In en, this message translates to:
  /// **'Your everything app'**
  String get appTagline;

  /// No description provided for @navToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get navToday;

  /// No description provided for @navPeople.
  ///
  /// In en, this message translates to:
  /// **'People'**
  String get navPeople;

  /// No description provided for @navChat.
  ///
  /// In en, this message translates to:
  /// **'Chat'**
  String get navChat;

  /// No description provided for @navMore.
  ///
  /// In en, this message translates to:
  /// **'More'**
  String get navMore;

  /// No description provided for @todayTitle.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get todayTitle;

  /// No description provided for @todayEmptyTitle.
  ///
  /// In en, this message translates to:
  /// **'Nothing due today'**
  String get todayEmptyTitle;

  /// No description provided for @todayEmptyBody.
  ///
  /// In en, this message translates to:
  /// **'Tasks you add will show up here when they\'re due.'**
  String get todayEmptyBody;

  /// No description provided for @peopleTitle.
  ///
  /// In en, this message translates to:
  /// **'People'**
  String get peopleTitle;

  /// No description provided for @peopleEmptyTitle.
  ///
  /// In en, this message translates to:
  /// **'No people yet'**
  String get peopleEmptyTitle;

  /// No description provided for @peopleEmptyBody.
  ///
  /// In en, this message translates to:
  /// **'Keep track of the people in your life — notes, birthdays, and follow-ups.'**
  String get peopleEmptyBody;

  /// No description provided for @chatTitle.
  ///
  /// In en, this message translates to:
  /// **'Ask anything'**
  String get chatTitle;

  /// No description provided for @chatEmptyTitle.
  ///
  /// In en, this message translates to:
  /// **'Your AI assistant'**
  String get chatEmptyTitle;

  /// No description provided for @chatEmptyBody.
  ///
  /// In en, this message translates to:
  /// **'Research anything, summarize your notes, or plan your day.'**
  String get chatEmptyBody;

  /// No description provided for @chatNeedsKeyTitle.
  ///
  /// In en, this message translates to:
  /// **'Add an API key to start'**
  String get chatNeedsKeyTitle;

  /// No description provided for @chatNeedsKeyBody.
  ///
  /// In en, this message translates to:
  /// **'AI features need an Anthropic API key. It\'s stored only on this device.'**
  String get chatNeedsKeyBody;

  /// No description provided for @chatNeedsKeyAction.
  ///
  /// In en, this message translates to:
  /// **'Open settings'**
  String get chatNeedsKeyAction;

  /// No description provided for @moreTitle.
  ///
  /// In en, this message translates to:
  /// **'More'**
  String get moreTitle;

  /// No description provided for @moreJournal.
  ///
  /// In en, this message translates to:
  /// **'Journal'**
  String get moreJournal;

  /// No description provided for @moreStudy.
  ///
  /// In en, this message translates to:
  /// **'Study'**
  String get moreStudy;

  /// No description provided for @moreDecks.
  ///
  /// In en, this message translates to:
  /// **'Slide decks'**
  String get moreDecks;

  /// No description provided for @moreSettings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get moreSettings;

  /// No description provided for @comingSoon.
  ///
  /// In en, this message translates to:
  /// **'Coming soon'**
  String get comingSoon;

  /// No description provided for @settingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsTitle;

  /// No description provided for @settingsAppearance.
  ///
  /// In en, this message translates to:
  /// **'Appearance'**
  String get settingsAppearance;

  /// No description provided for @settingsLanguage.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get settingsLanguage;

  /// No description provided for @settingsTheme.
  ///
  /// In en, this message translates to:
  /// **'Theme'**
  String get settingsTheme;

  /// No description provided for @settingsThemeSystem.
  ///
  /// In en, this message translates to:
  /// **'Match device'**
  String get settingsThemeSystem;

  /// No description provided for @settingsThemeLight.
  ///
  /// In en, this message translates to:
  /// **'Light'**
  String get settingsThemeLight;

  /// No description provided for @settingsThemeDark.
  ///
  /// In en, this message translates to:
  /// **'Dark'**
  String get settingsThemeDark;

  /// No description provided for @settingsAi.
  ///
  /// In en, this message translates to:
  /// **'AI'**
  String get settingsAi;

  /// No description provided for @settingsApiKey.
  ///
  /// In en, this message translates to:
  /// **'Anthropic API key'**
  String get settingsApiKey;

  /// No description provided for @settingsApiKeyHint.
  ///
  /// In en, this message translates to:
  /// **'sk-ant-api03-...'**
  String get settingsApiKeyHint;

  /// No description provided for @settingsApiKeyHelp.
  ///
  /// In en, this message translates to:
  /// **'Stored only on this device. Tap to learn how to get one.'**
  String get settingsApiKeyHelp;

  /// No description provided for @settingsApiKeySaved.
  ///
  /// In en, this message translates to:
  /// **'API key saved'**
  String get settingsApiKeySaved;

  /// No description provided for @settingsApiKeyCleared.
  ///
  /// In en, this message translates to:
  /// **'API key removed'**
  String get settingsApiKeyCleared;

  /// No description provided for @settingsModel.
  ///
  /// In en, this message translates to:
  /// **'Model'**
  String get settingsModel;

  /// No description provided for @settingsModelOpus.
  ///
  /// In en, this message translates to:
  /// **'Opus — smartest, costs more'**
  String get settingsModelOpus;

  /// No description provided for @settingsModelSonnet.
  ///
  /// In en, this message translates to:
  /// **'Sonnet — balanced (recommended)'**
  String get settingsModelSonnet;

  /// No description provided for @settingsModelHaiku.
  ///
  /// In en, this message translates to:
  /// **'Haiku — fastest and cheapest'**
  String get settingsModelHaiku;

  /// No description provided for @settingsAbout.
  ///
  /// In en, this message translates to:
  /// **'About'**
  String get settingsAbout;

  /// No description provided for @settingsVersion.
  ///
  /// In en, this message translates to:
  /// **'Version'**
  String get settingsVersion;

  /// No description provided for @actionSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get actionSave;

  /// No description provided for @actionClear.
  ///
  /// In en, this message translates to:
  /// **'Clear'**
  String get actionClear;

  /// No description provided for @actionCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get actionCancel;
}

class _L10nDelegate extends LocalizationsDelegate<L10n> {
  const _L10nDelegate();

  @override
  Future<L10n> load(Locale locale) {
    return SynchronousFuture<L10n>(lookupL10n(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'id'].contains(locale.languageCode);

  @override
  bool shouldReload(_L10nDelegate old) => false;
}

L10n lookupL10n(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return L10nEn();
    case 'id':
      return L10nId();
  }

  throw FlutterError(
    'L10n.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
