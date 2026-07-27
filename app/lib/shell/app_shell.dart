import 'package:flutter/material.dart';

import '../features/chat/chat_screen.dart';
import '../features/more/more_screen.dart';
import '../features/people/people_screen.dart';
import '../features/today/today_screen.dart';
import '../l10n/app_localizations.dart';

/// Bottom-nav container. Each tab keeps its own state across switches.
class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _index = 0;

  static const _screens = <Widget>[
    TodayScreen(),
    PeopleScreen(),
    ChatScreen(),
    MoreScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);

    return Scaffold(
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.wb_sunny_outlined),
            selectedIcon: const Icon(Icons.wb_sunny_rounded),
            label: l10n.navToday,
          ),
          NavigationDestination(
            icon: const Icon(Icons.people_alt_outlined),
            selectedIcon: const Icon(Icons.people_alt_rounded),
            label: l10n.navPeople,
          ),
          NavigationDestination(
            icon: const Icon(Icons.auto_awesome_outlined),
            selectedIcon: const Icon(Icons.auto_awesome_rounded),
            label: l10n.navChat,
          ),
          NavigationDestination(
            icon: const Icon(Icons.grid_view_outlined),
            selectedIcon: const Icon(Icons.grid_view_rounded),
            label: l10n.navMore,
          ),
        ],
      ),
    );
  }
}
