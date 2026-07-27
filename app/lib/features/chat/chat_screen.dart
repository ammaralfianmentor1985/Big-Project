import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../l10n/app_localizations.dart';
import '../../settings/settings.dart';
import '../../theme/app_theme.dart';
import '../../widgets/empty_state.dart';
import '../settings/settings_screen.dart';

/// Placeholder for the AI assistant. Phase 3 replaces the body with a real
/// streaming conversation; until then it explains the API key requirement.
class ChatScreen extends ConsumerWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final hasKey = ref.watch(settingsProvider).hasApiKey;

    return Scaffold(
      appBar: AppBar(title: Text(l10n.chatTitle)),
      body: hasKey
          ? EmptyState(
              icon: Icons.auto_awesome_rounded,
              accent: SatuColors.grape,
              title: l10n.chatEmptyTitle,
              body: l10n.chatEmptyBody,
            )
          : EmptyState(
              icon: Icons.key_rounded,
              accent: SatuColors.grape,
              title: l10n.chatNeedsKeyTitle,
              body: l10n.chatNeedsKeyBody,
              action: FilledButton(
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const SettingsScreen(),
                  ),
                ),
                child: Text(l10n.chatNeedsKeyAction),
              ),
            ),
    );
  }
}
