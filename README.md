# storybook-addon-scratchpad

A Storybook addon for jotting quick notes and feedback on stories, with auto-save and markdown export.

## Features

- **Per-story notes** - Each story gets its own scratchpad
- **Auto-save** - Notes save automatically as you type (500ms debounce)
- **localStorage persistence** - No backend required, notes persist in browser
- **Markdown export** - Copy all notes formatted as markdown with one click
- **Storybook theming** - Matches your Storybook theme (light/dark)

## Installation

```bash
npm install storybook-addon-scratchpad
```

## Usage

Add the addon to your `.storybook/main.js` (or `.storybook/main.ts`):

```js
export default {
  addons: [
    // ... other addons
    'storybook-addon-scratchpad',
  ],
};
```

That's it! A "Scratchpad" panel will appear in your Storybook's addon panel.

## How It Works

1. Select any story in Storybook
2. Open the "Scratchpad" panel in the addon panel area
3. Type your notes - they auto-save as you type
4. Navigate to other stories - each has its own notes
5. Click "Copy All" to export all notes as markdown

## Panel Actions

| Action | Description |
|--------|-------------|
| **Clear** | Remove notes for the current story |
| **Clear All** | Remove all notes (with confirmation) |
| **Copy All** | Copy all notes as markdown to clipboard |

## Exported Markdown Format

When you click "Copy All", notes are formatted as:

```markdown
## Storybook Feedback

### components-button--primary
Button looks great but needs hover state

### components-card--default
Consider adding shadow variant
```

## Compatibility

- Storybook 8.x, 9.x, 10.x
- React 18.x, 19.x
- Works with all Storybook frameworks (React, Vue, Angular, Svelte, etc.)

## Use Cases

- **Design reviews** - Jot notes while reviewing component designs
- **QA feedback** - Document issues found during testing
- **Documentation planning** - Track what needs to be documented
- **Team collaboration** - Copy and share feedback via chat/issues

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint

# Type check
npm run typecheck
```

## License

MIT
