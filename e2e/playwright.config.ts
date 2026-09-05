import { defineConfig, devices } from '@playwright/test';

// Verification suite for the AI workflow loop. Runs against the frontend
// dev server, driving Chromium via the Chrome DevTools Protocol.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
  // Auto-start the frontend dev server for local verification runs.
  webServer: {
    command: 'npm run dev --workspace frontend',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    cwd: '..',
    timeout: 120_000,
  },
});
