import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:satu/settings/settings.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  /// Settings load asynchronously, so tests wait for the first read to land.
  Future<ProviderContainer> makeContainer() async {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    container.read(settingsProvider);
    await Future<void>.delayed(Duration.zero);
    return container;
  }

  test('defaults to system locale, system theme, Sonnet, and no key',
      () async {
    final container = await makeContainer();
    final settings = container.read(settingsProvider);

    expect(settings.locale, isNull);
    expect(settings.themeMode, ThemeMode.system);
    expect(settings.model, SatuModel.sonnet);
    expect(settings.hasApiKey, isFalse);
  });

  test('persists the API key and reports it as present', () async {
    final container = await makeContainer();
    await container.read(settingsProvider.notifier).setApiKey('  sk-ant-test ');

    expect(container.read(settingsProvider).apiKey, 'sk-ant-test');
    expect(container.read(settingsProvider).hasApiKey, isTrue);

    final prefs = await SharedPreferences.getInstance();
    expect(prefs.getString('apiKey'), 'sk-ant-test');
  });

  test('clearing the API key removes it from storage', () async {
    final container = await makeContainer();
    final controller = container.read(settingsProvider.notifier);
    await controller.setApiKey('sk-ant-test');
    await controller.setApiKey('');

    expect(container.read(settingsProvider).hasApiKey, isFalse);
    final prefs = await SharedPreferences.getInstance();
    expect(prefs.getString('apiKey'), isNull);
  });

  test('locale can be set and reset back to system', () async {
    final container = await makeContainer();
    final controller = container.read(settingsProvider.notifier);

    await controller.setLocale(const Locale('id'));
    expect(container.read(settingsProvider).locale?.languageCode, 'id');

    await controller.setLocale(null);
    expect(container.read(settingsProvider).locale, isNull);
  });

  test('model selection round-trips through storage', () async {
    final container = await makeContainer();
    await container.read(settingsProvider.notifier).setModel(SatuModel.opus);

    expect(container.read(settingsProvider).model, SatuModel.opus);
    final prefs = await SharedPreferences.getInstance();
    expect(prefs.getString('model'), 'claude-opus-5');
  });

  test('unknown stored model id falls back to Sonnet', () {
    expect(SatuModel.fromId('claude-nonexistent'), SatuModel.sonnet);
    expect(SatuModel.fromId(null), SatuModel.sonnet);
    expect(SatuModel.fromId('claude-opus-5'), SatuModel.opus);
  });
}
