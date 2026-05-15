import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// Opt-in flag: run Storybook tests only when STORYBOOK_TESTS=true
const enableStorybookTests = process.env.STORYBOOK_TESTS === 'true';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgr()],
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    projects: enableStorybookTests
      ? [
          {
            extends: true,
            plugins: [
              // The plugin will run tests for the stories defined in your Storybook config
              // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
              storybookTest({
                configDir: path.join(dirname, '.storybook'),
              }),
            ],
            test: {
              name: 'storybook',
              browser: {
                enabled: true,
                headless: true,
                provider: 'playwright',
                instances: [
                  {
                    browser: 'chromium',
                  },
                ],
              },
              setupFiles: ['.storybook/vitest.setup.ts'],
            },
          },
        ]
      : undefined,
  },
});
