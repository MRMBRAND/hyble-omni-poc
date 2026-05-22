import type { Preview } from '@storybook/react-vite';
import React from 'react';

import { UiProvider } from '../src/services/ui/UiProvider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <UiProvider>
        <Story />
      </UiProvider>
    ),
  ],
};

export default preview;
