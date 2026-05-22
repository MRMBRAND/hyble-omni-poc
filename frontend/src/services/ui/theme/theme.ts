import { createSystem, defaultConfig } from '@chakra-ui/react';

import { colors } from './colors';

// Map simple color values to Chakra v3 token schema { value: string }
const colorTokens = Object.fromEntries(
  Object.entries(colors).map(([key, value]) => [key, { value }]),
);

export const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: colorTokens,
    },
  },
  globalCss: {
    body: {
      bg: '#E8E8E8',
    },
  },
});
