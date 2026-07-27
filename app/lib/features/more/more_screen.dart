import 'package:flutter/material.dart';

import '../../l10n/app_localizations.dart';
import '../../theme/app_theme.dart';
import '../settings/settings_screen.dart';

/// Hub for the modules that don't warrant a permanent tab, plus settings.
/// Modules land here as later phases build them out.
class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.moreTitle)),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        children: [
          _Tile(
            icon: Icons.menu_book_rounded,
            color: SatuColors.berry,
            label: l10n.moreJournal,
            trailing: l10n.comingSoon,
          ),
          const SizedBox(height: 12),
          _Tile(
            icon: Icons.school_rounded,
            color: SatuColors.leaf,
            label: l10n.moreStudy,
            trailing: l10n.comingSoon,
          ),
          const SizedBox(height: 12),
          _Tile(
            icon: Icons.slideshow_rounded,
            color: SatuColors.sun,
            label: l10n.moreDecks,
            trailing: l10n.comingSoon,
          ),
          const SizedBox(height: 12),
          _Tile(
            icon: Icons.settings_rounded,
            color: SatuColors.seed,
            label: l10n.moreSettings,
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute<void>(builder: (_) => const SettingsScreen()),
            ),
          ),
        ],
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  const _Tile({
    required this.icon,
    required this.color,
    required this.label,
    this.trailing,
    this.onTap,
  });

  final IconData icon;
  final Color color;
  final String label;
  final String? trailing;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Card(
      child: ListTile(
        onTap: onTap,
        enabled: onTap != null,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
        ),
        trailing: trailing == null
            ? const Icon(Icons.chevron_right_rounded)
            : Text(
                trailing!,
                style: TextStyle(
                  color: scheme.onSurfaceVariant,
                  fontSize: 13,
                ),
              ),
      ),
    );
  }
}
