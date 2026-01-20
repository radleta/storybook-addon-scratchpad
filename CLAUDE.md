# storybook-addon-scratchpad - Developer Guide for Claude

## CLAUDE.md Documentation Standards

**Critical: Token-Conscious Documentation**

- Be concise and instructional, not exhaustive
- No duplicate content across sections
- Minimal examples, only when essential
- CLAUDE.md is for instructions, not code dumps

**This file is for developers working ON the addon, not users.**

## Project Purpose

**Storybook addon** for jotting quick notes and feedback on stories. Per-story scratchpad with auto-save to localStorage and markdown export. No backend required. Supports Storybook 8/9/10.

## Architecture Quick Reference

**Source files** (`src/`):

- `manager.tsx` - Addon registration entry point (registers panel with Storybook)
- `ScratchpadPanel.tsx` - React component for the panel UI
- `storage.ts` - Pure functions for localStorage persistence and formatting
- `storage.test.ts` - Unit tests for storage module

**Key patterns:**

- **Pure function extraction** - Business logic in `storage.ts` (testable without mocking Storybook)
- **Storybook Manager API** - Uses `useStorybookState` hook for story context
- **Storybook Theming** - Uses `styled` from `storybook/internal/theming` for theme-aware styling

**Build output:**

- `dist/manager.js` - ESM bundle (entry point for Storybook)
- `dist/manager.d.ts` - TypeScript declarations
- `preset.cjs` - CommonJS preset for Storybook addon discovery (must be `.cjs` for Storybook 10 ESM compatibility)

## Development Workflow

**Setup:**

```bash
git clone → npm install → npm run build
```

**Change cycle:**

```bash
# Edit src/ files
npm run validate  # lint + typecheck + test
npm run build     # build bundle
```

**Test in another project:**

```bash
npm link  # in this repo
npm link storybook-addon-scratchpad  # in test project
# Add 'storybook-addon-scratchpad' to .storybook/main.js addons array
```

## Testing Strategy

**Unit tests** (`src/storage.test.ts`) - 21 tests, 100% coverage on storage module

- Tests pure functions only (no Storybook mocking needed)
- Uses Vitest + jsdom for localStorage simulation

**Key commands:**

```bash
npm test           # Run tests once
npm run test:watch # Watch mode
npm run test:coverage # With coverage report
```

**What's tested:**

- `getAllNotes()` / `saveAllNotes()` - localStorage read/write
- `formatNotesForClipboard()` - Markdown export formatting
- `saveNoteForStory()` / `deleteNoteForStory()` - CRUD operations
- Error handling (invalid JSON, empty state)

**What's NOT tested (by design):**

- `ScratchpadPanel` component - Would require mocking Storybook internals
- Addon registration - Tested via manual integration

## Release Workflow

**Pre-release:**

```bash
npm run release:prepare  # validate + build + verify:package + size:check
```

**Release:**

```bash
npm version [patch|minor|major]  # Updates CHANGELOG, creates tag
git push && git push --tags      # Triggers GitHub Actions release
```

**GitHub Actions:**

- `.github/workflows/ci.yml` - Multi-platform testing (Ubuntu/macOS/Windows, Node 20/22)
- `.github/workflows/release.yml` - Automated npm publish on tag push (OIDC provenance)

## E2E Testing

Self-contained test environments for manual testing against multiple Storybook versions.

**Structure:**

```
e2e/
├── shared/stories/     # Shared test components (Button, Card)
├── storybook-8/        # Storybook 8.x environment
├── storybook-9/        # Storybook 9.x environment
└── storybook-10/       # Storybook 10.x environment
```

**Quick start:**

```bash
npm run build           # Build addon first
npm run e2e:install:8   # Install deps for Storybook 8
npm run e2e:8           # Run Storybook 8 on port 16008
```

**Port configuration:** Customize via `.env` (copy from `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `STORYBOOK_8_PORT` | 16008 | Storybook 8 port |
| `STORYBOOK_9_PORT` | 16009 | Storybook 9 port |
| `STORYBOOK_10_PORT` | 16010 | Storybook 10 port |

**PID management:** `scripts/run-storybook.js` handles process lifecycle:
- Saves PID to `.storybook-{version}.pid`
- Kills existing process before restart (uses `taskkill /T` on Windows)
- Running `npm run e2e:8` twice automatically restarts

**Version differences:**
- Storybook 8: Requires `@storybook/addon-essentials` in addons array
- Storybook 9/10: Essential addons built into core (no separate package needed)

## npm Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run dev` | Watch mode (tsup) |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run validate` | lint + typecheck + test |
| `npm run release:prepare` | Full pre-release validation |
| `npm run e2e:8` | Run Storybook 8 (auto-restarts) |
| `npm run e2e:9` | Run Storybook 9 (auto-restarts) |
| `npm run e2e:10` | Run Storybook 10 (auto-restarts) |
| `npm run e2e:install:8` | Install Storybook 8 e2e deps |
| `npm run e2e:install:all` | Install all e2e deps |

## Key Metadata

- **Repo:** github.com/radleta/storybook-addon-scratchpad
- **Package:** `storybook-addon-scratchpad`
- **Author:** Richard Adleta
- **License:** MIT
- **Engines:** Node 18+
- **Peer deps:** React 18/19, Storybook 8/9/10

## Storybook Import Paths

**Important:** Use `storybook/internal/*` paths (not `storybook/*`):

```typescript
// Correct
import { useStorybookState } from 'storybook/internal/manager-api';
import { styled } from 'storybook/internal/theming';

// Wrong (no types)
import { useStorybookState } from 'storybook/manager-api';
```

## Common Issues

- **Build fails with "Cannot find module"** - Check import paths use `storybook/internal/*`
- **Types missing** - Run `npm install` to get storybook types
- **Addon not showing** - Verify added to `addons` array in `.storybook/main.js`
- **localStorage not working in tests** - Ensure vitest environment is `jsdom`
- **Storybook 10 "module is not defined"** - Preset file must be `.cjs` (not `.js`) since package.json has `"type": "module"`

---

**Remember:** This is developer context for building the addon. For usage docs, see README.md.
