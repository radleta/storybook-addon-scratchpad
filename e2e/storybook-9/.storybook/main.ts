import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../../shared/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    'storybook-addon-scratchpad',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
