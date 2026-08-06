# Satu — Build Roadmap

This file drives the autonomous build sessions. Each session:

1. Reads this file and picks the **next unchecked task** (top to bottom).
2. Implements 1–2 tasks, keeping changes small and working.
3. Runs `node --test` — all tests must pass. If a task touches `web/index.html` or
   `web/manifest.json`, also re-check they're well-formed (see the `validate` job in
   `.github/workflows/deploy.yml` for the exact check).
4. Commits with a clear message and pushes to `claude/life-management-app-planning-vqsbsd`.
5. Checks the task(s) off here in the same commit.

Rules for autonomous sessions:
- Never commit broken code. If a task can't be finished, leave it unchecked and note why below it.
- No framework, no build step, no npm dependencies. Plain HTML/CSS/JS that runs by being
  served as-is — that's the whole point of this stack.
- Keep the UI bilingual: add every new string to both `STRINGS.en` and `STRINGS.id` in
  `web/js/i18n.js`, and give every user-facing element a `data-t`/`data-t-placeholder`
  attribute instead of hardcoding text.
- Keep the colorful/friendly design language consistent — reuse the tokens in
  `web/css/theme.css` (`--mango`, `--teal`, `--grape`, `--berry`, `--leaf`, `--sun`)
  rather than introducing new colors.
- All data lives in the browser (`localStorage`, or `IndexedDB` if a module's data
  outgrows it) via a small store module in `web/js/`, same pattern as `storage.js`.
  Never commit secrets — the user's Anthropic API key lives only in browser storage.
- New logic that isn't purely DOM glue should be written so it can be `require()`'d from
  a Node test (see the `module.exports` shim at the bottom of `storage.js` / `i18n.js`),
  with a matching test file under `tests/`.

## Phase 0 — Foundation
- [x] Static site scaffold in `web/` (no framework, no build step)
- [x] Colorful theme (light + dark) via CSS custom properties
- [x] Bottom navigation shell (Today, People, Chat, More)
- [x] Localization module (EN + ID) with language toggle
- [x] Settings screen (language, theme mode, API key field, model choice)
- [x] PWA manifest + app icons
- [x] CI: validate HTML/JSON + run tests + deploy to GitHub Pages
- [x] App icon: simple colorful mango-circle mark (`web/icons/`)
- [x] Shared `Tasks` store module (`web/js/tasks.js`) backed by `localStorage`, JSON-encoded
      array of task records, with a matching `tests/tasks.test.js`

## Phase 1 — To-do
- [x] Task record shape: id, title, notes, due date, priority, done, list id
- [x] Today screen: list of tasks due today / overdue, check off with a satisfying animation
- [x] Add/edit task form (title, notes, due date, priority) as an in-page panel like Settings
- [ ] Task lists/projects (create, rename, delete; tasks belong to a list)
- [ ] Recurring tasks (daily/weekly/monthly)
- [ ] All-tasks view with filters (list, done/undone, search)
- [ ] Tests for task store: add/edit/complete/delete, recurrence rollover

## Phase 2 — Personal CRM
- [ ] Person record shape: id, name, photo color, tags, birthday, notes
- [ ] People screen: searchable contact list
- [ ] Person detail panel: notes, interaction log (call/met/message + date + note)
- [ ] Follow-up reminders (surface "reach out to X" on Today screen)
- [ ] Birthdays and important dates on Today screen
- [ ] Tests for people store: CRUD, interaction log, birthday lookup

## Phase 3 — AI core
- [ ] Anthropic API client (`web/js/ai.js`): `fetch` call to the Messages API with the
      `anthropic-dangerous-direct-browser-access` header — verify the exact header name
      against current Anthropic docs before relying on it, since browser-access support
      has changed before
- [ ] API key management in Settings: test-connection button using the client above
- [ ] Chat screen: real conversation with Claude (default model from `Store.getModel()`,
      selectable in Settings; models are `claude-opus-5` / `claude-sonnet-5` / `claude-haiku-4-5`)
- [ ] Quick research: ask-anything box on Today screen that opens the chat pre-filled
- [ ] Contextual AI: "break this task into subtasks" on task detail
- [ ] Contextual AI: "suggest a follow-up message" on person detail
- [ ] Graceful no-key state everywhere (already scaffolded in Chat) + link to
      `docs/GET-API-KEY.md` from every gate

## Phase 4 — Journaling
- [ ] Journal entry store: date, text, mood 1–5
- [ ] Journal screen: list of entries by date, add today's entry
- [ ] Mood tracking chart (last 30 days) — plain `<canvas>` or inline SVG, no chart library
- [ ] Full-text search over entries (simple substring filter is fine at this scale)
- [ ] AI: weekly journal summary (requires API key)

## Phase 5 — Study & learning
- [ ] Notes: simple markdown-ish notes with folders (store as plain text; a minimal
      hand-rolled renderer for bold/italic/lists is enough, no markdown library needed)
- [ ] Flashcards: deck + card store, spaced repetition (SM-2 style)
- [ ] Review screen with flip animation (CSS transform) and grading buttons
- [ ] Learning goals with progress tracking
- [ ] AI: generate flashcards from a pasted text/note

## Phase 6 — Slide decks & media
- [ ] AI slide outline generator (topic → structured outline)
- [ ] Simple slide viewer (full-screen swipe deck from the outline, plain JS + CSS)
- [ ] Export deck as markdown
- [ ] Media notes: save links/images with tags

## Phase 7 — Platforms & sync (needs user input first — do not start autonomously)
- [ ] Desktop wrapper for Windows/macOS (e.g. Tauri) around the same `web/` files
- [ ] Optional cloud sync backend
