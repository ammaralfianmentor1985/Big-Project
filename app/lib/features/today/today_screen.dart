import 'package:flutter/material.dart';

import '../../l10n/app_localizations.dart';
import '../../theme/app_theme.dart';
import '../../widgets/empty_state.dart';

class TodayScreen extends StatelessWidget {
  const TodayScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.todayTitle)),
      body: EmptyState(
        icon: Icons.wb_sunny_rounded,
        accent: SatuColors.sun,
        title: l10n.todayEmptyTitle,
        body: l10n.todayEmptyBody,
      ),
    );
  }
}
