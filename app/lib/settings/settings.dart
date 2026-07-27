import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Claude models Satu can talk to. Ordered cheapest-last so the picker reads
/// smartest → cheapest, matching how the settings screen explains them.
enum SatuModel {
  opus('claude-opus-5'),
  sonnet('claude-sonnet-5'),
  haiku('claude-haiku-4-5');

  const SatuModel(this.id);

  /// The exact model ID sent to the Anthropic API.
  final String id;

  static SatuModel fromId(String? id) =>
      SatuModel.values.firstWhere((m) => m.id == id, orElse: () => sonnet);
}

@immutable
class Settings {
  const Settings({
    this.locale,
    this.themeMode = ThemeMode.system,
    this.apiKey = '',
    this.model = SatuModel.sonnet,
  });

  /// `null` means "follow the device language".
  final Locale? locale;
  final ThemeMode themeMode;
  final String apiKey;
  final SatuModel model;

  bool get hasApiKey => apiKey.trim().isNotEmpty;

  Settings copyWith({
    Locale? locale,
    bool clearLocale = false,
    ThemeMode? themeMode,
    String? apiKey,
    SatuModel? model,
  }) {
    return Settings(
      locale: clearLocale ? null : (locale ?? this.locale),
      themeMode: themeMode ?? this.themeMode,
      apiKey: apiKey ?? this.apiKey,
      model: model ?? this.model,
    );
  }
}

/// Reads and writes settings to device storage. On web this is backed by
/// localStorage, so the API key never leaves the browser.
class SettingsController extends Notifier<Settings> {
  static const _kLocale = 'locale';
  static const _kThemeMode = 'themeMode';
  static const _kApiKey = 'apiKey';
  static const _kModel = 'model';

  SharedPreferences? _prefs;

  @override
  Settings build() {
    // Start with defaults, then swap in stored values once storage is ready.
    _load();
    return const Settings();
  }

  Future<void> _load() async {
    final prefs = _prefs = await SharedPreferences.getInstance();
    final localeCode = prefs.getString(_kLocale);
    state = Settings(
      locale: localeCode == null ? null : Locale(localeCode),
      themeMode: ThemeMode.values.firstWhere(
        (m) => m.name == prefs.getString(_kThemeMode),
        orElse: () => ThemeMode.system,
      ),
      apiKey: prefs.getString(_kApiKey) ?? '',
      model: SatuModel.fromId(prefs.getString(_kModel)),
    );
  }

  Future<void> setLocale(Locale? locale) async {
    state = state.copyWith(locale: locale, clearLocale: locale == null);
    if (locale == null) {
      await _prefs?.remove(_kLocale);
    } else {
      await _prefs?.setString(_kLocale, locale.languageCode);
    }
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    state = state.copyWith(themeMode: mode);
    await _prefs?.setString(_kThemeMode, mode.name);
  }

  Future<void> setApiKey(String key) async {
    final trimmed = key.trim();
    state = state.copyWith(apiKey: trimmed);
    if (trimmed.isEmpty) {
      await _prefs?.remove(_kApiKey);
    } else {
      await _prefs?.setString(_kApiKey, trimmed);
    }
  }

  Future<void> setModel(SatuModel model) async {
    state = state.copyWith(model: model);
    await _prefs?.setString(_kModel, model.id);
  }
}

final settingsProvider =
    NotifierProvider<SettingsController, Settings>(SettingsController.new);
