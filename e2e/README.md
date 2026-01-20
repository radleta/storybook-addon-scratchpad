# E2E Testing

This directory contains end-to-end testing environments for testing the addon against multiple Storybook versions.

## Structure

```
e2e/
├── shared/              # Shared test components
│   └── stories/         # Button, Card components and stories
├── storybook-8/         # Storybook 8.x test environment (port 16008)
├── storybook-9/         # Storybook 9.x test environment (port 16009)
└── storybook-10/        # Storybook 10.x test environment (port 16010)
```

## Quick Start

From the **repository root**:

```bash
# 1. Build the addon first
npm run build

# 2. Install dependencies for the version you want to test
npm run e2e:install:8   # or e2e:install:9, e2e:install:10
npm run e2e:install:all # install all versions

# 3. Run Storybook
npm run e2e:8   # or e2e:9, e2e:10
```

## Ports

Each version runs on a different port to allow testing multiple versions simultaneously:

| Version | Default Port | Env Variable |
|---------|--------------|--------------|
| Storybook 8 | 16008 | `STORYBOOK_8_PORT` |
| Storybook 9 | 16009 | `STORYBOOK_9_PORT` |
| Storybook 10 | 16010 | `STORYBOOK_10_PORT` |

### Customizing Ports

To customize ports, copy `.env.example` to `.env` and modify as needed:

```bash
cp .env.example .env
# Edit .env to change ports
```

## How It Works

- Each environment has its own `package.json` with pinned Storybook version
- The addon is linked via `file:../..` (uses local built addon)
- All environments share the same test stories from `shared/stories/`
- The `.storybook/main.ts` in each environment references the shared stories

## Development Workflow

1. Make changes to the addon source in `src/`
2. Run `npm run build` to rebuild the addon
3. Run any e2e environment to test the changes
4. The addon is automatically linked via the `file:` protocol

## Adding New Test Stories

Add new components and stories to `e2e/shared/stories/`. They will automatically be picked up by all Storybook environments.

## Troubleshooting

### "Cannot find module 'storybook-addon-scratchpad'"

Run `npm run build` in the repository root first.

### Changes not reflected

Run `npm run build` again after making changes to the addon source.

### Version mismatch errors

Each environment pins specific Storybook versions. If you see version conflicts, try:

```bash
cd e2e/storybook-X
rm -rf node_modules package-lock.json
npm install
```
