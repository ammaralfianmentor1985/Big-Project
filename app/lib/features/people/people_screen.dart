import 'package:flutter/material.dart';

import '../../l10n/app_localizations.dart';
import '../../theme/app_theme.dart';
import '../../widgets/empty_state.dart';

class PeopleScreen extends StatelessWidget {
  const PeopleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.peopleTitle)),
      body: EmptyState(
        icon: Icons.people_alt_rounded,
        accent: SatuColors.teal,
        title: l10n.peopleEmptyTitle,
        body: l10n.peopleEmptyBody,
      ),
    );
  }
}
