import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:satu/main.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  Future<void> pumpApp(WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: SatuApp()));
    await tester.pumpAndSettle();
  }

  testWidgets('opens on the Today tab', (tester) async {
    await pumpApp(tester);

    expect(find.text('Nothing due today'), findsOneWidget);
  });

  testWidgets('navigates between tabs', (tester) async {
    await pumpApp(tester);

    await tester.tap(find.byIcon(Icons.people_alt_outlined));
    await tester.pumpAndSettle();
    expect(find.text('No people yet'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.auto_awesome_outlined));
    await tester.pumpAndSettle();
    expect(find.text('Add an API key to start'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.grid_view_outlined));
    await tester.pumpAndSettle();
    expect(find.text('Settings'), findsOneWidget);
  });

  testWidgets('chat prompts for a key and links to settings', (tester) async {
    await pumpApp(tester);

    await tester.tap(find.byIcon(Icons.auto_awesome_outlined));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Open settings'));
    await tester.pumpAndSettle();

    expect(find.text('Anthropic API key'), findsOneWidget);
  });

  testWidgets('switching language to Indonesian relabels the UI',
      (tester) async {
    await pumpApp(tester);

    await tester.tap(find.byIcon(Icons.grid_view_outlined));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Settings').last);
    await tester.pumpAndSettle();

    await tester.tap(find.text('Match device').first);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Bahasa Indonesia').last);
    await tester.pumpAndSettle();

    expect(find.text('Pengaturan'), findsWidgets);
  });
}
