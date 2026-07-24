import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../l10n/app_localizations.dart';
import '../../settings/settings.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  late final TextEditingController _apiKeyController;
  bool _obscureKey = true;

  @override
  void initState() {
    super.initState();
    _apiKeyController =
        TextEditingController(text: ref.read(settingsProvider).apiKey);
  }

  @override
  void dispose() {
    _apiKeyController.dispose();
    super.dispose();
  }

  void _saveApiKey() {
    final key = _apiKeyController.text.trim();
    ref.read(settingsProvider.notifier).setApiKey(key);
    final l10n = L10n.of(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          key.isEmpty ? l10n.settingsApiKeyCleared : l10n.settingsApiKeySaved,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final settings = ref.watch(settingsProvider);
    final controller = ref.read(settingsProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.settingsTitle)),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
        children: [
          _SectionHeader(l10n.settingsAppearance),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.language_rounded),
                  title: Text(l10n.settingsLanguage),
                  trailing: DropdownButton<String>(
                    value: settings.locale?.languageCode ?? 'system',
                    underline: const SizedBox.shrink(),
                    borderRadius: BorderRadius.circular(16),
                    onChanged: (value) => controller.setLocale(
                      value == 'system' ? null : Locale(value!),
                    ),
                    items: [
                      DropdownMenuItem(
                        value: 'system',
                        child: Text(l10n.settingsThemeSystem),
                      ),
                      const DropdownMenuItem(
                        value: 'en',
                        child: Text('English'),
                      ),
                      const DropdownMenuItem(
                        value: 'id',
                        child: Text('Bahasa Indonesia'),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1, indent: 16, endIndent: 16),
                ListTile(
                  leading: const Icon(Icons.palette_rounded),
                  title: Text(l10n.settingsTheme),
                  trailing: DropdownButton<ThemeMode>(
                    value: settings.themeMode,
                    underline: const SizedBox.shrink(),
                    borderRadius: BorderRadius.circular(16),
                    onChanged: (mode) => controller.setThemeMode(mode!),
                    items: [
                      DropdownMenuItem(
                        value: ThemeMode.system,
                        child: Text(l10n.settingsThemeSystem),
                      ),
                      DropdownMenuItem(
                        value: ThemeMode.light,
                        child: Text(l10n.settingsThemeLight),
                      ),
                      DropdownMenuItem(
                        value: ThemeMode.dark,
                        child: Text(l10n.settingsThemeDark),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),
          _SectionHeader(l10n.settingsAi),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    l10n.settingsApiKey,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _apiKeyController,
                    obscureText: _obscureKey,
                    autocorrect: false,
                    enableSuggestions: false,
                    decoration: InputDecoration(
                      hintText: l10n.settingsApiKeyHint,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscureKey
                              ? Icons.visibility_rounded
                              : Icons.visibility_off_rounded,
                        ),
                        onPressed: () =>
                            setState(() => _obscureKey = !_obscureKey),
                      ),
                    ),
                    onSubmitted: (_) => _saveApiKey(),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    l10n.settingsApiKeyHelp,
                    style: TextStyle(
                      fontSize: 13,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: _saveApiKey,
                          child: Text(l10n.actionSave),
                        ),
                      ),
                      const SizedBox(width: 12),
                      TextButton(
                        onPressed: () {
                          _apiKeyController.clear();
                          _saveApiKey();
                        },
                        child: Text(l10n.actionClear),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: const Icon(Icons.auto_awesome_rounded),
              title: Text(l10n.settingsModel),
              subtitle: Text(_modelLabel(l10n, settings.model)),
              trailing: DropdownButton<SatuModel>(
                value: settings.model,
                underline: const SizedBox.shrink(),
                borderRadius: BorderRadius.circular(16),
                onChanged: (model) => controller.setModel(model!),
                items: [
                  for (final model in SatuModel.values)
                    DropdownMenuItem(
                      value: model,
                      child: Text(_modelName(model)),
                    ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),
          _SectionHeader(l10n.settingsAbout),
          Card(
            child: ListTile(
              leading: const Icon(Icons.info_rounded),
              title: Text(l10n.appName),
              subtitle: Text(l10n.appTagline),
            ),
          ),
        ],
      ),
    );
  }

  String _modelName(SatuModel model) => switch (model) {
        SatuModel.opus => 'Opus',
        SatuModel.sonnet => 'Sonnet',
        SatuModel.haiku => 'Haiku',
      };

  String _modelLabel(L10n l10n, SatuModel model) => switch (model) {
        SatuModel.opus => l10n.settingsModelOpus,
        SatuModel.sonnet => l10n.settingsModelSonnet,
        SatuModel.haiku => l10n.settingsModelHaiku,
      };
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }
}
