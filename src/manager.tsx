import React from 'react';
import { addons, types } from 'storybook/internal/manager-api';
import { ScratchpadPanel } from './ScratchpadPanel';

const ADDON_ID = 'storybook-addon-scratchpad';
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Scratchpad',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => {
      if (!active) return null;
      return React.createElement(ScratchpadPanel);
    },
  });
});
