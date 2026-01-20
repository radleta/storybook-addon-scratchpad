import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/manager.tsx'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'storybook'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
