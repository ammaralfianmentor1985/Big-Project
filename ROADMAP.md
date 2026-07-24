# Satu — Build Roadmap

This file drives the autonomous build sessions. Each session:

1. Reads this file and picks the **next unchecked task** (top to bottom).
2. Implements 1–2 tasks, keeping changes small and working.
3. Runs `flutter analyze` and `flutter test` inside `app/` — both must pass.
4. Commits with a clear message and pushes to `claude/life-management-app-planning-vqsbsd`.
5. Checks the task(s) off here in the same commit.

Rules for autonomous sessions:
- Never commit broken code. If a task can't be finished, leave it unchecked and note why below it.
- Keep the UI bilingual (add every new string to both `app_en.arb` and `app_id.arb`).
- Keep the colorful/friendly design language consistent.
- Never commit secrets. The user's Anthropic API key lives only in browser storage.

## Phase 0 — Foundation
- [x] Flutter project scaffold in `app/`
- [x] Colorful Material 3 theme, light + dark
- [x] Bottom navigation shell (Today, People, Chat, More)
- [x] Localization scaffold (EN + ID) with language toggle
- [x] Settings screen (language, theme mode, API key field, model choice)
- [x] PWA manifest + app icons
- [x] CI: analyze/test/build/deploy to GitHub Pages
- [ ] Drift database wired up (web WASM + native), with a `tasks` table migration
- [ ] App icon: replace default Flutter icons with a Satu logo (simple colorful "1" mark)

## Phase 1 — To-do
- [ ] Task model + repository (Drift): title, notes, due date, priority, done, list
- [ ] Today screen: list of tasks due today / overdue, check-off with a satisfying animation
- [ ] Add/edit task sheet (title, notes, due date, priority)
- [ ] Task lists/projects (create, rename, delete; tasks belong to a list)
- [ ] Recurring tasks (daily/weekly/monthly)
- [ ] All-tasks view with filters (list, done/undone, search)
- [ ] Widget tests for task creation and completion

## Phase 2 — Personal CRM
- [ ] Person model + repository: name, photo color, tags, birthday, notes
- [ ] People screen: searchable contact list
- [ ] Person detail: notes, interaction log (call/met/message + date + note)
- [ ] Follow-up reminders (surface "reach out to X" on Today screen)
- [ ] Birthdays and important dates on Today screen
- [ ] Widget tests for people CRUD

## Phase 3 — AI core
- [ ] Anthropic API client (direct browser calls; verify current CORS opt-in header against live docs)
- [ ] API key management in Settings (stored locally, test-connection button)
- [ ] Chat screen: streaming conversation with Claude (default model claude-opus-5, selectable)
- [ ] Quick research: ask-anything box on Today screen that opens a chat
- [ ] Contextual AI: "break this task into subtasks" on task detail
- [ ] Contextual AI: "suggest a follow-up message" on person detail
- [ ] Graceful no-key state everywhere + link to docs/GET-API-KEY.md instructions in-app

## Phase 4 — Journaling
- [ ] Journal entry model (date, text, mood 1–5)
- [ ] Journal screen: calendar/list of entries, add today's entry
- [ ] Mood tracking chart (last 30 days)
- [ ] Full-text search over entries
- [ ] AI: weekly journal summary (requires API key)

## Phase 5 — Study & learning
- [ ] Notes: simple markdown notes with folders
- [ ] Flashcards: deck + card models, spaced repetition (SM-2 style)
- [ ] Review screen with flip animation and grading buttons
- [ ] Learning goals with progress tracking
- [ ] AI: generate flashcards from a pasted text/note

## Phase 6 — Slide decks & media
- [ ] AI slide outline generator (topic → structured outline)
- [ ] Simple slide viewer (full-screen swipe deck from the outline)
- [ ] Export deck as markdown
- [ ] Media notes: save links/images with tags

## Phase 7 — Platforms & sync (needs user input first — do not start autonomously)
- [ ] Real iOS build via Codemagic or a Mac (needs Apple Developer account, $99/yr)
- [ ] Windows and macOS desktop builds
- [ ] Optional cloud sync backend
